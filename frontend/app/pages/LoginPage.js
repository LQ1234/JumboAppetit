import React, { useState, useContext, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { FontLoader, SafeArea } from '../utils';
import LoginForm from '../components/LoginForm';
import { TooltipProvider } from '../components/TooltipContext';
import TooltipOverlay from '../components/TooltipOverlay';
import { AuthContext } from '../contexts/AuthContext';

const logo = require('../../assets/logo.png');

const LoginPage = ({ setCurrentPage }) => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { login, authorizeLogin, isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        if (isAuthenticated) {
            setCurrentPage('menu');
        }
    }, [isAuthenticated, setCurrentPage]);

    const handleSubmit = async () => {
        if (!submitted) {
            if (email.trim() === '') {
                setErrorMessage('Email is required');
                setError(true);
                return;
            }
            if (!email.trim().includes('.')) {
                setErrorMessage('Full email is required');
                setError(true);
                return;
            }

            const result = await login(email.trim());
            if (result.success) {
                setSubmitted(true);
            } else {
                setErrorMessage(result.error || 'Failed to send login token');
                setError(true);
            }
        } else {
            if (code.trim() === '') {
                setErrorMessage('Verification code is required');
                setError(true);
                return;
            }

            const result = await authorizeLogin(code.trim());
            if (!result.success) {
                setErrorMessage(result.error || 'Invalid verification code');
                setError(true);
            }
        }
        setError(false);
    };

    return (
        <TooltipProvider>
            <FontLoader>
                <SafeArea>
                    <View style={styles.container}>
                        <View style={styles.logoContainer}>
                            <Image source={logo} style={styles.logo} />
                        </View>
                        <LoginForm
                            email={email}
                            setEmail={setEmail}
                            code={code}
                            setCode={setCode}
                            submitted={submitted}
                            error={error}
                            errorMessage={errorMessage}
                            handleSubmit={handleSubmit}
                        />
                    </View>
                    <TooltipOverlay />
                </SafeArea>
            </FontLoader>
        </TooltipProvider>
    );
};

const styles = StyleSheet.create({
    logoContainer: {
        width: "80%",
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});

export default LoginPage;
