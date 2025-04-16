let pokemon_url = [];
let pokemon_arr = [];

let poke_team = [];

let type_weakness = [];
let super_effective = [];
let resists_type = [];

for (let i = 0; i < 18; i++) {
    type_weakness.push({ name: "", value: 0, img:""});
    super_effective.push({ name: "", value: 0, img:"" });
    resists_type.push({ name: "", value: 0, img:"" });
}

function display_pokemon() {
    for(let pokemon of pokemon_url)
        console.log(pokemon);
}


async function display_list(list_num) {
    let list = document.querySelector(`#pokeList${list_num}`);
    let html = '';
    
    for (let i = 0; i < pokemon_arr.length; i++) {
        const pokemon = await get_pokemon(i); 
        
        html += `
        <li>
            <a href="#" onclick="display_pokemon_info(${i}, ${list_num})" class="list_data">
                <img src="${pokemon.sprites.front_default}" class="pokemon-icon">
                ${pokemon_arr[i].name}
            </a>
        </li>`;
    }
    
    list.innerHTML = html;
}

async function display_moves(index, pokemon) {
    let moves = pokemon.moves;

    let dropdowns = document.getElementsByClassName(`move_dropdown${index}`);
    for(let dropdown of dropdowns){
        let html = `<option value="">Select Move</option>`;
        for(let move of moves) {
            let move_name = move.move.name;
            html += `<option value="${move_name}">${move_name}</option>`;
        }
        dropdown.innerHTML = html;
    }
}

async function display_pokemon_info(id, list_num){
    let pokemon=await get_pokemon(id);
    poke_team[list_num-1]=pokemon;
   
    let img=document.querySelector(`#pk_img${list_num}`);
    img.innerHTML= `<img src=${pokemon.sprites.front_default} class="sprite"></img>`;

    let name=document.querySelector(`#pokeSearch${list_num}`);
    name.value= pokemon_arr[id].name;

    const list=document.querySelector(`#pokeList${list_num}`);
    list.innerHTML="";

    let type=document.querySelector(`#poke_type${list_num}`);
    let type1="";
    for(let rec of type_weakness){
        if (rec.name===pokemon.types[0].type.name)
            type1=rec.img;
    }

    type.innerHTML=`<img src="${type1}" alt="p${list_num}_type1" class="type_image">`;

    if(pokemon.types.length==2)
    {
        let type2="";
        for(let rec of type_weakness){
            if (rec.name===pokemon.types[1].type.name)
                type2=rec.img;
        }   
        type.innerHTML+=`<img src="${type2}" alt="p${list_num}_type2" class="type_image">`; 
    }    

    for(let i=0;i<6;i++){
        await display_moves(i + 1, pokemon);
    }
}

function display_team_relations(){
    let weaknesses=document.querySelector('#weaknesses');
    let weak_html='';
    let resistances=document.querySelector('#resistances');
    let res_html='';
    let super_eff=document.querySelector('#super-effective');
    let super_html='';
    let resisted=document.querySelector('#resisted');
    let res_by_html='';

    for(let i=0;i<18; i++){
        console.log(type_weakness[i].img)
        if(type_weakness[i].value===1){
            weak_html+=`
            <div class="type-against">
            <img src="${type_weakness[i].img}" alt="${type_weakness[i].name}" class="type_image">
            </div>`
        }
        else if(type_weakness[i].value>1){
            weak_html+=`
            <div class="type-against">
            <img src="${type_weakness[i].img}" alt="${type_weakness[i].name}" class="type_image">
            <p>x${type_weakness[i].value}</p>
            </div>`
        }
        else if(type_weakness[i].value===-1){
            res_html+=`
            <div class="type-against">
            <img src="${type_weakness[i].img}" alt="${type_weakness[i].name}" class="type_image">
            </div>`
        }
        else if(type_weakness[i].value<-1){
            type_weakness[i].value=Math.abs(type_weakness[i].value);
            res_html+=`
            <div class="type-against">
            <img src="${type_weakness[i].img}" alt="${type_weakness[i].name}" class="type_image">
            <p>x${type_weakness[i].value}</p>
            </div>`;
        }
            

        if(super_effective[i].value===1){
            super_html+=`
            <div class="type-against">
            <img src="${super_effective[i].img}" alt="${super_effective[i].name}" class="type_image">
            </div>`
        }
        else if(super_effective[i].value>1){
            super_html+=`
            <div class="type-against">
            <img src="${super_effective[i].img}" alt="${super_effective[i].name}" class="type_image">
            <p> x${super_effective[i].value}</p>
            </div>`
        }

        if(resists_type[i].value + super_effective[i].value==-1){
            res_by_html+=`
            <div class="type-against">
            <img src="${resists_type[i].img}" alt="${resists_type[i].name}" class="type_image">
            </div>`
        }
        else if(resists_type[i].value + super_effective[i].value<-1){
            resists_type[i].value=Math.abs(resists_type[i].value)
            res_by_html+=`
            <div class="type-against">
            <img src="${super_effective[i].img}" alt="${super_effective[i].name}" class="type_image">
            <p> x${resists_type[i].value}</p>
            </div>`
        }
        resists_type[i].value=0;
        super_effective[i].value=0;
        type_weakness[i].value=0;
    }
    resisted.innerHTML=res_by_html;
    super_eff.innerHTML=super_html;
    resistances.innerHTML=res_html;
    weaknesses.innerHTML=weak_html;

    
}

function calc_type_relations(type){
    switch(type){
        case "normal":
            type_weakness[1].value++;
            break;

        case "fighting":
            type_weakness[2].value++;
            type_weakness[13].value++;
            type_weakness[17].value++;
            type_weakness[5].value--;
            type_weakness[6].value--;
            type_weakness[16].value--;

            super_effective[0].value++;
            super_effective[16].value++
            super_effective[8].value++;
            super_effective[5].value++;
            super_effective[14].value++;
            resists_type[2].value--;
            resists_type[3].value;
            resists_type[6].value--;
            resists_type[13].value--;
            resists_type[17].value--;
            break;

        case "flying":
            type_weakness[5].value++;
            type_weakness[12].value++;
            type_weakness[14].value++;
            type_weakness[1].value--;
            type_weakness[6].value--;
            type_weakness[11].value--;
            type_weakness[4].value--;

            super_effective[1].value++;
            super_effective[6].value++;
            super_effective[11].value++;
            resists_type[5].value--;
            resists_type[8].value--;
            resists_type[12].value--;
            break;

        case "poison":
            type_weakness[4].value++;
            type_weakness[13].value++;
            type_weakness[11].value--;
            type_weakness[17].value--;
            type_weakness[6].value--;
            type_weakness[1].value--;
            type_weakness[3].value--;

            super_effective[17].value++;
            super_effective[11].value++;
            resists_type[3].value--;
            resists_type[5].value--;
            resists_type[7].value--;
            resists_type[4].value--;
            break;

        case "ground":
            type_weakness[10].value++;
            type_weakness[11].value++;
            type_weakness[15].value++;
            type_weakness[3].value--;
            type_weakness[5].value--;

            super_effective[3].value++;
            super_effective[5].value++;
            super_effective[9].value++;
            super_effective[8].value++;
            super_effective[12].value++;
            resists_type[6].value--;
            resists_type[11].value--;
            resists_type[2].value--;
            break;

        case "rock":
            type_weakness[1].value++;
            type_weakness[4].value++;
            type_weakness[9].value++;
            type_weakness[10].value++;
            type_weakness[11].value++;
            type_weakness[2].value--;
            type_weakness[0].value--;
            type_weakness[9].value--;
            type_weakness[3].value--;

            super_effective[6].value++;
            super_effective[9].value++;
            super_effective[14].value++;
            super_effective[2].value++;
            resists_type[1].value--;
            resists_type[10].value--;
            resists_type[4].value--;
            break;

        case "bug":
            type_weakness[9].value++;
            type_weakness[2].value++;
            type_weakness[5].value++;
            type_weakness[1].value--;
            type_weakness[11].value--;
            type_weakness[4].value--;

            super_effective[11].value++;
            super_effective[13].value++;
            super_effective[16].value++;
            resists_type[1].value--;
            resists_type[2].value--;
            resists_type[3].value--;
            resists_type[7].value--;
            resists_type[9].value--;
            resists_type[10].value--;
            resists_type[17].value--;
            break;

        case "ghost":
            type_weakness[7].value++;
            type_weakness[16].value++;
            type_weakness[0].value--;
            type_weakness[1].value--;

            super_effective[7].value++;
            super_effective[13].value++;
            resists_type[0].value--;
            resists_type[16].value--;
            break;

        case "steel":
            type_weakness[9].value++;
            type_weakness[4].value++;
            type_weakness[1].value++;
            type_weakness[6].value--;
            type_weakness[0].value--;
            type_weakness[5].value--;
            type_weakness[2].value--;
            type_weakness[13].value--;
            type_weakness[15].value--;
            type_weakness[14].value--;
            type_weakness[11].value--;
            type_weakness[17].value--;
            type_weakness[8].value--;

            super_effective[14].value++;
            super_effective[5].value++;
            super_effective[17].value++;
            resists_type[8].value--;
            resists_type[9].value--;
            resists_type[10].value--;
            resists_type[12].value--;
            break;

        case "fire":
            type_weakness[5].value++;
            type_weakness[10].value++;
            type_weakness[4].value++;
            type_weakness[11].value--;
            type_weakness[6].value--;
            type_weakness[14].value--;
            type_weakness[8].value--;
            type_weakness[17].value--;
            type_weakness[9].value--;

            super_effective[6].value++;
            super_effective[11].value++;
            super_effective[8].value++;
            super_effective[14].value++;
            resists_type[5].value--;
            resists_type[9].value--;
            resists_type[10].value--;
            resists_type[15].value--;
            break;

        case "water":
            type_weakness[12].value++;
            type_weakness[11].value++;
            type_weakness[10].value--;
            type_weakness[9].value--;
            type_weakness[14].value--;
            type_weakness[8].value--;

            super_effective[5].value++;
            super_effective[4].value++;
            super_effective[9].value++;
            resists_type[10].value--;
            resists_type[11].value--;
            resists_type[15].value--;
            break;

        case "grass":
            type_weakness[9].value++;
            type_weakness[14].value++;
            type_weakness[6].value++;
            type_weakness[3].value++;
            type_weakness[2].value++;
            type_weakness[10].value--;
            type_weakness[4].value--;
            type_weakness[11].value--;
            type_weakness[12].value--;

            super_effective[4].value++;
            super_effective[10].value++;
            super_effective[5].value++;
            resists_type[6].value--;
            resists_type[2].value--;
            resists_type[3].value--;
            resists_type[8].value--;
            resists_type[11].value--;
            resists_type[15].value--;
            resists_type[9].value--;
            break;

        case "electric":
            type_weakness[4].value++;
            type_weakness[12].value--;
            type_weakness[8].value--;
            type_weakness[2].value--;

            super_effective[2].value++;
            super_effective[10].value++;
            resists_type[12].value--;
            resists_type[11].value--;
            resists_type[15].value--;
            resists_type[4].value--;
            break;

        case "psychic":
            type_weakness[16].value++;
            type_weakness[7].value++;
            type_weakness[6].value++;
            type_weakness[13].value--;
            type_weakness[1].value--;

            super_effective[1].value++;
            super_effective[3].value++;
            resists_type[13].value--;
            resists_type[8].value--;
            resists_type[6].value--;
            resists_type[16].value--;
            break;

        case "ice":
            type_weakness[9].value++;
            type_weakness[8].value++;
            type_weakness[5].value++;
            type_weakness[1].value++;
            type_weakness[14].value--;

            super_effective[2].value++;
            super_effective[4].value++;
            super_effective[11].value++;
            super_effective[15].value++;
            resists_type[14].value--;
            break;

        case "dragon":
            type_weakness[14].value++;
            type_weakness[15].value++;
            type_weakness[17].value++;
            type_weakness[9].value--;
            type_weakness[10].value--;
            type_weakness[11].value--;
            type_weakness[12].value--;

            super_effective[15].value++;
            resists_type[17].value--;
            resists_type[8].value--;
            break;

        case "dark":
            type_weakness[1].value++;
            type_weakness[6].value++;
            type_weakness[17].value++;
            type_weakness[7].value--;
            type_weakness[16].value--;

            super_effective[7].value++;
            super_effective[13].value++;
            resists_type[16].value--;
            resists_type[17].value--;
            resists_type[1].value--;

            break;

        case "fairy":
            type_weakness[8].value++;
            type_weakness[3].value++;
            type_weakness[6].value--;
            type_weakness[1].value--;
            type_weakness[16].value--;

            super_effective[1].value++;
            super_effective[15].value++;
            super_effective[16].value++;
            resists_type[3].value--;
            resists_type[8].value--;
            resists_type[9].value--;

            break;
        default:
            break;
    }
}

function calc_team(){
    for(let pk of poke_team){
        calc_type_relations(pk.types[0].type.name);
        if(pk.types.length==2)
            calc_type_relations(pk.types[1].type.name);
    }
    display_team_relations();
}

async function get_types(){
    const t_response=await fetch("https://pokeapi.co/api/v2/type/");
    const t_data=await t_response.json();

    for(let i=0;i<18;i++){
        const type_img_response=await fetch(t_data.results[i].url);
        const type_img_data=await type_img_response.json();

        const sprite=type_img_data.sprites["generation-vi"]["x-y"].name_icon;


        type_weakness[i].name=t_data.results[i].name;
        type_weakness[i].img=sprite;

        super_effective[i].name=t_data.results[i].name;
        super_effective[i].img=sprite;

        resists_type[i].name=t_data.results[i].name;
        resists_type[i].img=sprite;
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
}

async function get_pokemon(id) {
    const response = await fetch(pokemon_url[id]);
    const data = await response.json();

    return data;
}

function filterPokemon(list_num){
    let input=document.getElementById(`pokeSearch${list_num}`);
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

async function main() {
    await get_all_pokemon();
    await get_types();

    get_pokemon(pokemon_id);
}

main();