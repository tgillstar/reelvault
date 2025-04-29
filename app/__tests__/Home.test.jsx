import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../page';
// NO LONGER NEED TO MOCK fetchPopularMovies DIRECTLY

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

// Reset fetch mocks before each test
beforeEach(() => {
  fetch.resetMocks();
});

describe('Home Page', () => {
  it('renders the movie grid after fetching popular movies from TMDB', async () => {
    // Arrange: mock BOTH fetches (genres + movies)

    // First call (genres)
    fetch.mockResponseOnce(
      JSON.stringify({
        genres: [
          { id: 28, name: 'Action' },
          { id: 12, name: 'Adventure' },
        ],
      })
    );

    // Second call (movies)
    fetch.mockResponseOnce(
      JSON.stringify({
        results: [
          { id: 1, title: 'Movie 1', backdrop_path: '/path1.jpg' },
          { id: 2, title: 'Movie 2', backdrop_path: '/path2.jpg' },
        ],
        total_pages: 1,
      })
    );

    // Act
    render(<Home />);

    // Assert
    expect(await screen.findByText('Movie 1')).toBeInTheDocument();
    expect(await screen.findByText('Movie 2')).toBeInTheDocument();
  });
});
