import React from "react";
import { Link, useHistory } from "react-router-dom";
import { deleteDeck } from "../utils/api";

export default function DeckListItem({ deck }) {
  const history = useHistory();

  const { name, description, cards } = deck;

  const deleteHandler = async () => {
    if (window.confirm("Delete this deck?")) {
      await deleteDeck(deck.id);
      history.go(0);
    }
  };
  return (
    <li className="list-group-item">
      <div>{name}</div>
      <div>{`${cards.length} cards`}</div>
      <div>{description}</div>
      <Link
        to={`/decks/${deck.id}`}
        className="btn btn-secondary"
        type="submit"
      >
        View
      </Link>
      <Link
        to={`/decks/${deck.id}/study`}
        className="btn btn-primary"
        type="submit"
      >
        Study
      </Link>
      <button className="btn btn-danger" type="submit" onClick={deleteHandler}>
        Delete
      </button>
    </li>
  );
}
