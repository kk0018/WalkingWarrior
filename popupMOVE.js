let state = { steps: 0, power: 14, dist: 0 };
let lastStepTime = 0;

function createWorld() {
    const trees = document.getElementById('tree-layer');
    const mtns = document.getElementById('mtn-layer');
    
    for (let i = 0; i < 100; i++) {
        let t = document.createElement('div');
        t.className = `tree tree-v${(i % 3) + 1}`;
        trees.appendChild(t);
        
        if (i % 3 === 0) {
            let m = document.createElement('div');
            m.className = 'mountain';
            mtns.appendChild(m);
        }
    }
}

function handleStep() {
    state.steps++;
    state.dist += 40;
    
    document.getElementById('steps').innerText = state.steps;
    // Parallax effect: trees move faster than mountains
    document.getElementById('tree-layer').style.transform = `translateX(-${state.dist}px)`;
    document.getElementById('mtn-layer').style.transform = `translateX(-${state.dist * 0.3}px)`;
    
    const sprite = document.getElementById('warrior-sprite');
    sprite.classList.add('bob');
    setTimeout(() => sprite.classList.remove('bob'), 300);

    const log = document.getElementById('log');
    if (state.steps % 10 === 0) {
        log.innerHTML = `<div style="color:gold">> Found loot! Power increased!</div>` + log.innerHTML;
        state.power += 2;
        document.getElementById('power').innerText = state.power;
    } else {
        log.innerHTML = `<div>> Step ${state.steps} taken.</div>` + log.innerHTML;
    }
}

document.getElementById('motionBtn').addEventListener('click', () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission().then(permission => {
            if (permission === 'granted') startTracking();
        });
    } else {
        startTracking();
    }
});

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

document.getElementById('stepBtn').addEventListener('click', handleStep);
createWorld();
