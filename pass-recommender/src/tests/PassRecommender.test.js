import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PassRecommender from '../components/PassRecommender.js';

// basic render test
test('renders PassRecommender without crashing', () => {
  render(<PassRecommender />);
});

// test button click
test('button click updates state', async () => {
  const { getByText } = render(<PassRecommender />);

  const button = getByText('Get Pass Recommendation');
  fireEvent.click(button);
});

test('RecommenderBox appears after button click', () => {
  const { getByText, queryByText } = render(<PassRecommender />);

  // Initially, the RecommenderBox should not be in the document
  expect(queryByText('recommender-box')).not.toBeInTheDocument();

  // Find the button and click it
  const button = getByText(/Get Pass Recommendation/i);
  fireEvent.click(button);

  // After clicking the button, the RecommenderBox should be in the document
  expect(queryByText('Your Pass Recommendation:')).toBeInTheDocument();
});
