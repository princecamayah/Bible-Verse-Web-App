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
        if not (Verse.query.filter_by(book=verse.book, chapter=verse.chapter, verse=verse.verse)).first():
            db.session.add(verse)

    db.session.commit()

def populate_users():

    admin_user = User.query.filter_by(email="admin@gmail.com").first()

    if not admin_user:
        users = [
            User(email="admin@gmail.com", password_hash=generate_password_hash("admin"), role="admin")
        ]

        for user in users:
            db.session.add(user)
    
        db.session.commit()