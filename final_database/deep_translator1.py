from deep_translator import MyMemoryTranslator
import json
import os
import time
import random

# Configuration avec votre clé API
API_KEY = "017511b7a9c522bb8e26"  # [[1]]
translator = MyMemoryTranslator(source='en', target='fr', api_key=API_KEY)

# Paramètres optimisés pour MyMemory (5000 caractères max par requête)
REQUEST_DELAY = 0.3  # Délai réduit grâce à la clé API [[1]]
MAX_RETRIES = 3
RETRY_DELAY = 5

# Fichiers de cache et de sortie
TRANSLATION_CACHE_FILE = 'final_database/translation_cache.json'
PROGRESS_FILE = 'final_database/translation_progress.json'
OUTPUT_FILE = 'final_database/Translation_database.json'

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

# Dictionnaires de traduction (adaptés à votre base)
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

UNTRANSLATED_INGREDIENTS = {"Cointreau", "Corona", "Bailey's", "Schweppes", "Sprite", "Jack Daniels", "Bailey's Irish Cream"}

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
    """Traduction avec MyMemory + clé API [[1]]"""
    if not text or text in translation_cache:
        return translation_cache.get(text, text)
    
    retries = 0
    while retries < MAX_RETRIES:
        try:
            time.sleep(REQUEST_DELAY + random.uniform(0.1, 0.3))
            translated_text = translator.translate(text)
            
            # Vérification qualité
            if translated_text == text or not translated_text:
                raise ValueError("Traduction invalide")
                
            translation_cache[text] = translated_text
            print(f"🌐 Traduction : '{text}' → '{translated_text}'")
            return translated_text
            
        except Exception as e:
            print(f"⚠️ Erreur (tentative {retries+1}) : {str(e)}")
            retries += 1
            time.sleep(RETRY_DELAY * (2 ** retries))
    
    print(f"❌ Échec : {text}")
    return text

def translate_cocktail(entry):
    """Traduction spécifique aux données de votre JSON"""
    cocktail_id = entry.get('idDrink', 'ID_INCONNU')
    print(f"\n--- Traitement {cocktail_id} ---")
    
    # 1. Instructions (priorité à strInstructionsFR)
    if entry.get('strInstructionsFR'):
        entry['strInstructions'] = entry['strInstructionsFR']
        print("✅ Instructions FR existantes utilisées")
    else:
        original = entry.get('strInstructions', '')
        if original:
            print(f"🔤 Traduction des instructions : {original[:50]}...")
            entry['strInstructions'] = translate_field(original)

    # 2. Catégorie
    entry['strCategory'] = CATEGORY_TRANSLATIONS.get(
        entry.get('strCategory', ''),
        entry.get('strCategory', '')
    )

    # 3. Ingrédients (1-15)
    for i in range(1, 16):
        key = f'strIngredient{i}'
        if entry.get(key) and entry[key] not in UNTRANSLATED_INGREDIENTS:
            print(f"🌿 Traduction ingrédient {i} : {entry[key]}")
            entry[key] = translate_field(entry[key])

    # 4. Mesures (conversion d'unités)
    for i in range(1, 16):
        key = f'strMeasure{i}'
        if entry.get(key):
            for eng, fr in MEASURE_TRANSLATIONS.items():
                entry[key] = entry[key].replace(eng, fr)
                if entry[key].endswith(f"{eng}s"):
                    entry[key] = entry[key].replace(f"{eng}s", f"{fr}s")
            entry[key] = entry[key].replace("drops", "gouttes")

    # 5. Commentaires
    if 'reviews' in entry and entry['reviews']:
        for review in entry['reviews']:
            if 'comment' in review and review['comment']:
                original_comment = review['comment']
                if 'commentFR' in review and review['commentFR']:
                    review['comment'] = review['commentFR']
                else:
                    print(f"🗨️ Traduction commentaire : {original_comment[:30]}...")
                    review['comment'] = translate_field(original_comment)
    else:
        print("🔕 Aucun commentaire à traduire")

    print(f"✅ Cocktail {cocktail_id} terminé\n")
    return entry

# Traitement principal
try:
    print("🚀 Démarrage avec MyMemory API")
    input_file = 'final_database/final_data_base_copy.json'
    
    with open(input_file, 'r', encoding='utf-8') as f:
        all_data = json.load(f)
    
    existing_ids = {t.get('idDrink') for t in translated_data}
    remaining_data = [d for d in all_data if d.get('idDrink') not in existing_ids]
    
    print(f"📚 {len(all_data)} total - {len(existing_ids)} traités - {len(remaining_data)} restants")
    
    for index, entry in enumerate(remaining_data):
        translated_entry = translate_cocktail(entry)
        translated_data.append(translated_entry)
        
        # Sauvegarde régulière
        if index % 20 == 0 or index == len(remaining_data)-1:
            print("🔄 Sauvegarde...")
            with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
                json.dump(translated_data, f, indent=2, ensure_ascii=False)
            with open(TRANSLATION_CACHE_FILE, 'w', encoding='utf-8') as f:
                json.dump(translation_cache, f, ensure_ascii=False, indent=2)

    print("\n🌈 TRAITEMENT TERMINÉ !")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, indent=2, ensure_ascii=False)
    print(f"💾 Résultat final : {os.path.abspath(OUTPUT_FILE)}")

except Exception as e:
    print(f"🔥 ERREUR : {str(e)}")
    with open("emergency_backup.json", 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, indent=2, ensure_ascii=False)