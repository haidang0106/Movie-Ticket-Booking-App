import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCinemas } from '../../store/slices/cinemaSlice';
import { FontAwesome5 } from '@expo/vector-icons';
import CinemaCard from '../../components/cinema/CinemaCard';
import { useNavigation } from '@react-navigation/native';
import { styles } from './CinemaListScreen.styles';

const CinemaListScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { cinemas, loading, error } = useSelector(state => state.cinema);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch cinemas on component mount
  useEffect(() => {
    dispatch(fetchCinemas());
  }, [dispatch]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchCinemas()).then(() => setRefreshing(false));
  };

  // Navigate to cinema detail
  const handleCinemaPress = (cinemaId) => {
    navigation.navigate('CinemaDetail', { cinemaId });
  };

  if (loading && !cinemas) {
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
        <Text style={styles.headerTitle>Danh sách cụm rạp</Text>
      </View>

      {/* Search bar (optional) */}
      <View style={styles.searchBar}>
        <FontAwesome5 name="search" size={18} color="#999" />
        <Text style={styles.searchPlaceholder>Tìm kiếm cinema...</Text>
      </View>

      {/* Cinemas list */}
      <FlatList
        data={cinemas || []}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <CinemaCard 
            cinema={item} 
            onPress={() => handleCinemaPress(item.id)} 
          />
        )}
        contentContainerStyle={styles.cinemaList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText>Không có cinema nào</Text>
          </View>
        }
      />
    </View>
  );
};

export default CinemaListScreen;