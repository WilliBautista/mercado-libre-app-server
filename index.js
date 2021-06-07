// Module dependencies.
const express = require('express');
const PORT = process.env.PORT || 4000;

// Route imports.
const appRoutes = require('./routes/app');
const itemRoutes = require('./routes/items');

// Initialization.
const app = express();

// Cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
});

// General
app.use("/", appRoutes);

// Routes
app.use("/api", itemRoutes);

app.listen(PORT, () => {
  console.log(`The server is runing on http://localhost:${PORT}`);
});
