from flask import jsonify, request
from config import app, db, login_manager
from model import Verse, User, populate_database
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, current_user, logout_user, login_required

# required by flask_login to reload the user object from the user ID stored in the session (database); takes user ID and returns corresponding User from session
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
    user_list = [{"id": user.id, "email": user.email} for user in users]
    return jsonify(user_list)
    

if __name__ == "__main__":
    with app.app_context(): # if the database is not yet created then it must be created
        db.create_all()
        populate_database()
        
    app.run(debug=True)
