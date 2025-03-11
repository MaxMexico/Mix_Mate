import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from sklearn.metrics import mean_squared_error, mean_absolute_error
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
model.add(Dropout(0.2))  # Ajout d'une couche de Dropout pour régulariser le modèle
model.add(Dense(64, activation='relu'))
model.add(Dense(X_train.shape[1], activation='linear'))

# Compiler le modèle
model.compile(optimizer='adam', loss='mse', metrics=['mae'])  # Utiliser 'mse' car c'est un problème de régression

# Entraîner le modèle
h = model.fit(X_train, X_train, epochs=30, batch_size=32, verbose = 0, validation_data=(X_test, X_test))

# Obtenir les représentations latentes de films 
representations_latent = model.predict(X_normalized)

# Calculer la similarité cosinus entre les films
similarities = cosine_similarity(representations_latent, representations_latent)

# Évaluation du modèle
y_pred = model.predict(X_test)
mse = mean_squared_error(X_test, y_pred)
mae = mean_absolute_error(X_test, y_pred)
rmse = np.sqrt(mse)
print(f"Performance du modèle - MSE: {mse}, RMSE: {rmse}, MAE: {mae}")

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
cocktail_id =  12754 # Sex on the beach
# Gin Tonic (178365)
index = cocktails_df[cocktails_df['idDrink'] == cocktail_id].index[0]
recommendations = get_recommendations(cocktail_id, similarities, cocktails_df, 5)

# Afficher le nom et les premiers ingrédients du cocktail actif
print('Le nom :', cocktails_df.loc[index, 'strDrink'])
print('Le premier ingrédient :', cocktails_df.loc[index, 'strIngredient1'])
print('Le deuxieme ingrédient :', cocktails_df.loc[index, 'strIngredient2'])
print(recommendations)

def plot_loss(train_loss, val_loss):
    plt.figure()
    plt.plot(train_loss)
    plt.plot(val_loss)
    plt.title('Loss du modèle merged')
    plt.ylabel('Loss')
    plt.xlabel('Epoch')
    plt.legend(['Entraînement', 'Validation'], loc='upper right')
    plt.show()

def plot_mae(train_mae, val_mae):
    plt.figure()
    plt.plot(train_mae)
    plt.plot(val_mae)
    plt.title('MAE du modèle merged')
    plt.ylabel('MAE')
    plt.xlabel('Epoch')
    plt.legend(['Entraînement', 'Validation'], loc='upper left')
    plt.show()

# Tracé des courbes
plot_loss(h.history['loss'], h.history['val_loss'])
plot_mae(h.history['mae'], h.history['val_mae'])