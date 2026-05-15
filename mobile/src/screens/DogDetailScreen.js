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
import { useAuth } from '../context/AuthContext';
import { dogsAPI } from '../api';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';


export default function DogDetailScreen({route}) {
    
  const navigation = useNavigation();
  const { dogId = null, dog: existingDog = null } = route.params ?? {};
  const { user } = useAuth();
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDog();
  }, [dogId]);

  const loadDog = async () => {
    try {
      const data = await dogsAPI.detail(dogId);
      setDog(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load dog details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Dog',
      `Are you sure you want to delete ${dog?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dogsAPI.delete(dogId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete dog');
            }
          },
        },
      ]
    );
  };

  const canEdit = user?.role === 'admin' || dog?.owner === user?.id;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!dog) {
    return (
      <View style={styles.centerContainer}>
        <Text>Dog not found</Text>
      </View>
    );
  }

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <Icon name={icon} size={20} color="#64748b" style={styles.infoIcon} />
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value || '—'}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Text style={styles.dogName}>{dog.name}</Text>
          <View style={[styles.statusBadge, dog.status === 'active' ? styles.activeBadge : styles.inactiveBadge]}>
            <Text style={styles.statusText}>{dog.status}</Text>
          </View>
        </View>
        <Text style={styles.breed}>{dog.breed}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <InfoRow icon="calendar-outline" label="Age" value={dog.age_display} />
        <InfoRow icon="scale-outline" label="Weight" value={`${dog.weight} kg`} />
        <InfoRow icon="transgender-outline" label="Gender" value={dog.gender} />
        <InfoRow icon="resize-outline" label="Size" value={dog.size} />
        <InfoRow icon="color-palette-outline" label="Color" value={dog.color} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Information</Text>
        <InfoRow 
          icon="medkit-outline" 
          label="Vaccinated" 
          value={dog.is_vaccinated ? 'Yes' : 'No'} 
        />
        {dog.is_vaccinated && dog.vaccination_date && (
          <InfoRow icon="calendar-outline" label="Vaccination Date" value={dog.vaccination_date} />
        )}
        <InfoRow icon="id-card-outline" label="Microchip ID" value={dog.microchip_id || '—'} />
      </View>

      {dog.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{dog.description}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ownership</Text>
        <InfoRow icon="person-outline" label="Owner" value={dog.owner_name} />
        <InfoRow icon="time-outline" label="Added" value={new Date(dog.created_at).toLocaleDateString()} />
        <InfoRow icon="refresh-outline" label="Last Updated" value={new Date(dog.updated_at).toLocaleDateString()} />
      </View>

      {canEdit && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => navigation.navigate('DogForm', { dogId: dog.id, dog })}
          >
            <Icon name="create-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Edit Dog</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Icon name="trash-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Delete Dog</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#1e3a5f',
    padding: 24,
    paddingTop: 40,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dogName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  breed: {
    fontSize: 16,
    color: '#94a3b8',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeBadge: {
    backgroundColor: '#16a34a',
  },
  inactiveBadge: {
    backgroundColor: '#dc2626',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoIcon: {
    width: 24,
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    width: 120,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    margin: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  editButton: {
    backgroundColor: '#f59e0b',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});