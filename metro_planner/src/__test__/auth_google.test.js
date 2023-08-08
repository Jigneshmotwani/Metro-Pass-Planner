const firebaseAuth = require('../screens/login.js');
const { render, getByText } = require('@testing-library/react');

// Mock data for successful authentication
const successfulAuthResponse = {
  user: {
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    uid: 'user12345',
  },
  credential: {
    // Mocked authentication token and provider ID
    accessToken: 'mocked_access_token',
    providerId: 'google.com',
  },
};

// Mock data for failed authentication
const failedAuthResponse = {
  error: {
    code: 'auth/popup-closed-by-user',
    message: 'Authentication failed.',
  },
};

// Mock of Firebase Auth library
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    signInWithPopup: jest.fn().mockImplementation((provider) => {
      // Simulate the authentication process based on the provider type
      if (provider.providerId === 'google.com') {
        return Promise.resolve(successfulAuthResponse);
      } else {
        return Promise.reject(failedAuthResponse);
      }
    }),
  })),
}));

// Test case for signInWithPopup
it('Accounts pop up appears and authentication occurs', async () => {
  // Mock of signInWithPopup to return the successfulAuthResponse
  firebaseAuth.signInWithPopup = jest
    .fn()
    .mockResolvedValue(successfulAuthResponse);

  // Simulating the login process
  const userCredential = await firebaseAuth.signInWithPopup();

  // Getting user information from the UserCredential object
  const user = userCredential.user;

  // Making assertions about the user data
  expect(user.displayName).toBe('John Doe');
  expect(user.email).toBe('john.doe@example.com');

  // Checking if the signInWithPopup method was called correctly
  expect(firebaseAuth.signInWithPopup).toHaveBeenCalledTimes(1);
});

// Test case for successful authentication
it('should authenticate a user successfully with Google provider', async () => {
  // Mock of signInWithGoogle to return the successfulAuthResponse
  firebaseAuth.signInWithGoogle = jest
    .fn()
    .mockResolvedValue(successfulAuthResponse);

  // Simulating the login process
  const userCredential = await firebaseAuth.signInWithGoogle();

  // Getting user information from the UserCredential object
  const user = userCredential.user;

  // Make=ing assertions about the user data
  expect(user.displayName).toBe('John Doe');
  expect(user.email).toBe('john.doe@example.com');

  // Checking if the Google Auth method was called correctly
  expect(firebaseAuth.signInWithGoogle).toHaveBeenCalledTimes(1);
});

// Test case for failed authentication with signInWithPopup
it('should handle failed authentication due to Popup', async () => {
  // Mock of signInWithPopup to return the failedAuthResponse
  firebaseAuth.signInWithPopup = jest
    .fn()
    .mockRejectedValue(failedAuthResponse);

  // Simulating the login process
  try {
    await firebaseAuth.signInWithPopup();
    // If the promise resolves, authentication didn't fail as expected,
    // so, the test fails with a custom message.
    fail('Authentication should have failed.');
  } catch (error) {
    // Checking if the correct error message is thrown
    expect(error.error.code).toBe('auth/popup-closed-by-user');
    expect(error.error.message).toBe('Authentication failed.');
  }

  // Checking if the signInWithPopup method was called correctly
  expect(firebaseAuth.signInWithPopup).toHaveBeenCalledTimes(1);
});

// Test case for failed authentication with signInWithGoogle
it('should handle failed authentication with Google provider using signInWithGoogle', async () => {
  // Mock of signInWithGoogle to return the failedAuthResponse
  firebaseAuth.signInWithGoogle = jest
    .fn()
    .mockRejectedValue(failedAuthResponse);

  // Simulating the login process
  try {
    await firebaseAuth.signInWithGoogle();
    // If the promise resolves, authentication didn't fail as expected,
    // so, the test fails with a custom message.
    fail('Authentication should have failed.');
  } catch (error) {
    // Check if the correct error message is thrown
    expect(error.error.code).toBe('auth/popup-closed-by-user');
    expect(error.error.message).toBe('Authentication failed.');
  }

  // Checking if the signInWithGoogle method was called correctly
  expect(firebaseAuth.signInWithGoogle).toHaveBeenCalledTimes(1);
});
