const express = require('express');
const bodyParser = require('body-parser');
// const supabaseClient = require('@supabase/supabase-js');
// const dotenv = require('dotenv');

const app = express();
const port = 3000;
// dotenv.config();

// Serves our frontend files from the public folder
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// --- 3 Application Pages ---
app.get('/', (req, res) => res.sendFile('public/index.html', { root: __dirname }));
app.get('/about', (req, res) => res.sendFile('public/about.html', { root: __dirname }));
app.get('/app', (req, res) => res.sendFile('public/app.html', { root: __dirname }));

// TODO: Build out the GET and POST routes for the Supabase watchlist
// TODO: Build out the NIST API fetch route for the threat data

app.listen(port, () => {
  console.log(`ThreatDeck running on port: ${port}`);
});