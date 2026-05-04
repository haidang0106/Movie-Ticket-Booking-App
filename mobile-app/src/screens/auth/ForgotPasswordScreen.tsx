import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { authService } from '../../services/authService';
import { LanguageContext } from '../../context/LanguageContext';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();
  const { t } = useContext(LanguageContext);
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendOtp = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail) {
      setError(t('validation.emailRequired'));
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      setError(t('validation.invalidEmail'));
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const res = await authService.forgotPassword(trimmedEmail);
      if (__DEV__) {
        console.log('[Forgot Password Response]', res);
      }
      
      // Neutral success message and navigate
      Alert.alert('', t('forgot.neutralSuccess'), [
        { text: 'OK', onPress: () => navigation.navigate('VerifyResetOtp', { email: trimmedEmail }) }
      ]);
    } catch (err: any) {
      if (__DEV__) {
        console.log('[Forgot Password Error]', err);
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
            <Text style={styles.headerTitle}>{t('forgot.title')}</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{t('forgot.title')}</Text>
            <Text style={styles.subtitle}>{t('forgot.subtitle')}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('forgot.emailLabel')}</Text>
              <TextInput
                style={styles.input}
                placeholder="example@gmail.com"
                placeholderTextColor={COLORS.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity 
              style={[styles.primaryButton, isLoading && styles.disabledButton]} 
              onPress={handleSendOtp}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>{isLoading ? t('common.loading') : t('forgot.sendOtp')}</Text>
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
  subtitle: { color: COLORS.muted, fontSize: 16, marginBottom: 40, lineHeight: 24 },
  inputGroup: { marginBottom: 24 },
  label: { color: COLORS.text, fontSize: 14, marginBottom: 8 },
  input: { backgroundColor: COLORS.card, borderRadius: 12, padding: 16, color: COLORS.text, fontSize: 16 },
  errorText: { color: COLORS.error, marginBottom: 16 },
  primaryButton: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 30, alignItems: 'center', marginTop: 12 },
  disabledButton: { opacity: 0.7 },
  primaryButtonText: { color: COLORS.background, fontSize: 16, fontWeight: 'bold' },
});
