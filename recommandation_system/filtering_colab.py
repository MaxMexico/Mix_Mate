import json
import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split, cross_validate
from surprise import accuracy
from collections import defaultdict

# Charger le fichier JSON
with open("/Users/victorasencio/Desktop/ESME/INGE_3/Mix_Mate/Sentiment_Analysis/cocktails_with_reviews_updated.json", "r", encoding="utf-8") as file:
    cocktails_data = json.load(file)

# Extraire les avis et structurer les données en DataFrame
reviews = []
user_dict = {}
cocktail_dict = {}

for cocktail in cocktails_data:
    cocktail_id = cocktail["idDrink"]
    cocktail_name = cocktail["strDrink"]
    cocktail_dict[cocktail_id] = cocktail_name
    
    for review in cocktail["reviews"]:
        user_id = review["user_id"]
        user_name = review["user"]
        user_dict[user_id] = user_name
        
        reviews.append({
            "user_id": user_id,
            "user_name": user_name,
            "cocktail_id": cocktail_id,
            "cocktail_name": cocktail_name,
            "rating": review["sentiment_score"]
        })

# Convertir en DataFrame
reviews_df = pd.DataFrame(reviews)

# Vérifier la structure des données
print(reviews_df.head(50))

# Définir le lecteur pour Surprise
reader = Reader(rating_scale=(0, 5))
data = Dataset.load_from_df(reviews_df[["user_id", "cocktail_id", "rating"]], reader)

# Séparer en set d'entraînement et de test
trainset, testset = train_test_split(data, test_size=0.2)

# Entraîner un modèle SVD
model = SVD()
model.fit(trainset)

# Évaluer le modèle
predictions = model.test(testset)
print("RMSE:", accuracy.rmse(predictions))

# Générer des recommandations

def get_top_n(predictions, n=5):
    """Retourne les N meilleurs cocktails recommandés pour chaque utilisateur."""
    top_n = defaultdict(list)
    for uid, iid, true_r, est, _ in predictions:
        top_n[uid].append((iid, est))
    for uid, user_ratings in top_n.items():
        user_ratings.sort(key=lambda x: x[1], reverse=True)
        top_n[uid] = user_ratings[:n]
    return top_n

# Prédire sur tout l’ensemble
full_trainset = data.build_full_trainset()
model.fit(full_trainset)
full_testset = full_trainset.build_testset()
predictions = model.test(full_testset)

# Obtenir les recommandations
top_n = get_top_n(predictions, n=5)

# Fonction pour recommander des cocktails en fonction d'un cocktail préféré
def recommend_from_cocktail(fav_cocktail, n=5):
    """Recommande des cocktails similaires à un cocktail préféré en fonction des notes des utilisateurs."""
    cocktail_id = None
    for cid, cname in cocktail_dict.items():
        if cname.lower() == fav_cocktail.lower():
            cocktail_id = cid
            break
    if not cocktail_id:
        print("Cocktail non trouvé.")
        return
    
    similar_users = set()
    for review in reviews:
        if review["cocktail_id"] == cocktail_id and review["rating"] >= 3:
            similar_users.add(review["user_id"])
    
    recommended_cocktails = defaultdict(float)
    for review in reviews:
        if review["user_id"] in similar_users and review["cocktail_id"] != cocktail_id:
            recommended_cocktails[review["cocktail_id"]] += review["rating"]
    
    sorted_recommendations = sorted(recommended_cocktails.items(), key=lambda x: x[1], reverse=True)[:n]
    print(f"Cocktails recommandés pour les amateurs de {fav_cocktail}:")
    for cid, score in sorted_recommendations:
        print(f"{cocktail_dict[cid]} (Score: {score:.2f})")

# Demande de l'utilisateur
fav_cocktail = input("Ton cocktail préféré : ")
recommend_from_cocktail(fav_cocktail)
