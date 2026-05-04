import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { authService } from '../../services/authService';
import { LanguageContext } from '../../context/LanguageContext';

export default function VerifyResetOtpScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const email = route.params?.email || '';
  const { t } = useContext(LanguageContext);

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email) {
      navigation.navigate('Login');
    }
  }, [email, navigation]);

  const handleVerify = async () => {
    if (!otp) {
      setError(t('validation.otpRequired'));
      return;
    }

    if (otp.length !== 6) {
      setError(t('validation.otpSixDigits'));
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const res = await authService.verifyResetOtp(email, otp);
      if (__DEV__) {
        console.log('[Verify Reset OTP Response]', res);
      }

      if (res && (res.success || (res.code >= 1000 && res.code < 3000))) {
        navigation.navigate('ResetPassword', { email });
      } else {
        setError(res?.message || t('common.error'));
      }
    } catch (err: any) {
      if (__DEV__) {
        console.log('[Verify Reset OTP Error]', err);
      }
      setError(err.response?.data?.message || t('common.serverConnectionError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('resetOtp.title')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{t('resetOtp.title')}</Text>
          <Text style={styles.subtitle}>{`${t('resetOtp.subtitle')} ${email}`}</Text>

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.otpInput}
              placeholder="000000"
              placeholderTextColor={COLORS.muted}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              textAlign="center"
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity 
            style={[styles.primaryButton, isLoading && styles.disabledButton]} 
            onPress={handleVerify}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>{isLoading ? t('common.loading') : t('resetOtp.continue')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },
  backButton: { color: COLORS.text, fontSize: 24 },
  headerTitle: { color: COLORS.text, fontSize: 20, fontWeight: 'bold' },
  content: { paddingHorizontal: 24, flex: 1, paddingTop: 20 },
  title: { color: COLORS.text, fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { color: COLORS.muted, fontSize: 16, marginBottom: 40, lineHeight: 24 },
  inputGroup: { marginBottom: 24, alignItems: 'center' },
  otpInput: { backgroundColor: COLORS.card, borderRadius: 12, padding: 16, color: COLORS.text, fontSize: 32, letterSpacing: 10, width: '100%' },
  errorText: { color: COLORS.error, marginBottom: 16, textAlign: 'center' },
  primaryButton: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  disabledButton: { opacity: 0.7 },
  primaryButtonText: { color: COLORS.background, fontSize: 16, fontWeight: 'bold' },
});
