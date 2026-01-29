let state = { steps: 0, power: 14, dist: 0 };
let lastStepTime = 0;

function createWorld() {
    const trees = document.getElementById('tree-layer');
    const mtns = document.getElementById('mtn-layer');
    trees.innerHTML = ''; mtns.innerHTML = '';
    for (let i = 0; i < 200; i++) {
        let t = document.createElement('div');
        t.className = `tree tree-v${(i % 3) + 1}`;
        trees.appendChild(t);
        if (i % 6 === 0) {
            let m = document.createElement('div');
            m.className = 'mountain';
            mtns.appendChild(m);
        }
    }
}

function handleStep() {
    state.steps++;
    state.dist += 70;
    document.getElementById('steps').innerText = state.steps;
    document.getElementById('tree-layer').style.transform = `translateX(-${state.dist}px)`;
    document.getElementById('mtn-layer').style.transform = `translateX(-${state.dist * 0.3}px)`;
    
    const sprite = document.getElementById('warrior-sprite');
    sprite.classList.add('bob');
    setTimeout(() => sprite.classList.remove('bob'), 300);

    const log = document.getElementById('log');
    let entry = document.createElement('div');
    entry.innerText = `> Step ${state.steps} recorded.`;
    log.prepend(entry);
}

document.getElementById('resetBtn').onclick = () => {
    if(confirm("Restart?")) location.reload();
};

document.getElementById('motionBtn').onclick = () => {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission().then(permission => {
            if (permission === 'granted') startTracking();
        });
    } else {
        startTracking();
    }
};

function startTracking() {
    document.getElementById('motionBtn').style.display = 'none';
    window.addEventListener('devicemotion', (e) => {
        let acc = e.accelerationIncludingGravity;
        let total = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
        let now = Date.now();
        if (total > 13 && (now - lastStepTime) > 700) {
            lastStepTime = now;
            handleStep();
        }
    });
}

document.getElementById('stepBtn').onclick = handleStep;
createWorld();
