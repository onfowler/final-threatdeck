const express = require('express');
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js');
const dotenv = require('dotenv');

const app = express();
const port = 3000;
dotenv.config();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => res.sendFile('public/index.html', { root: __dirname }));
app.get('/about', (req, res) => res.sendFile('public/about.html', { root: __dirname }));
app.get('/app', (req, res) => res.sendFile('public/app.html', { root: __dirname }));

app.get('/api/watchlist', async (req, res) => {
  console.log('fetching the watchlist...');
  const { data, error } = await supabase.from('watchlist').select('*');
  
  if (error) {
    console.log("DB Error:", error);
    res.status(500).send(error);
  } else {
    res.json(data);
  }
});

app.post('/api/watchlist', async (req, res) => {
  const softwareName = req.body.software_name;
  console.log(`Trying to add ${softwareName} to database`);

  if (!softwareName) {
    return res.status(400).json({ message: "Forgot to send a name!" });
  }

  const { data, error } = await supabase.from('watchlist').insert([{ software_name: softwareName }]).select();

  if (error) {
    console.log(error);
    res.status(500).send(error);
  } else {
    res.json(data);
  }
});

app.get('/api/threats', async (req, res) => {
  const apiKey = process.env.NVD_API_KEY;
  const keyword = req.query.software;
  
  let nvdUrl = `https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=15`;
  
  if (keyword && keyword !== "Recent Global Threats") {
    nvdUrl += `&keywordSearch=${encodeURIComponent(keyword)}&keywordExactMatch`;
  } else {
    // grab the last 30 days if no specific software is clicked
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    nvdUrl += `&pubStartDate=${startDate.toISOString()}&pubEndDate=${endDate.toISOString()}`;
  }

  try {
    const response = await fetch(nvdUrl, { headers: { 'apiKey': apiKey } });
    const threatData = await response.json();
    res.json(threatData);
  } catch (error) {
    console.log("NIST API failed to load", error);
    res.status(500).json({ error: "Failed to load NIST data" });
  }
});

app.listen(port, () => {
  console.log(`ThreatDeck running on port: ${port}`);
});