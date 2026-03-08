import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { businessesAPI } from '../../src/services/api';

export default function ManageBusinessesScreen() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      const response = await businessesAPI.getAll();
      setBusinesses(response.data);
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (businessId: string) => {
    try {
      await businessesAPI.toggleFeatured(businessId);
      await loadBusinesses();
      Alert.alert('Éxito', 'Estado de destacado actualizado');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Error al actualizar');
    }
  };

  const handleDelete = (businessId: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de eliminar este negocio? Se eliminará también su usuario.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await businessesAPI.delete(businessId);
              await loadBusinesses();
              Alert.alert('Éxito', 'Negocio eliminado');
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.detail || 'Error al eliminar');
            }
          },
        },
      ]
    );
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
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestionar Negocios</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/admin/businesses/create')}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Crear Nuevo Negocio</Text>
        </TouchableOpacity>

        {businesses.map((business: any) => (
          <View key={business.id} style={styles.businessCard}>
            <View style={styles.businessHeader}>
              <Text style={styles.businessName}>{business.name}</Text>
              {business.is_featured && (
                <View style={styles.featuredBadge}>
                  <Ionicons name="star" size={14} color="#fff" />
                  <Text style={styles.featuredText}>Destacado</Text>
                </View>
              )}
            </View>
            <Text style={styles.businessAddress}>{business.address}</Text>
            <Text style={styles.businessRating}>⭐ {business.rating} ({business.review_count} reseñas)</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: business.is_featured ? '#FF9500' : '#34C759' }]}
                onPress={() => handleToggleFeatured(business.id)}
              >
                <Ionicons
                  name={business.is_featured ? 'star-outline' : 'star'}
                  size={18}
                  color="#fff"
                />
                <Text style={styles.actionText}>
                  {business.is_featured ? 'Quitar destacado' : 'Destacar'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(business.id)}
              >
                <Ionicons name="trash" size={18} color="#fff" />
                <Text style={styles.actionText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  scrollContent: {
    padding: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  businessCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  businessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  featuredText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  businessAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  businessRating: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 4,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
