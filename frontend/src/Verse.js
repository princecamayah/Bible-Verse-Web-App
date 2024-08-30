import React, { useState, useEffect } from "react";

function Verse() {
    const [verse, setVerse] = useState("");
    const [reference, setReference] = useState("");
    const [loading, setLoading] = useState(true);

    // useEffect causes whatever is contained to run on every render e.g. if the state changes
    // however, in this case we use a [] to indicate that we only need to render once, since we are just fetching data
    useEffect(() => {
        const fetchVerse = async () => {
            try {
                const response = await fetch("https://bible-api.com/john+3:16");
                const data = await response.json();
                setVerse(data.text);
                setReference(data.reference);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching the verse", error);
                setLoading(true);
            }
        };

        fetchVerse();
    }, []);

    return (
        <div>
            <h1>Verse of the day</h1>
            {loading ? <p>Loading...</p> : <div><p>{verse}</p><small>{reference}</small></div>}
        </div>
    );
}

export default Verse;
