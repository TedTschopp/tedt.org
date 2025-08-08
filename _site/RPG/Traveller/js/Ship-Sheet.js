// Ship-Sheet.js
// Based on Character-Sheet.js, stubbed for ship sheet interactivity
// Add ship-specific logic for save, load, export, import, reset, and weapons table

// Helper: Collect all ship sheet data into an object
function collectShipData() {
  return {
    // Ship Details
    shipName: document.getElementById('shipName').value,
    shipClass: document.getElementById('shipClass').value,
    shipType: document.getElementById('shipType').value,
    tonnage: document.getElementById('tonnage').value,
    hullPoints: document.getElementById('hullPoints').value,
    armor: document.getElementById('armor').value,
    techLevel: document.getElementById('techLevel').value,
    // Crew & Passengers
    crewTotal: document.getElementById('crewTotal').value,
    passengers: document.getElementById('passengers').value,
    staterooms: document.getElementById('staterooms').value,
    lowBerths: document.getElementById('lowBerths').value,
    // Ship Systems
    jumpDrive: document.getElementById('jumpDrive').value,
    maneuverDrive: document.getElementById('maneuverDrive').value,
    powerPlant: document.getElementById('powerPlant').value,
    fuel: document.getElementById('fuel').value,
    // Weapons & Defenses
    weapons: Array.from(document.getElementById('weapons-container').querySelectorAll('tr')).map(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 6) return null;
      return {
        name: cells[0].textContent,
        type: cells[1].textContent,
        arc: cells[2].textContent,
        power: cells[3].textContent,
        notes: cells[4].textContent
      };
    }).filter(Boolean),
    // Cargo & Stores
    cargoCapacity: document.getElementById('cargoCapacity').value,
    cargoCurrent: document.getElementById('cargoCurrent').value,
    cargoNotes: document.getElementById('cargoNotes').value,
    // Finances
    shipValue: document.getElementById('shipValue').value,
    monthlyPayment: document.getElementById('monthlyPayment').value,
    debt: document.getElementById('debt').value,
    financeNotes: document.getElementById('financeNotes').value,
    // Notes
    notes: document.getElementById('notes').value
  };
}

// Helper: Populate all ship sheet fields from an object
function populateShipData(data) {
  if (!data) return;
  document.getElementById('shipName').value = data.shipName || '';
  document.getElementById('shipClass').value = data.shipClass || '';
  document.getElementById('shipType').value = data.shipType || '';
  document.getElementById('tonnage').value = data.tonnage || '';
  document.getElementById('hullPoints').value = data.hullPoints || '';
  document.getElementById('armor').value = data.armor || '';
  document.getElementById('techLevel').value = data.techLevel || '';
  document.getElementById('crewTotal').value = data.crewTotal || '';
  document.getElementById('passengers').value = data.passengers || '';
  document.getElementById('staterooms').value = data.staterooms || '';
  document.getElementById('lowBerths').value = data.lowBerths || '';
  document.getElementById('jumpDrive').value = data.jumpDrive || '';
  document.getElementById('maneuverDrive').value = data.maneuverDrive || '';
  document.getElementById('powerPlant').value = data.powerPlant || '';
  document.getElementById('fuel').value = data.fuel || '';
  // Weapons & Defenses
  const weaponsContainer = document.getElementById('weapons-container');
  weaponsContainer.innerHTML = '';
  if (Array.isArray(data.weapons)) {
    data.weapons.forEach(w => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${w.name || ''}</td><td>${w.type || ''}</td><td>${w.arc || ''}</td><td>${w.power || ''}</td><td>${w.notes || ''}</td><td class='no-print'><button class='btn btn-remove' onclick='this.closest("tr").remove()'>×</button></td>`;
      weaponsContainer.appendChild(row);
    });
  }
  document.getElementById('cargoCapacity').value = data.cargoCapacity || '';
  document.getElementById('cargoCurrent').value = data.cargoCurrent || '';
  document.getElementById('cargoNotes').value = data.cargoNotes || '';
  document.getElementById('shipValue').value = data.shipValue || '';
  document.getElementById('monthlyPayment').value = data.monthlyPayment || '';
  document.getElementById('debt').value = data.debt || '';
  document.getElementById('financeNotes').value = data.financeNotes || '';
  document.getElementById('notes').value = data.notes || '';
}

function saveShip() {
  const ship = collectShipData();
  localStorage.setItem('traveller-ship', JSON.stringify(ship));
  alert('Ship saved!');
}

function loadShip() {
  const data = localStorage.getItem('traveller-ship');
  if (!data) return alert('No saved ship found.');
  const ship = JSON.parse(data);
  populateShipData(ship);
  alert('Ship loaded!');
}

function exportShip() {
  const ship = collectShipData();
  const blob = new Blob([JSON.stringify(ship, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'traveller-ship.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importShip() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const ship = JSON.parse(evt.target.result);
        populateShipData(ship);
        alert('Ship imported!');
      } catch (err) {
        alert('Invalid file.');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function resetShip() {
  if (!confirm('Are you sure you want to reset the ship sheet? All data will be lost.')) return;
  // Clear all fields
  document.querySelectorAll('input, textarea').forEach(el => {
    if (el.type === 'number' || el.type === 'text' || el.tagName === 'TEXTAREA') el.value = '';
  });
  document.getElementById('weapons-container').innerHTML = '';
}

function deleteShip() {
  if (!confirm('Are you sure you want to delete the saved ship?')) return;
  localStorage.removeItem('traveller-ship');
  alert('Saved ship deleted.');
}

function addWeapon() {
  const name = document.getElementById('weaponName').value.trim();
  const type = document.getElementById('weaponType').value.trim();
  const arc = document.getElementById('weaponArc').value.trim();
  const power = document.getElementById('weaponPower').value.trim();
  const notes = document.getElementById('weaponNotes').value.trim();
  if (!name) return;
  const container = document.getElementById('weapons-container');
  const row = document.createElement('tr');
  row.innerHTML = `<td>${name}</td><td>${type}</td><td>${arc}</td><td>${power}</td><td>${notes}</td><td class='no-print'><button class='btn btn-remove' onclick='this.closest("tr").remove()'>×</button></td>`;
  container.appendChild(row);
  document.getElementById('weaponName').value = '';
  document.getElementById('weaponType').value = '';
  document.getElementById('weaponArc').value = '';
  document.getElementById('weaponPower').value = '';
  document.getElementById('weaponNotes').value = '';
}
