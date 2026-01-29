let state = { steps: 0, power: 14, dist: 0 };
let lastStepTime = 0;

function createWorld() {
    const trees = document.getElementById('tree-layer');
    const mtns = document.getElementById('mtn-layer');
    trees.innerHTML = '';
    mtns.innerHTML = '';
    
    // Create a long row of scenery
    for (let i = 0; i < 150; i++) {
        let t = document.createElement('div');
        t.className = `tree tree-v${(i % 3) + 1}`;
        trees.appendChild(t);
        
        if (i % 5 === 0) {
            let m = document.createElement('div');
            m.className = 'mountain';
            mtns.appendChild(m);
        }
    }
}

function handleStep() {
    state.steps++;
    state.dist += 60; // How many pixels to move per step
    
    // Update text
    document.getElementById('steps').innerText = state.steps;
    
    // MOVE THE BACKGROUND
    // We use a negative number to slide it to the left
    document.getElementById('tree-layer').style.transform = `translateX(-${state.dist}px)`;
    document.getElementById('mtn-layer').style.transform = `translateX(-${state.dist * 0.4}px)`;
    
    // BOUNCING ANIMATION
    const sprite = document.getElementById('warrior-sprite');
    sprite.classList.add('bob');
    setTimeout(() => sprite.classList.remove('bob'), 300);

    // LOGGING
    const log = document.getElementById('log');
    let entry = document.createElement('div');
    if (state.steps % 10 === 0) {
        state.power += 2;
        document.getElementById('power').innerText = state.power;
        entry.style.color = "gold";
        entry.innerText = `> Step ${state.steps}: Loot found! Power is now ${state.power}`;
    } else {
        entry.innerText = `> Step ${state.steps} taken.`;
    }
    log.prepend(entry);
}

// SETUP SENSORS
document.getElementById('motionBtn').addEventListener('click', () => {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission().then(permission => {
            if (permission === 'granted') startTracking();
        });
    } else {
        startTracking();
    }
});

function startTracking() {
    document.getElementById('motionBtn').style.display = 'none';
    document.getElementById('log').prepend(document.createElement('div').innerText = "> Motion Active!");
    window.addEventListener('devicemotion', (e) => {
        let acc = e.accelerationIncludingGravity;
        let total = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
        let now = Date.now();
        // 13 is the "shake" threshold. 700ms prevents double-steps.
        if (total > 13 && (now - lastStepTime) > 700) {
            lastStepTime = now;
            handleStep();
        }
    });
}

document.getElementById('stepBtn').addEventListener('click', handleStep);
createWorld();
