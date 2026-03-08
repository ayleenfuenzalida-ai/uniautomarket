import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, SHADOWS } from '../utils/colors';

interface CategoryCardProps {
  category: any;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {category.image_base64 && (
        <Image
          source={{ uri: category.image_base64 }}
          style={styles.image}
        />
      )}
      <View style={styles.overlay}>
        <Text style={styles.name} numberOfLines={2}>{category.name}</Text>
        <Text style={styles.count}>{category.business_count} negocios</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '47%',
    height: 160,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.neonRed,
    ...SHADOWS.small,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: COLORS.neonRed,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
    textShadowColor: COLORS.neonRed,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  count: {
    fontSize: 12,
    color: COLORS.neonRed,
    fontWeight: '600',
  },
});

export default CategoryCard;