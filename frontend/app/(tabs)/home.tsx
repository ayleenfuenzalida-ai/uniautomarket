import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { categoriesAPI, businessesAPI, statsAPI } from '../../src/services/api';
import CategoryCard from '../../src/components/CategoryCard';
import BusinessCard from '../../src/components/BusinessCard';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [categories, setCategories] = useState([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesRes, businessesRes, statsRes] = await Promise.all([
        categoriesAPI.getAll(),
        businessesAPI.getFeatured(),
        statsAPI.get(),
      ]);

      setCategories(categoriesRes.data.slice(0, 6));
      setFeaturedBusinesses(businessesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Universal AutoMarket</Text>
            <Text style={styles.headerSubtitle}>Marketplace Automotriz #1 de Chile</Text>
          </View>
          <Ionicons name="car-sport" size={40} color="#007AFF" />
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Encuentra todo para tu vehículo</Text>
          <Text style={styles.heroSubtitle}>
            Repuestos, talleres, herramientas y servicios automotrices en un solo lugar
          </Text>
          <View style={styles.heroButtons}>
            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => router.push('/(tabs)/categories')}
            >
              <Text style={styles.heroButtonText}>Explorar Categorías</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.heroButton, styles.heroButtonSecondary]}
              onPress={() => router.push('/contact')}
            >
              <Text style={[styles.heroButtonText, styles.heroButtonTextSecondary]}>
                Contactar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        {stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.business_count}+</Text>
              <Text style={styles.statLabel}>Negocios</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{Math.floor(stats.product_count / 1000)}K+</Text>
              <Text style={styles.statLabel}>Productos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{Math.floor(stats.user_count / 1000)}K+</Text>
              <Text style={styles.statLabel}>Usuarios</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.avg_rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        )}

        {/* Categories Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorías</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={() => router.push(`/category/${category.id}`)}
              />
            ))}
          </View>
        </View>

        {/* Featured Businesses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Negocios Destacados</Text>
          <Text style={styles.sectionSubtitle}>Los mejores proveedores de cada categoría</Text>
          {featuredBusinesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              onPress={() => router.push(`/business/${business.id}`)}
            />
          ))}
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
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  hero: {
    backgroundColor: '#f8f9fa',
    padding: 24,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  heroButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  heroButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  heroButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  heroButtonTextSecondary: {
    color: '#007AFF',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
