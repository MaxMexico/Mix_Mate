import requests
import json
import csv
import time
import string
import pandas as pd

API_KEY = 9973533

# Get all cocktails by letter using TheCocktailDB API
def get_cocktails_by_letter(letter):

    url = f"https://www.thecocktaildb.com/api/json/v2/{API_KEY}/search.php?f={letter}"
    response = requests.get(url)
    
    if response.status_code == 200 and response.text.strip():
        try:
            return response.json().get("drinks", [])
        except json.JSONDecodeError:
            print(f"Erreur de décodage JSON pour la lettre '{letter}': réponse non valide")
            return []
    else:
        print(f"Erreur HTTP {response.status_code} ou réponse vide pour la lettre '{letter}'")
        return []

# Get cocktail details by ID using TheCocktailDB API
def get_cocktail_details(cocktail_id):
    url = f"https://www.thecocktaildb.com/api/json/v2/{API_KEY}/lookup.php?i={cocktail_id}"
    response = requests.get(url)
    
    if response.status_code == 200 and response.text.strip():
        try:
            return response.json().get("drinks", [])[0]
        except json.JSONDecodeError:
            print(f"Erreur de décodage JSON pour le cocktail ID '{cocktail_id}'")
            return None
    else:
        print(f"Erreur HTTP {response.status_code} ou réponse vide pour le cocktail ID '{cocktail_id}'")
        return None

# Returns all the cocktails data in a json file and a list of all the fiels (headers)
def fetch_and_save_all_cocktails(filename="api_cocktails/cocktails.json"):
    all_cocktails = []
    all_fields = set()

    for letter in string.ascii_lowercase:
        cocktails = get_cocktails_by_letter(letter)
        if cocktails:
            for cocktail in cocktails:
                detailed_cocktail = get_cocktail_details(cocktail['idDrink'])
                if detailed_cocktail:
                    all_cocktails.append(detailed_cocktail)
                    all_fields.update(detailed_cocktail.keys())  
                time.sleep(0.2)  # Wait 0.2 seconds between requests so the API doesn't get blocked
        else:
            print(f"Aucun cocktail trouvé pour la lettre '{letter}'")
    
    with open(filename, "w") as f:
        json.dump(all_cocktails, f, indent=4)
    
    return all_cocktails, list(all_fields)

# Convert json into csv 
def json_to_csv(cocktails, headers, csv_file="api_cocktails/cocktails.csv"):
    with open(csv_file, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        
        for cocktail in cocktails:
            if cocktail:  
                writer.writerow(cocktail)

# Call functions and run the program
if __name__ == "__main__":
    all_cocktails, all_fields = fetch_and_save_all_cocktails()
    json_to_csv(all_cocktails, all_fields)

# Our csv needs to be organized in a specific order
file_path = 'api_cocktails/cocktails.csv'
df = pd.read_csv(file_path)

# We'll reorganize the data in this order
header = [
    "idDrink", "strDrink", "strDrinkAlternate", "strTags", "strVideo", "strCategory", "strAlcoholic", 
    "strGlass", "strInstructions", "strDrinkThumb", "strIngredient1", "strIngredient2", "strIngredient3",
    "strIngredient4", "strIngredient5", "strIngredient6", "strIngredient7", "strIngredient8", "strIngredient9",
    "strIngredient10", "strIngredient11", "strIngredient12", "strIngredient13", "strIngredient14", "strIngredient15",
    "strMeasure1", "strMeasure2", "strMeasure3", "strMeasure4", "strMeasure5", "strMeasure6", "strMeasure7", 
    "strMeasure8", "strMeasure9", "strMeasure10", "strMeasure11", "strMeasure12", "strMeasure13", "strMeasure14", 
    "strMeasure15", "strImageSource", "strImageAttribution", "strCreativeCommonsConfirmed", "dateModified"
]

reordered_df = df.reindex(columns=header)
reordered_file_path = 'api_cocktails/thecocktailsfinal.csv'
reordered_df.to_csv(reordered_file_path, index=False)
print(f"Fichier réarrangé enregistré sous : {reordered_file_path}")