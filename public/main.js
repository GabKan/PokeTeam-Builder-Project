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

async function post_data(url, data) {
    try{
        let response = await fetch(
            url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type':'application/json' }
            },
        );        
        let result = await response.json();
        console.log(result);      
    }catch(error){
        console.log(error);
    }
}

function submit(event) {
    event.preventDefault();

    const form = event.target;
    const form_data = new FormData(form);
    const data = Object.fromEntries(form_data);

    post_data("https://my-firebase.json", data);
}

async function main() {
    await get_all_pokemon();
    document.forms['my-form'].addEventListener('submit', submit);
}

main();