import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
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

# Fonction pour convertir les mesures en ml (approximations nécessaires)
def parse_measure(measure):
    try:
        measure = measure.lower()
        if "ml" in measure:
            return float(measure.replace("ml", "").strip())
        elif "shot" in measure:
            return float(measure.replace("shot", "").strip()) * 30  # 1 shot = 30ml
        elif "oz" in measure:
            return float(measure.replace("oz", "").strip()) * 29.5735  # 1 oz = 29.5735ml
        elif "/" in measure:  # Fractions
            return float(eval(measure)) * 30  # Approximation
        else:
            return 0  # Si la mesure n'est pas claire
    except:
        return 0

# Calculer les proportions
for i in range(1, 13):  # Jusqu'à 12 ingrédients/mesures
    cocktails_df[f'parsedMeasure{i}'] = cocktails_df[f'strMeasure{i}'].apply(parse_measure)

# Somme totale des mesures
cocktails_df['total_measure'] = cocktails_df[[f'parsedMeasure{i}' for i in range(1, 13)]].sum(axis=1)

# Proportions des ingrédients
for i in range(1, 13):
    cocktails_df[f'ingredient_proportion{i}'] = cocktails_df[f'parsedMeasure{i}'] / cocktails_df['total_measure']

# Représentation des proportions des ingrédients
ingredient_matrix = cocktails_df[[f'ingredient_proportion{i}' for i in range(1, 13)]].fillna(0).values

# Pondérer la matrice des ingrédients
ingredient_weight = 2.0  # Accorde un poids 2x plus élevé aux ingrédients
ingredient_matrix_weighted = ingredient_matrix * ingredient_weight


tfidf= TfidfVectorizer(stop_words='english')

# Utiliser TfidfVectorizer pour les mots-clés
tfidf_category = tfidf.fit_transform(cocktails_df['strCategory'])
tfidf_alcoholic = tfidf.fit_transform(cocktails_df['strAlcoholic'])
tfidf_glass = tfidf.fit_transform(cocktails_df['strGlass'])

tfidf_category = tfidf_category.astype(np.float32)
tfidf_alcoholic = tfidf_alcoholic.astype(np.float32)
tfidf_glass = tfidf_glass.astype(np.float32)
ingredient_matrix_weighted = ingredient_matrix_weighted.astype(np.float32)

# Concaténer toutes les features
X_combined = np.concatenate([
    tfidf_category.toarray(),
    tfidf_alcoholic.toarray(),
    tfidf_glass.toarray(),
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
model.add(Dense(64, activation='relu'))
model.add(Dense(X_train.shape[1], activation='linear'))
print(X_train.shape[1])
# Compiler le modèle
model.compile(optimizer='adam', loss='mse')  # Utiliser 'mse' car c'est un problème de régression

# Entraîner le modèle
model.fit(X_train, X_train, epochs=30, batch_size=32)

# Obtenir les représentations latentes de films 
representations_latent = model.predict(X_normalized)

# Calculer la similarité cosinus entre les films
similarities = cosine_similarity(representations_latent, representations_latent)

#fonction de recommandation
def get_recommendations(cocktail_id, similarities, df, n):
    idx = df[df['idDrink'] == cocktail_id].index
      
    idx = idx[0]
    scores = list(enumerate(similarities[idx]))
    # Forcer la similarité de l'entrée elle-même à 1.0
    scores[idx] = (idx, 1.0)
    scores = [(i, score) for i, score in scores if df['idDrink'].iloc[i] != cocktail_id]
    scores = sorted(scores, key=lambda x: x[1], reverse=True)
    scores = scores[1:n+1]  
    indices = [i[0] for i in scores]
    return df[['idDrink','strDrink', 'strIngredient1']].iloc[indices]
 
# Le cocktail actif
cocktail_id = 178365 # Gin Tonic
index = cocktails_df[cocktails_df['idDrink'] == cocktail_id].index[0]
recommendations = get_recommendations(cocktail_id, similarities, cocktails_df, 5)

# Afficher le nom et les premiers ingrédients du cocktail actif
print('Le nom :', cocktails_df.loc[index, 'strDrink'])
print('Le premier ingrédient :', cocktails_df.loc[index, 'strIngredient1'])
print('Le deuxieme ingrédient :', cocktails_df.loc[index, 'strIngredient2'])
print(recommendations)
