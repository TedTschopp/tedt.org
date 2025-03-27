// Helper function to get discipline level for any career
function getCareerDiscipline(careerName) {
  if (
    careerData[careerName] &&
    typeof careerData[careerName].discipline !== "undefined"
  ) {
    return careerData[careerName].discipline;
  } else if (typeof careerDiscipline[careerName] !== "undefined") {
    return careerDiscipline[careerName];
  } else {
    // Default value for unknown careers
    return 0.0;
  }
}

// Define core functions before they are used

// Update the DM (Dice Modifier) based on characteristic value
function updateDM(stat) {
  const currentValue = parseInt(
    document.getElementById(`${stat}-current`).value
  );
  const baselineValue = parseInt(
    document.getElementById(`${stat}-baseline`).value
  );

  let currentDM = calculateDM(currentValue);
  let baselineDM = calculateDM(baselineValue);

  document.getElementById(`${stat}-dm-current`).textContent =
    formatDM(currentDM);
  document.getElementById(`${stat}-dm-baseline`).textContent =
    formatDM(baselineDM);

  if (stat === "wlt") {
    updateWealthDisplay();
  }
}

// Helper function to calculate DM based on characteristic value
function calculateDM(value) {
  // Use a simple lookup table for DM values
  const dmTable = [
    { max: 0, dm: -3 },
    { max: 2, dm: -2 },
    { max: 5, dm: -1 },
    { max: 8, dm: 0 },
    { max: 11, dm: 1 },
    { max: 14, dm: 2 },
  ];

  // Find the first range where value <= max
  for (const entry of dmTable) {
    if (value <= entry.max) {
      return entry.dm;
    }
  }

  // If we get here, value is greater than all ranges (15+)
  return 3;
}

// Helper function to format DM with plus sign
function formatDM(dm) {
  return dm >= 0 ? `+${dm}` : `${dm}`;
}

// Calculate total years across education and careers
function updateTotalYears() {
  // First get education years
  const educationRows = document.querySelectorAll("#education-container tr");
  let totalEducationYears = 0;

  educationRows.forEach((row) => {
    const yearsCell = row.querySelector("td[data-years]");
    if (yearsCell) {
      totalEducationYears +=
        parseInt(yearsCell.getAttribute("data-years")) || 0;
    }
  });

  // Then get career years
  const careerRows = document.querySelectorAll("#careers-container tr");
  let totalCareerYears = 0;

  careerRows.forEach((row) => {
    const yearsCell = row.querySelector("td[data-years]");
    if (yearsCell) {
      totalCareerYears += parseInt(yearsCell.getAttribute("data-years")) || 0;
    }
  });

  // Calculate biological age: base + education years + career years
  if (document.getElementById("age")) {
    // Base age at character creation is 18
    const biologicalAge = 18 + totalEducationYears + totalCareerYears;
    document.getElementById("age").value = biologicalAge;
  }
}

// Calculate total terms across all careers
function updateTotalTerms() {
  const careerRows = document.querySelectorAll("#careers-container tr");
  let totalTerms = 0;

  careerRows.forEach((row) => {
    const termsCell = row.querySelector("td[data-terms]");
    if (termsCell) {
      totalTerms += parseInt(termsCell.getAttribute("data-terms")) || 0;
    }
  });

  // Update display of total terms somewhere if needed
  if (document.getElementById("totalTerms")) {
    document.getElementById("totalTerms").textContent = totalTerms;
  }

  // Update age including education years
  updateTotalYears();
}

// Update specialization options based on selected skill - simplify and make more robust
function updateSpecializationOptions(sourceId = "skillSearch", datalistId = "specialization-list") {
  // Get the skill name from the input field
  const skillInput = document.getElementById(sourceId);
  if (!skillInput) {
    console.error(`Input element with ID '${sourceId}' not found`);
    return;
  }
  
  const skillName = skillInput.value;
  if (!skillName) return;
  
  // Get or create the datalist element
  let specList = document.getElementById(datalistId);
  if (!specList) {
    specList = document.createElement("datalist");
    specList.id = datalistId;
    document.body.appendChild(specList);
    console.log(`Created new datalist with ID: ${datalistId}`);
  }
  
  // Clear existing options
  specList.innerHTML = "";
  
  // Add specializations if they exist for this skill
  if (skillSpecializations[skillName] && skillSpecializations[skillName].length > 0) {
    const sortedSpecs = [...skillSpecializations[skillName]].sort();
    console.log(`Adding ${sortedSpecs.length} specializations for ${skillName}`);
    
    sortedSpecs.forEach(spec => {
      const option = document.createElement("option");
      option.value = spec;
      specList.appendChild(option);
    });
  } else {
    console.log(`No specializations found for skill: ${skillName}`);
  }
}

// Update assignments dropdown when career is selected
function updateAssignments() {
  const careerName = document.getElementById("careerName").value;
  const assignmentSelect = document.getElementById("careerAssignment");

  console.log("Selected career:", careerName); // Debug line

  // Clear current options
  assignmentSelect.innerHTML = '<option value="">Select Assignment...</option>';

  // First try exact match
  if (careerData[careerName] && careerData[careerName].assignments) {
    populateAssignments(careerName, assignmentSelect);
  }
  // Try matching without the parenthesized number
  else {
    // Try to find a matching career name with numbering
    const careerKeys = Object.keys(careerData);
    const matchingCareer = careerKeys.find(
      (key) => key.startsWith(careerName + " (") || key === careerName
    );

    console.log("Matching career found:", matchingCareer); // Debug line

    if (matchingCareer && careerData[matchingCareer].assignments) {
      populateAssignments(matchingCareer, assignmentSelect);
    }
  }

  // Clear and update rank field
  document.getElementById("careerRank").value = "";
  suggestRank();
}

// Helper function to populate assignments dropdown
function populateAssignments(careerKey, selectElement) {
  const assignments = Object.keys(careerData[careerKey].assignments);

  // Sort assignments alphabetically
  const sortedAssignments = assignments.sort();

  sortedAssignments.forEach((assignment) => {
    const option = document.createElement("option");
    option.value = assignment;
    option.textContent = assignment;
    selectElement.appendChild(option);
  });

  console.log(`Added ${assignments.length} assignments for ${careerKey}`); // Debug line
}

// Suggest rank based on career and terms
function suggestRank() {
  const careerName = document.getElementById("careerName").value;
  const assignment = document.getElementById("careerAssignment").value;
  const careerPromotions =
    parseInt(document.getElementById("careerPromotions").value) || 0;
  const rankField = document.getElementById("careerRank");

  // Calculate recommended rank based on promotions
  let rankLevel = Math.min(careerPromotions, 6);
  if (rankLevel < 0) rankLevel = 0;

  // First try exact career name match
  let careerFound = careerData[careerName];

  // If not found, try to match without the parenthesized number
  if (!careerFound) {
    const careerKeys = Object.keys(careerData);
    const matchingCareer = careerKeys.find(
      (key) => key.startsWith(careerName + " (") || key === careerName
    );

    if (matchingCareer) {
      careerFound = careerData[matchingCareer];
    }
  }

  // Get proper rank title if available
  if (
    careerFound &&
    careerFound.assignments &&
    assignment &&
    careerFound.assignments[assignment] &&
    careerFound.assignments[assignment].ranks &&
    careerFound.assignments[assignment].ranks[rankLevel]
  ) {
    rankField.value =
      careerFound.assignments[assignment].ranks[rankLevel].title;
  } else {
    // Use generic rank structure
    rankField.value = genericRankStructure[rankLevel].title;
  }
}

// Helper functions for skill management
function getExistingSpecializations(skillName) {
  const existingSkills = document.querySelectorAll(".skill-name");
  const existingSpecs = [];

  for (let i = 0; i < existingSkills.length; i++) {
    if (existingSkills[i].getAttribute("data-skill") === skillName) {
      const spec = existingSkills[i].getAttribute("data-specialization");
      if (spec) {
        existingSpecs.push(spec);
      }
    }
  }

  return existingSpecs;
}

function updateExistingSkill(skillName, specialization, level) {
  const skillItems = document.querySelectorAll(".skill-item");

  for (let i = 0; i < skillItems.length; i++) {
    const skillNameElem = skillItems[i].querySelector(".skill-name");

    if (
      skillNameElem.getAttribute("data-skill") === skillName &&
      skillNameElem.getAttribute("data-specialization") === specialization
    ) {
      const input = skillItems[i].querySelector("input");
      input.value = level;
      return true;
    }
  }

  return false;
}

function addSingleSkill(skillName, specialization, skillLevel) {
  // Check if skill already exists
  const existingSkills = document.querySelectorAll(".skill-name");
  for (let i = 0; i < existingSkills.length; i++) {
    if (
      existingSkills[i].getAttribute("data-skill") === skillName &&
      existingSkills[i].getAttribute("data-specialization") === specialization
    ) {
      // Update existing skill instead of adding duplicate
      updateExistingSkill(skillName, specialization, skillLevel);
      return;
    }
  }

  const skillsContainer = document.getElementById("skills-container");
  const skillDiv = document.createElement("div");
  skillDiv.className = "skill-item";

  // Store both skill name and specialization separately for data handling
  skillDiv.innerHTML = `
                <span class="skill-name" data-skill="${skillName}" data-specialization="${
    specialization || ""
  }">
                    ${skillName}${
    specialization
      ? ` <span class="skill-specialization">(${specialization})</span>`
      : ""
  }
                </span>
                <div class="d-flex align-items-center">
                    <input type="number" class="form-control form-control-sm mx-2" value="${skillLevel}" min="0" style="width: 60px;">
                    <button class="btn btn-remove no-print" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            `;

  skillsContainer.appendChild(skillDiv);
}

// Modified addSkill function to handle mandatory specializations
function addSkill() {
  const skillName = document.getElementById("skillSearch").value;
  const specialization = document.getElementById("specializationField").value;
  const skillLevel = document.getElementById("skillLevel").value || 0;

  if (!skillName) return;

  // Special handling for skills with mandatory specializations
  if (skillsWithMandatorySpecializations.includes(skillName)) {
    if (!specialization && skillSpecializations[skillName]?.length > 0) {
      alert(
        `The skill "${skillName}" requires you to select a specialization.`
      );
      return;
    }

    // Add all specializations at level 0, with the chosen one at the specified level
    const specs = skillSpecializations[skillName] || [];
    if (specs.length > 0) {
      // First check if any specializations already exist
      const existingSpecs = getExistingSpecializations(skillName);

      // If not all specializations exist yet, add all of them
      if (existingSpecs.length < specs.length) {
        for (const spec of specs) {
          if (!existingSpecs.includes(spec)) {
            // This is the chosen specialization, add it with the specified level
            if (spec === specialization) {
              addSingleSkill(skillName, spec, skillLevel);
            } else {
              // Other specializations are added at level 0
              addSingleSkill(skillName, spec, 0);
            }
          }
        }
        alert(
          `All specializations for ${skillName} have been added to your character sheet.`
        );
        return;
      } else {
        // If all specializations already exist, just update the level of the chosen one
        updateExistingSkill(skillName, specialization, skillLevel);
        return;
      }
    }
  }

  // Standard skill addition for non-special skills
  addSingleSkill(skillName, specialization, skillLevel);

  // Clear inputs
  document.getElementById("skillSearch").value = "";
  document.getElementById("specializationField").value = "";
  document.getElementById("skillLevel").value = 0;
}

// Add education to education table
function addEducation() {
  const educationType = document.getElementById("educationType").value;
  const educationYears = document.getElementById("educationYears").value;
  const educationOutcome = document.getElementById("educationOutcome").value;
  const educationBenefits = document.getElementById("educationBenefits").value;

  if (!educationType) {
    alert("Please select a pre-career option");
    return;
  }

  // Check if we already have 3 pre-career options
  const existingOptions = document
    .getElementById("education-container")
    .querySelectorAll("tr");
  if (existingOptions.length >= 3) {
    alert("You can only select up to three pre-career options.");
    return;
  }

  const educationContainer = document.getElementById("education-container");
  const row = document.createElement("tr");
  row.innerHTML = `
                <td data-type="${educationType}">${educationType}</td>
                <td data-years="${educationYears}">${educationYears}</td>
                <td data-outcome="${educationOutcome}">${educationOutcome}</td>
                <td data-benefits="${educationBenefits}">${educationBenefits}</td>
                <td class="no-print">
                    <button class="btn btn-remove" onclick="this.closest('tr').remove(); updateEducationButtons(); updateTotalYears();">×</button>
                </td>
            `;

  educationContainer.appendChild(row);

  // Clear inputs
  document.getElementById("educationType").selectedIndex = 0;
  document.getElementById("educationYears").value = "4";
  document.getElementById("educationOutcome").selectedIndex = 0;
  document.getElementById("educationBenefits").value = "";

  // Update button state and age
  updateEducationButtons();
  updateTotalYears();
}

// Function to update the Add Education button state
function updateEducationButtons() {
  const existingOptions = document
    .getElementById("education-container")
    .querySelectorAll("tr");
  const addButton = document.getElementById("addEducationBtn");

  if (existingOptions.length >= 3) {
    addButton.disabled = true;
    addButton.classList.add("disabled");
  } else {
    addButton.disabled = false;
    addButton.classList.remove("disabled");
  }
}

// Update saveCharacter function to save the new fields
function saveCharacter() {
  const character = {
    // Basic info
    charName: document.getElementById("charName").value,
    species: document.getElementById("species").value,
    age: document.getElementById("age").value,

    // Get pre-career options details (updated from education)
    preCareerOptions: Array.from(
      document.getElementById("education-container").querySelectorAll("tr")
    )
      .map((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 4) return null;
        return {
          type: cells[0].getAttribute("data-type") || cells[0].textContent,
          years: cells[1].getAttribute("data-years") || cells[1].textContent,
          outcome:
            cells[2].getAttribute("data-outcome") || cells[2].textContent,
          benefits:
            cells[3].getAttribute("data-benefits") || cells[3].textContent,
        };
      })
      .filter((e) => e !== null),

    // Get career details with assignments and years
    careers: Array.from(
      document.getElementById("careers-container").querySelectorAll("tr")
    )
      .map((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 6) return null;
        return {
          career: cells[0].getAttribute("data-career") || cells[0].textContent,
          assignment:
            cells[1].getAttribute("data-assignment") || cells[1].textContent,
          promotions: cells[2].getAttribute("data-promotions") || cells[2].textContent,
          years: cells[3].getAttribute("data-years") || cells[3].textContent,
          rank: cells[4].getAttribute("data-rank") || cells[4].textContent,
          benefits:
            cells[5].getAttribute("data-benefits") || cells[5].textContent,
        };
      })
      .filter((c) => c !== null),

    // Characteristics - updated to store both current and baseline
    characteristics: {
      str: {
        current: document.getElementById("str-current").value,
        baseline: document.getElementById("str-baseline").value,
      },
      dex: {
        current: document.getElementById("dex-current").value,
        baseline: document.getElementById("dex-baseline").value,
      },
      end: {
        current: document.getElementById("end-current").value,
        baseline: document.getElementById("end-baseline").value,
      },
      int: {
        current: document.getElementById("int-current").value,
        baseline: document.getElementById("int-baseline").value,
      },
      edu: {
        current: document.getElementById("edu-current").value,
        baseline: document.getElementById("edu-baseline").value,
      },
      soc: {
        current: document.getElementById("soc-current").value,
        baseline: document.getElementById("soc-baseline").value,
      },

      // Additional characteristics
      psi: {
        current: document.getElementById("psi-current").value,
        baseline: document.getElementById("psi-baseline").value,
      },
      wlt: {
        current: document.getElementById("wlt-current").value,
        baseline: document.getElementById("wlt-baseline").value,
      },
      lck: {
        current: document.getElementById("lck-current").value,
        baseline: document.getElementById("lck-baseline").value,
      },
      mrl: {
        current: document.getElementById("mrl-current").value,
        baseline: document.getElementById("mrl-baseline").value,
      },
      sty: {
        current: document.getElementById("sty-current").value,
        baseline: document.getElementById("sty-baseline").value,
      },
      std: {
        current: document.getElementById("std-current").value,
        baseline: document.getElementById("std-baseline").value,
      },
      chr: {
        current: document.getElementById("chr-current").value,
        baseline: document.getElementById("chr-baseline").value,
      },
    },

    // Finances
    credits: document.getElementById("credits").value,
    pension: document.getElementById("pension").value,
    debt: document.getElementById("debt").value,
    cashOnHand: document.getElementById("cashOnHand").value,
    livingCosts: document.getElementById("livingCosts").value,
    shipPayments: document.getElementById("shipPayments").value,
    shipCosts: document.getElementById("shipCosts").value, // Add this line

    // Notes
    notes: document.getElementById("notes").value,

    // Skills
    skills: Array.from(document.querySelectorAll(".skill-item")).map((item) => {
      const skillElement = item.querySelector(".skill-name");
      return {
        name: skillElement.getAttribute("data-skill"),
        specialization: skillElement.getAttribute("data-specialization"),
        level: item.querySelector("input").value,
      };
    }),

    // Weapons
    weapons: Array.from(
      document.getElementById("weapons-container").querySelectorAll("tr")
    )
      .map((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 7) return null;
        return {
          name: cells[0].textContent,
          tl: cells[1].textContent,
          skill: cells[2].querySelector("input")
            ? cells[2].querySelector("input").value
            : "",
          damage: cells[3].textContent,
          range: cells[4].textContent,
          weight: cells[5].textContent,
          magazine: cells[6].textContent,
        };
      })
      .filter((w) => w !== null),

    // Armor
    armor: Array.from(
      document.getElementById("armor-container").querySelectorAll("tr")
    )
      .map((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 4) return null;
        return {
          name: cells[0].textContent,
          rating: cells[1].textContent,
          tl: cells[2].textContent,
          radiation: cells[3].textContent,
        };
      })
      .filter((a) => a !== null),

    // Equipment
    equipment: Array.from(
      document.getElementById("equipment-container").querySelectorAll("tr")
    )
      .map((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 4) return null;
        return {
          name: cells[0].textContent,
          tl: cells[1].textContent,
          mass: cells[2].textContent,
          cost: cells[3].textContent,
        };
      })
      .filter((e) => e !== null),

    // Skills in Training
    trainingSkills: Array.from(
      document.getElementById("training-skills-container").querySelectorAll("tr")
    )
      .map(row => {
        return {
          skill: row.querySelector('td[data-skill]').getAttribute('data-skill'),
          specialization: row.querySelector('td[data-specialization]').getAttribute('data-specialization'),
          weeksSpent: row.querySelector('td[data-weeks-spent]').getAttribute('data-weeks-spent'),
          weeksTotal: row.querySelector('td[data-weeks-total]').getAttribute('data-weeks-total')
        };
      })
  };

  try {
    localStorage.setItem("traveller-character", JSON.stringify(character));
    alert("Character saved successfully!");
  } catch (e) {
    console.error("Save failed:", e);
    alert("Failed to save character. Error: " + e.message);
  }
}

// Load character from localStorage - consolidated version
function loadCharacter() {
  try {
    const savedCharacter = localStorage.getItem("traveller-character");
    if (!savedCharacter) {
      alert("No saved character found.");
      return;
    }

    const character = JSON.parse(savedCharacter);

    // Basic info
    document.getElementById("charName").value = character.charName || "";
    document.getElementById("species").value = character.species || "Human";
    document.getElementById("age").value = character.age || "18";

    // Clear existing education entries
    document.getElementById("education-container").innerHTML = "";

    // Load pre-career options data if it exists
    if (character.preCareerOptions && character.preCareerOptions.length) {
      character.preCareerOptions.forEach((optionData) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                            <td data-type="${optionData.type}">${optionData.type}</td>
                            <td data-years="${optionData.years}">${optionData.years}</td>
                            <td data-outcome="${optionData.outcome}">${optionData.outcome}</td>
                            <td data-benefits="${optionData.benefits}">${optionData.benefits}</td>
                            <td class="no-print">
                                <button class="btn btn-remove" onclick="this.closest('tr').remove(); updateEducationButtons(); updateTotalYears();">×</button>
                            </td>
                        `;
        document.getElementById("education-container").appendChild(row);
      });
    }
    // Legacy support for old education format
    else if (character.education && character.education.length) {
      character.education.forEach((educationData) => {
        // Convert old format to new format
        const outcome = educationData.qualification || "Graduate";
        const benefits = educationData.skills || "";

        const row = document.createElement("tr");
        row.innerHTML = `
                            <td data-type="${educationData.type}">${educationData.type}</td>
                            <td data-years="${educationData.years}">${educationData.years}</td>
                            <td data-outcome="${outcome}">${outcome}</td>
                            <td data-benefits="${benefits}">${benefits}</td>
                            <td class="no-print">
                                <button class="btn btn-remove" onclick="this.closest('tr').remove(); updateEducationButtons(); updateTotalYears();">×</button>
                            </td>
                        `;
        document.getElementById("education-container").appendChild(row);
      });
    }

    // Update button state after loading
    updateEducationButtons();

    // Clear existing careers
    document.getElementById("careers-container").innerHTML = "";

    // Load careers if they exist
    if (character.careers && character.careers.length) {
      character.careers.forEach((careerData) => {
        const row = document.createElement("tr");
        
        // Support both new format (with years) and old format (terms only)
        const years = careerData.years || (careerData.terms * 4).toString();
        const promotions = careerData.promotions || careerData.terms || "0";
        
        row.innerHTML = `
          <td data-career="${careerData.career}">${careerData.career}</td>
          <td data-assignment="${careerData.assignment || ""}">${careerData.assignment || ""}</td>
          <td data-promotions="${promotions}">${promotions}</td>
          <td data-years="${years}">${years}</td>
          <td data-rank="${careerData.rank}">${careerData.rank}</td>
          <td data-benefits="${careerData.benefits}">${careerData.benefits}</td>
          <td class="no-print">
              <button class="btn btn-remove" onclick="this.closest('tr').remove(); updateTotalYears();">×</button>
          </td>
        `;
        document.getElementById("careers-container").appendChild(row);
      });

      updateTotalYears();
    }

    // Update to load characteristics with current and baseline values
    if (character.characteristics) {
      const chars = character.characteristics;

      // Load the main characteristics
      if (chars.str) {
        document.getElementById("str-current").value = chars.str.current || "7";
        document.getElementById("str-baseline").value =
          chars.str.baseline || "7";
      }
      if (chars.dex) {
        document.getElementById("dex-current").value = chars.dex.current || "7";
        document.getElementById("dex-baseline").value =
          chars.dex.baseline || "7";
      }
      if (chars.end) {
        document.getElementById("end-current").value = chars.end.current || "7";
        document.getElementById("end-baseline").value =
          chars.end.baseline || "7";
      }
      if (chars.int) {
        document.getElementById("int-current").value = chars.int.current || "7";
        document.getElementById("int-baseline").value =
          chars.int.baseline || "7";
      }
      if (chars.edu) {
        document.getElementById("edu-current").value = chars.edu.current || "7";
        document.getElementById("edu-baseline").value =
          chars.edu.baseline || "7";
      }
      if (chars.soc) {
        document.getElementById("soc-current").value = chars.soc.current || "7";
        document.getElementById("soc-baseline").value =
          chars.soc.baseline || "7";
      }

      // Load additional characteristics
      if (chars.psi) {
        document.getElementById("psi-current").value = chars.psi.current || "7";
        document.getElementById("psi-baseline").value =
          chars.psi.baseline || "7";
      }
      if (chars.wlt) {
        document.getElementById("wlt-current").value = chars.wlt.current || "7";
        document.getElementById("wlt-baseline").value =
          chars.wlt.baseline || "7";
      }
      if (chars.lck) {
        document.getElementById("lck-current").value = chars.lck.current || "7";
        document.getElementById("lck-baseline").value =
          chars.lck.baseline || "7";
      }
      if (chars.mrl) {
        document.getElementById("mrl-current").value = chars.mrl.current || "7";
        document.getElementById("mrl-baseline").value =
          chars.mrl.baseline || "7";
      }
      if (chars.sty) {
        document.getElementById("sty-current").value = chars.sty.current || "7";
        document.getElementById("sty-baseline").value =
          chars.sty.baseline || "7";
      }
      if (chars.std) {
        document.getElementById("std-current").value = chars.std.current || "7";
        document.getElementById("std-baseline").value =
          chars.std.baseline || "7";
      }
      if (chars.chr) {
        document.getElementById("chr-current").value = chars.chr.current || "7";
        document.getElementById("chr-baseline").value =
          chars.chr.baseline || "7";
      }

      // Update all DMs after setting characteristics
      updateDM("str");
      updateDM("dex");
      updateDM("end");
      updateDM("int");
      updateDM("edu");
      updateDM("soc");

      // Update DMs for additional characteristics
      updateDM("psi");
      updateDM("wlt");
      updateDM("lck");
      updateDM("mrl");
      updateDM("sty");
      updateDM("std");
      updateDM("chr");
    } else {
      // Legacy support for characters without dual values
      // ...load from old format if available...
    }

    // Finances
    document.getElementById("credits").value = character.credits || "0";
    document.getElementById("pension").value = character.pension || "0";
    document.getElementById("debt").value = character.debt || "0";
    document.getElementById("cashOnHand").value = character.cashOnHand || "0";
    document.getElementById("livingCosts").value = character.livingCosts || "0";
    document.getElementById("shipPayments").value =
      character.shipPayments || "0";
    document.getElementById("shipCosts").value = character.shipCosts || "0"; // Add this line

    // Notes
    document.getElementById("notes").value = character.notes || "";

    // Clear existing items
    document.getElementById("skills-container").innerHTML = "";
    document.getElementById("weapons-container").innerHTML = "";
    document.getElementById("armor-container").innerHTML = "";
    document.getElementById("equipment-container").innerHTML = "";

    // Skills with specialization support
    if (character.skills && character.skills.length) {
      character.skills.forEach((skill) => {
        const skillDiv = document.createElement("div");
        skillDiv.className = "skill-item";
        skillDiv.innerHTML = `
                            <span class="skill-name" data-skill="${
                              skill.name
                            }" data-specialization="${
          skill.specialization || ""
        }">
                                ${skill.name}${
          skill.specialization
            ? ` <span class="skill-specialization">(${skill.specialization})</span>`
            : ""
        }
                            </span>
                            <div class="d-flex align-items-center">
                                <input type="number" class="form-control form-control-sm mx-2" value="${
                                  skill.level
                                }" min="0" style="width: 60px;">
                                <button class="btn btn-remove no-print" onclick="this.parentElement.parentElement.remove()">×</button>
                            </div>
                        `;
        document.getElementById("skills-container").appendChild(skillDiv);
      });
    }

    // Weapons
    if (character.weapons && character.weapons.length) {
      character.weapons.forEach((weapon) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                            <td>${weapon.name}</td>
                            <td>${weapon.tl || "-"}</td>
                            <td><input type="text" class="form-control form-control-sm" value="${
                              weapon.skill || ""
                            }" placeholder="Skill"></td>
                            <td>${weapon.damage || "-"}</td>
                            <td>${weapon.range || "-"}</td>
                            <td>${weapon.weight || "-"}</td>
                            <td>${weapon.magazine || "-"}</td>
                            <td class="no-print">
                                <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
                            </td>
                        `;
        document.getElementById("weapons-container").appendChild(row);
      });
    }

    // Armor
    if (character.armor && character.armor.length) {
      character.armor.forEach((armor) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                            <td>${armor.name}</td>
                            <td>${armor.rating}</td>
                            <td>${armor.tl}</td>
                            <td>${armor.radiation}</td>
                            <td class="no-print">
                                <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
                        `;
        document.getElementById("armor-container").appendChild(row);
      });
    }

    // Equipment
    if (character.equipment && character.equipment.length) {
      character.equipment.forEach((equipment) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                            <td>${equipment.name}</td>
                            <td>${equipment.tl}</td>
                            <td>${equipment.mass}</td>
                            <td>${equipment.cost}</td>
                            <td class="no-print">
                                <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
                        `;
        document.getElementById("equipment-container").appendChild(row);
      });
    }

    // Load training skills if they exist
    if (character.trainingSkills && character.trainingSkills.length) {
      document.getElementById("training-skills-container").innerHTML = ""; // Clear existing
      
      character.trainingSkills.forEach(skill => {
        // Handle both legacy format and new format
        const weeksSpent = skill.weeksSpent || skill.weeksComplete || "1";
        const weeksTotal = skill.weeksTotal || "8"; // Default to 8 weeks if not specified in older saves
        
        const row = document.createElement("tr");
        row.innerHTML = `
          <td data-skill="${skill.skill}">${skill.skill}</td>
          <td data-specialization="${skill.specialization}">${skill.specialization || "-"}</td>
          <td data-weeks-spent="${weeksSpent}">${weeksSpent}</td>
          <td data-weeks-total="${weeksTotal}">${weeksTotal}</td>
          <td class="no-print">
            <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
            <button class="btn btn-secondary btn-sm ml-2" onclick="completeTraining(this)">Complete</button>
          </td>
        `;
        document.getElementById("training-skills-container").appendChild(row);
      });
    }

    alert("Character loaded successfully!");
  } catch (e) {
    console.error("Load failed:", e);
    alert("Failed to load character. Error: " + e.message);
  }
}

// Reset character sheet
function resetCharacter() {
  if (
    confirm(
      "Are you sure you want to reset the character sheet? All data will be lost."
    )
  ) {
    // Basic info
    document.getElementById("charName").value = "";
    document.getElementById("species").value = "Human";
    document.getElementById("age").value = "18";

    // Reset both current and baseline for all characteristics
    document.getElementById("str-current").value = "7";
    document.getElementById("str-baseline").value = "7";
    document.getElementById("dex-current").value = "7";
    document.getElementById("dex-baseline").value = "7";
    document.getElementById("end-current").value = "7";
    document.getElementById("end-baseline").value = "7";
    document.getElementById("int-current").value = "7";
    document.getElementById("int-baseline").value = "7";
    document.getElementById("edu-current").value = "7";
    document.getElementById("edu-baseline").value = "7";
    document.getElementById("soc-current").value = "7";
    document.getElementById("soc-baseline").value = "7";

    // Additional Characteristics
    document.getElementById("psi-current").value = "7";
    document.getElementById("psi-baseline").value = "7";
    document.getElementById("wlt-current").value = "7";
    document.getElementById("wlt-baseline").value = "7";
    document.getElementById("lck-current").value = "7";
    document.getElementById("lck-baseline").value = "7";
    document.getElementById("mrl-current").value = "7";
    document.getElementById("mrl-baseline").value = "7";
    document.getElementById("sty-current").value = "7";
    document.getElementById("sty-baseline").value = "7";
    document.getElementById("std-current").value = "7";
    document.getElementById("std-baseline").value = "7";
    document.getElementById("chr-current").value = "7";
    document.getElementById("chr-baseline").value = "7";

    // Update DMs
    updateDM("str");
    updateDM("dex");
    updateDM("end");
    updateDM("int");
    updateDM("edu");
    updateDM("soc");

    // Update DMs for additional characteristics
    updateDM("psi");
    updateDM("wlt");
    updateDM("lck");
    updateDM("mrl");
    updateDM("sty");
    updateDM("std");
    updateDM("chr");

    // Finances
    document.getElementById("credits").value = "0";
    document.getElementById("pension").value = "0";
    document.getElementById("debt").value = "0";
    document.getElementById("cashOnHand").value = "0";
    document.getElementById("livingCosts").value = "0";
    document.getElementById("shipPayments").value = "0";
    document.getElementById("shipCosts").value = "0"; // Add this line

    // Notes
    document.getElementById("notes").value = "";

    // Clear containers
    document.getElementById("skills-container").innerHTML = "";
    document.getElementById("weapons-container").innerHTML = "";
    document.getElementById("armor-container").innerHTML = "";
    document.getElementById("equipment-container").innerHTML = "";

    alert("Character sheet has been reset.");
  }
}

// Add shortcut for adding typical human characteristics
function setHumanCharacteristics() {
  document.getElementById("str-current").value = "7";
  document.getElementById("str-baseline").value = "7";
  document.getElementById("dex-current").value = "7";
  document.getElementById("dex-baseline").value = "7";
  document.getElementById("end-current").value = "7";
  document.getElementById("end-baseline").value = "7";
  document.getElementById("int-current").value = "7";
  document.getElementById("int-baseline").value = "7";
  document.getElementById("edu-current").value = "7";
  document.getElementById("edu-baseline").value = "7";
  document.getElementById("soc-current").value = "7";
  document.getElementById("soc-baseline").value = "7";

  updateDM("str");
  updateDM("dex");
  updateDM("end");
  updateDM("int");
  updateDM("edu");
  updateDM("soc");
}

// Export character to JSON file
function exportCharacter() {
  const characterData = localStorage.getItem("traveller-character");
  if (!characterData) {
    alert("No character data to export. Please save your character first.");
    return;
  }

  const character = JSON.parse(characterData);
  const characterName = character.charName || "traveller-character";
  const filename = `${characterName.replace(/\s+/g, "-")}.json`;

  const blob = new Blob([characterData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import character from JSON file
function importCharacter() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const characterData = e.target.result;
        localStorage.setItem("traveller-character", characterData);
        loadCharacter();
      } catch (error) {
        console.error("Import failed:", error);
        alert("Failed to import character. The file might be corrupted.");
      }
    };
    reader.readAsText(file);
  };

  input.click();
}

// Add career to the careers table - updated with years field
function addCareer() {
  const careerName = document.getElementById("careerName").value;
  const careerAssignment = document.getElementById("careerAssignment").value;
  const careerPromotions = document.getElementById("careerPromotions").value || 0;
  const careerYears = document.getElementById("careerYears").value || 4;
  const careerRank = document.getElementById("careerRank").value;
  const careerBenefits = document.getElementById("careerBenefits").value;

  if (!careerName) {
    alert("Please select a career");
    return;
  }

  const careersContainer = document.getElementById("careers-container");
  const row = document.createElement("tr");
  row.innerHTML = `
                <td data-career="${careerName}">${careerName}</td>
                <td data-assignment="${careerAssignment}">${careerAssignment}</td>
                <td data-promotions="${careerPromotions}">${careerPromotions}</td>
                <td data-years="${careerYears}">${careerYears}</td>
                <td data-rank="${careerRank}">${careerRank}</td>
                <td data-benefits="${careerBenefits}">${careerBenefits}</td>
                <td class="no-print">
                    <button class="btn btn-remove" onclick="this.closest('tr').remove(); updateTotalYears();">×</button>
                </td>
            `;

  careersContainer.appendChild(row);

  // Clear inputs
  document.getElementById("careerName").selectedIndex = 0;
  document.getElementById("careerAssignment").innerHTML =
    '<option value="">Select Assignment...</option>';
  document.getElementById("careerPromotions").value = "0";
  document.getElementById("careerYears").value = "4";
  document.getElementById("careerRank").value = "";
  document.getElementById("careerBenefits").value = "";

  // Update total terms and age
  updateTotalYears();
}

// Consolidate the DOM ready handler for better organization
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing character sheet...");
  
  try {
    // Initialize all character sheet components
    initializeCharacterSheet();
    
    // Directly initialize all dropdowns to ensure they work
    initializeDropdowns();
    
    // Update education buttons initial state
    updateEducationButtons();
    
    // Initialize wealth display
    if (typeof updateWealthDisplay === "function") {
      updateWealthDisplay();
    }
    
    // Connect skill search fields to update specializations
    const skillSearch = document.getElementById("skillSearch");
    if (skillSearch) {
      skillSearch.addEventListener("input", function() {
        updateSpecializationOptions("skillSearch", "specialization-list");
      });
      console.log("Added input handler to skillSearch field");
    }
    
    // Connect training skill field if it exists
    const trainingSkillName = document.getElementById("trainingSkillName");
    if (trainingSkillName) {
      trainingSkillName.setAttribute("list", "skill-list");
      trainingSkillName.addEventListener("input", function() {
        updateSpecializationOptions("trainingSkillName", "specialization-list");
      });
    }
    
    // Connect promotions input to rank suggestions
    const careerPromotionsElement = document.getElementById("careerPromotions");
    if (careerPromotionsElement) {
      careerPromotionsElement.addEventListener("input", suggestRank);
    }
  } catch (e) {
    console.error("Error in initialization:", e);
  }
});

// Create a comprehensive initialization function
function initializeCharacterSheet() {
  console.log("Initializing character sheet...");

  // Initialize characteristics
  updateDM("str");
  updateDM("dex");
  updateDM("end");
  updateDM("int");
  updateDM("edu");
  updateDM("soc");

  // Initialize additional characteristics
  updateDM("psi");
  updateDM("wlt");
  updateDM("lck");
  updateDM("mrl");
  updateDM("sty");
  updateDM("std");
  updateDM("chr");

  // Create the skills datalist for autocomplete
  const skillSearch = document.getElementById("skillSearch");

  // First check if datalist already exists and remove if so
  const existingDatalist = document.getElementById("skill-list");
  if (existingDatalist) {
    existingDatalist.remove();
  }

  // Create fresh datalist
  const datalist = document.createElement("datalist");
  datalist.id = "skill-list";

  // Sort the skills alphabetically
  const sortedSkills = [...commonSkills].sort();

  sortedSkills.forEach((skill) => {
    const option = document.createElement("option");
    option.value = skill;
    datalist.appendChild(option);
  });

  document.body.appendChild(datalist);

  // Make sure the input element has the list attribute
  if (skillSearch) {
    skillSearch.setAttribute("list", "skill-list");
    console.log("Skills datalist connected to input");
  } else {
    console.error("Could not find skillSearch element");
  }

  // Add autocomplete handling for specializations
  const specializationField = document.getElementById("specializationField");

  // First check if specialization datalist already exists
  const existingSpecList = document.getElementById("specialization-list");
  if (existingSpecList) {
    existingSpecList.remove();
  }

  // Create fresh specialization datalist
  const specList = document.createElement("datalist");
  specList.id = "specialization-list";
  document.body.appendChild(specList);

  if (specializationField) {
    specializationField.setAttribute("list", "specialization-list");
    // Update specialization options when skill changes
    skillSearch.addEventListener("input", updateSpecializationOptions);
    console.log("Specialization datalist connected");
  } else {
    console.error("Could not find specializationField element");
  }

  // Populate career dropdown
  const careerSelect = document.getElementById("careerName");
  if (careerSelect) {
    // Clear existing options except the first one
    while (careerSelect.options.length > 1) {
      careerSelect.remove(1);
    }

    // Sort the careers alphabetically
    const sortedCareers = [...mgt2Careers].sort();

    // Add core rulebook careers
    sortedCareers.forEach((career) => {
      // Look for matching career in careerData (with or without numeric suffix)
      const careerKeys = Object.keys(careerData);
      const matchingCareer =
        careerKeys.find(
          (key) => key.startsWith(career + " (") || key === career
        ) || career;

      const option = document.createElement("option");
      // Use the exact key from careerData to maintain consistency
      option.value = matchingCareer;
      // Display the clean career name without the number
      option.textContent = matchingCareer.replace(/\s*\(\d+\)$/, "");
      careerSelect.appendChild(option);
    });

    // Make sure the event handler is properly attached
    careerSelect.addEventListener("change", updateAssignments);
  }

  // ...rest of initialization code...

  // Initialize pre-career options button state
  updateEducationButtons();
  updateWealthDisplay();
}

// Set up event listener to initialize the sheet when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  initializeCharacterSheet();
});

// Function to add a weapon to the weapons table - update this function
function addWeapon() {
  const weaponName = document.getElementById("weaponName").value;
  const weaponTL = document.getElementById("weaponTL").value;
  const weaponDamage = document.getElementById("weaponDamage").value;
  const weaponRange = document.getElementById("weaponRange").value;
  const weaponWeight = document.getElementById("weaponWeight").value;
  const weaponMagazine = document.getElementById("weaponMagazine").value;

  if (!weaponName) {
    alert("Please enter a weapon name");
    return;
  }

  const weaponsContainer = document.getElementById("weapons-container");
  const row = document.createElement("tr");
  row.innerHTML = `
                <td>${weaponName}</td>
                <td>${weaponTL || "-"}</td>
                <td><input type="text" class="form-control form-control-sm" placeholder="Skill"></td>
                <td>${weaponDamage || "-"}</td>
                <td>${weaponRange || "-"}</td>
                <td>${weaponWeight || "-"}</td>
                <td>${weaponMagazine || "-"}</td>
                <td class="no-print">
                    <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
                </td>
            `;

  weaponsContainer.appendChild(row);

  // Clear inputs
  document.getElementById("weaponName").value = "";
  document.getElementById("weaponTL").value = "";
  document.getElementById("weaponDamage").value = "";
  document.getElementById("weaponRange").value = "";
  document.getElementById("weaponWeight").value = "";
  document.getElementById("weaponMagazine").value = "";
}

// Function to add armor to the armor table
function addArmor() {
  const armorName = document.getElementById("armorName").value;
  const armorRating = document.getElementById("armorRating").value;
  const armorTL = document.getElementById("armorTL").value;
  const armorRadiation = document.getElementById("armorRadiation").value;

  if (!armorName) {
    alert("Please enter armor name");
    return;
  }

  const armorContainer = document.getElementById("armor-container");
  const row = document.createElement("tr");
  row.innerHTML = `
                <td>${armorName}</td>
                <td>${armorRating || "0"}</td>
                <td>${armorTL || "-"}</td>
                <td>${armorRadiation || "-"}</td>
                <td class="no-print">
                    <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
                </td>
            `;

  armorContainer.appendChild(row);

  // Clear inputs
  document.getElementById("armorName").value = "";
  document.getElementById("armorRating").value = "";
  document.getElementById("armorTL").value = "";
  document.getElementById("armorRadiation").value = "";
}

// Function to add equipment to the equipment table
function addEquipment() {
  const equipmentName = document.getElementById("equipmentName").value;
  const equipmentTL = document.getElementById("equipmentTL").value;
  const equipmentMass = document.getElementById("equipmentMass").value;
  const equipmentCost = document.getElementById("equipmentCost").value;

  if (!equipmentName) {
    alert("Please enter equipment name");
    return;
  }

  const equipmentContainer = document.getElementById("equipment-container");
  const row = document.createElement("tr");
  row.innerHTML = `
                <td>${equipmentName}</td>
                <td>${equipmentTL || "-"}</td>
                <td>${equipmentMass || "0"}</td>
                <td>${equipmentCost || "0"}</td>
                <td class="no-print">
                    <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
                </td>
            `;

  equipmentContainer.appendChild(row);

  // Clear inputs
  document.getElementById("equipmentName").value = "";
  document.getElementById("equipmentTL").value = "";
  document.getElementById("equipmentMass").value = "";
  document.getElementById("equipmentCost").value = "";
}

// Functions for dice rolling
function rollDice(number, sides) {
  let total = 0;
  let rolls = [];

  for (let i = 0; i < number; i++) {
    const roll = Math.floor(Math.random() * sides) + 1;
    rolls.push(roll);
    total += roll;
  }

  const resultDiv = document.getElementById("roll-result");
  resultDiv.innerHTML = `${number}D${sides}: ${total} (${rolls.join(", ")})`;
  return total;
}

function rollTask(target) {
  const roll = rollDice(2, 6);
  const resultDiv = document.getElementById("roll-result");

  if (roll >= target) {
    resultDiv.innerHTML += `<br><strong>SUCCESS!</strong> (Target: ${target}+)`;
  } else {
    resultDiv.innerHTML += `<br><strong>FAILURE.</strong> (Target: ${target}+)`;
  }
}

// Function to delete the saved character
function deleteCharacter() {
  if (
    confirm(
      "Are you sure you want to delete the saved character? This cannot be undone."
    )
  ) {
    try {
      localStorage.removeItem("traveller-character");
      alert("Character has been deleted.");
      // Optionally reset the form
      resetCharacter();
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Failed to delete character. Error: " + e.message);
    }
  }
}

// Function to sort select options alphabetically
function sortSelectOptions(selectElement) {
  // Get the options as an array
  const options = Array.from(selectElement.options);

  // Skip the first option (usually the default/prompt option)
  const firstOption = options.shift();

  // Sort the remaining options
  options.sort((a, b) => a.text.localeCompare(b.text));

  // Clear the select
  selectElement.innerHTML = "";

  // Add the first option back
  if (firstOption) {
    selectElement.add(firstOption);
  }

  // Add the sorted options
  options.forEach((option) => selectElement.add(option));
}

// Add this to initialization to ensure the pre-career options are sorted
document.addEventListener("DOMContentLoaded", function () {
  // Sort the education type dropdown options
  const educationTypeSelect = document.getElementById("educationType");
  if (educationTypeSelect) {
    sortSelectOptions(educationTypeSelect);
  }
});

// Add this function to directly initialize the dropdown elements without relying on dynamic creation
function initializeDropdowns() {
  console.log("Initializing all dropdowns...");
  
  // Initialize skills dropdown first
  initializeSkillsDropdownDirect();
  
  // Initialize specializations
  initializeSpecializationsDropdownDirect();
  
  // Initialize career dropdown
  initializeCareerDropdownDirect();
  
  console.log("All dropdowns initialized");
}

// Direct initialization of skills dropdown that doesn't rely on dynamic creation
function initializeSkillsDropdownDirect() {
  console.log("Directly initializing skills dropdown...");
  
  const skillSearch = document.getElementById("skillSearch");
  if (!skillSearch) {
    console.error("Could not find skillSearch input element");
    return;
  }
  
  // Create datalist element
  let skillList = document.getElementById("skill-list");
  if (!skillList) {
    skillList = document.createElement("datalist");
    skillList.id = "skill-list";
    document.body.appendChild(skillList);
  } else {
    // Clear existing options
    skillList.innerHTML = "";
  }
  
  // Add options to datalist
  commonSkills.sort().forEach(skill => {
    const option = document.createElement("option");
    option.value = skill;
    skillList.appendChild(option);
  });
  
  // Connect input to datalist
  skillSearch.setAttribute("list", "skill-list");
  console.log(`Skills dropdown initialized with ${commonSkills.length} options`);
}

// Direct initialization of specializations dropdown - Fix the erroneous trainingSkillSearch reference
function initializeSpecializationsDropdownDirect() {
  console.log("Directly initializing specialization dropdown...");
  
  // Connect the main skill specialization fields
  const specField = document.getElementById("specializationField");
  if (!specField) {
    console.error("Could not find specializationField input element");
    return;
  }
  
  // Create datalist element
  let specList = document.getElementById("specialization-list");
  if (!specList) {
    specList = document.createElement("datalist");
    specList.id = "specialization-list";
    document.body.appendChild(specList);
  } else {
    // Clear existing options
    specList.innerHTML = "";
  }
  
  // Connect input to datalist
  specField.setAttribute("list", "specialization-list");
  
  // Add event listener for skill selection to update specializations
  const skillSearch = document.getElementById("skillSearch");
  if (skillSearch) {
    // Remove any existing listeners to prevent duplicates
    skillSearch.removeEventListener("input", updateSpecializationOptions);
    
    // Add proper event listener that updates the correct datalist
    skillSearch.addEventListener("input", function() {
      updateSpecializationOptions("skillSearch", "specialization-list");
    });
    
    console.log("Main skill search connected to specialization datalist");
  }
  
  // Also connect the training skill fields if they exist
  const trainingSkillName = document.getElementById("trainingSkillName");
  const trainingSpecialization = document.getElementById("trainingSpecialization");
  
  if (trainingSkillName && trainingSpecialization) {
    // Connect training skill to the same skill list
    trainingSkillName.setAttribute("list", "skill-list");
    
    // Connect training specialization to the specialization list
    trainingSpecialization.setAttribute("list", "specialization-list");
    
    // Add event listener for training skill selection
    trainingSkillName.addEventListener("input", function() {
      updateSpecializationOptions("trainingSkillName", "specialization-list");
    });
    
    console.log("Training skill fields connected to datalists");
  }
}

// Direct initialization of career dropdown
function initializeCareerDropdownDirect() {
  console.log("Directly initializing career dropdown...");
  
  const careerSelect = document.getElementById("careerName");
  if (!careerSelect) {
    console.error("Could not find careerName select element");
    return;
  }
  
  // Clear existing options except first one
  while (careerSelect.options.length > 1) {
    careerSelect.remove(1);
  }
  
  // Add career options in alphabetical order
  mgt2Careers.sort().forEach(career => {
    const option = document.createElement("option");
    option.value = career;
    option.textContent = career;
    careerSelect.appendChild(option);
  });
  
  // Add event listener for career selection
  careerSelect.removeEventListener("change", updateAssignments);
  careerSelect.addEventListener("change", updateAssignments);
  console.log(`Career dropdown initialized with ${mgt2Careers.length} options`);
}

// Improved updateSpecializationOptions function to handle different source inputs and datalists
function updateSpecializationOptions(sourceId = "skillSearch", datalistId = "specialization-list") {
  // Get the skill name from the appropriate input field based on sourceId
  const skillInput = document.getElementById(sourceId);
  if (!skillInput) {
    console.error(`Input element with ID '${sourceId}' not found`);
    return;
  }
  
  const skillName = skillInput.value;
  if (!skillName) return;
  
  const specList = document.getElementById(datalistId);
  if (!specList) {
    console.error(`Specialization datalist with ID '${datalistId}' not found`);
    return;
  }
  
  // Clear existing options
  specList.innerHTML = "";
  
  // Add specializations if they exist for this skill
  if (skillSpecializations[skillName]?.length > 0) {
    const sortedSpecs = [...skillSpecializations[skillName]].sort();
    console.log(`Adding ${sortedSpecs.length} specializations for ${skillName} (source: ${sourceId})`);
    
    sortedSpecs.forEach(spec => {
      const option = document.createElement("option");
      option.value = spec;
      specList.appendChild(option);
    });
  }
}

// Make sure both skill inputs are properly connected during initialization
document.addEventListener("DOMContentLoaded", function() {
  // ...existing code...
  
  // Connect the training skill inputs to the same skill and specialization lists
  const trainingSkillName = document.getElementById("trainingSkillName");
  const trainingSpecialization = document.getElementById("trainingSpecialization");
  
  if (trainingSkillName) {
    trainingSkillName.setAttribute("list", "skill-list");
    
    // Add proper event handler for training skill name
    trainingSkillName.addEventListener("input", function() {
      updateSpecializationOptions("trainingSkillName", "specialization-list");
    });
    
    console.log("Training skill name connected to skill list");
  }
  
  if (trainingSpecialization) {
    trainingSpecialization.setAttribute("list", "specialization-list");
    console.log("Training specialization connected to specialization list");
  }
});

// Remove this function as it's now obsolete and causing errors
// function updateTrainingSpecializationOptions() {
//   updateSpecializationOptions("trainingSkillSearch", "training-specialization-list");
// }

// Fix the consolidated DOM ready handler to remove errors
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing character sheet...");
  
  try {
    // Initialize all character sheet components
    initializeCharacterSheet();
    
    // Directly initialize all dropdowns to ensure they work
    initializeDropdowns();
    
    // Update education buttons initial state
    updateEducationButtons();
    
    // Initialize wealth display
    if (typeof updateWealthDisplay === "function") {
      updateWealthDisplay();
    }
    
    // Connect skill search fields to update specializations - fixed
    const skillSearch = document.getElementById("skillSearch");
    if (skillSearch) {
      skillSearch.addEventListener("input", function() {
        updateSpecializationOptions("skillSearch", "specialization-list");
      });
    }
    
    // Connect training skill field - fixed
    const trainingSkillName = document.getElementById("trainingSkillName");
    if (trainingSkillName) {
      trainingSkillName.addEventListener("input", function() {
        updateSpecializationOptions("trainingSkillName", "specialization-list");
      });
    }
    
    // Connect promotions input to rank suggestions
    const careerPromotionsElement = document.getElementById("careerPromotions");
    if (careerPromotionsElement) {
      careerPromotionsElement.addEventListener("input", suggestRank);
    }
  } catch (e) {
    console.error("Error in initialization:", e);
  }
});

// Add function to create a new skill in training - simplified version without weeks complete
function addTrainingSkill() {
  const skillName = document.getElementById("trainingSkillName").value;
  const specialization = document.getElementById("trainingSpecialization").value;
  const weeksSpent = document.getElementById("trainingWeeksSpent").value || 1;
  const weeksTotal = document.getElementById("trainingWeeksTotal").value || 8;

  if (!skillName) {
    alert("Please enter a skill name for training");
    return;
  }

  const trainingContainer = document.getElementById("training-skills-container");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td data-skill="${skillName}">${skillName}</td>
    <td data-specialization="${specialization}">${specialization || "-"}</td>
    <td data-weeks-spent="${weeksSpent}">${weeksSpent}</td>
    <td data-weeks-total="${weeksTotal}">${weeksTotal}</td>
    <td class="no-print">
      <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
      <button class="btn btn-secondary btn-sm ml-2" onclick="completeTraining(this)">Complete</button>
    </td>
  `;

  trainingContainer.appendChild(row);

  // Clear inputs
  document.getElementById("trainingSkillName").value = "";
  document.getElementById("trainingSpecialization").value = "";
  document.getElementById("trainingWeeksSpent").value = "1";
  document.getElementById("trainingWeeksTotal").value = "8";
}

// Updated function to mark a skill training as complete
function completeTraining(button) {
  const row = button.closest('tr');
  
  // Get skill details from the row
  const skillName = row.querySelector('td[data-skill]').getAttribute('data-skill');
  const specialization = row.querySelector('td[data-specialization]').getAttribute('data-specialization');
  const weeksSpent = parseInt(row.querySelector('td[data-weeks-spent]').getAttribute('data-weeks-spent'));
  const weeksTotal = parseInt(row.querySelector('td[data-weeks-total]').getAttribute('data-weeks-total'));
  
  // Check if enough training time has been spent
  if (weeksSpent < weeksTotal) {
    alert(`Training not yet complete. You've spent ${weeksSpent} of ${weeksTotal} required weeks.`);
    return;
  }
  
  // Add the skill to the regular skills
  addSingleSkill(skillName, specialization !== "-" ? specialization : "", 1);
  
  // Remove the training row
  row.remove();
  
  alert(`Training complete! ${skillName}${specialization !== "-" ? ` (${specialization})` : ""} has been added to your skills.`);
}

// Update the save character function to include the weeks total field
function saveCharacter() {
  const character = {
    // Basic info
    charName: document.getElementById("charName").value,
    species: document.getElementById("species").value,
    age: document.getElementById("age").value,

    // Get pre-career options details (updated from education)
    preCareerOptions: Array.from(
      document.getElementById("education-container").querySelectorAll("tr")
    )
      .map((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 4) return null;
        return {
          type: cells[0].getAttribute("data-type") || cells[0].textContent,
          years: cells[1].getAttribute("data-years") || cells[1].textContent,
          outcome:
            cells[2].getAttribute("data-outcome") || cells[2].textContent,
          benefits:
            cells[3].getAttribute("data-benefits") || cells[3].textContent,
        };
      })
      .filter((e) => e !== null),

    // Get career details with assignments and years
    careers: Array.from(
      document.getElementById("careers-container").querySelectorAll("tr")
    )
      .map((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 6) return null;
        return {
          career: cells[0].getAttribute("data-career") || cells[0].textContent,
          assignment:
            cells[1].getAttribute("data-assignment") || cells[1].textContent,
          promotions: cells[2].getAttribute("data-promotions") || cells[2].textContent,
          years: cells[3].getAttribute("data-years") || cells[3].textContent,
          rank: cells[4].getAttribute("data-rank") || cells[4].textContent,
          benefits:
            cells[5].getAttribute("data-benefits") || cells[5].textContent,
        };
      })
      .filter((c) => c !== null),

    // Characteristics - updated to store both current and baseline
    characteristics: {
      str: {
        current: document.getElementById("str-current").value,
        baseline: document.getElementById("str-baseline").value,
      },
      dex: {
        current: document.getElementById("dex-current").value,
        baseline: document.getElementById("dex-baseline").value,
      },
      end: {
        current: document.getElementById("end-current").value,
        baseline: document.getElementById("end-baseline").value,
      },
      int: {
        current: document.getElementById("int-current").value,
        baseline: document.getElementById("int-baseline").value,
      },
      edu: {
        current: document.getElementById("edu-current").value,
        baseline: document.getElementById("edu-baseline").value,
      },
      soc: {
        current: document.getElementById("soc-current").value,
        baseline: document.getElementById("soc-baseline").value,
      },

      // Additional characteristics
      psi: {
        current: document.getElementById("psi-current").value,
        baseline: document.getElementById("psi-baseline").value,
      },
      wlt: {
        current: document.getElementById("wlt-current").value,
        baseline: document.getElementById("wlt-baseline").value,
      },
      lck: {
        current: document.getElementById("lck-current").value,
        baseline: document.getElementById("lck-baseline").value,
      },
      mrl: {
        current: document.getElementById("mrl-current").value,
        baseline: document.getElementById("mrl-baseline").value,
      },
      sty: {
        current: document.getElementById("sty-current").value,
        baseline: document.getElementById("sty-baseline").value,
      },
      std: {
        current: document.getElementById("std-current").value,
        baseline: document.getElementById("std-baseline").value,
      },
      chr: {
        current: document.getElementById("chr-current").value,
        baseline: document.getElementById("chr-baseline").value,
      },
    },

    // Finances
    credits: document.getElementById("credits").value,
    pension: document.getElementById("pension").value,
    debt: document.getElementById("debt").value,
    cashOnHand: document.getElementById("cashOnHand").value,
    livingCosts: document.getElementById("livingCosts").value,
    shipPayments: document.getElementById("shipPayments").value,
    shipCosts: document.getElementById("shipCosts").value, // Add this line

    // Notes
    notes: document.getElementById("notes").value,

    // Skills
    skills: Array.from(document.querySelectorAll(".skill-item")).map((item) => {
      const skillElement = item.querySelector(".skill-name");
      return {
        name: skillElement.getAttribute("data-skill"),
        specialization: skillElement.getAttribute("data-specialization"),
        level: item.querySelector("input").value,
      };
    }),

    // Weapons
    weapons: Array.from(
      document.getElementById("weapons-container").querySelectorAll("tr")
    )
      .map((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 7) return null;
        return {
          name: cells[0].textContent,
          tl: cells[1].textContent,
          skill: cells[2].querySelector("input")
            ? cells[2].querySelector("input").value
            : "",
          damage: cells[3].textContent,
          range: cells[4].textContent,
          weight: cells[5].textContent,
          magazine: cells[6].textContent,
        };
      })
      .filter((w) => w !== null),

    // Armor
    armor: Array.from(
      document.getElementById("armor-container").querySelectorAll("tr")
    )
      .map((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 4) return null;
        return {
          name: cells[0].textContent,
          rating: cells[1].textContent,
          tl: cells[2].textContent,
          radiation: cells[3].textContent,
        };
      })
      .filter((a) => a !== null),

    // Equipment
    equipment: Array.from(
      document.getElementById("equipment-container").querySelectorAll("tr")
    )
      .map((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 4) return null;
        return {
          name: cells[0].textContent,
          tl: cells[1].textContent,
          mass: cells[2].textContent,
          cost: cells[3].textContent,
        };
      })
      .filter((e) => e !== null),

    // Skills in Training
    trainingSkills: Array.from(
      document.getElementById("training-skills-container").querySelectorAll("tr")
    )
      .map(row => {
        return {
          skill: row.querySelector('td[data-skill]').getAttribute('data-skill'),
          specialization: row.querySelector('td[data-specialization]').getAttribute('data-specialization'),
          weeksSpent: row.querySelector('td[data-weeks-spent]').getAttribute('data-weeks-spent'),
          weeksTotal: row.querySelector('td[data-weeks-total]').getAttribute('data-weeks-total')
        };
      })
  };

  try {
    localStorage.setItem("traveller-character", JSON.stringify(character));
    alert("Character saved successfully!");
  } catch (e) {
    console.error("Save failed:", e);
    alert("Failed to save character. Error: " + e.message);
  }
}

// Update the load character function to load the weeks total field
function loadCharacter() {
  try {
    const savedCharacter = localStorage.getItem("traveller-character");
    if (!savedCharacter) {
      alert("No saved character found.");
      return;
    }

    const character = JSON.parse(savedCharacter);

    // Basic info
    document.getElementById("charName").value = character.charName || "";
    document.getElementById("species").value = character.species || "Human";
    document.getElementById("age").value = character.age || "18";

    // Clear existing education entries
    document.getElementById("education-container").innerHTML = "";

    // Load pre-career options data if it exists
    if (character.preCareerOptions && character.preCareerOptions.length) {
      character.preCareerOptions.forEach((optionData) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                            <td data-type="${optionData.type}">${optionData.type}</td>
                            <td data-years="${optionData.years}">${optionData.years}</td>
                            <td data-outcome="${optionData.outcome}">${optionData.outcome}</td>
                            <td data-benefits="${optionData.benefits}">${optionData.benefits}</td>
                            <td class="no-print">
                                <button class="btn btn-remove" onclick="this.closest('tr').remove(); updateEducationButtons(); updateTotalYears();">×</button>
                            </td>
                        `;
        document.getElementById("education-container").appendChild(row);
      });
    }
    // Legacy support for old education format
    else if (character.education && character.education.length) {
      character.education.forEach((educationData) => {
        // Convert old format to new format
        const outcome = educationData.qualification || "Graduate";
        const benefits = educationData.skills || "";

        const row = document.createElement("tr");
        row.innerHTML = `
                            <td data-type="${educationData.type}">${educationData.type}</td>
                            <td data-years="${educationData.years}">${educationData.years}</td>
                            <td data-outcome="${outcome}">${outcome}</td>
                            <td data-benefits="${benefits}">${benefits}</td>
                            <td class="no-print">
                                <button class="btn btn-remove" onclick="this.closest('tr').remove(); updateEducationButtons(); updateTotalYears();">×</button>
                            </td>
                        `;
        document.getElementById("education-container").appendChild(row);
      });
    }

    // Update button state after loading
    updateEducationButtons();

    // Clear existing careers
    document.getElementById("careers-container").innerHTML = "";

    // Load careers if they exist
    if (character.careers && character.careers.length) {
      character.careers.forEach((careerData) => {
        const row = document.createElement("tr");
        
        // Support both new format (with years) and old format (terms only)
        const years = careerData.years || (careerData.terms * 4).toString();
        const promotions = careerData.promotions || careerData.terms || "0";
        
        row.innerHTML = `
          <td data-career="${careerData.career}">${careerData.career}</td>
          <td data-assignment="${careerData.assignment || ""}">${careerData.assignment || ""}</td>
          <td data-promotions="${promotions}">${promotions}</td>
          <td data-years="${years}">${years}</td>
          <td data-rank="${careerData.rank}">${careerData.rank}</td>
          <td data-benefits="${careerData.benefits}">${careerData.benefits}</td>
          <td class="no-print">
              <button class="btn btn-remove" onclick="this.closest('tr').remove(); updateTotalYears();">×</button>
          </td>
        `;
        document.getElementById("careers-container").appendChild(row);
      });

      updateTotalYears();
    }

    // Update to load characteristics with current and baseline values
    if (character.characteristics) {
      const chars = character.characteristics;

      // Load the main characteristics
      if (chars.str) {
        document.getElementById("str-current").value = chars.str.current || "7";
        document.getElementById("str-baseline").value =
          chars.str.baseline || "7";
      }
      if (chars.dex) {
        document.getElementById("dex-current").value = chars.dex.current || "7";
        document.getElementById("dex-baseline").value =
          chars.dex.baseline || "7";
      }
      if (chars.end) {
        document.getElementById("end-current").value = chars.end.current || "7";
        document.getElementById("end-baseline").value =
          chars.end.baseline || "7";
      }
      if (chars.int) {
        document.getElementById("int-current").value = chars.int.current || "7";
        document.getElementById("int-baseline").value =
          chars.int.baseline || "7";
      }
      if (chars.edu) {
        document.getElementById("edu-current").value = chars.edu.current || "7";
        document.getElementById("edu-baseline").value =
          chars.edu.baseline || "7";
      }
      if (chars.soc) {
        document.getElementById("soc-current").value = chars.soc.current || "7";
        document.getElementById("soc-baseline").value =
          chars.soc.baseline || "7";
      }

      // Load additional characteristics
      if (chars.psi) {
        document.getElementById("psi-current").value = chars.psi.current || "7";
        document.getElementById("psi-baseline").value =
          chars.psi.baseline || "7";
      }
      if (chars.wlt) {
        document.getElementById("wlt-current").value = chars.wlt.current || "7";
        document.getElementById("wlt-baseline").value =
          chars.wlt.baseline || "7";
      }
      if (chars.lck) {
        document.getElementById("lck-current").value = chars.lck.current || "7";
        document.getElementById("lck-baseline").value =
          chars.lck.baseline || "7";
      }
      if (chars.mrl) {
        document.getElementById("mrl-current").value = chars.mrl.current || "7";
        document.getElementById("mrl-baseline").value =
          chars.mrl.baseline || "7";
      }
      if (chars.sty) {
        document.getElementById("sty-current").value = chars.sty.current || "7";
        document.getElementById("sty-baseline").value =
          chars.sty.baseline || "7";
      }
      if (chars.std) {
        document.getElementById("std-current").value = chars.std.current || "7";
        document.getElementById("std-baseline").value =
          chars.std.baseline || "7";
      }
      if (chars.chr) {
        document.getElementById("chr-current").value = chars.chr.current || "7";
        document.getElementById("chr-baseline").value =
          chars.chr.baseline || "7";
      }

      // Update all DMs after setting characteristics
      updateDM("str");
      updateDM("dex");
      updateDM("end");
      updateDM("int");
      updateDM("edu");
      updateDM("soc");

      // Update DMs for additional characteristics
      updateDM("psi");
      updateDM("wlt");
      updateDM("lck");
      updateDM("mrl");
      updateDM("sty");
      updateDM("std");
      updateDM("chr");
    } else {
      // Legacy support for characters without dual values
      // ...load from old format if available...
    }

    // Finances
    document.getElementById("credits").value = character.credits || "0";
    document.getElementById("pension").value = character.pension || "0";
    document.getElementById("debt").value = character.debt || "0";
    document.getElementById("cashOnHand").value = character.cashOnHand || "0";
    document.getElementById("livingCosts").value = character.livingCosts || "0";
    document.getElementById("shipPayments").value =
      character.shipPayments || "0";
    document.getElementById("shipCosts").value = character.shipCosts || "0"; // Add this line

    // Notes
    document.getElementById("notes").value = character.notes || "";

    // Clear existing items
    document.getElementById("skills-container").innerHTML = "";
    document.getElementById("weapons-container").innerHTML = "";
    document.getElementById("armor-container").innerHTML = "";
    document.getElementById("equipment-container").innerHTML = "";

    // Skills with specialization support
    if (character.skills && character.skills.length) {
      character.skills.forEach((skill) => {
        const skillDiv = document.createElement("div");
        skillDiv.className = "skill-item";
        skillDiv.innerHTML = `
                            <span class="skill-name" data-skill="${
                              skill.name
                            }" data-specialization="${
          skill.specialization || ""
        }">
                                ${skill.name}${
          skill.specialization
            ? ` <span class="skill-specialization">(${skill.specialization})</span>`
            : ""
        }
                            </span>
                            <div class="d-flex align-items-center">
                                <input type="number" class="form-control form-control-sm mx-2" value="${
                                  skill.level
                                }" min="0" style="width: 60px;">
                                <button class="btn btn-remove no-print" onclick="this.parentElement.parentElement.remove()">×</button>
                            </div>
                        `;
        document.getElementById("skills-container").appendChild(skillDiv);
      });
    }

    // Weapons
    if (character.weapons && character.weapons.length) {
      character.weapons.forEach((weapon) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                            <td>${weapon.name}</td>
                            <td>${weapon.tl || "-"}</td>
                            <td><input type="text" class="form-control form-control-sm" value="${
                              weapon.skill || ""
                            }" placeholder="Skill"></td>
                            <td>${weapon.damage || "-"}</td>
                            <td>${weapon.range || "-"}</td>
                            <td>${weapon.weight || "-"}</td>
                            <td>${weapon.magazine || "-"}</td>
                            <td class="no-print">
                                <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
                            </td>
                        `;
        document.getElementById("weapons-container").appendChild(row);
      });
    }

    // Armor
    if (character.armor && character.armor.length) {
      character.armor.forEach((armor) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                            <td>${armor.name}</td>
                            <td>${armor.rating}</td>
                            <td>${armor.tl}</td>
                            <td>${armor.radiation}</td>
                            <td class="no-print">
                                <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
                        `;
        document.getElementById("armor-container").appendChild(row);
      });
    }

    // Equipment
    if (character.equipment && character.equipment.length) {
      character.equipment.forEach((equipment) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                            <td>${equipment.name}</td>
                            <td>${equipment.tl}</td>
                            <td>${equipment.mass}</td>
                            <td>${equipment.cost}</td>
                            <td class="no-print">
                                <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
                        `;
        document.getElementById("equipment-container").appendChild(row);
      });
    }

    // Load training skills if they exist
    if (character.trainingSkills && character.trainingSkills.length) {
      document.getElementById("training-skills-container").innerHTML = ""; // Clear existing
      
      character.trainingSkills.forEach(skill => {
        // Handle both legacy format and new format
        const weeksSpent = skill.weeksSpent || skill.weeksComplete || "1";
        const weeksTotal = skill.weeksTotal || "8"; // Default to 8 weeks if not specified in older saves
        
        const row = document.createElement("tr");
        row.innerHTML = `
          <td data-skill="${skill.skill}">${skill.skill}</td>
          <td data-specialization="${skill.specialization}">${skill.specialization || "-"}</td>
          <td data-weeks-spent="${weeksSpent}">${weeksSpent}</td>
          <td data-weeks-total="${weeksTotal}">${weeksTotal}</td>
          <td class="no-print">
            <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
            <button class="btn btn-secondary btn-sm ml-2" onclick="completeTraining(this)">Complete</button>
          </td>
        `;
        document.getElementById("training-skills-container").appendChild(row);
      });
    }

    alert("Character loaded successfully!");
  } catch (e) {
    console.error("Load failed:", e);
    alert("Failed to load character. Error: " + e.message);
  }
}

// Function to update specialization options for regular skills - define explicitly
function updateRegularSpecializationOptions() {
  updateSpecializationOptions("skillSearch", "specialization-list");
}

// Function to update specialization options for training skills - define explicitly
function updateTrainingSpecializationOptions() {
  updateSpecializationOptions("trainingSkillSearch", "training-specialization-list");
}

// Add the missing wealth-related functions
function updateWealthDisplay() {
  // Get the current wealth level
  const currentWealth = parseInt(document.getElementById("wlt-current").value) || 7;
  const baselineWealth = parseInt(document.getElementById("wlt-baseline").value) || 7;
  
  // Call the info display update function if it exists
  if (typeof updateWealthInfoDisplay === "function") {
    updateWealthInfoDisplay();
  } else {
    console.log("updateWealthInfoDisplay function not defined, using fallback");
    // Simple fallback to just update the wealth values
    updateWealthValues(currentWealth, "current");
    updateWealthValues(baselineWealth, "baseline");
  }
}

// Function to update wealth info display
function updateWealthInfoDisplay() {
  // Get the current wealth level
  const currentWealth = parseInt(document.getElementById("wlt-current").value) || 7;
  const baselineWealth = parseInt(document.getElementById("wlt-baseline").value) || 7;
  
  // Define wealth values based on characteristic values (wealth table)
  const wealthTable = {
    0: "Cr 0",
    1: "Cr 100",
    2: "Cr 200", 
    3: "Cr 300",
    4: "Cr 500",
    5: "Cr 800",
    6: "Cr 1,000",
    7: "Cr 2,000",
    8: "Cr 5,000",
    9: "Cr 10,000",
    10: "Cr 20,000",
    11: "Cr 50,000",
    12: "Cr 100,000",
    13: "Cr 200,000",
    14: "Cr 500,000",
    15: "Cr 1,000,000+"
  };

  // Update the display text values
  if (document.getElementById("current-wealth-value")) {
    document.getElementById("current-wealth-value").textContent = 
      `${wealthTable[currentWealth] || "Cr 2,000"} available`;
  }
  
  if (document.getElementById("baseline-wealth-value")) {
    document.getElementById("baseline-wealth-value").textContent = 
      `${wealthTable[baselineWealth] || "Cr 2,000"} baseline`;
  }
  
  // Update the wealth info spans
  const currentWealthInfo = document.querySelector("label .wealth-info");
  if (currentWealthInfo) {
    currentWealthInfo.textContent = `(${wealthTable[currentWealth] || "Cr 2,000"})`;
  }
  
  const baselineWealthInfo = document.querySelectorAll("label .wealth-info")[1];
  if (baselineWealthInfo) {
    baselineWealthInfo.textContent = `(${wealthTable[baselineWealth] || "Cr 2,000"})`;
  }
}

// Helper function for updating wealth values
function updateWealthValues(value, type) {
  // Define wealth values based on characteristic values (simplified)
  const wealthTable = {
    0: "Cr 0",
    7: "Cr 2,000",
    15: "Cr 1,000,000+"
  };
  
  // Default to 7 if out of range
  if (value < 0) value = 0;
  if (value > 15) value = 15;
  
  // Find closest value in table
  let wealthValue = wealthTable[value];
  if (!wealthValue) {
    // Simple fallback
    wealthValue = value <= 7 ? "Cr 2,000" : "Cr 10,000";
  }
  
  // Update relevant display element if it exists
  const displayElement = document.getElementById(`${type}-wealth-value`);
  if (displayElement) {
    displayElement.textContent = `${wealthValue} ${type === "current" ? "available" : "baseline"}`;
  }
}

// Fix the careerTerms event listener - modify the DOM ready event listener
document.addEventListener("DOMContentLoaded", function () {
  // ... existing initialization code ...
  
  // Only add event listener if the element exists
  const careerTermsElement = document.getElementById("careerTerms");
  if (careerTermsElement) {
    careerTermsElement.addEventListener("input", suggestRank);
  }
  
  // Update necessary event handlers for the skillSearch field
  const skillSearch = document.getElementById("skillSearch");
  if (skillSearch) {
    // Remove any old listeners first to avoid duplicates
    const newInputHandler = function() {
      updateSpecializationOptions("skillSearch", "specialization-list");
    };
    
    // Clean up old listeners if possible
    skillSearch.removeEventListener("input", updateSpecializationOptions);
    
    // Add the new handler
    skillSearch.addEventListener("input", newInputHandler);
    console.log("Added input handler to skillSearch field");
  }
  
  // Initialize wealth display right away
  updateWealthDisplay();
});

// Improved initialization function
function initializeCharacterSheet() {
  console.log("Initializing character sheet...");

  try {
    // Initialize characteristics
    updateDM("str");
    updateDM("dex");
    updateDM("end");
    updateDM("int");
    updateDM("edu");
    updateDM("soc");

    // Initialize additional characteristics
    updateDM("psi");
    updateDM("lck");
    updateDM("mrl");
    updateDM("sty");
    updateDM("std");
    updateDM("chr");
    
    // Initialize wealth last to ensure updateWealthDisplay is defined
    if (document.getElementById("wlt-current")) {
      updateDM("wlt");
    }
  } catch (e) {
    console.error("Error initializing character sheet:", e);
  }

  // ... rest of the initialization code ...
  
  // Initialize pre-career options button state
  updateEducationButtons();
  
  // Make sure wealth is properly initialized
  if (typeof updateWealthDisplay === "function") {
    updateWealthDisplay();
  }
}
