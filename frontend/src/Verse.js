import React, { useState, useEffect } from "react";

function Verse() {
    // taken from bible-api using random_verse api data
    const [text, setText] = useState("");
    const [reference, setReference] = useState("");
    const [loading, setLoading] = useState(true);

    // taken from random_verse api
    const [book, setBook] = useState("");
    const [chapter, setChapter] = useState("");
    const [verse, setVerse] = useState("");

    // by default NKJV but user can change it
    const [translation, setTranslation] = useState("kjv");

    const handleAddToFavourites = async (book, chapter, verse) => {
        try {
            const response = await fetch("/manage_favourite", {
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
            } else {
                console.log(data.error);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    // useEffect causes whatever is contained to run on every render e.g. if the state changes
    // however, in this case we use a [] to indicate that we only need to render once, since we are fetching a verse from our database
    useEffect(() => {
        const fetchRandomVerse = async () => {
            try {
                // const response = await fetch("https://bible-api.com/john+3:16");
                const response = await fetch("/api/random_verse"); // sends a GET request to /api/random_verse and waits for the Response object
                const data = await response.json(); // JSON response is parsed here i.e. converts response to a JS object
                if (response.ok) {
                    setBook(data.book);
                    setChapter(data.chapter);
                    setVerse(data.verse);
                } else {
                    console.error(
                        "Response was invalid when trying to fetch the random verse."
                    );
                }
            } catch (error) {
                console.error(
                    "Error fetching the book, chapter or verse: ",
                    error.message
                );
            }
        };

        fetchRandomVerse();
    }, []);

    // we have translation in the dependancy array so that if its state changes, the fetchText function is reran.
    // we also include book, chapter and verse in the dependancy array because otherwise, the fetchText would ONLY run when translation changes meaning that this function will never be ran, but once the fetchRandomVerse function runs, the book, chapter and verse state change therefore needs to run fetchText because of that.
    useEffect(() => {
        const fetchText = async () => {
            try {
                const response = await fetch(
                    `https://bible-api.com/${book}+${chapter}:${verse}?translation=${translation}`
                );
                const data = await response.json();
                if (response.ok) {
                    setText(data.text);
                    setReference(data.reference);
                    setLoading(false);
                } else {
                    console.error(
                        "Response was invalid when fetching verse from Bible API."
                    );
                }
            } catch (error) {
                console.error(
                    "Error fetching verse from Bible API: ",
                    error.message
                );
                setLoading(true);
            }
        };

        fetchText();
    }, [book, chapter, verse, translation]);

    return (
        <div>
            <h1>Verse of the day</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <p>{text}</p>
                    <small>{reference}</small>
                    <button
                        onClick={() => {
                            handleAddToFavourites(book, chapter, verse);
                        }}
                    >
                        Add to favourites
                    </button>
                </div>
            )}
        </div>
    );
}

export default Verse;
