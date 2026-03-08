import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../src/utils/colors';

export default function AdminDashboard() {
  const router = useRouter();

  const menuItems = [
    {
      icon: 'business',
      title: 'Gestionar Negocios',
      subtitle: 'Crear, editar y eliminar negocios',
      route: '/admin/businesses',
      color: COLORS.neonRed,
    },
    {
      icon: 'grid',
      title: 'Gestionar Categorías',
      subtitle: 'Ver y gestionar categorías',
      route: '/admin/categories',
      color: COLORS.neonRed,
    },
    {
      icon: 'star',
      title: 'Gestionar Reseñas',
      subtitle: 'Aprobar, editar y eliminar reseñas',
      route: '/admin/reviews',
      color: COLORS.star,
    },
    {
      icon: 'mail',
      title: 'Mensajes de Contacto',
      subtitle: 'Ver mensajes de usuarios',
      route: '/admin/messages',
      color: COLORS.success,
    },
    {
      icon: 'information-circle',
      title: 'Información de Contacto',
      subtitle: 'Editar datos de contacto del sitio',
      route: '/admin/contact-info',
      color: COLORS.warning,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Panel de Administrador</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.welcomeText}>━━ Gestión del Sistema ━━</Text>
        
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => router.push(item.route as any)}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color + '30' }]}>
              <Ionicons name={item.icon as any} size={28} color={item.color} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.neonRed} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.backgroundDark,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.neonRed,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.neonRed,
  },
  scrollContent: {
    padding: 16,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.neonRed,
    textAlign: 'center',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});