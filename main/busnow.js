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
  [-82.42278762219792, 8.430611563578015], // Punto de inicio - Trazar todos los puntos para la ruta - Marcar cada parada con un comentario para luego declarar cada una con un nombre
  [-82.39795060294597, 8.42895718362969], 
  [-82.38391843980015, 8.406776929721016],
  [-82.38176318885175, 8.405364475685515],
  [-82.38165973268401, 8.407387893036764],
  [-82.38150735617234, 8.407653052115238],
  [],
  []
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
          'line-color': '#000', //Visualiza la ruta trazada
          'line-width': 3
        }
      });
    });
  });
