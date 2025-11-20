// Data: Moods and Quotes
const quotesData = {
    angry: {
        category: "Humor + Calm",
        quotes: [
            "Speak when you are angry and you will make the best speech you will ever regret.",
            "Holding onto anger is like drinking poison and expecting the other person to die.",
            "Take a deep breath. It's just a bad day, not a bad life.",
            "Anger is one letter short of Danger.",
            "Keep calm and pretend it's not happening.",
            "I am not angry, I am just passionately expressing my correctness.",
            "Don't get mad, get even? No, get ice cream. It's colder and sweeter.",
            "Patience is what you have when there are too many witnesses.",
            "If you're angry, just yell 'BUBBLES' in the angriest voice you can. It's impossible to sound mean.",
            "Life is short. Smile while you still have teeth."
        ]
    },
    tired: {
        category: "Gentle Motivation",
        quotes: [
            "Rest if you must, but don't you quit.",
            "It's okay to take a break. You are human, not a machine.",
            "Almost everything will work again if you unplug it for a few minutes, including you.",
            "Tough times never last, but tough people do.",
            "Sleep is the best meditation.",
            "I'm not lazy, I'm on energy saving mode.",
            "Nap time is my happy hour.",
            "You can't pour from an empty cup. Take care of yourself first.",
            "Even the sun goes down every night. But it rises again. You will too.",
            "Maybe a cookie will help?"
        ]
    },
    sad: {
        category: "Uplifting",
        quotes: [
            "This too shall pass.",
            "Stars can't shine without darkness.",
            "You are loved more than you know.",
            "Every day may not be good, but there is something good in every day.",
            "Rainbows follow the rain.",
            "It's okay to be a glowstick; sometimes we have to break before we shine.",
            "Cry a river. Build a bridge. Get over it. (But take your time building the bridge).",
            "When it rains, look for rainbows. When it's dark, look for stars.",
            "You are stronger than you seem, braver than you believe, and smarter than you think.",
            "Sending you a virtual hug. Loading... 100%."
        ]
    },
    unmotivated: {
        category: "Action Push",
        quotes: [
            "Action is the foundational key to all success.",
            "Don't wait for opportunity. Create it.",
            "The secret of getting ahead is getting started.",
            "Do something today that your future self will thank you for.",
            "Dream big. Start small. Act now.",
            "Yesterday you said tomorrow.",
            "Don't watch the clock; do what it does. Keep going.",
            "Success is the sum of small efforts, repeated day in and day out.",
            "If you get tired, learn to rest, not to quit.",
            "Your only limit is your mind."
        ]
    },
    happy: {
        category: "Encouragement",
        quotes: [
            "Keep shining, beautiful soul!",
            "Happiness looks gorgeous on you.",
            "Spread love everywhere you go.",
            "The best way to pay for a lovely moment is to enjoy it.",
            "Stay close to people who feel like sunlight.",
            "Be the reason someone smiles today.",
            "Happiness is not out there, it's in you.",
            "Enjoy the little things, for one day you may look back and realize they were the big things.",
            "You are doing amazing, sweetie!",
            "Dance like nobody's watching."
        ]
    },
    stressed: {
        category: "Breathing",
        quotes: [
            "Inhale peace, exhale stress.",
            "One step at a time.",
            "You don't have to see the whole staircase, just take the first step.",
            "Stress is caused by being 'here' but wanting to be 'there'.",
            "Breathe. You've got this.",
            "Stressed spelled backwards is Desserts. Coincidence? I think not!",
            "Rule number one is, don't sweat the small stuff. Rule number two is, it's all small stuff.",
            "Take a deep breath. It's just a bad moment, not a bad life.",
            "Loosen your jaw. Drop your shoulders. Relax.",
            "Worrying does not empty tomorrow of its troubles, it empties today of its strength."
        ]
    }
};

const jokesData = [
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "Why don't scientists trust atoms? Because they make up everything!",
    "I threw a boomerang a few years ago. I now live in constant fear.",
    "Parallel lines have so much in common. It’s a shame they’ll never meet.",
    "My boss told me to have a good day.. so I went home.",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "I'm reading a book on anti-gravity. It's impossible to put down!",
    "I used to play piano by ear, but now I use my hands.",
    "Why don't skeletons fight each other? They don't have the guts.",
    "What do you call a fake noodle? An impasta."
];

// DOM Elements
const moodBtns = document.querySelectorAll('.mood-btn');
const moodSelector = document.getElementById('mood-selector');
const quoteDisplay = document.getElementById('quote-display');
const quoteText = document.getElementById('quote-text');
const quoteCategory = document.getElementById('quote-category');
const resetBtn = document.getElementById('reset-btn');
const topMoodEl = document.getElementById('top-mood');
const totalCheckinsEl = document.getElementById('total-checkins');
const ctx = document.getElementById('moodChart').getContext('2d');
const stickyContainer = document.getElementById('sticky-notes-container');

// State
let moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
if (!Array.isArray(moodHistory)) {
    moodHistory = [];
}
let moodChart;

// Initialize
function init() {
    updateDashboard();
    renderChart();
    renderStickyNotes();
}

// Event Listeners
moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const mood = btn.dataset.mood;
        handleMoodSelection(mood);
    });
});

resetBtn.addEventListener('click', () => {
    quoteDisplay.classList.add('hidden');
    moodSelector.classList.remove('hidden');
    moodSelector.style.animation = 'fadeInUp 0.5s ease-out';
});

// Logic
function handleMoodSelection(mood) {
    // 1. Get Quote
    const data = quotesData[mood];
    const randomQuote = data.quotes[Math.floor(Math.random() * data.quotes.length)];

    // 2. Update UI
    quoteText.textContent = `"${randomQuote}"`;
    quoteCategory.textContent = data.category;

    moodSelector.classList.add('hidden');
    quoteDisplay.classList.remove('hidden');

    // 3. Save Data
    saveMood(mood);
}

function saveMood(mood) {
    const entry = {
        mood: mood,
        timestamp: new Date().toISOString()
    };
    moodHistory.push(entry);
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));

    updateDashboard();
    updateChart();
}

function updateDashboard() {
    totalCheckinsEl.textContent = moodHistory.length;

    if (moodHistory.length === 0) return;

    const counts = {};
    moodHistory.forEach(item => {
        counts[item.mood] = (counts[item.mood] || 0) + 1;
    });

    const topMood = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    topMoodEl.textContent = topMood.charAt(0).toUpperCase() + topMood.slice(1);
}

// Sticky Notes Logic
function renderStickyNotes() {
    // Clear existing
    stickyContainer.innerHTML = '';

    // Configuration for positions (approximate % from top/left/right)
    // Left side notes
    const leftPositions = [
        { top: '10%', left: '5%', rotate: '-5deg', color: 'note-yellow' },
        { top: '40%', left: '2%', rotate: '3deg', color: 'note-blue' },
        { top: '70%', left: '6%', rotate: '-2deg', color: 'note-pink' }
    ];

    // Right side notes
    const rightPositions = [
        { top: '15%', right: '5%', rotate: '4deg', color: 'note-green' },
        { top: '50%', right: '3%', rotate: '-3deg', color: 'note-yellow' },
        { top: '80%', right: '6%', rotate: '2deg', color: 'note-blue' }
    ];

    const allPositions = [...leftPositions, ...rightPositions];

    // Shuffle jokes to get random ones
    const shuffledJokes = [...jokesData].sort(() => 0.5 - Math.random());

    allPositions.forEach((pos, index) => {
        if (index >= shuffledJokes.length) return;

        const note = document.createElement('div');
        note.classList.add('sticky-note', pos.color);
        note.style.top = pos.top;
        if (pos.left) note.style.left = pos.left;
        if (pos.right) note.style.right = pos.right;
        note.style.transform = `rotate(${pos.rotate})`;

        note.textContent = shuffledJokes[index];

        stickyContainer.appendChild(note);
    });
}

// Chart.js
function renderChart() {
    const counts = getMoodCounts();

    moodChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Angry', 'Tired', 'Sad', 'Meh', 'Happy', 'Stressed'],
            datasets: [{
                label: '# of Check-ins',
                data: [
                    counts.angry || 0,
                    counts.tired || 0,
                    counts.sad || 0,
                    counts.unmotivated || 0,
                    counts.happy || 0,
                    counts.stressed || 0
                ],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.5)', // Angry - Red
                    'rgba(148, 163, 184, 0.5)', // Tired - Gray
                    'rgba(59, 130, 246, 0.5)', // Sad - Blue
                    'rgba(245, 158, 11, 0.5)', // Meh - Orange
                    'rgba(34, 197, 94, 0.5)', // Happy - Green
                    'rgba(168, 85, 247, 0.5)'  // Stressed - Purple
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(148, 163, 184, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(168, 85, 247, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function updateChart() {
    const counts = getMoodCounts();
    moodChart.data.datasets[0].data = [
        counts.angry || 0,
        counts.tired || 0,
        counts.sad || 0,
        counts.unmotivated || 0,
        counts.happy || 0,
        counts.stressed || 0
    ];
    moodChart.update();
}

function getMoodCounts() {
    const counts = {};
    moodHistory.forEach(item => {
        counts[item.mood] = (counts[item.mood] || 0) + 1;
    });
    return counts;
}

// Start
init();
