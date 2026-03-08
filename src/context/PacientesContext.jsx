import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PacientesContext = createContext();
export const usePacientes = () => useContext(PacientesContext);

const STORAGE_KEY  = '@TOF_pacientes';
const CITAS_KEY    = '@TOF_citas';

const pacientesIniciales = [
  {
    id: '1',
    nombre: 'Laura Méndez',
    edad: 34,
    fechaNacimiento: '1990-03-12',
    sexo: 'Femenino',
    telefono: '555-1234',
    correo: 'laura@email.com',
    diagnostico: 'Lesión de hombro derecho',
    motivoConsulta: 'Limitación en rango de movimiento y dolor',
    ocupacion: 'Maestra',
    estadoCivil: 'Casada',
    escolaridad: 'Licenciatura',
    alergias: 'Penicilina',
    medicamentos: 'Ibuprofeno 400mg',
    antecedentes: {
      heredofamiliares: 'Madre con HTA, padre con DM2',
      personalesPatologicos: 'Fractura de clavícula 2018',
      personalesNoPatologicos: 'Tabaquismo negado, alcoholismo social',
      quirurgicos: 'Ninguno',
      traumatologicos: 'Fractura clavícula 2018',
      ginecologicos: 'G2 P2 C0',
    },
    sesiones: [
      { id: 's1', fecha: '2024-01-10', duracion: '50 min', actividades: ['Movilización activa', 'Termoterapia'], notas: 'Buena tolerancia', objetivo: 'Mejorar ROM', respuesta: 'Cooperadora', planSiguiente: 'Fortalecimiento', terapeuta: 'Fernanda TO' },
      { id: 's2', fecha: '2024-01-17', duracion: '50 min', actividades: ['Fortalecimiento rotadores'], notas: 'Mejora notable en ROM', objetivo: 'Fortalecimiento', respuesta: 'Excelente', planSiguiente: 'AVD', terapeuta: 'Fernanda TO' },
    ],
    evaluaciones: [
      { id: 'e1', nombre: 'COPM', fecha: '2024-01-05', puntaje: '6.5 / 10', observaciones: 'Dificultad en AVD productivas' },
    ],
    proximaCita: 'Hoy 10:00',
    activo: true,
  },
  {
    id: '2',
    nombre: 'Carlos Reyes',
    edad: 58,
    fechaNacimiento: '1966-07-22',
    sexo: 'Masculino',
    telefono: '555-5678',
    correo: 'carlos@email.com',
    diagnostico: 'Rehabilitación post-ACV isquémico',
    motivoConsulta: 'Hemiparesia derecha, dificultad en AVD',
    ocupacion: 'Contador (jubilado)',
    estadoCivil: 'Casado',
    escolaridad: 'Licenciatura',
    alergias: 'Ninguna conocida',
    medicamentos: 'Ácido acetilsalicílico, Atorvastatina',
    antecedentes: {
      heredofamiliares: 'Padre con cardiopatía, hermano con DM2',
      personalesPatologicos: 'HTA 10 años, Dislipidemia',
      personalesNoPatologicos: 'Ex fumador 20 años, alcoholismo negado',
      quirurgicos: 'Colecistectomía 2010',
      traumatologicos: 'Ninguno',
      ginecologicos: 'N/A',
    },
    sesiones: [
      { id: 's3', fecha: '2024-01-08', duracion: '60 min', actividades: ['Facilitación neuromuscular', 'AVD básicas'], notas: 'Paciente cooperador', objetivo: 'Independencia AVD', respuesta: 'Positiva', planSiguiente: 'Marcha', terapeuta: 'Fernanda TO' },
    ],
    evaluaciones: [
      { id: 'e2', nombre: 'FIM', fecha: '2024-01-06', puntaje: '72 / 126', observaciones: 'Dependencia moderada en AVD' },
      { id: 'e3', nombre: 'Barthel', fecha: '2024-01-06', puntaje: '55 / 100', observaciones: 'Requiere asistencia parcial' },
    ],
    proximaCita: 'Hoy 12:30',
    activo: true,
  },
  {
    id: '3',
    nombre: 'Sofía Jiménez',
    edad: 9,
    fechaNacimiento: '2015-05-03',
    sexo: 'Femenino',
    telefono: '555-9012',
    correo: 'mama.sofia@email.com',
    diagnostico: 'Trastorno de integración sensorial',
    motivoConsulta: 'Hipersensibilidad táctil, dificultad en escritura',
    ocupacion: 'Estudiante',
    estadoCivil: 'N/A',
    escolaridad: 'Primaria',
    alergias: 'Ninguna',
    medicamentos: 'Ninguno',
    antecedentes: {
      heredofamiliares: 'Madre con ansiedad',
      personalesPatologicos: 'Ninguno',
      personalesNoPatologicos: 'Nacimiento a término, desarrollo psicomotor normal',
      quirurgicos: 'Ninguno',
      traumatologicos: 'Ninguno',
      ginecologicos: 'N/A',
    },
    sesiones: [
      { id: 's4', fecha: '2024-01-09', duracion: '45 min', actividades: ['Juego de texturas', 'Integración sensorial'], notas: 'Tolerancia mejorada', objetivo: 'Reducir hipersensibilidad', respuesta: 'Colaboradora', planSiguiente: 'Escritura', terapeuta: 'Fernanda TO' },
    ],
    evaluaciones: [
      { id: 'e4', nombre: 'Sensory Profile', fecha: '2024-01-03', puntaje: 'Alta sensibilidad', observaciones: 'Hipersensibilidad táctil y auditiva marcada' },
    ],
    proximaCita: 'Mañana 9:00',
    activo: true,
  },
];

export function PacientesProvider({ children }) {
  const [pacientes, setPacientes] = useState([]);
  const [citas, setCitas]         = useState([]);
  const [cargando, setCargando]   = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [jsonPacientes, jsonCitas] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(CITAS_KEY),
        ]);
        setPacientes(jsonPacientes ? JSON.parse(jsonPacientes) : pacientesIniciales);
        setCitas(jsonCitas ? JSON.parse(jsonCitas) : []);
        if (!jsonPacientes) {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pacientesIniciales));
        }
      } catch (e) {
        console.error('Error cargando datos:', e);
        setPacientes(pacientesIniciales);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  useEffect(() => {
    if (!cargando) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pacientes)).catch(console.error);
    }
  }, [pacientes, cargando]);

  useEffect(() => {
    if (!cargando) {
      AsyncStorage.setItem(CITAS_KEY, JSON.stringify(citas)).catch(console.error);
    }
  }, [citas, cargando]);

  const agregarPaciente = (paciente) => {
    const nuevo = { ...paciente, id: Date.now().toString(), sesiones: [], evaluaciones: [], activo: true };
    setPacientes(prev => [nuevo, ...prev]);
    return nuevo.id;
  };

  const actualizarPaciente = (id, datos) => {
    setPacientes(prev => prev.map(p => p.id === id ? { ...p, ...datos } : p));
  };

  const eliminarPaciente = (id) => {
    setPacientes(prev => prev.filter(p => p.id !== id));
  };

  const agregarSesion = (pacienteId, sesion) => {
    const nueva = { ...sesion, id: Date.now().toString() };
    setPacientes(prev => prev.map(p =>
      p.id === pacienteId ? { ...p, sesiones: [nueva, ...p.sesiones] } : p
    ));
  };

  const agregarEvaluacion = (pacienteId, evaluacion) => {
    const nueva = { ...evaluacion, id: Date.now().toString() };
    setPacientes(prev => prev.map(p =>
      p.id === pacienteId ? { ...p, evaluaciones: [nueva, ...p.evaluaciones] } : p
    ));
  };

  const agregarCita = (cita) => {
    const nueva = { ...cita, id: Date.now().toString() };
    setCitas(prev => [...prev, nueva]);
    return nueva.id;
  };

  const actualizarCita = (id, datos) => {
    setCitas(prev => prev.map(c => c.id === id ? { ...c, ...datos } : c));
  };

  const eliminarCita = (id) => {
    setCitas(prev => prev.filter(c => c.id !== id));
  };

  const limpiarTodo = async () => {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEY),
      AsyncStorage.removeItem(CITAS_KEY),
    ]);
    setPacientes(pacientesIniciales);
    setCitas([]);
  };

  return (
    <PacientesContext.Provider value={{
      pacientes, citas, cargando,
      agregarPaciente, actualizarPaciente, eliminarPaciente,
      agregarSesion, agregarEvaluacion,
      agregarCita, actualizarCita, eliminarCita,
      limpiarTodo,
    }}>
      {children}
    </PacientesContext.Provider>
  );
}