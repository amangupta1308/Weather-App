const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync('home.html', 'utf-8');

const replaceVal = (tempVal, oriVal) => {
    // console.log(oriVal.main.temp);
    let temp = tempVal.replace("{%tempval%}", oriVal.main.temp);
    // console.log(temp);
    temp = temp.replace("{%tempmin%}", oriVal.main.temp_min);
    // console.log(temp);
    temp = temp.replace("{%tempmax%}", oriVal.main.temp_max);
    temp = temp.replace("{%location%}", oriVal.name);
    temp = temp.replace("{%country%}", oriVal.sys.country);
    return temp;
}

const server = http.createServer((req,res) => {
    if(req.url === '/') {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=f9c37085320ac1005c79686bb6c822b4')
        .on('data', (chunk) => {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            console.log(arrData);
            const realTimeData = arrData.map((val) => { 
                return replaceVal(homeFile, val)
            }).join("");
            res.write(realTimeData);
        })
        .on('end', (err) => {
            if (err) return console.log('connection closed due to errors', err);
            res.end();
        });
    }
    else {
        res.writeHead(404);
        res.end("File not found!");
    }
});
server.listen(8000, "127.0.0.1");