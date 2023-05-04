
import cityInfoDisplay from './scripts/cityDisplay.js'
import { findMatches, fetchEndpointData } from "./scripts/miscellaneous.js";
import { getSpecifiedCity, cityNotFoundError, loadAnimationLogic } from "./scripts/locateCity.js"
/*
* The idea for this project is to display convenient and relevant weather info about a given city (25,000+ inhabitants for this website),
* along with practicing API calls. I'm using the Google Maps API to retrieve a description of the given city
*/

// Retrieve city data either from local storage, or from the API.
async function loadCityData(){ 
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
    return cityData;
}

// Wait for the HTML to load before applying any logic
document.addEventListener("DOMContentLoaded", async () => {
    // Load the city data into a variable
    const cityData = await loadCityData();
    
    // Number of cities in the body
    const NUM_CITIES = cityData.length;
    
    // Button event listeners
    const cityInputBtn = document.querySelector("#city-submit-btn");
    cityInputBtn.addEventListener("click", handleCityInput);
    // Retrieve city data -> retrieve weather data
    const cityInput = document.querySelector("#city-input");
    cityInput.addEventListener("input", autocompleteCityInput)

    // This object contains location data in the form of city, country to locate a specific entry
    const cityCountryObj = cityData.map((entry) => {return {"location": `${entry.city}, ${entry.country}`}});

    // Define a function that loads a placeholder for the city text input
    function loadCityInputPlaceholder(){
        const citySeed = Math.floor(Math.random() * NUM_CITIES);
        cityInput.placeholder = `${cityData[citySeed].city}, ${cityData[citySeed].country}`; // Random placeholder for a city 
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
    // Handles the logic when a user submits a city to find.
    function handleCityInput(){
        // The user value for the inputted city
        const userCityInput  = document.querySelector("#city-input").value;
        // Retrieves the city Object that the user was looking for
        const inputCity = getSpecifiedCity(userCityInput, cityData);
        if (inputCity != ""){ // The input is not null, or undefined, etc.
            loadAnimationLogic("active", cityInputBtn); 
            cityInfoDisplay(inputCity);
        }
        else{
            // City could not be found, display an error message
            cityNotFoundError(userCityInput)
        }
    }

    // Call the function 
    loadCityInputPlaceholder();   

    // Listens for screen/window resizes
    addEventListener("resize", () => {
        if (window.innerWidth < 500){
            document.querySelector(".city-info-view").style.display = 'block';
        }
        else {
            document.querySelector(".city-info-view").style.display = 'grid';
        }
    })
});
