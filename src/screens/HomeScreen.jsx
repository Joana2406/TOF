// © 2025–2026 Joana Uribe — Todos los derechos reservados.
// Uso, copia o distribución sin autorización escrita está prohibido.
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, useWindowDimensions, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../theme/colors';
import { usePacientes } from '../context/PacientesContext';

const PERFIL_KEY = '@TOF_perfil';

// ─── PALETA NEOMÓRFICA (idéntica a AgendaScreen) ──────────────────────────────
const NEO_BASE  = '#0a2a2b';
const NEO_LIGHT = '#0f3638';
const NEO_DARK  = '#031618';

// ─── COLORES POR TIPO DE CITA ─────────────────────────────────────────────────
const CITA_COLORES = {
  'Evaluación inicial':    colors.sage,
  'Sesión de tratamiento': colors.mint,
  'Seguimiento':           '#e8c97a',
  'Alta':                  '#a8d5a2',
  'Otro':                  colors.textMuted,
};

// ─── SALUDO DINÁMICO ──────────────────────────────────────────────────────────
const getSaludo = () => {
  const h = new Date().getHours();
  if (h < 12) return '¡Buenos días';
  if (h < 19) return '¡Buenas tardes';
  return '¡Buenas noches';
};

// ─── CHIP TIPO CITA ───────────────────────────────────────────────────────────
const TipoChip = ({ tipo }) => (
  <View style={[ch.chip, {
    backgroundColor: (CITA_COLORES[tipo] || colors.sage) + '22',
    borderColor:      CITA_COLORES[tipo] || colors.sage,
  }]}>
    <Text style={[ch.txt, { color: CITA_COLORES[tipo] || colors.sage }]}>{tipo}</Text>
  </View>
);
const ch = StyleSheet.create({
  chip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, borderWidth: 1 },
  txt:  { fontSize: 10, fontWeight: '600' },
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
    backgroundColor: NEO_BASE,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: NEO_LIGHT,
    shadowColor: NEO_DARK,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 12,
  },
  innerLight: {
    position: 'absolute',
    top: 0, left: 0, right: 0, height: 1,
    backgroundColor: NEO_LIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    opacity: 0.8,
  },
});

// ─── STAT CARD NEOMÓRFICA ─────────────────────────────────────────────────────
function StatCard({ icon, value, label, color, onPress }) {
  return (
    <TouchableOpacity style={[st.card, { borderTopColor: color }]} onPress={onPress} activeOpacity={0.8}>
      <View style={st.light} />
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[st.val, { color }]}>{value}</Text>
      <Text style={st.label}>{label}</Text>
    </TouchableOpacity>
  );
}
const st = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: NEO_BASE,
    borderRadius: 18, padding: 14,
    alignItems: 'center', gap: 5,
    borderTopWidth: 3, borderWidth: 1, borderColor: NEO_LIGHT,
    shadowColor: NEO_DARK,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 8,
  },
  light: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
    backgroundColor: NEO_LIGHT,
    borderTopLeftRadius: 18, borderTopRightRadius: 18, opacity: 0.7,
  },
  val:   { color: colors.mint, fontSize: 22, fontWeight: '800' },
  label: { color: colors.textMuted, fontSize: 10, textAlign: 'center', lineHeight: 14 },
});

// ─── QUICK CARD NEOMÓRFICA ────────────────────────────────────────────────────
function QuickCard({ icon, label, color, onPress, cardWidth }) {
  return (
    <TouchableOpacity style={[qc.card, { width: cardWidth }]} onPress={onPress} activeOpacity={0.75}>
      <View style={qc.light} />
      <View style={[qc.iconWrap, { backgroundColor: color + '18', borderColor: color + '44' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={qc.label}>{label}</Text>
    </TouchableOpacity>
  );
}
const qc = StyleSheet.create({
  card: {
    backgroundColor: NEO_BASE,
    borderRadius: 18, paddingVertical: 16, paddingHorizontal: 6,
    alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: NEO_LIGHT,
    shadowColor: NEO_DARK,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.95, shadowRadius: 8, elevation: 7,
  },
  light: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
    backgroundColor: NEO_LIGHT,
    borderTopLeftRadius: 18, borderTopRightRadius: 18, opacity: 0.7,
  },
  iconWrap: { width: 46, height: 46, borderRadius: 14, borderWidth: 1,
              justifyContent: 'center', alignItems: 'center' },
  label:    { color: colors.mint, fontSize: 10, fontWeight: '600', textAlign: 'center' },
});

// ─── CITA CARD NEOMÓRFICA ─────────────────────────────────────────────────────
function CitaCard({ cita, pac, esHoy, onPress, onPressExp }) {
  const color = CITA_COLORES[cita.tipo] || colors.sage;
  return (
    <TouchableOpacity
      style={[cc.card, esHoy && cc.cardHoy]}
      onPress={onPress} activeOpacity={0.85}
    >
      <View style={[cc.bar, { backgroundColor: color }]} />
      <View style={cc.horaWrap}>
        <Text style={cc.hora}>{cita.hora || '—'}</Text>
        {esHoy && <Text style={cc.hoyTag}>HOY</Text>}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={cc.nombre}>{pac?.nombre || 'Paciente'}</Text>
        <View style={cc.metaRow}>
          <TipoChip tipo={cita.tipo} />
          {!esHoy && <Text style={cc.fecha}>{cita.fecha}</Text>}
        </View>
      </View>
      {pac && (
        <TouchableOpacity style={cc.expBtn} onPress={onPressExp}>
          <Ionicons name="person" size={14} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
const cc = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: NEO_BASE,
    borderRadius: 16, marginBottom: 8,
    overflow: 'hidden', paddingRight: 12,
    borderWidth: 1, borderColor: NEO_LIGHT,
    shadowColor: NEO_DARK,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.9, shadowRadius: 8, elevation: 6,
  },
  cardHoy: { borderColor: colors.sage + '66' },
  bar:     { width: 4, alignSelf: 'stretch' },
  horaWrap:{ alignItems: 'center', paddingVertical: 14, paddingLeft: 12, minWidth: 52 },
  hora:    { color: colors.mint, fontWeight: '700', fontSize: 14 },
  hoyTag:  { color: colors.sage, fontSize: 9, fontWeight: '700', letterSpacing: 0.5, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' },
  nombre:  { color: colors.mint, fontWeight: '600', fontSize: 14 },
  fecha:   { color: colors.textMuted, fontSize: 11 },
  expBtn:  { padding: 6 },
});

// ─── PAC CARD NEOMÓRFICA ──────────────────────────────────────────────────────
function PacCard({ pac, onPress }) {
  const ultimaSes = pac.sesiones?.[0];
  return (
    <TouchableOpacity style={pc.card} onPress={onPress} activeOpacity={0.85}>
      <View style={pc.light} />
      <View style={[pc.avatar, !pac.activo && { opacity: 0.5 }]}>
        <Text style={pc.avatarTxt}>{pac.nombre.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={pc.nombreRow}>
          <Text style={pc.nombre}>{pac.nombre}</Text>
          {!pac.activo && (
            <View style={pc.altaBadge}><Text style={pc.altaTxt}>Alta</Text></View>
          )}
        </View>
        <Text style={pc.diag} numberOfLines={1}>{pac.diagnostico || 'Sin diagnóstico'}</Text>
        <Text style={pc.ultSes}>
          {ultimaSes ? `Última sesión: ${ultimaSes.fecha}` : 'Sin sesiones registradas'}
        </Text>
      </View>
      <View style={pc.sesCount}>
        <Text style={pc.sesVal}>{pac.sesiones?.length || 0}</Text>
        <Text style={pc.sesLabel}>ses.</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );
}
const pc = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: NEO_BASE,
    borderRadius: 18, padding: 14, marginBottom: 10, gap: 12,
    borderWidth: 1, borderColor: NEO_LIGHT,
    shadowColor: NEO_DARK,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.9, shadowRadius: 8, elevation: 6,
  },
  light: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
    backgroundColor: NEO_LIGHT,
    borderTopLeftRadius: 18, borderTopRightRadius: 18, opacity: 0.7,
  },
  avatar:    { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.midGreen,
               justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { color: colors.mint, fontWeight: '700', fontSize: 18 },
  nombreRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nombre:    { color: colors.mint, fontWeight: '600', fontSize: 15 },
  diag:      { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  ultSes:    { color: colors.sage, fontSize: 11, marginTop: 3 },
  sesCount:  { alignItems: 'center', marginRight: 4 },
  sesVal:    { color: colors.mint, fontWeight: '700', fontSize: 16 },
  sesLabel:  { color: colors.textMuted, fontSize: 10 },
  altaBadge: { backgroundColor: colors.midGreen, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  altaTxt:   { color: colors.textMuted, fontSize: 10 },
});

// ─── EMPTY STATE NEOMÓRFICO ───────────────────────────────────────────────────
function EmptyState({ icon, texto, btnTxt, onPress }) {
  return (
    <NeoPanel style={{ alignItems: 'center', gap: 10, paddingVertical: 28 }}>
      <Ionicons name={icon} size={32} color={colors.midGreen} />
      <Text style={{ color: colors.textMuted, fontSize: 14 }}>{texto}</Text>
      <TouchableOpacity style={em.btn} onPress={onPress} activeOpacity={0.8}>
        <View style={em.btnLight} />
        <Text style={em.btnTxt}>{btnTxt}</Text>
      </TouchableOpacity>
    </NeoPanel>
  );
}
const em = StyleSheet.create({
  btn: {
    backgroundColor: colors.midGreen, borderRadius: 12,
    paddingHorizontal: 20, paddingVertical: 9, marginTop: 4,
    shadowColor: NEO_DARK, shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.8, shadowRadius: 5, elevation: 5,
  },
  btnLight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
    backgroundColor: NEO_LIGHT, borderTopLeftRadius: 12, borderTopRightRadius: 12, opacity: 0.7,
  },
  btnTxt: { color: colors.mint, fontWeight: '600', fontSize: 13 },
});

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const { pacientes, citas } = usePacientes();
  const [perfil, setPerfil] = useState({ nombre: 'solecito', foto: null });

  useEffect(() => {
    const cargar = async () => {
      try {
        const raw = await AsyncStorage.getItem(PERFIL_KEY);
        if (raw) {
          const p = JSON.parse(raw);
          setPerfil({ nombre: p.nombre || 'solecito', foto: p.foto || null });
        }
      } catch (_) {}
    };
    cargar();
    const unsub = navigation.addListener('focus', cargar);
    return unsub;
  }, [navigation]);

  const hoy   = new Date().toISOString().split('T')[0];
  const ahora = new Date();

  const citasHoy = citas
    .filter(c => c.fecha === hoy)
    .sort((a, b) => (a.hora || '').localeCompare(b.hora || ''));

  const proximasCitas = citas
    .filter(c => c.fecha >= hoy)
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || (a.hora||'').localeCompare(b.hora||''))
    .slice(0, 4);

  const pacActivos    = pacientes.filter(p => p.activo);
  const totalSesiones = pacientes.reduce((a, p) => a + p.sesiones.length, 0);

  const recientes = [...pacientes]
    .filter(p => p.sesiones?.length > 0)
    .sort((a, b) => (b.sesiones[0]?.fecha || '').localeCompare(a.sesiones[0]?.fecha || ''))
    .slice(0, 3);
  const listaPacientes = recientes.length > 0 ? recientes : pacientes.slice(0, 3);

  const todasFechas     = pacientes.flatMap(p => p.sesiones.map(s => s.fecha)).filter(Boolean).sort().reverse();
  const diasDesdeUltima = todasFechas[0]
    ? Math.floor((ahora - new Date(todasFechas[0])) / 86400000)
    : null;

  const isWide  = width >= 600;
  const cardW   = isWide ? (width - 48 - 16) / 3 : (width - 32 - 12) / 3;
  const inicial = perfil.nombre?.charAt(0)?.toUpperCase() || 'T';

  const accesos = [
    { label: 'Nuevo\npaciente',  icon: 'person-add', screen: 'NuevoPaciente', color: colors.sage   },
    { label: 'Nueva\ncita',      icon: 'calendar',   screen: 'Agenda',        color: '#e8c97a'     },
    { label: 'Estadísticas',     icon: 'bar-chart',  screen: 'Estadísticas',  color: colors.mint   },
    { label: 'Ejercicios',       icon: 'fitness',    screen: 'Ejercicios',    color: colors.sage   },
    { label: 'Actividades',      icon: 'layers',     screen: 'Actividades',   color: colors.mint   },
    { label: 'Evaluaciones',     icon: 'clipboard',  screen: 'Evaluacion',    color: '#a8d5a2'     },
  ];

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── HEADER GRADIENTE ── */}
        <LinearGradient
          colors={[colors.midGreen, colors.deepForest]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={s.header}
        >
          <View style={s.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={s.saludo}>{getSaludo()},</Text>
              <Text style={s.nombre} numberOfLines={1}>
                {perfil.nombre.split(' ')[0]} ☀️
              </Text>
              <Text style={s.fecha}>
                {ahora.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Text>
            </View>

            <TouchableOpacity style={s.avatarBtn} onPress={() => navigation.navigate('Perfil')} activeOpacity={0.85}>
              {perfil.foto
                ? <Image source={{ uri: perfil.foto }} style={s.avatarImg} />
                : <View style={s.avatar}><Text style={s.avatarTxt}>{inicial}</Text></View>
              }
              <View style={s.avatarDot}>
                <Ionicons name="person" size={8} color={colors.deepForest} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Banner citas hoy */}
          {citasHoy.length > 0 ? (
            <TouchableOpacity style={s.banner} onPress={() => navigation.navigate('Agenda')} activeOpacity={0.85}>
              <View style={s.bannerLeft}>
                <View style={s.bannerDot} />
                <View>
                  <Text style={s.bannerTitulo}>
                    {citasHoy.length === 1 ? '1 cita programada hoy' : `${citasHoy.length} citas programadas hoy`}
                  </Text>
                  <Text style={s.bannerSub}>
                    {citasHoy.map(c => c.hora).filter(Boolean).join(' · ') || 'Ver agenda'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.mint} />
            </TouchableOpacity>
          ) : (
            <View style={[s.banner, { opacity: 0.6 }]}>
              <View style={s.bannerLeft}>
                <View style={[s.bannerDot, { backgroundColor: colors.textMuted }]} />
                <Text style={s.bannerTitulo}>Sin citas para hoy</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Agenda')}>
                <Text style={s.bannerLink}>+ Agendar</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>

        {/* ── STATS NEOMÓRFICAS ── */}
        <View style={s.statsRow}>
          <StatCard icon="people"   value={pacActivos.length}  label={'Pacientes\nactivos'}  color={colors.sage}  onPress={() => navigation.navigate('Pacientes')} />
          <StatCard icon="calendar" value={citasHoy.length}    label={'Citas\nhoy'}          color="#e8c97a"      onPress={() => navigation.navigate('Agenda')} />
          <StatCard icon="layers"   value={totalSesiones}      label={'Sesiones\ntotales'}   color={colors.mint}  onPress={() => navigation.navigate('Estadísticas')} />
        </View>

        {/* Indicador última sesión */}
        {diasDesdeUltima !== null && (
          <View style={s.ultimaWrap}>
            <Ionicons
              name={diasDesdeUltima === 0 ? 'checkmark-circle' : diasDesdeUltima <= 2 ? 'time' : 'alert-circle'}
              size={14}
              color={diasDesdeUltima === 0 ? colors.sage : diasDesdeUltima <= 2 ? '#e8c97a' : colors.textMuted}
            />
            <Text style={s.ultimaTxt}>
              {diasDesdeUltima === 0
                ? 'Registraste una sesión hoy 🎉'
                : diasDesdeUltima === 1
                ? 'Última sesión: ayer'
                : `Última sesión registrada hace ${diasDesdeUltima} días`}
            </Text>
          </View>
        )}

        {/* ── ACCESO RÁPIDO NEOMÓRFICO ── */}
        <View style={s.section}>
          <Text style={s.secTitle}>Acceso rápido</Text>
          <View style={s.quickGrid}>
            {accesos.map((a, i) => (
              <QuickCard
                key={i}
                icon={a.icon}
                label={a.label}
                color={a.color}
                cardWidth={cardW}
                onPress={() => navigation.navigate(a.screen)}
              />
            ))}
          </View>
        </View>

        {/* ── PRÓXIMAS CITAS NEOMÓRFICAS ── */}
        <View style={s.section}>
          <View style={s.secRow}>
            <Text style={s.secTitle}>Próximas citas</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Agenda')}>
              <Text style={s.link}>Ver agenda</Text>
            </TouchableOpacity>
          </View>
          {proximasCitas.length === 0 ? (
            <EmptyState
              icon="calendar-outline" texto="No hay citas próximas"
              btnTxt="+ Agendar cita" onPress={() => navigation.navigate('Agenda')}
            />
          ) : (
            proximasCitas.map(c => {
              const pac = pacientes.find(p => p.id === c.pacienteId);
              return (
                <CitaCard
                  key={c.id} cita={c} pac={pac} esHoy={c.fecha === hoy}
                  onPress={() => navigation.navigate('Agenda')}
                  onPressExp={() => pac && navigation.navigate('DetallePaciente', { pacienteId: pac.id })}
                />
              );
            })
          )}
        </View>

        {/* ── ACTIVIDAD RECIENTE / PACIENTES NEOMÓRFICOS ── */}
        <View style={s.section}>
          <View style={s.secRow}>
            <Text style={s.secTitle}>{recientes.length > 0 ? 'Actividad reciente' : 'Pacientes'}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Pacientes')}>
              <Text style={s.link}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          {listaPacientes.length === 0 ? (
            <EmptyState
              icon="people-outline" texto="Aún no hay pacientes"
              btnTxt="+ Crear primer paciente" onPress={() => navigation.navigate('NuevoPaciente')}
            />
          ) : (
            listaPacientes.map(p => (
              <PacCard
                key={p.id} pac={p}
                onPress={() => navigation.navigate('DetallePaciente', { pacienteId: p.id })}
              />
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── ESTILOS BASE ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.deepForest },
  header:       { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 20,
                  borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  saludo:       { color: colors.sage, fontSize: 14 },
  nombre:       { color: colors.mint, fontSize: 26, fontWeight: '800', letterSpacing: 0.5 },
  fecha:        { color: colors.textMuted, fontSize: 12, marginTop: 4, textTransform: 'capitalize' },
  avatarBtn:    { position: 'relative' },
  avatar:       { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.darkGreen,
                  justifyContent: 'center', alignItems: 'center',
                  borderWidth: 2, borderColor: colors.sage + '66' },
  avatarImg:    { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: colors.mint },
  avatarTxt:    { color: colors.mint, fontWeight: '700', fontSize: 22 },
  avatarDot:    { position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderRadius: 8,
                  backgroundColor: colors.mint, justifyContent: 'center', alignItems: 'center',
                  borderWidth: 2, borderColor: colors.midGreen },
  banner:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14,
                  paddingHorizontal: 14, paddingVertical: 11 },
  bannerLeft:   { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  bannerDot:    { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.sage },
  bannerTitulo: { color: colors.mint, fontSize: 13, fontWeight: '600' },
  bannerSub:    { color: colors.textMuted, fontSize: 11, marginTop: 1 },
  bannerLink:   { color: colors.sage, fontSize: 12, fontWeight: '600' },
  statsRow:     { flexDirection: 'row', paddingHorizontal: 14, paddingTop: 16, gap: 10 },
  ultimaWrap:   { flexDirection: 'row', alignItems: 'center', gap: 6, marginHorizontal: 16, marginTop: 12 },
  ultimaTxt:    { color: colors.textMuted, fontSize: 12 },
  section:      { marginHorizontal: 14, marginTop: 22 },
  secRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  secTitle:     { color: colors.mint, fontSize: 16, fontWeight: '700', marginBottom: 12 },
  link:         { color: colors.sage, fontSize: 13, marginBottom: 12 },
  quickGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});