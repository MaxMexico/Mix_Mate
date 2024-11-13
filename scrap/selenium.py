from requests_html import HTMLSession

# Création d'une session
session = HTMLSession()

# Requête vers la page
response = session.get("https://www.diffordsguide.com/forum/ZjaQj8")

# Rendu de la page pour exécuter le JavaScript
response.html.render(sleep=2)  # Ajoute un délai pour permettre le chargement complet

cocktails = []
for cocktail in response.html.find("h3.link-box__title"):
    cocktails.append(cocktail.text)

# Initialisation des listes pour stocker les noms d'utilisateur et les commentaires
user_comments = []

# Sélection des divs contenant chaque commentaire complet
for comment_block in response.html.find("div.comment"):
    # Extraction du nom d'utilisateur
    user = comment_block.find("a.user-card-inline__name", first=True)
    # Extraction du texte du commentaire
    comment = comment_block.find("div.comment__body", first=True)

    # Vérification que les deux éléments existent avant de les ajouter à la liste
    if user and comment:
        user_comments.append({
            "user": user.text.strip(),
            "comment": comment.text.strip()
        })

# Affichage des résultats
print(f"Cocktail: {cocktails}")
for item in user_comments:
    print(f"User: {item['user']}")
    print(f"Comment: {item['comment']}")
    print("-" * 40)
