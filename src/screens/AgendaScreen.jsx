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

const HORAS = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
               '12:00','12:30','13:00','13:30','14:00','15:00','16:00','17:00','18:00'];
const TIPOS = ['Evaluación inicial','Sesión de tratamiento','Seguimiento','Alta','Otro'];
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio',
               'Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS  = ['LU','MA','MI','JU','VI','SA','DO'];

const tipoColor = {
  'Evaluación inicial':    colors.sage,
  'Sesión de tratamiento': colors.midGreen,
  'Seguimiento':           '#4a7c6f',
  'Alta':                  '#2d5a4e',
  'Otro':                  colors.darkGreen,
};

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

export default function AgendaScreen({ navigation }) {
  const { width: screenWidth } = useWindowDimensions();

  const isMobile  = screenWidth < 600;
  const container = isMobile ? screenWidth : Math.min(screenWidth * 0.45, 420);
  const pad       = 16;
  const celdaSize = Math.floor((container - pad * 2) / 7);

  const { pacientes, citas, agregarCita, eliminarCita } = usePacientes();
  const [mesOffset, setMesOffset] = useState(0);
  const [diaSelec,  setDiaSelec]  = useState(new Date().getDate());
  const [modal,     setModal]     = useState(false);
  const [form, setForm] = useState({
    hora: '10:00', tipo: 'Sesión de tratamiento', pacienteId: '', notas: ''
  });

  const fechaActual = getMes(mesOffset);
  const { año, mes, total, ini } = getDiasDelMes(fechaActual);

  const padNum = (n) => String(n).padStart(2, '0');
  const toISO  = (d) => `${año}-${padNum(mes + 1)}-${padNum(d)}`;

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

  // Navega a NuevoPaciente y al volver el modal sigue abierto
  const irANuevoPaciente = () => {
    setModal(false);
    navigation.navigate('NuevoPaciente');
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={[s.pageWrap, isWeb && s.pageWrapWeb]}>

        {/* ══ COLUMNA IZQUIERDA ════════════════════════════════════ */}
        <View style={[s.calCol, isWeb && { width: container }]}>

          <View style={s.topBar}>
            <Text style={[s.title, isWeb && s.titleWeb]}>Agenda</Text>
            <TouchableOpacity style={s.addBtn} onPress={() => setModal(true)}>
              <Ionicons name="add" size={16} color={colors.mint} />
              <Text style={s.addBtnTxt}>Nueva cita</Text>
            </TouchableOpacity>
          </View>

          <View style={s.mesNav}>
            <TouchableOpacity onPress={() => setMesOffset(m => m - 1)} style={s.mesBtn}>
              <Ionicons name="chevron-back" size={18} color={colors.mint} />
            </TouchableOpacity>
            <Text style={[s.mesTxt, isWeb && s.mesTxtWeb]}>{MESES[mes]} {año}</Text>
            <TouchableOpacity onPress={() => setMesOffset(m => m + 1)} style={s.mesBtn}>
              <Ionicons name="chevron-forward" size={18} color={colors.mint} />
            </TouchableOpacity>
          </View>

          <View style={[s.diasRow, { paddingHorizontal: pad }]}>
            {DIAS.map((d, i) => (
              <View key={i} style={{ width: celdaSize, alignItems: 'center', paddingVertical: 4 }}>
                <Text style={[s.diaSemTxt, isWeb && s.diaSemTxtWeb]}>{d}</Text>
              </View>
            ))}
          </View>

          <View style={[s.grid, { paddingHorizontal: pad }]}>
            {Array.from({ length: ini }).map((_, i) => (
              <View key={`v${i}`} style={{ width: celdaSize, height: celdaSize }} />
            ))}
            {Array.from({ length: total }).map((_, i) => {
              const dia   = i + 1;
              const esHoy = dia === hoyD.getDate() && mes === hoyD.getMonth() && año === hoyD.getFullYear();
              const esSel = dia === diaSelec;
              const tiCita = tienesCita(dia);
              return (
                <TouchableOpacity
                  key={dia}
                  style={[
                    s.celda,
                    { width: celdaSize, height: celdaSize },
                    esHoy && !esSel && s.celdaHoy,
                    esSel && s.celdaSel,
                  ]}
                  onPress={() => setDiaSelec(dia)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    s.celdaTxt,
                    { fontSize: Math.max(11, celdaSize * 0.28) },
                    esHoy && !esSel && s.celdaHoyTxt,
                    esSel && s.celdaSelTxt,
                  ]}>
                    {dia}
                  </Text>
                  {tiCita && <View style={[s.dot, esSel && s.dotSel]} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {isMobile && (
            <DiaHeader
              diaSelec={diaSelec} mes={mes}
              citasDelDia={citasDelDia}
              onAdd={() => setModal(true)}
            />
          )}
        </View>

        {/* ══ COLUMNA DERECHA ══════════════════════════════════════ */}
        <View style={[s.citasCol, isWeb && s.citasColWeb]}>

          {isWeb && (
            <DiaHeader
              diaSelec={diaSelec} mes={mes}
              citasDelDia={citasDelDia}
              onAdd={() => setModal(true)}
            />
          )}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: pad, paddingBottom: 40 }}
          >
            {citasDelDia.length === 0 ? (
              <View style={s.empty}>
                <Ionicons name="calendar-outline" size={32} color={colors.textMuted} />
                <Text style={s.emptyTxt}>Sin citas este día</Text>
                <TouchableOpacity style={s.emptyBtn} onPress={() => setModal(true)}>
                  <Text style={s.emptyBtnTxt}>+ Agendar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              citasDelDia
                .sort((a, b) => a.hora.localeCompare(b.hora))
                .map((cita) => {
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
                            'Eliminar',
                            `¿Eliminar cita de ${pac?.nombre}?`,
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
            )}
          </ScrollView>
        </View>
      </View>

      {/* ── MODAL NUEVA CITA ──────────────────────────────────────── */}
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

                {/* ── PACIENTE ─────────────────────────────────── */}
                <Text style={s.fieldLabel}>Paciente</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 14 }}
                  contentContainerStyle={{ alignItems: 'center', gap: 8 }}
                >
                  {/* Chips de pacientes existentes */}
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

                  {/* ── Botón nuevo paciente ─────────────────── */}
                  <TouchableOpacity
                    style={s.chipNuevo}
                    onPress={irANuevoPaciente}
                  >
                    <Ionicons name="person-add-outline" size={13} color={colors.mint} />
                    <Text style={s.chipNuevoTxt}>Nuevo</Text>
                  </TouchableOpacity>
                </ScrollView>

                {/* Aviso si no hay pacientes */}
                {pacientes.length === 0 && (
                  <TouchableOpacity style={s.sinPacientesWrap} onPress={irANuevoPaciente}>
                    <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
                    <Text style={s.sinPacientesTxt}>
                      No hay pacientes registrados.{' '}
                      <Text style={{ color: colors.sage, fontWeight: '600' }}>Crear uno →</Text>
                    </Text>
                  </TouchableOpacity>
                )}

                {/* ── HORA ─────────────────────────────────────── */}
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

                {/* ── TIPO ─────────────────────────────────────── */}
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

                {/* ── NOTAS ────────────────────────────────────── */}
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

function DiaHeader({ diaSelec, mes, citasDelDia, onAdd }) {
  return (
    <View style={dh.wrap}>
      <View style={dh.left}>
        <Text style={dh.num}>{diaSelec}</Text>
        <View>
          <Text style={dh.mes}>{MESES[mes]}</Text>
          <Text style={dh.sub}>{citasDelDia.length} cita{citasDelDia.length !== 1 ? 's' : ''}</Text>
        </View>
      </View>
      <TouchableOpacity style={dh.btn} onPress={onAdd}>
        <Ionicons name="add" size={14} color={colors.mint} />
        <Text style={dh.btnTxt}>Añadir</Text>
      </TouchableOpacity>
    </View>
  );
}

const dh = StyleSheet.create({
  wrap:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.darkGreen },
  left:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  num:    { color: colors.mint, fontSize: 26, fontWeight: '800' },
  mes:    { color: colors.mint, fontSize: 13, fontWeight: '600' },
  sub:    { color: colors.textMuted, fontSize: 11 },
  btn:    { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.darkGreen, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 6 },
  btnTxt: { color: colors.mint, fontSize: 12, fontWeight: '600' },
});

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.deepForest },
  pageWrap:      { flex: 1 },
  pageWrapWeb:   { flexDirection: 'row', justifyContent: 'center' },
  calCol:        { width: '100%' },
  citasCol:      { flex: 1 },
  citasColWeb:   { flex: 1, borderLeftWidth: 1, borderLeftColor: colors.darkGreen },
  topBar:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 },
  title:         { color: colors.mint, fontSize: 20, fontWeight: '700' },
  titleWeb:      { fontSize: 22 },
  addBtn:        { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.midGreen, borderRadius: 11, paddingHorizontal: 11, paddingVertical: 6 },
  addBtnTxt:     { color: colors.mint, fontWeight: '600', fontSize: 12 },
  mesNav:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 6 },
  mesBtn:        { padding: 6, borderRadius: 8, backgroundColor: colors.darkGreen },
  mesTxt:        { color: colors.mint, fontSize: 14, fontWeight: '700' },
  mesTxtWeb:     { fontSize: 15 },
  diasRow:       { flexDirection: 'row', marginBottom: 2 },
  diaSemTxt:     { color: colors.textMuted, fontSize: 11, fontWeight: '600' },
  diaSemTxtWeb:  { fontSize: 12 },
  grid:          { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
  celda:         { justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  celdaHoy:      { backgroundColor: colors.darkGreen },
  celdaSel:      { backgroundColor: colors.sage },
  celdaTxt:      { color: colors.textMuted },
  celdaHoyTxt:   { color: colors.mint, fontWeight: '700' },
  celdaSelTxt:   { color: colors.deepForest, fontWeight: '800' },
  dot:           { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.sage, position: 'absolute', bottom: 3 },
  dotSel:        { backgroundColor: colors.deepForest },
  empty:         { alignItems: 'center', paddingTop: 24, gap: 10 },
  emptyTxt:      { color: colors.textMuted, fontSize: 13 },
  emptyBtn:      { backgroundColor: colors.midGreen, borderRadius: 11, paddingHorizontal: 18, paddingVertical: 8 },
  emptyBtnTxt:   { color: colors.mint, fontWeight: '600', fontSize: 13 },
  citaCard:      { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.darkGreen, borderRadius: 13, marginBottom: 9, overflow: 'hidden' },
  citaBar:       { width: 4, alignSelf: 'stretch' },
  citaHoraWrap:  { paddingHorizontal: 10, paddingVertical: 12, minWidth: 50, alignItems: 'center' },
  citaHoraTxt:   { color: colors.mint, fontWeight: '700', fontSize: 12 },
  citaBody:      { flex: 1, paddingVertical: 10, paddingRight: 6, gap: 4 },
  citaNombre:    { color: colors.mint, fontWeight: '600', fontSize: 13 },
  tipoBadge:     { alignSelf: 'flex-start', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  tipoBadgeTxt:  { fontSize: 10, fontWeight: '600' },
  citaNotas:     { color: colors.textMuted, fontSize: 10, fontStyle: 'italic' },
  citaAcc:       { flexDirection: 'column', gap: 5, paddingRight: 8 },
  accBtn:        { padding: 6, backgroundColor: colors.deepForest, borderRadius: 7 },
  overlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end', alignItems: 'center' },
  modalBox:      { width: '100%', backgroundColor: colors.darkGreen, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20, maxHeight: '88%' },
  modalBoxWeb:   { width: '100%', maxWidth: 480, borderRadius: 22, marginBottom: 40 },
  modalHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  modalTitle:    { color: colors.mint, fontSize: 16, fontWeight: '700' },
  modalSub:      { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  closeBtn:      { padding: 5, backgroundColor: colors.midGreen, borderRadius: 8 },
  fieldLabel:    { color: colors.textMuted, fontSize: 11, fontWeight: '700', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Chips normales
  chip:          { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.deepForest, marginRight: 7, borderWidth: 1, borderColor: colors.midGreen },
  chipActive:    { backgroundColor: colors.sage, borderColor: colors.sage },
  chipTxt:       { color: colors.textMuted, fontSize: 12 },
  chipActiveTxt: { color: colors.deepForest, fontWeight: '700' },

  // Chip especial "Nuevo paciente"
  chipNuevo:     { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.midGreen, borderWidth: 1, borderColor: colors.sage, marginRight: 7 },
  chipNuevoTxt:  { color: colors.mint, fontSize: 12, fontWeight: '600' },

  // Aviso sin pacientes
  sinPacientesWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.deepForest, borderRadius: 10, padding: 10, marginBottom: 14, borderWidth: 1, borderColor: colors.midGreen },
  sinPacientesTxt:  { color: colors.textMuted, fontSize: 12, flex: 1 },

  tiposWrap:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  notasInput:    { backgroundColor: colors.deepForest, borderRadius: 11, padding: 11, color: colors.mint, fontSize: 13, minHeight: 60, textAlignVertical: 'top', borderWidth: 1, borderColor: colors.midGreen },
  guardarBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: colors.sage, borderRadius: 13, paddingVertical: 13, marginTop: 14 },
  guardarBtnTxt: { color: colors.deepForest, fontWeight: '700', fontSize: 14 },
});