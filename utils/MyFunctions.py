# libraries
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import requests
import urllib
import time
from PIL import Image
from bs4 import BeautifulSoup
import re
from plotly.subplots import make_subplots
import os


# count numeric and non-numeric
def count_num_nonNum(x, return_num_index=False, return_non_num_index=False):
    """count numeric and non-numeric values

    Args:
        x : will take a series
        return_num_index (bool, optional): will return numeric index. Defaults to False.
        return_non_num_index (bool, optional): returns non-numeric index. Defaults to False.
    """
    count = 0
    false_count = 0

    if return_num_index:
        indexes = []
        for i in x:

            try:
                int(i)
                indexes.append(count + false_count)
                count += 1
            except:
                false_count += 1
        return indexes

    elif return_non_num_index:
        indexes = []
        for i in x:

            try:
                int(i)
                count += 1
            except:
                indexes.append(count + false_count)
                false_count += 1
        return indexes

    else:
        for i in x:

            try:
                int(i)
                count += 1
            except:
                false_count += 1

        return count, false_count


# Will count all numerics for all columns
def show_counts(df):
    """Will count all numerics for all columns

    Args:
        df : Takes a DataFrame

    Returns:
        A dataframe containing all columns with 'Numeric and Non-Numeric Counts'
    """
    temp_df = pd.DataFrame()
    for i in df.columns:
        x, y = count_num_nonNum(df[i])
        temp_df.loc[
            len(temp_df),
            ["Column", "Numeric Counts", "Non-numeric Counts"],
        ] = [i, x, y]
    return temp_df


def fixing_author(x):
    # print(len(x.split('\\";')))
    a = x.split('";')
    return [a[0][:-1], a[1][:-1]]


# a function to count null values
def count_null_value(df):
    """Will return the number of null values in each column

    Args:
        df : DataFrame of your choice
    """
    print("COLUMNS".rjust(20), "| COUNTS")
    print("-".rjust(30, "-"))
    for i in df.columns:
        print(i.rjust(20), f"| {df[i].isnull().sum()}")


# pie chart will showed to check null values
def null_counts_pie_chart(series):
    """pie chart will showed to check null values

    Args:
        series : will Take pandas series

    Returns:
        fig: pie chart
    """
    temp_null_counts = series.isnull().sum()
    fig = go.Figure(
        go.Pie(
            labels=["Null Counts", "Non-Null Counts"],
            values=[temp_null_counts, len(series) - temp_null_counts],
            marker=dict(colors=["#ff0303", "#03eaff"]),
            pull=[0, 0.1],
        )
    )
    fig.update_layout(
        title="How many null values we have",
        autosize=False,
    )
    return fig


# finding years using url
def find_year_in(url, params=None, tag_name=None, param_attrs=None, return_soup=False):
    """_summary_

    Args:
        str: Will take the url
    tag_name:
        str: Name of the html tag
    param_attrs:
        dict: A dictionary of filters on attribute values in html tag
    params:
        dict: search parameter, the tag that responsible for searching
    return_soup:
        txt: will return the soup

    Returns:
        str : Will return the Required text
    """
    count = 0

    while True:
        response = requests.get(url, params=params)
        # print(response.status_code)
        if count > 6:
            time.sleep(600)
            count = 0

        if count > 3:
            print("sleeping", end=":")
            time.sleep(np.random.randint(7))
        # print(response.status_code,end=':')
        if response.status_code == 200:
            break
        else:
            count += 1

    soup = BeautifulSoup(response.content, "html.parser")

    if return_soup:
        return soup

    x = soup.find(tag_name, param_attrs)
    return x.text if x else np.nan


def clean_location(x):
    x = re.sub("[^a-zA-Z, ]", "", str(x)).split(",")  # Only allow number and underscore
    x = [i.strip() for i in x]  # Removing extra spaces
    x = list({i for i in x if len(i) > 1})  # will not consider if length is less than 2
    return x


# fetch image from url
def extract_image(isbn, url=""):
    """Extract image from the url

    Args:
        ISBN (string): pass the book ISBN
        url : 'Image-URL-L'

    Returns:
        required image
    """

    # url=book_df[book_df['ISBN']==isbn]['Image-URL-L'].values[0]
    req = urllib.request.Request(
        url,
        headers={
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
        },
    )
    img = Image.open(urllib.request.urlopen(req))
    # If image is not available
    if np.shape(img) == (1, 1):
        url = f"https://www.abebooks.com/servlet/SearchResults?kn={isbn}&sts=t&cm_sp=SearchF-_-topnav-_-Results"
        soup = find_year_in(url, return_soup=True)
        html_tag = soup.find("img", {"class": "srp-item-image"})
        return extract_image(isbn="", url=html_tag.get("src"))
    else:
        return img.resize((180, 280))


# this is a plotly visualization to show books
def show_the_books(books_dataframe, bgcolor="#363963", bordercolor="#03e6ff", title=""):
    """return pics of recommended books

    Args:
        series (pandas series): Must be series or list or tupple containing ISBN number.
        bgcolor (str, optional): hover background color. Defaults to '#363963'.
        bordercolor (str, optional): hover boarder color. Defaults to '#03e6ff'.
        title : plotly graph title which will add a header description to the image

    Returns:
        img: all images
    """

    # importing mer_rat_book.csv
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(
        script_dir, "..", "data", "processed", "mer_rat_book.csv.gz"
    )

    mer_rat_book = pd.read_csv(file_path)

    top = len(books_dataframe)

    row_count = top // 5 if top % 5 == 0 else top // 5 + 1

    fig = make_subplots(rows=row_count, cols=5)
    row = col = 1
    for i in books_dataframe:

        book_detail = mer_rat_book[mer_rat_book["ISBN"] == i].iloc[0]
        temp_image = extract_image(
            isbn=book_detail["ISBN"], url=book_detail["Image-URL-L"]
        )
        img_shp = np.array(temp_image).shape

        fig.add_bar(
            opacity=0,
            x=[img_shp[1] / 2],
            y=[img_shp[0]],
            width=img_shp[1],
            hovertemplate="<br><b>".join(
                [
                    f"<b>Title:</b> {book_detail['Book-Title']}",
                    f"ISBN:</b> {i}",
                    f"Ratings:</b>⭐ {book_detail['Book-Rating']}",
                    f"Author:</b> {book_detail['Book-Author']}",
                    f"Year:</b> {book_detail['Year-Of-Publication']}",
                    f"Publisher:</b> {book_detail['Publisher']}",
                    f"Reviewers:</b> {book_detail['Total-Reviewers']}",
                ]
            )
            + "<extra></extra>",
            row=row,
            col=col,
        )
        fig.add_image(
            z=temp_image,
            hoverinfo="skip",
            row=row,
            col=col,
        )
        fig.update_xaxes(
            showgrid=False,
            showticklabels=False,
            showline=False,
            row=row,
            col=col,
        )
        fig.update_yaxes(
            showgrid=False,
            showticklabels=False,
            showline=False,
            row=row,
            col=col,
        )
        if col == 5:
            row += 1
            col = 1
        else:
            col += 1

    fig.update_layout(
        title=title,
        showlegend=False,
        template="plotly_dark",
        hoverlabel=dict(bgcolor=bgcolor, bordercolor=bordercolor),
        height=500 * row_count,
        width=1250,
    )
    return fig
