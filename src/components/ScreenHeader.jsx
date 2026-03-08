import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

export default function ScreenHeader({ title, subtitle, navigation, showBack = false, rightAction }) {
  const { width } = useWindowDimensions();
  const isWeb = width >= 600;

  return (
    <View style={[sh.wrap, isWeb && sh.wrapWeb]}>
      <View style={sh.left}>
        {showBack && navigation && (
          <TouchableOpacity
            style={sh.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={20} color={colors.mint} />
          </TouchableOpacity>
        )}
        <View>
          <Text style={[sh.title, isWeb && sh.titleWeb]}>{title}</Text>
          {subtitle ? <Text style={sh.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {rightAction && (
        <TouchableOpacity style={sh.rightBtn} onPress={rightAction.onPress}>
          <Ionicons name={rightAction.icon} size={18} color={colors.mint} />
          {rightAction.label && <Text style={sh.rightBtnTxt}>{rightAction.label}</Text>}
        </TouchableOpacity>
      )}
    </View>
  );
}

const sh = StyleSheet.create({
  wrap:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  wrapWeb:    { paddingHorizontal: 24, paddingTop: 18 },
  left:       { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn:    { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.darkGreen, justifyContent: 'center', alignItems: 'center' },
  title:      { color: colors.mint, fontSize: 20, fontWeight: '700' },
  titleWeb:   { fontSize: 24 },
  subtitle:   { color: colors.textMuted, fontSize: 12, marginTop: 1 },
  rightBtn:   { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.midGreen, borderRadius: 11, paddingHorizontal: 12, paddingVertical: 7 },
  rightBtnTxt:{ color: colors.mint, fontWeight: '600', fontSize: 12 },
});