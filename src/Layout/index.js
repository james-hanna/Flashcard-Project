import React, { Fragment, useState, useEffect } from "react";
import Header from "./Header";
import NotFound from "./NotFound";
import { Route, Switch } from "react-router-dom";
import { listDecks } from "../utils/api/index.js";
import DeckList from "../Home/DeckList.js";
import Decks from "../DecksView/Decks.js";
import EditCard from "../CreateItem/EditCard.js";
import CreateCard from "../CreateItem/CreateCard.js";
import CreateDeck from "../CreateItem/CreateDeck.js";
import EditDeck from "../CreateItem/EditDeck.js";
import Study from "../DecksView/Study.js";

function Layout() {
  const [reRender, setReRender] = useState(false);
  const [decks, setDecks] = useState([]);
  const [deck, setDeck] = useState({});
  const [cards, setCards] = useState([]);
  const [card, setCard] = useState({});

  useEffect(() => {
    const abortController = new AbortController();

    const settingDecks = async () => {
      try {
        const data = await listDecks(abortController.signal);
        setDecks(() => {
          return data;
        });
      } catch (error) {
        if (error.name === "AbortError") {
          console.log(error);
        } else {
          throw error;
        }
      }
    };

    settingDecks();

    return () => {
      abortController.abort();
    };
  }, [reRender]);

  return (
    <Fragment>
      <Header />
      <div className="container">
        <Switch>
          <Route path="/decks/:deckId/cards/:cardId/edit">
            <EditCard
              card={card}
              setCard={setCard}
              reRender={reRender}
              setReRender={setReRender}
              deck={deck}
              setDeck={setDeck}
            />
          </Route>
          <Route path="/decks/:deckId/cards/new">
            <CreateCard
              card={card}
              setCard={setCard}
              reRender={reRender}
              setReRender={setReRender}
              deck={deck}
              setDeck={setDeck}
            />
          </Route>
          <Route path="/decks/:deckId/study">
            <Study cards={cards} setCards={setCards} />
          </Route>
          <Route path="/decks/new">
            <CreateDeck
              deck={deck}
              setDeck={setDeck}
              reRender={reRender}
              setReRender={setReRender}
            />
          </Route>
          <Route path={`/decks/:deckId/edit`}>
            <EditDeck
              deck={deck}
              setDeck={setDeck}
              reRender={reRender}
              setReRender={setReRender}
            />
          </Route>
          <Route path="/decks/:deckId">
            <Decks
              deck={deck}
              setDeck={setDeck}
              reRender={reRender}
              setReRender={setReRender}
            />
          </Route>
          <Route exact path="/">
            <DeckList decks={decks} setDecks={setDecks} />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Fragment>
  );
}

export default Layout;
