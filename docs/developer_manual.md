# ThreatDeck Developer Manual

**Who is this for?** This guide is for anyone who wants to download my code, run it on their own computer, or keep building on it. 

---

## 1. How to Install and Set Up
To run this on your laptop, make sure you have Node.js installed.

1. **Clone this repo** to your computer.
2. **Install the packages:** Open your terminal in the project folder and run:
   `npm install`
3. **Set up your keys:** Make a file called `.env` right in the main folder and paste these in with your actual keys:
   `SUPABASE_URL=your_project_url`
   `SUPABASE_KEY=your_service_key`
   `NVD_API_KEY=your_nist_api_key`

## 2. Running the App
To start the local server, type this in the terminal:
`node index.js`
It should say `ThreatDeck running on port: 3000`. Then just open your browser and go to `http://localhost:3000`.

## 3. Testing it out
I didn't set up automated testing like Jest for this project. To make sure it works manually, just do this:
1. Open the homepage and click the button to make sure the dashboard loads.
2. Try adding a software name (like "Windows 11") to the watchlist and see if the success pop-up shows.
3. Refresh the page to make sure the software is actually saved in the left sidebar.
4. Click on the software name and make sure the NIST threat feed and the chart load up.

## 4. How the APIs Work
Here are the main backend routes I built:

#### `GET /api/watchlist`
* **What it does:** Grabs the list of software you are tracking from the Supabase database.
* **Returns:** A JSON list of items.

#### `POST /api/watchlist`
* **What it does:** Saves a new software name to the database.
* **Returns:** A JSON response of the new row.

#### `GET /api/threats`
* **What it does:** Fetches the actual vulnerability data from the NIST API. If you don't search for a specific software, it defaults to showing global threats from the last 30 days.
* **Returns:** A JSON object with all the CVEs and their scores.

## 5. Bugs & Future Plans

**Known Bugs:**
* **Messy Searches:** Sometimes the NIST API is weird and gives false positives. For example, if you search for an iOS bug, it might pull up a Windows vulnerability that just happened to mention iOS in the description text.

**Future Plans:**
* **Logins:** Right now everyone shares the same watchlist. In the future, I'd add Supabase Auth so people can have their own private lists.
* **Better Searching:** I'd swap the basic keyword search for CPE (Common Platform Enumeration) matching so it's way more accurate.
* **Automated Tests:** Set up automatic testing so I don't have to click everything manually.