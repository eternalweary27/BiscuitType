Biscuit Type - a Speed Typing Website inspired by Bisqwit's DOS Game WSpeed. 

![image](https://github.com/eternalweary27/BiscuitType/assets/99358134/6c59c2b2-cedf-4531-a03f-8ba9342d1850)

Firstly, install all the requirements:

```
pip install -r requirements.txt
```

Replace `None` and set your own flask secret key in app.py:

```
class Config:
    SECRET_KEY = None;
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + "database/database.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
```

Replace `None` and set your own gmail address and email secret key in api/auth.py:
This is for the password recovery feature.

```
email_service = EmailService(None, None)
```

Start the flask application at http://127.0.0.1:5000/:

```
python app.py
```
