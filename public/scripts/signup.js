import {
    signUpWithEmail,
    loginWithEmail,
    logout
} from "./auth.js";

const signupBtn = document.querySelector('#signupBtn');
const loginBtn = document.querySelector('#loginBtn');
const showSignup = document.querySelector('#showSignup');
const showLogin = document.querySelector('#showLogin');
const signupForm = document.querySelector('#signupForm');
const loginForm = document.querySelector('#loginForm');

const signupEmailInput = document.querySelector('#signupEmail');
const signupPasswordInput = document.querySelector('#password');
const loginEmailInput = document.querySelector('#loginEmail');
const loginPasswordInput = document.querySelector('#loginPassword');

async function SignupClick(e) {
    e.preventDefault();
    const email = signupEmailInput.value;
    const password = signupPasswordInput.value;
    try {
        await signUpWithEmail(email, password);
        alert("Sign up successful!");
        window.location.href = "index.html";
    } catch (error) {
        alert("Error: " + error.message);
    }
}

async function LoginClick(e) {
    e.preventDefault();
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;
    try {
        await loginWithEmail(email, password);
        alert("Login successful!");
        window.location.href = "index.html";
    } catch (error) {
        alert("Login failed: " + error.message);
    }
}

function DisplaySignupForm() {
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
}

function DisplayLoginForm() {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
}

signupBtn.addEventListener('click', SignupClick);
loginBtn.addEventListener('click', LoginClick);
showSignup.addEventListener('click', DisplaySignupForm);
showLogin.addEventListener('click', DisplayLoginForm);