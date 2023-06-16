const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());

// Ruta para recibir y almacenar la ubicación del dispositivo
app.post("/api/location", (req, res) => {
  const { latitude, longitude } = req.body;

  // Aquí puedes realizar las operaciones necesarias para procesar y almacenar la ubicación en tiempo real
  // Por ejemplo, puedes guardarla en una base de datos, enviarla a otros dispositivos conectados, etc.

  // En este ejemplo, simplemente devolvemos un mensaje de confirmación con la ubicación recibida
  res.json({ message: "Ubicación recibida", latitude, longitude });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
