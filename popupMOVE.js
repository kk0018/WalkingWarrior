let state = { steps: 0, power: 14, gear: { head: 1, chest: 1, gloves: 1, boots: 1 }, distance: 0, motionEnabled: false };
let lastStepTime = 0;

const log = (msg, isSpecial = false) => {
    const logDiv = document.getElementById('log');
    const entry = document.createElement('div');
    if (isSpecial) entry.style.color = "#ffeb3b";
    entry.innerText = `> ${msg}`;
    logDiv.prepend(entry);
};

const buildEnvironment = () => {
    const bg = document.getElementById('bg-back');
    bg.innerHTML = '';
    const isForest = state.steps < 20;
    for (let i = 0; i < 150; i++) {
        const el = document.createElement('div');
        if (isForest) el.className = 'tree ' + (Math.random() > 0.5 ? 'tree-variant-1' : 'tree-variant-2');
        else el.className = 'mountain ' + (Math.random() > 0.5 ? 'mtn-variant-1' : 'mtn-variant-2');
        bg.appendChild(el);
    }
};

const updateUI = () => {
    document.getElementById('steps').innerText = state.steps;
    document.getElementById('power').innerText = state.power;
    document.getElementById('progress-bar').style.width = ((state.steps % 5) * 20) + "%";
    document.getElementById('bg-back').style.transform = `translateX(-${state.distance}px)`;
};

const saveGame = () => {
    localStorage.setItem('warriorState', JSON.stringify(state));
};

const handleStep = () => {
    state.steps++;
    state.distance += 45;
    const s = document.getElementById('warrior-sprite');
    s.classList.add('walking-anim');
    setTimeout(() => s.classList.remove('walking-anim'), 300);
    if (state.steps === 20) { log("Entering the Mountains!", true); buildEnvironment(); }
    if (state.steps % 5 === 0) {
        const enemy = Math.floor(Math.random() * (state.steps / 2)) + 5;
        if (state.power >= enemy) { log(`Defeated Enemy (Str ${enemy})`); rollLoot(); }
        else { log(`Enemy too strong!`); state.steps--; state.distance -= 45; }
    }
    updateUI();
    saveGame();
};

const rollLoot = () => {
    const slots = ['head', 'chest', 'gloves', 'boots'];
    const s = slots[Math.floor(Math.random() * 4)];
    const lvl = Math.floor(Math.random() * (state.steps / 3)) + 1;
    if (lvl > state.gear[s]) {
        log(`UPGRADE: Lv ${lvl} ${s}!`, true);
        state.gear[s] = lvl;
        state.power = 10 + Object.values(state.gear).reduce((a, b) => a + b, 0);
    }
};

// Motion Request for iOS/Android Browsers
const requestMotion = () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission().then(permissionState => {
            if (permissionState === 'granted') startMotion();
        });
    } else {
        startMotion();
    }
};

const startMotion = () => {
    state.motionEnabled = true;
    log("Walking Mode Active!");
    window.addEventListener('devicemotion', (event) => {
        const acc = event.accelerationIncludingGravity;
        const force = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
        const now = Date.now();
        if (force > 13 && (now - lastStepTime) > 600) { 
            lastStepTime = now;
            handleStep();
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('warriorState');
    if (saved) state = JSON.parse(saved);
    buildEnvironment();
    updateUI();
    document.getElementById('stepBtn').addEventListener('click', handleStep);
    document.getElementById('motionBtn').addEventListener('click', requestMotion);
    document.getElementById('resetBtn').addEventListener('click', () => {
        localStorage.removeItem('warriorState');
        location.reload();
    });
});