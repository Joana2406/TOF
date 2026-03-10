// © 2025–2026 Joana Uribe — Todos los derechos reservados.
// Uso, copia o distribución sin autorización escrita está prohibido.
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, useWindowDimensions, Modal, Alert, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Line, Rect, Path, Ellipse, G, Polygon } from 'react-native-svg';
import colors from '../theme/colors';
import { usePacientes } from '../context/PacientesContext';

const grupos = ['Todos', 'Miembro superior', 'Miembro inferior', 'Cognitivo', 'Sensorial', 'Respiratorio'];

const FiguraSentada = () => (
  <G>
    <Rect x="30" y="105" width="60" height="5" rx="2" fill={colors.darkGreen} />
    <Line x1="35" y1="110" x2="35" y2="135" stroke={colors.darkGreen} strokeWidth="4" strokeLinecap="round" />
    <Line x1="85" y1="110" x2="85" y2="135" stroke={colors.darkGreen} strokeWidth="4" strokeLinecap="round" />
    <Rect x="45" y="68" width="30" height="38" rx="8" fill={colors.midGreen} />
    <Circle cx="60" cy="52" r="14" fill={colors.sage} />
    <Circle cx="55" cy="50" r="2" fill={colors.deepForest} />
    <Circle cx="65" cy="50" r="2" fill={colors.deepForest} />
    <Rect x="45" y="104" width="14" height="28" rx="5" fill={colors.midGreen} />
    <Rect x="63" y="104" width="14" height="28" rx="5" fill={colors.midGreen} />
    <Ellipse cx="52" cy="133" rx="9" ry="5" fill={colors.sage} />
    <Ellipse cx="70" cy="133" rx="9" ry="5" fill={colors.sage} />
  </G>
);

const FiguraDePie = () => (
  <G>
    <Circle cx="70" cy="22" r="14" fill={colors.sage} />
    <Circle cx="65" cy="20" r="2" fill={colors.deepForest} />
    <Circle cx="75" cy="20" r="2" fill={colors.deepForest} />
    <Rect x="66" y="35" width="8" height="8" rx="3" fill={colors.sage} />
    <Rect x="52" y="42" width="36" height="42" rx="10" fill={colors.midGreen} />
    <Rect x="54" y="82" width="14" height="36" rx="6" fill={colors.midGreen} />
    <Ellipse cx="61" cy="120" rx="10" ry="5" fill={colors.sage} />
    <Rect x="72" y="82" width="14" height="36" rx="6" fill={colors.midGreen} />
    <Ellipse cx="79" cy="120" rx="10" ry="5" fill={colors.sage} />
  </G>
);

const SvgPinzaLateral = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Line x1="75" y1="78" x2="112" y2="95" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Line x1="112" y1="95" x2="118" y2="118" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Ellipse cx="118" cy="124" rx="9" ry="7" fill={colors.mint} />
    <Ellipse cx="109" cy="120" rx="5" ry="4" fill={colors.mint} transform="rotate(-30 109 120)" />
    <Rect x="124" y="113" width="7" height="15" rx="3.5" fill={colors.mint} />
    <Ellipse cx="116" cy="117" rx="5" ry="7" fill="#e8c97a" opacity="0.9" />
  </Svg>
);
const SvgFlexionMuneca = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="10" y="118" width="110" height="6" rx="3" fill={colors.darkGreen} />
    <Line x1="45" y1="80" x2="95" y2="115" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Rect x="88" y="107" width="38" height="12" rx="6" fill={colors.sage} />
    <Rect x="122" y="82" width="12" height="22" rx="5" fill={colors.mint} />
    <Path d="M 134 112 Q 140 95 134 80" stroke={colors.mint} strokeWidth="2.5" fill="none" />
  </Svg>
);
const SvgOposicionPulgares = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Line x1="52" y1="76" x2="35" y2="100" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Line x1="68" y1="76" x2="85" y2="100" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Ellipse cx="28" cy="108" rx="10" ry="8" fill={colors.sage} />
    <Ellipse cx="92" cy="108" rx="10" ry="8" fill={colors.sage} />
    <Circle cx="60" cy="112" r="6" fill="#e8c97a" opacity="0.9" />
  </Svg>
);
const SvgAlcanceFuncional = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraDePie />
    <Line x1="85" y1="55" x2="118" y2="32" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Circle cx="122" cy="28" r="8" fill={colors.mint} />
    <Rect x="128" y="8" width="12" height="12" rx="3" fill="#e8c97a" opacity="0.9" />
  </Svg>
);
const SvgMarchaLugar = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <Circle cx="70" cy="20" r="14" fill={colors.sage} />
    <Rect x="52" y="40" width="36" height="38" rx="10" fill={colors.midGreen} />
    <Line x1="76" y1="76" x2="82" y2="100" stroke={colors.mint} strokeWidth="13" strokeLinecap="round" />
    <Line x1="82" y1="100" x2="74" y2="122" stroke={colors.mint} strokeWidth="11" strokeLinecap="round" />
    <Line x1="62" y1="76" x2="58" y2="105" stroke={colors.midGreen} strokeWidth="13" strokeLinecap="round" />
    <Line x1="20" y1="138" x2="120" y2="138" stroke={colors.darkGreen} strokeWidth="3" />
  </Svg>
);
const SvgEquilibrioMonopodal = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <Circle cx="70" cy="18" r="14" fill={colors.sage} />
    <Rect x="53" y="38" width="34" height="38" rx="10" fill={colors.midGreen} />
    <Line x1="53" y1="50" x2="18" y2="55" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Line x1="87" y1="50" x2="122" y2="55" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Line x1="68" y1="74" x2="64" y2="135" stroke={colors.midGreen} strokeWidth="12" strokeLinecap="round" />
    <Line x1="76" y1="74" x2="96" y2="96" stroke={colors.mint} strokeWidth="12" strokeLinecap="round" />
    <Polygon points="56,138 72,138 64,120" fill="#e8c97a" opacity="0.85" />
  </Svg>
);
const SvgSitStand = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <Rect x="75" y="88" width="55" height="6" rx="3" fill={colors.darkGreen} />
    <Circle cx="48" cy="25" r="14" fill={colors.sage} />
    <Rect x="34" y="38" width="30" height="35" rx="9" fill={colors.midGreen} transform="rotate(-15 48 55)" />
    <Line x1="46" y1="72" x2="38" y2="130" stroke={colors.mint} strokeWidth="11" strokeLinecap="round" />
    <Line x1="55" y1="72" x2="65" y2="130" stroke={colors.mint} strokeWidth="11" strokeLinecap="round" />
    <Path d="M 10 85 L 10 45 L 7 52 M 10 45 L 13 52" stroke="#e8c97a" strokeWidth="2.5" fill="none" />
  </Svg>
);
const SvgSecuenciaDigitos = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Circle cx="92" cy="25" r="22" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    <Circle cx="82" cy="25" r="6" fill={colors.midGreen} />
    <Circle cx="93" cy="20" r="6" fill={colors.sage} />
    <Circle cx="103" cy="25" r="6" fill={colors.midGreen} />
    <Circle cx="93" cy="32" r="6" fill={colors.mint} />
  </Svg>
);
const SvgClasificacion = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="5" y="118" width="130" height="5" rx="2" fill={colors.darkGreen} />
    <Rect x="8" y="95" width="35" height="25" rx="5" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="2" />
    <Rect x="97" y="95" width="35" height="25" rx="5" fill={colors.darkGreen} stroke={colors.mint} strokeWidth="2" />
    <Rect x="62" y="92" width="20" height="15" rx="5" fill="#e8c97a" opacity="0.9" />
  </Svg>
);
const SvgSeguimientoVisual = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Ellipse cx="60" cy="52" rx="18" ry="11" fill={colors.midGreen} stroke={colors.mint} strokeWidth="2" />
    <Circle cx="60" cy="52" r="7" fill={colors.darkGreen} />
    <Circle cx="120" cy="30" r="10" fill={colors.sage} />
    <Line x1="60" y1="52" x2="120" y2="30" stroke="#e8c97a" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.8" />
  </Svg>
);
const SvgJuegoTexturas = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="5" y="118" width="130" height="5" rx="2" fill={colors.darkGreen} />
    <Rect x="70" y="110" width="60" height="12" rx="4" fill={colors.darkGreen} stroke="#e8c97a" strokeWidth="2" />
    <Line x1="75" y1="78" x2="95" y2="105" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
  </Svg>
);
const SvgPropioceptivo = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Circle cx="63" cy="108" r="18" fill={colors.midGreen} stroke="#e8c97a" strokeWidth="2.5" />
    <Ellipse cx="40" cy="106" rx="9" ry="8" fill={colors.sage} />
    <Ellipse cx="86" cy="106" rx="9" ry="8" fill={colors.sage} />
  </Svg>
);
const SvgRespiracion = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <Rect x="5" y="115" width="130" height="8" rx="4" fill={colors.darkGreen} />
    <Rect x="15" y="95" width="80" height="22" rx="10" fill={colors.midGreen} />
    <Circle cx="108" cy="104" r="14" fill={colors.sage} />
    <Ellipse cx="42" cy="103" rx="12" ry="9" fill={colors.sage} opacity="0.7" />
    <Ellipse cx="62" cy="103" rx="12" ry="9" fill={colors.sage} opacity="0.7" />
    <Path d="M 52 88 L 52 78 L 49 83 M 52 78 L 55 83" stroke="#e8c97a" strokeWidth="2.5" fill="none" />
  </Svg>
);
const SvgSoplo = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="72" y="94" width="38" height="5" rx="2.5" fill={colors.midGreen} opacity="0.8" />
    <Path d="M 126 88 Q 120 76 126 68 Q 132 76 126 88" fill="#e8c97a" />
    <Rect x="5" y="118" width="130" height="5" rx="2" fill={colors.darkGreen} />
  </Svg>
);

const svgMap = {
  'Pinza lateral': <SvgPinzaLateral />, 'Flexión de muñeca': <SvgFlexionMuneca />,
  'Oposición de pulgares': <SvgOposicionPulgares />, 'Alcance funcional': <SvgAlcanceFuncional />,
  'Marcha en el lugar': <SvgMarchaLugar />, 'Equilibrio monopodal': <SvgEquilibrioMonopodal />,
  'Transferencias sit-stand': <SvgSitStand />, 'Secuencia de dígitos': <SvgSecuenciaDigitos />,
  'Clasificación de objetos': <SvgClasificacion />, 'Seguimiento visual': <SvgSeguimientoVisual />,
  'Juego de texturas': <SvgJuegoTexturas />, 'Estimulación propioceptiva': <SvgPropioceptivo />,
  'Respiración diafragmática': <SvgRespiracion />, 'Técnica de soplo': <SvgSoplo />,
};

const pasosMap = {
  'Pinza lateral': { posicion: 'Paciente sentado con codo a 90°, antebrazo en pronación sobre superficie.', pasos: ['Colocar objeto plano (moneda, ficha) entre pulgar y borde lateral del índice.','Aplicar presión sostenida durante 3 segundos sin mover el resto de la mano.','Relajar lentamente sin soltar el objeto de forma abrupta.','Transferir el objeto lateralmente sin usar los demás dedos.','Repetir con distintos tamaños para graduar la dificultad.'], precauciones: 'Evitar compensación con muñeca. No generar dolor mayor a 3/10.' },
  'Flexión de muñeca': { posicion: 'Antebrazo apoyado en superficie, mano fuera del borde en posición neutra.', pasos: ['Fijar el antebrazo con la mano contraria para evitar sustituciones.','Inspirar y en la espiración flexionar la muñeca llevando la mano hacia arriba.','Mantener la posición final 2 segundos sintiendo el estiramiento.','Regresar a posición neutra de forma controlada (no caer).','Si se usa banda elástica, fijarla bajo el pie y sostener el extremo con la mano.'], precauciones: 'Suspender ante parestesias o dolor en túnel carpiano.' },
  'Oposición de pulgares': { posicion: 'Codos flexionados a 90°, antebrazos en posición neutra frente al cuerpo.', pasos: ['Iniciar con oposición pulgar-índice de ambas manos simultáneamente.','Progresar en secuencia: pulgar-medio, pulgar-anular, pulgar-meñique.','Mantener cada oposición 2 segundos antes de cambiar.','Realizar la secuencia en orden inverso (meñique a índice).','Aumentar velocidad gradualmente manteniendo precisión del contacto.'], precauciones: 'Verificar simetría bilateral. Corregir si hay diferencia de 2+ dedos entre manos.' },
  'Alcance funcional': { posicion: 'De pie o sentado, hombros relajados, objeto a altura de hombro a 30 cm.', pasos: ['Elevar el brazo con codo en extensión hasta 90° de flexión de hombro.','Alcanzar el objeto manteniendo la escápula en posición neutra (no elevar hombro).','Tomar el objeto con agarre cilíndrico y sostener 3 segundos.','Colocar el objeto en posición alterna (repisa lateral, superior, contralateral).','Progresar aumentando distancia y variando alturas para estimular distintos planos.'], precauciones: 'Evitar inclinación de tronco compensatoria. Proteger hombro doloroso.' },
  'Marcha en el lugar': { posicion: 'De pie, pies a la anchura de caderas, superficie antideslizante.', pasos: ['Iniciar elevando rodilla derecha hasta 45° con balanceo de brazo contralateral.','Apoyar el pie con contacto talón-punta y transferir el peso completamente.','Elevar rodilla izquierda replicando el patrón con coordinación recíproca.','Mantener tronco erecto y mirada al frente durante toda la actividad.','Progresar aumentando la altura de elevación de rodillas y la velocidad.'], precauciones: 'Tener soporte cercano para equilibrio. Supervisar en pacientes con riesgo de caída.' },
  'Equilibrio monopodal': { posicion: 'De pie junto a superficie de apoyo, sin calzado o con zapato plano.', pasos: ['Iniciar con apoyo de un dedo en superficie y elevar pie no dominante.','Mantener postura con rodilla de apoyo en ligera flexión (5-10°).','Sostener el equilibrio 10 segundos progresando a 30 segundos.','Retirar el apoyo manual gradualmente conforme mejora el control postural.','Agregar perturbaciones suaves o superficie inestable (cojín) para progresar.'], precauciones: 'No realizar sin supervisión en pacientes con historial de caídas.' },
  'Transferencias sit-stand': { posicion: 'Silla firme sin ruedas, altura de asiento que permita pies planos en suelo.', pasos: ['Deslizar glúteos al borde anterior del asiento, pies ligeramente hacia atrás.','Inclinar el tronco hacia adelante hasta que los hombros queden sobre los pies.','Empujar con miembros inferiores extendiendo caderas y rodillas simultáneamente.','Completar la extensión de tronco hasta bipedestación completa.','Para sentarse: controlar el descenso de forma excéntrica, sin dejarse caer.'], precauciones: 'Usar apoyabrazos si hay debilidad severa. Evitar flexión de tronco excesiva en prótesis de cadera.' },
  'Secuencia de dígitos': { posicion: 'Paciente sentado con buena postura, ambiente sin distractores.', pasos: ['Presentar secuencia de 3 dígitos verbalmente y pedir repetición inmediata.','Aumentar progresivamente a 4, 5 y hasta 7 dígitos según capacidad.','Introducir variante inversa: repetir la secuencia en orden contrario.','Agregar interferencia cognitiva (contar hacia atrás mientras memoriza).','Registrar el span máximo alcanzado como indicador de progreso.'], precauciones: 'Ajustar velocidad de presentación en déficits de procesamiento auditivo.' },
  'Clasificación de objetos': { posicion: 'Mesa despejada con dos categorías claramente definidas y señalizadas.', pasos: ['Presentar 10 objetos mezclados de 2 categorías (forma, color, función).','Solicitar clasificación con explicación verbal del criterio utilizado.','Introducir una categoría nueva y pedir reorganización del conjunto.','Progresar a 3 categorías y objetos con características superpuestas.','Cronometrar la ejecución para evaluar velocidad de procesamiento.'], precauciones: 'Adaptar el tamaño de objetos en déficits motores finos.' },
  'Seguimiento visual': { posicion: 'Paciente sentado a 40-60 cm del objeto, cabeza fija, solo mueven los ojos.', pasos: ['Mover el objeto lentamente en trayectoria horizontal a la altura de los ojos.','Verificar que el seguimiento sea suave sin movimientos sacádicos.','Progresar a trayectoria vertical, luego diagonal y finalmente circular.','Introducir dos objetos y pedir seguimiento alternado entre ambos.','Aumentar la velocidad gradualmente hasta velocidad de lectura.'], precauciones: 'Suspender ante náuseas, vértigo o diplopía.' },
  'Juego de texturas': { posicion: 'Paciente sentado, kit de texturas a temperatura ambiente sobre la mesa.', pasos: ['Iniciar con textura de menor contraste (lisa) durante 30 segundos.','Pedir al paciente que describa verbalmente la sensación percibida.','Progresar de liso → rugoso → espinoso → vibratorio gradualmente.','Realizar identificación táctil con ojos cerrados (estereognosia).','Terminar siempre con textura neutra para cerrar el estímulo sensorial.'], precauciones: 'En hipersensibilidad táctil, iniciar con texturas en zona proximal antes de distal.' },
  'Estimulación propioceptiva': { posicion: 'Antebrazo apoyado, pelota de densidad media en la palma.', pasos: ['Aplicar compresión suave y sostenida sobre la pelota durante 5 segundos.','Variar la dirección de compresión: palmar, lateral, dorsal.','Realizar compresión axial sobre articulaciones MCF con la pelota.','Agregar rotación suave de la pelota manteniendo la presión.','Finalizar con vibración suave del dorso de la mano para integración.'], precauciones: 'Contraindicado en inflamación articular aguda o heridas abiertas.' },
  'Respiración diafragmática': { posicion: 'Decúbito supino o semisentado, una mano en pecho y otra en abdomen.', pasos: ['Inspirar lentamente por nariz durante 4 segundos; el abdomen debe elevarse.','Verificar que la mano del pecho permanezca inmóvil durante la inspiración.','Hacer pausa de 2 segundos con los pulmones llenos sin cerrar la glotis.','Espirar lentamente por boca durante 6-8 segundos con labios fruncidos.','Repetir el ciclo sin hiperventilar; el ritmo es más lento que la respiración normal.'], precauciones: 'Suspender ante mareo o parestesias peribucales (hiperventilación).' },
  'Técnica de soplo': { posicion: 'Sentado con tronco erecto, pajilla o vela a 15-20 cm de distancia.', pasos: ['Tomar aire profundamente por nariz con expansión abdominal.','Colocar la pajilla entre labios con cierre hermético.','Soplar de forma sostenida y controlada durante 3-5 segundos.','Variar la resistencia: pajilla fina = mayor resistencia espiratoria.','Progresar a soplar líquidos, inflar globo o mover objetos ligeros.'], precauciones: 'Evitar en pacientes con reflujo gastroesofágico severo o disfagia.' },
};

const ejercicios = [
  { nombre: 'Pinza lateral',             grupo: 'Miembro superior', reps: '3×10',    material: 'Plastilina',        icon: 'hand-left',       objetivo: 'Fuerza de agarre y coordinación fina' },
  { nombre: 'Flexión de muñeca',         grupo: 'Miembro superior', reps: '3×15',    material: 'Banda elástica',    icon: 'fitness',         objetivo: 'Amplitud articular y fortalecimiento' },
  { nombre: 'Oposición de pulgares',     grupo: 'Miembro superior', reps: '2×20',    material: 'Ninguno',           icon: 'hand-right',      objetivo: 'Coordinación bimanual y motricidad fina' },
  { nombre: 'Alcance funcional',         grupo: 'Miembro superior', reps: '3×8',     material: 'Objetos cotidianos',icon: 'arrow-up',        objetivo: 'Control de hombro y coordinación ojo-mano' },
  { nombre: 'Marcha en el lugar',        grupo: 'Miembro inferior', reps: '5 min',   material: 'Ninguno',           icon: 'walk',            objetivo: 'Activación muscular y coordinación' },
  { nombre: 'Equilibrio monopodal',      grupo: 'Miembro inferior', reps: '3×30s',   material: 'Cono de apoyo',     icon: 'body',            objetivo: 'Balance estático y propiocepción' },
  { nombre: 'Transferencias sit-stand',  grupo: 'Miembro inferior', reps: '3×10',    material: 'Silla firme',       icon: 'arrow-up-circle', objetivo: 'Funcionalidad en AVD y fuerza de MMII' },
  { nombre: 'Secuencia de dígitos',      grupo: 'Cognitivo',        reps: '5 rondas',material: 'Tarjetas',          icon: 'bulb',            objetivo: 'Memoria de trabajo y atención sostenida' },
  { nombre: 'Clasificación de objetos',  grupo: 'Cognitivo',        reps: '3 series',material: 'Objetos variados',  icon: 'grid',            objetivo: 'Funciones ejecutivas y razonamiento' },
  { nombre: 'Seguimiento visual',        grupo: 'Cognitivo',        reps: '10 min',  material: 'Pelota o luz',      icon: 'eye',             objetivo: 'Atención visual y coordinación óculo-manual' },
  { nombre: 'Juego de texturas',         grupo: 'Sensorial',        reps: '10 min',  material: 'Kit texturas',      icon: 'hand-left',       objetivo: 'Modulación táctil y tolerancia sensorial' },
  { nombre: 'Estimulación propioceptiva',grupo: 'Sensorial',        reps: '15 min',  material: 'Pelota de presión', icon: 'radio-button-on', objetivo: 'Integración propioceptiva y regulación' },
  { nombre: 'Respiración diafragmática', grupo: 'Respiratorio',     reps: '10 resp.',material: 'Ninguno',           icon: 'heart',           objetivo: 'Regulación respiratoria y relajación' },
  { nombre: 'Técnica de soplo',          grupo: 'Respiratorio',     reps: '5 min',   material: 'Pajillas, velas',   icon: 'partly-sunny',    objetivo: 'Control espiratorio y coordinación bucal' },
];

export default function EjerciciosScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const { pacientes, actualizarPaciente } = usePacientes();

  const [grupoActivo, setGrupoActivo] = useState('Todos');
  const [expandido,   setExpandido]   = useState(null);
  const [modalEj,     setModalEj]     = useState(null);
  const [modalReg,    setModalReg]    = useState(null);
  const [pacSelec,    setPacSelec]    = useState(null);
  const [guardando,   setGuardando]   = useState(false);

  const isWeb = width >= 600;
  const maxW  = Math.min(width, 900);
  const cardW = isWeb ? (maxW - 48 - 16) / 2 : maxW - 32;

  const filtrados = grupoActivo === 'Todos'
    ? ejercicios
    : ejercicios.filter(e => e.grupo === grupoActivo);

  const canGoBack = navigation?.canGoBack?.() ?? false;
  const pasos = modalEj ? pasosMap[modalEj.nombre] : null;

  const confirmarRegistro = () => {
    if (!pacSelec) { Alert.alert('Selecciona un paciente'); return; }
    const pac = pacientes.find(p => p.id === pacSelec);
    if (!pac) return;
    if (!pac.sesiones || pac.sesiones.length === 0) {
      Alert.alert('Sin sesiones', `${pac.nombre} no tiene sesiones. ¿Crear una?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Crear sesión', onPress: () => { setModalReg(null); setPacSelec(null); navigation.navigate('NuevaSesion', { pacienteId: pac.id }); } }
      ]);
      return;
    }
    setGuardando(true);
    const sesionesActualizadas = [...pac.sesiones];
    const ultimaIdx = sesionesActualizadas.length - 1;
    const ultimaSesion = { ...sesionesActualizadas[ultimaIdx] };
    const actividadesActuales = ultimaSesion.actividades || [];
    const ejercicioStr = `${modalReg.nombre} (${modalReg.reps})`;
    if (actividadesActuales.includes(ejercicioStr)) {
      setGuardando(false);
      Alert.alert('Ya registrado', `"${modalReg.nombre}" ya está en la última sesión.`);
      return;
    }
    ultimaSesion.actividades = [...actividadesActuales, ejercicioStr];
    sesionesActualizadas[ultimaIdx] = ultimaSesion;
    actualizarPaciente({ ...pac, sesiones: sesionesActualizadas });
    setTimeout(() => {
      setGuardando(false); setModalReg(null); setPacSelec(null);
      Alert.alert('✓ Registrado', `"${modalReg.nombre}" agregado a la última sesión de ${pac.nombre}.`,
        [{ text: 'Ver paciente', onPress: () => navigation.navigate('DetallePaciente', { pacienteId: pac.id }) }, { text: 'OK', style: 'cancel' }]
      );
    }, 400);
  };

  return (
    <SafeAreaView style={s.safe}>

      {/* HEADER — fuera del scroll, altura fija */}
      <View style={s.topBar}>
        <View style={s.topLeft}>
          {canGoBack && (
            <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={colors.mint} />
            </TouchableOpacity>
          )}
          <View>
            <Text style={s.title}>Rehabilitación</Text>
            <Text style={s.subtitle}>{filtrados.length} ejercicios</Text>
          </View>
        </View>
      </View>

      {/* FILTROS — altura fija */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={s.chipScroll}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {grupos.map(g => (
          <TouchableOpacity
            key={g}
            style={[s.chip, grupoActivo === g && s.chipActive]}
            onPress={() => { setGrupoActivo(g); setExpandido(null); }}
          >
            <Text style={[s.chipTxt, grupoActivo === g && s.chipActiveTxt]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LISTA — ocupa todo el espacio restante y hace scroll */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={s.listScroll}
        contentContainerStyle={[s.listaContent, isWeb && s.listaContentWeb]}
      >
        {filtrados.map((e, i) => {
          const estaExpandido = expandido === i;
          return (
            <TouchableOpacity
              key={i}
              style={[s.card, { width: cardW }, estaExpandido && s.cardExpanded]}
              onPress={() => setExpandido(estaExpandido ? null : i)}
              activeOpacity={0.85}
            >
              <View style={s.cardRow}>
                <View style={s.iconBox}>
                  <Ionicons name={e.icon} size={22} color={colors.mint} />
                </View>
                <View style={s.info}>
                  <Text style={s.nombre}>{e.nombre}</Text>
                  <Text style={s.grupo}>{e.grupo}</Text>
                  <View style={s.tagsRow}>
                    <View style={s.tagChip}><Ionicons name="repeat" size={10} color={colors.sage} /><Text style={s.tagChipTxt}>{e.reps}</Text></View>
                    <View style={s.tagChip}><Ionicons name="construct" size={10} color={colors.sage} /><Text style={s.tagChipTxt}>{e.material}</Text></View>
                  </View>
                </View>
                <Ionicons name={estaExpandido ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
              </View>

              {estaExpandido && (
                <View style={s.detalle}>
                  <View style={s.svgWrap}>{svgMap[e.nombre]}</View>
                  <View style={s.detalleRow}><Ionicons name="flag" size={14} color={colors.sage} /><Text style={s.detalleTxt}><Text style={s.detalleLabel}>Objetivo: </Text>{e.objetivo}</Text></View>
                  <View style={s.detalleRow}><Ionicons name="construct" size={14} color={colors.sage} /><Text style={s.detalleTxt}><Text style={s.detalleLabel}>Material: </Text>{e.material}</Text></View>
                  <View style={s.detalleRow}><Ionicons name="repeat" size={14} color={colors.sage} /><Text style={s.detalleTxt}><Text style={s.detalleLabel}>Series/Reps: </Text>{e.reps}</Text></View>
                  <View style={s.botonesRow}>
                    <TouchableOpacity style={s.leerMasBtn} onPress={() => setModalEj(e)}>
                      <Ionicons name="book-outline" size={14} color={colors.mint} />
                      <Text style={s.leerMasBtnTxt}>Leer más</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.iniciarBtn} onPress={() => { setModalReg(e); setPacSelec(null); }}>
                      <Ionicons name="play" size={14} color={colors.deepForest} />
                      <Text style={s.iniciarBtnTxt}>Registrar en sesión</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* MODAL LEER MÁS */}
      <Modal visible={!!modalEj} transparent animationType="slide">
        <View style={m.overlay}>
          <View style={[m.box, isWeb && m.boxWeb]}>
            <View style={m.header}>
              <View style={{ flex: 1 }}>
                <Text style={m.titulo}>{modalEj?.nombre}</Text>
                <Text style={m.subtitulo}>{modalEj?.grupo}</Text>
              </View>
              <TouchableOpacity style={m.closeBtn} onPress={() => setModalEj(null)}>
                <Ionicons name="close" size={20} color={colors.mint} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={m.svgWrap}>{modalEj && svgMap[modalEj.nombre]}</View>
              {pasos && (
                <>
                  <View style={m.seccion}>
                    <View style={m.seccionHeader}><Ionicons name="body" size={15} color={colors.sage} /><Text style={m.seccionTitulo}>Posición inicial</Text></View>
                    <Text style={m.seccionTxt}>{pasos.posicion}</Text>
                  </View>
                  <View style={m.seccion}>
                    <View style={m.seccionHeader}><Ionicons name="list" size={15} color={colors.sage} /><Text style={m.seccionTitulo}>Ejecución paso a paso</Text></View>
                    {pasos.pasos.map((paso, i) => (
                      <View key={i} style={m.pasoRow}>
                        <View style={m.pasoNum}><Text style={m.pasoNumTxt}>{i + 1}</Text></View>
                        <Text style={m.pasoTxt}>{paso}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={[m.seccion, m.precWrap]}>
                    <View style={m.seccionHeader}><Ionicons name="warning" size={15} color="#e8c97a" /><Text style={[m.seccionTitulo, { color: '#e8c97a' }]}>Precauciones clínicas</Text></View>
                    <Text style={m.precTxt}>{pasos.precauciones}</Text>
                  </View>
                </>
              )}
              <View style={{ height: 30 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL REGISTRAR EN SESIÓN */}
      <Modal visible={!!modalReg} transparent animationType="slide">
        <View style={m.overlay}>
          <View style={[m.box, isWeb && m.boxWeb]}>
            <View style={m.header}>
              <View style={{ flex: 1 }}>
                <Text style={m.titulo}>Registrar en sesión</Text>
                <Text style={m.subtitulo}>{modalReg?.nombre}</Text>
              </View>
              <TouchableOpacity style={m.closeBtn} onPress={() => { setModalReg(null); setPacSelec(null); }}>
                <Ionicons name="close" size={20} color={colors.mint} />
              </TouchableOpacity>
            </View>
            <View style={r.ejInfoRow}>
              <View style={r.ejIconBox}><Ionicons name={modalReg?.icon || 'fitness'} size={20} color={colors.mint} /></View>
              <View style={{ flex: 1 }}>
                <Text style={r.ejNombre}>{modalReg?.nombre}</Text>
                <View style={r.ejTagsRow}>
                  <View style={r.ejTag}><Ionicons name="repeat" size={10} color={colors.sage} /><Text style={r.ejTagTxt}>{modalReg?.reps}</Text></View>
                  <View style={r.ejTag}><Ionicons name="layers" size={10} color={colors.sage} /><Text style={r.ejTagTxt}>{modalReg?.grupo}</Text></View>
                </View>
              </View>
            </View>
            <Text style={r.label}>Seleccionar paciente</Text>
            {pacientes.length === 0 ? (
              <View style={r.sinPacWrap}>
                <Ionicons name="person-outline" size={28} color={colors.textMuted} />
                <Text style={r.sinPacTxt}>No hay pacientes registrados</Text>
                <TouchableOpacity style={r.sinPacBtn} onPress={() => { setModalReg(null); navigation.navigate('NuevoPaciente'); }}>
                  <Text style={r.sinPacBtnTxt}>Crear paciente</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
                {pacientes.map(p => {
                  const fechaUltima = p.sesiones?.[p.sesiones.length - 1]?.fecha ?? null;
                  const seleccionado = pacSelec === p.id;
                  return (
                    <TouchableOpacity key={p.id} style={[r.pacRow, seleccionado && r.pacRowActive]} onPress={() => setPacSelec(p.id)}>
                      <View style={r.pacAvatar}><Text style={r.pacAvatarTxt}>{p.nombre.charAt(0)}</Text></View>
                      <View style={{ flex: 1 }}>
                        <Text style={[r.pacNombre, seleccionado && r.pacNombreActive]}>{p.nombre}</Text>
                        <Text style={r.pacSub}>{fechaUltima ? `Última sesión: ${fechaUltima}` : 'Sin sesiones aún'}</Text>
                      </View>
                      {seleccionado && <Ionicons name="checkmark-circle" size={20} color={colors.mint} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
            {pacSelec && (() => {
              const pac = pacientes.find(p => p.id === pacSelec);
              const tiene = pac?.sesiones?.length > 0;
              return (
                <View style={r.avisoWrap}>
                  <Ionicons name={tiene ? 'information-circle-outline' : 'alert-circle-outline'} size={14} color={tiene ? colors.sage : '#e8c97a'} />
                  <Text style={[r.avisoTxt, !tiene && { color: '#e8c97a' }]}>{tiene ? `Se agregará a la última sesión de ${pac.nombre}` : `${pac?.nombre} no tiene sesiones. Se creará una nueva.`}</Text>
                </View>
              );
            })()}
            <TouchableOpacity style={[r.confirmarBtn, !pacSelec && r.confirmarBtnOff]} onPress={confirmarRegistro} disabled={!pacSelec || guardando}>
              {guardando ? <Text style={r.confirmarBtnTxt}>Guardando...</Text> : <><Ionicons name="checkmark-circle" size={16} color={colors.deepForest} /><Text style={r.confirmarBtnTxt}>Confirmar registro</Text></>}
            </TouchableOpacity>
            <View style={{ height: 20 }} />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: colors.deepForest },
  topBar:          { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  topLeft:         { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn:         { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.darkGreen, justifyContent: 'center', alignItems: 'center' },
  title:           { color: colors.mint,      fontSize: 22, fontWeight: '700' },
  subtitle:        { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  chipScroll:      { maxHeight: 46, flexGrow: 0, flexShrink: 0, marginBottom: 12 },
  chip:            { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.darkGreen },
  chipActive:      { backgroundColor: colors.sage },
  chipTxt:         { color: colors.textMuted, fontSize: 13 },
  chipActiveTxt:   { color: colors.deepForest, fontWeight: '600' },
  // ← clave: el scroll vertical ocupa todo lo que queda
  listScroll:      { flex: 1 },
  listaContent:    { paddingHorizontal: 16, paddingBottom: 40 },
  listaContentWeb: { paddingHorizontal: 24, flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
  card:            { backgroundColor: colors.darkGreen, borderRadius: 16, marginBottom: 10, overflow: 'hidden' },
  cardExpanded:    { borderWidth: 1, borderColor: colors.midGreen },
  cardRow:         { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  iconBox:         { width: 46, height: 46, borderRadius: 13, backgroundColor: colors.midGreen, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  info:            { flex: 1 },
  nombre:          { color: colors.mint,      fontSize: 14, fontWeight: '600' },
  grupo:           { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  tagsRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  tagChip:         { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.deepForest, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagChipTxt:      { color: colors.sage, fontSize: 11 },
  detalle:         { paddingHorizontal: 14, paddingBottom: 14, gap: 8 },
  svgWrap:         { alignItems: 'center', backgroundColor: colors.deepForest, borderRadius: 14, paddingVertical: 14, marginBottom: 8 },
  detalleRow:      { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  detalleLabel:    { color: colors.sage, fontWeight: '600' },
  detalleTxt:      { color: colors.textMuted, fontSize: 13, lineHeight: 20, flex: 1 },
  botonesRow:      { flexDirection: 'row', gap: 10, marginTop: 4 },
  leerMasBtn:      { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.deepForest, borderRadius: 10, paddingVertical: 10, borderWidth: 1, borderColor: colors.midGreen },
  leerMasBtnTxt:   { color: colors.mint, fontWeight: '600', fontSize: 13 },
  iniciarBtn:      { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.sage, borderRadius: 10, paddingVertical: 10 },
  iniciarBtnTxt:   { color: colors.deepForest, fontWeight: '700', fontSize: 13 },
});

const m = StyleSheet.create({
  overlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.72)', justifyContent: 'flex-end' },
  box:           { backgroundColor: colors.darkGreen, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, maxHeight: '92%' },
  boxWeb:        { maxWidth: 520, alignSelf: 'center', width: '100%', borderRadius: 22, marginBottom: 40 },
  header:        { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  titulo:        { color: colors.mint, fontSize: 18, fontWeight: '700' },
  subtitulo:     { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  closeBtn:      { padding: 6, backgroundColor: colors.midGreen, borderRadius: 10 },
  svgWrap:       { alignItems: 'center', backgroundColor: colors.deepForest, borderRadius: 16, paddingVertical: 20, marginBottom: 16 },
  seccion:       { backgroundColor: colors.deepForest, borderRadius: 14, padding: 14, marginBottom: 12 },
  seccionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  seccionTitulo: { color: colors.sage, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  seccionTxt:    { color: colors.textMuted, fontSize: 13, lineHeight: 20 },
  pasoRow:       { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  pasoNum:       { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.midGreen, justifyContent: 'center', alignItems: 'center', flexShrink: 0, marginTop: 1 },
  pasoNumTxt:    { color: colors.mint, fontSize: 12, fontWeight: '700' },
  pasoTxt:       { color: colors.mint, fontSize: 13, lineHeight: 20, flex: 1 },
  precWrap:      { borderWidth: 1, borderColor: '#e8c97a33' },
  precTxt:       { color: '#e8c97a', fontSize: 13, lineHeight: 20, opacity: 0.9 },
});

const r = StyleSheet.create({
  ejInfoRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.deepForest, borderRadius: 13, padding: 12, marginBottom: 18 },
  ejIconBox:       { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.midGreen, justifyContent: 'center', alignItems: 'center' },
  ejNombre:        { color: colors.mint, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  ejTagsRow:       { flexDirection: 'row', gap: 8 },
  ejTag:           { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.darkGreen, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 7 },
  ejTagTxt:        { color: colors.sage, fontSize: 11 },
  label:           { color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  sinPacWrap:      { alignItems: 'center', gap: 10, paddingVertical: 20 },
  sinPacTxt:       { color: colors.textMuted, fontSize: 13 },
  sinPacBtn:       { backgroundColor: colors.midGreen, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 8 },
  sinPacBtnTxt:    { color: colors.mint, fontWeight: '600', fontSize: 13 },
  pacRow:          { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 13, backgroundColor: colors.deepForest, marginBottom: 8 },
  pacRowActive:    { backgroundColor: colors.midGreen },
  pacAvatar:       { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.darkGreen, justifyContent: 'center', alignItems: 'center' },
  pacAvatarTxt:    { color: colors.mint, fontSize: 16, fontWeight: '700' },
  pacNombre:       { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  pacNombreActive: { color: colors.mint },
  pacSub:          { color: colors.textMuted, fontSize: 11, marginTop: 2, opacity: 0.7 },
  avisoWrap:       { flexDirection: 'row', alignItems: 'flex-start', gap: 7, backgroundColor: colors.deepForest, borderRadius: 10, padding: 10, marginTop: 8, marginBottom: 4 },
  avisoTxt:        { color: colors.sage, fontSize: 12, flex: 1, lineHeight: 18 },
  confirmarBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: colors.sage, borderRadius: 13, paddingVertical: 13, marginTop: 14 },
  confirmarBtnOff: { backgroundColor: colors.midGreen, opacity: 0.5 },
  confirmarBtnTxt: { color: colors.deepForest, fontWeight: '700', fontSize: 14 },
});
