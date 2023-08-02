import React, { useState } from 'react';
import axios from 'axios';
import './style.css';

const SearchVolumeChecker = () => {
  const API_KEY = 'AIzaSyDQNCbhk0QrrNuz_I2psmJ5Gub3VKWd_AY';
  const maxResults = 30;

  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);

  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSearch = () => {
    if (!keyword) {
      alert('Please enter a keyword.');
      return;
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword)}&key=${API_KEY}&maxResults=${maxResults}`;

    axios.get(url)
      .then(response => {
        const searchResults = response.data.items;
        const extractedResults = searchResults.map(result => ({
          videoTitle: result.snippet.title,
          channelTitle: result.snippet.channelTitle,
          videoId: result.id.videoId,
          thumbnailUrl: result.snippet.thumbnails.medium.url,
          description: result.snippet.description,
          publishedAt: result.snippet.publishedAt,
        }));
        setResults(extractedResults);
      })
      .catch(error => {
        console.error('Error making API request:', error);
        alert('Failed to fetch search results. Please try again later.');
      });
  };

  return (
    <div className='container'>
      <h1>YouTube Search Volume Checker</h1>
      <div className='search'>
        <input type="text" value={keyword} onChange={handleInputChange} placeholder='Search' />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className='box-1'>

        {results.map(result => (
          <div key={result.videoId}>
            <div className='box-2'>
              <div className='box-3'>
                <a href={`https://www.youtube.com/watch?v=${result.videoId}`} target="_blank" rel="noreferrer">
                  <img className='img-1' src={result.thumbnailUrl} alt={result.videoTitle} />
                  <p> {result.videoTitle}</p>

                </a>
              </div>


              <table>
                <tbody>
                  <tr>
                    <td className="bold">Channel</td>
                    <td>{result.channelTitle}</td>
                  </tr>
                  <tr>
                    <td className="bold">Description</td>
                    <td>{result.description}</td>
                  </tr>
                  <tr>
                    <td className="bold">Published At</td>
                    <td>{result.publishedAt}</td>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>
        ))}



      </div>
    </div>
  );
};

export default SearchVolumeChecker;