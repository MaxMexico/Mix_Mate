import pandas as pd
import numpy as np
import tensorflow as tf
import random
import matplotlib.pyplot as plt
import joblib
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from scikeras.wrappers import KerasRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error
from fractions import Fraction 
from ast import literal_eval

########################################### Data  Preparation ###########################################
#Exporter les données
cocktails_df = pd.read_csv('../api_cocktails/all_cocktails_with_ratings.csv')

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

# Représentation des proportions des ingrédients
ingredient_matrix = cocktails_df[[f'ingredient_proportion{i}' for i in range(1, 13)]].fillna(0).values

# Pour la catégorie
vectorizer_category = TfidfVectorizer(stop_words='english')
tfidf_category = vectorizer_category.fit_transform(cocktails_df['strCategory'].fillna(""))

# Pour le type d'alcool
vectorizer_alcoholic = TfidfVectorizer(stop_words='english')
tfidf_alcoholic = vectorizer_alcoholic.fit_transform(cocktails_df['strAlcoholic'].fillna(""))

# Pour le type de verre
vectorizer_glass = TfidfVectorizer(stop_words='english')
tfidf_glass = vectorizer_glass.fit_transform(cocktails_df['strGlass'].fillna(""))

# Concaténer les noms des ingrédients (strIngredient1 à strIngredient12)
ingredient_name_cols = [f'strIngredient{i}' for i in range(1, 13)]
cocktails_df['ingredients'] = cocktails_df[ingredient_name_cols].fillna("").apply(lambda row: " ".join(row), axis=1)
vectorizer_ingredients = TfidfVectorizer(stop_words='english')
tfidf_ingredients = vectorizer_ingredients.fit_transform(cocktails_df['ingredients'])

# Conversion en float32 pour uniformiser les types
tfidf_category = tfidf_category.astype(np.float32)
tfidf_alcoholic = tfidf_alcoholic.astype(np.float32)
tfidf_glass = tfidf_glass.astype(np.float32)
tfidf_ingredients = tfidf_ingredients.astype(np.float32)

# Sauvegarder les vectorizers
joblib.dump(vectorizer_category, "Final_models/vectorizer_category.pkl")
joblib.dump(vectorizer_alcoholic, "Final_models/vectorizer_alcoholic.pkl")
joblib.dump(vectorizer_glass, "Final_models/vectorizer_glass.pkl")
joblib.dump(vectorizer_ingredients, "Final_models/vectorizer_ingredients.pkl")


####################################### Recherche de la Meilleure Pondération ########################################
# Liste des pondérations candidates à tester
candidate_weights = [1.0, 1.5, 2.0, 2.5, 3.0]
results = {}
n_repeats = 5  # Nombre de répétitions par candidate

# Fixer les seeds globaux pour la reproductibilité
random.seed(42)
np.random.seed(42)
tf.random.set_seed(42)

for weight in candidate_weights:
    val_losses = []
    for r in range(n_repeats):
        # Pour chaque répétition, ajuster la seed (pour simuler de légères variations tout en restant reproductible)
        np.random.seed(42 + r)
        tf.random.set_seed(42 + r)
        
        # Appliquer la pondération
        ingredient_matrix_weighted = ingredient_matrix * weight
        ingredient_matrix_weighted = ingredient_matrix_weighted.astype(np.float32)
        
        # Concaténer l'ensemble des features
        X_combined = np.concatenate([
            tfidf_category.toarray(),
            tfidf_alcoholic.toarray(),
            tfidf_glass.toarray(),
            tfidf_ingredients.toarray(),
            ingredient_matrix_weighted
        ], axis=1)
        
        # Normaliser les données
        scaler = MinMaxScaler()
        X_normalized = scaler.fit_transform(X_combined)
        
        # Diviser en ensemble d'entraînement et de validation
        X_train, X_val = train_test_split(X_normalized, test_size=0.2, random_state=42)
        
        # Construire l'autoencodeur
        model = Sequential()
        model.add(Dense(128, input_shape=(X_train.shape[1],), activation='relu'))
        model.add(Dropout(0.2))
        model.add(Dense(64, activation='relu'))
        model.add(Dense(X_train.shape[1], activation='linear'))
        model.compile(optimizer='adam', loss='mse', metrics=['mae'])
        
        # Entraîner le modèle
        history = model.fit(X_train, X_train, epochs=30, batch_size=32, verbose=0, validation_data=(X_val, X_val))
        
        # Enregistrer la perte de validation finale
        final_val_loss = history.history['val_loss'][-1]
        val_losses.append(final_val_loss)
    
    avg_val_loss = np.mean(val_losses)
    results[weight] = avg_val_loss
    
best_weight = min(results, key=results.get)
print("Meilleure pondération des ingrédients selon la validation:", best_weight)

########################################### Recommandation System ###########################################
# Recalculer la matrice pondérée avec la meilleure pondération
ingredient_matrix_weighted = ingredient_matrix * best_weight
ingredient_matrix_weighted = ingredient_matrix_weighted.astype(np.float32)

# Concaténer l'ensemble des features avec la pondération optimale
X_combined = np.concatenate([
    tfidf_category.toarray(),
    tfidf_alcoholic.toarray(),
    tfidf_glass.toarray(),
    tfidf_ingredients.toarray(),
    ingredient_matrix_weighted
], axis=1)

# Pour liberer de l'espace
del tfidf_category
del tfidf_alcoholic
del tfidf_glass
del ingredient_matrix_weighted

# Normaliser les données entre 0 et 1 
scaler = MinMaxScaler()
X_normalized = scaler.fit_transform(X_combined)

# Sauvegarder le scaler
joblib.dump(scaler, "Final_models/scaler.pkl")

# Diviser les données en ensembles d'entrainement et de test
X_train, X_test = train_test_split(X_normalized, test_size=0.2, random_state=42)

####################################### Hyperparameter Tuning avec GridSearchCV ########################################
# Fonction de construction du modèle
def build_autoencoder(units1=128, units2=64, dropout_rate=0.2):
    input_dim = X_train.shape[1]
    model = Sequential()
    model.add(Dense(units1, input_shape=(input_dim,), activation='relu'))
    model.add(Dropout(dropout_rate))
    model.add(Dense(units2, activation='relu'))
    model.add(Dense(input_dim, activation='linear'))
    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    return model  

# Encapsulation et complitation du modèle avec KerasRegressor
model_reg = KerasRegressor(
    model=build_autoencoder,
    verbose=0
)

# Définition des hyperparamètres à tester
param_dist = {
    'model__units1': [64, 128, 256],
    'model__units2': [32, 64, 128],
    'model__dropout_rate': [0.1, 0.2, 0.3],
    'epochs': [20, 30],
    'batch_size': [16, 32, 64]
}


# Utiliser RandomizedSearchCV pour rechercher les meilleurs hyperparamètres
random_search = RandomizedSearchCV(estimator=model_reg, 
                                   param_distributions=param_dist, 
                                   n_iter=10, 
                                   cv=3, 
                                   scoring='neg_mean_squared_error', 
                                   random_state=42, 
                                   verbose=1)
# Dans notre cas, le problème est de reconstruction (autoencodeur), donc X_train est à la fois les entrées et les cibles.
random_search.fit(X_train, X_train)

print("Meilleurs hyperparamètres trouvés:", random_search.best_params_)
print("Meilleur score (MSE négatif):", random_search.best_score_)

# Entraîner le modèle final avec les meilleurs hyperparamètres
best_params = random_search.best_params_
final_model = build_autoencoder(units1=best_params['model__units1'], 
                                units2=best_params['model__units2'], 
                                dropout_rate=best_params['model__dropout_rate'])
final_history = final_model.fit(X_train, X_train, 
                                epochs=best_params['epochs'], 
                                batch_size=best_params['batch_size'], 
                                verbose=0, 
                                validation_data=(X_test, X_test))

# Obtenir les représentations latentes de cocktails 
representations_latent = final_model.predict(X_normalized)

# Enregistrement des représentations latentes 
np.save("Final_models/representations_latentes.npy", representations_latent)

# Calculer la similarité cosinus entre les cocktails
similarities = cosine_similarity(representations_latent, representations_latent)

# Évaluation du modèle
y_pred = final_model.predict(X_test)
mse = mean_squared_error(X_test, y_pred)
mae = mean_absolute_error(X_test, y_pred)
rmse = np.sqrt(mse)
print(f"Performance du modèle - MSE: {mse}, RMSE: {rmse}, MAE: {mae}")

# Sauvegarder le modèle pour éviter de le réentrainer à chaque fois 
final_model.save("Final_models/Content_Based_DL_Model.h5")


# Fonction de recommandation
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
cocktail_id =  12754 # Sex on the beach
# Gin Tonic (178365)
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
    plt.title('Loss du modèle separated')
    plt.ylabel('Loss')
    plt.xlabel('Epoch')
    plt.legend(['Entraînement', 'Validation'], loc='upper right')
    plt.show()

def plot_mae(train_mae, val_mae):
    plt.figure()
    plt.plot(train_mae)
    plt.plot(val_mae)
    plt.title('MAE du modèle separated')
    plt.ylabel('MAE')
    plt.xlabel('Epoch')
    plt.legend(['Entraînement', 'Validation'], loc='upper left')
    plt.show()

# Tracé des courbes
plot_loss(final_history.history['loss'], final_history.history['val_loss'])
plot_mae(final_history.history['mae'], final_history.history['val_mae'])
