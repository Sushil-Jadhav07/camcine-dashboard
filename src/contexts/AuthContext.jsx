import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/auth.js';
import { userService } from '../services/users.js';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  role: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        role: action.payload.user?.role || null
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        role: null
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        role: null
      };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        role: action.payload?.role || null
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getToken();
      
      if (token) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const response = await authService.getCurrentUser();
          
          if (response.success) {
            dispatch({ 
              type: 'SET_USER', 
              payload: response.data 
            });
          } else {
            authService.logout();
            dispatch({ type: 'LOGOUT' });
          }
        } catch (error) {
          authService.logout();
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authService.login(credentials);
      
      if (response.success) {
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: response.data 
        });
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error.message || 'Login failed' 
      });
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authService.register(userData);
      
      if (response.success) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: true, message: response.message, data: response.data };
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.message || 'Registration failed' 
      });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = async (userData) => {
    try {
      if (state.user?.id) {
        const response = await userService.updateUser(state.user.id, userData);
        
        if (response.success) {
          const updatedUser = response.data?.user || response.data;
          dispatch({ 
            type: 'SET_USER', 
            payload: { ...state.user, ...updatedUser } 
          });
          return { success: true, user: { ...state.user, ...updatedUser } };
        }
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.message || 'Failed to update user' 
      });
      return { success: false, error: error.message };
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
