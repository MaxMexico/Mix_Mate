import json
from difflib import get_close_matches

# Charger les fichiers JSON
with open('/Users/victorasencio/Desktop/ESME/INGE_3/Mix_Mate/combine_api_and_scrapp/cocktails.json', 'r') as file:
    cocktails_data = json.load(file)

with open('/Users/victorasencio/Desktop/ESME/INGE_3/Mix_Mate/combine_api_and_scrapp/reviews.json', 'r') as file:
    comments_data = json.load(file)

# Indexer les commentaires par nom de cocktail
comments_index = {entry['cocktail']: entry['comments'] for entry in comments_data}

# Fonction pour trouver les correspondances les plus proches
def find_closest_match(cocktail_name, comment_names):
    matches = get_close_matches(cocktail_name, comment_names, n=1, cutoff=0.6)
    return matches[0] if matches else None

# Ajouter les commentaires aux cocktails
for cocktail in cocktails_data:
    cocktail_name = cocktail.get("strDrink")
    closest_match = find_closest_match(cocktail_name, comments_index.keys())
    if closest_match:
        cocktail["reviews"] = comments_index[closest_match]
    else:
        cocktail["reviews"] = []

# Sauvegarder le fichier JSON mis à jour
output_file = 'cocktails_with_reviews.json'
with open(output_file, 'w') as file:
    json.dump(cocktails_data, file, indent=4)

print(f"Le fichier mis à jour a été enregistré : {output_file}")
