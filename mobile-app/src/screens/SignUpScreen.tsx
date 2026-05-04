import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

export default function SignUpScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');

  const formatPhone = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 3) return `(${cleaned}`;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (text: string) => {
    setPhone(text);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign up</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Phone Input */}
      <View style={styles.content}>
        <View style={styles.phoneRow}>
          <Text style={styles.phoneIcon}>📞</Text>
          <TextInput
            style={styles.phoneInput}
            placeholder="(704) 555-0127"
            placeholderTextColor={Colors.textMuted}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={handlePhoneChange}
          />
        </View>

        <TouchableOpacity
          style={[styles.continueBtn, !phone && styles.continueBtnDisabled]}
          onPress={() => navigation.navigate('Otp', { phoneNumber: phone || '(704) 555-0127' })}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Social Login */}
      <View style={styles.bottomSection}>
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.socialBtn}>
          <Text style={styles.fbIcon}>f</Text>
          <Text style={styles.socialText}>Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.socialBtn, { marginTop: 12 }]}>
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By sign in or sign up, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {'\n'}and <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backArrow: { fontSize: 24, color: Colors.white },
  headerTitle: { fontSize: 20, fontWeight: '700', color: Colors.white },

  content: { paddingHorizontal: 24, marginTop: 20 },
  phoneRow: {
    flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: Colors.border, paddingBottom: 12,
  },
  phoneIcon: { fontSize: 20, marginRight: 12 },
  phoneInput: { flex: 1, fontSize: 18, color: Colors.white, fontWeight: '500' },

  continueBtn: {
    backgroundColor: Colors.primary, borderRadius: 30,
    paddingVertical: 16, alignItems: 'center', marginTop: 24,
  },
  continueBtnDisabled: { opacity: 0.7 },
  continueText: { fontSize: 17, fontWeight: '700', color: Colors.background },

  bottomSection: {
    marginTop: 'auto', paddingHorizontal: 50, paddingBottom: 30,
  },
  dividerRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { marginHorizontal: 12, fontSize: 14, color: Colors.textMuted },

  socialBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border, borderRadius: 30,
    paddingVertical: 14, gap: 10,
  },
  fbIcon: {
    fontSize: 18, fontWeight: '800', color: Colors.facebook,
  },
  googleIcon: {
    fontSize: 18, fontWeight: '700', color: Colors.white,
  },
  socialText: { fontSize: 16, fontWeight: '600', color: Colors.white },

  termsText: {
    fontSize: 13, color: Colors.textMuted, textAlign: 'center',
    lineHeight: 20, marginTop: 20,
  },
  termsLink: { color: Colors.textSecondary, textDecorationLine: 'underline' },
});
