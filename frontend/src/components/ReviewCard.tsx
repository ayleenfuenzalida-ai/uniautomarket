import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

interface ReviewCardProps {
  review: any;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Ionicons
        key={index}
        name={index < review.rating ? 'star' : 'star-outline'}
        size={16}
        color={COLORS.star}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL');
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{review.user_name[0].toUpperCase()}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{review.user_name}</Text>
          <View style={styles.starsContainer}>{renderStars()}</View>
        </View>
        <Text style={styles.date}>{formatDate(review.created_at)}</Text>
      </View>
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neonRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  date: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  comment: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default ReviewCard;