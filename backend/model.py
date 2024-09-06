from flask_login import UserMixin
from werkzeug.security import generate_password_hash
from config import db

# User inherits from UserMixin which automatically includes methods like is_authenticated, get_id and more. 
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(16), nullable=False, default="user") # role can be either user or admin

class Verse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book = db.Column(db.String(20), nullable=False)
    chapter = db.Column(db.String(20), nullable=False)
    verse = db.Column(db.String(20), nullable=False)

    def to_dict(self):
        return {
            "book": self.book,
            "chapter": self.chapter,
            "verse": self.verse,
        }

def populate_database():
    verses = [
        Verse(book="John", chapter="3", verse="16"),
        Verse(book="Psalms", chapter="23", verse="1"),
        Verse(book="Romans", chapter="8", verse="28"),
    ]

    for verse in verses:
        db.session.add(verse)

    db.session.commit()

def populate_users():
    users = [
        User(email="admin@gmail.com", password_hash=generate_password_hash("admin"))
    ]

    for user in users:
        db.session.add(user)
    
    db.session.commit()