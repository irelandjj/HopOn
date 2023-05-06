import { AuthorizationService } from '../src/services/AuthorizationService';
import { Auth } from 'aws-amplify';

jest.mock('aws-amplify', () => ({
    Auth: {
        signIn: jest.fn(),
        signOut: jest.fn(),
        signUp: jest.fn(),
        confirmSignUp: jest.fn(),
        forgotPassword: jest.fn(),
        forgotPasswordSubmit: jest.fn(),
        currentAuthenticatedUser: jest.fn(),
    },
}));

describe('AuthorizationService', () => {
    describe('signIn', () => {
        beforeEach(() => {
            // Clear all mocks before each test
            jest.clearAllMocks();
        });

        test('calls Auth.signIn with the correct arguments', async () => {
            const username = 'testuser';
            const password = 'testpassword';
            await AuthorizationService.signIn(username, password);
            expect(Auth.signIn).toHaveBeenCalledWith(username, password);
        });

        test('throws an error if Auth.signIn throws an error', async () => {
            const errorMessage = 'Invalid username or password';
            const consoleError = jest.spyOn(global.console, "error").mockImplementation(() => {});

            (Auth.signIn as jest.MockedFunction<typeof Auth.signIn>)
                .mockRejectedValueOnce(new Error(errorMessage));

            await expect(AuthorizationService.signIn('john', 'password123')).rejects.toThrow(errorMessage);
            expect(consoleError).toHaveBeenCalledWith('Error signing in: ', new Error(errorMessage));
        });
    });

    describe('signOut', () => {
        beforeEach(() => {
            // Clear all mocks before each test
            jest.clearAllMocks();
        });

        test('calls Auth.signOut with the correct arguments', async () => {
            await AuthorizationService.signOut();
            expect(Auth.signOut).toHaveBeenCalledWith();
        });

        test('throws an error if Auth.signOut throws an error', async () => {
            const errorMessage = 'Could not sign out';
            const consoleError = jest.spyOn(global.console, "error").mockImplementation(() => {});

            (Auth.signOut as jest.MockedFunction<typeof Auth.signOut>)
                .mockRejectedValueOnce(new Error(errorMessage));

            await expect(AuthorizationService.signOut()).rejects.toThrow(errorMessage);
            expect(consoleError).toHaveBeenCalledWith('Error signing out: ', new Error(errorMessage));
        });
    });
});
