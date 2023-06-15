// Código JavaScript para el selector de idioma
const languageSelect = document.getElementById('language-selector');

languageSelect.addEventListener('change', function() {
  const selectedLanguage = languageSelect.value;
  changeLanguage(selectedLanguage);
});

function changeLanguage(language) {
  const languageElements = document.querySelectorAll('[data-lang]');

  languageElements.forEach(element => {
    const key = element.dataset.lang;
    const translations = getTranslations(language);

    if (translations.hasOwnProperty(key)) {
      element.textContent = translations[key];
    }
  });
}

function getTranslations(language) {
  const translations = {
    'welcome': {
      'es': '¡Bienvenido a BusNow!',
      'en': 'Welcome to BusNow!'
    },
    'tariffs': {
      'es': 'Tarifas',
      'en': 'Tariffs'
    },
    'map': {
      'es': 'Mapa',
      'en': 'Map'
    },
    'schedules': {
      'es': 'Horarios',
      'en': 'Schedules'
    },
    'about': {
      'es': '¿BusNow?',
      'en': 'About Us'
    },
    'spanish': {
      'es': 'Español',
      'en': 'Spanish'
    },
    'english': {
      'es': 'Inglés',
      'en': 'English'
    },
    'darkMode': {
      'es': 'Modo Oscuro',
      'en': 'Dark Mode'
    }
  };

  return translations[language];
}

// Código JavaScript para el interruptor de Modo oscuro
const darkModeToggle = document.getElementById('dark-mode-toggle');

darkModeToggle.addEventListener('change', function() {
  const isDarkMode = darkModeToggle.checked;
  toggleDarkMode(isDarkMode);
});

function toggleDarkMode(isDarkMode) {
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

// Mapbox configuration and setup
mapboxgl.accessToken = 'pk.eyJ1IjoiaWUxMDAwIiwiYSI6ImNsaXM4N2JldTFhbXAzZXBndHU4eTYxY2IifQ.1NGPST-1FECLZR8hOxS_yA'; // Reemplaza 'TU_ACCESS_TOKEN' con tu propio token de Mapbox

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/ie1000/clis99vio01nl01qhhv9f1erx',
  center: [-82.39805327314973, 8.429611557583204], // Coordenadas de ejemplo, debes ajustarlas según tus necesidades
  zoom: 17 // Nivel de zoom inicial
});

map.addControl(new mapboxgl.NavigationControl());
