import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { dogsAPI } from '../api';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; 

export default function DashboardScreen() {
  const { user, refreshUser, logout } = useAuth(); // ← Added logout
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const loadStats = async () => {
    try {
      const data = await dogsAPI.dashboard();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadStats(), refreshUser()]);
    setRefreshing(false);
  };

  // ✅ Logout function
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Login'); // Navigate back to login screen
          }
        },
      ]
    );
  };

  const StatCard = ({ icon, title, value, color = '#2563eb' }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Icon name={icon} size={32} color={color} />
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{value ?? 0}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.welcomeSection}>
        {/* ✅ Logout button in top right corner */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>{user?.first_name} {user?.last_name}!</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {user?.role?.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🐕 Dog Statistics</Text>
        <View style={styles.statsGrid}>
          <StatCard icon="paw-outline" title="Total Dogs" value={stats?.dogs?.total} color="#2563eb" />
          <StatCard icon="heart-outline" title="Active" value={stats?.dogs?.active} color="#16a34a" />
          <StatCard icon="medkit-outline" title="Vaccinated" value={stats?.dogs?.vaccinated} color="#0891b2" />
        </View>
      </View>

      {stats?.users && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 User Statistics</Text>
          <View style={styles.statsGrid}>
            <StatCard icon="people-outline" title="Total Users" value={stats.users.total} color="#7c3aed" />
            <StatCard icon="person-outline" title="Dog Owners" value={stats.users.dog_owners} color="#7c3aed" />
            <StatCard icon="calendar-outline" title="Event Managers" value={stats.users.event_managers} color="#b45309" />
            <StatCard icon="shield-checkmark-outline" title="Admins" value={stats.users.admins} color="#dc2626" />
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.quickAction}
        onPress={() => navigation.navigate('Dogs', { screen: 'DogList' })}
      >
        <Icon name="paw" size={24} color="#fff" />
        <Text style={styles.quickActionText}>View All Dogs</Text>
        <Icon name="arrow-forward" size={20} color="#fff" style={styles.quickActionArrow} />
      </TouchableOpacity>
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
  welcomeSection: {
    backgroundColor: '#1e3a5f',
    padding: 24,
    paddingTop: 48,
    paddingBottom: 32,
    position: 'relative',
  },
  // ✅ Logout button styles
  logoutButton: {
    position: 'absolute',
    top: 48,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 20,
    zIndex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statInfo: {
    marginLeft: 12,
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  statTitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  quickActionText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  quickActionArrow: {
    opacity: 0.8,
  },
});