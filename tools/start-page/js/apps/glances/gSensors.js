//
import { fetchGlances } from "./gCore.js";

export function initSensors(el, config) {
    const { url, apiVer } = config;
    const bodyEl = el.querySelector('.glances-body');

    // 1. Setup DOM
    bodyEl.innerHTML = `<div class="sensor-grid" id="sensor-grid">Scanning...</div>`;
    const titleEl = el.querySelector('.metric-title');
    const valEl = el.querySelector('.metric-value');

    // 2. Return Update Function
    return async () => {
        const rawSensors = await fetchGlances(url, apiVer, 'sensors');
        let sensors = Array.isArray(rawSensors) ? rawSensors : Object.values(rawSensors || {});

        // Filter weird units
        if (sensors.length > 0 && sensors[0].unit !== 'C' && sensors[0].unit !== 'F') {
             sensors = sensors.filter(s => s.unit === 'C' || s.unit === 'F');
        }

        titleEl.innerText = "TEMPS";
        valEl.innerText = sensors.length > 0 ? sensors.length + " Active" : "--";

        const grid = el.querySelector('#sensor-grid');
        grid.innerHTML = '';

        if (sensors.length > 0) {
            sensors.forEach(s => {
                // Label Logic
                let label = s.label || s.adapter || 'Unknown';
                if (label.startsWith('Package id')) label = 'Pkg'; // Shorten for vertical
                else if (label.startsWith('Core')) label = label.replace('Core ', 'C');
                else if (label === 'Composite') label = 'CPU';
                else if (label.startsWith('acpitz')) label = 'Mobo';
                else if (label.startsWith('nvme')) label = 'SSD';

                // Thresholds from your guide
                const CAREFUL = 45;
                const WARNING = 65;
                const CRITICAL = 80;

                // Calculate Bar Height (Visual scaling)
                // Map 0-100C to 0-100% height
                let percent = s.value;
                if (percent > 100) percent = 100;

                // Dynamic Status
                let stateClass = 'cool'; // < 45

                if (s.value >= CRITICAL) stateClass = 'critical';
                else if (s.value >= WARNING) stateClass = 'warning';
                else if (s.value >= CAREFUL) stateClass = 'careful'; // 45-65

                // Create Card
                const box = document.createElement('div');
                box.className = `sensor-v-bar ${stateClass}`;

                box.innerHTML = `
                    <div class="sv-val">${s.value.toFixed(0)}°</div>
                    <div class="sv-track">
                        <div class="sv-fill" style="height: ${percent}%"></div>
                    </div>
                    <div class="sv-name" title="${s.label}">${label}</div>
                `;
                grid.appendChild(box);
            });
        } else {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; opacity: 0.6;">No sensors found</div>';
        }
    };
}