import { convertKelvinToUnit, fetchEndpointData } from "./miscellaneous.js";
// This section contains all the code that fetches and uses the open weather data for the specified location.

let temperatureUnit = 'celcius';
/* Retrieves and returns the weather data associated with the given coordinates */
async function retrieveCityWeatherData(cLat, cLong){
    let weatherData = "";
    try{
        weatherData = fetchEndpointData(`https://api.openweathermap.org/data/3.0/onecall?lat=${cLat}&lon=${cLong}&exclude=alerts,minutely,hourly&appid=3c7bc9f835d589478c313a48f04509d2`).then(weatherData => weatherData);
    }
    catch(e){
        console.log("An error occured while fetching your weather data!" + e);
    }
    return weatherData;
}

/* Generates the markup for the weather data we want to display */
function makeRelevantWeatherDataMarkup(weatherObj){ 
    const weatherStringsArrays = new Map ([
        [".humidity", "The humidity at this location is " + weatherObj.current.humidity + "%"], 
        [".weather-description", "The forecast is " + weatherObj.current.weather[0].description], 
        [".wind-speed", "Wind speed: " + weatherObj.current.wind_speed + "km/h"], 
        ["#currentTempValue", `${convertKelvinToUnit(temperatureUnit, weatherObj.current.feels_like), tempString('celcius')}`], 
        [".visibility", `Visibility up to ${Math.round(weatherObj.current.visibility / 1000, 1)}km`], 
        [".pressure", `Atmospheric pressure is ${weatherObj.current.pressure } hPa`],
        ["#feelsLikeValue", `${convertKelvinToUnit(temperatureUnit, weatherObj.current.feels_like), tempString('celcius')}`], 
    ]);
    // Selecting all the required HTML
    weatherStringsArrays.forEach( (value, key) => {
        document.querySelector(key).textContent = value;
    });
    // Change the image being used for the temperature dependent on the value at the given city.setTimeImage
    const tempImg = document.querySelector("#thermo");
    convertKelvinToUnit('celcius', weatherObj.current.temp) < 0 ? tempImg.src = "./images/weather-assets/cold.png" : tempImg.src = "./images/weather-assets/hot.png";
    // Change the image being used for day/night based on a comparison of current time to location sunset/sunrise time.
    setTimeImage(weatherObj)
}

// Temperature unit change logic
function tempString (temperatureUnit) {
    let temperatureString = "";
    temperatureUnit === 'celcius' ? temperatureString = '°C' : temperatureString = '°F';
    return temperatureString;
}
// ======================= Changes The Background Based on Time Info ============== 

// Given the time at the specified city, decide what picture to showcase.
function setTimeImage(weatherObj){
    const currentTime = new Date(new Date().toLocaleString("en-US", {timeZone: weatherObj.current.timezone})).getTime();
    const sunsetTime = weatherObj.current.sunset * 1000;
    const sunriseTime = weatherObj.current.sunrise * 1000;
    const timeImg = document.querySelector("#time-image");
    const contentContainer = document.querySelector(".city-info-view");
    // Dependent on the time at the location, the content displayed will vary.
    if (currentTime >= sunriseTime && currentTime < sunsetTime){
        setTimeImageHTML(timeImg, contentContainer, {imgPath: "./images/weather-assets/sun.png",
                                                    gradient: 'linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%)',
                                                    textShadow: '1px 1px 2px rgba(0,0,0, 0.25)',
                                                    textColor: 'black'});
    } else{
        setTimeImageHTML(timeImg, contentContainer, {imgPath: "./images/weather-assets/moon.png",
                                                    gradient: 'linear-gradient(#2C5364, #203A43, #0F2027)',
                                                    textShadow: '1px 1px 2px rgba(0,0,0, 0.25)',
                                                    textColor: 'white'});
    }
}
// Helper function to set time image for changing the HTML content
function setTimeImageHTML(timeImg, contentContainer, options){
    timeImg.src = options.imgPath;
    contentContainer.style.background = options.gradient; 
    contentContainer.style.textShadow = options.textShadow;
    contentContainer.style.color = options.textColor 
}



export {makeRelevantWeatherDataMarkup, retrieveCityWeatherData};