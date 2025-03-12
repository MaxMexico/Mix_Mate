import os
import joblib
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import load_model
from sklearn.metrics.pairwise import cosine_similarity

########################################### Data  Preparation ###########################################

# Déterminer le chemin du dossier CB_model en fonction du fichier actuel
current_dir = os.path.dirname(os.path.abspath(__file__))
model_dir = os.path.join(current_dir, "CB_model")

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


########################################### Recommandation System ###########################################

def get_recommendations_for_user(user_cocktail_ids, alcoholic_preference, desired_category, df, latent_reps, top_n):
    """
    Retourne les top_n recommandations sous forme d'une DataFrame,
    en excluant les cocktails déjà aimés par l'utilisateur.
    """
    # 1. Calcul de la représentation utilisateur (moyenne des vecteurs latents des cocktails aimés)
    liked_indices = []
    for cid in user_cocktail_ids:
        idx = df[df['idDrink'] == cid].index
        if len(idx) > 0:
            liked_indices.append(idx[0])
    if not liked_indices:
        print("Aucun cocktail aimé trouvé pour l'utilisateur.")
        return None
    user_rep = np.mean(latent_reps[liked_indices], axis=0, keepdims=True)
    
    # 2. Filtrage des candidats selon la préférence alcoolisée
    pref = alcoholic_preference.lower().strip()
    mask_alcoholic = df['strAlcoholic'].str.lower().str.strip() == pref
    
    # Si une catégorie désirée est spécifiée, filtrer aussi par 'strCategory'
    if desired_category is not None:
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
    
    # 3. Calcul de la similarité cosinus entre le vecteur utilisateur et les vecteurs candidats
    sim_scores = cosine_similarity(user_rep, candidate_latent).flatten()
    
    # Exclure les cocktails déjà aimés (même s'ils respectent les critères)
    for i, idx in enumerate(candidate_indices):
        if idx in liked_indices:
            sim_scores[i] = -1  # Score très bas pour les candidats déjà aimés
    
    # 4. Trier les candidats par similarité décroissante et sélectionner les top_n
    sorted_indices = np.argsort(-sim_scores)
    recommended_candidate_indices = [candidate_indices[i] for i in sorted_indices[:top_n]]
    
    return df.loc[recommended_candidate_indices, ['idDrink', 'strDrink', 'strIngredient1']]

########################################### Exemple d'utilisation ###########################################
"""
# Supposons que l'utilisateur a aimé les cocktails d'ID 12754 et 178365
user_liked_ids = [12754, 178365]

# L'API renvoie par exemple "Non Alcoholic"
alcoholic_preference = "Alcoholic"

# Critère sur la catégorie désirée (par exemple, "Shot")
desired_category = None

# Nombre de cocktails à recommander 
top_n = 5

# Obtenir les recommandations (top 5)
reco_df = get_recommendations_for_user(user_liked_ids,alcoholic_preference, desired_category, cocktails_df, latent_representations, top_n)

print("Recommandations pour l'utilisateur:")
print(reco_df)
"""