const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require(`${__dirname}/starter/modules/replace-template.js`);

/*
//Blocking, synchronous way
const textInput = fs.readFileSync("starter/txt/input.txt", "utf-8");
const textOutput = `This is what we know about avocado: ${textInput}.\nCreated on ${Date.now()}`;
fs.writeFileSync("starter/txt/output.txt", textOutput);

//Non-Blocking, asynchronous way
fs.readFile("starter/txt/start.txt", "utf-8", (err, data1) => {
    if (err) return console.log("error 💥")
  fs.readFile(`starter/txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile(`starter/txt/append.txt`, "utf-8", (err, data3) => {
      console.log(data3);

      fs.writeFile('starter/txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
        console.log("File written! 🤡")
      })
    });
  });
});
*/

const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

// CREATE SERVER
const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true)

    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html'});
        const cardHtml = dataObject.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
        res.end(output);

    // Product page
    } else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html'});
        const product = dataObject[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    
    // API
    } else if (pathname === '/api') {
        // create an /api route that if hit will read `data` synchronouly and send it back in a object in a response.
        res.writeHead(200, { 'Content-type': 'application/json'});
        res.end(data);
    
    // Not found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-header': 'hello-world'
        });
        res.end('Page not found!');
    }
});

// START SERVER
server.listen(8000,'127.0.0.1', () => {
    console.log('Listening to requests on port 8000')
})
