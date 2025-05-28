import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para decodificar JWT
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);
      
      // Ensure uid is a number
      if (decoded.uid) {
        decoded.uid = parseInt(decoded.uid, 10);
      }
      
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        return userData;
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
    return null;
  };

  useEffect(() => {
    // Verifica se há um token salvo no localStorage
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token) {
      // Tenta decodificar o token para obter informações
      const decodedToken = decodeToken(token);
      
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        
        // Se não temos username mas temos o token decodificado, tenta extrair
        if (!parsedUserData.username && decodedToken) {
          parsedUserData.username = decodedToken.username || 
                                   decodedToken.unique_name || 
                                   decodedToken.name ||
                                   decodedToken.sub ||
                                   (parsedUserData.email ? parsedUserData.email.split('@')[0] : null);
        }
        
        // Extrai o ID do usuário do token (uid)
        if (!parsedUserData.id && decodedToken && decodedToken.uid) {
          parsedUserData.id = parseInt(decodedToken.uid);
        }
        
        setUser(parsedUserData);
        
        // Se ainda não temos o username, tenta buscar os dados completos
        if (!parsedUserData.username && !parsedUserData.name) {
          fetchUserData(token);
        }
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        let errorMessage = 'Erro ao fazer login';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        // Se a resposta não for JSON, assume sucesso sem dados adicionais
        data = { token: responseText, user: { email } };
      }
      
      // Salva o token e dados do usuário
      const token = data.token || data.access_token || responseText;
      const userData = data.user || data || { email };
      
      // Tenta decodificar o token para obter mais informações
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        // Se não temos username, tenta extrair do token
        if (!userData.username) {
          userData.username = decodedToken.username || 
                             decodedToken.unique_name || 
                             decodedToken.name ||
                             decodedToken.sub ||
                             (email ? email.split('@')[0] : null);
        }
        
        // Extrai o ID do usuário do token (uid) e garante que é um número
        if (decodedToken.uid) {
          userData.id = parseInt(decodedToken.uid, 10);
        }
      }
      
      // Garante que temos pelo menos o email no userData
      if (!userData.email && email) {
        userData.email = email;
      }
      
      // Normaliza o ID do usuário (pode vir como 'id' ou 'Id')
      if (userData.Id && !userData.id) {
        userData.id = parseInt(userData.Id, 10);
      } else if (userData.id && !userData.Id) {
        userData.Id = parseInt(userData.id, 10);
      }
      
      // Normaliza o username (pode vir como 'username' ou 'Username')
      if (userData.Username && !userData.username) {
        userData.username = userData.Username;
      } else if (userData.username && !userData.Username) {
        userData.Username = userData.username;
      }
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);
      
      // Se não temos o username, tenta buscar os dados completos
      if (!userData.username && !userData.name && token) {
        const fullUserData = await fetchUserData(token);
        if (fullUserData) {
          setUser(fullUserData);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (username, email, password, confirmPassword) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        let errorMessage = 'Erro ao cadastrar';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Após registro bem-sucedido, faz login automaticamente
      return await login(email, password);
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 