
import os
import pandas as pd
from collections import Counter

# Define base directory based on the script location
base_dir = os.path.dirname(os.path.abspath(__file__))

# Ensure necessary directories exist
os.makedirs(os.path.join(base_dir, 'data'), exist_ok=True)
os.makedirs(os.path.join(base_dir, 'results'), exist_ok=True)

# Define paths for input and output files
cocktail_data_path = os.path.join(base_dir, 'data', 'cocktails_cleaned.csv')
ingredients_data_path = os.path.join(base_dir, 'data', 'cocktail_ingredients.csv')
output_path = os.path.join(base_dir, 'results', 'cocktails_enriched_refined.csv')

# Load data
cocktails = pd.read_csv(cocktail_data_path)
ingredients_df = pd.read_csv(ingredients_data_path)

# Define flavor profiles
flavor_profiles = {
    'sucré': ['Grenadine', 'Triple Sec', 'Crème de Cacao', 'Baileys', 'Amaretto', 'Sugar', 'Maraschino Cherry', 'Pisang Ambon', 'Brown Sugar', 'Maple Syrup'],
    'amer': ['Campari', 'Angostura Bitters', 'Vermouth', 'Aperol', 'Orange bitters', 'Fernet', 'Bitters', 'Gin'],
    'fruité': ['Orange Juice', 'Pineapple Juice', 'Lime Juice', 'Lemon Juice', 'Apple Juice', 'Cranberry Juice', 'Grapefruit Juice', 'Mango Juice', 'Peach nectar', 'Cherry'],
    'épicé': ['Ginger Beer', 'Cinnamon', 'Tabasco', 'Pepper', 'Nutmeg', 'Clove', 'Cardamom', 'Chili Powder'],
    'agrumes': ['Lime', 'Lemon', 'Orange', 'Grapefruit', 'Yuzu', 'Bergamot', 'Lemon Juice', 'Lime Juice'],
    'fumé': ['Mezcal', 'Smoked Whiskey', 'Scotch', 'Tequila Añejo'],
    'floraux': ['Elderflower', 'Rose', 'Lavender', 'Hibiscus', 'Violet', 'Orange Blossom', 'Elderflower Liqueur', 'Elderflower Syrup'],
    'mentholé': ['Mint', 'Peppermint', 'Menthol', 'Eucalyptus'],
    'vanillé': ['Vanilla', 'Vanilla Extract', 'Vanilla Syrup'],
    'caramélisé': ['Caramel Syrup', 'Butterscotch', 'Toffee', 'Brown Sugar'],
    'anisé': ['Anis', 'Absinthe', 'Pernod', 'Pastis', 'Sambuca'],
    'sureau': ['Elderflower Liqueur', 'Elderflower Syrup'],
    'herbacé': ['Mint', 'Basil', 'Rosemary', 'Thyme', 'Sage', 'Lavender', 'Coriander', 'Gin'],
    'crémeux': ['Cream', 'Milk', 'Half-and-half', 'Coconut Milk', 'Coconut Cream', 'Yogurt', 'Heavy Cream', 'Light Cream', 'Baileys irish cream'],
    'boisé': ['Whiskey', 'Bourbon', 'Scotch', 'Rum', 'Cognac', 'Dark rum', 'Gin'],
    'tropical': ['Coconut', 'Pineapple', 'Mango', 'Banana', 'Passion Fruit', 'Pisang Ambon'],
    'chocolaté': ['Chocolate', 'Cacao', 'Chocolate Syrup', 'Dark Chocolate'],
    'frais': ['Cucumber', 'Mint', 'Lime', 'Basil', 'Lemon', 'Gin']
}

# Function to assign a flavor profile based on ingredients
def assign_flavor_profile(ingredients):
    cocktail_profiles = set()
    for ingredient in ingredients:
        for profile, profile_ingredients in flavor_profiles.items():
            if any(profile_ingredient.lower() in ingredient.lower() for profile_ingredient in profile_ingredients):
                cocktail_profiles.add(profile)
    return ', '.join(cocktail_profiles) if cocktail_profiles else 'non classé'

# Apply the flavor profile to each cocktail based on ingredients
cocktail_flavor_profiles = (
    ingredients_df.groupby('idDrink')['Ingredient']
    .apply(assign_flavor_profile)
    .reset_index()
    .rename(columns={'Ingredient': 'FlavorProfile'})
)

# Merge with the cocktail data to include flavor profiles
cocktails_with_flavor = cocktails.merge(cocktail_flavor_profiles, on='idDrink', how='left')

# Save the enriched cocktail data with flavor profiles to a CSV
cocktails_with_flavor.to_csv(output_path, index=False)

# Count and display flavor profile occurrences
all_profiles = cocktails_with_flavor['FlavorProfile'].str.split(', ').sum()
profile_counts = Counter(all_profiles)

print('Profile Counts:', profile_counts)
