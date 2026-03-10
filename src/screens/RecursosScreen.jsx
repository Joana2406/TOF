// © 2025–2026 Joana Uribe — Todos los derechos reservados.
// Uso, copia o distribución sin autorización escrita está prohibido.
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Linking, Dimensions, useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

/* ─── DATOS REALES ──────────────────────────────────────────────────────────── */
const recursosEstudio = [
  {
    categoria: 'Modelos de práctica',
    items: [
      {
        titulo: 'Modelo de Ocupación Humana (MOHO)',
        autor: 'Gary Kielhofner',
        descripcion: 'Marco conceptual que identifica los aspectos interrelacionados de la ocupación humana: volición, habituación y capacidad de desempeño. Considera al ser humano como sistema abierto y dinámico.',
        tipo: 'Modelo',
        nivel: 'Esencial',
        tags: ['Volición', 'Habituación', 'Desempeño'],
        url: 'https://moho.uic.edu/',
        icon: 'person',
      },
      {
        titulo: 'Marco de Trabajo OTPF-4 (AOTA)',
        autor: 'American Occupational Therapy Association',
        descripcion: 'Cuarta edición del Marco de Trabajo para la práctica de TO. Describe el dominio y proceso de la profesión. Incluye áreas de ocupación, habilidades y patrones de desempeño.',
        tipo: 'Marco',
        nivel: 'Esencial',
        tags: ['AOTA', 'Dominio', 'Proceso', '2020'],
        url: 'https://ajot.aota.org/article.aspx?articleid=2766507',
        icon: 'document-text',
      },
      {
        titulo: 'Modelo Canadiense de Desempeño Ocupacional (MCDO)',
        autor: 'CAOT — Canadian Association of OT',
        descripcion: 'Modelo centrado en la persona que analiza la relación entre persona, ocupación y ambiente. Base del COPM como herramienta de evaluación.',
        tipo: 'Modelo',
        nivel: 'Intermedio',
        tags: ['COPM', 'Centrado en persona', 'Canadá'],
        url: 'https://caot.ca/',
        icon: 'people',
      },
      {
        titulo: 'Marco de Referencia Biomecánico',
        autor: 'Trombly & Radomski',
        descripcion: 'Se centra en los aspectos físicos: fuerza, resistencia, rango de movimiento y coordinación. Aplicado principalmente en disfunciones físicas y rehabilitación ortopédica.',
        tipo: 'Marco',
        nivel: 'Intermedio',
        tags: ['ROM', 'Fuerza', 'Rehabilitación física'],
        url: null,
        icon: 'fitness',
      },
      {
        titulo: 'Integración Sensorial — Teoría de Ayres',
        autor: 'A. Jean Ayres',
        descripcion: 'Marco que explica cómo el cerebro organiza la información sensorial. Fundamental en pediatría y para comprender hipersensibilidades táctiles, auditivas y propioceptivas.',
        tipo: 'Marco',
        nivel: 'Intermedio',
        tags: ['Sensorial', 'Pediatría', 'Ayres', 'Hipersensibilidad'],
        url: 'https://www.spdstar.org/',
        icon: 'hand-left',
      },
      {
        titulo: 'Marco de Referencia de Adaptación Ocupacional',
        autor: 'Schkade & Schultz',
        descripcion: 'Centra la atención en el proceso de adaptación interno de la persona. El objetivo es influir positivamente en el proceso adaptativo más que en la independencia funcional.',
        tipo: 'Marco',
        nivel: 'Avanzado',
        tags: ['Adaptación', 'Proceso interno', 'Salud mental'],
        url: null,
        icon: 'bulb',
      },
    ],
  },
  {
    categoria: 'Evaluaciones estandarizadas',
    items: [
      {
        titulo: 'COPM — Canadian Occupational Performance Measure',
        autor: 'Law et al.',
        descripcion: 'Entrevista semiestructurada que identifica problemas ocupacionales desde la perspectiva del paciente en áreas de autocuidado, productividad y ocio. Mide desempeño y satisfacción (1-10).',
        tipo: 'Evaluación',
        nivel: 'Esencial',
        tags: ['AVD', 'Productividad', 'Ocio', 'Entrevista'],
        url: 'https://www.thecopm.ca/',
        icon: 'clipboard',
      },
      {
        titulo: 'FIM — Functional Independence Measure',
        autor: 'Granger et al.',
        descripcion: 'Mide independencia funcional en 18 ítems (motor y cognitivo). Escala del 1 al 7 por ítem, máximo 126 puntos. Ampliamente usado en rehabilitación neurológica y ortopédica.',
        tipo: 'Evaluación',
        nivel: 'Esencial',
        tags: ['Motor', 'Cognitivo', 'Neurológico'],
        url: null,
        icon: 'bar-chart',
      },
      {
        titulo: 'Índice de Barthel',
        autor: 'Mahoney & Barthel',
        descripcion: 'Evalúa independencia en 10 AVD básicas (alimentación, baño, vestido, continencia, traslados, marcha, escaleras). Puntuación máxima de 100. Sencillo y muy utilizado en geriatría.',
        tipo: 'Evaluación',
        nivel: 'Esencial',
        tags: ['AVD básicas', 'Geriatría', 'Independencia'],
        url: null,
        icon: 'list',
      },
      {
        titulo: 'Perfil Sensorial de Dunn (2014)',
        autor: 'Winnie Dunn',
        descripcion: 'Evalúa procesamiento sensorial en adultos y niños. Identifica patrones: buscador, observador, sensible y evitador. Versión 2014 con normas actualizadas.',
        tipo: 'Evaluación',
        nivel: 'Intermedio',
        tags: ['Sensorial', 'Pediatría', 'Adultos', 'Dunn'],
        url: 'https://www.pearsonassessments.com/',
        icon: 'radio-button-on',
      },
      {
        titulo: 'MMSE — Mini-Mental State Examination',
        autor: 'Folstein et al.',
        descripcion: 'Evaluación breve del estado cognitivo. 30 ítems que cubren orientación, memoria, atención, cálculo, lenguaje y copia de figuras. Útil en cribado de deterioro cognitivo.',
        tipo: 'Evaluación',
        nivel: 'Esencial',
        tags: ['Cognitivo', 'Demencia', 'Cribado', 'Geriatría'],
        url: null,
        icon: 'brain-outline',
      },
    ],
  },
  {
    categoria: 'Bibliografía clave',
    items: [
      {
        titulo: 'Willard & Spackman: Terapia Ocupacional 13ª Ed.',
        autor: 'Schell, Gillen & Scaffa',
        descripcion: 'Libro de referencia fundamental de la profesión. Abarca fundamentos, marcos de referencia, evaluación e intervención en todas las áreas de práctica.',
        tipo: 'Libro',
        nivel: 'Esencial',
        tags: ['Referencia', 'Fundamentos', 'Intervención'],
        url: null,
        icon: 'book',
      },
      {
        titulo: 'Fundamentos conceptuales de la TO',
        autor: 'Gary Kielhofner (2006)',
        descripcion: 'Texto esencial para comprender las bases filosóficas y teóricas de la disciplina. Incluye análisis histórico y desarrollo de la identidad profesional.',
        tipo: 'Libro',
        nivel: 'Esencial',
        tags: ['Filosofía', 'Historia', 'Identidad profesional'],
        url: null,
        icon: 'library',
      },
    ],
  },
];

const recursosPsicoeduc = [
  {
    categoria: 'Para pacientes',
    items: [
      {
        titulo: '¿Qué es la Terapia Ocupacional?',
        descripcion: 'La TO es una profesión de salud que te ayuda a realizar las actividades del día a día que son importantes para ti: bañarte, vestirte, trabajar, estudiar y disfrutar tu tiempo libre. El terapeuta ocupacional te acompaña a recuperar o mejorar tu independencia.',
        publico: 'Pacientes',
        icon: 'heart',
        puntos: [
          'Se centra en LO QUE QUIERES y NECESITAS hacer',
          'Adapta actividades a tus capacidades actuales',
          'Trabaja en tu propio entorno cuando es posible',
          'Busca tu máxima independencia y calidad de vida',
        ],
      },
      {
        titulo: 'Actividades de la Vida Diaria (AVD)',
        descripcion: 'Las AVD son todas las actividades cotidianas desde que te levantas hasta que te acuestas. Se dividen en básicas (autocuidado), instrumentales (manejo del hogar) y avanzadas (trabajo, ocio).',
        publico: 'Pacientes',
        icon: 'sunny',
        puntos: [
          'Básicas: baño, vestido, alimentación, higiene',
          'Instrumentales: cocinar, limpiar, manejar dinero',
          'Productivas: trabajo, estudios, voluntariado',
          'Ocio: juego, deporte, actividades sociales',
        ],
      },
      {
        titulo: 'Técnicas de ahorro de energía',
        descripcion: 'Estrategias para realizar tus actividades diarias gastando menos energía. Muy útiles en enfermedades crónicas, fatiga, cardiopatías y condiciones respiratorias.',
        publico: 'Pacientes',
        icon: 'battery-charging',
        puntos: [
          'Planifica y prioriza tus actividades del día',
          'Alterna actividades pesadas con descansos',
          'Usa ayudas técnicas cuando sea necesario',
          'Adapta posiciones para reducir el esfuerzo',
        ],
      },
      {
        titulo: 'Manejo del dolor crónico',
        descripcion: 'El dolor crónico puede afectar todas tus ocupaciones. La TO te enseña a seguir participando en lo que es importante para ti, adaptando las actividades a tu nivel actual.',
        publico: 'Pacientes',
        icon: 'medkit',
        puntos: [
          'Identifica qué actividades agravan el dolor',
          'Aprende técnicas de protección articular',
          'Establece rutinas con pausas activas',
          'Comunica tu nivel de dolor en cada sesión',
        ],
      },
    ],
  },
  {
    categoria: 'Para familias y cuidadores',
    items: [
      {
        titulo: 'Cómo apoyar sin generar dependencia',
        descripcion: 'El papel de la familia es fundamental pero hay un equilibrio importante: ayudar sin hacer todo por el paciente. La sobreprotección puede frenar la recuperación de la independencia.',
        publico: 'Familia',
        icon: 'people',
        puntos: [
          'Da tiempo suficiente para que lo intente solo',
          'Ofrece ayuda parcial, no total',
          'Celebra los logros, aunque sean pequeños',
          'Consulta al terapeuta antes de cambiar rutinas',
        ],
      },
      {
        titulo: 'Adaptación del hogar',
        descripcion: 'Pequeñas modificaciones en casa pueden marcar una gran diferencia en la independencia del paciente. El TO puede hacer una visita domiciliaria para evaluar y recomendar cambios.',
        publico: 'Familia',
        icon: 'home',
        puntos: [
          'Barras de apoyo en baño y escaleras',
          'Eliminación de alfombras y obstáculos',
          'Iluminación adecuada en todos los espacios',
          'Reorganización de objetos de uso frecuente',
        ],
      },
      {
        titulo: 'Cuidando al cuidador',
        descripcion: 'Ser cuidador es una labor exigente. El bienestar físico y emocional del cuidador es tan importante como el del paciente. Un cuidador agotado no puede brindar buena atención.',
        publico: 'Familia',
        icon: 'shield-checkmark',
        puntos: [
          'Establece límites y pide ayuda cuando la necesitas',
          'Mantén tus propias actividades y espacios',
          'Busca grupos de apoyo para cuidadores',
          'Informa al equipo de salud sobre tu situación',
        ],
      },
      {
        titulo: 'Integración sensorial: guía para familias',
        descripcion: 'Si tu hijo o familiar tiene dificultades sensoriales (hipersensibilidad a texturas, ruidos o movimiento), entiende que no es "capricho": su sistema nervioso procesa diferente la información.',
        publico: 'Familia',
        icon: 'flash',
        puntos: [
          'Respeta sus tiempos de adaptación sensorial',
          'Evita forzar texturas o sensaciones que generan malestar',
          'Crea ambientes predecibles y con rutina',
          'El TO te enseñará estrategias específicas en casa',
        ],
      },
    ],
  },
  {
    categoria: 'Condiciones frecuentes',
    items: [
      {
        titulo: 'TO en ACV y daño cerebral adquirido',
        descripcion: 'Tras un ACV, la TO trabaja la recuperación funcional de miembro superior, las AVD y la cognición. La neuroplasticidad permite recuperación real con intervención temprana e intensiva.',
        publico: 'Condición',
        icon: 'pulse',
        puntos: [
          'Inicio temprano mejora pronóstico funcional',
          'Trabajo de hemiparesia y funcionalidad de mano',
          'Reentrenamiento en AVD básicas e instrumentales',
          'Adaptaciones cognitivas si hay afectación',
        ],
      },
      {
        titulo: 'TO en pediatría y desarrollo',
        descripcion: 'En niños, la TO trabaja habilidades de juego, escritura, autonomía en el colegio y procesamiento sensorial. La intervención temprana tiene mayor impacto en el desarrollo.',
        publico: 'Condición',
        icon: 'happy',
        puntos: [
          'El juego es la ocupación principal del niño',
          'Trabajo de motricidad fina para escritura',
          'Integración sensorial y regulación emocional',
          'Coordinación con maestros y familia',
        ],
      },
      {
        titulo: 'TO en salud mental',
        descripcion: 'La TO en salud mental trabaja la estructuración de rutinas, las habilidades sociales, el manejo del tiempo y la participación en ocupaciones significativas que promueven bienestar.',
        publico: 'Condición',
        icon: 'leaf',
        puntos: [
          'Estructuración de rutinas diarias saludables',
          'Actividades con propósito y significado',
          'Habilidades sociales y participación comunitaria',
          'Manejo del tiempo y equilibrio ocupacional',
        ],
      },
    ],
  },
];

/* ─── COMPONENTES ───────────────────────────────────────────────────────────── */
const nivelColor = {
  Esencial:   colors.sage,
  Intermedio: colors.midGreen,
  Avanzado:   colors.darkGreen,
};

const tipoIcon = {
  Modelo:     'cube-outline',
  Marco:      'git-network-outline',
  Evaluación: 'clipboard-outline',
  Libro:      'book-outline',
};

function CardEstudio({ item, expanded, onPress }) {
  const { width } = useWindowDimensions();
  return (
    <TouchableOpacity
      style={[s.card, expanded && s.cardExpanded]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={s.cardHeader}>
        <View style={[s.tipoIcon, { backgroundColor: nivelColor[item.nivel] || colors.midGreen }]}>
          <Ionicons name={tipoIcon[item.tipo] || item.icon || 'document'} size={18} color={colors.mint} />
        </View>
        <View style={s.cardTitleWrap}>
          <Text style={s.cardTitulo} numberOfLines={expanded ? 10 : 2}>{item.titulo}</Text>
          <Text style={s.cardAutor}>{item.autor}</Text>
        </View>
        <View style={s.badges}>
          <View style={[s.nivelBadge, { backgroundColor: nivelColor[item.nivel] }]}>
            <Text style={s.nivelBadgeTxt}>{item.nivel}</Text>
          </View>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={16} color={colors.textMuted}
          />
        </View>
      </View>

      {expanded && (
        <View style={s.cardBody}>
          <Text style={s.cardDesc}>{item.descripcion}</Text>
          <View style={s.tagsRow}>
            {item.tags.map((t, i) => (
              <View key={i} style={s.tag}>
                <Text style={s.tagTxt}>{t}</Text>
              </View>
            ))}
          </View>
          {item.url && (
            <TouchableOpacity
              style={s.linkBtn}
              onPress={() => Linking.openURL(item.url)}
            >
              <Ionicons name="open-outline" size={14} color={colors.deepForest} />
              <Text style={s.linkBtnTxt}>Ver recurso oficial</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

function CardPsicoeduc({ item, expanded, onPress }) {
  const publicoColor = {
    Pacientes:  colors.sage,
    Familia:    colors.midGreen,
    Condición:  colors.darkGreen,
  };
  return (
    <TouchableOpacity
      style={[s.card, expanded && s.cardExpanded]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={s.cardHeader}>
        <View style={[s.tipoIcon, { backgroundColor: publicoColor[item.publico] || colors.midGreen }]}>
          <Ionicons name={item.icon} size={18} color={colors.mint} />
        </View>
        <View style={s.cardTitleWrap}>
          <Text style={s.cardTitulo} numberOfLines={expanded ? 10 : 2}>{item.titulo}</Text>
          <View style={[s.publicoBadge, { backgroundColor: publicoColor[item.publico] }]}>
            <Text style={s.publicoBadgeTxt}>{item.publico}</Text>
          </View>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16} color={colors.textMuted}
          style={{ marginLeft: 8 }}
        />
      </View>

      {expanded && (
        <View style={s.cardBody}>
          <Text style={s.cardDesc}>{item.descripcion}</Text>
          <View style={s.puntosList}>
            {item.puntos.map((p, i) => (
              <View key={i} style={s.puntoRow}>
                <View style={s.puntoDot} />
                <Text style={s.puntoTxt}>{p}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

/* ─── PANTALLA PRINCIPAL ────────────────────────────────────────────────────── */
export default function RecursosScreen() {
  const { width } = useWindowDimensions();
  const [tabActiva, setTabActiva]   = useState('Estudio');
  const [expandido, setExpandido]   = useState(null);
  const [catActiva, setCatActiva]   = useState(null);

  const tabs = ['Estudio', 'Psicoeducación'];

  const datos = tabActiva === 'Estudio' ? recursosEstudio : recursosPsicoeduc;

  // Todas las categorías de la tab activa
  const categorias = datos.map(d => d.categoria);

  // Filtra por categoría si hay una activa
  const datosFiltrados = catActiva
    ? datos.filter(d => d.categoria === catActiva)
    : datos;

  const totalItems = datos.reduce((a, d) => a + d.items.length, 0);

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.topBar}>
        <View>
          <Text style={s.title}>Recursos</Text>
          <Text style={s.subtitle}>{totalItems} recursos disponibles</Text>
        </View>
      </View>

      {/* Tabs principales */}
      <View style={s.tabsWrap}>
        {tabs.map(t => (
          <TouchableOpacity
            key={t}
            style={[s.tab, tabActiva === t && s.tabActive]}
            onPress={() => { setTabActiva(t); setExpandido(null); setCatActiva(null); }}
          >
            <Ionicons
              name={t === 'Estudio' ? 'school' : 'people'}
              size={16}
              color={tabActiva === t ? colors.deepForest : colors.textMuted}
            />
            <Text style={[s.tabTxt, tabActiva === t && s.tabTxtActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filtro por categoría */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.catScroll}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        <TouchableOpacity
          style={[s.catChip, catActiva === null && s.catChipActive]}
          onPress={() => setCatActiva(null)}
        >
          <Text style={[s.catChipTxt, catActiva === null && s.catChipTxtActive]}>Todos</Text>
        </TouchableOpacity>
        {categorias.map((cat, i) => (
          <TouchableOpacity
            key={i}
            style={[s.catChip, catActiva === cat && s.catChipActive]}
            onPress={() => setCatActiva(catActiva === cat ? null : cat)}
          >
            <Text style={[s.catChipTxt, catActiva === cat && s.catChipTxtActive]} numberOfLines={1}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Contenido */}
      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      >
        {datosFiltrados.map((grupo, gi) => (
          <View key={gi} style={s.grupo}>
            <View style={s.grupoHeader}>
              <View style={s.grupoDot} />
              <Text style={s.grupoTitulo}>{grupo.categoria}</Text>
              <Text style={s.grupoCount}>{grupo.items.length}</Text>
            </View>

            {grupo.items.map((item, ii) => {
              const key = `${gi}-${ii}`;
              return tabActiva === 'Estudio' ? (
                <CardEstudio
                  key={key}
                  item={item}
                  expanded={expandido === key}
                  onPress={() => setExpandido(expandido === key ? null : key)}
                />
              ) : (
                <CardPsicoeduc
                  key={key}
                  item={item}
                  expanded={expandido === key}
                  onPress={() => setExpandido(expandido === key ? null : key)}
                />
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── ESTILOS ───────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: colors.deepForest },
  topBar:          { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title:           { color: colors.mint,      fontSize: 24, fontWeight: '700' },
  subtitle:        { color: colors.textMuted, fontSize: 13, marginTop: 2 },

  tabsWrap:        { flexDirection: 'row', marginHorizontal: 16, marginBottom: 12, backgroundColor: colors.darkGreen, borderRadius: 14, padding: 4 },
  tab:             { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12 },
  tabActive:       { backgroundColor: colors.sage },
  tabTxt:          { color: colors.textMuted, fontSize: 14 },
  tabTxtActive:    { color: colors.deepForest, fontWeight: '700' },

  catScroll:       { maxHeight: 44, marginBottom: 12 },
  catChip:         { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.darkGreen },
  catChipActive:   { backgroundColor: colors.midGreen },
  catChipTxt:      { color: colors.textMuted, fontSize: 12 },
  catChipTxtActive:{ color: colors.mint, fontWeight: '600' },

  scroll:          { flex: 1 },

  grupo:           { marginBottom: 20 },
  grupoHeader:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  grupoDot:        { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.sage },
  grupoTitulo:     { color: colors.sage, fontSize: 14, fontWeight: '700', flex: 1 },
  grupoCount:      { backgroundColor: colors.darkGreen, color: colors.textMuted, fontSize: 11, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },

  card:            { backgroundColor: colors.darkGreen, borderRadius: 16, marginBottom: 10, overflow: 'hidden' },
  cardExpanded:    { borderWidth: 1, borderColor: colors.midGreen },
  cardHeader:      { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  tipoIcon:        { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  cardTitleWrap:   { flex: 1, gap: 4 },
  cardTitulo:      { color: colors.mint, fontSize: 14, fontWeight: '600', lineHeight: 20 },
  cardAutor:       { color: colors.textMuted, fontSize: 11 },
  badges:          { alignItems: 'flex-end', gap: 4, flexShrink: 0 },
  nivelBadge:      { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  nivelBadgeTxt:   { color: colors.mint, fontSize: 10, fontWeight: '600' },
  publicoBadge:    { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  publicoBadgeTxt: { color: colors.mint, fontSize: 10, fontWeight: '600' },

  cardBody:        { paddingHorizontal: 14, paddingBottom: 14, gap: 10 },
  cardDesc:        { color: colors.textMuted, fontSize: 13, lineHeight: 20 },
  tagsRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag:             { backgroundColor: colors.deepForest, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagTxt:          { color: colors.sage, fontSize: 11 },
  linkBtn:         { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.sage, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, alignSelf: 'flex-start' },
  linkBtnTxt:      { color: colors.deepForest, fontSize: 12, fontWeight: '700' },

  puntosList:      { gap: 8 },
  puntoRow:        { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  puntoDot:        { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.sage, marginTop: 6, flexShrink: 0 },
  puntoTxt:        { color: colors.mint, fontSize: 13, lineHeight: 20, flex: 1 },
});