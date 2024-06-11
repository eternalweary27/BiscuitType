from flask import Flask
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_session import Session
from api.auth import auth
from api.views import views
from datetime import timedelta
from business.models import db, User

class Config:
    SECRET_KEY = None;
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + "database/database.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

app = Flask(__name__, template_folder="./templates")
app.config.from_object(Config)
db.init_app(app)
login_manager = LoginManager(app)
login_manager.login_view = "auth.login"
migrate = Migrate(app, db)
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

app.register_blueprint(auth,url_prefix="/")
app.register_blueprint(views, url_prefix="/")
app.permanent_session_lifetime = timedelta(minutes=5)

@login_manager.user_loader
def load_user(id):
    try:
        return User.query.get(int(id))
    except:
        return None

if __name__ == "__main__":
    app.run(debug=True)
