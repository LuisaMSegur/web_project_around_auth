import React, { useContext } from "react";
import CurrentUserContext from "../../../../contexts/CurrentUserContext.js";
import ImagePopup from "./ImagePopup.jsx";


export default function Card({ card, handleOpenPopup, onCardLike, onCardDelete }) {
  const { currentUser } = useContext(CurrentUserContext);
const isLiked = card.likes.some((like) => like._id === currentUser._id);
const isOwner = card.owner._id === currentUser._id;
const cardLikeButtonClassName = `card__button-love ${
    isLiked ? 'card__button-love_active' : ''
  }`;
  function handleLikeClick() {
    onCardLike(card); 
}
function handleDeleteClick() {
  onCardDelete(card); 
}

  return (
    <li className="card">
      <img
        className="card__photo"
        src={card.link}
        alt={card.name}
        onClick={() => handleOpenPopup(
          null, <ImagePopup card={card} />,
        )}
      />
      {isOwner && (<button
        className="card__button-trash"
        onClick={handleDeleteClick}
        id="buttonDelete"
        type="button"
      ></button>)}
      <p className="card__name-place">{card.name}</p>
      <button
        className={cardLikeButtonClassName}
        onClick={handleLikeClick}
        type="button"
      ></button>
      <div className="card__like">{card.likes.length}</div>
    </li>
  );
}
