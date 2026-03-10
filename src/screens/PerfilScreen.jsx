// © 2025–2026 Joana Uribe — Todos los derechos reservados.
// Uso, copia o distribución sin autorización escrita está prohibido.
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Alert, Image, ActivityIndicator,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../theme/colors';

const PERFIL_KEY = '@TOF_perfil';

const PERFIL_INICIAL = {
  nombre:       'Fernanda',
  apellidos:    '',
  especialidad: 'Terapia Ocupacional',
  cedula:       '',
  telefono:     '',
  correo:       '',
  institucion:  '',
  foto:         null,
};

export default function PerfilScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isWeb  = width >= 600;
  const maxW   = Math.min(width, 960);
  const colW   = isWeb ? (maxW - 48 - 24) / 2 : maxW - 32;

  const [perfil,    setPerfil]    = useState(PERFIL_INICIAL);
  const [editando,  setEditando]  = useState(false);
  const [borrador,  setBorrador]  = useState(PERFIL_INICIAL);
  const [cargando,  setCargando]  = useState(true);
  const [guardando, setGuardando] = useState(false);

  const canGoBack = navigation?.canGoBack?.() ?? false;

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(PERFIL_KEY);
        if (raw) {
          const guardado = JSON.parse(raw);
          setPerfil(guardado);
          setBorrador(guardado);
        }
      } catch (e) {
        console.warn('Error cargando perfil', e);
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  const guardar = async () => {
    if (!borrador.nombre.trim()) {
      Alert.alert('Campo requerido', 'El nombre no puede estar vacío.');
      return;
    }
    setGuardando(true);
    try {
      await AsyncStorage.setItem(PERFIL_KEY, JSON.stringify(borrador));
      setPerfil(borrador);
      setEditando(false);
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar el perfil.');
    } finally {
      setGuardando(false);
    }
  };

  const cancelar = () => {
    setBorrador(perfil);
    setEditando(false);
  };

  const seleccionarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para cambiar la foto.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setBorrador(b => ({ ...b, foto: result.assets[0].uri }));
    }
  };

  const quitarFoto = () => {
    Alert.alert('Quitar foto', '¿Deseas eliminar tu foto de perfil?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setBorrador(b => ({ ...b, foto: null })) },
    ]);
  };

  if (cargando) {
    return (
      <SafeAreaView style={s.safe}>
        <ActivityIndicator color={colors.mint} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  const data     = editando ? borrador : perfil;
  const iniciales = `${data.nombre?.charAt(0) ?? ''}${data.apellidos?.charAt(0) ?? ''}`.toUpperCase() || 'F';

  return (
    <SafeAreaView style={s.safe}>
        {/* ── HEADER ──────────────────────────────────────────── */}
        <View style={s.topBar}>
          <View style={s.topLeft}>
            {canGoBack && (
              <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={20} color={colors.mint} />
              </TouchableOpacity>
            )}
            <Text style={[s.title, isWeb && s.titleWeb]}>Mi perfil</Text>
          </View>

          {editando ? (
            <View style={s.topActions}>
              <TouchableOpacity style={s.cancelBtn} onPress={cancelar}>
                <Text style={s.cancelBtnTxt}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={guardar} disabled={guardando}>
                {guardando
                  ? <ActivityIndicator size="small" color={colors.deepForest} />
                  : <Text style={s.saveBtnTxt}>Guardar</Text>
                }
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={s.editBtn} onPress={() => setEditando(true)}>
              <Ionicons name="pencil" size={14} color={colors.mint} />
              <Text style={s.editBtnTxt}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 60 }}
        >

          {/* ── AVATAR — centrado siempre ────────────────────── */}
          <View style={[s.avatarSection, isWeb && s.avatarSectionWeb]}>
            <View style={s.avatarWrap}>
              {data.foto ? (
                <Image source={{ uri: data.foto }} style={[s.avatarImg, isWeb && s.avatarImgWeb]} />
              ) : (
                <View style={[s.avatarPlaceholder, isWeb && s.avatarPlaceholderWeb]}>
                  <Text style={[s.avatarIniciales, isWeb && s.avatarInicialesWeb]}>{iniciales}</Text>
                </View>
              )}
              {editando && (
                <View style={s.avatarBtns}>
                  <TouchableOpacity style={s.avatarCamBtn} onPress={seleccionarFoto}>
                    <Ionicons name="camera" size={isWeb ? 18 : 16} color={colors.mint} />
                  </TouchableOpacity>
                  {data.foto && (
                    <TouchableOpacity style={s.avatarDelBtn} onPress={quitarFoto}>
                      <Ionicons name="trash" size={14} color="#e57373" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            {!editando && (
              <View style={[s.avatarInfo, isWeb && s.avatarInfoWeb]}>
                <Text style={[s.avatarNombre, isWeb && s.avatarNombreWeb]}>
                  {[data.nombre, data.apellidos].filter(Boolean).join(' ')}
                </Text>
                <Text style={[s.avatarEsp, isWeb && s.avatarEspWeb]}>{data.especialidad}</Text>
                {data.cedula ? (
                  <View style={s.cedulaBadge}>
                    <Ionicons name="shield-checkmark" size={12} color={colors.sage} />
                    <Text style={s.cedulaBadgeTxt}>Cédula: {data.cedula}</Text>
                  </View>
                ) : null}
              </View>
            )}
          </View>

          {/* ── FORMULARIO ──────────────────────────────────────
              Móvil: columna única
              Web:   dos columnas lado a lado               */}
          <View style={[s.formWrap, isWeb && s.formWrapWeb]}>

            {/* Columna izquierda / única en móvil */}
            <View style={[s.col, isWeb && { width: colW }]}>
              <View style={s.card}>
                <Text style={s.cardTitulo}>Información personal</Text>
                <Campo
                  label="Nombre" icon="person" valor={data.nombre} editando={editando}
                  onChange={v => setBorrador(b => ({ ...b, nombre: v }))}
                  placeholder="Tu nombre" requerido
                />
                <Campo
                  label="Apellidos" icon="person-outline" valor={data.apellidos} editando={editando}
                  onChange={v => setBorrador(b => ({ ...b, apellidos: v }))}
                  placeholder="Tus apellidos"
                />
                <Campo
                  label="Especialidad" icon="medical" valor={data.especialidad} editando={editando}
                  onChange={v => setBorrador(b => ({ ...b, especialidad: v }))}
                  placeholder="Ej. Terapia Ocupacional"
                />
                <Campo
                  label="Cédula profesional" icon="shield-checkmark" valor={data.cedula} editando={editando}
                  onChange={v => setBorrador(b => ({ ...b, cedula: v }))}
                  placeholder="Número de cédula" keyboardType="numeric" last
                />
              </View>
            </View>

            {/* Columna derecha (solo web) / debajo en móvil */}
            <View style={[s.col, isWeb && { width: colW }]}>
              <View style={s.card}>
                <Text style={s.cardTitulo}>Contacto</Text>
                <Campo
                  label="Teléfono" icon="call" valor={data.telefono} editando={editando}
                  onChange={v => setBorrador(b => ({ ...b, telefono: v }))}
                  placeholder="Ej. 722 123 4567" keyboardType="phone-pad"
                />
                <Campo
                  label="Correo" icon="mail" valor={data.correo} editando={editando}
                  onChange={v => setBorrador(b => ({ ...b, correo: v }))}
                  placeholder="correo@ejemplo.com" keyboardType="email-address" autoCapitalize="none"
                />
                <Campo
                  label="Institución / Consultorio" icon="business" valor={data.institucion} editando={editando}
                  onChange={v => setBorrador(b => ({ ...b, institucion: v }))}
                  placeholder="Nombre del lugar de trabajo" last
                />
              </View>

              {/* Aviso — solo aparece en columna derecha en web, o abajo en móvil */}
              <View style={s.avisoWrap}>
                <Ionicons name="lock-closed-outline" size={14} color={colors.textMuted} />
                <Text style={s.avisoTxt}>
                  Tu información se guarda únicamente en este dispositivo y no se comparte con nadie.
                </Text>
              </View>
            </View>

          </View>

          {/* Aviso para móvil (solo se muestra si no es web) */}
          {!isWeb && (
            <View style={[s.avisoWrap, { marginHorizontal: 16 }]}>
              <Ionicons name="lock-closed-outline" size={14} color={colors.textMuted} />
              <Text style={s.avisoTxt}>
                Tu información se guarda únicamente en este dispositivo y no se comparte con nadie.
              </Text>
            </View>
          )}

          <View style={{ height: 48 }} />
        </ScrollView>
    </SafeAreaView>
  );
}

// ── Campo reutilizable ─────────────────────────────────────────────
function Campo({ label, icon, valor, editando, onChange, placeholder, requerido, keyboardType, autoCapitalize, last }) {
  return (
    <View style={[c.wrap, !last && c.wrapBorder]}>
      <View style={c.iconWrap}>
        <Ionicons name={icon} size={16} color={colors.sage} />
      </View>
      <View style={c.body}>
        <Text style={c.label}>{label}{requerido && <Text style={c.req}> *</Text>}</Text>
        {editando ? (
          <TextInput
            style={c.input}
            value={valor}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            keyboardType={keyboardType || 'default'}
            autoCapitalize={autoCapitalize || 'words'}
          />
        ) : (
          <Text style={[c.valor, !valor && c.valorVacio]}>
            {valor || 'Sin registrar'}
          </Text>
        )}
      </View>
    </View>
  );
}

// ── Estilos ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:                   { flex: 1, backgroundColor: colors.deepForest },

  // Header
  topBar:                 { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 },
  topLeft:                { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn:                { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.darkGreen, justifyContent: 'center', alignItems: 'center' },
  title:                  { color: colors.mint, fontSize: 22, fontWeight: '700' },
  titleWeb:               { fontSize: 26 },
  topActions:             { flexDirection: 'row', gap: 8 },
  cancelBtn:              { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, backgroundColor: colors.darkGreen },
  cancelBtnTxt:           { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  saveBtn:                { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 10, backgroundColor: colors.sage, minWidth: 80, alignItems: 'center' },
  saveBtnTxt:             { color: colors.deepForest, fontSize: 13, fontWeight: '700' },
  editBtn:                { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, backgroundColor: colors.darkGreen },
  editBtnTxt:             { color: colors.mint, fontSize: 13, fontWeight: '600' },

  // Avatar
  avatarSection:          { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 16, gap: 10 },
  avatarSectionWeb:       { paddingVertical: 32, gap: 14 },
  avatarWrap:             { position: 'relative' },
  avatarImg:              { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: colors.sage },
  avatarImgWeb:           { width: 130, height: 130, borderRadius: 65 },
  avatarPlaceholder:      { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.sage, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: colors.mint },
  avatarPlaceholderWeb:   { width: 130, height: 130, borderRadius: 65 },
  avatarIniciales:        { color: colors.deepForest, fontSize: 36, fontWeight: '800' },
  avatarInicialesWeb:     { fontSize: 48 },
  avatarBtns:             { position: 'absolute', bottom: 0, right: -10, flexDirection: 'column', gap: 4 },
  avatarCamBtn:           { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.midGreen, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.deepForest },
  avatarDelBtn:           { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.darkGreen, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.deepForest },
  avatarInfo:             { alignItems: 'center', gap: 4 },
  avatarInfoWeb:          { gap: 6 },
  avatarNombre:           { color: colors.mint, fontSize: 20, fontWeight: '700', textAlign: 'center' },
  avatarNombreWeb:        { fontSize: 26 },
  avatarEsp:              { color: colors.textMuted, fontSize: 13, textAlign: 'center' },
  avatarEspWeb:           { fontSize: 15 },
  cedulaBadge:            { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.darkGreen, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginTop: 2 },
  cedulaBadgeTxt:         { color: colors.sage, fontSize: 12, fontWeight: '600' },

  // Formulario responsive
  formWrap:               { paddingHorizontal: 16 },
  formWrapWeb:            { flexDirection: 'row', justifyContent: 'center', gap: 24, paddingHorizontal: 24 },
  col:                    { width: '100%' },

  // Cards
  card:                   { backgroundColor: colors.darkGreen, borderRadius: 18, padding: 6, marginBottom: 14 },
  cardTitulo:             { color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6 },

  // Aviso
  avisoWrap:              { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: colors.darkGreen, borderRadius: 14, padding: 14, marginBottom: 8 },
  avisoTxt:               { color: colors.textMuted, fontSize: 12, flex: 1, lineHeight: 18 },
});

const c = StyleSheet.create({
  wrap:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  wrapBorder: { borderBottomWidth: 1, borderBottomColor: colors.midGreen + '55' },
  iconWrap:   { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.deepForest, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  body:       { flex: 1 },
  label:      { color: colors.textMuted, fontSize: 11, marginBottom: 3 },
  req:        { color: colors.sage },
  input:      { color: colors.mint, fontSize: 14, paddingVertical: 2, borderBottomWidth: 1, borderBottomColor: colors.midGreen },
  valor:      { color: colors.mint, fontSize: 14 },
  valorVacio: { color: colors.textMuted, fontStyle: 'italic' },
});