// SCRIPT tag is in the head of HTML, so DOM elements cannot be retrieved without waiting for them to load
async function fetchEndpointData(endpoint){
    return (await fetch(endpoint)).json();
}
document.addEventListener("DOMContentLoaded", async () => {
    // Query Selectors for some of the data elements 
    const cityNameContainer = document.querySelector(".name");
    const cityCountryContainer = document.querySelector(".country");
    const cityPopulationContainer = document.querySelector(".population");
    // Weather API Key
    const WEATHER_API_KEY = "3c7bc9f835d589478c313a48f04509d2";
    // Retrieves the data to be presented for every city
    let cityData = JSON.parse(localStorage.getItem('cityData')) || "";
    console.log(cityData);
    if (cityData === ""){
        try{
            cityData = await fetchEndpointData("https://api.npoint.io/51175e4a65b8e108e5ad"); // Retrieves the city data from the 
            const cityDataStringified = JSON.stringify(cityData);
            localStorage.setItem('cityData', cityDataStringified);
        } 
        catch(error){
            console.log(error);
        }
    }
    const NUM_CITIES = cityData.length;
    // Button event listener
    const cityInputBtn = document.querySelector("#city-submit-btn");
    cityInputBtn.addEventListener("click", presentCityInfo);
    // Retrieve city data -> retrieve weather data
    const cityInput = document.querySelector("#city-input");
    cityInput.placeholder = cityData[Math.floor(Math.random() * NUM_CITIES)].city; // Random placeholder for a city 
    
    function presentCityInfo(){
        changeView("city-info"); // Switches the page view to display city information
        const cityName  = document.querySelector("#city-input").value;
        console.log(cityName);
        const inputCity = getSpecifiedCity(cityName);
        console.log(inputCity);
        //const weatherData = retrieveCityWeatherData(inputCity.lat, inputCity.lng);
        displayMainCityInfo(cityName, inputCity.country, inputCity.population);
        //console.log(weatherData);
    }
    function displayMainCityInfo(name, country, population){
        cityNameContainer.textContent = name;
        cityCountryContainer.textContent = country;
        cityPopulationContainer.textContent = `Population of ${population}`;
    }
    /* Retrieves and returns the weather data associated with the given coordinates */
    async function retrieveCityWeatherData(cLat, cLong){
        let weatherData = "";
        try{
            weatherData = await fetchEndpointData(`https://api.openweathermap.org/data/3.0/onecall?lat=${cLat}&lon=${cLong}&units=metric&exclude=hourly,daily&appid=${WEATHER_API_KEY}`)
        }
        catch(e){
            console.log("An error occured while fetching your weather data!" + e);
        }
        return weatherData;
    }
    function getSpecifiedCity(cityName){
        let userCity = "";
        for (let city of cityData){
            if (city.city === cityName){
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
});