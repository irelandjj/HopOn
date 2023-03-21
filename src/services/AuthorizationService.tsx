import { Auth } from 'aws-amplify';

export interface IAuth {
    signIn(username: string, password: string): Promise<void>;
    signOut(): Promise<void>;
    signUp(username: string, password: string): Promise<void>;
    confirmSignUp(username: string, code: string): Promise<void>;
    forgotPassword(username: string): Promise<void>;
    forgotPasswordSubmit(username: string, code: string, password: string): Promise<void>;
    currentAuthenticatedUser(): Promise<void>;
}

export const AuthorizationService: IAuth = {

    signIn: async (username: string, password: string) => {
        try {
            await Auth.signIn(username, password);
        } catch (error) {
            console.error('Error signing in: ', error);
            throw error;
        }
    },

    signOut : async () => {
        try {
            await Auth.signOut();
        } catch (error) {
            console.error('Error signing out: ', error);
            throw error;
        }
    },

    signUp : async (username: string, password: string) => {
        try {
            await Auth.signUp({
                username,
                password,
                attributes: {
                    email: username,
                },
            });
        } catch (error) {
            console.error('Error signing up: ', error);
            throw error;
        }
    },

    confirmSignUp : async (username: string, code: string) => {
        try {
            await Auth.confirmSignUp(username, code);
        } catch (error) {
            console.error('Error confirming sign up: ', error);
            throw error;
        }
    },

    forgotPassword : async (username: string) => {
        try {
            await Auth.forgotPassword(username);
        } catch (error) {
            console.error('Error sending code: ', error);
            throw error;
        }
    },

    forgotPasswordSubmit : async (username: string, code: string, password: string) => {
        try {
            await Auth.forgotPasswordSubmit(username, code, password);
        } catch (error) {
            console.error('Error submitting new password: ', error);
            throw error;
        }
    },

    currentAuthenticatedUser : async () => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            return user;
        } catch (error) {
            console.error('Error getting current authenticated user: ', error);
            throw error;
        }
    },
};