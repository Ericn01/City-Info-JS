// This script contains all functions that are considered miscellaneous / not required for the website to work properly 

// Switches the view of the application on click
function changeView(newView){
    const cityInputView = document.querySelector(".city-input-view");
    const cityInfoView = document.querySelector(".city-info-view");
    const switchViewBtn = document.querySelector('#switch-view-btn');
    if (newView === 'search'){
        switchViewBtn.style.display = 'none';
        cityInputView.style.display = 'block';
        cityInfoView.style.display = 'none';  
        loadAnimationLogic('inactive');
    }
    else if (newView === 'city-info'){
        cityInputView.style.display = 'none';
        switchViewBtn.style.display = 'inline';
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

// As the function name suggests, this function figures out the local time, given the location's time zone.
function calculateTimeAtLocation(locationTimezone){
    const dateAndTimeAtArea = new Date().toLocaleString("en-us", {timeZone: locationTimezone, weekday:'long', year:'numeric', month:'long',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'});
    return dateAndTimeAtArea; // Returns the current time at the location
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
/* A simple function that checks to see if the current user input string matches any of the cities in the fetched JSON data */
function findMatches(currentInput, cityCountryObj){
    const matchArray = []
    const matches = cityCountryObj.filter((entry) => entry.location.toLowerCase().includes(currentInput.toLowerCase()));
    matches.forEach((match) => {matchArray.push(match.location)})
    return matchArray; // Returns the results from the search
}

// Fetches data from an API at the specified endpoint.
async function fetchEndpointData(endpoint){
    const endpointResponse = await fetch(endpoint);
    const JSONData = await endpointResponse.json();
    return JSONData;
}

// Loader (gif) logic
function loadAnimationLogic (state){
    console.log(state);
    const animationImg = document.querySelector(".loading-img");
    const cityInputBtn = document.querySelector("#city-submit-btn");
    animationImg.setAttribute("src", "./images/loading.gif");
    
    if (state === "active"){
        cityInputBtn.style.display = "none";
        animationImg.style.display = 'inline';
    } else if (state === 'inactive'){
        cityInputBtn.style.display = "inline";
        animationImg.style.display = "none";
    }
}

export {convertKelvinToUnit, calculateTimeAtLocation, changeView, findMatches, fetchEndpointData, loadAnimationLogic};