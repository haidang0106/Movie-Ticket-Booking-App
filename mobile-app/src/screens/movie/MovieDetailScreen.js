import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, Modal, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieById, fetchShowsByMovie, toggleLikeMovie } from '../../store/slices/movieSlice';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ShowCard from '../../components/show/ShowCard';
import { styles } from './MovieDetailScreen.styles';

const MovieDetailScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { movieId } = route.params;
  
  const { movie, shows, loading, error, liked } = useSelector(state => state.movie);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);

  // Fetch movie data on component mount
  useEffect(() => {
    dispatch(fetchMovieById(movieId));
    dispatch(fetchShowsByMovie(movieId));
  }, [dispatch, movieId]);

  // Handle like/unlike movie
  const handleToggleLike = () => {
    dispatch(toggleLikeMovie(movieId));
  };

  // Handle show press
  const handleShowPress = (show) => {
    setSelectedShow(show);
    setModalVisible(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedShow(null);
  };

  // Handle booking navigation
  const handleBookingPress = (show) => {
    handleModalClose();
    navigation.navigate('SeatSelection', { showId: show.id });
  };

  if (loading && !movie) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Không tìm thấy phim</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{movie.title}</Text>
      </View>

      {/* Movie poster and info */}
      <View style={styles.posterContainer}>
        {movie.posterUrl ? (
          <Image 
            source={{ uri: movie.posterUrl }} 
            style={styles.posterImage} 
          />
        ) : (
          <View style={styles.posterPlaceholder}>
            <FontAwesome5 name="film" size={48} color="#666" />
            <Text style={styles.posterText>No Poster</Text>
          </View>
        )}
        <View style={styles.posterInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel>Thể loại:</Text>
            <Text style={styles.infoValue}>{movie.genre}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel>Ngôn ngữ:</Text>
            <Text style={styles.infoValue}>{movie.language}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel>Thời lượng:</Text>
            <Text style={styles.infoValue}>{movie.runtime} phút</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel>Ngày ra mắt:</Text>
            <Text style={styles.infoValue}>{movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel>Đánh giá:</Text>
            <Text style={styles.infoValue}>{movie.rating || 'Chưa có'} / 10</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel>Đạo diễn:</Text>
            <Text style={styles.infoValue}>{movie.director || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel>Diễn viên:</Text>
            <Text style={styles.infoValue}>{movie.actor || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Movie description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle>Mô Tả</Text>
        <Text style={styles.descriptionText}>{movie.description || 'Không có mô tả'} </Text>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={handleToggleLike}
          style={[styles.actionButton, liked ? styles.likedButton : null]}
        >
          <FontAwesome5 
            name={liked ? 'heart' : 'heart-o'} 
            size={20} 
            color={liked ? '#e91e63' : '#fff'} 
          />
          <Text style={styles.actionText}>{liked ? 'Bỏ yêu thích' : 'Yêu thích'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={() => navigation Share}
          style={styles.actionButton}
        >
          <FontAwesome5 name="share-alt" size={20} color="#fff" />
          <Text style={styles.actionText>Chia sẻ</Text>
        </TouchableOpacity>
      </View>

      {/* Showtimes section */}
      {shows && shows.length > 0 ? (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle>LỊCH CHIẾU</Text>
          </View>
          
          <FlatList
            data={shows}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <ShowCard 
                show={item} 
                onPress={() => handleShowPress(item)} 
              />
            )}
            contentContainerStyle={styles.showList}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText>Không có lịch chiếu nào</Text>
        </View>
      )}

      {/* Modal for show details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBackground} onTouchStart={handleModalClose}>
          <View style={styles.modalContainer} onTouchStart={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleModalClose}>
                <FontAwesome5 name="times" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.modalTitle>Chi Tiết Suất Chiếu</Text>
            </View>
            
            {selectedShow && (
              <>
                <View style={styles.modalBody}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel>Phim:</Text>
                    <Text style={styles.infoValue}>{movie.title}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel>Rạp:</Text>
                    <Text style={styles.infoValue}>{selectedShow.cinemaName}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel>Phòng chiếu:</Text>
                    <Text style={styles.infoValue}>{selectedShow.hallName}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel>Ngày:</Text>
                    <Text style={styles.infoValue}>{new Date(selectedShow.showDate).toLocaleDateString()}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel>Giờ bắt đầu:</Text>
                    <Text style={styles.infoValue}>{selectedShow.showTime}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel>Giờ kết thúc:</Text>
                    <Text style={styles.infoValue}>{selectedShow.endTime}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel>Định dạng:</Text>
                    <Text style={styles.infoValue}>{selectedShow.format}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel>Giá vé:</Text>
                    <Text style={styles.infoValue}>{selectedShow.basePrice.toLocaleString()} VNĐ</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() => handleBookingPress(selectedShow)}
                  style={styles.bookButton}
                >
                  <Text style={styles.bookButtonText>ĐẶT VÉ</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MovieDetailScreen;