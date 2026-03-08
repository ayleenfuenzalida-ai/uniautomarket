import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../utils/colors';

interface BusinessCardProps {
  business: any;
  onPress: () => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {business.images_base64 && business.images_base64.length > 0 && (
        <Image
          source={{ uri: business.images_base64[0] }}
          style={styles.image}
        />
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color={COLORS.star} />
            <Text style={styles.ratingText}>{business.rating || 0}</Text>
          </View>
          {business.is_featured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={12} color={COLORS.textPrimary} />
              <Text style={styles.featuredText}>DESTACADO</Text>
            </View>
          )}
        </View>
        <Text style={styles.name} numberOfLines={1}>{business.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{business.description}</Text>
        <View style={styles.footer}>
          <Ionicons name="location-outline" size={14} color={COLORS.neonRed} />
          <Text style={styles.address} numberOfLines={1}>{business.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.backgroundDark,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neonRed,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
    ...SHADOWS.neonGlow,
  },
  featuredText: {
    color: COLORS.textPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
});

export default BusinessCard;