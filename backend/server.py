from flask import jsonify, request
from config import app, db, login_manager
from model import Verse, User, populate_database, populate_users
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, current_user, logout_user, login_required

# required by flask_login to reload the user object from the user ID stored in the session (database); takes user ID and returns corresponding User from session
# this @ is required so that login_manager knows to use the load_user function created below to load a user
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route("/register", methods=["POST"])
def register():
    if current_user.is_authenticated:
        return jsonify({"error": "You are currently logged into an account. Log out first if you'd like to register for a new account."}), 400

    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "A user with that email already exists. Login instead."}), 409
    
    new_user = User(email=email, password_hash=generate_password_hash(password))
    db.session.add(new_user)
    db.session.commit()

    login_user(new_user)

    # we have to use HTTP status codes so that the response method on the frontend can work properly
    return jsonify({"message": "User registered successfully."}), 201


@app.route("/login", methods=["POST"])
def login():
    if current_user.is_authenticated:
        return jsonify({"error": "You are currently logged into an account. Log out first if you'd like to login to another account."}), 400

    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "No user found with that email address"}), 400
    
    if not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Incorrect password."}), 409

    login_user(user)
    return jsonify({"message": "Login successful"}), 201
            

@app.route("/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"message": "Successfully logged out."}), 200


@app.route("/api/random_verse", methods=["GET"])
def get_random_verse():
    random_verse = Verse.query.order_by(db.func.random()).first()
    if random_verse:
        return jsonify(random_verse.to_dict())
    else:
        return jsonify({"error": "No verses available"}), 404
    

@app.route("/api/users", methods=["GET"])
def get_users():
    users = User.query.all()
    user_list = [{"id": user.id, "email": user.email, "role": user.role} for user in users]
    return jsonify(user_list)


@app.route("/api/verses", methods=["GET"])
def get_verses():
    verses = Verse.query.all()
    verse_list = [{"id": verse.id, "book": verse.book, "chapter": verse.chapter, "verse": verse.verse} for verse in verses]
    return jsonify(verse_list)


# currently, if a verse is added, frontend needs to be restarted to be considered in random_verse selection
@app.route("/add_verse", methods=["POST"])
@login_required
def add_verse():
    if current_user.role != "admin":
        return jsonify({"error": "You do not have access to this page."}), 403
    
    data = request.get_json()
    book = data.get("book")
    chapter = str(data.get("chapter"))
    verse = str(data.get("verse"))

    check = Verse.query.filter_by(book=book, chapter=chapter, verse=verse).first()

    if check:
        return jsonify({"error": "This verse already exists."}), 409
    
    new_text = Verse(book=book, chapter=chapter, verse=verse)
    db.session.add(new_text)
    db.session.commit()

    return jsonify({"message": "Verse successfully added."}), 201


@app.route("/remove_verse", methods=["DELETE"])
@login_required
def remove_verse():
    if current_user.role != "admin":
        return jsonify({"error": "You do not have permission to perform this action."}), 403
    
    data = request.get_json()
    book = data.get("book")
    chapter = data.get("chapter")
    verse = data.get("verse")

    item = Verse.query.filter_by(book=book, chapter=chapter, verse=verse).first()

    if not item: # this should never happen but here as a preventative measure
        return jsonify({"error": "There is no such item that exists in the database to remove."}), 404
    
    db.session.delete(item)
    db.session.commit()

    return jsonify({"message": "Verse successfully removed."}), 201

@app.route("/manage_favourite", methods=["POST"])
@login_required
def manage_favourite():
    data = request.get_json()
    book = data.get("book")
    chapter = data.get("chapter")
    verse = data.get("verse")

    item = Verse.query.filter_by(book=book, chapter=chapter, verse=verse).first()

    if not verse:
        return jsonify({"error": "Verse not found."}), 404

    if item in current_user.favourites:
        current_user.favourites.remove(item)
        db.session.commit()
        return jsonify({"message": "Verse successfully removed from favourites."}), 200
    else:
        current_user.favourites.append(item)
        db.session.commit()
        return jsonify({"message": "Verse successfully added to favourites."}), 200

@app.route("/get_favourites", methods=["GET"])
@login_required
def get_favourites():
    favourites = [verse.to_dict() for verse in current_user.favourites] # contains {book, chapter, verse}
    return jsonify(favourites)


if __name__ == "__main__":
    with app.app_context(): # if the database is not yet created then it must be created
        db.create_all()
        populate_database()
        populate_users()
        
    app.run(debug=True)
