import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Modal, KeyboardAvoidingView, Platform,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const categorias     = ['Todos', 'Motor fino', 'Cognitivo', 'AVD', 'Sensorial', 'Social'];
const categoriasForm = ['Motor fino', 'Cognitivo', 'AVD', 'Sensorial', 'Social'];
const dificultades   = ['Baja', 'Media', 'Alta'];
const duraciones     = ['10 min', '15 min', '20 min', '30 min', '45 min', '60 min'];

const difColor = { Baja: '#8CB79B', Media: '#235347', Alta: '#173831' };

const actividadesIniciales = [
  { titulo: 'Enhebrar aguja',        categoria: 'Motor fino', dificultad: 'Media', duracion: '15 min', paciente: 'Laura M.'  },
  { titulo: 'Secuencia de rutina',   categoria: 'Cognitivo',  dificultad: 'Alta',  duracion: '20 min', paciente: 'Carlos R.' },
  { titulo: 'Vestido independiente', categoria: 'AVD',        dificultad: 'Alta',  duracion: '30 min', paciente: 'Carlos R.' },
  { titulo: 'Juego de texturas',     categoria: 'Sensorial',  dificultad: 'Baja',  duracion: '10 min', paciente: 'Sofía J.'  },
  { titulo: 'Recorte y pegado',      categoria: 'Motor fino', dificultad: 'Media', duracion: '20 min', paciente: 'Sofía J.'  },
  { titulo: 'Interacción en grupo',  categoria: 'Social',     dificultad: 'Media', duracion: '45 min', paciente: 'Laura M.'  },
];

const formVacio = {
  titulo: '', categoria: 'Motor fino', dificultad: 'Media',
  duracion: '20 min', paciente: '',
};

export default function ActividadesScreen({ navigation }) {
  const { width } = useWindowDimensions();

  const isWeb  = width >= 600;
  const maxW   = Math.min(width, 900);
  const cardW  = isWeb ? (maxW - 48 - 16) / 2 : maxW - 32;

  const canGoBack = navigation?.canGoBack?.() ?? false;

  const [actividades, setActividades] = useState(actividadesIniciales);
  const [catActiva,   setCatActiva]   = useState('Todos');
  const [busqueda,    setBusqueda]    = useState('');
  const [modal,       setModal]       = useState(false);
  const [form,        setForm]        = useState(formVacio);

  const filtradas = actividades.filter(a =>
    (catActiva === 'Todos' || a.categoria === catActiva) &&
    a.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const setF = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const guardar = () => {
    if (!form.titulo.trim()) return;
    setActividades(prev => [...prev, { ...form, titulo: form.titulo.trim() }]);
    setForm(formVacio);
    setModal(false);
  };

  return (
    <SafeAreaView style={s.safe}>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <View style={s.topBar}>
        <View style={s.topLeft}>
          {canGoBack && (
            <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={colors.mint} />
            </TouchableOpacity>
          )}
          <View>
            <Text style={s.title}>Actividades</Text>
            <Text style={s.subtitle}>{filtradas.length} actividades</Text>
          </View>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={() => setModal(true)}>
          <Ionicons name="add" size={20} color={colors.mint} />
          <Text style={s.addBtnTxt}>Nueva</Text>
        </TouchableOpacity>
      </View>

      {/* ── BUSCADOR ───────────────────────────────────────────── */}
      <View style={s.searchWrap}>
        <Ionicons name="search" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={s.searchInput}
          placeholder="Buscar actividad..."
          placeholderTextColor={colors.textMuted}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda('')}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── CATEGORÍAS ─────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.catScroll}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {categorias.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[s.catChip, catActiva === cat && s.catChipActive]}
            onPress={() => setCatActiva(cat)}
          >
            <Text style={[s.catText, catActiva === cat && s.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── LISTA ──────────────────────────────────────────────── */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[s.listaContent, isWeb && s.listaContentWeb]}>
          {filtradas.length === 0 ? (
            <View style={s.empty}>
              <Ionicons name="search-outline" size={36} color={colors.textMuted} />
              <Text style={s.emptyTxt}>Sin actividades encontradas</Text>
              <TouchableOpacity style={s.emptyBtn} onPress={() => setModal(true)}>
                <Text style={s.emptyBtnTxt}>+ Agregar actividad</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filtradas.map((a, i) => (
              <TouchableOpacity key={i} style={[s.card, { width: cardW }]}>
                <View style={s.cardTop}>
                  <Text style={s.cardTitulo} numberOfLines={1}>{a.titulo}</Text>
                  <View style={[s.difBadge, { backgroundColor: difColor[a.dificultad] }]}>
                    <Text style={s.difText}>{a.dificultad}</Text>
                  </View>
                </View>
                <View style={s.cardMeta}>
                  <View style={s.metaChip}>
                    <Ionicons name="folder-outline" size={11} color={colors.sage} />
                    <Text style={s.metaItem}>{a.categoria}</Text>
                  </View>
                  <View style={s.metaChip}>
                    <Ionicons name="time-outline" size={11} color={colors.sage} />
                    <Text style={s.metaItem}>{a.duracion}</Text>
                  </View>
                  <View style={s.metaChip}>
                    <Ionicons name="person-outline" size={11} color={colors.sage} />
                    <Text style={s.metaItem}>{a.paciente}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── MODAL NUEVA ACTIVIDAD ──────────────────────────────── */}
      <Modal visible={modal} transparent animationType="slide">
        <View style={s.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ width: '100%', alignItems: 'center' }}
          >
            <View style={[s.modalBox, isWeb && s.modalBoxWeb]}>

              {/* Header modal */}
              <View style={s.modalHeader}>
                <View>
                  <Text style={s.modalTitle}>Nueva actividad</Text>
                  <Text style={s.modalSub}>Completa los datos</Text>
                </View>
                <TouchableOpacity
                  style={s.closeBtn}
                  onPress={() => { setModal(false); setForm(formVacio); }}
                >
                  <Ionicons name="close" size={18} color={colors.mint} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                {/* Título */}
                <Text style={s.fieldLabel}>Nombre de la actividad *</Text>
                <TextInput
                  style={s.fieldInput}
                  value={form.titulo}
                  onChangeText={v => setF('titulo', v)}
                  placeholder="Ej. Pinza con plastilina"
                  placeholderTextColor={colors.textMuted}
                  autoFocus
                />

                {/* Paciente */}
                <Text style={s.fieldLabel}>Paciente</Text>
                <TextInput
                  style={s.fieldInput}
                  value={form.paciente}
                  onChangeText={v => setF('paciente', v)}
                  placeholder="Nombre del paciente"
                  placeholderTextColor={colors.textMuted}
                />

                {/* Categoría */}
                <Text style={s.fieldLabel}>Categoría</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                  {categoriasForm.map(c => (
                    <TouchableOpacity
                      key={c}
                      style={[s.chip, form.categoria === c && s.chipActive]}
                      onPress={() => setF('categoria', c)}
                    >
                      <Text style={[s.chipTxt, form.categoria === c && s.chipActiveTxt]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Dificultad */}
                <Text style={s.fieldLabel}>Dificultad</Text>
                <View style={s.rowChips}>
                  {dificultades.map(d => (
                    <TouchableOpacity
                      key={d}
                      style={[s.chip, form.dificultad === d && s.chipActive]}
                      onPress={() => setF('dificultad', d)}
                    >
                      <Text style={[s.chipTxt, form.dificultad === d && s.chipActiveTxt]}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Duración */}
                <Text style={[s.fieldLabel, { marginTop: 14 }]}>Duración</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                  {duraciones.map(d => (
                    <TouchableOpacity
                      key={d}
                      style={[s.chip, form.duracion === d && s.chipActive]}
                      onPress={() => setF('duracion', d)}
                    >
                      <Text style={[s.chipTxt, form.duracion === d && s.chipActiveTxt]}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Botón guardar */}
                <TouchableOpacity
                  style={[s.guardarBtn, !form.titulo.trim() && s.guardarBtnDisabled]}
                  onPress={guardar}
                  disabled={!form.titulo.trim()}
                >
                  <Ionicons name="checkmark-circle" size={16} color={colors.deepForest} />
                  <Text style={s.guardarBtnTxt}>Agregar actividad</Text>
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

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: colors.deepForest },

  // Header
  topBar:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  topLeft:         { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn:         { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.darkGreen, justifyContent: 'center', alignItems: 'center' },
  title:           { color: colors.mint, fontSize: 22, fontWeight: '700' },
  subtitle:        { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  addBtn:          { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.midGreen, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7 },
  addBtnTxt:       { color: colors.mint, fontWeight: '600', fontSize: 13 },

  // Buscador
  searchWrap:      { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.darkGreen, marginHorizontal: 16, marginBottom: 8, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10 },
  searchInput:     { flex: 1, color: colors.mint, fontSize: 14 },

  // Categorías
  catScroll:       { maxHeight: 46, marginBottom: 12 },
  catChip:         { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.darkGreen },
  catChipActive:   { backgroundColor: colors.sage },
  catText:         { color: colors.textMuted, fontSize: 13 },
  catTextActive:   { color: colors.deepForest, fontWeight: '600' },

  // Lista
  listaContent:    { paddingHorizontal: 16 },
  listaContentWeb: { paddingHorizontal: 24, flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
  empty:           { alignItems: 'center', paddingTop: 40, gap: 12 },
  emptyTxt:        { color: colors.textMuted, fontSize: 14 },
  emptyBtn:        { backgroundColor: colors.midGreen, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 9 },
  emptyBtnTxt:     { color: colors.mint, fontWeight: '600', fontSize: 13 },

  // Cards
  card:            { backgroundColor: colors.darkGreen, borderRadius: 16, padding: 16, marginBottom: 12 },
  cardTop:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitulo:      { color: colors.mint, fontSize: 15, fontWeight: '600', flex: 1, marginRight: 8 },
  difBadge:        { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  difText:         { color: colors.mint, fontSize: 11, fontWeight: '600' },
  cardMeta:        { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  metaChip:        { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaItem:        { color: colors.textMuted, fontSize: 12 },

  // Modal
  overlay:         { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end', alignItems: 'center' },
  modalBox:        { width: '100%', backgroundColor: colors.darkGreen, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 22, maxHeight: '88%' },
  modalBoxWeb:     { width: '100%', maxWidth: 480, borderRadius: 22, marginBottom: 40 },
  modalHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  modalTitle:      { color: colors.mint, fontSize: 17, fontWeight: '700' },
  modalSub:        { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  closeBtn:        { padding: 5, backgroundColor: colors.midGreen, borderRadius: 8 },
  fieldLabel:      { color: colors.textMuted, fontSize: 11, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  fieldInput:      { backgroundColor: colors.deepForest, borderRadius: 11, padding: 12, color: colors.mint, fontSize: 14, borderWidth: 1, borderColor: colors.midGreen, marginBottom: 14 },
  rowChips:        { flexDirection: 'row', gap: 8, marginBottom: 4 },
  chip:            { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.deepForest, marginRight: 8, borderWidth: 1, borderColor: colors.midGreen },
  chipActive:      { backgroundColor: colors.sage, borderColor: colors.sage },
  chipTxt:         { color: colors.textMuted, fontSize: 13 },
  chipActiveTxt:   { color: colors.deepForest, fontWeight: '700' },
  guardarBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: colors.sage, borderRadius: 13, paddingVertical: 13, marginTop: 8 },
  guardarBtnDisabled: { backgroundColor: colors.midGreen, opacity: 0.5 },
  guardarBtnTxt:   { color: colors.deepForest, fontWeight: '700', fontSize: 14 },
});