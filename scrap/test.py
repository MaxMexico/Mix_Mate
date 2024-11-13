list_of_pages_vic = []
list_of_pages_max = []
list_of_pages_art = []

prefix = 'https://www.diffordsguide.com/cocktails/search?s=1&isrc=browse&ificm=1&ifipp=1&g%5Bdg%5D=1&g%5Bdd%5D=1&gid=all&na=1&so=name&p='
firstpage = 'https://www.diffordsguide.com/cocktails/search?s=1&isrc=browse&ificm=1&ifipp=1&g%5Bdg%5D=1&g%5Bdd%5D=1&gid=all&na=1&so=name&p=%2Fcocktails%2Fsearch'
list_of_pages_vic.append(firstpage)

for i in range(2, 208):
    page = prefix+str(i)
    list_of_pages_vic.append(page)

for i in range(208, 414):
    page = prefix+str(i)
    list_of_pages_max.append(page)

for i in range(414, 623):
    page = prefix+str(i)
    list_of_pages_art.append(page)

print(len(list_of_pages_vic))
print(len(list_of_pages_max))
print(len(list_of_pages_art))

print(list_of_pages_vic[0],list_of_pages_vic[-1])
print(list_of_pages_max[0],list_of_pages_max[-1])    
print(list_of_pages_art[0],list_of_pages_art[-1])


