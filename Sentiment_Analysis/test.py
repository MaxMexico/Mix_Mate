from textblob import TextBlob
from textblob.sentiments import NaiveBayesAnalyzer

text = "I hate this cocktail, it's awful!"
text2 = "I love this cocktail, my car is green!"
text3 = "Wonderful cocktail, the lime really balances the flavor."

#TEST 1
blob = TextBlob(text, analyzer=NaiveBayesAnalyzer())
blob2 = TextBlob(text2,analyzer=NaiveBayesAnalyzer())
blob3 = TextBlob(text3,analyzer=NaiveBayesAnalyzer())
print(blob.sentiment)  
print(blob2.sentiment)
print(blob3.sentiment)


#TEST 2
blob4 = TextBlob(text)
blob5 = TextBlob(text2)
blob6 = TextBlob(text3)

print(blob4.sentiment)  
print(blob5.sentiment)
print(blob6.sentiment)