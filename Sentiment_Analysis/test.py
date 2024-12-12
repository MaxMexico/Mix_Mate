from textblob import TextBlob

text = "I hate this cocktail, it's awful!"
text2 = "I love this cocktail, my car is green!"

blob = TextBlob(text)
blob2 = TextBlob(text2)
print(blob.sentiment)  # Sentiment(polarity=0.75, subjectivity=0.6)
print(blob2.sentiment)
