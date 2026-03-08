import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { businessesAPI, reviewsAPI } from '../../src/services/api';
import { useAuth } from '../../src/contexts/AuthContext';
import ReviewCard from '../../src/components/ReviewCard';
import RatingStars from '../../src/components/RatingStars';

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [businessRes, reviewsRes] = await Promise.all([
        businessesAPI.getOne(id as string),
        reviewsAPI.getByBusiness(id as string),
      ]);

      setBusiness(businessRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (business?.phone) {
      Linking.openURL(`tel:${business.phone}`);
    }
  };

  const handleEmail = () => {
    if (business?.email) {
      Linking.openURL(`mailto:${business.email}`);
    }
  };

  const handleAddReview = () => {
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para dejar una reseña');
      return;
    }
    router.push(`/business/${id}/review`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {business?.images_base64?.[0] && (
          <Image
            source={{ uri: business.images_base64[0] }}
            style={styles.image}
          />
        )}

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.name}>{business?.name}</Text>
            {business?.is_featured && (
              <View style={styles.featuredBadge}>
                <Ionicons name="star" size={16} color="#fff" />
                <Text style={styles.featuredText}>Destacado</Text>
              </View>
            )}
          </View>

          <View style={styles.ratingContainer}>
            <RatingStars rating={Math.round(business?.rating || 0)} disabled size={24} />
            <Text style={styles.ratingText}>
              {business?.rating?.toFixed(1) || '0.0'} ({business?.review_count || 0} reseñas)
            </Text>
          </View>

          <Text style={styles.description}>{business?.description}</Text>

          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={20} color="#007AFF" />
              <Text style={styles.infoText}>{business?.address}</Text>
            </View>
            {business?.phone && (
              <TouchableOpacity style={styles.infoItem} onPress={handleCall}>
                <Ionicons name="call" size={20} color="#007AFF" />
                <Text style={[styles.infoText, styles.link]}>{business.phone}</Text>
              </TouchableOpacity>
            )}
            {business?.email && (
              <TouchableOpacity style={styles.infoItem} onPress={handleEmail}>
                <Ionicons name="mail" size={20} color="#007AFF" />
                <Text style={[styles.infoText, styles.link]}>{business.email}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reseñas</Text>
              {isUser() && (
                <TouchableOpacity onPress={handleAddReview}>
                  <Text style={styles.addReviewText}>Agregar reseña</Text>
                </TouchableOpacity>
              )}
            </View>

            {reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <Text style={styles.noReviews}>Aún no hay reseñas</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  featuredText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#666',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 24,
  },
  infoSection: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  link: {
    color: '#007AFF',
  },
  reviewsSection: {
    marginTop: 8,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  addReviewText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  noReviews: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 32,
  },
});