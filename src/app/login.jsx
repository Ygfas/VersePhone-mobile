import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { TopAppBar } from "../components/TopAppBar";
import { Button } from "../components/Button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useThemeMode } from "../store/theme-store";
import { useTranslatedText } from "../store/language-store";
import {
  useAuth,
  login,
  loginWithGoogle,
  checkSession,
} from "../store/auth";
import Constants from "expo-constants";

export default function Login() {
  const isDark = useThemeMode();
  const router = useRouter();
  const { user, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tLogin = useTranslatedText("Login");
  const tSignUp = useTranslatedText("Sign Up");
  const tNameOrUsername = useTranslatedText("Name atau Username");
  const tEnterNameOrUsername = useTranslatedText("Masukkan Nama atau Username");
  const tPassword = useTranslatedText("Password");
  const tEnterPassword = useTranslatedText("Masukkan Password");
  const tLoginSuggestion = useTranslatedText(
    "Gunakan akun terdaftar atau pastikan data Anda sudah benar sebelum masuk."
  );
  const tOr = useTranslatedText("Or");
  const tGoogle = useTranslatedText("Google");
  const tLoggingIn = useTranslatedText("Masuk...");
  const tLoginFailed = useTranslatedText("Login gagal");
  const tFillAllFields = useTranslatedText("Semua field wajib diisi");

  // Cek session saat pertama load
  useEffect(() => {
    checkSession();
  }, []);

  // Konfigurasi Google Sign-In
  useEffect(() => {
    // Diurus oleh expo-auth-session di store/auth.js
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert(tLoginFailed, tFillAllFields);
      return;
    }

    setIsSubmitting(true);
    const result = await login(username.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      // Redirect berdasarkan role
      if (result.role === "admin") {
        router.replace("/overview");
      } else {
        router.replace("/");
      }
    } else {
      Alert.alert(tLoginFailed, result.error);
    }
  };

  const handleGoogleSignIn = async () => {
      setIsSubmitting(true);
      try {
        const result = await loginWithGoogle();
        if (result.success) {
          if (result.role === "admin") {
            router.replace("/overview");
          } else {
            router.replace("/");
          }
        } else {
          Alert.alert(tLoginFailed, result.error);
        }
      } catch (error) {
        Alert.alert(tLoginFailed, error.message || "Gagal login dengan Google");
      } finally {
        setIsSubmitting(false);
      }
    };

  // Loading state awal (checkSession)
  if (isLoading && user === null) {
    return (
      <View className="flex-1 bg-surface dark:bg-[#0F172A] items-center justify-center">
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface dark:bg-[#0F172A]">
      <TopAppBar title={tLogin} leftIcon="arrow-back" onLeftPress={() => router.back()} />

      <TouchableOpacity className="absolute top-[28px] right-4" onPress={() => router.push("/signup")}>
        <Text className="text-xl mt-7 text-primary dark:text-[#90CAF9] font-medium">{tSignUp}</Text>
      </TouchableOpacity>

      <View className="p-4 mt-8 flex-1 items-center">
        {/* INPUT USERNAME */}
        <View className="w-full mb-6">
          <Text className="text-xl font-medium text-black dark:text-[#E3F2FD] m-2">{tNameOrUsername}</Text>
          <View className="flex-row items-center border border-outline dark:border-[#334155] rounded-full h-[56px] px-4 bg-surface dark:bg-[#0F172A]">
            <MaterialIcons name="person" size={24} color={isDark ? "#90CAF9" : "#4F453D"} style={{ marginRight: 12 }} />
            <TextInput
              className="flex-1 text-base text-onSurface dark:text-[#E3F2FD]"
              placeholder={tEnterNameOrUsername}
              placeholderTextColor={isDark ? "#9CA3AF" : "#79747E"}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCompleteType="username"
            />
          </View>
        </View>

        {/* INPUT PASSWORD */}
        <View className="w-full mb-4">
          <Text className="text-xl font-medium text-black dark:text-[#E3F2FD] m-2">{tPassword}</Text>
          <View className="flex-row items-center border border-outline dark:border-[#334155] rounded-full h-[56px] px-4 bg-surface dark:bg-[#0F172A]">
            <MaterialIcons name="vpn-key" size={24} color={isDark ? "#90CAF9" : "#4F453D"} style={{ marginRight: 12 }} />
            <TextInput
              secureTextEntry={!showPassword}
              className="flex-1 text-base text-onSurface dark:text-[#E3F2FD]"
              placeholder={tEnterPassword}
              placeholderTextColor={isDark ? "#9CA3AF" : "#79747E"}
              value={password}
              onChangeText={setPassword}
              autoCompleteType="password"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
              <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={22} color={isDark ? "#90CAF9" : "#4F453D"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SARAN LOGIN */}
        <View className="w-full mb-4 px-2">
          <Text className="text-xs text-onSurfaceVariant dark:text-[#90CAF9]">{tLoginSuggestion}</Text>
        </View>

        {/* TOMBOL LOGIN */}
        <Button
          title={isSubmitting ? tLoggingIn : tLogin}
          mode="filled"
          className="w-full mb-2"
          loading={isSubmitting}
          onPress={handleLogin}
        />

        <Text className="text-base text-onSurface dark:text-[#E3F2FD] mb-2">{tOr}</Text>

        {/* TOMBOL GOOGLE */}
        <TouchableOpacity
          className="w-full flex-row items-center justify-center border border-outline dark:border-[#334155] rounded-full h-[48px] bg-surface dark:bg-[#0F172A]"
          onPress={handleGoogleSignIn}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#2196F3" />
          ) : (
            <>
              <FontAwesome name="google" size={18} color="#EA4335" style={{ marginRight: 8 }} />
              <Text className="text-onSurface dark:text-[#E3F2FD] font-medium text-base">{tGoogle}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}