import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  Dimensions, ScrollView, Modal, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

const { width, height } = Dimensions.get('window');

const MOVIE_POSTERS = [
  'https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_.jpg',
  'https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGc@._V1_.jpg',
  'https://m.media-amazon.com/images/M/MV5BMTM0MDgwNjMyMl5BMl5BanBnXkFtZTcwNTg3NzAzMw@@._V1_.jpg',
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'vi', label: 'Vietnamese' },
];

export default function WelcomeScreen({ navigation }: any) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLanguage, setShowLanguage] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / (width - 60));
    setCurrentSlide(slide);
  };

  const openLanguageModal = () => {
    setShowLanguage(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeLanguageModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowLanguage(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.logoM}>MB</Text>
          <Text style={styles.logoOO}>oo</Text>
          <Text style={styles.logoKing}>king</Text>
        </View>
        <TouchableOpacity style={styles.langBtn} onPress={openLanguageModal}>
          <Text style={styles.langIcon}>文A</Text>
          <Text style={styles.langText}>
            {selectedLang === 'en' ? 'English' : 'Tiếng Việt'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Movie Poster Carousel */}
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.carouselContent}
        >
          {MOVIE_POSTERS.map((uri, index) => (
            <View key={index} style={styles.posterWrapper}>
              <Image source={{ uri }} style={styles.posterImage} resizeMode="cover" />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Welcome Text */}
      <View style={styles.welcomeTextContainer}>
        <Text style={styles.welcomeTitle}>MBooking hello!</Text>
        <Text style={styles.welcomeSubtitle}>Enjoy your favorite movies</Text>
        {/* Dots */}
        <View style={styles.dotsRow}>
          {MOVIE_POSTERS.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, currentSlide === i && styles.dotActive]}
            />
          ))}
        </View>
      </View>

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

      {/* Language Modal */}
      <Modal visible={showLanguage} transparent animationType="none">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeLanguageModal}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <TouchableOpacity activeOpacity={1}>
              <Text style={styles.modalTitle}>Choose language</Text>
              <Text style={styles.modalSubtitle}>Which language do you want to use?</Text>

              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.langOption}
                  onPress={() => setSelectedLang(lang.code)}
                >
                  <Text style={[
                    styles.langOptionText,
                    selectedLang === lang.code && styles.langOptionActive,
                  ]}>
                    {lang.label}
                  </Text>
                  <View style={[
                    styles.radio,
                    selectedLang === lang.code && styles.radioActive,
                  ]}>
                    {selectedLang === lang.code && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity style={styles.useLangBtn} onPress={closeLanguageModal}>
                <Text style={styles.useLangText}>
                  Use {selectedLang === 'en' ? 'English' : 'Vietnamese'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingTop: 10,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoM: { fontSize: 28, fontWeight: '800', color: Colors.white },
  logoOO: { fontSize: 28, fontWeight: '800', color: Colors.primary },
  logoKing: { fontSize: 28, fontWeight: '800', color: Colors.white },
  langBtn: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.borderLight,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, gap: 6,
  },
  langIcon: { fontSize: 14, color: Colors.white },
  langText: { fontSize: 14, color: Colors.white },

  carouselContainer: { marginTop: 20, height: height * 0.38 },
  carouselContent: { paddingHorizontal: 30 },
  posterWrapper: {
    width: width - 60, borderRadius: 16, overflow: 'hidden',
    marginRight: 0,
  },
  posterImage: { width: '100%', height: '100%', borderRadius: 16 },

  welcomeTextContainer: { alignItems: 'center', marginTop: 16 },
  welcomeTitle: { fontSize: 26, fontWeight: '700', color: Colors.white },
  welcomeSubtitle: { fontSize: 16, color: Colors.textSecondary, marginTop: 4 },
  dotsRow: { flexDirection: 'row', marginTop: 14, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.textMuted },
  dotActive: { backgroundColor: Colors.primary },

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

  // Language Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface, borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 24, paddingBottom: 40,
  },
  modalTitle: { fontSize: 24, fontWeight: '700', color: Colors.white },
  modalSubtitle: { fontSize: 15, color: Colors.textSecondary, marginTop: 4, marginBottom: 24 },
  langOption: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 18,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  langOptionText: { fontSize: 18, color: Colors.white, fontWeight: '500' },
  langOptionActive: { color: Colors.primary },
  radio: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: Colors.textMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: Colors.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },
  useLangBtn: {
    backgroundColor: Colors.primary, borderRadius: 30,
    paddingVertical: 16, alignItems: 'center', marginTop: 24,
  },
  useLangText: { fontSize: 17, fontWeight: '700', color: Colors.background },
});
