let pokemon_url = [];

function display_pokemon() {
    for(let pokemon of pokemon_url)
        console.log(pokemon);
}

async function get_all_pokemon() {
    let url = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1302";
    const response = await fetch(url);
    const data = await response.json();

    for(let result of data.results) {
        pokemon_url.push(result.url);
    }

    // display_pokemon();
}

async function get_pokemon(id) {
    const response = await fetch(pokemon_url[id]);
    const data = await response.json();

    return data;
}

async function main() {
    await get_all_pokemon();
    let data = await get_pokemon(0);

    console.log(data.sprites.other.showdown.front_default);
}

main();