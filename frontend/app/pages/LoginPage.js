import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { FontLoader, SafeArea } from '../utils';
import LoginForm from '../components/LoginForm';
import { TooltipProvider } from '../components/TooltipContext';
import TooltipOverlay from '../components/TooltipOverlay';

const logo = require('../../assets/logo.png');

const LoginPage = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = () => {
        if (!submitted) {
            if (email.trim() === '') {
                setError(true);
                return;
            }
            setSubmitted(true);
        } else {
            if (code.trim() === '') {
                setError(true);
                return;
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
