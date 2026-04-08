// © 2025–2026 Joana Uribe — Todos los derechos reservados.
// Uso, copia o distribución sin autorización escrita está prohibido.
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Modal, KeyboardAvoidingView, Platform,
  useWindowDimensions, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../theme/colors';
import { usePacientes } from '../context/PacientesContext';

// ─── PALETA NEOMÓRFICA ────────────────────────────────────────────────────────
const NEO_BASE  = '#0a2a2b';
const NEO_LIGHT = '#0f3638';
const NEO_DARK  = '#031618';

// ─── CONSTANTES ───────────────────────────────────────────────────────────────
const STORAGE_KEY     = '@TOF_actividades';
const CATEGORIAS      = ['Todos', 'Motor fino', 'Cognitivo', 'AVD', 'Sensorial', 'Social', 'Otro'];
const CATEGORIAS_FORM = ['Motor fino', 'Cognitivo', 'AVD', 'Sensorial', 'Social', 'Otro'];
const DIFICULTADES    = ['Baja', 'Media', 'Alta'];
const DURACIONES      = ['5 min','10 min','15 min','20 min','30 min','45 min','60 min'];
const ORDENES         = ['Más usadas', 'Recientes', 'Alfabético', 'Favoritas'];

const DIF_COLOR = { Baja: colors.sage, Media: '#e8c97a', Alta: '#e07070' };

const ACTIVIDADES_BASE = [
  { id: '1', titulo: 'Enhebrar aguja',        categoria: 'Motor fino', dificultad: 'Media', duracion: '15 min', descripcion: 'Desarrolla coordinación óculo-manual fina.',   favorita: false, usos: 3, pacienteId: null, creadaEn: '2025-01-10' },
  { id: '2', titulo: 'Secuencia de rutina',   categoria: 'Cognitivo',  dificultad: 'Alta',  duracion: '20 min', descripcion: 'Entrenamiento de memoria procedimental.',      favorita: false, usos: 5, pacienteId: null, creadaEn: '2025-01-12' },
  { id: '3', titulo: 'Vestido independiente', categoria: 'AVD',        dificultad: 'Alta',  duracion: '30 min', descripcion: 'Entrenamiento de vestido con miembro afecto.', favorita: true,  usos: 7, pacienteId: null, creadaEn: '2025-01-14' },
  { id: '4', titulo: 'Juego de texturas',     categoria: 'Sensorial',  dificultad: 'Baja',  duracion: '10 min', descripcion: 'Modulación táctil con kit de texturas.',       favorita: false, usos: 2, pacienteId: null, creadaEn: '2025-01-15' },
  { id: '5', titulo: 'Recorte y pegado',      categoria: 'Motor fino', dificultad: 'Media', duracion: '20 min', descripcion: 'Trabaja prensión y coordinación bimanual.',    favorita: false, usos: 4, pacienteId: null, creadaEn: '2025-01-16' },
  { id: '6', titulo: 'Interacción en grupo',  categoria: 'Social',     dificultad: 'Media', duracion: '45 min', descripcion: 'Habilidades conversacionales en grupo.',       favorita: true,  usos: 6, pacienteId: null, creadaEn: '2025-01-18' },
];

const FORM_VACIO = {
  titulo: '', categoria: 'Motor fino', dificultad: 'Media',
  duracion: '20 min', descripcion: '', pacienteId: null,
};

// ─── PANEL NEOMÓRFICO ─────────────────────────────────────────────────────────
function NeoPanel({ children, style }) {
  return (
    <View style={[np.panel, style]}>
      <View style={np.light} />
      {children}
    </View>
  );
}
const np = StyleSheet.create({
  panel: {
    backgroundColor: NEO_BASE, borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: NEO_LIGHT,
    shadowColor: NEO_DARK, shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 10,
  },
  light: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
    backgroundColor: NEO_LIGHT, borderTopLeftRadius: 20, borderTopRightRadius: 20, opacity: 0.8,
  },
});

// ─── TARJETA DE ACTIVIDAD ─────────────────────────────────────────────────────
function ActividadCard({ act, pacientes, onPress, onToggleFav, cardWidth }) {
  const pac = pacientes.find(p => p.id === act.pacienteId);
  return (
    <TouchableOpacity style={[ac.card, { width: cardWidth }]} onPress={onPress} activeOpacity={0.85}>
      <View style={ac.light} />
      <View style={[ac.topBar, { backgroundColor: DIF_COLOR[act.dificultad] }]} />
      <View style={ac.body}>
        <View style={ac.titleRow}>
          <Text style={ac.titulo} numberOfLines={2}>{act.titulo}</Text>
          <TouchableOpacity
            style={ac.favBtn}
            onPress={(e) => { e.stopPropagation?.(); onToggleFav(act.id); }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name={act.favorita ? 'star' : 'star-outline'} size={16}
              color={act.favorita ? '#e8c97a' : colors.textMuted} />
          </TouchableOpacity>
        </View>
        {act.descripcion ? <Text style={ac.desc} numberOfLines={2}>{act.descripcion}</Text> : null}
        <View style={ac.metaRow}>
          <View style={[ac.catChip, { backgroundColor: DIF_COLOR[act.dificultad] + '22' }]}>
            <Text style={[ac.catTxt, { color: DIF_COLOR[act.dificultad] }]}>{act.dificultad}</Text>
          </View>
          <View style={ac.metaChip}>
            <Ionicons name="folder-outline" size={10} color={colors.textMuted} />
            <Text style={ac.metaTxt}>{act.categoria}</Text>
          </View>
          <View style={ac.metaChip}>
            <Ionicons name="time-outline" size={10} color={colors.textMuted} />
            <Text style={ac.metaTxt}>{act.duracion}</Text>
          </View>
        </View>
        <View style={ac.footer}>
          {pac ? (
            <View style={ac.pacChip}>
              <Ionicons name="person" size={10} color={colors.sage} />
              <Text style={ac.pacTxt} numberOfLines={1}>{pac.nombre.split(' ')[0]}</Text>
            </View>
          ) : <Text style={ac.sinPac}>Sin paciente</Text>}
          <View style={ac.usosChip}>
            <Ionicons name="repeat" size={10} color={colors.mint} />
            <Text style={ac.usosTxt}>{act.usos}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const ac = StyleSheet.create({
  card:     { backgroundColor: NEO_BASE, borderRadius: 18, marginBottom: 12,
              borderWidth: 1, borderColor: NEO_LIGHT, overflow: 'hidden',
              shadowColor: NEO_DARK, shadowOffset: { width: 4, height: 4 },
              shadowOpacity: 0.9, shadowRadius: 8, elevation: 7 },
  light:    { position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              backgroundColor: NEO_LIGHT, opacity: 0.7 },
  topBar:   { height: 3, width: '100%' },
  body:     { padding: 14, gap: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  titulo:   { color: colors.mint, fontSize: 14, fontWeight: '700', flex: 1, lineHeight: 20 },
  favBtn:   { paddingTop: 2 },
  desc:     { color: colors.textMuted, fontSize: 12, lineHeight: 17 },
  metaRow:  { flexDirection: 'row', gap: 6, flexWrap: 'wrap', alignItems: 'center' },
  catChip:  { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  catTxt:   { fontSize: 10, fontWeight: '700' },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaTxt:  { color: colors.textMuted, fontSize: 11 },
  footer:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
              borderTopWidth: 1, borderTopColor: NEO_LIGHT + '88', paddingTop: 8, marginTop: 2 },
  pacChip:  { flexDirection: 'row', alignItems: 'center', gap: 4,
              backgroundColor: colors.midGreen + '44', borderRadius: 8,
              paddingHorizontal: 8, paddingVertical: 3 },
  pacTxt:   { color: colors.sage, fontSize: 11, fontWeight: '600' },
  sinPac:   { color: colors.textMuted, fontSize: 11 },
  usosChip: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  usosTxt:  { color: colors.mint, fontSize: 11, fontWeight: '700' },
});

// ─── MODAL DETALLE ────────────────────────────────────────────────────────────
function ModalDetalle({ act, pacientes, isWide, onClose, onEdit, onDelete, onRegistrar, onToggleFav }) {
  const [modalReg, setModalReg] = useState(false);
  const [pacSelId, setPacSelId] = useState(act?.pacienteId || null);
  if (!act) return null;
  const pac = pacientes.find(p => p.id === act.pacienteId);

  const confirmarRegistro = () => {
    if (!pacSelId) { Alert.alert('Selecciona un paciente'); return; }
    onRegistrar(act.id, pacSelId);
    setModalReg(false);
    onClose();
  };

  return (
    <Modal visible={!!act} transparent animationType="slide">
      <View style={md.overlay}>
        <View style={[md.box, isWide && md.boxWeb]}>
          <View style={md.light} />
          <View style={md.header}>
            <View style={{ flex: 1, gap: 4 }}>
              <View style={[md.difBadge, { backgroundColor: DIF_COLOR[act.dificultad] + '22' }]}>
                <Text style={[md.difTxt, { color: DIF_COLOR[act.dificultad] }]}>{act.dificultad}</Text>
              </View>
              <Text style={md.titulo}>{act.titulo}</Text>
              <Text style={md.cat}>{act.categoria} · {act.duracion}</Text>
            </View>
            <View style={md.headerBtns}>
              <TouchableOpacity style={md.iconBtn} onPress={() => onToggleFav(act.id)}>
                <Ionicons name={act.favorita ? 'star' : 'star-outline'} size={18}
                  color={act.favorita ? '#e8c97a' : colors.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity style={md.iconBtn} onPress={onClose}>
                <Ionicons name="close" size={18} color={colors.mint} />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {act.descripcion ? (
              <NeoPanel style={{ marginBottom: 12 }}>
                <View style={md.secHeader}>
                  <Ionicons name="document-text-outline" size={14} color={colors.sage} />
                  <Text style={md.secTitle}>Descripción</Text>
                </View>
                <Text style={md.descTxt}>{act.descripcion}</Text>
              </NeoPanel>
            ) : null}
            <NeoPanel style={{ marginBottom: 12 }}>
              <View style={md.infoGrid}>
                {[
                  { icon: 'folder-outline',  label: 'Categoría',     val: act.categoria,                         color: colors.sage },
                  { icon: 'time-outline',    label: 'Duración',      val: act.duracion,                          color: colors.sage },
                  { icon: 'repeat',          label: 'Aplicaciones',  val: String(act.usos),                      color: colors.mint },
                  { icon: 'person-outline',  label: 'Paciente',      val: pac?.nombre.split(' ')[0] || '—',      color: colors.sage },
                ].map((item, i) => (
                  <View key={i} style={md.infoItem}>
                    <Ionicons name={item.icon} size={16} color={item.color} />
                    <Text style={md.infoLabel}>{item.label}</Text>
                    <Text style={[md.infoVal, { color: item.color }]}>{item.val}</Text>
                  </View>
                ))}
              </View>
            </NeoPanel>
            {!modalReg ? (
              <TouchableOpacity style={md.primaryBtn} onPress={() => setModalReg(true)}>
                <Ionicons name="play" size={16} color={colors.deepForest} />
                <Text style={md.primaryBtnTxt}>Registrar en sesión</Text>
              </TouchableOpacity>
            ) : (
              <NeoPanel style={{ marginBottom: 12 }}>
                <Text style={md.secTitle2}>Seleccionar paciente</Text>
                {pacientes.length === 0
                  ? <Text style={{ color: colors.textMuted, fontSize: 13 }}>Sin pacientes registrados</Text>
                  : pacientes.map(p => (
                    <TouchableOpacity
                      key={p.id}
                      style={[md.pacRow, pacSelId === p.id && md.pacRowActive]}
                      onPress={() => setPacSelId(p.id)}
                    >
                      <View style={md.pacAvatar}>
                        <Text style={md.pacAvatarTxt}>{p.nombre.charAt(0)}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[md.pacNombre, pacSelId === p.id && { color: colors.mint }]}>{p.nombre}</Text>
                        <Text style={md.pacSes}>{p.sesiones?.length || 0} sesiones</Text>
                      </View>
                      {pacSelId === p.id && <Ionicons name="checkmark-circle" size={18} color={colors.sage} />}
                    </TouchableOpacity>
                  ))
                }
                <TouchableOpacity
                  style={[md.primaryBtn, { marginTop: 10 }, !pacSelId && { opacity: 0.5 }]}
                  onPress={confirmarRegistro} disabled={!pacSelId}
                >
                  <Ionicons name="checkmark-circle" size={16} color={colors.deepForest} />
                  <Text style={md.primaryBtnTxt}>Confirmar registro</Text>
                </TouchableOpacity>
                <TouchableOpacity style={md.cancelBtn} onPress={() => setModalReg(false)}>
                  <Text style={md.cancelBtnTxt}>Cancelar</Text>
                </TouchableOpacity>
              </NeoPanel>
            )}
            <View style={md.actionsRow}>
              <TouchableOpacity style={md.editBtn} onPress={() => { onClose(); onEdit(act); }}>
                <Ionicons name="create-outline" size={15} color={colors.mint} />
                <Text style={md.editBtnTxt}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={md.deleteBtn}
                onPress={() => Alert.alert('Eliminar actividad', `¿Eliminar "${act.titulo}"?`, [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Eliminar', style: 'destructive', onPress: () => { onDelete(act.id); onClose(); } },
                ])}
              >
                <Ionicons name="trash-outline" size={15} color="#e07070" />
                <Text style={md.deleteBtnTxt}>Eliminar</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
const md = StyleSheet.create({
  overlay:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.72)', justifyContent: 'flex-end' },
  box:          { backgroundColor: NEO_BASE, borderTopLeftRadius: 26, borderTopRightRadius: 26,
                  padding: 22, maxHeight: '92%', borderWidth: 1, borderColor: NEO_LIGHT },
  boxWeb:       { maxWidth: 520, alignSelf: 'center', width: '100%', borderRadius: 26, marginBottom: 40 },
  light:        { position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  backgroundColor: NEO_LIGHT, borderTopLeftRadius: 26, borderTopRightRadius: 26, opacity: 0.8 },
  header:       { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, gap: 12 },
  headerBtns:   { flexDirection: 'row', gap: 8 },
  iconBtn:      { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.darkGreen,
                  justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: NEO_LIGHT },
  difBadge:     { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  difTxt:       { fontSize: 10, fontWeight: '700' },
  titulo:       { color: colors.mint, fontSize: 20, fontWeight: '800', lineHeight: 26 },
  cat:          { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  secHeader:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  secTitle:     { color: colors.sage, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  secTitle2:    { color: colors.sage, fontSize: 13, fontWeight: '700', marginBottom: 12 },
  descTxt:      { color: colors.mint, fontSize: 14, lineHeight: 21 },
  infoGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  infoItem:     { width: '45%', gap: 3 },
  infoLabel:    { color: colors.textMuted, fontSize: 11 },
  infoVal:      { color: colors.mint, fontSize: 14, fontWeight: '600' },
  primaryBtn:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                  backgroundColor: colors.sage, borderRadius: 14, paddingVertical: 14, marginBottom: 10 },
  primaryBtnTxt:{ color: colors.deepForest, fontWeight: '700', fontSize: 14 },
  cancelBtn:    { alignItems: 'center', paddingVertical: 8 },
  cancelBtnTxt: { color: colors.textMuted, fontSize: 13 },
  pacRow:       { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.darkGreen,
                  borderRadius: 12, padding: 10, marginBottom: 6 },
  pacRowActive: { backgroundColor: colors.midGreen },
  pacAvatar:    { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.midGreen,
                  justifyContent: 'center', alignItems: 'center' },
  pacAvatarTxt: { color: colors.mint, fontWeight: '700', fontSize: 14 },
  pacNombre:    { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  pacSes:       { color: colors.textMuted, fontSize: 11, marginTop: 1 },
  actionsRow:   { flexDirection: 'row', gap: 10 },
  editBtn:      { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                  gap: 6, borderWidth: 1, borderColor: NEO_LIGHT, borderRadius: 12, paddingVertical: 11 },
  editBtnTxt:   { color: colors.mint, fontWeight: '600', fontSize: 13 },
  deleteBtn:    { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                  gap: 6, borderWidth: 1, borderColor: '#e07070' + '55', borderRadius: 12, paddingVertical: 11 },
  deleteBtnTxt: { color: '#e07070', fontWeight: '600', fontSize: 13 },
});

// ─── MODAL FORMULARIO ─────────────────────────────────────────────────────────
function ModalForm({ visible, form, setForm, pacientes, onGuardar, onCerrar, editando, isWide }) {
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={mf.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ width: '100%', alignItems: 'center' }}
        >
          <View style={[mf.box, isWide && mf.boxWeb]}>
            <View style={mf.light} />
            <View style={mf.header}>
              <View>
                <Text style={mf.titulo}>{editando ? 'Editar actividad' : 'Nueva actividad'}</Text>
                <Text style={mf.sub}>Completa los datos</Text>
              </View>
              <TouchableOpacity style={mf.closeBtn} onPress={onCerrar}>
                <Ionicons name="close" size={18} color={colors.mint} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={mf.label}>Nombre de la actividad *</Text>
              <TextInput style={mf.input} value={form.titulo} onChangeText={v => setF('titulo', v)}
                placeholder="Ej. Pinza con plastilina" placeholderTextColor={colors.textMuted} autoFocus={!editando} />

              <Text style={mf.label}>Descripción / notas</Text>
              <TextInput style={[mf.input, { minHeight: 72, textAlignVertical: 'top' }]}
                value={form.descripcion} onChangeText={v => setF('descripcion', v)}
                placeholder="Objetivo terapéutico, instrucciones..." placeholderTextColor={colors.textMuted} multiline />

              <Text style={mf.label}>Vincular paciente</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 14 }} contentContainerStyle={{ gap: 8, alignItems: 'center' }}>
                <TouchableOpacity style={[mf.chip, form.pacienteId === null && mf.chipActive]} onPress={() => setF('pacienteId', null)}>
                  <Text style={[mf.chipTxt, form.pacienteId === null && mf.chipActiveTxt]}>Sin paciente</Text>
                </TouchableOpacity>
                {pacientes.map(p => (
                  <TouchableOpacity key={p.id} style={[mf.chip, form.pacienteId === p.id && mf.chipActive]} onPress={() => setF('pacienteId', p.id)}>
                    <Text style={[mf.chipTxt, form.pacienteId === p.id && mf.chipActiveTxt]}>{p.nombre.split(' ')[0]}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={mf.label}>Categoría</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                {CATEGORIAS_FORM.map(c => (
                  <TouchableOpacity key={c} style={[mf.chip, form.categoria === c && mf.chipActive]} onPress={() => setF('categoria', c)}>
                    <Text style={[mf.chipTxt, form.categoria === c && mf.chipActiveTxt]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={mf.label}>Dificultad</Text>
              <View style={mf.rowChips}>
                {DIFICULTADES.map(d => (
                  <TouchableOpacity key={d}
                    style={[mf.chip, form.dificultad === d && mf.chipActive,
                      form.dificultad === d && { backgroundColor: DIF_COLOR[d] + '33', borderColor: DIF_COLOR[d] }]}
                    onPress={() => setF('dificultad', d)}
                  >
                    <Text style={[mf.chipTxt, form.dificultad === d && { color: DIF_COLOR[d], fontWeight: '700' }]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[mf.label, { marginTop: 14 }]}>Duración</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                {DURACIONES.map(d => (
                  <TouchableOpacity key={d} style={[mf.chip, form.duracion === d && mf.chipActive]} onPress={() => setF('duracion', d)}>
                    <Text style={[mf.chipTxt, form.duracion === d && mf.chipActiveTxt]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity style={[mf.guardarBtn, !form.titulo.trim() && { opacity: 0.5 }]}
                onPress={onGuardar} disabled={!form.titulo.trim()}>
                <Ionicons name="checkmark-circle" size={16} color={colors.deepForest} />
                <Text style={mf.guardarBtnTxt}>{editando ? 'Guardar cambios' : 'Agregar actividad'}</Text>
              </TouchableOpacity>
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
const mf = StyleSheet.create({
  overlay:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end', alignItems: 'center' },
  box:          { width: '100%', backgroundColor: NEO_BASE, borderTopLeftRadius: 24, borderTopRightRadius: 24,
                  padding: 22, maxHeight: '90%', borderWidth: 1, borderColor: NEO_LIGHT },
  boxWeb:       { maxWidth: 480, borderRadius: 24, marginBottom: 40 },
  light:        { position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  backgroundColor: NEO_LIGHT, borderTopLeftRadius: 24, borderTopRightRadius: 24, opacity: 0.8 },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  titulo:       { color: colors.mint, fontSize: 17, fontWeight: '700' },
  sub:          { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  closeBtn:     { padding: 5, backgroundColor: colors.darkGreen, borderRadius: 8, borderWidth: 1, borderColor: NEO_LIGHT },
  label:        { color: colors.textMuted, fontSize: 11, fontWeight: '700', marginBottom: 8,
                  textTransform: 'uppercase', letterSpacing: 0.5 },
  input:        { backgroundColor: colors.darkGreen, borderRadius: 12, padding: 12, color: colors.mint,
                  fontSize: 14, borderWidth: 1, borderColor: NEO_LIGHT, marginBottom: 14 },
  rowChips:     { flexDirection: 'row', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  chip:         { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.darkGreen,
                  marginRight: 8, borderWidth: 1, borderColor: NEO_LIGHT },
  chipActive:   { backgroundColor: colors.sage, borderColor: colors.sage },
  chipTxt:      { color: colors.textMuted, fontSize: 13 },
  chipActiveTxt:{ color: colors.deepForest, fontWeight: '700' },
  guardarBtn:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
                  backgroundColor: colors.sage, borderRadius: 14, paddingVertical: 14, marginTop: 8 },
  guardarBtnTxt:{ color: colors.deepForest, fontWeight: '700', fontSize: 14 },
});

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function ActividadesScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const { pacientes, actualizarPaciente } = usePacientes();

  const isWide    = width >= 600;
  const maxW      = Math.min(width, 900);
  const cardW     = isWide ? (maxW - 48 - 16) / 2 : maxW - 32;
  const canGoBack = navigation?.canGoBack?.() ?? false;

  // ── FIX #4/12: inicializar vacío, cargar desde AsyncStorage ─────────────────
  const [actividades,  setActividades]  = useState([]);
  const [cargando,     setCargando]     = useState(true);
  const [catActiva,    setCatActiva]    = useState('Todos');
  const [busqueda,     setBusqueda]     = useState('');
  const [orden,        setOrden]        = useState('Más usadas');
  const [detalle,      setDetalle]      = useState(null);
  const [modalForm,    setModalForm]    = useState(false);
  const [editando,     setEditando]     = useState(null);
  const [form,         setForm]         = useState(FORM_VACIO);
  const [mostrarOrden, setMostrarOrden] = useState(false);

  // Carga inicial
  useEffect(() => {
    const cargar = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        setActividades(json ? JSON.parse(json) : ACTIVIDADES_BASE);
        if (!json) await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ACTIVIDADES_BASE));
      } catch (e) {
        console.error('Error cargando actividades:', e);
        setActividades(ACTIVIDADES_BASE);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // Persistir cambios
  useEffect(() => {
    if (!cargando) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(actividades)).catch(console.error);
    }
  }, [actividades, cargando]);

  // ── Filtrar y ordenar ────────────────────────────────────────────────────────
  const filtradas = useMemo(() => {
    let lista = actividades.filter(a =>
      (catActiva === 'Todos' || a.categoria === catActiva) &&
      (a.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
       a.descripcion?.toLowerCase().includes(busqueda.toLowerCase()))
    );
    switch (orden) {
      case 'Más usadas': return [...lista].sort((a, b) => b.usos - a.usos);
      case 'Recientes':  return [...lista].sort((a, b) => (b.creadaEn || '').localeCompare(a.creadaEn || ''));
      case 'Alfabético': return [...lista].sort((a, b) => a.titulo.localeCompare(b.titulo));
      case 'Favoritas':  return [...lista].sort((a, b) => (b.favorita ? 1 : 0) - (a.favorita ? 1 : 0));
      default:           return lista;
    }
  }, [actividades, catActiva, busqueda, orden]);

  // ── Acciones ─────────────────────────────────────────────────────────────────
  const toggleFav = useCallback((id) => {
    setActividades(prev => prev.map(a => a.id === id ? { ...a, favorita: !a.favorita } : a));
    setDetalle(prev => prev?.id === id ? { ...prev, favorita: !prev.favorita } : prev);
  }, []);

  const eliminar = useCallback((id) => {
    setActividades(prev => prev.filter(a => a.id !== id));
  }, []);

  const abrirEditar = useCallback((act) => {
    setEditando(act.id);
    setForm({ titulo: act.titulo, categoria: act.categoria, dificultad: act.dificultad,
              duracion: act.duracion, descripcion: act.descripcion || '', pacienteId: act.pacienteId || null });
    setModalForm(true);
  }, []);

  const guardar = useCallback(() => {
    if (!form.titulo.trim()) return;
    if (editando) {
      setActividades(prev => prev.map(a => a.id === editando ? { ...a, ...form, titulo: form.titulo.trim() } : a));
      setEditando(null);
    } else {
      setActividades(prev => [{
        ...form, titulo: form.titulo.trim(), id: Date.now().toString(),
        favorita: false, usos: 0, creadaEn: new Date().toISOString().slice(0, 10),
      }, ...prev]);
    }
    setForm(FORM_VACIO);
    setModalForm(false);
  }, [form, editando]);

  // ── FIX #2: firma correcta actualizarPaciente(id, datos) ─────────────────────
  const registrarEnSesion = useCallback((actId, pacId) => {
    const act = actividades.find(a => a.id === actId);
    const pac = pacientes.find(p => p.id === pacId);
    if (!act || !pac) return;

    if (!pac.sesiones || pac.sesiones.length === 0) {
      Alert.alert('Sin sesiones', `${pac.nombre} no tiene sesiones. ¿Crear una?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Crear sesión', onPress: () => navigation.navigate('NuevaSesion', { pacienteId: pac.id }) },
      ]);
      return;
    }

    const sesiones = [...pac.sesiones];
    const ultima   = { ...sesiones[0] };
    const activs   = ultima.actividades || [];
    const entrada  = `${act.titulo} (${act.duracion})`;

    if (activs.includes(entrada)) {
      Alert.alert('Ya registrada', `"${act.titulo}" ya está en la última sesión de ${pac.nombre}.`);
      return;
    }

    ultima.actividades = [...activs, entrada];
    sesiones[0] = ultima;

    // ✅ CORRECTO: actualizarPaciente(id, datos)
    actualizarPaciente(pac.id, { sesiones });

    setActividades(prev => prev.map(a => a.id === actId ? { ...a, usos: a.usos + 1 } : a));

    Alert.alert('✓ Registrada', `"${act.titulo}" añadida a la última sesión de ${pac.nombre}.`, [
      { text: 'Ver paciente', onPress: () => navigation.navigate('DetallePaciente', { pacienteId: pac.id }) },
      { text: 'OK', style: 'cancel' },
    ]);
  }, [actividades, pacientes, actualizarPaciente, navigation]);

  const cerrarForm = () => { setModalForm(false); setEditando(null); setForm(FORM_VACIO); };
  const favCount = actividades.filter(a => a.favorita).length;

  if (cargando) return null;

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.topBar}>
        <View style={s.topLeft}>
          {canGoBack && (
            <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={colors.mint} />
            </TouchableOpacity>
          )}
          <View>
            <Text style={s.title}>Actividades</Text>
            <Text style={s.subtitle}>{filtradas.length} actividades{favCount > 0 ? ` · ${favCount} ★` : ''}</Text>
          </View>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={() => { setEditando(null); setForm(FORM_VACIO); setModalForm(true); }}>
          <Ionicons name="add" size={18} color={colors.deepForest} />
          <Text style={s.addBtnTxt}>Nueva</Text>
        </TouchableOpacity>
      </View>

      <View style={s.searchWrap}>
        <Ionicons name="search" size={16} color={colors.textMuted} />
        <TextInput style={s.searchInput} placeholder="Buscar actividad..."
          placeholderTextColor={colors.textMuted} value={busqueda} onChangeText={setBusqueda} />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda('')}>
            <Ionicons name="close-circle" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[s.ordenBtn, mostrarOrden && s.ordenBtnActive]} onPress={() => setMostrarOrden(v => !v)}>
          <Ionicons name="funnel-outline" size={14} color={mostrarOrden ? colors.deepForest : colors.sage} />
        </TouchableOpacity>
      </View>

      {mostrarOrden && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          style={s.ordenScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {ORDENES.map(o => (
            <TouchableOpacity key={o} style={[s.chip, orden === o && s.chipActive]}
              onPress={() => { setOrden(o); setMostrarOrden(false); }}>
              <Text style={[s.chipTxt, orden === o && s.chipActiveTxt]}>{o}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={s.catScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {CATEGORIAS.map(cat => (
          <TouchableOpacity key={cat} style={[s.chip, catActiva === cat && s.chipActive]} onPress={() => setCatActiva(cat)}>
            <Text style={[s.chipTxt, catActiva === cat && s.chipActiveTxt]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={s.ordenIndicador}>
        <Ionicons name="swap-vertical" size={12} color={colors.textMuted} />
        <Text style={s.ordenIndicadorTxt}>Ordenado por: {orden}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[s.lista, isWide && s.listaWeb]}>
          {filtradas.length === 0 ? (
            <NeoPanel style={s.empty}>
              <Ionicons name="search-outline" size={36} color={colors.midGreen} />
              <Text style={s.emptyTxt}>Sin actividades encontradas</Text>
              <TouchableOpacity style={s.emptyBtn} onPress={() => { setEditando(null); setForm(FORM_VACIO); setModalForm(true); }}>
                <Text style={s.emptyBtnTxt}>+ Agregar actividad</Text>
              </TouchableOpacity>
            </NeoPanel>
          ) : (
            filtradas.map(a => (
              <ActividadCard key={a.id} act={a} pacientes={pacientes} cardWidth={cardW}
                onPress={() => setDetalle(a)} onToggleFav={toggleFav} />
            ))
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      <ModalDetalle act={detalle} pacientes={pacientes} isWide={isWide}
        onClose={() => setDetalle(null)} onEdit={abrirEditar} onDelete={eliminar}
        onRegistrar={registrarEnSesion} onToggleFav={toggleFav} />

      <ModalForm visible={modalForm} form={form} setForm={setForm} pacientes={pacientes}
        onGuardar={guardar} onCerrar={cerrarForm} editando={!!editando} isWide={isWide} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: colors.deepForest },
  topBar:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                      paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  topLeft:          { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn:          { width: 36, height: 36, borderRadius: 11, backgroundColor: NEO_BASE,
                      justifyContent: 'center', alignItems: 'center',
                      borderWidth: 1, borderColor: NEO_LIGHT,
                      shadowColor: NEO_DARK, shadowOffset: { width: 3, height: 3 },
                      shadowOpacity: 0.9, shadowRadius: 5, elevation: 5 },
  title:            { color: colors.mint, fontSize: 22, fontWeight: '700' },
  subtitle:         { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  addBtn:           { flexDirection: 'row', alignItems: 'center', gap: 5,
                      backgroundColor: colors.sage, borderRadius: 12,
                      paddingHorizontal: 12, paddingVertical: 7,
                      shadowColor: NEO_DARK, shadowOffset: { width: 3, height: 3 },
                      shadowOpacity: 0.8, shadowRadius: 5, elevation: 5 },
  addBtnTxt:        { color: colors.deepForest, fontWeight: '700', fontSize: 13 },
  searchWrap:       { flexDirection: 'row', alignItems: 'center', gap: 8,
                      backgroundColor: NEO_BASE, marginHorizontal: 16, marginBottom: 8,
                      borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
                      borderWidth: 1, borderColor: NEO_LIGHT,
                      shadowColor: NEO_DARK, shadowOffset: { width: 3, height: 3 },
                      shadowOpacity: 0.8, shadowRadius: 6, elevation: 5 },
  searchInput:      { flex: 1, color: colors.mint, fontSize: 14, padding: 0 },
  ordenBtn:         { width: 30, height: 30, borderRadius: 8, backgroundColor: colors.darkGreen,
                      justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: NEO_LIGHT },
  ordenBtnActive:   { backgroundColor: colors.sage },
  ordenScroll:      { maxHeight: 46, marginBottom: 4 },
  catScroll:        { maxHeight: 46, marginBottom: 4 },
  chip:             { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                      backgroundColor: NEO_BASE, borderWidth: 1, borderColor: NEO_LIGHT },
  chipActive:       { backgroundColor: colors.sage, borderColor: colors.sage },
  chipTxt:          { color: colors.textMuted, fontSize: 12 },
  chipActiveTxt:    { color: colors.deepForest, fontWeight: '700' },
  ordenIndicador:   { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 18, paddingBottom: 8 },
  ordenIndicadorTxt:{ color: colors.textMuted, fontSize: 11 },
  lista:            { paddingHorizontal: 16 },
  listaWeb:         { paddingHorizontal: 24, flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
  empty:            { alignItems: 'center', gap: 12, paddingVertical: 32, marginHorizontal: 16 },
  emptyTxt:         { color: colors.textMuted, fontSize: 14 },
  emptyBtn:         { backgroundColor: colors.midGreen, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 9 },
  emptyBtnTxt:      { color: colors.mint, fontWeight: '600', fontSize: 13 },
});