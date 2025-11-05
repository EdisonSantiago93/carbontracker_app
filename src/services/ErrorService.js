// src/services/ErrorService.js

const errorMessages = {
  "auth/invalid-email": "El correo electrónico no es válido.",
  "auth/user-disabled": "Este usuario ha sido deshabilitado.",
  "auth/user-not-found": "No existe una cuenta con este correo.",
  "auth/email-already-in-use": "Este correo ya está registrado.",
  "auth/wrong-password": "La contraseña es incorrecta.",
  "auth/invalid-credential": "No existe el usuario.",
  "auth/weak-password": "La contraseña es muy débil, usa al menos 6 caracteres.",
};

export const getFirebaseErrorMessage = (error) => {

  // Firebase a veces devuelve error.code o error.message
  const code = error.code || "";
  return errorMessages[code] || "Ocurrió un error, inténtalo de nuevo.";
};
