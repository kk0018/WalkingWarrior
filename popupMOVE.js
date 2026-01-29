// New state to track real-world position
let state = { steps: 0, power: 14, dist: 0, lat: null, lon: null };

// 1. Get User Location
function startGPS() {
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition((position) => {
            state.lat = position.coords.latitude;
            state.lon = position.coords.longitude;
            
            // Check if user is near a "Quest Item"
            checkProximityToItems(state.lat, state.lon);
            
            document.getElementById('log').prepend(
                document.createElement('div').innerText = `> GPS: ${state.lat.toFixed(4)}, ${state.lon.toFixed(4)}`
            );
        }, (err) => {
            console.error("GPS Error", err);
        }, { enableHighAccuracy: true });
    }
}

// 2. Proximity Logic (Simple version)
function checkProximityToItems(userLat, userLon) {
    // Example: A "Magic Well" at a specific spot in Cedar Rapids
    const itemLat = 41.9779; 
    const itemLon = -91.6656;
    
    // Calculate distance (very simplified)
    const dLat = Math.abs(userLat - itemLat);
    const dLon = Math.abs(userLon - itemLon);
    
    if (dLat < 0.0001 && dLon < 0.0001) {
        const log = document.getElementById('log');
        log.innerHTML = `<div style="color:cyan; font-weight:bold;">> YOU FOUND THE MAGIC WELL! +10 Power</div>` + log.innerHTML;
        state.power += 10;
        document.getElementById('power').innerText = state.power;
    }
}
