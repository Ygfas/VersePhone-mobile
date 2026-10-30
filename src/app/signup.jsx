import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { TopAppBar } from "../components/TopAppBar";
import { Button } from "../components/Button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useThemeMode } from "../store/theme-store";
import { useTranslatedText } from "../store/language-store";
import { register, loginWithGoogle } from "../store/auth";
import Constants from "expo-constants";

export default function SignUp() {
  const isDark = useThemeMode();
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tSignUp = useTranslatedText("Sign Up");
  const tLogin = useTranslatedText("Login");
  const tNameOrUsername = useTranslatedText("Name atau Username");
  const tEnterNameOrUsername = useTranslatedText("Masukkan Nama atau Username");
  const tPhoneNumber = useTranslatedText("Nomor Seluler");
  const tEnterPhoneNumber = useTranslatedText("Masukkan Nomor Seluler");
  const tEmail = useTranslatedText("Email");
  const tEnterEmail = useTranslatedText("Masukkan Email");
  const tPassword = useTranslatedText("Password");
  const tEnterPassword = useTranslatedText("Masukkan Password");
  const tPasswordErrorLength = useTranslatedText("Password harus 1-8 karakter.");
  const tPasswordErrorCapital = useTranslatedText("Karakter pertama harus huruf kapital (A-Z).");
  const tPasswordErrorMix = useTranslatedText("Password harus kombinasi huruf dan angka.");
  const tWeak = useTranslatedText("Lemah");
  const tMedium = useTranslatedText("Sedang");
  const tStrong = useTranslatedText("Kuat");
  const tVeryStrong = useTranslatedText("Sangat Kuat");
  const tPasswordSecurity = useTranslatedText("Keamanan password:");
  const tPasswordRule = useTranslatedText("Ketentuan: 1-8 karakter, huruf depan kapital, dan kombinasi huruf & angka.");
  const tIAgree = useTranslatedText("I agree");
  const tOr = useTranslatedText("Or");
  const tGoogle = useTranslatedText("Google");
  const tSigningUp = useTranslatedText("Mendaftar...");
  const tSignUpFailed = useTranslatedText("Pendaftaran gagal");
  const tFillAllFields = useTranslatedText("Semua field wajib diisi");
  const tInvalidEmail = useTranslatedText("Format email tidak valid");
  const tInvalidPhone = useTranslatedText("Format nomor telepon tidak valid");
  const tUserExists = useTranslatedText("Email atau Username sudah terdaftar!");

  // Konfigurasi Google Sign-In
  useEffect(() => {
    // Config sudah dihandle di store/auth.js via expo-auth-session
  }, []);

  const validatePassword = (value) => {
    // Diperlonggar: minimal 6 karakter, bebas huruf besar/kecil/angka agar user tidak bingung
    if (value.length < 6) {
      return "Password minimal 6 karakter.";
    }
    return "";
  };

  const getPasswordStrength = (value) => {
    if (!value) return { score: 0, label: "", color: "transparent" };
    let score = value.length >= 6 ? 4 : 2;
    return { score, label: value.length >= 6 ? "Kuat" : "Lemah", color: value.length >= 6 ? "#2E7D32" : "#B3261E" };
  };

  const strength = getPasswordStrength(password);
  const passwordError = validatePassword(password);
  const isPasswordValid = passwordError === "" && password.length > 0;

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^(\+62|62|0)8[1-9][0-9]{7,9}$/.test(phone.replace(/\s/g, ""));

  const canSubmit = isPasswordValid && isChecked && name.trim() && phone.trim() && email.trim() && validateEmail(email) && validatePhone(phone);

  const handleSignUp = async () => {
    if (!canSubmit) {
      Alert.alert(tSignUpFailed, tFillAllFields);
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert(tSignUpFailed, tInvalidEmail);
      return;
    }
    if (!validatePhone(phone)) {
      Alert.alert(tSignUpFailed, tInvalidPhone);
      return;
    }

    setIsSubmitting(true);
    const result = await register(name.trim(), phone.trim(), email.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      Alert.alert("Berhasil", `Akun ${result.username} berhasil dibuat! Silakan login.`, [
        { text: "OK", onPress: () => router.push("/login") },
      ]);
    } else {
      let errorMsg = result.error;
      if (errorMsg.includes("sudah terdaftar")) errorMsg = tUserExists;
      Alert.alert(tSignUpFailed, errorMsg);
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
        Alert.alert(tSignUpFailed, result.error);
      }
    } catch (error) {
      Alert.alert(tSignUpFailed, error.message || "Gagal login dengan Google");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-surface dark:bg-[#0F172A]">
      <TopAppBar title={tSignUp} leftIcon="arrow-back" onLeftPress={() => router.back()} />

      <TouchableOpacity className="absolute top-[28px] right-4" onPress={() => router.push("/login")}>
        <Text className="text-xl mt-7 text-primary dark:text-[#90CAF9] font-medium">{tLogin}</Text>
      </TouchableOpacity>

      <View className="p-4 mt-8 flex-1 items-center">
        {/* INPUT NAME / USERNAME */}
        <View className="w-full mb-6">
          <Text className="text-xl font-medium text-black dark:text-[#E3F2FD] m-2">{tNameOrUsername}</Text>
          <View className="flex-row items-center border border-outline dark:border-[#334155] rounded-full h-[56px] px-4 bg-surface dark:bg-[#0F172A]">
            <MaterialIcons name="person" size={24} color={isDark ? "#90CAF9" : "#4F453D"} style={{ marginRight: 12 }} />
            <TextInput
              className="flex-1 text-base text-onSurface dark:text-[#E3F2FD]"
              placeholder={tEnterNameOrUsername}
              placeholderTextColor={isDark ? "#9CA3AF" : "#79747E"}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* INPUT NOMOR SELULER */}
        <View className="w-full mb-6">
          <Text className="text-xl font-medium text-black dark:text-[#E3F2FD] m-2">{tPhoneNumber}</Text>
          <View className="flex-row items-center border border-outline dark:border-[#334155] rounded-full h-[56px] px-4 bg-surface dark:bg-[#0F172A]">
            <MaterialIcons name="numbers" size={24} color={isDark ? "#90CAF9" : "#4F453D"} style={{ marginRight: 12 }} />
            <TextInput
              className="flex-1 text-base text-onSurface dark:text-[#E3F2FD]"
              placeholder={tEnterPhoneNumber}
              placeholderTextColor={isDark ? "#9CA3AF" : "#79747E"}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        </View>

        {/* INPUT EMAIL */}
        <View className="w-full mb-6">
          <Text className="text-xl font-medium text-black dark:text-[#E3F2FD] m-2">{tEmail}</Text>
          <View className="flex-row items-center border border-outline dark:border-[#334155] rounded-full h-[56px] px-4 bg-surface dark:bg-[#0F172A]">
            <MaterialIcons name="mail" size={24} color={isDark ? "#90CAF9" : "#4F453D"} style={{ marginRight: 12 }} />
            <TextInput
              className="flex-1 text-base text-onSurface dark:text-[#E3F2FD]"
              placeholder={tEnterEmail}
              placeholderTextColor={isDark ? "#9CA3AF" : "#79747E"}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        {/* INPUT PASSWORD */}
        <View className="w-full mb-4">
          <Text className="text-xl font-medium text-black dark:text-[#E3F2FD] m-2">{tPassword}</Text>
          <View
            className={`flex-row items-center border rounded-full h-[56px] px-4 bg-surface dark:bg-[#0F172A] ${touched && passwordError ? "border-error" : "border-outline dark:border-[#334155]"}`}
          >
            <MaterialIcons name="vpn-key" size={24} color={isDark ? "#90CAF9" : "#4F453D"} style={{ marginRight: 12 }} />
            <TextInput
              secureTextEntry={!showPassword}
              className="flex-1 text-base text-onSurface dark:text-[#E3F2FD]"
              placeholder={tEnterPassword}
              placeholderTextColor={isDark ? "#9CA3AF" : "#79747E"}
              value={password}
              onChangeText={setPassword}
              onBlur={() => setTouched(true)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
              <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={22} color={isDark ? "#90CAF9" : "#4F453D"} />
            </TouchableOpacity>
          </View>
          {touched && !!passwordError && (
            <Text className="text-xs text-error dark:text-red-300 m-2">{passwordError}</Text>
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
                      backgroundColor: seg <= strength.score ? strength.color : "#E0E0E0",
                      marginRight: seg < 4 ? 4 : 0,
                    }}
                  />
                ))}
              </View>
              <Text className="text-xs font-medium mt-1" style={{ color: strength.color }}>
                {tPasswordSecurity} {strength.label}
              </Text>
            </View>
          )}

          <Text className="text-xs text-onSurfaceVariant dark:text-[#90CAF9] m-2">Ketentuan: Minimal 6 karakter.</Text>
        </View>

        {/* CHECKBOX I AGREE */}
        <View className="w-full mb-6 flex-row items-center px-2">
          <TouchableOpacity
            onPress={() => setIsChecked(!isChecked)}
            className={`w-[18px] h-[18px] border-2 rounded-[2px] items-center justify-center mr-2 ${isChecked ? "bg-primary border-primary" : "border-onSurfaceVariant"}`}
          >
            {isChecked && <MaterialIcons name="check" size={14} color="#FFFFFF" />}
          </TouchableOpacity>
          <Text className="text-base text-onSurface dark:text-[#E3F2FD]">{tIAgree}</Text>
        </View>

        {/* TOMBOL SIGN UP */}
        <Button
          title={isSubmitting ? tSigningUp : tSignUp}
          icon="login"
          mode="filled"
          className={`w-full mb-2 ${canSubmit ? "" : "opacity-50"}`}
          disabled={!canSubmit || isSubmitting}
          loading={isSubmitting}
          onPress={handleSignUp}
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