import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TopAppBar } from '../../components/TopAppBar';

// --- MOCK DATA PESANAN (UI ONLY) ---
const orders = [
  {
    id: 'INV-2024-001',
    status: 'success',
    date: '2 Okt 2024 • 09:15',
    name: 'iPhone 15 Pro 128GB',
    qty: 1,
    price: 'Rp 18.999.000',
    image: 'https://i.pinimg.com/736x/ec/af/f5/ecaff525c3f4e996bb93563082a7bc67.jpg',
  },
  {
    id: 'INV-2024-002',
    status: 'pending',
    date: '1 Okt 2024 • 20:42',
    name: 'Samsung Galaxy S24 256GB',
    qty: 1,
    price: 'Rp 14.500.000',
    image: 'https://i.pinimg.com/736x/ec/af/f5/ecaff525c3f4e996bb93563082a7bc67.jpg',
  },
  {
    id: 'INV-2024-003',
    status: 'success',
    date: '28 Sep 2024 • 14:05',
    name: 'Xiaomi Redmi Note 13 8/256GB',
    qty: 2,
    price: 'Rp 6.798.000',
    image: 'https://i.pinimg.com/736x/ec/af/f5/ecaff525c3f4e996bb93563082a7bc67.jpg',
  },
  {
    id: 'INV-2024-004',
    status: 'pending',
    date: '27 Sep 2024 • 11:30',
    name: 'Vivo V30 5G 12/512GB',
    qty: 1,
    price: 'Rp 4.999.000',
    image: 'https://i.pinimg.com/736x/ec/af/f5/ecaff525c3f4e996bb93563082a7bc67.jpg',
  },
];

// --- CHIP STATUS ---
function StatusChip({ status }) {
  const isPending = status === 'pending';

  return (
    <View
      className={`flex-row items-center rounded-full px-3 py-1 ${
        isPending ? 'bg-amber-100' : 'bg-green-100'
      }`}
    >
      <MaterialIcons
        name={isPending ? 'schedule' : 'check-circle'}
        size={14}
        color={isPending ? '#B26A00' : '#2E7D32'}
      />
      <Text
        className={`ml-1 text-xs font-semibold ${
          isPending ? 'text-amber-900' : 'text-green-800'
        }`}
      >
        {isPending ? 'Pending' : 'Success'}
      </Text>
    </View>
  );
}

// --- KARTU PESANAN ---
function OrderCard({ order }) {
  const isPending = order.status === 'pending';

  return (
    <View className="bg-surfaceContainerLow rounded-[20px] p-4 shadow-sm elevation-1">
      {/* Header: nomor pesanan + status */}
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-medium text-onSurfaceVariant">
          No. Pesanan {order.id}
        </Text>
        <StatusChip status={order.status} />
      </View>

      {/* Produk */}
      <View className="flex-row items-center mt-3">
        <Image
          source={{ uri: order.image }}
          className="w-16 h-16 rounded-[12px] bg-surfaceContainerHighest object-cover"
        />
        <View className="flex-1 ml-3">
          <Text className="text-sm font-bold text-onSurface" numberOfLines={1}>
            {order.name}
          </Text>
          <Text className="text-xs text-onSurfaceVariant mt-0.5">
            {order.qty} unit
          </Text>
        </View>
        <Text className="text-sm font-bold text-primary">{order.price}</Text>
      </View>

      {/* Footer: waktu + aksi */}
      <View className="flex-row items-center justify-between border-t border-outlineVariant pt-3 mt-3">
        <View className="flex-row items-center">
          <MaterialIcons name="schedule" size={14} color="#80756C" />
          <Text className="text-xs text-onSurfaceVariant ml-1">{order.date}</Text>
        </View>

        {isPending ? (
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.8}
            className="bg-primary rounded-full h-10 px-5 items-center justify-center"
          >
            <Text className="text-white text-xs font-bold">Bayar Sekarang</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.8}
            className="border border-outline rounded-full h-10 px-5 items-center justify-center"
          >
            <Text className="text-primary text-xs font-bold">Beli Lagi</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function History() {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Pending', 'Success'];

  const filteredOrders =
    activeTab === 'All'
      ? orders
      : orders.filter((o) => o.status === activeTab.toLowerCase());

  return (
    <View className="flex-1 bg-surface">
      <TopAppBar title="History" />

      <View className="flex-row h-[48px] border-b border-outlineVariant">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className="flex-1 items-center justify-center relative"
          >
            <Text
              className={`text-sm font-medium ${
                activeTab === tab ? 'text-primary' : 'text-onSurfaceVariant'
              }`}
            >
              {tab}
            </Text>
            {activeTab === tab && (
              <View className="absolute bottom-0 w-16 h-[3px] bg-primary rounded-t-full" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {filteredOrders.length === 0 ? (
          <View className="items-center py-20">
            <MaterialIcons name="receipt-long" size={48} color="#90CAF9" />
            <Text className="mt-3 text-sm text-onSurfaceVariant">
              Belum ada pesanan
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </ScrollView>
    </View>
  );
}
