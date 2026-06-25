import { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Username dan password harus diisi');
      return;
    }

    setIsLoading(true);
    const success = await login(username, password);
    setIsLoading(false);
    
    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Login Gagal', 'Username atau password salah.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* TOP BADGES */}
        <View style={styles.topSection}>
          <View style={styles.splashTopRow}>
            <View style={styles.splashBadgeOutline}>
              <Text style={styles.splashBadgeText}>Kelompok 9</Text>
            </View>
            <Text style={styles.splashTextSmall}>PEMROGRAMAN BERGERAK</Text>
            <Text style={styles.splashTextSmall}>ANDROID</Text>
          </View>
        </View>

        {/* LOGO & GREETING */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/android-icon-foreground.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.greetingTitle}>Selamat Datang</Text>
          <Text style={styles.greetingSubtitle}>Silakan masuk ke akun Anda</Text>
        </View>

        {/* LOGIN FORM */}
        <View style={styles.loginContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Masukkan username"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Masukkan password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.loginBtn} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Masuk</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>2026 Pemrograman Bergerak Android</Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const PRIMARY_COLOR = 'rgba(97,83,250,1.00)';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 20,
  },
  topSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 40,
  },
  splashTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  splashBadgeOutline: {
    borderWidth: 1.5,
    borderColor: PRIMARY_COLOR,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  splashBadgeText: {
    color: PRIMARY_COLOR,
    fontWeight: 'bold',
    fontSize: 10,
  },
  splashTextSmall: {
    color: PRIMARY_COLOR,
    fontWeight: 'bold',
    fontSize: 10,
    fontStyle: 'italic',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: PRIMARY_COLOR,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    padding: 10,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  loginContainer: {
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    height: 55,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  loginBtn: {
    backgroundColor: PRIMARY_COLOR,
    height: 55,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerContainer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  }
});
