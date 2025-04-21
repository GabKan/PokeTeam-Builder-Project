import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, deleteDoc, doc, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { auth } from "./auth.js";
import firebaseConfig from "../firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let teams = [];

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

        if (pokemonName) {
            const pokemon = pokemon_data.find(p => p.name.toLowerCase() === pokemonName.toLowerCase());
            const pokeID = pokemon ? pokemon.id : null;

            if (pokeID !== null) {
                team.push({ id: pokeID, name: pokemonName, nickname, img: imgSrc, moves });
            } else {
                console.warn(`Pokemon with name "${pokemonName}" not found in pokemon_data.`);
            }
        }
    }

    if (team.length === 0) {
        alert("Please add at least one Pokémon to your team before saving.");
        return;
    }

    try {
        const userTeamsCollection = collection(db, "users", user.uid, "teams");
        const querySnapshot = await getDocs(userTeamsCollection);

        if(querySnapshot.size >= 6) {
            alert("You can only save up to 6 teams.");
            return;
        }

        await addDoc(userTeamsCollection, { team });
        alert("Team saved successfully!");
        window.location.href = "profile.html";
    } catch (error) {
        console.error("Error saving team:", error.code, error.message);
    }
}

function waitForUserAuth() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(user);
            } else {
                reject("User not logged in");
            }
        });
    });
}

async function loadSavedTeams() {
    try {
        const user = await waitForUserAuth();
        const userTeamsCollection = collection(db, "users", user.uid, "teams");
        const querySnapshot = await getDocs(userTeamsCollection);

        const savedTeams = [];
        querySnapshot.forEach((doc) => {
            const teamData = doc.data().team;
            if (teamData) {
                savedTeams.push({ id: doc.id, team: teamData });
            }
        });

        return savedTeams;
    } catch (error) {
        alert("Error: " + error);
        console.error("Error loading teams:", error);
    }
}

async function displayTeam(index) {
    const team = teams[index].team;
    const teamCard = document.getElementById(`team${index + 1}`);

    if (!teamCard) {
        console.error(`Team card with ID team${index} not found.`);
        return;
    }

    const pokiImgs = teamCard.querySelectorAll(".poke-imagine");

    for (let i = 0; i < team.length; i++)
        if (pokiImgs[i] && team[i] && team[i].img)
            pokiImgs[i].innerHTML = '<img src="' + team[i].img + '" class="sprite">';

    setupTeamButtons(teamCard, index);
}

async function deleteTeam(index) {
    try {
        const user = await waitForUserAuth();
        const userTeamsCollection = collection(db, "users", user.uid, "teams");

        if (index >= 0 && index < teams.length) {
            const teamDocId = teams[index].id;
            const teamDocRef = doc(userTeamsCollection, teamDocId);
            await deleteDoc(teamDocRef);

            teams.splice(index, 1);

            window.location.href = './public/profile.html';
            window.location.reload();
        }
    } catch(error) {
        console.error("Error deleting team:", error);
        alert("Failed to delete the team. Please try again.");
    }
}

async function viewTeam(index) {
    if (index < 0 || index >= teams.length) {
        console.error(`Invalid team index: ${index}`);
        return;
    }

    const teamID = teams[index].id;
    sessionStorage.setItem('teamId', teamID);
    window.location.href = `index.html`;
}

function setupTeamButtons(teamCard, index) {
    let deleteBtn = teamCard.querySelector(".delete-btn");
    if (deleteBtn)
        deleteBtn.onclick = function() {
            deleteTeam(index);
        };

    let viewBtn = teamCard.querySelector(".view-team-btn");
    if (viewBtn)
        viewBtn.onclick = function() {
            viewTeam(index);
        };
}

async function initializeTeamLoader() {
    try {
        teams = await loadSavedTeams();
        if (teams && teams.length > 0)
            for (let i = 0; i < teams.length; i++)
                displayTeam(i);
        else
            console.log("No saved teams found.");
    } catch (error) {
        console.error("Failed to initialize team loader:", error);
    }
}

window.saveTeam = saveTeam;
window.loadSavedTeams = loadSavedTeams;

window.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector(".saved-teams"))
        initializeTeamLoader();
});