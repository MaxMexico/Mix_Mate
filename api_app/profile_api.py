## Pour lancer cette API, il faut être dans la racine (Mix_Mate) et lancer la commande suivante : python -m api_app.profile_api

## Au lancement de ce code, il faut récupérer l'ip de l'api qui est la 3ème ip qui sort dans le terminal et la changer des les codes:
##          - ProfileScreen.js --> 1 fois
##          - RecoScreen.js --> 3 fois
import os
import json
from flask import Flask, request, jsonify
from recommandation_system.final_system_for_app import (
    get_CB_recommendations,
    get_FC_recommendations,  
    cocktails_df,
    latent_representations,
    reviews,                  
    cocktail_dict  
)

app = Flask(__name__)

# Définir le chemin du dossier de données et du fichier profiles.json
current_dir = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(current_dir, "data")
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)
profiles_file = os.path.join(DATA_DIR, "profiles.json")


# Fonction pour lire les profils existants
def read_profiles():
    if not os.path.exists(profiles_file):
        return []
    with open(profiles_file, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

# Fonction pour écrire la liste des profils dans le fichier
def write_profiles(profiles):
    with open(profiles_file, "w", encoding="utf-8") as f:
        json.dump(profiles, f, indent=2)

# Endpoint pour sauvegarder ou mettre à jour un profil
@app.route("/api/profile", methods=["POST"])
def save_profile():
    profile = request.get_json()
    if not profile or "username" not in profile:
        return jsonify({"error": "Le champ 'username' est requis."}), 400

    profiles = read_profiles()

    # Mettre à jour le profil existant ou ajouter le nouveau profil
    found = False
    for i, p in enumerate(profiles):
        if p.get("username") == profile["username"]:
            profiles[i] = profile
            found = True
            break
    if not found:
        profiles.append(profile)

    write_profiles(profiles)
    return jsonify({"message": "Profil sauvegardé avec succès.", "profile": profile}), 200

# (Optionnel) Endpoint pour récupérer un profil via le username
@app.route("/api/profile/<username>", methods=["GET"])
def get_profile(username):
    profiles = read_profiles()
    profile = next((p for p in profiles if p.get("username") == username), None)
    if profile:
        return jsonify(profile), 200
    else:
        return jsonify({"error": "Profil non trouvé."}), 404

@app.route("/api/get_all_profiles", methods=["GET"])
def get_all_profiles():
    profiles = read_profiles()
    return jsonify({"profiles": profiles}), 200


@app.route("/api/CB_recommendations", methods=["POST"])
def recommendations():
    data = request.get_json()
    favorite_cocktails = data.get("favoriteCocktails")
    alcoholic_preference = data.get("alcoholicPreference")
    desired_category = data.get("desiredCategory", None)
    top_n = data.get("topN", 5)
    
    if not favorite_cocktails or not alcoholic_preference:
        return jsonify({"error": "Les paramètres 'favoriteCocktails' et 'alcoholicPreference' sont requis."}), 400

    try:
        # Mesure du temps d'exécution
        import time
        start_time = time.time()
        
        recommendations_df = get_CB_recommendations(
            favorite_cocktails,
            alcoholic_preference,
            desired_category,
            cocktails_df,
            latent_representations,
            top_n
        )
        
        end_time = time.time()
        print(f"Temps d'exécution de la reco: {end_time - start_time:.2f} secondes")
        
        if recommendations_df is None:
            return jsonify({"error": "Aucune recommandation trouvée avec ces critères."}), 404

        # Affichage du résultat de la fonction de reco dans la console du serveur
        print("Réponse de la fonction de reco :")
        print(recommendations_df)
        
        recommendations_list = recommendations_df.to_dict(orient="records")
        print("JSON renvoyé:", {"recommendedDrinks": recommendations_list})
        return jsonify({"recommendedDrinks": recommendations_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/FC_recommendations", methods=["POST"])
def fc_recommendations():
    data = request.get_json()
    user_liked_cocktails = data.get("userLikedCocktails")
    alcoholic_preference = data.get("alcoholicPreference")
    desired_category = data.get("desiredCategory", None)
    top_n = data.get("topN", 5)
    
    if not user_liked_cocktails or not alcoholic_preference:
        return jsonify({"error": "Les paramètres 'userLikedCocktails' et 'alcoholicPreference' sont requis."}), 400

    try:
        import time
        start_time = time.time()
        
        recommendations_df = get_FC_recommendations(
            user_liked_cocktails,
            alcoholic_preference,
            desired_category,
            cocktails_df,
            top_n
        )
        
        end_time = time.time()
        print(f"Temps d'exécution de la reco FC: {end_time - start_time:.2f} secondes")
        
        if recommendations_df is None:
            return jsonify({"error": "Aucune recommandation trouvée avec ces critères."}), 404

        print("Réponse de la fonction de reco FC :")
        print(recommendations_df)
        
        recommendations_list = recommendations_df.to_dict(orient="records")
        print("JSON renvoyé:", {"recommendedDrinks": recommendations_list})
        return jsonify({"recommendedDrinks": recommendations_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
