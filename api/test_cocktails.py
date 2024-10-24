# import requests
# import csv

# # Chemin pour le fichier CSV de sortie
new_file_path = 'other_cocktails.csv'

# def fetch_cocktails_to_new_file():
#     # Liste des catégories de cocktails
#     categories = [
#         "Cocktail", "Ordinary Drink", "Punch / Party Drink", "Shake",
#         "Other / Unknown", "Cocoa", "Shot", "Coffee / Tea",
#         "Homemade Liqueur", "Beer", "Soft Drink"
#     ]
    
#     # Ouvrir le fichier pour écrire les nouveaux cocktails
#     with open(new_file_path, mode='w', newline='', encoding='utf-8') as file:
#         writer = csv.writer(file)

#         # Écrire les en-têtes de colonnes
#         headers = [
#             "idDrink", "strDrink", "strTags", "strVideo", "strCategory", 
#             "strIBA", "strAlcoholic", "strGlass", "strInstructions", "strDrinkThumb"
#         ]
        
#         # Ajouter les colonnes pour 15 ingrédients et mesures
#         for i in range(1, 16):
#             headers.append(f"strIngredient{i}")
#             headers.append(f"strMeasure{i}")
        
#         headers += ["strImageSource", "strImageAttribution", "strCreativeCommonsConfirmed", "dateModified"]
#         writer.writerow(headers)

#         # Boucle sur chaque catégorie pour faire les requêtes
#         for category in categories:
#             url = f'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c={category.replace(" ", "_")}'
            
#             try:
#                 # Faire la requête GET à l'API
#                 response = requests.get(url)
#                 response.raise_for_status()  # Vérifie si la requête a réussi
                
#                 # Convertir la réponse en JSON
#                 data = response.json()
                
#                 # Vérifier les cocktails dans la catégorie
#                 if 'drinks' in data:
#                     for drink in data['drinks']:
#                         # Récupérer les détails du cocktail
#                         details_url = f'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i={drink["idDrink"]}'
#                         details_response = requests.get(details_url)
#                         details_response.raise_for_status()
#                         details_data = details_response.json()

#                         if 'drinks' in details_data:
#                             drink_details = details_data['drinks'][0]
#                             # Ajouter le cocktail au fichier CSV avec tous les champs
#                             row = [
#                                 drink_details['idDrink'],
#                                 drink_details['strDrink'],
#                                 drink_details.get('strTags', ''),
#                                 drink_details.get('strVideo', ''),
#                                 drink_details['strCategory'],
#                                 drink_details.get('strIBA', ''),
#                                 drink_details['strAlcoholic'],
#                                 drink_details['strGlass'],
#                                 drink_details['strInstructions'],
#                                 drink_details['strDrinkThumb'],
#                             ]
                            
#                             # Extraire les ingrédients et les quantités
#                             for i in range(1, 16):
#                                 ingredient = drink_details.get(f'strIngredient{i}', '')
#                                 measure = drink_details.get(f'strMeasure{i}', '')
#                                 row.append(ingredient)
#                                 row.append(measure)

#                             row += [
#                                 drink_details.get('strImageSource', ''),
#                                 drink_details.get('strImageAttribution', ''),
#                                 drink_details.get('strCreativeCommonsConfirmed', ''),
#                                 drink_details.get('dateModified', ''),
#                             ]

#                             writer.writerow(row)

#             except requests.exceptions.RequestException as e:
#                 print(f"Erreur lors de la requête pour la catégorie {category}: {e}")

# # Exécuter la fonction pour récupérer les cocktails
# fetch_cocktails_to_new_file()
# print(f"Tous les cocktails ont été récupérés et enregistrés dans '{new_file_path}'.")



import pandas as pd

# Charger le fichier CSV existant
existing_file_path = 'all_cocktails.csv'
new_cocktails_df = pd.read_csv('other_cocktails.csv')  # Assurez-vous que ce fichier existe

# Charger le fichier CSV existant
existing_cocktails_df = pd.read_csv(existing_file_path)

# Liste pour stocker les nouveaux cocktails à ajouter
new_cocktails_to_add = []

# Boucle pour vérifier et ajouter les nouveaux cocktails
for _, new_cocktail in new_cocktails_df.iterrows():
    if new_cocktail['idDrink'] not in existing_cocktails_df['idDrink'].values:
        # Ajouter le cocktail manquant au DataFrame existant
        new_cocktails_to_add.append(new_cocktail)

# Convertir la liste des nouveaux cocktails en DataFrame
if new_cocktails_to_add:
    new_cocktails_df_to_add = pd.DataFrame(new_cocktails_to_add)

    # Utiliser pd.concat pour ajouter les nouveaux cocktails
    existing_cocktails_df = pd.concat([existing_cocktails_df, new_cocktails_df_to_add], ignore_index=True)

# Enregistrer les cocktails mis à jour dans le fichier CSV
existing_cocktails_df.to_csv(existing_file_path, index=False)

# Afficher le nombre de nouveaux cocktails ajoutés
print(f"{len(new_cocktails_to_add)} nouveaux cocktails ont été ajoutés au fichier.")
