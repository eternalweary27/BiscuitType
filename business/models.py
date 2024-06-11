from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy();

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(150), unique=True)
    email = db.Column(db.String(150))
    password = db.Column(db.String(150))
    default_language = db.Column(db.String(150), default="english")
    default_difficulty = db.Column(db.String(150), default="medium")
    music_volume = db.Column(db.Float, default=0.4)
    ding_volume = db.Column(db.Float, default=0.4)
    scores = db.relationship("Score", backref="user", lazy=True, cascade="all, delete-orphan")

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    points = db.Column(db.Integer)
    wpm = db.Column(db.Float)
    game_language = db.Column(db.String(150))
    game_difficulty = db.Column(db.String(150))
    game_date = db.Column(db.DateTime())
    country = db.Column(db.String(150), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)
    category = db.Column(db.String(150))
    date = db.Column(db.DateTime())