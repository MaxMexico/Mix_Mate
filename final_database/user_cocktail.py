import pandas as pd
import json

# Charger le fichier JSON contenant les cocktails et les reviews
with open("./final_database/final_data_base.json", "r", encoding="utf-8") as f:
    cocktails_data = json.load(f)

# Initialiser une liste pour stocker les avis (user_id, idDrink, sentiment_score)
ratings_list = []

# Extraire les avis des utilisateurs
for cocktail in cocktails_data:
    cocktail_id = cocktail["idDrink"]  # ID du cocktail
    for review in cocktail.get("reviews", []):  # Vérifier s'il y a des avis
        user_id = review["user_id"]  # ID de l'utilisateur
        score = review["sentiment_score"]  # Note attribuée
        ratings_list.append((user_id, cocktail_id, score))

# Convertir en DataFrame
df_ratings = pd.DataFrame(ratings_list, columns=["user_id", "idDrink", "sentiment_score"])

# 🛠 Résoudre l'erreur de duplication en prenant la moyenne des notes par utilisateur-cocktail
df_ratings = df_ratings.groupby(["user_id", "idDrink"], as_index=False).agg({"sentiment_score": "mean"})

# Transformer en matrice utilisateur-produit
user_product_matrix = df_ratings.pivot(index="user_id", columns="idDrink", values="sentiment_score")

# Sauvegarde sous forme de fichier CSV
user_product_matrix.to_csv("./final_database/user_product_matrix.csv")

# Afficher un aperçu
import ace_tools as tools
tools.display_dataframe_to_user(name="Matrice utilisateur-produit", dataframe=user_product_matrix)

print("Matrice utilisateur-produit créée avec succès et sauvegardée ! 🚀")
