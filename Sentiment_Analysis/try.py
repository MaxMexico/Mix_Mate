import json
import uuid
from textblob import TextBlob

def assign_unique_ids(data):
    """Attribue des IDs uniques aux utilisateurs dans les commentaires."""
    user_to_id = {}
    for cocktail in data:
        for review in cocktail.get("reviews", []):
            user = review.get("user")
            if user not in user_to_id:
                user_to_id[user] = str(uuid.uuid4())
            review["user_id"] = user_to_id[user]
    return data

def sentiment_to_score(sentiment):
    """Convertit un score de sentiment en une note sur 5 avec des intervalles de 0.5."""
    # Les valeurs de sentiment de TextBlob varient de -1 à 1.
    score = (sentiment + 1) * 2.5  # Ramène la plage à [0, 5].
    return round(score * 2) / 2  # Arrondit au multiple de 0.5.

def analyze_sentiments(data):
    """Analyse les sentiments des commentaires et attribue une note sur 5."""
    for cocktail in data:
        for review in cocktail.get("reviews", []):
            comment = review.get("comment", "")
            sentiment = TextBlob(comment).sentiment.polarity
            review["sentiment_score"] = sentiment_to_score(sentiment)
    return data

# Charger les données JSON
with open("Sentiment_Analysis/cocktails_with_reviews.json", "r", encoding="utf-8") as file:
    cocktails_data = json.load(file)

# Étape 1 : Attribuer des IDs uniques
cocktails_data = assign_unique_ids(cocktails_data)

# Étape 2 : Analyse de sentiments
cocktails_data = analyze_sentiments(cocktails_data)

# Sauvegarder les résultats dans un nouveau fichier
with open("Sentiment_Analysis/cocktails_with_reviews_updated.json", "w", encoding="utf-8") as file:
    json.dump(cocktails_data, file, ensure_ascii=False, indent=4)

print("Les IDs uniques ont été assignés et les scores de sentiment calculés.")
