import { searchMap } from "./mapConstants.js";
import { fetchEndpointData } from "./miscellaneous.js";

// Fetching from the wikiepedia API to receive data about the city
async function getCityWikiPage(cityCountryPair){
    const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${cityCountryPair}&format=json&origin=*`; // Specifying the url to fetch from
    const wikiPage = await fetchEndpointData(url).then(res => res);
    return wikiPage;
}
// Given a string,  
async function parseWikiData(wikiData){
    const pageData = await wikiData;
    console.log(wikiData);
    if (pageData['parse'] != ""){
        if (!pageData['parse']['text']['*'].includes("NewPP limit report")) {
            const pageHTMLText = pageData['parse']['text']['*'];
            const parserObject = new DOMParser();
            const parsedText = parserObject.parseFromString(pageHTMLText, 'text/html').querySelectorAll("p")[1].textContent;
            let paragraphAttribute = "No information could be retrieved from Wikipedia for this city... Sorry!";
            if (parsedText != ""){
                paragraphAttribute = parsedText;
            }
            return paragraphAttribute.replace(/\[\w+\]/gm, '');
        }
    }
    else {
        console.log("The specified page does not exist...");
    }
}
// Change the way that the data is queried from wikipedia, depending on the population of the given city
async function performWikiDataLogic(inputCity){
    let unrefinedQuery = ""
    inputCity.population > 750000 ? unrefinedQuery = inputCity.city : unrefinedQuery = `${inputCity.city}, ${inputCity.country}`; // Large cities tend to work better when you only call their name, and not their country using the wikipedia API
    // Grab the wiki data container
    const wikiContainer = document.querySelector(".wiki-data");
    // The wikipedia search query 
    let queryText = ""
    // Logic for different types of searches
    queryText = searchMap.get(unrefinedQuery) ?? unrefinedQuery;
    // let the text content be what we retrieved.
    wikiContainer.textContent = await parseWikiData(getCityWikiPage(queryText));
}

export default performWikiDataLogic;