/*
* The idea of this project was to display convenient and relevant weather info about a given city (25,000+ inhabitants for this website),
* along with practicing API calls. I'm using the Google Maps API to retrieve a description of the given city
*/
// SCRIPT tag is in the head of HTML, so DOM elements cannot be retrieved without waiting for them to load
async function fetchEndpointData(endpoint){
    const endpointResponse = await fetch(endpoint);
    const JSONData = await endpointResponse.json();
    return JSONData;
}
document.addEventListener("DOMContentLoaded", async () => {
    // Query Selectors for some of the data elements 
    const cityNameCountryContainer = document.querySelector(".name-country");
    const cityPopulationContainer = document.querySelector(".population");
    // Retrieves the data to be presented for every city
    let cityData = JSON.parse(localStorage.getItem('cityData')) || "";
    if (cityData === ""){
        try{
            cityData = await fetchEndpointData("https://api.npoint.io/51175e4a65b8e108e5ad"); // Retrieves the city data from the given API endpoint
            const cityDataStringified = JSON.stringify(cityData);
            localStorage.setItem('cityData', cityDataStringified);
        } 
        catch(error){
            console.log(error);
        }
    }
    const NUM_CITIES = cityData.length;
    // This object contains location data in the form of city, country to locate a specific entry
    const cityCountryObj = cityData.map((entry) => {return {"location": `${entry.city}, ${entry.country}`}});
    // Button event listener
    const cityInputBtn = document.querySelector("#city-submit-btn");
    cityInputBtn.addEventListener("click", handleCityInput);
    // Retrieve city data -> retrieve weather data
    const cityInput = document.querySelector("#city-input");
    cityInput.addEventListener("input", autocompleteCityInput)
    // Define a function that loads a placeholder for the city text input
    function loadCityInputPlaceholder(){
        const citySeed = Math.floor(Math.random() * NUM_CITIES);
        cityInput.placeholder = `${cityData[citySeed].city}, ${cityData[citySeed].country}`; // Random placeholder for a city 
    }
    // Call the function 
    loadCityInputPlaceholder();
    // Handles the user city input 
    function handleCityInput(){
        const userCityInput  = document.querySelector("#city-input").value;
        // Retrieves the city Object that the user was looking for
        const inputCity = getSpecifiedCity(userCityInput);
        if (inputCity != ""){ // The input is not null, or undefined, etc.
            cityInfoDisplay(inputCity);
        }
        else{
            cityNotFoundError(userCityInput)
        }
    }
    function cityNotFoundError(cityName){
        const cityNotFound = document.querySelector(".city-not-found");
        cityNotFound.innerHTML = ""; // Resets any error that was there previously 
        cityNotFound.textContent = `The city '${cityName}' could not be found. Please check your spelling, and try again.`
        cityInput.textContent = "";
        loadCityInputPlaceholder(); // Load a new city placeholder
    }    
    async function cityInfoDisplay(inputCity){
        changeView("city-info"); // Switches the page view to display city information
        // Lat and long retrieved from the city obj
        const cityLatitude = inputCity.lat;
        const cityLongitude = inputCity.lng;
        // Displays a map of the given location, based on the lat and long values given
        const map = initializeMap(cityLatitude, cityLongitude, inputCity.population);
        // Receive and return the weather data for the given city
        const weatherData = await retrieveCityWeatherData(cityLatitude, cityLongitude).then(res => res);
        makeRelevantWeatherDataMarkup(weatherData);
        // grab the time at the given location 
        const timeAtLocation = calculateTimeAtLocation(weatherData.timezone);
        document.querySelector(".current-time").textContent = `Current time + ${timeAtLocation}`;
        // Displays the city basic information 
        displayMainCityInfo(inputCity.city, inputCity.country, inputCity.population);
    }
    

    function getCityImage(map, cityName){
        const imageRequest = {
            location: map.getCenter(),
            radius: '200',
            query: cityName
        };
        const imageService = new google.maps.places.PlacesService(map);
        imageService.textSearch(imageRequest, () => {

        });

    }
    function displayMainCityInfo(name, country, population){
        cityNameCountryContainer.textContent = name + ", " + country;
        cityPopulationContainer.textContent = "Population of " + formatPopulationValue(population);
    }
    /* Determines how zoomed in the city map should be based on the population. Very accurate for most NA cities, less so for EU cities (heavy density) */
    function getMapZoomLevelFromPopulation(population){
        if (population < 75000){ // small & very small cities
            return 13;
        }else if (population >= 75000 && population < 250000){ // small -medium cities
            return 12;
        }else if (population >= 250000 && population < 10000000){ // medium size cities
            return 11;
        }else if (population >= 1000000 && population < 3000000){ // large cities 
            return 10;
        }else{ // VERY large cities
            return 9;
        }
    }
    /* Converts a number in the style 12428 to 12,428. Could have also used NumberFormat() lol */
    function formatPopulationValue(population){
        let populationCharArray = [...String(population)];
        let populationFormattedString = "";
        const popLength = populationCharArray.length;
        const addCommaIndices = [];
        // City population values range from 5 to 8 digits
        switch(popLength){
            case 5: 
                addCommaIndices.push(2);
                break;
            case 6:
                addCommaIndices.push(3);
                break;
            case 7: 
                addCommaIndices.push(1,4);
                break;
            case 8:
                addCommaIndices.push(2,5);
                break;
            default:
                console.log("All cities in the dataset should fall within the given range...");
        }
        // After taking programming III, seeing nested loops makes me cringe a little bit. RIP time complexity, but cmon, we also don't need a hashtable for everything...
        for (let i = 0; i <popLength; i++){
            for (let commaIndice of addCommaIndices){
                if (i === commaIndice){
                    populationFormattedString += ",";
                }
            }
            populationFormattedString += populationCharArray[i];
        }
        return populationFormattedString; 
    }
    /* Retrieves and returns the weather data associated with the given coordinates */
    function retrieveCityWeatherData(cLat, cLong){
        let weatherData = "";
        try{
            weatherData = fetchEndpointData(`https://api.openweathermap.org/data/3.0/onecall?lat=${cLat}&lon=${cLong}&exclude=alerts,minutely&appid=3c7bc9f835d589478c313a48f04509d2`).then(weatherData => weatherData);
        }
        catch(e){
            console.log("An error occured while fetching your weather data!" + e);
        }
        return weatherData;
    }
    /* Generates the markup for the weather data we want to display */
    function makeRelevantWeatherDataMarkup(weatherObj){
        console.log(weatherObj);
        document.querySelectorAll(".weather-info div").forEach( (info) => info.textContent = ""); // Clears the text content of each node.
        document.querySelector(".sunrise-time").textContent = "Sun rises at " + new Date(weatherObj.current.sunrise * 1000);
        document.querySelector(".sunset-time").textContent = "Sun sets at " + new Date(weatherObj.current.sunset * 1000);
        document.querySelector(".humidity").textContent = "Humidity: " +weatherObj.current.humidity + "%";
        document.querySelector(".weather-description").textContent = "City has a forecast of " + weatherObj.current.weather[0].description;
        document.querySelector(".current-temperature").textContent += `Current temperature: ${convertKelvinToUnit('celcius', weatherObj.current.temp)}°C / ${convertKelvinToUnit('fahrenheit', weatherObj.current.temp)}°F`;
    }
    function calculateTimeAtLocation(locationTimezone){
        console.log(locationTimezone)
        const timeInArea = new Date().toLocaleDateString("en-us", {timezone: locationTimezone});
        console.log(timeInArea);
        return timeInArea.split(",")[1]; // Returns the current time 
    } 
    function initializeMap(lat, long, population){
        const mapContainer = document.querySelector("#map");
        const mapOptions =  {
                zoom: getMapZoomLevelFromPopulation(population),
                // These options make the map relatively static, as to only display the city that we're looking at.
                draggable: false, 
                zoomControl: false,
                scrollwheel: false,
                center: new google.maps.LatLng(lat, long),
                mapTypeId: "hybrid",
        };
        const map = new google.maps.Map(mapContainer, mapOptions);
        return map;
    }
    function getSpecifiedCity(userCityInput){
        let userCity = "";
        const inputArray = userCityInput.split(",");
        const cityName = inputArray[0];
        const countryName = inputArray[1].trim();
        for (let city of cityData){
            if (city.city.includes(cityName) && city.country.includes(countryName)){
                userCity = city;
                break;
            }
        }
        return userCity;
    }
    function changeView(newView){
        if (newView === 'search'){
            document.querySelector(".city-input-view").style.display = 'block';
            document.querySelector(".city-info-view").style.display = "none";
        }
        else if (newView === 'city-info'){
            document.querySelector(".city-input-view").style.display = 'none';
            document.querySelector(".city-info-view").style.display = "block";
        }
        else{
            console.log("The view paramater passed is not supported yet");
        }
    }
    /* Autocompletes the title options after the user types in a certain amount of characters*/
    function autocompleteCityInput(){
        const datalistReference = this.list; // References the datalist element associated with the input
        if (this.value.length >= 2){ // Starts using autocomplete after 1 character has been typed 
            const locationMatches = findMatches(this.value, cityCountryObj);
            datalistReference.replaceChildren();
            for (let match of locationMatches){
                let locationOption = document.createElement('option');
                locationOption.textContent = match;
                datalistReference.appendChild(locationOption);
            }
        }
    }
    /* Simple function that checks to see if the current user input string matches any of the song titles in the JSON file */
    function findMatches(currentInput, cityCountryObj){
        const matchArray = []
        const matches = cityCountryObj.filter((entry) => entry.location.toLowerCase().includes(currentInput.toLowerCase()));
        matches.forEach((match) => {matchArray.push(match.location)})
        return matchArray; // Returns the results from the search
    }   
    /* Converts kelvin temperature data into the desired unit */
    function convertKelvinToUnit(unit, kelvins){
        let convertedUnit = 0;
        switch(unit){
            case "celcius": 
                convertedUnit = Math.round(kelvins - 273.15,1);
                break;
            case "fahrenheit":
                convertedUnit = Math.round(1.80 * (kelvins - 273.15) + 32.0,1);
                break;
            default:
                console.log("invalid unit passed");        
        }
        return convertedUnit;
    }
    //const countryFlagsMap = new Map<String, String>("Afghanistan""🇦🇫");
});