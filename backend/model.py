from config import db

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