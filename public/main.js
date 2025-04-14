let pokemon_url = [];
let pokemon_arr=[];
let poke_team=[];
let type_weakness=[];
let super_effective=[];
let resists_type=[];
for (let i = 0; i < 18; i++) {
    type_weakness.push({ name: "", value: 0 });
    super_effective.push({ name: "", value: 0 });
    resists_type.push({ name: "", value: 0 });
}

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
    poke_team[list_num-1]=pokemon;
   
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
        type.innerHTML=`${pokemon.types[0].type.name} / ${pokemon.types[1].type.name}`; //should change to either img or style the types
    }    

}

function display_team_relations(){
    let weaknesses=document.querySelector('#weaknesses');
    let weak_html='';
    let resistances=document.querySelector('#resistances');
    let res_html='';
    let super_eff=document.querySelector('#super-effective');
    let super_html='';

    for(let rec of type_weakness){
        console.log(rec.name);
        if(rec.value===1){
            weak_html+=`
            <p>${rec.name} </p>`
        }
        else if(rec.value>1){
            weak_html+=`
            <p>${rec.name} x${rec.value}</p>`
        }
        else if(rec.value===-1){
            res_html+=`
            <p>${rec.name} </p>`
        }
        else if(rec.value<-1){
            rec.value=Math.abs(rec.value);
            res_html+=`
            <p>${rec.name} x${rec.value}</p>`;
        }
        rec.value=0;
    }

    for(let rec of super_effective){
        if(rec.value===1){
            super_html+=`
            <p>${rec.name} </p>`
        }
        else if(rec.value>1){
            super_html+=`
            <p>${rec.name} x${rec.value}</p>`
        }
        rec.value=0;
    }

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
        type_weakness[i].name=t_data.results[i].name;
        super_effective[i].name=t_data.results[i].name;
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
    await get_types();
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