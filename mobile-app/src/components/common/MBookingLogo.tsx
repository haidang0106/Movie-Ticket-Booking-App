import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

export default function MBookingLogo() {
  return (
    <View style={styles.logoRow}>
      <Text style={styles.logoM}>MB</Text>
      <View style={styles.logoOOWrapper}>
        <Text style={[styles.logoO, { marginRight: -8 }]}>o</Text>
        <Text style={styles.logoO}>o</Text>
      </View>
      <Text style={styles.logoKing}>king</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoM: { fontSize: 26, fontWeight: '800', color: Colors.white, letterSpacing: -0.5 },
  logoOOWrapper: { flexDirection: 'row', alignItems: 'center' },
  logoO: { fontSize: 26, fontWeight: '800', color: Colors.primary },
  logoKing: { fontSize: 26, fontWeight: '800', color: Colors.white, letterSpacing: -0.5 },
});
