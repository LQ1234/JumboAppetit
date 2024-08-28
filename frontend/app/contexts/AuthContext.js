import React, { createContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { DOMAIN } from '../utils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loginToken, setLoginToken] = useState(null);
    const [bearerToken, setBearerToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const pollRef = useRef(null);

    useEffect(() => {
        const loadToken = async () => {
            const storedToken = await AsyncStorage.getItem('bearerToken');
            if (storedToken) {
                setBearerToken(storedToken);
                setIsAuthenticated(true);
            }
        };
        loadToken();
    }, []);

    const login = async (email) => {
        try {
            const response = await axios.post(`https://${DOMAIN}/api/user/login`, null, {
                params: { email },
            });
            const token = response.data;
            setLoginToken(token);
            pollAuthorization(token);
            return { success: true, token };
        } catch (error) {
            return { success: false, error: error.response?.data?.detail || 'Login failed' };
        }
    };

    const authorizeLogin = async (code) => {
        try {
            const response = await axios.get(`https://${DOMAIN}/api/user/authorize-login`, {
                params: { code },
            });
            
            if (response.status === 200) {
                return { success: true };
            }
            return { success: false, error: 'Authorization failed' };
        } catch (error) {
            return { success: false, error: error.response?.data?.detail || 'Authorization failed' };
        }
    };

    const completeLogin = async (loginToken) => {
        try {
            const response = await axios.post(`https://${DOMAIN}/api/user/login-authorized`, null, {
                params: { login_token: loginToken },
            });
            setBearerToken(response.data);
            await AsyncStorage.setItem('bearerToken', response.data);
            setIsAuthenticated(true);
            clearInterval(pollRef.current);
            return { success: true, bearerToken };
        } catch (error) {
            return { success: false, error: error.response?.data?.detail || 'Login completion failed' };
        }
    };

    const pollAuthorization = (loginToken) => {
        if (pollRef.current) {
            clearInterval(pollRef.current);
        }
        pollRef.current = setInterval(async () => {
            const result = await completeLogin(loginToken);
            if (result.success) {
                clearInterval(pollRef.current);
            }
        }, 2000);
        setTimeout(() => {
            clearInterval(pollRef.current);
            pollRef.current = null;
        }, 10 * 60 * 1000);
    }


    const logout = async () => {
        await AsyncStorage.removeItem('bearerToken');
        setLoginToken(null);
        setBearerToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                loginToken,
                isAuthenticated,
                login,
                authorizeLogin,
                completeLogin,
                logout, // Provide the logout function
                bearerToken
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
