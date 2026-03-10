// © 2025–2026 Joana Uribe — Todos los derechos reservados.
// Uso, copia o distribución sin autorización escrita está prohibido.
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, TextInput, Alert,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { usePacientes } from '../context/PacientesContext';

const Campo = ({ label, value, onChangeText, placeholder, multiline, keyboardType, required }) => (
  <View style={s.campo}>
    <Text style={s.label}>{label}{required ? ' *' : ''}</Text>
    <TextInput
      style={[s.input, multiline && s.inputMulti]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder || label}
      placeholderTextColor={colors.textMuted}
      multiline={multiline}
      keyboardType={keyboardType || 'default'}
      autoCorrect={false}
    />
  </View>
);

const Seccion = ({ title, children, cardW }) => (
  <View style={[s.seccion, cardW && { width: cardW }]}>
    <Text style={s.seccionTitle}>{title}</Text>
    <View style={s.seccionBox}>{children}</View>
  </View>
);

export default function NuevoPacienteScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const { agregarPaciente } = usePacientes();
  const [guardando, setGuardando] = useState(false);

  const isWeb  = width >= 600;
  const maxW   = Math.min(width, 960);
  const cardW  = isWeb ? (maxW - 48 - 16) / 2 : undefined;

  const [form, setForm] = useState({
    nombre: '', edad: '', fechaNacimiento: '', sexo: 'Femenino',
    telefono: '', correo: '', ocupacion: '', estadoCivil: '', escolaridad: '',
    diagnostico: '', motivoConsulta: '', alergias: 'Ninguna', medicamentos: 'Ninguno',
    antecedentes: {
      heredofamiliares: '', personalesPatologicos: '',
      personalesNoPatologicos: '', quirurgicos: 'Ninguno',
      traumatologicos: 'Ninguno', ginecologicos: '',
    }
  });

  const set    = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const setAnt = (key, val) => setForm(prev => ({
    ...prev, antecedentes: { ...prev.antecedentes, [key]: val }
  }));

  const sexos = ['Femenino', 'Masculino', 'No binario', 'Prefiero no decir'];

  const guardar = async () => {
    if (!form.nombre.trim()) { Alert.alert('Campo requerido', 'El nombre es obligatorio.'); return; }
    if (!form.diagnostico.trim()) { Alert.alert('Campo requerido', 'El diagnóstico es obligatorio.'); return; }
    setGuardando(true);
    try {
      const id = agregarPaciente({
        ...form,
        edad: form.edad ? parseInt(form.edad) : 0,
        proximaCita: null,
      });
      Alert.alert(
        '✅ Paciente registrado',
        `${form.nombre} fue agregado exitosamente.`,
        [
          { text: 'Ver expediente', onPress: () => navigation.replace('DetallePaciente', { pacienteId: id }) },
          { text: 'Volver a lista',  onPress: () => navigation.goBack() },
        ]
      );
    } catch {
      Alert.alert('Error', 'No se pudo guardar. Intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>

        {/* HEADER */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.mint} />
          </TouchableOpacity>
          <Text style={s.title}>Nuevo Paciente</Text>
          <TouchableOpacity
            onPress={guardar}
            style={[s.saveBtn, guardando && s.saveBtnDisabled]}
            disabled={guardando}
          >
            <Text style={s.saveBtnTxt}>{guardando ? 'Guardando...' : 'Guardar'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          {/* En web: grid 2 columnas */}
          <View style={isWeb ? s.webGrid : null}>

            <Seccion title="👤 Datos personales" cardW={cardW}>
              <Campo label="Nombre completo" required value={form.nombre}          onChangeText={v => set('nombre', v)} />
              <Campo label="Edad"                    value={form.edad}             onChangeText={v => set('edad', v)}             keyboardType="numeric" />
              <Campo label="Fecha de nacimiento"     value={form.fechaNacimiento}  onChangeText={v => set('fechaNacimiento', v)}  placeholder="AAAA-MM-DD" />
              <View style={s.campo}>
                <Text style={s.label}>Sexo</Text>
                <View style={s.optRow}>
                  {sexos.map(sx => (
                    <TouchableOpacity
                      key={sx}
                      style={[s.optChip, form.sexo === sx && s.optChipActive]}
                      onPress={() => set('sexo', sx)}
                    >
                      <Text style={[s.optTxt, form.sexo === sx && s.optTxtActive]}>{sx}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <Campo label="Teléfono"           value={form.telefono}    onChangeText={v => set('telefono', v)}    keyboardType="phone-pad" />
              <Campo label="Correo electrónico" value={form.correo}      onChangeText={v => set('correo', v)}      keyboardType="email-address" />
              <Campo label="Ocupación"          value={form.ocupacion}   onChangeText={v => set('ocupacion', v)} />
              <Campo label="Estado civil"       value={form.estadoCivil} onChangeText={v => set('estadoCivil', v)} />
              <Campo label="Escolaridad"        value={form.escolaridad} onChangeText={v => set('escolaridad', v)} />
            </Seccion>

            <Seccion title="🏥 Información clínica" cardW={cardW}>
              <Campo label="Diagnóstico"           required value={form.diagnostico}    onChangeText={v => set('diagnostico', v)}    multiline />
              <Campo label="Motivo de consulta"             value={form.motivoConsulta} onChangeText={v => set('motivoConsulta', v)} multiline />
              <Campo label="Alergias"                       value={form.alergias}       onChangeText={v => set('alergias', v)} />
              <Campo label="Medicamentos actuales"          value={form.medicamentos}   onChangeText={v => set('medicamentos', v)}   multiline />
            </Seccion>

            <Seccion title="📋 Antecedentes" cardW={cardW}>
              <Campo label="Heredofamiliares"          value={form.antecedentes.heredofamiliares}        onChangeText={v => setAnt('heredofamiliares', v)}        multiline />
              <Campo label="Personales patológicos"    value={form.antecedentes.personalesPatologicos}   onChangeText={v => setAnt('personalesPatologicos', v)}   multiline />
              <Campo label="Personales no patológicos" value={form.antecedentes.personalesNoPatologicos} onChangeText={v => setAnt('personalesNoPatologicos', v)} multiline />
              <Campo label="Quirúrgicos"               value={form.antecedentes.quirurgicos}             onChangeText={v => setAnt('quirurgicos', v)}             multiline />
              <Campo label="Traumatológicos"           value={form.antecedentes.traumatologicos}         onChangeText={v => setAnt('traumatologicos', v)}         multiline />
              <Campo label="Gineco-obstétricos"        value={form.antecedentes.ginecologicos}           onChangeText={v => setAnt('ginecologicos', v)}           multiline />
            </Seccion>

          </View>
          <View style={{ height: 50 }} />
        </ScrollView>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: colors.deepForest },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  backBtn:         { padding: 8, backgroundColor: colors.darkGreen, borderRadius: 12 },
  title:           { color: colors.mint, fontSize: 18, fontWeight: '700' },
  saveBtn:         { backgroundColor: colors.sage, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 },
  saveBtnDisabled: { backgroundColor: colors.midGreen },
  saveBtnTxt:      { color: colors.deepForest, fontWeight: '700', fontSize: 14 },
  webGrid:         { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 24, gap: 16, justifyContent: 'center', alignItems: 'flex-start' },
  seccion:         { marginHorizontal: 16, marginBottom: 20 },
  seccionTitle:    { color: colors.sage, fontSize: 15, fontWeight: '700', marginBottom: 10 },
  seccionBox:      { backgroundColor: colors.darkGreen, borderRadius: 18, padding: 16, gap: 14 },
  campo:           { gap: 6 },
  label:           { color: colors.textMuted, fontSize: 12, fontWeight: '500' },
  input:           { backgroundColor: colors.deepForest, borderRadius: 10, padding: 12, color: colors.mint, fontSize: 14, borderWidth: 1, borderColor: colors.midGreen },
  inputMulti:      { minHeight: 70, textAlignVertical: 'top' },
  optRow:          { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optChip:         { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.deepForest, borderWidth: 1, borderColor: colors.midGreen },
  optChipActive:   { backgroundColor: colors.sage, borderColor: colors.sage },
  optTxt:          { color: colors.textMuted, fontSize: 13 },
  optTxtActive:    { color: colors.deepForest, fontWeight: '600' },
});