// © 2025–2026 Joana Uribe — Todos los derechos reservados.
// Uso, copia o distribución sin autorización escrita está prohibido.
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, useWindowDimensions, Modal, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { usePacientes } from '../context/PacientesContext';

// ─── CATÁLOGO DE EVALUACIONES ─────────────────────────────────────────────────
// Cada evaluación tiene: ítems con escala, interpretación por puntaje y áreas
export const CATALOGO = [
  {
    nombre: 'COPM',
    descripcion: 'Canadian Occupational Performance Measure',
    areas: ['AVD', 'Productividad', 'Ocio'],
    color: colors.sage,
    icon: 'person',
    tiempo: '30–40 min',
    poblacion: 'Adultos y niños (+5 años)',
    proposito: 'Detectar cambios en la autopercepción del desempeño e importancia en actividades cotidianas.',
    instrucciones: 'Entrevistar al paciente. Primero identifica actividades problema (máx. 5), luego las puntúa en desempeño e importancia.',
    secciones: [
      {
        titulo: 'Identificación de problemas ocupacionales',
        tipo: 'texto_libre',
        campos: [
          { id: 'problema1', label: 'Actividad problema 1', placeholder: 'Ej. Vestirse solo' },
          { id: 'problema2', label: 'Actividad problema 2', placeholder: 'Ej. Preparar comida' },
          { id: 'problema3', label: 'Actividad problema 3', placeholder: 'Ej. Ir al trabajo' },
          { id: 'problema4', label: 'Actividad problema 4 (opcional)', placeholder: 'Ej. Actividad social' },
          { id: 'problema5', label: 'Actividad problema 5 (opcional)', placeholder: 'Ej. Hobby' },
        ],
      },
      {
        titulo: 'Puntuación de desempeño (1–10)',
        tipo: 'escala_1_10',
        descripcion: '1 = No puede hacerlo · 10 = Lo hace extremadamente bien',
        campos: [
          { id: 'desem1', label: 'Desempeño actividad 1' },
          { id: 'desem2', label: 'Desempeño actividad 2' },
          { id: 'desem3', label: 'Desempeño actividad 3' },
        ],
      },
      {
        titulo: 'Puntuación de satisfacción (1–10)',
        tipo: 'escala_1_10',
        descripcion: '1 = Nada satisfecho/a · 10 = Completamente satisfecho/a',
        campos: [
          { id: 'satis1', label: 'Satisfacción actividad 1' },
          { id: 'satis2', label: 'Satisfacción actividad 2' },
          { id: 'satis3', label: 'Satisfacción actividad 3' },
        ],
      },
    ],
    calcularPuntaje: (respuestas) => {
      const desems = ['desem1','desem2','desem3'].map(k => parseFloat(respuestas[k] || 0));
      const satis  = ['satis1','satis2','satis3'].map(k => parseFloat(respuestas[k] || 0));
      const validD = desems.filter(v => v > 0);
      const validS = satis.filter(v => v > 0);
      const pD = validD.length ? (validD.reduce((a,b)=>a+b,0)/validD.length).toFixed(1) : '—';
      const pS = validS.length ? (validS.reduce((a,b)=>a+b,0)/validS.length).toFixed(1) : '—';
      return { desempeno: pD, satisfaccion: pS, total: pD };
    },
    interpretarPuntaje: (puntaje) => {
      const v = parseFloat(puntaje?.desempeno);
      if (isNaN(v)) return { nivel: '—', color: colors.textMuted };
      if (v >= 7) return { nivel: 'Desempeño satisfactorio', color: colors.sage };
      if (v >= 4) return { nivel: 'Desempeño moderado', color: '#e8c97a' };
      return { nivel: 'Desempeño limitado', color: '#e07070' };
    },
  },
  {
    nombre: 'FIM',
    descripcion: 'Functional Independence Measure',
    areas: ['Motor', 'Cognitivo'],
    color: colors.mint,
    icon: 'body',
    tiempo: '30–45 min',
    poblacion: 'Adultos con discapacidad neurológica u ortopédica',
    proposito: 'Medir el nivel de asistencia requerido para realizar AVD básicas.',
    instrucciones: 'Observar o entrevistar. Puntuar cada ítem del 1 (dependencia total) al 7 (independencia completa).',
    secciones: [
      {
        titulo: 'Subescala Motora — Autocuidado',
        tipo: 'escala_1_7',
        descripcion: '1=Asistencia total · 7=Independencia completa',
        campos: [
          { id: 'fim_comer',   label: 'Alimentación' },
          { id: 'fim_aseo',    label: 'Aseo personal' },
          { id: 'fim_bano',    label: 'Baño/ducha' },
          { id: 'fim_vestido_s', label: 'Vestido tronco superior' },
          { id: 'fim_vestido_i', label: 'Vestido tronco inferior' },
          { id: 'fim_wc',      label: 'Uso del inodoro' },
        ],
      },
      {
        titulo: 'Subescala Motora — Transferencias',
        tipo: 'escala_1_7',
        descripcion: '1=Asistencia total · 7=Independencia completa',
        campos: [
          { id: 'fim_tcama',   label: 'Transferencia cama/silla' },
          { id: 'fim_twc',     label: 'Transferencia inodoro' },
          { id: 'fim_tducha',  label: 'Transferencia ducha/bañera' },
        ],
      },
      {
        titulo: 'Subescala Motora — Locomoción',
        tipo: 'escala_1_7',
        descripcion: '1=Asistencia total · 7=Independencia completa',
        campos: [
          { id: 'fim_marcha',  label: 'Marcha/silla de ruedas' },
          { id: 'fim_escal',   label: 'Escaleras' },
        ],
      },
      {
        titulo: 'Subescala Cognitiva',
        tipo: 'escala_1_7',
        descripcion: '1=Asistencia total · 7=Independencia completa',
        campos: [
          { id: 'fim_comp',    label: 'Comprensión' },
          { id: 'fim_expr',    label: 'Expresión' },
          { id: 'fim_inter',   label: 'Interacción social' },
          { id: 'fim_mem',     label: 'Memoria' },
          { id: 'fim_rsol',    label: 'Resolución de problemas' },
        ],
      },
    ],
    calcularPuntaje: (respuestas) => {
      const motorKeys = ['fim_comer','fim_aseo','fim_bano','fim_vestido_s','fim_vestido_i','fim_wc','fim_tcama','fim_twc','fim_tducha','fim_marcha','fim_escal'];
      const cogKeys   = ['fim_comp','fim_expr','fim_inter','fim_mem','fim_rsol'];
      const motor = motorKeys.reduce((s,k) => s + (parseFloat(respuestas[k])||0), 0);
      const cog   = cogKeys.reduce((s,k)   => s + (parseFloat(respuestas[k])||0), 0);
      return { motor, cognitivo: cog, total: motor + cog };
    },
    interpretarPuntaje: (puntaje) => {
      const v = puntaje?.total || 0;
      if (v >= 108) return { nivel: 'Independencia completa', color: colors.sage };
      if (v >= 72)  return { nivel: 'Independencia modificada', color: '#a8d5a2' };
      if (v >= 36)  return { nivel: 'Dependencia moderada', color: '#e8c97a' };
      return { nivel: 'Dependencia severa', color: '#e07070' };
    },
  },
  {
    nombre: 'Barthel',
    descripcion: 'Índice de Barthel para AVD básicas',
    areas: ['AVD'],
    color: '#e8c97a',
    icon: 'medical',
    tiempo: '10–15 min',
    poblacion: 'Adultos mayores, pacientes neurológicos',
    proposito: 'Valorar el grado de independencia en las actividades básicas de la vida diaria.',
    instrucciones: 'Seleccionar el nivel de desempeño observado en cada actividad.',
    secciones: [
      {
        titulo: 'Actividades básicas',
        tipo: 'opciones_multiples',
        campos: [
          { id: 'b_comer',  label: 'Comer', opciones: [{v:0,l:'Dependiente'},{v:5,l:'Necesita ayuda'},{v:10,l:'Independiente'}] },
          { id: 'b_bano',   label: 'Baño', opciones: [{v:0,l:'Dependiente'},{v:5,l:'Independiente'}] },
          { id: 'b_aseo',   label: 'Aseo personal', opciones: [{v:0,l:'Necesita ayuda'},{v:5,l:'Independiente'}] },
          { id: 'b_vestir', label: 'Vestirse', opciones: [{v:0,l:'Dependiente'},{v:5,l:'Necesita ayuda'},{v:10,l:'Independiente'}] },
          { id: 'b_wc',     label: 'Uso del WC', opciones: [{v:0,l:'Dependiente'},{v:5,l:'Necesita ayuda'},{v:10,l:'Independiente'}] },
          { id: 'b_transfer',label: 'Transferencias', opciones: [{v:0,l:'Dependiente'},{v:5,l:'Gran ayuda'},{v:10,l:'Pequeña ayuda'},{v:15,l:'Independiente'}] },
          { id: 'b_deambul',label: 'Deambulación', opciones: [{v:0,l:'Dependiente'},{v:5,l:'En silla'},{v:10,l:'Necesita ayuda'},{v:15,l:'Independiente'}] },
          { id: 'b_escal',  label: 'Subir escaleras', opciones: [{v:0,l:'Dependiente'},{v:5,l:'Necesita ayuda'},{v:10,l:'Independiente'}] },
          { id: 'b_incont_u',label: 'Incontinencia urinaria', opciones: [{v:0,l:'Incontinente'},{v:5,l:'Accidente ocasional'},{v:10,l:'Continente'}] },
          { id: 'b_incont_f',label: 'Incontinencia fecal', opciones: [{v:0,l:'Incontinente'},{v:5,l:'Accidente ocasional'},{v:10,l:'Continente'}] },
        ],
      },
    ],
    calcularPuntaje: (respuestas) => {
      const total = ['b_comer','b_bano','b_aseo','b_vestir','b_wc','b_transfer','b_deambul','b_escal','b_incont_u','b_incont_f']
        .reduce((s,k) => s + (parseFloat(respuestas[k])||0), 0);
      return { total };
    },
    interpretarPuntaje: (puntaje) => {
      const v = puntaje?.total || 0;
      if (v === 100) return { nivel: 'Independencia total', color: colors.sage };
      if (v >= 60)   return { nivel: 'Dependencia leve', color: '#a8d5a2' };
      if (v >= 40)   return { nivel: 'Dependencia moderada', color: '#e8c97a' };
      if (v >= 20)   return { nivel: 'Dependencia severa', color: '#e09060' };
      return { nivel: 'Dependencia total', color: '#e07070' };
    },
  },
  {
    nombre: 'MMSE',
    descripcion: 'Mini-Mental State Examination',
    areas: ['Cognitivo'],
    color: '#a8a8e8',
    icon: 'bulb',
    tiempo: '10 min',
    poblacion: 'Adultos con sospecha de deterioro cognitivo',
    proposito: 'Cribado rápido del estado cognitivo: orientación, memoria, atención, lenguaje y praxis.',
    instrucciones: 'Aplicar en orden. Cada respuesta correcta suma 1 punto. Máximo 30 puntos.',
    secciones: [
      {
        titulo: 'Orientación (10 pts)',
        tipo: 'si_no',
        campos: [
          { id: 'mm_año',     label: '¿En qué año estamos?' },
          { id: 'mm_est',     label: '¿En qué estación del año?' },
          { id: 'mm_mes',     label: '¿En qué mes?' },
          { id: 'mm_dia',     label: '¿Qué día de la semana?' },
          { id: 'mm_fecha',   label: '¿Cuál es la fecha de hoy?' },
          { id: 'mm_pais',    label: '¿En qué país estamos?' },
          { id: 'mm_prov',    label: '¿En qué ciudad/estado?' },
          { id: 'mm_ciudad',  label: '¿En qué municipio/barrio?' },
          { id: 'mm_lugar',   label: '¿En qué lugar estamos ahora?' },
          { id: 'mm_piso',    label: '¿En qué piso/planta?' },
        ],
      },
      {
        titulo: 'Registro (3 pts)',
        tipo: 'si_no',
        descripcion: 'Decir 3 palabras y pedir que las repita inmediatamente.',
        campos: [
          { id: 'mm_pal1', label: 'Repite palabra 1 (ej. "peseta")' },
          { id: 'mm_pal2', label: 'Repite palabra 2 (ej. "caballo")' },
          { id: 'mm_pal3', label: 'Repite palabra 3 (ej. "manzana")' },
        ],
      },
      {
        titulo: 'Atención y cálculo (5 pts)',
        tipo: 'si_no',
        descripcion: 'Restar de 7 en 7 desde 100, o deletrear "MUNDO" al revés.',
        campos: [
          { id: 'mm_cal1', label: '100 − 7 = 93' },
          { id: 'mm_cal2', label: '93 − 7 = 86' },
          { id: 'mm_cal3', label: '86 − 7 = 79' },
          { id: 'mm_cal4', label: '79 − 7 = 72' },
          { id: 'mm_cal5', label: '72 − 7 = 65' },
        ],
      },
      {
        titulo: 'Memoria diferida (3 pts)',
        tipo: 'si_no',
        descripcion: 'Pedir que recuerde las 3 palabras anteriores.',
        campos: [
          { id: 'mm_rec1', label: 'Recuerda palabra 1' },
          { id: 'mm_rec2', label: 'Recuerda palabra 2' },
          { id: 'mm_rec3', label: 'Recuerda palabra 3' },
        ],
      },
      {
        titulo: 'Lenguaje y praxis (9 pts)',
        tipo: 'si_no',
        campos: [
          { id: 'mm_nom1',  label: 'Nombra objeto 1 (ej. lápiz)' },
          { id: 'mm_nom2',  label: 'Nombra objeto 2 (ej. reloj)' },
          { id: 'mm_rep',   label: 'Repite "ni sí, ni no, ni pero"' },
          { id: 'mm_ord1',  label: 'Ejecuta orden 3 pasos: toma papel' },
          { id: 'mm_ord2',  label: 'Ejecuta orden: dobla por la mitad' },
          { id: 'mm_ord3',  label: 'Ejecuta orden: pónlo en el suelo' },
          { id: 'mm_lee',   label: 'Lee y ejecuta: "cierre los ojos"' },
          { id: 'mm_escr',  label: 'Escribe una frase con sujeto y verbo' },
          { id: 'mm_cop',   label: 'Copia el dibujo (dos pentágonos)' },
        ],
      },
    ],
    calcularPuntaje: (respuestas) => {
      const total = Object.values(respuestas).reduce((s, v) => s + (v === 'si' ? 1 : 0), 0);
      return { total };
    },
    interpretarPuntaje: (puntaje) => {
      const v = puntaje?.total || 0;
      if (v >= 27) return { nivel: 'Sin deterioro cognitivo', color: colors.sage };
      if (v >= 24) return { nivel: 'Deterioro límite', color: '#e8c97a' };
      if (v >= 20) return { nivel: 'Deterioro leve', color: '#e09060' };
      if (v >= 10) return { nivel: 'Deterioro moderado', color: '#e07070' };
      return { nivel: 'Deterioro severo', color: '#c04040' };
    },
  },
  {
    nombre: 'Sensory Profile',
    descripcion: 'Perfil sensorial de Dunn (versión adultos)',
    areas: ['Sensorial'],
    color: colors.midGreen,
    icon: 'radio-button-on',
    tiempo: '15–20 min',
    poblacion: 'Adolescentes y adultos',
    proposito: 'Identificar patrones de procesamiento sensorial en contextos cotidianos.',
    instrucciones: 'El paciente responde qué tan frecuentemente experimenta cada situación. Escala 1 (casi nunca) a 5 (casi siempre).',
    secciones: [
      {
        titulo: 'Procesamiento auditivo',
        tipo: 'escala_1_5',
        descripcion: '1=Casi nunca · 5=Casi siempre',
        campos: [
          { id: 'sp_aud1', label: 'Me molestan los ruidos fuertes' },
          { id: 'sp_aud2', label: 'Me cuesta concentrarme si hay ruido de fondo' },
          { id: 'sp_aud3', label: 'Necesito que repitan las instrucciones orales' },
        ],
      },
      {
        titulo: 'Procesamiento táctil',
        tipo: 'escala_1_5',
        descripcion: '1=Casi nunca · 5=Casi siempre',
        campos: [
          { id: 'sp_tac1', label: 'Me molesta la textura de ciertas telas' },
          { id: 'sp_tac2', label: 'Evito ciertas texturas de alimentos' },
          { id: 'sp_tac3', label: 'Me incomoda que me toquen sin avisar' },
        ],
      },
      {
        titulo: 'Procesamiento visual',
        tipo: 'escala_1_5',
        descripcion: '1=Casi nunca · 5=Casi siempre',
        campos: [
          { id: 'sp_vis1', label: 'Me molesta la luz brillante' },
          { id: 'sp_vis2', label: 'Me distraen los movimientos en mi campo visual' },
          { id: 'sp_vis3', label: 'Noto detalles visuales que otros no perciben' },
        ],
      },
      {
        titulo: 'Procesamiento del movimiento',
        tipo: 'escala_1_5',
        descripcion: '1=Casi nunca · 5=Casi siempre',
        campos: [
          { id: 'sp_mov1', label: 'Me mareo fácilmente en el coche o ascensor' },
          { id: 'sp_mov2', label: 'Busco activamente el movimiento (mecerme, caminar)' },
          { id: 'sp_mov3', label: 'Evito actividades que requieran equilibrio' },
        ],
      },
    ],
    calcularPuntaje: (respuestas) => {
      const total = Object.values(respuestas).reduce((s,v) => s + (parseFloat(v)||0), 0);
      return { total };
    },
    interpretarPuntaje: (puntaje) => {
      const v = puntaje?.total || 0;
      const max = 60;
      if (v >= max*0.8) return { nivel: 'Alta sensibilidad sensorial', color: '#a8a8e8' };
      if (v >= max*0.5) return { nivel: 'Sensibilidad moderada', color: '#e8c97a' };
      return { nivel: 'Sensibilidad típica', color: colors.sage };
    },
  },
];

const TODAS_LAS_AREAS = ['Todos', ...new Set(CATALOGO.flatMap(e => e.areas))];

// ─── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function EvaluacionScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const { pacientes } = usePacientes();

  const [filtroArea,   setFiltroArea]   = useState('Todos');
  const [busqueda,     setBusqueda]     = useState('');
  const [expandida,    setExpandida]    = useState(null);
  const [modalPac,     setModalPac]     = useState(null);   // evaluación a vincular
  const [modalCustom,  setModalCustom]  = useState(false);
  const [customNombre, setCustomNombre] = useState('');
  const [customDesc,   setCustomDesc]   = useState('');
  const [customAreas,  setCustomAreas]  = useState('');
  const [customEvals,  setCustomEvals]  = useState([]);     // evaluaciones personalizadas

  const isWide = width >= 600;
  const maxW   = Math.min(width, 900);
  const cardW  = isWide ? (maxW - 48 - 16) / 2 : maxW - 32;
  const canGoBack = navigation?.canGoBack?.() ?? false;

  // Combinar catálogo + personalizadas
  const todasEvals = useMemo(() => [...CATALOGO, ...customEvals], [customEvals]);

  // Filtrar
  const filtradas = useMemo(() => todasEvals.filter(ev => {
    const matchArea = filtroArea === 'Todos' || ev.areas.includes(filtroArea);
    const matchBusq = ev.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                      ev.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return matchArea && matchBusq;
  }), [todasEvals, filtroArea, busqueda]);

  // Obtener última aplicación de una evaluación desde los pacientes
  const getUltimaAplicacion = (nombreEval) => {
    let ultima = null;
    pacientes.forEach(p => {
      (p.evaluaciones || []).forEach(ev => {
        if (ev.nombre === nombreEval) {
          if (!ultima || new Date(ev.fecha) > new Date(ultima.fecha)) {
            ultima = { ...ev, paciente: p.nombre };
          }
        }
      });
    });
    return ultima;
  };

  const guardarCustom = () => {
    if (!customNombre.trim()) { Alert.alert('Falta el nombre'); return; }
    const nueva = {
      nombre: customNombre.trim(),
      descripcion: customDesc.trim() || 'Evaluación personalizada',
      areas: customAreas.split(',').map(a => a.trim()).filter(Boolean),
      color: colors.midGreen,
      icon: 'create',
      tiempo: '—',
      poblacion: '—',
      proposito: customDesc.trim(),
      instrucciones: 'Aplicar según criterio clínico.',
      secciones: [
        {
          titulo: 'Observaciones',
          tipo: 'texto_libre',
          campos: [
            { id: 'obs', label: 'Observaciones clínicas', placeholder: 'Escribir hallazgos...' },
            { id: 'puntaje_manual', label: 'Puntaje total (si aplica)', placeholder: 'Ej. 45' },
          ],
        },
      ],
      calcularPuntaje: (r) => ({ total: parseFloat(r.puntaje_manual) || 0 }),
      interpretarPuntaje: (p) => ({ nivel: p?.total > 0 ? `Puntaje: ${p.total}` : 'Sin puntaje', color: colors.sage }),
      esPersonalizada: true,
    };
    setCustomEvals(prev => [...prev, nueva]);
    setCustomNombre(''); setCustomDesc(''); setCustomAreas('');
    setModalCustom(false);
  };

  return (
    <SafeAreaView style={s.safe}>

      {/* ── HEADER ── */}
      <View style={s.topBar}>
        <View style={s.topRow}>
          <View style={s.topLeft}>
            {canGoBack && (
              <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={20} color={colors.mint} />
              </TouchableOpacity>
            )}
            <View>
              <Text style={s.title}>Evaluación</Text>
              <Text style={s.subtitle}>{filtradas.length} herramientas · {TODAS_LAS_AREAS.length - 1} áreas</Text>
            </View>
          </View>
          <TouchableOpacity style={s.addBtn} onPress={() => setModalCustom(true)}>
            <Ionicons name="add" size={20} color={colors.deepForest} />
            <Text style={s.addBtnTxt}>Nueva</Text>
          </TouchableOpacity>
        </View>

        {/* Buscador */}
        <View style={s.searchBox}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput
            style={s.searchInput}
            placeholder="Buscar evaluación..."
            placeholderTextColor={colors.textMuted}
            value={busqueda}
            onChangeText={setBusqueda}
          />
          {busqueda.length > 0 && (
            <TouchableOpacity onPress={() => setBusqueda('')}>
              <Ionicons name="close-circle" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── FILTROS POR ÁREA ── */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={s.chipScroll}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {TODAS_LAS_AREAS.map(area => (
          <TouchableOpacity
            key={area}
            style={[s.chip, filtroArea === area && s.chipActive]}
            onPress={() => setFiltroArea(area)}
          >
            <Text style={[s.chipTxt, filtroArea === area && s.chipActiveTxt]}>{area}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── LISTA ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={[s.lista, isWide && s.listaWeb]}
      >
        {filtradas.map((ev, i) => {
          const ultimaApl = getUltimaAplicacion(ev.nombre);
          const isExpanded = expandida === ev.nombre;

          return (
            <TouchableOpacity
              key={ev.nombre}
              style={[s.card, { width: cardW }, isExpanded && s.cardActive]}
              onPress={() => setExpandida(isExpanded ? null : ev.nombre)}
              activeOpacity={0.85}
            >
              {/* Barra de color */}
              <View style={[s.colorBar, { backgroundColor: ev.color || colors.sage }]} />

              <View style={s.cardInner}>
                {/* Header */}
                <View style={s.cardHeader}>
                  <View style={s.badgeRow}>
                    <View style={[s.badge, { backgroundColor: ev.color + '33' || colors.midGreen }]}>
                      <Ionicons name={ev.icon || 'document'} size={14} color={ev.color || colors.sage} />
                      <Text style={[s.badgeTxt, { color: ev.color || colors.sage }]}>{ev.nombre}</Text>
                    </View>
                    {ev.esPersonalizada && (
                      <View style={s.customTag}>
                        <Text style={s.customTagTxt}>Personalizada</Text>
                      </View>
                    )}
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18} color={colors.textMuted}
                  />
                </View>

                <Text style={s.desc}>{ev.descripcion}</Text>

                {/* Tags de área */}
                <View style={s.areasRow}>
                  {ev.areas.map(a => (
                    <View key={a} style={s.areaChip}>
                      <Text style={s.areaChipTxt}>{a}</Text>
                    </View>
                  ))}
                </View>

                {/* Última aplicación */}
                {ultimaApl ? (
                  <View style={s.ultimaRow}>
                    <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                    <Text style={s.ultimaTxt}>
                      Última: {ultimaApl.fecha} · {ultimaApl.paciente}
                    </Text>
                  </View>
                ) : (
                  <View style={s.ultimaRow}>
                    <Ionicons name="ellipse-outline" size={12} color={colors.textMuted} />
                    <Text style={s.ultimaTxt}>Sin aplicaciones registradas</Text>
                  </View>
                )}

                {/* Expandido */}
                {isExpanded && (
                  <View style={s.expanded}>
                    {/* Info rápida */}
                    <View style={s.infoGrid}>
                      <View style={s.infoItem}>
                        <Ionicons name="time" size={13} color={colors.sage} />
                        <Text style={s.infoTxt}>{ev.tiempo}</Text>
                      </View>
                      <View style={s.infoItem}>
                        <Ionicons name="people" size={13} color={colors.sage} />
                        <Text style={s.infoTxt}>{ev.poblacion}</Text>
                      </View>
                    </View>
                    <Text style={s.propositoTxt}>{ev.proposito}</Text>

                    {/* Botones */}
                    <TouchableOpacity
                      style={s.actionBtn}
                      onPress={() => setModalPac(ev)}
                    >
                      <Ionicons name="play" size={16} color={colors.deepForest} />
                      <Text style={s.actionBtnTxt}>Iniciar evaluación</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={s.outlineBtn}
                      onPress={() => navigation.navigate('EvaluacionResultados', { evaluacion: ev.nombre })}
                    >
                      <Ionicons name="bar-chart" size={16} color={colors.mint} />
                      <Text style={s.outlineBtnTxt}>Ver resultados previos</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── MODAL: SELECCIONAR PACIENTE ANTES DE INICIAR ── */}
      <Modal visible={!!modalPac} transparent animationType="slide">
        <View style={m.overlay}>
          <View style={[m.box, isWide && m.boxWeb]}>
            <View style={m.header}>
              <View style={{ flex: 1 }}>
                <Text style={m.titulo}>Seleccionar paciente</Text>
                <Text style={m.sub}>Para: {modalPac?.nombre}</Text>
              </View>
              <TouchableOpacity style={m.closeBtn} onPress={() => setModalPac(null)}>
                <Ionicons name="close" size={20} color={colors.mint} />
              </TouchableOpacity>
            </View>

            {pacientes.length === 0 ? (
              <View style={m.sinPac}>
                <Ionicons name="person-outline" size={32} color={colors.textMuted} />
                <Text style={m.sinPacTxt}>No hay pacientes registrados</Text>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
                {pacientes.map(p => (
                  <TouchableOpacity
                    key={p.id}
                    style={m.pacRow}
                    onPress={() => {
                      setModalPac(null);
                      navigation.navigate('EvaluacionDetalle', {
                        evaluacionNombre: modalPac.nombre,
                        pacienteId: p.id,
                      });
                    }}
                  >
                    <View style={m.pacAvatar}>
                      <Text style={m.pacAvatarTxt}>{p.nombre.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={m.pacNombre}>{p.nombre}</Text>
                      <Text style={m.pacSub}>
                        {(p.evaluaciones || []).filter(e => e.nombre === modalPac?.nombre).length > 0
                          ? `${(p.evaluaciones||[]).filter(e=>e.nombre===modalPac?.nombre).length} aplicaciones previas`
                          : 'Sin aplicaciones previas'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            <View style={{ height: 16 }} />
          </View>
        </View>
      </Modal>

      {/* ── MODAL: AGREGAR EVALUACIÓN PERSONALIZADA ── */}
      <Modal visible={modalCustom} transparent animationType="slide">
        <View style={m.overlay}>
          <View style={[m.box, isWide && m.boxWeb]}>
            <View style={m.header}>
              <View style={{ flex: 1 }}>
                <Text style={m.titulo}>Nueva evaluación</Text>
                <Text style={m.sub}>Personalizada</Text>
              </View>
              <TouchableOpacity style={m.closeBtn} onPress={() => setModalCustom(false)}>
                <Ionicons name="close" size={20} color={colors.mint} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={m.fieldLabel}>Nombre *</Text>
              <TextInput
                style={m.input}
                placeholder="Ej. Evaluación de marcha funcional"
                placeholderTextColor={colors.textMuted}
                value={customNombre}
                onChangeText={setCustomNombre}
              />
              <Text style={m.fieldLabel}>Descripción</Text>
              <TextInput
                style={[m.input, { height: 72 }]}
                placeholder="Propósito y población objetivo..."
                placeholderTextColor={colors.textMuted}
                value={customDesc}
                onChangeText={setCustomDesc}
                multiline
              />
              <Text style={m.fieldLabel}>Áreas (separadas por coma)</Text>
              <TextInput
                style={m.input}
                placeholder="Ej. AVD, Motor, Cognitivo"
                placeholderTextColor={colors.textMuted}
                value={customAreas}
                onChangeText={setCustomAreas}
              />

              <TouchableOpacity style={m.guardarBtn} onPress={guardarCustom}>
                <Ionicons name="checkmark-circle" size={18} color={colors.deepForest} />
                <Text style={m.guardarBtnTxt}>Guardar evaluación</Text>
              </TouchableOpacity>
              <View style={{ height: 16 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.deepForest },
  topBar:        { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 },
  topRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  topLeft:       { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn:       { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.darkGreen, justifyContent: 'center', alignItems: 'center' },
  title:         { color: colors.mint, fontSize: 22, fontWeight: '700' },
  subtitle:      { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  addBtn:        { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.sage, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  addBtnTxt:     { color: colors.deepForest, fontWeight: '700', fontSize: 13 },
  searchBox:     { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.darkGreen, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  searchInput:   { flex: 1, color: colors.mint, fontSize: 14, padding: 0 },
  chipScroll:    { maxHeight: 44, flexGrow: 0, flexShrink: 0, marginBottom: 12 },
  chip:          { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.darkGreen },
  chipActive:    { backgroundColor: colors.sage },
  chipTxt:       { color: colors.textMuted, fontSize: 12 },
  chipActiveTxt: { color: colors.deepForest, fontWeight: '600' },
  lista:         { paddingHorizontal: 16, paddingBottom: 40 },
  listaWeb:      { paddingHorizontal: 24, flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center', alignItems: 'flex-start' },
  card:          { backgroundColor: colors.darkGreen, borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: 'transparent', overflow: 'hidden' },
  cardActive:    { borderColor: colors.sage },
  colorBar:      { height: 4, width: '100%' },
  cardInner:     { padding: 16 },
  cardHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badgeRow:      { flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
  badge:         { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeTxt:      { fontWeight: '700', fontSize: 13 },
  customTag:     { backgroundColor: colors.midGreen, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  customTagTxt:  { color: colors.mint, fontSize: 10 },
  desc:          { color: colors.textMuted, fontSize: 13, marginBottom: 10, lineHeight: 18 },
  areasRow:      { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 8 },
  areaChip:      { backgroundColor: colors.deepForest, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  areaChipTxt:   { color: colors.sage, fontSize: 11 },
  ultimaRow:     { flexDirection: 'row', alignItems: 'center', gap: 5 },
  ultimaTxt:     { color: colors.textMuted, fontSize: 11 },
  expanded:      { marginTop: 14, gap: 10 },
  infoGrid:      { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginBottom: 6 },
  infoItem:      { flexDirection: 'row', alignItems: 'center', gap: 5 },
  infoTxt:       { color: colors.textMuted, fontSize: 12 },
  propositoTxt:  { color: colors.mint, fontSize: 13, lineHeight: 18, backgroundColor: colors.deepForest, borderRadius: 10, padding: 10, marginBottom: 4 },
  actionBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.sage, borderRadius: 12, paddingVertical: 12 },
  actionBtnTxt:  { color: colors.deepForest, fontWeight: '700' },
  outlineBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: colors.midGreen, borderRadius: 12, paddingVertical: 12 },
  outlineBtnTxt: { color: colors.mint, fontWeight: '500' },
});

const m = StyleSheet.create({
  overlay:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.72)', justifyContent: 'flex-end' },
  box:          { backgroundColor: colors.darkGreen, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, maxHeight: '90%' },
  boxWeb:       { maxWidth: 520, alignSelf: 'center', width: '100%', borderRadius: 22, marginBottom: 40 },
  header:       { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 18 },
  titulo:       { color: colors.mint, fontSize: 18, fontWeight: '700' },
  sub:          { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  closeBtn:     { padding: 6, backgroundColor: colors.midGreen, borderRadius: 10 },
  sinPac:       { alignItems: 'center', gap: 8, paddingVertical: 24 },
  sinPacTxt:    { color: colors.textMuted, fontSize: 14 },
  pacRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.deepForest, borderRadius: 13, padding: 12, marginBottom: 8 },
  pacAvatar:    { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.midGreen, justifyContent: 'center', alignItems: 'center' },
  pacAvatarTxt: { color: colors.mint, fontSize: 16, fontWeight: '700' },
  pacNombre:    { color: colors.mint, fontSize: 13, fontWeight: '600' },
  pacSub:       { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  fieldLabel:   { color: colors.sage, fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 14 },
  input:        { backgroundColor: colors.deepForest, borderRadius: 12, padding: 12, color: colors.mint, fontSize: 14, borderWidth: 1, borderColor: colors.midGreen },
  guardarBtn:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.sage, borderRadius: 13, paddingVertical: 13, marginTop: 20 },
  guardarBtnTxt:{ color: colors.deepForest, fontWeight: '700', fontSize: 14 },
});