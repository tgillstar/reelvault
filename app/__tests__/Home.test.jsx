import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../page';
import userEvent from '@testing-library/user-event';

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

  it('selects a random featured movie from the loaded list and renders it in the HeroBanner', async () => {
    // Arrange: mock genres and movies
    fetch.mockResponseOnce(
      JSON.stringify({
        genres: [
          { id: 28, name: 'Action' },
          { id: 12, name: 'Adventure' },
        ],
      })
    );
  
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
    const images = await screen.findAllByRole('img', { name: /Movie 1|Movie 2/i }); // <-- THIS LINE is needed
    expect(images.length).toBeGreaterThan(0);
  });

  it('opens the MovieModal when a movie card is clicked and displays trailer or fallback', async () => {
    // Arrange
    fetch.mockResponseOnce(
      JSON.stringify({
        genres: [
          { id: 28, name: 'Action' },
          { id: 12, name: 'Adventure' },
        ],
      })
    );
  
    fetch.mockResponseOnce(
      JSON.stringify({
        results: [
          { id: 1, title: 'Movie 1', backdrop_path: '/path1.jpg', poster_path: '/poster1.jpg' },
          { id: 2, title: 'Movie 2', backdrop_path: '/path2.jpg', poster_path: '/poster2.jpg' },
        ],
        total_pages: 1,
      })
    );
  
    // Act
    render(<Home />);
  
    // Find the first movie card (could be based on Movie 1 title)
    const movieCard = await screen.findByText('Movie 1');
  
    // Simulate clicking the card
    await userEvent.click(movieCard);
  
    // Assert
    const modal = await screen.findByRole('dialog'); // MovieModal is considered a dialog role
    expect(modal).toBeInTheDocument();
  
    // Check for trailer iframe OR fallback image
    const trailerIframe = screen.queryByTitle(/trailer/i);
    const fallbackImages = screen.queryAllByAltText('Movie 1');

    expect(trailerIframe || fallbackImages.length >= 2).toBeTruthy();
  });  

  it('renders the genre filter and filters movies based on selected genre', async () => {
    // Arrange: 1st fetch (genres)
    fetch.mockResponseOnce(
      JSON.stringify({
        genres: [
          { id: 28, name: 'Action' },
          { id: 12, name: 'Adventure' },
        ],
      })
    );
  
    // Arrange: 2nd fetch (popular movies first load)
    fetch.mockResponseOnce(
      JSON.stringify({
        results: [
          { id: 1, title: 'Adventure Movie', genre_ids: [12], backdrop_path: '/adventure.jpg', poster_path: '/adventureposter.jpg' },
        ],
        total_pages: 1,
      })
    );
  
    render(<Home />);
  
    // Assert: genres appear
    expect(await screen.findByText('All')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Adventure')).toBeInTheDocument();
  
    // 🛠 BEFORE click, we must mock next fetch (Action movies fetch)
    fetch.mockResponseOnce(
      JSON.stringify({
        results: [
          { id: 2, title: 'Action Movie', genre_ids: [28], backdrop_path: '/action.jpg', poster_path: '/actionposter.jpg' },
        ],
        total_pages: 1,
      })
    );
  
    // Act: click "Action" genre
    const actionGenreButton = screen.getByText('Action');
    await userEvent.click(actionGenreButton);
  
    // Assert
    expect(await screen.findByText('Action Movie')).toBeInTheDocument();
    expect(screen.queryByText('Adventure Movie')).not.toBeInTheDocument();
  });    
});


  