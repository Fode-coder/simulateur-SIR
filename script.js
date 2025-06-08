// Initialisation du graphique
const ctx = document.getElementById('sirChart').getContext('2d');
const sirChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array.from({ length: 100 }, (_, i) => `Jour ${i + 1}`),
        datasets: [
            { label: 'Susceptibles (S)', data: [], borderColor: '#3498db', tension: 0.1 },
            { label: 'Infectés (I)', data: [], borderColor: '#e74c3c', tension: 0.1 },
            { label: 'Rétablis (R)', data: [], borderColor: '#2ecc71', tension: 0.1 }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Modèle SIR - Propagation virale',
                font: { size: 16 }
            },
            legend: {
                position: 'top',
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Nombre d\'individus' }
            },
            x: {
                title: { display: true, text: 'Jours' }
            }
        }
    }
});

// Éléments UI
const populationSlider = document.getElementById('population');
const initialInfectedSlider = document.getElementById('initial-infected');
const betaSlider = document.getElementById('beta');
const gammaSlider = document.getElementById('gamma');

const populationValue = document.getElementById('population-value');
const initialInfectedValue = document.getElementById('initial-infected-value');
const betaValue = document.getElementById('beta-value');
const gammaValue = document.getElementById('gamma-value');

const simulateBtn = document.getElementById('simulate-btn');

// Mise à jour des valeurs affichées
populationSlider.addEventListener('input', () => {
    populationValue.textContent = populationSlider.value;
    // Empêche I₀ > N
    initialInfectedSlider.max = populationSlider.value;
});

initialInfectedSlider.addEventListener('input', () => {
    initialInfectedValue.textContent = initialInfectedSlider.value;
});

betaSlider.addEventListener('input', () => {
    betaValue.textContent = betaSlider.value;
});

gammaSlider.addEventListener('input', () => {
    gammaValue.textContent = gammaSlider.value;
});

// Simulation SIR
function simulateSIR() {
    const beta = parseFloat(betaSlider.value);
    const gamma = parseFloat(gammaSlider.value);
    const N = parseInt(populationSlider.value);
    const I0 = parseInt(initialInfectedSlider.value);

    let S = N - I0;
    let I = I0;
    let R = 0;

    // Réinitialisation des données
    sirChart.data.datasets.forEach(dataset => dataset.data = []);

    // Calcul des courbes
    for (let t = 0; t < 100; t++) {
        sirChart.data.datasets[0].data.push(S);
        sirChart.data.datasets[1].data.push(I);
        sirChart.data.datasets[2].data.push(R);

        const newInfections = (beta * S * I) / N;
        const newRecoveries = gamma * I;

        S -= newInfections;
        I += newInfections - newRecoveries;
        R += newRecoveries;
    }

    sirChart.update();
}

// Événements
simulateBtn.addEventListener('click', simulateSIR);

// Simulation initiale au chargement
window.addEventListener('load', () => {
    // Initialisation des valeurs affichées
    populationValue.textContent = populationSlider.value;
    initialInfectedValue.textContent = initialInfectedSlider.value;
    betaValue.textContent = betaSlider.value;
    gammaValue.textContent = gammaSlider.value;

    // Premier calcul
    simulateSIR();
});