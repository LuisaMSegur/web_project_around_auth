import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import * as auth from "../utils/auth.js";
import Header from "./Header/Header.jsx";
import Main from "../components/Main/Main.jsx";
import Footer from "./Footer/Footer.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import api from "../utils/Api.js";
import ProtectedRoute from "./ProtectedRoute.jsx";
import CurrentUserContext from "../contexts/CurrentUserContext.js";

function App() {
  const [currentUser, setCurrentUser] = useState({name: "", about: "", avatar: ""});
  const [cards, setCards] = useState([]);
  const [popup, setPopup] = useState({ isOpen: false, title: "", content: null });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const email = localStorage.getItem("email");
    
    if (token) {
      auth.checkToken(token)
        .then(() => {
          setIsLoggedIn(true);
          setEmail(email);
          return api.getUser();
        })
        .then((user) => {
          setCurrentUser(user);
          setIsLoggedIn(true);
  localStorage.setItem("email", email);
  navigate("/");
        })
        .catch((error) => {
          console.error("Error:", error);
          setIsLoggedIn(false);
          localStorage.removeItem("jwt");
          localStorage.removeItem("email");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  }
  , []);
  
  useEffect(() => {
    if (isLoggedIn) {
      api.getCards()
        .then((cardsData) => {
          setCards(cardsData);
        })
        .catch((error) => console.error("Error obteniendo tarjetas:", error));
    }
  }, [isLoggedIn]);
  
//Funciones para iniciar y cerrar sesión
  function handleLogin(email, password) {
    auth.authorize(email, password)
      .then((token) => {
        localStorage.setItem("jwt", token);
        return api.getUser ();
      })
      .then((user) => {
        setCurrentUser (user);
        setIsLoading(false);
        setIsLoggedIn(true);
        localStorage.setItem("email", email);
        navigate("/"); 
      })
      .catch((error) => {
        console.error("Error al iniciar sesión:", error);
      });
  }

  function handleLogout() {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setEmail("");
    navigate("/signin");
  }

  //funciones para editar perfil, avatar y agregar cartas
  const handleUpdateUser = ({name, about}) => {
    api.editUser({name, about})
      .then((res) => {
      if (res && res.name && res.about){
        setCurrentUser(res);
        setPopup({isOpen:false});
      }
      })
      .catch((error) =>
        console.error("Error al actualizar el usuario:", error)
      );
  };
  
const handleUpdateAvatar = (avatarData) => {
  api.editAvatar(avatarData)
    .then((user) => {
      setCurrentUser(user);
      setPopup({isOpen:false});
    })
    .catch((error) =>
      console.error("Error al actualizar el avatar:", error)
    );
};

const onAddPlaceSubmit = (newCard) => {
  return api.createCard(newCard.name, newCard.link)
    .then((card) => {
      setCards((prevCards) => [card, ...prevCards])
      setPopup({isOpen:false});
    })
    .catch((err) => console.error("Error al agregar la tarjeta:", err));
};

//funciones de los popups y los likes
function handleOpenPopup(title, content) {
  setPopup({ isOpen: true, title, content });
}

function handleClosePopup() {
  setPopup({ isOpen: false, title: "", content: null });
}
  
const handleCardLike = (card) => {
  const isLiked = card.likes.some((like) => like._id === currentUser._id);
  api.toggleLike(card._id, isLiked)
    .then((newCard) =>
      setCards((state) =>
        state.map((currentCard) =>
          currentCard._id === card._id ? newCard : currentCard
        )
      )
    )
    .catch((error) =>
      console.error("Error al cambiar el estado del like:", error)
    );
};

const handleCardDelete = (card) => {
  api.deleteCard(card._id)
    .then(() => {
      setCards((state) =>
        state.filter((currentCard) => currentCard._id !== card._id)
      );
    })
    .catch((error) =>
      console.error("Error al eliminar la tarjeta:", error)
    );
};

return (
  <div className="page">
  <CurrentUserContext.Provider value={{ currentUser, handleUpdateUser }}>
      <Header handleLogout={handleLogout} email={email}/>
      <Routes>
        <Route path="/signin" element={isLoggedIn ? <Navigate to="/" /> : <Login handleLogin={handleLogin} setUserEmail={setEmail}/>} />
        <Route path="/signup" element={<Register />} />
        <Route
  path="/"
  element={
      <ProtectedRoute isLoggedIn={isLoggedIn} >
        <Main
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          onAddPlaceSubmit={onAddPlaceSubmit}
          onOpenPopup={handleOpenPopup}
          onClosePopup={handleClosePopup}
          onUpdateAvatar={handleUpdateAvatar}
          popup={popup}
        /> 
      </ProtectedRoute>
  }
/>
   <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/signin"} />} />
      </Routes>
      <Footer />
  </CurrentUserContext.Provider>
    </div>
);
}
 


export default App;
