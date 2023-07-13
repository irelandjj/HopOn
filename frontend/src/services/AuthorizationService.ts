import { Auth } from 'aws-amplify';

export const AuthorizationService = {

    signIn: async (username: string, password: string) => {
        try {
            await Auth.signIn(username, password);
        } catch (error) {
            console.error('Error signing in: ', error);
            throw error;
        }
    },

    signOut: async () => {
        try {
            await Auth.signOut();
        } catch (error) {
            console.error('Error signing out: ', error);
            throw error;
        }
    },

    signUp : async (username: string, name: string, password: string) => {
        try {
            await Auth.signUp({
                username,
                password,
                attributes: {
                    email: username,
                    name: name
                },
            });
        } catch (error) {
            console.error('Error signing up: ', error);
            throw error;
        }
    },

    confirmSignUp: async (username: string, code: string) => {
        try {
            await Auth.confirmSignUp(username, code);
        } catch (error) {
            console.error('Error confirming sign up: ', error);
            throw error;
        }
    },

    forgotPassword: async (username: string) => {
        try {
            await Auth.forgotPassword(username);
        } catch (error) {
            console.error('Error sending code: ', error);
            throw error;
        }
    },

    forgotPasswordSubmit: async (username: string, code: string, password: string) => {
        try {
            await Auth.forgotPasswordSubmit(username, code, password);
        } catch (error) {
            console.error('Error submitting new password: ', error);
            throw error;
        }
    },

    getCurrentUserId: async (): Promise<string | undefined> => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            const attributes = await Auth.userAttributes(user);
            const userIdAttribute = attributes.find(attribute => attribute.Name === 'sub');
            return userIdAttribute ? userIdAttribute.Value : undefined;
        } catch (error) {
            console.error('Error fetching user ID:', error);
            return undefined;
        }
    },

    currentAuthenticatedUser: async () => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            return user;
        } catch (error) {
            console.error('Error getting current authenticated user: ', error);
            throw error;
        }
    },
};