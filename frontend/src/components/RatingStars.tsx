import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  disabled?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  onRatingChange,
  size = 32,
  disabled = false,
}) => {
  const handlePress = (index: number) => {
    if (!disabled && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: 5 }).map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handlePress(index)}
          disabled={disabled}
          style={styles.star}
        >
          <Ionicons
            name={index < rating ? 'star' : 'star-outline'}
            size={size}
            color="#FFC107"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 4,
  },
});

export default RatingStars;