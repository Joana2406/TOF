import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';

export default function LoadingScreen() {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1,   duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient colors={[colors.deepForest, colors.darkGreen]} style={styles.wrap}>
      <Animated.View style={[styles.logo, { opacity: pulse }]}>
        <Text style={styles.logoTxt}>TOF</Text>
      </Animated.View>
      <Text style={styles.sub}>Terapia Ocupacional Fernanda</Text>
      <Text style={styles.loading}>Cargando datos...</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap:    { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  logo:    { width: 90, height: 90, borderRadius: 28, backgroundColor: colors.sage, justifyContent: 'center', alignItems: 'center' },
  logoTxt: { color: colors.deepForest, fontSize: 30, fontWeight: '900', letterSpacing: 2 },
  sub:     { color: colors.mint, fontSize: 16, fontWeight: '600' },
  loading: { color: colors.textMuted, fontSize: 13 },
});