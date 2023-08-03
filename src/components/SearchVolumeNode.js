const axios = require('axios');
const readline = require('readline');

const API_KEY = 'AIzaSyDjK25fVYb4nLKnZpgor8-Eam7jSi8sgTI';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the keyword you want to check the search volume for: ', (keyword) => {
  axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      part: 'snippet',
      q: keyword,
      key: API_KEY,
    },
  })
  .then(response => {
   
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error making API request:', error);
  });

  rl.close();
});
