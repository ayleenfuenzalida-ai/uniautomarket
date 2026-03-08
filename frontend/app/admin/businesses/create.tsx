import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { businessesAPI, categoriesAPI } from '../../../src/services/api';
import { COLORS } from '../../../src/utils/colors';

export default function CreateBusinessScreen() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      console.log('Categories loaded:', response.data.length);
      setCategories(response.data);
      if (response.data.length > 0) {
        const firstCategoryId = response.data[0].id;
        console.log('Setting default category:', firstCategoryId);
        setSelectedCategory(firstCategoryId);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    console.log('Category selected:', categoryId);
    setSelectedCategory(categoryId);
  };

  const handleSubmit = async () => {
    console.log('=== SUBMIT DEBUG ===');
    console.log('Name:', name);
    console.log('Selected Category ID:', selectedCategory);
    console.log('Description:', description);
    console.log('Address:', address);
    console.log('Owner Name:', ownerName);
    console.log('Owner Email:', ownerEmail);
    
    if (!name || !description || !address || !ownerName || !ownerEmail || !ownerPassword || !selectedCategory) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const businessData = {
        name: name.trim(),
        category_id: selectedCategory,
        description: description.trim(),
        address: address.trim(),
        phone: phone.trim(),
        email: email.trim(),
        images_base64: imageBase64 ? [imageBase64] : [],
        owner_name: ownerName.trim(),
        owner_email: ownerEmail.trim(),
        owner_password: ownerPassword,
      };
      
      console.log('Sending business data:', JSON.stringify(businessData, null, 2));
      const response = await businessesAPI.create(businessData);
      console.log('Business created successfully:', response.data);

      Alert.alert('Éxito', 'Negocio creado correctamente', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('Error creating business:', error);
      console.error('Error response:', error.response?.data);
      Alert.alert('Error', error.response?.data?.detail || 'Error al crear negocio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Negocio</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Business Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>━━ Información del Negocio ━━</Text>

            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del negocio"
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Categoría * (Selecciona solo una)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((category: any) => {
                const isSelected = selectedCategory === category.id;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryChip,
                      isSelected && styles.categoryChipSelected,
                    ]}
                    onPress={() => handleCategorySelect(category.id)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        isSelected && styles.categoryChipTextSelected,
                      ]}
                    >
                      {category.name}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={16} color={COLORS.textPrimary} style={{ marginLeft: 4 }} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.label}>Descripción *</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Descripción del negocio"
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Text style={styles.label}>Dirección *</Text>
            <TextInput
              style={styles.input}
              placeholder="Dirección completa"
              placeholderTextColor={COLORS.textMuted}
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              placeholder="+56 9 1234 5678"
              placeholderTextColor={COLORS.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="email@negocio.cl"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Imagen</Text>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              {imageBase64 ? (
                <Image source={{ uri: imageBase64 }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image" size={48} color={COLORS.neonRed} />
                  <Text style={styles.imagePlaceholderText}>Seleccionar imagen</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Owner Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>━━ Información del Dueño ━━</Text>

            <Text style={styles.label}>Nombre completo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del dueño"
              placeholderTextColor={COLORS.textMuted}
              value={ownerName}
              onChangeText={setOwnerName}
            />

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="email@dueno.cl"
              placeholderTextColor={COLORS.textMuted}
              value={ownerEmail}
              onChangeText={setOwnerEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Contraseña *</Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña para el usuario"
              placeholderTextColor={COLORS.textMuted}
              value={ownerPassword}
              onChangeText={setOwnerPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.textPrimary} />
            ) : (
              <>
                <Ionicons name="add-circle" size={24} color={COLORS.textPrimary} />
                <Text style={styles.buttonText}>  Crear Negocio</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.neonRed,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    minHeight: 100,
    marginBottom: 8,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryChip: {
    backgroundColor: COLORS.backgroundCard,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.neonRed,
    borderColor: COLORS.neonRed,
  },
  categoryChipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  categoryChipTextSelected: {
    color: COLORS.textPrimary,
  },
  imageButton: {
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.neonRed,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.neonRed,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
