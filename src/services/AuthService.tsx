import { getFirebaseErrorMessage } from '@/services/ErrorService.tsx';
import type { PlanAssigned, RegisterPayload, UserData } from '@/types/index.ts';
import { saveSession } from '@/utils/session.ts';
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
    const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
    const uid = userCredential.user.uid;

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

    await setDoc(doc(db, 'users', uid), {
      nombres,
      apellidos,
      cedula,
      correo,
      direccion,
      rol,
      fechaCreacion: new Date(),
      planAsignado,
      estado: 'activo', // Estado por defecto
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

    const usersQuery = query(collection(db, 'users'), where('correo', '==', email));
    const querySnapshot = await getDocs(usersQuery);

    if (querySnapshot.empty) {
      throw new Error('No se encontró el usuario en la base de datos.');
    }

    const userDoc = querySnapshot.docs[0];
    const userData: UserData = { id: userDoc.id, ...(userDoc.data() as any) };

    // Verificar si la cuenta está eliminada
    if (userData.estado === 'eliminado') {
      // Cerrar sesión de Firebase Auth
      await auth.signOut();
      throw new Error('Tu cuenta ha sido desactivada. Contacta al administrador para reactivarla.');
    }

    await saveSession('user', userData);
    return userCredential;
  } catch (error: any) {
    // Si es un error personalizado (como cuenta eliminada), lanzarlo directamente
    if (error.message && (
      error.message.includes('desactivada') || 
      error.message.includes('No se encontró')
    )) {
      throw error;
    }
    // Si es un error de Firebase, usar el mensaje traducido
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

    const credential = EmailAuthProvider.credential(user.email as string, currentPassword);
    await reauthenticateWithCredential(user, credential);

    await updatePassword(user, newPassword);

    return true;
  } catch (error) {
    console.error(error);
    throw new Error(getFirebaseErrorMessage(error));
  }
};

/**
 * Envía correo para resetear contraseña
 */
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

/**
 * Desactiva (elimina) la cuenta del usuario
 * Cambia el estado a 'eliminado' en Firestore
 */
export const deleteUserAccount = async (currentPassword: string): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');

    // Reautenticar para confirmar la identidad
    const credential = EmailAuthProvider.credential(user.email as string, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Actualizar estado en Firestore
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      estado: 'eliminado',
      fechaEliminacion: new Date(),
    });

    // Cerrar sesión
    await auth.signOut();

    return true;
  } catch (error) {
    console.error(error);
    throw new Error(getFirebaseErrorMessage(error));
  }
};

/**
 * Reactiva una cuenta eliminada (Solo para administradores o sistema)
 * Esta función debería ser llamada por un admin o a través de un proceso especial
 */
export const reactivateUserAccount = async (userId: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error('Usuario no encontrado');
    }

    const userData = userSnap.data();
    if (userData.estado !== 'eliminado') {
      throw new Error('La cuenta ya está activa');
    }

    await updateDoc(userRef, {
      estado: 'activo',
      fechaReactivacion: new Date(),
    });

    return true;
  } catch (error) {
    console.error(error);
    throw new Error('Error al reactivar la cuenta');
  }
};

/**
 * Busca un usuario por correo para reactivación
 */
export const findUserByEmail = async (email: string): Promise<{ id: string; estado: string } | null> => {
  try {
    const usersQuery = query(collection(db, 'users'), where('correo', '==', email.trim()));
    const querySnapshot = await getDocs(usersQuery);

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    return {
      id: userDoc.id,
      estado: userData.estado || 'activo',
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error al buscar el usuario');
  }
};