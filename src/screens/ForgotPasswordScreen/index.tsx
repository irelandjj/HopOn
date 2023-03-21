import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Modal, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "../../navigation/RootNavigator";
import styles from './styles';
import { AuthorizationService } from '../../services/AuthorizationService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { isEmailValid, isPasswordValid } from '../../utils/validation';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'ForgotPassword'
>;

const ForgotPasswordScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalEmailText, setModalEmailText] = useState<string | undefined>();
    const [modalPasswordText, setModalPasswordText] = useState<string | undefined>();
  
    const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();

    useFocusEffect(
        React.useCallback(() => {
            setCode('');
            setPassword('');
        }, [])
    );

    useEffect(() => {
        if (!modalVisible) {
          setModalEmailText('');
          setModalPasswordText('');
        }
      }, [modalVisible]);

    const goBack = () => {
        navigation.goBack();
    };

    const submitNewPassword = async () => {
        if (isPasswordValid(password)) {
            try {
                await AuthorizationService.forgotPasswordSubmit(username, code, password);
                signInUser();
            }
            catch (error) {
                console.error('Error submitting new password with verification code: ', error);
                setModalVisible(true);
            }
        } else {
            setModalPasswordText('Please check that you have written correctly the verification code sent to your e-mail along with a valid password. Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character')
            setModalVisible(true);
        }
    };

    const signInUser = async () => {
        try {
            await AuthorizationService.signIn(username, password);
            navigation.navigate('Home');
        } catch (error) {
            console.log('error signing in:', error);
        }
    };

    const sendCode = async () => {
        if (isEmailValid(username)) {
            // Send confirmation code to user's email
            try {
                await AuthorizationService.forgotPassword(username);
                setShowConfirmation(true);
            } catch (error) {
                console.error('Error sending code: ', error);
                setModalVisible(true);
            }
        }
        else {
            console.error('Invalid email format');
            setModalEmailText('Please enter a valid email address');
            setModalVisible(true);
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

                        <Text style={styles.modalText}>Invalid input. Please try again.</Text>
                        <Button title="OK" onPress={() => setModalVisible(!modalVisible)} />
                    </View>
                </View>
            </Modal>
            {showConfirmation ? (
                <View style={styles.centeredView}>
                    <TextInput
                        placeholder="Verification code"
                        value={code}
                        onChangeText={setCode}
                        style={styles.textInput}
                        inputMode="numeric"
                    />
                    <TextInput
                        placeholder="New password"
                        value={password}
                        onChangeText={setPassword}
                        style={styles.textInput}
                        secureTextEntry
                    />
                    <Button title="Reset password" onPress={submitNewPassword} />
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
                    <Button title="Send code" onPress={sendCode} />
                </View>
            )}
            <Button title="Back" onPress={goBack} />
        </View>
    );
};

export default ForgotPasswordScreen;