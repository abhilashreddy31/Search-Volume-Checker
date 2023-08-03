const API_KEY = 'AIzaSyDQNCbhk0QrrNuz_I2psmJ5Gub3VKWd_AY';
const keyword = 'how to tie a tie';

const searchVolumeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
  keyword
)}&key=${API_KEY}&maxResults=0`;

const fetchSearchVolume = async () => {
  try {
    const response = await axios.get(searchVolumeUrl);
    const totalResults = response.data.pageInfo.totalResults;
    return totalResults;
  } catch (error) {
    console.error('Error fetching search volume:', error);
    return 0;
  }
};

const searchVolume = await fetchSearchVolume();

console.log(`The search volume for the keyword "${keyword}" is ${searchVolume}`);
