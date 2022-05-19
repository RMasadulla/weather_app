const http = require("http");
const fs = require("fs");
const requests = require("requests");


const homeFile = fs.readFileSync("main.html", "utf-8");

const replceValue = (tempVal, mainVal) => {
    let temperature = tempVal.replace("{%currentTemp%}",((mainVal.main.temp)-273.15).toPrecision(3));
    temperature = temperature.replace("{%minTemp%}", ((mainVal.main.temp_min)-273.15).toPrecision(3));
    temperature = temperature.replace("{%maxTemp%}", ((mainVal.main.temp_max)-273.15).toPrecision(3));
    temperature = temperature.replace("{%location%}", mainVal.name);
    temperature = temperature.replace("{%country%}", mainVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}", mainVal.weather[0].main);
    return temperature;
}


const server = http.createServer((req, res) => {
    if (req.url = "/") {
        requests(`http://api.openweathermap.org/data/2.5/weather?q=Rajshahi&appid=99bf71bdaa6f6d42221a0b06d239dead`)
            .on("data", (chunk) => {
                const objData = JSON.parse(chunk);
                const arrayData = [objData];
                const realTimeData = arrayData.map((apiData) => replceValue(homeFile,apiData)).join("");
               res.write(realTimeData)
            })
            .on("end", (err) => {
                if (err) return console.log(err);
                res.end();
            });
    };
    
});

server.listen(9005, "127.0.0.1",(err)=>{
    console.log("port is ready 9005")
});




