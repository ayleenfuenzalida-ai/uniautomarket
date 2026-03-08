import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { categoriesAPI, businessesAPI, statsAPI } from '../../src/services/api';
import CategoryCard from '../../src/components/CategoryCard';
import BusinessCard from '../../src/components/BusinessCard';
import { COLORS, SHADOWS } from '../../src/utils/colors';

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
        <ActivityIndicator size="large" color={COLORS.neonRed} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.neonRed} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Universal AutoMarket</Text>
            <Text style={styles.headerSubtitle}>Marketplace Automotriz #1</Text>
          </View>
          <Ionicons name="car-sport" size={40} color={COLORS.neonRed} />
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Encuentra todo para tu vehículo</Text>
          <Text style={styles.heroSubtitle}>
            Repuestos, talleres, herramientas y servicios en un solo lugar
          </Text>
          <View style={styles.heroButtons}>
            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => router.push('/(tabs)/categories')}
            >
              <Text style={styles.heroButtonText}>Explorar Categorías</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        {stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="business" size={24} color={COLORS.neonRed} />
              <Text style={styles.statNumber}>{stats.business_count}+</Text>
              <Text style={styles.statLabel}>Negocios</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="cube" size={24} color={COLORS.neonRed} />
              <Text style={styles.statNumber}>{Math.floor(stats.product_count / 1000)}K+</Text>
              <Text style={styles.statLabel}>Productos</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="people" size={24} color={COLORS.neonRed} />
              <Text style={styles.statNumber}>{Math.floor(stats.user_count / 1000) || 1}K+</Text>
              <Text style={styles.statLabel}>Usuarios</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="star" size={24} color={COLORS.star} />
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
              <Text style={styles.seeAll}>Ver todas →</Text>
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
          <Text style={styles.sectionTitle}>⭐ Negocios Destacados</Text>
          <Text style={styles.sectionSubtitle}>Los mejores proveedores</Text>
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
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
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
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.backgroundDark,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.neonRed,
    textShadowColor: COLORS.neonRed,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  hero: {
    backgroundColor: COLORS.backgroundDark,
    padding: 24,
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.neonRed,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  heroButtons: {
    flexDirection: 'row',
  },
  heroButton: {
    flex: 1,
    backgroundColor: COLORS.neonRed,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    ...SHADOWS.neonGlow,
  },
  heroButtonText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.backgroundCard,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
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
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.neonRed,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
