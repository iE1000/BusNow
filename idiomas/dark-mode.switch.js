const darkModeSwitch = document.getElementById('dark-mode-switch');
const body = document.body;

darkModeSwitch.addEventListener('change', () => {
  body.classList.toggle('dark-mode');
});
