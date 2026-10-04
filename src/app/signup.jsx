import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../components/TopAppBar';
import { Button } from '../components/Button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SignUp() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState(false);

  // Validasi password:
  // - Panjang 1-8 karakter
  // - Karakter pertama (teks depan) harus huruf kapital
  // - Harus kombinasi huruf dan angka
  const validatePassword = (value) => {
    if (value.length < 1 || value.length > 8) {
      return 'Password harus 1-8 karakter.';
    }
    if (!/^[A-Z]/.test(value)) {
      return 'Karakter pertama harus huruf kapital (A-Z).';
    }
    if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
      return 'Password harus kombinasi huruf dan angka.';
    }
    return '';
  };

  // Tingkat keamanan password: skor 0-4 (lemah -> kuat)
  // Dihitung dari panjang, huruf kapital, huruf kecil, angka, dan simbol.
  const getPasswordStrength = (value) => {
    if (!value) return { score: 0, label: '', color: 'transparent' };

    let score = 0;
    if (value.length >= 6) score += 1;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[a-z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;

    // Normalisasi ke rentang 1-4
    const level = Math.min(4, Math.max(1, Math.ceil((score / 6) * 4)));

    const levels = {
      1: { label: 'Lemah', color: '#B3261E' },
      2: { label: 'Sedang', color: '#F2994A' },
      3: { label: 'Kuat', color: '#8BC34A' },
      4: { label: 'Sangat Kuat', color: '#2E7D32' },
    };

    return { score: level, ...levels[level] };
  };

  const strength = getPasswordStrength(password);

  const passwordError = validatePassword(password);
  const isPasswordValid = passwordError === '' && password.length > 0;
  const canSubmit = isPasswordValid && isChecked;

  return (
    <View className="flex-1 bg-surface">
      <TopAppBar
        title="Sign Up"
        leftIcon="arrow-back"
        onLeftPress={() => router.back()}
      />

      <TouchableOpacity className="absolute top-[28px] right-4" onPress={() => router.push('/login')}>
        <Text className="text-xl mt-7 text-primary font-medium">Login</Text>
      </TouchableOpacity>

      <View className="p-4 mt-8 flex-1 items-center">
        {/* INPUT NAME / USERNAME */}
        <View className="w-full mb-6">
          <Text className="text-xl font-medium text-black m-2">Name atau Username</Text>
          <View className="flex-row items-center border border-outline rounded-full h-[56px] px-4 bg-surface">
            <MaterialIcons name="person" size={24} color="#4F453D" style={{ marginRight: 12 }} />
            <TextInput
              className="flex-1 text-base text-onSurface"
              placeholder="Masukkan Nama atau Username"
              placeholderTextColor="#79747E"
            />
          </View>
        </View>

        {/* INPUT NOMOR SELULER */}
        <View className="w-full mb-6">
          <Text className="text-xl font-medium text-black m-2">Nomor Seluler</Text>
          <View className="flex-row items-center border border-outline rounded-full h-[56px] px-4 bg-surface">
            <MaterialIcons name="numbers" size={24} color="#4F453D" style={{ marginRight: 12 }} />
            <TextInput
              className="flex-1 text-base text-onSurface"
              placeholder="Masukkan Nomor Seluler"
              placeholderTextColor="#79747E"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* INPUT EMAIL */}
        <View className="w-full mb-6">
          <Text className="text-xl font-medium text-black m-2">Email</Text>
          <View className="flex-row items-center border border-outline rounded-full h-[56px] px-4 bg-surface">
            <MaterialIcons name="mail" size={24} color="#4F453D" style={{ marginRight: 12 }} />
            <TextInput
              className="flex-1 text-base text-onSurface"
              placeholder="Masukkan Email"
              placeholderTextColor="#79747E"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* INPUT PASSWORD */}
        <View className="w-full mb-4">
          <Text className="text-xl font-medium text-black m-2">Password</Text>
          <View
            className={`flex-row items-center border rounded-full h-[56px] px-4 bg-surface ${touched && passwordError ? 'border-error' : 'border-outline'}`}
          >
            <MaterialIcons name="vpn-key" size={24} color="#4F453D" style={{ marginRight: 12 }} />
            <TextInput
              secureTextEntry={!showPassword}
              className="flex-1 text-base text-onSurface"
              placeholder="Masukkan Password"
              placeholderTextColor="#79747E"
              value={password}
              onChangeText={setPassword}
              onBlur={() => setTouched(true)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={22}
                color="#4F453D"
              />
            </TouchableOpacity>
          </View>
          {touched && !!passwordError && (
            <Text className="text-xs text-error m-2">{passwordError}</Text>
          )}

          {/* INDIKATOR TINGKAT KEAMANAN PASSWORD */}
          {password.length > 0 && (
            <View className="mt-2 px-2">
              <View className="flex-row gap-1">
                {[1, 2, 3, 4].map((seg) => (
                  <View
                    key={seg}
                    className="flex-1 h-[6px] rounded-full"
                    style={{
                      backgroundColor: seg <= strength.score ? strength.color : '#E0E0E0',
                      marginRight: seg < 4 ? 4 : 0,
                    }}
                  />
                ))}
              </View>
              <Text className="text-xs font-medium mt-1" style={{ color: strength.color }}>
                Keamanan password: {strength.label}
              </Text>
            </View>
          )}

          <Text className="text-xs text-onSurfaceVariant m-2">
            Ketentuan: 1-8 karakter, huruf depan kapital, dan kombinasi huruf & angka.
          </Text>
        </View>

        {/* CHECKBOX I AGREE */}
        <View className="w-full mb-6 flex-row items-center px-2">
          <TouchableOpacity
            onPress={() => setIsChecked(!isChecked)}
            className={`w-[18px] h-[18px] border-2 rounded-[2px] items-center justify-center mr-2 ${isChecked ? 'bg-primary border-primary' : 'border-onSurfaceVariant'}`}
          >
            {isChecked && <MaterialIcons name="check" size={14} color="#FFFFFF" />}
          </TouchableOpacity>
          <Text className="text-base text-onSurface">I agree</Text>
        </View>

        {/* TOMBOL SIGN UP */}
        <Button
          title="Sign Up"
          icon="login"
          mode="filled"
          className={`w-full mb-2 ${canSubmit ? '' : 'opacity-50'}`}
          disabled={!canSubmit}
          onPress={() => router.push('/login')}
        />

        <Text className="text-base text-onSurface mb-2">Or</Text>

        {/* TOMBOL GOOGLE DENGAN IKON FONTAWESOME BERWARNA */}
        <TouchableOpacity
          className="w-full flex-row items-center justify-center border border-outline rounded-full h-[48px] bg-surface"
          onPress={() => router.push('/overview')}
          activeOpacity={0.8}
        >
          <FontAwesome name="google" size={18} color="#EA4335" style={{ marginRight: 8 }} />
          <Text className="text-onSurface font-medium text-base">Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}