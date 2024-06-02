import $ from 'cheerio';
import fs from 'node:fs/promises';

// https://pl.wikipedia.org/wiki/Wzory_znak%C3%B3w_i_sygna%C5%82%C3%B3w_drogowych_w_Polsce
// https://znaki-drogowe.pl/

//.replace(/[^a-z0-9-]/gi, '_').toLowerCase();

function sanitizeText(text) {
    return text.trim().replace(/[^a-z0-9-]/gi, '_');
}

function cleanText(text) {
    return text.trim().replace('\n', ' ').replace(/ +/gi, ' ').replace(/„”/gi, '').replace(/\/\\/gi, '_');
}

const wikiHtml = await fs.readFile('./wiki-page/Wzory znaków i sygnałów drogowych w Polsce – Wikipedia, wolna encyklopedia.html');
const $tree = $.load(wikiHtml);
const $signs = $tree('.gallerybox');
const data = $signs.map((i, el) => {
    const $idAndLabel = $tree(el).find('.gallerytext');
    const rawId = $idAndLabel.children().first().text();
    const id = sanitizeText(rawId);
    const label = cleanText($idAndLabel.text().replace(rawId, ''));
    const url = $tree(el).find('a').attr('href');

    return {
        id,
        label,
        url
    };
}).get();

await fs.writeFile('./signs/db.json', JSON.stringify(data, null, '  '));

let i = 0;

for (const item of data) {
    i++;
    console.log('Image', i);
    const svgPageResp = await fetch(item.url);
    const svgPage = await svgPageResp.text();
    const svgLink = $(svgPage).find('.fullImageLink').find('a').attr('href');
    const svgResp = await fetch('https://' + svgLink);
    const svgText = await svgResp.text();

    const svgFileName = './signs/images/' + item.id + '.svg';

    item.img = svgFileName;
    item.url2 = svgLink;


    fs.writeFile(svgFileName, svgText, 'utf8');
}


await fs.writeFile('./signs/db.json', JSON.stringify(data, null, '  '));

console.log('Done');