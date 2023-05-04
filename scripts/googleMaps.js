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
// Given the latitude and longitude of the city, we use google maps and places to retrieve info from it. 
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
            for (let result of results){
                if (result.photos !== ""){
                    const photoDiv = document.querySelector("#google-maps-city-photo");
                    photoDiv.innerHTML = ""; // resets any previous images in there
                    const cityImg = document.createElement("img");
                    cityImg.setAttribute("src", result.photos[0].getUrl({maxHeight: 350})); // Images with a height greater than approx. 350 pixels look a lil wonky
                    cityImg.setAttribute("alt", 'City Image');
                    cityImg.setAttribute("id", "cityImg")
                    photoDiv.appendChild(cityImg);
                }
                else{
                    console.log("No images of the specified location could be retrieved.")
                }
            }
        }
        else {
            console.log("An Error Occured while retrieving maps data from the specified location.");
        }
    });
}

export default initializeMap;