import React, { useState } from 'react';
import { View, TextInput, Button, Text, Modal } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "../../../navigation/RootNavigator";
import styles from './styles';
import { AuthorizationService } from '../../../services/AuthorizationService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { isEmailValid } from '../../../utils/validation';

type SignInScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignIn'
>;

const SignInScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation<SignInScreenNavigationProp>();

  useFocusEffect(
    React.useCallback(() => {
      setPassword('');
      setUsername('');
    }, [])
  );

  const signInUser = async () => {
    if (isEmailValid(username)) {
      try {
        await AuthorizationService.signIn(username, password);
        navigation.navigate('Home');
      } catch (error) {
        console.error('Error signing in: ', error);
        setModalVisible(true)
      }
    }
    else {
      console.error('Invalid email format');
      setModalVisible(true)
    }

  };

  const signUp = () => {
    navigation.navigate('SignUp');
  };

  const resetPassword = () => {
    setModalVisible(false)
    navigation.navigate('ForgotPassword');
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Invalid credentials. Please try again.</Text>
            <Button title="OK" onPress={() => setModalVisible(!modalVisible)} />
            <Button title="Forgot password?" onPress={resetPassword} />
          </View>
        </View>
      </Modal>
      <TextInput
        placeholder="Email"
        value={username}
        onChangeText={setUsername}
        style={styles.textInput}
        inputMode="email"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.textInput}
      />
      <Button title="Sign In" onPress={signInUser} />
      <View>
        <Text style={styles.textStyle}>Don't have an account? Register here</Text>
        <Button title="Register" onPress={signUp} />
      </View>
      <View>
        <Text style={styles.textStyle}>Forgot password?</Text>
        <Button title="Reset password" onPress={resetPassword} />
      </View>
    </View>
  );
};

export default SignInScreen;
