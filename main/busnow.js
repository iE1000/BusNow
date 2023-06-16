mapboxgl.accessToken = 'pk.eyJ1IjoiaWUxMDAwIiwiYSI6ImNsaXM4N2JldTFhbXAzZXBndHU4eTYxY2IifQ.1NGPST-1FECLZR8hOxS_yA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/ie1000/clis8cjc1002u01p78nsj4t43',
  center: [-82.3980874155059, 8.429475976461935], // Coordenadas del centro del mapa
  zoom: 17 // Nivel de zoom predeterminado
});

// Agregar controles al mapa
map.addControl(new mapboxgl.NavigationControl());

// Obtener una ruta optimizada entre múltiples ubicaciones
var coordinates = [
  [-82.42278762219792, 8.430611563578015], // Punto de inicio
  [-82.39795060294597, 8.42895718362969], // Parada 1
  [-82.38391843980015, 8.406776929721016],
  [-82.38176318885175, 8.405364475685515],
  [-82.38165973268401, 8.407387893036764],
  [-82.38150735617234, 8.407653052115238],
  // Agregar las coordenadas de las paradas adicionales aquí...
];

var busStops = [
  [-82.39795060294597, 8.42895718362969], // Parada 1
  // Agregar las coordenadas de las paradas adicionales aquí...
];

var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + coordinates.join(';') + '?geometries=geojson&access_token=' + mapboxgl.accessToken;

// Realizar la solicitud a la API de direcciones de Mapbox
fetch(directionsRequest)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    var route = data.routes[0].geometry;

    // Agregar la ruta al mapa
    map.on('load', function() {
      // Agregar un marcador para la parada inicial
      var startMarker = new mapboxgl.Marker({ color: 'blue' })
        .setLngLat(busStops[0]) // Punto de inicio
        .addTo(map);

      // Agregar marcadores para las paradas de autobús
      busStops.forEach(function(stop) {
        var marker = new mapboxgl.Marker()
          .setLngLat(stop)
          .addTo(map);
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: route
          }
        },
        paint: {
          'line-color': '#000', // Visualiza la ruta trazada
          'line-width': 3
        }
      });

      // Crear un marcador para el ícono del bus
      var busMarker = new mapboxgl.Marker({
        color: 'red',
        element: createBusIcon() // Función para crear el ícono del bus
      }).setLngLat(busStops[0]) // Punto de inicio
        .addTo(map);

      // Simular el desplazamiento del ícono del bus
      var index = 0;
      var interval = setInterval(function() {
        index++;
        if (index >= busStops.length) {
          clearInterval(interval);
          return;
        }

        busMarker.setLngLat(busStops[index]);
      }, 2000); // Intervalo de tiempo entre paradas (2 segundos en este ejemplo)
    });
  });

// Función para crear el ícono del bus
function createBusIcon() {
  var icon = document.createElement('div');
  icon.className = 'bus-icon';
  return icon;
}

// Función para mostrar el formulario de ubicación del bus
function mostrarFormularioUbicacion() {
  // Aquí puedes implementar el código para mostrar el formulario de ubicación del bus
  // Puede ser un cuadro emergente o una sección en la página
  // Puedes utilizar JavaScript o una librería como Bootstrap para mostrar el formulario
}

// Función para calcular la distancia y el tiempo estimado de llegada
function calcularDistanciaTiempo(latBus, lonBus, latParada, lonParada) {
  // Realizar la solicitud a la API de Mapbox para obtener la información de distancia y tiempo
  // Utiliza las coordenadas del bus (latBus, lonBus) y las coordenadas de la parada (latParada, lonParada)
  // Puedes utilizar la librería 'axios' para realizar la solicitud HTTP
  // Aquí tienes un ejemplo utilizando fetch:
  var apiUrl = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + lonBus + ',' + latBus + ';' + lonParada + ',' + latParada;
  apiUrl += '?access_token=' + mapboxgl.accessToken + '&alternatives=false&steps=true&geometries=geojson&overview=full';

  fetch(apiUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var route = data.routes[0];
      var distance = route.distance; // Distancia en metros
      var duration = route.duration; // Duración en segundos

      // Convertir la distancia y la duración a minutos
      var distanceMinutes = Math.round(distance / 60);
      var durationMinutes = Math.round(duration / 60);

      // Mostrar los resultados en la página
      document.getElementById('distancia').textContent = distanceMinutes + ' minutos';
      document.getElementById('tiempo').textContent = durationMinutes + ' minutos';
    })
    .catch(function(error) {
      console.log(error);
    });
}
