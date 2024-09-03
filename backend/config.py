from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
app.config["SQLACHEMCY_TRACK_MODIFICATIONS"] = False

# database instance which acts as an ROM i.e. an object/class
db = SQLAlchemy(app)

login_manager = LoginManager(app)
login_manager.init_app(app)