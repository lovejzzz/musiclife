let goals = [];
let weeklyTasks = [];

const musicalKeys = [
    'C Major', 'G Major', 'D Major', 'A Major', 'E Major', 'B Major',
    'F Major', 'B♭ Major', 'E♭ Major', 'A♭ Major', 'D♭ Major', 'G♭ Major'
];

const defaultExamples = {
    'technique': 'e.g., Harmonic Minor',
    'repertoire': 'e.g., Yeasterdays',
    'theory': 'e.g., Diminish 6',
    'sightReading': 'e.g., Joy of Improv book'
};

function updatePlaceholder() {
    const category = document.getElementById('goalCategory').value;
    const input = document.getElementById('goalInput');
    input.placeholder = defaultExamples[category];
}

function addGoal() {
    const goalInput = document.getElementById('goalInput');
    const goalCategory = document.getElementById('goalCategory');
    
    let goalText = goalInput.value.trim();
    
    if (goalText === '') {
        const example = defaultExamples[goalCategory.value];
        goalText = example.replace('e.g., ', '');
    }

    const goal = {
        id: Date.now(),
        text: goalText,
        category: goalCategory.value
    };

    goals.push(goal);
    updateGoalsList();
    goalInput.value = '';
    updatePlaceholder();
}

function updateGoalsList() {
    const goalsListElement = document.getElementById('goalsList');
    goalsListElement.innerHTML = '';

    goals.forEach(goal => {
        const goalElement = document.createElement('div');
        goalElement.className = 'goal-item';
        goalElement.innerHTML = `
            <span>${goal.text} (${goal.category})</span>
            <button onclick="removeGoal(${goal.id})">×</button>
        `;
        goalsListElement.appendChild(goalElement);
    });
}

function removeGoal(goalId) {
    goals = goals.filter(goal => goal.id !== goalId);
    updateGoalsList();
}

function generateTasks() {
    if (goals.length === 0) {
        alert('Please add at least one goal');
        return;
    }

    weeklyTasks = [];
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    daysOfWeek.forEach(day => {
        const dayTasks = [];
        
        goals.forEach(goal => {
            if (goal.category === 'technique') {
                const randomKey = musicalKeys[Math.floor(Math.random() * musicalKeys.length)];
                dayTasks.push(generateTechniqueTask(goal, randomKey, day));
            } else {
                dayTasks.push(generateTaskForGoal(goal, day));
            }
        });

        weeklyTasks.push(...dayTasks);
    });

    displayWeeklyTasks();
    document.querySelector('.download-btn').style.display = 'block';
}

function generateTechniqueTask(goal, key, day) {
    const techniqueInstructions = [
        `Practice ${goal.text} in ${key} - hands separately, slow tempo`,
        `Work on ${goal.text} in ${key} - hands together, gradually increase speed`,
        `Focus on ${goal.text} in ${key} - with metronome at 60 BPM`,
        `Study ${goal.text} in ${key} - emphasize finger precision`,
        `Review ${goal.text} in ${key} - focus on smooth transitions`
    ];
    
    return {
        id: Date.now() + Math.random(),
        text: techniqueInstructions[Math.floor(Math.random() * techniqueInstructions.length)],
        day: day,
        completed: false,
        category: 'technique'
    };
}

function generateTaskForGoal(goal, day) {
    const taskTemplates = {
        repertoire: [
            "Practice {goal} hands separately at half tempo",
            "Work on {goal} hands together, focusing on difficult passages",
            "Memorize first page of {goal} hands separately",
            "Practice {goal} with metronome at 70% target tempo",
            "Record yourself playing {goal} and analyze areas for improvement",
            "Focus on dynamics and expression in {goal}",
            "Practice problem sections of {goal} with different rhythmic patterns",
            "Work on pedaling technique in {goal}",
            "Practice {goal} section by section, hands separately then together",
            "Focus on articulation and phrasing in {goal}"
        ],
        theory: [
            "Study {goal} concepts and write out examples",
            "Practice identifying {goal} in your current repertoire",
            "Complete written exercises for {goal}",
            "Create your own examples of {goal}",
            "Analyze a piece of music focusing on {goal}",
            "Practice ear training exercises related to {goal}",
            "Write a short progression using {goal}",
            "Review and summarize key points about {goal}",
            "Do worksheet exercises focusing on {goal}",
            "Create flashcards for {goal} concepts"
        ],
        sightReading: [
            "Practice sight reading from {goal} for 15 minutes",
            "Read through a new piece in {goal} hands separately",
            "Practice rhythm only from {goal} by clapping",
            "Sight read easy pieces from {goal} at 50% tempo",
            "Practice scanning ahead while reading from {goal}",
            "Read duet parts from {goal}",
            "Practice sight reading with metronome from {goal}",
            "Read only left hand parts from {goal}",
            "Read only right hand parts from {goal}",
            "Practice sight reading and counting aloud from {goal}"
        ]
    };

    const templates = taskTemplates[goal.category];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    return {
        id: Date.now() + Math.random(),
        text: randomTemplate.replace('{goal}', goal.text),
        day: day,
        completed: false,
        category: goal.category
    };
}

function displayWeeklyTasks() {
    const tasksContainer = document.getElementById('weeklyTasks');
    tasksContainer.innerHTML = '';

    const tasksByDay = weeklyTasks.reduce((acc, task) => {
        if (!acc[task.day]) {
            acc[task.day] = [];
        }
        acc[task.day].push(task);
        return acc;
    }, {});

    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    daysOrder.forEach(day => {
        if (tasksByDay[day]) {
            const dayCard = document.createElement('div');
            dayCard.className = 'task-card';
            
            let tasksHTML = `<h3>${day}</h3>`;
            tasksByDay[day].forEach(task => {
                tasksHTML += `
                    <div class="task-item ${task.completed ? 'completed' : ''}">
                        <div class="task-checkbox ${task.completed ? 'completed' : ''}" 
                             onclick="toggleTaskCompletion(${task.id})"></div>
                        <div class="task-content">${task.text}</div>
                    </div>
                `;
            });

            dayCard.innerHTML = tasksHTML;
            tasksContainer.appendChild(dayCard);
        }
    });
}

function toggleTaskCompletion(taskId) {
    const task = weeklyTasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        displayWeeklyTasks();
    }
}

function downloadPDF() {
    // Create a new window for the printable version
    const printWindow = window.open('', '_blank');
    
    // Create the printable content
    let content = `
        <html>
        <head>
            <title>Weekly Piano Practice Plan</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                h1 {
                    text-align: center;
                    margin-bottom: 30px;
                }
                h2 {
                    margin-top: 20px;
                    border-bottom: 1px solid #ccc;
                    padding-bottom: 5px;
                }
                .task {
                    display: flex;
                    align-items: center;
                    margin: 10px 0;
                    padding-left: 20px;
                }
                .checkbox {
                    width: 12px;
                    height: 12px;
                    border: 2px solid black;
                    border-radius: 50%;
                    margin-right: 10px;
                    display: inline-block;
                    position: relative;
                }
                .completed .checkbox::after {
                    content: '';
                    position: absolute;
                    width: 6px;
                    height: 6px;
                    background: black;
                    border-radius: 50%;
                    top: 3px;
                    left: 3px;
                }
                .completed .text {
                    text-decoration: line-through;
                    color: #666;
                }
                @media print {
                    body { margin: 0; padding: 20px; }
                    .task { break-inside: avoid; }
                }
            </style>
        </head>
        <body>
            <h1>Weekly Piano Practice Plan</h1>
    `;

    // Add tasks grouped by day
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const tasksByDay = weeklyTasks.reduce((acc, task) => {
        if (!acc[task.day]) {
            acc[task.day] = [];
        }
        acc[task.day].push(task);
        return acc;
    }, {});

    daysOrder.forEach(day => {
        if (tasksByDay[day]) {
            content += `<h2>${day}</h2>`;
            tasksByDay[day].forEach(task => {
                content += `
                    <div class="task ${task.completed ? 'completed' : ''}">
                        <span class="checkbox"></span>
                        <span class="text">${task.text}</span>
                    </div>
                `;
            });
        }
    });

    content += `
        </body>
        </html>
    `;

    // Write the content to the new window
    printWindow.document.write(content);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = function() {
        printWindow.print();
        // printWindow.close(); // Optional: close after printing
    };
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    updatePlaceholder();
    
    document.getElementById('goalCategory').addEventListener('change', updatePlaceholder);
    
    document.getElementById('goalInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addGoal();
        }
    });

    document.querySelector('.download-btn').style.display = 'none';
});
