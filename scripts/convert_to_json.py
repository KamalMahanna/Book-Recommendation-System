import joblib
import pandas as pd
import numpy as np
import json


src_dir = "../data/processed/"
dst_dir = "../frontend/src/data/"


mer_rat_book  = pd.read_csv(src_dir + "mer_rat_book.csv.gz",index_col="ISBN")
mer_rat_book.T.to_json(dst_dir+"books_data.json",indent=2)


popular_book = pd.read_csv(src_dir+'popular_books.csv')
popular_book['ISBN'].to_json(path_or_buf=dst_dir+"popular_books.json" ,orient='values',indent=2)


dict_cont_rec= joblib.load(src_dir+"cont_rec.joblib.z")
# Convert numpy arrays to lists
dict_cont_rec_list = {k: v.tolist()[:5] for k, v in dict_cont_rec.items()}
dict_cont_rec_json = json.dumps(dict_cont_rec_list,indent=2)
with open(dst_dir+"cont_rec.json", "w") as f:
    f.write(dict_cont_rec_json)


corr_rec_dict = joblib.load(src_dir+"corr_rec_dict.joblib.z")
corr_rec_dict_list = {k: list(v)[:5] for k, v in corr_rec_dict.items()}
corr_rec_dict_list_json = json.dumps(corr_rec_dict_list,indent=2)
with open(dst_dir+"corr_rec_dict.json", "w") as f:
    f.write(corr_rec_dict_list_json)
