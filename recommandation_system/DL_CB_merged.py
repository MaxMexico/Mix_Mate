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
print(cocktails_df.info())
cocktails_df=cocktails_df[cocktails_df['idDrink'].notnull()] 

cocktails_df.drop(columns=['strDrinkAlternate','strTags','strVideo', 'strDrinkThumb','strImageSource','strImageAttribution','strCreativeCommonsConfirmed','dateModified', 'strIngredient13', 'strIngredient14', 'strIngredient15', 'strMeasure13','strMeasure14', 'strMeasure15'], inplace=True)

cocktails_df['combined_column'] = cocktails_df.apply(lambda row: ' '.join(row.dropna().astype(str)), axis=1)

#### Creation of the TF-IDF matrix
cocktails_df1 = cocktails_df['combined_column'].fillna('')
tfidf=TfidfVectorizer(stop_words='english')
tf_matrice=tfidf.fit_transform(cocktails_df1)

#pas liberer un peu espace : convertir les resultats de Tfidf en float de taille 32
tf_matrice = tf_matrice.astype(np.float32)

########################################### Recommandation System ###########################################

# Normaliser les données entre 0 et 1 
scaler = MinMaxScaler()
X_normalized = scaler.fit_transform(tf_matrice.toarray())

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
model.fit(X_train, X_train, epochs=3, batch_size=32)

# Obtenir les représentations latentes de films 
representations_latent = model.predict(X_normalized)

# Calculer la similarité cosinus entre les films
similarities = cosine_similarity(representations_latent, representations_latent)

#fonction de recommandation
def get_recommendations(cocktail_id, similarities, df, n):
    idx = df[df['idDrink'] == cocktail_id].index
      
    idx = idx[0]
    scores = list(enumerate(similarities[idx]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)
    scores = scores[1:n+1]  
    indices = [i[0] for i in scores]
    return df[['strDrink', 'strIngredient1']].iloc[indices]
 
# Le cocktail actif
cocktail_id = 178365 # Gin Tonic
index = cocktails_df[cocktails_df['idDrink'] == cocktail_id].index[0]
recommendations = get_recommendations(cocktail_id, similarities, cocktails_df, 5)

# Afficher le nom et les premiers ingrédients du cocktail actif
print('Le nom :', cocktails_df.loc[index, 'strDrink'])
print('Le premier ingrédient :', cocktails_df.loc[index, 'strIngredient1'])
print('Le deuxieme ingrédient :', cocktails_df.loc[index, 'strIngredient2'])
print(recommendations)