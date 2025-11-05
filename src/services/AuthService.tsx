import { auth, db } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  collection,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { getFirebaseErrorMessage } from "./ErrorService";
import { saveSession } from "../utils/session"; // Helper de SecureStore

/**
 * Registra un usuario en Firebase
 */
export const registerUserWithFirestore = async ({
  nombres,
  apellidos,
  cedula,
  correo,
  direccion,
  rol,
  password,
}: any) => {
  try {
    // Crear usuario en Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      correo,
      password
    );
    const uid = userCredential.user.uid;

    // Buscar el plan con orden 1
    const plansQuery = query(
      collection(db, "plans"),
      where("orden", "==", 1),
      orderBy("orden")
    );
    const querySnapshot = await getDocs(plansQuery);

    let planAsignado = null;
    if (!querySnapshot.empty) {
      const planDoc = querySnapshot.docs[0];
      const planData = planDoc.data();

      planAsignado = {
        nombrePlan: planData.nombrePlan,
        planId: planDoc.id,
        vigenciaDias: planData.vigenciaDias,
        fechaAsignacion: new Date(),
      };
    }

    // Guardar datos adicionales en Firestore
    await setDoc(doc(db, "users", uid), {
      nombres,
      apellidos,
      cedula,
      correo,
      direccion,
      rol,
      fechaCreacion: new Date(),
      planAsignado,
    });
  } catch (error) {
    console.error(error);
    throw new Error(getFirebaseErrorMessage(error));
  }
};

/**
 * Inicia sesión un usuario en Firebase
 */
export const loginUser = async (email:any, password:any) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Consultar el usuario en Firestore
    const usersQuery = query(collection(db, "users"), where("correo", "==", email));
    const querySnapshot = await getDocs(usersQuery);

    if (querySnapshot.empty) {
      throw new Error("No se encontró el usuario en la base de datos.");
    }

    const userDoc = querySnapshot.docs[0];
    const userData = { id: userDoc.id, ...userDoc.data() };

    await saveSession("user", userData);
    return userCredential;
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
};

/**
 * Obtiene los datos del usuario autenticado desde Firestore
 */
export const getUserData = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return null;
    return { id: user.uid, ...userSnap.data() };
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener los datos del usuario");
  }
};

/**
 * Actualiza los datos del perfil en Firestore
 */
export const updateUserProfile = async (data:any) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No hay usuario autenticado");

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      ...data,
      fechaActualizacion: new Date(),
    });

    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Error al actualizar el perfil");
  }
};

/**
 * Actualiza la contraseña del usuario (requiere contraseña actual)
 */
export const updateUserPassword = async (currentPassword:any, newPassword:any) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No hay usuario autenticado");

    // Reautenticar antes de cambiar contraseña
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Actualizar contraseña
    await updatePassword(user, newPassword);

    return true;
  } catch (error) {
    console.error(error);
    throw new Error(getFirebaseErrorMessage(error));
  }
};
export const resetUserPassword = async (email:any) => {
  try {
    if (!email) throw new Error("El correo es requerido");
    await sendPasswordResetEmail(auth, email.trim());
    return true;
  } catch (error) {
    console.error(error);
    throw new Error(getFirebaseErrorMessage(error));
  }
};