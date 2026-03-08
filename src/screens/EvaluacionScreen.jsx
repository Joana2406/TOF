import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, useWindowDimensions, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const evaluaciones = [
  { nombre: 'COPM',            descripcion: 'Canadian Occupational Performance Measure', areas: ['AVD', 'Productividad', 'Ocio'], completada: true  },
  { nombre: 'FIM',             descripcion: 'Functional Independence Measure',           areas: ['Motor', 'Cognitivo'],           completada: true  },
  { nombre: 'Barthel',         descripcion: 'Índice de Barthel para AVD básicas',        areas: ['AVD'],                          completada: false },
  { nombre: 'MMSE',            descripcion: 'Mini-Mental State Examination',             areas: ['Cognitivo'],                    completada: false },
  { nombre: 'Sensory Profile', descripcion: 'Perfil sensorial de Dunn',                 areas: ['Sensorial'],                    completada: false },
];

export default function EvaluacionScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [seleccionada, setSeleccionada] = useState(null);

  const isWeb = Platform.OS === 'web';
  const isWide = width >= 600;
  const maxW  = Math.min(width, 900);
  const cardW = isWide ? (maxW - 48 - 16) / 2 : maxW - 32;

  const canGoBack = navigation?.canGoBack?.() ?? false;

  // Inyectar CSS solo en web para que el scroll funcione
  useEffect(() => {
    if (!isWeb) return;
    const el = document.getElementById('evaluacion-scroll');
    if (el) {
      el.style.overflowY = 'auto';
      el.style.height = `${height - 90}px`;
    }
  }, [height, isWeb]);

  const cards = evaluaciones.map((ev, i) => (
    <TouchableOpacity
      key={i}
      style={[
        styles.card,
        { width: cardW },
        seleccionada === i && styles.cardActive,
      ]}
      onPress={() => setSeleccionada(seleccionada === i ? null : i)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Text style={styles.badgeTxt}>{ev.nombre}</Text>
        </View>
        <View style={[styles.status, { backgroundColor: ev.completada ? colors.sage : colors.midGreen }]}>
          <Ionicons name={ev.completada ? 'checkmark-circle' : 'time'} size={14} color={colors.mint} />
          <Text style={styles.statusTxt}>{ev.completada ? 'Completada' : 'Pendiente'}</Text>
        </View>
      </View>
      <Text style={styles.desc}>{ev.descripcion}</Text>
      <View style={styles.areasRow}>
        {ev.areas.map((a, j) => (
          <View key={j} style={styles.areaChip}>
            <Text style={styles.areaChipTxt}>{a}</Text>
          </View>
        ))}
      </View>
      {seleccionada === i && (
        <View style={styles.expanded}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="play" size={16} color={colors.deepForest} />
            <Text style={styles.actionBtnTxt}>Iniciar evaluación</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineBtn}>
            <Ionicons name="document-text" size={16} color={colors.mint} />
            <Text style={styles.outlineBtnTxt}>Ver resultados previos</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  ));

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          {canGoBack && (
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={colors.mint} />
            </TouchableOpacity>
          )}
          <View>
            <Text style={styles.title}>Evaluación</Text>
            <Text style={styles.subtitle}>Herramientas estandarizadas</Text>
          </View>
        </View>
      </View>

      {/* ── CONTENIDO ──────────────────────────────────────────── */}
      {isWeb ? (
        // En web: div nativo con scroll real
        <div
          id="evaluacion-scroll"
          style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            flex: 1,
            height: height - 90,
            paddingBottom: 40,
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: isWide ? 'row' : 'column',
            flexWrap: isWide ? 'wrap' : 'nowrap',
            gap: 16,
            justifyContent: isWide ? 'center' : 'flex-start',
            padding: isWide ? 24 : 16,
            alignItems: isWide ? 'flex-start' : 'center',
          }}>
            {cards}
          </div>
        </div>
      ) : (
        // En móvil: ScrollView normal
        <View style={{ flex: 1 }}>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            padding: 16,
            paddingBottom: 40,
            justifyContent: isWide ? 'center' : 'flex-start',
          }}>
            {cards}
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.deepForest },
  topBar:        { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12 },
  topLeft:       { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn:       { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.darkGreen, justifyContent: 'center', alignItems: 'center' },
  title:         { color: colors.mint,      fontSize: 22, fontWeight: '700' },
  subtitle:      { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  card:          { backgroundColor: colors.darkGreen, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'transparent' },
  cardActive:    { borderColor: colors.sage },
  cardHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge:         { backgroundColor: colors.midGreen, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  badgeTxt:      { color: colors.mint, fontWeight: '700', fontSize: 14 },
  status:        { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusTxt:     { color: colors.mint, fontSize: 11 },
  desc:          { color: colors.textMuted, fontSize: 13, marginBottom: 10 },
  areasRow:      { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  areaChip:      { backgroundColor: colors.deepForest, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  areaChipTxt:   { color: colors.sage, fontSize: 11 },
  expanded:      { marginTop: 14, gap: 10 },
  actionBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.sage, borderRadius: 12, paddingVertical: 12 },
  actionBtnTxt:  { color: colors.deepForest, fontWeight: '700' },
  outlineBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: colors.midGreen, borderRadius: 12, paddingVertical: 12 },
  outlineBtnTxt: { color: colors.mint, fontWeight: '500' },
});