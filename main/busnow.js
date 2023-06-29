// Coordenadas de las paradas de buses
var busStops = [
  [-82.42267611688577, 8.430658401132375], // Piquera de Las Lomas
  [-82.4200617379403, 8.433666214773126], // Parada Hospital Cattan
  [-82.41327687796455, 8.435678511511835], // Parada El Sapo
  [-82.4051220253299, 8.430654238476235], // Parada Policía
  [-82.39791399738645, 8.428969380717133], // Parada Chino San Jose
];

// Variable para almacenar el índice de la parada actual del bus
var currentStopIndex = 0;

// Intervalo de tiempo en milisegundos para actualizar la ubicación del bus
var updateInterval = 1000; // 1 segundo

// Velocidad del bus en km/h
var velocidadBus = 20;

// Variable para almacenar el tiempo restante
var tiempoRestante;

// Función para calcular el tiempo restante hasta la próxima parada
async function calcularTiempoRestante() {
  var distancia = await obtenerDistanciaEntreParadas();
  if (distancia !== null) {
    var velocidadMetrosSegundo = velocidadBus * 1000 / 3600; // Convertir la velocidad a metros por segundo
    var tiempo = distancia / velocidadMetrosSegundo;
    return tiempo;
  } else {
    console.error('Error al obtener la distancia entre paradas.');
    return null;
  }
}

// Función para obtener la distancia en kilómetros entre la parada actual y la siguiente utilizando la API de direcciones de Mapbox
async function obtenerDistanciaEntreParadas() {
  var currentStop = busStops[currentStopIndex];
  var nextStopIndex = (currentStopIndex + 1) % busStops.length;
  var nextStop = busStops[nextStopIndex];

  var url = `https://api.mapbox.com/directions/v5/mapbox/driving/${currentStop[0]},${currentStop[1]};${nextStop[0]},${nextStop[1]}`;
  var params = {
    access_token: 'pk.eyJ1IjoiaWUxMDAwIiwiYSI6ImNsaXM4N2JldTFhbXAzZXBndHU4eTYxY2IifQ.1NGPST-1FECLZR8hOxS_yA',
  };

  try {
    var response = await fetch(url + '?' + new URLSearchParams(params));
    var data = await response.json();
    var distancia = data.routes[0].distance / 1000; // La distancia se obtiene en metros, se divide por 1000 para obtener kilómetros
    var route = data.routes[0].geometry.coordinates; // Coordenadas de la ruta
    trazarRutaEnMapa(route); // Trazar la ruta en el mapa
    return distancia;
  } catch (error) {
    console.error('Error al obtener la distancia:', error);
    return null;
  }
}

// Función para trazar la ruta en el mapa
function trazarRutaEnMapa(route) {
  map.getSource('route').setData({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: route,
    },
  });
}

// Función para cambiar la paleta de colores
function cambiarPaletaDeColores() {
  var slider = document.getElementById('color-slider');
  var color = slider.value;
  document.documentElement.style.setProperty('--main-color', 'hsl(' + color + ', 100%, 50%)');
}

// Función para inicializar el mapa y la ruta
function initMap() {
  mapboxgl.accessToken = 'pk.eyJ1IjoiaWUxMDAwIiwiYSI6ImNsaXM4N2JldTFhbXAzZXBndHU4eTYxY2IifQ.1NGPST-1FECLZR8hOxS_yA';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: busStops[0],
    zoom: 15,
  });

  map.on('load', function () {
    // Agregar la capa de la ruta
    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [],
        },
      },
    });

    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#888',
        'line-width': 8,
      },
    });

    // Agrega un marcador en cada parada de buses
    busStops.forEach(function (stop) {
      var el = document.createElement('div');
      el.className = 'bus-stop-marker';
      new mapboxgl.Marker(el).setLngLat(stop).addTo(map);
    });

    // Crea el ícono del bus
    var busIcon = document.createElement('div');
    busIcon.className = 'bus-icon';

    // Agrega el marcador del bus en la primera parada
    var busMarker = new mapboxgl.Marker(busIcon).setLngLat(busStops[0]).addTo(map);

    // Actualiza la ubicación del bus y el tiempo restante en intervalos regulares
    setInterval(async function () {
      var tiempoRestante = await calcularTiempoRestante();
      if (tiempoRestante !== null) {
        document.getElementById('tiempo-restante').textContent = 'Tiempo restante: ' + tiempoRestante.toFixed(1) + ' segundos';
        busMarker.setLngLat(busStops[currentStopIndex]);
        currentStopIndex = (currentStopIndex + 1) % busStops.length;
      }
    }, updateInterval);
  });
}

// Inicializa el mapa cuando se carga la página
document.addEventListener('DOMContentLoaded', initMap);
