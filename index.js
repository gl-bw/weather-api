const express = require("express");
const app = express();
const DarkSky = require('dark-sky')
const request = require('request');


require('dotenv').config()
const darksky = new DarkSky(process.env.DARK_SKY_API)
const gmap = process.env.GMAP_API



const PORT = 5000;
const DELAY = 2500;

app.get("/", (req, res) => {
    res.send({ hello: "world" });
});


app.get('/api/geo/:location', function(req, res) {
    var location = req.params.location;
    request({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&key=' + gmap,
        json: true
    }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            res.status(200).json(body.results[0]);
            console.log(body.results[0])
        } else {
            res.status(404)
        }
    });
});

app.use('/api/weather/:latitude/:longitude', async (req, res, next) => {
    try {
        const longitude = req.params.longitude
        const latitude = req.params.latitude
        const forecast = await darksky
            .options({
                latitude,
                longitude,
                language: 'en'
            })
            .get()
        res.status(200).json(forecast)
        console.log(`Weather retrieved for ${latitude},${longitude}`)
    } catch (err) {
        next(err)
    }
})


app.listen(PORT, function() {
    console.log(`App listening on port ${PORT}`);
});