import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { adminAPI } from '../api';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await adminAPI.list();
      setUsers(data.results || data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleRoleChange = async (userId, currentRole) => {
    const roles = ['admin', 'dog_owner', 'event_manager'];
    const currentIndex = roles.indexOf(currentRole);
    const nextRole = roles[(currentIndex + 1) % roles.length];
    
    Alert.alert(
      'Change Role',
      `Change user role to ${nextRole.replace('_', ' ')}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          onPress: async () => {
            try {
              await adminAPI.update(userId, { role: nextRole });
              fetchUsers();
            } catch (error) {
              Alert.alert('Error', 'Failed to update role');
            }
          },
        },
      ]
    );
  };

  const handleToggleActive = async (user) => {
    Alert.alert(
      user.is_active ? 'Deactivate User' : 'Activate User',
      `${user.is_active ? 'Deactivate' : 'Activate'} ${user.full_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await adminAPI.update(user.id, { is_active: !user.is_active });
              fetchUsers();
            } catch (error) {
              Alert.alert('Error', 'Failed to update user status');
            }
          },
        },
      ]
    );
  };

  const handleDelete = async (user) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.full_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminAPI.delete(user.id);
              fetchUsers();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const renderUserCard = ({ item: user }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.userName}>{user.full_name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <View style={[styles.verifiedBadge, user.is_email_verified && styles.verifiedBadgeActive]}>
          <Icon name={user.is_email_verified ? 'checkmark-circle' : 'close-circle'} size={16} color={user.is_email_verified ? '#16a34a' : '#dc2626'} />
          <Text style={[styles.verifiedText, user.is_email_verified && styles.verifiedTextActive]}>
            {user.is_email_verified ? 'Verified' : 'Unverified'}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Icon name="briefcase-outline" size={18} color="#64748b" />
          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => handleRoleChange(user.id, user.role)}
          >
            <Text style={styles.roleText}>
              Role: {user.role.replace('_', ' ')}
            </Text>
            <Icon name="chevron-down" size={16} color="#64748b" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Icon name="calendar-outline" size={18} color="#64748b" />
          <Text style={styles.infoText}>
            Joined: {new Date(user.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, user.is_active ? styles.deactivateButton : styles.activateButton]}
          onPress={() => handleToggleActive(user)}
        >
          <Icon name={user.is_active ? 'ban-outline' : 'checkmark-circle-outline'} size={18} color="#fff" />
          <Text style={styles.actionButtonText}>
            {user.is_active ? 'Deactivate' : 'Activate'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteActionButton]}
          onPress={() => handleDelete(user)}
        >
          <Icon name="trash-outline" size={18} color="#fff" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={renderUserCard}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text>No users found</Text>
        </View>
      }
    />
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
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#64748b',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verifiedBadgeActive: {
    backgroundColor: '#dcfce7',
  },
  verifiedText: {
    fontSize: 11,
    color: '#64748b',
  },
  verifiedTextActive: {
    color: '#16a34a',
  },
  cardBody: {
    padding: 16,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roleText: {
    fontSize: 14,
    color: '#2563eb',
  },
  infoText: {
    fontSize: 14,
    color: '#475569',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  deactivateButton: {
    backgroundColor: '#fee2e2',
  },
  activateButton: {
    backgroundColor: '#dcfce7',
  },
  deleteActionButton: {
    backgroundColor: '#fee2e2',
    borderLeftWidth: 1,
    borderLeftColor: '#f1f5f9',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#dc2626',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
});