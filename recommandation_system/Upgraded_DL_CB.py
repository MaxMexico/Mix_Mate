import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from sklearn.metrics import mean_squared_error, mean_absolute_error

# Exporter les données
cocktails_df = pd.read_csv('./api_cocktails/all_cocktails_with_ratings.csv')

########################################### Data Preparation ###########################################
def verif_id(x):
    try:
        return int(x)
    except:
        return np.nan
cocktails_df['idDrink'] = cocktails_df['idDrink'].apply(verif_id)
cocktails_df = cocktails_df[cocktails_df['idDrink'].notnull()]

cocktails_df.drop(columns=['strDrinkAlternate','strTags','strVideo', 'strDrinkThumb','strImageSource','strImageAttribution','strCreativeCommonsConfirmed','dateModified', 'strIngredient13', 'strIngredient14', 'strIngredient15', 'strMeasure13','strMeasure14', 'strMeasure15'], inplace=True)

cocktails_df['combined_column'] = cocktails_df.apply(lambda row: ' '.join(row.dropna().astype(str)), axis=1)

# Création de la matrice TF-IDF
tfidf = TfidfVectorizer(stop_words='english')
tf_matrice = tfidf.fit_transform(cocktails_df['combined_column'].fillna(''))
tf_matrice = tf_matrice.astype(np.float32)

# Normaliser les données
scaler = MinMaxScaler()
X_normalized = scaler.fit_transform(tf_matrice.toarray())

# Diviser les données en ensembles d'entraînement et de test
X_train, X_test = train_test_split(X_normalized, test_size=0.2, random_state=42)

# Créer un modèle de recommandation basé sur le contenu
model = Sequential()
model.add(Dense(128, input_shape=(X_train.shape[1],), activation='relu'))
model.add(Dense(64, activation='relu'))
model.add(Dense(X_train.shape[1], activation='linear'))

# Compiler le modèle
model.compile(optimizer='adam', loss='mse')

# Entraîner le modèle
model.fit(X_train, X_train, epochs=3, batch_size=32)

# Obtenir les représentations latentes des cocktails
representations_latent = model.predict(X_normalized)

# Calculer la similarité cosinus entre les cocktails
similarities = cosine_similarity(representations_latent, representations_latent)

# Évaluation du modèle
y_pred = model.predict(X_test)
mse = mean_squared_error(X_test, y_pred)
mae = mean_absolute_error(X_test, y_pred)
rmse = np.sqrt(mse)
print(f"Performance du modèle - MSE: {mse}, RMSE: {rmse}, MAE: {mae}")

# Fonction de recommandation basée sur le nom du cocktail
def get_recommendations(cocktail_name, similarities, df, n):
    if cocktail_name not in df['strDrink'].values:
        print("Cocktail non trouvé dans la base de données.")
        return None
    idx = df[df['strDrink'] == cocktail_name].index[0]
    scores = list(enumerate(similarities[idx]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)[1:n+1]
    indices = [i[0] for i in scores]
    return df[['strDrink', 'strIngredient1']].iloc[indices]

# Demander à l'utilisateur de saisir un cocktail
user_input = input("Entrez le nom d'un cocktail: ")
recommendations = get_recommendations(user_input, similarities, cocktails_df, 5)

if recommendations is not None:
    print("Recommandations pour", user_input, ":")
    print(recommendations)
