// Login.test.js

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Login from '../screens/login';
import userEvent from '@testing-library/user-event';

test('Login component renders correctly', () => {
  render(<Login />);
  const loginButton = screen.getByText('Login');
  expect(loginButton).toBeInTheDocument();
});
