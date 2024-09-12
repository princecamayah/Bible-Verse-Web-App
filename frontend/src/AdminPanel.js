import React, { useEffect, useState } from "react";

function AdminPanel() {
    const [book, setBook] = useState("");
    const [chapter, setChapter] = useState("");
    const [verse, setVerse] = useState("");
    const [message, setMessage] = useState("");
    const [allVerses, setAllVerses] = useState([]);

    // function to check if the verse inputted is actually a real verse: needed because the user can type anything in.
    const validateVerse = async () => {
        try {
            const response = await fetch(
                `https://bible-api.com/${book}+${chapter}:${verse}`
            );

            if (!response.ok) {
                setMessage(
                    "Invalid verse entered. Please check the name of the book, chapter or verse."
                );
                return false;
            }

            return true;
        } catch (error) {
            console.error("Error validating verse", error.message);
            return false;
        }
    };

    // sends the inputs to the backend api
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (await validateVerse()) {
            try {
                const response = await fetch("/add_verse", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        book: book,
                        chapter: chapter,
                        verse: verse,
                    }),
                });

                const data = await response.json();
                if (response.ok) {
                    console.log(data.message);
                    setMessage(data.message);
                } else {
                    console.error(data.error);
                    setMessage(data.error);
                }
            } catch (error) {
                console.error(error.message);
                setMessage("Error in submission: ", error.message);
            }
        }
    };

    const handleRemove = async (book, chapter, verse) => {
        try {
            const response = await fetch("/remove_verse", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    book: book,
                    chapter: chapter,
                    verse: verse,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data.message);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    // prints out all the verses stored on the database
    useEffect(() => {
        const fetchAllVerses = async () => {
            try {
                const response = await fetch("/api/verses");
                const data = await response.json();

                if (response.ok) {
                    setAllVerses(data);
                } else {
                    console.error("Failed to fetch all responses.");
                }
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchAllVerses();
    }, []);

    return (
        <div>
            <h2>Admin Panel: Add Verse</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Book"
                    value={book}
                    onChange={(e) => setBook(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Chapter"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Verse"
                    value={verse}
                    onChange={(e) => setVerse(e.target.value)}
                    required
                />
                <button type="submit">Add Verse</button>
            </form>
            <p>{message}</p>

            <h2>All Verses</h2>
            <ul>
                {allVerses.map((verse, index) => (
                    <li key={index}>
                        <div>
                            <p>
                                {verse.book} {verse.chapter}:{verse.verse}
                            </p>
                            {/* the function below HAS to be passed as an arrow function otherwise it will run handleRemove immediately, but the arrow function stops this from happening */}
                            <button
                                onClick={() =>
                                    handleRemove(
                                        verse.book,
                                        verse.chapter,
                                        verse.verse
                                    )
                                }
                            >
                                x
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminPanel;
