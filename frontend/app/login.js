import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import axios from "axios";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [loginToken, setLoginToken] = useState("");
  const [result, setResult] = useState("");
  const [errorText, setErrorText] = useState("");
  const [verifyCodeText, setVerifyCodeText] = useState("Verify");
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const handleVerifyEmail = () => {
    setErrorText("");

    axios.post(`https://jumboappetit.larrys.tech/api/user/login?email=${email}`, {})
    .then(response => {
      // console.log("A: " + response.data);
      const receivedLoginToken = response.data;
      setLoginToken(receivedLoginToken);
      setErrorText("Verification email sent. Check your email for instructions.");
    })
    .catch(error => {
      console.error(error);
      setErrorText("Not a valid email. Please use your school email");
    });
  };

  const handleVerifyCode = () => {
    setErrorText("");

    axios.get(`https://jumboappetit.larrys.tech/api/user/authorize-login?code=${emailCode}`, {})
    .then(response => {
      console.log("B: " + response.data);
      setVerifyCodeText("✅");
      setIsCodeVerified(true);
    })
    .catch(error => {
      console.error(error);
      setErrorText("Code verification failed.");
    });
  };

  const handleLogin = () => {
    setErrorText("");

    axios.post(`https://jumboappetit.larrys.tech/api/user/login-authorized?login_token=${loginToken}`, {})
    .then(secondApiResponse => {
      console.log("C: " + secondApiResponse.data); // token should persist
      const receivedBearerToken = secondApiResponse.data;
      setResult(`Bearer Token: ${receivedBearerToken}`);
    })
    .catch(error => {
      console.error(error);
      setErrorText("Please click the link in your email or input the six-letter code");
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.inputContainer}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Your edu email"
            placeholderTextColor="#003f5c"
            onChangeText={(email) => setEmail(email)}
          />
        </View>

        <TouchableOpacity onPress={!email ? undefined : handleVerifyEmail} style={styles.verifyButton}>
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>

      {/* Optional input for verification code */}
      <View style={styles.inputContainer}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Verification Code (optional)"
            placeholderTextColor="#003f5c"
            onChangeText={(code) => setEmailCode(code)}
          />
        </View>

        {/* If the user hasn't inputted the emailCode field, there is no point in calling 
        the handleVerifyCode function. Also if they have already verified the code, 
        there is no point in re-verifying it again. */}
        <TouchableOpacity onPress={(!email || !emailCode || isCodeVerified) ? undefined : handleVerifyCode} style={styles.verifyButton}>
          <Text style={styles.verifyButtonText}>{verifyCodeText}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginBtn} onPress={(!email) ? undefined : handleLogin}>
        <Text style={styles.loginText}>Login 👉</Text>
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
    borderRadius: 10,
    width: "60%",
    height: 40,
    alignItems: "center",
    marginRight: 10,
  },

  inputText: {
    flex: 1,
    width: "100%",
    paddingLeft: 20
  },

  verifyButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#136970',
  },

  verifyButtonText: {
    color: 'white',
  },

  loginBtn: {
    width: "73%",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
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
  },

  inputContainer: {
    flexDirection: 'row', // This sets the main axis to be horizontal
    justifyContent: 'space-between', // This pushes the child elements to the start and end of the container
    alignItems: 'center', // This aligns the child elements along the cross-axis (vertically in this case)
    marginBottom: 20,
  }
});
