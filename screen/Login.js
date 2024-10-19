import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import { postToAPI } from '../apicall/apicall';
import { useAuth } from '../auth/AuthContext';
import { colors, toastConfig } from '../component/config/config';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = { username: email, password: password };
      const result = await postToAPI("/login", data);
      if (result.rval > 0) {
        const userData = {
          token: result.token,
          is_login: 'true',
          username: result.username,
          user_id: String(result.user_id),
        };
        login(userData);
      } else {
        Toast.show({
          ...toastConfig.error,
          text1: result.message,
        });
      }
    } catch (error) {
      Toast.show({
        ...toastConfig.error,
        text1: 'Something went wrong! ' + (error.message || 'Unknown error'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>GMP</Text>
      <Input
        placeholder="Username"
        leftIcon={{ type: 'font-awesome', name: 'user', color: colors.primary }}
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={styles.inputContainer}
        inputStyle={[styles.input, { color: colors.textPrimary }]}
      />
      <Input
        placeholder="Password"
        leftIcon={{ type: 'font-awesome', name: 'lock', color: colors.primary }}
        rightIcon={
          <Icon
            name={passwordVisible ? 'eye' : 'eye-slash'}
            type="font-awesome"
            color={colors.primary}
            onPress={() => setPasswordVisible(!passwordVisible)}
          />
        }
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={!passwordVisible}
        containerStyle={styles.inputContainer}
        inputStyle={[styles.input, { color: colors.textPrimary }]}
      />
      <Button
        title="Login"
        icon={{
          name: 'sign-in',
          type: 'font-awesome',
          size: 20,
          color: 'white',
        }}
        iconRight
        buttonStyle={[styles.loginButton, { backgroundColor: colors.primary }]}
        onPress={handleLogin}
        loading={loading}
        loadingProps={{ size: 'small', color: '#fff' }}
      />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginVertical: 10,
  },
  input: {
    fontSize: 16,
  },
  loginButton: {
    borderRadius: 5,
    marginVertical: 20,
    paddingVertical: 10,
  },
});

export default LoginScreen;
