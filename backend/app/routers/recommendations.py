from fastapi import APIRouter, HTTPException
import pandas as pd
import joblib
from pathlib import Path
import os

router = APIRouter()

# Get the base directory path
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent

# Load the necessary data files
try:
    # Load popular books
    popular_books = pd.read_csv(BASE_DIR / "data/processed/popular_books.csv")
    
    # Load correlation recommendations dictionary
    corr_rec_dict = joblib.load(BASE_DIR / "data/processed/corr_rec_dict.joblib.z")
    
    # Load content-based recommendations
    cont_rec = joblib.load(BASE_DIR / "data/processed/cont_rec.joblib.z")
    
    # Load merged ratings and books data
    mer_rat_book = pd.read_csv(BASE_DIR / "data/processed/mer_rat_book.csv.gz")

except Exception as e:
    print(f"Error loading data files: {e}")
    raise

@router.get("/popular")
async def get_popular_books(top: int = 5):
    """Get most popular books"""
    try:
        books = popular_books.head(top)
        result = []
        for _, book in books.iterrows():
            book_details = mer_rat_book[mer_rat_book['ISBN'] == book['ISBN']].iloc[0]
            result.append({
                "isbn": str(book_details['ISBN']),
                "title": str(book_details['Book-Title']),
                "author": str(book_details['Book-Author']),
                "year": int(book_details['Year-Of-Publication']),
                "publisher": str(book_details['Publisher']),
                "image_url": str(book_details['Image-URL-L']),
                "rating": float(book_details['Book-Rating']),
                "total_reviewers": int(book_details['Total-Reviewers'])
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/correlation/{isbn}")
async def get_correlation_recommendations(isbn: str, top: int = 5):
    """Get book recommendations based on correlation"""
    try:
        if isbn not in corr_rec_dict:
            raise HTTPException(status_code=404, detail="ISBN not found")
        
        result = []
        recommended_isbns = corr_rec_dict[isbn]
        
        # Iterate through recommendations until we have enough valid ones
        for rec_isbn in recommended_isbns:
            try:
                # Check if book exists in merged data
                book_matches = mer_rat_book[mer_rat_book['ISBN'] == rec_isbn]
                if not book_matches.empty:
                    book_details = book_matches.iloc[0]
                    result.append({
                        "isbn": str(book_details['ISBN']),
                        "title": str(book_details['Book-Title']),
                        "author": str(book_details['Book-Author']),
                        "year": int(book_details['Year-Of-Publication']),
                        "publisher": str(book_details['Publisher']),
                        "image_url": str(book_details['Image-URL-L']),
                        "rating": float(book_details['Book-Rating']),
                        "total_reviewers": int(book_details['Total-Reviewers'])
                    })
                    
                    # Break if we have enough recommendations
                    if len(result) >= top:
                        break
            except Exception as e:
                print(f"Error processing recommendation for ISBN {rec_isbn}: {e}")
                continue
        return result
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/content/{isbn}")
async def get_content_based_recommendations(isbn: str, top: int = 5):
    """Get book recommendations based on content similarity"""
    try:
        if isbn not in cont_rec:
            raise HTTPException(status_code=404, detail="ISBN not found")
        
        recommended_isbns = cont_rec[isbn][:top]
        result = []
        for rec_isbn in recommended_isbns:
            book_details = mer_rat_book[mer_rat_book['ISBN'] == rec_isbn].iloc[0]
            result.append({
                "isbn": str(book_details['ISBN']),
                "title": str(book_details['Book-Title']),
                "author": str(book_details['Book-Author']),
                "year": int(book_details['Year-Of-Publication']),
                "publisher": str(book_details['Publisher']),
                "image_url": str(book_details['Image-URL-L']),
                "rating": float(book_details['Book-Rating']),
                "total_reviewers": int(book_details['Total-Reviewers'])
            })
        return result
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search")
async def search_books(query: str, limit: int = 10):
    """Search books by title or ISBN"""
    try:
        # Search in titles (case-insensitive)
        title_matches = mer_rat_book[
            mer_rat_book['Book-Title'].str.contains(query, case=False, na=False)
        ]
        
        # Search in ISBNs
        isbn_matches = mer_rat_book[
            mer_rat_book['ISBN'].str.contains(query, case=False, na=False)
        ]
        
        # Combine results
        results = pd.concat([title_matches, isbn_matches]).drop_duplicates()
        
        # Convert to list of dictionaries
        books = []
        for _, book in results.head(limit).iterrows():
            books.append({
                "isbn": str(book['ISBN']),
                "title": str(book['Book-Title']),
                "author": str(book['Book-Author']),
                "year": int(book['Year-Of-Publication']),
                "publisher": str(book['Publisher']),
                "image_url": str(book['Image-URL-L']),
                "rating": float(book['Book-Rating']),
                "total_reviewers": int(book['Total-Reviewers'])
            })
        return books
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
