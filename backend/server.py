from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
app.config["SQLACHEMCY_TRACK_MODIFICATIONS"] = False

# database instance which acts as an ROM i.e. an object/class
db = SQLAlchemy(app)

if __name__ == "__main__":
    with app.app_context(): # if the database is not yet created then it must be created
        db.create_all()
        
    app.run(debug=True)
