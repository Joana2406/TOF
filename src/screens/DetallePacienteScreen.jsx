import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert
} from 'react-native';
import { SafeAreaView }    from 'react-native-safe-area-context';
import { Ionicons }        from '@expo/vector-icons';
import { LinearGradient }  from 'expo-linear-gradient';
import colors              from '../theme/colors';
import { usePacientes }    from '../context/PacientesContext';
import { exportarExpedientePDF } from '../services/generarPDF';

const TABS = ['Resumen','Sesiones','Evaluaciones','Antecedentes'];

export default function DetallePacienteScreen({ route, navigation }) {
  const { pacienteId } = route.params || {};
  const { pacientes }  = usePacientes();
  const p              = pacientes.find(x => x.id === pacienteId);
  const [tab, setTab]  = useState('Resumen');
  const [exportando, setExportando] = useState(false);

  if (!p) return (
    <SafeAreaView style={st.safe}>
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', gap:16 }}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
        <Text style={{ color: colors.mint, fontSize: 16 }}>Paciente no encontrado</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={st.saveBtn}>
          <Text style={st.saveBtnTxt}>Volver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const handlePDF = async () => {
    setExportando(true);
    const r = await exportarExpedientePDF(p);
    setExportando(false);
    if (!r.success) Alert.alert('Error al generar PDF', r.error || 'Intenta de nuevo.');
  };

  return (
    <SafeAreaView style={st.safe}>
      <LinearGradient colors={[colors.midGreen, colors.deepForest]} style={st.header}>
        {/* Fila superior: atrás + PDF */}
        <View style={st.headerNav}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.mint} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePDF} style={st.pdfBtn} disabled={exportando}>
            {exportando
              ? <ActivityIndicator size="small" color={colors.mint} />
              : <><Ionicons name="download-outline" size={18} color={colors.mint} />
                 <Text style={st.pdfBtnTxt}>PDF</Text></>
            }
          </TouchableOpacity>
        </View>

        {/* Info paciente */}
        <View style={st.headerContent}>
          <View style={st.bigAvatar}>
            <Text style={st.bigAvatarTxt}>{p.nombre[0]}</Text>
          </View>
          <Text style={st.nombre}>{p.nombre}</Text>
          <Text style={st.diag}>{p.diagnostico}</Text>
          <View style={st.chips}>
            <View style={st.chip}><Text style={st.chipTxt}>🎂 {p.edad} años</Text></View>
            <View style={st.chip}><Text style={st.chipTxt}>⚧ {p.sexo}</Text></View>
            <View style={[st.chip, { backgroundColor: p.activo ? colors.sage : colors.midGreen }]}>
              <Text style={[st.chipTxt, { color: p.activo ? colors.deepForest : colors.mint }]}>
                {p.activo ? '✓ Activo' : 'Alta'}
              </Text>
            </View>
          </View>
        </View>

        {/* Acciones rápidas */}
        <View style={st.quickActions}>
          <TouchableOpacity style={st.qa}
            onPress={() => navigation.navigate('NuevaSesion', { pacienteId: p.id })}>
            <Ionicons name="add-circle" size={20} color={colors.mint} />
            <Text style={st.qaTxt}>Nueva sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={st.qa}
            onPress={() => navigation.navigate('Antecedentes', { pacienteId: p.id })}>
            <Ionicons name="document-text" size={20} color={colors.mint} />
            <Text style={st.qaTxt}>Antecedentes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={st.qa}>
            <Ionicons name="call" size={20} color={colors.mint} />
            <Text style={st.qaTxt}>{p.telefono || 'Sin tel.'}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.tabsScroll}>
        {TABS.map(t => (
          <TouchableOpacity key={t} style={[st.tab, tab === t && st.tabActive]} onPress={() => setTab(t)}>
            <Text style={[st.tabTxt, tab === t && st.tabActiveTxt]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={st.body} showsVerticalScrollIndicator={false}>
        {tab === 'Resumen'      && <TabResumen      p={p} />}
        {tab === 'Sesiones'     && <TabSesiones     p={p} navigation={navigation} />}
        {tab === 'Evaluaciones' && <TabEvaluaciones p={p} />}
        {tab === 'Antecedentes' && <TabAnts         p={p} navigation={navigation} />}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ── TABS ──────────────────────────────────────────────────────────────────── */
function TabResumen({ p }) {
  const rows = [
    { icon:'call',      label:'Teléfono',     val: p.telefono },
    { icon:'mail',      label:'Correo',       val: p.correo },
    { icon:'briefcase', label:'Ocupación',    val: p.ocupacion },
    { icon:'heart',     label:'Estado civil', val: p.estadoCivil },
    { icon:'school',    label:'Escolaridad',  val: p.escolaridad },
    { icon:'warning',   label:'Alergias',     val: p.alergias },
    { icon:'medkit',    label:'Medicamentos', val: p.medicamentos },
  ];
  return (
    <View style={r.wrap}>
      <View style={r.card}>
        <Text style={r.cardTitle}>Motivo de consulta</Text>
        <Text style={r.cardText}>{p.motivoConsulta || '—'}</Text>
      </View>
      <View style={r.card}>
        {rows.map((row, i) => (
          <View key={i} style={r.row}>
            <Ionicons name={row.icon} size={15} color={colors.sage} style={{ width: 22 }} />
            <Text style={r.rowLabel}>{row.label}:</Text>
            <Text style={r.rowVal} numberOfLines={2}>{row.val || '—'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function TabSesiones({ p, navigation }) {
  return (
    <View style={r.wrap}>
      <TouchableOpacity style={r.newBtn}
        onPress={() => navigation.navigate('NuevaSesion', { pacienteId: p.id })}>
        <Ionicons name="add" size={18} color={colors.deepForest} />
        <Text style={r.newBtnTxt}>Registrar nueva sesión</Text>
      </TouchableOpacity>
      {p.sesiones.length === 0
        ? <View style={r.empty}><Ionicons name="calendar-outline" size={40} color={colors.textMuted} /><Text style={r.emptyTxt}>Sin sesiones</Text></View>
        : p.sesiones.map((s, i) => (
          <View key={s.id || i} style={r.sesCard}>
            <View style={r.sesHeader}>
              <Text style={r.sesFecha}>📅 {s.fecha}</Text>
              <Text style={r.sesDur}>⏱ {s.duracion}</Text>
            </View>
            <Text style={r.sesTer}>👩‍⚕️ {s.terapeuta}</Text>
            {s.objetivo ? <Text style={r.sesField}><Text style={r.sesFieldLabel}>Objetivo: </Text>{s.objetivo}</Text> : null}
            <View style={r.acts}>
              {s.actividades.map((a, j) => <View key={j} style={r.actChip}><Text style={r.actChipTxt}>{a}</Text></View>)}
            </View>
            {s.respuesta    ? <Text style={r.sesField}><Text style={r.sesFieldLabel}>Respuesta: </Text>{s.respuesta}</Text> : null}
            {s.notas        ? <Text style={r.sesField}><Text style={r.sesFieldLabel}>Notas: </Text>{s.notas}</Text> : null}
            {s.planSiguiente? <Text style={r.sesField}><Text style={r.sesFieldLabel}>Plan: </Text>{s.planSiguiente}</Text> : null}
          </View>
        ))
      }
    </View>
  );
}

function TabEvaluaciones({ p }) {
  return (
    <View style={r.wrap}>
      {p.evaluaciones.length === 0
        ? <View style={r.empty}><Ionicons name="clipboard-outline" size={40} color={colors.textMuted} /><Text style={r.emptyTxt}>Sin evaluaciones</Text></View>
        : p.evaluaciones.map((ev, i) => (
          <View key={ev.id || i} style={r.evalCard}>
            <View style={r.evalHeader}>
              <View style={r.evalBadge}><Text style={r.evalBadgeTxt}>{ev.nombre}</Text></View>
              <Text style={r.muted}>{ev.fecha}</Text>
            </View>
            <Text style={r.evalPts}>Resultado: {ev.puntaje}</Text>
            <Text style={r.muted}>{ev.observaciones}</Text>
          </View>
        ))
      }
    </View>
  );
}

function TabAnts({ p, navigation }) {
  const ant  = p.antecedentes || {};
  const items = [
    { key:'heredofamiliares',        label:'Heredofamiliares' },
    { key:'personalesPatologicos',   label:'Personales patológicos' },
    { key:'personalesNoPatologicos', label:'Personales no patológicos' },
    { key:'quirurgicos',             label:'Quirúrgicos' },
    { key:'traumatologicos',         label:'Traumatológicos' },
    { key:'ginecologicos',           label:'Gineco-obstétricos' },
  ];
  return (
    <View style={r.wrap}>
      <TouchableOpacity style={r.outlineBtn}
        onPress={() => navigation.navigate('Antecedentes', { pacienteId: p.id })}>
        <Ionicons name="create-outline" size={18} color={colors.mint} />
        <Text style={r.outlineBtnTxt}>Editar antecedentes</Text>
      </TouchableOpacity>
      {items.map((item, i) => (
        <View key={i} style={r.antCard}>
          <Text style={r.antLabel}>{item.label}</Text>
          <Text style={r.antVal}>{ant[item.key] || 'Sin registro'}</Text>
        </View>
      ))}
    </View>
  );
}

/* ── STYLES ─────────────────────────────────────────────────────────────────── */
const st = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.deepForest },
  header:       { padding: 16, paddingBottom: 18 },
  headerNav:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  backBtn:      { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' },
  pdfBtn:       { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  pdfBtnTxt:    { color: colors.mint, fontWeight: '600', fontSize: 13 },
  headerContent:{ alignItems: 'center', marginBottom: 14 },
  bigAvatar:    { width: 70, height: 70, borderRadius: 35, backgroundColor: colors.sage, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  bigAvatarTxt: { color: colors.deepForest, fontSize: 30, fontWeight: '700' },
  nombre:       { color: colors.mint, fontSize: 22, fontWeight: '700', textAlign: 'center' },
  diag:         { color: colors.textMuted, fontSize: 13, marginTop: 4, textAlign: 'center' },
  chips:        { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap', justifyContent: 'center' },
  chip:         { backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  chipTxt:      { color: colors.mint, fontSize: 12 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 16, padding: 12 },
  qa:           { alignItems: 'center', gap: 4 },
  qaTxt:        { color: colors.textMuted, fontSize: 11 },
  tabsScroll:   { maxHeight: 50, backgroundColor: colors.darkGreen, paddingLeft: 12 },
  tab:          { paddingHorizontal: 18, paddingVertical: 14 },
  tabActive:    { borderBottomWidth: 2, borderBottomColor: colors.sage },
  tabTxt:       { color: colors.textMuted, fontSize: 14 },
  tabActiveTxt: { color: colors.mint, fontWeight: '600' },
  body:         { flex: 1, padding: 16 },
  saveBtn:      { backgroundColor: colors.sage, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 },
  saveBtnTxt:   { color: colors.deepForest, fontWeight: '700' },
});

const r = StyleSheet.create({
  wrap:         { gap: 12 },
  card:         { backgroundColor: colors.darkGreen, borderRadius: 16, padding: 16, gap: 10 },
  cardTitle:    { color: colors.sage, fontSize: 13, fontWeight: '600' },
  cardText:     { color: colors.mint, fontSize: 14, lineHeight: 21 },
  row:          { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  rowLabel:     { color: colors.textMuted, fontSize: 13, minWidth: 90 },
  rowVal:       { color: colors.mint, fontSize: 13, flex: 1 },
  newBtn:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.sage, borderRadius: 14, paddingVertical: 12 },
  newBtnTxt:    { color: colors.deepForest, fontWeight: '700' },
  outlineBtn:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: colors.midGreen, borderRadius: 14, paddingVertical: 12 },
  outlineBtnTxt:{ color: colors.mint, fontWeight: '500' },
  empty:        { alignItems: 'center', padding: 40, gap: 10 },
  emptyTxt:     { color: colors.textMuted },
  muted:        { color: colors.textMuted, fontSize: 12 },
  sesCard:      { backgroundColor: colors.darkGreen, borderRadius: 14, padding: 14, gap: 7 },
  sesHeader:    { flexDirection: 'row', justifyContent: 'space-between' },
  sesFecha:     { color: colors.mint, fontWeight: '600' },
  sesDur:       { color: colors.textMuted, fontSize: 13 },
  sesTer:       { color: colors.textMuted, fontSize: 12 },
  sesField:     { color: colors.textMuted, fontSize: 12 },
  sesFieldLabel:{ color: colors.sage, fontWeight: '600' },
  acts:         { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  actChip:      { backgroundColor: colors.midGreen, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  actChipTxt:   { color: colors.mint, fontSize: 12 },
  evalCard:     { backgroundColor: colors.darkGreen, borderRadius: 14, padding: 14, gap: 6 },
  evalHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  evalBadge:    { backgroundColor: colors.midGreen, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  evalBadgeTxt: { color: colors.mint, fontWeight: '700' },
  evalPts:      { color: colors.sage, fontWeight: '600' },
  antCard:      { backgroundColor: colors.darkGreen, borderRadius: 14, padding: 14, gap: 4 },
  antLabel:     { color: colors.sage, fontSize: 12, fontWeight: '600' },
  antVal:       { color: colors.mint, fontSize: 14, lineHeight: 20 },
});