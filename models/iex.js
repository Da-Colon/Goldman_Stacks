// const https = require('https');
const axios = require('axios');
const numeral = require('numeral');
// const fs = require('fs');

// SANDBOX URL
// https://sandbox.iexapis.com/...

// PRODUCTION URL
// https://cloud.iexapis.com/...

// PRODUCTION PUBLIC KEY = pk_fb66ab77a4b6406a838e0db01df0416c
// SANDBOX PUBLIC KEY = Tpk_8670b146a6084c8b9bba64c09c443eed


// Returns the stock price AND key financial stats for a single company
const getStockPrice = async(symbol) => {
    const { data } = await axios.get(`https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=pk_fb66ab77a4b6406a838e0db01df0416c`)

    data.high = numeral(data.high).format('$0,0.00');
    data.low = numeral(data.low).format('$0,0.00');
    data.latestPriceStr = numeral(data.latestPrice).format('$0,0.00');
    data.previousClose = numeral(data.previousClose).format('$0,0.00');
    data.changeStr = numeral(data.change).format('$0,0.00');
    data.changePercent = numeral(data.changePercent).format('0.0%');
    data.ytdChangeStr = numeral(data.ytdChange).format('0.0%');
    data.marketCap = numeral(data.marketCap).format('$0,0.0a');
    data.previousVolume = numeral(data.previousVolume).format('0,0.0a');
    data.week52High = numeral(data.week52High).format('$0,0.00');
    data.week52Low = numeral(data.week52Low).format('$0,0.00');

    return { data }
    // Includes a lot of good stats. We should be able to just use this for the company page;

};

const getSymbolList = async() => {
    // const { data } = await axios.get(`https://cloud.iexapis.com/stable/ref-data/symbols?token=pk_fb66ab77a4b6406a838e0db01df0416c`)
    // console.log(data);
    

    // let dataArray = []
    // for (obj of data) {
    //   dataArray.push(obj.symbol);
    // }
    // console.log(dataArray);

    // fs.writeFile('Exchange Symbols.txt', JSON.stringify(dataArray), (err) => {
    //   // throws an error, you could also catch it here
    //   if (err) throw err;
  
    //   // success case, the file was saved
    //   console.log('Symbols saved!');
    // });


};

// Returns the latest 5 articles for a single company
const getSingleCompanyNews = async(symbol) => {

    const { data } = await axios.get(`https://sandbox.iexapis.com/stable/stock/${symbol}/news/last/5?token=Tpk_8670b146a6084c8b9bba64c09c443eed`)
        // console.log(data)
    return { data }

}

// Returns the latest article for each ticker in the array
const getMultipleCompanyNews = async(tickerArray) => {

    let tickerString = '';
    const arrLength = tickerArray.length;

    // Builds the string of ticker symbols
    tickerArray.forEach((ticker) => {
            if (ticker !== 'USERCASH') {
                tickerString += ticker;
                !(tickerArray.indexOf(ticker) === arrLength - 1) && (tickerString += ',');
            }
        })
        // console.log(tickerString);

    // Fetches the news for all symbols passed in
    try {
        const { data } = await axios.get(`https://sandbox.iexapis.com/stable/stock/market/batch?symbols=${tickerString}&types=news&last=1&token=Tpk_8670b146a6084c8b9bba64c09c443eed`);
        // console.log(data);
        // console.log(data.AAPL)
        return data;
    } catch (err) {
        console.log('Error fetching news for multiple tickers.');
        console.log(err);
        return;
    }

}

// Returns the current stock price for each ticker in the array
const getMultipleCompanyQuotes = async(tickerArray) => {

    let tickerString = '';
    const arrLength = tickerArray.length;

    // Builds the string of ticker symbols
    tickerArray.forEach((ticker) => {
            if (ticker !== 'USERCASH') {
                tickerString += ticker;
                !(tickerArray.indexOf(ticker) === arrLength - 1) && (tickerString += ',');
            }
        })
        // console.log(tickerString);

    // Fetches the news for all symbols passed in
    try {
        const { data } = await axios.get(`https://sandbox.iexapis.com/stable/stock/market/batch?symbols=${tickerString}&types=quote&token=Tpk_8670b146a6084c8b9bba64c09c443eed`);
        // console.log(data);
        // console.log(data.AAPL)
        return data;
    } catch (err) {
        console.log('Error fetching quotes for multiple tickers.');
        console.log(err);
        return;
    }

}

// Returns the designated number of top business articles
const getTopBusinessNews = async(numOfArticles) => {

    const { data } = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&category=business&pageSize=${numOfArticles}&apiKey=335ef27328fb481aa97916cb3c338206`)

    for (let item of data.articles) {
        // console.log(item.title.replace(/^(.{45}[^\s]*).*/, "$1") + "...");
        item.title = item.title.replace(/^(.{45}[^\s]*).*/, "$1") + "...";
    };
    // console.log(data);
    // "this is a longish string of text".replace(/^(.{11}[^\s]*).*/, "$1"); 

    return { data };

}

// Returns the PERCENT CHANGE for the 4 most active companies
const getTrendingCompanies = async() => {

    // let trendingCompanies = {}

    const { data } = await axios.get(`https://sandbox.iexapis.com/stable/stock/market/list/mostactive?listLimit=5&token=Tpk_8670b146a6084c8b9bba64c09c443eed`)
    console.log(data);
    return { data };



    // data.forEach(item => {
    //     trendingCompanies[item.symbol] = item.changePercent;
    // })

    // console.log(trendingCompanies);

    // return trendingCompanies;

}

const getTopEarningCompanies = async() => {

    const { data } = await axios.get(`https://sandbox.iexapis.com/stable/stock/market/list/gainers?listLimit=4&token=Tpk_8670b146a6084c8b9bba64c09c443eed`);
    return { data };
}

// getTopBusinessNews(5);
// getSymbolList();

module.exports = {
    getStockPrice,
    getSingleCompanyNews,
    getMultipleCompanyNews,
    getTopBusinessNews,
    getMultipleCompanyQuotes,
    getTrendingCompanies,
    getTopEarningCompanies
}

// getStockPrice('IWM');

// getSingleCompanyNews('FB');

// getMultipleCompanyNews(['AAPL', 'GOOG']);

// getTopBusinessNews(2);

// getMultipleCompanyQuotes(['AAPL', 'GOOG', 'FB']);

// getTrendingCompanies();




// getKeyStats('AAPL');
// getStockPrice RESPONSE
// { symbol: 'AAPL',
//   companyName: 'Apple, Inc.',
//   primaryExchange: 'NASDAQ',
//   calculationPrice: 'tops',
//   open: null,
//   openTime: null,
//   close: null,
//   closeTime: null,
//   high: null,
//   low: null,
//   latestPrice: 245.115,
//   latestSource: 'IEX real time price',
//   latestTime: '11:20:14 AM',
//   latestUpdate: 1572016814454,
//   latestVolume: null,
//   iexRealtimePrice: 245.115,
//   iexRealtimeSize: 150,
//   iexLastUpdated: 1572016814454,
//   delayedPrice: null,
//   delayedPriceTime: null,
//   extendedPrice: null,
//   extendedChange: null,
//   extendedChangePercent: null,
//   extendedPriceTime: null,
//   previousClose: 243.58,
//   previousVolume: 17916255,
//   change: 1.535,
//   changePercent: 0.0063,
//   volume: null,
//   iexMarketPercent: 0.014403088007883695,
//   iexVolume: 84478,
//   avgTotalVolume: 26924247,
//   iexBidPrice: 232.5,
//   iexBidSize: 100,
//   iexAskPrice: 246.78,
//   iexAskSize: 100,
//   marketCap: 1107718805700,
//   peRatio: 20.73,
//   week52High: 245.115,
//   week52Low: 142,
//   ytdChange: 0.548727,
//   lastTradeTime: 1572016814454,
//   isUSMarketOpen: true }


// getSingleCompanyNews RESPONSE
// [ { datetime: 1571997000000,
//   headline:
//    'Facebook, Apple, and 3 Other Big Names Reporting Earnings Next Week',
//   source: 'Barron\'s',
//   url:
//    'https://cloud.iexapis.com/v1/news/article/da2dd787-75d9-4b39-be6a-c6a54e83b99b',
//   summary:
//    'Earnings season ramps up next week with a slate of heavy hitters. Facebook, Apple, GE, Alphabet, and Exxon Mobil all report earnings.',
//   related: 'AAPL',
//   image:
//    'https://cloud.iexapis.com/v1/news/image/da2dd787-75d9-4b39-be6a-c6a54e83b99b',
//   lang: 'en',
//   hasPaywall: true },
// { datetime: 1571957400000,
//   headline:
//    '\'Why is my iPhone not sending messages?\': How to troubleshoot iPhone messaging issues',
//   source: 'Business Insider',
//   url:
//    'https://cloud.iexapis.com/v1/news/article/0f0541b3-f110-43e4-8b3d-12b312de7d39',
//   summary:
//    'If your iPhone is not sending messages, first make sure your phone has service, as the issue may be with the Wi-Fi or cellular network, not your device itself. Check in your iPhone \'s Settings app that various messaging options are turned on so that your phone can dispatch texts if iMessage fails. Turning your iPhone off and back on again can usually refresh the software and restore better signal connections, enabling your messages to send once again. Visit Business Insider\'s homepage for more stories . There are few sadder phrases than those two little red words your iPhone displays when a message fails to send: "Not Delivered." Those words, along with that exclamation point in a circle, mean your charming photo or witty comment didn\'t go through. Fortunately, as in life, with the iPhone : the simplest answer is usually the correct one. If your iPhone is not sending messages, first make sure you have a connection to either a Wi-Fi or cellular network, and make sure your phone is not set to Airplane Mode .',
//   related: 'AAPL',
//   image:
//    'https://cloud.iexapis.com/v1/news/image/0f0541b3-f110-43e4-8b3d-12b312de7d39',
//   lang: 'en',
//   hasPaywall: false },
// { datetime: 1571945256000,
//   headline: 'Apple\'s iPhone XR Was Top-Selling Model in Q3: Report',
//   source: 'The Street',
//   url:
//    'https://cloud.iexapis.com/v1/news/article/d42f7680-2811-4239-8f1a-2fd697f7f64f',
//   summary:
//    'The iPhone XR outsold recently released iPhone 11 models, according to a market intelligence firm, which suggests that iPhone average selling prices are continuing to fall….AAPL',
//   related: 'AAPL',
//   image:
//    'https://cloud.iexapis.com/v1/news/image/d42f7680-2811-4239-8f1a-2fd697f7f64f',
//   lang: 'en',
//   hasPaywall: false },
// { datetime: 1571942340000,
//   headline:
//    'Apple Stock Could Push Even Higher on iPhone Sales and Services',
//   source: 'Barron\'s',
//   url:
//    'https://cloud.iexapis.com/v1/news/article/286781df-d7c6-4d50-852c-89fd68f1f78a',
//   summary:
//    'Apple stock has roared back from a rough second half last year to record highs in 2019. There are reasons to be optimistic about iPhone 11 sales UBS says.',
//   related: 'AAPL',
//   image:
//    'https://cloud.iexapis.com/v1/news/image/286781df-d7c6-4d50-852c-89fd68f1f78a',
//   lang: 'en',
//   hasPaywall: true },
// { datetime: 1571940420000,
//   headline: 'Apple looks strong in China ahead of earnings, says UBS',
//   source: 'MarketWatch',
//   url:
//    'https://cloud.iexapis.com/v1/news/article/0d1e7d0f-27ee-4157-8771-fc7ffb666f23',
//   summary:
//    'Apple Inc. got a big vote of confidence from UBS, but it may not be enough to power shares toward yet another record high.',
//   related: 'AAPL',
//   image:
//    'https://cloud.iexapis.com/v1/news/image/0d1e7d0f-27ee-4157-8771-fc7ffb666f23',
//   lang: 'en',
//   hasPaywall: false } ]


// getMultipleCompanyNews RESPONSE
// { AAPL: { news: [ [Object] ] }, GOOG: { news: [ [Object] ] } }
// EXAMPLE NEWS OBJECT
// { news:
//    [ { datetime: 1573378620086,
//        headline:
//         'Rpeo fo lHherisvnolaatLeIts eIstnl,s p GorBTreot Or r5iy  ASeptui e ut  f',
//        source: 'ror\'snBa',
//        url:
//         '7fd4.ste/2rde/-/a//hd7o-8c04:90iu2c7ia601d2vb/1sltwdpbs-ti8el8cn1of0pcm-4aa.xc',
//        summary:
//         ' c vi  r el stup,tseait bbeoolos,lhr soainne  oemtetAsgse  . r Brt5t t.fe oe emlntuGkcaieirdi intpy,h’worn ',
//        related: 'AALP',
//        image:
//         't4n0s-w2u//am4/1-t6pvd7.4:2/ix80c-cm/a11ld028g-8s9s/eea.f7dioacbcd0iepbdh7of',
//        lang: 'en',
//        hasPaywall: true } ] }




// getTopBusinessNews RESPONSE
// { status: 'ok',
//   totalResults: 70,
//   articles:
//    [ { source: [Object],
//        author: 'Jordan Valinsky, CNN Business',
//        title:
//         'Jeff Bezos is dangerously close to losing his title as the \'world\'s richest person\' - CNN',
//        description:
//         'Pour one out for Jeff Bezos because the Amazon founder is precariously close to losing his title of world\'s richest person to Bill Gates.',
//        url:
//         'https://www.cnn.com/2019/10/25/business/jeff-bezos-worlds-richest-person-title-trnd/index.html',
//        urlToImage:
//         'https://cdn.cnn.com/cnnnext/dam/assets/190504113001-jeff-bezos-file-super-tease.jpg',
//        publishedAt: '2019-10-25T16:19:00Z',
//        content: null },
//      { source: [Object],
//        author: 'MarketWatch',
//        title:
//         'S&P 500 on track for all-time closing high as stocks edge higher - MarketWatch',
//        description:
//         'Stocks extended modest gains Friday, with the S&P 500 trading above its all-time closing high of 3,025.86 set on July 26. The index traded as high as...',
//        url:
//         'https://www.marketwatch.com/story/sp-500-on-track-for-all-time-closing-high-as-stocks-edge-higher-2019-10-25',
//        urlToImage: 'https://mw3.wsj.net/mw5/content/logos/mw_logo_social.png',
//        publishedAt: '2019-10-25T15:34:00Z',
//        content:
//         'Stocks extended modest gains Friday, with the S&amp;P 500 trading above its all-time closing high of 3,025.86 set on July 26. The index traded as high as 3,027.35, shy of its intraday record of 3,027.98, also set on July 26. It recent action, the S&amp;P was … [+227 chars]' } ] }