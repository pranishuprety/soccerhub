// API Details
const apiKey = '53f070d91bmsh2e7ba4bf74ec3e1p1f831ajsne4a2221f0939';
const apiHost = 'api-football-v1.p.rapidapi.com';

// Endpoints
const standingsURLs = {
    epl: 'https://api-football-v1.p.rapidapi.com/v3/standings?league=39&season=2024', // Premier League
    laliga: 'https://api-football-v1.p.rapidapi.com/v3/standings?league=140&season=2024', // La Liga
    ucl: 'https://api-football-v1.p.rapidapi.com/v3/standings?league=2&season=2024' // UEFA Champions League
};

const weeklyMatchesURL = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?dateFrom=2024-12-03&dateTo=2024-12-10'; // Matches for this week

const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost
    }
};

// DOM Elements
const eplContainer = document.querySelector("#epl-standings");
const laligaContainer = document.querySelector("#laliga-standings");
const uclContainer = document.querySelector("#ucl-standings");
const matchesContainer = document.querySelector("#weekly-matches");

// Function to Fetch Standings
async function fetchStandings(url, container) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        displayStandings(data.response[0].league.standings[0], container);
    } catch (error) {
        console.error('Error fetching standings:', error);
        container.innerHTML = '<p>Error loading standings. Please try again later.</p>';
    }
}

// Function to Display Standings
function displayStandings(standings, container) {
    container.innerHTML = ''; // Clear existing content

    standings.forEach(team => {
        const teamCard = document.createElement("div");
        teamCard.classList.add("team-card");

        teamCard.innerHTML = `
            <div>
                <img src="${team.team.logo}" alt="${team.team.name}" class="team-logo">
                <span>${team.team.name}</span>
            </div>
            <p>Points: ${team.points}</p>
            <p>Position: ${team.rank}</p>
        `;

        container.appendChild(teamCard);
    });
}

// Function to Fetch Matches
async function fetchWeeklyMatches() {
    try {
        const response = await fetch(weeklyMatchesURL, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        displayMatches(data.response.slice(0, 10)); // Display top 10 matches
    } catch (error) {
        console.error('Error fetching matches:', error);
        matchesContainer.innerHTML = '<p>Error loading matches. Please try again later.</p>';
    }
}

// Function to Display Matches
function displayMatches(matches) {
    matchesContainer.innerHTML = ''; // Clear existing content

    matches.forEach(match => {
        const matchCard = document.createElement("div");
        matchCard.classList.add("match-card");

        matchCard.innerHTML = `
            <h3>${match.teams.home.name} vs ${match.teams.away.name}</h3>
            <p>Date: ${new Date(match.fixture.date).toLocaleString()}</p>
            <p>Score: ${match.goals.home ?? 'N/A'} - ${match.goals.away ?? 'N/A'}</p>
        `;

        matchesContainer.appendChild(matchCard);
    });
}

// Load Data on Page Load
document.addEventListener("DOMContentLoaded", () => {
    fetchStandings(standingsURLs.epl, eplContainer); // Fetch EPL standings
    fetchStandings(standingsURLs.laliga, laligaContainer); // Fetch La Liga standings
    fetchStandings(standingsURLs.ucl, uclContainer); // Fetch UCL standings
    fetchWeeklyMatches(); // Fetch matches for the week
});


// Dark/Light Mode Toggle
const themeToggleButton = document.getElementById('themeToggle');

themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    // Save theme preference in local storage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

// Load Theme Preference on Page Load
document.addEventListener('DOMContentLoaded', () => {
    fetchMatchData();

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
});
