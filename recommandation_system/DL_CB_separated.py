import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from fractions import Fraction 
from ast import literal_eval
#Exporter les données
cocktails_df = pd.read_csv('../api_cocktails/all_cocktails_with_ratings.csv')

########################################### Data  Preparation ###########################################
def verif_id(x):
    try:
        return int(x)
    except:
        return np.nan
    
cocktails_df['idDrink']=cocktails_df['idDrink'].apply(verif_id)
cocktails_df=cocktails_df[cocktails_df['idDrink'].notnull()] 

cocktails_df.drop(columns=['strDrinkAlternate','strTags','strVideo', 'strDrinkThumb','strImageSource','strImageAttribution','strCreativeCommonsConfirmed','dateModified', 'strIngredient13', 'strIngredient14', 'strIngredient15', 'strMeasure13','strMeasure14', 'strMeasure15'], inplace=True)

####################################### Conversion des mesures en millilitres ########################################
def parse_measure(measure):
    """
    Convertit une chaîne de caractère représentant une mesure en millilitres.
    Gère les unités 'ml', 'shot' (1 shot ≈ 30 ml), 'oz' (1 oz ≈ 29.5735 ml)
    et les fractions de façon sécurisée avec Fraction.
    """
    try:
        measure = measure.lower().strip()
        if measure == "":
            return 0
        if "ml" in measure:
            return float(measure.replace("ml", "").strip())
        elif "shot" in measure:
            num_str = measure.replace("shot", "").strip()
            try:
                if "/" in num_str:
                    return float(Fraction(num_str)) * 30
                else:
                    return float(num_str) * 30
            except:
                return 30  # Valeur par défaut pour un shot
        elif "oz" in measure:
            return float(measure.replace("oz", "").strip()) * 29.5735
        elif "/" in measure:  # Gérer les fractions sans unité claire
            try:
                return float(Fraction(measure)) * 30  # On applique ici un facteur par défaut
            except:
                return 0
        else:
            return 0  # Mesure non identifiable
    except:
        return 0

# Appliquer le parsing sur les mesures (jusqu'à 12 ingrédients/mesures)
for i in range(1, 13):
    col_mesure = f'strMeasure{i}'
    col_parsed = f'parsedMeasure{i}'
    # Remplacer les valeurs manquantes par une chaîne vide
    cocktails_df[col_mesure] = cocktails_df[col_mesure].fillna('')
    cocktails_df[col_parsed] = cocktails_df[col_mesure].apply(parse_measure)

# Calcul de la somme totale des mesures
mesure_cols = [f'parsedMeasure{i}' for i in range(1, 13)]
cocktails_df['total_measure'] = cocktails_df[mesure_cols].sum(axis=1)

# Calcul des proportions en évitant la division par zéro
for i in range(1, 13):
    col_parsed = f'parsedMeasure{i}'
    col_prop = f'ingredient_proportion{i}'
    cocktails_df[col_prop] = cocktails_df.apply(
        lambda row: row[col_parsed] / row['total_measure'] if row['total_measure'] > 0 else 0,
        axis=1
    )

# Représentation des proportions des ingrédients et pondération
ingredient_cols = [f'ingredient_proportion{i}' for i in range(1, 13)]
ingredient_matrix = cocktails_df[ingredient_cols].fillna(0).values
ingredient_weight = 2.0  # Pondération à ajuster selon les résultats
ingredient_matrix_weighted = ingredient_matrix * ingredient_weight

# Représentation des proportions des ingrédients
ingredient_matrix = cocktails_df[[f'ingredient_proportion{i}' for i in range(1, 13)]].fillna(0).values

# Pondérer la matrice des ingrédients
ingredient_weight = 2.0  # Accorde un poids 2x plus élevé aux ingrédients
ingredient_matrix_weighted = ingredient_matrix * ingredient_weight

# Pour la catégorie
vectorizer_category = TfidfVectorizer(stop_words='english')
tfidf_category = vectorizer_category.fit_transform(cocktails_df['strCategory'].fillna(""))

# Pour le type d'alcool
vectorizer_alcoholic = TfidfVectorizer(stop_words='english')
tfidf_alcoholic = vectorizer_alcoholic.fit_transform(cocktails_df['strAlcoholic'].fillna(""))

# Pour le type de verre
vectorizer_glass = TfidfVectorizer(stop_words='english')
tfidf_glass = vectorizer_glass.fit_transform(cocktails_df['strGlass'].fillna(""))

# Nouvelle feature : concaténer les noms des ingrédients (strIngredient1 à strIngredient12)
ingredient_name_cols = [f'strIngredient{i}' for i in range(1, 13)]
cocktails_df['ingredients'] = cocktails_df[ingredient_name_cols].fillna("").apply(lambda row: " ".join(row), axis=1)

vectorizer_ingredients = TfidfVectorizer(stop_words='english')
tfidf_ingredients = vectorizer_ingredients.fit_transform(cocktails_df['ingredients'])

# Conversion en float32 pour uniformiser les types
tfidf_category = tfidf_category.astype(np.float32)
tfidf_alcoholic = tfidf_alcoholic.astype(np.float32)
tfidf_glass = tfidf_glass.astype(np.float32)
tfidf_ingredients = tfidf_ingredients.astype(np.float32)
ingredient_matrix_weighted = ingredient_matrix_weighted.astype(np.float32)

# Concaténer l'ensemble des features
X_combined = np.concatenate([
    tfidf_category.toarray(),
    tfidf_alcoholic.toarray(),
    tfidf_glass.toarray(),
    tfidf_ingredients.toarray(),
    ingredient_matrix_weighted
], axis=1)

#pour libere d'espace
del tfidf_category
del tfidf_alcoholic
del tfidf_glass
del ingredient_matrix_weighted

########################################### Recommandation System ###########################################

# Normaliser les données entre 0 et 1 
scaler = MinMaxScaler()
X_normalized = scaler.fit_transform(X_combined)

# Diviser les données en ensembles d'entrainement et de test
X_train, X_test = train_test_split(X_normalized, test_size=0.2, random_state=42)

# Créer un modèle de recommandation basé sur le contenu
model = Sequential()
model.add(Dense(128, input_shape=(X_train.shape[1],), activation='relu'))
model.add(Dropout(0.2))  # Ajout d'une couche de Dropout pour régulariser le modèle
model.add(Dense(64, activation='relu'))
model.add(Dense(X_train.shape[1], activation='linear'))
print("Nombre de features en entrée :",X_train.shape[1])
# Compiler le modèle
model.compile(optimizer='adam', loss='mse',metrics=['mae'])  # Utiliser 'mse' car c'est un problème de régression

# Entraîner le modèle
h = model.fit(X_train, X_train, epochs=30, batch_size=32, verbose = 0,validation_data=(X_test, X_test))

# Obtenir les représentations latentes de cocktails 
representations_latent = model.predict(X_normalized)

# Calculer la similarité cosinus entre les cocktails
similarities = cosine_similarity(representations_latent, representations_latent)

#fonction de recommandation
def get_recommendations(cocktail_id, similarities, df, n):
    idx = df[df['idDrink'] == cocktail_id].index
      
    idx = idx[0]
    scores = list(enumerate(similarities[idx]))
    # Forcer la similarité de l'entrée elle-même à 1.0
    scores[idx] = (idx, 1.0)
    scores = [(i, score) for i, score in scores if df['idDrink'].iloc[i] != cocktail_id]
    scores = sorted(scores, key=lambda x: x[1], reverse=True)[:n]
    indices = [i for i, _ in scores]
    return df[['idDrink','strDrink', 'strIngredient1']].iloc[indices]
 
# Le cocktail actif
cocktail_id = 178365 # Gin Tonic
index = cocktails_df[cocktails_df['idDrink'] == cocktail_id].index[0]
recommendations = get_recommendations(cocktail_id, similarities, cocktails_df, 5)

# Afficher le nom et les premiers ingrédients du cocktail actif
print('Le nom :', cocktails_df.loc[index, 'strDrink'])
print('Le premier ingrédient :', cocktails_df.loc[index, 'strIngredient1'])
print('Le deuxieme ingrédient :', cocktails_df.loc[index, 'strIngredient2'])
print("Recommandations :")
print(recommendations)

def plot_loss(train_loss, val_loss):
    plt.figure()
    plt.plot(train_loss)
    plt.plot(val_loss)
    plt.title('Loss du modèle')
    plt.ylabel('Loss')
    plt.xlabel('Epoch')
    plt.legend(['Entraînement', 'Validation'], loc='upper right')
    plt.show()

def plot_mae(train_mae, val_mae):
    plt.figure()
    plt.plot(train_mae)
    plt.plot(val_mae)
    plt.title('MAE du modèle')
    plt.ylabel('MAE')
    plt.xlabel('Epoch')
    plt.legend(['Entraînement', 'Validation'], loc='upper left')
    plt.show()

# Tracé des courbes
plot_loss(h.history['loss'], h.history['val_loss'])
plot_mae(h.history['mae'], h.history['val_mae'])
