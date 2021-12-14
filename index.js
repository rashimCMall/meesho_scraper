const axios = require('axios');
const fs = require("fs");
const { Parser } = require('json2csv');
const nodeCron = require('node-cron')
const mongodb = require('mongodb')
const cheerio = require('cheerio');

// "URL","Image","Name","Brand","Capacity","Star","Rating","Price","Discount"

const url = 'mongodb+srv://vishalCitymall:vishal12345@cluster0.v408j.mongodb.net/test';
var dbConn;
var dbClient;


const categories = {
  "meeshoSarees":[
    "https://meesho.com/sarees/pl/f40kj"
  ],
  "meeshoWomenEthnics":[
    "https://meesho.com/ethnicwear-women/pl/5v80d"
  ],
  "meeshoKurtis":[
    "https://meesho.com/women-kurtis/pl/dn6ft"
  ],
  "meeshoSuitsAndDressMaterials":[
    "https://meesho.com/women-suits-dress-materials/pl/yvqy7"
  ],
  "meeshoOtherEthnics":[
    "https://meesho.com/blouses/pl/6ydto",
    "https://meesho.com/dupattas/pl/ngi4r",
    "https://meesho.com/lehengas/pl/bjaoq",
    "https://meesho.com/gowns-women/pl/qpgtc",
    "https://meesho.com/ethnic-bottomwear-women/pl/i0b9p"
  ],
  "meeshoWomenTopwear":[
    "https://meesho.com/dresses-women/pl/gvn1o",
    "https://meesho.com/tops-ladies/pl/nk8v6",
    "https://meesho.com/sweaters-women/pl/9cudf",
    "https://meesho.com/jumpsuits-women/pl/yzfmv",
  ],
  "meeshoWomenBottomwear":[
    "https://meesho.com/jeans-women/pl/odur2",
    "https://meesho.com/jeggings/pl/hxn7z",
    "https://meesho.com/palazzo-pants/pl/g7w52",
    "https://meesho.com/shorts-women/pl/so93g",
    "https://meesho.com/skirts-ladies/pl/78un4",
  ],
  "meeshoWomenInnerwear":[
    "https://meesho.com/ladies-bra/pl/mgqo1",
    "https://meesho.com/briefs-women/pl/r62y9",
  ],
  "meeshoWomenSleepwear":[
    "https://meesho.com/nightdresses-women/pl/9ytk6",
    "https://meesho.com/babydoll-dress/pl/p6frw",
  ],
  "meeshoJewellery":[
    "https://meesho.com/jewellery-sets-women/pl/lkioo",
    "https://meesho.com/mangalsutras/pl/z3ts4",
    "https://meesho.com/earrings-women/pl/6a15h",
    "https://meesho.com/stud-earrings-women/pl/eq60b",
    "https://meesho.com/bangles-women/pl/iuz00",
    "https://meesho.com/necklaces/pl/2zphn",
    "https://meesho.com/rings-women/pl/ls467",
    "https://meesho.com/anklets-payal/pl/azafo",
  ],
  "meeshoWomenAccessory":[
    "https://meesho.com/bags-ladies/pl/p7vbp",
    "https://meesho.com/women-watches/pl/ok5et",
    "https://meesho.com/hair-accessories-women/pl/0buu2",
    "https://meesho.com/sunglasses-women/pl/kn07d",
    "https://meesho.com/socks-women/pl/4kpzc",
  ],
  "meeshoMenTopwear":[
    "https://meesho.com/topwear-men/pl/zcm6l"
  ],
  "meeshoMenBottomwear":[
    "https://meesho.com/track-pants-men/pl/k7nrc",
    "https://meesho.com/jeans-men/pl/k7hey",
    "https://meesho.com/trousers-men/pl/0l3h0",
  ],
  "meeshoMenAccessory":[
    "https://meesho.com/accessories-men/pl/3z79k",
  ],
  "meeshoMenFootwear":[
    "https://meesho.com/sports-shoes-men/pl/4dxfc",
    "https://meesho.com/casual-shoes-men/pl/fdk15",
    "https://meesho.com/formal-shoes-men/pl/g2mfq",
    "https://meesho.com/sandals-men/pl/hbxix",
  ],
  "meeshoMenEthnicwear":[
    "https://meesho.com/men-kurtas/pl/xdw3j",
    "https://meesho.com/ethnic-jackets-men/pl/aeghj",
  ],
  "meeshoMenInnerAndSleepwear":[
    "https://meesho.com/inner-sleepwear-men/pl/2qdtt",
  ],
  "meeshoMakeup":[
    "https://meesho.com/face-makeup/pl/jtes8",
    "https://meesho.com/eye-makeup/pl/rvvy0",
    "https://meesho.com/lips-makeup/pl/kgkw5",
    "https://meesho.com/nails-makeup/pl/uzlxp",
  ],
  "meeshoWellness":[
    "https://meesho.com/sanitizers/pl/n5ikc",
    "https://meesho.com/oral-care/pl/djz1j",
    "https://meesho.com/feminine-hygiene/pl/nf5to",
  ],
  "meeshoWomenFootwear":[
    "https://meesho.com/flats-women/pl/1nopj",
    "https://meesho.com/bellies/pl/4q1ca",
    "https://meesho.com/jutti/pl/qo274",
  ],
  "meeshoWomenBags":[
    "https://meesho.com/bags-ladies/pl/p7vbp",
  ],
  "meeshoMenBags":[
    "https://meesho.com/bags-backpacks-men/pl/wn210",
  ],

  "meeshoHomeFurnishing":[
    "https://meesho.com/bedsheets/pl/fkij1",
    "https://meesho.com/door-bath-mats/pl/tpbn5",
    "https://meesho.com/curtains-sheers/pl/cyp3m",
    "https://meesho.com/cushion-covers/pl/27666",
    "https://meesho.com/mattress-protectors/pl/mis89",
  ],
  "meeshoHomeDecor":[
    "https://meesho.com/home-decor/pl/vplsg",
  ],
  "meeshoKitchenAndDining":[
    "https://meesho.com/kitchen-storage/pl/vkrul",
    "https://meesho.com/cookware-bakeware/pl/xvn9n",
  ],
  "meeshoToysAndAccessories":[
    "https://meesho.com/soft-toys-kids/pl/b0ko9",
    "https://meesho.com/footwear-kids/pl/2hpea",
    "https://meesho.com/stationery-items/pl/7auko",
    "https://meesho.com/watches-kids/pl/gmtps",
    "https://meesho.com/bags-kids/pl/hrhjd",
  ],
  "meeshoInfant":[
    "https://meesho.com/rompers/pl/153ph",
  ],
  "meeshoBoysAndGirls":[
    "https://meesho.com/dresses-kids/pl/dexba",
  ],
  "meeshoBabyCare":[
    "https://meesho.com/baby-care/pl/refn1",
  ],
  "meeshoMobileAndAccessories":[
    "https://meesho.com/mobiles-and-accessories/pl/9y6n7",
  ],
  "meeshoAppliances":[
    "https://meesho.com/appliances/pl/5yuug",
  ],
}


async function getData() {
  try {

    const client = await mongodb.MongoClient.connect(url, {
      useUnifiedTopology: true,
    })
    console.log('DB Connected!');
    dbConn = await client.db();
    dbClient = client;

    for(const category in categories) {
      const pages = categories[category];

      console.log('Category is:', category);
      let data = [];
      for(const page of pages) {

        let pageNo = 1;
        let found = true;
        console.log('Page URL is:',page);

        while(found && pageNo<=50) {
          found = false;
    
          const response = await axios.get(`${page}?page=${pageNo}`, {
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

            let url = 'https://meesho.com'+$(el).children(0).attr('href');
            let img = $(el).find('noscript').html();
            if(img === null)
              img = $(el).find('img').attr('src');
            else
              img = $(img).attr('src');
    
            let name = $(el).find('p[class="Text__StyledText-sc-oo0kvp-0 bWSOET NewProductCard__ProductTitle_Desktop-sc-j0e7tu-4 cQhePS NewProductCard__ProductTitle_Desktop-sc-j0e7tu-4 cQhePS"]').text().trim();
            let price = $(el).find('h5[class="Text__StyledText-sc-oo0kvp-0 hiHdyy"]').text().trim();
            let discount = $(el).find('span[class="Text__StyledText-sc-oo0kvp-0 lnonyH"]').text().replace(/\ (.*)/g,'');
            let rating = $(el).find('span[class="Rating__StyledPill-sc-5nayi4-0 klyAWP"]').text().trim();
            rating = (rating == "") ? "NULL" : rating;
            
            data.push({
              URL: url,
              Image:img,
              Name:name,
              Price:price,
              Discount:discount,
              Rating:rating,
            });
          });
    
          // Last row
          $('div[class="sc-dkPtRN ProductList__GridCol-sc-8lnc8o-0 FjWWx fUGXjw"]').each(function (idx, el) {
            
            let url = 'https://meesho.com'+$(el).children(0).attr('href');
            let img = $(el).find('noscript').html();
            if(img === null)
              img = $(el).find('img').attr('src');
            else
              img = $(img).attr('src');
    
            let name = $(el).find('p[class="Text__StyledText-sc-oo0kvp-0 bWSOET NewProductCard__ProductTitle_Desktop-sc-j0e7tu-4 cQhePS NewProductCard__ProductTitle_Desktop-sc-j0e7tu-4 cQhePS"]').text().trim();
            let price = $(el).find('h5[class="Text__StyledText-sc-oo0kvp-0 hiHdyy"]').text().trim();
            let discount = $(el).find('span[class="Text__StyledText-sc-oo0kvp-0 lnonyH"]').text().replace(/\ (.*)/g,'');
            let rating = $(el).find('span[class="Rating__StyledPill-sc-5nayi4-0 klyAWP"]').text().trim();
            rating = (rating == "") ? "NULL" : rating;
            
            data.push({
              URL: url,
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
      }

      // const parser = new Parser();
      // const csv = parser.parse(data);
      // fs.writeFileSync('./meesho_data.csv',csv,"utf-8"); 


      // db query goes here...
      console.log('Inserting in Database...');
      const collectionName = category;
      const collection = dbConn.collection(collectionName);
  
      await collection.deleteMany({});
      const result = await collection.insertMany(data);
      console.log('Number of documents inserted: ' + result.insertedCount,'\n\n');
      
    }
    dbClient.close();
  
  } catch (error) {
    console.error(error);
  }
};

nodeCron.schedule("0 0 */1 * *", getData);
// getData();