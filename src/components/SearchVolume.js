import React, { useState } from 'react';
import axios from 'axios';
import './style.css';

const SearchVolume = () => {
  const API_KEY = 'AIzaSyChWlVokkrjHosTGxlkazIQ3_e5S8TxYWE'; 
  const maxResults = 30;

  const [keyword, setKeyword] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [results, setResults] = useState([]);
  const [searchVolume, setSearchVolume] = useState(0);

  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSearch = async () => {
    if (!keyword || !month || !year) {
      alert('Please enter a keyword, month, and year.');
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

     
      const searchVolumeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        keyword
      )}&key=${API_KEY}&publishedAfter=${year}-${month}-01T00%3A00%3A00Z&publishedBefore=${year}-${month}-31T23%3A59%3A59Z`;
      const volumeResponse = await axios.get(searchVolumeUrl);
      const totalResults = volumeResponse.data.pageInfo.totalResults;
      setSearchVolume(totalResults);

      
    } catch (error) {
      console.error('Error fetching search results or statistics:', error);
      alert('Failed to fetch search results. Please try again later.');
    }
  };

  return (
    <div className='container'>
      <h1>YouTube Search Volume Checker</h1>
      <div className='search'>
        <input type='text' value={keyword} onChange={handleInputChange} placeholder='Search' /><br></br>
        <input type='text' placeholder='Enter Month' value={month} onChange={(e) => setMonth(e.target.value)}/><br></br>
        <input type='text' placeholder='Enter Year' value={year} onChange={(e) => setYear(e.target.value)} /><br></br>
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
