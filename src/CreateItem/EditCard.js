import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { updateCard, readCard, readDeck } from "../utils/api";

export default function EditDeck({
  card,
  setCard,
  reRender,
  setReRender,
  deck,
  setDeck,
}) {
  const { deckId, cardId } = useParams();
  const history = useHistory();

  const initialCardData = {
    front: "",
    back: "",
  };

  const [cardData, setCardData] = useState({ ...initialCardData });

  useEffect(() => {
    const abortController = new AbortController();
    setDeck({});
    setCard({});
    const getDeckData = async () => {
      try {
        const newDeckData = await readDeck(deckId, abortController.signal);
        setDeck(() => ({ ...deck, ...newDeckData }));
      } catch (error) {
        if (error.name === "AbortError") {
          console.log(error);
        } else {
          throw error;
        }
      }
    };
    getDeckData();

    const getCardData = async () => {
      try {
        const newCardData = await readCard(cardId, abortController.signal);
        setCard(() => ({ ...card, ...newCardData }));
        setCardData(() => newCardData);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log(error);
        } else {
          throw error;
        }
      }
    };

    if (cardId) {
      getCardData();
    }

    return () => {
      abortController.abort();
    };
  }, []);

  const submitHandler = async (event) => {
    event.preventDefault();
    await updateCard(cardData);
    setReRender(!reRender);
    history.push(`/decks/${deckId}`);
  };

  const cancelHandler = async (event) => {
    event.preventDefault();
    setCardData({ ...initialCardData });
    history.push(`/decks/${deckId}`);
  };

  const handleChange = ({ target }) => {
    setCardData({
      ...cardData,
      [target.name]: target.value,
    });
  };

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li class="breadcrumb-item">
            <Link to={`/decks/${deck.id}`}>{deck.name}</Link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            Edit Card {card.id}
          </li>
        </ol>
      </nav>
      <h2>Edit Card {card.id}</h2>
      <form onSubmit={submitHandler} class="container">
        <div class="col">
          <label class="row">
            Front:
            <textarea
              id="front"
              type="textarea"
              name="front"
              onChange={handleChange}
              value={cardData.front}
              defaultValue={card.front}
            ></textarea>
          </label>
          <label class="row">
            Back:
            <textarea
              id="back"
              type="textarea"
              name="back"
              onChange={handleChange}
              value={cardData.back}
              defaultValue={card.back}
            ></textarea>
          </label>
          <button class="btn btn-primary" type="Submit" value="Submit">
            Submit
          </button>
          <button
            class="btn btn-secondary"
            type="button"
            value="Cancel"
            onClick={cancelHandler}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
