import * as SecureStore from 'expo-secure-store';

// Guardar un valor (objeto o string)
export async function saveSession(key, value) {
  try {
    const jsonValue = JSON.stringify(value);
    await SecureStore.setItemAsync(key, jsonValue);
  } catch (error) {
    console.error("Error guardando sesión:", error);
  }
}

// Leer un valor
export async function getSession(key) {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error obteniendo sesión:", error);
    return null;
  }
}

// Eliminar un valor
export async function removeSession(key) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error("Error eliminando sesión:", error);
  }
}
