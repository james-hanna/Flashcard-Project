import React from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { deleteCard } from "../utils/api";

export default function CardListItem({ card }) {
  const { url } = useRouteMatch();
  const history = useHistory();

  const deleteHandler = async () => {
    if (window.confirm("Delete this card?")) {
      await deleteCard(card.id);
      history.go(0);
    }
  };

  return (
    <li className="list-group-item">
      <div className="d-flex justify-content-between">
        <div className="row align-content-center ">
          <div className="col mx-3">{card.front}</div>
          <div className="col">{card.back}</div>
        </div>
        <div className="row ">
          <div className="right-buttons">
            <Link
              className="mx-1 btn btn-secondary"
              to={`${url}/cards/${card.id}/edit`}
            >
              Edit
            </Link>
            <button className="mx-1 btn btn-danger" onClick={deleteHandler}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
