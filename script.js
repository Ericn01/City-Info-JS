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
// A map (k,v) pairs that contains the name of a country, and its associated flag, for every country in the file (and a few more)
// This is a modified (simplified) version of the data from https://github.com/risan/country-flag-emoji/blob/master/src/data.js
const countryEmojis = new Map([ ["United Arab Emirates","๐ฆ๐ช"],["Afghanistan","๐ฆ๐ซ"],["Albania","๐ฆ๐ฑ"],["Armenia","๐ฆ๐ฒ"],["Angola","๐ฆ๐ด"],["Argentina","๐ฆ๐ท"],["Austria","๐ฆ๐น"],["Australia","๐ฆ๐บ"],["Aruba","๐ฆ๐ผ"],["Azerbaijan","๐ฆ๐ฟ"],["Bosnia & Herzegovina","๐ง๐ฆ"],["Barbados","๐ง๐ง"],["Bangladesh","๐ง๐ฉ"],["Belgium","๐ง๐ช"],["Burkina Faso","๐ง๐ซ"],["Bulgaria","๐ง๐ฌ"],["Bahrain","๐ง๐ญ"],["Burundi","๐ง๐ฎ"],["Benin","๐ง๐ฏ"],["Bermuda","๐ง๐ฒ"],["Brunei","๐ง๐ณ"],["Bolivia","๐ง๐ด"],["Brazil","๐ง๐ท"],["The Bahamas","๐ง๐ธ"],["Bhutan","๐ง๐น"],["Bouvet Island","๐ง๐ป"],["Botswana","๐ง๐ผ"],["Belarus","๐ง๐พ"],["Belize","๐ง๐ฟ"],["Canada","๐จ๐ฆ"],["Congo (Kinshasa)","๐จ๐ฉ"],["Central African Republic","๐จ๐ซ"],["Congo - Brazzaville","๐จ๐ฌ"],["Switzerland","๐จ๐ญ"],["Cรดte d'Ivoire","๐จ๐ฎ"],["Cook Islands","๐จ๐ฐ"],["Chile","๐จ๐ฑ"],["Cameroon","๐จ๐ฒ"],["China","๐จ๐ณ"],["Colombia","๐จ๐ด"],["Clipperton Island","๐จ๐ต"],["Costa Rica","๐จ๐ท"],["Cuba","๐จ๐บ"],["Cape Verde","๐จ๐ป"],["Curaรงao","๐จ๐ผ"],["Christmas Island","๐จ๐ฝ"],["Cyprus","๐จ๐พ"],["Czechia","๐จ๐ฟ"],["Germany","๐ฉ๐ช"],["Diego Garcia","๐ฉ๐ฌ"],["Djibouti","๐ฉ๐ฏ"],["Denmark","๐ฉ๐ฐ"],["Dominica","๐ฉ๐ฒ"],["Dominican Republic","๐ฉ๐ด"],["Algeria","๐ฉ๐ฟ"],["Ceuta & Melilla","๐ช๐ฆ"],["Ecuador","๐ช๐จ"],["Estonia","๐ช๐ช"],["Egypt","๐ช๐ฌ"],["Western Sahara","๐ช๐ญ"],["Eritrea","๐ช๐ท"],["Spain","๐ช๐ธ"],["Ethiopia","๐ช๐น"],["European Union","๐ช๐บ"],["Finland","๐ซ๐ฎ"],["Fiji","๐ซ๐ฏ"],["Falkland Islands","๐ซ๐ฐ"],["Micronesia","๐ซ๐ฒ"],["Faroe Islands","๐ซ๐ด"],["France","๐ซ๐ท"],["Gabon","๐ฌ๐ฆ"],["United Kingdom","๐ฌ๐ง"],["Grenada","๐ฌ๐ฉ"],["Georgia","๐ฌ๐ช"],["French Guiana","๐ฌ๐ซ"],["Guernsey","๐ฌ๐ฌ"],["Ghana","๐ฌ๐ญ"],["Gibraltar","๐ฌ๐ฎ"],["Greenland","๐ฌ๐ฑ"],["Gambia","๐ฌ๐ฒ"],["Guinea","๐ฌ๐ณ"],["Guadeloupe","๐ฌ๐ต"],["Equatorial Guinea","๐ฌ๐ถ"],["Greece","๐ฌ๐ท"],["Guatemala","๐ฌ๐น"],["Guam","๐ฌ๐บ"],["Guinea-Bissau","๐ฌ๐ผ"],["Guyana","๐ฌ๐พ"],["Hong Kong SAR China","๐ญ๐ฐ"],["Heard & McDonald Islands","๐ญ๐ฒ"],["Honduras","๐ญ๐ณ"],["Croatia","๐ญ๐ท"],["Haiti","๐ญ๐น"],["Hungary","๐ญ๐บ"],["Canary Islands","๐ฎ๐จ"],["Indonesia","๐ฎ๐ฉ"],["Ireland","๐ฎ๐ช"],["Israel","๐ฎ๐ฑ"],["Isle of Man","๐ฎ๐ฒ"],["India","๐ฎ๐ณ"],["Iraq","๐ฎ๐ถ"],["Iran","๐ฎ๐ท"],["Iceland","๐ฎ๐ธ"],["Italy","๐ฎ๐น"],["Jersey","๐ฏ๐ช"],["Jamaica","๐ฏ๐ฒ"],["Jordan","๐ฏ๐ด"],["Japan","๐ฏ๐ต"],["Kenya","๐ฐ๐ช"],["Kyrgyzstan","๐ฐ๐ฌ"],["Samoa","๐ผ๐ธ"],["Kosovo","๐ฝ๐ฐ"],["Yemen","๐พ๐ช"],["Mayotte","๐พ๐น"], 
["Cambodia","๐ฐ๐ญ"],["Kiribati","๐ฐ๐ฎ"],["Comoros","๐ฐ๐ฒ"],["North Korea","๐ฐ๐ต"],["South Korea","๐ฐ๐ท"],["Kuwait","๐ฐ๐ผ"],["Cayman Islands","๐ฐ๐พ"],["Kazakhstan","๐ฐ๐ฟ"],["Laos","๐ฑ๐ฆ"],["Lebanon","๐ฑ๐ง"],["St. Lucia","๐ฑ๐จ"],["Liechtenstein","๐ฑ๐ฎ"],["Sri Lanka","๐ฑ๐ฐ"],["Liberia","๐ฑ๐ท"],["Lesotho","๐ฑ๐ธ"],["Lithuania","๐ฑ๐น"],["Luxembourg","๐ฑ๐บ"],["Latvia","๐ฑ๐ป"],["Libya","๐ฑ๐พ"],["Morocco","๐ฒ๐ฆ"],["Monaco","๐ฒ๐จ"],["Moldova","๐ฒ๐ฉ"],["Montenegro","๐ฒ๐ช"],["Madagascar","๐ฒ๐ฌ"],["Marshall Islands","๐ฒ๐ญ"],["Macedonia","๐ฒ๐ฐ"],["Mali","๐ฒ๐ฑ"],["Myanmar","๐ฒ๐ฒ"],["Mongolia","๐ฒ๐ณ"],["Macau SAR China","๐ฒ๐ด"],["Northern Mariana Islands","๐ฒ๐ต"],["Martinique","๐ฒ๐ถ"],["Mauritania","๐ฒ๐ท"],["Montserrat","๐ฒ๐ธ"],["Malta","๐ฒ๐น"],["Mauritius","๐ฒ๐บ"],["Maldives","๐ฒ๐ป"],["Malawi","๐ฒ๐ผ"],["Mexico","๐ฒ๐ฝ"],["Malaysia","๐ฒ๐พ"],["Mozambique","๐ฒ๐ฟ"],["Namibia","๐ณ๐ฆ"],["New Caledonia","๐ณ๐จ"],["Niger","๐ณ๐ช"],["Norfolk Island","๐ณ๐ซ"],["Nigeria","๐ณ๐ฌ"],["Nicaragua","๐ณ๐ฎ"],["Netherlands","๐ณ๐ฑ"],["Norway","๐ณ๐ด"],["Nepal","๐ณ๐ต"],["Nauru","๐ณ๐ท"],["Niue","๐ณ๐บ"],["New Zealand","๐ณ๐ฟ"],["Oman","๐ด๐ฒ"],["Panama","๐ต๐ฆ"],["Peru","๐ต๐ช"],["French Polynesia","๐ต๐ซ"],["Papua New Guinea","๐ต๐ฌ"],["Philippines","๐ต๐ญ"],["Pakistan","๐ต๐ฐ"],["Poland","๐ต๐ฑ"],["Puerto Rico","๐ต๐ท"],["Portugal","๐ต๐น"],["Paraguay","๐ต๐พ"],["Qatar","๐ถ๐ฆ"],["Reunion","๐ท๐ช"],["Romania","๐ท๐ด"],["Serbia","๐ท๐ธ"],["Russia","๐ท๐บ"],["Rwanda","๐ท๐ผ"],["Saudi Arabia","๐ธ๐ฆ"],["Solomon Islands","๐ธ๐ง"],["Seychelles","๐ธ๐จ"],["Sudan","๐ธ๐ฉ"],["Sweden","๐ธ๐ช"],["Singapore","๐ธ๐ฌ"],["Slovenia","๐ธ๐ฎ"],["Slovakia","๐ธ๐ฐ"],["Sierra Leone","๐ธ๐ฑ"],["San Marino","๐ธ๐ฒ"],["Senegal","๐ธ๐ณ"],["Somalia","๐ธ๐ด"],["Suriname","๐ธ๐ท"],["South Sudan","๐ธ๐ธ"],["El Salvador","๐ธ๐ป"],["Syria","๐ธ๐พ"],["Swaziland","๐ธ๐ฟ"],["Tristan da Cunha","๐น๐ฆ"],["Turks & Caicos Islands","๐น๐จ"],["Chad","๐น๐ฉ"],["French Southern Territories","๐น๐ซ"],["Togo","๐น๐ฌ"],["Thailand","๐น๐ญ"],["Tajikistan","๐น๐ฏ"],["Timor-Leste","๐น๐ฑ"],["Turkmenistan","๐น๐ฒ"],["Tunisia","๐น๐ณ"],["Tonga","๐น๐ด"],["Turkey","๐น๐ท"],["Trinidad & Tobago","๐น๐น"],["Taiwan","๐น๐ผ"],["Tanzania","๐น๐ฟ"],["Ukraine","๐บ๐ฆ"],["Uganda","๐บ๐ฌ"],["United States","๐บ๐ธ"],["Uruguay","๐บ๐พ"],["Uzbekistan","๐บ๐ฟ"],["St. Vincent & Grenadines","๐ป๐จ"],["Venezuela","๐ป๐ช"],["Vietnam","๐ป๐ณ"],["Vanuatu","๐ป๐บ"],["South Africa","๐ฟ๐ฆ"],["Zambia","๐ฟ๐ฒ"],["Zimbabwe","๐ฟ๐ผ"] ]);

document.addEventListener("DOMContentLoaded", async () => {
    // Select random background image 
    const NUM_BG_IMAGES = 6; // This is hardcoded for now, and will be changed later on -> bash script could retrieve the count from directory and hand it as a variable
    const imageIndex = Math.ceil(Math.random() * NUM_BG_IMAGES);
    document.querySelector("body").style.backgroundImage = `url('./images/background-images/bg${imageIndex}.jpg')`;
    // Query Selectors for some of the data elements 
    const cityNameCountryContainer = document.querySelector(".name-country");
    const cityPopulationContainer = document.querySelector(".population");
    // Search new city btn handling
    // document.querySelector("#search-new-city").addEventListener("click", () => {changeView("search")});
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
    // Switch Temperature Unit
    let temperatureUnit = "celcius"; // Default unit
    document.querySelectorAll("#temp-container input").forEach( (tempElem) => tempElem.addEventListener('click', modifyTemperatureUnit));
    function modifyTemperatureUnit(){
        const currentTemp = document.querySelector("#currentTemp");
        const feelsLikeTemp = document.querySelector("#feelsTemp");

    }
    // Call the function 
    loadCityInputPlaceholder();
    // Handles the user city input 
    function handleCityInput(){
        const userCityInput  = document.querySelector("#city-input").value;
        loadAnimationLogic("active"); 
        // Retrieves the city Object that the user was looking for
        const inputCity = getSpecifiedCity(userCityInput);
        if (inputCity != ""){ // The input is not null, or undefined, etc.
            cityInfoDisplay(inputCity);
        }
        else{
            cityNotFoundError(userCityInput)
        }
    }
    // Loader (gif) logic
    function loadAnimationLogic (state){
        const animationImg = document.querySelector(".loading-img");
        animationImg.setAttribute("src", "./images/loading.gif");
        if (state === "active"){
            cityInputBtn.style.display = "none";
            animationImg.style.display = 'inline';
        } else if (state === 'inactive'){
            cityInputBtn.style.display = "inline";
            animationImg.style.display = "inline";
        }
    }
    // The logic that is applied if a city could not be found.
    function cityNotFoundError(cityName){
        const cityNotFound = document.querySelector(".city-not-found");
        cityNotFound.innerHTML = ""; // Resets any error that was there previously 
        cityNotFound.textContent = `The city '${cityName}' could not be found. Please check your spelling, and try again.`
        cityInput.textContent = "";
    }    
    async function cityInfoDisplay(inputCity){
        // Lat and long retrieved from the city obj
        const cityLatitude = inputCity.lat;
        const cityLongitude = inputCity.lng;
        // Displays a map of the given location, based on the lat and long values given
        const cityCountry = inputCity.city + "," + inputCity.country;
        initializeMap(cityLatitude, cityLongitude, inputCity.population, cityCountry);
        // Receive and return the weather data for the given city
        const weatherData = await retrieveCityWeatherData(cityLatitude, cityLongitude).then(res => res);
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
    // Map containing edge cases
    const searchMap = new Map([ ["Portland, United States", "Portland, Oregon"], ["New York, United States", "New York City"], ["Anchorage, United States", "Anchorage, Alaska"], ["London, Canada", "London, Ontario"], ["Guelph, Canada", "Guelph"], ["Montrรฉal, Canada", "Montreal"], ["Quebec City, Canada", "Quebec City"], 
["Birmingham, United States", "Birmingham, Alabama"], ["Ellore, India", "Eluru"], ["An Najaf, Iraq", "Najaf"], ["Winnipeg, Canada", "Winnipeg"]])
    async function performWikiDataLogic(inputCity){
        let unrefinedQuery = ""
        inputCity.population > 750000 ? unrefinedQuery = inputCity.city : unrefinedQuery = `${inputCity.city}, ${inputCity.country}`; // Large cities tend to work better when you only call their name, and not their country using the wikipedia API
        // Grab the wiki data container
        const wikiContainer = document.querySelector(".wiki-data");
        // The wikipedia search query 
        let queryText = ""
        // Logic for different types of searches
        queryText = searchMap.get(unrefinedQuery) ?? unrefinedQuery;
        console.log(queryText);
        // let the text content be what we retrieved.
        wikiContainer.textContent = await parseWikiData(getCityWikiPage(queryText));
    }
    function getWeatherChartData(weatherData){
        const min = [];const max = [];const day = [];
        weatherData.forEach( (entry) => {
            min.push(convertKelvinToUnit(temperatureUnit,entry.temp.min));
            max.push(convertKelvinToUnit(temperatureUnit,entry.temp.max));
            day.push(convertKelvinToUnit(temperatureUnit,entry.temp.day));
        });
        return {"minTemp": min, "maxTemp": max, "dayTemp": day};
    }
    /* Displays the city name, country, flag, sunrise and sunset time, along with it's metro population. */
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
    /* Determines how zoomed in the city map should be based on the population. Very accurate for most NA cities, less so for EU cities (heavy density) */
    function getMapZoomLevelFromPopulation(population){
        if (population < 75000){ // small & very small cities
            return 13;
        }else if (population >= 75000 && population < 250000){ // small -medium cities
            return 12;
        }else if (population >= 250000 && population < 1000000){ // medium size cities
            return 11;
        }else if (population >= 1000000 && population < 3500000){ // large cities 
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
            weatherData = fetchEndpointData(`https://api.openweathermap.org/data/3.0/onecall?lat=${cLat}&lon=${cLong}&exclude=alerts,minutely,hourly&appid=3c7bc9f835d589478c313a48f04509d2`).then(weatherData => weatherData);
        }
        catch(e){
            console.log("An error occured while fetching your weather data!" + e);
        }
        return weatherData;
    }
    // Temperature unit change logic
    function tempString (temperatureUnit) {
        let temperatureString = "";
        temperatureUnit === 'celcius' ? temperatureString = 'ยฐC' : temperatureString = 'ยฐF';
        return temperatureString;
    }
    /* Generates the markup for the weather data we want to display */
    function makeRelevantWeatherDataMarkup(weatherObj){ 
        const weatherStrings = ["The humidity at this location is " + weatherObj.current.humidity + "%", 
                            "The forecast is " + weatherObj.current.weather[0].description, "Wind speed: " + weatherObj.current.wind_speed + "km/h", 
                            `Currently ${convertKelvinToUnit(temperatureUnit, weatherObj.current.temp), tempString()}`, `Feels like ${convertKelvinToUnit(temperatureUnit, weatherObj.current.feels_like), tempString()}`, `Visibility up to ${Math.round(weatherObj.current.visibility / 1000, 1)}km`, `Atmospheric pressure is ${weatherObj.current.pressure } hPa`];

        document.querySelector(".humidity").textContent = "The humidity at this location is " + weatherObj.current.humidity + "%";
        document.querySelector(".weather-description").textContent = "The forecast is " + weatherObj.current.weather[0].description;
        document.querySelector(".wind-speed").textContent = "Wind speed: " + weatherObj.current.wind_speed + "km/h";
        document.querySelector("#currentTempValue").textContent = `${convertKelvinToUnit('celcius', weatherObj.current.temp)} ${tempString('celcius')}`;
        document.querySelector(".pressure").textContent = `Atmospheric pressure is ${weatherObj.current.pressure } hPa`
        document.querySelector(".visibility").textContent = `Visibility up to ${Math.round(weatherObj.current.visibility / 1000, 1)}km`;
        document.querySelector("#feelsLikeValue").textContent = `${convertKelvinToUnit('celcius', weatherObj.current.feels_like)} ${tempString('celcius')}`;
        // Change the image being used for the temperature dependent on the value at the given city.
        const tempImg = document.querySelector("#thermo");
        convertKelvinToUnit('celcius', weatherObj.current.temp) < 0 ? tempImg.src = "./images/weather-assets/cold.png" : tempImg.src = "./images/weather-assets/hot.png";
        // Change the image being used for day/night based on a comparison of current time to location sunset/sunrise time.
        setTimeImage(weatherObj)
    }
    function setTimeImage(weatherObj){
        const currentTime = new Date(new Date().toLocaleString("en-US", {timeZone: weatherObj.current.timezone})).getTime();
        const sunsetTime = weatherObj.current.sunset * 1000;
        const sunriseTime = weatherObj.current.sunrise * 1000;
        const timeImg = document.querySelector("#time-image");
        const contentContainer = document.querySelector(".city-info-view");
        if (currentTime >= sunriseTime && currentTime < sunsetTime){
            timeImg.src = "./images/weather-assets/sun.png";
            contentContainer.style.background = 'linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%)';
            contentContainer.style.textShadow = '1px 1px 2px rgba(255,255,255, 0.25)';
            contentContainer.style.color = 'black';
        } else{
            timeImg.src = "./images/weather-assets/moon.png"
            contentContainer.style.background = 'linear-gradient(#2C5364, #203A43, #0F2027)';
            contentContainer.style.textShadow = '1px 1px 2px rgba(0,0,0, 0.25)';
            contentContainer.style.color = 'white';
        }
    }
    // As the function name suggests, this function figures out the local time of the given location.
    function calculateTimeAtLocation(locationTimezone){
        const dateAndTimeAtArea = new Date().toLocaleString("en-us", {timeZone: locationTimezone, weekday:'long', year:'numeric', month:'long',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'});
        return dateAndTimeAtArea; // Returns the current time at the location
    } 
    function initializeMap(latitude, longitude, population, cityCountry){
        const mapContainer = document.querySelector("#map");
        const locationCenter = google.maps.LatLngLiteral = {lat: latitude, lng: longitude};
        const mapOptions =  {
                center: locationCenter,
                zoom: getMapZoomLevelFromPopulation(population),
                // These options make the map relatively static, as to only display the city that we're looking at.
                disableDefaultUI: true,
                mapTypeId: "hybrid",
                draggable: false,
        };
        // Create the map
        const map = new google.maps.Map(mapContainer, mapOptions);
        // Use the map and places service to get a placeId
        const placeService = new google.maps.places.PlacesService(map);
        // Query parameters
        const queryParams = {
            query: cityCountry, 
            fields: ['photos'],
        };
        // Perform a search on the location and log out the results
        placeService.findPlaceFromQuery(queryParams, function(results, status){
            if (status === google.maps.places.PlacesServiceStatus.OK){
                for (result of results){
                    if (result.photos !== ""){
                        const photoDiv = document.querySelector("#google-maps-city-photo");
                        photoDiv.innerHTML = ""; // resets any previous images in there
                        const cityImg = document.createElement("img");
                        cityImg.setAttribute("src", result.photos[0].getUrl({maxHeight: 350})); // Images with a height greater than approx. 350 pixels look a lil wonky
                        cityImg.setAttribute("alt", 'City Image');
                        cityImg.setAttribute("id", "cityImg")
                        photoDiv.appendChild(cityImg);
                    }
                }
            }
            else{
                console.log("No images of the specified location could be retrieved.")
            }
        });
    }
    // Setting up functionality for the switch view button
    const switchViewBtn = document.querySelector("#switch-view-btn");
    switchViewBtn.style.display = "none"; // Default for the button on the search page
    switchViewBtn.addEventListener('click', () => {
        switchViewBtn.style.display = "block";
        document.querySelector(".city-info-view").style.display = "none";
        document.querySelector(".city-input-view").style.display = "block";
    })
    function getSpecifiedCity(userCityInput){
        let userCity = "";
        const inputArray = userCityInput.includes(",") ? userCityInput.split(",") : "";
        if (inputArray.length >= 2){
            const cityName = inputArray[0];
            const countryName = inputArray[1].trim();
            for (let city of cityData){
                if (city.city.includes(cityName) && city.country.includes(countryName)){
                    userCity = city;
                    break;
                }
            }
        }
        return userCity;
    }
    function changeView(newView){
        const cityInputView = document.querySelector(".city-input-view");
        const cityInfoView = document.querySelector(".city-info-view");
        if (newView === 'search'){
            cityInputView.style.display = 'block';
            cityInfoView.classList.toggle("city-info-view");            
        }
        else if (newView === 'city-info'){
            cityInputView.style.display = 'none';
            if (window.innerWidth < 500){
                cityInfoView.style.display = 'block';
            }else {
                cityInfoView.style.display = 'grid';
            }
        }
        else{
            console.log("The view paramater passed is not supported yet");
        }
    }
    // Listens for screen/window resizes
    addEventListener("resize", () => {
        if (window.innerWidth < 500){
            document.querySelector(".city-info-view").style.display = 'block';
        }
        else {
            document.querySelector(".city-info-view").style.display = 'grid';
        }
    })
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
    /* Simple function that checks to see if the current user input string matches any of the cities in the JSON file */
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
                convertedUnit = Math.round(kelvins - 273.15, 1);
                break;
            case "fahrenheit":
                convertedUnit = Math.round(1.80 * (kelvins - 273.15) + 32.0, 1);
                break;
            default:
                console.log("invalid unit parameter passed");        
        }
        return convertedUnit;
    }
    // Finds and retrieves the emoji (flag) of the given country
    function getCountryEmoji(countryName){
        return (countryEmojis.get(countryName));
    }
    // Fetching from the wikiepedia API to receive data about the city
    async function getCityWikiPage(cityCountryPair){
        const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${cityCountryPair}&format=json&origin=*`; // Specifying the url to fetch from
        const wikiPage = await fetchEndpointData(url).then(res => res);
        return wikiPage;
    }
    async function parseWikiData(wikiData){
        const pageData = await wikiData;
        if (!pageData['parse']['text']['*'].includes("NewPP limit report") || pageData !== undefined){
            const pageHTMLText = pageData['parse']['text']['*'];
            const parserObject = new DOMParser();
            const paragraphAttribute = parserObject.parseFromString(pageHTMLText, 'text/html').querySelectorAll("p")[1].textContent ?? 'Sorry, we were unable to retrieve a description of the inputted city...';
            return paragraphAttribute.replace(/\[\w+\]/gm, '');
        }
        else {
            console.log("The result of that page search was undefined...");
        }
    }
    // ==================================== WEATHER CHART ============================
    function makeWeatherChart(minData, maxData, dayData){
        const context = document.querySelector("#weather-chart").getContext('2d');
        const labels = getWeekdaysFormattted(); // Returns an array of days in the format: M D
        const chartOptions = {
            scales : {
                y: {
                    ticks: {
                        color: "white"
                    },
                    title: {
                        align: "center",
                        color: "white"
                    }
                },
                x: {
                    ticks: {
                        color: "white"
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {color: "white"},    
                }
            }
        }
        const data = {
            labels: labels,
            datasets: [{
                label: 'Day Temperature',
                data: dayData,
                fill: false,
                tension: 0.1
            },
            {
                label: 'Max Temperature',
                data: maxData,
                fill: false,
                tension: 0.1
            },
            {
                label: 'Min Temperature',
                data: minData,
                fill: false,
                tension: 0.1  
            }
            ]
        };
        const chartConfig = {type: 'line', data:data, options: chartOptions};
        new Chart(context, chartConfig); // create and display the chart
    }
    // Formats the weekdays (x axis) of the weather chart
    function getWeekdaysFormattted(){
        const week = [];
        const DAYS_IN_WEEK = 7;
        const currentDate = new Date(); 
        const monthNumToDays = new Map([ [0, 31], [1, 28], [2, 31], [3, 30], [4, 31], [5, 30], [6, 31], [7, 31], [8, 31], [9, 31], [10, 30], [11, 31] ]); // 0=jan, 1=feb, ...
        for (let i = 0; i < DAYS_IN_WEEK; i++){
            let date = currentDate.getDate() + i;
            const numDaysInCurrentMonth = monthNumToDays.get(currentDate.getMonth());
            if (date > numDaysInCurrentMonth){
                const newMonth = currentDate.getMonth() + 1;
                currentDate.setMonth(newMonth);
                date = Math.abs(date - numDaysInCurrentMonth);
            }
            const monthFormatted = new Intl.DateTimeFormat("en-us", {month: "long"}).format(currentDate);
            week.push(monthFormatted + " " + date);
        }
        return week;
    }


});