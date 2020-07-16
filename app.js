const OpenWeatherMapHelper = require("openweathermap-node");
var moment = require('moment');
var mqtt = require('mqtt');
var mqttServer = 'mqtt://test.mosquitto.org';
var MQTTPattern = require("mqtt-pattern");
var client = mqtt.connect(mqttServer)
var pattern = "+topic/#data";
const fs = require('fs');
const yaml = require('js-yaml')

try {
    let fileContents = fs.readFileSync('/opt/zigbee2mqtt/data/configuration.yaml', 'utf8');
    let data = yaml.safeLoad(fileContents);

    console.log(data);
} catch (e) {
    console.log(e);
}

const helper = new OpenWeatherMapHelper({
    APPID: 'd6b34e26dfcac4ad9d289d2f3c1ef1fc',
    units: "imperial"
});

// helper.getCurrentWeatherByCityName("Bangkok", (err, currentWeather) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(currentWeather);
//     }
// });
client.on('connect', function() {
    client.subscribe('zigbee2mqtt-hh/#', function(err) {
        if (!err) {
            console.log(err);
        }
    })
})

client.on('message', function(topic, message) {
    console.log(topic);
    var params = MQTTPattern.exec(pattern, topic);
    console.log(params);
    if (params.topic === 'zigbee2mqtt-hh') {
        if (params.data[1] === 'state') {
            console.log(message.toString());
        } else {
            var jsonMsg = JSON.parse(message);
            console.log(jsonMsg);
        }
    }

})

helper.getCurrentWeatherByGeoCoordinates(13.69, 101.07, (err, currentWeather) => {
    if (err) {
        console.log(err);
    } else {
        console.log(currentWeather);
        var jsonMsg = currentWeather;
        //console.log(jsonMsg.sys.sunrise);
        const sunrise = parseInt(jsonMsg.sys.sunrise, 10);
        const sunset = parseInt(jsonMsg.sys.sunset, 10);
        const time = parseInt(moment().utc().format('X'));
        //const time = 1594900216;
        // var dif = sun - time;
        console.log(time);
        console.log(sunrise);
        console.log(sunset);
        if (time < sunrise || sunset < time) {
            console.log("NIGHT");
            var replyMsg = { "msg": "night" };
            client.publish('zigbee2mqtt-hh/date', JSON.stringify(replyMsg));
        } else if (sunrise <= time && sunset >= time) {
            console.log("DAY");
            var replyMsg = { "msg": "day" };
            client.publish('zigbee2mqtt-hh/date', JSON.stringify(replyMsg));
        }
    }
});