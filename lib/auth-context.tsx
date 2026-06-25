import React, { createContext, useContext, useState } from 'react';
import { getExpoDb } from './database';
import SHA256 from 'crypto-js/sha256';

export type User = {
  id: number;
  username: string;
  role: string;
  permissions: string[];
};

type AuthContextType = {
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateRoleFeatures: (role: string, newPermissions: string[]) => Promise<void>;
  changeUserRole: (userId: number, newRole: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const db = getExpoDb();
      const hash = SHA256(password).toString();
      
      const user = await db.getFirstAsync<{ id: number; username: string; role: string; permissions: string }>(
        'SELECT id, username, role, permissions FROM users WHERE username = ? AND password = ?',
        [username, hash]
      );

      if (user) {
        setCurrentUser({
          id: user.id,
          username: user.username,
          role: user.role,
          permissions: JSON.parse(user.permissions),
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateRoleFeatures = async (role: string, newPermissions: string[]) => {
    try {
      const db = getExpoDb();
      await db.runAsync('UPDATE users SET permissions = ? WHERE role = ?', [JSON.stringify(newPermissions), role]);
      
      // Jika yang diupdate adalah role user yang sedang aktif, update juga state-nya
      if (currentUser && currentUser.role === role) {
        setCurrentUser({ ...currentUser, permissions: newPermissions });
      }
    } catch (error) {
      console.error('Error updating role features:', error);
      throw error;
    }
  };

  const changeUserRole = async (userId: number, newRole: string) => {
    try {
      const db = getExpoDb();
      // Ambil permission default dari role tersebut (cari salah satu user dengan role tersebut)
      let rolePermissions: string[] = [];
      const roleUser = await db.getFirstAsync<{ permissions: string }>('SELECT permissions FROM users WHERE role = ? LIMIT 1', [newRole]);
      
      if (roleUser) {
        rolePermissions = JSON.parse(roleUser.permissions);
      } else {
        // Fallback default permissions jika tidak ada user dengan role tsb di DB
        rolePermissions = newRole === 'akademik' ? ['profiles', 'hitung', 'quesioner', 'conditional', 'loop', 'sorting', 'zodiac'] : ['loop', 'sorting'];
      }

      await db.runAsync('UPDATE users SET role = ?, permissions = ? WHERE id = ?', [newRole, JSON.stringify(rolePermissions), userId]);
      
      // Jika yang diupdate adalah user yang sedang aktif, update juga state-nya
      if (currentUser && currentUser.id === userId) {
        setCurrentUser({ ...currentUser, role: newRole, permissions: rolePermissions });
      }
    } catch (error) {
      console.error('Error changing user role:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn: !!currentUser, login, logout, updateRoleFeatures, changeUserRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
