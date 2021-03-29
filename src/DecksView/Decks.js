import React, { useEffect, Fragment } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { readDeck, deleteDeck } from "../utils/api";
import CardList from "./CardList.js";

export default function Decks({ deck, setDeck, reRender, setReRender }) {
  const { deckId } = useParams();
  const history = useHistory();

  useEffect(() => {
    const abortController = new AbortController();
    setDeck({});
    const readingDeck = async () => {
      try {
        const deckData = await readDeck(deckId, abortController.signal);
        setDeck(() => ({ ...deck, ...deckData }));
        setReRender(!reRender);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log(error);
        } else {
          throw error;
        }
      }
    };

    readingDeck();
    return () => {
      abortController.abort();
    };
  }, [deckId]);

  const deckDeleteHandler = async (event) => {
    if (window.confirm("Delete this deck?")) {
      deleteDeck(deckId);
      setReRender(!reRender);
      history.push("/");
      history.go(0);
    }
  };


  return (
      <Fragment>
          <div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {deck.name}
                </li>
              </ol>
            </nav>
            <div>
              <h3>{deck.name}</h3>
              <div>
              <h5>{deck.description}</h5>
              </div>
              <div className="row">
                <Link
                  to={`/decks/${deck.id}/edit`}
                  className="btn btn-secondary"
                >
                  Edit
                </Link>
                <Link to={`/decks/${deck.id}/study`} className="btn btn-primary">
                  Study
                </Link>
                <Link
                  to={`/decks/${deck.id}/cards/new`}
                  className="btn btn-primary"
                >
                  Add Cards
                </Link>
                <button className="btn btn-danger" onClick={deckDeleteHandler}>
                  Trash
                </button>
              </div>
              <div>
                <h2>Cards</h2>
              </div>
              <div>
                <CardList cards={deck.cards} />
              </div>
            </div>
          </div>
      </Fragment>
  );
}
