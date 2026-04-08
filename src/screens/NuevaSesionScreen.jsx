// © 2025–2026 Joana Uribe — Todos los derechos reservados.
// Uso, copia o distribución sin autorización escrita está prohibido.
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Alert, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { usePacientes } from '../context/PacientesContext';

// ─── PALETA NEOMÓRFICA ────────────────────────────────────────────────────────
const NEO_BASE  = '#0a2a2b';
const NEO_LIGHT = '#0f3638';
const NEO_DARK  = '#031618';

// ─── CONSTANTES ───────────────────────────────────────────────────────────────
const ACTIVIDADES_SUGERIDAS = [
  'Movilización activa','Termoterapia','Crioterapia','Fortalecimiento rotadores',
  'Facilitación neuromuscular','AVD básicas','Integración sensorial','Pinza lateral',
  'Marcha supervisada','Equilibrio','Secuencia cognitiva','Ejercicio diafragmático',
  'Recorte y pegado','Escritura','Juego de texturas',
];
const DURACIONES = ['30 min','45 min','50 min','60 min','90 min'];

// ─── SECCIONES SOAP ───────────────────────────────────────────────────────────
const SOAP_CONFIG = [
  {
    key:    'soap_s',
    letra:  'S',
    titulo: 'Subjetivo',
    color:  '#8CB79B',   // sage
    desc:   'Lo que reporta el paciente: síntomas, dolor, estado de ánimo, preocupaciones.',
    ph:     'Ej. "El paciente refiere dolor 4/10 en hombro derecho al elevar el brazo, mejora desde la sesión anterior..."',
    icon:   'chatbubble-outline',
  },
  {
    key:    'soap_o',
    letra:  'O',
    titulo: 'Objetivo',
    color:  '#e8c97a',
    desc:   'Observaciones clínicas: ROM, fuerza, tono, desempeño observado, pruebas aplicadas.',
    ph:     'Ej. "ROM activo de hombro: flexión 120°, abducción 90°. Fuerza deltoides 4/5. Completó 3/5 actividades propuestas..."',
    icon:   'eye-outline',
  },
  {
    key:    'soap_a',
    letra:  'A',
    titulo: 'Análisis / Evaluación',
    color:  '#a8a8e8',
    desc:   'Interpretación clínica: respuesta al tratamiento, progreso hacia objetivos, problemas identificados.',
    ph:     'Ej. "Progresa favorablemente en AVD básicas. Persiste limitación en alcance sobre cabeza. Se sugiere graduar resistencia..."',
    icon:   'analytics-outline',
  },
  {
    key:    'soap_p',
    letra:  'P',
    titulo: 'Plan',
    color:  '#a8d5a2',
    desc:   'Próxima sesión, ajustes terapéuticos, objetivos, tareas para casa, derivaciones.',
    ph:     'Ej. "Continuar fortalecimiento de manguito rotador. Agregar actividades bimanuales en siguiente sesión. Tarea: ejercicios de Codman diarios..."',
    icon:   'list-outline',
  },
];

// ─── COMPONENTE SECCIÓN SOAP ──────────────────────────────────────────────────
function SoapField({ config, value, onChange }) {
  const [expandido, setExpandido] = useState(true);

  return (
    <View style={[sf.wrap, { borderLeftColor: config.color }]}>
      {/* Header de sección */}
      <TouchableOpacity
        style={sf.header}
        onPress={() => setExpandido(v => !v)}
        activeOpacity={0.8}
      >
        <View style={[sf.letraBadge, { backgroundColor: config.color + '22', borderColor: config.color + '66' }]}>
          <Text style={[sf.letra, { color: config.color }]}>{config.letra}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={sf.titulo}>{config.titulo}</Text>
          <Text style={sf.desc} numberOfLines={expandido ? undefined : 1}>{config.desc}</Text>
        </View>
        <Ionicons
          name={expandido ? 'chevron-up' : 'chevron-down'}
          size={16} color={colors.textMuted}
        />
      </TouchableOpacity>

      {/* Campo de texto */}
      {expandido && (
        <TextInput
          style={[sf.input, value.length > 0 && { borderColor: config.color + '55' }]}
          value={value}
          onChangeText={onChange}
          placeholder={config.ph}
          placeholderTextColor={colors.textMuted}
          multiline
          textAlignVertical="top"
        />
      )}

      {/* Preview si está colapsado y tiene contenido */}
      {!expandido && value.length > 0 && (
        <Text style={sf.preview} numberOfLines={2}>{value}</Text>
      )}
    </View>
  );
}

const sf = StyleSheet.create({
  wrap: {
    backgroundColor: NEO_BASE,
    borderRadius: 16,
    borderLeftWidth: 4,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: NEO_LIGHT,
    shadowColor: NEO_DARK,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.8, shadowRadius: 6, elevation: 5,
  },
  header:    { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  letraBadge:{ width: 32, height: 32, borderRadius: 10, borderWidth: 1,
               justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  letra:     { fontSize: 16, fontWeight: '900' },
  titulo:    { color: colors.mint, fontSize: 14, fontWeight: '700' },
  desc:      { color: colors.textMuted, fontSize: 11, marginTop: 2, lineHeight: 16 },
  input:     { backgroundColor: colors.darkGreen, borderRadius: 10, padding: 12,
               color: colors.mint, fontSize: 13, lineHeight: 20,
               minHeight: 88, borderWidth: 1, borderColor: NEO_LIGHT },
  preview:   { color: colors.textMuted, fontSize: 12, fontStyle: 'italic',
               paddingHorizontal: 4, lineHeight: 18 },
});

// ─── PANEL NEOMÓRFICO ─────────────────────────────────────────────────────────
function NeoSection({ titulo, icon, children, badge }) {
  return (
    <View style={ns.sec}>
      <View style={ns.secHeader}>
        <Ionicons name={icon} size={16} color={colors.sage} />
        <Text style={ns.secTitle}>{titulo}</Text>
        {badge != null && (
          <View style={ns.badge}>
            <Text style={ns.badgeTxt}>{badge}</Text>
          </View>
        )}
      </View>
      <View style={ns.box}>
        {children}
      </View>
    </View>
  );
}

const ns = StyleSheet.create({
  sec:       { marginHorizontal: 16, marginBottom: 20 },
  secHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  secTitle:  { color: colors.sage, fontSize: 15, fontWeight: '700', flex: 1 },
  badge:     { backgroundColor: colors.midGreen, borderRadius: 10,
               paddingHorizontal: 8, paddingVertical: 2 },
  badgeTxt:  { color: colors.mint, fontSize: 11, fontWeight: '600' },
  box:       { backgroundColor: NEO_BASE, borderRadius: 18, padding: 16, gap: 14,
               borderWidth: 1, borderColor: NEO_LIGHT,
               shadowColor: NEO_DARK, shadowOffset: { width: 5, height: 5 },
               shadowOpacity: 0.9, shadowRadius: 10, elevation: 8 },
});

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function NuevaSesionScreen({ route, navigation }) {
  const { pacienteId } = route.params || {};
  const { pacientes, agregarSesion } = usePacientes();
  const paciente = pacientes.find(p => p.id === pacienteId);

  const hoy = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    fecha:          hoy,
    duracion:       '50 min',
    terapeuta:      'Fernanda TO',
    objetivo:       '',
    // SOAP
    soap_s:         '',
    soap_o:         '',
    soap_a:         '',
    soap_p:         '',
  });
  const [acts,      setActs]      = useState([]);
  const [custom,    setCustom]    = useState('');
  const [guardando, setGuardando] = useState(false);

  const setF = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const toggleAct = (a) =>
    setActs(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const addCustom = () => {
    const t = custom.trim();
    if (t && !acts.includes(t)) setActs(prev => [...prev, t]);
    setCustom('');
  };

  // Progreso del SOAP
  const soapLlenos = SOAP_CONFIG.filter(c => form[c.key].trim().length > 0).length;

  const guardar = async () => {
    if (!pacienteId) { Alert.alert('Error', 'No se identificó el paciente.'); return; }
    if (acts.length === 0) { Alert.alert('Sin actividades', 'Agrega al menos una actividad.'); return; }
    setGuardando(true);
    try {
      agregarSesion(pacienteId, { ...form, actividades: acts });
      Alert.alert('✅ Sesión registrada', 'La sesión fue guardada correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'No se pudo guardar la sesión.');
    } finally {
      setGuardando(false);
    }
  };

  if (!paciente) return (
    <SafeAreaView style={s.safe}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
        <Text style={{ color: colors.mint }}>Paciente no encontrado</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.sage }}>Volver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>

        {/* ── HEADER ── */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.mint} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>Nueva sesión</Text>
            <Text style={s.subtitle}>{paciente.nombre}</Text>
          </View>
          <TouchableOpacity onPress={guardar} style={s.saveBtn} disabled={guardando}>
            {guardando
              ? <ActivityIndicator size="small" color={colors.deepForest} />
              : <><Ionicons name="checkmark" size={16} color={colors.deepForest} /><Text style={s.saveBtnTxt}>Guardar</Text></>
            }
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingTop: 8 }}
        >

          {/* ── INFORMACIÓN GENERAL ── */}
          <NeoSection titulo="Información de la sesión" icon="information-circle-outline">
            {/* Fecha */}
            <View style={s.campo}>
              <Text style={s.label}>Fecha</Text>
              <TextInput
                style={s.input}
                value={form.fecha}
                onChangeText={v => setF('fecha', v)}
                placeholderTextColor={colors.textMuted}
              />
            </View>
            {/* Duración */}
            <View style={s.campo}>
              <Text style={s.label}>Duración</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}>
                {DURACIONES.map(d => (
                  <TouchableOpacity
                    key={d}
                    style={[s.chip, form.duracion === d && s.chipActive]}
                    onPress={() => setF('duracion', d)}
                  >
                    <Text style={[s.chipTxt, form.duracion === d && s.chipActiveTxt]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            {/* Terapeuta */}
            <View style={s.campo}>
              <Text style={s.label}>Terapeuta</Text>
              <TextInput
                style={s.input}
                value={form.terapeuta}
                onChangeText={v => setF('terapeuta', v)}
                placeholderTextColor={colors.textMuted}
              />
            </View>
            {/* Objetivo */}
            <View style={s.campo}>
              <Text style={s.label}>Objetivo de la sesión</Text>
              <TextInput
                style={[s.input, s.inputMulti]}
                value={form.objetivo}
                onChangeText={v => setF('objetivo', v)}
                placeholder="¿Qué se espera lograr hoy?"
                placeholderTextColor={colors.textMuted}
                multiline
              />
            </View>
          </NeoSection>

          {/* ── ACTIVIDADES ── */}
          <NeoSection titulo="Actividades" icon="fitness-outline" badge={acts.length || undefined}>
            <View style={s.actGrid}>
              {ACTIVIDADES_SUGERIDAS.map(a => (
                <TouchableOpacity
                  key={a}
                  style={[s.actChip, acts.includes(a) && s.actChipActive]}
                  onPress={() => toggleAct(a)}
                >
                  {acts.includes(a) && (
                    <Ionicons name="checkmark" size={11} color={colors.deepForest} />
                  )}
                  <Text style={[s.actTxt, acts.includes(a) && s.actActiveTxt]}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={s.customRow}>
              <TextInput
                style={s.customInput}
                value={custom}
                onChangeText={setCustom}
                placeholder="Agregar otra actividad..."
                placeholderTextColor={colors.textMuted}
                onSubmitEditing={addCustom}
                returnKeyType="done"
              />
              <TouchableOpacity style={s.customAddBtn} onPress={addCustom}>
                <Ionicons name="add" size={20} color={colors.mint} />
              </TouchableOpacity>
            </View>
          </NeoSection>

          {/* ── NOTA SOAP ── */}
          <View style={s.soapHeaderWrap}>
            <View style={s.soapTitleRow}>
              <View style={s.soapIconWrap}>
                <Text style={s.soapIconTxt}>SOAP</Text>
              </View>
              <View>
                <Text style={s.soapTitulo}>Nota clínica SOAP</Text>
                <Text style={s.soapSub}>Documentación estructurada de la sesión</Text>
              </View>
              {/* Indicador de progreso */}
              <View style={s.soapProgWrap}>
                {SOAP_CONFIG.map(c => (
                  <View
                    key={c.key}
                    style={[s.soapProgDot,
                      { backgroundColor: form[c.key].trim() ? c.color : NEO_LIGHT }]}
                  />
                ))}
              </View>
            </View>
            {/* Barra de progreso */}
            <View style={s.soapBarTrack}>
              <View style={[s.soapBarFill, { width: `${(soapLlenos / 4) * 100}%` }]} />
            </View>
            <Text style={s.soapBarLabel}>{soapLlenos}/4 secciones completadas</Text>
          </View>

          {/* Campos SOAP */}
          <View style={s.soapFields}>
            {SOAP_CONFIG.map(config => (
              <SoapField
                key={config.key}
                config={config}
                value={form[config.key]}
                onChange={v => setF(config.key, v)}
              />
            ))}
          </View>

          {/* ── BOTÓN GUARDAR ── */}
          <View style={s.guardarWrap}>
            <TouchableOpacity
              style={[s.guardarBtn, guardando && { opacity: 0.6 }]}
              onPress={guardar}
              disabled={guardando}
            >
              {guardando
                ? <ActivityIndicator size="small" color={colors.deepForest} />
                : <>
                    <Ionicons name="checkmark-circle" size={18} color={colors.deepForest} />
                    <Text style={s.guardarBtnTxt}>Guardar sesión</Text>
                  </>
              }
            </TouchableOpacity>
          </View>

          <View style={{ height: 60 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: colors.deepForest },

  // Header
  header:   { flexDirection: 'row', alignItems: 'center', gap: 10,
              padding: 16, paddingBottom: 12 },
  backBtn:  { width: 38, height: 38, borderRadius: 12,
              backgroundColor: NEO_BASE, justifyContent: 'center', alignItems: 'center',
              borderWidth: 1, borderColor: NEO_LIGHT,
              shadowColor: NEO_DARK, shadowOffset: { width: 3, height: 3 },
              shadowOpacity: 0.8, shadowRadius: 5, elevation: 5 },
  title:    { color: colors.mint, fontSize: 18, fontWeight: '700' },
  subtitle: { color: colors.textMuted, fontSize: 12, marginTop: 1 },
  saveBtn:  { flexDirection: 'row', alignItems: 'center', gap: 5,
              backgroundColor: colors.sage, borderRadius: 12,
              paddingHorizontal: 14, paddingVertical: 10,
              shadowColor: NEO_DARK, shadowOffset: { width: 3, height: 3 },
              shadowOpacity: 0.8, shadowRadius: 5, elevation: 5 },
  saveBtnTxt: { color: colors.deepForest, fontWeight: '700', fontSize: 13 },

  // Campos
  campo:    { gap: 6 },
  label:    { color: colors.textMuted, fontSize: 11, fontWeight: '600',
              textTransform: 'uppercase', letterSpacing: 0.4 },
  input:    { backgroundColor: colors.darkGreen, borderRadius: 10, padding: 12,
              color: colors.mint, fontSize: 14,
              borderWidth: 1, borderColor: NEO_LIGHT },
  inputMulti: { minHeight: 70, textAlignVertical: 'top' },

  // Chips duración
  chip:         { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                  backgroundColor: colors.darkGreen, borderWidth: 1, borderColor: NEO_LIGHT },
  chipActive:   { backgroundColor: colors.sage, borderColor: colors.sage },
  chipTxt:      { color: colors.textMuted, fontSize: 13 },
  chipActiveTxt:{ color: colors.deepForest, fontWeight: '700' },

  // Actividades
  actGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actChip:      { flexDirection: 'row', alignItems: 'center', gap: 4,
                  paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
                  backgroundColor: colors.darkGreen, borderWidth: 1, borderColor: NEO_LIGHT },
  actChipActive:{ backgroundColor: colors.sage, borderColor: colors.sage },
  actTxt:       { color: colors.textMuted, fontSize: 12 },
  actActiveTxt: { color: colors.deepForest, fontWeight: '600' },
  customRow:    { flexDirection: 'row', gap: 8 },
  customInput:  { flex: 1, backgroundColor: colors.darkGreen, borderRadius: 10,
                  padding: 10, color: colors.mint, fontSize: 13,
                  borderWidth: 1, borderColor: NEO_LIGHT },
  customAddBtn: { backgroundColor: colors.midGreen, borderRadius: 10,
                  padding: 10, justifyContent: 'center' },

  // SOAP header
  soapHeaderWrap: { marginHorizontal: 16, marginBottom: 12 },
  soapTitleRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  soapIconWrap:   { width: 44, height: 44, borderRadius: 13,
                    backgroundColor: NEO_BASE, borderWidth: 1, borderColor: colors.sage + '66',
                    justifyContent: 'center', alignItems: 'center',
                    shadowColor: NEO_DARK, shadowOffset: { width: 3, height: 3 },
                    shadowOpacity: 0.8, shadowRadius: 5, elevation: 5 },
  soapIconTxt:    { color: colors.sage, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  soapTitulo:     { color: colors.mint, fontSize: 16, fontWeight: '700' },
  soapSub:        { color: colors.textMuted, fontSize: 11, marginTop: 1 },
  soapProgWrap:   { flexDirection: 'row', gap: 5, marginLeft: 'auto' },
  soapProgDot:    { width: 10, height: 10, borderRadius: 5 },
  soapBarTrack:   { height: 4, backgroundColor: NEO_LIGHT, borderRadius: 2 },
  soapBarFill:    { height: 4, backgroundColor: colors.sage, borderRadius: 2 },
  soapBarLabel:   { color: colors.textMuted, fontSize: 11, marginTop: 5 },

  // SOAP fields container
  soapFields: { paddingHorizontal: 16, gap: 10, marginBottom: 20 },

  // Guardar
  guardarWrap: { marginHorizontal: 16 },
  guardarBtn:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                 gap: 8, backgroundColor: colors.sage, borderRadius: 16,
                 paddingVertical: 16,
                 shadowColor: NEO_DARK, shadowOffset: { width: 4, height: 4 },
                 shadowOpacity: 0.8, shadowRadius: 8, elevation: 8 },
  guardarBtnTxt: { color: colors.deepForest, fontWeight: '700', fontSize: 15 },
});