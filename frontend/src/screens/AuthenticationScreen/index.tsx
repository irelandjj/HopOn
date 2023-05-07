import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import LoadingScreen from '../LoadingScreen';
import HomeScreen from '../HomeScreen';
import SignInScreen from '../SignInScreen';
import styles from './styles';
import { AuthorizationService } from '../../services/AuthorizationService';

const AuthenticationScreen = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            await AuthorizationService.currentAuthenticatedUser();
            setIsAuthenticated(true);
        } catch (error) {
            console.log(error);
            setIsAuthenticated(false);
        }
        setIsLoading(false);
    };

    const renderContent = () => {
        if (isLoading) {
            return <LoadingScreen />;
        } else if (isAuthenticated) {
            return <HomeScreen />;
        } else {
            return <SignInScreen />;
        }
    };

    return <View style={styles.container}>{renderContent()}</View>;
};

export default AuthenticationScreen;
