from requests_html import HTMLSession

# Création d'une session
session = HTMLSession()

# Requête vers la page
response = session.get("https://www.diffordsguide.com/forum/ZjaQj8")

# Rendu de la page pour exécuter le JavaScript
response.html.render(sleep=2)  # Ajoute un délai pour permettre le chargement complet

# Extraction des éléments avec CSS Selectors
cocktails = []
for cocktail in response.html.find("h3.link-box__title"):
    cocktails.append(cocktail.text)

comments = []
for comment in response.html.find("div.comment__body"):
    comments.append(comment.text)

user_names = []
for user in response.html.find("a.user-card-inline__name"): 
    user_names.append(user.text)

# Affichage des résultats
for cocktail, comment in zip(cocktails, comments):
    print(f"Cocktail: {cocktail}")
    print(f"Comment: {comment}")
    print(f"User name: {user_names}")
    print("-" * 40)