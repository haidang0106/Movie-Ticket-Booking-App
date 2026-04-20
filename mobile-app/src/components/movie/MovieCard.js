import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const MovieCard = ({ movie, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image 
        source={{ uri: movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image' }} 
        style={styles.poster} 
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>{movie.title}</Text>
        <View style={styles.rating}>
          <FontAwesome5 name="star" size={16} color="#ffc107" />
          <Text style={styles.ratingText}>{movie.rating || 'N/A'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 120,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  poster: {
    width: 120,
    height: 180,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#ffc107',
    marginLeft: 4,
  },
});

export default MovieCard;