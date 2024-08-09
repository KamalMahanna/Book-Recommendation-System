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
