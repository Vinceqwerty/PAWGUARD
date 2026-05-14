import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { authAPI } from '../api';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
    const navigation = useNavigation();
  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
    role: 'dog_owner',
    phone_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.first_name || !form.last_name || !form.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (form.password !== form.password2) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (form.password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await authAPI.register(form);
      Alert.alert(
        'Success',
        'Account created! Please check your email to verify your account before logging in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      let errorMessage = 'Registration failed';
      if (typeof error === 'object') {
        const firstError = Object.values(error)[0];
        if (Array.isArray(firstError)) {
          errorMessage = firstError[0];
        } else if (typeof firstError === 'string') {
          errorMessage = firstError;
        }
      }
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Icon name="person-outline" size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Username *"
            placeholderTextColor="#94a3b8"
            value={form.username}
            onChangeText={val => updateField('username', val)}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="mail-outline" size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email *"
            placeholderTextColor="#94a3b8"
            value={form.email}
            onChangeText={val => updateField('email', val)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <TextInput
              style={styles.input}
              placeholder="First Name *"
              placeholderTextColor="#94a3b8"
              value={form.first_name}
              onChangeText={val => updateField('first_name', val)}
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 12 }]}>
            <TextInput
              style={styles.input}
              placeholder="Last Name *"
              placeholderTextColor="#94a3b8"
              value={form.last_name}
              onChangeText={val => updateField('last_name', val)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Icon name="call-outline" size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number (optional)"
            placeholderTextColor="#94a3b8"
            value={form.phone_number}
            onChangeText={val => updateField('phone_number', val)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Password * (min 8 chars)"
            placeholderTextColor="#94a3b8"
            value={form.password}
            onChangeText={val => updateField('password', val)}
            secureTextEntry={!showPassword}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Confirm Password *"
            placeholderTextColor="#94a3b8"
            value={form.password2}
            onChangeText={val => updateField('password2', val)}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Icon name="briefcase-outline" size={20} color="#64748b" style={styles.inputIcon} />
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleOption, form.role === 'dog_owner' && styles.roleOptionActive]}
              onPress={() => updateField('role', 'dog_owner')}
            >
              <Text style={[styles.roleText, form.role === 'dog_owner' && styles.roleTextActive]}>
                Dog Owner
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleOption, form.role === 'event_manager' && styles.roleOptionActive]}
              onPress={() => updateField('role', 'event_manager')}
            >
              <Text style={[styles.roleText, form.role === 'event_manager' && styles.roleTextActive]}>
                Event Manager
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.registerButton, loading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
          <Text style={styles.backLinkText}>← Back to Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 24,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  roleContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  roleOptionActive: {
    backgroundColor: '#2563eb',
  },
  roleText: {
    fontSize: 14,
    color: '#64748b',
  },
  roleTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backLinkText: {
    color: '#64748b',
    fontSize: 14,
  },
});