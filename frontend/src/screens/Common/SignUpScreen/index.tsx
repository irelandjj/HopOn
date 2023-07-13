import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Modal, Text } from 'react-native';
import { AuthorizationService } from '../../../services/AuthorizationService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "../../../navigation/RootNavigator";
import styles from './styles';
import { isEmailValid, isPasswordValid } from '../../../utils/validation';

type SignUpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignUp'
>;

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEmailText, setModalEmailText] = useState<string | undefined>();
  const [modalPasswordText, setModalPasswordText] = useState<string | undefined>();

  useFocusEffect(
    React.useCallback(() => {
      setPassword('');
      setUsername('');
      setName('');
      setCode('');
      setShowConfirmation(false);
      setModalVisible(false);
      setModalEmailText(undefined);
      setModalPasswordText(undefined);
    }, [])
  );

  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (!modalVisible) {
      setModalEmailText('');
      setModalPasswordText('');
    }
  }, [modalVisible]);

  const signUpUser = async () => {
    if (isEmailValid(username) && isPasswordValid(password)) {
      try {
        await AuthorizationService.signUp(username, name, password);
        setShowConfirmation(true);
      } catch (error) {
        console.error('Error signing up: ', error);
      }
    } else if (!isEmailValid(username)) {
      setModalEmailText('Please enter a valid email address');
      setModalVisible(true);
    } if (!isPasswordValid(password)) {
      setModalPasswordText('Please enter a valid password. Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character');
      setModalVisible(true);
    }
  };

  const confirmSignUpUser = async () => {
    try {
      await AuthorizationService.confirmSignUp(username, code);
      try {
        await AuthorizationService.signIn(username, password);
        navigation.navigate('Home');
      } catch (error) {
        console.error('Error signing in: ', error);
      }
    } catch (error) {
      console.error('Error confirming sign up: ', error);
    }
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
            {modalEmailText && <Text style={styles.modalText}>{modalEmailText}</Text>}
            {modalPasswordText && <Text style={styles.modalText}>{modalPasswordText}</Text>}
            <Button title="OK" onPress={() => setModalVisible(!modalVisible)} />
          </View>
        </View>
      </Modal>
      {showConfirmation ? (
        <View>
          <TextInput
            placeholder="Confirmation Code"
            value={code}
            onChangeText={setCode}
            style={styles.textInput}
            inputMode="numeric"
          />
          <Button title="Verify code" onPress={confirmSignUpUser} />
          <Button title="Back" onPress={goBack} />
        </View>
      ) : (
        <View style={styles.container}>
          <TextInput
            placeholder="Email"
            value={username}
            onChangeText={setUsername}
            style={styles.textInput}
            inputMode="email"
          />
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.textInput}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.textInput}
            secureTextEntry
          />
          <Button title="Sign Up" onPress={signUpUser} />
          <Button title="Back" onPress={goBack} />
        </View>
      )}
    </View>
  );
};

export default SignUpScreen;
