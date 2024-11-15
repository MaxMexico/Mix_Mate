import json

# Charger les fichiers JSON
with open("scrap/cocktails_comments_vic.json") as f1, open("scrap/cocktails_comments_max.json") as f2, open("scrap/cocktails_comments_art.json") as f3:
    data1 = json.load(f1)
    data2 = json.load(f2)
    data3 = json.load(f3)

# Combiner les données des trois fichiers
combined_data = data1 + data2 + data3

# Trier les données par ordre alphabétique basé sur le nom du cocktail
sorted_data = sorted(combined_data, key=lambda x: x["cocktail"])

# Sauvegarder dans un nouveau fichier JSON
with open("scrap/full_comments.json", "w") as f_out:
    json.dump(sorted_data, f_out, indent=4)

print("Les fichiers ont été fusionnés et triés avec succès.")
