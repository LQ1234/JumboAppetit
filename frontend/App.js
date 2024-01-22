import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import axios from "axios";

export default function App() {
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [loginToken, setLoginToken] = useState("");
  const [result, setResult] = useState("");
  const [errorText, setErrorText] = useState("");
  const [verifyCodeText, setVerifyCodeText] = useState("Verify code");
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const handleVerifyEmail = () => {
    // Reset error text
    setErrorText("");

    axios.post(`https://jumboappetit.larrys.tech/api/user/login?email=${email}`, {})
    .then(response => {
      // Handle successful registration
      console.log(response.data);

      const receivedLoginToken = response.data;

      // Save the login token in the state
      setLoginToken(receivedLoginToken);

      setErrorText("Verification email sent. Check your email for instructions.");
    })
    .catch(error => {
      // Handle registration failure
      console.error(error);
      setErrorText("Not a valid email. Please use your school email");
    });
  };

  const handleVerifyCode = () => {
    // Reset error text
    setErrorText("");

    axios.get(`https://jumboappetit.larrys.tech/api/user/authorize-login?code=${emailCode}`, {})
    .then(response => {
      // Handle successful code verification
      console.log(response.data);

      // Update button text to check emoji
      setVerifyCodeText("✅");

      setIsCodeVerified(true);
    })
    .catch(error => {
      // Handle code verification failure
      console.error(error);
      setErrorText("Code verification failed.");
    });
  };

  const handleLogin = () => {
    // Reset error text
    setErrorText("");

    axios.post(`https://jumboappetit.larrys.tech/api/user/login-authorized?login_token=${loginToken}`, {})
    .then(secondApiResponse => {
      // Handle the result of the second API call
      console.log(secondApiResponse.data);

      const receivedBearerToken = secondApiResponse.data;

      // Save the bearer token for use in the app
      setResult(`Bearer Token: ${receivedBearerToken}`);
    })
    .catch(error => {
      // Handle error from the second API call
      console.error(error);
      setErrorText("Please click the link in your email or input the six-letter code");
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Your edu email"
          placeholderTextColor="#003f5c"
          onChangeText={(email) => setEmail(email)}
        />
      </View>

      <TouchableOpacity onPress={!email ? undefined : handleVerifyEmail}>
        <Text style={styles.verifyButton}>Verify Email</Text>
      </TouchableOpacity>

      {/* Optional input for verification code */}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Verification Code (optional)"
          placeholderTextColor="#003f5c"
          onChangeText={(code) => setEmailCode(code)}
        />
      </View>

    {/* If the user hasn't inputted the emailCode field, there is no point in calling 
    the handleVerifyCode function. Also if they have already verified the code, 
    there is no point in re-verifying it again. */}
      <TouchableOpacity onPress={(!email || !emailCode || isCodeVerified) ? undefined : handleVerifyCode}>
        <Text style={styles.verifyButton}>{verifyCodeText}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginBtn} onPress={(!email) ? undefined : handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>

      <Text style={styles.errorText}>{errorText}</Text>
      <Text style={styles.resultText}>{result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  inputView: {
    backgroundColor: "#FDF0D5",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  verifyButton: {
    height: 30,
    marginBottom: 10,
    color: 'blue',
  },

  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#FAC05E",
  },

  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },

  resultText: {
    marginTop: 10,
    textAlign: 'center',
  }
});
