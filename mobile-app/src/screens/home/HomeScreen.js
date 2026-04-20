import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies, fetchFeaturedMovies } from '../../store/slices/movieSlice';
import { FontAwesome5 } from '@expo/vector-icons';
import MovieCard from '../../components/movie/MovieCard';
import FeaturedCarousel from '../../components/movie/FeaturedCarousel';
import { useNavigation } from '@react-navigation/native';
import { styles } from './HomeScreen.styles';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { movies, featuredMovies, loading, error } = useSelector(state => state.movie);
  const [refreshing, setRefreshing] = useState(false);

  // Navigation object
  const nav = useNavigation();

  // Fetch movies on component mount
  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchFeaturedMovies());
  }, [dispatch]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchMovies()).then(() => setRefreshing(false));
    dispatch(fetchFeaturedMovies()).then(() => setRefreshing(false));
  };

  // Navigate to movie detail
  const handleMoviePress = (movieId) => {
    nav.navigate('MovieDetail', { movieId });
  };

  // Navigate to search
  const handleSearchPress = () => {
    nav.navigate('Search');
  };

  // Navigate to cinema list
  const handleCinemaPress = () => {
    nav.navigate('CinemaList');
  };

  if (loading && !movies && !featuredMovies) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle>Đặt Vé Xem Phim</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleSearchPress} style={styles.actionButton}>
            <FontAwesome5 name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <FontAwesome5 name="search" size={18} color="#999" />
        <Text style={styles.searchPlaceholder>Tìm phim, cinema...</Text>
      </View>

      {/* Featured Carousel */}
      {featuredMovies.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle>Phim Nổi Bật</Text>
          <FeaturedCarousel 
            movies={featuredMovies} 
            onPress={handleMoviePress} 
          />
        </View>
      ) : null}

      {/* Now Showing Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle>Đang Chiếu</Text>
          <TouchableOpacity onPress={handleCinemaPress} style={styles.seeAll}>
            <Text style={styles.seeAllText>Xem tất cả</Text>
            <FontAwesome5 name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
        </View>
        
        {movies.length > 0 ? (
          <FlatList
            data={movies}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <MovieCard 
                movie={item} 
                onPress={() => handleMoviePress(item.id)} 
              />
            )}
            contentContainerStyle={styles.movieList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText>Không có phim nào đang chiếu</Text>
          </View>
        )}
      </View>

      {/* Refresh Control */}
      <RefreshControl
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

export default HomeScreen;