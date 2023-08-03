import React, { useState } from 'react';
import axios from 'axios';
import './style.css';

const SearchVolume = () => {
  const API_KEY = 'AIzaSyDQNCbhk0QrrNuz_I2psmJ5Gub3VKWd_AY'; 
  const maxResults = 30;

  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [searchVolume, setSearchVolume] = useState(0);

  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSearch = async () => {
    if (!keyword) {
      alert('Please enter a keyword.');
      return;
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      keyword
    )}&key=${API_KEY}&maxResults=${maxResults}`;

    try {
      const response = await axios.get(url);
      const searchResults = response.data.items;
      const extractedResults = searchResults.map((result) => ({
        videoTitle: result.snippet.title,
        channelTitle: result.snippet.channelTitle,
        videoId: result.id.videoId,
        thumbnailUrl: result.snippet.thumbnails.medium.url,
        description: result.snippet.description,
        publishedAt: result.snippet.publishedAt,
      }));
      setResults(extractedResults);

      // Fetch the total number of search results for the keyword
      const searchVolumeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        keyword
      )}&key=${API_KEY}`;
      const volumeResponse = await axios.get(searchVolumeUrl);
      const totalResults = volumeResponse.data.pageInfo.totalResults;
      setSearchVolume(totalResults);

      // Fetch video statistics for each video in the search results
      const videoIds = extractedResults.map((result) => result.videoId);
      const videoStatsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(
        ','
      )}&key=${API_KEY}`;
      const statsResponse = await axios.get(videoStatsUrl);
      const videoStats = statsResponse.data.items;

      // Update the results with video statistics
      const updatedResults = extractedResults.map((result, index) => ({
        ...result,
        stats: videoStats[index]?.statistics || { viewCount: 0, likeCount: 0, commentCount: 0 },
      }));
      setResults(updatedResults);
    } catch (error) {
      console.error('Error fetching search results or statistics:', error);
      alert('Failed to fetch search results. Please try again later.');
    }
  };

  return (
    <div className='container'>
      <h1>YouTube Search Volume Checker</h1>
      <div className='search'>
        <input type='text' value={keyword} onChange={handleInputChange} placeholder='Search' />
        <button onClick={handleSearch}>Search</button>
      </div>
      <h2>Monthly Search Volume: {searchVolume}</h2>
      <div className='box-1'>
        {results.map((result) => (
          <div key={result.videoId}>
            <div className='box-2'>
              <div className='box-3'>
                <a href={`https://www.youtube.com/watch?v=${result.videoId}`} target='_blank' rel='noreferrer'>
                  <img className='img-1' src={result.thumbnailUrl} alt={result.videoTitle} />
                  <p> {result.videoTitle}</p>
                </a>
              </div>
              <table>
                <tbody>
                  <tr>
                    <td className='bold'>Channel</td>
                    <td>{result.channelTitle}</td>
                  </tr>
                  <tr>
                    <td className='bold'>Description</td>
                    <td>{result.description}</td>
                  </tr>
                  <tr>
                    <td className='bold'>Published At</td>
                    <td>{result.publishedAt}</td>
                  </tr>
                  {/* Add video statistics */}
                  <tr>
                    <td className='bold'>Views</td>
                    <td>{result.stats?.viewCount || 0}</td>
                  </tr>
                  <tr>
                    <td className='bold'>Likes</td>
                    <td>{result.stats?.likeCount || 0}</td>
                  </tr>
                  <tr>
                    <td className='bold'>Comments</td>
                    <td>{result.stats?.commentCount || 0}</td>
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

export default SearchVolume;
