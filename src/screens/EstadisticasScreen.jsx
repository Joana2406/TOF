import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons }     from '@expo/vector-icons';
import colors           from '../theme/colors';
import { usePacientes } from '../context/PacientesContext';

const { width } = Dimensions.get('window');

/* Barra horizontal simple */
function Barra({ label, valor, max, color: col }) {
  const pct = max > 0 ? (valor / max) * 100 : 0;
  return (
    <View style={bar.wrap}>
      <Text style={bar.label} numberOfLines={1}>{label}</Text>
      <View style={bar.track}>
        <View style={[bar.fill, { width: `${pct}%`, backgroundColor: col || colors.sage }]} />
      </View>
      <Text style={bar.val}>{valor}</Text>
    </View>
  );
}

/* Tarjeta de KPI */
function KPI({ icon, label, value, sub, color: col }) {
  return (
    <View style={[kp.card, { borderLeftColor: col || colors.sage }]}>
      <Ionicons name={icon} size={24} color={col || colors.sage} />
      <Text style={kp.val}>{value}</Text>
      <Text style={kp.label}>{label}</Text>
      {sub ? <Text style={kp.sub}>{sub}</Text> : null}
    </View>
  );
}

export default function EstadisticasScreen({ navigation }) {
  const { pacientes, citas } = usePacientes();
  const [pacSel, setPacSel] = useState(null);

  /* ── Cálculos globales ─────────────────────────────────────────── */
  const activos   = pacientes.filter(p => p.activo).length;
  const totalSes  = pacientes.reduce((a, p) => a + p.sesiones.length, 0);
  const totalEval = pacientes.reduce((a, p) => a + p.evaluaciones.length, 0);
  const totalCitas = citas.length;

  // Diagnósticos más frecuentes
  const diagCount = {};
  pacientes.forEach(p => {
    const d = p.diagnostico?.split(' ').slice(0, 3).join(' ') || 'Sin diagnóstico';
    diagCount[d] = (diagCount[d] || 0) + 1;
  });
  const topDiags = Object.entries(diagCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxDiag  = topDiags[0]?.[1] || 1;

  // Actividades más usadas
  const actCount = {};
  pacientes.forEach(p => p.sesiones.forEach(s =>
    s.actividades?.forEach(a => { actCount[a] = (actCount[a] || 0) + 1; })
  ));
  const topActs = Object.entries(actCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxAct  = topActs[0]?.[1] || 1;

  // Sesiones por paciente
  const sesPorPac = [...pacientes]
    .sort((a, b) => b.sesiones.length - a.sesiones.length)
    .slice(0, 6);
  const maxSes = sesPorPac[0]?.sesiones.length || 1;

  /* ── Cálculos del paciente seleccionado ───────────────────────── */
  const pac = pacientes.find(p => p.id === pacSel);

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.topBar}>
        <Text style={s.title}>Estadísticas</Text>
        <Text style={s.subtitle}>Panel general TOF</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* KPIs globales */}
        <View style={s.kpiGrid}>
          <KPI icon="people"    label="Pacientes activos" value={activos}    color={colors.sage} />
          <KPI icon="calendar"  label="Total sesiones"    value={totalSes}   color={colors.midGreen} />
          <KPI icon="clipboard" label="Evaluaciones"      value={totalEval}  color={colors.sage} />
          <KPI icon="time"      label="Citas agendadas"   value={totalCitas} color={colors.midGreen} />
        </View>

        {/* Top diagnósticos */}
        <View style={s.sec}>
          <Text style={s.secTitle}>🏥 Diagnósticos frecuentes</Text>
          <View style={s.card}>
            {topDiags.length === 0
              ? <Text style={s.empty}>Sin datos aún</Text>
              : topDiags.map(([d, n], i) => (
                <Barra key={i} label={d} valor={n} max={maxDiag} color={colors.sage} />
              ))
            }
          </View>
        </View>

        {/* Sesiones por paciente */}
        <View style={s.sec}>
          <Text style={s.secTitle}>👤 Sesiones por paciente</Text>
          <View style={s.card}>
            {sesPorPac.map((p, i) => (
              <TouchableOpacity key={p.id} onPress={() => setPacSel(pacSel === p.id ? null : p.id)}>
                <Barra
                  label={p.nombre.split(' ')[0] + ' ' + (p.nombre.split(' ')[1]?.[0] || '') + '.'}
                  valor={p.sesiones.length}
                  max={maxSes}
                  color={pacSel === p.id ? colors.mint : colors.sage}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Detalle paciente seleccionado */}
        {pac && (
          <View style={s.sec}>
            <Text style={s.secTitle}>📊 Detalle — {pac.nombre}</Text>
            <View style={s.card}>
              <View style={s.detRow}>
                <View style={s.detItem}>
                  <Text style={s.detVal}>{pac.sesiones.length}</Text>
                  <Text style={s.detLabel}>Sesiones</Text>
                </View>
                <View style={s.detItem}>
                  <Text style={s.detVal}>{pac.evaluaciones.length}</Text>
                  <Text style={s.detLabel}>Evaluaciones</Text>
                </View>
                <View style={s.detItem}>
                  <Text style={s.detVal}>{pac.edad}</Text>
                  <Text style={s.detLabel}>Edad</Text>
                </View>
              </View>

              <Text style={s.detDiag}>{pac.diagnostico}</Text>

              {pac.sesiones.length > 0 && (
                <>
                  <Text style={[s.secTitle, { marginTop: 12, fontSize: 13 }]}>Última sesión</Text>
                  <View style={s.ultSes}>
                    <Text style={s.ultSesFecha}>📅 {pac.sesiones[0].fecha}</Text>
                    <Text style={s.ultSesActs}>{pac.sesiones[0].actividades?.join(', ')}</Text>
                    {pac.sesiones[0].notas ? <Text style={s.ultSesNotas}>{pac.sesiones[0].notas}</Text> : null}
                  </View>
                </>
              )}

              <TouchableOpacity
                style={s.verExpBtn}
                onPress={() => navigation.navigate('DetallePaciente', { pacienteId: pac.id })}
              >
                <Text style={s.verExpBtnTxt}>Ver expediente completo →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Actividades más usadas */}
        <View style={s.sec}>
          <Text style={s.secTitle}>🏃 Actividades más aplicadas</Text>
          <View style={s.card}>
            {topActs.length === 0
              ? <Text style={s.empty}>Registra sesiones para ver estadísticas</Text>
              : topActs.map(([a, n], i) => (
                <Barra key={i} label={a} valor={n} max={maxAct} color={i === 0 ? colors.mint : colors.sage} />
              ))
            }
          </View>
        </View>

        {/* Distribución por sexo */}
        <View style={s.sec}>
          <Text style={s.secTitle}>⚧ Distribución por sexo</Text>
          <View style={[s.card, { flexDirection: 'row', justifyContent: 'space-around' }]}>
            {['Femenino','Masculino','No binario','Prefiero no decir'].map(sx => {
              const n = pacientes.filter(p => p.sexo === sx).length;
              if (n === 0) return null;
              return (
                <View key={sx} style={s.sexItem}>
                  <Text style={s.sexVal}>{n}</Text>
                  <Text style={s.sexLabel}>{sx}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Resumen rápido */}
        <View style={s.sec}>
          <Text style={s.secTitle}>📋 Resumen de evaluaciones usadas</Text>
          <View style={s.card}>
            {(() => {
              const evalCount = {};
              pacientes.forEach(p => p.evaluaciones.forEach(ev => {
                evalCount[ev.nombre] = (evalCount[ev.nombre] || 0) + 1;
              }));
              const list = Object.entries(evalCount).sort((a, b) => b[1] - a[1]);
              return list.length === 0
                ? <Text style={s.empty}>Sin evaluaciones registradas</Text>
                : list.map(([nombre, n], i) => (
                  <View key={i} style={s.evalRow}>
                    <View style={s.evalBadge}><Text style={s.evalBadgeTxt}>{nombre}</Text></View>
                    <Text style={s.evalN}>{n} aplicación{n !== 1 ? 'es' : ''}</Text>
                  </View>
                ));
            })()}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.deepForest },
  topBar:      { padding: 20, paddingBottom: 10 },
  title:       { color: colors.mint,     fontSize: 24, fontWeight: '700' },
  subtitle:    { color: colors.textMuted,fontSize: 13, marginTop: 2 },
  kpiGrid:     { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10, marginBottom: 8 },
  sec:         { marginHorizontal: 16, marginBottom: 20 },
  secTitle:    { color: colors.sage, fontSize: 15, fontWeight: '700', marginBottom: 10 },
  card:        { backgroundColor: colors.darkGreen, borderRadius: 18, padding: 16, gap: 10 },
  empty:       { color: colors.textMuted, fontSize: 13, fontStyle: 'italic' },
  detRow:      { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  detItem:     { alignItems: 'center' },
  detVal:      { color: colors.mint,     fontSize: 26, fontWeight: '700' },
  detLabel:    { color: colors.textMuted,fontSize: 11 },
  detDiag:     { color: colors.textMuted,fontSize: 13, fontStyle: 'italic', textAlign: 'center' },
  ultSes:      { backgroundColor: colors.deepForest, borderRadius: 12, padding: 12, gap: 4 },
  ultSesFecha: { color: colors.sage,     fontSize: 13, fontWeight: '600' },
  ultSesActs:  { color: colors.mint,     fontSize: 13 },
  ultSesNotas: { color: colors.textMuted,fontSize: 12, fontStyle: 'italic' },
  verExpBtn:   { backgroundColor: colors.midGreen, borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginTop: 10 },
  verExpBtnTxt:{ color: colors.mint, fontWeight: '600' },
  sexItem:     { alignItems: 'center', gap: 4 },
  sexVal:      { color: colors.mint,     fontSize: 22, fontWeight: '700' },
  sexLabel:    { color: colors.textMuted,fontSize: 11, textAlign: 'center' },
  evalRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  evalBadge:   { backgroundColor: colors.midGreen, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  evalBadgeTxt:{ color: colors.mint, fontWeight: '600', fontSize: 13 },
  evalN:       { color: colors.textMuted,fontSize: 13 },
});

const bar = StyleSheet.create({
  wrap:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  label: { color: colors.textMuted, fontSize: 12, width: 90 },
  track: { flex: 1, height: 8, backgroundColor: colors.deepForest, borderRadius: 6, overflow: 'hidden' },
  fill:  { height: 8, borderRadius: 6 },
  val:   { color: colors.mint, fontSize: 12, fontWeight: '600', width: 24, textAlign: 'right' },
});

const kp = StyleSheet.create({
  card:  { width: (width - 36) / 2, backgroundColor: colors.darkGreen, borderRadius: 16, padding: 16, gap: 4, borderLeftWidth: 3 },
  val:   { color: colors.mint,      fontSize: 28, fontWeight: '700' },
  label: { color: colors.textMuted, fontSize: 12 },
  sub:   { color: colors.textMuted, fontSize: 11, fontStyle: 'italic' },
});