"""pip install --upgrade googletrans==4.0.0-rc1"""
from googletrans import Translator
import json
import os
import time
import random

# Configuration anti-blocage
REQUEST_DELAY = 1.5
MAX_RETRIES = 3
RETRY_DELAY = 2

# Fichiers de cache et de sortie
TRANSLATION_CACHE_FILE = os.path.join('final_database', 'translation_cache.json')
PROGRESS_FILE = os.path.join('final_database', 'translation_progress.json')
OUTPUT_FILE = os.path.join('final_database', 'Translation_database.json')

# Initialisation du traducteur
translator = Translator()

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
    "Cachaça", "Absinthe","Cachaca", "Benedictine", "Yuzu", "Olive", "St. Germain", "Mezcal"
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

def translate_field(text, dest='fr'):
    """Traduction avec gestion renforcée des erreurs API et vérification de qualité"""
    if not text or text in translation_cache:
        return translation_cache.get(text, text)
    retries = 0
    while retries < MAX_RETRIES:
        try:
            time.sleep(REQUEST_DELAY + random.uniform(0.3, 0.7))
            translated = translator.translate(text=text, dest=dest, src='en')
            
            # Vérification de qualité
            if translated.text == text:
                raise ValueError("Traduction identique au texte original")
                
            translation_cache[text] = translated.text
            print(f"🌍 Traduction réussie : '{text}' → '{translated.text}'")
            return translated.text
            
        except AttributeError as e:
            print(f"🛠 Erreur d'API (tentative {retries+1}/{MAX_RETRIES}) : {str(e)}")
            retries += 1
            time.sleep(RETRY_DELAY * (2 ** retries))
        except Exception as e:
            print(f"⚠️ Erreur inattendue (tentative {retries+1}/{MAX_RETRIES}) : {str(e)}")
            retries += 1
            time.sleep(RETRY_DELAY * (2 ** retries))
    print(f"❌ Échec après {MAX_RETRIES} tentatives : {text}")
    return text

def translate_cocktail(entry):
    """Traduction complète avec gestion des données manquantes"""
    cocktail_id = entry.get('idDrink', 'ID_INCONNU')
    print(f"\n--- Début traitement {cocktail_id} ---")
    
    # 1. Instructions (priorité à la version FR existante)
    if entry.get('strInstructionsFR'):
        entry['strInstructions'] = entry['strInstructionsFR']
        print("✅ Instructions FR existantes utilisées")
    else:
        original_instructions = entry.get('strInstructions', '')
        if original_instructions:
            print(f"🔧 Traduction des instructions : {original_instructions[:50]}...")
            entry['strInstructions'] = translate_field(original_instructions)
        else:
            print("🚫 Aucune instruction à traduire")
    
    # 2. Catégorie
    original_category = entry.get('strCategory', '')
    entry['strCategory'] = CATEGORY_TRANSLATIONS.get(original_category, original_category)
    print(f"🏷 Catégorie : {original_category} → {entry['strCategory']}")
    
    # 3. Ingrédients (1 à 15)
    for i in range(1, 16):
        ingredient_key = f'strIngredient{i}'
        ingredient = entry.get(ingredient_key)
        if ingredient:
            if ingredient in UNTRANSLATED_INGREDIENTS:
                print(f"⏹ Ingrédient non traduit : {ingredient}")
            else:
                print(f"🌿 Traduction ingrédient {i} : {ingredient}")
                entry[ingredient_key] = translate_field(ingredient)
    
    # 4. Mesures (1 à 15)
    for i in range(1, 16):
        measure_key = f'strMeasure{i}'
        measure = entry.get(measure_key)
        if measure:
            print(f"用量 Conversion mesure {i} : {measure}")
            for eng, fr in MEASURE_TRANSLATIONS.items():
                # Gestion des pluriels
                measure = measure.replace(f"{eng}s", f"{fr}s")
                measure = measure.replace(eng, fr)
            # Cas spécifiques
            measure = measure.replace("drops", "gouttes")
            entry[measure_key] = measure
    
    # 5. Commentaires (avec vérification supplémentaire)
    if 'reviews' in entry and entry['reviews']:
        print(f"💬 Traduction de {len(entry['reviews'])} commentaires")
        for review in entry['reviews']:
            if review and 'comment' in review and review['comment']:
                original_comment = review['comment']
                if 'commentFR' in review and review['commentFR']:
                    review['comment'] = review['commentFR']
                else:
                    print(f"📝 Traduction commentaire : {original_comment[:30]}...")
                    review['comment'] = translate_field(original_comment)
    else:
        print("📭 Aucun commentaire à traduire")
    
    print(f"✅ Fin traitement {cocktail_id}\n")
    return entry

# Traitement principal avec sauvegarde fiable
try:
    print("🚀 Démarrage du traitement")
    input_file = os.path.join('final_database', 'final_data_base_copy.json')
    with open(input_file, 'r', encoding='utf-8') as f:
        all_data = json.load(f)
    
    existing_ids = {t.get('idDrink') for t in translated_data}
    remaining_data = [d for d in all_data if d.get('idDrink') not in existing_ids]
    print(f"📊 {len(all_data)} total - {len(existing_ids)} déjà traités - {len(remaining_data)} restants")
    
    for index, entry in enumerate(remaining_data):
        translated_entry = translate_cocktail(entry)
        translated_data.append(translated_entry)
        
        # Sauvegarde renforcée
        if index % 5 == 0 or index == len(remaining_data)-1:
            print("💾 Sauvegarde du progrès...")
            try:
                with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
                    json.dump(translated_data, f, indent=2, ensure_ascii=False)
                with open(TRANSLATION_CACHE_FILE, 'w', encoding='utf-8') as f:
                    json.dump(translation_cache, f, ensure_ascii=False, indent=2)
            except Exception as e:
                print(f"❌ Erreur de sauvegarde : {e}")
    
    # SAUVEGARDE FINALE OBLIGATOIRE
    print("\n🎉 Traitement COMPLET terminé !")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, indent=2, ensure_ascii=False)
    print(f"💾 Fichier final disponible : {os.path.abspath(OUTPUT_FILE)}")

except KeyboardInterrupt:
    print("\n🛑 INTERRUPTION MANUELLE")
    print("Sauvegarde du progrès avant fermeture...")
    try:
        with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
            json.dump(translated_data, f, indent=2, ensure_ascii=False)
        with open(TRANSLATION_CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(translation_cache, f, ensure_ascii=False, indent=2)
        print("✅ Progrès sauvegardé avec succès")
    except Exception as e:
        print(f"❌ Erreur de sauvegarde finale : {e}")

except Exception as e:
    print(f"\n💥 ERREUR FATALE : {str(e)}")
    print("Sauvegarde d'urgence en cours...")
    try:
        with open("emergency_backup.json", 'w', encoding='utf-8') as f:
            json.dump(translated_data, f, indent=2, ensure_ascii=False)
        print("⚠️ Backup créé : emergency_backup.json")
    except Exception as e:
        print(f"❌ Échec de la sauvegarde d'urgence : {e}")