from flask import Flask, request, jsonify
from recommandation_system.final_system_for_app import (
    get_recommendations_for_user,
    cocktails_df,
    latent_representations
)

app = Flask(__name__)

@app.route('/api/recommendations', methods=['POST'])
def recommendations():
    # Récupérer le JSON envoyé par le client
    data = request.get_json()
    
    # Récupération des paramètres attendus :
    # - userCocktailIds : liste d'IDs de cocktails que l'utilisateur a aimés
    # - alcoholicPreference : chaîne indiquant "Alcoholic" ou "Non Alcoholic"
    # - desiredCategory : optionnel (ex. "Shot")
    # - topN : optionnel, nombre de recommandations souhaitées (défaut 5)
    user_cocktail_ids = data.get("userCocktailIds")
    alcoholic_preference = data.get("alcoholicPreference")
    desired_category = data.get("desiredCategory", None)
    top_n = data.get("topN", 5)
    
    # Vérification que les paramètres essentiels sont présents
    if not user_cocktail_ids or not alcoholic_preference:
        return jsonify({"error": "Les paramètres 'userCocktailIds' et 'alcoholicPreference' sont requis."}), 400

    try:
        # Appel de la fonction de recommandation importée
        recommendations_df = get_recommendations_for_user(
            user_cocktail_ids,
            alcoholic_preference,
            desired_category,
            cocktails_df,
            latent_representations,
            top_n
        )
        
        if recommendations_df is None:
            return jsonify({"error": "Aucune recommandation trouvée avec ces critères."}), 404
        
        # Conversion du DataFrame en liste de dictionnaires
        recommendations_list = recommendations_df.to_dict(orient="records")
        
        # Imprimer dans le terminal le JSON renvoyé
        response_json = {"recommendedDrinks": recommendations_list}
        print("JSON renvoyé:", response_json)
        
        return jsonify(response_json)
    
    except Exception as e:
        # En cas d'erreur, renvoyer le message d'erreur avec le code 500
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Lancement du serveur Flask sur le port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
