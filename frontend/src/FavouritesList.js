import React, { useState, useEffect } from "react";

function FavouritesList() {
    const [favouritesList, setFavouritesList] = useState([]);
    const [textList, setTextList] = useState([]);
    const [translation, setTranslation] = useState("kjv");

    const fetchText = async (book, chapter, verse) => {
        try {
            const response = await fetch(
                `https://bible-api.com/${book}+${chapter}:${verse}?translation=${translation}`
            );
            const data = await response.json();
            if (response.ok) {
                // react automatically knows that prevTextList is the old state of textList
                setTextList((prevTextList) => [
                    ...prevTextList,
                    { text: data.text, reference: data.reference },
                ]);
            } else {
                console.error("Response was not valid when fetching text.");
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const fetchTextList = (favouritesList) => {
        favouritesList.forEach((value) => {
            fetchText(value.book, value.chapter, value.verse);
        });
    };

    const fetchFavouritesList = async () => {
        try {
            const response = await fetch("/get_favourites");
            const data = await response.json();
            if (response.ok) {
                setFavouritesList(data);
            } else {
                console.error(
                    "Response was not valid when trying to fetch from get_favourites endpoint."
                );
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        fetchFavouritesList();
    }, []);

    useEffect(() => {
        fetchTextList(favouritesList);
    }, [favouritesList]);

    return (
        <div>
            <h2>Favourites List</h2>
            {textList.map((value, index) => (
                <div key={index}>
                    <p>{value.text}</p>
                    <small>{value.reference}</small>
                </div>
            ))}
        </div>
    );
}

export default FavouritesList;
