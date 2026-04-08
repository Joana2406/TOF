// © 2025–2026 Joana Uribe — Todos los derechos reservados.
// Uso, copia o distribución sin autorización escrita está prohibido.
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, useWindowDimensions, Modal, Alert, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Line, Rect, Path, Ellipse, G, Polygon, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';
import colors from '../theme/colors';
import { usePacientes } from '../context/PacientesContext';

// ─── GRUPOS ────────────────────────────────────────────────────────────────────
const grupos = [
  'Todos',
  'Miembro superior',
  'Miembro inferior',
  'Cognitivo',
  'Sensorial',
  'Respiratorio',
  'Columna y espalda',
  'Coordinación y equilibrio',
  'AVD',
  'Visual / Perceptual',
  'Relajación',
  'Social / Emocional',
  'TDAH e hiperactividad',
  'Discapacidad intelectual',
  'Autismo / TEA',
  'Prótesis y amputación',
  'Silla de ruedas',
  'Post-accidente / trauma',
  'Neurológico',
  'Mano y muñeca',
  'Salud mental',
  'Pediátrico',
  'Oncológico',
  'Geriátrico',
  'Lesión medular',
];

// ─── FIGURAS BASE MEJORADAS ───────────────────────────────────────────────────
// Figura sentada — proporciones naturales, sombreado, detalles faciales
const FiguraSentada = () => (
  <G>
    {/* Silla */}
    <Rect x="22" y="100" width="68" height="5" rx="2.5" fill={colors.deepForest} />
    <Rect x="24" y="104" width="5" height="26" rx="2.5" fill={colors.deepForest} />
    <Rect x="82" y="104" width="5" height="26" rx="2.5" fill={colors.deepForest} />
    <Rect x="20" y="64" width="5" height="40" rx="2.5" fill={colors.deepForest} />
    {/* Muslos */}
    <Rect x="30" y="100" width="18" height="28" rx="9" fill={colors.midGreen} />
    <Rect x="60" y="100" width="18" height="28" rx="9" fill={colors.midGreen} />
    {/* Pies */}
    <Ellipse cx="39" cy="132" rx="11" ry="5" fill={colors.sage} />
    <Ellipse cx="69" cy="132" rx="11" ry="5" fill={colors.sage} />
    {/* Torso */}
    <Rect x="28" y="60" width="56" height="44" rx="14" fill={colors.midGreen} />
    {/* Detalle torso (pliegue) */}
    <Path d="M 42 70 Q 56 66 70 70" stroke={colors.darkGreen} strokeWidth="1.2" fill="none" opacity="0.5" />
    {/* Cuello */}
    <Rect x="50" y="52" width="12" height="12" rx="5" fill={colors.sage} />
    {/* Cabeza */}
    <Circle cx="56" cy="40" r="16" fill={colors.sage} />
    {/* Orejas */}
    <Ellipse cx="40" cy="40" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="72" cy="40" rx="4" ry="5" fill={colors.sage} />
    {/* Ojos */}
    <Ellipse cx="51" cy="37" rx="3.5" ry="4" fill="white" />
    <Ellipse cx="61" cy="37" rx="3.5" ry="4" fill="white" />
    <Circle cx="52" cy="38" r="2" fill={colors.deepForest} />
    <Circle cx="62" cy="38" r="2" fill={colors.deepForest} />
    <Circle cx="52.8" cy="37.2" r="0.7" fill="white" />
    <Circle cx="62.8" cy="37.2" r="0.7" fill="white" />
    {/* Boca */}
    <Path d="M 51 44 Q 56 47 61 44" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </G>
);

// Figura de pie — proporciones naturales
const FiguraDePie = () => (
  <G>
    {/* Piernas */}
    <Rect x="48" y="80" width="14" height="48" rx="7" fill={colors.midGreen} />
    <Rect x="66" y="80" width="14" height="48" rx="7" fill={colors.midGreen} />
    {/* Pies */}
    <Ellipse cx="55" cy="132" rx="11" ry="5" fill={colors.sage} />
    <Ellipse cx="73" cy="132" rx="11" ry="5" fill={colors.sage} />
    {/* Torso */}
    <Rect x="40" y="38" width="48" height="46" rx="14" fill={colors.midGreen} />
    {/* Pliegue torso */}
    <Path d="M 52 50 Q 64 46 76 50" stroke={colors.darkGreen} strokeWidth="1.2" fill="none" opacity="0.5" />
    {/* Cuello */}
    <Rect x="58" y="30" width="12" height="12" rx="5" fill={colors.sage} />
    {/* Cabeza */}
    <Circle cx="64" cy="18" r="16" fill={colors.sage} />
    {/* Orejas */}
    <Ellipse cx="48" cy="18" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="80" cy="18" rx="4" ry="5" fill={colors.sage} />
    {/* Ojos */}
    <Ellipse cx="59" cy="15" rx="3.5" ry="4" fill="white" />
    <Ellipse cx="69" cy="15" rx="3.5" ry="4" fill="white" />
    <Circle cx="60" cy="16" r="2" fill={colors.deepForest} />
    <Circle cx="70" cy="16" r="2" fill={colors.deepForest} />
    <Circle cx="60.8" cy="15.2" r="0.7" fill="white" />
    <Circle cx="70.8" cy="15.2" r="0.7" fill="white" />
    {/* Boca */}
    <Path d="M 59 22 Q 64 25 69 22" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </G>
);

// Figura acostada en colchoneta
const FiguraAcostada = () => (
  <G>
    {/* Colchoneta */}
    <Rect x="5" y="115" width="130" height="12" rx="6" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Piernas */}
    <Rect x="70" y="94" width="14" height="24" rx="7" fill={colors.midGreen} />
    <Rect x="88" y="94" width="14" height="24" rx="7" fill={colors.midGreen} />
    {/* Pies */}
    <Ellipse cx="77" cy="118" rx="9" ry="4" fill={colors.sage} />
    <Ellipse cx="95" cy="118" rx="9" ry="4" fill={colors.sage} />
    {/* Torso */}
    <Rect x="40" y="88" width="36" height="28" rx="10" fill={colors.midGreen} />
    {/* Brazo */}
    <Rect x="26" y="94" width="16" height="26" rx="8" fill={colors.midGreen} />
    <Ellipse cx="26" cy="94" rx="8" ry="5" fill={colors.sage} />
    {/* Cuello + Cabeza */}
    <Rect x="38" y="80" width="10" height="12" rx="5" fill={colors.sage} />
    <Circle cx="26" cy="74" r="16" fill={colors.sage} />
    <Ellipse cx="20" cy="82" rx="4" ry="5" fill={colors.sage} />
    {/* Ojos */}
    <Ellipse cx="21" cy="71" rx="3.5" ry="4" fill="white" />
    <Ellipse cx="31" cy="71" rx="3.5" ry="4" fill="white" />
    <Circle cx="22" cy="72" r="2" fill={colors.deepForest} />
    <Circle cx="32" cy="72" r="2" fill={colors.deepForest} />
    <Circle cx="22.8" cy="71.2" r="0.7" fill="white" />
    <Circle cx="32.8" cy="71.2" r="0.7" fill="white" />
    <Path d="M 21 77 Q 26 80 31 77" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </G>
);

// Figura en silla de ruedas
const FiguraSillaRuedas = () => (
  <G>
    {/* Ruedas grandes */}
    <Circle cx="38" cy="118" r="22" fill="none" stroke={colors.darkGreen} strokeWidth="4" />
    <Circle cx="38" cy="118" r="14" fill="none" stroke={colors.midGreen} strokeWidth="2.5" />
    <Circle cx="38" cy="118" r="5" fill={colors.midGreen} />
    {/* Radios rueda izq */}
    <Line x1="38" y1="96" x2="38" y2="113" stroke={colors.sage} strokeWidth="1.5" opacity="0.6" />
    <Line x1="23" y1="103" x2="33" y2="115" stroke={colors.sage} strokeWidth="1.5" opacity="0.6" />
    <Line x1="16" y1="118" x2="33" y2="118" stroke={colors.sage} strokeWidth="1.5" opacity="0.6" />
    <Line x1="23" y1="133" x2="33" y2="121" stroke={colors.sage} strokeWidth="1.5" opacity="0.6" />
    <Line x1="38" y1="140" x2="38" y2="123" stroke={colors.sage} strokeWidth="1.5" opacity="0.6" />
    <Line x1="53" y1="133" x2="43" y2="121" stroke={colors.sage} strokeWidth="1.5" opacity="0.6" />
    <Line x1="60" y1="118" x2="43" y2="118" stroke={colors.sage} strokeWidth="1.5" opacity="0.6" />
    <Line x1="53" y1="103" x2="43" y2="115" stroke={colors.sage} strokeWidth="1.5" opacity="0.6" />
    {/* Rueda pequeña delantera */}
    <Circle cx="95" cy="130" r="8" fill="none" stroke={colors.darkGreen} strokeWidth="3" />
    <Circle cx="95" cy="130" r="3" fill={colors.midGreen} />
    {/* Estructura silla */}
    <Rect x="60" y="94" width="42" height="8" rx="4" fill={colors.darkGreen} />
    <Line x1="100" y1="100" x2="95" y2="122" stroke={colors.darkGreen} strokeWidth="4" strokeLinecap="round" />
    <Line x1="62" y1="100" x2="38" y2="118" stroke={colors.darkGreen} strokeWidth="4" strokeLinecap="round" />
    {/* Reposapiés */}
    <Rect x="86" y="116" width="22" height="4" rx="2" fill={colors.darkGreen} />
    {/* Respaldo */}
    <Rect x="58" y="64" width="6" height="34" rx="3" fill={colors.darkGreen} />
    {/* Asiento */}
    <Rect x="56" y="94" width="46" height="6" rx="3" fill={colors.darkGreen} />
    {/* Muslos paciente */}
    <Rect x="64" y="94" width="16" height="22" rx="8" fill={colors.midGreen} />
    <Rect x="82" y="94" width="14" height="22" rx="7" fill={colors.midGreen} />
    {/* Pies */}
    <Ellipse cx="72" cy="118" rx="9" ry="4" fill={colors.sage} />
    <Ellipse cx="88" cy="118" rx="8" ry="4" fill={colors.sage} />
    {/* Torso */}
    <Rect x="62" y="60" width="40" height="38" rx="12" fill={colors.midGreen} />
    <Path d="M 72 72 Q 82 68 92 72" stroke={colors.darkGreen} strokeWidth="1.2" fill="none" opacity="0.5" />
    {/* Cuello */}
    <Rect x="78" y="52" width="10" height="12" rx="5" fill={colors.sage} />
    {/* Cabeza */}
    <Circle cx="83" cy="40" r="15" fill={colors.sage} />
    <Ellipse cx="68" cy="40" rx="4" ry="5" fill={colors.sage} />
    {/* Ojos */}
    <Ellipse cx="78" cy="37" rx="3.5" ry="4" fill="white" />
    <Ellipse cx="88" cy="37" rx="3.5" ry="4" fill="white" />
    <Circle cx="79" cy="38" r="2" fill={colors.deepForest} />
    <Circle cx="89" cy="38" r="2" fill={colors.deepForest} />
    <Circle cx="79.8" cy="37.2" r="0.7" fill="white" />
    <Circle cx="89.8" cy="37.2" r="0.7" fill="white" />
    <Path d="M 78 44 Q 83 47 88 44" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </G>
);

// Flecha de movimiento — helper
const Flecha = ({ x1, y1, x2, y2, color, dash }) => {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx*dx + dy*dy);
  const ux = dx/len, uy = dy/len;
  const ax = x2 - ux*9 - uy*5, ay = y2 - uy*9 + ux*5;
  const bx = x2 - ux*9 + uy*5, by = y2 - uy*9 - ux*5;
  return (
    <G>
      <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color || '#e8c97a'} strokeWidth="2.2"
        strokeDasharray={dash ? "4,3" : undefined} fill="none" strokeLinecap="round" />
      <Polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color || '#e8c97a'} />
    </G>
  );
};

// ─── SVG MIEMBRO SUPERIOR ──────────────────────────────────────────────────────
const SvgPinzaLateral = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Brazo extendido */}
    <Line x1="80" y1="72" x2="112" y2="90" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Line x1="112" y1="90" x2="118" y2="116" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    {/* Mano con pinza */}
    <Ellipse cx="118" cy="124" rx="10" ry="7" fill={colors.mint} />
    <Ellipse cx="109" cy="120" rx="5" ry="4" fill={colors.mint} transform="rotate(-30 109 120)" />
    {/* Pulgar */}
    <Rect x="125" y="111" width="7" height="16" rx="3.5" fill={colors.mint} />
    {/* Objeto pinzado — moneda dorada */}
    <Ellipse cx="117" cy="116" rx="5" ry="7" fill="#e8c97a" opacity="0.95" />
    <Ellipse cx="117" cy="116" rx="3" ry="5" fill="#d4a843" opacity="0.6" />
    {/* Indicador de presión */}
    <Flecha x1="128" y1="110" x2="122" y2="115" color={colors.mint} />
    <Flecha x1="106" y1="122" x2="112" y2="118" color={colors.mint} />
  </Svg>
);

const SvgFlexionMuneca = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Mesa */}
    <Rect x="8" y="116" width="124" height="6" rx="3" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Antebrazo apoyado */}
    <Rect x="42" y="104" width="60" height="12" rx="6" fill={colors.sage} />
    {/* Mano en flexión */}
    <Rect x="97" y="82" width="14" height="24" rx="7" fill={colors.mint} />
    <Ellipse cx="104" cy="82" rx="7" ry="5" fill={colors.mint} />
    {/* Dedo representativos */}
    <Line x1="97" y1="82" x2="91" y2="72" stroke={colors.mint} strokeWidth="5" strokeLinecap="round" />
    <Line x1="103" y1="80" x2="100" y2="68" stroke={colors.mint} strokeWidth="5" strokeLinecap="round" />
    <Line x1="111" y1="82" x2="112" y2="70" stroke={colors.mint} strokeWidth="5" strokeLinecap="round" />
    {/* Arco de movimiento */}
    <Path d="M 90 106 Q 108 90 115 72" stroke="#e8c97a" strokeWidth="2" fill="none" strokeDasharray="4,3" opacity="0.85" />
    <Flecha x1="110" y1="78" x2="115" y2="70" color="#e8c97a" />
    {/* Brazo del paciente */}
    <Line x1="45" y1="80" x2="98" y2="110" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
  </Svg>
);

const SvgOposicionPulgares = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Brazos */}
    <Line x1="34" y1="72" x2="25" y2="100" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Line x1="76" y1="72" x2="88" y2="100" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    {/* Mano izquierda */}
    <Ellipse cx="22" cy="108" rx="11" ry="8" fill={colors.sage} />
    <Line x1="14" y1="102" x2="18" y2="112" stroke={colors.mint} strokeWidth="4.5" strokeLinecap="round" />
    <Line x1="16" y1="107" x2="21" y2="115" stroke={colors.mint} strokeWidth="4" strokeLinecap="round" />
    {/* Pulgar izquierdo */}
    <Line x1="30" y1="100" x2="26" y2="108" stroke={colors.mint} strokeWidth="5.5" strokeLinecap="round" />
    {/* Mano derecha */}
    <Ellipse cx="92" cy="108" rx="11" ry="8" fill={colors.sage} />
    <Line x1="96" y1="100" x2="100" y2="112" stroke={colors.mint} strokeWidth="4.5" strokeLinecap="round" />
    <Line x1="100" y1="107" x2="96" y2="115" stroke={colors.mint} strokeWidth="4" strokeLinecap="round" />
    {/* Pulgar derecho */}
    <Line x1="84" y1="100" x2="88" y2="108" stroke={colors.mint} strokeWidth="5.5" strokeLinecap="round" />
    {/* Punto de contacto */}
    <Circle cx="57" cy="112" r="7" fill="#e8c97a" opacity="0.95" />
    <Circle cx="57" cy="112" r="3.5" fill="#d4a843" opacity="0.6" />
    {/* Flechas de oposición */}
    <Flecha x1="33" y1="112" x2="50" y2="112" color={colors.mint} />
    <Flecha x1="81" y1="112" x2="64" y2="112" color={colors.mint} />
  </Svg>
);

const SvgAlcanceFuncional = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraDePie />
    {/* Objeto en altura */}
    <Rect x="118" y="8" width="16" height="16" rx="4" fill="#e8c97a" opacity="0.95" />
    <Line x1="120" y1="10" x2="132" y2="10" stroke="#d4a843" strokeWidth="1" opacity="0.6" />
    {/* Estante */}
    <Rect x="110" y="22" width="28" height="5" rx="2" fill={colors.deepForest} />
    {/* Brazo extendido */}
    <Line x1="88" y1="52" x2="122" y2="26" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Ellipse cx="126" cy="22" rx="9" ry="7" fill={colors.mint} />
    {/* Dedos */}
    <Line x1="124" y1="16" x2="127" y2="12" stroke={colors.mint} strokeWidth="4" strokeLinecap="round" />
    <Line x1="128" y1="17" x2="132" y2="14" stroke={colors.mint} strokeWidth="4" strokeLinecap="round" />
    {/* Arco de movimiento */}
    <Path d="M 88 52 Q 108 30 122 26" stroke="#e8c97a" strokeWidth="2" fill="none" strokeDasharray="4,3" opacity="0.7" />
    {/* Suelo */}
    <Line x1="15" y1="140" x2="115" y2="140" stroke={colors.darkGreen} strokeWidth="3" strokeLinecap="round" />
  </Svg>
);

const SvgFortHombro = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraDePie />
    {/* Banda elástica */}
    <Path d="M 90 55 Q 118 50 122 72" stroke={colors.mint} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    {/* Brazo elevado lateral */}
    <Line x1="90" y1="52" x2="124" y2="52" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Line x1="124" y1="52" x2="127" y2="68" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    {/* Mano */}
    <Ellipse cx="127" cy="74" rx="8" ry="6" fill={colors.mint} />
    {/* Arco de movimiento */}
    <Path d="M 88 56 Q 100 34 122 46" stroke="#e8c97a" strokeWidth="2" fill="none" strokeDasharray="4,3" opacity="0.7" />
    <Flecha x1="108" y1="36" x2="120" y2="46" color="#e8c97a" />
    {/* Músculo deltoides highlight */}
    <Ellipse cx="90" cy="52" rx="8" ry="6" fill={colors.sage} opacity="0.4" />
    <Line x1="15" y1="140" x2="115" y2="140" stroke={colors.darkGreen} strokeWidth="3" strokeLinecap="round" />
  </Svg>
);

const SvgExtensionCodo = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Brazo elevado — upper arm */}
    <Line x1="79" y1="66" x2="105" y2="84" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    {/* Antebrazo extendido */}
    <Line x1="105" y1="84" x2="132" y2="70" stroke={colors.mint} strokeWidth="10" strokeLinecap="round" />
    {/* Codo (articulación) */}
    <Circle cx="105" cy="84" r="8" fill="#e8c97a" opacity="0.95" />
    <Circle cx="105" cy="84" r="4" fill="#d4a843" opacity="0.7" />
    {/* Mano */}
    <Ellipse cx="134" cy="67" rx="8" ry="6" fill={colors.mint} />
    {/* Arco movimiento */}
    <Path d="M 102 87 Q 118 70 132 68" stroke="#e8c97a" strokeWidth="2" fill="none" strokeDasharray="3,2" opacity="0.7" />
    <Flecha x1="122" y1="70" x2="132" y2="68" color="#e8c97a" />
    {/* Posición inicial (punteada) */}
    <Line x1="105" y1="84" x2="108" y2="112" stroke={colors.sage} strokeWidth="6" strokeLinecap="round" opacity="0.3" strokeDasharray="5,3" />
  </Svg>
);

const SvgPrension = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Mesa */}
    <Rect x="8" y="116" width="124" height="6" rx="3" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Brazo */}
    <Line x1="78" y1="72" x2="112" y2="98" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    {/* Cilindro a tomar */}
    <Rect x="104" y="88" width="22" height="30" rx="11" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1.5" />
    <Ellipse cx="115" cy="88" rx="11" ry="5" fill={colors.darkGreen} />
    <Ellipse cx="115" cy="118" rx="11" ry="5" fill={colors.darkGreen} />
    {/* Mano cerrando agarre */}
    <Ellipse cx="115" cy="104" rx="13" ry="10" fill={colors.mint} opacity="0.85" />
    <Line x1="104" y1="97" x2="115" y2="104" stroke={colors.sage} strokeWidth="5" strokeLinecap="round" />
    <Line x1="104" y1="104" x2="115" y2="104" stroke={colors.sage} strokeWidth="5" strokeLinecap="round" />
    <Line x1="104" y1="111" x2="115" y2="104" stroke={colors.sage} strokeWidth="5" strokeLinecap="round" />
    {/* Indicador presión */}
    <Flecha x1="128" y1="100" x2="120" y2="104" color={colors.mint} />
  </Svg>
);

const SvgEscritura = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Mesa inclinada */}
    <Rect x="8" y="116" width="124" height="6" rx="3" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Hoja de papel */}
    <Rect x="58" y="86" width="62" height="32" rx="4" fill="white" opacity="0.12" stroke={colors.midGreen} strokeWidth="1.5" />
    {/* Líneas escritas */}
    <Line x1="64" y1="96" x2="112" y2="96" stroke={colors.sage} strokeWidth="1.5" opacity="0.7" />
    <Line x1="64" y1="104" x2="104" y2="104" stroke={colors.sage} strokeWidth="1.5" opacity="0.5" />
    <Line x1="64" y1="111" x2="90" y2="111" stroke={colors.sage} strokeWidth="1.5" opacity="0.3" />
    {/* Brazo escribiendo */}
    <Line x1="34" y1="74" x2="76" y2="96" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    {/* Mano con lápiz */}
    <Ellipse cx="80" cy="99" rx="7" ry="5" fill={colors.mint} />
    {/* Lápiz */}
    <Rect x="78" y="88" width="4" height="22" rx="2" fill="#e8c97a" transform="rotate(20 80 100)" />
    <Polygon points="76,108 80,108 78,114" fill={colors.darkGreen} transform="rotate(20 78 110)" />
  </Svg>
);

// ─── SVG MIEMBRO INFERIOR ──────────────────────────────────────────────────────
const SvgMarchaLugar = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    {/* Suelo */}
    <Rect x="10" y="136" width="120" height="6" rx="3" fill={colors.deepForest} />
    {/* Piernas alternadas */}
    {/* Pierna derecha levantada */}
    <Line x1="77" y1="78" x2="82" y2="102" stroke={colors.mint} strokeWidth="14" strokeLinecap="round" />
    <Line x1="82" y1="102" x2="74" y2="126" stroke={colors.mint} strokeWidth="12" strokeLinecap="round" />
    {/* Pie derecho levantado */}
    <Ellipse cx="72" cy="130" rx="11" ry="5" fill={colors.mint} />
    {/* Pierna izquierda (abajo) */}
    <Line x1="61" y1="78" x2="57" y2="108" stroke={colors.midGreen} strokeWidth="14" strokeLinecap="round" />
    <Ellipse cx="55" cy="134" rx="11" ry="5" fill={colors.sage} />
    {/* Torso */}
    <Rect x="51" y="38" width="38" height="44" rx="13" fill={colors.midGreen} />
    {/* Brazos alternados (balanceo contralateral) */}
    <Line x1="51" y1="54" x2="26" y2="62" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Line x1="89" y1="54" x2="114" y2="68" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    {/* Cabeza */}
    <Circle cx="70" cy="22" r="16" fill={colors.sage} />
    <Ellipse cx="54" cy="22" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="86" cy="22" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="65" cy="19" rx="3.5" ry="4" fill="white" />
    <Ellipse cx="75" cy="19" rx="3.5" ry="4" fill="white" />
    <Circle cx="66" cy="20" r="2" fill={colors.deepForest} />
    <Circle cx="76" cy="20" r="2" fill={colors.deepForest} />
    <Circle cx="66.8" cy="19.2" r="0.7" fill="white" />
    <Circle cx="76.8" cy="19.2" r="0.7" fill="white" />
    <Path d="M 65 26 Q 70 29 75 26" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Flechas movimiento */}
    <Flecha x1="72" y1="136" x2="72" y2="122" color={colors.mint} />
  </Svg>
);

const SvgEquilibrioMonopodal = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraDePie />
    {/* Línea de equilibrio en suelo */}
    <Rect x="10" y="136" width="120" height="4" rx="2" fill={colors.deepForest} />
    {/* Pierna apoyada con aura de base */}
    <Ellipse cx="64" cy="136" rx="18" ry="6" fill={colors.midGreen} opacity="0.25" />
    {/* Pierna levantada */}
    <Line x1="76" y1="80" x2="96" y2="100" stroke={colors.mint} strokeWidth="13" strokeLinecap="round" />
    <Ellipse cx="97" cy="106" rx="10" ry="6" fill={colors.mint} />
    {/* Triángulo de base */}
    <Polygon points="48,136 80,136 64,118" fill="#e8c97a" opacity="0.35" />
    {/* Brazos en equilibrio */}
    <Line x1="40" y1="52" x2="14" y2="58" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Line x1="88" y1="52" x2="114" y2="58" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    {/* Indicador vertical */}
    <Line x1="64" y1="10" x2="64" y2="136" stroke="#e8c97a" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.4" />
  </Svg>
);

const SvgSitStand = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    {/* Silla */}
    <Rect x="72" y="86" width="58" height="6" rx="3" fill={colors.darkGreen} />
    <Rect x="74" y="90" width="5" height="30" rx="2.5" fill={colors.darkGreen} />
    <Rect x="122" y="90" width="5" height="30" rx="2.5" fill={colors.darkGreen} />
    <Rect x="70" y="62" width="5" height="28" rx="2.5" fill={colors.darkGreen} />
    {/* Persona levantándose — posición inclinada */}
    <Circle cx="48" cy="22" r="16" fill={colors.sage} />
    <Ellipse cx="32" cy="22" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="64" cy="22" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="43" cy="19" rx="3.5" ry="4" fill="white" />
    <Ellipse cx="53" cy="19" rx="3.5" ry="4" fill="white" />
    <Circle cx="44" cy="20" r="2" fill={colors.deepForest} />
    <Circle cx="54" cy="20" r="2" fill={colors.deepForest} />
    <Circle cx="44.8" cy="19.2" r="0.7" fill="white" />
    <Circle cx="54.8" cy="19.2" r="0.7" fill="white" />
    <Path d="M 43 26 Q 48 29 53 26" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Torso inclinado hacia adelante */}
    <Rect x="34" y="35" width="32" height="38" rx="11" fill={colors.midGreen} transform="rotate(-12 50 54)" />
    {/* Piernas */}
    <Line x1="40" y1="72" x2="35" y2="122" stroke={colors.midGreen} strokeWidth="13" strokeLinecap="round" />
    <Line x1="55" y1="72" x2="68" y2="122" stroke={colors.mint} strokeWidth="13" strokeLinecap="round" />
    {/* Pies */}
    <Ellipse cx="34" cy="128" rx="11" ry="5" fill={colors.sage} />
    <Ellipse cx="68" cy="128" rx="11" ry="5" fill={colors.sage} />
    {/* Flecha ascenso */}
    <Path d="M 14 88 L 14 42" stroke="#e8c97a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <Flecha x1="14" y1="52" x2="14" y2="40" color="#e8c97a" />
  </Svg>
);

const SvgElevacionTalon = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraDePie />
    {/* Suelo */}
    <Rect x="10" y="136" width="120" height="4" rx="2" fill={colors.deepForest} />
    {/* Talones elevados (puntas de pie en el suelo) */}
    <Ellipse cx="55" cy="132" rx="8" ry="4" fill={colors.mint} />
    <Ellipse cx="73" cy="132" rx="8" ry="4" fill={colors.mint} />
    {/* Talones en el aire */}
    <Ellipse cx="62" cy="122" rx="8" ry="4" fill="#e8c97a" opacity="0.9" />
    <Ellipse cx="80" cy="122" rx="8" ry="4" fill="#e8c97a" opacity="0.9" />
    {/* Flechas hacia arriba */}
    <Flecha x1="62" y1="132" x2="62" y2="118" color="#e8c97a" />
    <Flecha x1="80" y1="132" x2="80" y2="118" color="#e8c97a" />
    {/* Apoyo en pared */}
    <Rect x="120" y="50" width="5" height="90" rx="2.5" fill={colors.deepForest} opacity="0.5" />
    <Line x1="88" y1="50" x2="118" y2="62" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" opacity="0.7" />
  </Svg>
);

const SvgFlexionRodilla = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraDePie />
    {/* Suelo */}
    <Rect x="10" y="136" width="120" height="4" rx="2" fill={colors.deepForest} />
    {/* Pierna en extensión (izq) */}
    <Ellipse cx="55" cy="133" rx="11" ry="5" fill={colors.sage} />
    {/* Pierna flexionada (der) */}
    <Line x1="76" y1="80" x2="76" y2="104" stroke={colors.midGreen} strokeWidth="14" strokeLinecap="round" />
    <Line x1="76" y1="104" x2="88" y2="128" stroke={colors.mint} strokeWidth="12" strokeLinecap="round" transform="rotate(28 76 104)" />
    {/* Rodilla */}
    <Circle cx="76" cy="104" r="9" fill="#e8c97a" opacity="0.9" />
    <Circle cx="76" cy="104" r="5" fill="#d4a843" opacity="0.6" />
    {/* Flecha */}
    <Path d="M 84 128 Q 96 118 92 104" stroke="#e8c97a" strokeWidth="2" fill="none" strokeDasharray="4,3" opacity="0.8" />
    <Flecha x1="90" y1="116" x2="84" y2="126" color="#e8c97a" />
  </Svg>
);

const SvgAbduccionCadera = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraDePie />
    {/* Suelo */}
    <Rect x="10" y="136" width="120" height="4" rx="2" fill={colors.deepForest} />
    {/* Apoyo lateral */}
    <Rect x="115" y="50" width="5" height="90" rx="2.5" fill={colors.deepForest} opacity="0.5" />
    <Line x1="90" y1="50" x2="114" y2="58" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" opacity="0.7" />
    {/* Pierna abducida */}
    <Line x1="56" y1="80" x2="26" y2="112" stroke={colors.mint} strokeWidth="13" strokeLinecap="round" />
    <Ellipse cx="22" cy="118" rx="11" ry="5" fill={colors.mint} />
    {/* Arco de movimiento */}
    <Path d="M 56 80 Q 40 98 26 112" stroke="#e8c97a" strokeWidth="2" fill="none" strokeDasharray="4,3" opacity="0.8" />
    <Flecha x1="34" y1="106" x2="26" y2="112" color="#e8c97a" />
    {/* Cadera highlight */}
    <Circle cx="56" cy="80" r="10" fill={colors.sage} opacity="0.3" />
  </Svg>
);

const SvgSubidaEscalon = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    {/* Escalones */}
    <Rect x="18" y="120" width="104" height="8" rx="3" fill={colors.deepForest} />
    <Rect x="48" y="100" width="74" height="8" rx="3" fill={colors.deepForest} />
    <Rect x="78" y="80" width="44" height="8" rx="3" fill={colors.deepForest} />
    {/* Laterales escalones */}
    <Rect x="18" y="106" width="30" height="22" rx="2" fill={colors.darkGreen} opacity="0.5" />
    <Rect x="48" y="88" width="30" height="20" rx="2" fill={colors.darkGreen} opacity="0.4" />
    {/* Figura subiendo */}
    <Circle cx="56" cy="50" r="15" fill={colors.sage} />
    <Ellipse cx="41" cy="50" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="71" cy="50" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="51" cy="47" rx="3.5" ry="4" fill="white" />
    <Ellipse cx="61" cy="47" rx="3.5" ry="4" fill="white" />
    <Circle cx="52" cy="48" r="2" fill={colors.deepForest} />
    <Circle cx="62" cy="48" r="2" fill={colors.deepForest} />
    <Circle cx="52.8" cy="47.2" r="0.7" fill="white" />
    <Circle cx="62.8" cy="47.2" r="0.7" fill="white" />
    <Path d="M 51 54 Q 56 57 61 54" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Rect x="43" y="63" width="26" height="30" rx="9" fill={colors.midGreen} />
    {/* Pierna adelante (escalón) */}
    <Line x1="43" y1="92" x2="38" y2="120" stroke={colors.midGreen} strokeWidth="12" strokeLinecap="round" />
    <Ellipse cx="37" cy="126" rx="11" ry="5" fill={colors.sage} />
    {/* Pierna atrás (impulsando) */}
    <Line x1="65" y1="92" x2="74" y2="110" stroke={colors.mint} strokeWidth="12" strokeLinecap="round" />
    <Ellipse cx="76" cy="116" rx="11" ry="5" fill={colors.mint} />
    {/* Flecha de subida */}
    <Flecha x1="14" y1="88" x2="14" y2="62" color="#e8c97a" />
  </Svg>
);

// ─── SVG COGNITIVO ─────────────────────────────────────────────────────────────
const SvgSecuenciaDigitos = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Panel con dígitos */}
    <Rect x="84" y="14" width="50" height="52" rx="8" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Secuencia de círculos con números */}
    <Circle cx="97" cy="30" r="9" fill={colors.midGreen} />
    <Circle cx="97" cy="30" r="9" fill="none" stroke={colors.sage} strokeWidth="1.5" />
    <Circle cx="113" cy="30" r="9" fill={colors.sage} />
    <Circle cx="129" cy="30" r="9" fill={colors.midGreen} />
    <Circle cx="97" cy="50" r="9" fill={colors.mint} opacity="0.8" />
    <Circle cx="113" cy="50" r="9" fill={colors.midGreen} />
    <Circle cx="129" cy="50" r="9" fill="#e8c97a" opacity="0.85" />
    {/* Flecha de secuencia */}
    <Flecha x1="97" y1="30" x2="113" y2="30" color={colors.mint} />
    <Flecha x1="113" y1="30" x2="129" y2="30" color={colors.mint} />
    {/* Brazo señalando */}
    <Line x1="80" y1="74" x2="100" y2="54" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
  </Svg>
);

const SvgClasificacion = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Caja izquierda */}
    <Rect x="6" y="90" width="40" height="28" rx="6" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="2" />
    <Circle cx="18" cy="104" r="6" fill={colors.sage} opacity="0.8" />
    <Circle cx="30" cy="104" r="4" fill={colors.sage} opacity="0.5" />
    {/* Caja derecha */}
    <Rect x="95" y="90" width="40" height="28" rx="6" fill={colors.darkGreen} stroke={colors.mint} strokeWidth="2" />
    <Rect x="101" y="98" width="10" height="12" rx="2" fill={colors.mint} opacity="0.8" />
    <Polygon points="118,98 128,98 123,110" fill={colors.mint} opacity="0.6" />
    {/* Objeto en mano */}
    <Rect x="62" y="86" width="18" height="18" rx="5" fill="#e8c97a" opacity="0.9" />
    {/* Brazo */}
    <Line x1="35" y1="74" x2="68" y2="94" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    {/* Flechas clasificación */}
    <Flecha x1="58" y1="97" x2="46" y2="104" color={colors.sage} dash />
    <Flecha x1="82" y1="97" x2="96" y2="104" color={colors.mint} dash />
  </Svg>
);

const SvgSeguimientoVisual = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Ojo grande */}
    <Ellipse cx="56" cy="42" rx="20" ry="12" fill={colors.deepForest} stroke={colors.mint} strokeWidth="2" />
    <Circle cx="56" cy="42" r="8" fill={colors.darkGreen} />
    <Circle cx="56" cy="42" r="5" fill={colors.midGreen} />
    <Circle cx="56" cy="42" r="2.5" fill={colors.deepForest} />
    <Circle cx="57.5" cy="40.5" r="1" fill="white" />
    {/* Objeto en movimiento */}
    <Circle cx="122" cy="24" r="10" fill={colors.sage} />
    <Circle cx="122" cy="24" r="6" fill={colors.midGreen} />
    <Circle cx="124" cy="22" r="2" fill="white" opacity="0.6" />
    {/* Trayectoria visual */}
    <Path d="M 74 40 Q 98 28 114 26" stroke="#e8c97a" strokeWidth="2" fill="none" strokeDasharray="5,4" opacity="0.8" />
    <Flecha x1="107" y1="27" x2="118" y2="25" color="#e8c97a" />
    {/* Rastro movimiento */}
    <Circle cx="100" cy="34" r="4" fill={colors.sage} opacity="0.25" />
    <Circle cx="112" cy="28" r="6" fill={colors.sage} opacity="0.15" />
  </Svg>
);

const SvgMemoriaProc = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Tablero de memoria */}
    <Rect x="68" y="16" width="64" height="72" rx="8" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Tarjetas 2x3 */}
    <Rect x="74" y="24" width="20" height="16" rx="4" fill={colors.sage} />
    <Rect x="98" y="24" width="20" height="16" rx="4" fill={colors.sage} />
    <Rect x="122" y="24" width="4" height="16" rx="2" fill={colors.midGreen} />
    <Rect x="74" y="44" width="20" height="16" rx="4" fill={colors.midGreen} stroke={colors.sage} strokeWidth="1.5" />
    <Circle cx="84" cy="52" r="5" fill={colors.mint} />
    <Rect x="98" y="44" width="20" height="16" rx="4" fill={colors.midGreen} stroke="#e8c97a" strokeWidth="1.5" />
    <Polygon points="103,58 108,46 113,58" fill="#e8c97a" opacity="0.8" />
    <Rect x="74" y="64" width="20" height="16" rx="4" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1.5" />
    <Rect x="98" y="64" width="20" height="16" rx="4" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1.5" />
    {/* Brazo señalando */}
    <Line x1="80" y1="74" x2="86" y2="58" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
  </Svg>
);

const SvgRazonamientoAna = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Panel de analogías */}
    <Rect x="66" y="16" width="66" height="72" rx="8" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Fila 1: sol → calor */}
    <Circle cx="80" cy="32" r="10" fill="#e8c97a" opacity="0.85" />
    <Line x1="80" y1="22" x2="80" y2="18" stroke="#e8c97a" strokeWidth="1.5" opacity="0.5" />
    <Line x1="90" y1="32" x2="94" y2="32" stroke="#e8c97a" strokeWidth="1.5" opacity="0.5" />
    <Rect x="98" y="26" width="20" height="12" rx="3" fill={colors.sage} />
    {/* = */}
    <Line x1="91" y1="28" x2="96" y2="28" stroke={colors.mint} strokeWidth="2" />
    <Line x1="91" y1="32" x2="96" y2="32" stroke={colors.mint} strokeWidth="2" />
    {/* Fila 2: luna → ? */}
    <Circle cx="80" cy="60" r="10" fill={colors.midGreen} />
    <Circle cx="84" cy="56" r="7" fill={colors.darkGreen} />
    <Rect x="98" y="54" width="20" height="12" rx="3" fill={colors.deepForest} stroke="#e8c97a" strokeWidth="2" />
    <Line x1="91" y1="56" x2="96" y2="56" stroke={colors.mint} strokeWidth="2" />
    <Line x1="91" y1="60" x2="96" y2="60" stroke={colors.mint} strokeWidth="2" />
  </Svg>
);

const SvgAtencionDividida = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Tarea 1 arriba */}
    <Rect x="64" y="12" width="66" height="28" rx="6" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    <Circle cx="74" cy="26" r="6" fill={colors.sage} opacity="0.8" />
    <Circle cx="88" cy="26" r="6" fill={colors.mint} opacity="0.8" />
    <Circle cx="102" cy="26" r="6" fill={colors.sage} opacity="0.8" />
    <Circle cx="116" cy="26" r="4" fill="#e8c97a" opacity="0.8" />
    {/* Divisor */}
    <Line x1="97" y1="42" x2="97" y2="50" stroke={colors.sage} strokeWidth="2" strokeDasharray="3,2" opacity="0.6" />
    <Circle cx="97" cy="46" r="4" fill={colors.midGreen} />
    {/* Tarea 2 abajo */}
    <Rect x="64" y="52" width="66" height="28" rx="6" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1.5" />
    <Rect x="72" y="60" width="12" height="10" rx="2" fill="#e8c97a" opacity="0.7" />
    <Rect x="88" y="60" width="12" height="10" rx="2" fill={colors.mint} opacity="0.6" />
    <Rect x="104" y="60" width="12" height="10" rx="2" fill={colors.midGreen} opacity="0.6" />
    {/* Brazo */}
    <Line x1="34" y1="74" x2="80" y2="60" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
  </Svg>
);

// ─── SVG SENSORIAL ─────────────────────────────────────────────────────────────
const SvgJuegoTexturas = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Bandeja de texturas */}
    <Rect x="62" y="94" width="70" height="24" rx="5" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    {/* Cuadrado liso */}
    <Rect x="66" y="97" width="14" height="16" rx="2" fill={colors.sage} opacity="0.7" />
    {/* Cuadrado rugoso */}
    <Rect x="84" y="97" width="14" height="16" rx="2" fill={colors.midGreen} opacity="0.8" />
    <Line x1="86" y1="99" x2="96" y2="99" stroke={colors.darkGreen} strokeWidth="1" />
    <Line x1="86" y1="102" x2="96" y2="102" stroke={colors.darkGreen} strokeWidth="1" />
    <Line x1="86" y1="105" x2="96" y2="105" stroke={colors.darkGreen} strokeWidth="1" />
    {/* Cuadrado puntiagudo */}
    <Rect x="102" y="97" width="14" height="16" rx="2" fill="#e8c97a" opacity="0.7" />
    <Polygon points="104,113 106,100 108,113" fill={colors.darkGreen} opacity="0.4" />
    <Polygon points="108,113 110,100 112,113" fill={colors.darkGreen} opacity="0.4" />
    {/* Cuadrado vibratorio */}
    <Rect x="120" y="97" width="8" height="16" rx="2" fill={colors.mint} opacity="0.7" />
    <Line x1="122" y1="100" x2="126" y2="104" stroke="white" strokeWidth="1" opacity="0.4" />
    {/* Brazo extendido */}
    <Line x1="34" y1="74" x2="80" y2="105" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
  </Svg>
);

const SvgPropioceptivo = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Pelota de presión */}
    <Circle cx="68" cy="104" r="20" fill={colors.midGreen} stroke="#e8c97a" strokeWidth="2.5" />
    <Circle cx="62" cy="98" r="6" fill={colors.darkGreen} opacity="0.3" />
    {/* Mano izquierda presionando */}
    <Ellipse cx="48" cy="104" rx="12" ry="9" fill={colors.sage} />
    <Line x1="42" y1="96" x2="48" y2="104" stroke={colors.mint} strokeWidth="5" strokeLinecap="round" />
    <Line x1="38" y1="102" x2="48" y2="104" stroke={colors.mint} strokeWidth="5" strokeLinecap="round" />
    {/* Brazo izquierdo */}
    <Line x1="34" y1="74" x2="52" y2="102" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    {/* Flechas de compresión */}
    <Flecha x1="36" y1="104" x2="48" y2="104" color={colors.mint} />
    <Flecha x1="100" y1="104" x2="88" y2="104" color={colors.mint} />
    {/* Ondas de vibración/propioceptiva */}
    <Circle cx="68" cy="104" r="28" fill="none" stroke="#e8c97a" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5" />
    <Circle cx="68" cy="104" r="36" fill="none" stroke="#e8c97a" strokeWidth="1" strokeDasharray="3,5" opacity="0.3" />
  </Svg>
);

const SvgEstImAudio = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Oído derecho destacado */}
    <Ellipse cx="72" cy="40" rx="8" ry="10" fill="#e8c97a" opacity="0.6" />
    {/* Ondas de sonido */}
    <Path d="M 82 36 Q 90 40 82 44" stroke={colors.mint} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <Path d="M 86 32 Q 98 40 86 48" stroke={colors.mint} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
    <Path d="M 90 28 Q 108 40 90 52" stroke={colors.mint} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
    <Path d="M 95 24 Q 118 40 95 56" stroke="#e8c97a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.35" />
    {/* Fuente de sonido */}
    <Rect x="116" y="32" width="16" height="16" rx="4" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    <Circle cx="124" cy="40" r="5" fill={colors.midGreen} />
    <Circle cx="124" cy="40" r="2.5" fill={colors.darkGreen} />
  </Svg>
);

const SvgDiscriminacionOlfativa = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Frascos en mesa */}
    <Rect x="68" y="84" width="14" height="32" rx="5" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    <Rect x="70" y="76" width="10" height="10" rx="4" fill={colors.midGreen} />
    <Rect x="86" y="86" width="14" height="30" rx="5" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1.5" />
    <Rect x="88" y="78" width="10" height="10" rx="4" fill={colors.sage} />
    <Rect x="104" y="84" width="14" height="32" rx="5" fill={colors.darkGreen} stroke="#e8c97a" strokeWidth="1.5" />
    <Rect x="106" y="76" width="10" height="10" rx="4" fill="#e8c97a" opacity="0.85" />
    {/* Volutas de aroma */}
    <Path d="M 75 74 Q 72 68 76 62 Q 80 56 77 50" stroke={colors.mint} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
    <Path d="M 93 76 Q 90 70 94 64 Q 98 58 95 52" stroke={colors.sage} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
    <Path d="M 111 74 Q 108 68 112 62" stroke="#e8c97a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
    {/* Nariz cerca del frasco */}
    <Ellipse cx="56" cy="44" rx="5" ry="4" fill={colors.sage} opacity="0.5" />
    <Path d="M 74 60 Q 68 55 64 52" stroke={colors.sage} strokeWidth="1.5" strokeDasharray="3,2" fill="none" opacity="0.5" />
  </Svg>
);

const SvgIntegracionVestib = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraDePie />
    {/* Cojín de equilibrio */}
    <Ellipse cx="64" cy="136" rx="30" ry="10" fill={colors.midGreen} stroke={colors.sage} strokeWidth="2" />
    <Ellipse cx="64" cy="132" rx="26" ry="6" fill={colors.darkGreen} />
    {/* Línea de suelo */}
    <Line x1="10" y1="142" x2="118" y2="142" stroke={colors.darkGreen} strokeWidth="3" strokeLinecap="round" />
    {/* Línea central de plomada */}
    <Line x1="64" y1="10" x2="64" y2="136" stroke="#e8c97a" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.45" />
    {/* Ondas vestibulares en cabeza */}
    <Circle cx="64" cy="18" r="22" fill="none" stroke={colors.mint} strokeWidth="1.5" opacity="0.3" />
    <Circle cx="64" cy="18" r="28" fill="none" stroke={colors.mint} strokeWidth="1" opacity="0.15" />
    {/* Flechas de oscilación */}
    <Flecha x1="36" y1="60" x2="28" y2="66" color={colors.sage} dash />
    <Flecha x1="92" y1="60" x2="100" y2="66" color={colors.sage} dash />
  </Svg>
);

const SvgTactiloEsterog = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Bolsa opaca */}
    <Ellipse cx="92" cy="100" rx="36" ry="22" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    <Ellipse cx="92" cy="96" rx="28" ry="12" fill={colors.deepForest} />
    <Rect x="80" y="78" width="24" height="8" rx="4" fill={colors.midGreen} />
    {/* Mano dentro de la bolsa */}
    <Line x1="80" y1="74" x2="88" y2="96" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    {/* Ojos cerrados (no ve el objeto) */}
    <Path d="M 50 37 Q 55 34 60 37" stroke={colors.darkGreen} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <Path d="M 50 37 Q 55 40 60 37" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
    {/* Objeto dentro (llave) representada con brillo */}
    <Ellipse cx="102" cy="102" rx="8" ry="5" fill="#e8c97a" opacity="0.35" />
  </Svg>
);

// ─── SVG RESPIRATORIO ──────────────────────────────────────────────────────────
const SvgRespiracion = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    {/* Persona en decúbito supino */}
    <FiguraAcostada />
    {/* Mano en pecho */}
    <Ellipse cx="56" cy="90" rx="12" ry="7" fill={colors.mint} opacity="0.9" />
    {/* Mano en abdomen */}
    <Ellipse cx="73" cy="96" rx="12" ry="7" fill={colors.sage} opacity="0.8" />
    {/* Flecha abdomen sube */}
    <Flecha x1="73" y1="98" x2="73" y2="84" color={colors.mint} />
    {/* Ondas de respiración */}
    <Path d="M 32 72 Q 38 64 44 72 Q 50 80 56 72 Q 62 64 68 72 Q 74 80 80 72" stroke={colors.sage} strokeWidth="2" fill="none" opacity="0.5" />
    {/* Timer de respiración */}
    <Circle cx="120" cy="50" r="18" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    <Line x1="120" y1="50" x2="120" y2="34" stroke={colors.mint} strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="120" y1="50" x2="130" y2="50" stroke={colors.sage} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="120" cy="50" r="3" fill={colors.sage} />
  </Svg>
);

const SvgSoplo = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Pajilla */}
    <Rect x="72" y="74" width="50" height="5" rx="2.5" fill={colors.mint} transform="rotate(-8 72 74)" />
    {/* Burbujas saliendo */}
    <Circle cx="122" cy="68" r="5" fill="none" stroke={colors.mint} strokeWidth="1.5" opacity="0.8" />
    <Circle cx="128" cy="60" r="7" fill="none" stroke={colors.mint} strokeWidth="1.5" opacity="0.6" />
    <Circle cx="132" cy="50" r="9" fill="none" stroke="#e8c97a" strokeWidth="1.5" opacity="0.5" />
    <Circle cx="134" cy="38" r="11" fill="none" stroke="#e8c97a" strokeWidth="1.5" opacity="0.3" />
    {/* Boca del paciente */}
    <Ellipse cx="70" cy="76" rx="6" ry="4" fill={colors.darkGreen} />
    <Ellipse cx="70" cy="76" rx="4" ry="2.5" fill={colors.deepForest} />
  </Svg>
);

const SvgRespCostal = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Caja torácica lateral */}
    <Path d="M 28 62 Q 22 74 24 88 Q 26 96 34 98" stroke={colors.mint} strokeWidth="2.5" fill="none" opacity="0.7" strokeLinecap="round" />
    <Path d="M 24 70 Q 20 78 22 86" stroke={colors.mint} strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
    {/* Costillas */}
    <Path d="M 30 66 Q 25 70 26 76" stroke={colors.sage} strokeWidth="1.8" fill="none" opacity="0.5" />
    <Path d="M 30 72 Q 24 76 25 82" stroke={colors.sage} strokeWidth="1.8" fill="none" opacity="0.5" />
    <Path d="M 30 78 Q 24 82 25 88" stroke={colors.sage} strokeWidth="1.8" fill="none" opacity="0.4" />
    {/* Manos sobre costillas */}
    <Ellipse cx="25" cy="82" rx="12" ry="7" fill={colors.mint} opacity="0.8" />
    {/* Flechas expansión lateral */}
    <Flecha x1="28" y1="78" x2="16" y2="78" color="#e8c97a" />
    <Path d="M 90 68 Q 98 74 96 88" stroke={colors.mint} strokeWidth="2.5" fill="none" opacity="0.7" strokeLinecap="round" />
    <Flecha x1="90" y1="78" x2="102" y2="78" color="#e8c97a" />
  </Svg>
);

const SvgEspirometria = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Espirómetro */}
    <Rect x="82" y="64" width="36" height="54" rx="8" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Escala */}
    <Rect x="88" y="70" width="6" height="40" rx="3" fill={colors.deepForest} />
    {/* Indicador de nivel */}
    <Rect x="88" y="90" width="6" height="20" rx="3" fill={colors.midGreen} />
    <Rect x="88" y="82" width="6" height="8" rx="3" fill={colors.sage} />
    {/* Bola flotante */}
    <Circle cx="102" cy="80" r="8" fill={colors.mint} />
    <Circle cx="100" cy="78" r="3" fill="white" opacity="0.3" />
    {/* Flecha de objetivo */}
    <Rect x="112" y="76" width="6" height="3" rx="1.5" fill="#e8c97a" opacity="0.8" />
    <Flecha x1="118" y1="77" x2="112" y2="77" color="#e8c97a" />
    {/* Boquilla */}
    <Rect x="70" y="88" width="14" height="5" rx="2.5" fill={colors.sage} />
    {/* Brazo */}
    <Line x1="78" y1="74" x2="84" y2="90" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
  </Svg>
);

const SvgTosTerapeutica = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Manos sobre abdomen */}
    <Ellipse cx="48" cy="84" rx="14" ry="8" fill={colors.mint} opacity="0.85" />
    <Ellipse cx="65" cy="88" rx="14" ry="8" fill={colors.mint} opacity="0.75" />
    {/* Boca abierta */}
    <Ellipse cx="56" cy="44" rx="8" ry="5" fill={colors.darkGreen} />
    <Ellipse cx="56" cy="44" rx="5" ry="3" fill={colors.deepForest} />
    {/* Ondas de tos explosivas */}
    <Path d="M 64 38 Q 72 30 84 34" stroke="#e8c97a" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.9" />
    <Path d="M 68 44 Q 82 40 100 46" stroke={colors.mint} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
    <Path d="M 64 52 Q 84 52 108 58" stroke={colors.sage} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
    {/* Flechas exhalación */}
    <Flecha x1="86" y1="34" x2="94" y2="32" color="#e8c97a" />
    <Flecha x1="100" y1="46" x2="108" y2="46" color={colors.mint} />
    {/* Indicador abdomen contrayéndose */}
    <Flecha x1="46" y1="88" x2="56" y2="84" color={colors.mint} />
    <Flecha x1="72" y1="90" x2="62" y2="86" color={colors.mint} />
  </Svg>
);

// ─── SVG COLUMNA Y ESPALDA ────────────────────────────────────────────────────
const SvgFlexionTronco = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    {/* Suelo */}
    <Rect x="14" y="128" width="112" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Figura de pie flexionando */}
    <Circle cx="60" cy="24" r="15" fill={colors.sage} />
    <Ellipse cx="45" cy="24" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="75" cy="24" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="55" cy="21" rx="3.5" ry="4" fill="white" />
    <Ellipse cx="65" cy="21" rx="3.5" ry="4" fill="white" />
    <Circle cx="56" cy="22" r="2" fill={colors.deepForest} />
    <Circle cx="66" cy="22" r="2" fill={colors.deepForest} />
    <Circle cx="56.8" cy="21.2" r="0.7" fill="white" />
    <Circle cx="66.8" cy="21.2" r="0.7" fill="white" />
    <Path d="M 55 28 Q 60 31 65 28" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Torso inclinado hacia adelante */}
    <Rect x="42" y="38" width="28" height="36" rx="10" fill={colors.midGreen} transform="rotate(35 56 56)" />
    {/* Vértebras visibles */}
    <Path d="M 56 38 Q 48 52 44 68 Q 42 80 44 90" stroke={colors.sage} strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />
    {/* Piernas */}
    <Rect x="48" y="94" width="11" height="36" rx="5.5" fill={colors.midGreen} />
    <Rect x="62" y="94" width="11" height="36" rx="5.5" fill={colors.midGreen} />
    <Ellipse cx="54" cy="132" rx="10" ry="4" fill={colors.sage} />
    <Ellipse cx="68" cy="132" rx="10" ry="4" fill={colors.sage} />
    {/* Arco movimiento */}
    <Path d="M 60 38 Q 50 54 46 70" stroke="#e8c97a" strokeWidth="2" fill="none" strokeDasharray="4,3" opacity="0.7" />
    <Flecha x1="49" y1="68" x2="46" y2="76" color="#e8c97a" />
  </Svg>
);

const SvgExtTronco = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <Rect x="8" y="106" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Figura de pie erguida */}
    <Circle cx="70" cy="24" r="15" fill={colors.sage} />
    <Ellipse cx="55" cy="24" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="85" cy="24" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="65" cy="21" rx="3.5" ry="4" fill="white" />
    <Ellipse cx="75" cy="21" rx="3.5" ry="4" fill="white" />
    <Circle cx="66" cy="22" r="2" fill={colors.deepForest} />
    <Circle cx="76" cy="22" r="2" fill={colors.deepForest} />
    <Circle cx="66.8" cy="21.2" r="0.7" fill="white" />
    <Circle cx="76.8" cy="21.2" r="0.7" fill="white" />
    <Path d="M 65 28 Q 70 31 75 28" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Torso ligeramente extendido */}
    <Rect x="58" y="38" width="24" height="36" rx="10" fill={colors.midGreen} transform="rotate(-8 70 56)" />
    {/* Columna */}
    <Path d="M 70 38 Q 72 52 72 68 Q 70 80 70 90" stroke={colors.sage} strokeWidth="2" fill="none" opacity="0.6" />
    <Rect x="62" y="88" width="11" height="34" rx="5.5" fill={colors.midGreen} />
    <Rect x="76" y="88" width="11" height="34" rx="5.5" fill={colors.midGreen} />
    <Ellipse cx="68" cy="124" rx="10" ry="4" fill={colors.sage} />
    <Ellipse cx="82" cy="124" rx="10" ry="4" fill={colors.sage} />
    {/* Arco de extensión */}
    <Path d="M 70 38 Q 80 52 78 68" stroke="#e8c97a" strokeWidth="2" fill="none" strokeDasharray="4,3" opacity="0.7" />
    <Flecha x1="76" y1="62" x2="79" y2="70" color="#e8c97a" />
  </Svg>
);

const SvgRotTronco = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Torso rotado — brazo extendido */}
    <Line x1="34" y1="74" x2="108" y2="60" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Ellipse cx="112" cy="58" rx="9" ry="6" fill={colors.mint} />
    {/* Arco de rotación */}
    <Path d="M 56 68 Q 80 52 104 60" stroke="#e8c97a" strokeWidth="2" fill="none" opacity="0.8" />
    <Flecha x1="96" y1="56" x2="106" y2="60" color="#e8c97a" />
    {/* Indicador de rotación (espiral) */}
    <Path d="M 56 80 Q 70 70 82 74 Q 94 78 90 88" stroke={colors.mint} strokeWidth="1.5" fill="none" strokeDasharray="3,2" opacity="0.6" />
    {/* Posición inicial punteada */}
    <Line x1="80" y1="70" x2="34" y2="82" stroke={colors.sage} strokeWidth="5" strokeLinecap="round" opacity="0.25" strokeDasharray="5,3" />
  </Svg>
);

const SvgCatCamel = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    {/* Colchoneta */}
    <Rect x="8" y="116" width="124" height="8" rx="4" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Figura en cuadrupedia */}
    {/* Manos */}
    <Ellipse cx="22" cy="112" rx="9" ry="5" fill={colors.sage} />
    <Ellipse cx="118" cy="112" rx="9" ry="5" fill={colors.sage} />
    {/* Brazos */}
    <Line x1="22" y1="108" x2="34" y2="84" stroke={colors.midGreen} strokeWidth="10" strokeLinecap="round" />
    <Line x1="118" y1="108" x2="106" y2="84" stroke={colors.midGreen} strokeWidth="10" strokeLinecap="round" />
    {/* Rodillas */}
    <Ellipse cx="36" cy="116" rx="9" ry="5" fill={colors.sage} />
    <Ellipse cx="104" cy="116" rx="9" ry="5" fill={colors.sage} />
    {/* Muslos */}
    <Line x1="36" y1="112" x2="48" y2="84" stroke={colors.midGreen} strokeWidth="10" strokeLinecap="round" />
    <Line x1="104" y1="112" x2="92" y2="84" stroke={colors.midGreen} strokeWidth="10" strokeLinecap="round" />
    {/* Torso (cat = arqueado) */}
    <Path d="M 34 84 Q 70 58 106 84" stroke={colors.midGreen} strokeWidth="18" fill="none" strokeLinecap="round" />
    {/* Columna arqueada (cat) */}
    <Path d="M 34 84 Q 70 60 106 84" stroke={colors.sage} strokeWidth="2.5" fill="none" opacity="0.6" />
    {/* Posición camel (punteada) */}
    <Path d="M 34 84 Q 70 100 106 84" stroke="#e8c97a" strokeWidth="2" fill="none" strokeDasharray="5,4" opacity="0.6" />
    {/* Cabeza */}
    <Circle cx="26" cy="72" r="13" fill={colors.sage} />
    <Ellipse cx="14" cy="72" rx="3.5" ry="4.5" fill={colors.sage} />
    <Ellipse cx="21" cy="69" rx="3" ry="3.5" fill="white" />
    <Ellipse cx="29" cy="69" rx="3" ry="3.5" fill="white" />
    <Circle cx="22" cy="70" r="1.8" fill={colors.deepForest} />
    <Circle cx="30" cy="70" r="1.8" fill={colors.deepForest} />
    {/* Flechas */}
    <Flecha x1="70" y1="54" x2="70" y2="44" color={colors.mint} />
  </Svg>
);

const SvgBridging = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    {/* Colchoneta */}
    <Rect x="8" y="128" width="124" height="8" rx="4" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Figura en bridging */}
    {/* Pies apoyados */}
    <Rect x="18" y="118" width="22" height="12" rx="5" fill={colors.sage} />
    <Rect x="46" y="118" width="22" height="12" rx="5" fill={colors.sage} />
    {/* Piernas elevadas */}
    <Line x1="22" y1="118" x2="30" y2="88" stroke={colors.midGreen} strokeWidth="12" strokeLinecap="round" />
    <Line x1="58" y1="118" x2="54" y2="88" stroke={colors.midGreen} strokeWidth="12" strokeLinecap="round" />
    {/* Caderas elevadas */}
    <Ellipse cx="42" cy="82" rx="26" ry="12" fill={colors.midGreen} stroke={colors.sage} strokeWidth="1.5" />
    {/* Torso */}
    <Rect x="55" y="88" width="36" height="26" rx="10" fill={colors.midGreen} />
    {/* Brazos a los lados */}
    <Line x1="90" y1="96" x2="118" y2="106" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Ellipse cx="122" cy="108" rx="10" ry="6" fill={colors.mint} />
    {/* Cabeza */}
    <Circle cx="100" cy="86" r="14" fill={colors.sage} />
    <Ellipse cx="112" cy="86" rx="3.5" ry="4.5" fill={colors.sage} />
    {/* Arco de elevación */}
    <Path d="M 22 118 Q 42 72 62 88" stroke="#e8c97a" strokeWidth="2" fill="none" strokeDasharray="4,3" opacity="0.6" />
    <Flecha x1="42" y1="72" x2="42" y2="64" color={colors.mint} />
    {/* Glúteos highlight */}
    <Ellipse cx="42" cy="82" rx="16" ry="8" fill={colors.sage} opacity="0.3" />
  </Svg>
);

// ─── SVG COORDINACIÓN Y EQUILIBRIO ───────────────────────────────────────────
const SvgTandem = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraDePie />
    {/* Suelo */}
    <Rect x="8" y="136" width="124" height="4" rx="2" fill={colors.deepForest} />
    {/* Línea central */}
    <Rect x="56" y="130" width="16" height="8" rx="2" fill="#e8c97a" opacity="0.7" />
    <Rect x="40" y="136" width="56" height="2" rx="1" fill={colors.mint} opacity="0.6" />
    {/* Huellas de pasos */}
    <Ellipse cx="60" cy="133" rx="6" ry="3" fill={colors.sage} opacity="0.5" />
    <Ellipse cx="68" cy="133" rx="6" ry="3" fill={colors.mint} opacity="0.5" />
    <Ellipse cx="46" cy="135" rx="5" ry="2.5" fill={colors.sage} opacity="0.3" />
    <Ellipse cx="82" cy="135" rx="5" ry="2.5" fill={colors.mint} opacity="0.3" />
    {/* Brazos equilibrando */}
    <Line x1="40" y1="52" x2="12" y2="60" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Line x1="88" y1="52" x2="116" y2="60" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
  </Svg>
);

const SvgCoordManoPie = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraDePie />
    <Line x1="8" y1="140" x2="118" y2="140" stroke={colors.deepForest} strokeWidth="3" strokeLinecap="round" />
    {/* Brazo derecho bajando */}
    <Line x1="88" y1="52" x2="100" y2="82" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Ellipse cx="103" cy="88" rx="10" ry="7" fill={colors.mint} />
    {/* Pie izquierdo levantado */}
    <Line x1="56" y1="80" x2="84" y2="110" stroke={colors.mint} strokeWidth="13" strokeLinecap="round" />
    <Ellipse cx="87" cy="116" rx="10" ry="5" fill="#e8c97a" opacity="0.9" />
    {/* Puntos de toque */}
    <Circle cx="96" cy="102" r="6" fill="#e8c97a" opacity="0.8" />
    <Flecha x1="104" y1="88" x2="100" y2="98" color="#e8c97a" dash />
    <Flecha x1="87" y1="116" x2="93" y2="108" color="#e8c97a" dash />
  </Svg>
);

const SvgLanzamientoPelota = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraDePie />
    <Line x1="8" y1="140" x2="118" y2="140" stroke={colors.deepForest} strokeWidth="3" strokeLinecap="round" />
    {/* Brazo en lanzamiento */}
    <Line x1="88" y1="52" x2="122" y2="36" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    {/* Pelota */}
    <Circle cx="130" cy="30" r="11" fill={colors.mint} />
    <Circle cx="127" cy="27" r="4" fill="white" opacity="0.25" />
    {/* Costuras pelota */}
    <Path d="M 125 24 Q 130 28 128 34" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" opacity="0.4" />
    <Path d="M 132 26 Q 136 30 133 36" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" opacity="0.3" />
    {/* Trayectoria parabólica */}
    <Path d="M 88 52 Q 110 18 130 30" stroke="#e8c97a" strokeWidth="2" fill="none" strokeDasharray="4,3" opacity="0.7" />
    {/* Rastro movimiento */}
    <Circle cx="98" cy="44" r="5" fill={colors.mint} opacity="0.2" />
    <Circle cx="110" cy="28" r="8" fill={colors.mint} opacity="0.12" />
  </Svg>
);

const SvgReaccionEquil = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraDePie />
    {/* Tabla basculante */}
    <Rect x="20" y="126" width="90" height="10" rx="5" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    <Path d="M 62 134 Q 65 140 68 134" stroke={colors.midGreen} strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* Suelo */}
    <Line x1="8" y1="142" x2="122" y2="142" stroke={colors.deepForest} strokeWidth="3" strokeLinecap="round" />
    {/* Flechas oscilación */}
    <Flecha x1="22" y1="126" x2="14" y2="118" color={colors.sage} dash />
    <Flecha x1="108" y1="126" x2="116" y2="118" color={colors.sage} dash />
    {/* Brazos en equilibrio activo */}
    <Line x1="40" y1="52" x2="10" y2="62" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Line x1="88" y1="52" x2="118" y2="62" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    {/* Línea de plomada */}
    <Line x1="64" y1="10" x2="64" y2="126" stroke="#e8c97a" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.4" />
  </Svg>
);

// ─── SVG AVD ──────────────────────────────────────────────────────────────────
const SvgVestidoSuperior = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Camiseta superpuesta */}
    <Rect x="27" y="60" width="58" height="44" rx="14" fill="none" stroke="#e8c97a" strokeWidth="2.5" />
    {/* Cuello de la camiseta */}
    <Path d="M 42 60 Q 56 52 70 60" stroke="#e8c97a" strokeWidth="2.5" fill="none" />
    {/* Botones */}
    <Circle cx="56" cy="72" r="3" fill={colors.mint} />
    <Circle cx="56" cy="82" r="3" fill={colors.mint} />
    <Circle cx="56" cy="92" r="3" fill={colors.mint} />
    {/* Brazo metiendo en manga */}
    <Line x1="80" y1="70" x2="96" y2="82" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Flecha x1="88" y1="82" x2="96" y2="80" color={colors.mint} />
  </Svg>
);

const SvgUsoCubiertos = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Plato */}
    <Circle cx="92" cy="100" r="24" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1.5" />
    <Circle cx="92" cy="100" r="16" fill={colors.darkGreen} />
    {/* Comida representada */}
    <Circle cx="88" cy="96" r="5" fill={colors.sage} opacity="0.6" />
    <Circle cx="96" cy="104" r="4" fill={colors.mint} opacity="0.6" />
    {/* Tenedor */}
    <Rect x="116" y="80" width="5" height="28" rx="2.5" fill={colors.mint} />
    <Line x1="114" y1="80" x2="114" y2="87" stroke={colors.mint} strokeWidth="2" strokeLinecap="round" />
    <Line x1="118" y1="80" x2="118" y2="87" stroke={colors.mint} strokeWidth="2" strokeLinecap="round" />
    <Line x1="122" y1="80" x2="122" y2="87" stroke={colors.mint} strokeWidth="2" strokeLinecap="round" />
    <Rect x="113" y="87" width="11" height="4" rx="2" fill={colors.mint} />
    {/* Brazo */}
    <Line x1="78" y1="74" x2="96" y2="94" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Line x1="96" y1="94" x2="114" y2="86" stroke={colors.sage} strokeWidth="8" strokeLinecap="round" />
  </Svg>
);

const SvgHigieneManos = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Palangana / lavabo */}
    <Ellipse cx="86" cy="108" rx="30" ry="12" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    <Ellipse cx="86" cy="104" rx="22" ry="8" fill={colors.deepForest} />
    {/* Agua / espuma */}
    <Path d="M 72 100 Q 76 96 80 100 Q 84 104 88 100 Q 92 96 96 100" stroke={colors.mint} strokeWidth="2" fill="none" opacity="0.7" />
    <Circle cx="80" cy="98" r="3" fill="white" opacity="0.2" />
    <Circle cx="90" cy="96" r="2" fill="white" opacity="0.15" />
    {/* Manos */}
    <Line x1="35" y1="74" x2="72" y2="100" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Line x1="76" y1="74" x2="98" y2="100" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Ellipse cx="72" cy="104" rx="12" ry="7" fill={colors.mint} opacity="0.85" />
    <Ellipse cx="98" cy="104" rx="12" ry="7" fill={colors.mint} opacity="0.75" />
    {/* Burbujas */}
    <Circle cx="68" cy="94" r="4" fill="none" stroke={colors.mint} strokeWidth="1.5" opacity="0.6" />
    <Circle cx="104" cy="92" r="3" fill="none" stroke={colors.mint} strokeWidth="1.5" opacity="0.5" />
  </Svg>
);

const SvgAbrirBotes = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Bote */}
    <Rect x="78" y="88" width="46" height="30" rx="6" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Tapa */}
    <Ellipse cx="101" cy="88" rx="23" ry="8" fill={colors.midGreen} stroke={colors.sage} strokeWidth="1.5" />
    <Ellipse cx="101" cy="84" rx="18" ry="5" fill={colors.sage} opacity="0.6" />
    {/* Etiqueta */}
    <Rect x="84" y="96" width="34" height="16" rx="3" fill={colors.deepForest} />
    <Line x1="88" y1="102" x2="114" y2="102" stroke={colors.sage} strokeWidth="1.5" opacity="0.5" />
    <Line x1="88" y1="107" x2="106" y2="107" stroke={colors.sage} strokeWidth="1.5" opacity="0.35" />
    {/* Brazos */}
    <Line x1="78" y1="74" x2="96" y2="94" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Line x1="34" y1="76" x2="80" y2="90" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    {/* Flechas giro tapa */}
    <Path d="M 96 80 Q 101 74 108 78" stroke="#e8c97a" strokeWidth="2" fill="none" opacity="0.8" />
    <Flecha x1="106" y1="76" x2="110" y2="80" color="#e8c97a" />
  </Svg>
);

// ─── SVG VISUAL / PERCEPTUAL ──────────────────────────────────────────────────
const SvgAgudeVisual = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Tabla optométrica */}
    <Rect x="72" y="10" width="62" height="80" rx="6" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Letras escalonadas */}
    <Circle cx="103" cy="28" r="10" fill={colors.mint} opacity="0.2" />
    <Path d="M 98 32 L 103 20 L 108 32 M 99 28 L 107 28" stroke={colors.mint} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <Path d="M 90 42 L 94 36 L 98 42 M 91 40 L 97 40" stroke={colors.sage} strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M 106 42 L 110 36 L 114 42 M 107 40 L 113 40" stroke={colors.sage} strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M 84 53 L 87 48 L 90 53 M 85 51.5 L 89 51.5" stroke={colors.midGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Path d="M 94 53 L 97 48 L 100 53 M 95 51.5 L 99 51.5" stroke={colors.midGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Path d="M 104 53 L 107 48 L 110 53 M 105 51.5 L 109 51.5" stroke={colors.midGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Path d="M 114 53 L 117 48 L 120 53 M 115 51.5 L 119 51.5" stroke={colors.midGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Fila pequeña */}
    <Rect x="80" y="62" width="44" height="6" rx="2" fill={colors.deepForest} />
    <Rect x="80" y="72" width="34" height="6" rx="2" fill={colors.deepForest} opacity="0.7" />
    {/* Línea de visión */}
    <Line x1="56" y1="40" x2="72" y2="34" stroke="#e8c97a" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7" />
  </Svg>
);

const SvgPercepEspacial = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Panel de formas geométricas */}
    <Rect x="66" y="78" width="62" height="40" rx="5" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1.5" />
    {/* Triángulo */}
    <Polygon points="76,114 88,88 100,114" fill={colors.sage} opacity="0.85" />
    {/* Cuadrado */}
    <Rect x="103" y="92" width="18" height="18" rx="3" fill={colors.mint} opacity="0.85" />
    {/* Círculo */}
    <Circle cx="126" cy="101" r="9" fill="#e8c97a" opacity="0.85" />
    {/* Sombra 3D */}
    <Polygon points="77,115 89,115 87,119 75,119" fill={colors.sage} opacity="0.35" />
    <Rect x="104" y="110" width="18" height="4" rx="2" fill={colors.mint} opacity="0.3" />
    {/* Brazo señalando */}
    <Line x1="35" y1="74" x2="82" y2="98" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
  </Svg>
);

const SvgDiscFigFondo = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Panel */}
    <Rect x="66" y="12" width="66" height="64" rx="6" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    <Rect x="70" y="16" width="58" height="56" rx="4" fill={colors.deepForest} />
    {/* Fondo con patrón */}
    <Line x1="70" y1="24" x2="128" y2="24" stroke={colors.darkGreen} strokeWidth="2" opacity="0.5" />
    <Line x1="70" y1="32" x2="128" y2="32" stroke={colors.darkGreen} strokeWidth="2" opacity="0.5" />
    <Line x1="70" y1="40" x2="128" y2="40" stroke={colors.darkGreen} strokeWidth="2" opacity="0.5" />
    <Line x1="70" y1="48" x2="128" y2="48" stroke={colors.darkGreen} strokeWidth="2" opacity="0.5" />
    <Line x1="70" y1="56" x2="128" y2="56" stroke={colors.darkGreen} strokeWidth="2" opacity="0.5" />
    <Line x1="70" y1="64" x2="128" y2="64" stroke={colors.darkGreen} strokeWidth="2" opacity="0.5" />
    {/* Figura destacada (primer plano) */}
    <Circle cx="99" cy="44" r="18" fill={colors.midGreen} opacity="0.6" />
    <Polygon points="84,66 99,22 114,66" fill="none" stroke={colors.mint} strokeWidth="2.5" />
    {/* Objeto destacado */}
    <Circle cx="99" cy="44" r="7" fill="#e8c97a" opacity="0.9" />
    <Circle cx="101" cy="42" r="2.5" fill="white" opacity="0.4" />
    {/* Brazo señalando */}
    <Line x1="35" y1="74" x2="80" y2="50" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
  </Svg>
);

// ─── SVG RELAJACIÓN ───────────────────────────────────────────────────────────
const SvgMindfulness = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Aura de calma */}
    <Circle cx="56" cy="40" r="36" fill="none" stroke={colors.sage} strokeWidth="1.5" opacity="0.2" />
    <Circle cx="56" cy="40" r="28" fill="none" stroke={colors.mint} strokeWidth="1.5" opacity="0.3" />
    {/* Nube de meditación */}
    <Ellipse cx="108" cy="30" rx="24" ry="14" fill={colors.midGreen} opacity="0.7" />
    <Circle cx="96" cy="32" rx="12" ry="12" r="12" fill={colors.midGreen} opacity="0.5" />
    <Circle cx="118" cy="34" r="10" fill={colors.midGreen} opacity="0.5" />
    <Ellipse cx="108" cy="30" rx="18" ry="10" fill={colors.darkGreen} opacity="0.5" />
    {/* Partículas de mindfulness */}
    <Circle cx="90" cy="18" r="3" fill={colors.mint} opacity="0.6" />
    <Circle cx="100" cy="12" r="2.5" fill="#e8c97a" opacity="0.5" />
    <Circle cx="114" cy="14" r="2" fill={colors.sage} opacity="0.6" />
    <Circle cx="124" cy="20" r="3" fill={colors.mint} opacity="0.4" />
    {/* Manos en posición de meditación */}
    <Line x1="34" y1="74" x2="44" y2="100" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Ellipse cx="44" cy="106" rx="10" ry="7" fill={colors.mint} opacity="0.8" />
    <Line x1="78" y1="74" x2="68" y2="100" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Ellipse cx="68" cy="106" rx="10" ry="7" fill={colors.mint} opacity="0.75" />
    <Ellipse cx="56" cy="110" rx="16" ry="6" fill={colors.sage} opacity="0.5" />
  </Svg>
);

const SvgRelMuscular = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    {/* Colchoneta */}
    <Rect x="8" y="108" width="124" height="10" rx="5" fill={colors.darkGreen} />
    {/* Figura reclinada */}
    <Circle cx="70" cy="30" r="15" fill={colors.sage} />
    <Ellipse cx="55" cy="30" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="85" cy="30" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="65" cy="27" rx="3.5" ry="4" fill="white" />
    <Ellipse cx="75" cy="27" rx="3.5" ry="4" fill="white" />
    <Circle cx="66" cy="28" r="2" fill={colors.deepForest} />
    <Circle cx="76" cy="28" r="2" fill={colors.deepForest} />
    <Circle cx="66.8" cy="27.2" r="0.7" fill="white" />
    <Circle cx="76.8" cy="27.2" r="0.7" fill="white" />
    <Path d="M 65 34 Q 70 37 75 34" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Cuello */}
    <Rect x="66" y="44" width="8" height="10" rx="4" fill={colors.sage} />
    {/* Torso */}
    <Rect x="56" y="52" width="28" height="34" rx="10" fill={colors.midGreen} />
    {/* Brazos relajados */}
    <Line x1="56" y1="60" x2="22" y2="76" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Ellipse cx="16" cy="78" rx="9" ry="6" fill={colors.mint} opacity="0.8" />
    <Path d="M 10 74 L 10 68 Q 16 62 22 68" stroke={colors.mint} strokeWidth="3" fill="none" opacity="0.5" />
    <Line x1="84" y1="60" x2="118" y2="76" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Ellipse cx="124" cy="78" rx="9" ry="6" fill={colors.mint} opacity="0.75" />
    {/* Piernas */}
    <Rect x="60" y="84" width="11" height="28" rx="5.5" fill={colors.midGreen} />
    <Rect x="73" y="84" width="11" height="28" rx="5.5" fill={colors.midGreen} />
    <Ellipse cx="66" cy="114" rx="10" ry="4.5" fill={colors.sage} />
    <Ellipse cx="79" cy="114" rx="10" ry="4.5" fill={colors.sage} />
    {/* Ondas de relajación */}
    <Path d="M 16 64 Q 20 58 24 64 Q 20 70 16 64" fill="#e8c97a" opacity="0.6" />
    <Path d="M 116 64 Q 120 58 124 64 Q 120 70 116 64" fill="#e8c97a" opacity="0.6" />
  </Svg>
);

const SvgVisualizacion = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Burbuja de visualización */}
    <Circle cx="100" cy="36" r="32" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1.5" opacity="0.9" />
    {/* Escena visualizada — paisaje sereno */}
    <Ellipse cx="100" cy="50" rx="24" ry="8" fill={colors.darkGreen} opacity="0.6" />
    <Path d="M 80 48 Q 88 36 96 44 Q 100 34 106 44 Q 112 36 120 48" fill={colors.midGreen} opacity="0.5" />
    <Circle cx="100" cy="22" r="8" fill="#e8c97a" opacity="0.7" />
    <Line x1="100" y1="14" x2="100" y2="10" stroke="#e8c97a" strokeWidth="1.5" opacity="0.5" />
    <Line x1="106" y1="16" x2="109" y2="12" stroke="#e8c97a" strokeWidth="1.5" opacity="0.4" />
    <Line x1="108" y1="22" x2="112" y2="22" stroke="#e8c97a" strokeWidth="1.5" opacity="0.4" />
    {/* Partículas flotantes */}
    <Circle cx="84" cy="26" r="3" fill={colors.sage} opacity="0.6" />
    <Circle cx="114" cy="28" r="2.5" fill={colors.mint} opacity="0.5" />
    <Circle cx="90" cy="16" r="2" fill={colors.mint} opacity="0.4" />
    {/* Cola de burbuja */}
    <Path d="M 74 48 Q 68 56 64 50" stroke={colors.midGreen} strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
    {/* Ojos cerrados meditando */}
    <Path d="M 50 37 Q 55 34 60 37" stroke={colors.darkGreen} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <Path d="M 50 37 Q 55 40 60 37" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" />
  </Svg>
);

// ─── SVG SOCIAL / EMOCIONAL ───────────────────────────────────────────────────
const SvgJuegoRoles = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    {/* Persona 1 */}
    <Circle cx="32" cy="24" r="14" fill={colors.sage} />
    <Ellipse cx="20" cy="24" rx="3.5" ry="4.5" fill={colors.sage} />
    <Ellipse cx="27" cy="21" rx="3" ry="3.5" fill="white" />
    <Ellipse cx="35" cy="21" rx="3" ry="3.5" fill="white" />
    <Circle cx="28" cy="22" r="1.8" fill={colors.deepForest} />
    <Circle cx="36" cy="22" r="1.8" fill={colors.deepForest} />
    <Path d="M 27 28 Q 32 31 37 28" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Rect x="20" y="36" width="24" height="30" rx="8" fill={colors.midGreen} />
    {/* Persona 2 */}
    <Circle cx="98" cy="24" r="14" fill={colors.mint} />
    <Ellipse cx="110" cy="24" rx="3.5" ry="4.5" fill={colors.mint} />
    <Ellipse cx="93" cy="21" rx="3" ry="3.5" fill="white" />
    <Ellipse cx="101" cy="21" rx="3" ry="3.5" fill="white" />
    <Circle cx="94" cy="22" r="1.8" fill={colors.deepForest} />
    <Circle cx="102" cy="22" r="1.8" fill={colors.deepForest} />
    <Path d="M 93 28 Q 98 31 103 28" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Rect x="86" y="36" width="24" height="30" rx="8" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1.5" />
    {/* Globo de diálogo */}
    <Path d="M 54 38 Q 60 28 66 38" stroke="#e8c97a" strokeWidth="2" fill="none" />
    <Circle cx="60" cy="32" r="10" fill={colors.deepForest} stroke="#e8c97a" strokeWidth="1.5" />
    <Line x1="54" y1="32" x2="66" y2="32" stroke="#e8c97a" strokeWidth="1.5" />
    <Line x1="54" y1="36" x2="62" y2="36" stroke="#e8c97a" strokeWidth="1.5" />
    {/* Piernas */}
    <Line x1="25" y1="65" x2="20" y2="118" stroke={colors.midGreen} strokeWidth="12" strokeLinecap="round" />
    <Line x1="40" y1="65" x2="44" y2="118" stroke={colors.midGreen} strokeWidth="12" strokeLinecap="round" />
    <Ellipse cx="20" cy="124" rx="10" ry="5" fill={colors.sage} />
    <Ellipse cx="44" cy="124" rx="10" ry="5" fill={colors.sage} />
    <Line x1="91" y1="65" x2="86" y2="118" stroke={colors.darkGreen} strokeWidth="12" strokeLinecap="round" />
    <Line x1="106" y1="65" x2="110" y2="118" stroke={colors.darkGreen} strokeWidth="12" strokeLinecap="round" />
    <Ellipse cx="86" cy="124" rx="10" ry="5" fill={colors.sage} />
    <Ellipse cx="110" cy="124" rx="10" ry="5" fill={colors.sage} />
  </Svg>
);

const SvgExpresionEmocional = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Panel de emociones 2x2 */}
    <Rect x="68" y="10" width="64" height="66" rx="8" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Feliz */}
    <Circle cx="84" cy="28" r="13" fill="#e8c97a" opacity="0.9" />
    <Ellipse cx="80" cy="25" rx="2.5" ry="3" fill={colors.deepForest} />
    <Ellipse cx="88" cy="25" rx="2.5" ry="3" fill={colors.deepForest} />
    <Path d="M 78 30 Q 84 36 90 30" stroke={colors.deepForest} strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Triste */}
    <Circle cx="114" cy="28" r="13" fill={colors.sage} opacity="0.9" />
    <Ellipse cx="110" cy="25" rx="2.5" ry="3" fill={colors.deepForest} />
    <Ellipse cx="118" cy="25" rx="2.5" ry="3" fill={colors.deepForest} />
    <Path d="M 108 34 Q 114 28 120 34" stroke={colors.deepForest} strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Enojado */}
    <Circle cx="84" cy="58" r="13" fill={colors.midGreen} opacity="0.9" />
    <Line x1="78" y1="52" x2="82" y2="55" stroke={colors.deepForest} strokeWidth="2" />
    <Line x1="90" y1="52" x2="86" y2="55" stroke={colors.deepForest} strokeWidth="2" />
    <Line x1="78" y1="62" x2="90" y2="62" stroke={colors.deepForest} strokeWidth="2" />
    {/* Sorprendido */}
    <Circle cx="114" cy="58" r="13" fill={colors.mint} opacity="0.9" />
    <Ellipse cx="110" cy="55" rx="2.5" ry="3.5" fill={colors.deepForest} />
    <Ellipse cx="118" cy="55" rx="2.5" ry="3.5" fill={colors.deepForest} />
    <Ellipse cx="114" cy="62" rx="4" ry="5" fill={colors.deepForest} />
    {/* Brazo señalando */}
    <Line x1="35" y1="74" x2="80" y2="48" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
  </Svg>
);

const SvgHabilidadesConv = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    {/* Dos personas */}
    <Circle cx="26" cy="26" r="14" fill={colors.sage} />
    <Ellipse cx="14" cy="26" rx="3.5" ry="4.5" fill={colors.sage} />
    <Ellipse cx="21" cy="23" rx="3" ry="3.5" fill="white" />
    <Ellipse cx="29" cy="23" rx="3" ry="3.5" fill="white" />
    <Circle cx="22" cy="24" r="1.8" fill={colors.deepForest} />
    <Circle cx="30" cy="24" r="1.8" fill={colors.deepForest} />
    <Path d="M 21 30 Q 26 33 31 30" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Circle cx="108" cy="26" r="14" fill={colors.mint} />
    <Ellipse cx="120" cy="26" rx="3.5" ry="4.5" fill={colors.mint} />
    <Ellipse cx="103" cy="23" rx="3" ry="3.5" fill="white" />
    <Ellipse cx="111" cy="23" rx="3" ry="3.5" fill="white" />
    <Circle cx="104" cy="24" r="1.8" fill={colors.deepForest} />
    <Circle cx="112" cy="24" r="1.8" fill={colors.deepForest} />
    <Path d="M 103 30 Q 108 33 113 30" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Globos de diálogo */}
    <Rect x="8" y="44" width="52" height="26" rx="8" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1.5" />
    <Polygon points="22,70 32,70 27,78" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1" />
    <Line x1="14" y1="54" x2="52" y2="54" stroke={colors.sage} strokeWidth="1.5" opacity="0.8" />
    <Line x1="14" y1="62" x2="44" y2="62" stroke={colors.sage} strokeWidth="1.5" opacity="0.5" />
    <Rect x="80" y="44" width="52" height="26" rx="8" fill={colors.darkGreen} stroke={colors.mint} strokeWidth="1.5" />
    <Polygon points="88,70 98,70 93,78" fill={colors.darkGreen} stroke={colors.mint} strokeWidth="1" />
    <Line x1="86" y1="54" x2="124" y2="54" stroke={colors.mint} strokeWidth="1.5" opacity="0.8" />
    <Line x1="86" y1="62" x2="116" y2="62" stroke={colors.mint} strokeWidth="1.5" opacity="0.5" />
    {/* Cuerpos */}
    <Rect x="16" y="38" width="20" height="60" rx="8" fill={colors.midGreen} />
    <Line x1="16" y1="50" x2="4" y2="62" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Line x1="36" y1="50" x2="48" y2="62" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Rect x="98" y="38" width="20" height="60" rx="8" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1" />
    <Line x1="98" y1="50" x2="86" y2="62" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Line x1="118" y1="50" x2="130" y2="62" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
  </Svg>
);


// ─── SVG TDAH E HIPERACTIVIDAD ────────────────────────────────────────────────
const SvgCircuitoMotor = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    {/* Circuito en el suelo */}
    <Line x1="14" y1="138" x2="128" y2="138" stroke={colors.deepForest} strokeWidth="3" strokeLinecap="round" />
    {/* Estaciones */}
    <Circle cx="24" cy="120" r="12" fill={colors.midGreen} stroke={colors.sage} strokeWidth="2" />
    <Circle cx="70" cy="106" r="12" fill={colors.darkGreen} stroke={colors.mint} strokeWidth="2" />
    <Circle cx="118" cy="120" r="12" fill={colors.midGreen} stroke="#e8c97a" strokeWidth="2" />
    {/* Números en estaciones */}
    <Path d="M 22 124 L 22 116 Q 26 116 26 120 Q 26 124 22 124" stroke={colors.mint} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Path d="M 66 124 L 68 116 L 68 124" stroke="#e8c97a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Path d="M 73 124 Q 73 116 76 116 Q 79 116 79 119 Q 79 122 73 124 L 79 124" stroke="#e8c97a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Trayectoria */}
    <Path d="M 24 120 Q 47 90 70 106 Q 93 122 118 120" stroke={colors.sage} strokeWidth="2" fill="none" strokeDasharray="5,4" opacity="0.7" />
    <Flecha x1="47" y1="92" x2="55" y2="98" color={colors.sage} />
    {/* Persona corriendo */}
    <Circle cx="38" cy="28" r="13" fill={colors.sage} />
    <Ellipse cx="26" cy="28" rx="3.5" ry="4.5" fill={colors.sage} />
    <Ellipse cx="33" cy="25" rx="3" ry="3.5" fill="white" />
    <Ellipse cx="41" cy="25" rx="3" ry="3.5" fill="white" />
    <Circle cx="34" cy="26" r="1.8" fill={colors.deepForest} />
    <Circle cx="42" cy="26" r="1.8" fill={colors.deepForest} />
    <Path d="M 33 32 Q 38 35 43 32" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Rect x="27" y="40" width="22" height="28" rx="8" fill={colors.midGreen} />
    <Line x1="27" y1="52" x2="12" y2="62" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Line x1="49" y1="52" x2="64" y2="62" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Line x1="30" y1="68" x2="24" y2="98" stroke={colors.midGreen} strokeWidth="11" strokeLinecap="round" />
    <Line x1="46" y1="68" x2="54" y2="98" stroke={colors.mint} strokeWidth="11" strokeLinecap="round" />
    <Ellipse cx="23" cy="104" rx="10" ry="5" fill={colors.sage} />
    <Ellipse cx="55" cy="104" rx="10" ry="5" fill={colors.mint} />
  </Svg>
);

const SvgPausaActiva = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraDePie />
    {/* Timer visual */}
    <Circle cx="112" cy="38" r="24" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Relleno de tiempo */}
    <Path d="M 112 14 A 24 24 0 0 1 136 38" fill={colors.sage} opacity="0.7" />
    <Path d="M 112 38 L 112 14" stroke={colors.mint} strokeWidth="2.5" fill="none" />
    <Path d="M 112 38 L 130 30" stroke={colors.sage} strokeWidth="2" fill="none" />
    <Circle cx="112" cy="38" r="4" fill={colors.mint} />
    <Circle cx="112" cy="38" r="1.5" fill="white" opacity="0.5" />
    {/* Persona haciendo movimiento activo */}
    <Line x1="40" y1="52" x2="12" y2="40" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Line x1="88" y1="52" x2="116" y2="40" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Line x1="8" y1="140" x2="118" y2="140" stroke={colors.darkGreen} strokeWidth="3" strokeLinecap="round" />
    {/* Líneas de movimiento energético */}
    <Line x1="10" y1="38" x2="18" y2="38" stroke={colors.mint} strokeWidth="2" opacity="0.6" />
    <Line x1="12" y1="32" x2="20" y2="36" stroke={colors.mint} strokeWidth="2" opacity="0.5" />
    <Line x1="12" y1="44" x2="20" y2="40" stroke={colors.mint} strokeWidth="2" opacity="0.4" />
  </Svg>
);

const SvgFocusTabla = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Tablero de tareas */}
    <Rect x="70" y="10" width="64" height="82" rx="7" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Título */}
    <Rect x="76" y="16" width="52" height="10" rx="3" fill={colors.midGreen} />
    {/* Filas de tareas */}
    <Rect x="76" y="30" width="52" height="12" rx="3" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1" />
    <Circle cx="82" cy="36" r="4" fill={colors.mint} />
    <Line x1="90" y1="36" x2="122" y2="36" stroke={colors.sage} strokeWidth="1.5" opacity="0.7" />
    <Rect x="76" y="46" width="52" height="12" rx="3" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1" />
    <Circle cx="82" cy="52" r="4" fill={colors.mint} />
    <Line x1="90" y1="52" x2="122" y2="52" stroke={colors.sage} strokeWidth="1.5" opacity="0.7" />
    <Rect x="76" y="62" width="52" height="12" rx="3" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1" />
    <Circle cx="82" cy="68" r="4" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1.5" />
    <Line x1="90" y1="68" x2="110" y2="68" stroke={colors.sage} strokeWidth="1.5" opacity="0.5" />
    <Rect x="76" y="78" width="52" height="10" rx="3" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1" />
    <Circle cx="82" cy="83" r="4" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1.5" />
    {/* Brazo señalando */}
    <Line x1="34" y1="74" x2="78" y2="62" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
  </Svg>
);

const SvgJuegoEstrategico = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Tablero de juego */}
    <Rect x="62" y="76" width="70" height="42" rx="6" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    {/* Fichas del juego 3x2 */}
    <Rect x="68" y="82" width="16" height="14" rx="4" fill={colors.sage} />
    <Circle cx="76" cy="89" r="5" fill={colors.darkGreen} opacity="0.5" />
    <Rect x="88" y="82" width="16" height="14" rx="4" fill={colors.midGreen} />
    <Polygon points="91,94 96,84 101,94" fill={colors.darkGreen} opacity="0.5" />
    <Rect x="108" y="82" width="16" height="14" rx="4" fill="#e8c97a" opacity="0.85" />
    <Circle cx="116" cy="89" r="4" fill={colors.deepForest} opacity="0.4" />
    <Rect x="68" y="100" width="16" height="14" rx="4" fill={colors.midGreen} />
    <Rect x="88" y="100" width="16" height="14" rx="4" fill="#e8c97a" opacity="0.85" />
    <Rect x="108" y="100" width="16" height="14" rx="4" fill={colors.sage} />
    {/* Mano moviendo ficha */}
    <Line x1="35" y1="74" x2="86" y2="96" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Ellipse cx="90" cy="100" rx="8" ry="6" fill={colors.mint} opacity="0.8" />
    <Flecha x1="90" y1="94" x2="90" y2="102" color={colors.mint} />
  </Svg>
);

const SvgRespiraConmigo = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Pelota de respiración */}
    <Circle cx="96" cy="56" r="36" fill={colors.midGreen} opacity="0.25" />
    <Circle cx="96" cy="56" r="28" fill={colors.midGreen} opacity="0.3" />
    <Circle cx="96" cy="56" r="20" fill={colors.midGreen} opacity="0.5" stroke={colors.sage} strokeWidth="1.5" />
    <Circle cx="96" cy="56" r="10" fill={colors.darkGreen} />
    <Circle cx="91" cy="51" r="4" fill={colors.midGreen} opacity="0.4" />
    {/* Radios de expansión */}
    <Line x1="96" y1="28" x2="96" y2="20" stroke="#e8c97a" strokeWidth="2" opacity="0.7" />
    <Line x1="96" y1="84" x2="96" y2="76" stroke="#e8c97a" strokeWidth="2" opacity="0.7" />
    <Line x1="68" y1="56" x2="60" y2="56" stroke="#e8c97a" strokeWidth="2" opacity="0.7" />
    <Line x1="124" y1="56" x2="132" y2="56" stroke="#e8c97a" strokeWidth="2" opacity="0.7" />
    <Line x1="75" y1="35" x2="70" y2="30" stroke="#e8c97a" strokeWidth="1.5" opacity="0.5" />
    <Line x1="117" y1="35" x2="122" y2="30" stroke="#e8c97a" strokeWidth="1.5" opacity="0.5" />
    {/* Flechas de inhalar/exhalar */}
    <Flecha x1="96" y1="25" x2="96" y2="36" color={colors.mint} />
  </Svg>
);

const SvgToken = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Tablero de fichas */}
    <Rect x="62" y="14" width="70" height="90" rx="8" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Título META */}
    <Rect x="68" y="20" width="58" height="12" rx="4" fill={colors.midGreen} />
    <Line x1="72" y1="26" x2="120" y2="26" stroke={colors.mint} strokeWidth="1.5" opacity="0.7" />
    {/* Fichas ganadas */}
    <Circle cx="80" cy="48" r="10" fill="#e8c97a" opacity="0.95" />
    <Circle cx="78" cy="46" r="3" fill="white" opacity="0.3" />
    <Circle cx="100" cy="48" r="10" fill="#e8c97a" opacity="0.95" />
    <Circle cx="98" cy="46" r="3" fill="white" opacity="0.3" />
    <Circle cx="120" cy="48" r="10" fill="#e8c97a" opacity="0.95" />
    <Circle cx="118" cy="46" r="3" fill="white" opacity="0.3" />
    {/* Fichas vacías */}
    <Circle cx="80" cy="72" r="10" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1.5" />
    <Circle cx="100" cy="72" r="10" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1.5" />
    {/* Meta */}
    <Rect x="68" y="86" width="58" height="14" rx="5" fill={colors.midGreen} stroke={colors.sage} strokeWidth="1" />
    <Line x1="74" y1="93" x2="118" y2="93" stroke={colors.mint} strokeWidth="1.5" opacity="0.7" />
    {/* Brazo alcanzando */}
    <Line x1="35" y1="74" x2="78" y2="62" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
  </Svg>
);

// ─── SVG DISCAPACIDAD INTELECTUAL ─────────────────────────────────────────────
const SvgPictograma = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Tablero de pictogramas */}
    <Rect x="62" y="74" width="70" height="44" rx="6" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    {/* Pictograma 1: mano */}
    <Rect x="66" y="78" width="28" height="28" rx="5" fill={colors.deepForest} stroke={colors.sage} strokeWidth="2" />
    <Ellipse cx="80" cy="88" rx="9" ry="7" fill={colors.mint} opacity="0.8" />
    <Line x1="74" y1="82" x2="74" y2="88" stroke={colors.mint} strokeWidth="3" strokeLinecap="round" />
    <Line x1="80" y1="80" x2="80" y2="88" stroke={colors.mint} strokeWidth="3" strokeLinecap="round" />
    <Line x1="86" y1="82" x2="86" y2="88" stroke={colors.mint} strokeWidth="3" strokeLinecap="round" />
    {/* Pictograma 2: casa */}
    <Rect x="98" y="78" width="28" height="28" rx="5" fill={colors.deepForest} stroke="#e8c97a" strokeWidth="2" />
    <Polygon points="104,100 112,84 120,100" fill="#e8c97a" opacity="0.8" />
    <Rect x="108" y="92" width="8" height="8" rx="1" fill={colors.darkGreen} />
    {/* Etiqueta */}
    <Rect x="66" y="108" width="60" height="8" rx="3" fill={colors.deepForest} />
    <Line x1="70" y1="112" x2="120" y2="112" stroke={colors.sage} strokeWidth="1.5" opacity="0.6" />
    {/* Brazo señalando */}
    <Line x1="35" y1="74" x2="78" y2="86" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Flecha x1="66" y1="88" x2="78" y2="88" color={colors.mint} />
  </Svg>
);

const SvgRutinaVisual = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Panel de rutina */}
    <Rect x="62" y="8" width="72" height="98" rx="7" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Paso 1 completado */}
    <Rect x="68" y="14" width="60" height="20" rx="4" fill={colors.midGreen} />
    <Circle cx="75" cy="24" r="6" fill={colors.mint} />
    <Path d="M 72 24 L 74 26 L 79 21" stroke={colors.deepForest} strokeWidth="2" fill="none" strokeLinecap="round" />
    <Rect x="84" y="18" width="38" height="12" rx="3" fill={colors.darkGreen} opacity="0.4" />
    {/* Paso 2 activo */}
    <Rect x="68" y="38" width="60" height="20" rx="4" fill={colors.deepForest} stroke="#e8c97a" strokeWidth="2" />
    <Circle cx="75" cy="48" r="6" fill="#e8c97a" opacity="0.9" />
    <Rect x="84" y="42" width="38" height="12" rx="3" fill={colors.darkGreen} opacity="0.3" />
    {/* Paso 3 pendiente */}
    <Rect x="68" y="62" width="60" height="20" rx="4" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1" />
    <Circle cx="75" cy="72" r="6" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1.5" />
    <Rect x="84" y="66" width="38" height="12" rx="3" fill={colors.darkGreen} opacity="0.3" />
    {/* Paso 4 pendiente */}
    <Rect x="68" y="86" width="60" height="16" rx="4" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1" />
    <Circle cx="75" cy="94" r="6" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1.5" />
    {/* Brazo apuntando */}
    <Line x1="34" y1="74" x2="68" y2="68" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Flecha x1="62" y1="68" x2="70" y2="68" color="#e8c97a" />
  </Svg>
);

const SvgEncadenamientoAVD = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Cadena de pasos */}
    <Circle cx="72" cy="28" r="16" fill={colors.midGreen} stroke={colors.sage} strokeWidth="2" />
    <Circle cx="72" cy="28" r="16" fill="none" stroke={colors.sage} strokeWidth="2" />
    <Path d="M 68 32 L 68 24 Q 74 24 74 28 Q 74 32 68 32" stroke={colors.mint} strokeWidth="2" fill="none" strokeLinecap="round" />
    <Line x1="88" y1="28" x2="100" y2="28" stroke={colors.sage} strokeWidth="2.5" />
    <Flecha x1="94" y1="28" x2="102" y2="28" color={colors.sage} />
    <Circle cx="116" cy="28" r="16" fill={colors.darkGreen} stroke={colors.mint} strokeWidth="2" />
    <Path d="M 111 32 L 112 24 L 112 32" stroke="#e8c97a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M 117 32 Q 117 24 120 24 Q 123 24 123 27 Q 123 30 117 32 L 123 32" stroke="#e8c97a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Line x1="72" y1="44" x2="72" y2="56" stroke={colors.sage} strokeWidth="2.5" />
    <Flecha x1="72" y1="50" x2="72" y2="58" color={colors.sage} />
    <Circle cx="72" cy="70" r="16" fill={colors.deepForest} stroke="#e8c97a" strokeWidth="2" />
    <Path d="M 66 74 L 68 62 Q 78 62 78 68 Q 78 72 72 72 L 78 80" stroke="#e8c97a" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Brazo señalando */}
    <Line x1="35" y1="74" x2="72" y2="80" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
  </Svg>
);

const SvgManipulacionObjetos = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Mesa con objetos */}
    <Rect x="60" y="84" width="68" height="34" rx="6" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    {/* Pelota */}
    <Circle cx="76" cy="104" r="10" fill={colors.sage} opacity="0.8" />
    <Circle cx="73" cy="101" r="3.5" fill="white" opacity="0.2" />
    {/* Cubo */}
    <Rect x="92" y="94" width="14" height="14" rx="3" fill={colors.mint} opacity="0.85" />
    <Polygon points="92,94 98,88 112,88 106,94" fill={colors.mint} opacity="0.5" />
    <Line x1="106" y1="94" x2="106" y2="108" stroke={colors.mint} strokeWidth="1.5" opacity="0.5" />
    {/* Triángulo */}
    <Polygon points="114,116 124,96 134,116" fill="#e8c97a" opacity="0.8" />
    <Polygon points="115,116 124,96 125,116" fill="#d4a843" opacity="0.3" />
    {/* Brazo manipulando */}
    <Line x1="35" y1="74" x2="80" y2="96" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Ellipse cx="84" cy="100" rx="8" ry="6" fill={colors.mint} opacity="0.8" />
    <Flecha x1="84" y1="94" x2="84" y2="102" color={colors.mint} />
  </Svg>
);

const SvgComunicacionFuncional = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Tablet/comunicador */}
    <Rect x="62" y="14" width="70" height="82" rx="8" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    <Rect x="68" y="20" width="58" height="70" rx="5" fill={colors.deepForest} />
    {/* Pictogramas en la pantalla */}
    <Rect x="72" y="24" width="24" height="24" rx="4" fill={colors.midGreen} />
    <Circle cx="84" cy="33" r="7" fill={colors.sage} opacity="0.8" />
    <Circle cx="82" cy="31" r="2.5" fill="white" opacity="0.3" />
    <Rect x="100" y="24" width="24" height="24" rx="4" fill={colors.darkGreen} stroke="#e8c97a" strokeWidth="1.5" />
    <Polygon points="104,46 112,28 120,46" fill="#e8c97a" opacity="0.8" />
    {/* Texto / líneas */}
    <Rect x="72" y="52" width="52" height="8" rx="3" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1" />
    <Line x1="76" y1="56" x2="118" y2="56" stroke={colors.sage} strokeWidth="1.5" opacity="0.5" />
    <Rect x="72" y="64" width="38" height="8" rx="3" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1" />
    <Line x1="76" y1="68" x2="104" y2="68" stroke={colors.sage} strokeWidth="1.5" opacity="0.4" />
    {/* Brazo señalando la pantalla */}
    <Line x1="34" y1="74" x2="80" y2="60" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Flecha x1="74" y1="60" x2="82" y2="56" color={colors.mint} />
  </Svg>
);

const SvgHabilidadesPrelab = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraDePie />
    <Line x1="8" y1="140" x2="118" y2="140" stroke={colors.deepForest} strokeWidth="3" strokeLinecap="round" />
    {/* Mesa de trabajo */}
    <Rect x="90" y="50" width="46" height="6" rx="3" fill={colors.darkGreen} />
    <Rect x="90" y="54" width="5" height="60" rx="2.5" fill={colors.darkGreen} />
    <Rect x="130" y="54" width="5" height="60" rx="2.5" fill={colors.darkGreen} />
    {/* Tarea sobre la mesa */}
    <Rect x="94" y="36" width="38" height="18" rx="4" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1.5" />
    <Line x1="98" y1="42" x2="128" y2="42" stroke={colors.sage} strokeWidth="1.5" opacity="0.7" />
    <Line x1="98" y1="48" x2="118" y2="48" stroke={colors.sage} strokeWidth="1.5" opacity="0.5" />
    {/* Brazo trabajando */}
    <Line x1="88" y1="52" x2="100" y2="44" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Ellipse cx="103" cy="40" rx="8" ry="6" fill={colors.mint} opacity="0.85" />
    {/* Lápiz */}
    <Rect x="104" y="32" width="4" height="16" rx="2" fill="#e8c97a" opacity="0.85" transform="rotate(-15 106 40)" />
  </Svg>
);

// ─── SVG AUTISMO / TEA ────────────────────────────────────────────────────────
const SvgRutinaEstructurada = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Tablero primera-después */}
    <Rect x="62" y="8" width="72" height="96" rx="7" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* "Primero" */}
    <Rect x="66" y="14" width="30" height="10" rx="3" fill={colors.midGreen} />
    <Line x1="70" y1="19" x2="92" y2="19" stroke={colors.mint} strokeWidth="1.5" opacity="0.8" />
    <Rect x="66" y="26" width="30" height="30" rx="5" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1.5" />
    <Circle cx="81" cy="36" r="9" fill={colors.sage} opacity="0.7" />
    <Circle cx="79" cy="34" r="3" fill="white" opacity="0.25" />
    <Rect x="70" y="48" width="22" height="6" rx="2" fill={colors.darkGreen} />
    {/* Flecha */}
    <Flecha x1="100" y1="41" x2="106" y2="41" color={colors.mint} />
    {/* "Después" */}
    <Rect x="102" y="14" width="28" height="10" rx="3" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1" />
    <Line x1="106" y1="19" x2="126" y2="19" stroke={colors.sage} strokeWidth="1.5" opacity="0.6" />
    <Rect x="102" y="26" width="28" height="30" rx="5" fill={colors.deepForest} stroke="#e8c97a" strokeWidth="1.5" />
    <Polygon points="108,54 116,30 124,54" fill="#e8c97a" opacity="0.7" />
    {/* Timer abajo */}
    <Rect x="66" y="62" width="64" height="36" rx="5" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1.5" />
    <Circle cx="98" cy="80" r="14" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1.5" />
    <Line x1="98" y1="80" x2="98" y2="68" stroke={colors.mint} strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="98" y1="80" x2="108" y2="80" stroke={colors.sage} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="98" cy="80" r="3" fill={colors.sage} />
  </Svg>
);

const SvgDesensibilizacion = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1" />
    {/* Jerarquía de estímulos (círculos concéntricos) */}
    <Circle cx="100" cy="74" r="34" fill={colors.deepForest} stroke={colors.darkGreen} strokeWidth="1.5" opacity="0.7" />
    <Circle cx="100" cy="74" r="24" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" opacity="0.8" />
    <Circle cx="100" cy="74" r="14" fill={colors.midGreen} stroke={colors.sage} strokeWidth="1.5" />
    <Circle cx="100" cy="74" r="6" fill={colors.mint} />
    <Circle cx="100" cy="74" r="2" fill="white" opacity="0.4" />
    {/* Etiquetas de nivel */}
    <Line x1="76" y1="54" x2="70" y2="48" stroke={colors.sage} strokeWidth="1.5" opacity="0.5" />
    <Line x1="86" y1="52" x2="80" y2="44" stroke={colors.mint} strokeWidth="1.5" opacity="0.6" />
    {/* Brazo extendido hacia círculo */}
    <Line x1="78" y1="74" x2="90" y2="74" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Flecha x1="80" y1="74" x2="90" y2="74" color={colors.mint} />
    <Flecha x1="70" y1="74" x2="80" y2="74" color={colors.mint} dash />
  </Svg>
);

const SvgJuegoParalelo = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <Line x1="18" y1="122" x2="124" y2="122" stroke={colors.darkGreen} strokeWidth="3" strokeLinecap="round" />
    {/* Persona 1 */}
    <Circle cx="26" cy="24" r="13" fill={colors.sage} />
    <Ellipse cx="16" cy="24" rx="3.5" ry="4.5" fill={colors.sage} />
    <Ellipse cx="22" cy="21" rx="3" ry="3.5" fill="white" />
    <Ellipse cx="30" cy="21" rx="3" ry="3.5" fill="white" />
    <Circle cx="23" cy="22" r="1.8" fill={colors.deepForest} />
    <Circle cx="31" cy="22" r="1.8" fill={colors.deepForest} />
    <Path d="M 22 28 Q 27 31 32 28" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Rect x="16" y="36" width="20" height="26" rx="7" fill={colors.midGreen} />
    <Line x1="16" y1="48" x2="6" y2="58" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Line x1="36" y1="48" x2="46" y2="58" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Line x1="20" y1="62" x2="16" y2="104" stroke={colors.midGreen} strokeWidth="11" strokeLinecap="round" />
    <Line x1="34" y1="62" x2="36" y2="104" stroke={colors.midGreen} strokeWidth="11" strokeLinecap="round" />
    {/* Objetos de juego p1 */}
    <Circle cx="20" cy="94" r="9" fill={colors.sage} opacity="0.6" />
    <Circle cx="18" cy="92" r="3" fill="white" opacity="0.2" />
    {/* Persona 2 */}
    <Circle cx="102" cy="24" r="13" fill={colors.mint} />
    <Ellipse cx="112" cy="24" rx="3.5" ry="4.5" fill={colors.mint} />
    <Ellipse cx="98" cy="21" rx="3" ry="3.5" fill="white" />
    <Ellipse cx="106" cy="21" rx="3" ry="3.5" fill="white" />
    <Circle cx="99" cy="22" r="1.8" fill={colors.deepForest} />
    <Circle cx="107" cy="22" r="1.8" fill={colors.deepForest} />
    <Path d="M 98 28 Q 103 31 108 28" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Rect x="92" y="36" width="20" height="26" rx="7" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1.5" />
    <Line x1="92" y1="48" x2="82" y2="58" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Line x1="112" y1="48" x2="122" y2="58" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Line x1="96" y1="62" x2="92" y2="104" stroke={colors.darkGreen} strokeWidth="11" strokeLinecap="round" />
    <Line x1="110" y1="62" x2="110" y2="104" stroke={colors.darkGreen} strokeWidth="11" strokeLinecap="round" />
    {/* Objetos de juego p2 */}
    <Circle cx="106" cy="94" r="9" fill={colors.mint} opacity="0.6" />
    <Circle cx="104" cy="92" r="3" fill="white" opacity="0.2" />
    {/* Conexión visual entre los dos (mirada) */}
    <Line x1="36" y1="26" x2="90" y2="26" stroke="#e8c97a" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
  </Svg>
);

const SvgRegulacionSensorial = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Escala de arousal 1-5 */}
    <Rect x="90" y="18" width="44" height="80" rx="7" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Nivel 5 - rojo */}
    <Rect x="94" y="22" width="36" height="12" rx="3" fill="#c0392b" opacity="0.7" />
    {/* Nivel 4 */}
    <Rect x="94" y="36" width="36" height="12" rx="3" fill="#e67e22" opacity="0.7" />
    {/* Nivel 3 - óptimo */}
    <Rect x="94" y="50" width="36" height="12" rx="3" fill={colors.sage} opacity="0.9" />
    <Circle cx="102" cy="56" r="3" fill="white" opacity="0.5" />
    {/* Nivel 2 */}
    <Rect x="94" y="64" width="36" height="12" rx="3" fill={colors.mint} opacity="0.6" />
    {/* Nivel 1 */}
    <Rect x="94" y="78" width="36" height="12" rx="3" fill={colors.midGreen} opacity="0.5" />
    {/* Indicador actual */}
    <Path d="M 90 56 L 86 53 L 86 59 Z" fill="#e8c97a" opacity="0.9" />
    <Line x1="86" y1="56" x2="94" y2="56" stroke="#e8c97a" strokeWidth="2" />
    {/* Ondas de regulación */}
    <Circle cx="56" cy="40" r="22" fill="none" stroke={colors.mint} strokeWidth="1.5" strokeDasharray="4,4" opacity="0.4" />
    <Circle cx="56" cy="40" r="14" fill="none" stroke={colors.sage} strokeWidth="1" opacity="0.5" />
  </Svg>
);

const SvgTransicionActividad = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Actividad A */}
    <Rect x="62" y="14" width="30" height="30" rx="6" fill={colors.midGreen} stroke={colors.sage} strokeWidth="2" />
    <Circle cx="77" cy="29" r="9" fill={colors.darkGreen} />
    <Circle cx="75" cy="27" r="3" fill={colors.mint} opacity="0.5" />
    {/* Flecha de transición */}
    <Path d="M 94 29 L 108 29" stroke={colors.sage} strokeWidth="2.5" strokeLinecap="round" />
    <Flecha x1="100" y1="29" x2="110" y2="29" color={colors.sage} />
    {/* Actividad B */}
    <Rect x="110" y="14" width="30" height="30" rx="6" fill={colors.darkGreen} stroke="#e8c97a" strokeWidth="2" />
    <Polygon points="116,42 126,18 136,42" fill="#e8c97a" opacity="0.8" />
    {/* Barra de progreso temporal */}
    <Rect x="62" y="50" width="78" height="12" rx="4" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1.5" />
    <Rect x="62" y="50" width="48" height="12" rx="4" fill={colors.sage} opacity="0.7" />
    {/* Timer */}
    <Circle cx="100" cy="56" r="5" fill="#e8c97a" opacity="0.9" />
    {/* Objeto de transición */}
    <Circle cx="105" cy="72" r="8" fill={colors.mint} />
    <Circle cx="103" cy="70" r="3" fill="white" opacity="0.25" />
    <Flecha x1="90" y1="70" x2="100" y2="72" color={colors.mint} dash />
    {/* Brazo */}
    <Line x1="34" y1="74" x2="80" y2="70" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
  </Svg>
);

const SvgInteraccionGuiada = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <Line x1="14" y1="126" x2="128" y2="126" stroke={colors.darkGreen} strokeWidth="3" strokeLinecap="round" />
    {/* Paciente (izq) */}
    <Circle cx="22" cy="22" r="12" fill={colors.sage} />
    <Ellipse cx="14" cy="22" rx="3" ry="4" fill={colors.sage} />
    <Ellipse cx="18" cy="19" rx="2.5" ry="3" fill="white" />
    <Ellipse cx="25" cy="19" rx="2.5" ry="3" fill="white" />
    <Circle cx="19" cy="20" r="1.5" fill={colors.deepForest} />
    <Circle cx="26" cy="20" r="1.5" fill={colors.deepForest} />
    <Path d="M 18 26 Q 22 29 27 26" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Rect x="14" y="33" width="16" height="22" rx="6" fill={colors.midGreen} />
    <Line x1="14" y1="40" x2="6" y2="48" stroke={colors.sage} strokeWidth="8" strokeLinecap="round" />
    <Line x1="30" y1="40" x2="38" y2="48" stroke={colors.sage} strokeWidth="8" strokeLinecap="round" />
    <Line x1="17" y1="55" x2="14" y2="98" stroke={colors.midGreen} strokeWidth="10" strokeLinecap="round" />
    <Line x1="27" y1="55" x2="28" y2="98" stroke={colors.midGreen} strokeWidth="10" strokeLinecap="round" />
    {/* Terapeuta (centro) */}
    <Circle cx="68" cy="26" r="12" fill="#e8c97a" opacity="0.9" />
    <Ellipse cx="63" cy="23" rx="2.5" ry="3" fill="white" />
    <Ellipse cx="71" cy="23" rx="2.5" ry="3" fill="white" />
    <Circle cx="64" cy="24" r="1.5" fill={colors.deepForest} />
    <Circle cx="72" cy="24" r="1.5" fill={colors.deepForest} />
    <Path d="M 63 30 Q 68 33 73 30" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Rect x="60" y="36" width="16" height="22" rx="6" fill={colors.darkGreen} stroke="#e8c97a" strokeWidth="1.5" />
    <Line x1="60" y1="42" x2="46" y2="52" stroke="#e8c97a" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
    <Line x1="76" y1="42" x2="90" y2="52" stroke="#e8c97a" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
    <Line x1="63" y1="58" x2="60" y2="98" stroke={colors.darkGreen} strokeWidth="10" strokeLinecap="round" />
    <Line x1="73" y1="58" x2="74" y2="98" stroke={colors.darkGreen} strokeWidth="10" strokeLinecap="round" />
    {/* Par (der) */}
    <Circle cx="114" cy="22" r="12" fill={colors.mint} />
    <Ellipse cx="120" cy="22" rx="3" ry="4" fill={colors.mint} />
    <Ellipse cx="109" cy="19" rx="2.5" ry="3" fill="white" />
    <Ellipse cx="117" cy="19" rx="2.5" ry="3" fill="white" />
    <Circle cx="110" cy="20" r="1.5" fill={colors.deepForest} />
    <Circle cx="118" cy="20" r="1.5" fill={colors.deepForest} />
    <Path d="M 109 26 Q 113 29 118 26" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Rect x="106" y="33" width="16" height="22" rx="6" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1" />
    <Line x1="106" y1="40" x2="96" y2="48" stroke={colors.sage} strokeWidth="8" strokeLinecap="round" />
    <Line x1="122" y1="40" x2="130" y2="48" stroke={colors.sage} strokeWidth="8" strokeLinecap="round" />
    <Line x1="109" y1="55" x2="106" y2="98" stroke={colors.darkGreen} strokeWidth="10" strokeLinecap="round" />
    <Line x1="119" y1="55" x2="120" y2="98" stroke={colors.darkGreen} strokeWidth="10" strokeLinecap="round" />
    {/* Conexiones de interacción */}
    <Line x1="30" y1="50" x2="46" y2="52" stroke={colors.sage} strokeWidth="2" strokeDasharray="3,2" opacity="0.6" />
    <Line x1="90" y1="52" x2="96" y2="50" stroke={colors.sage} strokeWidth="2" strokeDasharray="3,2" opacity="0.6" />
  </Svg>
);


// ─── SVG PRÓTESIS Y AMPUTACIÓN ────────────────────────────────────────────────
// Figura de pie con prótesis en pierna derecha
const FiguraConProtesisPierna = () => (
  <G>
    {/* Pierna izquierda normal */}
    <Rect x="48" y="80" width="13" height="48" rx="6.5" fill={colors.midGreen} />
    <Ellipse cx="54" cy="130" rx="10" ry="5" fill={colors.sage} />
    {/* Muñón pierna derecha */}
    <Rect x="65" y="80" width="13" height="28" rx="6.5" fill={colors.midGreen} />
    {/* Socket (copa de prótesis) */}
    <Rect x="63" y="106" width="17" height="8" rx="4" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1.5" />
    {/* Tubo tibial */}
    <Rect x="68" y="114" width="7" height="14" rx="3.5" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1.5" />
    {/* Pie protésico */}
    <Ellipse cx="71" cy="130" rx="12" ry="5" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    <Rect x="62" y="127" width="18" height="5" rx="2.5" fill={colors.midGreen} />
    {/* Torso */}
    <Rect x="40" y="38" width="48" height="46" rx="14" fill={colors.midGreen} />
    <Path d="M 52 50 Q 64 46 76 50" stroke={colors.darkGreen} strokeWidth="1.2" fill="none" opacity="0.5" />
    {/* Cuello */}
    <Rect x="58" y="30" width="12" height="12" rx="5" fill={colors.sage} />
    {/* Cabeza */}
    <Circle cx="64" cy="18" r="16" fill={colors.sage} />
    <Ellipse cx="48" cy="18" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="80" cy="18" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="59" cy="15" rx="3.5" ry="4" fill="white" />
    <Ellipse cx="69" cy="15" rx="3.5" ry="4" fill="white" />
    <Circle cx="60" cy="16" r="2" fill={colors.deepForest} />
    <Circle cx="70" cy="16" r="2" fill={colors.deepForest} />
    <Circle cx="60.8" cy="15.2" r="0.7" fill="white" />
    <Circle cx="70.8" cy="15.2" r="0.7" fill="white" />
    <Path d="M 59 22 Q 64 25 69 22" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </G>
);

// Figura con prótesis de brazo
const FiguraConProtesisBrazo = () => (
  <G>
    {/* Brazo izquierdo normal */}
    <Line x1="40" y1="52" x2="14" y2="70" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Ellipse cx="10" cy="74" rx="8" ry="6" fill={colors.mint} />
    {/* Muñón brazo derecho */}
    <Line x1="88" y1="52" x2="102" y2="62" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    {/* Socket hombro */}
    <Ellipse cx="106" cy="65" rx="9" ry="7" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="2" />
    {/* Mano protésica mecánica */}
    <Rect x="110" y="70" width="20" height="8" rx="4" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1.5" />
    {/* Pinza protésica */}
    <Rect x="118" y="76" width="5" height="16" rx="2.5" fill={colors.midGreen} />
    <Rect x="112" y="76" width="4" height="12" rx="2" fill={colors.sage} />
    {/* Torso */}
    <Rect x="40" y="38" width="48" height="46" rx="14" fill={colors.midGreen} />
    <Path d="M 52 50 Q 64 46 76 50" stroke={colors.darkGreen} strokeWidth="1.2" fill="none" opacity="0.5" />
    {/* Piernas */}
    <Rect x="48" y="80" width="14" height="48" rx="7" fill={colors.midGreen} />
    <Rect x="66" y="80" width="14" height="48" rx="7" fill={colors.midGreen} />
    <Ellipse cx="55" cy="130" rx="11" ry="5" fill={colors.sage} />
    <Ellipse cx="73" cy="130" rx="11" ry="5" fill={colors.sage} />
    {/* Cuello + Cabeza */}
    <Rect x="58" y="30" width="12" height="12" rx="5" fill={colors.sage} />
    <Circle cx="64" cy="18" r="16" fill={colors.sage} />
    <Ellipse cx="48" cy="18" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="80" cy="18" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="59" cy="15" rx="3.5" ry="4" fill="white" />
    <Ellipse cx="69" cy="15" rx="3.5" ry="4" fill="white" />
    <Circle cx="60" cy="16" r="2" fill={colors.deepForest} />
    <Circle cx="70" cy="16" r="2" fill={colors.deepForest} />
    <Circle cx="60.8" cy="15.2" r="0.7" fill="white" />
    <Circle cx="70.8" cy="15.2" r="0.7" fill="white" />
    <Path d="M 59 22 Q 64 25 69 22" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </G>
);

const SvgEntrenamientoMunon = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    {/* Persona sentada con muñón */}
    <FiguraSentada />
    {/* Muñón del brazo derecho */}
    <Line x1="80" y1="72" x2="110" y2="85" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Ellipse cx="116" cy="88" rx="10" ry="8" fill={colors.midGreen} />
    {/* Cicatriz/cierre del muñón */}
    <Line x1="112" y1="85" x2="120" y2="91" stroke={colors.darkGreen} strokeWidth="1.5" opacity="0.6" />
    {/* Vendaje compresivo */}
    <Path d="M 108 82 Q 118 80 122 88 Q 118 96 108 94 Q 104 88 108 82" stroke={colors.mint} strokeWidth="2.5" fill="none" opacity="0.8" />
    {/* Ejercicio de contracción */}
    <Flecha x1="116" y1="80" x2="116" y2="70" color={colors.mint} />
    <Flecha x1="116" y1="96" x2="116" y2="106" color={colors.mint} />
    {/* Masaje del muñón */}
    <Ellipse cx="116" cy="88" rx="14" ry="12" fill="none" stroke="#e8c97a" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7" />
  </Svg>
);

const SvgUsoProtesisBrazo = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraConProtesisBrazo />
    <Rect x="8" y="136" width="124" height="4" rx="2" fill={colors.deepForest} />
    {/* Objeto agarrado con prótesis */}
    <Circle cx="124" cy="86" r="8" fill="#e8c97a" opacity="0.9" />
    <Circle cx="122" cy="84" r="3" fill="white" opacity="0.25" />
    <Flecha x1="120" y1="82" x2="126" y2="88" color={colors.mint} dash />
  </Svg>
);

const SvgUsoProtesisPierna = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraConProtesisPierna />
    <Rect x="8" y="136" width="124" height="4" rx="2" fill={colors.deepForest} />
    {/* Brazos equilibrando */}
    <Line x1="40" y1="52" x2="14" y2="60" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Line x1="88" y1="52" x2="114" y2="60" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    {/* Flechas de apoyo y carga */}
    <Flecha x1="71" y1="140" x2="71" y2="128" color={colors.midGreen} />
    <Flecha x1="54" y1="140" x2="54" y2="128" color={colors.sage} />
  </Svg>
);

const SvgCompensacionContralateral = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    {/* Figura con brazo amputado (muñón) */}
    <FiguraSentada />
    {/* Muñón corto brazo der */}
    <Line x1="80" y1="72" x2="98" y2="80" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Ellipse cx="103" cy="83" rx="8" ry="6" fill={colors.midGreen} />
    <Path d="M 97 80 Q 108 78 110 86 Q 106 92 97 90 Q 93 85 97 80" stroke={colors.mint} strokeWidth="2" fill="none" opacity="0.7" />
    {/* Brazo contralateral compensando — escribiendo */}
    <Line x1="34" y1="74" x2="68" y2="96" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Mesa */}
    <Rect x="50" y="96" width="62" height="22" rx="4" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1.5" />
    {/* Hoja */}
    <Line x1="56" y1="104" x2="106" y2="104" stroke={colors.sage} strokeWidth="1.5" opacity="0.6" />
    <Line x1="56" y1="110" x2="90" y2="110" stroke={colors.sage} strokeWidth="1.5" opacity="0.4" />
    {/* Lápiz */}
    <Rect x="64" y="90" width="4" height="18" rx="2" fill="#e8c97a" transform="rotate(15 66 99)" />
    {/* Flecha indicando brazo compensador */}
    <Flecha x1="14" y1="78" x2="28" y2="74" color={colors.mint} />
  </Svg>
);

const SvgDesensibilizacionMunon = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Muñón */}
    <Line x1="80" y1="72" x2="112" y2="86" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Ellipse cx="118" cy="90" rx="11" ry="9" fill={colors.midGreen} />
    {/* Texturas de desensibilización */}
    {/* Tela suave */}
    <Rect x="104" y="80" width="30" height="20" rx="4" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1.5" />
    <Line x1="106" y1="84" x2="130" y2="84" stroke={colors.sage} strokeWidth="1" opacity="0.4" />
    <Line x1="106" y1="88" x2="130" y2="88" stroke={colors.sage} strokeWidth="1" opacity="0.4" />
    <Line x1="106" y1="92" x2="130" y2="92" stroke={colors.sage} strokeWidth="1" opacity="0.4" />
    <Line x1="106" y1="96" x2="130" y2="96" stroke={colors.sage} strokeWidth="1" opacity="0.4" />
    {/* Ondas de estímulo */}
    <Path d="M 118 80 Q 114 74 118 68" stroke={colors.mint} strokeWidth="2" fill="none" opacity="0.7" strokeLinecap="round" />
    <Path d="M 118 80 Q 124 74 118 68" stroke="#e8c97a" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
    {/* Gradiente de tolerancia */}
    <Ellipse cx="118" cy="90" rx="20" ry="16" fill="none" stroke={colors.mint} strokeWidth="1.5" strokeDasharray="4,4" opacity="0.4" />
  </Svg>
);

const SvgAVDConAmputacion = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Muñón del brazo der */}
    <Line x1="80" y1="72" x2="100" y2="82" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Ellipse cx="106" cy="86" rx="9" ry="7" fill={colors.midGreen} />
    {/* Prótesis gancho funcional */}
    <Rect x="104" y="92" width="16" height="6" rx="3" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1.5" />
    <Path d="M 118 92 Q 126 88 126 96 Q 126 102 120 102" stroke={colors.sage} strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* Taza agarrada */}
    <Rect x="120" y="94" width="12" height="14" rx="4" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    <Path d="M 132 98 Q 136 101 132 104" stroke={colors.mint} strokeWidth="2" fill="none" />
    {/* Vapor */}
    <Path d="M 124 92 Q 122 86 124 82" stroke={colors.sage} strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
    <Path d="M 128 92 Q 126 86 128 82" stroke={colors.sage} strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
    {/* Brazo izquierdo estabilizando */}
    <Line x1="34" y1="74" x2="60" y2="96" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Ellipse cx="64" cy="100" rx="10" ry="7" fill={colors.mint} opacity="0.8" />
  </Svg>
);

const SvgRehabilitacionMunon = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Muñón pierna */}
    <Rect x="30" y="100" width="16" height="18" rx="8" fill={colors.midGreen} />
    {/* Vendaje */}
    <Path d="M 28 108 Q 38 104 48 108 Q 38 114 28 110" stroke={colors.mint} strokeWidth="2" fill="none" opacity="0.8" />
    <Path d="M 28 113 Q 38 109 48 113" stroke={colors.mint} strokeWidth="2" fill="none" opacity="0.6" />
    {/* Ejercicio de contracción isométrica */}
    <Ellipse cx="38" cy="108" rx="18" ry="12" fill="none" stroke="#e8c97a" strokeWidth="2" strokeDasharray="4,3" opacity="0.7" />
    {/* Flechas */}
    <Flecha x1="20" y1="108" x2="28" y2="108" color={colors.mint} />
    <Flecha x1="56" y1="108" x2="48" y2="108" color={colors.mint} />
    {/* Pierna derecha normal */}
    <Rect x="62" y="100" width="16" height="28" rx="8" fill={colors.midGreen} />
    <Ellipse cx="70" cy="130" rx="11" ry="5" fill={colors.sage} />
    {/* Texto indicador */}
    <Rect x="66" y="30" width="64" height="26" rx="5" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    <Line x1="72" y1="38" x2="124" y2="38" stroke={colors.sage} strokeWidth="1.5" opacity="0.6" />
    <Line x1="72" y1="46" x2="110" y2="46" stroke={colors.sage} strokeWidth="1.5" opacity="0.4" />
  </Svg>
);

// ─── SVG SILLA DE RUEDAS ──────────────────────────────────────────────────────
const SvgPropulsionSilla = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSillaRuedas />
    {/* Manos en el aro de propulsión */}
    <Circle cx="38" cy="118" r="22" fill="none" stroke={colors.midGreen} strokeWidth="4" />
    <Circle cx="38" cy="118" r="18" fill="none" stroke={colors.sage} strokeWidth="2.5" opacity="0.7" />
    {/* Mano derecha en el aro */}
    <Ellipse cx="56" cy="100" rx="10" ry="7" fill={colors.mint} opacity="0.9" />
    <Flecha x1="52" y1="98" x2="58" y2="102" color={colors.mint} />
    {/* Arco de propulsión */}
    <Path d="M 20 105 Q 14 118 20 132" stroke="#e8c97a" strokeWidth="2" fill="none" strokeDasharray="4,3" opacity="0.7" />
    <Flecha x1="18" y1="128" x2="22" y2="136" color="#e8c97a" />
  </Svg>
);

const SvgTransferenciaSilla = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSillaRuedas />
    {/* Superficie destino (cama/silla) */}
    <Rect x="2" y="92" width="30" height="6" rx="3" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    <Rect x="4" y="96" width="5" height="28" rx="2.5" fill={colors.darkGreen} />
    <Rect x="21" y="96" width="5" height="28" rx="2.5" fill={colors.darkGreen} />
    {/* Flecha de transferencia */}
    <Flecha x1="60" y1="80" x2="30" y2="88" color="#e8c97a" />
    <Flecha x1="45" y1="78" x2="25" y2="86" color={colors.mint} dash />
    {/* Indicador de apoyo */}
    <Circle cx="62" cy="94" r="5" fill={colors.sage} opacity="0.7" />
    <Line x1="58" y1="94" x2="66" y2="94" stroke={colors.mint} strokeWidth="2" />
  </Svg>
);

const SvgAVDdesdeSilla = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSillaRuedas />
    {/* Mesa de trabajo */}
    <Rect x="2" y="62" width="50" height="6" rx="3" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    {/* Objeto en mesa */}
    <Rect x="6" y="46" width="40" height="18" rx="4" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1.5" />
    <Line x1="10" y1="52" x2="42" y2="52" stroke={colors.sage} strokeWidth="1.5" opacity="0.6" />
    <Line x1="10" y1="58" x2="32" y2="58" stroke={colors.sage} strokeWidth="1.5" opacity="0.4" />
    {/* Brazo extendido alcanzando */}
    <Line x1="64" y1="72" x2="46" y2="58" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Ellipse cx="42" cy="54" rx="9" ry="6" fill={colors.mint} opacity="0.9" />
    <Flecha x1="54" y1="60" x2="44" y2="55" color={colors.mint} />
  </Svg>
);

const SvgPosturaSilla = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSillaRuedas />
    {/* Líneas posturales */}
    {/* Línea vertical de plomada */}
    <Line x1="83" y1="10" x2="83" y2="95" stroke="#e8c97a" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.5" />
    {/* Ángulo de cadera */}
    <Path d="M 75 94 Q 70 84 80 78" stroke={colors.mint} strokeWidth="2" fill="none" opacity="0.7" />
    {/* Ángulo de rodilla */}
    <Path d="M 84 116 Q 88 108 96 112" stroke={colors.mint} strokeWidth="2" fill="none" opacity="0.7" />
    {/* Indicadores de posición correcta */}
    <Circle cx="83" cy="62" r="6" fill={colors.sage} opacity="0.6" />
    <Circle cx="83" cy="40" r="6" fill={colors.mint} opacity="0.6" />
    <Path d="M 80 62 L 78 58 L 82 58" fill={colors.sage} opacity="0.8" />
  </Svg>
);

const SvgFortBrazosEnSilla = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSillaRuedas />
    {/* Pesas en manos */}
    <Rect x="54" y="60" width="22" height="10" rx="5" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="2" />
    <Ellipse cx="54" cy="65" rx="6" ry="8" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1.5" />
    <Ellipse cx="76" cy="65" rx="6" ry="8" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1.5" />
    {/* Brazo elevado */}
    <Line x1="68" y1="72" x2="58" y2="52" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Ellipse cx="56" cy="48" rx="8" ry="6" fill={colors.mint} opacity="0.9" />
    {/* Pesa arriba */}
    <Rect x="48" y="36" width="16" height="8" rx="4" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1.5" />
    <Ellipse cx="48" cy="40" rx="5" ry="7" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1.5" />
    <Ellipse cx="64" cy="40" rx="5" ry="7" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1.5" />
    {/* Flecha de movimiento */}
    <Flecha x1="56" y1="68" x2="56" y2="52" color="#e8c97a" />
  </Svg>
);

const SvgPrevencionUlceras = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSillaRuedas />
    {/* Punto de presión en isquion */}
    <Ellipse cx="72" cy="94" rx="14" ry="6" fill="#e8c97a" opacity="0.4" />
    <Ellipse cx="88" cy="94" rx="14" ry="6" fill="#e8c97a" opacity="0.4" />
    {/* Push-up desde silla (alivio de presión) */}
    <Flecha x1="72" y1="96" x2="72" y2="80" color={colors.mint} />
    <Flecha x1="88" y1="96" x2="88" y2="80" color={colors.mint} />
    {/* Brazos presionando en reposabrazo */}
    <Rect x="56" y="90" width="12" height="6" rx="3" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1.5" />
    {/* Timer */}
    <Circle cx="20" cy="36" r="18" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    <Line x1="20" y1="36" x2="20" y2="20" stroke={colors.mint} strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="20" y1="36" x2="30" y2="36" stroke={colors.sage} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="20" cy="36" r="3" fill={colors.sage} />
  </Svg>
);

// ─── SVG POST-ACCIDENTE / TRAUMA ──────────────────────────────────────────────
const SvgMovilizacionTemprana = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraAcostada />
    {/* Brazo en movimiento pasivo */}
    {/* Mano del terapeuta */}
    <Ellipse cx="28" cy="68" rx="10" ry="7" fill={colors.mint} opacity="0.9" />
    <Line x1="26" y1="62" x2="32" y2="74" stroke={colors.mint} strokeWidth="5" strokeLinecap="round" />
    {/* Brazo del paciente elevándose */}
    <Line x1="50" y1="88" x2="36" y2="60" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    {/* Arco ROM */}
    <Path d="M 50 88 Q 38 68 30 56" stroke="#e8c97a" strokeWidth="2" fill="none" strokeDasharray="4,3" opacity="0.7" />
    <Flecha x1="34" y1="60" x2="28" y2="56" color="#e8c97a" />
    {/* Cama hospitalaria */}
    <Rect x="5" y="112" width="130" height="10" rx="4" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    <Rect x="122" y="82" width="12" height="34" rx="4" fill={colors.darkGreen} />
    <Rect x="5" y="82" width="12" height="34" rx="4" fill={colors.darkGreen} />
  </Svg>
);

const SvgFortalecimientoProgresivo = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Gráfico de progresión */}
    <Rect x="68" y="16" width="64" height="60" rx="7" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Ejes */}
    <Line x1="74" y1="68" x2="74" y2="22" stroke={colors.midGreen} strokeWidth="1.5" opacity="0.7" />
    <Line x1="74" y1="68" x2="126" y2="68" stroke={colors.midGreen} strokeWidth="1.5" opacity="0.7" />
    {/* Línea de progresión */}
    <Path d="M 78 66 Q 88 58 98 52 Q 108 46 118 36" stroke={colors.mint} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Puntos de progresión */}
    <Circle cx="78" cy="66" r="3" fill={colors.sage} />
    <Circle cx="90" cy="58" r="3" fill={colors.sage} />
    <Circle cx="102" cy="50" r="3" fill={colors.mint} />
    <Circle cx="118" cy="36" r="4" fill="#e8c97a" />
    {/* Flecha arriba */}
    <Flecha x1="118" y1="44" x2="118" y2="34" color="#e8c97a" />
    {/* Brazo con pesa */}
    <Line x1="80" y1="72" x2="108" y2="90" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Rect x="106" y="88" width="20" height="8" rx="4" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="2" />
    <Ellipse cx="106" cy="92" rx="5" ry="7" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1.5" />
    <Ellipse cx="126" cy="92" rx="5" ry="7" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1.5" />
  </Svg>
);

const SvgReintegracionAVD = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraDePie />
    <Line x1="8" y1="140" x2="118" y2="140" stroke={colors.deepForest} strokeWidth="3" strokeLinecap="round" />
    {/* Cocina representada */}
    <Rect x="90" y="52" width="44" height="46" rx="6" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    {/* Mesada */}
    <Rect x="88" y="92" width="46" height="6" rx="3" fill={colors.deepForest} />
    {/* Objeto sobre mesada */}
    <Circle cx="110" cy="86" r="10" fill={colors.midGreen} />
    <Circle cx="108" cy="84" r="4" fill={colors.darkGreen} opacity="0.4" />
    {/* Vapor */}
    <Path d="M 108 74 Q 106 68 108 62" stroke={colors.mint} strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round" />
    <Path d="M 112 74 Q 110 68 112 62" stroke={colors.mint} strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
    {/* Brazo alcanzando */}
    <Line x1="88" y1="52" x2="104" y2="76" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Ellipse cx="107" cy="80" rx="9" ry="6" fill={colors.mint} opacity="0.9" />
    <Flecha x1="96" y1="70" x2="106" y2="78" color={colors.mint} />
  </Svg>
);

const SvgManejoDolor = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Mapa corporal del dolor */}
    <Rect x="68" y="14" width="64" height="82" rx="7" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Silueta corporal pequeña */}
    <Circle cx="100" cy="30" r="10" fill={colors.midGreen} opacity="0.6" />
    <Rect x="92" y="38" width="16" height="24" rx="6" fill={colors.midGreen} opacity="0.6" />
    <Rect x="84" y="40" width="10" height="18" rx="5" fill={colors.midGreen} opacity="0.5" />
    <Rect x="106" y="40" width="10" height="18" rx="5" fill={colors.midGreen} opacity="0.5" />
    <Rect x="94" y="61" width="7" height="22" rx="3.5" fill={colors.midGreen} opacity="0.5" />
    <Rect x="99" y="61" width="7" height="22" rx="3.5" fill={colors.midGreen} opacity="0.5" />
    {/* Zona de dolor marcada */}
    <Circle cx="100" cy="45" r="7" fill="#e8c97a" opacity="0.6" />
    <Circle cx="100" cy="45" r="4" fill="#c0392b" opacity="0.5" />
    <Circle cx="100" cy="45" r="2" fill="#e74c3c" opacity="0.7" />
    {/* Escala EVA */}
    <Rect x="74" y="86" width="52" height="8" rx="4" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1" />
    <Rect x="74" y="86" width="26" height="8" rx="4" fill="#e8c97a" opacity="0.6" />
    {/* Brazo señalando */}
    <Line x1="35" y1="74" x2="80" y2="46" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
  </Svg>
);

const SvgRecuperacionFuncional = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraDePie />
    <Line x1="8" y1="140" x2="118" y2="140" stroke={colors.deepForest} strokeWidth="3" strokeLinecap="round" />
    {/* Banderas de logro */}
    <Rect x="96" y="8" width="6" height="36" rx="3" fill={colors.darkGreen} />
    <Polygon points="102,8 120,18 102,28" fill={colors.mint} />
    {/* Escalera de recuperación */}
    <Rect x="10" y="110" width="30" height="8" rx="2" fill={colors.deepForest} />
    <Rect x="30" y="90" width="30" height="8" rx="2" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1" />
    <Rect x="50" y="70" width="30" height="8" rx="2" fill={colors.midGreen} />
    <Rect x="70" y="50" width="30" height="8" rx="2" fill={colors.sage} />
    {/* Laterales de escalera */}
    <Rect x="10" y="118" width="5" height="22" rx="2.5" fill={colors.deepForest} />
    <Rect x="30" y="98" width="5" height="20" rx="2.5" fill={colors.darkGreen} />
    <Rect x="50" y="78" width="5" height="20" rx="2.5" fill={colors.midGreen} />
    {/* Flecha de progresión */}
    <Path d="M 14 114 Q 34 94 54 74 Q 74 54 94 42" stroke="#e8c97a" strokeWidth="2" fill="none" strokeDasharray="5,4" opacity="0.7" />
    <Flecha x1="84" y1="46" x2="94" y2="42" color="#e8c97a" />
  </Svg>
);

const SvgEstabilizacionArticular = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Rodilla/articulación destacada */}
    <Circle cx="40" cy="100" r="18" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="2" />
    {/* Huesos */}
    <Rect x="36" y="82" width="8" height="18" rx="4" fill={colors.darkGreen} />
    <Rect x="36" y="100" width="8" height="18" rx="4" fill={colors.darkGreen} />
    {/* Menisco */}
    <Ellipse cx="40" cy="100" rx="8" ry="4" fill={colors.midGreen} opacity="0.6" />
    {/* Ligamentos */}
    <Line x1="34" y1="90" x2="44" y2="110" stroke="#e8c97a" strokeWidth="2" opacity="0.7" />
    <Line x1="44" y1="90" x2="34" y2="110" stroke="#e8c97a" strokeWidth="2" opacity="0.7" />
    {/* Aura de estabilización */}
    <Circle cx="40" cy="100" r="24" fill="none" stroke={colors.mint} strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5" />
    {/* Ejercicio de co-contracción */}
    <Flecha x1="20" y1="100" x2="30" y2="100" color={colors.mint} />
    <Flecha x1="60" y1="100" x2="50" y2="100" color={colors.mint} />
    {/* Brazo del terapeuta */}
    <Line x1="78" y1="74" x2="52" y2="98" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Ellipse cx="48" cy="102" rx="10" ry="7" fill={colors.mint} opacity="0.9" />
  </Svg>
);



// ─── FIGURAS BASE ADICIONALES ─────────────────────────────────────────────────
// Figura pediátrica (niño pequeño)
const FiguraNino = () => (
  <G>
    {/* Piernas */}
    <Rect x="52" y="88" width="11" height="36" rx="5.5" fill={colors.midGreen} />
    <Rect x="67" y="88" width="11" height="36" rx="5.5" fill={colors.midGreen} />
    <Ellipse cx="57" cy="126" rx="9" ry="4" fill={colors.sage} />
    <Ellipse cx="73" cy="126" rx="9" ry="4" fill={colors.sage} />
    {/* Torso pequeño */}
    <Rect x="46" y="50" width="38" height="40" rx="12" fill={colors.midGreen} />
    <Path d="M 54 60 Q 65 56 76 60" stroke={colors.darkGreen} strokeWidth="1.2" fill="none" opacity="0.4" />
    {/* Cuello */}
    <Rect x="61" y="43" width="8" height="10" rx="4" fill={colors.sage} />
    {/* Cabeza grande (proporción niño) */}
    <Circle cx="65" cy="28" r="18" fill={colors.sage} />
    <Ellipse cx="47" cy="28" rx="4.5" ry="5.5" fill={colors.sage} />
    <Ellipse cx="83" cy="28" rx="4.5" ry="5.5" fill={colors.sage} />
    {/* Ojos grandes */}
    <Ellipse cx="59" cy="24" rx="4.5" ry="5" fill="white" />
    <Ellipse cx="71" cy="24" rx="4.5" ry="5" fill="white" />
    <Circle cx="60" cy="25" r="2.8" fill={colors.deepForest} />
    <Circle cx="72" cy="25" r="2.8" fill={colors.deepForest} />
    <Circle cx="61" cy="24" r="1" fill="white" />
    <Circle cx="73" cy="24" r="1" fill="white" />
    {/* Mejillas */}
    <Circle cx="55" cy="31" r="3.5" fill="#e8a0a0" opacity="0.35" />
    <Circle cx="75" cy="31" r="3.5" fill="#e8a0a0" opacity="0.35" />
    {/* Sonrisa */}
    <Path d="M 58 33 Q 65 38 72 33" stroke={colors.darkGreen} strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </G>
);

// Figura neurológica (hemiplejia — un lado más rígido)
const FiguraHemiplejia = () => (
  <G>
    {/* Pierna derecha normal */}
    <Rect x="66" y="80" width="13" height="48" rx="6.5" fill={colors.midGreen} />
    <Ellipse cx="72" cy="130" rx="10" ry="5" fill={colors.sage} />
    {/* Pierna izquierda espástica (más rígida, ligero equino) */}
    <Rect x="50" y="80" width="13" height="44" rx="5" fill={colors.midGreen} opacity="0.8" />
    <Ellipse cx="56" cy="126" rx="8" ry="4" fill={colors.sage} opacity="0.8" />
    {/* Torso */}
    <Rect x="40" y="38" width="48" height="46" rx="14" fill={colors.midGreen} />
    <Path d="M 52 50 Q 64 46 76 50" stroke={colors.darkGreen} strokeWidth="1.2" fill="none" opacity="0.5" />
    {/* Cuello */}
    <Rect x="58" y="30" width="12" height="12" rx="5" fill={colors.sage} />
    {/* Cabeza */}
    <Circle cx="64" cy="18" r="16" fill={colors.sage} />
    <Ellipse cx="48" cy="18" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="80" cy="18" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="59" cy="15" rx="3.5" ry="4" fill="white" />
    <Ellipse cx="69" cy="15" rx="3.5" ry="4" fill="white" />
    <Circle cx="60" cy="16" r="2" fill={colors.deepForest} />
    <Circle cx="70" cy="16" r="2" fill={colors.deepForest} />
    <Circle cx="60.8" cy="15.2" r="0.7" fill="white" />
    <Circle cx="70.8" cy="15.2" r="0.7" fill="white" />
    <Path d="M 59 22 Q 64 25 69 22" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Brazo derecho normal */}
    <Line x1="88" y1="52" x2="112" y2="66" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Ellipse cx="116" cy="70" rx="9" ry="6" fill={colors.mint} />
    {/* Brazo izquierdo espástico (flexionado, contra el cuerpo) */}
    <Line x1="40" y1="52" x2="30" y2="68" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" opacity="0.8" />
    <Line x1="30" y1="68" x2="38" y2="84" stroke={colors.midGreen} strokeWidth="9" strokeLinecap="round" opacity="0.8" />
    <Ellipse cx="40" cy="88" rx="8" ry="6" fill={colors.sage} opacity="0.7" />
  </G>
);

// ─── SVG NEUROLÓGICO ──────────────────────────────────────────────────────────
const SvgReeducacionMotora = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraHemiplejia />
    <Line x1="8" y1="140" x2="128" y2="140" stroke={colors.deepForest} strokeWidth="3" strokeLinecap="round" />
    {/* Guía del terapeuta en brazo espástico */}
    <Ellipse cx="38" cy="86" rx="14" ry="10" fill={colors.mint} opacity="0.5" />
    <Flecha x1="34" y1="90" x2="48" y2="74" color={colors.mint} />
    {/* Indicador espasticidad */}
    <Path d="M 26 66 Q 22 72 28 76" stroke="#e8c97a" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />
    <Path d="M 22 70 Q 18 76 24 80" stroke="#e8c97a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
  </Svg>
);

const SvgControlEspasticidad = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Brazo espástico en flexión */}
    <Line x1="34" y1="74" x2="26" y2="90" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Line x1="26" y1="90" x2="32" y2="108" stroke={colors.midGreen} strokeWidth="10" strokeLinecap="round" />
    <Ellipse cx="34" cy="113" rx="9" ry="6" fill={colors.sage} opacity="0.8" />
    {/* Férula/inhibición */}
    <Rect x="18" y="86" width="20" height="32" rx="6" fill="none" stroke={colors.mint} strokeWidth="2.5" />
    <Line x1="20" y1="92" x2="36" y2="92" stroke={colors.mint} strokeWidth="1.5" opacity="0.6" />
    <Line x1="20" y1="100" x2="36" y2="100" stroke={colors.mint} strokeWidth="1.5" opacity="0.6" />
    <Line x1="20" y1="108" x2="36" y2="108" stroke={colors.mint} strokeWidth="1.5" opacity="0.6" />
    {/* Flecha de elongación */}
    <Flecha x1="32" y1="116" x2="46" y2="106" color="#e8c97a" />
    {/* Ondas de inhibición */}
    <Path d="M 42 90 Q 48 84 54 90 Q 48 96 42 90" fill={colors.mint} opacity="0.4" />
  </Svg>
);

const SvgMarchaParkinson = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    {/* Figura con postura Parkinson (leve flexión anterior) */}
    <Line x1="8" y1="138" x2="128" y2="138" stroke={colors.deepForest} strokeWidth="3" strokeLinecap="round" />
    {/* Líneas de piso (claves visuales) */}
    <Line x1="20" y1="138" x2="20" y2="132" stroke="#e8c97a" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    <Line x1="40" y1="138" x2="40" y2="132" stroke="#e8c97a" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    <Line x1="60" y1="138" x2="60" y2="132" stroke="#e8c97a" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    <Line x1="80" y1="138" x2="80" y2="132" stroke="#e8c97a" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    {/* Persona con postura característica */}
    <Circle cx="64" cy="18" r="15" fill={colors.sage} />
    <Ellipse cx="49" cy="18" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="79" cy="18" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="59" cy="15" rx="3.5" ry="4" fill="white" />
    <Ellipse cx="69" cy="15" rx="3.5" ry="4" fill="white" />
    <Circle cx="60" cy="16" r="2" fill={colors.deepForest} />
    <Circle cx="70" cy="16" r="2" fill={colors.deepForest} />
    <Circle cx="60.8" cy="15.2" r="0.7" fill="white" />
    <Circle cx="70.8" cy="15.2" r="0.7" fill="white" />
    <Path d="M 59 22 Q 64 25 69 22" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Torso ligeramente inclinado (postura Parkinson) */}
    <Rect x="52" y="30" width="26" height="38" rx="11" fill={colors.midGreen} transform="rotate(8 65 49)" />
    {/* Brazos reducida oscilación */}
    <Line x1="52" y1="46" x2="36" y2="56" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Line x1="76" y1="46" x2="90" y2="56" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    {/* Piernas: pasos cortos */}
    <Line x1="57" y1="68" x2="52" y2="106" stroke={colors.midGreen} strokeWidth="12" strokeLinecap="round" />
    <Line x1="71" y1="68" x2="74" y2="106" stroke={colors.mint} strokeWidth="12" strokeLinecap="round" />
    <Ellipse cx="51" cy="112" rx="10" ry="5" fill={colors.sage} />
    <Ellipse cx="75" cy="112" rx="10" ry="5" fill={colors.mint} />
    {/* Flechas de pasos amplios */}
    <Flecha x1="20" y1="128" x2="42" y2="128" color="#e8c97a" />
  </Svg>
);

const SvgReeducacionEquilibrioNeuro = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraDePie />
    <Line x1="8" y1="140" x2="118" y2="140" stroke={colors.deepForest} strokeWidth="3" strokeLinecap="round" />
    {/* Barras paralelas */}
    <Rect x="6" y="60" width="6" height="80" rx="3" fill={colors.darkGreen} />
    <Rect x="120" y="60" width="6" height="80" rx="3" fill={colors.darkGreen} />
    <Rect x="8" y="62" width="116" height="5" rx="2.5" fill={colors.midGreen} />
    {/* Manos en las barras */}
    <Ellipse cx="20" cy="64" rx="8" ry="5" fill={colors.mint} opacity="0.8" />
    <Ellipse cx="112" cy="64" rx="8" ry="5" fill={colors.mint} opacity="0.8" />
    {/* Línea de plomada */}
    <Line x1="64" y1="8" x2="64" y2="140" stroke="#e8c97a" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.4" />
    {/* Ondas de equilibrio neuro */}
    <Circle cx="64" cy="18" r="20" fill="none" stroke={colors.mint} strokeWidth="1.5" opacity="0.25" />
    <Flecha x1="34" y1="64" x2="26" y2="68" color={colors.mint} dash />
    <Flecha x1="94" y1="64" x2="102" y2="68" color={colors.mint} dash />
  </Svg>
);

const SvgActividadesFuncACV = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Tablero de actividades graduadas */}
    <Rect x="62" y="14" width="70" height="82" rx="7" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Nivel 1 — básico */}
    <Rect x="66" y="18" width="62" height="16" rx="4" fill={colors.midGreen} />
    <Circle cx="73" cy="26" r="5" fill={colors.mint} />
    <Line x1="82" y1="26" x2="122" y2="26" stroke={colors.mint} strokeWidth="1.5" opacity="0.7" />
    {/* Nivel 2 */}
    <Rect x="66" y="38" width="62" height="16" rx="4" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1.5" />
    <Circle cx="73" cy="46" r="5" fill={colors.sage} opacity="0.8" />
    <Line x1="82" y1="46" x2="118" y2="46" stroke={colors.sage} strokeWidth="1.5" opacity="0.6" />
    {/* Nivel 3 */}
    <Rect x="66" y="58" width="62" height="16" rx="4" fill={colors.deepForest} stroke="#e8c97a" strokeWidth="1.5" />
    <Circle cx="73" cy="66" r="5" fill="#e8c97a" opacity="0.7" />
    <Line x1="82" y1="66" x2="110" y2="66" stroke="#e8c97a" strokeWidth="1.5" opacity="0.5" />
    {/* Nivel 4 pendiente */}
    <Rect x="66" y="78" width="62" height="14" rx="4" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1" opacity="0.6" />
    {/* Brazo */}
    <Line x1="34" y1="74" x2="76" y2="68" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Flecha x1="70" y1="68" x2="78" y2="62" color={colors.mint} />
  </Svg>
);

const SvgHablaComunicacionNeuro = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Globo de habla con dificultad */}
    <Rect x="68" y="10" width="64" height="38" rx="10" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    <Polygon points="76,48 86,48 80,56" fill={colors.darkGreen} />
    {/* Palabras fragmentadas */}
    <Rect x="74" y="17" width="18" height="7" rx="3" fill={colors.midGreen} />
    <Rect x="96" y="17" width="28" height="7" rx="3" fill={colors.midGreen} opacity="0.5" />
    <Rect x="74" y="28" width="28" height="7" rx="3" fill={colors.sage} opacity="0.7" />
    <Rect x="106" y="28" width="18" height="7" rx="3" fill={colors.midGreen} opacity="0.3" />
    {/* Ondas de voz */}
    <Path d="M 64 32 Q 60 26 64 20" stroke={colors.mint} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
    <Path d="M 60 34 Q 54 26 60 18" stroke={colors.mint} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
    {/* Boca abierta del paciente */}
    <Ellipse cx="56" cy="44" rx="7" ry="4" fill={colors.darkGreen} />
    <Ellipse cx="56" cy="44" rx="4" ry="2.5" fill={colors.deepForest} />
  </Svg>
);

// ─── SVG MANO Y MUÑECA ────────────────────────────────────────────────────────
const SvgMovilidadDedos = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Mano grande detallada */}
    <Ellipse cx="90" cy="92" rx="28" ry="20" fill={colors.midGreen} />
    {/* Dedos */}
    <Rect x="66" y="68" width="8" height="26" rx="4" fill={colors.sage} />
    <Rect x="78" y="62" width="8" height="30" rx="4" fill={colors.sage} />
    <Rect x="90" y="60" width="8" height="30" rx="4" fill={colors.mint} />
    <Rect x="102" y="64" width="8" height="28" rx="4" fill={colors.sage} />
    <Rect x="114" y="72" width="8" height="22" rx="4" fill={colors.sage} />
    {/* Pulgar */}
    <Rect x="56" y="80" width="12" height="8" rx="4" fill={colors.sage} transform="rotate(-30 62 84)" />
    {/* Articulaciones (nódulos) */}
    <Circle cx="70" cy="82" r="3" fill="#e8c97a" opacity="0.6" />
    <Circle cx="82" cy="78" r="3" fill="#e8c97a" opacity="0.6" />
    <Circle cx="94" cy="76" r="3" fill="#e8c97a" opacity="0.7" />
    <Circle cx="106" cy="78" r="3" fill="#e8c97a" opacity="0.6" />
    {/* Flechas apertura/cierre */}
    <Flecha x1="70" y1="66" x2="70" y2="74" color={colors.mint} />
    <Flecha x1="94" y1="58" x2="94" y2="66" color={colors.mint} />
  </Svg>
);

const SvgFerulaTerapeutica = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Brazo */}
    <Line x1="80" y1="72" x2="112" y2="92" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    {/* Muñeca con férula */}
    <Rect x="100" y="88" width="30" height="18" rx="6" fill={colors.deepForest} stroke={colors.mint} strokeWidth="2.5" />
    {/* Detalles de la férula */}
    <Line x1="104" y1="92" x2="126" y2="92" stroke={colors.mint} strokeWidth="1.5" opacity="0.6" />
    <Line x1="104" y1="98" x2="126" y2="98" stroke={colors.mint} strokeWidth="1.5" opacity="0.6" />
    {/* Velcro/fijaciones */}
    <Rect x="100" y="90" width="30" height="4" rx="2" fill={colors.sage} opacity="0.4" />
    <Rect x="100" y="100" width="30" height="4" rx="2" fill={colors.sage} opacity="0.4" />
    {/* Mano en posición funcional */}
    <Ellipse cx="130" cy="100" rx="9" ry="6" fill={colors.sage} />
    {/* Ángulo correcto */}
    <Path d="M 110 88 Q 116 82 122 86" stroke="#e8c97a" strokeWidth="2" fill="none" opacity="0.8" />
    <Flecha x1="118" y1="82" x2="122" y2="86" color="#e8c97a" />
  </Svg>
);

const SvgNervioPeriferico = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Brazo */}
    <Line x1="80" y1="72" x2="118" y2="96" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    {/* Mano */}
    <Ellipse cx="122" cy="102" rx="14" ry="10" fill={colors.midGreen} />
    {/* Nervio mediano trayecto */}
    <Path d="M 80 72 Q 100 84 116 98" stroke={colors.mint} strokeWidth="2.5" fill="none" strokeDasharray="5,3" opacity="0.8" />
    {/* Zona de distribución sensitiva */}
    <Ellipse cx="122" cy="100" rx="10" ry="8" fill={colors.mint} opacity="0.3" />
    <Ellipse cx="128" cy="96" rx="5" ry="6" fill={colors.mint} opacity="0.4" />
    {/* Chispas de parestesia */}
    <Path d="M 126 90 L 130 86 L 128 88 L 132 84" stroke="#e8c97a" strokeWidth="2" fill="none" opacity="0.8" strokeLinecap="round" />
    <Path d="M 134 92 L 136 88 L 134 90 L 138 86" stroke="#e8c97a" strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round" />
    {/* Ejercicio de deslizamiento neural */}
    <Flecha x1="102" y1="78" x2="112" y2="86" color={colors.sage} />
  </Svg>
);

const SvgPinzasGraduadas = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Mesa con objetos graduados */}
    <Rect x="62" y="90" width="70" height="28" rx="5" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    {/* Objetos de menor a mayor dificultad */}
    {/* Moneda pequeña */}
    <Circle cx="74" cy="104" r="5" fill="#e8c97a" opacity="0.9" />
    {/* Botón mediano */}
    <Circle cx="90" cy="104" r="7" fill={colors.sage} opacity="0.8" />
    <Circle cx="90" cy="104" r="3" fill={colors.darkGreen} opacity="0.5" />
    {/* Canica grande */}
    <Circle cx="108" cy="104" r="9" fill={colors.mint} opacity="0.8" />
    <Circle cx="106" cy="102" r="3" fill="white" opacity="0.2" />
    {/* Cilindro */}
    <Rect x="120" y="96" width="8" height="18" rx="4" fill={colors.midGreen} />
    {/* Brazo */}
    <Line x1="35" y1="74" x2="80" y2="96" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Ellipse cx="84" cy="100" rx="8" ry="6" fill={colors.mint} opacity="0.8" />
    <Flecha x1="74" y1="110" x2="90" y2="110" color="#e8c97a" />
  </Svg>
);

const SvgEdemaPostQuirurgico = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Brazo elevado (posición de drenaje) */}
    <Line x1="78" y1="72" x2="88" y2="46" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Line x1="88" y1="46" x2="102" y2="26" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    {/* Mano edematosa (más grande) */}
    <Ellipse cx="108" cy="20" rx="14" ry="10" fill={colors.midGreen} />
    <Ellipse cx="106" cy="18" rx="5" ry="4" fill={colors.midGreen} opacity="0.6" />
    {/* Aura de edema */}
    <Ellipse cx="108" cy="20" rx="20" ry="14" fill="none" stroke="#e8c97a" strokeWidth="2" strokeDasharray="4,3" opacity="0.6" />
    <Ellipse cx="108" cy="20" rx="26" ry="18" fill="none" stroke="#e8c97a" strokeWidth="1.5" strokeDasharray="3,5" opacity="0.35" />
    {/* Flecha de gravedad hacia abajo */}
    <Flecha x1="108" y1="36" x2="108" y2="28" color={colors.mint} />
    <Path d="M 16 28 L 16 10 M 16 10 L 20 16 M 16 10 L 12 16" stroke={colors.mint} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
  </Svg>
);

const SvgDestreza = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Tablero de clavijas */}
    <Rect x="60" y="76" width="72" height="42" rx="7" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Agujeros del tablero 3x3 */}
    <Circle cx="74" cy="90" r="5" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1.5" />
    <Circle cx="90" cy="90" r="5" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1.5" />
    <Circle cx="106" cy="90" r="5" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1.5" />
    <Circle cx="74" cy="106" r="5" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1.5" />
    <Circle cx="90" cy="106" r="5" fill={colors.midGreen} />
    <Circle cx="106" cy="106" r="5" fill={colors.midGreen} />
    <Circle cx="122" cy="90" r="5" fill={colors.midGreen} />
    <Circle cx="122" cy="106" r="5" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1.5" />
    {/* Clavija en mano */}
    <Line x1="35" y1="74" x2="76" y2="88" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Rect x="70" y="78" width="4" height="14" rx="2" fill={colors.mint} />
    <Flecha x1="74" y1="84" x2="74" y2="96" color={colors.mint} />
  </Svg>
);

// ─── SVG SALUD MENTAL ─────────────────────────────────────────────────────────
const SvgActividadOcupacional = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Mesa de trabajo ocupacional */}
    <Rect x="58" y="84" width="74" height="34" rx="5" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    {/* Materiales creativos */}
    {/* Pincel */}
    <Rect x="64" y="72" width="4" height="22" rx="2" fill={colors.midGreen} />
    <Ellipse cx="66" cy="72" rx="4" ry="6" fill={colors.mint} />
    {/* Tela/tejido */}
    <Rect x="72" y="88" width="20" height="22" rx="3" fill={colors.sage} opacity="0.7" />
    <Line x1="76" y1="90" x2="88" y2="90" stroke={colors.darkGreen} strokeWidth="1" opacity="0.4" />
    <Line x1="76" y1="95" x2="88" y2="95" stroke={colors.darkGreen} strokeWidth="1" opacity="0.4" />
    <Line x1="76" y1="100" x2="88" y2="100" stroke={colors.darkGreen} strokeWidth="1" opacity="0.4" />
    <Line x1="76" y1="105" x2="88" y2="105" stroke={colors.darkGreen} strokeWidth="1" opacity="0.4" />
    {/* Recipiente/barro */}
    <Ellipse cx="110" cy="90" rx="14" ry="10" fill={colors.midGreen} opacity="0.7" />
    <Ellipse cx="110" cy="86" rx="10" ry="5" fill={colors.darkGreen} />
    {/* Brazo trabajando */}
    <Line x1="35" y1="74" x2="78" y2="92" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    {/* Aura de flow/concentración */}
    <Circle cx="56" cy="40" r="26" fill="none" stroke={colors.mint} strokeWidth="1.5" opacity="0.2" strokeDasharray="5,5" />
  </Svg>
);

const SvgRutinaDiariaSaludMental = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraDePie />
    <Line x1="8" y1="140" x2="118" y2="140" stroke={colors.deepForest} strokeWidth="3" strokeLinecap="round" />
    {/* Panel de rutina diaria */}
    <Rect x="90" y="12" width="46" height="86" rx="7" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Mañana */}
    <Circle cx="100" cy="28" r="7" fill="#e8c97a" opacity="0.85" />
    <Line x1="100" y1="18" x2="100" y2="14" stroke="#e8c97a" strokeWidth="1.5" opacity="0.5" />
    <Line x1="110" y1="24" x2="113" y2="21" stroke="#e8c97a" strokeWidth="1.5" opacity="0.4" />
    <Line x1="111" y1="28" x2="115" y2="28" stroke="#e8c97a" strokeWidth="1.5" opacity="0.4" />
    <Rect x="112" y="23" width="20" height="7" rx="3" fill={colors.midGreen} />
    {/* Tarde */}
    <Circle cx="100" cy="52" r="7" fill={colors.mint} opacity="0.8" />
    <Circle cx="100" cy="52" r="4" fill={colors.darkGreen} opacity="0.4" />
    <Rect x="112" y="49" width="20" height="7" rx="3" fill={colors.midGreen} opacity="0.8" />
    {/* Noche */}
    <Circle cx="100" cy="76" r="7" fill={colors.midGreen} />
    <Circle cx="103" cy="73" r="5" fill={colors.darkGreen} />
    <Rect x="112" y="73" width="20" height="7" rx="3" fill={colors.midGreen} opacity="0.6" />
    {/* Checkmarks */}
    <Path d="M 97 26 L 99 28 L 103 23" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M 97 50 L 99 52 L 103 47" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
  </Svg>
);

const SvgTecnicasRegulacion = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    {/* Caja de herramientas de regulación */}
    <Rect x="66" y="18" width="66" height="68" rx="8" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Herramienta 1: respiración */}
    <Rect x="70" y="24" width="28" height="24" rx="5" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1.5" />
    <Path d="M 76 32 Q 84 26 92 32 Q 84 38 76 32" fill={colors.mint} opacity="0.7" />
    {/* Herramienta 2: movimiento */}
    <Rect x="102" y="24" width="26" height="24" rx="5" fill={colors.deepForest} stroke={colors.mint} strokeWidth="1.5" />
    <Path d="M 106 42 L 112 28 L 118 42" stroke={colors.sage} strokeWidth="2" fill="none" strokeLinecap="round" />
    <Line x1="107" y1="38" x2="117" y2="38" stroke={colors.sage} strokeWidth="1.5" />
    {/* Herramienta 3: escritura */}
    <Rect x="70" y="52" width="28" height="24" rx="5" fill={colors.deepForest} stroke="#e8c97a" strokeWidth="1.5" />
    <Line x1="74" y1="60" x2="94" y2="60" stroke="#e8c97a" strokeWidth="1.5" opacity="0.7" />
    <Line x1="74" y1="66" x2="88" y2="66" stroke="#e8c97a" strokeWidth="1.5" opacity="0.5" />
    {/* Herramienta 4: contacto social */}
    <Rect x="102" y="52" width="26" height="24" rx="5" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1.5" />
    <Circle cx="109" cy="62" r="5" fill={colors.sage} opacity="0.7" />
    <Circle cx="121" cy="62" r="5" fill={colors.mint} opacity="0.7" />
    <Line x1="114" y1="62" x2="116" y2="62" stroke={colors.midGreen} strokeWidth="2" />
    {/* Brazo */}
    <Line x1="35" y1="74" x2="78" y2="56" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
  </Svg>
);

const SvgHabilidadesSociales = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    {/* Grupo de 3 personas */}
    {/* Persona 1 */}
    <Circle cx="24" cy="24" r="13" fill={colors.sage} />
    <Ellipse cx="19" cy="21" rx="3" ry="3.5" fill="white" />
    <Ellipse cx="27" cy="21" rx="3" ry="3.5" fill="white" />
    <Circle cx="20" cy="22" r="1.8" fill={colors.deepForest} />
    <Circle cx="28" cy="22" r="1.8" fill={colors.deepForest} />
    <Path d="M 19 28 Q 24 31 29 28" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Rect x="14" y="36" width="20" height="48" rx="8" fill={colors.midGreen} />
    <Line x1="14" y1="48" x2="4" y2="58" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Line x1="34" y1="48" x2="44" y2="58" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    {/* Persona 2 */}
    <Circle cx="70" cy="20" r="14" fill="#e8c97a" opacity="0.85" />
    <Ellipse cx="65" cy="17" rx="3" ry="3.5" fill="white" />
    <Ellipse cx="73" cy="17" rx="3" ry="3.5" fill="white" />
    <Circle cx="66" cy="18" r="1.8" fill={colors.deepForest} />
    <Circle cx="74" cy="18" r="1.8" fill={colors.deepForest} />
    <Path d="M 64 24 Q 70 28 76 24" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Rect x="58" y="32" width="24" height="52" rx="8" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1.5" />
    <Line x1="58" y1="44" x2="46" y2="54" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Line x1="82" y1="44" x2="94" y2="54" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    {/* Persona 3 */}
    <Circle cx="116" cy="24" r="13" fill={colors.mint} />
    <Ellipse cx="111" cy="21" rx="3" ry="3.5" fill="white" />
    <Ellipse cx="119" cy="21" rx="3" ry="3.5" fill="white" />
    <Circle cx="112" cy="22" r="1.8" fill={colors.deepForest} />
    <Circle cx="120" cy="22" r="1.8" fill={colors.deepForest} />
    <Path d="M 111 28 Q 116 31 121 28" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Rect x="106" y="36" width="20" height="48" rx="8" fill={colors.midGreen} />
    <Line x1="106" y1="48" x2="96" y2="58" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Line x1="126" y1="48" x2="136" y2="58" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    {/* Conexiones entre personas */}
    <Line x1="37" y1="56" x2="56" y2="52" stroke={colors.mint} strokeWidth="2" strokeDasharray="4,3" opacity="0.7" />
    <Line x1="84" y1="52" x2="104" y2="56" stroke={colors.mint} strokeWidth="2" strokeDasharray="4,3" opacity="0.7" />
  </Svg>
);

// ─── SVG PEDIÁTRICO ───────────────────────────────────────────────────────────
const SvgDesarrolloMotorGrueso = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraNino />
    <Line x1="8" y1="138" x2="128" y2="138" stroke={colors.deepForest} strokeWidth="3" strokeLinecap="round" />
    {/* Obstáculos de gateo/habilidades */}
    <Rect x="10" y="118" width="20" height="20" rx="4" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    <Rect x="40" y="108" width="20" height="30" rx="4" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1.5" />
    <Rect x="70" y="98" width="20" height="40" rx="4" fill={colors.darkGreen} stroke={colors.mint} strokeWidth="1.5" />
    {/* Huellas de pasos */}
    <Ellipse cx="16" cy="136" rx="5" ry="3" fill={colors.sage} opacity="0.5" />
    <Ellipse cx="34" cy="136" rx="5" ry="3" fill={colors.mint} opacity="0.5" />
    <Ellipse cx="58" cy="136" rx="5" ry="3" fill={colors.sage} opacity="0.5" />
    {/* Brazos nino extendidos */}
    <Line x1="46" y1="58" x2="24" y2="66" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Line x1="84" y1="58" x2="108" y2="52" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    {/* Estrella de logro */}
    <Circle cx="112" cy="46" r="10" fill="#e8c97a" opacity="0.9" />
    <Path d="M 112 38 L 113.5 43 L 119 43 L 114.5 46 L 116 51 L 112 48 L 108 51 L 109.5 46 L 105 43 L 110.5 43 Z" fill="white" opacity="0.5" />
  </Svg>
);

const SvgJuegoSensorial = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraNino />
    <Line x1="8" y1="138" x2="128" y2="138" stroke={colors.deepForest} strokeWidth="3" strokeLinecap="round" />
    {/* Caja sensorial */}
    <Rect x="58" y="96" width="74" height="44" rx="6" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Materiales sensoriales */}
    {/* Arena */}
    <Ellipse cx="80" cy="118" rx="18" ry="10" fill={colors.deepForest} />
    <Path d="M 64 118 Q 72 112 80 118 Q 88 124 96 118" stroke="#e8c97a" strokeWidth="1.5" fill="none" opacity="0.6" />
    {/* Pelota con texturas */}
    <Circle cx="116" cy="112" r="12" fill={colors.midGreen} stroke={colors.sage} strokeWidth="1.5" />
    <Circle cx="112" cy="108" r="4" fill={colors.darkGreen} opacity="0.4" />
    <Path d="M 108 118 Q 116 114 124 118" stroke={colors.sage} strokeWidth="1.5" fill="none" opacity="0.6" />
    {/* Brazos del niño metidos en la caja */}
    <Line x1="46" y1="58" x2="76" y2="110" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Line x1="84" y1="58" x2="104" y2="108" stroke={colors.sage} strokeWidth="8" strokeLinecap="round" />
  </Svg>
);

const SvgHabilidadesEscolares = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraNino />
    <Line x1="8" y1="138" x2="128" y2="138" stroke={colors.deepForest} strokeWidth="3" strokeLinecap="round" />
    {/* Mesa pequeña escolar */}
    <Rect x="60" y="96" width="70" height="6" rx="3" fill={colors.darkGreen} />
    <Rect x="62" y="102" width="5" height="28" rx="2.5" fill={colors.darkGreen} />
    <Rect x="122" y="102" width="5" height="28" rx="2.5" fill={colors.darkGreen} />
    {/* Hoja y lápiz */}
    <Rect x="64" y="80" width="42" height="18" rx="3" fill="white" opacity="0.15" stroke={colors.midGreen} strokeWidth="1.5" />
    <Line x1="68" y1="86" x2="102" y2="86" stroke={colors.sage} strokeWidth="1.5" opacity="0.6" />
    <Line x1="68" y1="92" x2="96" y2="92" stroke={colors.sage} strokeWidth="1.5" opacity="0.4" />
    {/* Lápiz en mano */}
    <Line x1="46" y1="60" x2="78" y2="90" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Rect x="74" y="80" width="4" height="16" rx="2" fill="#e8c97a" transform="rotate(15 76 88)" />
    <Polygon points="72,95 76,95 74,100" fill={colors.darkGreen} transform="rotate(15 74 97)" />
    {/* Tijeras en otro lado */}
    <Line x1="84" y1="58" x2="108" y2="80" stroke={colors.sage} strokeWidth="8" strokeLinecap="round" />
    <Circle cx="114" cy="84" r="8" fill={colors.deepForest} stroke={colors.mint} strokeWidth="1.5" />
    <Line x1="110" y1="80" x2="118" y2="88" stroke={colors.mint} strokeWidth="2" />
    <Line x1="118" y1="80" x2="110" y2="88" stroke={colors.mint} strokeWidth="2" />
  </Svg>
);

const SvgJuegoFuncional = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    {/* Dos niños jugando */}
    <Line x1="8" y1="138" x2="128" y2="138" stroke={colors.deepForest} strokeWidth="3" strokeLinecap="round" />
    {/* Niño 1 */}
    <Circle cx="30" cy="24" r="16" fill={colors.sage} />
    <Ellipse cx="17" cy="24" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="25" cy="21" rx="4" ry="4.5" fill="white" />
    <Ellipse cx="33" cy="21" rx="4" ry="4.5" fill="white" />
    <Circle cx="26" cy="22" r="2.5" fill={colors.deepForest} />
    <Circle cx="34" cy="22" r="2.5" fill={colors.deepForest} />
    <Circle cx="26" cy="31" r="3.5" fill="#e8a0a0" opacity="0.35" />
    <Circle cx="34" cy="31" r="3.5" fill="#e8a0a0" opacity="0.35" />
    <Path d="M 25 30 Q 30 35 35 30" stroke={colors.darkGreen} strokeWidth="2" fill="none" strokeLinecap="round" />
    <Rect x="20" y="38" width="20" height="34" rx="8" fill={colors.midGreen} />
    <Line x1="20" y1="50" x2="8" y2="60" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Line x1="40" y1="50" x2="56" y2="58" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Line x1="24" y1="72" x2="18" y2="108" stroke={colors.midGreen} strokeWidth="11" strokeLinecap="round" />
    <Line x1="36" y1="72" x2="42" y2="108" stroke={colors.midGreen} strokeWidth="11" strokeLinecap="round" />
    <Ellipse cx="18" cy="114" rx="10" ry="5" fill={colors.sage} />
    <Ellipse cx="42" cy="114" rx="10" ry="5" fill={colors.sage} />
    {/* Pelota entre ellos */}
    <Circle cx="70" cy="70" r="14" fill={colors.mint} />
    <Circle cx="66" cy="66" r="5" fill="white" opacity="0.2" />
    <Path d="M 62 78 Q 70 74 78 78" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" opacity="0.4" />
    {/* Niño 2 */}
    <Circle cx="110" cy="24" r="16" fill={colors.mint} />
    <Ellipse cx="123" cy="24" rx="4" ry="5" fill={colors.mint} />
    <Ellipse cx="105" cy="21" rx="4" ry="4.5" fill="white" />
    <Ellipse cx="113" cy="21" rx="4" ry="4.5" fill="white" />
    <Circle cx="106" cy="22" r="2.5" fill={colors.deepForest} />
    <Circle cx="114" cy="22" r="2.5" fill={colors.deepForest} />
    <Circle cx="106" cy="31" r="3.5" fill="#e8a0a0" opacity="0.35" />
    <Circle cx="114" cy="31" r="3.5" fill="#e8a0a0" opacity="0.35" />
    <Path d="M 105 30 Q 110 35 115 30" stroke={colors.darkGreen} strokeWidth="2" fill="none" strokeLinecap="round" />
    <Rect x="100" y="38" width="20" height="34" rx="8" fill={colors.darkGreen} stroke={colors.sage} strokeWidth="1.5" />
    <Line x1="100" y1="50" x2="84" y2="58" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Line x1="120" y1="50" x2="132" y2="60" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Line x1="104" y1="72" x2="98" y2="108" stroke={colors.darkGreen} strokeWidth="11" strokeLinecap="round" />
    <Line x1="116" y1="72" x2="122" y2="108" stroke={colors.darkGreen} strokeWidth="11" strokeLinecap="round" />
    <Ellipse cx="98" cy="114" rx="10" ry="5" fill={colors.sage} />
    <Ellipse cx="122" cy="114" rx="10" ry="5" fill={colors.sage} />
    {/* Flechas del juego */}
    <Flecha x1="52" y1="62" x2="58" y2="68" color="#e8c97a" />
    <Flecha x1="88" y1="68" x2="82" y2="62" color="#e8c97a" />
  </Svg>
);

// ─── SVG ONCOLÓGICO ───────────────────────────────────────────────────────────
const SvgFatigaOncologica = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Escala de energía */}
    <Rect x="66" y="14" width="66" height="76" rx="7" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Batería de energía */}
    <Rect x="72" y="20" width="10" height="56" rx="3" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1" />
    <Rect x="72" y="60" width="10" height="16" rx="2" fill="#c0392b" opacity="0.7" />
    <Rect x="72" y="46" width="10" height="14" rx="2" fill="#e8c97a" opacity="0.5" />
    <Rect x="74" y="18" width="6" height="4" rx="2" fill={colors.midGreen} />
    {/* Plan de actividad graduada */}
    <Rect x="88" y="20" width="38" height="12" rx="4" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1" />
    <Line x1="92" y1="26" x2="122" y2="26" stroke={colors.sage} strokeWidth="1.5" opacity="0.6" />
    <Rect x="88" y="36" width="38" height="12" rx="4" fill={colors.deepForest} stroke={colors.mint} strokeWidth="1" />
    <Line x1="92" y1="42" x2="118" y2="42" stroke={colors.mint} strokeWidth="1.5" opacity="0.6" />
    <Rect x="88" y="52" width="38" height="12" rx="4" fill={colors.midGreen} />
    <Line x1="92" y1="58" x2="122" y2="58" stroke="white" strokeWidth="1.5" opacity="0.4" />
    {/* Timer de descanso */}
    <Circle cx="106" cy="76" r="12" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1.5" />
    <Line x1="106" y1="76" x2="106" y2="66" stroke={colors.mint} strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="106" y1="76" x2="114" y2="76" stroke={colors.sage} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="106" cy="76" r="3" fill={colors.sage} />
    {/* Brazo */}
    <Line x1="35" y1="74" x2="78" y2="56" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
  </Svg>
);

const SvgLinfedema = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Brazo afecto con linfedema (más ancho) */}
    <Line x1="80" y1="72" x2="104" y2="88" stroke={colors.sage} strokeWidth="14" strokeLinecap="round" />
    <Line x1="104" y1="88" x2="118" y2="108" stroke={colors.midGreen} strokeWidth="16" strokeLinecap="round" />
    {/* Aura de edema */}
    <Ellipse cx="112" cy="106" rx="20" ry="16" fill="none" stroke="#e8c97a" strokeWidth="2" strokeDasharray="4,3" opacity="0.7" />
    <Ellipse cx="112" cy="106" rx="28" ry="22" fill="none" stroke="#e8c97a" strokeWidth="1.5" strokeDasharray="3,5" opacity="0.4" />
    {/* Mano */}
    <Ellipse cx="120" cy="112" rx="14" ry="10" fill={colors.sage} />
    {/* Vendaje de compresión */}
    <Path d="M 102 86 Q 116 82 122 96 Q 116 104 102 100 Q 96 94 102 86" stroke={colors.mint} strokeWidth="2.5" fill="none" opacity="0.8" />
    <Path d="M 104 94 Q 118 90 124 104" stroke={colors.mint} strokeWidth="2" fill="none" opacity="0.6" />
    {/* Drenaje linfático — dirección */}
    <Flecha x1="122" y1="108" x2="110" y2="94" color={colors.mint} />
    <Flecha x1="108" y1="92" x2="96" y2="80" color={colors.mint} dash />
  </Svg>
);

const SvgConservacionEnergia = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Panel de prioridades */}
    <Rect x="62" y="14" width="70" height="82" rx="7" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Categoría 1: DEBE hacer */}
    <Rect x="66" y="18" width="62" height="20" rx="4" fill={colors.midGreen} />
    <Circle cx="73" cy="28" r="6" fill={colors.mint} />
    <Path d="M 70 28 L 72 30 L 77 25" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Rect x="82" y="22" width="40" height="8" rx="3" fill={colors.darkGreen} opacity="0.4" />
    {/* Categoría 2: PUEDE delegar */}
    <Rect x="66" y="42" width="62" height="20" rx="4" fill={colors.deepForest} stroke="#e8c97a" strokeWidth="1.5" />
    <Circle cx="73" cy="52" r="6" fill="#e8c97a" opacity="0.8" />
    <Line x1="70" y1="52" x2="76" y2="52" stroke={colors.darkGreen} strokeWidth="2" />
    <Rect x="82" y="46" width="36" height="8" rx="3" fill={colors.darkGreen} opacity="0.3" />
    {/* Categoría 3: ELIMINAR */}
    <Rect x="66" y="66" width="62" height="20" rx="4" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1" opacity="0.7" />
    <Circle cx="73" cy="76" r="6" fill={colors.midGreen} opacity="0.5" />
    <Line x1="70" y1="73" x2="76" y2="79" stroke={colors.midGreen} strokeWidth="2" />
    <Line x1="76" y1="73" x2="70" y2="79" stroke={colors.midGreen} strokeWidth="2" />
    {/* Indicador de equilibrio */}
    <Rect x="66" y="90" width="62" height="4" rx="2" fill={colors.deepForest} />
    <Rect x="66" y="90" width="26" height="4" rx="2" fill={colors.mint} opacity="0.7" />
    {/* Brazo */}
    <Line x1="35" y1="74" x2="78" y2="60" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
  </Svg>
);

const SvgPostMastectomia = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Brazo en ejercicio de elevación */}
    <Line x1="80" y1="72" x2="108" y2="50" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Ellipse cx="112" cy="46" rx="9" ry="7" fill={colors.mint} />
    {/* Arco ROM (rango limitado) */}
    <Path d="M 80 72 Q 96 54 108 50" stroke="#e8c97a" strokeWidth="2" fill="none" strokeDasharray="4,3" opacity="0.7" />
    {/* Límite de ROM marcado */}
    <Path d="M 80 72 Q 100 40 118 38" stroke={colors.mint} strokeWidth="1.5" fill="none" strokeDasharray="3,4" opacity="0.4" />
    {/* Indicador de zona */}
    <Ellipse cx="80" cy="68" rx="10" ry="8" fill={colors.sage} opacity="0.25" />
    {/* Flecha de progresión */}
    <Flecha x1="96" y1="58" x2="108" y2="50" color={colors.mint} />
    {/* Cicatriz representada */}
    <Path d="M 52 66 Q 58 62 64 66" stroke={colors.midGreen} strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
  </Svg>
);

// ─── SVG GERIÁTRICO ───────────────────────────────────────────────────────────
// Figura adulto mayor (postura ligeramente encorvada)
const FiguraAdultoMayor = () => (
  <G>
    {/* Bastón */}
    <Line x1="96" y1="62" x2="100" y2="136" stroke={colors.darkGreen} strokeWidth="5" strokeLinecap="round" />
    <Ellipse cx="100" cy="136" rx="8" ry="3" fill={colors.darkGreen} />
    {/* Piernas */}
    <Rect x="50" y="84" width="13" height="52" rx="6.5" fill={colors.midGreen} />
    <Rect x="66" y="84" width="13" height="52" rx="6.5" fill={colors.midGreen} />
    <Ellipse cx="56" cy="138" rx="10" ry="4.5" fill={colors.sage} />
    <Ellipse cx="72" cy="138" rx="10" ry="4.5" fill={colors.sage} />
    {/* Torso encorvado */}
    <Rect x="42" y="42" width="46" height="46" rx="14" fill={colors.midGreen} transform="rotate(5 65 65)" />
    {/* Cuello */}
    <Rect x="60" y="34" width="10" height="12" rx="5" fill={colors.sage} />
    {/* Cabeza */}
    <Circle cx="65" cy="22" r="15" fill={colors.sage} />
    <Ellipse cx="50" cy="22" rx="4" ry="5" fill={colors.sage} />
    <Ellipse cx="80" cy="22" rx="4" ry="5" fill={colors.sage} />
    {/* Ojos con arrugas sutiles */}
    <Ellipse cx="60" cy="19" rx="3.5" ry="4" fill="white" />
    <Ellipse cx="70" cy="19" rx="3.5" ry="4" fill="white" />
    <Circle cx="61" cy="20" r="2" fill={colors.deepForest} />
    <Circle cx="71" cy="20" r="2" fill={colors.deepForest} />
    <Circle cx="61.8" cy="19.2" r="0.7" fill="white" />
    <Circle cx="71.8" cy="19.2" r="0.7" fill="white" />
    {/* Arruga suave */}
    <Path d="M 56 14 Q 60 12 64 14" stroke={colors.sage} strokeWidth="1" fill="none" opacity="0.5" />
    <Path d="M 66 14 Q 70 12 74 14" stroke={colors.sage} strokeWidth="1" fill="none" opacity="0.5" />
    <Path d="M 59 25 Q 65 28 71 25" stroke={colors.darkGreen} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Brazo con bastón */}
    <Line x1="88" y1="54" x2="96" y2="62" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
  </G>
);

const SvgPrevencionCaidas = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraAdultoMayor />
    {/* Línea de suelo */}
    <Line x1="8" y1="142" x2="128" y2="142" stroke={colors.deepForest} strokeWidth="3" strokeLinecap="round" />
    {/* Obstáculo en el suelo */}
    <Rect x="20" y="136" width="24" height="6" rx="3" fill="#c0392b" opacity="0.6" />
    {/* Señal de precaución */}
    <Polygon points="32,126 26,136 38,136" fill="none" stroke="#e8c97a" strokeWidth="2" opacity="0.8" />
    <Line x1="32" y1="129" x2="32" y2="133" stroke="#e8c97a" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <Circle cx="32" cy="135" r="1" fill="#e8c97a" opacity="0.8" />
    {/* Línea de plomada */}
    <Line x1="65" y1="10" x2="65" y2="142" stroke="#e8c97a" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.35" />
    {/* Triángulo de base de sustentación */}
    <Polygon points="46,140 84,140 65,110" fill={colors.mint} opacity="0.15" />
    {/* Brazos en equilibrio */}
    <Line x1="42" y1="56" x2="18" y2="64" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
  </Svg>
);

const SvgMemoriaAnciano = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Panel de memoria */}
    <Rect x="64" y="12" width="68" height="76" rx="7" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Tarjetas de memoria 2x2 */}
    <Rect x="68" y="16" width="28" height="28" rx="5" fill={colors.midGreen} />
    <Circle cx="82" cy="26" r="8" fill={colors.sage} opacity="0.7" />
    <Circle cx="80" cy="24" r="3" fill="white" opacity="0.2" />
    <Rect x="100" y="16" width="28" height="28" rx="5" fill={colors.midGreen} />
    <Circle cx="114" cy="26" r="8" fill={colors.mint} opacity="0.7" />
    <Circle cx="112" cy="24" r="3" fill="white" opacity="0.2" />
    <Rect x="68" y="48" width="28" height="28" rx="5" fill={colors.deepForest} stroke="#e8c97a" strokeWidth="2" />
    <Circle cx="82" cy="62" r="8" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1.5" />
    <Rect x="100" y="48" width="28" height="28" rx="5" fill={colors.deepForest} stroke="#e8c97a" strokeWidth="2" />
    <Circle cx="114" cy="62" r="8" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1.5" />
    {/* Indicador de correspondencia */}
    <Line x1="82" y1="26" x2="114" y2="26" stroke="#e8c97a" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.6" />
    {/* Brazo señalando */}
    <Line x1="35" y1="74" x2="80" y2="60" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
    <Flecha x1="74" y1="62" x2="82" y2="58" color="#e8c97a" />
  </Svg>
);

const SvgFuerzaFuncionalAnciano = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraAdultoMayor />
    <Line x1="8" y1="142" x2="128" y2="142" stroke={colors.deepForest} strokeWidth="3" strokeLinecap="round" />
    {/* Silla para ejercicio sit-stand */}
    <Rect x="14" y="96" width="36" height="6" rx="3" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    <Rect x="16" y="102" width="5" height="30" rx="2.5" fill={colors.darkGreen} />
    <Rect x="42" y="102" width="5" height="30" rx="2.5" fill={colors.darkGreen} />
    <Rect x="12" y="70" width="5" height="30" rx="2.5" fill={colors.darkGreen} />
    {/* Flecha de levantarse */}
    <Flecha x1="30" y1="100" x2="30" y2="84" color="#e8c97a" />
    {/* Indicador de músculo activo */}
    <Ellipse cx="56" cy="116" rx="10" ry="8" fill={colors.sage} opacity="0.3" />
    <Ellipse cx="72" cy="116" rx="10" ry="8" fill={colors.sage} opacity="0.3" />
  </Svg>
);

const SvgAVDanciano = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraAdultoMayor />
    <Line x1="8" y1="142" x2="128" y2="142" stroke={colors.deepForest} strokeWidth="3" strokeLinecap="round" />
    {/* Cocina accesible */}
    <Rect x="8" y="70" width="34" height="6" rx="3" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    {/* Tetera */}
    <Rect x="10" y="54" width="20" height="18" rx="4" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1.5" />
    <Path d="M 30 62 Q 34 60 34 64 Q 34 68 30 66" stroke={colors.midGreen} strokeWidth="2" fill="none" />
    <Ellipse cx="20" cy="54" rx="10" ry="4" fill={colors.midGreen} />
    {/* Vapor */}
    <Path d="M 16 52 Q 14 46 16 42" stroke={colors.mint} strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round" />
    <Path d="M 22 52 Q 20 46 22 42" stroke={colors.mint} strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
    {/* Adaptación: mango grande */}
    <Ellipse cx="10" cy="62" rx="6" ry="8" fill={colors.sage} opacity="0.5" />
    {/* Brazo alcanzando */}
    <Line x1="42" y1="56" x2="28" y2="64" stroke={colors.sage} strokeWidth="10" strokeLinecap="round" />
    <Ellipse cx="25" cy="66" rx="9" ry="6" fill={colors.mint} opacity="0.85" />
  </Svg>
);

// ─── SVG LESIÓN MEDULAR ───────────────────────────────────────────────────────
const SvgTecnicasRespiratoriasLM = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSillaRuedas />
    {/* Manos en abdomen */}
    <Ellipse cx="72" cy="82" rx="14" ry="8" fill={colors.mint} opacity="0.85" />
    <Ellipse cx="88" cy="86" rx="14" ry="8" fill={colors.mint} opacity="0.75" />
    {/* Pulmones representados */}
    <Path d="M 64 56 Q 58 62 62 72 Q 66 78 72 76 Q 76 70 74 62 Z" fill={colors.midGreen} opacity="0.5" />
    <Path d="M 84 56 Q 90 62 88 72 Q 84 78 78 76 Q 74 70 76 62 Z" fill={colors.midGreen} opacity="0.5" />
    {/* Flechas de expansión */}
    <Flecha x1="58" y1="64" x2="52" y2="60" color={colors.mint} dash />
    <Flecha x1="90" y1="64" x2="96" y2="60" color={colors.mint} dash />
    {/* Tos asistida */}
    <Flecha x1="72" y1="88" x2="72" y2="76" color="#e8c97a" />
    <Flecha x1="88" y1="90" x2="88" y2="78" color="#e8c97a" />
  </Svg>
);

const SvgFortTetraplejiaBrazos = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSillaRuedas />
    {/* Banda elástica por encima de la cabeza */}
    <Path d="M 54 42 Q 83 28 112 42" stroke={colors.mint} strokeWidth="4" fill="none" strokeLinecap="round" />
    {/* Manos sosteniendo banda */}
    <Ellipse cx="50" cy="44" rx="9" ry="7" fill={colors.sage} opacity="0.9" />
    <Ellipse cx="116" cy="44" rx="9" ry="7" fill={colors.sage} opacity="0.9" />
    {/* Brazos elevados */}
    <Line x1="62" y1="72" x2="52" y2="44" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    <Line x1="88" y1="72" x2="116" y2="44" stroke={colors.sage} strokeWidth="11" strokeLinecap="round" />
    {/* Flechas de resistencia */}
    <Flecha x1="54" y1="30" x2="60" y2="40" color="#e8c97a" dash />
    <Flecha x1="108" y1="30" x2="102" y2="40" color="#e8c97a" dash />
  </Svg>
);

const SvgManejoVejigaNeurogena = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSentada />
    <Rect x="8" y="116" width="124" height="5" rx="2.5" fill={colors.deepForest} />
    {/* Panel de educación */}
    <Rect x="64" y="12" width="68" height="82" rx="7" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    {/* Icono de reloj / horario */}
    <Circle cx="98" cy="34" r="16" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="2" />
    <Line x1="98" y1="34" x2="98" y2="20" stroke={colors.mint} strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="98" y1="34" x2="108" y2="34" stroke={colors.sage} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="98" cy="34" r="3" fill={colors.sage} />
    {/* Horario de cateterismo */}
    <Rect x="68" y="56" width="60" height="10" rx="3" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1" />
    <Rect x="68" y="56" width="24" height="10" rx="3" fill={colors.sage} opacity="0.6" />
    <Rect x="68" y="70" width="60" height="10" rx="3" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1" />
    <Rect x="68" y="84" width="60" height="6" rx="3" fill={colors.deepForest} stroke={colors.midGreen} strokeWidth="1" />
    <Rect x="68" y="84" width="38" height="6" rx="3" fill={colors.midGreen} opacity="0.6" />
    {/* Brazo señalando */}
    <Line x1="35" y1="74" x2="78" y2="46" stroke={colors.sage} strokeWidth="9" strokeLinecap="round" />
  </Svg>
);

const SvgIndependenciaLM = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSillaRuedas />
    {/* Rampa de acceso */}
    <Path d="M 8 142 L 8 110 L 38 142 Z" fill={colors.deepForest} opacity="0.5" />
    <Line x1="8" y1="110" x2="38" y2="142" stroke={colors.midGreen} strokeWidth="3" strokeLinecap="round" />
    {/* Puerta accesible */}
    <Rect x="2" y="60" width="8" height="52" rx="2" fill={colors.darkGreen} />
    <Circle cx="8" cy="86" r="3" fill={colors.sage} />
    {/* Flecha de avance con independencia */}
    <Flecha x1="40" y1="118" x2="52" y2="118" color={colors.mint} />
    <Path d="M 40 118 Q 30 110 38 102" stroke={colors.mint} strokeWidth="2" fill="none" strokeDasharray="4,3" opacity="0.6" />
    {/* Símbolo de independencia */}
    <Circle cx="120" cy="30" r="14" fill={colors.midGreen} stroke={colors.sage} strokeWidth="2" />
    <Path d="M 114 30 L 117 33 L 126 24" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </Svg>
);

const SvgCuidadoPielLM = () => (
  <Svg width="140" height="150" viewBox="0 0 140 150">
    <FiguraSillaRuedas />
    {/* Espejo de mango largo */}
    <Rect x="8" y="68" width="8" height="48" rx="4" fill={colors.darkGreen} />
    <Rect x="4" y="56" width="16" height="16" rx="4" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="2" />
    <Rect x="6" y="58" width="12" height="12" rx="3" fill={colors.deepForest} stroke={colors.sage} strokeWidth="1" />
    {/* Reflejo en espejo */}
    <Circle cx="12" cy="64" r="3" fill={colors.mint} opacity="0.4" />
    {/* Zona isquiática bajo inspección */}
    <Ellipse cx="80" cy="94" rx="18" ry="6" fill="#e8c97a" opacity="0.3" />
    <Ellipse cx="80" cy="94" rx="10" ry="4" fill="#e8c97a" opacity="0.4" />
    <Flecha x1="24" y1="72" x2="60" y2="90" color={colors.mint} dash />
    {/* Crema hidratante */}
    <Rect x="114" y="72" width="16" height="22" rx="5" fill={colors.darkGreen} stroke={colors.midGreen} strokeWidth="1.5" />
    <Ellipse cx="122" cy="72" rx="8" ry="4" fill={colors.midGreen} />
    <Path d="M 116 80 Q 122 76 128 80" stroke={colors.sage} strokeWidth="1.5" fill="none" opacity="0.6" />
  </Svg>
);

// ─── MAPA DE SVGs ─────────────────────────────────────────────────────────────
const svgMap = {
  // Miembro superior
  'Pinza lateral':                  <SvgPinzaLateral />,
  'Flexión de muñeca':              <SvgFlexionMuneca />,
  'Oposición de pulgares':          <SvgOposicionPulgares />,
  'Alcance funcional':              <SvgAlcanceFuncional />,
  'Fortalecimiento de hombro':      <SvgFortHombro />,
  'Extensión de codo':              <SvgExtensionCodo />,
  'Prensión cilíndrica':            <SvgPrension />,
  'Actividades de escritura':       <SvgEscritura />,
  // Miembro inferior
  'Marcha en el lugar':             <SvgMarchaLugar />,
  'Equilibrio monopodal':           <SvgEquilibrioMonopodal />,
  'Transferencias sit-stand':       <SvgSitStand />,
  'Elevación de talones':           <SvgElevacionTalon />,
  'Flexión de rodilla':             <SvgFlexionRodilla />,
  'Abducción de cadera':            <SvgAbduccionCadera />,
  'Subida de escalón':              <SvgSubidaEscalon />,
  // Cognitivo
  'Secuencia de dígitos':           <SvgSecuenciaDigitos />,
  'Clasificación de objetos':       <SvgClasificacion />,
  'Seguimiento visual':             <SvgSeguimientoVisual />,
  'Memoria procedimental':          <SvgMemoriaProc />,
  'Razonamiento analógico':         <SvgRazonamientoAna />,
  'Atención dividida':              <SvgAtencionDividida />,
  // Sensorial
  'Juego de texturas':              <SvgJuegoTexturas />,
  'Estimulación propioceptiva':     <SvgPropioceptivo />,
  'Estimulación auditiva':          <SvgEstImAudio />,
  'Discriminación olfativa':        <SvgDiscriminacionOlfativa />,
  'Integración vestibular':         <SvgIntegracionVestib />,
  'Estereognosia táctil':           <SvgTactiloEsterog />,
  // Respiratorio
  'Respiración diafragmática':      <SvgRespiracion />,
  'Técnica de soplo':               <SvgSoplo />,
  'Respiración costal':             <SvgRespCostal />,
  'Espirometría incentivada':       <SvgEspirometria />,
  'Tos terapéutica':                <SvgTosTerapeutica />,
  // Columna y espalda
  'Flexión de tronco':              <SvgFlexionTronco />,
  'Extensión de tronco':            <SvgExtTronco />,
  'Rotación de tronco':             <SvgRotTronco />,
  'Cat-Camel':                      <SvgCatCamel />,
  'Bridging':                       <SvgBridging />,
  // Coordinación y equilibrio
  'Marcha en tándem':               <SvgTandem />,
  'Coordinación mano-pie':          <SvgCoordManoPie />,
  'Lanzamiento de pelota':          <SvgLanzamientoPelota />,
  'Reacciones de equilibrio':       <SvgReaccionEquil />,
  // AVD
  'Vestido de miembro superior':    <SvgVestidoSuperior />,
  'Uso de cubiertos':               <SvgUsoCubiertos />,
  'Higiene de manos':               <SvgHigieneManos />,
  'Apertura de envases':            <SvgAbrirBotes />,
  // Visual / Perceptual
  'Agudeza visual funcional':       <SvgAgudeVisual />,
  'Percepción espacial':            <SvgPercepEspacial />,
  'Discriminación figura-fondo':    <SvgDiscFigFondo />,
  // Relajación
  'Mindfulness sensorial':          <SvgMindfulness />,
  'Relajación muscular prog.':      <SvgRelMuscular />,
  'Visualización guiada':           <SvgVisualizacion />,
  // Social / Emocional
  'Juego de roles':                 <SvgJuegoRoles />,
  'Expresión emocional':            <SvgExpresionEmocional />,
  'Habilidades conversacionales':   <SvgHabilidadesConv />,
  // TDAH e hiperactividad
  'Circuito motor funcional':       <SvgCircuitoMotor />,
  'Pausa activa estructurada':      <SvgPausaActiva />,
  'Tabla de enfoque':               <SvgFocusTabla />,
  'Juego de estrategia':            <SvgJuegoEstrategico />,
  'Respira conmigo':                <SvgRespiraConmigo />,
  'Sistema de economía de fichas':  <SvgToken />,
  // Discapacidad intelectual
  'Comunicación por pictogramas':   <SvgPictograma />,
  'Rutina visual diaria':           <SvgRutinaVisual />,
  'Encadenamiento de AVD':          <SvgEncadenamientoAVD />,
  'Manipulación de objetos':        <SvgManipulacionObjetos />,
  'Comunicación funcional':         <SvgComunicacionFuncional />,
  'Habilidades prelaborales':       <SvgHabilidadesPrelab />,
  // Autismo / TEA
  'Rutina estructurada con apoyos': <SvgRutinaEstructurada />,
  'Desensibilización sensorial':    <SvgDesensibilizacion />,
  'Juego paralelo guiado':          <SvgJuegoParalelo />,
  'Regulación sensorial TEA':       <SvgRegulacionSensorial />,
  'Transición entre actividades':   <SvgTransicionActividad />,
  'Interacción guiada':             <SvgInteraccionGuiada />,
  // Prótesis y amputación
  'Entrenamiento de muñón':         <SvgEntrenamientoMunon />,
  'Uso funcional de prótesis MMSS': <SvgUsoProtesisBrazo />,
  'Uso funcional de prótesis MMII': <SvgUsoProtesisPierna />,
  'Compensación contralateral':     <SvgCompensacionContralateral />,
  'Desensibilización de muñón':     <SvgDesensibilizacionMunon />,
  'AVD con amputación':             <SvgAVDConAmputacion />,
  'Rehabilitación de muñón':        <SvgRehabilitacionMunon />,
  // Silla de ruedas
  'Propulsión de silla':            <SvgPropulsionSilla />,
  'Transferencia silla-superficie': <SvgTransferenciaSilla />,
  'AVD desde silla de ruedas':      <SvgAVDdesdeSilla />,
  'Postura en silla de ruedas':     <SvgPosturaSilla />,
  'Fortalecimiento MMSS en silla':  <SvgFortBrazosEnSilla />,
  'Prevención de úlceras por presión': <SvgPrevencionUlceras />,
  // Post-accidente / trauma
  'Movilización temprana':          <SvgMovilizacionTemprana />,
  'Fortalecimiento progresivo':     <SvgFortalecimientoProgresivo />,
  'Reintegración a AVD':            <SvgReintegracionAVD />,
  'Manejo del dolor funcional':     <SvgManejoDolor />,
  'Recuperación funcional':         <SvgRecuperacionFuncional />,
  'Estabilización articular':       <SvgEstabilizacionArticular />,
  // Neurológico
  'Reeducación motora neuro':       <SvgReeducacionMotora />,
  'Control de espasticidad':        <SvgControlEspasticidad />,
  'Marcha Parkinson':               <SvgMarchaParkinson />,
  'Equilibrio neurológico':         <SvgReeducacionEquilibrioNeuro />,
  'Actividades funcionales ACV':    <SvgActividadesFuncACV />,
  'Habla y comunicación neuro':     <SvgHablaComunicacionNeuro />,
  // Mano y muñeca
  'Movilidad de dedos':             <SvgMovilidadDedos />,
  'Férula terapéutica':             <SvgFerulaTerapeutica />,
  'Nervio periférico':              <SvgNervioPeriferico />,
  'Pinzas graduadas':               <SvgPinzasGraduadas />,
  'Edema post-quirúrgico':          <SvgEdemaPostQuirurgico />,
  'Destreza manual':                <SvgDestreza />,
  // Salud mental
  'Actividad ocupacional':          <SvgActividadOcupacional />,
  'Rutina diaria salud mental':     <SvgRutinaDiariaSaludMental />,
  'Técnicas de regulación':         <SvgTecnicasRegulacion />,
  'Habilidades sociales SM':        <SvgHabilidadesSociales />,
  // Pediátrico
  'Desarrollo motor grueso':        <SvgDesarrolloMotorGrueso />,
  'Juego sensorial':                <SvgJuegoSensorial />,
  'Habilidades escolares':          <SvgHabilidadesEscolares />,
  'Juego funcional':                <SvgJuegoFuncional />,
  // Oncológico
  'Fatiga oncológica':              <SvgFatigaOncologica />,
  'Linfedema':                      <SvgLinfedema />,
  'Conservación de energía':        <SvgConservacionEnergia />,
  'Post-mastectomía':               <SvgPostMastectomia />,
  // Geriátrico
  'Prevención de caídas':           <SvgPrevencionCaidas />,
  'Memoria y cognición geriátrica': <SvgMemoriaAnciano />,
  'Fuerza funcional geriátrica':    <SvgFuerzaFuncionalAnciano />,
  'AVD geriátrica':                 <SvgAVDanciano />,
  // Lesión medular
  'Técnicas respiratorias LM':      <SvgTecnicasRespiratoriasLM />,
  'Fortalecimiento MMSS tetraplejia':<SvgFortTetraplejiaBrazos />,
  'Manejo vejiga neurógena':        <SvgManejoVejigaNeurogena />,
  'Independencia LM':               <SvgIndependenciaLM />,
  'Cuidado de piel LM':             <SvgCuidadoPielLM />,
};


// ─── PASOS CLÍNICOS ────────────────────────────────────────────────────────────
const pasosMap = {
  // ── MIEMBRO SUPERIOR ─────────────────────────────────────────────────────────
  'Pinza lateral': {
    posicion: 'Paciente sentado con codo a 90°, antebrazo en pronación sobre superficie.',
    pasos: [
      'Colocar objeto plano (moneda, ficha) entre pulgar y borde lateral del índice.',
      'Aplicar presión sostenida durante 3 segundos sin mover el resto de la mano.',
      'Relajar lentamente sin soltar el objeto de forma abrupta.',
      'Transferir el objeto lateralmente sin usar los demás dedos.',
      'Repetir con distintos tamaños para graduar la dificultad.',
    ],
    precauciones: 'Evitar compensación con muñeca. No generar dolor mayor a 3/10.',
  },
  'Flexión de muñeca': {
    posicion: 'Antebrazo apoyado en superficie, mano fuera del borde en posición neutra.',
    pasos: [
      'Fijar el antebrazo con la mano contraria para evitar sustituciones.',
      'Inspirar y en la espiración flexionar la muñeca llevando la mano hacia arriba.',
      'Mantener la posición final 2 segundos sintiendo el estiramiento.',
      'Regresar a posición neutra de forma controlada (no caer).',
      'Si se usa banda elástica, fijarla bajo el pie y sostener el extremo con la mano.',
    ],
    precauciones: 'Suspender ante parestesias o dolor en túnel carpiano.',
  },
  'Oposición de pulgares': {
    posicion: 'Codos flexionados a 90°, antebrazos en posición neutra frente al cuerpo.',
    pasos: [
      'Iniciar con oposición pulgar-índice de ambas manos simultáneamente.',
      'Progresar en secuencia: pulgar-medio, pulgar-anular, pulgar-meñique.',
      'Mantener cada oposición 2 segundos antes de cambiar.',
      'Realizar la secuencia en orden inverso (meñique a índice).',
      'Aumentar velocidad gradualmente manteniendo precisión del contacto.',
    ],
    precauciones: 'Verificar simetría bilateral. Corregir si hay diferencia de 2+ dedos entre manos.',
  },
  'Alcance funcional': {
    posicion: 'De pie o sentado, hombros relajados, objeto a altura de hombro a 30 cm.',
    pasos: [
      'Elevar el brazo con codo en extensión hasta 90° de flexión de hombro.',
      'Alcanzar el objeto manteniendo la escápula en posición neutra (no elevar hombro).',
      'Tomar el objeto con agarre cilíndrico y sostener 3 segundos.',
      'Colocar el objeto en posición alterna (repisa lateral, superior, contralateral).',
      'Progresar aumentando distancia y variando alturas para estimular distintos planos.',
    ],
    precauciones: 'Evitar inclinación de tronco compensatoria. Proteger hombro doloroso.',
  },
  'Fortalecimiento de hombro': {
    posicion: 'De pie o sentado con espalda recta, banda elástica fijada a punto estable.',
    pasos: [
      'Sujetar la banda con codo a 90° y antebrazo en posición neutra.',
      'Elevar el brazo lateralmente hasta los 90° con control escapular (no elevar clavícula).',
      'Sostener la posición 2 segundos antes de bajar lentamente (fase excéntrica).',
      'Progresar con flexión anterior de hombro: llevar brazo hacia adelante y arriba.',
      'Agregar rotación externa resistida: codo pegado al cuerpo, rotar el antebrazo hacia afuera.',
    ],
    precauciones: 'Suspender si aparece dolor en cara anterior del hombro. Evitar movimientos por encima de 90° en lesiones del manguito rotador.',
  },
  'Extensión de codo': {
    posicion: 'Sentado o de pie, brazo elevado a 90°, codo flexionado al máximo.',
    pasos: [
      'Estabilizar el hombro con la mano contralateral durante todo el movimiento.',
      'Extender el codo de forma controlada hasta conseguir la extensión completa.',
      'Mantener la extensión 2 segundos apretando el tríceps.',
      'Flexionar de vuelta a posición inicial lentamente (4 segundos de bajada).',
      'Progresar usando banda elástica o mancuerna ligera (0.5-1 kg).',
    ],
    precauciones: 'No hiper-extender el codo. Vigilar compensación de muñeca en debilidad distal.',
  },
  'Prensión cilíndrica': {
    posicion: 'Sentado, codo a 90°, antebrazo en pronación o neutro, objeto cilíndrico frente a la mano.',
    pasos: [
      'Posicionar los cuatro dedos alrededor del objeto con el pulgar en oposición.',
      'Aplicar presión progresiva iniciando con 30% de la fuerza máxima.',
      'Mantener la prensión 5 segundos con respiración controlada.',
      'Transportar el objeto a una posición destino sin compensar con muñeca.',
      'Progresar variando el diámetro del objeto (mayor = menor exigencia de fuerza).',
    ],
    precauciones: 'Evitar isquemia digital. Contraindicado en fracturas no consolidadas.',
  },
  'Actividades de escritura': {
    posicion: 'Sentado con mesa a altura del codo, papel fijado con la mano no dominante.',
    pasos: [
      'Adoptar agarre tripodal dinámico: pulgar, índice y medio sobre el lápiz.',
      'Trazar líneas horizontales y verticales manteniendo presión uniforme.',
      'Practicar letras en bucle (l, e, u) que entrenan control motor fino continuo.',
      'Progresar a palabras completas con énfasis en la legibilidad sobre la velocidad.',
      'Trabajar en superficies inclinadas (30°) para reducir tensión de muñeca.',
    ],
    precauciones: 'Adaptar el grosor del lápiz en déficits de fuerza. Evitar sesiones prolongadas en hipersensibilidad táctil.',
  },

  // ── MIEMBRO INFERIOR ─────────────────────────────────────────────────────────
  'Marcha en el lugar': {
    posicion: 'De pie, pies a la anchura de caderas, superficie antideslizante.',
    pasos: [
      'Iniciar elevando rodilla derecha hasta 45° con balanceo de brazo contralateral.',
      'Apoyar el pie con contacto talón-punta y transferir el peso completamente.',
      'Elevar rodilla izquierda replicando el patrón con coordinación recíproca.',
      'Mantener tronco erecto y mirada al frente durante toda la actividad.',
      'Progresar aumentando la altura de elevación de rodillas y la velocidad.',
    ],
    precauciones: 'Tener soporte cercano para equilibrio. Supervisar en pacientes con riesgo de caída.',
  },
  'Equilibrio monopodal': {
    posicion: 'De pie junto a superficie de apoyo, sin calzado o con zapato plano.',
    pasos: [
      'Iniciar con apoyo de un dedo en superficie y elevar pie no dominante.',
      'Sostener el equilibrio 10 segundos antes de cambiar al otro pie.',
      'Progresar retirando el apoyo de dedo: equilibrio libre con ojos abiertos.',
      'Siguiente progresión: equilibrio monopodal con ojos cerrados (10 segundos).',
      'Nivel avanzado: equilibrio monopodal sobre superficie blanda (colchoneta, cojín).',
    ],
    precauciones: 'Siempre cerca de una pared o barra. Contraindicado en articulación inestable sin soporte.',
  },
  'Transferencias sit-stand': {
    posicion: 'Silla firme sin ruedas a altura que permita 90° de rodilla, pies ligeramente atrasados.',
    pasos: [
      'Inclinar el tronco hacia adelante (nariz sobre los pies) antes de iniciar la elevación.',
      'Empujar con ambos pies hacia el suelo de forma simétrica para ponerse de pie.',
      'Alcanzar la bipedestación completa antes de reposicionarse.',
      'Para sentarse: controlar el descenso excéntrico (no caer en la silla).',
      'Progresar elevando la altura de la silla para reducir la demanda articular.',
    ],
    precauciones: 'Evitar en artroplastia de cadera reciente sin autorización del cirujano. Supervisar asimetría de carga.',
  },
  'Elevación de talones': {
    posicion: 'De pie frente a pared o respaldo de silla para apoyo, pies paralelos.',
    pasos: [
      'Elevar ambos talones simultáneamente apoyándose en la punta de los pies.',
      'Sostener la posición de máxima elevación 2-3 segundos con contracción activa del tríceps sural.',
      'Descender lentamente hasta el suelo (fase excéntrica de 3-4 segundos).',
      'Progresar a elevación unipodal para aumentar la carga sobre cada extremidad.',
      'Incorporar la elevación sobre un escalón para aumentar el rango de dorsiflexión.',
    ],
    precauciones: 'Supervisar el apoyo en el dedo gordo, no en los laterales del pie. Cuidado en tendinitis de Aquiles.',
  },
  'Flexión de rodilla': {
    posicion: 'De pie con apoyo anterior (silla o pared), pie no ejercitado bien apoyado.',
    pasos: [
      'Flexionar la rodilla llevando el talón hacia el glúteo de forma lenta y controlada.',
      'Mantener la flexión máxima 2 segundos sin compensar con inclinación de pelvis.',
      'Descender lentamente sin dejar caer el pie (fase excéntrica).',
      'Si se usa tobillera con peso, iniciar con 0.5 kg y progresar según tolerancia.',
      'Variar la posición: flexión en decúbito prono para aislar el trabajo de isquiotibiales.',
    ],
    precauciones: 'No hiperflexionar en prótesis de rodilla. Vigilar compensación lumbar.',
  },
  'Abducción de cadera': {
    posicion: 'De pie con apoyo lateral, pierna de trabajo libre, pie paralelo hacia adelante.',
    pasos: [
      'Mantener la pelvis nivelada y llevar la pierna hacia el lateral sin girar la cadera.',
      'Elevar hasta los 30-45° de abducción manteniendo la rodilla extendida.',
      'Sostener la posición máxima 2 segundos con contracción activa del glúteo medio.',
      'Retornar lentamente a la posición neutra sin dejar caer la pierna.',
      'Progresar añadiendo banda elástica anudada alrededor de los tobillos.',
    ],
    precauciones: 'No compensar con inclinación lateral del tronco. Contraindicado en fractura de cadera no consolidada.',
  },
  'Subida de escalón': {
    posicion: 'Frente a escalón de 15-20 cm, barra de apoyo lateral disponible.',
    pasos: [
      'Colocar todo el pie del miembro más fuerte sobre el escalón (no solo el antepié).',
      'Empujar hacia arriba con el pie del escalón activando glúteo y cuádriceps.',
      'Traer el pie trasero al escalón antes de continuar el descenso.',
      'Bajar con control excéntrico: el pie más fuerte baja primero para mayor seguridad.',
      'Progresar aumentando la altura del escalón o disminuyendo el apoyo de la barra.',
    ],
    precauciones: 'En prótesis de miembro inferior, consultar protocolo específico. Supervisión directa siempre.',
  },

  // ── COGNITIVO ─────────────────────────────────────────────────────────────────
  'Secuencia de dígitos': {
    posicion: 'Paciente sentado frente a mesa, libre de distracciones auditivas y visuales.',
    pasos: [
      'Iniciar con secuencias de 3 dígitos dichos en voz alta (ritmo de 1 dígito por segundo).',
      'El paciente repite la secuencia en el mismo orden inmediatamente después.',
      'Progresar a 4 y 5 dígitos según el rendimiento.',
      'Introducir la variante de dígitos en orden inverso para aumentar la carga de trabajo.',
      'Registrar la span máxima alcanzada en cada sesión para objetivar el progreso.',
    ],
    precauciones: 'No iniciar esta tarea en fase aguda de lesión cerebral. Supervisar fatiga cognitiva.',
  },
  'Clasificación de objetos': {
    posicion: 'Mesa amplia con colección de 20-30 objetos variados y dos cajas de clasificación.',
    pasos: [
      'Establecer el criterio de clasificación con el paciente: color, forma, tamaño o función.',
      'El paciente clasifica los objetos uno a uno explicando verbalmente su decisión.',
      'Cambiar el criterio de clasificación sin previo aviso para evaluar flexibilidad cognitiva.',
      'Introducir objetos que no encajan claramente en ninguna categoría para evaluación de razonamiento.',
      'Progresar a clasificación con criterios múltiples simultáneos (ej. rojo Y grande).',
    ],
    precauciones: 'Ajustar la complejidad al nivel cognitivo basal. No corregir errores en voz alta frente al paciente sin preparación.',
  },
  'Seguimiento visual': {
    posicion: 'Cabeza fija en posición neutra, objeto de seguimiento a 50 cm de distancia.',
    pasos: [
      'Mover el objeto lentamente en dirección horizontal a 30° hacia cada lado.',
      'El paciente sigue el objeto con los ojos sin mover la cabeza.',
      'Progresar al plano vertical: movimiento arriba y abajo en la línea media.',
      'Avanzar a movimiento diagonal y circular para estimular todos los músculos oculomotores.',
      'Introducir seguimiento con fondo en movimiento para mayor dificultad perceptual.',
    ],
    precauciones: 'Suspender ante nistagmo, diplopía o mareo. Contraindicado en lesión aguda de nervios oculomotores.',
  },
  'Memoria procedimental': {
    posicion: 'Mesa con materiales de la tarea procedimental (ej. preparar té, doblar ropa).',
    pasos: [
      'Demostrar la secuencia completa de la tarea sin omitir pasos.',
      'El paciente realiza la tarea con guía verbal del terapeuta paso a paso.',
      'Reducir la guía verbal: solo recordar el siguiente paso si el paciente se detiene.',
      'El paciente realiza la tarea de forma completamente autónoma.',
      'Progresar con una distracción entre el aprendizaje y la ejecución para evaluar la retención.',
    ],
    precauciones: 'Seleccionar tareas con significado funcional real para el paciente. Evitar tareas que supongan riesgo de seguridad en fases iniciales.',
  },
  'Razonamiento analógico': {
    posicion: 'Sentado frente a mesa con tarjetas de analogías impresas o en pantalla.',
    pasos: [
      'Presentar la primera analogía: "Cuchillo es a cortar como lápiz es a ___".',
      'El paciente completa la analogía con justificación verbal de su razonamiento.',
      'Progresar de analogías concretas (objetos-función) a abstractas (conceptos-relaciones).',
      'Introducir analogías con múltiples respuestas posibles para estimular pensamiento divergente.',
      'Registrar el tipo de analogías resueltas correctamente para mapear el perfil cognitivo.',
    ],
    precauciones: 'Adaptar el nivel de abstracción al perfil neuropsicológico. No usar como prueba formal sin estandarización.',
  },
  'Atención dividida': {
    posicion: 'Mesa con materiales para dos tareas simultáneas de distinta modalidad.',
    pasos: [
      'Iniciar con tarea primaria sola (ej. conteo de objetos) para establecer la línea base.',
      'Agregar tarea secundaria de baja demanda (ej. responder "sí/no" a preguntas simples).',
      'Evaluar el rendimiento en ambas tareas comparado con la condición individual.',
      'Progresar aumentando la demanda de la tarea secundaria (cálculo mental).',
      'Incorporar tareas con modalidades sensoriales diferentes para mayor exigencia.',
    ],
    precauciones: 'No iniciar esta tarea en fase aguda de lesión cerebral. Supervisar fatiga cognitiva.',
  },

  // ── SENSORIAL ────────────────────────────────────────────────────────────────
  'Juego de texturas': {
    posicion: 'Paciente sentado, kit de texturas a temperatura ambiente sobre la mesa.',
    pasos: [
      'Iniciar con textura de menor contraste (lisa) durante 30 segundos.',
      'Pedir al paciente que describa verbalmente la sensación percibida.',
      'Progresar de liso → rugoso → espinoso → vibratorio gradualmente.',
      'Realizar identificación táctil con ojos cerrados (estereognosia).',
      'Terminar siempre con textura neutra para cerrar el estímulo sensorial.',
    ],
    precauciones: 'En hipersensibilidad táctil, iniciar con texturas en zona proximal antes de distal.',
  },
  'Estimulación propioceptiva': {
    posicion: 'Antebrazo apoyado, pelota de densidad media en la palma.',
    pasos: [
      'Aplicar compresión suave y sostenida sobre la pelota durante 5 segundos.',
      'Variar la dirección de compresión: palmar, lateral, dorsal.',
      'Realizar compresión axial sobre articulaciones MCF con la pelota.',
      'Agregar rotación suave de la pelota manteniendo la presión.',
      'Finalizar con vibración suave del dorso de la mano para integración.',
    ],
    precauciones: 'Contraindicado en inflamación articular aguda o heridas abiertas.',
  },
  'Estimulación auditiva': {
    posicion: 'Ambiente con niveles de ruido controlados, paciente sentado con ojos cerrados.',
    pasos: [
      'Presentar sonido de baja frecuencia (voz grave) por 10 segundos y pedir descripción.',
      'Alternar con sonido de alta frecuencia; el paciente identifica el cambio.',
      'Introducir sonidos del entorno funcional (agua, timbre, voces) para discriminación.',
      'Solicitar localización espacial del sonido con los ojos cerrados.',
      'Progresar a discriminación de palabras similares en entorno con ruido de fondo.',
    ],
    precauciones: 'No superar los 60 dB en exposición prolongada. Supervisar en hiperacusia o tinnitus.',
  },
  'Discriminación olfativa': {
    posicion: 'Mesa con 4-6 frascos opacos con diferentes aromas naturales.',
    pasos: [
      'Presentar cada frasco a 2-3 cm de la nariz durante 3 segundos.',
      'Pedir al paciente que identifique el aroma (nombrar o señalar en imagen).',
      'Progresar a discriminación de aromas similares (limón vs naranja).',
      'Realizar la tarea con ojos cerrados para eliminar pistas visuales.',
      'Vincular los aromas a recuerdos autobiográficos para estimular la memoria episódica.',
    ],
    precauciones: 'Evitar aromas intensos en migraña activa. Adaptar si hay anosmia documentada.',
  },
  'Integración vestibular': {
    posicion: 'De pie sobre superficie estable, progresar a superficie blanda (colchoneta).',
    pasos: [
      'Iniciar en bipedestación con ojos abiertos y superficie firme (30 segundos).',
      'Repetir con ojos cerrados para eliminar la referencia visual.',
      'Progresar a superficie inestable (cojín de aire) con ojos abiertos.',
      'Combinar superficie inestable + ojos cerrados para máxima demanda vestibular.',
      'Agregar movimientos cefálicos lentos durante el equilibrio para mayor integración.',
    ],
    precauciones: 'Siempre con supervisión directa. Suspender ante náuseas, nistagmo o vértigo intenso.',
  },
  'Estereognosia táctil': {
    posicion: 'Mesa con bolsa opaca que contenga 5-8 objetos comunes de distintas formas.',
    pasos: [
      'Paciente introduce la mano en la bolsa sin mirar y toma un objeto.',
      'Explora el objeto con los dedos durante 15 segundos.',
      'Nombra el objeto antes de sacarlo para confirmar la identificación.',
      'Progresar a objetos con formas más similares entre sí (llave vs botón).',
      'Registrar número de identificaciones correctas como medida de progreso.',
    ],
    precauciones: 'Contraindicado con heridas abiertas en mano. Adaptar en anestesia táctil severa.',
  },

  // ── RESPIRATORIO ─────────────────────────────────────────────────────────────
  'Respiración diafragmática': {
    posicion: 'Decúbito supino o semisentado, una mano en pecho y otra en abdomen.',
    pasos: [
      'Inspirar lentamente por nariz durante 4 segundos; el abdomen debe elevarse.',
      'Verificar que la mano del pecho permanezca inmóvil durante la inspiración.',
      'Hacer pausa de 2 segundos con los pulmones llenos sin cerrar la glotis.',
      'Espirar lentamente por boca durante 6-8 segundos con labios fruncidos.',
      'Repetir el ciclo sin hiperventilar; el ritmo es más lento que la respiración normal.',
    ],
    precauciones: 'Suspender ante mareo o parestesias peribucales (hiperventilación).',
  },
  'Técnica de soplo': {
    posicion: 'Sentado con tronco erecto, pajilla o vela a 15-20 cm de distancia.',
    pasos: [
      'Tomar aire profundamente por nariz con expansión abdominal.',
      'Colocar la pajilla entre labios con cierre hermético.',
      'Soplar de forma sostenida y controlada durante 3-5 segundos.',
      'Variar la resistencia: pajilla fina = mayor resistencia espiratoria.',
      'Progresar a soplar líquidos, inflar globo o mover objetos ligeros.',
    ],
    precauciones: 'Evitar en pacientes con reflujo gastroesofágico severo o disfagia.',
  },
  'Respiración costal': {
    posicion: 'Sentado erguido o en decúbito supino, manos sobre la caja torácica lateral.',
    pasos: [
      'Colocar las palmas en los costados para sentir la expansión lateral del tórax.',
      'Inspirar expandiendo la caja torácica lateralmente (como abriendo un acordeón).',
      'Mantener el abdomen relativamente quieto para aislar la respiración costal.',
      'Espirar dejando que el tórax se contraiga lentamente.',
      'Combinar respiración costal con diafragmática para patrón ventilatorio completo.',
    ],
    precauciones: 'Vigilar en fracturas costales. Adaptar en dolor torácico de cualquier origen.',
  },
  'Espirometría incentivada': {
    posicion: 'Sentado con tronco erecto, espirómetro de flujo lento a nivel de boca.',
    pasos: [
      'Espirar lentamente hasta vaciado pulmonar total antes de comenzar.',
      'Sellar los labios alrededor de la boquilla del espirómetro.',
      'Inspirar lenta y profundamente intentando elevar la bola o el indicador al máximo.',
      'Mantener la inspiración máxima 3-5 segundos para abrir alvéolos colapsados.',
      'Espirar lentamente y repetir tras una pausa de 30 segundos entre cada ciclo.',
    ],
    precauciones: 'Contraindicado en neumotórax activo. Limpiar la boquilla entre sesiones.',
  },
  'Tos terapéutica': {
    posicion: 'Sentado con tronco ligeramente inclinado hacia adelante, manos sobre el abdomen.',
    pasos: [
      'Realizar inspiración profunda diafragmática para aumentar el volumen pulmonar.',
      'Cerrar la glotis y contraer musculatura abdominal e intercostal.',
      'Abrir la glotis de forma explosiva generando un flujo espiratorio máximo.',
      'Repetir hasta que haya movilización de secreciones (escuchar o sentir el resultado).',
      'Terminar con respiración diafragmática lenta para recuperar el ritmo ventilatorio.',
    ],
    precauciones: 'Evitar en hemoptisis activa, cirugía abdominal reciente o presión intracraneal elevada.',
  },

  // ── COLUMNA Y ESPALDA ─────────────────────────────────────────────────────────
  'Flexión de tronco': {
    posicion: 'De pie con pies a la anchura de caderas o sentado al borde de silla.',
    pasos: [
      'Iniciar la flexión desde la cabeza, descendiendo vértebra a vértebra.',
      'Dejar caer los brazos hacia el suelo sin forzar el descenso con impulso.',
      'Mantener la posición de máxima flexión tolerable durante 20-30 segundos.',
      'Volver a posición neutra iniciando desde la región lumbar hacia arriba.',
      'Progresar agregando leve tracción con el peso de los brazos para mayor amplitud.',
    ],
    precauciones: 'Contraindicado en hernia discal aguda o post-quirúrgico lumbar reciente.',
  },
  'Extensión de tronco': {
    posicion: 'De pie con manos en zona lumbar o en cuadrupedia para versión menos exigente.',
    pasos: [
      'En bipedestación: colocar manos en cresta ilíaca para soporte lumbar.',
      'Extender la columna lentamente llevando el esternón hacia arriba y adelante.',
      'Mantener la extensión máxima tolerable 10-15 segundos.',
      'Regresar a neutro de forma controlada sin colapsar hacia la flexión.',
      'En cuadrupedia: levantar la cabeza y el tronco activando extensores sin hiperextender el cuello.',
    ],
    precauciones: 'Evitar hiperextensión lumbar en estenosis de canal. Suspender ante dolor irradiado.',
  },
  'Rotación de tronco': {
    posicion: 'Sentado sin respaldo, pies apoyados en el suelo, brazos cruzados en el pecho.',
    pasos: [
      'Mantener la pelvis fija y girar el tronco hacia la derecha al máximo tolerable.',
      'Sostener la rotación 5-10 segundos sintiendo el estiramiento en los oblicuos.',
      'Volver al centro de forma lenta y controlada.',
      'Repetir hacia el lado izquierdo manteniendo simetría en la amplitud.',
      'Progresar con rotación activa-asistida usando un palo o bastón para mayor amplitud.',
    ],
    precauciones: 'Reducir amplitud en espondilolistesis o inestabilidad vertebral documentada.',
  },
  'Cat-Camel': {
    posicion: 'En cuadrupedia: manos bajo hombros, rodillas bajo caderas, columna en neutro.',
    pasos: [
      'Posición "Gato": espirar arqueando la columna hacia arriba como un gato asustado.',
      'Mantener la flexión máxima 5 segundos con mentón al pecho.',
      'Posición "Camello": inspirar hundiendo la columna, cabeza y cóccix se elevan.',
      'Mantener la extensión 5 segundos sin comprimir el cuello.',
      'Realizar 10-15 ciclos completos con fluidez y respiración coordinada.',
    ],
    precauciones: 'En dolor cervical, limitar el rango de movimiento del cuello. Evitar en osteoporosis severa.',
  },
  'Bridging': {
    posicion: 'Decúbito supino, rodillas flexionadas a 90°, pies planos, brazos al costado.',
    pasos: [
      'Contraer el suelo pélvico y el abdomen antes de iniciar el movimiento.',
      'Presionar los pies contra el suelo y elevar la pelvis vértebra a vértebra.',
      'Alcanzar la extensión completa de caderas formando una línea recta rodilla-cadera-hombro.',
      'Mantener la posición 5-10 segundos con glúteos activos.',
      'Descender lentamente invirtiendo el movimiento: primero tórax, luego lumbar, luego pelvis.',
    ],
    precauciones: 'Evitar en dolor sacroilíaco agudo. No hiperextender la columna lumbar en la cima.',
  },

  // ── COORDINACIÓN Y EQUILIBRIO ─────────────────────────────────────────────────
  'Marcha en tándem': {
    posicion: 'Pasillo libre de 3-4 metros, línea marcada en el suelo, calzado con suela plana.',
    pasos: [
      'Colocar el talón del pie derecho justo frente a los dedos del pie izquierdo.',
      'Mirar hacia adelante (no hacia el suelo) y avanzar colocando talón contra punta.',
      'Mantener los brazos ligeramente separados del cuerpo para balance.',
      'Recorrer 5-10 pasos en la línea y luego regresar en la dirección opuesta.',
      'Progresar realizando la marcha en tándem hacia atrás o en superficie blanda.',
    ],
    precauciones: 'Supervisión directa en todos los pacientes. Tener superficie lateral para apoyo de emergencia.',
  },
  'Coordinación mano-pie': {
    posicion: 'Sentado con buena postura o de pie con apoyo, espacio suficiente delante.',
    pasos: [
      'Tocar la rodilla derecha con la mano izquierda de forma alternada y rítmica.',
      'Progresar a tocar el tobillo: aumenta la demanda de coordinación cruzada.',
      'Introducir patrón ipsilateral (mano derecha-rodilla derecha) para comparar.',
      'Realizar la secuencia con ritmo marcado por metrónomo para objetivar la velocidad.',
      'Progresar combinando patrones cruzados e ipsilaterales en secuencia alternada.',
    ],
    precauciones: 'Adaptar la amplitud del movimiento en pacientes con limitación articular.',
  },
  'Lanzamiento de pelota': {
    posicion: 'De pie o sentado frente a una pared o terapeuta a 1.5-2 metros de distancia.',
    pasos: [
      'Sostener la pelota con ambas manos frente al pecho (pase de pecho).',
      'Lanzar la pelota hacia el objetivo manteniendo el equilibrio del tronco.',
      'Recibir la pelota amortigando con flexión de codos y muñecas.',
      'Progresar a lanzamiento con una sola mano (dominante y no dominante).',
      'Incorporar objetivo específico (aro, caja) para exigir precisión en la coordinación.',
    ],
    precauciones: 'Usar pelota de espuma o goma blanda. Evitar en dolor agudo de hombro.',
  },
  'Reacciones de equilibrio': {
    posicion: 'De pie sobre tabla basculante o cojín de equilibrio, supervisión directa.',
    pasos: [
      'Iniciar en bipedestación sobre tabla con apoyo bilateral y ojos abiertos.',
      'Generar perturbaciones suaves desde los hombros mientras el paciente corrige.',
      'Progresar a perturbaciones desde la pelvis en distintos planos.',
      'Eliminar el apoyo manual una vez que el paciente anticipa los desequilibrios.',
      'Agregar tarea cognitiva simultánea (contar, nombrar animales) para mayor exigencia.',
    ],
    precauciones: 'Siempre con terapeuta a distancia de agarre. No realizar en pacientes con osteoporosis severa.',
  },

  // ── AVD ───────────────────────────────────────────────────────────────────────
  'Vestido de miembro superior': {
    posicion: 'Sentado en silla estable o de pie si la condición lo permite.',
    pasos: [
      'Iniciar por el lado afecto: introducir el miembro superior afecto en la manga primero.',
      'Acomodar la manga tirando de la prenda por el hombro con la mano funcional.',
      'Introducir el miembro superior sano y ajustar el cuello de la prenda.',
      'Para desvestirse: retirar primero el lado sano, luego deslizar por el lado afecto.',
      'Practicar con distintos tipos de apertura: botones, cremallera, velcro.',
    ],
    precauciones: 'Adaptar la ropa (cremalleras grandes, velcro) en déficits de pinza significativos.',
  },
  'Uso de cubiertos': {
    posicion: 'Sentado a mesa con altura adecuada, plato con comida de consistencia controlada.',
    pasos: [
      'Posicionar el tenedor con agarre palmar o tripodal según la capacidad.',
      'Practicar el pinchado de trozos de alimento blando (banana, tofu) en el plato.',
      'Trabajar el uso del cuchillo con prensión cilíndrica para cortar alimentos blandos.',
      'Progresar a coordinación bimanual: tenedor en mano no dominante, cuchillo en dominante.',
      'Incorporar el transporte a la boca manteniendo el equilibrio del tronco.',
    ],
    precauciones: 'Usar cubiertos adaptados (mango engrosado, cubiertos en ángulo) según déficit.',
  },
  'Higiene de manos': {
    posicion: 'Frente al lavabo o con cuenco de agua en la mesa, jabón y toalla accesibles.',
    pasos: [
      'Abrir el grifo (manija o palanca) calibrando la fuerza necesaria.',
      'Aplicar jabón en la palma y frotar dorso, palma, dedos e interdigitales durante 20 seg.',
      'Enjuagar asegurando que no queden restos de jabón entre dedos.',
      'Cerrar el grifo y secar con toalla completando el secado de toda la superficie.',
      'Progresar a la rutina completa de forma autónoma, incluyendo abrir y cerrar el grifo.',
    ],
    precauciones: 'Adaptar con manijas de palanca en déficits de fuerza. Verificar temperatura del agua.',
  },
  'Apertura de envases': {
    posicion: 'Mesa estable con variedad de envases: rosca, palanca, empuje-giro, tapa a presión.',
    pasos: [
      'Estabilizar el envase con la mano no dominante en la superficie antes de manipular.',
      'Practicar con tapa de rosca: aplicar fuerza bimanual opuesta (una abre, otra cierra).',
      'Trabajar tapas de palanca: insertar el pulgar bajo el borde y aplicar palanca hacia arriba.',
      'Progresar a tapas de seguridad infantil: presionar y girar simultáneamente.',
      'Adaptar con abridor de tapas o estabilizador antideslizante si hay déficit de fuerza.',
    ],
    precauciones: 'Evitar envases de vidrio en etapas iniciales. Verificar que no haya riesgo de cortes.',
  },

  // ── VISUAL / PERCEPTUAL ───────────────────────────────────────────────────────
  'Agudeza visual funcional': {
    posicion: 'A 3 metros del optotipo o a 40 cm para lectura cercana, iluminación adecuada.',
    pasos: [
      'Evaluar primero sin corrección y luego con gafas si el paciente las usa.',
      'Solicitar identificación de letras de mayor a menor tamaño en el optotipo.',
      'Para visión cercana: identificar texto de distinto tamaño en cartilla estándar.',
      'Introducir tarea funcional: leer un menú, etiqueta o señal dentro del contexto terapéutico.',
      'Registrar el tamaño mínimo identificado en cada sesión como medida objetiva.',
    ],
    precauciones: 'No sustituye la evaluación oftalmológica formal. Derivar si se detectan alteraciones.',
  },
  'Percepción espacial': {
    posicion: 'Mesa con materiales: figuras, mapas simples, rompecabezas de 12-24 piezas.',
    pasos: [
      'Solicitar la reproducción de un modelo sencillo (3-4 bloques) a partir de la vista.',
      'Pedir que ordene elementos en un espacio según instrucciones (arriba, al lado, detrás).',
      'Usar rompecabezas: el paciente identifica dónde encaja cada pieza antes de intentarlo.',
      'Progresar con laberintos en papel para planificar trayectorias en el espacio bidimensional.',
      'Introducir actividades funcionales: poner la mesa, organizar una bandeja.',
    ],
    precauciones: 'Adaptar la complejidad al estado cognitivo. Supervisar frustración si el déficit es marcado.',
  },
  'Discriminación figura-fondo': {
    posicion: 'Mesa con láminas de discriminación visual y materiales superpuestos.',
    pasos: [
      'Presentar una lámina con 2 figuras superpuestas y pedir que identifique ambas.',
      'Progresar a 3-4 figuras superpuestas con mayor similitud de contorno.',
      'Usar objetos reales: encontrar un objeto específico dentro de un cajón desordenado.',
      'Introducir la tarea en entorno cotidiano: encontrar item en estante lleno.',
      'Registrar el número de errores y el tiempo de respuesta como indicadores de mejora.',
    ],
    precauciones: 'Suspender si hay fatiga visual. Asegurar iluminación óptima en todas las sesiones.',
  },

  // ── RELAJACIÓN ────────────────────────────────────────────────────────────────
  'Mindfulness sensorial': {
    posicion: 'Sentado en silla cómoda o decúbito supino, ambiente tranquilo y semi-oscuro.',
    pasos: [
      'Iniciar con 3 respiraciones profundas diafragmáticas para inducir calma.',
      'Dirigir la atención a 5 cosas que puede ver en el entorno inmediato.',
      'Identificar 4 cosas que puede tocar en ese momento (ropa, silla, suelo).',
      'Nombrar 3 sonidos que percibe en el ambiente sin juzgarlos.',
      'Cerrar con una espiración lenta y la intención de llevar esa calma al resto del día.',
    ],
    precauciones: 'En episodios disociativos activos, priorizar el anclaje sensorial externo sobre la meditación cerrada.',
  },
  'Relajación muscular prog.': {
    posicion: 'Decúbito supino o sentado reclinado, ropa cómoda sin compresión.',
    pasos: [
      'Iniciar por los pies: contraer los músculos del pie durante 5 segundos.',
      'Soltar completamente y notar la diferencia entre tensión y relajación durante 10 seg.',
      'Ascender sistemáticamente: pantorrillas, muslos, abdomen, manos, brazos, hombros, cara.',
      'Terminar con una contracción global de todo el cuerpo simultánea durante 5 segundos.',
      'Soltar todo y mantener la relajación general con respiración lenta durante 2 minutos.',
    ],
    precauciones: 'Evitar la contracción de grupos musculares con lesión activa. Adaptar a la condición ortopédica.',
  },
  'Visualización guiada': {
    posicion: 'Decúbito supino o sentado cómodo, ojos cerrados, guion verbal del terapeuta.',
    pasos: [
      'Inducir relajación con 5 respiraciones profundas antes de comenzar la visualización.',
      'Guiar al paciente a un lugar seguro imaginario con descripción sensorial detallada.',
      'Incorporar estímulos sensoriales: "siente el sol en tu piel", "escucha el agua".',
      'Mantener la visualización durante 5-10 minutos con voz calmada y pausada.',
      'Retornar gradualmente al presente contando hacia atrás del 5 al 1.',
    ],
    precauciones: 'En trauma, evitar escenarios que puedan ser detonadores. Usar siempre un lugar de seguridad elegido por el paciente.',
  },

  // ── SOCIAL / EMOCIONAL ────────────────────────────────────────────────────────
  'Juego de roles': {
    posicion: 'Área amplia o sala de terapia con materiales de rol (ropa, utensilios, objetos).',
    pasos: [
      'Establecer el escenario de rol con el paciente (ej. ir a la farmacia, llamar por teléfono).',
      'Terapeuta modela el rol una vez para referencia del paciente.',
      'Paciente asume el rol mientras el terapeuta toma el rol del interlocutor.',
      'Al finalizar, reflexionar sobre lo que fue fácil y difícil en la interacción.',
      'Progresar a escenarios de mayor complejidad social o emocional.',
    ],
    precauciones: 'Respetar el ritmo del paciente. No forzar la participación en temas emocionalmente sensibles.',
  },
  'Expresión emocional': {
    posicion: 'Mesa con materiales expresivos: láminas de emociones, colores, plastilina.',
    pasos: [
      'Presentar láminas con expresiones faciales básicas: alegría, tristeza, enojo, miedo.',
      'Pedir al paciente que identifique cada emoción y relate una experiencia asociada.',
      'Usar la plastilina o colores para que el paciente represente cómo se siente hoy.',
      'Validar la expresión sin interpretarla; el objetivo es la externalización, no el análisis.',
      'Cierre con una actividad breve de regulación (respiración o estiramiento) para estabilizar.',
    ],
    precauciones: 'Ante expresión de angustia intensa, detener la actividad y pasar a técnica de regulación. No reemplaza la psicoterapia.',
  },
  'Habilidades conversacionales': {
    posicion: 'Dos sillas frente a frente, ambiente cómodo y privado.',
    pasos: [
      'Iniciar con intercambio de información simple: nombre, preferencias, actividades diarias.',
      'Practicar la escucha activa: mantener contacto visual, asentir, no interrumpir.',
      'Trabajar el inicio de conversación: presentarse a alguien nuevo en situación simulada.',
      'Introducir el mantenimiento del tema: el paciente continúa un tópico por 3 turnos.',
      'Progresar al cierre adecuado de una conversación (despedirse, resumir el tema).',
    ],
    precauciones: 'Adaptar la complejidad al nivel comunicativo. Derivar a fonoaudiología si hay afasia o disfemia.',
  },

  // ── TDAH E HIPERACTIVIDAD ─────────────────────────────────────────────────────
  'Circuito motor funcional': {
    posicion: 'Espacio amplio con 3-5 estaciones marcadas en el suelo o con conos.',
    pasos: [
      'Explicar el recorrido completo con demostración visual antes de iniciar.',
      'Estación 1: saltar dentro de aros en el suelo (3-5 saltos con pies juntos).',
      'Estación 2: caminar en línea recta sobre cinta adhesiva durante 2 metros.',
      'Estación 3: lanzar una pelota blanda a un cubo a 1 metro de distancia (3 intentos).',
      'Completar el circuito 2-3 veces con un descanso breve y estructurado entre rondas.',
    ],
    precauciones: 'Limitar el número de estaciones según la capacidad de atención del paciente. Usar señales visuales claras.',
  },
  'Pausa activa estructurada': {
    posicion: 'De pie en espacio despejado, señal visual o timer visible para el paciente.',
    pasos: [
      'Anunciar la pausa con anticipación ("en 2 minutos tendremos una pausa de movimiento").',
      'Realizar 10 saltos de tijera con conteo en voz alta para anclar la atención.',
      'Seguir con 5 sentadillas lentas contando cada una de forma exagerada.',
      'Terminar con 3 respiraciones profundas contando en voz alta la inspiración y la espiración.',
      'Anunciar el regreso a la tarea con una señal clara (campana, luz, palmas).',
    ],
    precauciones: 'Respetar el tiempo acordado de la pausa; no extenderla ni acortarla para mantener la predictibilidad.',
  },
  'Tabla de enfoque': {
    posicion: 'Sentado en mesa con silla adaptada a la altura, tabla de tareas visible.',
    pasos: [
      'Presentar la tabla con 3-5 tareas del día en orden visual claro (pictogramas o palabras cortas).',
      'El paciente marca o tilda cada tarea al completarla usando un marcador o sticker.',
      'Dividir cada tarea en pasos de máximo 2 minutos para mantener el ritmo de logro.',
      'Incorporar una tarea preferida del paciente entre cada 2 tareas no preferidas.',
      'Revisar la tabla al final de la sesión identificando los logros del día.',
    ],
    precauciones: 'Ajustar el número de tareas al nivel atencional del día; menos es más en días de alta activación.',
  },
  'Juego de estrategia': {
    posicion: 'Mesa con juego de mesa simple (dominó, memory, UNO adaptado) para 2 jugadores.',
    pasos: [
      'Explicar las reglas en máximo 3 pasos con apoyo visual si es necesario.',
      'Establecer un turno claro: "primero tú, luego yo" con señal visual.',
      'Modelar la espera del turno verbalizando en voz alta: "ahora espero mi turno".',
      'Reforzar positivamente cada vez que el paciente espera y respeta las reglas.',
      'Al finalizar, nombrar 1 estrategia que el paciente usó bien durante el juego.',
    ],
    precauciones: 'Elegir juegos de duración máxima 15 minutos. Evitar juegos competitivos con alta carga emocional al inicio.',
  },
  'Respira conmigo': {
    posicion: 'Sentado con espalda apoyada, un objeto visual que se expande y contrae (pelota, globo).',
    pasos: [
      'Sostener la pelota con ambas manos frente al pecho.',
      'Inspirar abriendo las manos y expandiendo la pelota lentamente (4 segundos).',
      'Hacer pausa de 2 segundos con la pelota expandida al máximo.',
      'Espirar comprimiendo la pelota lentamente mientras suelta el aire (6 segundos).',
      'Repetir 5-6 ciclos usando la pelota como guía visual y táctil del ritmo respiratorio.',
    ],
    precauciones: 'Si el paciente se frustra con el objeto, hacer la técnica sin él usando solo las manos.',
  },
  'Sistema de economía de fichas': {
    posicion: 'Mesa con tablero de fichas visible, fichas (estrellas, monedas de plástico, stickers).',
    pasos: [
      'Definir con el paciente las conductas meta (ej. terminar una tarea, esperar el turno).',
      'Acordar la recompensa que se obtendrá al acumular X fichas (elegida por el paciente).',
      'Otorgar la ficha inmediatamente después de la conducta deseada con refuerzo verbal.',
      'No retirar fichas ya ganadas; solo agregar, nunca quitar.',
      'Canjear las fichas al final de la sesión o del día según el acuerdo establecido.',
    ],
    precauciones: 'Las recompensas deben ser alcanzables en corto plazo para pacientes con TDAH. No usar comida como refuerzo sin indicación del equipo.',
  },

  // ── DISCAPACIDAD INTELECTUAL ──────────────────────────────────────────────────
  'Comunicación por pictogramas': {
    posicion: 'Mesa con tablero de pictogramas impreso o en tablet, iluminación adecuada.',
    pasos: [
      'Presentar el pictograma de la actividad que se realizará y nombrarlo en voz alta.',
      'Pedir al paciente que señale el pictograma correspondiente a la actividad.',
      'Practicar la secuencia: señalar el pictograma → realizar la acción → señalar "terminé".',
      'Ampliar el vocabulario de pictogramas en pequeños grupos temáticos (comida, cuerpo, acciones).',
      'Promover que el paciente use el tablero para hacer peticiones de forma espontánea.',
    ],
    precauciones: 'Usar pictogramas de alta calidad visual y fondo blanco para reducir la carga perceptual.',
  },
  'Rutina visual diaria': {
    posicion: 'Panel o tablero en lugar visible con la secuencia del día en pictogramas o fotos reales.',
    pasos: [
      'Revisar el panel al inicio de la sesión nombrando cada actividad en orden.',
      'El paciente mueve o tilda cada actividad al completarla.',
      'Ante un cambio en la rutina, modificar el panel con anticipación y explicar el cambio.',
      'Usar relojes visuales o temporizadores para indicar cuánto dura cada actividad.',
      'Cerrar la sesión revisando juntos lo que se hizo y lo que viene mañana.',
    ],
    precauciones: 'Mantener el panel siempre actualizado. Un panel desactualizado genera más ansiedad que no tener ninguno.',
  },
  'Encadenamiento de AVD': {
    posicion: 'Entorno real de la AVD (baño, cocina) con todos los materiales reales disponibles.',
    pasos: [
      'Descomponer la AVD en pasos de máximo 10 segundos cada uno.',
      'Encadenamiento hacia atrás: el terapeuta realiza todos los pasos y el paciente solo el último.',
      'Ir añadiendo pasos desde el final hacia el inicio en sesiones sucesivas.',
      'Una vez dominada la cadena, practicar el encadenamiento completo de forma autónoma.',
      'Generalizar la habilidad en entornos diferentes (casa del paciente, hogar sustituto).',
    ],
    precauciones: 'No avanzar al siguiente paso antes de que el actual esté consolidado. Usar siempre materiales reales, no simulados.',
  },
  'Manipulación de objetos': {
    posicion: 'Mesa con objetos variados de distintas formas, tamaños y texturas.',
    pasos: [
      'Presentar los objetos de uno en uno, nombrando cada uno mientras el paciente lo toca.',
      'Pedir que clasifique los objetos por tamaño o color siguiendo un modelo visual.',
      'Introducir la actividad de encajar formas en tablero de formas (círculo, cuadrado, triángulo).',
      'Progresar a actividades de ensamblaje simple: apilar, encadenar, ensartar piezas.',
      'Integrar en tarea funcional: clasificar cubiertos, doblar servilletas, organizar material.',
    ],
    precauciones: 'Verificar que ningún objeto sea un riesgo de atragantamiento. Adaptar según el nivel de comprensión y motricidad.',
  },
  'Comunicación funcional': {
    posicion: 'Entorno natural de comunicación: sala de terapia, comedor o entorno familiar.',
    pasos: [
      'Identificar las necesidades comunicativas más frecuentes del paciente (pedir agua, ir al baño).',
      'Enseñar una estrategia de comunicación funcional para cada necesidad (señal, gesto, pictograma).',
      'Crear oportunidades naturales para que el paciente use la comunicación (no ofrecer sin que pida).',
      'Reforzar cualquier intento comunicativo, aunque sea parcial o aproximado.',
      'Ampliar el repertorio progresivamente a nuevas situaciones y entornos.',
    ],
    precauciones: 'Nunca ignorar una comunicación funcional, aunque sea en forma de conducta problemática. Siempre responder la intención comunicativa.',
  },
  'Habilidades prelaborales': {
    posicion: 'Área de trabajo con mesa estable, materiales de tarea simple y timer visible.',
    pasos: [
      'Presentar la tarea con demostración paso a paso usando lenguaje simple.',
      'El paciente realiza la tarea con supervisión cercana durante 5-10 minutos.',
      'Reforzar positivamente la permanencia en la tarea y la atención sostenida.',
      'Introducir gradualmente la tolerancia a la frustración ante errores.',
      'Progresar aumentando el tiempo de tarea (hasta 20-30 minutos) y reduciendo los refuerzos.',
    ],
    precauciones: 'Elegir tareas con nivel justo de dificultad (ni demasiado fáciles ni imposibles). Registrar tiempo de tolerancia a la tarea.',
  },

  // ── AUTISMO / TEA ─────────────────────────────────────────────────────────────
  'Rutina estructurada con apoyos': {
    posicion: 'Sala de terapia con tablero primera-después visible, timer a la vista del paciente.',
    pasos: [
      'Mostrar el tablero primera-después al inicio de cada actividad ("primero hacemos esto, después aquello").',
      'Iniciar la actividad solo cuando el paciente haya reconocido el tablero (señalar o verbalizar).',
      'Usar el timer para marcar el inicio y el fin de cada actividad.',
      'Al sonar el timer, mostrar que se tilda o retira la actividad completada del tablero.',
      'Celebrar de forma calma (no sobreestimulada) el cumplimiento de la rutina.',
    ],
    precauciones: 'Mantener la consistencia de los apoyos en todos los entornos del paciente (familia, escuela).',
  },
  'Desensibilización sensorial': {
    posicion: 'Sala tranquila con jerarquía de estímulos preparada de menor a mayor intensidad.',
    pasos: [
      'Identificar el estímulo sensorial problemático y crear una jerarquía de exposición gradual.',
      'Comenzar con el nivel de menor intensidad: mostrar el estímulo sin que el paciente lo toque.',
      'Avanzar solo cuando el paciente esté regulado (sin señales de estrés o conductas de evitación).',
      'Permitir al paciente controlar la duración y la distancia del estímulo en cada paso.',
      'Registrar el nivel de tolerancia alcanzado en cada sesión para documentar el progreso.',
    ],
    precauciones: 'Las estrategias sensoriales deben individualizarse mediante evaluación del perfil sensorial (SPM o SP2).',
  },
  'Juego paralelo guiado': {
    posicion: 'Sala de terapia con dos sets idénticos de materiales de juego, uno para cada persona.',
    pasos: [
      'El terapeuta se sienta cerca del paciente y comienza a jugar con los mismos materiales.',
      'Imitar la acción del paciente con los propios materiales sin comentarlo explícitamente.',
      'Agregar un comentario simple sobre lo que el paciente hace: "pusiste el azul ahí".',
      'Si el paciente observa al terapeuta, mantener la actividad sin hacer demandas.',
      'Progresar al intercambio de un objeto cuando el paciente inicia el contacto.',
    ],
    precauciones: 'Nunca interrumpir el juego espontáneo del paciente para redirigir. Seguir su iniciativa.',
  },
  'Regulación sensorial TEA': {
    posicion: 'Rincón de regulación equipado: cojines, elementos de presión, luces tenues, música suave.',
    pasos: [
      'Identificar señales de activación excesiva o baja del paciente antes de actuar.',
      'Ofrecer estrategias de alta presión para hiper-activación: chaleco de peso, abrazo de presión.',
      'Ofrecer estimulación vestibular para hipo-activación: hamaca, balanceo en silla.',
      'Enseñar al paciente a identificar y comunicar su estado usando una escala de 1 a 5 visual.',
      'Registrar qué estrategias son efectivas para cada estado y compartirlo con la familia.',
    ],
    precauciones: 'Las estrategias sensoriales deben individualizarse mediante evaluación del perfil sensorial (SPM o SP2).',
  },
  'Transición entre actividades': {
    posicion: 'Sala de terapia con timer visual (reloj de arena o digital) disponible.',
    pasos: [
      'Presentar el timer al inicio de la actividad: "cuando termine el tiempo, cambiamos".',
      'A los 2 minutos del fin, dar aviso verbal + mostrar el tiempo restante en el timer.',
      'Usar una secuencia de transición constante: guardar → mirar el tablero → ir a la siguiente.',
      'Reforzar la transición lograda con calma: "lo hiciste muy bien, ahora vamos a...".',
      'Si hay dificultad, usar un objeto de transición (un juguete favorito que "viaje" entre actividades).',
    ],
    precauciones: 'No retirar el timer por sorpresa. La predictibilidad del tiempo es el factor clave de éxito.',
  },
  'Interacción guiada': {
    posicion: 'Actividad triádica: paciente + terapeuta + par; materiales que inviten a la interacción.',
    pasos: [
      'El terapeuta actúa como facilitador entre el paciente y el par, no como participante central.',
      'Crear oportunidades donde el paciente necesite al par para completar la actividad.',
      'Comentar la acción del par en voz alta: "mira, María está construyendo una torre".',
      'Esperar e impulsar el inicio de contacto del paciente sin forzarlo.',
      'Reforzar cualquier acción social espontánea aunque sea mínima (mirada, señal, sonido).',
    ],
    precauciones: 'El par debe ser preparado previamente. Evitar pares con perfiles que generen sobrecarga sensorial.',
  },

  // ── PRÓTESIS Y AMPUTACIÓN ─────────────────────────────────────────────────────
  'Entrenamiento de muñón': {
    posicion: 'Sentado en silla firme, muñón descubierto y accesible para la terapia.',
    pasos: [
      'Aplicar masaje circular suave con aceite neutro en toda la superficie del muñón (5 min).',
      'Realizar ejercicios de contracción isométrica: apretar el muñón contra una almohada firmemente.',
      'Practicar movilización activa del muñón en todos los planos de movimiento disponibles.',
      'Introducir taping o vendaje compresivo para modelar y madurar el muñón.',
      'Desensibilización progresiva: tocar el muñón con diferentes texturas de menor a mayor intensidad.',
    ],
    precauciones: 'Suspender ante heridas abiertas o signos de infección. No aplicar presión sobre prominencias óseas.',
  },
  'Uso funcional de prótesis MMSS': {
    posicion: 'Sentado frente a mesa, prótesis de miembro superior colocada y ajustada.',
    pasos: [
      'Verificar el ajuste del socket: no debe haber pistoning ni zonas de presión excesiva.',
      'Practicar la apertura y cierre voluntarios del terminal (gancho o mano mioeléctrica).',
      'Realizar actividades de prensión básica: tomar una lata, un vaso, un bolígrafo.',
      'Progresar a bimanualidad: estabilizar con la prótesis mientras la mano sana trabaja.',
      'Incorporar la prótesis en actividades de la vida diaria: vestido, preparación de alimentos.',
    ],
    precauciones: 'Revisar la piel del muñón después de cada sesión. Tiempo máximo inicial: 2 horas con prótesis.',
  },
  'Uso funcional de prótesis MMII': {
    posicion: 'De pie con prótesis de miembro inferior, superficie antideslizante, barras de apoyo.',
    pasos: [
      'Verificar la alineación protésica: el pie debe quedar apuntando al frente en la fase de apoyo.',
      'Practicar carga de peso simétrica entre miembro residual y contralateral.',
      'Iniciar marcha entre barras paralelas con énfasis en la fase de apoyo y despegue.',
      'Progresar a marcha con andador, luego bastón, luego sin ayuda técnica.',
      'Trabajar superficies variadas: alfombra, suelo irregular, rampas y escalones.',
    ],
    precauciones: 'Control dermatológico del muñón diario. Suspender si hay dolor en el socket o signos de abrasión.',
  },
  'Compensación contralateral': {
    posicion: 'Sentado o de pie, miembro dominante amputado, miembro contralateral en entrenamiento.',
    pasos: [
      'Evaluar la destreza actual del miembro no dominante con pruebas funcionales simples.',
      'Iniciar ejercicios de motricidad fina: pinza, escritura, manipulación de objetos pequeños.',
      'Practicar actividades de la vida diaria usando exclusivamente el miembro contralateral.',
      'Entrenar agarre bimanual usando el muñón como estabilizador del objeto.',
      'Progresar a tareas complejas: uso del teclado, preparación de alimentos, higiene personal.',
    ],
    precauciones: 'Vigilar la sobrecarga del miembro contralateral. Equilibrar el entrenamiento con periodos de descanso.',
  },
  'Desensibilización de muñón': {
    posicion: 'Sentado, muñón expuesto, kit de materiales de desensibilización en mesa.',
    pasos: [
      'Comenzar con estímulos de baja intensidad táctil: algodón, tela suave, masaje superficial.',
      'Avanzar progresivamente: tela rugosa, espátula de madera, vibración de baja intensidad.',
      'Practicar inmersión del muñón en materiales de texturas variadas: arroz, maíz, arena fina.',
      'Introducir estímulos de mayor intensidad: cepillo de cerdas suaves, vibración media.',
      'Registrar el nivel de tolerancia alcanzado en escala 0-10 en cada sesión.',
    ],
    precauciones: 'Nunca sobrepasar el umbral de dolor del paciente. Progresar solo cuando la tolerancia al nivel actual sea de 0-2/10.',
  },
  'AVD con amputación': {
    posicion: 'Entorno funcional con materiales reales de las actividades de la vida diaria.',
    pasos: [
      'Identificar las AVD prioritarias para el paciente y su grado de independencia actual.',
      'Entrenar técnicas de una mano para las actividades en que no se usa prótesis (ej. higiene matutina).',
      'Practicar uso de dispositivos adaptativos: tabla de cocina con fijadores, abridor de tarros unimano.',
      'Integrar la prótesis en la AVD de mayor demanda funcional identificada por el paciente.',
      'Evaluar la independencia alcanzada con la escala FIM o DASH según el segmento amputado.',
    ],
    precauciones: 'Priorizar la seguridad antes que la velocidad. El objetivo es la independencia, no la normalización del movimiento.',
  },
  'Rehabilitación de muñón': {
    posicion: 'Decúbito supino o sentado, muñón accesible para movilización activa y pasiva.',
    pasos: [
      'Realizar movilización articular de la articulación proximal al muñón (cadera, rodilla o hombro).',
      'Fortalecer la musculatura del muñón con ejercicios de resistencia progresiva.',
      'Trabajar la propiocepción: el paciente reproduce posiciones del muñón con ojos cerrados.',
      'Practicar actividades funcionales que demanden el uso activo del muñón como palanca.',
      'Evaluar semanalmente el volumen del muñón para monitorizar la maduración.',
    ],
    precauciones: 'Derivar al médico si el volumen del muñón aumenta significativamente entre sesiones. Registrar fotos de cicatriz semanalmente.',
  },

  // ── SILLA DE RUEDAS ───────────────────────────────────────────────────────────
  'Propulsión de silla': {
    posicion: 'Sentado en silla de ruedas propia o terapéutica, aros de propulsión accesibles.',
    pasos: [
      'Posicionar las manos en la parte posterior del aro (posición de agarre óptima).',
      'Empujar hacia adelante con arco suave de 100-120° (de las 11 a las 3 del reloj).',
      'Soltar el aro y dejar caer la mano sin arrastre durante la fase de recuperación.',
      'Practicar frenado controlado: agarre firme en la parte frontal del aro.',
      'Progresar a superficies inclinadas (rampas) y giros de 90° y 180°.',
    ],
    precauciones: 'Supervisar la postura durante la propulsión. Contraindicado el agarre continuo del aro que genera lesión por fricción.',
  },
  'Transferencia silla-superficie': {
    posicion: 'Silla de ruedas frente a superficie destino (cama, inodoro, silla) a 30-45° de ángulo.',
    pasos: [
      'Bloquear las ruedas de la silla y retirar los reposabrazos y apoyapiés del lado de la transferencia.',
      'Desplazarse hacia el borde del asiento con el peso inclinado hacia adelante.',
      'Colocar los pies bien apoyados en el suelo y las manos en las superficies de apoyo.',
      'Elevar las caderas con impulso de brazos y girar hacia la superficie destino.',
      'Practicar la transferencia en ambas direcciones (izquierda y derecha) para independencia total.',
    ],
    precauciones: 'Nunca hacer la transferencia con las ruedas desbloqueadas. Asistir desde atrás en las primeras sesiones.',
  },
  'AVD desde silla de ruedas': {
    posicion: 'En silla de ruedas propia frente a las estaciones de AVD adaptadas.',
    pasos: [
      'Evaluar la accesibilidad del entorno: alturas de mesada, alcance máximo desde la silla.',
      'Practicar el alcance funcional en distintas alturas (frontal, lateral, por encima de la cabeza).',
      'Entrenar la preparación de alimentos simples adaptando las técnicas al alcance desde silla.',
      'Trabajar el vestido en sedestación: técnicas específicas para cada prenda y tipo de cierre.',
      'Evaluar la necesidad de adaptaciones del entorno y prescribir las modificaciones necesarias.',
    ],
    precauciones: 'Evitar el sobreesfuerzo en los hombros. Derivar a ergoterapia del hogar para valoración del entorno real.',
  },
  'Postura en silla de ruedas': {
    posicion: 'Sentado en silla de ruedas propia, con todas las piezas regulables en su posición.',
    pasos: [
      'Evaluar la alineación sentada: pelvis neutra, tronco erecto, cabeza sobre la pelvis.',
      'Ajustar el reposapiés a la altura correcta: muslos paralelos al suelo, rodillas a 90°.',
      'Ajustar el reposabrazo a la altura que permita los hombros relajados.',
      'Verificar que el respaldo esté a la altura correcta para el nivel de lesión del paciente.',
      'Educar al paciente y familia sobre señales de mala postura y cómo corregirla.',
    ],
    precauciones: 'Realizar control postural cada 30 minutos. Derivar a proveedor de silla si los ajustes no son suficientes.',
  },
  'Fortalecimiento MMSS en silla': {
    posicion: 'Sentado en silla de ruedas con buen soporte postural, pesas o banda elástica disponibles.',
    pasos: [
      'Iniciar con flexión y extensión de codo con resistencia ligera (0.5-1 kg).',
      'Trabajar el press de hombro: elevar pesas desde el hombro hacia arriba.',
      'Practicar remo con banda elástica fijada a punto anterior: tracción bilateral.',
      'Incorporar ejercicios de estabilización escapular: retracciones con banda.',
      'Progresar aumentando la resistencia y combinando movimientos funcionales.',
    ],
    precauciones: 'Proteger los hombros: son la articulación de trabajo principal en usuarios de silla. Evitar posiciones dolorosas.',
  },
  'Prevención de úlceras por presión': {
    posicion: 'Sentado en silla de ruedas, timer visible para los relevos de presión.',
    pasos: [
      'Enseñar la técnica de push-up de alivio: elevar el cuerpo con los brazos durante 30 segundos.',
      'Practicar el cambio de posición lateral: inclinar el tronco hacia un lado apoyado en el apoyabrazos.',
      'Establecer el protocolo de alivio de presión cada 15-30 minutos dependiendo del riesgo.',
      'Realizar la inspección cutánea diaria del área isquiática con espejo de mango largo.',
      'Educar al paciente y familia sobre los signos de alerta: eritema que no cede, calor local.',
    ],
    precauciones: 'Un solo episodio de úlcera grado I no tratado puede progresar a grado IV en horas. Derivar inmediatamente si hay signos.',
  },

  // ── POST-ACCIDENTE / TRAUMA ───────────────────────────────────────────────────
  'Movilización temprana': {
    posicion: 'Decúbito supino en cama o semisentado según indicación médica, zona afecta accesible.',
    pasos: [
      'Iniciar con movilización pasiva del segmento afecto dentro del rango libre de dolor.',
      'Aplicar técnicas suaves de movilización articular: tracción leve, deslizamientos articulares.',
      'Progresar a movilización activo-asistida: el terapeuta guía el movimiento iniciado por el paciente.',
      'Introducir ejercicios activos libres cuando el dolor en reposo sea menor a 3/10.',
      'Registrar el rango de movimiento en cada sesión como medida objetiva de progresión.',
    ],
    precauciones: 'Respetar las restricciones de carga y rango establecidas por el cirujano. No movilizar en fractura inestable.',
  },
  'Fortalecimiento progresivo': {
    posicion: 'Posición cómoda para el segmento afecto, materiales de resistencia progresiva disponibles.',
    pasos: [
      'Fase 1: ejercicios isométricos (sin movimiento articular) para activar el músculo sin estrés articular.',
      'Fase 2: movimiento activo libre en rango libre de dolor (sin resistencia).',
      'Fase 3: resistencia progresiva con banda elástica de menor tensión disponible.',
      'Fase 4: aumentar la resistencia gradualmente respetando la regla del 10% semanal.',
      'Fase 5: ejercicios funcionales que repliquen los requerimientos de las AVD y trabajo del paciente.',
    ],
    precauciones: 'Nunca avanzar de fase si hay inflamación activa o dolor post-ejercicio mayor a 4/10.',
  },
  'Reintegración a AVD': {
    posicion: 'Entorno real o simulado de las actividades de la vida diaria del paciente.',
    pasos: [
      'Identificar las AVD prioritarias con el paciente y su nivel de independencia previo al accidente.',
      'Practicar cada AVD en condiciones controladas adaptando la técnica a la capacidad actual.',
      'Introducir compensaciones y adaptaciones temporales mientras se recupera la función.',
      'Progresar retirando gradualmente las adaptaciones a medida que la función mejora.',
      'Evaluar la independencia alcanzada en contexto real (visita domiciliaria o entorno laboral).',
    ],
    precauciones: 'Priorizar las AVD con mayor impacto en la calidad de vida del paciente. Coordinar con el equipo médico el timing de la reintegración.',
  },
  'Manejo del dolor funcional': {
    posicion: 'Evaluación inicial con EVA y mapa corporal del dolor antes de cada sesión.',
    pasos: [
      'Registrar la intensidad del dolor en reposo y con movimiento al inicio de la sesión.',
      'Aplicar modalidades de manejo del dolor según indicación: TENS, calor superficial, crioterapia.',
      'Enseñar técnicas de higiene postural y mecánica corporal para reducir el dolor en AVD.',
      'Introducir técnicas de distracción cognitiva durante actividades de mayor demanda.',
      'Educar al paciente sobre la diferencia entre dolor útil (señal de alerta) y dolor innecesario.',
    ],
    precauciones: 'El dolor mayor a 5/10 durante la sesión indica que la intensidad debe reducirse. Derivar a unidad del dolor si hay dolor crónico refractario.',
  },
  'Recuperación funcional': {
    posicion: 'Entorno terapéutico con escalera de recuperación funcional definida para el paciente.',
    pasos: [
      'Establecer con el paciente los hitos funcionales de la recuperación (metas a corto, medio y largo plazo).',
      'Iniciar con actividades básicas de la vida diaria: higiene, vestido, alimentación.',
      'Progresar a actividades instrumentales: cocinar, compras, transporte.',
      'Trabajar la reintegración laboral o escolar según el perfil del paciente.',
      'Evaluar la participación social y comunitaria como indicador final de la recuperación.',
    ],
    precauciones: 'Adaptar el ritmo de recuperación a las fases de cicatrización y consolidación. No forzar la progresión.',
  },
  'Estabilización articular': {
    posicion: 'Articulación afecta en posición de máxima congruencia articular, carga controlada.',
    pasos: [
      'Iniciar con co-contracciones isométricas de agonistas y antagonistas sin carga.',
      'Progresar a ejercicios de estabilización en cadena cerrada con carga parcial.',
      'Introducir perturbaciones suaves en posición de carga para estimular las reacciones protectoras.',
      'Trabajar la estabilización articular en posiciones funcionales (cuclillas, apoyo unipodal).',
      'Progresar a actividades de alto rendimiento cuando la estabilidad esté consolidada.',
    ],
    precauciones: 'En ligamentos en fase de cicatrización, evitar tensión en el eje de reparación. Consultar protocolo post-quirúrgico si aplica.',
  },

  // ── NEUROLÓGICO ───────────────────────────────────────────────────────────────
  'Reeducación motora neuro': {
    posicion: 'De pie con barras paralelas o sentado, miembro afecto accesible para guía manual.',
    pasos: [
      'Identificar el patrón espástico predominante y la musculatura antagonista a activar.',
      'Aplicar técnicas de inhibición refleja: elongación lenta del músculo espástico.',
      'Facilitar la activación del antagonista con contacto manual en el vientre muscular.',
      'Practicar el movimiento funcional dentro del rango libre de espasticidad.',
      'Progresar a movimiento activo-resistido cuando la activación sea reproducible.',
    ],
    precauciones: 'No trabajar contra la espasticidad de forma forzada. Derivar a neurología si la espasticidad aumenta repentinamente.',
  },
  'Control de espasticidad': {
    posicion: 'Decúbito supino o sentado con soporte adecuado del miembro afecto.',
    pasos: [
      'Posicionar el miembro en patrones de inhibición de la espasticidad (elongación del patrón).',
      'Aplicar estiramiento lento y mantenido durante 20-30 segundos sobre el grupo espástico.',
      'Utilizar crioterapia (10 min) para reducción transitoria de la espasticidad antes del ejercicio.',
      'Practicar movimiento activo en el rango libre de espasticidad con biofeedback si disponible.',
      'Educar al paciente y familia sobre el posicionamiento correcto entre sesiones.',
    ],
    precauciones: 'El aumento súbito de espasticidad puede indicar estímulo nociceptivo (infección urinaria, úlcera). Descartar causas clínicas antes de tratar.',
  },
  'Marcha Parkinson': {
    posicion: 'De pie en pasillo con señales visuales en el suelo (líneas paralelas), apoyo disponible.',
    pasos: [
      'Colocar señales visuales transversales en el suelo separadas 50-60 cm (longitud de paso objetivo).',
      'Indicar al paciente que levante los pies activamente para superar cada señal.',
      'Practicar inicio de marcha con orden verbal: "uno, dos, tres… arranca" para superar el freezing.',
      'Trabajar el balance de brazos: balanceo contralateral activo y exagerado durante la marcha.',
      'Progresar a marcha con giros de 90° y 180° usando claves auditivas (metrónomo a 100-120 bpm).',
    ],
    precauciones: 'Supervisión constante por riesgo de caída. Los episodios de freezing no deben ser interrumpidos abruptamente.',
  },
  'Equilibrio neurológico': {
    posicion: 'Entre barras paralelas, progresar a superficie libre según nivel del paciente.',
    pasos: [
      'Iniciar en bipedestación con apoyo bilateral en barras, base amplia, ojos abiertos.',
      'Reducir el apoyo a un dedo por mano; luego a apoyo unilateral solamente.',
      'Practicar desplazamientos de peso: lateral, anterior-posterior, en diagonales.',
      'Introducir perturbaciones externas: empujes leves en hombro y pelvis.',
      'Agregar tarea dual cognitiva (contar regresivo) para evaluar la automatización del equilibrio.',
    ],
    precauciones: 'Siempre con terapeuta en guardia detrás del paciente. No avanzar sin consolidar el nivel previo.',
  },
  'Actividades funcionales ACV': {
    posicion: 'Mesa de trabajo con materiales de AVD graduados por dificultad.',
    pasos: [
      'Identificar las AVD prioritarias para el paciente (higiene, vestido, alimentación, escritura).',
      'Iniciar con actividades que el paciente puede completar al 70-80% de su capacidad previa.',
      'Incorporar el miembro afecto como estabilizador en tareas bimanuales.',
      'Utilizar estrategias compensatorias mientras se recupera la función del miembro afecto.',
      'Progresar gradualmente en complejidad hasta alcanzar la independencia en las AVD priorizadas.',
    ],
    precauciones: 'Adaptar el ritmo a la fatiga post-ACV. Evitar sesiones mayores a 45 minutos en fase subaguda.',
  },
  'Habla y comunicación neuro': {
    posicion: 'Sentado frente al terapeuta, ambiente tranquilo, sin distracciones auditivas.',
    pasos: [
      'Evaluar el tipo de alteración comunicativa: afasia, disartria, apraxia del habla.',
      'Para afasia: utilizar estrategias de comunicación aumentativa (imágenes, gestos, escritura).',
      'Para disartria: practicar ejercicios de control del soplo y articulación exagerada.',
      'Introducir palabras funcionales de alta frecuencia de uso en el contexto del paciente.',
      'Generalizar en situaciones reales: pedir objetos, saludar, expresar necesidades básicas.',
    ],
    precauciones: 'No corregir los errores de forma brusca. Derivar a fonoaudiología para evaluación formal y co-tratamiento.',
  },

  // ── MANO Y MUÑECA ─────────────────────────────────────────────────────────────
  'Movilidad de dedos': {
    posicion: 'Antebrazo apoyado en pronación, mano fuera del borde de la mesa.',
    pasos: [
      'Realizar movilización pasiva de cada articulación MCF, IFP e IFD en flexión y extensión.',
      'Progresar a movilización activo-asistida: el paciente inicia el movimiento, el terapeuta completa.',
      'Practicar la "flexión en gancho": flexionar solo las IFP e IFD manteniendo las MCF en extensión.',
      'Trabajar la flexión completa de puño: todos los dedos en flexión máxima simultánea.',
      'Progresar a movimientos independientes de dedos: elevar un dedo mientras los demás se mantienen.',
    ],
    precauciones: 'Respetar los rangos post-quirúrgicos según el protocolo del cirujano. Nunca forzar la flexión pasiva en tendón reparado.',
  },
  'Férula terapéutica': {
    posicion: 'Miembro superior en posición funcional para el moldeado de la férula.',
    pasos: [
      'Evaluar la posición funcional de muñeca (20-30° extensión) y dedos (MCF 70°, IFP 0°) para la férula.',
      'Moldear la férula termoplástica con el miembro en la posición deseada.',
      'Verificar que no haya presión excesiva sobre prominencias óseas ni sobre el nervio cubital.',
      'Indicar el uso: horas nocturnas para estiramiento, horas diurnas según el objetivo.',
      'Evaluar la piel en cada sesión y ajustar la férula ante cambios de edema o progresión del rango.',
    ],
    precauciones: 'Las férulas mal ajustadas causan úlceras por presión. Revisar cada 2-3 días en fase aguda.',
  },
  'Nervio periférico': {
    posicion: 'Posición de prueba de tensión neural: decúbito supino con brazo en abducción.',
    pasos: [
      'Evaluar la distribución sensitiva afectada (nervio mediano, cubital o radial) con monofilamentos.',
      'Iniciar movilización neural: deslizamiento del nervio en posición de baja tensión.',
      'Progresar a tensión neural progresiva dentro del umbral de síntomas (Tinnel < 3/10).',
      'Practicar ejercicios de discriminación sensitiva: identificar texturas, temperaturas, formas.',
      'Integrar la función sensitiva recuperada en actividades de AVD y laborales.',
    ],
    precauciones: 'Nunca realizar técnicas de tensión neural si hay signos de compromiso axonal severo (debilidad marcada, atrofia). Derivar a neurofisiología.',
  },
  'Pinzas graduadas': {
    posicion: 'Sentado con codo a 90°, mesa de trabajo con objetos de diferente tamaño y peso.',
    pasos: [
      'Iniciar con objetos grandes y ligeros: bola de espuma, esponja (agarre cilíndrico amplio).',
      'Progresar a objetos medianos: botón grande, bloque de madera (agarre palmar).',
      'Trabajar la pinza fina: monedas, papel, botones pequeños (pinza pulgar-índice).',
      'Introducir la pinza lateral y la trípode con objetos de escritura y herramientas pequeñas.',
      'Medir con dinamómetro y pinzómetro para objetivar el progreso de la fuerza.',
    ],
    precauciones: 'No realizar con heridas abiertas en mano. Contraindicado en fractura no consolidada de los dedos.',
  },
  'Edema post-quirúrgico': {
    posicion: 'Miembro elevado por encima del nivel del corazón, apoyado en almohada.',
    pasos: [
      'Iniciar con elevación activa del miembro por encima del corazón durante 20-30 minutos.',
      'Realizar movilizaciones activas de dedos y muñeca en posición elevada para bombeo muscular.',
      'Aplicar vendaje compresivo de distal a proximal con superposición del 50%.',
      'Realizar masaje de drenaje linfático manual desde distal (dedos) hacia proximal (axila).',
      'Evaluar el volumen del miembro con cinta métrica o volumetría por desplazamiento de agua.',
    ],
    precauciones: 'Suspender el vendaje ante signos de isquemia digital (palidez, frialdad, cianosis). No aplicar calor en edema inflamatorio agudo.',
  },
  'Destreza manual': {
    posicion: 'Sentado frente a la mesa de trabajo con tablero de clavijas o materiales de destreza.',
    pasos: [
      'Iniciar con el Purdue Pegboard o Nine-Hole Peg Test para establecer la línea base.',
      'Practicar la inserción de clavijas en el tablero con la mano dominante, luego no dominante.',
      'Trabajar tareas de destreza bimanual: ensartar cuentas, manipular tornillos, doblar papel.',
      'Incrementar la velocidad de ejecución manteniendo la precisión como criterio principal.',
      'Registrar el tiempo de ejecución y el número de errores en cada sesión para objetivar el progreso.',
    ],
    precauciones: 'Adaptar el tamaño de las clavijas según la capacidad del paciente. Evitar la fatiga por tareas repetitivas sin pausa.',
  },

  // ── SALUD MENTAL ─────────────────────────────────────────────────────────────
  'Actividad ocupacional': {
    posicion: 'Espacio de trabajo terapéutico con materiales de actividad expresiva o productiva.',
    pasos: [
      'Identificar con el paciente una actividad con significado personal (tejido, pintura, jardinería).',
      'Iniciar la actividad con demanda mínima para garantizar el éxito y la motivación.',
      'Trabajar en sesiones de 20-30 minutos con pausas según la tolerancia a la actividad.',
      'Reflexionar al cierre sobre cómo se sintió el paciente durante y después de la actividad.',
      'Progresar a actividades con mayor complejidad social o productiva según el estado del paciente.',
    ],
    precauciones: 'Evitar actividades que puedan detonar contenido traumático sin contención terapéutica. No usar terapia ocupacional como sustituto de la psicoterapia.',
  },
  'Rutina diaria salud mental': {
    posicion: 'Consulta terapéutica o entorno real del paciente para evaluación de la rutina.',
    pasos: [
      'Mapear la rutina actual del paciente: qué hace al levantarse, durante el día, al acostarse.',
      'Identificar los huecos de actividad (tiempo no estructurado) como factores de riesgo.',
      'Diseñar con el paciente una rutina con actividades básicas, instrumentales y de ocio.',
      'Incorporar actividades de activación conductual: al menos una actividad placentera por día.',
      'Revisar el cumplimiento de la rutina en cada sesión y ajustar la dificultad gradualmente.',
    ],
    precauciones: 'En depresión severa, comenzar con una sola actividad diaria obligatoria. No sobrecargar la rutina inicial.',
  },
  'Técnicas de regulación': {
    posicion: 'Espacio tranquilo, material de escritura y caja de herramientas de regulación preparada.',
    pasos: [
      'Identificar con el paciente las señales de alarma tempranas de desregulación emocional.',
      'Construir la "caja de herramientas": lista de técnicas que funcionan para ese paciente.',
      'Practicar la técnica de respiración cuadrada: inhalar 4s, sostener 4s, exhalar 4s, pausa 4s.',
      'Entrenar la técnica de grounding 5-4-3-2-1: nombrar lo que ve, oye, huele, toca y siente.',
      'Progresar a la identificación de emociones en escala de 0-10 y selección autónoma de técnica.',
    ],
    precauciones: 'En crisis aguda, priorizar la seguridad y el grounding antes de cualquier otra intervención. No exponer a técnicas de breathing en trauma sin preparación.',
  },
  'Habilidades sociales SM': {
    posicion: 'Sala de terapia grupal o individual con materiales de rol y tarjetas de habilidades.',
    pasos: [
      'Identificar las situaciones sociales específicas que generan dificultad al paciente.',
      'Modelar la habilidad objetivo: cómo iniciar una conversación, cómo pedir ayuda, cómo decir no.',
      'El paciente practica la habilidad en rol-play con el terapeuta como interlocutor.',
      'Proporcionar retroalimentación positiva y específica sobre lo que salió bien.',
      'Asignar tarea entre sesiones: practicar la habilidad en una situación real de bajo riesgo.',
    ],
    precauciones: 'En psicosis activa, posponer el entrenamiento de habilidades complejas. Adaptar el ritmo al nivel de funcionamiento actual del paciente.',
  },

  // ── PEDIÁTRICO ────────────────────────────────────────────────────────────────
  'Desarrollo motor grueso': {
    posicion: 'Área amplia libre de obstáculos, con colchonetas, obstáculos y materiales de juego.',
    pasos: [
      'Evaluar las habilidades motoras actuales usando escala de desarrollo (Denver, Bayley, Peabody).',
      'Iniciar con actividades que el niño puede realizar con éxito para construir confianza.',
      'Trabajar la habilidad inmediatamente superior en la secuencia del desarrollo.',
      'Usar el juego como vehículo: el niño sigue a la pelota, salta sobre almohadas, escala obstáculos.',
      'Involucrar a los padres: enseñar actividades para practicar en casa de forma lúdica.',
    ],
    precauciones: 'No forzar habilidades que requieren madurez neurológica que el niño aún no tiene. Respetar el ritmo individual del desarrollo.',
  },
  'Juego sensorial': {
    posicion: 'Sala de integración sensorial o área preparada con materiales sensoriales variados.',
    pasos: [
      'Preparar estaciones sensoriales: arena, agua, arroz, materiales de diferentes texturas.',
      'Observar las respuestas del niño al explorar: buscador sensorial vs. evitador sensorial.',
      'Seguir el liderazgo del niño: dejar que explore a su propio ritmo y con su propio nivel de intensidad.',
      'Introducir gradualmente texturas o sensaciones menos preferidas desde distancia segura.',
      'Registrar las preferencias y aversiones para diseñar la dieta sensorial individual.',
    ],
    precauciones: 'No forzar el contacto con estímulos que generen llanto o conductas de evitación intensa. El respeto a la autorregulación es terapéutico.',
  },
  'Habilidades escolares': {
    posicion: 'Mesa escolar con altura adecuada, silla con soporte, materiales escolares reales.',
    pasos: [
      'Evaluar el agarre del lápiz: identificar el patrón actual y trabajar hacia el tripodal dinámico.',
      'Practicar trazado previo: líneas, curvas, zigzags, espirales sobre papel con guías.',
      'Trabajar las tijeras: cortar siguiendo líneas rectas, luego curvas, luego formas.',
      'Introducir actividades de organización en el pupitre: localizar materiales, gestionar el espacio.',
      'Coordinar con docentes el tipo de adaptaciones necesarias en el aula (mesa inclinada, lápiz adaptado).',
    ],
    precauciones: 'Adaptar las demandas al nivel de desarrollo del niño. Evitar la comparación con pares como referente en la evaluación del progreso.',
  },
  'Juego funcional': {
    posicion: 'Área de juego con materiales variados de construcción, juego simbólico y manipulación.',
    pasos: [
      'Observar el nivel actual de juego: sensoriomotor, funcional, simbólico, de reglas.',
      'El terapeuta se une al juego del niño sin redirigir ni dirigir en las primeras sesiones.',
      'Modelar el nivel superior de juego de forma natural durante la actividad compartida.',
      'Introducir materiales que inviten al juego de mayor complejidad cognitiva y social.',
      'Facilitar la interacción con otro niño para trabajar habilidades de juego compartido.',
    ],
    precauciones: 'El juego forzado o dirigido pierde su valor terapéutico. La intervención debe ser naturalista y seguir la motivación intrínseca del niño.',
  },

  // ── ONCOLÓGICO ────────────────────────────────────────────────────────────────
  'Fatiga oncológica': {
    posicion: 'Evaluación inicial con escala de fatiga (BFI o FACIT-Fatiga) antes de cada sesión.',
    pasos: [
      'Aplicar el principio de conservación de energía: identificar actividades de alto costo energético.',
      'Diseñar un plan de actividad graduada: comenzar con 10-15 min de actividad ligera (nivel 3/10).',
      'Alternar periodos de actividad con descansos programados (ratio 1:2 en fase inicial).',
      'Progresar incrementando la duración de actividad en un 10% semanal si la fatiga no aumenta.',
      'Evaluar el sueño, la nutrición y el estado de ánimo como factores moduladores de la fatiga.',
    ],
    precauciones: 'La fatiga oncológica no mejora con reposo absoluto. El ejercicio gradual está indicado, pero debe adaptarse a los ciclos de quimioterapia o radioterapia.',
  },
  'Linfedema': {
    posicion: 'Sentado o semisentado, miembro elevado antes y durante el drenaje.',
    pasos: [
      'Evaluar el grado de linfedema (circunferencia, volumetría) antes de iniciar el drenaje.',
      'Aplicar técnica de drenaje linfático manual: comenzar por los ganglios del cuello y axila.',
      'Realizar maniobras de evacuación de distal a proximal con presión suave y sostenida.',
      'Aplicar vendaje multicapa o manga compresiva tras el drenaje para mantener la reducción.',
      'Enseñar al paciente el automasaje y los ejercicios de bombeo para la práctica diaria.',
    ],
    precauciones: 'Contraindicado en infección activa (linfangitis), trombosis venosa profunda activa y metástasis no tratadas. Verificar con oncólogo antes de iniciar.',
  },
  'Conservación de energía': {
    posicion: 'Consulta de evaluación con lista de todas las actividades semanales del paciente.',
    pasos: [
      'Listar todas las actividades de la semana y clasificarlas por costo energético (alto/medio/bajo).',
      'Aplicar el principio de las 4P: Planificar, Priorizar, Posicionar, Pedir ayuda.',
      'Rediseñar la rutina: distribuir las actividades de alto costo en días de mayor energía.',
      'Identificar adaptaciones del entorno: reorganizar la cocina para minimizar desplazamientos.',
      'Revisar el uso del equipo de apoyo: sillas de ducha, barras, carros de transporte.',
    ],
    precauciones: 'No indicar reposo total. La inactividad aumenta la fatiga a largo plazo. El objetivo es actividad sostenible, no eliminación de actividades.',
  },
  'Post-mastectomía': {
    posicion: 'Sentada con brazo del lado operado libre de restricciones de ropa.',
    pasos: [
      'Iniciar a las 48-72h post-cirugía (si no hay complicaciones) con ejercicios de mano y codo.',
      'Fase 1 (días 1-7): movilización de codo, muñeca y dedos; no elevar el brazo sobre 90°.',
      'Fase 2 (días 8-14): pendulares del hombro y elevación hasta 90° con apoyo de la mano sana.',
      'Fase 3 (días 15-30): elevación progresiva sobre 90° hacia la elevación completa.',
      'Fase 4: fortalecimiento del manguito rotador y trabajo de cicatriz (movilización de la cicatriz).',
    ],
    precauciones: 'No realizar ejercicio intenso con drenaje quirúrgico activo. Suspender si hay signos de infección o linforrea.',
  },

  // ── GERIÁTRICO ────────────────────────────────────────────────────────────────
  'Prevención de caídas': {
    posicion: 'Evaluación con Timed Up and Go (TUG) y Berg Balance Scale al inicio.',
    pasos: [
      'Identificar los factores de riesgo intrínsecos (visión, medicación, fuerza) y extrínsecos (entorno).',
      'Practicar ejercicios de fuerza de MMII: sentadillas parciales, elevación de talones, subida de escalón.',
      'Trabajar el equilibrio estático y dinámico: marcha en tándem, equilibrio monopodal, Romberg.',
      'Evaluar y adaptar el entorno domiciliario: alfombras, iluminación, barras de apoyo, calzado.',
      'Enseñar la técnica de recuperación del equilibrio y la estrategia de levantarse del suelo.',
    ],
    precauciones: 'Supervisión directa en todas las actividades de equilibrio. Evitar ejercicios de alto impacto en osteoporosis severa.',
  },
  'Memoria y cognición geriátrica': {
    posicion: 'Mesa de trabajo con materiales de estimulación cognitiva, ambiente tranquilo.',
    pasos: [
      'Aplicar el Mini-Mental State Examination (MMSE) o MoCA para establecer la línea base.',
      'Trabajar la memoria procedural: repetición de rutinas de AVD con errorless learning.',
      'Estimular la memoria episódica: recordar eventos recientes con apoyo de fotografías y objetos.',
      'Practicar actividades de orientación: fecha, lugar, nombre de personas cercanas.',
      'Introducir estrategias compensatorias: agenda, alarmas, rutinas fijas para reducir la carga de memoria.',
    ],
    precauciones: 'Adaptar la dificultad al nivel cognitivo del paciente. Evitar la frustración que puede generar conductas de resistencia.',
  },
  'Fuerza funcional geriátrica': {
    posicion: 'Sentado en silla firme o de pie con apoyo, equipamiento de resistencia ligero.',
    pasos: [
      'Iniciar con ejercicios de sentarse y levantarse de la silla (sit-to-stand): 3×10 con soporte.',
      'Trabajar la elevación de talones: 3×15 apoyado en respaldo de silla.',
      'Realizar la abducción de cadera: 2×12 de pie con una mano en pared para equilibrio.',
      'Incorporar ejercicios de MMSS con pesas ligeras (0.5-1 kg): curl de bíceps, press hombro.',
      'Progresar aumentando las repeticiones antes que el peso para reducir el riesgo de lesión.',
    ],
    precauciones: 'En osteoporosis: evitar ejercicios de flexión de tronco y rotación brusca. Priorizar la mecánica correcta sobre la carga.',
  },
  'AVD geriátrica': {
    posicion: 'Entorno real del hogar o simulado, con todos los objetos reales de la AVD.',
    pasos: [
      'Evaluar la independencia actual en AVD básicas (Índice de Barthel) y AVD instrumentales (Lawton).',
      'Identificar las AVD de mayor impacto en la calidad de vida e independencia del paciente.',
      'Trabajar las AVD en orden de prioridad usando técnicas de simplificación del trabajo.',
      'Prescribir y entrenar en el uso de dispositivos de ayuda: asideros, elevadores de inodoro, calzadores.',
      'Coordinar con el entorno familiar el nivel de asistencia adecuado (ni más ni menos del necesario).',
    ],
    precauciones: 'Respetar la autonomía del paciente. La sobreprotección familiar es un factor de dependencia iatrógena. Supervisar sin sobreayudar.',
  },

  // ── LESIÓN MEDULAR ────────────────────────────────────────────────────────────
  'Técnicas respiratorias LM': {
    posicion: 'Decúbito supino en cama hospitalaria o semisentado, terapeuta a un costado.',
    pasos: [
      'Evaluar la capacidad pulmonar según el nivel de lesión (ASIA A-D) y la musculatura respiratoria.',
      'En tetraplejia: asistir la espiración con compresión abdominal suave durante la tos.',
      'Trabajar la respiración diafragmática: el diafragma es el principal músculo respiratorio en lesión cervical.',
      'Practicar la tos asistida (manual o con dispositivos): coordinar la compresión abdominal con la glotis.',
      'Enseñar al paciente y cuidadores la técnica de tos asistida para uso domiciliario.',
    ],
    precauciones: 'En lesión C4 o superior: mayor riesgo de insuficiencia respiratoria. Siempre monitorear la SpO2 durante el ejercicio.',
  },
  'Fortalecimiento MMSS tetraplejia': {
    posicion: 'Sentado en silla de ruedas con buen soporte postural, banda elástica fijada.',
    pasos: [
      'Evaluar el nivel de lesión y los músculos funcionales disponibles (C5: deltoides/bíceps; C6: extensores muñeca).',
      'Iniciar con flexión y extensión de codo con banda de menor resistencia disponible.',
      'Trabajar la extensión de muñeca (C6): clave para la tenodesis funcional como agarre.',
      'Practicar la propulsión de silla con técnica correcta: es el ejercicio funcional más importante.',
      'Progresión: aumentar la distancia de propulsión y trabajar en superficies con mayor resistencia.',
    ],
    precauciones: 'Los hombros de los usuarios de silla son las articulaciones más vulnerables a largo plazo. Proteger el manguito rotador en todo momento.',
  },
  'Manejo vejiga neurógena': {
    posicion: 'Consulta terapéutica con materiales educativos e historial miccional del paciente.',
    pasos: [
      'Evaluar el tipo de disfunción vesical (hiperreflexia vs. arreflexia) según el nivel de lesión.',
      'Establecer un programa de cateterismo intermitente limpio (CIL): horarios fijos cada 4-6 horas.',
      'Calcular el balance hídrico para mantener diuresis de 1500-2000 ml/día.',
      'Enseñar técnica de cateterismo al paciente o cuidador con énfasis en la higiene.',
      'Registrar el diario vesical: volumen por cateterismo, escapes, urgencias y volumen de orina.',
    ],
    precauciones: 'El mal manejo vesical es la principal causa de complicaciones renales en lesión medular. Coordinar siempre con urología.',
  },
  'Independencia LM': {
    posicion: 'Evaluación con la escala SCIM (Spinal Cord Independence Measure) al inicio.',
    pasos: [
      'Identificar las áreas de AVD con mayor potencial de independencia según el nivel de lesión.',
      'Trabajar la independencia en higiene personal: técnicas adaptadas de lavado, afeitado, dental.',
      'Entrenar el vestido en cama y en silla: secuencia de pasos adaptada al nivel de función.',
      'Practicar la alimentación con adaptaciones: palillo tenedor, muñequera de soporte, antideslizante.',
      'Integrar el uso de dispositivos tecnológicos de control ambiental para mayor autonomía.',
    ],
    precauciones: 'El nivel de independencia posible varía significativamente entre niveles de lesión. Basar los objetivos en las guías de referencia de lesión medular (ASIA/ISCoS).',
  },
  'Cuidado de piel LM': {
    posicion: 'Espejo de mango largo disponible, entrenamiento en posición decúbito y sentado.',
    pasos: [
      'Enseñar la inspección cutánea diaria con espejo de mango largo: zonas isquiáticas, sacro, talones.',
      'Identificar las señales de alerta: eritema que no palidece, calor, induración en zona de presión.',
      'Establecer el protocolo de alivios de presión: push-up cada 15-30 min, inclinaciones laterales.',
      'Educar sobre factores de riesgo: humedad, fricción, cizallamiento, mal estado nutricional.',
      'Revisar la interfaz silla-paciente: cojín antiescaras, ajuste correcto del asiento.',
    ],
    precauciones: 'Un eritema grado 1 tratado correctamente no progresa. Un eritema grado 2 puede requerir semanas de reposo en cama. Derivar inmediatamente.',
  },
};


// ─── LISTA DE EJERCICIOS ───────────────────────────────────────────────────────
const ejercicios = [
  // ── MIEMBRO SUPERIOR
  { nombre: 'Pinza lateral',                grupo: 'Miembro superior',          reps: '3×10',       material: 'Plastilina / moneda',             icon: 'hand-left',        objetivo: 'Fuerza de agarre y coordinación fina' },
  { nombre: 'Flexión de muñeca',            grupo: 'Miembro superior',          reps: '3×15',       material: 'Banda elástica',                  icon: 'fitness',          objetivo: 'Amplitud articular y fortalecimiento' },
  { nombre: 'Oposición de pulgares',        grupo: 'Miembro superior',          reps: '2×20',       material: 'Ninguno',                         icon: 'hand-right',       objetivo: 'Coordinación bimanual y motricidad fina' },
  { nombre: 'Alcance funcional',            grupo: 'Miembro superior',          reps: '3×8',        material: 'Objetos cotidianos',              icon: 'arrow-up',         objetivo: 'Control de hombro y coordinación ojo-mano' },
  { nombre: 'Fortalecimiento de hombro',    grupo: 'Miembro superior',          reps: '3×12',       material: 'Banda elástica',                  icon: 'barbell',          objetivo: 'Estabilidad escapular y fuerza de deltoides' },
  { nombre: 'Extensión de codo',            grupo: 'Miembro superior',          reps: '3×15',       material: 'Banda / mancuerna 0.5 kg',        icon: 'fitness',          objetivo: 'Fortalecimiento de tríceps y control motor' },
  { nombre: 'Prensión cilíndrica',          grupo: 'Miembro superior',          reps: '3×10',       material: 'Objeto cilíndrico variado',       icon: 'hand-left',        objetivo: 'Agarre funcional y fuerza de mano' },
  { nombre: 'Actividades de escritura',     grupo: 'Miembro superior',          reps: '10 min',     material: 'Lápiz, papel, superficie inclinada', icon: 'create',         objetivo: 'Coordinación grafomotora y motricidad fina' },

  // ── MIEMBRO INFERIOR
  { nombre: 'Marcha en el lugar',           grupo: 'Miembro inferior',          reps: '5 min',      material: 'Ninguno',                         icon: 'walk',             objetivo: 'Activación muscular y coordinación' },
  { nombre: 'Equilibrio monopodal',         grupo: 'Miembro inferior',          reps: '3×30s',      material: 'Cono de apoyo',                   icon: 'body',             objetivo: 'Balance estático y propiocepción' },
  { nombre: 'Transferencias sit-stand',     grupo: 'Miembro inferior',          reps: '3×10',       material: 'Silla firme',                     icon: 'arrow-up-circle',  objetivo: 'Funcionalidad en AVD y fuerza de MMII' },
  { nombre: 'Elevación de talones',         grupo: 'Miembro inferior',          reps: '3×15',       material: 'Pared o silla para apoyo',        icon: 'arrow-up',         objetivo: 'Fortalecimiento de tríceps sural y equilibrio' },
  { nombre: 'Flexión de rodilla',           grupo: 'Miembro inferior',          reps: '3×12',       material: 'Tobillera con peso (opc.)',        icon: 'fitness',          objetivo: 'Fortalecimiento isquiotibial y control excéntrico' },
  { nombre: 'Abducción de cadera',          grupo: 'Miembro inferior',          reps: '3×12',       material: 'Banda elástica (opc.)',            icon: 'body',             objetivo: 'Activación glúteo medio y estabilidad pélvica' },
  { nombre: 'Subida de escalón',            grupo: 'Miembro inferior',          reps: '3×8',        material: 'Escalón 15-20 cm, apoyo lateral', icon: 'trending-up',      objetivo: 'Funcionalidad en AVD y transferencia de peso' },

  // ── COGNITIVO
  { nombre: 'Secuencia de dígitos',         grupo: 'Cognitivo',                 reps: '5 rondas',   material: 'Tarjetas numéricas',              icon: 'bulb',             objetivo: 'Memoria de trabajo y atención sostenida' },
  { nombre: 'Clasificación de objetos',     grupo: 'Cognitivo',                 reps: '3 series',   material: 'Objetos variados',                icon: 'grid',             objetivo: 'Funciones ejecutivas y razonamiento' },
  { nombre: 'Seguimiento visual',           grupo: 'Cognitivo',                 reps: '10 min',     material: 'Pelota o luz',                    icon: 'eye',              objetivo: 'Atención visual y coordinación óculo-manual' },
  { nombre: 'Memoria procedimental',        grupo: 'Cognitivo',                 reps: '4 series',   material: 'Materiales cotidianos',           icon: 'library',          objetivo: 'Consolidación de secuencias y memoria implícita' },
  { nombre: 'Razonamiento analógico',       grupo: 'Cognitivo',                 reps: '20 ítems',   material: 'Tarjetas de analogías',           icon: 'git-branch',       objetivo: 'Razonamiento abstracto y flexibilidad cognitiva' },
  { nombre: 'Atención dividida',            grupo: 'Cognitivo',                 reps: '3 bloques',  material: 'Dos tareas simultáneas',          icon: 'shuffle',          objetivo: 'Multitarea y recursos atencionales' },

  // ── SENSORIAL
  { nombre: 'Juego de texturas',            grupo: 'Sensorial',                 reps: '10 min',     material: 'Kit de texturas variadas',        icon: 'hand-left',        objetivo: 'Modulación táctil y tolerancia sensorial' },
  { nombre: 'Estimulación propioceptiva',   grupo: 'Sensorial',                 reps: '15 min',     material: 'Pelota de presión',               icon: 'radio-button-on',  objetivo: 'Integración propioceptiva y regulación' },
  { nombre: 'Estimulación auditiva',        grupo: 'Sensorial',                 reps: '15 min',     material: 'Fuentes de sonido variadas',      icon: 'volume-high',      objetivo: 'Discriminación auditiva y procesamiento sensorial' },
  { nombre: 'Discriminación olfativa',      grupo: 'Sensorial',                 reps: '6 aromas',   material: 'Frascos opacos con aromas',       icon: 'flower',           objetivo: 'Modulación olfativa y memoria episódica' },
  { nombre: 'Integración vestibular',       grupo: 'Sensorial',                 reps: '3×30s',      material: 'Colchoneta, cojín de aire',       icon: 'body',             objetivo: 'Sistema vestibular y regulación postural' },
  { nombre: 'Estereognosia táctil',         grupo: 'Sensorial',                 reps: '10 objetos', material: 'Bolsa opaca, objetos comunes',    icon: 'hand-right',       objetivo: 'Identificación táctil sin control visual' },

  // ── RESPIRATORIO
  { nombre: 'Respiración diafragmática',    grupo: 'Respiratorio',              reps: '10 resp.',   material: 'Ninguno',                         icon: 'heart',            objetivo: 'Regulación respiratoria y relajación' },
  { nombre: 'Técnica de soplo',             grupo: 'Respiratorio',              reps: '5 min',      material: 'Pajillas, velas',                 icon: 'partly-sunny',     objetivo: 'Control espiratorio y coordinación bucal' },
  { nombre: 'Respiración costal',           grupo: 'Respiratorio',              reps: '10 resp.',   material: 'Ninguno',                         icon: 'body',             objetivo: 'Expansión torácica y ventilación lateral' },
  { nombre: 'Espirometría incentivada',     grupo: 'Respiratorio',              reps: '10 rep.',    material: 'Espirómetro de incentivo',        icon: 'trending-up',      objetivo: 'Expansión alveolar y prevención de atelectasia' },
  { nombre: 'Tos terapéutica',              grupo: 'Respiratorio',              reps: '5 ciclos',   material: 'Ninguno',                         icon: 'alert-circle',     objetivo: 'Movilización de secreciones y higiene bronquial' },

  // ── COLUMNA Y ESPALDA
  { nombre: 'Flexión de tronco',            grupo: 'Columna y espalda',         reps: '3×30s',      material: 'Ninguno',                         icon: 'arrow-down',       objetivo: 'Elongación de paravertebrales y ganancia de amplitud' },
  { nombre: 'Extensión de tronco',          grupo: 'Columna y espalda',         reps: '3×15s',      material: 'Colchoneta (cuadrupedia)',         icon: 'arrow-up',         objetivo: 'Fortalecimiento extensor y postura' },
  { nombre: 'Rotación de tronco',           grupo: 'Columna y espalda',         reps: '3×10',       material: 'Silla sin respaldo / palo',       icon: 'refresh',          objetivo: 'Movilidad torácica y control de oblicuos' },
  { nombre: 'Cat-Camel',                    grupo: 'Columna y espalda',         reps: '3×15',       material: 'Colchoneta',                      icon: 'sync',             objetivo: 'Movilización segmentaria lumbar y torácica' },
  { nombre: 'Bridging',                     grupo: 'Columna y espalda',         reps: '3×12',       material: 'Colchoneta',                      icon: 'arrow-up-circle',  objetivo: 'Activación glútea y estabilidad lumbopélvica' },

  // ── COORDINACIÓN Y EQUILIBRIO
  { nombre: 'Marcha en tándem',             grupo: 'Coordinación y equilibrio', reps: '3×10 pasos', material: 'Línea en el suelo',               icon: 'footsteps',        objetivo: 'Coordinación dinámica y control de marcha' },
  { nombre: 'Coordinación mano-pie',        grupo: 'Coordinación y equilibrio', reps: '3×20',       material: 'Ninguno',                         icon: 'swap-horizontal',  objetivo: 'Coordinación cruzada e integración motora' },
  { nombre: 'Lanzamiento de pelota',        grupo: 'Coordinación y equilibrio', reps: '3×15',       material: 'Pelota de goma blanda',           icon: 'football',         objetivo: 'Coordinación ojo-mano y reacción motora' },
  { nombre: 'Reacciones de equilibrio',     grupo: 'Coordinación y equilibrio', reps: '3×30s',      material: 'Tabla basculante / cojín',        icon: 'alert',            objetivo: 'Respuestas automáticas de equilibrio' },

  // ── AVD
  { nombre: 'Vestido de miembro superior',  grupo: 'AVD',                       reps: '5 veces',    material: 'Camisa o camiseta',               icon: 'shirt',            objetivo: 'Independencia en el vestido y coordinación bimanual' },
  { nombre: 'Uso de cubiertos',             grupo: 'AVD',                       reps: '10 min',     material: 'Cubiertos, alimento blando',      icon: 'restaurant',       objetivo: 'Alimentación independiente y coordinación fina' },
  { nombre: 'Higiene de manos',             grupo: 'AVD',                       reps: '3 veces',    material: 'Jabón, agua, toalla',             icon: 'water',            objetivo: 'Rutina de higiene y manipulación de objetos' },
  { nombre: 'Apertura de envases',          grupo: 'AVD',                       reps: '8 envases',  material: 'Variedad de envases',             icon: 'archive',          objetivo: 'Fuerza funcional y destreza en AVD domésticas' },

  // ── VISUAL / PERCEPTUAL
  { nombre: 'Agudeza visual funcional',     grupo: 'Visual / Perceptual',       reps: '15 min',     material: 'Optotipo, cartilla de lectura',   icon: 'eye',              objetivo: 'Valoración y entrenamiento de la visión funcional' },
  { nombre: 'Percepción espacial',          grupo: 'Visual / Perceptual',       reps: '3 series',   material: 'Bloques, rompecabezas',           icon: 'cube',             objetivo: 'Orientación espacial y planificación motora' },
  { nombre: 'Discriminación figura-fondo',  grupo: 'Visual / Perceptual',       reps: '3 series',   material: 'Láminas, objetos superpuestos',   icon: 'layers',           objetivo: 'Procesamiento visual y atención selectiva' },

  // ── RELAJACIÓN
  { nombre: 'Mindfulness sensorial',        grupo: 'Relajación',                reps: '10 min',     material: 'Ninguno',                         icon: 'leaf',             objetivo: 'Regulación del sistema nervioso y atención plena' },
  { nombre: 'Relajación muscular prog.',    grupo: 'Relajación',                reps: '15 min',     material: 'Colchoneta / silla reclinable',   icon: 'moon',             objetivo: 'Reducción de tensión muscular y ansiedad' },
  { nombre: 'Visualización guiada',         grupo: 'Relajación',                reps: '10 min',     material: 'Guion verbal del terapeuta',      icon: 'cloudy-night',     objetivo: 'Regulación emocional y manejo del dolor crónico' },

  // ── SOCIAL / EMOCIONAL
  { nombre: 'Juego de roles',               grupo: 'Social / Emocional',        reps: '20 min',     material: 'Materiales de rol variados',      icon: 'people',           objetivo: 'Habilidades sociales y adaptación al entorno' },
  { nombre: 'Expresión emocional',          grupo: 'Social / Emocional',        reps: '15 min',     material: 'Láminas, colores, plastilina',    icon: 'happy',            objetivo: 'Identificación y expresión de emociones' },
  { nombre: 'Habilidades conversacionales', grupo: 'Social / Emocional',        reps: '20 min',     material: 'Ninguno',                         icon: 'chatbubbles',      objetivo: 'Comunicación funcional y participación social' },

  // ── TDAH E HIPERACTIVIDAD
  { nombre: 'Circuito motor funcional',     grupo: 'TDAH e hiperactividad',     reps: '3 rondas',   material: 'Conos, aros, pelota blanda',      icon: 'footsteps',        objetivo: 'Canalizar la energía motora y mejorar la atención sostenida' },
  { nombre: 'Pausa activa estructurada',    grupo: 'TDAH e hiperactividad',     reps: '5 min',      material: 'Timer visual',                    icon: 'timer',            objetivo: 'Regulación de la activación y retorno al foco' },
  { nombre: 'Tabla de enfoque',             grupo: 'TDAH e hiperactividad',     reps: 'Diaria',     material: 'Tablero, stickers, marcador',     icon: 'checkbox',         objetivo: 'Planificación, automonitoreo y función ejecutiva' },
  { nombre: 'Juego de estrategia',          grupo: 'TDAH e hiperactividad',     reps: '15 min',     material: 'Juego de mesa simple',            icon: 'game-controller',  objetivo: 'Control de impulsos, espera de turno y atención ejecutiva' },
  { nombre: 'Respira conmigo',              grupo: 'TDAH e hiperactividad',     reps: '5-6 ciclos', material: 'Pelota blanda o globo',           icon: 'heart',            objetivo: 'Autorregulación y reducción de la hiperactivación' },
  { nombre: 'Sistema de economía de fichas',grupo: 'TDAH e hiperactividad',     reps: 'Sesión',     material: 'Tablero, fichas, recompensas',    icon: 'star',             objetivo: 'Refuerzo de conductas meta y motivación sostenida' },

  // ── DISCAPACIDAD INTELECTUAL
  { nombre: 'Comunicación por pictogramas', grupo: 'Discapacidad intelectual',  reps: '20 min',     material: 'Tablero de pictogramas / tablet', icon: 'images',           objetivo: 'Comunicación funcional y comprensión contextual' },
  { nombre: 'Rutina visual diaria',         grupo: 'Discapacidad intelectual',  reps: 'Diaria',     material: 'Panel visual, pictogramas',       icon: 'list',             objetivo: 'Predictibilidad, autonomía y organización temporal' },
  { nombre: 'Encadenamiento de AVD',        grupo: 'Discapacidad intelectual',  reps: '5-8 pasos',  material: 'Materiales reales de la AVD',     icon: 'link',             objetivo: 'Aprendizaje de habilidades de autocuidado por pasos' },
  { nombre: 'Manipulación de objetos',      grupo: 'Discapacidad intelectual',  reps: '15 min',     material: 'Objetos variados, cubos, pelotas',icon: 'hand-left',        objetivo: 'Motricidad fina, clasificación y comprensión de instrucciones' },
  { nombre: 'Comunicación funcional',       grupo: 'Discapacidad intelectual',  reps: 'Sesión',     material: 'Entorno natural de comunicación', icon: 'chatbox',          objetivo: 'Iniciativa comunicativa y reducción de conductas problemáticas' },
  { nombre: 'Habilidades prelaborales',     grupo: 'Discapacidad intelectual',  reps: '20 min',     material: 'Materiales de tarea simple',      icon: 'briefcase',        objetivo: 'Independencia laboral y tolerancia a la tarea' },

  // ── AUTISMO / TEA
  { nombre: 'Rutina estructurada con apoyos',grupo: 'Autismo / TEA',            reps: 'Sesión',     material: 'Tablero primera-después, timer',  icon: 'calendar',         objetivo: 'Predictibilidad, reducción de ansiedad y regulación conductual' },
  { nombre: 'Desensibilización sensorial',   grupo: 'Autismo / TEA',            reps: '10-15 min',  material: 'Jerarquía de estímulos preparada',icon: 'options',          objetivo: 'Ampliación de la tolerancia sensorial de forma gradual y segura' },
  { nombre: 'Juego paralelo guiado',         grupo: 'Autismo / TEA',            reps: '15 min',     material: '2 sets idénticos de materiales',  icon: 'people',           objetivo: 'Proximidad social y bases del juego compartido' },
  { nombre: 'Regulación sensorial TEA',      grupo: 'Autismo / TEA',            reps: 'Según necesidad',material: 'Rincón de regulación equipado',icon: 'pulse',           objetivo: 'Autorregulación sensorial y prevención de crisis' },
  { nombre: 'Transición entre actividades',  grupo: 'Autismo / TEA',            reps: 'Cada cambio', material: 'Timer visual, objeto de transición',icon: 'repeat',         objetivo: 'Flexibilidad en las transiciones y reducción de rigidez' },
  { nombre: 'Interacción guiada',            grupo: 'Autismo / TEA',            reps: '20 min',     material: 'Actividad triádica preparada',    icon: 'person-add',       objetivo: 'Iniciativa social y habilidades de interacción entre pares' },

  // ── PRÓTESIS Y AMPUTACIÓN
  { nombre: 'Entrenamiento de muñón',        grupo: 'Prótesis y amputación',    reps: '15 min',     material: 'Aceite neutro, vendaje, texturas',icon: 'bandage',          objetivo: 'Maduración del muñón y preparación para la prótesis' },
  { nombre: 'Uso funcional de prótesis MMSS',grupo: 'Prótesis y amputación',    reps: '30 min',     material: 'Prótesis de miembro superior',    icon: 'hand-left',        objetivo: 'Independencia funcional con prótesis de MMSS' },
  { nombre: 'Uso funcional de prótesis MMII',grupo: 'Prótesis y amputación',    reps: '30 min',     material: 'Prótesis de miembro inferior',    icon: 'walk',             objetivo: 'Marcha funcional y segura con prótesis de MMII' },
  { nombre: 'Compensación contralateral',    grupo: 'Prótesis y amputación',    reps: '20 min',     material: 'Objetos cotidianos',              icon: 'swap-horizontal',  objetivo: 'Destreza del miembro contralateral para AVD independientes' },
  { nombre: 'Desensibilización de muñón',    grupo: 'Prótesis y amputación',    reps: '10 min',     material: 'Kit de texturas y vibración',     icon: 'options',          objetivo: 'Tolerancia táctil y preparación para el socket protésico' },
  { nombre: 'AVD con amputación',            grupo: 'Prótesis y amputación',    reps: 'Sesión',     material: 'Materiales AVD y adaptaciones',  icon: 'home',             objetivo: 'Independencia en actividades de la vida diaria' },
  { nombre: 'Rehabilitación de muñón',       grupo: 'Prótesis y amputación',    reps: '3×10',       material: 'Bandas, colchoneta',              icon: 'fitness',          objetivo: 'Fuerza, propiocepción y movilidad del muñón' },

  // ── SILLA DE RUEDAS
  { nombre: 'Propulsión de silla',           grupo: 'Silla de ruedas',          reps: '20 min',     material: 'Silla de ruedas propia',          icon: 'arrow-forward',    objetivo: 'Técnica de propulsión eficiente y protección articular' },
  { nombre: 'Transferencia silla-superficie',grupo: 'Silla de ruedas',          reps: '5 intentos', material: 'Silla de ruedas, superficie destino',icon: 'swap-vertical',  objetivo: 'Independencia en las transferencias y seguridad' },
  { nombre: 'AVD desde silla de ruedas',     grupo: 'Silla de ruedas',          reps: 'Sesión',     material: 'Entorno adaptado',                icon: 'home',             objetivo: 'Independencia en AVD básicas e instrumentales' },
  { nombre: 'Postura en silla de ruedas',    grupo: 'Silla de ruedas',          reps: 'Evaluación', material: 'Silla de ruedas regulable',       icon: 'body',             objetivo: 'Alineación postural óptima y prevención de deformidades' },
  { nombre: 'Fortalecimiento MMSS en silla', grupo: 'Silla de ruedas',          reps: '3×12',       material: 'Pesas 0.5-2 kg, banda elástica',  icon: 'barbell',          objetivo: 'Fuerza de brazos para propulsión y transferencias' },
  { nombre: 'Prevención de úlceras por presión',grupo: 'Silla de ruedas',       reps: 'Cada 30 min',material: 'Timer, espejo de mango largo',    icon: 'shield-checkmark', objetivo: 'Prevención de lesiones por presión y educación del paciente' },

  // ── POST-ACCIDENTE / TRAUMA
  { nombre: 'Movilización temprana',         grupo: 'Post-accidente / trauma',  reps: '15 min',     material: 'Colchoneta, almohadas',           icon: 'move',             objetivo: 'Recuperación precoz del rango articular y prevención de rigidez' },
  { nombre: 'Fortalecimiento progresivo',    grupo: 'Post-accidente / trauma',  reps: '3 series',   material: 'Banda elástica, mancuerna ligera',icon: 'trending-up',      objetivo: 'Recuperación de fuerza muscular por fases' },
  { nombre: 'Reintegración a AVD',           grupo: 'Post-accidente / trauma',  reps: 'Sesión',     material: 'Materiales reales de la AVD',     icon: 'home',             objetivo: 'Recuperación de la independencia en actividades cotidianas' },
  { nombre: 'Manejo del dolor funcional',    grupo: 'Post-accidente / trauma',  reps: 'Sesión',     material: 'EVA, materiales de modulación del dolor',icon: 'medical',     objetivo: 'Reducción del dolor y mejora de la funcionalidad' },
  { nombre: 'Recuperación funcional',        grupo: 'Post-accidente / trauma',  reps: 'Escalada',   material: 'Materiales AVD e instrumentales', icon: 'flag',             objetivo: 'Progresión de AVD básicas a actividades complejas' },
  { nombre: 'Estabilización articular',      grupo: 'Post-accidente / trauma',  reps: '3×15',       material: 'Banda elástica, superficie inestable',icon: 'shield',        objetivo: 'Estabilidad articular y prevención de re-lesiones' },

  // ── NEUROLÓGICO
  { nombre: 'Reeducación motora neuro',      grupo: 'Neurológico',               reps: '20 min',     material: 'Barras paralelas, objetos funcionales', icon: 'pulse',        objetivo: 'Recuperación de patrones motores funcionales post-lesión' },
  { nombre: 'Control de espasticidad',       grupo: 'Neurológico',               reps: '15 min',     material: 'Férula inhibidora, crioterapia',  icon: 'medical',          objetivo: 'Reducción de la espasticidad y mejora del rango articular' },
  { nombre: 'Marcha Parkinson',              grupo: 'Neurológico',               reps: '20 min',     material: 'Señales visuales en suelo, metrónomo', icon: 'footsteps',    objetivo: 'Amplitud del paso y superación del freezing' },
  { nombre: 'Equilibrio neurológico',        grupo: 'Neurológico',               reps: '3×30s',      material: 'Barras paralelas, superficie inestable', icon: 'body',        objetivo: 'Control postural y reducción del riesgo de caída' },
  { nombre: 'Actividades funcionales ACV',   grupo: 'Neurológico',               reps: 'Sesión',     material: 'Materiales AVD graduados',        icon: 'home',             objetivo: 'Recuperación de independencia en AVD post-ACV' },
  { nombre: 'Habla y comunicación neuro',    grupo: 'Neurológico',               reps: '20 min',     material: 'Material de comunicación aumentativa', icon: 'chatbubbles', objetivo: 'Comunicación funcional en afasia y disartria' },

  // ── MANO Y MUÑECA
  { nombre: 'Movilidad de dedos',            grupo: 'Mano y muñeca',             reps: '3×10 c/dedo',material: 'Ninguno',                         icon: 'hand-left',        objetivo: 'Rango de movimiento articular de mano y dedos' },
  { nombre: 'Férula terapéutica',            grupo: 'Mano y muñeca',             reps: 'Según pauta',material: 'Termoplástico, velcro',           icon: 'bandage',          objetivo: 'Corrección postural, protección y estiramiento sostenido' },
  { nombre: 'Nervio periférico',             grupo: 'Mano y muñeca',             reps: '3×10',       material: 'Monofilamentos, materiales de discriminación', icon: 'flash', objetivo: 'Recuperación de la función sensitiva y motora periférica' },
  { nombre: 'Pinzas graduadas',              grupo: 'Mano y muñeca',             reps: '3×15',       material: 'Objetos de tamaño y peso graduado', icon: 'hand-right',      objetivo: 'Fuerza y coordinación de los distintos tipos de pinza' },
  { nombre: 'Edema post-quirúrgico',         grupo: 'Mano y muñeca',             reps: '30 min',     material: 'Vendaje compresivo, almohada',    icon: 'water',            objetivo: 'Reducción del edema y recuperación del rango articular' },
  { nombre: 'Destreza manual',               grupo: 'Mano y muñeca',             reps: '15 min',     material: 'Tablero de clavijas, materiales de destreza', icon: 'construct', objetivo: 'Velocidad y precisión en tareas de manipulación fina' },

  // ── SALUD MENTAL
  { nombre: 'Actividad ocupacional',         grupo: 'Salud mental',              reps: '30 min',     material: 'Materiales de actividad con significado', icon: 'color-palette', objetivo: 'Motivación, autoeficacia y bienestar a través de la ocupación' },
  { nombre: 'Rutina diaria salud mental',    grupo: 'Salud mental',              reps: 'Sesión',     material: 'Planner, alarmas, agenda',        icon: 'calendar',         objetivo: 'Estructura, predictibilidad y activación conductual' },
  { nombre: 'Técnicas de regulación',        grupo: 'Salud mental',              reps: '15 min',     material: 'Caja de herramientas de regulación', icon: 'options',        objetivo: 'Manejo autónomo de estados emocionales intensos' },
  { nombre: 'Habilidades sociales SM',       grupo: 'Salud mental',              reps: '20 min',     material: 'Tarjetas de habilidades, rol-play', icon: 'people',          objetivo: 'Interacción social funcional y participación comunitaria' },

  // ── PEDIÁTRICO
  { nombre: 'Desarrollo motor grueso',       grupo: 'Pediátrico',                reps: '30 min',     material: 'Colchonetas, obstáculos, pelotas', icon: 'body',             objetivo: 'Hitos del desarrollo motor y control postural' },
  { nombre: 'Juego sensorial',               grupo: 'Pediátrico',                reps: '20 min',     material: 'Caja sensorial, texturas variadas', icon: 'hand-left',       objetivo: 'Integración sensorial y tolerancia a nuevos estímulos' },
  { nombre: 'Habilidades escolares',         grupo: 'Pediátrico',                reps: '20 min',     material: 'Lápiz, tijeras, materiales escolares', icon: 'create',        objetivo: 'Destreza grafomotora y organización para el aprendizaje' },
  { nombre: 'Juego funcional',               grupo: 'Pediátrico',                reps: '30 min',     material: 'Materiales de juego variados',    icon: 'game-controller',  objetivo: 'Desarrollo del juego y habilidades sociales con pares' },

  // ── ONCOLÓGICO
  { nombre: 'Fatiga oncológica',             grupo: 'Oncológico',                reps: '15-20 min',  material: 'Escala de fatiga, plan de actividad', icon: 'battery-charging', objetivo: 'Manejo de la fatiga y recuperación de la participación' },
  { nombre: 'Linfedema',                     grupo: 'Oncológico',                reps: '45 min',     material: 'Vendaje multicapa, aceite neutro', icon: 'water',            objetivo: 'Reducción del linfedema y mantenimiento del drenaje' },
  { nombre: 'Conservación de energía',       grupo: 'Oncológico',                reps: 'Sesión',     material: 'Lista de actividades, planificador', icon: 'battery-half',   objetivo: 'Optimización de la energía disponible para el rol ocupacional' },
  { nombre: 'Post-mastectomía',              grupo: 'Oncológico',                reps: 'Por fase',   material: 'Sin material o mancuerna 0.5 kg', icon: 'fitness',          objetivo: 'Recuperación del ROM de hombro y prevención del linfedema' },

  // ── GERIÁTRICO
  { nombre: 'Prevención de caídas',          grupo: 'Geriátrico',                reps: '3 series',   material: 'Cinta métrica, TUG, barras de apoyo', icon: 'shield-checkmark', objetivo: 'Reducción del riesgo de caída y miedo a caer' },
  { nombre: 'Memoria y cognición geriátrica',grupo: 'Geriátrico',                reps: '20 min',     material: 'Tarjetas, objetos, MMSE/MoCA',    icon: 'bulb',             objetivo: 'Mantenimiento cognitivo y estrategias compensatorias' },
  { nombre: 'Fuerza funcional geriátrica',   grupo: 'Geriátrico',                reps: '3×10-15',    material: 'Silla firme, pesas 0.5-1 kg',     icon: 'barbell',          objetivo: 'Sarcopenia, fuerza funcional y capacidad de AVD' },
  { nombre: 'AVD geriátrica',                grupo: 'Geriátrico',                reps: 'Sesión',     material: 'Materiales reales del hogar',     icon: 'home',             objetivo: 'Independencia en AVD y calidad de vida del adulto mayor' },

  // ── LESIÓN MEDULAR
  { nombre: 'Técnicas respiratorias LM',     grupo: 'Lesión medular',            reps: '10 min',     material: 'Oxímetro, almohada abdominal',    icon: 'heart',            objetivo: 'Función respiratoria y prevención de complicaciones pulmonares' },
  { nombre: 'Fortalecimiento MMSS tetraplejia',grupo: 'Lesión medular',          reps: '3×10',       material: 'Banda elástica, silla de ruedas', icon: 'barbell',          objetivo: 'Fuerza de MMSS para propulsión y transferencias' },
  { nombre: 'Manejo vejiga neurógena',        grupo: 'Lesión medular',           reps: 'Educación',  material: 'Material educativo, diario vesical', icon: 'medical',        objetivo: 'Independencia en el manejo vesical y prevención de complicaciones' },
  { nombre: 'Independencia LM',              grupo: 'Lesión medular',            reps: 'SCIM',       material: 'Dispositivos adaptativos según nivel', icon: 'trophy',        objetivo: 'Independencia en AVD según el nivel de lesión' },
  { nombre: 'Cuidado de piel LM',            grupo: 'Lesión medular',            reps: 'Diario',     material: 'Espejo de mango largo, cojín antiescaras', icon: 'shield',    objetivo: 'Prevención de úlceras por presión y educación para la salud' },
];


// ─── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
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

      {/* HEADER */}
      <View style={s.topBar}>
        <View style={s.topLeft}>
          {canGoBack && (
            <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={colors.mint} />
            </TouchableOpacity>
          )}
          <View>
            <Text style={s.title}>Rehabilitación</Text>
            <Text style={s.subtitle}>{filtrados.length} ejercicios · {grupos.length - 1} áreas clínicas</Text>
          </View>
        </View>
      </View>

      {/* FILTROS */}
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

      {/* LISTA */}
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

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
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