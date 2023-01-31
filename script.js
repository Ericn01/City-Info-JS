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
const countryEmojis = new Map([ ["United Arab Emirates","🇦🇪"],["Afghanistan","🇦🇫"],["Albania","🇦🇱"],["Armenia","🇦🇲"],["Angola","🇦🇴"],["Argentina","🇦🇷"],["Austria","🇦🇹"],["Australia","🇦🇺"],["Aruba","🇦🇼"],["Azerbaijan","🇦🇿"],["Bosnia & Herzegovina","🇧🇦"],["Barbados","🇧🇧"],["Bangladesh","🇧🇩"],["Belgium","🇧🇪"],["Burkina Faso","🇧🇫"],["Bulgaria","🇧🇬"],["Bahrain","🇧🇭"],["Burundi","🇧🇮"],["Benin","🇧🇯"],["Bermuda","🇧🇲"],["Brunei","🇧🇳"],["Bolivia","🇧🇴"],["Brazil","🇧🇷"],["The Bahamas","🇧🇸"],["Bhutan","🇧🇹"],["Bouvet Island","🇧🇻"],["Botswana","🇧🇼"],["Belarus","🇧🇾"],["Belize","🇧🇿"],["Canada","🇨🇦"],["Congo (Kinshasa)","🇨🇩"],["Central African Republic","🇨🇫"],["Congo - Brazzaville","🇨🇬"],["Switzerland","🇨🇭"],["Côte d'Ivoire","🇨🇮"],["Cook Islands","🇨🇰"],["Chile","🇨🇱"],["Cameroon","🇨🇲"],["China","🇨🇳"],["Colombia","🇨🇴"],["Clipperton Island","🇨🇵"],["Costa Rica","🇨🇷"],["Cuba","🇨🇺"],["Cape Verde","🇨🇻"],["Curaçao","🇨🇼"],["Christmas Island","🇨🇽"],["Cyprus","🇨🇾"],["Czechia","🇨🇿"],["Germany","🇩🇪"],["Diego Garcia","🇩🇬"],["Djibouti","🇩🇯"],["Denmark","🇩🇰"],["Dominica","🇩🇲"],["Dominican Republic","🇩🇴"],["Algeria","🇩🇿"],["Ceuta & Melilla","🇪🇦"],["Ecuador","🇪🇨"],["Estonia","🇪🇪"],["Egypt","🇪🇬"],["Western Sahara","🇪🇭"],["Eritrea","🇪🇷"],["Spain","🇪🇸"],["Ethiopia","🇪🇹"],["European Union","🇪🇺"],["Finland","🇫🇮"],["Fiji","🇫🇯"],["Falkland Islands","🇫🇰"],["Micronesia","🇫🇲"],["Faroe Islands","🇫🇴"],["France","🇫🇷"],["Gabon","🇬🇦"],["United Kingdom","🇬🇧"],["Grenada","🇬🇩"],["Georgia","🇬🇪"],["French Guiana","🇬🇫"],["Guernsey","🇬🇬"],["Ghana","🇬🇭"],["Gibraltar","🇬🇮"],["Greenland","🇬🇱"],["Gambia","🇬🇲"],["Guinea","🇬🇳"],["Guadeloupe","🇬🇵"],["Equatorial Guinea","🇬🇶"],["Greece","🇬🇷"],["Guatemala","🇬🇹"],["Guam","🇬🇺"],["Guinea-Bissau","🇬🇼"],["Guyana","🇬🇾"],["Hong Kong SAR China","🇭🇰"],["Heard & McDonald Islands","🇭🇲"],["Honduras","🇭🇳"],["Croatia","🇭🇷"],["Haiti","🇭🇹"],["Hungary","🇭🇺"],["Canary Islands","🇮🇨"],["Indonesia","🇮🇩"],["Ireland","🇮🇪"],["Israel","🇮🇱"],["Isle of Man","🇮🇲"],["India","🇮🇳"],["Iraq","🇮🇶"],["Iran","🇮🇷"],["Iceland","🇮🇸"],["Italy","🇮🇹"],["Jersey","🇯🇪"],["Jamaica","🇯🇲"],["Jordan","🇯🇴"],["Japan","🇯🇵"],["Kenya","🇰🇪"],["Kyrgyzstan","🇰🇬"],["Samoa","🇼🇸"],["Kosovo","🇽🇰"],["Yemen","🇾🇪"],["Mayotte","🇾🇹"], 
["Cambodia","🇰🇭"],["Kiribati","🇰🇮"],["Comoros","🇰🇲"],["North Korea","🇰🇵"],["South Korea","🇰🇷"],["Kuwait","🇰🇼"],["Cayman Islands","🇰🇾"],["Kazakhstan","🇰🇿"],["Laos","🇱🇦"],["Lebanon","🇱🇧"],["St. Lucia","🇱🇨"],["Liechtenstein","🇱🇮"],["Sri Lanka","🇱🇰"],["Liberia","🇱🇷"],["Lesotho","🇱🇸"],["Lithuania","🇱🇹"],["Luxembourg","🇱🇺"],["Latvia","🇱🇻"],["Libya","🇱🇾"],["Morocco","🇲🇦"],["Monaco","🇲🇨"],["Moldova","🇲🇩"],["Montenegro","🇲🇪"],["Madagascar","🇲🇬"],["Marshall Islands","🇲🇭"],["Macedonia","🇲🇰"],["Mali","🇲🇱"],["Myanmar","🇲🇲"],["Mongolia","🇲🇳"],["Macau SAR China","🇲🇴"],["Northern Mariana Islands","🇲🇵"],["Martinique","🇲🇶"],["Mauritania","🇲🇷"],["Montserrat","🇲🇸"],["Malta","🇲🇹"],["Mauritius","🇲🇺"],["Maldives","🇲🇻"],["Malawi","🇲🇼"],["Mexico","🇲🇽"],["Malaysia","🇲🇾"],["Mozambique","🇲🇿"],["Namibia","🇳🇦"],["New Caledonia","🇳🇨"],["Niger","🇳🇪"],["Norfolk Island","🇳🇫"],["Nigeria","🇳🇬"],["Nicaragua","🇳🇮"],["Netherlands","🇳🇱"],["Norway","🇳🇴"],["Nepal","🇳🇵"],["Nauru","🇳🇷"],["Niue","🇳🇺"],["New Zealand","🇳🇿"],["Oman","🇴🇲"],["Panama","🇵🇦"],["Peru","🇵🇪"],["French Polynesia","🇵🇫"],["Papua New Guinea","🇵🇬"],["Philippines","🇵🇭"],["Pakistan","🇵🇰"],["Poland","🇵🇱"],["Puerto Rico","🇵🇷"],["Portugal","🇵🇹"],["Paraguay","🇵🇾"],["Qatar","🇶🇦"],["Reunion","🇷🇪"],["Romania","🇷🇴"],["Serbia","🇷🇸"],["Russia","🇷🇺"],["Rwanda","🇷🇼"],["Saudi Arabia","🇸🇦"],["Solomon Islands","🇸🇧"],["Seychelles","🇸🇨"],["Sudan","🇸🇩"],["Sweden","🇸🇪"],["Singapore","🇸🇬"],["Slovenia","🇸🇮"],["Slovakia","🇸🇰"],["Sierra Leone","🇸🇱"],["San Marino","🇸🇲"],["Senegal","🇸🇳"],["Somalia","🇸🇴"],["Suriname","🇸🇷"],["South Sudan","🇸🇸"],["El Salvador","🇸🇻"],["Syria","🇸🇾"],["Swaziland","🇸🇿"],["Tristan da Cunha","🇹🇦"],["Turks & Caicos Islands","🇹🇨"],["Chad","🇹🇩"],["French Southern Territories","🇹🇫"],["Togo","🇹🇬"],["Thailand","🇹🇭"],["Tajikistan","🇹🇯"],["Timor-Leste","🇹🇱"],["Turkmenistan","🇹🇲"],["Tunisia","🇹🇳"],["Tonga","🇹🇴"],["Turkey","🇹🇷"],["Trinidad & Tobago","🇹🇹"],["Taiwan","🇹🇼"],["Tanzania","🇹🇿"],["Ukraine","🇺🇦"],["Uganda","🇺🇬"],["United States","🇺🇸"],["Uruguay","🇺🇾"],["Uzbekistan","🇺🇿"],["St. Vincent & Grenadines","🇻🇨"],["Venezuela","🇻🇪"],["Vietnam","🇻🇳"],["Vanuatu","🇻🇺"],["South Africa","🇿🇦"],["Zambia","🇿🇲"],["Zimbabwe","🇿🇼"] ]);

document.addEventListener("DOMContentLoaded", async () => {
    // Select random background image 
    const NUM_BG_IMAGES = 5; // This is hardcoded for now, and will be changed later on -> bash script could retrieve the count from directory and hand it as a variable
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
    const searchMap = new Map([ ["Portland, United States", "Portland, Oregon"], ["New York, United States", "New York City"], ["Anchorage, United States", "Anchorage, Alaska"], ["London, Canada", "London, Ontario"], ["Guelph, Canada", "Guelph, Ontario"], ["Montréal, Canada", "Montreal"], ["Quebec City, Canada", "Quebec City"], 
["Birmingham, United States", "Birmingham, Alabama"], ["Ellore, India", "Eluru"]])
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

    function displayMainCityInfo(name, country, population, weatherObj){
        const sunriseTime = new Date(weatherObj.current.sunrise * 1000);
        const sunsetTime = new Date(weatherObj.current.sunset * 1000);
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
    function tempString () {
        let temperatureString = "";
        temperatureUnit === 'celcius' ? temperatureString = '°C' : temperatureString = '°F';
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
        document.querySelector("#currentTemp").textContent = `Currently ${convertKelvinToUnit(temperatureUnit, weatherObj.current.temp), tempString()}` ;
        document.querySelector(".pressure").textContent = `Atmospheric pressure is ${weatherObj.current.pressure } hPa`
        document.querySelector(".visibility").textContent = `Visibility up to ${Math.round(weatherObj.current.visibility / 1000, 1)}km`;
        document.querySelector("#feelsTemp").textContent = `Feels like ${convertKelvinToUnit(temperatureUnit, weatherObj.current.feels_like), tempString()}`;
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
        currentTime >= sunriseTime && currentTime < sunsetTime ? timeImg.src = "./images/weather-assets/sun.png" : timeImg.src = "./images/weather-assets/moon.png";
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
            cityInfoView.classList.toggle("city-info-view-visible")
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
        const currentDate = new Date(); // Chart starts at today + 1
        const currentMonth = currentDate.getMonth();
        const monthNumToDays = new Map([ [0, 31], [1, 28], [2, 31], [3, 30], [4, 31], [5, 30], [6, 31], [7, 31], [8, 31], [9, 31], [10, 30], [11, 31] ]); // 0=jan, 1=feb, ...
        for (let i = 0; i < DAYS_IN_WEEK; i++){
            let date = currentDate.getDate() + i;
            const numDaysInCurrentMonth = monthNumToDays.get(currentMonth);
            if (date > numDaysInCurrentMonth){
                currentDate.setMonth(currentMonth + 1);
                date = Math.abs(date - numDaysInCurrentMonth);
            }
            const monthFormatted = new Intl.DateTimeFormat("en-us", {month: "long"}).format(currentDate);
            week.push(monthFormatted + " " + date);
        }
        return week;
    }


});