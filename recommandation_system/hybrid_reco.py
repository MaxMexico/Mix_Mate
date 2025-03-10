import json
import pandas as pd
import numpy as np
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from surprise import accuracy
from collections import defaultdict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from sklearn.metrics import mean_squared_error, mean_absolute_error

# Charger les données JSON pour le filtrage collaboratif
with open("./Sentiment_Analysis/cocktails_with_reviews_updated.json", "r", encoding="utf-8") as file:
    cocktails_data = json.load(file)

# Extraire les avis
reviews = []
cocktail_dict = {}

for cocktail in cocktails_data:
    cocktail_id = cocktail["idDrink"]
    cocktail_name = cocktail["strDrink"]
    cocktail_dict[cocktail_id] = cocktail_name
    
    for review in cocktail["reviews"]:
        user_id = review["user_id"]
        reviews.append({
            "user_id": user_id,
            "cocktail_id": cocktail_id,
            "rating": review["sentiment_score"]
        })

# Convertir en DataFrame
reviews_df = pd.DataFrame(reviews)

# Configurer Surprise
reader = Reader(rating_scale=(0, 5))
data = Dataset.load_from_df(reviews_df[["user_id", "cocktail_id", "rating"]], reader)
full_trainset = data.build_full_trainset()
model_cf = SVD()
model_cf.fit(full_trainset)

# Charger les données pour le modèle DL + CB
cocktails_df = pd.read_csv('./api_cocktails/all_cocktails_with_ratings.csv')
cocktails_df.drop(columns=['strDrinkAlternate','strTags','strVideo', 'strDrinkThumb','strImageSource','strImageAttribution','strCreativeCommonsConfirmed','dateModified', 'strIngredient13', 'strIngredient14', 'strIngredient15', 'strMeasure13','strMeasure14', 'strMeasure15'], inplace=True)
cocktails_df['combined_column'] = cocktails_df.apply(lambda row: ' '.join(row.dropna().astype(str)), axis=1)

# TF-IDF
vectorizer = TfidfVectorizer(stop_words='english')
tf_matrice = vectorizer.fit_transform(cocktails_df['combined_column'].fillna(''))

# Normalisation et entrainement du modèle
scaler = MinMaxScaler()
X_normalized = scaler.fit_transform(tf_matrice.toarray())
from sklearn.model_selection import train_test_split as sk_train_test_split
from surprise.model_selection import train_test_split as sp_train_test_split

# Division correcte pour le modèle basé sur le contenu (Scikit-learn)
X_train, X_test = sk_train_test_split(X_normalized, test_size=0.2, random_state=42)

# Division correcte pour le filtrage collaboratif (Surprise)
trainset, testset = sp_train_test_split(data, test_size=0.2)


model_dl = Sequential()
model_dl.add(Dense(128, input_shape=(X_train.shape[1],), activation='relu'))
model_dl.add(Dense(64, activation='relu'))
model_dl.add(Dense(X_train.shape[1], activation='linear'))
model_dl.compile(optimizer='adam', loss='mse')
model_dl.fit(X_train, X_train, epochs=3, batch_size=32)

# Obtenir les représentations latentes et calculer la similarité cosinus
representations_latent = model_dl.predict(X_normalized)
similarities = cosine_similarity(representations_latent, representations_latent)

# Fonction de recommandation hybride
def hybrid_recommendation(cocktail_name, num_reco=5):
    if cocktail_name not in cocktails_df['strDrink'].values:
        print("Cocktail non trouvé.")
        return None
    
    idx = cocktails_df[cocktails_df['strDrink'] == cocktail_name].index[0]
    scores_cb = sorted(list(enumerate(similarities[idx])), key=lambda x: x[1], reverse=True)[1:num_reco+1]
    reco_cb = [{"idDrink": cocktails_df.iloc[i[0]]['idDrink'], "strDrink": cocktails_df.iloc[i[0]]['strDrink'], "score": i[1]} for i in scores_cb]
    
    predictions_cf = [model_cf.predict(str(user), str(idx)).est for user in reviews_df['user_id'].unique()]
    cocktail_ratings = {cid: 0 for cid in cocktail_dict.keys()}
    for cid, rating in zip(reviews_df['cocktail_id'], predictions_cf):
        cocktail_ratings[cid] += rating
    sorted_cf = sorted(cocktail_ratings.items(), key=lambda x: x[1], reverse=True)[:num_reco]
    reco_cf = [{"idDrink": cid, "strDrink": cocktail_dict[cid], "score": score} for cid, score in sorted_cf]
    
    return {"Content-Based": reco_cb, "Collaborative Filtering": reco_cf}

# Demande utilisateur
cocktail_name = input("Entrez le nom d'un cocktail: ")
num_reco = int(input("Entrez le nombre de recommandations souhaitées (1-10): "))
num_reco = max(1, min(num_reco, 10))
recommendations = hybrid_recommendation(cocktail_name, num_reco)
print(recommendations)