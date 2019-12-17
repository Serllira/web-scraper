const axios = require('axios');
const cheerio = require('cheerio');

async function fetchStuff(url) {
    let savedStuff = {};

    let options = {
        method: 'GET',
        headers: {
            'User-Agent': 'request',
            'Content-Type': 'text/html; charset=utf-8'
        }
    };

    const htmlRequest = await axios.get(url);
    const body = htmlRequest.data;

    if (!body) {
        return savedStuff;
    }

    let $ = cheerio.load(body);

    let name = $('h1[itemprop=name]').text();
    let name1 = $('strong[itemprop=name]').text();
    let name2 = $('span[itemprop=name]').text();
    if (name) {
        savedStuff.nombre = name
    } else {
        if (name1) {
            savedStuff.nombre = name1;
        } else {
            if (name2) {
                savedStuff.nombre = name2;
            }
        }
    }

    let price = $('span[itemprop=price]').text();
    if (price) {
        savedStuff.precio = price
    }

    let description = $('div[itemprop=description]').text();
    let description1 = $('span[itemprop=description]').text();
    let description2 = $('p[itemprop=description]').text();
    if (description) {
        savedStuff.descripcion = description
    } else {
        if (description1) {
            savedStuff.descripcion = description1
        } else {
            if (description2) {
                savedStuff.descripcion = description2
            }
        }
    }

    let image = $('img[itemprop=image]').attr('src');
    if (image) {
        savedStuff.imagen = image
    }

    return savedStuff;
}

module.exports = fetchStuff;