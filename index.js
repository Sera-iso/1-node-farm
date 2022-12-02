const fs = require("fs");
const http = require("http");
const url = require("url");

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

// CREATE SERVER
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName); 
    output = output.replace(/{%IMAGE%}/g, product.image); 
    output = output.replace(/{%PRICE%}/g, product.price); 
    output = output.replace(/{%FROM%}/g, product.from); 
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients); 
    output = output.replace(/{%QUANTITY%}/g, product.quantity); 
    output = output.replace(/{%DESCRIPTION%}/g, product.description); 
    output = output.replace(/{%ID%}/g, product.id); 
    
    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
    const pathName = req.url;

    // Overview page
    if (pathName === '/' || pathName === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html'});
        const cardHtml = dataObject.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
        res.end(output);

    // Product page
    } else if (pathName === '/product') {
        res.end('This is a product');
    
    // API
    } else if (pathName === '/api') {
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
