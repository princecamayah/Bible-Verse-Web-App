from flask import jsonify
from config import app, db
from model import Verse, populate_database

@app.route("/api/random_verse", methods=["GET"])
def get_random_verse():
    random_verse = Verse.query.order_by(db.func.random()).first()
    if random_verse:
        response = jsonify(random_verse.to_dict())
        response.headers['Content-Type'] = 'application/json'
        return response
    else:
        return jsonify({"error": "No verses available"}), 404

if __name__ == "__main__":
    with app.app_context(): # if the database is not yet created then it must be created
        db.create_all()
        populate_database()
        
    app.run(debug=True)
