import json
import uuid
from textblob import TextBlob
from textblob.sentiments import NaiveBayesAnalyzer

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

def sentiment_to_score(sentiment, subjectivity):
    """Convertit un score de sentiment en une note sur 5 avec ajustement basé sur la subjectivité."""
    score = (sentiment + 1) * 2.5  # Convertit [-1,1] en [0,5]

    # Bonus/malus basé sur la subjectivité (phrases très neutres ont moins de poids)
    if subjectivity > 0.7:  
        score += 0.2  # Accentuer les sentiments forts
    elif subjectivity < 0.3:
        score -= 0.2  # Réduire l'impact des phrases neutres

    # Assurer que la note reste entre 0 et 5
    score = max(0, min(score, 5))

    return round(score * 2) / 2  # Arrondi au 0.5 le plus proche

def analyze_sentiments(data):
    """Analyse les sentiments des commentaires et attribue une note sur 5 en combinant plusieurs méthodes."""
    for cocktail in data:
        for review in cocktail.get("reviews", []):
            comment = review.get("comment", "")
            blob = TextBlob(comment)
            sentiment = blob.sentiment.polarity
            subjectivity = blob.sentiment.subjectivity

            # Option d'intégrer aussi le NaiveBayesAnalyzer
            # blob_nb = TextBlob(comment, analyzer=NaiveBayesAnalyzer())
            # classification = blob_nb.sentiment.classification
            # Proba négative si `neg`, sinon on garde polarity.
            # if classification == 'neg':
            #     sentiment = -abs(sentiment)  

            review["sentiment_score"] = sentiment_to_score(sentiment, subjectivity)
    return data

# Charger les données JSON
with open("./Sentiment_Analysis/cocktails_with_reviews.json", "r", encoding="utf-8") as file:
    cocktails_data = json.load(file)

# Étape 1 : Attribuer des IDs uniques
cocktails_data = assign_unique_ids(cocktails_data)

# Étape 2 : Analyse de sentiments améliorée
cocktails_data = analyze_sentiments(cocktails_data)

# Sauvegarder les résultats dans un nouveau fichier
with open("./Sentiment_Analysis/final_sentiment_analysis.json", "w", encoding="utf-8") as file:
    json.dump(cocktails_data, file, ensure_ascii=False, indent=4)

print("Les IDs uniques ont été assignés et les scores de sentiment calculés avec amélioration.")
