import React, { useState, useEffect } from "react";

function FavouritesList() {
    const [favouritesList, setFavouritesList] = useState([]);
    const [textList, setTextList] = useState([]);
    const [translation, setTranslation] = useState("kjv");
    const [loadingFavourites, setLoadingFavourites] = useState(true);
    const [loadingTexts, setLoadingTexts] = useState(true);

    const fetchFavouritesList = async () => {
        setLoadingFavourites(true);
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
        } finally {
            setLoadingFavourites(false);
        }
    };

    const fetchText = async (book, chapter, verse) => {
        try {
            const response = await fetch(
                `https://bible-api.com/${book}+${chapter}:${verse}?translation=${translation}`
            );
            const data = await response.json();
            if (response.ok) {
                return {
                    text: data.text,
                    reference: data.reference,
                    details: { book: book, chapter: chapter, verse: verse },
                };
            } else {
                console.error("Response was not valid when fetching text.");
                return null;
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const fetchTextList = async (favouritesList) => {
        setLoadingTexts(true);
        const fetchedTexts = await Promise.all(
            favouritesList.map((value) =>
                fetchText(value.book, value.chapter, value.verse)
            )
        );
        setTextList(fetchedTexts.filter(Boolean));
        setLoadingTexts(false);
    };

    const removeFavourite = async (book, chapter, verse) => {
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
                fetchFavouritesList();
                console.log(data.message);
            } else {
                console.log(data.error);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        fetchFavouritesList();
    }, []);

    useEffect(() => {
        if (favouritesList.length > 0) {
            fetchTextList(favouritesList);
        }
    }, [favouritesList]);

    return (
        <div>
            <h2>Favourites List</h2>

            {loadingFavourites || loadingTexts ? (
                <p>Loading your favourites...</p>
            ) : favouritesList.length > 0 ? (
                textList.map(
                    (value, index) =>
                        value && (
                            <div key={index}>
                                <p>{value.text}</p>
                                <small>{value.reference}</small>
                                <button
                                    onClick={() =>
                                        removeFavourite(
                                            value.details.book,
                                            value.details.chapter,
                                            value.details.verse
                                        )
                                    }
                                >
                                    x
                                </button>
                            </div>
                        )
                )
            ) : (
                <p>No favourites available.</p>
            )}
        </div>
    );
}

export default FavouritesList;
