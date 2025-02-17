class Api {
    constructor({ baseUrl, getAuthToken }) {
      this._baseUrl = baseUrl;
      this._getAuthToken = getAuthToken;
    }
  
    _fetch(url, options = {}) {
      return fetch(`${this._baseUrl}${url}`, {
        ...options,
        headers: {
          ...options.headers,
          authorization: this._getAuthToken(),
          "Content-Type": "application/json",
        },
      }).then((res) =>
        res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
      );
    }
  
    getUser() {
      return this._fetch("/users/me");
    }
  
    getCards() {
      return this._fetch("/cards");
    }
  
    editUser({name, about}) {
      return this._fetch("/users/me", {
        method: "PATCH",
        body: JSON.stringify({
          name,
          about,
        }),
      });
    }
  
    editAvatar(avatarData) {
      return this._fetch("/users/me/avatar", {
        method: "PATCH",
        body: JSON.stringify({
          avatar: avatarData,
        }),
      });
    }
  
    createCard(name, link) {
      return this._fetch("/cards", {
        method: "POST",
        body: JSON.stringify({
          name,
          link,
        }),
      });
    }
  
    deleteCard(cardId) {
      return this._fetch(`/cards/${cardId}`, {
        method: "DELETE",
      });
    }
  
    likeCard(cardId) {
      return this._fetch(`/cards/likes/${cardId}`, {
        method: "PUT",
      });
    }
  
    dislikeCard(cardId) {
      return this._fetch(`/cards/likes/${cardId}`, {
        method: "DELETE",
      });
    }
  
    toggleLike(cardId, isliked) {
      return isliked ? this.dislikeCard(cardId) : this.likeCard(cardId);
    }
  }
  
  const api = new Api({
    baseUrl: "https://around.nomoreparties.co/v1/web-es-cohort-16",
    getAuthToken: () => "8a4f71dd-3b26-4bfa-a79c-46527c68df13",
  });
  
  export default api;
  
