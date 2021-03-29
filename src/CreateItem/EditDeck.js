import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom"
import { updateDeck, readDeck } from "../utils/api"

export default function CreateDeck({deck, setDeck, reRender, setReRender,}){


    const history = useHistory();
    const { deckId } = useParams();


    const initialDeckData = {
      name:"",
      description: "",
    };


    const [deckData, setDeckData] = useState({...initialDeckData});

    useEffect(() => {
      const abortController = new AbortController();
      const getDeckData = async () => {
        try{
          const newDeckData = await readDeck(deckId, abortController.signal);
          setDeck(() => ({...deck, ...newDeckData}));
          setDeckData(() => newDeckData);
        } catch (error){
          if(error.name === "AbortError"){
            console.log(error)
          } else{
            throw error;
          }
        }
      }
      if(deckId){
      getDeckData()
      }
      return () => {
        abortController.abort();
      }
    }, [])

    const submitHandler = async (event) => { 
        event.preventDefault();
        await updateDeck(deckData)
        setReRender(!reRender)
        history.push(`/decks/${deckId}`)
        
    }
    function cancelHandler(event){
        event.preventDefault();
        setDeckData({...initialDeckData})
        history.push(`/`);
    }

    const changeHandler =({target}) => {
      setDeckData({
        ...deckData,
        [target.name]: target.value,
      });
    };

    return(
        <div>
        <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li class="breadcrumb-item">
            <Link to={`decks/${deck.id}`}>{deck.name}</Link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            Edit Deck
          </li>
        </ol>
      </nav>
      <h2>Edit Deck</h2>
      <form onSubmit={submitHandler} class="container">
          <div class="col">
          <label class="row">
              Name:
              <input id="name" type="text" name="name" onChange={changeHandler} value={deckData.name} defaultValue={deck.name} />
          </label>
          <label class="row">
              Description:
              <textarea id="description" type="textarea" name="description" onChange={changeHandler} value={deckData.description} defaultValue={deck.description} ></textarea>
          </label>
          <button class="btn btn-primary" type="Submit" value="Submit">Submit</button>
          <button class="btn btn-secondary" type="button" value="Cancel" onClick={cancelHandler}>Cancel</button>
        </div>
      </form>
      </div>
    );
}