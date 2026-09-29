import React, { useState } from 'react';
// Tambahkan Image di sini
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { IconButton, Button } from '../components/Button';
import { Card } from '../components/Card';

export default function Detail() {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState('Blue');

  const colors = [
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Black', hex: '#1E293B' },
    { name: 'Silver', hex: '#94A3B8' },
  ];

  const specs = [
    { label: 'Brand', value: 'Samsung' },
    { label: 'Model', value: 'Galaxy S24 Ultra' },
    { label: 'Processor', value: 'Snapdragon 8 Gen 3' },
    { label: 'RAM', value: '12 GB' },
    { label: 'ROM / Storage', value: '256 GB' },
    { label: 'Layar', value: '6.8 inch Dynamic AMOLED 2X' },
    { label: 'Kamera Utama', value: '200 MP + 50 MP + 12 MP + 10 MP' },
    { label: 'Baterai', value: '5000 mAh (Fast Charging 45W)' },
    { label: 'Sistem Operasi', value: 'Android 14, One UI 6.1' },
  ];

  return (
    <View className="flex-1 bg-surface pt-12">
      {/* Top App Bar */}
      <View className="flex-row items-center px-4 mb-4">
        <IconButton icon="arrow-back" size="m" onPress={() => router.back()} className="mr-2" />
        <View className="flex-1 items-end">
          <IconButton icon="share" size="s" />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, gap: 20 }} className="mx-4">

        {/* Card Produk - Diakalin dengan menghapus imageUri dan memakai Image murni */}
        <Card
          mode="filled"
          className="h-[260px] rounded-[10px] overflow-hidden bg-white relative border border-blue-500"
        >
          {/* GAMBAR: Tambahkan bottom: 0 agar benar-benar ditarik pas ke tepi bawah */}
          <Image
            source={{ uri: "https://i.pinimg.com/736x/ec/af/f5/ecaff525c3f4e996bb93563082a7bc67.jpg" }}
            style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '33.33%', height: '100%' }}
            resizeMode="cover"
          />

          {/* KONTEN TEKS: Diberi marginLeft 33.33% agar mulai setelah gambar, dan lebarnya 66.67% (2/3) */}
          <View style={{ marginLeft: '33.33%', width: '66.67%' }} className="h-full p-3 justify-between pr-4">
            <View>
              <Text className="text-xs text-outline font-semibold tracking-wider uppercase">
                Brand Name
              </Text>
              <Text className="text-lg text-onSurface font-bold mt-0.5" numberOfLines={1}>
                Product Name Ultra
              </Text>

              <View className="flex-row items-center mt-2 gap-2">
                <View className="py-0.5 rounded">
                  <Text className="text-xs text-onSurfaceVariant font-medium">12GB/256GB</Text>
                </View>
              </View>

              {/* Select Color (3 Warna) */}
              <View className="mt-3">
                <Text className="text-xs text-outline mb-1.5 font-medium">Select Color:</Text>
                <View className="flex-row items-center gap-2">
                  {colors.map((c) => {
                    const isSelected = selectedColor === c.name;

                    return (
                      <TouchableOpacity
                        key={c.name}
                        onPress={() => setSelectedColor(c.name)}
                        // Wrapper menjadi pill (bg-slate-200) hanya saat dipilih
                        className={`flex-row items-center rounded-full ${isSelected ? 'bg-slate-200 p-1 pr-3' : 'p-1'
                          }`}
                      >
                        {/* Lingkaran Warna */}
                        <View
                          style={{ backgroundColor: c.hex }}
                          className={`w-6 h-6 rounded-full border-2 ${isSelected ? 'border-white' : 'border-transparent'
                            }`}
                        />

                        {/* LABEL NAMA WARNA */}
                        {isSelected && (
                          <Text className="text-sm font-bold text-slate-700 ml-1.5">
                            {c.name}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Tombol Sementara (Buy) */}
            <View className="w-[108px] mb-2">
              <Button title="Buy" icon="shopping-cart" mode="filled" size="s" />
            </View>
          </View>

          {/* Tombol Bookmark Sementara */}
          <View className="absolute top-3 right-3">
            <IconButton icon="bookmark-outline" mode="inlined" size="s" />
          </View>
        </Card>

        {/* Judul Detail Spek di luar/di atas Box */}
        <View className="mt-2">
          <Text className="text-lg text-onSurface font-bold mb-3">Detail Spek</Text>

          {/* Box Container Spek */}
          <View className="bg-surfaceContainerHigh rounded-[10px] p-3">
            {specs.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <View
                  key={index}
                  className={`flex-row justify-between items-center py-3 ${isEven ? 'bg-surfaceContainerHigh' : 'bg-blue-200'
                    }`}
                >
                  <Text className="text-sm font-medium text-blue-500 flex-1 p-2">{item.label}</Text>
                  <Text className="text-sm font-semibold text-onSurface flex-1 text-right p-2">
                    {item.value}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}