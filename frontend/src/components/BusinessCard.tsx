import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
            <Ionicons name="star" size={16} color="#FFC107" />
            <Text style={styles.ratingText}>{business.rating || 0}</Text>
          </View>
          {business.is_featured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>Destacado</Text>
            </View>
          )}
        </View>
        <Text style={styles.name} numberOfLines={1}>{business.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{business.description}</Text>
        <View style={styles.footer}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.address} numberOfLines={1}>{business.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
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
    color: '#333',
  },
  featuredBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
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
    color: '#666',
    flex: 1,
  },
});

export default BusinessCard;