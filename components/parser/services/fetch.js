const axios = require('axios');
const cheerio = require('cheerio');

async function fetchData(searchTerm) {
    let searchUrl = 'https://www.google.com/search?q=' + searchTerm;
    let savedData = [];

    let options = {
        method: 'GET',
        headers: {
            'User-Agent': 'request',
            'Content-Type': 'text/html; charset=utf-8'
        }
    };

    const htmlRequest = await axios.get(searchUrl);
    const body = htmlRequest.data;

    let $ = cheerio.load(body);
    $('#main div').map((a, div) => {
        let href = $(div).find('a').attr('href');
        savedData.push(href)
    });
    return savedData;
}

module.exports = fetchData;