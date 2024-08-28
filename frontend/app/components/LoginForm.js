import React, { useContext, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { TooltipContext } from './TooltipContext';

const LoginForm = ({ email, setEmail, code, setCode, submitted, error, errorMessage, handleSubmit }) => {
    const { showTooltip, hideTooltip } = useContext(TooltipContext);
    const emailInputRef = useRef(null);
    const codeInputRef = useRef(null);

    const displayErrorTooltip = (inputRef, message) => {
        if (inputRef.current) {
            inputRef.current.measure((x, y, width, height, pageX, pageY) => {
                showTooltip(
                    'Error',
                    message,
                    { top: pageY - 20, left: pageX + width / 2 }
                );
            });
        }
    };

    useEffect(() => {
        if (error) {
            if (!submitted) {
                displayErrorTooltip(emailInputRef, errorMessage);
            } else {
                displayErrorTooltip(codeInputRef, errorMessage);
            }
        } else {
            hideTooltip();
        }
    }, [error, submitted, errorMessage]);

    return (
        <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Tufts Email</Text>
                <TextInput
                    ref={emailInputRef}
                    style={[styles.input, submitted && styles.disabledInput]}
                    placeholder=""
                    value={email}
                    onChangeText={setEmail}
                    editable={!submitted}
                    onSubmitEditing={!submitted ? handleSubmit : null}
                    returnKeyType="done"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                />
            </View>
            {submitted && (
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Verification Code</Text>
                    <TextInput
                        ref={codeInputRef}
                        style={styles.input}
                        placeholder="012345"
                        value={code}
                        onChangeText={setCode}
                        onSubmitEditing={handleSubmit}
                        returnKeyType="done"
                        autoCapitalize="characters"
                        autoComplete="one-time-code"
                        autoCorrect={false}

                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        width: '80%',
        position: 'relative',
        alignItems: 'center',
        height: '50%',
        marginTop: -40,
    },
    inputContainer: {
        marginTop: 10,
        width: '100%',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#000',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        backgroundColor: '#fff',
        width: '100%',
    },
    disabledInput: {
        backgroundColor: '#eee',
        color: '#aaa',
    },
});

export default LoginForm;
