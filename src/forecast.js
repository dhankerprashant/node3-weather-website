const request = require('request')

console.log(process.argv)
const location = process.argv[2]

function onErr(err) {
    console.log(err);
    return 1;
}

const getWeather = (longitude, latitude, callback) => {
    const url = 'https://api.darksky.net/forecast/5f291c502e3c19a385844c237845cc71/' + longitude + ',' + latitude
    console.log('URL to call --> ' + url)
    request({ url: url, json: true }, (error, response) => {
        if (error) {
            console.log('There seems to be some error during the getWeather() service connection..Please look into logs.')
        } else {
            const celciusTemp = (response.body.currently.temperature - 32) * 5 / 9;
            callback(response, 'Currently temperature is ' + celciusTemp.toFixed(2) + ' with ' + response.body.currently.precipProbability*100 + '% chances of rain.')   
        }
    })
}

const geoCode = (location, callback) => {
    let data = {}
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(location) + '.json?access_token=pk.eyJ1IjoicHJhc2hhbnRkaGFua2VyIiwiYSI6ImNrNHBzcHpyejA5dGszampzODA1NTNpOXgifQ.2tse5FzXOjYVNfYRrjOsFQ'
    console.log('Geo code URL --> ' + url)

    request({ url, json: true }, (err, response) => {
        console.log(response.statusCode)
        if (response && response.statusCode === 200) {
            const resultsArray = response.body.features
            let resultsList = ''
            resultsArray.forEach(currentItem => {
                resultsList += currentItem.place_name + ' \n'
            });
            console.log(resultsList)
            data.longitude = response.body.features[0].center[1]
            data.lattitude = response.body.features[0].center[0]
            console.log('data[longitude,lattitude] :: ' + '[' + data.longitude + ', ' + data.lattitude + ']')
        } else if (response && response.statusCode != 200) {
            console.log('Error for inside function: ' + response.body.message)
        } else {
            console.log('Error for inside function: ' + err)
        }
        callback(err, data)
    })
}

geoCode(location, (error, {longitude, lattitude}) => {
    console.log('Searching data for ' + location)
    if (error) {
        console.log('There seems to have an error in method geoCode()')
    } else {
        getWeather(longitude, lattitude, (d) => {
            console.log(d)
        })   
    }
})

module.exports = {
    geoCode: geoCode,
    getWeather: getWeather
}