import { getCountryEmoji } from "./mapConstants.js";
import initializeMap from "./googleMaps.js";
import makeWeatherChart from "./weatherChart.js";
import { makeRelevantWeatherDataMarkup, retrieveCityWeatherData } from "./weatherData.js";
import performWikiDataLogic from "./wikipedia.js";
import { convertKelvinToUnit, calculateTimeAtLocation, changeView } from "./miscellaneous.js";

// Query Selectors for some of the important HTML elements
const cityNameCountryContainer = document.querySelector(".name-country");
const cityPopulationContainer = document.querySelector(".population");
let temperatureUnit = 'celcius';
console.log
// Displays all the required information for the given city
async function cityInfoDisplay(inputCity){
    // Latitude and longitude coordinates retrieved from the city obj
    const lat = inputCity.lat;
    const long = inputCity.lng;
    // Displays a map of the given location, based on the lat and long values given
    const cityCountry = inputCity.city + "," + inputCity.country;
    initializeMap(lat, long, inputCity.population, cityCountry);
    // Receive and return the weather data for the given city
    const weatherData = await retrieveCityWeatherData(lat, long).then(res => res);
    makeRelevantWeatherDataMarkup(weatherData);
    // grab the time at the given location and display it 
    setInterval( () => displayTimeInformation(weatherData.timezone), 1000); // Increments the current time by one second 
    // Displays the city basic information 
    displayMainCityInfo(inputCity.city, inputCity.country, inputCity.population, weatherData);
    // Wikipedia data fetching
    await performWikiDataLogic(inputCity);
    // Make the weather chart
    const wData = getWeatherChartData(weatherData.daily); // min, max, avg data  
    makeWeatherChart(wData.minTemp, wData.maxTemp, wData.dayTemp);
    changeView("city-info"); // Switches the page view to display city information -> only once everything is done
}

/* DISPLAYS THE FOLLOWING:
* a) country 
* b) flag, 
* c) sunrise / sunset time
* d) Metro population (from DB) 
*/
function displayMainCityInfo(name, country, population, weatherObj){
    // The sunrise and sunset times must take into account the city's timezone, therefore a conversion is required.
    const sunriseTime = new Date(new Date(weatherObj.current.sunrise * 1000).toLocaleString("en-us", {timeZone: weatherObj.timezone}));
    const sunsetTime = new Date(new Date(weatherObj.current.sunset * 1000).toLocaleString("en-us", {timeZone: weatherObj.timezone}));
    const sunsetSunriseOptions = {hour:"numeric", minute:"numeric",second:"numeric"};
    cityNameCountryContainer.textContent = name + ", " + country + " " + getCountryEmoji(country);
    cityPopulationContainer.textContent = `The ${name} metro area has a population of approximately ` + formatPopulationValue(population) + " people";
    document.querySelector("#sunrise-time").textContent = new Intl.DateTimeFormat('en-us', sunsetSunriseOptions).format(sunriseTime);
    document.querySelector("#sunset-time").textContent = new Intl.DateTimeFormat('en-us', sunsetSunriseOptions).format(sunsetTime);        
}

/* Displays the time information for the specified timezone*/
function displayTimeInformation(timezone){
    // Data point
    const dateData = calculateTimeAtLocation(timezone).split("at");
    // Strings to be displayed
    const dateAtLocation = dateData[0];
    const timeAtLocation = dateData[1];
    // DOM elements
    const currentDate = document.querySelector(".current-date");
    const currentTime = document.querySelector(".current-time");
    // Setting up the text content
    currentDate.textContent = dateAtLocation;
    currentTime.textContent = `Currently ${timeAtLocation} (${timezone})`;
}

/* 
* Converts a number in the style 12428 to 12,428. 
* I could have used Intl.NumberFormat(), but I wanted to challenge myself a bit.
*/
function formatPopulationValue(population){
    const populationCharArray = [...String(population)];
    let populationFormattedString = "";
    const addCommaIndices = [];
    // City population values range from 5 to 8 digits
    switch(populationCharArray.length){
        case 5: // [10,000 - 99,999]
            addCommaIndices.push(2);
            break;
        case 6: // [100,000 - 999,999]
            addCommaIndices.push(3);
            break;
        case 7: // [1,000,000 - 9,999,999]
            addCommaIndices.push(1,4);
            break;
        case 8: // [10,000,000 - 99,999,999]
            addCommaIndices.push(2,5);
            break;
        default:
            console.log("All cities in the dataset should fall within the given range...");
    }
    for (let i = 0; i < populationCharArray.length; i++){
        for (let commaIndice of addCommaIndices){
            if (i === commaIndice){
                populationFormattedString += ",";
            }
        }
        populationFormattedString += populationCharArray[i];
    }
    return populationFormattedString; 
}

// returns the information that the weather chart needs to display as an object. 
// The required data comes from 
function getWeatherChartData(weatherData){
    const min = []; const max = []; const day = [];
    weatherData.forEach( (entry) => {
        min.push(convertKelvinToUnit(temperatureUnit,entry.temp.min));
        max.push(convertKelvinToUnit(temperatureUnit,entry.temp.max));
        day.push(convertKelvinToUnit(temperatureUnit,entry.temp.day));
    });
    return {"minTemp": min, "maxTemp": max, "dayTemp": day};
}


export default cityInfoDisplay;