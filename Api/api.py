import requests
import csv
import string

with open('all_cocktails.csv', mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)

    headers = [
        "idDrink", "strDrink", "strTags", "strVideo", "strCategory", 
        "strIBA", "strAlcoholic", "strGlass", "strInstructions", "strDrinkThumb"
    ]

    # Ajouter les colonnes pour 15 ingrédients et mesures
    for i in range(1, 16):
        headers.append(f"strIngredient{i}")
        headers.append(f"strMeasure{i}")

    headers += ["strImageSource", "strImageAttribution", "strCreativeCommonsConfirmed", "dateModified"]

   
    writer.writerow(headers)

    # Boucler sur chaque lettre de l'alphabet + les chiffres
    all_characters = list(string.ascii_lowercase) + [str(i) for i in range(10)]

    cocktail_count = 0

    for char in all_characters:
        url = f"https://www.thecocktaildb.com/api/json/v1/1/search.php?f={char}"
        response = requests.get(url)
        data = response.json()
        
       
        drinks = data.get('drinks', [])
        if drinks:
            for drink in drinks:
                # Extraire les informations 
                row = [
                    drink.get("idDrink"),
                    drink.get("strDrink"),
                    drink.get("strTags"),
                    drink.get("strVideo"),
                    drink.get("strCategory"),
                    drink.get("strIBA"),
                    drink.get("strAlcoholic"),
                    drink.get("strGlass"),
                    drink.get("strInstructions"),
                    drink.get("strDrinkThumb")
                ]
                
                # Extraire les ingrédients et les quantités
                for i in range(1, 16):
                    ingredient = drink.get(f"strIngredient{i}")
                    measure = drink.get(f"strMeasure{i}")
                    row.append(ingredient if ingredient else "")
                    row.append(measure if measure else "")
                
                row += [
                    drink.get("strImageSource"),
                    drink.get("strImageAttribution"),
                    drink.get("strCreativeCommonsConfirmed"),
                    drink.get("dateModified")
                ]

                writer.writerow(row)
                cocktail_count += 1

print(f"Le script a récupéré {cocktail_count} cocktails au total.")
