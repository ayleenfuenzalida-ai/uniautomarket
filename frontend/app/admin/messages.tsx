import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { contactAPI } from '../../src/services/api';

export default function ManageMessagesScreen() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await contactAPI.getMessages();
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRead = async (messageId: string, currentRead: boolean) => {
    try {
      await contactAPI.markRead(messageId, !currentRead);
      await loadMessages();
    } catch (error) {
      console.error('Error toggling read status:', error);
    }
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
        <Text style={styles.headerTitle}>Mensajes de Contacto</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {messages.map((message: any) => (
          <TouchableOpacity
            key={message.id}
            style={[styles.messageCard, message.read && styles.messageRead]}
            onPress={() => toggleRead(message.id, message.read)}
          >
            <View style={styles.messageHeader}>
              <Text style={styles.senderName}>{message.name}</Text>
              {!message.read && <View style={styles.unreadBadge} />}
            </View>
            <Text style={styles.senderEmail}>{message.email}</Text>
            {message.phone && <Text style={styles.senderPhone}>{message.phone}</Text>}
            <Text style={styles.messageText} numberOfLines={3}>
              {message.message}
            </Text>
            <Text style={styles.messageDate}>
              {new Date(message.created_at).toLocaleDateString('es-CL')}
            </Text>
          </TouchableOpacity>
        ))}
        {messages.length === 0 && (
          <Text style={styles.emptyText}>No hay mensajes</Text>
        )}
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
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  messageRead: {
    backgroundColor: '#f9f9f9',
    borderLeftColor: '#ccc',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  senderEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  senderPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  messageDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    paddingVertical: 32,
  },
});