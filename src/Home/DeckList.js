import React from "react";
import DeckListItem from "./DeckListItem.js";
import { Link } from "react-router-dom";

export default function DeckList({ decks, setDecks }) {
  return (
    <div>
      <div>
        <Link to="/decks/new" className="btn btn-secondary btn-lg">
          Create Deck
        </Link>
      </div>
      <ul className="DeckList list-group">
        {decks.map((deck) => (
          <DeckListItem key={deck.id} deck={deck} />
        ))}
      </ul>
    </div>
  );
}
