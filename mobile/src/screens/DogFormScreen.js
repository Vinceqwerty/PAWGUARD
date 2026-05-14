import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { dogsAPI } from '../api';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';


export default function DogFormScreen({route}) {
    const navigation = useNavigation();
   const { dogId = null, dog: existingDog = null } = route.params ?? {};
  const isEdit = !!dogId;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    breed: '',
    age: '',
    weight: '',
    gender: 'male',
    size: 'medium',
    color: '',
    description: '',
    status: 'active',
    is_vaccinated: false,
    vaccination_date: '',
    microchip_id: '',
  });

  useEffect(() => {
    if (existingDog) {
      setForm({
        name: existingDog.name || '',
        breed: existingDog.breed || '',
        age: existingDog.age ? String(existingDog.age) : '',
        weight: existingDog.weight ? String(existingDog.weight) : '',
        gender: existingDog.gender || 'male',
        size: existingDog.size || 'medium',
        color: existingDog.color || '',
        description: existingDog.description || '',
        status: existingDog.status || 'active',
        is_vaccinated: existingDog.is_vaccinated || false,
        vaccination_date: existingDog.vaccination_date || '',
        microchip_id: existingDog.microchip_id || '',
      });
    } else if (dogId) {
      loadDog();
    }
  }, []);

  const loadDog = async () => {
    setLoading(true);
    try {
      const data = await dogsAPI.detail(dogId);
      setForm({
        name: data.name || '',
        breed: data.breed || '',
        age: data.age ? String(data.age) : '',
        weight: data.weight ? String(data.weight) : '',
        gender: data.gender || 'male',
        size: data.size || 'medium',
        color: data.color || '',
        description: data.description || '',
        status: data.status || 'active',
        is_vaccinated: data.is_vaccinated || false,
        vaccination_date: data.vaccination_date || '',
        microchip_id: data.microchip_id || '',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load dog details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.breed || !form.age || !form.weight || !form.color) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const payload = {
      ...form,
      age: parseInt(form.age),
      weight: parseFloat(form.weight),
    };

    setLoading(true);
    try {
      if (isEdit) {
        await dogsAPI.update(dogId, payload);
        Alert.alert('Success', 'Dog updated successfully');
      } else {
        await dogsAPI.create(payload);
        Alert.alert('Success', 'Dog added successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', isEdit ? 'Failed to update dog' : 'Failed to add dog');
    } finally {
      setLoading(false);
    }
  };

  const SelectField = ({ label, field, options }) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionsRow}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              form[field] === option.value && styles.optionButtonActive,
            ]}
            onPress={() => updateField(field, option.value)}
          >
            <Text
              style={[
                styles.optionText,
                form[field] === option.value && styles.optionTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (loading && !form.name) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={val => updateField('name', val)}
            placeholder="Enter dog's name"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Breed *</Text>
          <TextInput
            style={styles.input}
            value={form.breed}
            onChangeText={val => updateField('breed', val)}
            placeholder="e.g., Golden Retriever"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Age (months) *</Text>
            <TextInput
              style={styles.input}
              value={form.age}
              onChangeText={val => updateField('age', val)}
              keyboardType="numeric"
              placeholder="Months"
            />
          </View>
          <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Weight (kg) *</Text>
            <TextInput
              style={styles.input}
              value={form.weight}
              onChangeText={val => updateField('weight', val)}
              keyboardType="decimal-pad"
              placeholder="kg"
            />
          </View>
        </View>

        <SelectField
          label="Gender *"
          field="gender"
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
          ]}
        />

        <SelectField
          label="Size *"
          field="size"
          options={[
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
            { value: 'extra_large', label: 'Extra Large' },
          ]}
        />

        <SelectField
          label="Status *"
          field="status"
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'adopted', label: 'Adopted' },
            { value: 'lost', label: 'Lost' },
          ]}
        />

        <View style={styles.field}>
          <Text style={styles.label}>Color *</Text>
          <TextInput
            style={styles.input}
            value={form.color}
            onChangeText={val => updateField('color', val)}
            placeholder="e.g., Brown, Black, White"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Microchip ID</Text>
          <TextInput
            style={styles.input}
            value={form.microchip_id}
            onChangeText={val => updateField('microchip_id', val)}
            placeholder="Optional"
          />
        </View>

        <View style={styles.switchField}>
          <Text style={styles.label}>Vaccinated</Text>
          <Switch
            value={form.is_vaccinated}
            onValueChange={val => updateField('is_vaccinated', val)}
            trackColor={{ false: '#cbd5e1', true: '#2563eb' }}
          />
        </View>

        {form.is_vaccinated && (
          <View style={styles.field}>
            <Text style={styles.label}>Vaccination Date</Text>
            <TextInput
              style={styles.input}
              value={form.vaccination_date}
              onChangeText={val => updateField('vaccination_date', val)}
              placeholder="YYYY-MM-DD"
            />
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.description}
            onChangeText={val => updateField('description', val)}
            placeholder="Additional information about the dog..."
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isEdit ? 'Save Changes' : 'Add Dog'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
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
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1e293b',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  optionButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  optionText: {
    fontSize: 14,
    color: '#64748b',
  },
  optionTextActive: {
    color: '#fff',
  },
  switchField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
  },
});