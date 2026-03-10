// © 2025–2026 Joana Uribe — Todos los derechos reservados.
// Uso, copia o distribución sin autorización escrita está prohibido.
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert, TextInput, useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePacientes } from '../context/PacientesContext';
import { exportarExpedientePDF } from '../services/generarPDF';
import colors from '../theme/colors';

export default function PacientesScreen({ navigation }) {
  const { pacientes } = usePacientes();
  const { width } = useWindowDimensions();
  const [busqueda, setBusqueda] = useState('');

  const isWeb = width >= 600;
  const maxW  = Math.min(width, 900);
  const cardW = isWeb ? (maxW - 48 - 16) / 2 : maxW - 32;

  const filtrados = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.diagnostico?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <SafeAreaView style={s.safe}>

      <View style={s.topBar}>
        <View>
          <Text style={s.title}>Pacientes</Text>
          <Text style={s.subtitle}>{filtrados.length} registrados</Text>
        </View>
        <TouchableOpacity
          style={s.addBtn}
          onPress={() => navigation.navigate('NuevoPaciente')}
        >
          <Ionicons name="add" size={20} color={colors.mint} />
          <Text style={s.addBtnTxt}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <View style={s.searchWrap}>
        <Ionicons name="search" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={s.searchInput}
          placeholder="Buscar por nombre o diagnóstico..."
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          s.lista,
          isWeb && s.listaWeb,
        ]}
      >
        {filtrados.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="people-outline" size={48} color={colors.textMuted} />
            <Text style={s.emptyTxt}>
              {busqueda.length > 0 ? 'Sin resultados para tu búsqueda' : 'No hay pacientes registrados'}
            </Text>
            {busqueda.length === 0 && (
              <TouchableOpacity
                style={s.emptyBtn}
                onPress={() => navigation.navigate('NuevoPaciente')}
              >
                <Text style={s.emptyBtnTxt}>+ Agregar primer paciente</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filtrados.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[s.card, { width: cardW }]}
              onPress={() => navigation.navigate('DetallePaciente', { pacienteId: p.id })}
              onLongPress={() =>
                Alert.alert(
                  p.nombre,
                  '¿Qué deseas hacer?',
                  [
                    { text: 'Ver expediente', onPress: () => navigation.navigate('DetallePaciente', { pacienteId: p.id }) },
                    { text: '📄 Exportar PDF', onPress: () => exportarExpedientePDF(p) },
                    { text: 'Cancelar', style: 'cancel' }
                  ]
                )
              }
            >
              <View style={s.cardTop}>
                <View style={s.avatar}>
                  <Text style={s.avatarTxt}>{p.nombre[0]}</Text>
                </View>
                <View style={s.cardInfo}>
                  <Text style={s.nombre} numberOfLines={1}>{p.nombre}</Text>
                  <Text style={s.diag} numberOfLines={1}>{p.diagnostico}</Text>
                </View>
                <View style={[s.statusDot, { backgroundColor: p.activo ? colors.sage : colors.midGreen }]} />
              </View>

              <View style={s.chips}>
                <View style={s.chip}>
                  <Ionicons name="person-outline" size={11} color={colors.sage} />
                  <Text style={s.chipTxt}>{p.edad} años • {p.sexo}</Text>
                </View>
                <View style={s.chip}>
                  <Ionicons name="calendar-outline" size={11} color={colors.sage} />
                  <Text style={s.chipTxt}>{p.sesiones?.length ?? 0} sesiones</Text>
                </View>
                {p.proximaCita && (
                  <View style={s.chip}>
                    <Ionicons name="time-outline" size={11} color={colors.sage} />
                    <Text style={s.chipTxt}>{p.proximaCita}</Text>
                  </View>
                )}
              </View>

              <View style={s.cardFooter}>
                <Text style={s.footerTxt}>{p.activo ? 'Activo' : 'Alta'}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.sage} />
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.deepForest },
  topBar:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 },
  title:       { color: colors.mint,      fontSize: 24, fontWeight: '700' },
  subtitle:    { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  addBtn:      { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.midGreen, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnTxt:   { color: colors.mint, fontWeight: '600', fontSize: 13 },
  searchWrap:  { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.darkGreen, marginHorizontal: 16, marginBottom: 12, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10 },
  searchInput: { flex: 1, color: colors.mint, fontSize: 14 },
  lista:       { paddingHorizontal: 16 },
  listaWeb:    { paddingHorizontal: 24, flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
  empty:       { alignItems: 'center', paddingTop: 60, gap: 14 },
  emptyTxt:    { color: colors.textMuted, fontSize: 15, textAlign: 'center' },
  emptyBtn:    { backgroundColor: colors.midGreen, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 },
  emptyBtnTxt: { color: colors.mint, fontWeight: '600', fontSize: 14 },
  card:        { backgroundColor: colors.darkGreen, borderRadius: 18, padding: 16, marginBottom: 12 },
  cardTop:     { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatar:      { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.midGreen, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  avatarTxt:   { color: colors.mint, fontSize: 20, fontWeight: '700' },
  cardInfo:    { flex: 1 },
  nombre:      { color: colors.mint,      fontSize: 16, fontWeight: '700' },
  diag:        { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  statusDot:   { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  chips:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip:        { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.deepForest, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  chipTxt:     { color: colors.textMuted, fontSize: 11 },
  cardFooter:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerTxt:   { color: colors.sage, fontSize: 12, fontWeight: '600' },
});
