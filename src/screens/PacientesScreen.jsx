import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';

import { usePacientes } from '../context/PacientesContext';
import { exportarExpedientePDF } from '../services/generarPDF';

export default function PacientesScreen({ navigation }) {

  const { pacientes } = usePacientes();

  return (
    <ScrollView style={styles.container}>

      {pacientes.map(p => (

        <TouchableOpacity
          key={p.id}
          style={styles.card}

          onPress={() =>
            navigation.navigate('DetallePaciente', { pacienteId: p.id })
          }

          onLongPress={() =>
            Alert.alert(
              p.nombre,
              '¿Qué deseas hacer?',
              [
                {
                  text: 'Ver expediente',
                  onPress: () =>
                    navigation.navigate('DetallePaciente', { pacienteId: p.id })
                },
                {
                  text: '📄 Exportar PDF',
                  onPress: () => exportarExpedientePDF(p)
                },
                {
                  text: 'Cancelar',
                  style: 'cancel'
                }
              ]
            )
          }
        >

          <Text style={styles.nombre}>{p.nombre}</Text>

          <Text style={styles.info}>
            Edad: {p.edad}
          </Text>

          <Text style={styles.info}>
            Diagnóstico: {p.diagnostico}
          </Text>

          {p.proximaCita && (
            <Text style={styles.cita}>
              Próxima cita: {p.proximaCita}
            </Text>
          )}

        </TouchableOpacity>

      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    padding: 15
  },

  card: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2
  },

  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },

  info: {
    fontSize: 14,
    color: '#444'
  },

  cita: {
    marginTop: 6,
    color: '#007AFF',
    fontWeight: '600'
  }

});