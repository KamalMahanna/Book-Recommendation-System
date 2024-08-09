import sys

sys.path.append("../utils")

import pandas as pd
from MyFunctions import find_year_in


book_df = pd.read_csv("../data/processed/book_df_before_scrapping.csv")


# Iterating through 'Year-Of-Publication' column having 0 values
for i in book_df[book_df["Year-Of-Publication"] == 0].index:
    print(i, end=":")
    url = f"https://www.abebooks.com/servlet/SearchResults?kn={book_df.loc[i,'ISBN']}&sts=t&cm_sp=SearchF-_-topnav-_-Results"
    book_df.loc[i, "Year-Of-Publication"] = int(
        find_year_in(url, None, "span", {"class": "opt-publish-date"})
    )


# If the website is not listed with a year of publication, our code will return null.

# So again scrapping from another website

for i in book_df[book_df["Year-Of-Publication"].isnull()].index:
    x = find_year_in(
        "https://www.goodreads.com/search",
        {"q": f"{book_df.loc[i,'ISBN']}"},
        "p",
        {"data-testid": "publicationInfo"},
    )
    try:
        book_df.loc[i, "Year-Of-Publication"] = int(x[-4:])
    except:
        book_df.loc[i, "Year-Of-Publication"] = np.nan


# Scrapping from another source but the website is not responding properly

# temp_df=pd.DataFrame(columns=['SBIN','Year'])

# count=0
# for i in book_df[book_df['Year-Of-Publication'].isnull()].index[1:]:

#     x=find_year_in( f"https://booksrun.com/search/{book_df.loc[i,'ISBN']}?buy=rent&searchBy=Title",return_soup=True)
#     if x.find('span',class_='text-black-400', text='Publication date:'):
#         year_txt=x.find('span',class_='text-black-400', text='Publication date:').find_next_sibling('span').text
#         temp_df.loc[i,'ISBN']= book_df.loc[i,'ISBN']
#         temp_df.loc[i,'Year']= year_txt
#         count+=1
#         print(count)


# dumping csv file
book_df.to_csv("../data/processed/new_cleaned.csv", index=False)
