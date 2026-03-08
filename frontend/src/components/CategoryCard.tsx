import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

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
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 12,
    justifyContent: 'flex-end',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  count: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
});

export default CategoryCard;