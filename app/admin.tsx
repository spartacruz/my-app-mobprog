import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Switch, FlatList, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth, User } from '@/lib/auth-context';
import { getExpoDb } from '@/lib/database';

const ALL_FEATURES = [
  { key: 'profiles', name: 'Minggu 2: Profile Kelompok' },
  { key: 'hitung', name: 'Minggu 3: Kalkulator' },
  { key: 'quesioner', name: 'Minggu 4: Quesioner & Pooling' },
  { key: 'conditional', name: 'Minggu 5: Percabangan' },
  { key: 'loop', name: 'Minggu 8: Perulangan' },
  { key: 'sorting', name: 'Minggu 9: Sorting' },
  { key: 'zodiac', name: 'Minggu 10: Zodiac Finder' },
];

export default function AdminScreen() {
  const { currentUser, changeUserRole, updateRoleFeatures } = useAuth();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  
  // Tab 1: Users State
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [tempRole, setTempRole] = useState<string>('');

  // Tab 2: Roles State
  const [selectedRoleForFeatures, setSelectedRoleForFeatures] = useState<string>('akademik');
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  // When changing roles tab or when users loaded, load current permissions for the selected role
  useEffect(() => {
    if (activeTab === 'roles') {
      loadPermissionsForRole(selectedRoleForFeatures);
    }
  }, [activeTab, selectedRoleForFeatures]);

  const loadUsers = async () => {
    try {
      const db = getExpoDb();
      const result = await db.getAllAsync<{ id: number; username: string; role: string; permissions: string }>(
        "SELECT id, username, role, permissions FROM users WHERE role != 'admin'"
      );
      const parsedUsers = result.map(u => ({
        ...u,
        permissions: JSON.parse(u.permissions)
      }));
      setUsers(parsedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadPermissionsForRole = async (role: string) => {
    try {
      const db = getExpoDb();
      // Cari satu user dengan role tersebut untuk mendapatkan default fiturnya saat ini
      const roleUser = await db.getFirstAsync<{ permissions: string }>(
        'SELECT permissions FROM users WHERE role = ? LIMIT 1', [role]
      );
      if (roleUser) {
        setRolePermissions(JSON.parse(roleUser.permissions));
      } else {
        // Fallback default
        setRolePermissions(role === 'akademik' ? ['profiles', 'hitung', 'quesioner', 'conditional', 'loop', 'sorting', 'zodiac'] : ['loop', 'sorting']);
      }
    } catch (error) {
      console.error('Error loading role permissions:', error);
    }
  };

  // --- ACTIONS FOR TAB 1: USERS ---
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setTempRole(user.role);
  };

  const saveUserRole = async () => {
    if (!selectedUser) return;
    try {
      await changeUserRole(selectedUser.id, tempRole);
      Alert.alert('Sukses', `Role untuk ${selectedUser.username} berhasil diubah menjadi ${tempRole}.`);
      loadUsers();
      setSelectedUser(null);
    } catch (error) {
      Alert.alert('Error', 'Gagal mengubah role user.');
    }
  };

  // --- ACTIONS FOR TAB 2: ROLES ---
  const toggleFeatureForRole = (featureKey: string, value: boolean) => {
    let newPermissions = [...rolePermissions];
    if (value && !newPermissions.includes(featureKey)) {
      newPermissions.push(featureKey);
    } else if (!value && newPermissions.includes(featureKey)) {
      newPermissions = newPermissions.filter(k => k !== featureKey);
    }
    setRolePermissions(newPermissions);
  };

  const saveRoleFeatures = async () => {
    try {
      await updateRoleFeatures(selectedRoleForFeatures, rolePermissions);
      Alert.alert('Sukses', `Fitur untuk role ${selectedRoleForFeatures.toUpperCase()} berhasil diperbarui untuk semua user.`);
      loadUsers(); // Refresh background user list just in case
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan fitur role.');
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Anda tidak memiliki akses ke halaman ini.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* TABS HEADER */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'users' && styles.tabBtnActive]} 
          onPress={() => { setActiveTab('users'); setSelectedUser(null); }}
        >
          <Text style={[styles.tabBtnText, activeTab === 'users' && styles.tabBtnTextActive]}>Atur Role User</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'roles' && styles.tabBtnActive]} 
          onPress={() => { setActiveTab('roles'); }}
        >
          <Text style={[styles.tabBtnText, activeTab === 'roles' && styles.tabBtnTextActive]}>Atur Fitur Role</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT TAB 1: USERS */}
      {activeTab === 'users' && (
        <View style={{ flex: 1 }}>
          {!selectedUser ? (
            <>
              <ThemedText type="title" style={{ marginBottom: 20 }}>Daftar User</ThemedText>
              <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.userCard} onPress={() => handleSelectUser(item)}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <ThemedText type="defaultSemiBold" style={{ fontSize: 18 }}>{item.username}</ThemedText>
                      <View style={[styles.roleBadge, { backgroundColor: item.role === 'akademik' ? '#e8f5e9' : '#fff3e0' }]}>
                        <Text style={{ color: item.role === 'akademik' ? '#2e7d32' : '#e65100', fontSize: 12, fontWeight: 'bold' }}>
                          {item.role.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </>
          ) : (
            <View style={{ flex: 1 }}>
              <View style={styles.detailHeader}>
                <TouchableOpacity onPress={() => setSelectedUser(null)}>
                  <ThemedText style={{ color: '#0a7ea4', fontSize: 16 }}>&lt; Kembali</ThemedText>
                </TouchableOpacity>
                <ThemedText type="subtitle" style={{ marginLeft: 20 }}>Atur Role: {selectedUser.username}</ThemedText>
              </View>

              <View style={styles.roleSelectionContainer}>
                <ThemedText style={{ fontWeight: 'bold', marginBottom: 10 }}>Pilih Role Jabatan:</ThemedText>
                <View style={styles.roleButtonsRow}>
                  <TouchableOpacity 
                    style={[styles.roleBtn, tempRole === 'akademik' && styles.roleBtnActive]}
                    onPress={() => setTempRole('akademik')}
                  >
                    <Text style={[styles.roleBtnText, tempRole === 'akademik' && styles.roleBtnTextActive]}>Akademik</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.roleBtn, tempRole === 'mahasiswa' && styles.roleBtnActive]}
                    onPress={() => setTempRole('mahasiswa')}
                  >
                    <Text style={[styles.roleBtnText, tempRole === 'mahasiswa' && styles.roleBtnTextActive]}>Mahasiswa</Text>
                  </TouchableOpacity>
                </View>
                <ThemedText style={{ color: '#666', fontSize: 12, marginTop: 15, fontStyle: 'italic' }}>
                  *Mengubah role otomatis menyesuaikan fitur yang bisa diakses user ini sesuai standar role tersebut.
                </ThemedText>
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={saveUserRole}>
                <Text style={styles.saveBtnText}>Simpan Perubahan Role</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* CONTENT TAB 2: ROLES (FEATURES) */}
      {activeTab === 'roles' && (
        <View style={{ flex: 1 }}>
          <ThemedText type="title" style={{ marginBottom: 20 }}>Atur Fitur Role</ThemedText>
          
          <View style={styles.roleSelectionContainer}>
            <ThemedText style={{ fontWeight: 'bold', marginBottom: 10 }}>Pilih Role untuk diatur fiturnya:</ThemedText>
            <View style={styles.roleButtonsRow}>
              <TouchableOpacity 
                style={[styles.roleBtn, selectedRoleForFeatures === 'akademik' && styles.roleBtnActive]}
                onPress={() => setSelectedRoleForFeatures('akademik')}
              >
                <Text style={[styles.roleBtnText, selectedRoleForFeatures === 'akademik' && styles.roleBtnTextActive]}>Akademik</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.roleBtn, selectedRoleForFeatures === 'mahasiswa' && styles.roleBtnActive]}
                onPress={() => setSelectedRoleForFeatures('mahasiswa')}
              >
                <Text style={[styles.roleBtnText, selectedRoleForFeatures === 'mahasiswa' && styles.roleBtnTextActive]}>Mahasiswa</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ThemedText style={{ fontWeight: 'bold', marginTop: 10, marginBottom: 10 }}>Daftar Fitur untuk {selectedRoleForFeatures.toUpperCase()}:</ThemedText>
          
          <FlatList
            data={ALL_FEATURES}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <View style={styles.featureRow}>
                <ThemedText style={{ fontSize: 16, flex: 1 }}>{item.name}</ThemedText>
                <Switch
                  value={rolePermissions.includes(item.key)}
                  onValueChange={(val) => toggleFeatureForRole(item.key, val)}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={rolePermissions.includes(item.key) ? "#0a7ea4" : "#f4f3f4"}
                />
              </View>
            )}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={saveRoleFeatures}>
            <Text style={styles.saveBtnText}>Simpan Pengaturan Fitur</Text>
          </TouchableOpacity>
        </View>
      )}

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabBtnActive: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabBtnText: {
    fontWeight: 'bold',
    color: '#666',
  },
  tabBtnTextActive: {
    color: '#0a7ea4',
  },
  userCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  saveBtn: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleSelectionContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 10,
  },
  roleButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  roleBtnActive: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  roleBtnText: {
    color: '#333',
    fontWeight: 'bold',
  },
  roleBtnTextActive: {
    color: '#fff',
  }
});
