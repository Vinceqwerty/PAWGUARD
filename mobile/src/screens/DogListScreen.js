import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { dogsAPI } from '../api';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function DogListScreen() {
    const navigation = useNavigation();
  const { user } = useAuth();
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchDogs = async (searchTerm = '') => {
    try {
      const params = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
      const data = await dogsAPI.list(params);
      setDogs(data.results || data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load dogs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDogs(search);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDogs(search);
  };

  const handleDelete = (dog) => {
    Alert.alert(
      'Delete Dog',
      `Are you sure you want to delete ${dog.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dogsAPI.delete(dog.id);
              fetchDogs(search);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete dog');
            }
          },
        },
      ]
    );
  };

  const canEdit = (dog) => user?.role === 'admin' || dog.owner === user?.id;
  const canAdd = user?.role !== 'event_manager';

  const renderDogCard = ({ item: dog }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DogDetail', { dogId: dog.id })}
    >
      <View style={styles.cardContent}>
        <View style={styles.dogInfo}>
          <Text style={styles.dogName}>{dog.name}</Text>
          <Text style={styles.dogBreed}>{dog.breed}</Text>
          <Text style={styles.dogDetails}>
            {dog.age_display} • {dog.weight} kg • {dog.gender}
          </Text>
          <View style={[styles.statusBadge, dog.status === 'active' ? styles.activeBadge : styles.inactiveBadge]}>
            <Text style={styles.statusText}>{dog.status}</Text>
          </View>
        </View>
        
        <View style={styles.actions}>
          {canEdit(dog) && (
            <>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('DogForm', { dogId: dog.id, dog })}
              >
                <Icon name="create-outline" size={22} color="#f59e0b" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(dog)}
              >
                <Icon name="trash-outline" size={22} color="#dc2626" />
              </TouchableOpacity>
            </>
          )}
          <Icon name="chevron-forward" size={20} color="#cbd5e1" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="paw-outline" size={64} color="#cbd5e1" />
      <Text style={styles.emptyTitle}>No dogs found</Text>
      <Text style={styles.emptyText}>
        {search ? 'Try a different search term' : 'Add your first dog to get started'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Icon name="search-outline" size={20} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, breed, or color..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
        {search !== '' && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Icon name="close-circle" size={20} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      {canAdd && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('DogForm', { dogId: null, dog: null })}
        >
          <Icon name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add New Dog</Text>
        </TouchableOpacity>
      )}

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={dogs}
          keyExtractor={(item) => item.id}
          renderItem={renderDogCard}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={EmptyList}
          contentContainerStyle={dogs.length === 0 ? styles.emptyList : styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1e293b',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  dogInfo: {
    flex: 1,
  },
  dogName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  dogBreed: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  dogDetails: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  activeBadge: {
    backgroundColor: '#dcfce7',
  },
  inactiveBadge: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editButton: {
    padding: 6,
  },
  deleteButton: {
    padding: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
});