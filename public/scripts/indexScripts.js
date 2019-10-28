const loginInsteadButton = document.querySelector('#login-instead-button');
const signupInsteadButton = document.querySelector('#signup-instead-button');
const signupRow = document.querySelector('#signup-row');
const loginRow = document.querySelector('#login-row');

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