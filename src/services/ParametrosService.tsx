import { getFirebaseErrorMessage } from '@/services/ErrorService.tsx';
import type { Parametro } from '@/types/Parametro';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig.js';

export const obtenerParametroPorTag = async (tag: string): Promise<Parametro | null> => {
  try {
    const q = query(
      collection(db, 'parametros'),
      where('tag', '==', tag),
      where('estado', '==', 'activo')
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn(`No se encontraron parámetros activos con tag="${tag}"`);
      return null;
    }

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();

    const parametro: Parametro = {
      id: docSnap.id,
      tag: data.tag,
      estado: data.estado,
      detalle: data.detalle,
      valor: data.valor,
    };

    return parametro;
  } catch (error) {
    console.error(error);
    throw new Error(getFirebaseErrorMessage(error));
  }
};
