// SCRIPT tag is in the head of HTML, so DOM elements cannot be retrieved without waiting for them to load
document.addEventListener("DOMContentLoaded", () => {
    // Button event listener
    const cityInputBtn = document.querySelector("#city-input-btn");
    cityInputBtn.addEventListener("click", handleCityData);
    // Retrieve city data -> retrieve weather data
    const cityInput = document.querySelector("#city-input").value;

    async function handleCityData(){
        const userCity = this.value; 
        const endpoint =  "https://api.npoint.io/51175e4a65b8e108e5ad";
        const dataFetch = await fetch(endpoint).then(response.json());

    }
});