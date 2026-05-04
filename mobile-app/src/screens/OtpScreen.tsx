import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

export default function OtpScreen({ navigation, route }: any) {
  const phoneNumber = route?.params?.phoneNumber || '(704) 555-0127';
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyPress = (key: string) => {
    if (key === 'del') {
      if (activeIndex > 0) {
        const newOtp = [...otp];
        newOtp[activeIndex - 1] = '';
        setOtp(newOtp);
        setActiveIndex(activeIndex - 1);
      }
    } else if (activeIndex < 6) {
      const newOtp = [...otp];
      newOtp[activeIndex] = key;
      setOtp(newOtp);
      setActiveIndex(Math.min(activeIndex + 1, 5));
    }
  };

  const formatTime = (s: number) => {
    const min = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'del'],
  ];

  const subLabels: Record<string, string> = {
    '2': 'ABC', '3': 'DEF', '4': 'GHI', '5': 'JKL',
    '6': 'MNO', '7': 'PQRS', '8': 'TUV', '9': 'WXYZ',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Confirm OTP code</Text>
        <Text style={styles.subtitle}>
          You just need to enter the OTP sent to the registered phone number {phoneNumber}.
        </Text>

        {/* OTP Boxes */}
        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <View
              key={i}
              style={[
                styles.otpBox,
                digit !== '' && styles.otpBoxFilled,
                i === activeIndex && styles.otpBoxActive,
              ]}
            >
              <Text style={styles.otpDigit}>{digit}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.timer}>{formatTime(timer)}</Text>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate('Username')}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Number Pad */}
      <View style={styles.numpad}>
        {keys.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.numpadRow}>
            {row.map((key, keyIdx) => (
              <TouchableOpacity
                key={keyIdx}
                style={[styles.numKey, key === '' && styles.numKeyEmpty]}
                onPress={() => key !== '' && handleKeyPress(key)}
                disabled={key === ''}
              >
                {key === 'del' ? (
                  <Text style={styles.numKeyText}>⌫</Text>
                ) : (
                  <View style={styles.numKeyContent}>
                    <Text style={styles.numKeyText}>{key}</Text>
                    {subLabels[key] && (
                      <Text style={styles.numKeySub}>{subLabels[key]}</Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 16, paddingVertical: 8 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backArrow: { fontSize: 24, color: Colors.white },

  content: { paddingHorizontal: 24, flex: 1 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: 24 },

  otpRow: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginBottom: 8 },
  otpBox: {
    width: 48, height: 56, borderRadius: 10,
    borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.otpBox,
    alignItems: 'center', justifyContent: 'center',
  },
  otpBoxFilled: { borderColor: Colors.primary },
  otpBoxActive: { borderColor: Colors.primary },
  otpDigit: { fontSize: 24, fontWeight: '700', color: Colors.white },

  timer: {
    fontSize: 16, color: Colors.primary, textAlign: 'right',
    marginBottom: 16, fontWeight: '600',
  },

  continueBtn: {
    backgroundColor: Colors.primary, borderRadius: 30,
    paddingVertical: 16, alignItems: 'center',
  },
  continueText: { fontSize: 17, fontWeight: '700', color: Colors.background },

  numpad: { paddingHorizontal: 24, paddingBottom: 20 },
  numpadRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8 },
  numKey: {
    width: 90, height: 56, marginHorizontal: 6,
    borderRadius: 8, backgroundColor: Colors.surfaceLight,
    alignItems: 'center', justifyContent: 'center',
  },
  numKeyEmpty: { backgroundColor: 'transparent' },
  numKeyContent: { alignItems: 'center' },
  numKeyText: { fontSize: 24, fontWeight: '600', color: Colors.white },
  numKeySub: { fontSize: 10, color: Colors.textMuted, marginTop: -2, letterSpacing: 2 },
});
