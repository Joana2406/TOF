// © 2025–2026 Joana Uribe — Todos los derechos reservados.
// Uso, copia o distribución sin autorización escrita está prohibido.
import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, useWindowDimensions, Alert, Share, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { usePacientes } from '../context/PacientesContext';
import { CATALOGO } from './EvaluacionScreen';

// ─── VISTA: FORMULARIO O RESULTADOS ──────────────────────────────────────────
const TABS = ['Formulario', 'Resultados'];

// ─── MINI-GRÁFICA DE BARRAS (sin librerías externas) ─────────────────────────
const GraficaBarras = ({ datos, colorBarra, max }) => {
  if (!datos || datos.length === 0) return null;
  const maxVal = max || Math.max(...datos.map(d => d.valor), 1);
  const BAR_H = 140;

  return (
    <View style={gc.wrap}>
      <View style={gc.barArea}>
        {datos.map((d, i) => {
          const altura = Math.max(4, (d.valor / maxVal) * BAR_H);
          return (
            <View key={i} style={gc.barCol}>
              <Text style={gc.barVal}>{d.valor}</Text>
              <View style={[gc.bar, { height: altura, backgroundColor: colorBarra || colors.sage }]} />
              <Text style={gc.barLabel} numberOfLines={2}>{d.label}</Text>
            </View>
          );
        })}
      </View>
      {/* Línea base */}
      <View style={gc.baseline} />
    </View>
  );
};

const gc = StyleSheet.create({
  wrap:      { marginVertical: 12 },
  barArea:   { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 4, height: 175 },
  barCol:    { flex: 1, alignItems: 'center', gap: 4 },
  bar:       { width: '100%', borderRadius: 6, minHeight: 4 },
  barVal:    { color: colors.mint, fontSize: 11, fontWeight: '600' },
  barLabel:  { color: colors.textMuted, fontSize: 9, textAlign: 'center' },
  baseline:  { height: 2, backgroundColor: colors.midGreen, borderRadius: 1, marginTop: 2 },
});

// ─── COMPONENTE DE ÍTEM SEGÚN TIPO ───────────────────────────────────────────
const ItemEscala = ({ campo, tipo, valor, onChange, opciones }) => {
  if (tipo === 'texto_libre') {
    return (
      <View style={f.itemWrap}>
        <Text style={f.itemLabel}>{campo.label}</Text>
        <TextInput
          style={f.textArea}
          placeholder={campo.placeholder || 'Escribir...'}
          placeholderTextColor={colors.textMuted}
          value={valor || ''}
          onChangeText={onChange}
          multiline
        />
      </View>
    );
  }

  if (tipo === 'si_no') {
    return (
      <View style={f.itemWrap}>
        <Text style={f.itemLabel}>{campo.label}</Text>
        <View style={f.siNoRow}>
          {['si', 'no'].map(op => (
            <TouchableOpacity
              key={op}
              style={[f.siNoBtn, valor === op && (op === 'si' ? f.siActive : f.noActive)]}
              onPress={() => onChange(valor === op ? null : op)}
            >
              <Text style={[f.siNoTxt, valor === op && f.siNoTxtActive]}>
                {op === 'si' ? '✓ Sí' : '✗ No'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  if (tipo === 'opciones_multiples') {
    return (
      <View style={f.itemWrap}>
        <Text style={f.itemLabel}>{campo.label}</Text>
        <View style={f.opcionesWrap}>
          {campo.opciones.map(op => (
            <TouchableOpacity
              key={op.v}
              style={[f.opcionBtn, valor == op.v && f.opcionActive]}
              onPress={() => onChange(valor == op.v ? null : String(op.v))}
            >
              <Text style={[f.opcionTxt, valor == op.v && f.opcionTxtActive]}>
                {op.l}
                <Text style={f.opcionPts}> ({op.v} pts)</Text>
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  // Escalas numéricas: 1-5, 1-7, 1-10
  const escalaNum = { escala_1_5: 5, escala_1_7: 7, escala_1_10: 10 }[tipo] || 10;
  const puntos = Array.from({ length: escalaNum }, (_, i) => i + 1);

  return (
    <View style={f.itemWrap}>
      <Text style={f.itemLabel}>{campo.label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
        <View style={f.escalaRow}>
          {puntos.map(p => (
            <TouchableOpacity
              key={p}
              style={[f.escalaPunto, valor == p && f.escalaPuntoActive]}
              onPress={() => onChange(valor == p ? null : String(p))}
            >
              <Text style={[f.escalaTxt, valor == p && f.escalaTxtActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// ─── PANTALLA PRINCIPAL ───────────────────────────────────────────────────────
export default function EvaluacionDetalleScreen({ navigation, route }) {
  const { evaluacionNombre, pacienteId } = route?.params || {};
  const { width } = useWindowDimensions();
  const { pacientes, actualizarPaciente } = usePacientes();
  const isWide = width >= 600;

  const evaluacion = CATALOGO.find(e => e.nombre === evaluacionNombre);
  const paciente   = pacientes.find(p => p.id === pacienteId);

  const [tabActivo,   setTabActivo]   = useState('Formulario');
  const [respuestas,  setRespuestas]  = useState({});
  const [notas,       setNotas]       = useState('');
  const [guardando,   setGuardando]   = useState(false);

  // Historial de aplicaciones del paciente para esta evaluación
  const historial = useMemo(() =>
    (paciente?.evaluaciones || [])
      .filter(e => e.nombre === evaluacionNombre)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
    [paciente, evaluacionNombre]
  );

  // Calcular puntaje actual
  const puntajeActual = useMemo(() => {
    if (!evaluacion) return null;
    return evaluacion.calcularPuntaje(respuestas);
  }, [respuestas, evaluacion]);

  const interpretacion = useMemo(() => {
    if (!evaluacion || !puntajeActual) return null;
    return evaluacion.interpretarPuntaje(puntajeActual);
  }, [puntajeActual, evaluacion]);

  // Datos para la gráfica de progresión
  const datosGrafica = useMemo(() => {
    return historial.slice(0, 6).reverse().map(h => ({
      label: h.fecha?.slice(5) || '—',
      valor: h.puntaje?.total || 0,
    }));
  }, [historial]);

  const setRespuesta = useCallback((id, valor) => {
    setRespuestas(prev => ({ ...prev, [id]: valor }));
  }, []);

  const guardarEvaluacion = () => {
    if (!paciente) { Alert.alert('Paciente no encontrado'); return; }
    setGuardando(true);

    const nueva = {
      nombre: evaluacionNombre,
      fecha: new Date().toISOString().slice(0, 10),
      respuestas: { ...respuestas },
      notas,
      puntaje: puntajeActual,
      interpretacion: interpretacion?.nivel || '—',
    };

    const evalsPrevias = paciente.evaluaciones || [];
    actualizarPaciente({ ...paciente, evaluaciones: [nueva, ...evalsPrevias] });

    setTimeout(() => {
      setGuardando(false);
      setRespuestas({});
      setNotas('');
      setTabActivo('Resultados');
      Alert.alert('✓ Evaluación guardada', `Registrada en el expediente de ${paciente.nombre}.`);
    }, 500);
  };

  const exportarPDF = async () => {
    if (historial.length === 0) {
      Alert.alert('Sin resultados', 'Aplica la evaluación primero para exportar resultados.');
      return;
    }
    const ultimo = historial[0];
    const texto = [
      `EVALUACIÓN: ${evaluacionNombre}`,
      `Paciente: ${paciente?.nombre || '—'}`,
      `Fecha: ${ultimo.fecha}`,
      `Puntaje: ${JSON.stringify(ultimo.puntaje)}`,
      `Interpretación: ${ultimo.interpretacion}`,
      `Notas: ${ultimo.notas || '—'}`,
      '',
      '--- Historial de aplicaciones ---',
      ...historial.map(h => `${h.fecha}: Puntaje ${h.puntaje?.total ?? '—'} · ${h.interpretacion}`),
    ].join('\n');

    try {
      await Share.share({ message: texto, title: `Evaluación ${evaluacionNombre}` });
    } catch (_) {}
  };

  if (!evaluacion) {
    return (
      <SafeAreaView style={d.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.textMuted }}>Evaluación no encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Contar respuestas completadas
  const totalCampos  = evaluacion.secciones.reduce((s, sec) => s + sec.campos.length, 0);
  const respondidos  = Object.keys(respuestas).filter(k => respuestas[k] !== null && respuestas[k] !== undefined && respuestas[k] !== '').length;
  const progreso     = totalCampos > 0 ? respondidos / totalCampos : 0;

  return (
    <SafeAreaView style={d.safe}>

      {/* ── HEADER ── */}
      <View style={d.topBar}>
        <View style={d.topRow}>
          <TouchableOpacity style={d.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={colors.mint} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={d.title} numberOfLines={1}>{evaluacion.nombre}</Text>
            <Text style={d.subtitle} numberOfLines={1}>{paciente?.nombre || 'Sin paciente'}</Text>
          </View>
          <TouchableOpacity style={d.exportBtn} onPress={exportarPDF}>
            <Ionicons name="share-outline" size={18} color={colors.mint} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={d.tabs}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[d.tab, tabActivo === tab && d.tabActive]}
              onPress={() => setTabActivo(tab)}
            >
              <Text style={[d.tabTxt, tabActivo === tab && d.tabActiveTxt]}>{tab}</Text>
              {tab === 'Resultados' && historial.length > 0 && (
                <View style={d.tabBadge}>
                  <Text style={d.tabBadgeTxt}>{historial.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>

        {/* ══════════════════ TAB: FORMULARIO ══════════════════ */}
        {tabActivo === 'Formulario' && (
          <>
            {/* Info de la evaluación */}
            <View style={d.infoCard}>
              <View style={d.infoRow}>
                <Ionicons name="time-outline" size={14} color={colors.sage} />
                <Text style={d.infoTxt}>{evaluacion.tiempo}</Text>
                <View style={d.dot} />
                <Ionicons name="people-outline" size={14} color={colors.sage} />
                <Text style={d.infoTxt}>{evaluacion.poblacion}</Text>
              </View>
              <Text style={d.instrucciones}>{evaluacion.instrucciones}</Text>
            </View>

            {/* Barra de progreso */}
            <View style={d.progresoWrap}>
              <View style={d.progresoRow}>
                <Text style={d.progresoTxt}>{respondidos} / {totalCampos} ítems completados</Text>
                <Text style={d.progresoTxt}>{Math.round(progreso * 100)}%</Text>
              </View>
              <View style={d.progrBar}>
                <View style={[d.progrFill, { width: `${progreso * 100}%`, backgroundColor: evaluacion.color || colors.sage }]} />
              </View>
            </View>

            {/* Secciones del formulario */}
            {evaluacion.secciones.map((sec, si) => (
              <View key={si} style={d.seccion}>
                <View style={d.seccionHeader}>
                  <View style={[d.seccionNum, { backgroundColor: evaluacion.color + '44' }]}>
                    <Text style={[d.seccionNumTxt, { color: evaluacion.color }]}>{si + 1}</Text>
                  </View>
                  <Text style={d.seccionTitulo}>{sec.titulo}</Text>
                </View>
                {sec.descripcion && (
                  <Text style={d.seccionDesc}>{sec.descripcion}</Text>
                )}
                {sec.campos.map(campo => (
                  <ItemEscala
                    key={campo.id}
                    campo={campo}
                    tipo={sec.tipo}
                    valor={respuestas[campo.id]}
                    onChange={(v) => setRespuesta(campo.id, v)}
                    opciones={campo.opciones}
                  />
                ))}
              </View>
            ))}

            {/* Vista previa del puntaje actual */}
            {puntajeActual && interpretacion && progreso > 0.3 && (
              <View style={[d.previewPuntaje, { borderColor: interpretacion.color }]}>
                <Text style={d.previewLabel}>Puntaje provisional</Text>
                <Text style={[d.previewNivel, { color: interpretacion.color }]}>
                  {interpretacion.nivel}
                </Text>
                <Text style={d.previewPts}>
                  {typeof puntajeActual.total === 'number'
                    ? `Total: ${puntajeActual.total}`
                    : Object.entries(puntajeActual).map(([k,v]) => `${k}: ${v}`).join(' · ')}
                </Text>
              </View>
            )}

            {/* Notas clínicas */}
            <View style={d.seccion}>
              <View style={d.seccionHeader}>
                <Ionicons name="create-outline" size={16} color={colors.sage} />
                <Text style={d.seccionTitulo}>Notas clínicas</Text>
              </View>
              <TextInput
                style={[f.textArea, { marginTop: 8 }]}
                placeholder="Observaciones, contexto de la sesión, conducta del paciente..."
                placeholderTextColor={colors.textMuted}
                value={notas}
                onChangeText={setNotas}
                multiline
              />
            </View>

            {/* Botón guardar */}
            <TouchableOpacity
              style={[d.guardarBtn, guardando && { opacity: 0.6 }]}
              onPress={guardarEvaluacion}
              disabled={guardando}
            >
              {guardando
                ? <Text style={d.guardarBtnTxt}>Guardando...</Text>
                : <>
                    <Ionicons name="checkmark-circle" size={18} color={colors.deepForest} />
                    <Text style={d.guardarBtnTxt}>Guardar evaluación</Text>
                  </>
              }
            </TouchableOpacity>
          </>
        )}

        {/* ══════════════════ TAB: RESULTADOS ══════════════════ */}
        {tabActivo === 'Resultados' && (
          <>
            {historial.length === 0 ? (
              <View style={d.sinResultados}>
                <Ionicons name="bar-chart-outline" size={48} color={colors.midGreen} />
                <Text style={d.sinResultadosTxt}>Sin aplicaciones registradas</Text>
                <Text style={d.sinResultadosSub}>Completa el formulario para ver los resultados aquí</Text>
                <TouchableOpacity style={d.irFormBtn} onPress={() => setTabActivo('Formulario')}>
                  <Text style={d.irFormBtnTxt}>Ir al formulario</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Última aplicación — resultado destacado */}
                {(() => {
                  const ult = historial[0];
                  const interp = evaluacion.interpretarPuntaje(ult.puntaje);
                  return (
                    <View style={[d.resultadoDestacado, { borderColor: interp.color }]}>
                      <View style={d.resultadoHeaderRow}>
                        <View>
                          <Text style={d.resultadoFecha}>Última aplicación · {ult.fecha}</Text>
                          <Text style={[d.resultadoNivel, { color: interp.color }]}>{interp.nivel}</Text>
                        </View>
                        <View style={[d.resultadoBadge, { backgroundColor: interp.color + '22', borderColor: interp.color }]}>
                          <Text style={[d.resultadoBadgeTxt, { color: interp.color }]}>
                            {ult.puntaje?.total ?? '—'}
                          </Text>
                        </View>
                      </View>
                      {ult.puntaje && Object.keys(ult.puntaje).length > 1 && (
                        <View style={d.subPuntajesRow}>
                          {Object.entries(ult.puntaje).filter(([k]) => k !== 'total').map(([k, v]) => (
                            <View key={k} style={d.subPuntajeChip}>
                              <Text style={d.subPuntajeLabel}>{k}</Text>
                              <Text style={d.subPuntajeVal}>{v}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                      {ult.notas ? (
                        <View style={d.notasBox}>
                          <Ionicons name="create-outline" size={12} color={colors.textMuted} />
                          <Text style={d.notasTxt}>{ult.notas}</Text>
                        </View>
                      ) : null}
                    </View>
                  );
                })()}

                {/* Gráfica de progresión */}
                {datosGrafica.length > 1 && (
                  <View style={d.graficaWrap}>
                    <Text style={d.graficaTitulo}>Progresión de puntaje</Text>
                    <GraficaBarras
                      datos={datosGrafica}
                      colorBarra={evaluacion.color || colors.sage}
                    />
                    <Text style={d.graficaSub}>
                      {datosGrafica.length} aplicaciones · Últimas 6 mostradas
                    </Text>
                  </View>
                )}

                {/* Resumen por área */}
                <View style={d.seccion}>
                  <View style={d.seccionHeader}>
                    <Ionicons name="grid-outline" size={16} color={colors.sage} />
                    <Text style={d.seccionTitulo}>Áreas evaluadas</Text>
                  </View>
                  <View style={d.areasResumen}>
                    {evaluacion.areas.map(area => (
                      <View key={area} style={d.areaResumenItem}>
                        <View style={[d.areaResumenDot, { backgroundColor: evaluacion.color || colors.sage }]} />
                        <Text style={d.areaResumenTxt}>{area}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Historial de aplicaciones */}
                <View style={d.seccion}>
                  <View style={d.seccionHeader}>
                    <Ionicons name="list-outline" size={16} color={colors.sage} />
                    <Text style={d.seccionTitulo}>Historial de aplicaciones</Text>
                  </View>
                  {historial.map((h, i) => {
                    const interp = evaluacion.interpretarPuntaje(h.puntaje);
                    return (
                      <View key={i} style={d.histRow}>
                        <View style={[d.histColor, { backgroundColor: interp.color }]} />
                        <View style={{ flex: 1 }}>
                          <View style={d.histTopRow}>
                            <Text style={d.histFecha}>{h.fecha}</Text>
                            <Text style={[d.histNivel, { color: interp.color }]}>{interp.nivel}</Text>
                          </View>
                          <Text style={d.histPts}>
                            Puntaje total: {h.puntaje?.total ?? '—'}
                            {h.puntaje && Object.keys(h.puntaje).length > 1
                              ? ' · ' + Object.entries(h.puntaje).filter(([k]) => k !== 'total').map(([k,v]) => `${k}: ${v}`).join(' · ')
                              : ''}
                          </Text>
                          {h.notas ? <Text style={d.histNotas} numberOfLines={2}>{h.notas}</Text> : null}
                        </View>
                        {i === 0 && (
                          <View style={d.histBadgeUlt}>
                            <Text style={d.histBadgeUltTxt}>Última</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>

                {/* Botón exportar */}
                <TouchableOpacity style={d.exportFullBtn} onPress={exportarPDF}>
                  <Ionicons name="share-outline" size={16} color={colors.mint} />
                  <Text style={d.exportFullBtnTxt}>Exportar resultados</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const d = StyleSheet.create({
  safe:               { flex: 1, backgroundColor: colors.deepForest },
  topBar:             { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 0 },
  topRow:             { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  backBtn:            { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.darkGreen, justifyContent: 'center', alignItems: 'center' },
  title:              { color: colors.mint, fontSize: 18, fontWeight: '700' },
  subtitle:           { color: colors.textMuted, fontSize: 12, marginTop: 1 },
  exportBtn:          { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.darkGreen, justifyContent: 'center', alignItems: 'center' },
  tabs:               { flexDirection: 'row', backgroundColor: colors.darkGreen, borderRadius: 14, padding: 4, marginBottom: 16 },
  tab:                { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 9, borderRadius: 11 },
  tabActive:          { backgroundColor: colors.deepForest },
  tabTxt:             { color: colors.textMuted, fontSize: 14, fontWeight: '500' },
  tabActiveTxt:       { color: colors.mint, fontWeight: '700' },
  tabBadge:           { backgroundColor: colors.sage, borderRadius: 8, paddingHorizontal: 5, paddingVertical: 1 },
  tabBadgeTxt:        { color: colors.deepForest, fontSize: 10, fontWeight: '700' },
  infoCard:           { backgroundColor: colors.darkGreen, borderRadius: 14, padding: 14, marginBottom: 12 },
  infoRow:            { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' },
  infoTxt:            { color: colors.textMuted, fontSize: 12 },
  dot:                { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.midGreen },
  instrucciones:      { color: colors.mint, fontSize: 13, lineHeight: 19 },
  progresoWrap:       { marginBottom: 14 },
  progresoRow:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progresoTxt:        { color: colors.textMuted, fontSize: 12 },
  progrBar:           { height: 5, backgroundColor: colors.darkGreen, borderRadius: 3 },
  progrFill:          { height: 5, borderRadius: 3 },
  seccion:            { backgroundColor: colors.darkGreen, borderRadius: 16, padding: 14, marginBottom: 12 },
  seccionHeader:      { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  seccionNum:         { width: 26, height: 26, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  seccionNumTxt:      { fontSize: 12, fontWeight: '700' },
  seccionTitulo:      { color: colors.sage, fontSize: 14, fontWeight: '700' },
  seccionDesc:        { color: colors.textMuted, fontSize: 12, marginBottom: 10, marginTop: -4, fontStyle: 'italic' },
  previewPuntaje:     { borderWidth: 1.5, borderRadius: 14, padding: 14, marginBottom: 12, alignItems: 'center', gap: 4 },
  previewLabel:       { color: colors.textMuted, fontSize: 11 },
  previewNivel:       { fontSize: 16, fontWeight: '700' },
  previewPts:         { color: colors.textMuted, fontSize: 12 },
  guardarBtn:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.sage, borderRadius: 14, paddingVertical: 14, marginBottom: 8 },
  guardarBtnTxt:      { color: colors.deepForest, fontWeight: '700', fontSize: 15 },
  sinResultados:      { alignItems: 'center', gap: 10, paddingVertical: 48 },
  sinResultadosTxt:   { color: colors.mint, fontSize: 16, fontWeight: '600' },
  sinResultadosSub:   { color: colors.textMuted, fontSize: 13, textAlign: 'center' },
  irFormBtn:          { backgroundColor: colors.midGreen, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 10, marginTop: 8 },
  irFormBtnTxt:       { color: colors.mint, fontWeight: '600' },
  resultadoDestacado: { borderWidth: 1.5, borderRadius: 16, padding: 16, marginBottom: 12 },
  resultadoHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  resultadoFecha:     { color: colors.textMuted, fontSize: 12, marginBottom: 4 },
  resultadoNivel:     { fontSize: 17, fontWeight: '700' },
  resultadoBadge:     { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, minWidth: 48, alignItems: 'center' },
  resultadoBadgeTxt:  { fontSize: 20, fontWeight: '700' },
  subPuntajesRow:     { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 8 },
  subPuntajeChip:     { backgroundColor: colors.deepForest, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  subPuntajeLabel:    { color: colors.textMuted, fontSize: 10 },
  subPuntajeVal:      { color: colors.mint, fontSize: 13, fontWeight: '600' },
  notasBox:           { flexDirection: 'row', gap: 6, alignItems: 'flex-start', backgroundColor: colors.deepForest, borderRadius: 8, padding: 8 },
  notasTxt:           { color: colors.textMuted, fontSize: 12, flex: 1 },
  graficaWrap:        { backgroundColor: colors.darkGreen, borderRadius: 16, padding: 16, marginBottom: 12 },
  graficaTitulo:      { color: colors.sage, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  graficaSub:         { color: colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 4 },
  areasResumen:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  areaResumenItem:    { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.deepForest, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  areaResumenDot:     { width: 8, height: 8, borderRadius: 4 },
  areaResumenTxt:     { color: colors.mint, fontSize: 13 },
  histRow:            { flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: colors.deepForest, borderRadius: 12, padding: 12, marginBottom: 8 },
  histColor:          { width: 4, borderRadius: 2, alignSelf: 'stretch', minHeight: 40 },
  histTopRow:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  histFecha:          { color: colors.textMuted, fontSize: 12 },
  histNivel:          { fontSize: 12, fontWeight: '600' },
  histPts:            { color: colors.mint, fontSize: 12 },
  histNotas:          { color: colors.textMuted, fontSize: 11, marginTop: 2, fontStyle: 'italic' },
  histBadgeUlt:       { backgroundColor: colors.sage + '33', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  histBadgeUltTxt:    { color: colors.sage, fontSize: 9, fontWeight: '600' },
  exportFullBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: colors.midGreen, borderRadius: 14, paddingVertical: 13, marginBottom: 8 },
  exportFullBtnTxt:   { color: colors.mint, fontWeight: '600' },
});

const f = StyleSheet.create({
  itemWrap:          { marginBottom: 16 },
  itemLabel:         { color: colors.mint, fontSize: 13, marginBottom: 6, lineHeight: 18 },
  textArea:          { backgroundColor: colors.deepForest, borderRadius: 10, padding: 12, color: colors.mint, fontSize: 13, minHeight: 72, borderWidth: 1, borderColor: colors.midGreen, textAlignVertical: 'top' },
  siNoRow:           { flexDirection: 'row', gap: 8 },
  siNoBtn:           { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.deepForest, borderWidth: 1, borderColor: colors.midGreen, alignItems: 'center' },
  siActive:          { backgroundColor: colors.sage + '33', borderColor: colors.sage },
  noActive:          { backgroundColor: '#e0707033', borderColor: '#e07070' },
  siNoTxt:           { color: colors.textMuted, fontSize: 14, fontWeight: '500' },
  siNoTxtActive:     { color: colors.mint, fontWeight: '700' },
  opcionesWrap:      { gap: 6 },
  opcionBtn:         { padding: 11, borderRadius: 10, backgroundColor: colors.deepForest, borderWidth: 1, borderColor: colors.midGreen },
  opcionActive:      { backgroundColor: colors.midGreen, borderColor: colors.sage },
  opcionTxt:         { color: colors.textMuted, fontSize: 13 },
  opcionTxtActive:   { color: colors.mint, fontWeight: '600' },
  opcionPts:         { color: colors.textMuted, fontSize: 11 },
  escalaRow:         { flexDirection: 'row', gap: 6 },
  escalaPunto:       { width: 38, height: 38, borderRadius: 10, backgroundColor: colors.deepForest, borderWidth: 1, borderColor: colors.midGreen, justifyContent: 'center', alignItems: 'center' },
  escalaPuntoActive: { backgroundColor: colors.sage, borderColor: colors.sage },
  escalaTxt:         { color: colors.textMuted, fontSize: 14, fontWeight: '500' },
  escalaTxtActive:   { color: colors.deepForest, fontWeight: '700' },
});