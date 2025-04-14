let pokemon_url = [];
let pokemon_arr=[];
let poke_team=[];
let type_relations=[];

function display_pokemon() {
    for(let pokemon of pokemon_url)
        console.log(pokemon);
}

function display_list(list_num){
    let list=document.querySelector(`#pokeList${list_num}`);
    let html='';
    for(let i=0;i<pokemon_arr.length;i++){
       html += `<li><a href="#" onclick="display_pokemon_info(${i}, ${list_num})">${pokemon_arr[i].name}</a></li>`
    }
    list.innerHTML=html;
}

async function display_pokemon_info(id, list_num){
    let pokemon=await get_pokemon(id);
    poke_team[id-1]=pokemon;
   
    let img=document.querySelector(`#pk_img${list_num}`);
    img.innerHTML= `<img src=${pokemon.sprites.front_default} class="sprite"></img>`;

    let name=document.querySelector(`#pokeSearch${list_num}`);
    name.value= pokemon_arr[id].name;

    const list=document.querySelector(`#pokeList${list_num}`);
    list.innerHTML="";

    let type=document.querySelector(`#poke_type${list_num}`);
    type.innerHTML=`${pokemon.types[0].type.name}`;

    if(pokemon.types.length==2)
    {
        let type2=document.querySelector(`#poke_type${list_num}`);
        type2.innerHTML=`${pokemon.types[0].type.name} / ${pokemon.types[1].type.name}`; //should change to either img or style the types
    }    

}

async function get_all_pokemon() {
    let url = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1302";
    const response = await fetch(url);
    const data = await response.json();

    for(let result of data.results) {
        pokemon_url.push(result.url);
        pokemon_arr.push(result);
    }

    //display_pokemon();
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

function filterPokemon(list_num){
    let input=document.getElementById("pokeSearch1");
    let capInput=input.value.toUpperCase();
    let ul=document.getElementById(`pokeList${list_num}`);
    let li=ul.getElementsByTagName("li");

    if(capInput.length >0)
        ul.style.display="block";
    else
        ul.style.display="none";

    for(let i of li){
        let pokemon_name=i.textContent.toUpperCase();
        if(pokemon_name.indexOf(capInput)>-1)
            i.style.display="";
        else
            i.style.display="none";
    }
        
}

main();