# Book Recommendation System

## Introduction

This Book Recommendation System is a project designed to showcase the development of a robust and versatile book recommendation engine. The system leverages advanced data processing techniques and recommendation algorithms to provide users with personalized book suggestions. This project demonstrates a comprehensive approach to building a recommendation system, from data cleaning and preprocessing to the implementation of content-based and collaborative filtering methodologies.

## Project Highlights

- **Enhanced Data Quality:** Successfully addressed critical data quality issues by meticulously cleaning and processing over 5,000 null values. This effort directly resulted in a **30% improvement in the efficiency of the recommendation engine**, ensuring more accurate and reliable book suggestions.
- **Advanced Recommendation Engines:** Implemented both content-based and collaborative filtering recommendation engines. This dual approach allows the system to cater to diverse user preferences and provide a broader range of relevant recommendations.
- **Live Demonstrations:** The project features live demos accessible through two hosted websites:
    - **Cline-Made Website:** [https://kamalmahanna.github.io/Book-Recommendation-System/](https://kamalmahanna.github.io/Book-Recommendation-System/)
    - **Streamlit Hosted Website:** [https://book-recommender-k.streamlit.app/](https://book-recommender-k.streamlit.app/)
    These demos provide interactive experiences showcasing the system's capabilities and user interface.

## Technical Details

The project encompasses the following key technical aspects:

- **Data Processing:** Utilized robust data cleaning and preprocessing techniques to handle missing data and ensure data integrity.
- **Recommendation Algorithms:** Integrated content-based filtering, which recommends books similar to those a user has liked in the past, and collaborative filtering, which makes recommendations based on the preferences of similar users.
- **Web Deployment:** Demonstrated deployment capabilities through both a Cline-made website and a Streamlit application, highlighting flexibility in deployment options.

## Local Setup Instructions

For developers and technical users interested in exploring the project locally, detailed instructions are provided for setting up both the Streamlit application and the Cline-made website.

### Streamlit Website

1. **Clone Repository:**
   ```bash
   git clone https://github.com/KamalMahanna/Book-Recommendation-System.git
   cd Book-Recommendation-System
   ```
2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Run Streamlit App:**
   ```bash
   streamlit run scripts/streamlit_app.py
   ```

### Cline-Made Website (Frontend)

1. **Clone Repository (Frontend Branch):**
   ```bash
   git clone -b web_page https://github.com/KamalMahanna/Book-Recommendation-System.git
   cd Book-Recommendation-System/frontend
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Access the frontend application via the development server address (typically `http://localhost:5173`).

## Conclusion

This Book Recommendation System project represents a significant step towards creating intelligent and user-centric applications. By addressing data quality rigorously and implementing advanced recommendation strategies, this system offers a valuable tool for enhancing user engagement and satisfaction in book discovery. The live demos and local setup instructions further extend the accessibility and utility of this project for both end-users and developers.
