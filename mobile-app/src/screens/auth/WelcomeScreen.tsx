import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

import MBookingLogo from '../../components/common/MBookingLogo';
import LanguageSelector from '../../components/common/LanguageSelector';
import WelcomeCarousel from '../../components/auth/WelcomeCarousel';

export default function WelcomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MBookingLogo />
        <LanguageSelector />
      </View>

      {/* Movie Poster Carousel & Welcome Text */}
      <WelcomeCarousel />

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.signInBtn}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.signInText}>Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpBtn}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.signUpText}>Sign up</Text>
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
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingTop: 10,
  },

  buttonsContainer: { paddingHorizontal: 24, marginTop: 'auto', paddingBottom: 20 },
  signInBtn: {
    backgroundColor: Colors.primary, borderRadius: 30,
    paddingVertical: 16, alignItems: 'center', marginBottom: 12,
  },
  signInText: { fontSize: 18, fontWeight: '700', color: Colors.background },
  signUpBtn: {
    borderWidth: 1.5, borderColor: Colors.white, borderRadius: 30,
    paddingVertical: 16, alignItems: 'center', marginBottom: 16,
  },
  signUpText: { fontSize: 18, fontWeight: '700', color: Colors.white },
  termsText: {
    fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 20,
  },
  termsLink: { color: Colors.textSecondary, textDecorationLine: 'underline' },
});
