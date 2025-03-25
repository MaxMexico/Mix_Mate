import json

# Liste des clés à conserver
fields_to_keep = ["idDrink", "strDrink"]
fields_to_keep += [f"strIngredient{i}" for i in range(1, 16)]
fields_to_keep += [f"strMeasure{i}" for i in range(1, 16)]

# Charger le fichier JSON original
with open("./final_database/final_data_base.json", "r", encoding="utf-8") as f:
    cocktails = json.load(f)

filtered_cocktails = []

for cocktail in cocktails:
    new_cocktail = {}
    # On parcourt chaque clé à conserver
    for key in fields_to_keep:
        value = cocktail.get(key)
        # On conserve la clé si la valeur existe et n'est pas une chaîne vide
        if value and isinstance(value, str) and value.strip():
            new_cocktail[key] = value
        # Conserver aussi si la valeur est non nulle et n'est pas une chaîne (par exemple, un nombre)
        elif value is not None and not isinstance(value, str):
            new_cocktail[key] = value
    filtered_cocktails.append(new_cocktail)

# Sauvegarder le résultat dans un nouveau fichier JSON
with open("./final_database/filtered_cocktails.json", "w", encoding="utf-8") as f:
    json.dump(filtered_cocktails, f, ensure_ascii=False, indent=4)

print("Le fichier filtered_cocktails.json a été créé avec succès.")
