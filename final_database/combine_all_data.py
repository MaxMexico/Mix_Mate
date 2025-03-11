import pandas as pd
import json

# 1. Charger le fichier CSV avec les notes globales
df = pd.read_csv("./api_cocktails/all_cocktails_with_ratings.csv")

# Vérifier les colonnes
df.columns = df.columns.str.strip()
print("Colonnes du fichier CSV :", df.columns)

# Assurez-vous que 'idDrink' est bien une chaîne
df["idDrink"] = df["idDrink"].astype(str)
df["idDrink"] = df["idDrink"].str.strip()

# Vérifiez la correspondance des ID
print("Exemple d'ID du CSV :", df["idDrink"].head().tolist())

# Vérifier si la colonne Rating existe
if "Rating" not in df.columns:
    print("Erreur : la colonne 'Rating' n'existe pas.")
    exit()

# 2. Construire un dictionnaire { idDrink: grade }
rating_map = dict(zip(df["idDrink"], df["Rating"]))

# 3. Charger le fichier JSON existant
with open("./Sentiment_Analysis/cocktails_with_reviews_updated.json", "r", encoding="utf-8") as f:
    cocktails_data = json.load(f)

print("Exemple d'ID du JSON :", [c["idDrink"] for c in cocktails_data[:5]])

# 4. Ajouter la note globale
for cocktail in cocktails_data:
    cocktail_id = cocktail.get("idDrink")
    if cocktail_id in rating_map:
        cocktail["Rating"] = rating_map[cocktail_id]

# Vérifier si les notes sont bien ajoutées
for cocktail in cocktails_data[:5]:  # Afficher quelques cocktails modifiés
    print(cocktail)

# 5. Écriture du JSON mis à jour
with open("./final_database/final_data_base.json", "w", encoding="utf-8") as f:
    json.dump(cocktails_data, f, indent=4, ensure_ascii=False)

print("Fichier JSON mis à jour avec la note globale.")


