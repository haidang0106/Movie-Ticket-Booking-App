import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { searchMovies } from '../../store/slices/movieSlice';
import MovieCard from '../../components/movie/MovieCard';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles } from './SearchScreen.styles';

const SearchScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { movies, loading, error } = useSelector(state => state.movie);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Search movies when query changes
  const handleSearch = async (text) => {
    setQuery(text);
    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      await dispatch(searchMovies(text)).then(() => {
        const stateMovies = useSelector(state => state.movie);
        setSearchResults(stateMovies.movies || []);
      });
    } finally {
      setSearchLoading(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
  };

  // Navigate to movie detail
  const handleMoviePress = (movieId) => {
    navigation.navigate('MovieDetail', { movieId });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tìm kiếm phim</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Tìm phim, thể loại..."
          value={query}
          onChangeText={handleSearch}
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
        {query.length > 0 ? (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <FontAwesome5 name="times" size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Search results */}
      {searchLoading && searchResults.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : (
        <>
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
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
              <Text style={styles.emptyText}>Không tìm thấy phim nào</Text>
              {query.length > 0 ? (
                <Text style={styles.emptySubtext}>Thử từ khóa khác hoặc kiểm tra chính tả</Text>
              ) : null}
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default SearchScreen;