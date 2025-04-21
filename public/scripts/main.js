let pokemon_url = [];
let pokemon_arr = [];
let pokemon_data = [];

let is_pokemon_loaded = false;
let active_list = null;

let poke_team = [];

let type_moves=[];
let type_weakness = [];
let super_effective = [];
let resists_type = [];
let move_type_map = {};

for (let i = 0; i < 18; i++) {
    type_moves[i]=[];
    type_weakness.push({ name: "", value: 0, img:""});
    super_effective.push({ name: "", value: 0, img:"" });
    resists_type.push({ name: "", value: 0, img:"" });
}

function generateTeamString() {
    let teamString = "";

    for (let i = 0; i < poke_team.length; i++) {
        let pk = poke_team[i];
        let moves = pk.selected_moves ? pk.selected_moves.join(',') : "";
        let nickname=pk.nickname ? pk.nickname: "";
        teamString += pk.id + ":" + pk.name + ":" + moves + ":" + nickname;

        if (i !== poke_team.length - 1) {
            teamString += "|";
        }
    }

    return teamString;
}

function loadTeamFromString(teamString) {
    let teamArray = teamString.split("|"); 
    let newTeam = [];

    for (let entry of teamArray) {
        let parts = entry.split(":");
        let id = parseInt(parts[0]);
        let name = parts[1] ? parts[1] : "";
        let moves = parts[2] ? parts[2].split(",") : [];
        let nickname = parts[3] ? parts[3] : ""; 

        newTeam.push({
            id: id,
            name: name,
            selected_moves: moves,
            nickname: nickname 
        });
    }

    return newTeam;
}

function generateShareableURL() {
    for (let i = 0; i < poke_team.length; i++) {
        let nicknameInput = document.querySelector(`#pk${i+1} .nickname`);
        if (nicknameInput) {
            poke_team[i].nickname = nicknameInput.value.trim();  
        }
    }

    let teamString = generateTeamString(); 
    let encoded = encodeURIComponent(teamString); 
    let url = `${window.location.origin}${window.location.pathname}?team=${encoded}`;
    return url;
}

async function loadTeamFromURL() {
    let params = new URLSearchParams(window.location.search);
    let teamParam = params.get("team");
    if (teamParam) {
        let decoded = decodeURIComponent(teamParam);

        let loadedTeam = loadTeamFromString(decoded);

        for (let i = 0; i < loadedTeam.length; i++) {
            let pokemon = get_pokemon(loadedTeam[i].id)
            pokemon.selected_moves=loadedTeam[i].selected_moves;
            poke_team[i] = pokemon; 
            

            let img = document.querySelector(`#pk_img${i+1}`);
            img.innerHTML = `<img src=${pokemon.sprite} class="sprite"></img>`;

            let name = document.querySelector(`#pokeSearch${i+1}`);
            name.value = pokemon.name;

            let nicknameField = document.querySelector(`#pk${i+1} .nickname`);
            if (nicknameField) {
                nicknameField.value = loadedTeam[i].nickname ? loadedTeam[i].nickname : "";
            }

            const list = document.querySelector(`#pokeList${i+1}`);
            list.innerHTML = "";

            let type = document.querySelector(`#poke_type${i+1}`);
            let type1 = "";
            for (let rec of type_weakness) {
                if (rec.name === pokemon.type_name_1)
                    type1 = rec.img;
            }
            type.innerHTML = `<img src="${type1}" alt="p${i+1}_type1" class="type_image">`;

            if (pokemon.type_length === 2) {
                let type2 = "";
                for (let rec of type_weakness) {
                    if (rec.name === pokemon.type_name_2)
                        type2 = rec.img;
                }   
                type.innerHTML += `<img src="${type2}" alt="p${i+1}_type2" class="type_image">`; 
            }    

            display_moves(i+1, pokemon);  

            if (pokemon.selected_moves && pokemon.selected_moves.length > 0) {
                let dropdowns = document.getElementsByClassName(`move_dropdown${i+1}`);
                for (let m = 0; m < dropdowns.length; m++) {
                    let dropdown = dropdowns[m];
                    let moveName = pokemon.selected_moves[m];

                    let found = false;
                    if (moveName) {
                        for (let j = 0; j < dropdown.options.length; j++) {
                            if (dropdown.options[j].value === moveName) {
                                dropdown.selectedIndex = j;
                                dropdown.className = `move_dropdown${i+1} ${dropdown.options[j].className}`;
                                found = true;
                                break;
                            }
                        }
                    }
                    if (!found) {
                        dropdown.selectedIndex = 0;
                        dropdown.className = `move_dropdown${i+1}`;
                    }
                }
            }
        }
        console.log("Loaded team from URL:", poke_team);
    }
}


function copyToClipboard() {
    let url = generateShareableURL();

    navigator.clipboard.writeText(url)
        .then(() => {
            alert("Team Link copied to clipboard!");
        })
        .catch(err => {
            console.error("Failed to copy: ", err);
        });
}

async function display_list(list_num) {
    active_list = list_num;

    while(!is_pokemon_loaded)
        await new Promise(resolve => setTimeout(resolve, 100));

    let list = document.querySelector(`#pokeList${list_num}`);
    let html = '';
    
    for (let i = 0; i < pokemon_arr.length; i++) {
        const pokemon = await get_pokemon(i); 

        html += `
        <li>
            <a href="#" onclick="display_pokemon_info(${i}, ${list_num})" class="list_data">
                <img src="${pokemon.sprite}" class="pokemon-icon">
                ${pokemon_arr[i].name}
            </a>
        </li>`;
    }
    
    list.innerHTML = html;
    list.style.display = 'block';

    setupClickOutside(list, list_num);
}

function setupClickOutside(list, list_num) {
    function handleClickOutside(event) {
        if (!list.contains(event.target) && event.target.id !== `pokeSearch${list_num}`) {
            list.style.display = 'none';
            document.removeEventListener('click', handleClickOutside);
        }
    }
    document.addEventListener('click', handleClickOutside);
}


function display_moves(index, pokemon) { 
    let moves = pokemon.moves;
    
    let dropdowns = document.getElementsByClassName(`move_dropdown${index}`);
    for(let dropdown of dropdowns){
        let html = `<option value="">Select Move</option>`;
        for(let move of moves) {
            let type=assign_type(move);
            
            html += `<option value="${move}" class="${type}-move">${move} </option>`;
        }
        dropdown.innerHTML = html;

        dropdown.addEventListener('change', function() {
            let selectedOption = this.options[this.selectedIndex];
            this.className = `move_dropdown${index} ${selectedOption.className}`;

            let selectedMove = this.value;
            if (poke_team[index-1]) {
                poke_team[index-1].selected_moves = poke_team[index-1].selected_moves || [];

                let movePosition = Array.from(dropdowns).indexOf(this);  
                poke_team[index-1].selected_moves[movePosition] = selectedMove;

            }
        });
    }
}

async function display_pokemon_info(id, list_num){
    let pokemon = get_pokemon(id);
    poke_team.push(pokemon);
   
    let img = document.querySelector(`#pk_img${list_num}`);
    img.innerHTML = `<img src=${pokemon.sprite} class="sprite"></img>`;

    let name = document.querySelector(`#pokeSearch${list_num}`);
    name.value = pokemon.name;

    const list = document.querySelector(`#pokeList${list_num}`);
    list.innerHTML = "";

    let type = document.querySelector(`#poke_type${list_num}`);
    let type1 = "";
    for(let rec of type_weakness){
        if (rec.name === pokemon.type_name_1)
            type1 = rec.img;
    }

    type.innerHTML=`<img src="${type1}" alt="p${list_num}_type1" class="type_image">`;

    if(pokemon.type_length === 2) {
        let type2 = "";
        for(let rec of type_weakness){
            if (rec.name === pokemon.type_name_2)
                type2 = rec.img;
        }   
        type.innerHTML+=`<img src="${type2}" alt="p${list_num}_type2" class="type_image">`; 
    }    

    display_moves(list_num, pokemon);

    if (pokemon.selected_moves && pokemon.selected_moves.length > 0) {
        let dropdowns = document.getElementsByClassName(`move_dropdown${list_num}`);
        for (let i = 0; i < dropdowns.length; i++) {
            let dropdown = dropdowns[i];
            let moveName = pokemon.selected_moves[i];

            if (moveName) {
                for (let j = 0; j < dropdown.options.length; j++) {
                    if (dropdown.options[j].value === moveName) {
                        dropdown.selectedIndex = j;
                        dropdown.className = `move_dropdown${list_num} ${dropdown.options[j].className}`;
                        break;
                    }
                }
            
            if (!found) {
                dropdown.selectedIndex = 0;  
                dropdown.className = `move_dropdown${list_num}`;
            }
            }
             else {
                dropdown.selectedIndex = 0;  
                dropdown.className = `move_dropdown${list_num}`;
            }
        }
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
        calc_type_relations(pk.type_name_1);
        if(pk.type_length == 2)
            calc_type_relations(pk.type_name_2);
    }
    display_team_relations();
}

function assign_type(move){
   
    return move_type_map[move];
}

async function get_types(){
    const t_response=await fetch("https://pokeapi.co/api/v2/type/");
    const t_data=await t_response.json();


    for(let i=0;i<18;i++){
        const type_response=await fetch(t_data.results[i].url);
        const type_data=await type_response.json();

        const sprite=type_data.sprites["generation-viii"]["brilliant-diamond-and-shining-pearl"].name_icon;

        for(let rec of type_data.moves){
            if(!rec.name)
                console.warn(`Move data undefined at type ${i};`, rec);
            type_moves[i].push(rec.name);
            move_type_map[rec.name] = t_data.results[i].name;
        }

        type_weakness[i].name=t_data.results[i].name;
        type_weakness[i].img=sprite;

        super_effective[i].name=t_data.results[i].name;
        super_effective[i].img=sprite;

        resists_type[i].name=t_data.results[i].name;
        resists_type[i].img=sprite;
    }

    for (let i = 0; i < 18; i++) {
        for (let name of type_moves[i]) {
           
        }
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

async function load_pokemon() {
    try {
        const responses = await Promise.all(pokemon_url.map(url => fetch(url)));
        const pokemonData = await Promise.all(responses.map(res => res.json()));

        for (let i = 0; i < pokemonData.length; i++) {
            const pokemon = pokemonData[i];
            const sprite = pokemon.sprites.front_default;
            const name = pokemon.name;
            const type_length = pokemon.types.length;
            const type_name_1 = pokemon.types[0].type.name;

            const moves = [];
            for (let j = 0; j < pokemon.moves.length; j++) {
                moves.push(pokemon.moves[j].move.name);
            }

            if (type_length === 1) {
                pokemon_data.push({
                    id: i,
                    sprite: sprite,
                    name: name,
                    nickname: "",
                    moves: moves,
                    selected_moves: [],
                    type_length: type_length,
                    type_name_1: type_name_1,
                });
            } else if (type_length === 2) {
                const type_name_2 = pokemon.types[1].type.name;
                pokemon_data.push({
                    id: i,
                    sprite: sprite,
                    name: name,
                    nickname: "",
                    moves: moves,
                    selected_moves: [],
                    type_length: type_length,
                    type_name_1: type_name_1,
                    type_name_2: type_name_2,
                });
            }
        }

        is_pokemon_loaded = true;

        if (active_list !== null)
            display_list(active_list);

    } catch (error) {
        console.error("Error loading Pokémon:", error);
    }
}

 function get_pokemon(id) {
    return pokemon_data[id];
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

function clearCard(cardNumber) {

    poke_team[cardNumber-1] = null;

    document.querySelector(`#pokeSearch${cardNumber}`).value = '';

    document.querySelector(`#pk${cardNumber} .nickname`).value = '';

    document.querySelector(`#pk_img${cardNumber}`).innerHTML = '';

    document.querySelector(`#poke_type${cardNumber}`).innerHTML = '';

    let dropdowns = document.getElementsByClassName(`move_dropdown${cardNumber}`);
    for (let dropdown of dropdowns) {
        dropdown.innerHTML = '<option value="">Select Move</option>';
        dropdown.className = `move_dropdown${cardNumber}`;
    }
    
    document.querySelector(`#pokeList${cardNumber}`).style.display = 'none';
}

async function main() {
    document.getElementById("loading-screen").style.display = "flex";  // Show loading

    await get_all_pokemon();
    await get_types();
    await load_pokemon();
    await loadTeamFromURL();

    document.getElementById("loading-screen").style.display = "none";  // Hide loading
}

main();