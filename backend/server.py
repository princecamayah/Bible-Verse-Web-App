from config import app, db

if __name__ == "__main__":
    with app.app_context(): # if the database is not yet created then it must be created
        db.create_all()
        
    app.run(debug=True)
