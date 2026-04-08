// © 2025–2026 Joana Uribe — Todos los derechos reservados.
// Uso, copia o distribución sin autorización escrita está prohibido.
import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Platform, useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Text as SvgText, Line, Circle, Path, G } from 'react-native-svg';
import colors from '../theme/colors';
import { usePacientes } from '../context/PacientesContext';

// ─── HELPER: sombras cross-platform ──────────────────────────────────────────
// ✅ FIX #11: las props shadow* generan warnings en web.
// Platform.select aplica boxShadow en web y las props nativas en iOS/Android.
function shadow(color = '#000', offsetX = 4, offsetY = 4, blur = 8, opacity = 0.35) {
  return Platform.select({
    web: {
      boxShadow: `${offsetX}px ${offsetY}px ${blur}px rgba(0,0,0,${opacity})`,
    },
    default: {
      shadowColor: color,
      shadowOffset: { width: offsetX, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: blur / 2,
      elevation: Math.round(blur),
    },
  });
}

// ─── GRÁFICA DE BARRAS SVG ────────────────────────────────────────────────────
function GraficaBarras({ datos, colorBarra, alto = 120, labelAncho = 88 }) {
  if (!datos || datos.length === 0) return null;
  const W      = 340;
  const H      = alto;
  const padL   = labelAncho;
  const padR   = 12;
  const padT   = 8;
  const padB   = 20;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxVal = Math.max(...datos.map(d => d.valor), 1);
  const barH   = Math.max(4, innerH / datos.length - 6);

  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      {[0.25, 0.5, 0.75, 1].map(pct => {
        const x = padL + innerW * pct;
        return (
          <Line key={pct} x1={x} y1={padT} x2={x} y2={H - padB}
            stroke={colors.midGreen} strokeWidth="0.8" opacity="0.4" />
        );
      })}
      <Line x1={padL} y1={padT} x2={padL} y2={H - padB}
        stroke={colors.midGreen} strokeWidth="1" opacity="0.6" />

      {datos.map((d, i) => {
        const y     = padT + i * (innerH / datos.length) + 3;
        const w     = Math.max(4, (d.valor / maxVal) * innerW);
        const isMax = d.valor === maxVal;
        return (
          <G key={i}>
            <SvgText x={padL - 6} y={y + barH / 2 + 4} textAnchor="end"
              fill={colors.textMuted} fontSize="10" fontWeight={isMax ? '700' : '400'}>
              {d.label}
            </SvgText>
            <Rect x={padL} y={y} width={innerW} height={barH} rx={barH / 2} fill={colors.deepForest} />
            <Rect x={padL} y={y} width={w} height={barH} rx={barH / 2}
              fill={isMax ? colors.mint : (colorBarra || colors.sage)} opacity={isMax ? 1 : 0.8} />
            <SvgText x={padL + w + 5} y={y + barH / 2 + 4}
              fill={isMax ? colors.mint : colors.sage} fontSize="11" fontWeight="700">
              {d.valor}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

// ─── GRÁFICA DE LÍNEA ─────────────────────────────────────────────────────────
function GraficaLinea({ datos, color }) {
  if (!datos || datos.length < 2) return null;
  const W      = 340;
  const H      = 100;
  const padL   = 32;
  const padR   = 16;
  const padT   = 12;
  const padB   = 24;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxVal = Math.max(...datos.map(d => d.valor), 1);
  const step   = innerW / (datos.length - 1);

  const pts = datos.map((d, i) => ({
    x: padL + i * step,
    y: padT + innerH - (d.valor / maxVal) * innerH,
    ...d,
  }));

  const pathD = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pts[i - 1];
    const cpx  = (prev.x + p.x) / 2;
    return `${acc} C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${H - padB} L ${pts[0].x} ${H - padB} Z`;

  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      <Path d={areaD} fill={color || colors.sage} opacity="0.12" />
      <Path d={pathD} stroke={color || colors.sage} strokeWidth="2.5"
        fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <G key={i}>
          <Circle cx={p.x} cy={p.y} r="4" fill={color || colors.sage} />
          <Circle cx={p.x} cy={p.y} r="2" fill={colors.deepForest} />
          <SvgText x={p.x} y={H - padB + 14} textAnchor="middle" fill={colors.textMuted} fontSize="9">
            {p.label}
          </SvgText>
          {p.valor > 0 && (
            <SvgText x={p.x} y={p.y - 8} textAnchor="middle"
              fill={colors.mint} fontSize="10" fontWeight="700">
              {p.valor}
            </SvgText>
          )}
        </G>
      ))}
      <Line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB}
        stroke={colors.midGreen} strokeWidth="1" opacity="0.5" />
    </Svg>
  );
}

// ─── DONUT ────────────────────────────────────────────────────────────────────
function DonutSimple({ items }) {
  if (!items || items.length === 0) return null;
  const total = items.reduce((s, d) => s + d.valor, 0);
  if (total === 0) return null;
  const R   = 40;
  const CX  = 50;
  const CY  = 50;
  let angle = -90;

  const arcos = items.map(item => {
    const pct   = item.valor / total;
    const deg   = pct * 360;
    const start = angle;
    angle += deg;
    const end   = angle;
    const large = deg > 180 ? 1 : 0;
    const toRad = d => (d * Math.PI) / 180;
    const x1    = CX + R * Math.cos(toRad(start));
    const y1    = CY + R * Math.sin(toRad(start));
    const x2    = CX + R * Math.cos(toRad(end));
    const y2    = CY + R * Math.sin(toRad(end));
    return { ...item, pathD: `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`, pct };
  });

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <Svg width={100} height={100} viewBox="0 0 100 100">
        {arcos.map((a, i) => (
          <Path key={i} d={a.pathD} fill={a.color} opacity="0.9" />
        ))}
        <Circle cx={CX} cy={CY} r={22} fill={colors.darkGreen} />
        <SvgText x={CX} y={CY + 5} textAnchor="middle"
          fill={colors.mint} fontSize="12" fontWeight="700">
          {total}
        </SvgText>
      </Svg>
      <View style={{ flex: 1, gap: 6 }}>
        {arcos.map((a, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: a.color }} />
            <Text style={{ color: colors.textMuted, fontSize: 12, flex: 1 }}>{a.label}</Text>
            <Text style={{ color: colors.mint, fontSize: 12, fontWeight: '600' }}>
              {a.valor} ({Math.round(a.pct * 100)}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── TARJETA KPI ─────────────────────────────────────────────────────────────
function KPI({ icon, label, value, sub, color: col, onPress }) {
  return (
    <TouchableOpacity
      style={[kp.card, { borderTopColor: col || colors.sage }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <Ionicons name={icon} size={22} color={col || colors.sage} />
      <Text style={[kp.val, { color: col || colors.mint }]}>{value}</Text>
      <Text style={kp.label}>{label}</Text>
      {sub ? <Text style={kp.sub}>{sub}</Text> : null}
    </TouchableOpacity>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function EstadisticasScreen({ navigation }) {
  const { pacientes, citas } = usePacientes();
  const [pacSel, setPacSel] = useState(null);

  const activos    = pacientes.filter(p => p.activo).length;
  const totalSes   = pacientes.reduce((a, p) => a + p.sesiones.length, 0);
  const totalEval  = pacientes.reduce((a, p) => a + p.evaluaciones.length, 0);
  const totalCitas = citas.length;
  const promSes    = pacientes.length > 0 ? (totalSes / pacientes.length).toFixed(1) : '0';

  const tendenciaMensual = useMemo(() => {
    const conteo = {};
    pacientes.forEach(p => p.sesiones.forEach(s => {
      if (!s.fecha) return;
      const mes = s.fecha.slice(0, 7);
      conteo[mes] = (conteo[mes] || 0) + 1;
    }));
    const meses = Object.keys(conteo).sort().slice(-6);
    return meses.map(m => ({
      label: new Date(m + '-01').toLocaleDateString('es-MX', { month: 'short' }),
      valor: conteo[m],
    }));
  }, [pacientes]);

  const topDiags = useMemo(() => {
    const c = {};
    pacientes.forEach(p => {
      const d = p.diagnostico?.trim().split(/\s+/).slice(0, 4).join(' ') || 'Sin diagnóstico';
      c[d] = (c[d] || 0) + 1;
    });
    return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 6)
      .map(([label, valor]) => ({ label, valor }));
  }, [pacientes]);

  const topActs = useMemo(() => {
    const c = {};
    pacientes.forEach(p => p.sesiones.forEach(s =>
      (s.actividades || []).forEach(a => { c[a] = (c[a] || 0) + 1; })
    ));
    return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 7)
      .map(([label, valor]) => ({ label, valor }));
  }, [pacientes]);

  const sesPorPac = useMemo(() =>
    [...pacientes]
      .sort((a, b) => b.sesiones.length - a.sesiones.length)
      .slice(0, 7)
      .map(p => ({ label: p.nombre.split(' ')[0], valor: p.sesiones.length, id: p.id })),
    [pacientes]
  );

  const distribSexo = useMemo(() => {
    const COLORES = { Femenino: colors.sage, Masculino: colors.mint,
                      'No binario': '#e8c97a', 'Prefiero no decir': colors.midGreen };
    return ['Femenino', 'Masculino', 'No binario', 'Prefiero no decir']
      .map(sx => ({ label: sx, valor: pacientes.filter(p => p.sexo === sx).length, color: COLORES[sx] }))
      .filter(d => d.valor > 0);
  }, [pacientes]);

  const evalUsadas = useMemo(() => {
    const c = {};
    pacientes.forEach(p => (p.evaluaciones || []).forEach(ev => {
      c[ev.nombre] = (c[ev.nombre] || 0) + 1;
    }));
    return Object.entries(c).sort((a, b) => b[1] - a[1])
      .map(([label, valor]) => ({ label, valor }));
  }, [pacientes]);

  const pac = pacientes.find(p => p.id === pacSel);

  return (
    <SafeAreaView style={s.safe}>

      <View style={s.topBar}>
        <View>
          <Text style={s.title}>Estadísticas</Text>
          <Text style={s.subtitle}>
            {pacientes.length} paciente{pacientes.length !== 1 ? 's' : ''} · {totalSes} sesiones
          </Text>
        </View>
        <View style={s.promChip}>
          <Text style={s.promLabel}>Promedio sesiones</Text>
          <Text style={s.promVal}>{promSes}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 48 }}>

        {/* KPIs */}
        <View style={s.kpiGrid}>
          <KPI icon="people"    label="Activos"      value={activos}    color={colors.sage}
            onPress={() => navigation.navigate('Pacientes')} />
          <KPI icon="layers"    label="Sesiones"     value={totalSes}   color={colors.mint} />
          <KPI icon="clipboard" label="Evaluaciones" value={totalEval}  color="#e8c97a" />
          <KPI icon="calendar"  label="Citas"        value={totalCitas} color="#a8d5a2"
            onPress={() => navigation.navigate('Agenda')} />
        </View>

        {tendenciaMensual.length > 1 && (
          <View style={s.sec}>
            <View style={s.secHeader}>
              <Ionicons name="trending-up" size={16} color={colors.sage} />
              <Text style={s.secTitle}>Sesiones por mes</Text>
            </View>
            <View style={s.card}>
              <GraficaLinea datos={tendenciaMensual} color={colors.sage} />
            </View>
          </View>
        )}

        <View style={s.sec}>
          <View style={s.secHeader}>
            <Ionicons name="medical" size={16} color={colors.sage} />
            <Text style={s.secTitle}>Diagnósticos frecuentes</Text>
          </View>
          <View style={s.card}>
            {topDiags.length === 0
              ? <Text style={s.empty}>Sin datos aún</Text>
              : <GraficaBarras datos={topDiags} colorBarra={colors.sage} alto={topDiags.length * 28 + 30} />
            }
          </View>
        </View>

        <View style={s.sec}>
          <View style={s.secHeader}>
            <Ionicons name="person" size={16} color={colors.mint} />
            <Text style={s.secTitle}>Sesiones por paciente</Text>
            <Text style={s.secSub}>Toca para ver detalles</Text>
          </View>
          <View style={s.card}>
            {sesPorPac.length === 0
              ? <Text style={s.empty}>Sin sesiones registradas</Text>
              : <GraficaBarras datos={sesPorPac} colorBarra={colors.mint} alto={sesPorPac.length * 28 + 30} />
            }
            {sesPorPac.map(d => (
              <TouchableOpacity
                key={d.id}
                style={[s.pacRow, pacSel === d.id && s.pacRowActive]}
                onPress={() => setPacSel(pacSel === d.id ? null : d.id)}
              >
                <View style={s.pacDot} />
                <Text style={[s.pacNombre, pacSel === d.id && { color: colors.mint }]}>
                  {pacientes.find(p => p.id === d.id)?.nombre || d.label}
                </Text>
                <Text style={s.pacSesN}>{d.valor} ses.</Text>
                <Ionicons name={pacSel === d.id ? 'chevron-up' : 'chevron-down'} size={14} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {pac && (
          <View style={s.sec}>
            <View style={s.secHeader}>
              <Ionicons name="stats-chart" size={16} color="#e8c97a" />
              <Text style={[s.secTitle, { color: '#e8c97a' }]}>Detalle — {pac.nombre.split(' ')[0]}</Text>
            </View>
            <View style={s.card}>
              <View style={s.detKpis}>
                <View style={s.detKpi}><Text style={s.detKpiVal}>{pac.sesiones.length}</Text><Text style={s.detKpiLabel}>Sesiones</Text></View>
                <View style={s.detKpi}><Text style={s.detKpiVal}>{pac.evaluaciones.length}</Text><Text style={s.detKpiLabel}>Evaluaciones</Text></View>
                <View style={s.detKpi}><Text style={s.detKpiVal}>{pac.edad || '—'}</Text><Text style={s.detKpiLabel}>Edad</Text></View>
                <View style={s.detKpi}><Text style={s.detKpiVal}>{pac.activo ? '✓' : 'Alta'}</Text><Text style={s.detKpiLabel}>Estado</Text></View>
              </View>

              <View style={s.diagBox}>
                <Text style={s.diagTxt}>{pac.diagnostico || 'Sin diagnóstico'}</Text>
              </View>

              {(() => {
                const mesesPac = {};
                pac.sesiones.forEach(s => {
                  if (!s.fecha) return;
                  const m = s.fecha.slice(0, 7);
                  mesesPac[m] = (mesesPac[m] || 0) + 1;
                });
                const datos = Object.keys(mesesPac).sort().slice(-6).map(m => ({
                  label: new Date(m + '-01').toLocaleDateString('es-MX', { month: 'short' }),
                  valor: mesesPac[m],
                }));
                if (datos.length < 2) return null;
                return (
                  <>
                    <Text style={s.detSubtitle}>Sesiones por mes</Text>
                    <GraficaLinea datos={datos} color="#e8c97a" />
                  </>
                );
              })()}

              {pac.sesiones.length > 0 && (
                <>
                  <Text style={s.detSubtitle}>Última sesión</Text>
                  <View style={s.ultSes}>
                    <View style={s.ultSesRow}>
                      <Ionicons name="calendar-outline" size={13} color={colors.sage} />
                      <Text style={s.ultSesFecha}>{pac.sesiones[0].fecha}</Text>
                    </View>
                    {pac.sesiones[0].actividades?.length > 0 && (
                      <Text style={s.ultSesActs} numberOfLines={2}>
                        {pac.sesiones[0].actividades.join(' · ')}
                      </Text>
                    )}
                    {pac.sesiones[0].notas && (
                      <Text style={s.ultSesNotas} numberOfLines={2}>{pac.sesiones[0].notas}</Text>
                    )}
                  </View>
                </>
              )}

              <TouchableOpacity style={s.verExpBtn}
                onPress={() => navigation.navigate('DetallePaciente', { pacienteId: pac.id })}>
                <Ionicons name="folder-open" size={14} color={colors.deepForest} />
                <Text style={s.verExpBtnTxt}>Ver expediente completo</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {distribSexo.length > 0 && (
          <View style={s.sec}>
            <View style={s.secHeader}>
              <Ionicons name="people" size={16} color={colors.sage} />
              <Text style={s.secTitle}>Distribución por sexo</Text>
            </View>
            <View style={s.card}>
              <DonutSimple items={distribSexo} />
            </View>
          </View>
        )}

        <View style={s.sec}>
          <View style={s.secHeader}>
            <Ionicons name="barbell" size={16} color={colors.mint} />
            <Text style={s.secTitle}>Actividades más aplicadas</Text>
          </View>
          <View style={s.card}>
            {topActs.length === 0
              ? <Text style={s.empty}>Registra sesiones para ver estadísticas</Text>
              : <GraficaBarras datos={topActs} colorBarra={colors.mint} alto={topActs.length * 28 + 30} />
            }
          </View>
        </View>

        {evalUsadas.length > 0 && (
          <View style={s.sec}>
            <View style={s.secHeader}>
              <Ionicons name="clipboard" size={16} color="#e8c97a" />
              <Text style={s.secTitle}>Evaluaciones aplicadas</Text>
            </View>
            <View style={s.card}>
              <GraficaBarras datos={evalUsadas} colorBarra="#e8c97a" alto={evalUsadas.length * 28 + 30} />
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.deepForest },
  topBar:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                  paddingHorizontal: 20, paddingTop: 18, paddingBottom: 12 },
  title:        { color: colors.mint, fontSize: 24, fontWeight: '700' },
  subtitle:     { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  promChip:     { backgroundColor: colors.darkGreen, borderRadius: 12,
                  paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center' },
  promLabel:    { color: colors.textMuted, fontSize: 10 },
  promVal:      { color: colors.mint, fontSize: 20, fontWeight: '700' },
  kpiGrid:      { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, gap: 10, marginBottom: 6 },
  sec:          { marginHorizontal: 16, marginBottom: 20 },
  secHeader:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  secTitle:     { color: colors.sage, fontSize: 15, fontWeight: '700', flex: 1 },
  secSub:       { color: colors.textMuted, fontSize: 11 },
  card:         { backgroundColor: colors.darkGreen, borderRadius: 18, padding: 16, gap: 6 },
  empty:        { color: colors.textMuted, fontSize: 13, fontStyle: 'italic' },

  pacRow:       { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8,
                  borderTopWidth: 1, borderTopColor: colors.deepForest },
  pacRowActive: { backgroundColor: colors.deepForest + '88', borderRadius: 8,
                  paddingHorizontal: 8, marginHorizontal: -8 },
  pacDot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.midGreen },
  pacNombre:    { flex: 1, color: colors.textMuted, fontSize: 13 },
  pacSesN:      { color: colors.sage, fontSize: 12, fontWeight: '600' },

  detKpis:      { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  detKpi:       { alignItems: 'center', gap: 3 },
  detKpiVal:    { color: colors.mint, fontSize: 22, fontWeight: '700' },
  detKpiLabel:  { color: colors.textMuted, fontSize: 11 },
  diagBox:      { backgroundColor: colors.deepForest, borderRadius: 10, padding: 10, marginBottom: 8 },
  diagTxt:      { color: colors.textMuted, fontSize: 13, fontStyle: 'italic', textAlign: 'center' },
  detSubtitle:  { color: colors.sage, fontSize: 12, fontWeight: '600', marginTop: 8, marginBottom: 4 },
  ultSes:       { backgroundColor: colors.deepForest, borderRadius: 12, padding: 12, gap: 5 },
  ultSesRow:    { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ultSesFecha:  { color: colors.sage, fontSize: 13, fontWeight: '600' },
  ultSesActs:   { color: colors.mint, fontSize: 13 },
  ultSesNotas:  { color: colors.textMuted, fontSize: 12, fontStyle: 'italic' },
  verExpBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                  gap: 7, backgroundColor: colors.sage, borderRadius: 12,
                  paddingVertical: 11, marginTop: 10 },
  verExpBtnTxt: { color: colors.deepForest, fontWeight: '700' },
});

// ✅ FIX #11: kp.card usa la función shadow() en lugar de shadowColor/shadowOffset raw
const kp = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: colors.darkGreen,
    borderRadius: 16,
    padding: 14,
    gap: 4,
    borderTopWidth: 3,
    ...shadow('#000', 0, 4, 12, 0.3),
  },
  val:   { fontSize: 28, fontWeight: '700' },
  label: { color: colors.textMuted, fontSize: 12 },
  sub:   { color: colors.textMuted, fontSize: 11, fontStyle: 'italic' },
});