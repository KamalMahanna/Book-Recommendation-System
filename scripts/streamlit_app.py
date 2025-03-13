# adding path to user defined modules
import sys
import os

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(script_dir, "..", "utils"))

from PIL import Image
import numpy as np
import streamlit as st
from streamlit_option_menu import option_menu
import pandas as pd
from MyFunctions import extract_image
import streamlit.components.v1 as components
from streamlit_image_select import image_select


from BookRecommender import (
    corr_recommend,
    recommend_popular_books,
    content_based_recommendation,
)


# Set up the page layout
st.set_page_config(layout="wide")

# Create a horizontal menu
selected = option_menu(
    menu_title=None,  # Hide the menu title
    options=["Home", "About"],  # Menu options
    icons=[
        "house",
        "info-circle",
    ],  # Icons for each menu option
    menu_icon="cast",  # Main menu icon
    default_index=0,  # Default selected option
    orientation="horizontal",  # Horizontal menu
)


# importing csv file
mer_rat_book = pd.read_csv(
    os.path.join(script_dir, "..", "data", "processed", "mer_rat_book.csv.gz")
)


# Content for each menu option
if selected == "Home":

    st.title(
        "Book Recommender System",
    )

    # slider to adjust no of recommended books
    n = st.slider(
        "No of recommendations you want",
        min_value=1,
        max_value=30,
        step=1,
        value=5,
    )

    # if user want to search with Book Name or ISBN Name
    search_type = st.radio("Search By :", ["Book Name", "ISBN"], index=0)

    if search_type == "Book Name":

        selected_book_name = st.selectbox(
            "",
            mer_rat_book["Book-Title"].unique(),
            index=None,
            placeholder="Choose a Book",
        )

        if selected_book_name:

            # fetching all the book's details with same name
            book_details = mer_rat_book[
                mer_rat_book["Book-Title"] == selected_book_name
            ]
            # no of books
            no_of_books = book_details.shape[0]

            if no_of_books > 1:

                st.write("More than one book found with the same book name")
                # Asking for right book
                book_idx = image_select(
                    label="Select by ISBN",
                    images=[
                        np.array(
                            Image.open(
                                os.path.join(
                                    script_dir,
                                    "..",
                                    "data",
                                    "others",
                                    "blank.png",
                                )
                            ).convert("RGB")
                        )
                    ]
                    + [
                        extract_image(
                            isbn=book_details.iloc[i]["ISBN"],
                            url=book_details.iloc[i]["Image-URL-L"],
                        )
                        for i in range(no_of_books)
                    ],
                    captions=["None"]
                    + [book_details.iloc[j]["ISBN"] for j in range(no_of_books)],
                    return_value="index",
                    use_container_width=False,
                    index=0,
                )

                if book_idx != 0:
                    # storing the selected book
                    st.session_state["book_details"] = book_details.iloc[book_idx - 1]

            else:
                # selecting first row
                st.session_state["book_details"] = book_details.iloc[0]

    elif search_type == "ISBN":

        book_isbn = st.selectbox(
            "",
            mer_rat_book["ISBN"].unique(),
            index=None,
            placeholder="Choose a Book",
        )
        if book_isbn:
            st.session_state["book_details"] = mer_rat_book[
                mer_rat_book["ISBN"] == book_isbn
            ].iloc[0]

    # continue after getting the book details
    if "book_details" in st.session_state:

        # Create two columns
        image_col, book_details_col = st.columns(2)

        with image_col:
            st.image(
                extract_image(
                    isbn=st.session_state["book_details"]["ISBN"],
                    url=st.session_state["book_details"]["Image-URL-L"],
                ),
                # use_column_width=True,
            )
        with book_details_col:

            st.write(f"**Title:** {st.session_state['book_details']['Book-Title']}")
            st.write(f"**ISBN:** {st.session_state['book_details']['ISBN']}")
            st.write(
                f"**Ratings:** ⭐ {st.session_state['book_details']['Book-Rating']}"
            )
            st.write(f"**Author:** {st.session_state['book_details']['Book-Author']}")
            st.write(
                f"**Year:** {st.session_state['book_details']['Year-Of-Publication']}"
            )
            st.write(f"**Publisher:** {st.session_state['book_details']['Publisher']}")
            st.write(
                f"**Reviewers:** {st.session_state['book_details']['Total-Reviewers']}"
            )

        st.markdown(
            f'<h3>Recommending books for <span style="color:#bf0202;">{st.session_state["book_details"]["Book-Title"]}</span></h3>',
            unsafe_allow_html=True,
        )

        # recommending books
        corr_fig = corr_recommend(st.session_state["book_details"]["ISBN"], n)

        if corr_fig:
            st.plotly_chart(corr_fig)

        con_fig = content_based_recommendation(
            st.session_state["book_details"]["ISBN"], n
        )

        if con_fig:
            st.plotly_chart(con_fig)

        st.plotly_chart(
            recommend_popular_books(n, "Explore Most Popular Book Of All Time.😇")
        )


# st.write(selected_book)

elif selected == "About":
    st.title("Insights")

    script_dir = os.path.dirname(os.path.abspath(__file__))
    charts_dir = os.path.join(script_dir, "..", "Charts")

    # Function to embed HTML charts
    def embed_chart(filename, description):
        st.write(f"**{description}**")
        with open(os.path.join(charts_dir, filename), "r", encoding="utf-8") as f:
            html_string = f.read()
        components.html(html_string, height=500, scrolling=True)

    # Embed charts in a specific order with descriptions
    embed_chart(
        "famous_books.html",
        "Most Famous Books: This chart highlights the books that are most widely recognized and appreciated within the dataset. It ranks books based on a combination of their average rating and the total number of ratings received. Books appearing higher on this chart are not only rated favorably on average but also have been rated by a significant number of users, indicating broad appeal and recognition.",
    )
    embed_chart(
        "year_when_most_books.html",
        "Year When Most Books Were Published: This visualization shows the distribution of book publication years and pinpoints the year in which the largest number of books in our dataset were published. This can reflect trends in the publishing industry, highlight periods of significant literary output, or potentially indicate biases in our data collection if certain periods are over-represented.",
    )
    embed_chart(
        "centuries_with_most_books.html",
        "Centuries With Most Books: To understand longer-term trends in book publishing, this chart aggregates publication years by century. By looking at centuries instead of individual years, we smooth out year-to-year variations and reveal broader historical patterns in when books were published. This helps identify centuries that were particularly prolific in terms of book production in our dataset.",
    )
    embed_chart(
        "authoer_with_most_books.html",
        "Author With Most Books: This chart identifies the authors who have the largest number of books listed in our dataset. It showcases the most prolific writers contributing to this collection, giving insights into authorship trends and highlighting authors with extensive bodies of work represented.",
    )
    embed_chart(
        "Publisher_with_most_books.html",
        "Publisher With Most Books: Understanding the publishing landscape is crucial. This chart displays the publishers who have released the highest number of books in the dataset. It helps identify major publishing houses and their relative contribution to the collection, offering a view of the key players in the book publishing industry represented in our data.",
    )
    embed_chart(
        "age_group_reading_books.html",
        "Age Group Reading Books: To understand reader demographics, this chart visualizes the distribution of readers across different age groups. It reveals which age segments are most active in reading and rating books within our dataset, providing valuable demographic insights for targeted recommendations or marketing.",
    )
    embed_chart(
        "users_from_different_country.html",
        "Users From Different Countries: This chart illustrates the geographical distribution of users contributing to the dataset. By showing the number of users from different countries, we gain insights into the global reach and diversity of the user base for this book rating system.",
    )
    embed_chart(
        "user_id_with_given_ratings.html",
        "User ID With Given Ratings: This visualization explores user rating behavior by showing the distribution of the number of ratings given by each user ID. It can help identify users who are highly active raters or those who contribute more extensively to the rating data, potentially highlighting power users or different rating patterns.",
    )
    embed_chart(
        "most_given_ratings.html",
        "Most Given Ratings: Analyzing the distribution of rating values themselves can reveal overall sentiment trends. This chart shows the frequency of each rating score given by users. It helps understand the general distribution of opinions – whether ratings tend to be positive, negative, or neutral on average within the dataset.",
    )
    embed_chart(
        "null_year_before_scrapping.html",
        "Null Year Before Scrapping: In data quality assessment, it's important to understand missing data. This chart quantifies the number of books that had missing publication year information *before* our data cleaning or scraping processes. It serves as a baseline measure of data completeness for publication years.",
    )
    embed_chart(
        "null_year_after_scrapping.html",
        "Null Year After Scrapping: Following data cleaning efforts, this chart shows the number of books with missing publication years *after* the cleaning or scraping stage. By comparing this to the 'Null Year Before Scrapping' chart, we can evaluate the effectiveness of our data cleaning in improving the completeness of publication year data.",
    )
