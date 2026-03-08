import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Alert, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { usePacientes } from '../context/PacientesContext';

const actividadesSugeridas = [
  'Movilización activa','Termoterapia','Crioterapia','Fortalecimiento rotadores',
  'Facilitación neuromuscular','AVD básicas','Integración sensorial','Pinza lateral',
  'Marcha supervisada','Equilibrio','Secuencia cognitiva','Ejercicio diafragmático',
  'Recorte y pegado','Escritura','Juego de texturas',
];

const duraciones = ['30 min','45 min','50 min','60 min','90 min'];

export default function NuevaSesionScreen({ route, navigation }) {
  const { pacienteId } = route.params || {};
  const { pacientes, agregarSesion } = usePacientes();
  const paciente = pacientes.find(p => p.id === pacienteId);

  const hoy = new Date().toISOString().split('T')[0];

  const [form, setForm]   = useState({
    fecha: hoy, duracion: '50 min', terapeuta: 'Fernanda TO',
    notas: '', objetivo: '', respuesta: '', planSiguiente: '',
  });
  const [acts, setActs]   = useState([]);
  const [custom, setCustom] = useState('');
  const [guardando, setGuardando] = useState(false);

  const toggleAct = (a) =>
    setActs(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const addCustom = () => {
    const t = custom.trim();
    if (t && !acts.includes(t)) { setActs(prev => [...prev, t]); }
    setCustom('');
  };

  const guardar = async () => {
    if (!pacienteId) { Alert.alert('Error', 'No se identificó el paciente.'); return; }
    if (acts.length === 0) { Alert.alert('Sin actividades', 'Agrega al menos una actividad.'); return; }
    setGuardando(true);
    try {
      agregarSesion(pacienteId, { ...form, actividades: acts });
      Alert.alert('✅ Sesión registrada', 'La sesión fue guardada correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch {
      Alert.alert('Error', 'No se pudo guardar la sesión.');
    } finally {
      setGuardando(false);
    }
  };

  if (!paciente) return (
    <SafeAreaView style={s.safe}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.mint }}>Paciente no encontrado</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.sage }}>Volver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.mint} />
          </TouchableOpacity>
          <View>
            <Text style={s.title}>Nueva Sesión</Text>
            <Text style={s.subtitle}>{paciente.nombre}</Text>
          </View>
          <TouchableOpacity onPress={guardar} style={s.saveBtn} disabled={guardando}>
            {guardando
              ? <ActivityIndicator size="small" color={colors.deepForest} />
              : <Text style={s.saveBtnTxt}>Guardar</Text>
            }
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Info sesión */}
          <View style={s.sec}>
            <Text style={s.secTitle}>📋 Información</Text>
            <View style={s.secBox}>
              <View style={s.campo}>
                <Text style={s.label}>Fecha</Text>
                <TextInput style={s.input} value={form.fecha}
                  onChangeText={v => setForm(f => ({ ...f, fecha: v }))}
                  placeholderTextColor={colors.textMuted} />
              </View>
              <View style={s.campo}>
                <Text style={s.label}>Duración</Text>
                <View style={s.durRow}>
                  {duraciones.map(d => (
                    <TouchableOpacity key={d}
                      style={[s.chip, form.duracion === d && s.chipActive]}
                      onPress={() => setForm(f => ({ ...f, duracion: d }))}>
                      <Text style={[s.chipTxt, form.duracion === d && s.chipActiveTxt]}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={s.campo}>
                <Text style={s.label}>Terapeuta</Text>
                <TextInput style={s.input} value={form.terapeuta}
                  onChangeText={v => setForm(f => ({ ...f, terapeuta: v }))}
                  placeholderTextColor={colors.textMuted} />
              </View>
              <View style={s.campo}>
                <Text style={s.label}>Objetivo de la sesión</Text>
                <TextInput style={[s.input, s.inputMulti]} value={form.objetivo}
                  onChangeText={v => setForm(f => ({ ...f, objetivo: v }))}
                  placeholder="¿Qué se espera lograr?" placeholderTextColor={colors.textMuted} multiline />
              </View>
            </View>
          </View>

          {/* Actividades */}
          <View style={s.sec}>
            <Text style={s.secTitle}>🏃 Actividades ({acts.length} seleccionadas)</Text>
            <View style={s.secBox}>
              <View style={s.actGrid}>
                {actividadesSugeridas.map(a => (
                  <TouchableOpacity key={a}
                    style={[s.actChip, acts.includes(a) && s.actChipActive]}
                    onPress={() => toggleAct(a)}>
                    {acts.includes(a) && <Ionicons name="checkmark" size={12} color={colors.deepForest} />}
                    <Text style={[s.actTxt, acts.includes(a) && s.actActiveTxt]}>{a}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={s.customRow}>
                <TextInput style={s.customInput} value={custom} onChangeText={setCustom}
                  placeholder="Agregar otra..." placeholderTextColor={colors.textMuted}
                  onSubmitEditing={addCustom} returnKeyType="done" />
                <TouchableOpacity style={s.addBtn} onPress={addCustom}>
                  <Ionicons name="add" size={20} color={colors.mint} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Evolución */}
          <View style={s.sec}>
            <Text style={s.secTitle}>📝 Evolución</Text>
            <View style={s.secBox}>
              {[
                { key: 'respuesta',     label: 'Respuesta del paciente',      ph: '¿Cómo respondió?' },
                { key: 'notas',         label: 'Observaciones clínicas',      ph: 'Avances, dificultades...' },
                { key: 'planSiguiente', label: 'Plan para siguiente sesión',  ph: '¿Qué se trabajará próximamente?' },
              ].map(field => (
                <View key={field.key} style={s.campo}>
                  <Text style={s.label}>{field.label}</Text>
                  <TextInput style={[s.input, s.inputMulti]} value={form[field.key]}
                    onChangeText={v => setForm(f => ({ ...f, [field.key]: v }))}
                    placeholder={field.ph} placeholderTextColor={colors.textMuted} multiline />
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.deepForest },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  backBtn:       { padding: 8, backgroundColor: colors.darkGreen, borderRadius: 12 },
  title:         { color: colors.mint, fontSize: 18, fontWeight: '700' },
  subtitle:      { color: colors.textMuted, fontSize: 12 },
  saveBtn:       { backgroundColor: colors.sage, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, minWidth: 80, alignItems: 'center' },
  saveBtnTxt:    { color: colors.deepForest, fontWeight: '700' },
  sec:           { marginHorizontal: 16, marginBottom: 20 },
  secTitle:      { color: colors.sage, fontSize: 15, fontWeight: '700', marginBottom: 10 },
  secBox:        { backgroundColor: colors.darkGreen, borderRadius: 18, padding: 16, gap: 14 },
  campo:         { gap: 6 },
  label:         { color: colors.textMuted, fontSize: 12, fontWeight: '500' },
  input:         { backgroundColor: colors.deepForest, borderRadius: 10, padding: 12, color: colors.mint, fontSize: 14, borderWidth: 1, borderColor: colors.midGreen },
  inputMulti:    { minHeight: 70, textAlignVertical: 'top' },
  durRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:          { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.deepForest, borderWidth: 1, borderColor: colors.midGreen },
  chipActive:    { backgroundColor: colors.sage, borderColor: colors.sage },
  chipTxt:       { color: colors.textMuted, fontSize: 13 },
  chipActiveTxt: { color: colors.deepForest, fontWeight: '600' },
  actGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actChip:       { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.deepForest, borderWidth: 1, borderColor: colors.midGreen },
  actChipActive: { backgroundColor: colors.sage, borderColor: colors.sage },
  actTxt:        { color: colors.textMuted, fontSize: 12 },
  actActiveTxt:  { color: colors.deepForest, fontWeight: '600' },
  customRow:     { flexDirection: 'row', gap: 8 },
  customInput:   { flex: 1, backgroundColor: colors.deepForest, borderRadius: 10, padding: 10, color: colors.mint, fontSize: 13, borderWidth: 1, borderColor: colors.midGreen },
  addBtn:        { backgroundColor: colors.midGreen, borderRadius: 10, padding: 10, justifyContent: 'center' },
});