import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, TextInput, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import BottomNavBar from '../../components/common/BottomNavBar';

const { width } = Dimensions.get('window');

// 1. Header
const HomeHeader = () => (
  <View style={styles.headerContainer}>
    <View style={styles.headerTop}>
      <View>
        <Text style={styles.greetingSmall}>Hi, Angelina 👋</Text>
        <Text style={styles.greetingLarge}>Welcome back</Text>
      </View>
      <TouchableOpacity style={styles.notificationBtn}>
        <View style={styles.bellIconContainer}>
          <Text style={styles.bellIcon}>🔔</Text>
          <View style={styles.notificationBadge} />
        </View>
      </TouchableOpacity>
    </View>
    <View style={styles.searchBar}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor={'#A1A1AA'}
      />
    </View>
  </View>
);

// Helper for section headers
const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeaderRow}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <TouchableOpacity style={styles.seeAllBtn}>
      <Text style={styles.seeAllText}>See all <Text style={styles.seeAllArrow}>&gt;</Text></Text>
    </TouchableOpacity>
  </View>
);

// 2. Now Playing
const NowPlayingSection = () => {
  return (
    <View style={styles.sectionContainer}>
      <SectionHeader title="Now playing" />
      <View style={styles.nowPlayingMainCard}>
        <Image 
          source={{ uri: 'https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_.jpg' }} 
          style={styles.nowPlayingMainPoster} 
          resizeMode="cover"
        />
        <Text style={styles.nowPlayingTitle}>Avengers - Infinity War</Text>
        <Text style={styles.nowPlayingMeta}>2h29m • Action, adventure, sci-fi</Text>
        <Text style={styles.nowPlayingRating}>⭐ <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>4.8</Text> (1.222)</Text>
        <View style={styles.paginationDots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>
      </View>
    </View>
  );
};

// 3. Coming Soon
const ComingSoonSection = () => {
  const movies = [
    { id: 1, title: 'Avatar 2: The Way Of\nWater', date: '20.12.2022', genre: 'Adventure, Sci-fi', image: 'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_.jpg' },
    { id: 2, title: 'Ant Man Wasp:\nQuantumania', date: '25.12.2022', genre: 'Adventure, Sci-fi', image: 'https://m.media-amazon.com/images/M/MV5BODZhNzlmOGItOTVkMC00Y2IyLThkMTItOTFhMjkxMWU3OGFhXkEyXkFqcGdeQXVyMTE0MjExMDQz._V1_.jpg' },
  ];

  return (
    <View style={[styles.sectionContainer, { marginTop: 24 }]}>
      <SectionHeader title="Coming soon" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
        {movies.map((movie) => (
          <TouchableOpacity key={movie.id} style={styles.csCard}>
            <Image source={{ uri: movie.image }} style={styles.csPoster} resizeMode="cover" />
            <Text style={styles.csTitle} numberOfLines={2}>{movie.title}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🎥</Text>
              <Text style={styles.infoText}>{movie.genre}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📅</Text>
              <Text style={styles.infoText}>{movie.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// 4. Promo
const PromoSection = () => (
  <View style={[styles.sectionContainer, { marginTop: 24 }]}>
    <SectionHeader title="Promo & Discount" />
    <View style={styles.promoBanner}>
      <View style={styles.promoOverlay} />
      <View style={styles.promoContent}>
        <View style={{ flex: 1 }} />
        <View style={styles.promoTextCol}>
          <Text style={styles.promoHeadline}><Text style={{ fontSize: 40 }}>30</Text><Text style={{ fontSize: 24 }}>%</Text></Text>
          <Text style={styles.promoHeadlineSub}>OFF</Text>
          <Text style={styles.promoSub}>Movie vouchers free</Text>
        </View>
      </View>
    </View>
  </View>
);

// 5. Service
const ServiceSection = () => {
  const services = [
    { id: 1, title: 'Retal', bg: '#2A2A2A', icon: '🛍️' },
    { id: 2, title: 'Imax', bg: '#0055FF', icon: 'IMAX' },
    { id: 3, title: '4DX', bg: '#0088FF', icon: '4DX' },
    { id: 4, title: 'Sweetbox', bg: '#FF3333', icon: '🍿' },
  ];

  return (
    <View style={[styles.sectionContainer, { marginTop: 24 }]}>
      <SectionHeader title="Service" />
      <View style={styles.serviceRow}>
        {services.map((service) => (
          <View key={service.id} style={styles.serviceItem}>
            <View style={[styles.serviceIconCircle, { backgroundColor: service.bg }]}>
              <Text style={styles.serviceIconText}>{service.icon}</Text>
            </View>
            <Text style={styles.serviceLabel}>{service.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// 6. Movie News
const MovieNewsSection = () => {
  const news = [
    { id: 1, title: 'When The Batman 2 Starts\nFilming Reportedly Revealed', image: 'https://m.media-amazon.com/images/M/MV5BMmU5NGJlMzAtMGNmOC00YjJjLTg1MTUtNDhlNjA3YTE4ZWVmXkEyXkFqcGdeQXVyNjM0MTI4MzU@._V1_.jpg' },
    { id: 2, title: '6 Epic Hulk Fights That Will\nHappen In The MCU', image: 'https://m.media-amazon.com/images/M/MV5BMTM2NDQ1OTM0M15BMl5BanBnXkFtZTgwODA5MDIwNDM@._V1_.jpg' },
  ];

  return (
    <View style={[styles.sectionContainer, { marginTop: 24, marginBottom: 20 }]}>
      <SectionHeader title="Movie news" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
        {news.map((item) => (
          <TouchableOpacity key={item.id} style={styles.newsCard}>
            <Image source={{ uri: item.image }} style={styles.newsImg} resizeMode="cover" />
            <Text style={styles.newsHeadline} numberOfLines={2}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 120 }}>
        <HomeHeader />
        <NowPlayingSection />
        <ComingSoonSection />
        <PromoSection />
        <ServiceSection />
        <MovieNewsSection />
      </ScrollView>
      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  scrollView: { flex: 1 },

  // Header
  headerContainer: { paddingHorizontal: 20, paddingTop: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greetingSmall: { fontSize: 14, color: '#FFFFFF', marginBottom: 2 },
  greetingLarge: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  notificationBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  bellIconContainer: { position: 'relative' },
  bellIcon: { fontSize: 24, color: '#FFFFFF' },
  notificationBadge: { position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: '#00FF00', borderWidth: 1, borderColor: '#000000' },
  
  // Search Bar
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1B1B', borderRadius: 12, paddingHorizontal: 16, height: 48, marginBottom: 24 },
  searchIcon: { fontSize: 16, marginRight: 12, color: '#A1A1AA' },
  searchInput: { flex: 1, fontSize: 16, color: '#FFFFFF' },

  // Shared Section Styles
  sectionContainer: { paddingHorizontal: 20 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  seeAllBtn: { paddingBottom: 4 },
  seeAllText: { fontSize: 14, color: Colors.primary, fontWeight: '500' },
  seeAllArrow: { fontSize: 12 },
  horizontalScroll: { paddingRight: 20, gap: 16 },

  // Now Playing Main Card
  nowPlayingMainCard: { alignItems: 'center' },
  nowPlayingMainPoster: { width: width - 80, height: (width - 80) * 1.3, borderRadius: 20, backgroundColor: '#1C1B1B', marginBottom: 16 },
  nowPlayingTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginBottom: 6 },
  nowPlayingMeta: { color: '#A1A1AA', fontSize: 14, marginBottom: 6 },
  nowPlayingRating: { color: Colors.primary, fontSize: 14, marginBottom: 16 },
  paginationDots: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 24, height: 4, borderRadius: 2, backgroundColor: '#333333' },
  dotActive: { backgroundColor: Colors.primary },

  // Coming Soon Cards
  csCard: { width: width * 0.42 },
  csPoster: { width: '100%', aspectRatio: 2 / 3, borderRadius: 16, backgroundColor: '#1C1B1B', marginBottom: 12 },
  csTitle: { color: Colors.primary, fontSize: 16, fontWeight: '700', marginBottom: 8, lineHeight: 22 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  infoIcon: { fontSize: 14, marginRight: 8, color: '#FFFFFF' },
  infoText: { color: '#A1A1AA', fontSize: 12, flex: 1 },

  // Promo Banner
  promoBanner: { width: '100%', height: 120, borderRadius: 16, backgroundColor: '#4a154b', overflow: 'hidden', position: 'relative' },
  promoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  promoContent: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 20 },
  promoTextCol: { alignItems: 'flex-end', justifyContent: 'center' },
  promoHeadline: { color: '#FFFFFF', fontWeight: '900', lineHeight: 42 },
  promoHeadlineSub: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', marginTop: -4 },
  promoSub: { color: '#FFFFFF', fontSize: 12, marginTop: 4 },

  // Service Grid
  serviceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  serviceItem: { alignItems: 'center', width: '22%' },
  serviceIconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 8, overflow: 'hidden' },
  serviceIconText: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  serviceLabel: { fontSize: 14, color: '#FFFFFF', fontWeight: '500' },

  // Movie News
  newsCard: { width: width * 0.65 },
  newsImg: { width: '100%', height: 140, borderRadius: 16, backgroundColor: '#1C1B1B', marginBottom: 12 },
  newsHeadline: { fontSize: 14, color: '#FFFFFF', fontWeight: '500', lineHeight: 20 },
});
