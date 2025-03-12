import os
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

# Définir le chemin du dossier de données et du fichier profiles.json
DATA_DIR = os.path.join(os.getcwd(), "data")
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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
