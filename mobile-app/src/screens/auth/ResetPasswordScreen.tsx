import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { authService } from '../../services/authService';
import { LanguageContext } from '../../context/LanguageContext';

export default function ResetPasswordScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const email = route.params?.email || '';
  const { t } = useContext(LanguageContext);
  
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    if (!otp) {
      setError(t('validation.otpRequired'));
      return;
    }
    if (otp.length !== 6) {
      setError(t('validation.otpSixDigits'));
      return;
    }
    if (!newPassword) {
      setError(t('validation.newPasswordRequired'));
      return;
    }
    if (newPassword.length < 8) {
      setError(t('validation.newPasswordTooShort'));
      return;
    }
    if (!confirmPassword) {
      setError(t('validation.confirmNewPasswordRequired'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('validation.passwordMismatch'));
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const res = await authService.resetPassword(email, otp, newPassword);
      if (__DEV__) {
        console.log('[Reset Password Response]', res);
      }
      
      Alert.alert('', t('reset.success'), [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (err: any) {
      if (__DEV__) {
        console.log('[Reset Password Error]', err);
      }
      setError(err.response?.data?.message || t('common.serverConnectionError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('reset.title')}</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{t('reset.title')}</Text>
            <Text style={styles.subtitle}>{t('reset.subtitle')}</Text>
            <Text style={styles.emailText}>{email}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('reset.otpLabel')}</Text>
              <TextInput
                style={styles.input}
                placeholder="000000"
                placeholderTextColor={COLORS.muted}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('reset.newPassword')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('reset.newPassword')}
                placeholderTextColor={COLORS.muted}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('reset.confirmNewPassword')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('reset.confirmNewPassword')}
                placeholderTextColor={COLORS.muted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity 
              style={[styles.primaryButton, isLoading && styles.disabledButton]} 
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>{isLoading ? t('common.loading') : t('reset.updatePassword')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },
  backButton: { color: COLORS.text, fontSize: 24 },
  headerTitle: { color: COLORS.text, fontSize: 20, fontWeight: 'bold' },
  content: { paddingHorizontal: 24, flex: 1, paddingTop: 20 },
  title: { color: COLORS.text, fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { color: COLORS.muted, fontSize: 16, marginBottom: 8, lineHeight: 24 },
  emailText: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold', marginBottom: 32 },
  inputGroup: { marginBottom: 20 },
  label: { color: COLORS.text, fontSize: 14, marginBottom: 8 },
  input: { backgroundColor: COLORS.card, borderRadius: 12, padding: 16, color: COLORS.text, fontSize: 16 },
  errorText: { color: COLORS.error, marginBottom: 16 },
  primaryButton: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 30, alignItems: 'center', marginTop: 12, marginBottom: 32 },
  disabledButton: { opacity: 0.7 },
  primaryButtonText: { color: COLORS.background, fontSize: 16, fontWeight: 'bold' },
});
