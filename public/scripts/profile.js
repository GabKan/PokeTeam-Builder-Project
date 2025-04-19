
let savedTeams = [];


function saveTeam() {
    let team = [];
    

    for (let i = 1; i <= 6; i++) {
        let pokemonData = getPokemonData(i);
        if (pokemonData.name) {
            team.push(pokemonData);
        }
    }

    saveToLocalStorage(team);

    alert("Team Saved!");
    window.location.href = "profile.html";
}

function getPokemonData(pokiInfo) {
    let pokemonNameElement = document.getElementById('pokeSearch' + pokiInfo);
    let nicknameElement = document.querySelector('#pk' + pokiInfo + ' .nickname');
    let pokiImg = document.getElementById('pk_img' + pokiInfo);
    let imgElement = null;
    
    if (pokiImg) {
        let imgElements = pokiImg.getElementsByTagName('img');
        if (imgElements.length > 0) {
            imgElement = imgElements[0];
        }
    }
    
 
    let pokemonName = '';
    if (pokemonNameElement && pokemonNameElement.value) {
        pokemonName = pokemonNameElement.value.trim();
    }
    
    let nickname = '';
    if (nicknameElement && nicknameElement.value) {
        nickname = nicknameElement.value.trim();
    }
    
    let imgSrc = '';
    if (imgElement && imgElement.src) {
        imgSrc = imgElement.src;
    }
    
    let moves = getMoves(pokiInfo);

    return {
        name: pokemonName,
        nickname: nickname,
        img: imgSrc,
        moves: moves
    };
}

function getMoves(pokiInfo) {
    let moves = [];
    let moveDropdowns = document.querySelectorAll('#pk' + pokiInfo + ' .move_dropdown' + pokiInfo);
    
    for (let j = 0; j < moveDropdowns.length; j++) {
        if (moveDropdowns[j] && moveDropdowns[j].value) {
            moves.push(moveDropdowns[j].value);
        }
    }
    
    return moves;
}


function saveToLocalStorage(team) {
    let storedTeams = localStorage.getItem("savedTeams");
    if (storedTeams) {
        savedTeams = JSON.parse(storedTeams);
    } else {
        savedTeams = [];
    }
    
    savedTeams.push(team);
    localStorage.setItem("savedTeams", JSON.stringify(savedTeams));
}


function loadSavedTeams() {
    let storedTeams = localStorage.getItem("savedTeams");
    if (storedTeams) {
        savedTeams = JSON.parse(storedTeams);
    } else {
        savedTeams = [];
    }

    let index = 0;
    while (index < savedTeams.length && index < 6) {
        displayTeam(index);
        index++;
    }
}


function displayTeam(index) {
    let teamCard = document.getElementById('team' + (index + 1));
    if (!teamCard) {
        return;
    }

    let pokiImgs = teamCard.querySelectorAll(".poke-imagine");
    let team = savedTeams[index];


    let i = 0;
    while (i < team.length) {
        if (pokiImgs[i] && team[i] && team[i].img) {
            pokiImgs[i].innerHTML = '<img src="' + team[i].img + '" class="sprite">';
        }
        i++;
    }

    setupTeamButtons(teamCard, index);
}

function setupTeamButtons(teamCard, index) {
    let deleteBtn = teamCard.querySelector(".delete-btn");
    if (deleteBtn) {
        deleteBtn.onclick = DeleteHandler(index);
    }

    let viewBtn = teamCard.querySelector(".view-team-btn");
    if (viewBtn) {
        viewBtn.onclick = ViewHandler(index);
    }
}

function DeleteHandler(index) {
    return function deleteTeamHandler() {
        deleteTeam(index);
    };
}

function ViewHandler(index) {
    return function viewTeamHandler() {
        viewTeam(index);
    };
}

function deleteTeam(index) {
    let storedTeams = localStorage.getItem("savedTeams");
    if (storedTeams) {
        savedTeams = JSON.parse(storedTeams);
    } else {
        savedTeams = [];
    }
    
    if (index >= 0 && index < savedTeams.length) {
        savedTeams.splice(index, 1);
        localStorage.setItem("savedTeams", JSON.stringify(savedTeams));
        location.reload();
    }
}


function viewTeam(index) {
    localStorage.setItem("currentTeamIndex", index.toString());
    window.location.href = "index.html";
}


function initializeTeamLoader() {
    loadSavedTeams();
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTeamLoader);
} else {
    initializeTeamLoader();
}