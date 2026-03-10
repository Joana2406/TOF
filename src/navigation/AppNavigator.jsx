// © 2025–2026 Joana Uribe — Todos los derechos reservados.
// Uso, copia o distribución sin autorización escrita está prohibido.
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator }     from '@react-navigation/stack';
import { NavigationContainer }      from '@react-navigation/native';
import { Ionicons }                 from '@expo/vector-icons';
import { View, Text, StyleSheet }   from 'react-native';
import { SafeAreaProvider }         from 'react-native-safe-area-context';
import colors from '../theme/colors';
import { PacientesProvider, usePacientes } from '../context/PacientesContext';
import LoadingScreen from '../components/LoadingScreen';

import HomeScreen            from '../screens/HomeScreen';
import RecursosScreen        from '../screens/RecursosScreen';
import PacientesScreen       from '../screens/PacientesScreen';
import AgendaScreen          from '../screens/AgendaScreen';
import EstadisticasScreen    from '../screens/EstadisticasScreen';
import DetallePacienteScreen from '../screens/DetallePacienteScreen';
import NuevoPacienteScreen   from '../screens/NuevoPacienteScreen';
import NuevaSesionScreen     from '../screens/NuevaSesionScreen';
import AntecedentesScreen    from '../screens/AntecedentesScreen';
import ActividadesScreen     from '../screens/ActividadesScreen';
import EjerciciosScreen      from '../screens/EjerciciosScreen';
import EvaluacionScreen      from '../screens/EvaluacionScreen';
import PerfilScreen          from '../screens/PerfilScreen';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

const tabIcons = {
  Inicio:         'home',
  Pacientes:      'people',
  Agenda:         'calendar',
  'Estadísticas': 'bar-chart',
  Recursos:       'book',
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor:   colors.mint,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, focused }) => (
          <View style={[styles.iconWrap, focused && styles.iconActive]}>
            <Ionicons name={tabIcons[route.name]} size={22} color={color} />
          </View>
        ),
        tabBarLabel: ({ color, children }) => (
          <Text style={{ color, fontSize: 10, marginBottom: 4 }}>{children}</Text>
        ),
      })}
    >
      <Tab.Screen name="Inicio"       component={HomeScreen} />
      <Tab.Screen name="Pacientes"    component={PacientesScreen} />
      <Tab.Screen name="Agenda"       component={AgendaScreen} />
      <Tab.Screen name="Estadísticas" component={EstadisticasScreen} />
      <Tab.Screen name="Recursos"     component={RecursosScreen} />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { cargando } = usePacientes();
  if (cargando) return <LoadingScreen />;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.deepForest, flex: 1 },
      }}
    >
      <Stack.Screen name="Main"            component={TabNavigator} />
      <Stack.Screen name="Perfil"          component={PerfilScreen} />
      <Stack.Screen name="DetallePaciente" component={DetallePacienteScreen} />
      <Stack.Screen name="NuevoPaciente"   component={NuevoPacienteScreen} />
      <Stack.Screen name="NuevaSesion"     component={NuevaSesionScreen} />
      <Stack.Screen name="Antecedentes"    component={AntecedentesScreen} />
      <Stack.Screen name="Actividades"     component={ActividadesScreen} />
      <Stack.Screen name="Ejercicios"      component={EjerciciosScreen} />
      <Stack.Screen name="Evaluacion"      component={EvaluacionScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <PacientesProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </PacientesProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar:     { backgroundColor: colors.darkGreen, borderTopColor: colors.midGreen, borderTopWidth: 1, height: 65, paddingTop: 6 },
  iconWrap:   { padding: 4, borderRadius: 10 },
  iconActive: { backgroundColor: colors.midGreen, paddingHorizontal: 14 },
});
