import React, { useState, useEffect } from 'react';

function Verse() {
    const [verse, setVerse] = useState("")
    const [reference, setReference] = useState("")

    // useEffect causes whatever is contained to run on every render e.g. if the state changes
    // however, in this case we use a [] to indicate that we only need to render once, since we are just fetching data
    useEffect(() => {
        const fetchVerse = async () => {
            try {
                const response = await fetch("https://bible-api.com/john+3:16");
                const data = await response.json();
                setVerse(data.text);
                setReference(data.reference);
            } catch (error) {
                console.error("Error fetching the verse", error);
            }
        };

        fetchVerse();
    }, []);

    return (
        <div>
            <h1>Verse of the day</h1>
            <p>{verse}</p>
            <small>{reference}</small>
        </div>
    );
}

export default Verse;