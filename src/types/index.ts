export interface PlanAssigned {
  nombrePlan: string;
  planId: string;
  vigenciaDias: number;
  fechaAsignacion: string | Date;
}

export interface UserData {
  id?: string;
  nombres?: string;
  apellidos?: string;
  cedula?: string;
  correo?: string;
  direccion?: string;
  rol?: string;
  fechaCreacion?: string | Date;
  planAsignado?: PlanAssigned | null;
}

export interface Plan {
  id?: string;
  nombrePlan?: string;
  precio?: number;
  orden?: number;
  descripcion?: string;
  vigenciaDias?: number;
  caracteristicas?: any[];
}

export interface RegisterPayload {
  nombres: string;
  apellidos: string;
  cedula?: string;
  correo: string;
  direccion?: string;
  rol?: string;
  password: string;
}
