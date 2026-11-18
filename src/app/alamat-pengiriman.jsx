import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../components/TopAppBar';
import { useThemeMode } from '../store/theme-store';
import { useAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress, detectCurrentLocationAddress, getPendingMapLocation } from '../store/address';

export default function AlamatPengirimanScreen() {
  const router = useRouter();
  const isDark = useThemeMode();
  const addresses = useAddresses();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    label: 'Rumah',
    detail: '',
    isDefault: false,
  });

  useEffect(() => {
    const pending = getPendingMapLocation();
    if (pending) {
      setFormData(prev => ({
        ...prev,
        detail: pending.detail,
        label: pending.label || prev.label,
      }));
      setShowAddModal(true);
    }
  }, []);

  useEffect(() => {
    if (editingAddress) {
      setFormData(prev => ({
        ...prev,
        name: editingAddress.name,
        phone: editingAddress.phone,
        label: editingAddress.label,
        detail: editingAddress.detail,
        isDefault: editingAddress.isDefault,
      }));
    } else {
      setFormData({ name: '', phone: '', label: 'Rumah', detail: '', isDefault: false });
    }
  }, [editingAddress]);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddModal(true);
  };

  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    setShowAddModal(true);
  };

  const handleDetectLocation = async () => {
    setDetectingLocation(true);
    try {
      const detected = await detectCurrentLocationAddress();
      setFormData(prev => ({
        ...prev,
        ...detected,
        name: prev.name || detected.name,
        phone: prev.phone || detected.phone,
      }));
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.detail.trim()) {
      Alert.alert('Error', 'Semua field wajib diisi');
      return;
    }

    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, formData);
      } else {
        await addAddress(formData);
      }
      setShowAddModal(false);
      setEditingAddress(null);
    } catch (e) {
      Alert.alert('Error', 'Gagal menyimpan alamat');
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Hapus Alamat',
      'Yakin ingin menghapus alamat ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => deleteAddress(id) },
      ]
    );
  };

  const handleSetDefault = (id) => {
    setDefaultAddress(id);
  };

  const getLabels = ['Rumah', 'Kantor', 'Lainnya'];

  return (
    <View className="flex-1 bg-surface dark:bg-[#0F172A]">
      <TopAppBar title="Alamat Pengiriman" leftIcon="arrow-back" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        {addresses.length === 0 ? (
          <View className="bg-white dark:bg-[#1E293B] p-6 rounded-[20px] border border-outlineVariant dark:border-[#334155] items-center">
            <MaterialIcons name="location-off" size={48} color="#80756C" />
            <Text className="text-md font-bold text-onSurface dark:text-[#E3F2FD] mt-4">Belum Ada Alamat</Text>
            <Text className="text-sm text-outline dark:text-[#90CAF9] mt-2 text-center px-4">
              Tambahkan alamat pengiriman agar checkout lebih cepat dan mudah
            </Text>
            <TouchableOpacity
              onPress={handleAddAddress}
              activeOpacity={0.8}
              className="bg-primary px-6 py-3 rounded-[16px] mt-6"
            >
              <Text className="text-white font-bold text-sm">Tambah Alamat Pertama</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="gap-3">
            {addresses.map((addr) => (
              <TouchableOpacity
                key={addr.id}
                activeOpacity={0.7}
                className={`bg-white dark:bg-[#1E293B] p-4 rounded-[20px] border ${addr.isDefault ? 'border-primary bg-primary/5' : 'border-outlineVariant dark:border-[#334155]'}`}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 mr-3">
                    <View className="flex-row items-center gap-2 mb-1 flex-wrap">
                      <Text className="font-bold text-base text-onSurface dark:text-[#E3F2FD]">{addr.name}</Text>
                      <Text className="text-sm text-outline dark:text-[#90CAF9]">({addr.phone})</Text>
                      <View className={`px-2 py-0.5 rounded ${addr.isDefault ? 'bg-primary' : 'bg-surfaceContainerHigh'}`}>
                        <Text className={`text-[11px] font-bold ${addr.isDefault ? 'text-white' : 'text-outline'}`}>{addr.label}</Text>
                      </View>
                      {addr.isDefault && (
                        <View className="bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded">
                          <Text className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">Utama</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-sm text-onSurfaceVariant dark:text-[#90CAF9] leading-5" numberOfLines={3}>
                      {addr.detail}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    {!addr.isDefault && (
                      <TouchableOpacity
                        onPress={() => handleSetDefault(addr.id)}
                        activeOpacity={0.7}
                        className="p-2"
                      >
                        <MaterialIcons name="star-border" size={22} color="#2196F3" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => handleEditAddress(addr)}
                      activeOpacity={0.7}
                      className="p-2"
                    >
                      <MaterialIcons name="edit" size={22} color="#2196F3" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(addr.id)}
                      activeOpacity={0.7}
                      className="p-2"
                    >
                      <MaterialIcons name="delete" size={22} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={handleAddAddress}
          activeOpacity={0.8}
          className="bg-primary px-6 py-3.5 rounded-[16px] items-center justify-center mt-4 shadow-md"
        >
          <MaterialIcons name="add" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text className="text-white font-bold text-base">Tambah Alamat Baru</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <Pressable className="flex-1 justify-end bg-black/50" onPress={() => { if (!editingAddress) setShowAddModal(false); }}>
          <Pressable className="bg-surface dark:bg-[#0F172A] rounded-t-[24px] p-6 gap-4 max-h-[85%]">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-onSurface dark:text-[#E3F2FD]">
                {editingAddress ? 'Edit Alamat' : 'Tambah Alamat Baru'}
              </Text>
              <TouchableOpacity onPress={() => { setShowAddModal(false); setEditingAddress(null); }} activeOpacity={0.8}>
                <MaterialIcons name="close" size={28} color={isDark ? '#E3F2FD' : '#64748B'} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ gap: 4 }}>
              <View>
                <Text className="text-sm font-bold text-onSurface dark:text-[#E3F2FD] mb-1">Nama Penerima *</Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(v) => setFormData(prev => ({ ...prev, name: v }))}
                  placeholder="Nama lengkap penerima"
                  className="bg-surfaceContainerLow dark:bg-[#1E293B] px-4 py-3 rounded-[12px] text-sm text-onSurface dark:text-[#E3F2FD] border border-outlineVariant dark:border-[#334155]"
                />
              </View>

              <View>
                <Text className="text-sm font-bold text-onSurface dark:text-[#E3F2FD] mb-1">Nomor Telepon *</Text>
                <TextInput
                  value={formData.phone}
                  onChangeText={(v) => setFormData(prev => ({ ...prev, phone: v }))}
                  placeholder="08xxxxxxxxxx"
                  keyboardType="phone-pad"
                  className="bg-surfaceContainerLow dark:bg-[#1E293B] px-4 py-3 rounded-[12px] text-sm text-onSurface dark:text-[#E3F2FD] border border-outlineVariant dark:border-[#334155]"
                />
              </View>

              <View>
                <Text className="text-sm font-bold text-onSurface dark:text-[#E3F2FD] mb-1">Label Alamat</Text>
                <View className="flex-row gap-2 flex-wrap">
                  {getLabels.map((label) => (
                    <TouchableOpacity
                      key={label}
                      onPress={() => setFormData(prev => ({ ...prev, label }))}
                      activeOpacity={0.7}
                      className={`px-4 py-2 rounded-full border ${formData.label === label ? 'border-primary bg-primary/10' : 'border-outlineVariant dark:border-[#334155] bg-surfaceContainerLow dark:bg-[#1E293B]'}`}
                    >
                      <Text className={`text-sm font-medium ${formData.label === label ? 'text-primary' : 'text-onSurfaceVariant dark:text-[#90CAF9]'}`}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text className="text-sm font-bold text-onSurface dark:text-[#E3F2FD] mb-1">Detail Alamat Lengkap *</Text>
                <TextInput
                  value={formData.detail}
                  onChangeText={(v) => setFormData(prev => ({ ...prev, detail: v }))}
                  placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Provinsi, Kode Pos"
                  multiline
                  numberOfLines={3}
                  className="bg-surfaceContainerLow dark:bg-[#1E293B] px-4 py-3 rounded-[12px] text-sm text-onSurface dark:text-[#E3F2FD] border border-outlineVariant dark:border-[#334155]"
                />
              </View>

              <TouchableOpacity
                onPress={handleDetectLocation}
                disabled={detectingLocation}
                activeOpacity={0.7}
                className="flex-row items-center justify-center gap-2 bg-surfaceContainerLow dark:bg-[#1E293B] px-4 py-3 rounded-[12px] border border-outlineVariant dark:border-[#334155]"
              >
                <MaterialIcons name={detectingLocation ? 'refresh' : 'my-location'} size={20} color="#2196F3" />
                <Text className="text-sm font-medium text-primary">{detectingLocation ? 'Mendeteksi Lokasi...' : 'Gunakan Lokasi Saat Ini (GPS)'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/pilih-lokasi-peta')}
                activeOpacity={0.7}
                className="flex-row items-center justify-center gap-2 bg-primary/10 px-4 py-3 rounded-[12px] border border-primary"
              >
                <MaterialIcons name="map" size={20} color="#2196F3" />
                <Text className="text-sm font-medium text-primary">Pilih Titik di Peta (Maps)</Text>
              </TouchableOpacity>

              <View className="flex-row items-center gap-2 mt-2">
                <TouchableOpacity
                  onPress={() => setFormData(prev => ({ ...prev, isDefault: !prev.isDefault }))}
                  activeOpacity={0.8}
                >
                  <View className={`w-5 h-5 rounded border-2 flex-center ${formData.isDefault ? 'bg-primary border-primary' : 'border-outlineVariant dark:border-[#334155]'}`}>
                    {formData.isDefault && <MaterialIcons name="check" size={14} color="#FFFFFF" />}
                  </View>
                </TouchableOpacity>
                <Text className="text-sm text-onSurface dark:text-[#E3F2FD]">Jadikan alamat utama</Text>
              </View>

              <View className="flex-row gap-3 mt-4">
                <TouchableOpacity
                  onPress={() => { setShowAddModal(false); setEditingAddress(null); }}
                  activeOpacity={0.8}
                  className="flex-1 border border-outlineVariant dark:border-[#334155] py-3 rounded-[12px] items-center justify-center"
                >
                  <Text className="text-sm font-bold text-onSurface dark:text-[#E3F2FD]">Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  activeOpacity={0.8}
                  className="flex-1 bg-primary py-3 rounded-[12px] items-center justify-center"
                >
                  <Text className="text-white font-bold text-sm">{editingAddress ? 'Simpan Perubahan' : 'Tambah Alamat'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}