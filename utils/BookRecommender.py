# importing necessary modules
# adding path to user defined modules
import sys
import os
import pandas as pd
import joblib

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

sys.path.append(os.path.join(script_dir, "..", "utils"))

from MyFunctions import show_the_books


# for recommending popular books
def recommend_popular_books(top=5, title="Most Popular Books Of All Time"):
    """For new users, recommend the most popular books

    Args:
        top (int): No of recommended books.

    """
    # reading popular book csv file
    file_path = os.path.join(script_dir, "..", "data", "processed", "popular_books.csv")

    popular_books = pd.read_csv(file_path)

    return show_the_books(popular_books["ISBN"][:top], title=title)


# for correlation recommendation
def corr_recommend(isbn, top=5):

    try:

        # Construct the path to the dict file
        file_path = os.path.join(
            script_dir,
            "..",
            "data",
            "processed",
            "corr_rec_dict.joblib.z",
        )

        corr_rec_dict = joblib.load(file_path)

        return show_the_books(
            corr_rec_dict[isbn][:top],
            bgcolor="#103809",
            bordercolor="#28fc03",
            title="Similar Books",
        )

    except:
        return None


# 3. content based recommendation systemm
def content_based_recommendation(isbn, top=5):

    try:
        # Construct the path to the dict file
        file_path = os.path.join(
            script_dir, "..", "data", "processed", "cont_rec.joblib.z"
        )

        cont_rec = joblib.load(file_path)

        return show_the_books(
            cont_rec[isbn][:top],
            bgcolor="#454108",
            bordercolor="#fcec03",
            title="Books With Similar Content",
        )

    except:
        return None
