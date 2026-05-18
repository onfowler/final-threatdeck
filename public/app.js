let myChart = null; 

window.onload = async () => {
    await loadWatchlist();
    await loadThreats("Recent Global Threats");
};

async function loadWatchlist() {
    const res = await fetch('/api/watchlist');
    const data = await res.json();
    
    const ul = document.getElementById('watchlist-ul');
    ul.innerHTML = `<li onclick="loadThreats('Recent Global Threats')">🌍 Global Feed</li>`; 
    
    data.forEach(item => {
        ul.innerHTML += `<li onclick="loadThreats('${item.software_name}')">💻 ${item.software_name}</li>`;
    });
}

async function addSoftware() {
    const input = document.getElementById('softwareInput');
    const name = input.value;
    
    await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ software_name: name })
    });

    input.value = ""; 
    await loadWatchlist();

    // SweetAlert2 library
    Swal.fire({
        title: 'Success!',
        text: `Added ${name} to your watchlist.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
    });
}

async function loadThreats(softwareName) {
    document.getElementById('current-target').innerText = `Target: ${softwareName}`;
    document.getElementById('threat-feed').innerHTML = "<p>Scanning NIST database...</p>";
    
    const res = await fetch(`/api/threats?software=${encodeURIComponent(softwareName)}`);
    const data = await res.json();
    
    let feedHtml = "";
    let stats = { critical: 0, high: 0, medium: 0, low: 0 }; 

    if (!data.vulnerabilities || data.vulnerabilities.length === 0) {
        document.getElementById('threat-feed').innerHTML = "<p>No recent threats found.</p>";
        updateChart(stats);
        return;
    }

    data.vulnerabilities.forEach(item => {
        const cve = item.cve;
        let score = 0;
        
        if (cve.metrics?.cvssMetricV31) score = cve.metrics.cvssMetricV31[0].cvssData.baseScore;
        else if (cve.metrics?.cvssMetricV2) score = cve.metrics.cvssMetricV2[0].cvssData.baseScore;

        let severityClass = "low";
        if (score >= 9.0) { severityClass = "critical"; stats.critical++; }
        else if (score >= 7.0) { severityClass = "high"; stats.high++; }
        else if (score >= 4.0) { severityClass = "medium"; stats.medium++; }
        else { stats.low++; }

        const date = new Date(cve.published).toLocaleDateString();
        const desc = cve.descriptions[0]?.value || "No description provided.";

        feedHtml += `
            <div class="card ${severityClass}">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <h3 style="margin: 0;">${cve.id}</h3>
                    <span class="badge">Score: ${score} | ${date}</span>
                </div>
                <p style="margin: 0; font-size: 14px;">${desc}</p>
            </div>
        `;
    });

    document.getElementById('threat-feed').innerHTML = feedHtml;
    updateChart(stats); 
}

// Chart.js library 
function updateChart(stats) {
    const ctx = document.getElementById('severityChart').getContext('2d');
    if (myChart) myChart.destroy(); 

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Critical', 'High', 'Medium', 'Low'],
            datasets: [{
                label: 'Number of Threats',
                data: [stats.critical, stats.high, stats.medium, stats.low],
                backgroundColor: ['red', 'orange', 'blue', 'green']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}