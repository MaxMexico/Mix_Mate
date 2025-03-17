from translate import Translator
import json
import os
import time
import random

# Configuration anti-blocage
REQUEST_DELAY = 1.5
MAX_RETRIES = 2
RETRY_DELAY = 2

# Fichiers de cache et de sortie
TRANSLATION_CACHE_FILE = os.path.join('final_database', 'translation_cache.json')
PROGRESS_FILE = os.path.join('final_database', 'translation_progress.json')
OUTPUT_FILE = os.path.join('final_database', 'Translation_database.json')

# Initialisation du traducteur
translator = Translator(to_lang='fr')

# Chargement du cache
try:
    with open(TRANSLATION_CACHE_FILE, 'r', encoding='utf-8') as f:
        translation_cache = json.load(f)
except FileNotFoundError:
    translation_cache = {}

# Chargement du progrès existant
try:
    with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
        translated_data = json.load(f)
        print(f"🔄 Reprend {len(translated_data)} cocktails déjà traduits")
except FileNotFoundError:
    translated_data = []

# Dictionnaires de traduction
CATEGORY_TRANSLATIONS = {
    "Ordinary Drink": "Boisson classique",
    "Cocktail": "Cocktail",
    "Punch / Party Drink": "Punch / Boisson de fête",
    "Shot": "Shot",
    "Non alcoholic": "Non alcoolisé",
    "Alcoholic": "Alcoolisé",
    "Highball glass": "Verre highball",
    "Cocktail glass": "Verre à cocktail",
    "Shot glass": "Verre à shot",
    "Old-fashioned glass": "Verre old-fashioned",
    "Collins Glass": "Verre collins",
    "Margarita/Coupette glass": "Verre margarita/coupette",
    "Cordial glass": "Verre à cordial",
    "Punch bowl": "Bol à punch",
    "Other / Unknown": "Autre / Inconnu",
    "Homemade Liqueur": "Liqueur maison"
}

UNTRANSLATED_INGREDIENTS = {
    "Coca-Cola", "Sprite", "Schweppes", "Jack Daniels", "Bailey's", 
    "Bailey's Irish Cream", "Cointreau", "Jägermeister", "Aperol", 
    "Corona", "Tia Maria", "Sambuca", "Lillet", "Passoa", "Kool-Aid", 
    "Dr. Pepper", "Bacardi", "Triple sec", "Falernum", "Applejack", 
    "Angostura Bitters", "Campari", "Pernod", "Midori", "Malibu", 
    "Pimm's", "Martini Rosso", "Red Bull", 
    "Tabasco", "Grenadine", "Bitters", "Ginger beer", "Ginger ale", 
    "Club soda", "Champagne", "Tequila", "Vodka", "Gin", "Whisky", 
    "Cachaça", "Cachaca", "Absinthe", "Benedictine", "Yuzu", "Olive","Pisco", "St. Germain", "Mezcal"
}
MEASURE_TRANSLATIONS = {
    "tsp": "cuillère à café",
    "cup": "tasse",
    "qt": "litre",
    "fifth": "cinquième",
    "gal": "gallon",
    "oz": "once",
    "tblsp": "cuillère à soupe",
    "drop": "goutte",
    "shot": "verre dose",
    "splash": "splash",
    "piece": "morceau",
    "whole": "entier",
    "twist of": "zeste de",
    "part": "partie",
    "cl": "cl"
}

def translate_field(text):
    """Traduction avec cache et gestion des erreurs"""
    if not text or text in translation_cache:
        return translation_cache.get(text, text)
    
    retries = 0
    while retries < MAX_RETRIES:
        try:
            time.sleep(REQUEST_DELAY + random.uniform(0.3, 0.7))
            translated_text = translator.translate(text)
            
            # Vérification de la qualité
            if translated_text == text:
                raise ValueError("Traduction identique au texte original")
                
            translation_cache[text] = translated_text
            print(f"🌐 Traduction réussie : '{text}' → '{translated_text}'")
            return translated_text
            
        except Exception as e:
            print(f"⚠️ Erreur traduction '{text[:20]}...' (tentative {retries+1}/{MAX_RETRIES}) : {str(e)}")
            retries += 1
            time.sleep(RETRY_DELAY * (2 ** retries))
    
    print(f"❌ Échec traduction : {text}")
    return text

def translate_cocktail(entry):
    """Traduction complète d'une entrée cocktail"""
    cocktail_id = entry.get('idDrink', 'ID_INCONNU')
    print(f"\n--- Traitement {cocktail_id} ---")
    
    # 1. Instructions
    if entry.get('strInstructionsFR'):
        entry['strInstructions'] = entry['strInstructionsFR']
        print("✅ Instructions FR existantes utilisées")
    else:
        instructions = entry.get('strInstructions', '')
        if instructions:
            print(f"🔤 Traduction des instructions : {instructions[:50]}...")
            entry['strInstructions'] = translate_field(instructions)
        else:
            print("🚫 Aucune instruction à traduire")

    # 2. Catégorie
    category = entry.get('strCategory', '')
    entry['strCategory'] = CATEGORY_TRANSLATIONS.get(category, category)
    print(f"🗂️ Catégorie : {category} → {entry['strCategory']}")

    # 3. Ingrédients (1 à 15)
    for i in range(1, 16):
        key = f'strIngredient{i}'
        if entry.get(key):
            ingredient = entry[key]
            if ingredient in UNTRANSLATED_INGREDIENTS:
                print(f"🔒 Ingrédient non traduit : {ingredient}")
            else:
                print(f"🌿 Traduction ingrédient {i} : {ingredient}")
                entry[key] = translate_field(ingredient)

    # 4. Mesures
    for i in range(1, 16):
        key = f'strMeasure{i}'
        if entry.get(key):
            print(f"⚖️ Conversion mesure {i} : {entry[key]}")
            for eng, fr in MEASURE_TRANSLATIONS.items():
                entry[key] = entry[key].replace(eng, fr)
                # Gestion des pluriels
                if entry[key].endswith(f"{eng}s"):
                    entry[key] = entry[key].replace(f"{eng}s", f"{fr}s")
            # Cas spécifiques
            entry[key] = entry[key].replace("drops", "gouttes")

    # 5. Commentaires
    if 'reviews' in entry and entry['reviews']:
        print(f"💬 Traduction de {len(entry['reviews'])} commentaires")
        for review in entry['reviews']:
            if review and 'comment' in review and review['comment']:
                if 'commentFR' in review and review['commentFR']:
                    review['comment'] = review['commentFR']
                else:
                    print(f"🗨️ Traduction commentaire : {review['comment'][:30]}...")
                    review['comment'] = translate_field(review['comment'])
    else:
        print("🔕 Aucun commentaire à traduire")

    print(f"✅ Cocktail {cocktail_id} traité\n")
    return entry

# Traitement principal
try:
    print("🚀 Démarrage du traitement")
    input_file = os.path.join('final_database', 'final_data_base_copy.json')
    
    with open(input_file, 'r', encoding='utf-8') as f:
        all_data = json.load(f)
    
    existing_ids = {t.get('idDrink') for t in translated_data}
    remaining_data = [d for d in all_data if d.get('idDrink') not in existing_ids]
    
    print(f"📚 {len(all_data)} total - {len(existing_ids)} déjà traités - {len(remaining_data)} restants")
    
    for index, entry in enumerate(remaining_data):
        translated_entry = translate_cocktail(entry)
        translated_data.append(translated_entry)
        
        # Sauvegarde régulière
        print("🔄 Sauvegarde du cocktail...")
        with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
            json.dump(translated_data, f, indent=2, ensure_ascii=False)
        with open(TRANSLATION_CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(translation_cache, f, ensure_ascii=False, indent=2)

    # Sauvegarde finale
    print("\n🌈 Traitement COMPLET terminé !")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, indent=2, ensure_ascii=False)
    print(f"💾 Fichier final disponible : {os.path.abspath(OUTPUT_FILE)}")

except KeyboardInterrupt:
    print("\n🛑 INTERRUPTION MANUELLE")
    print("Sauvegarde du progrès avant fermeture...")
    with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, indent=2, ensure_ascii=False)
    with open(TRANSLATION_CACHE_FILE, 'w', encoding='utf-8') as f:
        json.dump(translation_cache, f, ensure_ascii=False, indent=2)
    print("✅ Progrès sauvegardé - relancez pour continuer")

except Exception as e:
    print(f"\n🔥 ERREUR FATALE : {str(e)}")
    print("Sauvegarde d'urgence en cours...")
    with open("emergency_backup.json", 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, indent=2, ensure_ascii=False)
    print(f"⚠️ Backup créé : {os.path.abspath('emergency_backup.json')}")