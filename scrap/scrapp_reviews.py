from requests_html import HTMLSession
import time
import json

list_of_pages_vic = []
list_of_pages_max = []
list_of_pages_art = []

prefix = 'https://www.diffordsguide.com/cocktails/search?s=1&isrc=browse&ificm=1&ifipp=1&g%5Bdg%5D=1&g%5Bdd%5D=1&gid=all&na=1&so=name&p='
firstpage = 'https://www.diffordsguide.com/cocktails/search?s=1&isrc=browse&ificm=1&ifipp=1&g%5Bdg%5D=1&g%5Bdd%5D=1&gid=all&na=1&so=name&p=%2Fcocktails%2Fsearch'
list_of_pages_vic.append(firstpage)

for i in range(2, 222):
    page = prefix+str(i)
    list_of_pages_vic.append(page)

for i in range(222, 442):
    page = prefix+str(i)
    list_of_pages_max.append(page)

for i in range(442, 663):
    page = prefix+str(i)
    list_of_pages_art.append(page)
    
#print(len(list_of_pages_vic))
#print(len(list_of_pages_max))
#print(len(list_of_pages_art))

#print(list_of_pages_vic[0],list_of_pages_vic[-1])
#print(list_of_pages_max[0],list_of_pages_max[-1])    
#print(list_of_pages_art[0],list_of_pages_art[-1])




# Création d'une session
session = HTMLSession()

# Initialisation de la liste pour stocker les données de tous les cocktails
cocktail_data = []

# Compteur pour suivre la progression
counter = 0


for page_url in list_of_pages_vic:
    print(f"Traitement de la page : {page_url}")
    try:
        response = session.get(page_url)
        response.html.render(sleep=2)
    except Exception as e:
        print(f"Erreur lors de la récupération de la page {page_url} : {e}")
        continue  # Passe à la page suivante en cas d'erreur

    # Recherche de tous les cocktails sur la page
    cocktail_elements = response.html.find('h3.link-box__title')

    for cocktail_element in cocktail_elements:
        try:
            # Extraction du nom et du lien vers la page de détails du cocktail
            a_tag = cocktail_element.find('a', first=True)
            if a_tag:
                cocktail_name = a_tag.text.strip()
                cocktail_link = a_tag.attrs['href']
                cocktail_url = 'https://www.diffordsguide.com' + cocktail_link

                # Visite de la page de détails du cocktail
                cocktail_response = session.get(cocktail_url)
                cocktail_response.html.render(sleep=2)

                # Recherche du lien vers la page des commentaires
                comment_link_div = cocktail_response.html.find('div.margin-top-half', first=True)
                if comment_link_div:
                    a_tag = comment_link_div.find('a', first=True)
                    if a_tag and 'href' in a_tag.attrs:
                        comments_link = a_tag.attrs['href']
                        comments_url = 'https://www.diffordsguide.com' + comments_link

                        # Visite de la page des commentaires
                        comments_response = session.get(comments_url)
                        comments_response.html.render(sleep=2)

                        # Initialisation de la liste pour stocker les commentaires de ce cocktail
                        user_comments = []

                        # Recherche de tous les blocs de commentaires
                        comment_blocks = comments_response.html.find("div.comment")
                        comment_counter = 0

                        for comment_block in comment_blocks:
                            # Extraction du nom d'utilisateur et du texte du commentaire
                            user = comment_block.find("a.user-card-inline__name", first=True)
                            comment = comment_block.find("div.comment__body", first=True)
                            if user and comment:
                                user_comments.append({
                                    "user": user.text.strip(),
                                    "comment": comment.text.strip()
                                })
                                comment_counter += 1

                        # Ajout du cocktail et de ses commentaires à la liste des données
                        cocktail_data.append({
                            "cocktail": cocktail_name,
                            "comments": user_comments
                        })

                        # Mise à jour du compteur et affichage de la progression
                        counter += 1
                        print(f"Traitement du cocktail {counter} : {cocktail_name} avec {len(user_comments)} commentaires.")

                    else:
                        print(f"Aucun lien de commentaires trouvé pour {cocktail_name}")
                else:
                    print(f"Aucune section de commentaires trouvée pour {cocktail_name}")

                # Délai avant la prochaine requête pour éviter le blocage
                time.sleep(2)

            else:
                print("Aucun lien trouvé pour un élément de cocktail")
                continue

        except Exception as e:
            print(f"Une erreur est survenue lors du traitement de {cocktail_name} : {e}")
            continue

# Écriture des données dans un fichier JSON correctement structuré
with open('cocktails_comments.json', 'w', encoding='utf-8') as f:
    json.dump(cocktail_data, f, ensure_ascii=False, indent=4)
