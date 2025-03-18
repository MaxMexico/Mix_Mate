import os
import joblib
import json
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import load_model
from sklearn.metrics.pairwise import cosine_similarity
from collections import defaultdict

########################################### Data  Preparation for Content Based ###########################################

# Déterminer le chemin du dossier Final_models en fonction du fichier actuel
current_dir = os.path.dirname(os.path.abspath(__file__))
model_dir = os.path.join(current_dir, "Final_models")

# Charger les vectorizers et le scaler
vectorizer_category = joblib.load(os.path.join(model_dir, "vectorizer_category.pkl"))
vectorizer_alcoholic = joblib.load(os.path.join(model_dir, "vectorizer_alcoholic.pkl"))
vectorizer_glass = joblib.load(os.path.join(model_dir, "vectorizer_glass.pkl"))
vectorizer_ingredients = joblib.load(os.path.join(model_dir, "vectorizer_ingredients.pkl"))
scaler = joblib.load(os.path.join(model_dir, "scaler.pkl"))

# Charger le modèle final
final_model = load_model(os.path.join(model_dir, "Content_Based_DL_Model.h5"))

# Charger les représentations latentes
latent_representations = np.load(os.path.join(model_dir, "representations_latentes.npy"))

# Charger la base de données des cocktails (le chemin ici reste relatif par rapport au fichier)
cocktails_df = pd.read_csv(os.path.join(current_dir, "..", "api_cocktails", "all_cocktails_with_ratings.csv"))

# Nettoyage minimal pour permettre la correspondance sur l'ID
def verif_id(x):
    try:
        return int(x)
    except:
        return np.nan

cocktails_df['idDrink'] = cocktails_df['idDrink'].apply(verif_id)
cocktails_df = cocktails_df[cocktails_df['idDrink'].notnull()]

########################################### Data  Preparation for Filtering Collaborative ###########################################

# Déterminer le chemin du dossier Sentiment_Analysis par rapport à final_system_for_app.py
current_dir = os.path.dirname(os.path.abspath(__file__))
sentiment_dir = os.path.join(current_dir, "..", "Sentiment_Analysis")

# Charger le fichier JSON contenant les avis
with open(os.path.join(sentiment_dir, "cocktails_with_reviews_updated.json"), "r", encoding="utf-8") as file:
    cocktails_data = json.load(file)

reviews = []
cocktail_dict = {}
user_dict = {}  # Optionnel, si besoin de connaître les noms d'utilisateurs

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
            "cocktail_id": cocktail_id,
            "rating": review["sentiment_score"]
        })


########################################### Recommandation Content Based ###########################################

def get_CB_recommendations(user_cocktail_names, alcoholic_preference, desired_category, df, latent_reps, top_n):
    """
    Retourne les top_n recommandations sous forme d'une DataFrame,
    en excluant les cocktails déjà aimés par l'utilisateur.
    """
    # 1. Calcul de la représentation utilisateur (moyenne des vecteurs latents des cocktails aimés)
    liked_indices = []
    for cocktail_name in user_cocktail_names:
        idx = df[df['strDrink'].str.lower() == cocktail_name.lower()].index
        if len(idx) > 0:
            liked_indices.append(idx[0])
    if not liked_indices:
        print("Aucun cocktail aimé trouvé pour l'utilisateur.")
        return None
    user_rep = np.mean(latent_reps[liked_indices], axis=0, keepdims=True)
    
    # 2. Filtrage des candidats selon la préférence alcoolisée
    pref = alcoholic_preference.lower().strip()
    if pref:  # Si une préférence est définie (non vide)
        mask_alcoholic = df['strAlcoholic'].str.lower().str.strip() == pref
    else:
        mask_alcoholic = pd.Series(True, index=df.index)  # Pas de filtre sur alcool


    # Filtrer sur la catégorie désirée si elle est spécifiée
    if desired_category:
        if isinstance(desired_category, list):
            desired_category_lower = [cat.lower().strip() for cat in desired_category]
            mask_category = df['strCategory'].str.lower().str.strip().isin(desired_category_lower)
        else:
            cat = desired_category.lower().strip()
            mask_category = df['strCategory'].str.lower().str.strip() == cat
        mask = mask_alcoholic & mask_category
    else:
        mask = mask_alcoholic
    
    candidate_df = df[mask].copy()
    if candidate_df.empty:
        print(f"Aucun cocktail correspondant aux critères '{alcoholic_preference}' et '{desired_category}'.")
        return None
    
    candidate_indices = candidate_df.index.tolist()
    candidate_latent = latent_reps[candidate_indices]
    
    # 3. Calcul de la similarité cosinus
    sim_scores = cosine_similarity(user_rep, candidate_latent).flatten()
    
    # Exclure les cocktails déjà aimés
    for i, idx in enumerate(candidate_indices):
        if idx in liked_indices:
            sim_scores[i] = -1  # score très bas
    
    # 4. Sélection des top_n recommandations
    sorted_indices = np.argsort(-sim_scores)
    recommended_candidate_indices = [candidate_indices[i] for i in sorted_indices[:top_n]]
    recommended_scores = [sim_scores[i] for i in sorted_indices[:top_n]]
    recommandation_CB = df.loc[recommended_candidate_indices, ['strDrink']].copy()
    recommandation_CB['confidence'] = [f"{score*100:.2f}%" for score in recommended_scores]
    return recommandation_CB


########################################### Recommandation Filtrage Collaboratif ###########################################
def get_FC_recommendations(user_liked_cocktails, alcoholic_preference, desired_category, df, top_n):
    """
    Retourne les top_n recommandations collaboratives sous forme d'une DataFrame,
    en excluant les cocktails déjà aimés par l'utilisateur.
    """
    # Filtrer selon la préférence alcoolisée, seulement si la valeur n'est pas vide
    pref = alcoholic_preference.lower().strip()
    if pref:
        mask_alcoholic = df['strAlcoholic'].str.lower().str.strip() == pref
    else:
        mask_alcoholic = pd.Series(True, index=df.index)
    
    # Filtrer sur la catégorie désirée si spécifiée
    if desired_category:
        if isinstance(desired_category, list):
            desired_category_lower = [cat.lower().strip() for cat in desired_category]
            mask_category = df['strCategory'].str.lower().str.strip().isin(desired_category_lower)
        else:
            mask_category = df['strCategory'].str.lower().str.strip() == desired_category.lower().strip()
        mask = mask_alcoholic & mask_category
    else:
        mask = mask_alcoholic

    candidate_df = df[mask].copy()
    if candidate_df.empty:
        print(f"Aucun cocktail correspondant aux critères '{alcoholic_preference}' et '{desired_category}'.")
        return None

    # Exclure les cocktails déjà aimés
    liked_lower = [x.lower() for x in user_liked_cocktails]
    candidate_df = candidate_df[~candidate_df['strDrink'].str.lower().isin(liked_lower)]
    if candidate_df.empty:
        print("Tous les cocktails correspondant aux critères sont déjà aimés par l'utilisateur.")
        return None

    # Construire l'ensemble des utilisateurs similaires à partir des cocktails aimés
    similar_users = set()
    liked_lower_set = set(liked_lower)
    for review in reviews:
        cocktail_name = cocktail_dict.get(review["cocktail_id"], "").lower()
        if review["rating"] >= 3 and cocktail_name in liked_lower_set:
            similar_users.add(review["user_id"])
    if not similar_users:
        print("Aucun utilisateur similaire trouvé pour les cocktails aimés.")
        return None

    # Cumuler les notes des utilisateurs similaires pour chaque cocktail candidat
    candidate_names = set(candidate_df['strDrink'].str.lower().values)
    recommended_cocktails = defaultdict(float)
    for review in reviews:
        if review["user_id"] in similar_users:
            cocktail_name = cocktail_dict.get(review["cocktail_id"])
            if cocktail_name and cocktail_name.lower() in candidate_names:
                recommended_cocktails[cocktail_name] += review["rating"]
    if not recommended_cocktails:
        print("Aucune recommandation trouvée.")
        return None

    # Trier et sélectionner les top_n
    sorted_recommendations = sorted(recommended_cocktails.items(), key=lambda x: x[1], reverse=True)[:top_n]
    
    max_possible_score = len(similar_users) * 5

    results = []
    for cname, score in sorted_recommendations:
         percentage = min((score / max_possible_score) * 100, 100)
         results.append((cname, f"{percentage:.2f}%"))
    
    recommendation_FC = pd.DataFrame(results, columns=['strDrink', 'confidence'])
    return recommendation_FC

########################################### Exemple d'utilisation ###########################################

# # Supposons que l'utilisateur a aimé les cocktails d'ID 12754 et 178365
# user_liked_cocktails = ["Cuba Libre"]

# # L'API renvoie par exemple "Non Alcoholic"
# alcoholic_preference = "Non Alcoholic"

# # Critère sur la catégorie désirée (par exemple, "Shot")
# desired_category = None

# # Nombre de cocktails à recommander 
# top_n = 5

# # Obtenir les recommandations (top 5)
# reco_df = get_FC_recommendations(user_liked_cocktails,alcoholic_preference, desired_category, cocktails_df, top_n)

# print("Recommandations pour l'utilisateur:")
# print(reco_df)
