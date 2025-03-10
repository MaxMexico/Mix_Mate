import pandas as pd 
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

cocktails_df = pd.read_csv('./api_cocktails/all_cocktails_with_ratings.csv')


########################################### Data  Preparation ###########################################

cocktails_df.drop(columns=['strDrinkAlternate','strTags','strVideo', 'strDrinkThumb','strImageSource','strImageAttribution','strCreativeCommonsConfirmed','dateModified', 'strIngredient13', 'strIngredient14', 'strIngredient15', 'strMeasure13','strMeasure14', 'strMeasure15'], inplace=True)

cocktails_df['combined_column'] = cocktails_df.apply(lambda row: ' '.join(row.dropna().astype(str)), axis=1)

#### Creation of the TF-IDF matrix
cocktails_df1 = cocktails_df['combined_column'].fillna('')
tfidfs=TfidfVectorizer(stop_words='english')
tf_matrice=tfidfs.fit_transform(cocktails_df1)

cosine_sim=cosine_similarity(tf_matrice,tf_matrice)

indices = pd.Series(cocktails_df.index, index=cocktails_df['strDrink']).drop_duplicates()

########################################### Recommandation System ###########################################
def recommander(name):
    idx=indices[name]
    sim_score=list(enumerate(cosine_sim[idx]))
    sim_score=sorted(sim_score,key=lambda x: x[1], reverse=True)
    # Only get the scores of the 5 most similar cocktails
    sim_score=sim_score[1:6]
    print(sim_score)
    # Get the cocktails indices
    cocktail_indice=[i[0] for i in sim_score]
    # Return the cocktail names
    cocktail_names = cocktails_df['strDrink'].iloc[cocktail_indice]
    return cocktail_names

# Calling the function for Gin Tonic
reco_list = recommander('Gin Tonic')
print(reco_list)


