import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDoc, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { auth } from "./auth.js";
import firebaseConfig from "../firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function saveTeam() {
    const user = auth.currentUser;

    if (!user) {
        alert("You must be logged in to save your team.");
        return;
    }

    const team = [];

    for (let i = 1; i <= 6; i++) {
        const pokemonNameElement = document.getElementById('pokeSearch' + i);
        const nicknameElement = document.querySelector('#pk' + i + ' .nickname');
        const pokiImg = document.getElementById('pk_img' + i);
        const imgElement = pokiImg.getElementsByTagName('img')[0];

        const pokemonName = pokemonNameElement ? pokemonNameElement.value.trim() : '';
        const nickname = nicknameElement ? nicknameElement.value.trim() : '';
        const imgSrc = imgElement ? imgElement.src : '';

        const moveDropdowns = document.querySelectorAll('#pk' + i + ' .move_dropdown' + i);
        const moves = [];
        for (let i = 0; i < moveDropdowns.length; i++) {
            const dropdown = moveDropdowns[i];
            moves.push(dropdown.value);
        }

        if (pokemonName)
            team.push({ name: pokemonName, nickname, img: imgSrc, moves });
    }

    if (team.length === 0) {
        alert("Please add at least one Pokémon to your team before saving.");
        return;
    }

    console.log("Saving team:", team);

    try {
        const userTeamsCollection = collection(db, "users", user.uid, "teams");
        const querySnapshot = await getDocs(userTeamsCollection);

        if(querySnapshot.size >= 6) {
            alert("You can only save up to 6 teams.");
            return;
        }

        await addDoc(userTeamsCollection, { team });
        alert("Team saved successfully!");
    } catch (error) {
        console.error("Error saving team:", error.code, error.message);
    }
}

async function loadSavedTeams() {
    const user = auth.currentUser;

    if (!user) {
        alert("You must be logged in to load your teams.");
        return;
    }

    try {
        const userTeamsCollection = collection(db, "users", user.uid, "teams");
        const querySnapshot = await getDocs(userTeamsCollection);

        const savedTeams = [];

        querySnapshot.forEach((doc) => {
            const teamData = doc.data().team;
            if (teamData)
                savedTeams.push(teamData);
        });

        console.log("Loaded teams:", savedTeams);
        return savedTeams;
    } catch (error) {
        console.error("Error loading teams:", error);
    }
}

window.saveTeam = saveTeam;
window.loadSavedTeams = loadSavedTeams;

let savedTeams = [];

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


// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', initializeTeamLoader);
// } else {
//     initializeTeamLoader();
// }