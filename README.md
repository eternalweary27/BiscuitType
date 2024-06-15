Biscuit Type - a Speed Typing Website inspired by Bisqwit's DOS Game WSpeed. 

![alt text](image.png)

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

Replace 'None' and set your own gmail address and email secret key in api/auth.py:
This is for the password recovery feature.

```
email_service = EmailService(None, None)
```

Start the flask application:

```
python app.py
```
