let allPokemon = [];

function displayPokemon() {
    for(let pokemon of allPokemon)
        console.log(pokemon);
}

async function getAllPokemon() {
    let url = "https://pokeapi.co/api/v2/pokemon/";

    while (url !== null) {
        const response = await fetch(url);
        const data = await response.json();

        for(let result of data.results) {
            allPokemon.push(result.url);
        }

        url = data.next;
    }

    console.log("Total Pokemon: " + allPokemon.length);

    displayPokemon();
}

getAllPokemon();
