const express = require('express')

// 2. express() เป็นฟังค์ชั่น และ assign ไว้ที่ตัวแปร app
const app = express()
const OpenWeatherMapHelper = require("openweathermap-node");
const helper = new OpenWeatherMapHelper({
    APPID: 'd6b34e26dfcac4ad9d289d2f3c1ef1fc',
    units: "imperial"
});


app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = req.query
    console.log(query.test)
    res.send(`<h1>Helldo User, ${id}</h1>`);

})
app.get('/', function(req, res) {
    res.send('Hello World')
})
app.get('/about', (req, res) => {
        res.send('about')
        helper.getCurrentWeatherByGeoCoordinates(13.69, 101.07, (err, currentWeather) => {
            if (err) {
                console.log(err);
            } else {
                console.log(currentWeather);
                // res.send(currentWeather)
            }
        });
    })
    // 4. listen() เป็น function คล้ายๆ http module เพื่อเอาไว้ระบุว่า server จะรัน ด้วย port อะไร
app.listen(3000)