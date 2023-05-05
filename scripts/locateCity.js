// This file contains the logic for the retrieval of the user's specified city

// Given the user's city string input, we check to see if our DB has a matching record.
function getSpecifiedCity(userCityInput, cityData){
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

// The logic that is applied if a city could not be found.
function cityNotFoundError(cityName){
    const cityNotFound = document.querySelector(".city-not-found");
    cityNotFound.innerHTML = ""; // Resets any error that was there previously 
    cityNotFound.textContent = `The city '${cityName}' could not be found. Please check your spelling, and try again.`
    document.querySelector('#city-input').value = "";
}    


export {getSpecifiedCity, cityNotFoundError};
