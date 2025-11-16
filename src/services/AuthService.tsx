import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updatePassword,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig.js';
import type { PlanAssigned, RegisterPayload, UserData } from '@/types/index.ts';
import { saveSession } from '@/utils/session.ts'; // Helper de SecureStore
import { getFirebaseErrorMessage } from '@/services/ErrorService.tsx';

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
}: RegisterPayload): Promise<void> => {
  try {
    // Crear usuario en Auth
    const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
    const uid = userCredential.user.uid;

    // Buscar el plan con orden 1
    const plansQuery = query(collection(db, 'plans'), where('orden', '==', 1), orderBy('orden'));
    const querySnapshot = await getDocs(plansQuery);

    let planAsignado: PlanAssigned | null = null;
    if (!querySnapshot.empty) {
      const planDoc = querySnapshot.docs[0];
      const planData = planDoc.data();

      planAsignado = {
        nombrePlan: planData.nombrePlan,
        planId: planDoc.id,
        vigenciaDias: planData.vigenciaDias,
        fechaAsignacion: new Date(),
      } as PlanAssigned;
    }

    // Guardar datos adicionales en Firestore
    await setDoc(doc(db, 'users', uid), {
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
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Consultar el usuario en Firestore
    const usersQuery = query(collection(db, 'users'), where('correo', '==', email));
    const querySnapshot = await getDocs(usersQuery);

    if (querySnapshot.empty) {
      throw new Error('No se encontró el usuario en la base de datos.');
    }

    const userDoc = querySnapshot.docs[0];
    const userData: UserData = { id: userDoc.id, ...(userDoc.data() as any) };

    await saveSession('user', userData);
    return userCredential;
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
};

/**
 * Obtiene los datos del usuario autenticado desde Firestore
 */
export const getUserData = async (): Promise<UserData | null> => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return null;
    return { id: user.uid, ...(userSnap.data() as any) } as UserData;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener los datos del usuario');
  }
};

/**
 * Actualiza los datos del perfil en Firestore
 */
export const updateUserProfile = async (data: Partial<UserData>): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      ...data,
      fechaActualizacion: new Date(),
    });

    return true;
  } catch (error) {
    console.error(error);
    throw new Error('Error al actualizar el perfil');
  }
};

/**
 * Actualiza la contraseña del usuario (requiere contraseña actual)
 */
export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');

    // Reautenticar antes de cambiar contraseña
    const credential = EmailAuthProvider.credential(user.email as string, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Actualizar contraseña
    await updatePassword(user, newPassword);

    return true;
  } catch (error) {
    console.error(error);
    throw new Error(getFirebaseErrorMessage(error));
  }
};
export const resetUserPassword = async (email: string) => {
  try {
    if (!email) throw new Error('El correo es requerido');
    await sendPasswordResetEmail(auth, email.trim());
    return true;
  } catch (error) {
    console.error(error);
    throw new Error(getFirebaseErrorMessage(error));
  }
};
