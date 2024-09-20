import React, { useState, useEffect } from "react";

function FavouritesList() {
    const [favouritesList, setFavouritesList] = useState([]);
    const [textList, setTextList] = useState([]);
    const [translation, setTranslation] = useState("kjv");

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
                // react automatically knows that prevTextList is the old state of textList
                // setTextList((prevTextList) => [
                //     ...prevTextList,
                //     {
                //         text: data.text,
                //         reference: data.reference,
                //         details: { book: book, chapter: chapter, verse: verse },
                //     },
                // ]);
            } else {
                console.error("Response was not valid when fetching text.");
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const fetchTextList = async (favouritesList) => {
        // favouritesList.forEach(async (value) => {
        //     await fetchText(value.book, value.chapter, value.verse);
        // });
        const fetchedTexts = await Promise.all(
            favouritesList.map((value) =>
                fetchText(value.book, value.chapter, value.verse)
            )
        );
        setTextList(fetchedTexts);
    };

    // const removeFavourite = async (book, chapter, verse) => {
    //     try {
    //         const response = await fetch("/manage_favourite", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({
    //                 book: book,
    //                 chapter: chapter,
    //                 verse: verse,
    //             }),
    //         });
    //         const data = await response.json();
    //         if (response.ok) {
    //             fetchFavouritesList();
    //             console.log(data.message);
    //         } else {
    //             console.log(data.error);
    //         }
    //     } catch (error) {
    //         console.error(error.message);
    //     }
    // };

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
            {textList.map((value, index) => (
                <div key={index}>
                    <p>{value.text}</p>
                    <small>{value.reference}</small>
                    {/* <button
                        onClick={() =>
                            removeFavourite(
                                value.details.book,
                                value.details.chapter,
                                value.details.verse
                            )
                        }
                    >
                        x
                    </button> */}
                </div>
            ))}
        </div>
    );
}

export default FavouritesList;
