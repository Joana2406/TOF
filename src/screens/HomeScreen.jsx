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

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const { pacientes, citas } = usePacientes();

  const [perfil, setPerfil] = useState({ nombre: 'Fernanda', foto: null });

  // Cargar nombre y foto del perfil guardado
  useEffect(() => {
    const cargar = async () => {
      try {
        const raw = await AsyncStorage.getItem(PERFIL_KEY);
        if (raw) {
          const p = JSON.parse(raw);
          setPerfil({ nombre: p.nombre || 'Fernanda', foto: p.foto || null });
        }
      } catch (e) {}
    };
    cargar();
    // Recargar al volver de PerfilScreen
    const unsub = navigation.addListener('focus', cargar);
    return unsub;
  }, [navigation]);

  const hoy            = new Date().toISOString().split('T')[0];
  const citasHoy       = citas.filter(c => c.fecha === hoy);
  const pacActivos     = pacientes.filter(p => p.activo);
  const totalEval      = pacientes.reduce((acc, p) => acc + p.evaluaciones.length, 0);
  const recentPatients = pacientes.slice(0, 3);

  const cardW = (width - 16 * 2 - 12 * 2) / 3;

  const stats = [
    { label: 'Pacientes activos', value: String(pacActivos.length), icon: 'people'    },
    { label: 'Citas hoy',         value: String(citasHoy.length),   icon: 'time'      },
    { label: 'Evaluaciones',      value: String(totalEval),         icon: 'clipboard' },
  ];

  const accesos = [
    { label: 'Nuevo\npaciente',  icon: 'person-add', screen: 'NuevoPaciente' },
    { label: 'Nueva\ncita',      icon: 'add-circle', screen: 'Agenda'        },
    { label: 'Ver\nreportes',    icon: 'bar-chart',  screen: 'Estadísticas'  },
    { label: 'Ejercicios',       icon: 'fitness',    screen: 'Ejercicios'    },
    { label: 'Actividades',      icon: 'calendar',   screen: 'Actividades'   },
    { label: 'Evaluaciones',     icon: 'clipboard',  screen: 'Evaluacion'    },
  ];

  const inicial = perfil.nombre?.charAt(0)?.toUpperCase() || 'F';

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <LinearGradient
          colors={[colors.deepForest, colors.midGreen]}
          style={s.header}
        >
          <View style={s.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={s.greeting}>Bienvenido mi solecito ☀️</Text>
              <Text style={s.name}>TOF</Text>
              <Text style={s.nameSub}>Terapeuta Ocupacional Ma. Fernanda</Text>
            </View>

            {/* Avatar → navega a Perfil */}
            <TouchableOpacity
              style={s.avatarBtn}
              onPress={() => navigation.navigate('Perfil')}
              activeOpacity={0.85}
            >
              {perfil.foto ? (
                <Image source={{ uri: perfil.foto }} style={s.avatarImg} />
              ) : (
                <View style={s.avatar}>
                  <Text style={s.avatarText}>{inicial}</Text>
                </View>
              )}
              {/* Indicador de editar */}
              <View style={s.avatarDot}>
                <Ionicons name="person" size={8} color={colors.deepForest} />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={s.date}>
            {new Date().toLocaleDateString('es-MX', {
              weekday: 'long', day: 'numeric', month: 'long'
            })}
          </Text>
        </LinearGradient>

        {/* ── STATS ──────────────────────────────────────────────── */}
        <View style={s.statsRow}>
          {stats.map((st, i) => (
            <View key={i} style={s.statCard}>
              <Ionicons name={st.icon} size={22} color={colors.sage} />
              <Text style={s.statValue}>{st.value}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </View>

        {/* ── ACCESO RÁPIDO ──────────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Acceso rápido</Text>
          <View style={s.quickRow}>
            {accesos.map((a, i) => (
              <TouchableOpacity
                key={i}
                style={[s.quickCard, { width: cardW }]}
                onPress={() => navigation.navigate(a.screen)}
                activeOpacity={0.8}
              >
                <View style={s.quickIconWrap}>
                  <Ionicons name={a.icon} size={24} color={colors.mint} />
                </View>
                <Text style={s.quickLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── PACIENTES RECIENTES ─────────────────────────────────── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Pacientes recientes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Pacientes')}>
              <Text style={s.sectionLink}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          {recentPatients.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={s.patientCard}
              onPress={() => navigation.navigate('DetallePaciente', { pacienteId: p.id })}
            >
              <View style={s.patientAvatar}>
                <Text style={s.patientAvatarText}>{p.nombre[0]}</Text>
              </View>
              <View style={s.patientInfo}>
                <Text style={s.patientName}>{p.nombre}</Text>
                <Text style={s.patientCond} numberOfLines={1}>{p.diagnostico}</Text>
                <Text style={s.patientNext}>⏰ {p.proximaCita || 'Sin cita próxima'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.sage} />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── PRÓXIMAS CITAS ──────────────────────────────────────── */}
        {citas.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Próximas citas</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Agenda')}>
                <Text style={s.sectionLink}>Ver agenda</Text>
              </TouchableOpacity>
            </View>
            {citas.slice(0, 3).map((c) => {
              const pac = pacientes.find(p => p.id === c.pacienteId);
              return (
                <TouchableOpacity
                  key={c.id}
                  style={s.citaCard}
                  onPress={() => navigation.navigate('Agenda')}
                >
                  <View style={s.citaHora}>
                    <Text style={s.citaHoraTxt}>{c.hora}</Text>
                  </View>
                  <View style={s.citaInfo}>
                    <Text style={s.citaNombre}>{pac?.nombre || 'Paciente'}</Text>
                    <Text style={s.citaFecha}>{c.fecha} • {c.tipo}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: colors.deepForest },

  // Header
  header:            { padding: 24, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTop:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  greeting:          { color: colors.sage,      fontSize: 14 },
  name:              { color: colors.mint,      fontSize: 30, fontWeight: '900', letterSpacing: 3 },
  nameSub:           { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  date:              { color: colors.textMuted, fontSize: 13, marginTop: 4 },

  // Avatar touchable
  avatarBtn:         { position: 'relative' },
  avatar:            { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.sage, justifyContent: 'center', alignItems: 'center' },
  avatarImg:         { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: colors.mint },
  avatarText:        { color: colors.deepForest, fontWeight: '700', fontSize: 22 },
  avatarDot:         { position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.mint, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.midGreen },

  // Stats
  statsRow:          { flexDirection: 'row', padding: 16, gap: 10 },
  statCard:          { flex: 1, backgroundColor: colors.darkGreen, borderRadius: 16, padding: 14, alignItems: 'center', gap: 4 },
  statValue:         { color: colors.mint,      fontSize: 22, fontWeight: '700' },
  statLabel:         { color: colors.textMuted, fontSize: 10, textAlign: 'center' },

  // Sections
  section:           { paddingHorizontal: 16, marginTop: 16 },
  sectionHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle:      { color: colors.mint, fontSize: 17, fontWeight: '600', marginBottom: 12 },
  sectionLink:       { color: colors.sage, fontSize: 13 },

  // Acceso rápido
  quickRow:          { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickCard:         { backgroundColor: colors.darkGreen, borderRadius: 16, paddingVertical: 18, paddingHorizontal: 8, alignItems: 'center', gap: 8 },
  quickIconWrap:     { width: 46, height: 46, borderRadius: 14, backgroundColor: colors.midGreen, justifyContent: 'center', alignItems: 'center' },
  quickLabel:        { color: colors.mint, fontSize: 11, fontWeight: '600', textAlign: 'center' },

  // Pacientes
  patientCard:       { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.darkGreen, borderRadius: 16, padding: 14, marginBottom: 10, gap: 12 },
  patientAvatar:     { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.midGreen, justifyContent: 'center', alignItems: 'center' },
  patientAvatarText: { color: colors.mint, fontWeight: '700', fontSize: 18 },
  patientInfo:       { flex: 1 },
  patientName:       { color: colors.mint,      fontWeight: '600', fontSize: 15 },
  patientCond:       { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  patientNext:       { color: colors.sage,      fontSize: 11, marginTop: 3 },

  // Citas
  citaCard:          { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.darkGreen, borderRadius: 14, padding: 12, marginBottom: 8, gap: 12 },
  citaHora:          { backgroundColor: colors.midGreen, borderRadius: 10, padding: 10, minWidth: 56, alignItems: 'center' },
  citaHoraTxt:       { color: colors.mint, fontWeight: '700', fontSize: 14 },
  citaInfo:          { flex: 1 },
  citaNombre:        { color: colors.mint,      fontWeight: '600', fontSize: 14 },
  citaFecha:         { color: colors.textMuted, fontSize: 12, marginTop: 2 },
});