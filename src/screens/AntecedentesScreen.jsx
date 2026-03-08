import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, TextInput, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { usePacientes } from '../context/PacientesContext';

const secciones = [
  { key: 'heredofamiliares',        label: 'Heredofamiliares',              icon: 'git-branch',    desc: 'Enfermedades en familiares directos' },
  { key: 'personalesPatologicos',   label: 'Personales patológicos',        icon: 'pulse',         desc: 'Enfermedades previas o actuales' },
  { key: 'personalesNoPatologicos', label: 'Personales no patológicos',     icon: 'leaf',          desc: 'Hábitos, vivienda, alimentación' },
  { key: 'quirurgicos',             label: 'Quirúrgicos',                   icon: 'cut',           desc: 'Cirugías previas' },
  { key: 'traumatologicos',         label: 'Traumatológicos',               icon: 'bandage',       desc: 'Fracturas, traumatismos, accidentes' },
  { key: 'ginecologicos',           label: 'Gineco-obstétricos',            icon: 'heart-circle',  desc: 'Gestas, partos, menstruación' },
];

export default function AntecedentesScreen({ route, navigation }) {
  const { pacienteId } = route.params;
  const { pacientes, actualizarPaciente } = usePacientes();
  const paciente = pacientes.find(p => p.id === pacienteId);

  const [ant, setAnt] = useState({ ...paciente?.antecedentes });
  const [seccionAbierta, setSeccionAbierta] = useState(null);

  const set = (key, val) => setAnt(prev => ({ ...prev, [key]: val }));

  const guardar = () => {
    actualizarPaciente(pacienteId, { antecedentes: ant });
    Alert.alert('✅ Guardado', 'Antecedentes actualizados correctamente.', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const completados = secciones.filter(s => ant[s.key]?.trim()).length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.mint} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Antecedentes clínicos</Text>
          <Text style={styles.subtitle}>{paciente?.nombre}</Text>
        </View>
        <TouchableOpacity onPress={guardar} style={styles.saveBtn}>
          <Text style={styles.saveBtnTxt}>Guardar</Text>
        </TouchableOpacity>
      </View>

      {/* Progreso */}
      <View style={styles.progreso}>
        <Text style={styles.progresoTxt}>{completados} / {secciones.length} secciones completadas</Text>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${(completados / secciones.length) * 100}%` }]} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {secciones.map((sec, i) => {
          const abierta = seccionAbierta === sec.key;
          const tieneContenido = ant[sec.key]?.trim();
          return (
            <View key={sec.key} style={styles.acordeon}>
              <TouchableOpacity
                style={[styles.acordeonHeader, tieneContenido && styles.acordeonHeaderFilled]}
                onPress={() => setSeccionAbierta(abierta ? null : sec.key)}
              >
                <View style={styles.acordeonLeft}>
                  <View style={[styles.secIcon, { backgroundColor: tieneContenido ? colors.sage : colors.midGreen }]}>
                    <Ionicons name={sec.icon} size={18} color={tieneContenido ? colors.deepForest : colors.mint} />
                  </View>
                  <View>
                    <Text style={styles.acordeonTitle}>{sec.label}</Text>
                    <Text style={styles.acordeonDesc}>{sec.desc}</Text>
                  </View>
                </View>
                <View style={styles.acordeonRight}>
                  {tieneContenido && (
                    <View style={styles.checkDot}>
                      <Ionicons name="checkmark" size={12} color={colors.deepForest} />
                    </View>
                  )}
                  <Ionicons
                    name={abierta ? 'chevron-up' : 'chevron-down'}
                    size={18} color={colors.textMuted}
                  />
                </View>
              </TouchableOpacity>

              {abierta && (
                <View style={styles.acordeonBody}>
                  <TextInput
                    style={styles.textarea}
                    value={ant[sec.key] || ''}
                    onChangeText={v => set(sec.key, v)}
                    placeholder={`Escribe los ${sec.label.toLowerCase()}...`}
                    placeholderTextColor={colors.textMuted}
                    multiline
                    autoFocus
                  />
                  {!tieneContenido && (
                    <TouchableOpacity
                      style={styles.negadoBtn}
                      onPress={() => set(sec.key, 'Negado')}
                    >
                      <Text style={styles.negadoBtnTxt}>Marcar como negado</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.deepForest },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  backBtn:       { padding: 8, backgroundColor: colors.darkGreen, borderRadius: 12 },
  title:         { color: colors.mint, fontSize: 18, fontWeight: '700' },
  subtitle:      { color: colors.textMuted, fontSize: 12 },
  saveBtn:       { backgroundColor: colors.sage, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 },
  saveBtnTxt:    { color: colors.deepForest, fontWeight: '700' },
  progreso:      { marginHorizontal: 16, marginBottom: 16 },
  progresoTxt:   { color: colors.textMuted, fontSize: 12, marginBottom: 6 },
  barBg:         { height: 6, backgroundColor: colors.darkGreen, borderRadius: 4 },
  barFill:       { height: 6, backgroundColor: colors.sage, borderRadius: 4 },
  scroll:        { paddingHorizontal: 16 },
  acordeon:      { backgroundColor: colors.darkGreen, borderRadius: 16, marginBottom: 10, overflow: 'hidden' },
  acordeonHeader:{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  acordeonHeaderFilled: { borderLeftWidth: 3, borderLeftColor: colors.sage },
  acordeonLeft:  { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  secIcon:       { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  acordeonTitle: { color: colors.mint, fontSize: 14, fontWeight: '600' },
  acordeonDesc:  { color: colors.textMuted, fontSize: 11, marginTop: 1 },
  acordeonRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkDot:      { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.sage, justifyContent: 'center', alignItems: 'center' },
  acordeonBody:  { padding: 14, paddingTop: 0, gap: 10 },
  textarea:      { backgroundColor: colors.deepForest, borderRadius: 12, padding: 12, color: colors.mint, fontSize: 14, minHeight: 90, textAlignVertical: 'top' },
  negadoBtn:     { backgroundColor: colors.midGreen, borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  negadoBtnTxt:  { color: colors.mint, fontSize: 13, fontWeight: '500' },
});