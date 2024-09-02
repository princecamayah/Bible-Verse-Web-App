import React, { useState, useEffect } from "react";

function Verse() {
    const [text, setText] = useState("");
    const [reference, setReference] = useState("");
    const [book, setBook] = useState("");
    const [chapter, setChapter] = useState("");
    const [verse, setVerse] = useState("");
    const [loading, setLoading] = useState(true);

    // useEffect causes whatever is contained to run on every render e.g. if the state changes
    // however, in this case we use a [] to indicate that we only need to render once, since we are just fetching data
    useEffect(() => {
        const fetchRandomVerse = async () => {
            try {
                // const response = await fetch("https://bible-api.com/john+3:16");
                const response = await fetch("/api/random_verse"); // sends a GET request to /api/random_verse and waits for the Response object
                const data = await response.json(); // JSON response is parsed here i.e. converts response to a JS object
                setBook(data.book);
                setChapter(data.chapter);
                setVerse(data.verse);
            } catch (error) {
                console.error("Error fetching the book, chapter or verse: ", error);
            }
        };

        const fetchText = async () => {
            try {
                const response = await fetch(`https://bible-api.com/${book}+${chapter}:${verse}`);
                const data = await response.json();
                setText(data.text);
                setReference(data.reference);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching verse from Bible API: ", error)
                setLoading(true);
            }
        }

        fetchRandomVerse();
        fetchText();
    }, [book, chapter, verse]);

    return (
        <div>
            <h1>Verse of the day</h1>
            {loading ? <p>Loading...</p> : <div><p>{text}</p><small>{reference}</small></div>}
        </div>
    );
}

export default Verse;
