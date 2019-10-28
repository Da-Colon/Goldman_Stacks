const loginInsteadButton = document.querySelector('#login-instead-button');
const signupInsteadButton = document.querySelector('#signup-instead-button');
const signupRow = document.querySelector('#signup-row');
const loginRow = document.querySelector('#login-row');

// Toggles the menu so the user can see the login form or the sign up form.
loginInsteadButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('login-instead-button-pressed');

    signupRow.classList.add('hide-row');
    loginRow.classList.remove('hide-row');
});

signupInsteadButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('signup-instead-button-pressed');

    signupRow.classList.remove('hide-row');
    loginRow.classList.add('hide-row');
});

// Check to see if user Password was typed correctly twice
var password = document.getElementById("password"),
    confirm_password = document.getElementById("confirm_password");

function validatePassword() {
    if (password.value != confirm_password.value) {
        confirm_password.setCustomValidity("Passwords Don't Match");
    } else {
        confirm_password.setCustomValidity('');
    }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;