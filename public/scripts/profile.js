savedTeams = [];

function saveTeam() {
    team = [];

    for (i = 1; i <= 6; i++) {
        pokemonNameElement = document.getElementById('pokeSearch' + i);
        nicknameElement = document.querySelector('#pk' + i + ' .nickname');
        pokiImg = document.getElementById('pk_img' + i);
        imgElement = pokiImg.getElementsByTagName('img')[0];
        
        pokemonName = '';
        if (pokemonNameElement) {
            pokemonName = pokemonNameElement.value.trim();
        }
        
        nickname = '';
        if (nicknameElement) {
            nickname = nicknameElement.value.trim();
        }
        
        imgSrc = '';
        if (imgElement) {
            imgSrc = imgElement.src;
        }

        moveDropdowns = document.querySelectorAll('#pk' + i + ' .move_dropdown' + i);
        moves = [];
        for (j = 0; j < moveDropdowns.length; j++) {
            if (moveDropdowns[j]) {
                moves.push(moveDropdowns[j].value);
            }
        }

        if (pokemonName) {
            team.push({
                name: pokemonName,
                nickname: nickname,
                img: imgSrc,
                moves: moves
            });
        }
    }

    storedTeams = localStorage.getItem("savedTeams");
    if (storedTeams) {
        savedTeams = JSON.parse(storedTeams);
    } else {
        savedTeams = [];
    }
    savedTeams.push(team);
    localStorage.setItem("savedTeams", JSON.stringify(savedTeams));

    alert("Team Saved!");
    window.location.href = "profile.html";
}

function loadSavedTeams() {
    storedTeams = localStorage.getItem("savedTeams");
    if (storedTeams) {
        savedTeams = JSON.parse(storedTeams);
    } else {
        savedTeams = [];
    }

    for (index = 0; index < savedTeams.length && index < 6; index++) {
        teamCard = document.getElementById('team' + (index + 1));
        if (!teamCard) {
            continue;
        }

        pokiImgs = teamCard.querySelectorAll(".poke-imagine");
        team = savedTeams[index];

        for (i = 0; i < team.length; i++) {
            if (pokiImgs[i] && team[i]) {
                pokiImgs[i].innerHTML = '<img src="' + team[i].img + '" class="sprite">';
            }
        }

        deleteBtn = teamCard.querySelector(".delete-btn");
        if (deleteBtn) {
            deleteBtn.onclick = createDeleteHandler(index);
        }

        viewBtn = teamCard.querySelector(".view-team-btn");
        if (viewBtn) {
            viewBtn.onclick = createViewHandler(index);
        }
    }
}

function createDeleteHandler(index) {
    return function handleDelete() {
        deleteTeam(index);
    };
}

function createViewHandler(index) {
    return function handleView() {
        localStorage.setItem("currentTeamIndex", index);
        window.location.href = "index.html";
    };
}

function deleteTeam(index) {
    storedTeams = localStorage.getItem("savedTeams");
    if (storedTeams) {
        savedTeams = JSON.parse(storedTeams);
    } else {
        savedTeams = [];
    }
    
    savedTeams.splice(index, 1);
    localStorage.setItem("savedTeams", JSON.stringify(savedTeams));
    location.reload();
}

function initializeTeamLoader() {
    loadSavedTeams();
}

document.addEventListener("DOMContentLoaded", initializeTeamLoader);