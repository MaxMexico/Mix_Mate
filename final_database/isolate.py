import json

# ------------------------------------------------------------
# Étape 1 : Lecture du fichier JSON
# ------------------------------------------------------------
with open("./final_database/final_data_base.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# ------------------------------------------------------------
# Étape 2 : Construire une nouvelle liste contenant
#           uniquement les champs souhaités
# ------------------------------------------------------------
nouvelle_liste = []
for cocktail in data:
    # On crée un nouvel objet pour chaque cocktail
    nouvel_objet = {
        "idDrink": cocktail.get("idDrink", ""),
        "strInstructions": cocktail.get("strInstructions", ""),
        "strInstructionsFR": ""  # Champ vide, comme demandé
    }
    
    nouvelle_liste.append(nouvel_objet)

# ------------------------------------------------------------
# Étape 3 : Écriture de la nouvelle liste dans un nouveau fichier JSON
# ------------------------------------------------------------
with open("./final_database/instructions.json", "w", encoding="utf-8") as out:
    json.dump(nouvelle_liste, out, indent=2, ensure_ascii=False)

print("Fichier 'final_data_base_instructions.json' créé avec succès !")
