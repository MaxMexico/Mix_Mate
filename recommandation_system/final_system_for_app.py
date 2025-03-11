import joblib
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import load_model
from sklearn.metrics.pairwise import cosine_similarity

# --- Chargement des objets sauvegardés ---

# Charger les vectorizers et le scaler
vectorizer_category   = joblib.load("CB_model/vectorizer_category.pkl")
vectorizer_alcoholic  = joblib.load("CB_model/vectorizer_alcoholic.pkl")
vectorizer_glass      = joblib.load("CB_model/vectorizer_glass.pkl")
vectorizer_ingredients = joblib.load("CB_model/vectorizer_ingredients.pkl")
scaler                = joblib.load("CB_model/scaler.pkl")

# Charger le modèle final (par exemple, sauvegardé en format HDF5 ou SavedModel)
final_model = load_model("CB_model/Content_Based_DL_Model.h5")

# Charger les représentations latentes pré-calculées (par exemple, sous forme de fichier NumPy)
latent_representations = np.load("CB_model/representations_latentes.npy")

# Charger la base de données des cocktails (assurez-vous qu'elle est identique à celle utilisée pour l'entraînement)
cocktails_df = pd.read_csv('../api_cocktails/all_cocktails_with_ratings.csv')

# Nettoyage minimal pour permettre la correspondance sur l'ID (si ce n'est pas déjà fait)
def verif_id(x):
    try:
        return int(x)
    except:
        return np.nan

cocktails_df['idDrink'] = cocktails_df['idDrink'].apply(verif_id)
cocktails_df = cocktails_df[cocktails_df['idDrink'].notnull()]

# Optionnel : vous pouvez aussi conserver les colonnes nécessaires pour l'affichage
# (par exemple, 'strDrink', 'strIngredient1', etc.)

# --- Fonctions pour générer des recommandations ---

def get_user_representation_from_ids(user_cocktail_ids, df, latent_reps):
    """
    À partir d'une liste d'IDs de cocktails aimés par l'utilisateur,
    récupère leurs indices dans la DataFrame et calcule la représentation latente moyenne.
    """
    indices = []
    for cid in user_cocktail_ids:
        idx = df[df['idDrink'] == cid].index
        if len(idx) > 0:
            indices.append(idx[0])
    if not indices:
        return None
    # Calculer la moyenne des vecteurs latents pour les cocktails aimés
    user_rep = np.mean(latent_reps[indices], axis=0, keepdims=True)
    return user_rep

def get_recommendations_for_user(user_cocktail_ids, df, latent_reps, top_n=5):
    """
    Retourne les top_n recommandations sous forme d'une DataFrame,
    en excluant les cocktails déjà aimés par l'utilisateur.
    """
    user_rep = get_user_representation_from_ids(user_cocktail_ids, df, latent_reps)
    if user_rep is None:
        print("Aucun cocktail trouvé pour l'utilisateur.")
        return None
    
    # Calculer la similarité cosinus entre le vecteur utilisateur et tous les cocktails
    sim_scores = cosine_similarity(user_rep, latent_reps).flatten()
    
    # Obtenir les indices des cocktails déjà aimés
    liked_indices = []
    for cid in user_cocktail_ids:
        idx = df[df['idDrink'] == cid].index
        if len(idx) > 0:
            liked_indices.append(idx[0])
    
    # Trier tous les indices par similarité décroissante
    sorted_indices = np.argsort(-sim_scores)
    
    recommendations = []
    for idx in sorted_indices:
        # Ignorer les cocktails déjà aimés
        if idx in liked_indices:
            continue
        recommendations.append(idx)
        if len(recommendations) == top_n:
            break
    
    # Retourner une sélection de la DataFrame avec des informations utiles
    return df.iloc[recommendations][['idDrink', 'strDrink', 'strIngredient1']]

# --- Exemple d'utilisation ---

# Supposons que l'utilisateur a aimé les cocktails d'ID 12754 et 178365
user_liked_ids = [12754, 178365]

# Obtenir les recommandations (top 5)
reco_df = get_recommendations_for_user(user_liked_ids, cocktails_df, latent_representations, top_n=5)

print("Recommandations pour l'utilisateur:")
print(reco_df)
