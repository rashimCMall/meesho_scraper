const axios = require('axios');
const cheerio = require('cheerio');
const { Parser } = require('json2csv');
const fs = require('fs');


(async () => {
  try {
    let pageNo = 1;
    const data = [];
    let found = true;

    while(found) {
      found = false;

      const response = await axios.get(`https://meesho.com/dresses-women/pl/gvn1o?page=${pageNo}`, {
        headers: {
          "Accept":" text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language":"en-US,en;q=0.5"
        },
        gzip:true,
      });
      const $ = cheerio.load(response.data);


      // Everything except last row
      $('div[class="sc-dkPtRN ProductList__GridCol-sc-8lnc8o-0 FjWWx jMkQHN"]').each(function (idx, el) {
        found = true;
        let img = $(el).find('noscript').html();
        if(img === null)
          img = $(el).find('img').attr('src');
        else
          img = $(img).attr('src');

        let name = $(el).find('p[class="Text__StyledText-sc-oo0kvp-0 bWSOET NewProductCard__ProductTitle_Desktop-sc-j0e7tu-4 cQhePS NewProductCard__ProductTitle_Desktop-sc-j0e7tu-4 cQhePS"]').text().trim();
        let price = $(el).find('h5[class="Text__StyledText-sc-oo0kvp-0 hiHdyy"]').text().trim();
        let discount = $(el).find('span[class="Text__StyledText-sc-oo0kvp-0 gClceh"]').text().replace(/\ (.*)/g,'');
        let rating = $(el).find('span[class="Rating__StyledPill-sc-5nayi4-0 klyAWP"]').text().trim();
        rating = (rating == "") ? "NULL" : rating;
        
        data.push({
          Image:img,
          Name:name,
          Price:price,
          Discount:discount,
          Rating:rating,
        });
      });

      // Last row
      $('div[class="sc-dkPtRN ProductList__GridCol-sc-8lnc8o-0 FjWWx fUGXjw"]').each(function (idx, el) {
        let img = $(el).find('noscript').html();
        if(img === null)
          img = $(el).find('img').attr('src');
        else
          img = $(img).attr('src');

        let name = $(el).find('p[class="Text__StyledText-sc-oo0kvp-0 bWSOET NewProductCard__ProductTitle_Desktop-sc-j0e7tu-4 cQhePS NewProductCard__ProductTitle_Desktop-sc-j0e7tu-4 cQhePS"]').text().trim();
        let price = $(el).find('h5[class="Text__StyledText-sc-oo0kvp-0 hiHdyy"]').text().trim();
        let discount = $(el).find('span[class="Text__StyledText-sc-oo0kvp-0 gClceh"]').text().replace(/\ (.*)/g,'');
        let rating = $(el).find('span[class="Rating__StyledPill-sc-5nayi4-0 klyAWP"]').text().trim();
        rating = (rating == "") ? "NULL" : rating;
        
        data.push({
          Image:img,
          Name:name,
          Price:price,
          Discount:discount,
          Rating:rating,
        });
      });

      console.log(`On Page No:${pageNo}`);
      pageNo += 1;
    }

    const parser = new Parser();
    const csv = parser.parse(data);

    fs.writeFileSync('./meesho_data.csv',csv,"utf-8"); 
  
  } catch (error) {
    console.error(error);
  }
})();