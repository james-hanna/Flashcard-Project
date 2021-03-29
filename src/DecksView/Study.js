import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { listCards, readDeck } from "../utils/api";

export default function Study({ cards, setCards }) {
  const { deckId } = useParams();
  const [flipped, setFlipped] = useState(false);
  const [cardCount, setCardCount] = useState(0);
  const [tempDeck, setTempDeck] = useState({});
  const history = useHistory();

  useEffect(() => {
    const abortController = new AbortController();
    setCards([]);
    setTempDeck({});
    const getDeckData = async () => {
      const newDeckData = await readDeck(deckId, abortController.signal);
      setTempDeck(() => ({ ...tempDeck, ...newDeckData }));
    };

    getDeckData();

    return () => {
      abortController.abort();
    };
  }, [deckId, readDeck, listCards]);

  setCards(tempDeck.cards);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleNext = () => {
    if (cardCount + 1 < cards.length) {
      setCardCount(cardCount + 1);
      setFlipped(false);
    } else {
      const result = window.confirm("Do you wish to restart?");
      if (result) {
        setCardCount(0);
      } else {
        history.push("/");
      }
    }
  };

  const studySection = (() => {
    if (!cards) {
      return <div>Loading...</div>;
    } else if (cards.length >= 3) {
      return (
        <div>
          <h2>{`Card ${cardCount + 1} of ${cards.length}`}</h2>
          {flipped ? (
            <div className="container">
              <div className="row">{cards[cardCount].back}</div>
              <div className="row">
                <button className="btn btn-secondary mx-1" onClick={handleFlip}>
                  Flip
                </button>
                <button className="btn btn-primary" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="container">
              <div className="row">{cards[cardCount].front} </div>
              <button className="btn btn-secondary mx-1" onClick={handleFlip}>
                Flip
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div>
          <h2>Not enough cards.</h2>
          <p>
            You need at least 3 cards to study. There are {cards.length} cards
            in this deck.
          </p>
          <Link className="btn btn-primary" to={`/decks/${deckId}/cards/new`}>
            Add Cards
          </Link>
        </div>
      );
    }
  })();

  return (
    <React.Fragment>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/decks/${tempDeck.id}`}>{tempDeck.name}</Link>
          </li>
          <li className="breadcrumb-item active">Study</li>
        </ol>
      </nav>
      <h1>{tempDeck.name}: Study</h1>
      {cards && tempDeck ? studySection : null}
    </React.Fragment>
  );
}
