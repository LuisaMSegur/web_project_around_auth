const BASE_URL = "https://se-register-api.en.tripleten-services.com/v1";

export async function register(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en el registro");
    }

    const data = await response.json();
    console.log(data);
    return data.token;
  } catch (err) {
    console.error(`Error: ${err}`);
    throw err; 
  }
};


export async function authorize(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/signin`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error en la autorización");
  }
  const {token} = await response.json();
  console.log(token);
  localStorage.setItem("jwt", token);
  return token;
} catch (err) {
  console.log(`Error: ${err}`);
}
};

export async function checkToken(token) {
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Token inválido o expirado");
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error al verificar el token:", error);
    throw error; 
  }
}
