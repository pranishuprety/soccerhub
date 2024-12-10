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
    // for standings
    fetchStandings(standingsURLs.epl, eplContainer);
    fetchStandings(standingsURLs.laliga, laligaContainer);
    fetchStandings(standingsURLs.ucl, uclContainer);
    fetchWeeklyMatches();

    // for live matches and weekly report
    fetchPastWeekScores(pastWeekURLs.epl, pastWeekEPLContainer); // Fetch EPL past week scores
    fetchPastWeekScores(pastWeekURLs.laliga, pastWeekLaLigaContainer); // Fetch La Liga past week scores
    fetchLiveScores(); // Fetch live scores
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


// Past Week Scores: EPL and La Liga
const pastWeekURLs = {
    epl: 'https://api-football-v1.p.rapidapi.com/v3/fixtures?league=39&season=2024&from=2024-12-02&to=2024-12-08',
    laliga: 'https://api-football-v1.p.rapidapi.com/v3/fixtures?league=140&season=2024&from=2024-12-02&to=2024-12-08'
};

// DOM Elements for Past Week Scores
const pastWeekEPLContainer = document.querySelector("#past-week-epl");
const pastWeekLaLigaContainer = document.querySelector("#past-week-laliga");

// Function to Fetch Past Week Scores
async function fetchPastWeekScores(url, container) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        displayPastWeekScores(data.response, container);
    } catch (error) {
        console.error('Error fetching past week scores:', error);
        container.innerHTML = '<p>Error loading past week scores. Please try again later.</p>';
    }
}

// Function to Display Past Week Scores
function displayPastWeekScores(matches, container) {
    container.innerHTML = ''; // Clear existing content

    if (matches.length === 0) {
        container.innerHTML = '<p>No matches found for the past week.</p>';
        return;
    }

    matches.forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.classList.add('match-card');

        matchCard.innerHTML = `
            <h3>${match.teams.home.name} vs ${match.teams.away.name}</h3>
            <p>Score: ${match.goals.home ?? '-'} - ${match.goals.away ?? '-'}</p>
            <p>Date: ${new Date(match.fixture.date).toLocaleString()}</p>
        `;

        container.appendChild(matchCard);
    });
}




// Live Scores API Endpoint
const liveScoresURL = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all';

// DOM Element for Live Scores
const liveScoreContainer = document.querySelector("#live-score");

// Function to Fetch Live Scores
async function fetchLiveScores() {
    try {
        const response = await fetch(liveScoresURL, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        displayLiveScores(data.response);
    } catch (error) {
        console.error('Error fetching live scores:', error);
        liveScoreContainer.innerHTML = '<p>Error loading live scores. Please try again later.</p>';
    }
}

// Function to Display Live Scores
function displayLiveScores(matches) {
    liveScoreContainer.innerHTML = ''; // Clear existing content

    if (matches.length === 0) {
        liveScoreContainer.innerHTML = '<p>No live matches at the moment.</p>';
        return;
    }

    matches.forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.classList.add('match-card');

        matchCard.innerHTML = `
            <h3>${match.teams.home.name} vs ${match.teams.away.name}</h3>
            <p>Score: ${match.goals.home ?? '-'} - ${match.goals.away ?? '-'}</p>
            <p>Time: ${match.fixture.status.elapsed ?? 'Ongoing'}'</p>
        `;

        liveScoreContainer.appendChild(matchCard);
    });
}
