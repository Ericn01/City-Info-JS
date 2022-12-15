// SCRIPT tag is in the head of HTML, so DOM elements cannot be retrieved without waiting for them to load
async function fetchCityData(){
    return (await fetch("https://api.npoint.io/51175e4a65b8e108e5ad")).json();
}
document.addEventListener("DOMContentLoaded", async () => {
    // Retrieves the data to be presented for every city
    let cityData = JSON.parse(localStorage.getItem('cityData')) || "";
    if (cityData === ""){
        try{
            cityData = await fetchCityData(); // Retrieves the 
            const songsStringified = JSON.stringify(cityData);
            localStorage.setItem('cityData', songsStringified);
        } 
        catch(error){
            console.log(error);
        }
    }
    console.log(cityData[100]);
    const NUM_CITIES = cityData.length;
    // Button event listener
    const cityInputBtn = document.querySelector("#city-submit-btn");
    cityInputBtn.addEventListener("click", console.log("I've been clicked"));
    // Retrieve city data -> retrieve weather data
    const cityInput = document.querySelector("#city-input");
    cityInput.placeholder = cityData[Math.floor(Math.random() * NUM_CITIES)].city; // Random placeholder for a city 

    function load
});