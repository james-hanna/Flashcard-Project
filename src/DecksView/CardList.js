import React, { Fragment } from "react";
import CardListItem from "./CardListItem.js";

export default function CardList({ cards=[] }) {
  return (
    <Fragment>
      <ul className="CardList list-group">
        {cards.map((card) => (
          <CardListItem card={card} />
        ))}
      </ul>
    </Fragment>
  );
}
