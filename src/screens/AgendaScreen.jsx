// © 2025–2026 Joana Uribe — Todos los derechos reservados.
// Uso, copia o distribución sin autorización escrita está prohibido.
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Alert, Modal, KeyboardAvoidingView, Platform,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons }     from '@expo/vector-icons';
import colors           from '../theme/colors';
import { usePacientes } from '../context/PacientesContext';

// ─── CONSTANTES ───────────────────────────────────────────────────────────────
const HORAS = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
               '12:00','12:30','13:00','13:30','14:00','15:00','16:00','17:00','18:00'];
const TIPOS = ['Evaluación inicial','Sesión de tratamiento','Seguimiento','Alta','Otro'];
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio',
               'Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS  = ['LU','MA','MI','JU','VI','SA','DO'];

// ─── PALETA NEOMÓRFICA ────────────────────────────────────────────────────────
const NEO_BASE  = '#0a2a2b';
const NEO_LIGHT = '#0f3638';
const NEO_DARK  = '#031618';
const NEO_SEL   = '#8CB79B';

const tipoColor = {
  'Evaluación inicial':    colors.sage,
  'Sesión de tratamiento': colors.midGreen,
  'Seguimiento':           '#4a7c6f',
  'Alta':                  '#2d5a4e',
  'Otro':                  colors.darkGreen,
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getMes(offset = 0) {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  return d;
}
function getDiasDelMes(fecha) {
  const año   = fecha.getFullYear();
  const mes   = fecha.getMonth();
  const total = new Date(año, mes + 1, 0).getDate();
  let ini     = new Date(año, mes, 1).getDay();
  ini = ini === 0 ? 6 : ini - 1;
  return { año, mes, total, ini };
}
const padNum = (n) => String(n).padStart(2, '0');

// ─── CELDA DEL CALENDARIO ─────────────────────────────────────────────────────
function CeldaDia({ dia, esHoy, esSel, tiCita, celdaSize, onPress }) {
  if (esSel) {
    return (
      <TouchableOpacity
        style={[n.celdaBase, { width: celdaSize, height: celdaSize }, n.celdaSel]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Text style={[n.celdaTxt, n.celdaSelTxt, { fontSize: Math.max(12, celdaSize * 0.3) }]}>{dia}</Text>
        {tiCita && <View style={n.dotSel} />}
      </TouchableOpacity>
    );
  }

  if (esHoy) {
    return (
      <TouchableOpacity
        style={[n.celdaBase, { width: celdaSize, height: celdaSize }, n.celdaHoy]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[n.celdaTxt, n.celdaHoyTxt, { fontSize: Math.max(12, celdaSize * 0.3) }]}>{dia}</Text>
        {tiCita && <View style={n.dot} />}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[n.celdaBase, { width: celdaSize, height: celdaSize }, n.celdaNormal]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[n.celdaTxt, { fontSize: Math.max(12, celdaSize * 0.3) }]}>{dia}</Text>
      {tiCita && <View style={n.dot} />}
    </TouchableOpacity>
  );
}

const n = StyleSheet.create({
  celdaBase:   { margin: 3, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  celdaNormal: { backgroundColor: NEO_BASE, shadowColor: NEO_DARK,
                 shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.95, shadowRadius: 6,
                 elevation: 4, borderWidth: 1, borderColor: NEO_LIGHT + '99' },
  celdaHoy:    { backgroundColor: NEO_BASE, shadowColor: NEO_DARK,
                 shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 8,
                 elevation: 7, borderWidth: 1.5, borderColor: colors.mint + 'AA' },
  celdaSel:    { backgroundColor: NEO_DARK, shadowColor: NEO_DARK,
                 shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.9, shadowRadius: 4,
                 elevation: 0, borderWidth: 1,
                 borderTopColor: NEO_DARK, borderLeftColor: NEO_DARK,
                 borderBottomColor: NEO_LIGHT, borderRightColor: NEO_LIGHT },
  celdaTxt:    { color: colors.textMuted, fontWeight: '500' },
  celdaHoyTxt: { color: colors.mint, fontWeight: '800' },
  celdaSelTxt: { color: NEO_SEL, fontWeight: '800' },
  dot:         { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.sage,
                 position: 'absolute', bottom: 4 },
  dotSel:      { width: 4, height: 4, borderRadius: 2, backgroundColor: NEO_SEL,
                 position: 'absolute', bottom: 4 },
});

// ─── PANEL NEOMÓRFICO ─────────────────────────────────────────────────────────
function NeoPanel({ children, style }) {
  return (
    <View style={[np.panel, style]}>
      <View style={np.innerLight} />
      {children}
    </View>
  );
}

const np = StyleSheet.create({
  panel: {
    backgroundColor: NEO_BASE, borderRadius: 24, padding: 16,
    marginHorizontal: 14, marginVertical: 10,
    shadowColor: NEO_DARK, shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1, shadowRadius: 16, elevation: 12,
    borderWidth: 1, borderColor: NEO_LIGHT,
  },
  innerLight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
    backgroundColor: NEO_LIGHT,
    borderTopLeftRadius: 24, borderTopRightRadius: 24, opacity: 0.8,
  },
});

// ─── CABECERA DEL DÍA ─────────────────────────────────────────────────────────
function DiaHeader({ diaSelec, mes, citasDelDia, onAdd }) {
  return (
    <View style={dh.wrap}>
      <View style={dh.left}>
        <View style={dh.numWrap}>
          <Text style={dh.num}>{diaSelec}</Text>
        </View>
        <View>
          <Text style={dh.mes}>{MESES[mes]}</Text>
          <Text style={dh.sub}>{citasDelDia.length} cita{citasDelDia.length !== 1 ? 's' : ''}</Text>
        </View>
      </View>
      <TouchableOpacity style={dh.btn} onPress={onAdd} activeOpacity={0.8}>
        <Ionicons name="add" size={14} color={colors.deepForest} />
        <Text style={dh.btnTxt}>Añadir</Text>
      </TouchableOpacity>
    </View>
  );
}

const dh = StyleSheet.create({
  wrap:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
             paddingHorizontal: 16, paddingVertical: 12,
             borderTopWidth: 1, borderTopColor: NEO_LIGHT + '66' },
  left:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  numWrap: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center',
             alignItems: 'center', backgroundColor: NEO_BASE,
             shadowColor: NEO_DARK, shadowOffset: { width: 3, height: 3 },
             shadowOpacity: 0.9, shadowRadius: 6, elevation: 5,
             borderWidth: 1, borderColor: NEO_LIGHT },
  num:     { color: NEO_SEL, fontSize: 20, fontWeight: '900' },
  mes:     { color: colors.mint, fontSize: 14, fontWeight: '700' },
  sub:     { color: colors.textMuted, fontSize: 11, marginTop: 1 },
  btn:     { flexDirection: 'row', alignItems: 'center', gap: 5,
             backgroundColor: colors.sage, borderRadius: 12,
             paddingHorizontal: 14, paddingVertical: 8,
             shadowColor: NEO_DARK, shadowOffset: { width: 3, height: 3 },
             shadowOpacity: 0.8, shadowRadius: 5, elevation: 4 },
  btnTxt:  { color: colors.deepForest, fontSize: 12, fontWeight: '700' },
});

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function AgendaScreen({ navigation }) {
  const { width: screenWidth } = useWindowDimensions();
  const isMobile  = screenWidth < 600;
  const container = isMobile ? screenWidth : Math.min(screenWidth * 0.45, 420);
  const calWidth  = container - 14 * 2 - 16 * 2;
  const celdaSize = Math.floor(calWidth / 7) - 6;

  const { pacientes, citas, agregarCita, eliminarCita } = usePacientes();
  const [mesOffset, setMesOffset] = useState(0);
  const [diaSelec,  setDiaSelec]  = useState(new Date().getDate());
  const [modal,     setModal]     = useState(false);
  const [form, setForm] = useState({
    hora: '10:00', tipo: 'Sesión de tratamiento', pacienteId: '', notas: '',
  });

  const fechaActual = getMes(mesOffset);
  const { año, mes, total, ini } = getDiasDelMes(fechaActual);
  const toISO       = (d) => `${año}-${padNum(mes + 1)}-${padNum(d)}`;
  const citasDelDia = citas.filter(c => c.fecha === toISO(diaSelec));
  const tienesCita  = (d) => citas.some(c => c.fecha === toISO(d));
  const hoyD        = new Date();
  const isWeb       = !isMobile;

  const guardarCita = () => {
    if (!form.pacienteId) { Alert.alert('Selecciona un paciente'); return; }
    agregarCita({ ...form, fecha: toISO(diaSelec) });
    setModal(false);
    setForm({ hora: '10:00', tipo: 'Sesión de tratamiento', pacienteId: '', notas: '' });
  };

  const irANuevoPaciente = () => {
    setModal(false);
    navigation.navigate('NuevoPaciente');
  };

  // ✅ Las citas ya se ordenan por hora — sort es correcto con formato HH:MM
  const renderCitas = () =>
    citasDelDia.length === 0 ? (
      <View style={s.empty}>
        <Ionicons name="calendar-outline" size={32} color={colors.textMuted} />
        <Text style={s.emptyTxt}>Sin citas este día</Text>
        <TouchableOpacity style={s.emptyBtn} onPress={() => setModal(true)}>
          <Text style={s.emptyBtnTxt}>+ Agendar</Text>
        </TouchableOpacity>
      </View>
    ) : (
      [...citasDelDia]
        .sort((a, b) => a.hora.localeCompare(b.hora))
        .map(cita => {
          const pac    = pacientes.find(p => p.id === cita.pacienteId);
          const accent = tipoColor[cita.tipo] || colors.midGreen;
          return (
            <View key={cita.id} style={s.citaCard}>
              <View style={[s.citaBar, { backgroundColor: accent }]} />
              <View style={s.citaHoraWrap}>
                <Text style={s.citaHoraTxt}>{cita.hora}</Text>
              </View>
              <View style={s.citaBody}>
                <Text style={s.citaNombre} numberOfLines={1}>{pac?.nombre || 'Paciente'}</Text>
                <View style={[s.tipoBadge, { backgroundColor: accent + '30' }]}>
                  <Text style={[s.tipoBadgeTxt, { color: accent }]}>{cita.tipo}</Text>
                </View>
                {cita.notas ? <Text style={s.citaNotas} numberOfLines={1}>{cita.notas}</Text> : null}
              </View>
              <View style={s.citaAcc}>
                {pac && (
                  <TouchableOpacity
                    style={s.accBtn}
                    onPress={() => navigation.navigate('DetallePaciente', { pacienteId: pac.id })}
                  >
                    <Ionicons name="person-outline" size={14} color={colors.sage} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={s.accBtn}
                  onPress={() => Alert.alert(
                    'Eliminar cita',
                    `¿Eliminar la cita de ${pac?.nombre || 'este paciente'}?`,
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      { text: 'Eliminar', style: 'destructive', onPress: () => eliminarCita(cita.id) },
                    ]
                  )}
                >
                  <Ionicons name="trash-outline" size={14} color="#e57373" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })
    );

  return (
    <SafeAreaView style={s.safe}>
      <View style={[s.pageWrap, isWeb && s.pageWrapWeb]}>

        {/* ══ COLUMNA IZQUIERDA — CALENDARIO ═══════════════════════════════════ */}
        <View style={[s.calCol, isWeb && { width: container }]}>

          <View style={s.topBar}>
            <Text style={s.title}>Agenda</Text>
            <TouchableOpacity style={s.addBtn} onPress={() => setModal(true)} activeOpacity={0.8}>
              <Ionicons name="add" size={16} color={colors.deepForest} />
              <Text style={s.addBtnTxt}>Nueva cita</Text>
            </TouchableOpacity>
          </View>

          <NeoPanel>
            {/* Navegación de mes */}
            <View style={s.mesNav}>
              <TouchableOpacity style={s.mesBtn} onPress={() => setMesOffset(m => m - 1)} activeOpacity={0.8}>
                <Ionicons name="chevron-back" size={18} color={colors.mint} />
              </TouchableOpacity>
              <View style={s.mesTitleWrap}>
                <Text style={s.mesTxt}>{MESES[mes]}</Text>
                <Text style={s.añoTxt}>{año}</Text>
              </View>
              <TouchableOpacity style={s.mesBtn} onPress={() => setMesOffset(m => m + 1)} activeOpacity={0.8}>
                <Ionicons name="chevron-forward" size={18} color={colors.mint} />
              </TouchableOpacity>
            </View>

            {/* Días de la semana */}
            <View style={s.diasRow}>
              {DIAS.map((d, i) => (
                <View key={i} style={{ width: celdaSize + 6, alignItems: 'center', paddingVertical: 6 }}>
                  <Text style={[s.diaSemTxt, (i === 5 || i === 6) && { color: colors.sage + '88' }]}>{d}</Text>
                </View>
              ))}
            </View>

            {/* Grid de días */}
            <View style={s.grid}>
              {Array.from({ length: ini }).map((_, i) => (
                <View key={`v${i}`} style={{ width: celdaSize + 6, height: celdaSize + 6 }} />
              ))}
              {Array.from({ length: total }).map((_, i) => {
                const dia   = i + 1;
                const esHoy = dia === hoyD.getDate() && mes === hoyD.getMonth() && año === hoyD.getFullYear();
                const esSel = dia === diaSelec;
                return (
                  <CeldaDia
                    key={dia}
                    dia={dia}
                    esHoy={esHoy}
                    esSel={esSel}
                    tiCita={tienesCita(dia)}
                    celdaSize={celdaSize}
                    onPress={() => setDiaSelec(dia)}
                  />
                );
              })}
            </View>

            {/* Leyenda */}
            <View style={s.leyenda}>
              <View style={s.leyendaItem}>
                <View style={[s.leyendaDot, { borderWidth: 1.5, borderColor: colors.mint + 'AA', backgroundColor: NEO_BASE }]} />
                <Text style={s.leyendaTxt}>Hoy</Text>
              </View>
              <View style={s.leyendaItem}>
                <View style={[s.leyendaDot, { backgroundColor: NEO_DARK, borderWidth: 1,
                  borderTopColor: NEO_DARK, borderLeftColor: NEO_DARK,
                  borderBottomColor: NEO_LIGHT, borderRightColor: NEO_LIGHT }]} />
                <Text style={s.leyendaTxt}>Seleccionado</Text>
              </View>
              <View style={s.leyendaItem}>
                <View style={[s.leyendaDot, { backgroundColor: colors.sage }]} />
                <Text style={s.leyendaTxt}>Con cita</Text>
              </View>
            </View>
          </NeoPanel>

          {/* Citas en móvil */}
          {isMobile && (
            <>
              <DiaHeader diaSelec={diaSelec} mes={mes} citasDelDia={citasDelDia} onAdd={() => setModal(true)} />
              <ScrollView showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
                style={{ flex: 1 }}
              >
                {renderCitas()}
              </ScrollView>
            </>
          )}
        </View>

        {/* ══ COLUMNA DERECHA — CITAS (web) ════════════════════════════════════ */}
        {isWeb && (
          <View style={[s.citasCol, s.citasColWeb]}>
            <DiaHeader diaSelec={diaSelec} mes={mes} citasDelDia={citasDelDia} onAdd={() => setModal(true)} />
            <ScrollView showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
            >
              {renderCitas()}
            </ScrollView>
          </View>
        )}
      </View>

      {/* ── MODAL NUEVA CITA ───────────────────────────────────────────────── */}
      <Modal visible={modal} transparent animationType="slide">
        <View style={s.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ width: '100%', alignItems: 'center' }}
          >
            <View style={[s.modalBox, isWeb && s.modalBoxWeb]}>
              <View style={s.modalHeader}>
                <View>
                  <Text style={s.modalTitle}>Nueva cita</Text>
                  <Text style={s.modalSub}>{diaSelec} de {MESES[mes]}, {año}</Text>
                </View>
                <TouchableOpacity onPress={() => setModal(false)} style={s.closeBtn}>
                  <Ionicons name="close" size={18} color={colors.mint} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                {/* PACIENTE */}
                <Text style={s.fieldLabel}>Paciente</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 14 }}
                  contentContainerStyle={{ alignItems: 'center', gap: 8 }}>
                  {pacientes.map(p => (
                    <TouchableOpacity
                      key={p.id}
                      style={[s.chip, form.pacienteId === p.id && s.chipActive]}
                      onPress={() => setForm(f => ({ ...f, pacienteId: p.id }))}
                    >
                      <Text style={[s.chipTxt, form.pacienteId === p.id && s.chipActiveTxt]}>
                        {p.nombre.split(' ')[0]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity style={s.chipNuevo} onPress={irANuevoPaciente}>
                    <Ionicons name="person-add-outline" size={13} color={colors.mint} />
                    <Text style={s.chipNuevoTxt}>Nuevo</Text>
                  </TouchableOpacity>
                </ScrollView>

                {pacientes.length === 0 && (
                  <TouchableOpacity style={s.sinPacWrap} onPress={irANuevoPaciente}>
                    <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
                    <Text style={s.sinPacTxt}>
                      No hay pacientes.{' '}
                      <Text style={{ color: colors.sage, fontWeight: '600' }}>Crear uno →</Text>
                    </Text>
                  </TouchableOpacity>
                )}

                {/* HORA */}
                <Text style={s.fieldLabel}>Hora</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                  {HORAS.map(h => (
                    <TouchableOpacity
                      key={h}
                      style={[s.chip, form.hora === h && s.chipActive]}
                      onPress={() => setForm(f => ({ ...f, hora: h }))}
                    >
                      <Text style={[s.chipTxt, form.hora === h && s.chipActiveTxt]}>{h}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* TIPO */}
                <Text style={s.fieldLabel}>Tipo de cita</Text>
                <View style={s.tiposWrap}>
                  {TIPOS.map(t => (
                    <TouchableOpacity
                      key={t}
                      style={[s.chip, form.tipo === t && s.chipActive]}
                      onPress={() => setForm(f => ({ ...f, tipo: t }))}
                    >
                      <Text style={[s.chipTxt, form.tipo === t && s.chipActiveTxt]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* NOTAS */}
                <Text style={[s.fieldLabel, { marginTop: 14 }]}>Notas</Text>
                <TextInput
                  style={s.notasInput}
                  value={form.notas}
                  onChangeText={v => setForm(f => ({ ...f, notas: v }))}
                  placeholder="Indicaciones especiales..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                />

                <TouchableOpacity style={s.guardarBtn} onPress={guardarCita}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.deepForest} />
                  <Text style={s.guardarBtnTxt}>Agendar cita</Text>
                </TouchableOpacity>
                <View style={{ height: 20 }} />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.deepForest },
  pageWrap:      { flex: 1 },
  pageWrapWeb:   { flexDirection: 'row', justifyContent: 'center' },
  calCol:        { width: '100%' },
  citasCol:      { flex: 1 },
  citasColWeb:   { flex: 1, borderLeftWidth: 1, borderLeftColor: colors.darkGreen },

  topBar:        { flexDirection: 'row', justifyContent: 'space-between',
                   alignItems: 'center', paddingHorizontal: 16,
                   paddingTop: 14, paddingBottom: 4 },
  title:         { color: colors.mint, fontSize: 22, fontWeight: '700' },
  addBtn:        { flexDirection: 'row', alignItems: 'center', gap: 5,
                   backgroundColor: colors.sage, borderRadius: 12,
                   paddingHorizontal: 12, paddingVertical: 7,
                   shadowColor: NEO_DARK, shadowOffset: { width: 3, height: 3 },
                   shadowOpacity: 0.8, shadowRadius: 5, elevation: 5 },
  addBtnTxt:     { color: colors.deepForest, fontWeight: '700', fontSize: 13 },

  mesNav:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  mesBtn:        { width: 36, height: 36, borderRadius: 10, justifyContent: 'center',
                   alignItems: 'center', backgroundColor: NEO_BASE,
                   shadowColor: NEO_DARK, shadowOffset: { width: 3, height: 3 },
                   shadowOpacity: 0.9, shadowRadius: 6, elevation: 5,
                   borderWidth: 1, borderColor: NEO_LIGHT },
  mesTitleWrap:  { alignItems: 'center' },
  mesTxt:        { color: colors.mint, fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
  añoTxt:        { color: colors.textMuted, fontSize: 12, marginTop: 1 },

  diasRow:       { flexDirection: 'row', justifyContent: 'center', marginBottom: 4 },
  diaSemTxt:     { color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  grid:          { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },

  leyenda:       { flexDirection: 'row', justifyContent: 'center', gap: 16,
                   marginTop: 12, paddingTop: 12,
                   borderTopWidth: 1, borderTopColor: NEO_LIGHT + '55' },
  leyendaItem:   { flexDirection: 'row', alignItems: 'center', gap: 5 },
  leyendaDot:    { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.textMuted },
  leyendaTxt:    { color: colors.textMuted, fontSize: 10 },

  empty:         { alignItems: 'center', paddingTop: 32, gap: 10 },
  emptyTxt:      { color: colors.textMuted, fontSize: 13 },
  emptyBtn:      { backgroundColor: colors.midGreen, borderRadius: 11,
                   paddingHorizontal: 18, paddingVertical: 8 },
  emptyBtnTxt:   { color: colors.mint, fontWeight: '600', fontSize: 13 },
  citaCard:      { flexDirection: 'row', alignItems: 'center',
                   backgroundColor: colors.darkGreen, borderRadius: 14,
                   marginBottom: 10, overflow: 'hidden' },
  citaBar:       { width: 4, alignSelf: 'stretch' },
  citaHoraWrap:  { paddingHorizontal: 12, paddingVertical: 14, minWidth: 52, alignItems: 'center' },
  citaHoraTxt:   { color: colors.mint, fontWeight: '700', fontSize: 13 },
  citaBody:      { flex: 1, paddingVertical: 12, paddingRight: 6, gap: 4 },
  citaNombre:    { color: colors.mint, fontWeight: '600', fontSize: 14 },
  tipoBadge:     { alignSelf: 'flex-start', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  tipoBadgeTxt:  { fontSize: 10, fontWeight: '600' },
  citaNotas:     { color: colors.textMuted, fontSize: 10, fontStyle: 'italic' },
  citaAcc:       { flexDirection: 'column', gap: 5, paddingRight: 8 },
  accBtn:        { padding: 6, backgroundColor: colors.deepForest, borderRadius: 7 },

  overlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
                   justifyContent: 'flex-end', alignItems: 'center' },
  modalBox:      { width: '100%', backgroundColor: colors.darkGreen,
                   borderTopLeftRadius: 24, borderTopRightRadius: 24,
                   padding: 22, maxHeight: '88%' },
  modalBoxWeb:   { width: '100%', maxWidth: 480, borderRadius: 22, marginBottom: 40 },
  modalHeader:   { flexDirection: 'row', justifyContent: 'space-between',
                   alignItems: 'flex-start', marginBottom: 18 },
  modalTitle:    { color: colors.mint, fontSize: 17, fontWeight: '700' },
  modalSub:      { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  closeBtn:      { padding: 6, backgroundColor: colors.midGreen, borderRadius: 9 },
  fieldLabel:    { color: colors.textMuted, fontSize: 11, fontWeight: '700',
                   marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  chip:          { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20,
                   backgroundColor: colors.deepForest, marginRight: 7,
                   borderWidth: 1, borderColor: colors.midGreen },
  chipActive:    { backgroundColor: colors.sage, borderColor: colors.sage },
  chipTxt:       { color: colors.textMuted, fontSize: 12 },
  chipActiveTxt: { color: colors.deepForest, fontWeight: '700' },
  chipNuevo:     { flexDirection: 'row', alignItems: 'center', gap: 5,
                   paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20,
                   backgroundColor: colors.midGreen, borderWidth: 1,
                   borderColor: colors.sage, marginRight: 7 },
  chipNuevoTxt:  { color: colors.mint, fontSize: 12, fontWeight: '600' },
  sinPacWrap:    { flexDirection: 'row', alignItems: 'center', gap: 6,
                   backgroundColor: colors.deepForest, borderRadius: 10,
                   padding: 10, marginBottom: 14,
                   borderWidth: 1, borderColor: colors.midGreen },
  sinPacTxt:     { color: colors.textMuted, fontSize: 12, flex: 1 },
  tiposWrap:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  notasInput:    { backgroundColor: colors.deepForest, borderRadius: 12,
                   padding: 12, color: colors.mint, fontSize: 13,
                   minHeight: 64, textAlignVertical: 'top',
                   borderWidth: 1, borderColor: colors.midGreen },
  guardarBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                   gap: 7, backgroundColor: colors.sage, borderRadius: 14,
                   paddingVertical: 14, marginTop: 16 },
  guardarBtnTxt: { color: colors.deepForest, fontWeight: '700', fontSize: 14 },
});