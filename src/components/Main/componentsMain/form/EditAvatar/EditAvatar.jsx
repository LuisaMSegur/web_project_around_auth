import React, { useRef } from "react";

export default function EditAvatar({ onUpdateAvatar, loading }){
    const avatarRef = useRef();
    

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdateAvatar(avatarRef.current.value);
      };
    return(
        <form className="form" id="form-avatar" onSubmit={handleSubmit}>
                <input type="url" name="avatar" placeholder="Enlace de la imagen" className="form__input" id="input-image"
                    required ref={avatarRef}/>
                <span className="form__input-error" id="input-image-error"></span>
                <button className="form__submit" type="submit">Guardar</button>
                {loading && <p className="form__loading">Cargando...</p>} 
            </form>
    )
}