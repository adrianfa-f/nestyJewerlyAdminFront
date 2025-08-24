import { createContext, useState, useContext, useEffect } from 'react';
import { loginAdmin } from '../services/adminService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { token, user } = await loginAdmin(email, password);
      
      if (user.role !== 'admin') {
        throw new Error('Acceso no autorizado');
      }
      
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);