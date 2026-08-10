(function () {
  "use strict";

  const LIBRARY_STORAGE_KEY = "traveller-characters-v2";
  const LEGACY_STORAGE_KEY = "traveller-character";
  const LIBRARY_VERSION = 2;
  const DRAFT_OPTION_ATTRIBUTE = "data-character-draft-option";
  const CHARACTERISTIC_KEYS = [
    "str",
    "dex",
    "end",
    "int",
    "edu",
    "soc",
    "mrl",
    "lck",
    "sty",
    "chr",
    "psi",
    "std",
    "wlt",
  ];
  const DRAFT_DEFAULTS = Object.freeze({
    trainingSkillName: "",
    trainingSpecialization: "",
    trainingWeeksSpent: "1",
    trainingWeeksTotal: "8",
    skillSearch: "",
    specializationField: "",
    skillLevel: "0",
    educationType: "",
    educationYears: "4",
    educationOutcome: "Graduate",
    educationBenefits: "",
    careerName: "",
    careerAssignment: "",
    careerPromotions: "0",
    careerYears: "4",
    careerRank: "",
    careerBenefits: "",
    weaponName: "",
    weaponTL: "",
    weaponDamage: "",
    weaponRange: "",
    weaponWeight: "",
    weaponMagazine: "",
    armorName: "",
    armorRating: "",
    armorTL: "",
    armorRadiation: "",
    augmentType: "",
    augmentTL: "",
    augmentImprovement: "",
    equipmentName: "",
    equipmentTL: "",
    equipmentMass: "",
    equipmentCost: "",
  });

  let activeCharacterId = null;
  let cleanCharacterSnapshot = null;
  let legacyWasCopied = false;

  function createEmptyLibrary() {
    return {
      version: LIBRARY_VERSION,
      lastSelectedId: null,
      characters: [],
    };
  }

  function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function createCharacterId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return `character-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function characterName(character, fallback = "Unnamed Traveller") {
    if (character && typeof character.charName === "string") {
      const name = character.charName.trim();
      if (name) return name;
    }

    return fallback;
  }

  function normalizeLibrary(value) {
    if (!isRecord(value) || !Array.isArray(value.characters)) {
      throw new Error("The saved-character library is not in a recognized format.");
    }

    const characters = value.characters
      .filter((entry) => isRecord(entry) && isRecord(entry.data))
      .map((entry) => ({
        id: typeof entry.id === "string" && entry.id ? entry.id : createCharacterId(),
        name:
          typeof entry.name === "string" && entry.name.trim()
            ? entry.name.trim()
            : characterName(entry.data),
        updatedAt:
          typeof entry.updatedAt === "string" && entry.updatedAt
            ? entry.updatedAt
            : new Date(0).toISOString(),
        data: entry.data,
        ...(entry.source === "legacy-copy" ? { source: "legacy-copy" } : {}),
        ...(typeof entry.legacyFingerprint === "string" && entry.legacyFingerprint
          ? { legacyFingerprint: entry.legacyFingerprint }
          : {}),
      }));

    const lastSelectedId = characters.some(
      (entry) => entry.id === value.lastSelectedId
    )
      ? value.lastSelectedId
      : null;

    return {
      version: LIBRARY_VERSION,
      lastSelectedId,
      characters,
    };
  }

  function writeLibrary(library) {
    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(library));
  }

  function fingerprintLegacyCharacter(rawCharacter) {
    let hash = 2166136261;
    for (let index = 0; index < rawCharacter.length; index += 1) {
      hash ^= rawCharacter.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return `fnv1a-${(hash >>> 0).toString(16)}-${rawCharacter.length}`;
  }

  function reconcileLegacyCharacter(library) {
    const legacyCharacter = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyCharacter === null) return false;

    try {
      const character = JSON.parse(legacyCharacter);
      if (!isRecord(character)) return false;

      const fingerprint = fingerprintLegacyCharacter(legacyCharacter);
      const existingCopy = library.characters.find(
        (entry) =>
          entry.source === "legacy-copy" &&
          (entry.legacyFingerprint === fingerprint ||
            (!entry.legacyFingerprint &&
              JSON.stringify(entry.data) === JSON.stringify(character)))
      );

      if (existingCopy) {
        if (!existingCopy.legacyFingerprint) {
          existingCopy.legacyFingerprint = fingerprint;
          return true;
        }
        return false;
      }

      const id = createCharacterId();
      library.characters.push({
        id,
        name: characterName(character, "Legacy character"),
        updatedAt: new Date().toISOString(),
        source: "legacy-copy",
        legacyFingerprint: fingerprint,
        data: character,
      });
      if (!library.lastSelectedId) library.lastSelectedId = id;
      legacyWasCopied = true;
      return true;
    } catch (error) {
      console.warn("The legacy Traveller character could not be copied.", error);
      return false;
    }
  }

  function readLibrary() {
    const storedLibrary = localStorage.getItem(LIBRARY_STORAGE_KEY);

    if (storedLibrary !== null) {
      try {
        const library = normalizeLibrary(JSON.parse(storedLibrary));
        if (reconcileLegacyCharacter(library)) writeLibrary(library);
        return library;
      } catch (error) {
        throw new Error(`The saved-character library could not be read: ${error.message}`);
      }
    }

    const library = createEmptyLibrary();
    reconcileLegacyCharacter(library);

    // This writes only the new collection. The legacy key is intentionally read-only.
    writeLibrary(library);
    return library;
  }

  function selectedCharacterId() {
    const select = document.getElementById("saved-character-select");
    return select ? select.value : "";
  }

  function findCharacter(library, id) {
    return library.characters.find((entry) => entry.id === id) || null;
  }

  function setLibraryMessage(message, isError = false) {
    const status = document.getElementById("character-library-status");
    if (!status) return;

    status.textContent = message;
    status.classList.toggle("is-error", isError);
  }

  function characterSignature(character) {
    return JSON.stringify(character);
  }

  function hasUnsavedChanges() {
    if (cleanCharacterSnapshot === null) return true;

    try {
      return characterSignature(captureCharacterData()) !== cleanCharacterSnapshot;
    } catch (error) {
      return true;
    }
  }

  function updateCurrentCharacterStatus() {
    const status = document.getElementById("current-character-status");
    if (!status) return;

    let label = "New character";
    if (activeCharacterId) {
      try {
        const active = findCharacter(readLibrary(), activeCharacterId);
        if (active) label = active.name;
      } catch (error) {
        label = characterName(captureCharacterData());
      }
    }

    status.textContent = `Current sheet: ${label}${
      hasUnsavedChanges() ? " — Unsaved changes" : ""
    }`;
  }

  function renderCharacterLibrary(preferredId = "") {
    const select = document.getElementById("saved-character-select");
    const loadButton = document.getElementById("load-character-button");
    const deleteButton = document.getElementById("delete-character-button");
    if (!select) return;

    const library = readLibrary();
    const characters = [...library.characters].sort((left, right) => {
      const nameComparison = left.name.localeCompare(right.name, undefined, {
        sensitivity: "base",
      });
      if (nameComparison !== 0) return nameComparison;
      return right.updatedAt.localeCompare(left.updatedAt);
    });

    select.replaceChildren();

    if (characters.length === 0) {
      select.add(new Option("No saved characters yet", ""));
      select.disabled = true;
      if (loadButton) loadButton.disabled = true;
      if (deleteButton) deleteButton.disabled = true;
      updateCurrentCharacterStatus();
      return;
    }

    const nameTotals = characters.reduce((totals, entry) => {
      const normalizedName = entry.name.toLocaleLowerCase();
      totals[normalizedName] = (totals[normalizedName] || 0) + 1;
      return totals;
    }, {});
    const nameIndexes = {};

    characters.forEach((entry) => {
      const normalizedName = entry.name.toLocaleLowerCase();
      nameIndexes[normalizedName] = (nameIndexes[normalizedName] || 0) + 1;
      const duplicateSuffix =
        nameTotals[normalizedName] > 1
          ? ` (${nameIndexes[normalizedName]})`
          : "";
      const option = new Option(`${entry.name}${duplicateSuffix}`, entry.id);
      option.title = `Updated ${new Date(entry.updatedAt).toLocaleString()}`;
      select.add(option);
    });

    const requestedId =
      preferredId || library.lastSelectedId || characters[0].id;
    select.value = characters.some((entry) => entry.id === requestedId)
      ? requestedId
      : characters[0].id;
    select.disabled = false;
    if (loadButton) loadButton.disabled = false;
    if (deleteButton) deleteButton.disabled = false;
    updateCurrentCharacterStatus();
  }

  function persistCharacter(character, saveAsNew) {
    const library = readLibrary();
    let id = !saveAsNew ? activeCharacterId : null;
    let entry = id ? findCharacter(library, id) : null;

    if (!entry) {
      id = createCharacterId();
      entry = { id, name: "", updatedAt: "", data: {} };
      library.characters.push(entry);
    }

    const changedLegacyCopy =
      entry.source === "legacy-copy" &&
      JSON.stringify(entry.data) !== JSON.stringify(character);
    if (changedLegacyCopy) {
      delete entry.source;
      delete entry.legacyFingerprint;
    }

    entry.name = characterName(character);
    entry.updatedAt = new Date().toISOString();
    entry.data = character;
    library.lastSelectedId = id;

    writeLibrary(library);
    activeCharacterId = id;
    cleanCharacterSnapshot = characterSignature(character);
    renderCharacterLibrary(id);
    return entry;
  }

  function valueOf(id, fallback = "") {
    const element = document.getElementById(id);
    return element ? element.value : fallback;
  }

  function setValue(id, value, fallback = "") {
    const element = document.getElementById(id);
    if (!element) return;
    element.value = value === undefined || value === null ? fallback : value;
  }

  function captureTransientDrafts() {
    return Object.fromEntries(
      Object.entries(DRAFT_DEFAULTS).map(([id, fallback]) => [
        id,
        valueOf(id, fallback),
      ])
    );
  }

  function tableRows(containerId) {
    const container = document.getElementById(containerId);
    return container ? Array.from(container.querySelectorAll("tr")) : [];
  }

  function cellValue(cell, attribute) {
    if (!cell) return "";
    return attribute && cell.hasAttribute(attribute)
      ? cell.getAttribute(attribute)
      : cell.textContent.trim();
  }

  function captureCharacterData() {
    const characteristics = {};
    CHARACTERISTIC_KEYS.forEach((key) => {
      characteristics[key] = {
        current: valueOf(`${key}-current`, "7"),
        baseline: valueOf(`${key}-baseline`, "7"),
      };
    });

    return {
      charName: valueOf("charName"),
      species: valueOf("species", "Human"),
      age: valueOf("age", "18"),
      homeworld: valueOf("homeworld"),
      homeworldUWP: valueOf("homeworldUWP"),
      rads: valueOf("rads", "0"),
      upp: valueOf("upp"),
      drafts: captureTransientDrafts(),
      preCareerOptions: tableRows("education-container").map((row) => {
        const cells = row.querySelectorAll("td");
        return {
          type: cellValue(cells[0], "data-type"),
          years: cellValue(cells[1], "data-years"),
          outcome: cellValue(cells[2], "data-outcome"),
          benefits: cellValue(cells[3], "data-benefits"),
        };
      }),
      careers: tableRows("careers-container").map((row) => {
        const cells = row.querySelectorAll("td");
        return {
          career: cellValue(cells[0], "data-career"),
          assignment: cellValue(cells[1], "data-assignment"),
          promotions: cellValue(cells[2], "data-promotions"),
          years: cellValue(cells[3], "data-years"),
          rank: cellValue(cells[4], "data-rank"),
          benefits: cellValue(cells[5], "data-benefits"),
        };
      }),
      characteristics,
      credits: valueOf("credits", "0"),
      pension: valueOf("pension", "0"),
      debt: valueOf("debt", "0"),
      cashOnHand: valueOf("cashOnHand", "0"),
      livingCosts: valueOf("livingCosts", "0"),
      shipPayments: valueOf("shipPayments", "0"),
      shipCosts: valueOf("shipCosts", "0"),
      financialNotes: valueOf("financialNotes"),
      notes: valueOf("notes"),
      skills: Array.from(document.querySelectorAll(".skill-item")).map((item) => {
        const name = item.querySelector(".skill-name");
        const level = item.querySelector("input");
        return {
          name: name ? name.getAttribute("data-skill") || "" : "",
          specialization: name
            ? name.getAttribute("data-specialization") || ""
            : "",
          level: level ? level.value : "0",
        };
      }),
      weapons: tableRows("weapons-container").map((row) => {
        const cells = row.querySelectorAll("td");
        const skill = cells[2] ? cells[2].querySelector("input") : null;
        return {
          name: cellValue(cells[0]),
          tl: cellValue(cells[1]),
          skill: skill ? skill.value : "",
          damage: cellValue(cells[3]),
          range: cellValue(cells[4]),
          weight: cellValue(cells[5]),
          magazine: cellValue(cells[6]),
        };
      }),
      armor: tableRows("armor-container").map((row) => {
        const cells = row.querySelectorAll("td");
        return {
          name: cellValue(cells[0]),
          rating: cellValue(cells[1]),
          tl: cellValue(cells[2]),
          radiation: cellValue(cells[3]),
        };
      }),
      augments: tableRows("augments-container").map((row) => {
        const cells = row.querySelectorAll("td");
        return {
          type: cellValue(cells[0]),
          tl: cellValue(cells[1]),
          improvement: cellValue(cells[2]),
        };
      }),
      equipment: tableRows("equipment-container").map((row) => {
        const cells = row.querySelectorAll("td");
        return {
          name: cellValue(cells[0]),
          tl: cellValue(cells[1]),
          mass: cellValue(cells[2]),
          cost: cellValue(cells[3]),
        };
      }),
      trainingSkills: tableRows("training-skills-container").map((row) => {
        const skill = row.querySelector("td[data-skill]");
        const specialization = row.querySelector("td[data-specialization]");
        const weeksSpent = row.querySelector("td[data-weeks-spent]");
        const weeksTotal = row.querySelector("td[data-weeks-total]");
        return {
          skill: cellValue(skill, "data-skill"),
          specialization: cellValue(specialization, "data-specialization"),
          weeksSpent: cellValue(weeksSpent, "data-weeks-spent"),
          weeksTotal: cellValue(weeksTotal, "data-weeks-total"),
        };
      }),
    };
  }

  function appendCell(row, value, dataAttribute = "") {
    const cell = document.createElement("td");
    const safeValue = value === undefined || value === null ? "" : String(value);
    cell.textContent = safeValue;
    if (dataAttribute) cell.setAttribute(dataAttribute, safeValue);
    row.appendChild(cell);
    return cell;
  }

  function appendRemoveAction(row, label, onRemove) {
    const cell = document.createElement("td");
    cell.className = "no-print";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-remove";
    button.textContent = "×";
    button.setAttribute("aria-label", label);
    button.addEventListener("click", () => {
      row.remove();
      if (onRemove) onRemove();
      updateCurrentCharacterStatus();
    });
    cell.appendChild(button);
    row.appendChild(cell);
    return cell;
  }

  function clearDynamicSections() {
    [
      "education-container",
      "careers-container",
      "training-skills-container",
      "skills-container",
      "weapons-container",
      "armor-container",
      "augments-container",
      "equipment-container",
    ].forEach((id) => {
      const container = document.getElementById(id);
      if (container) container.replaceChildren();
    });
  }

  function renderEducation(character) {
    const container = document.getElementById("education-container");
    if (!container) return;

    let options = Array.isArray(character.preCareerOptions)
      ? character.preCareerOptions
      : [];
    if (options.length === 0 && Array.isArray(character.education)) {
      options = character.education.map((education) => ({
        type: education.type,
        years: education.years,
        outcome: education.outcome || education.qualification || "Graduate",
        benefits: education.benefits || education.skills || "",
      }));
    }

    options.forEach((option) => {
      const row = document.createElement("tr");
      appendCell(row, option.type, "data-type");
      appendCell(row, option.years, "data-years");
      appendCell(row, option.outcome, "data-outcome");
      appendCell(row, option.benefits, "data-benefits");
      appendRemoveAction(row, "Remove pre-career option", () => {
        if (typeof window.updateEducationButtons === "function") {
          window.updateEducationButtons();
        }
        if (typeof window.updateTotalYears === "function") window.updateTotalYears();
      });
      container.appendChild(row);
    });
  }

  function renderCareers(character) {
    const container = document.getElementById("careers-container");
    if (!container || !Array.isArray(character.careers)) return;

    character.careers.forEach((career) => {
      const row = document.createElement("tr");
      const years =
        career.years !== undefined
          ? career.years
          : Number(career.terms || 0) * 4;
      const promotions =
        career.promotions !== undefined ? career.promotions : career.terms || "0";
      appendCell(row, career.career, "data-career");
      appendCell(row, career.assignment, "data-assignment");
      appendCell(row, promotions, "data-promotions");
      appendCell(row, years, "data-years");
      appendCell(row, career.rank, "data-rank");
      appendCell(row, career.benefits, "data-benefits");
      appendRemoveAction(row, "Remove career", () => {
        if (typeof window.updateTotalYears === "function") window.updateTotalYears();
      });
      container.appendChild(row);
    });
  }

  function renderSkills(character) {
    const container = document.getElementById("skills-container");
    if (!container || !Array.isArray(character.skills)) return;

    character.skills.forEach((skill) => {
      const item = document.createElement("div");
      item.className = "skill-item";

      const name = document.createElement("span");
      name.className = "skill-name";
      name.setAttribute("data-skill", skill.name || "");
      name.setAttribute("data-specialization", skill.specialization || "");
      name.appendChild(document.createTextNode(skill.name || ""));
      if (skill.specialization) {
        const specialization = document.createElement("span");
        specialization.className = "skill-specialization";
        specialization.textContent = ` (${skill.specialization})`;
        name.appendChild(specialization);
      }

      const controls = document.createElement("div");
      controls.className = "d-flex align-items-center";
      const level = document.createElement("input");
      level.type = "number";
      level.className = "form-control form-control-sm mx-2";
      level.value = skill.level === undefined ? "0" : skill.level;
      level.min = "0";
      level.style.width = "60px";
      level.setAttribute("aria-label", `${skill.name || "Skill"} level`);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "btn btn-remove no-print";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `Remove ${skill.name || "skill"}`);
      remove.addEventListener("click", () => {
        item.remove();
        updateCurrentCharacterStatus();
      });
      controls.append(level, remove);
      item.append(name, controls);
      container.appendChild(item);
    });

    if (typeof window.sortSkillsContainer === "function") {
      window.sortSkillsContainer();
    }
  }

  function renderWeapons(character) {
    const container = document.getElementById("weapons-container");
    if (!container || !Array.isArray(character.weapons)) return;

    character.weapons.forEach((weapon) => {
      const row = document.createElement("tr");
      appendCell(row, weapon.name);
      appendCell(row, weapon.tl || "-");
      const skillCell = document.createElement("td");
      const skill = document.createElement("input");
      skill.type = "text";
      skill.className = "form-control form-control-sm";
      skill.value = weapon.skill || "";
      skill.placeholder = "Skill";
      skill.setAttribute("aria-label", `${weapon.name || "Weapon"} skill`);
      skillCell.appendChild(skill);
      row.appendChild(skillCell);
      appendCell(row, weapon.damage || "-");
      appendCell(row, weapon.range || "-");
      appendCell(row, weapon.weight || "-");
      appendCell(row, weapon.magazine || "-");
      appendRemoveAction(row, `Remove ${weapon.name || "weapon"}`);
      container.appendChild(row);
    });
  }

  function renderArmor(character) {
    const container = document.getElementById("armor-container");
    if (!container || !Array.isArray(character.armor)) return;

    character.armor.forEach((armor) => {
      const row = document.createElement("tr");
      appendCell(row, armor.name);
      appendCell(row, armor.rating);
      appendCell(row, armor.tl);
      appendCell(row, armor.radiation);
      appendRemoveAction(row, `Remove ${armor.name || "armor"}`);
      container.appendChild(row);
    });
  }

  function renderAugments(character) {
    const container = document.getElementById("augments-container");
    if (!container || !Array.isArray(character.augments)) return;

    character.augments.forEach((augment) => {
      const row = document.createElement("tr");
      appendCell(row, augment.type);
      appendCell(row, augment.tl);
      appendCell(row, augment.improvement);
      appendRemoveAction(row, `Remove ${augment.type || "augment"}`);
      container.appendChild(row);
    });
  }

  function renderEquipment(character) {
    const container = document.getElementById("equipment-container");
    if (!container || !Array.isArray(character.equipment)) return;

    character.equipment.forEach((equipment) => {
      const row = document.createElement("tr");
      appendCell(row, equipment.name);
      appendCell(row, equipment.tl);
      appendCell(row, equipment.mass);
      appendCell(row, equipment.cost);
      appendRemoveAction(row, `Remove ${equipment.name || "equipment"}`);
      container.appendChild(row);
    });
  }

  function renderTrainingSkills(character) {
    const container = document.getElementById("training-skills-container");
    if (!container || !Array.isArray(character.trainingSkills)) return;

    character.trainingSkills.forEach((training) => {
      const row = document.createElement("tr");
      const weeksSpent = training.weeksSpent || training.weeksComplete || "1";
      const weeksTotal = training.weeksTotal || "8";
      appendCell(row, training.skill, "data-skill");
      appendCell(
        row,
        training.specialization || "-",
        "data-specialization"
      ).setAttribute("data-specialization", training.specialization || "");
      appendCell(row, weeksSpent, "data-weeks-spent");
      appendCell(row, weeksTotal, "data-weeks-total");
      const actions = appendRemoveAction(
        row,
        `Remove ${training.skill || "training skill"}`
      );
      const complete = document.createElement("button");
      complete.type = "button";
      complete.className = "btn btn-secondary btn-sm ms-2";
      complete.textContent = "Complete";
      complete.addEventListener("click", () => {
        if (typeof window.completeTraining === "function") {
          window.completeTraining(complete);
          updateCurrentCharacterStatus();
        }
      });
      actions.appendChild(complete);
      container.appendChild(row);
    });
  }

  function draftValue(drafts, id) {
    const value = drafts[id];
    return value === undefined || value === null ? DRAFT_DEFAULTS[id] : value;
  }

  function setSelectValue(id, value, fallback = "") {
    const select = document.getElementById(id);
    if (!select) return;

    Array.from(select.options).forEach((option) => {
      if (option.hasAttribute(DRAFT_OPTION_ATTRIBUTE)) option.remove();
    });

    const selectedValue = String(
      value === undefined || value === null ? fallback : value
    );
    if (
      selectedValue &&
      !Array.from(select.options).some((option) => option.value === selectedValue)
    ) {
      const option = document.createElement("option");
      option.value = selectedValue;
      option.textContent = selectedValue;
      option.setAttribute(DRAFT_OPTION_ATTRIBUTE, "true");
      select.add(option);
    }
    select.value = selectedValue;
  }

  function rebuildCareerAssignmentOptions(careerName) {
    setSelectValue("careerName", careerName, DRAFT_DEFAULTS.careerName);

    const assignment = document.getElementById("careerAssignment");
    if (!assignment) return;

    if (typeof window.updateAssignments === "function") {
      window.updateAssignments();
      return;
    }

    const prompt = document.createElement("option");
    prompt.value = "";
    prompt.textContent = "Select Assignment...";
    assignment.replaceChildren(prompt);
  }

  function resetTransientInputs(savedDrafts) {
    const drafts = isRecord(savedDrafts) ? savedDrafts : {};

    Object.keys(DRAFT_DEFAULTS).forEach((id) => {
      if (
        id === "educationType" ||
        id === "educationOutcome" ||
        id === "careerName" ||
        id === "careerAssignment" ||
        id === "careerRank"
      ) {
        return;
      }
      setValue(id, draftValue(drafts, id), DRAFT_DEFAULTS[id]);
    });

    setSelectValue(
      "educationType",
      draftValue(drafts, "educationType"),
      DRAFT_DEFAULTS.educationType
    );
    setSelectValue(
      "educationOutcome",
      draftValue(drafts, "educationOutcome"),
      DRAFT_DEFAULTS.educationOutcome
    );
    rebuildCareerAssignmentOptions(draftValue(drafts, "careerName"));
    setSelectValue(
      "careerAssignment",
      draftValue(drafts, "careerAssignment"),
      DRAFT_DEFAULTS.careerAssignment
    );
    setValue(
      "careerRank",
      draftValue(drafts, "careerRank"),
      DRAFT_DEFAULTS.careerRank
    );
  }

  function applyCharacterData(character) {
    const data = isRecord(character) ? character : {};
    clearDynamicSections();
    resetTransientInputs(data.drafts);

    setValue("charName", data.charName);
    setValue("species", data.species, "Human");
    setValue("age", data.age, "18");
    setValue("homeworld", data.homeworld);
    setValue("homeworldUWP", data.homeworldUWP);
    setValue("rads", data.rads, "0");
    setValue("upp", data.upp);

    CHARACTERISTIC_KEYS.forEach((key) => {
      const characteristic =
        data.characteristics && isRecord(data.characteristics[key])
          ? data.characteristics[key]
          : {};
      setValue(`${key}-current`, characteristic.current, "7");
      setValue(`${key}-baseline`, characteristic.baseline, "7");
    });

    setValue("credits", data.credits, "0");
    setValue("pension", data.pension, "0");
    setValue("debt", data.debt, "0");
    setValue("cashOnHand", data.cashOnHand, "0");
    setValue("livingCosts", data.livingCosts, "0");
    setValue("shipPayments", data.shipPayments, "0");
    setValue("shipCosts", data.shipCosts, "0");
    setValue("financialNotes", data.financialNotes);
    setValue("notes", data.notes);

    renderEducation(data);
    renderCareers(data);
    renderTrainingSkills(data);
    renderSkills(data);
    renderWeapons(data);
    renderArmor(data);
    renderAugments(data);
    renderEquipment(data);

    if (typeof window.updateEducationButtons === "function") {
      window.updateEducationButtons();
    }
    if (typeof window.updateTotalYears === "function") window.updateTotalYears();
    // Keep an explicitly saved age rather than the derived value.
    setValue("age", data.age, "18");

    CHARACTERISTIC_KEYS.forEach((key) => {
      if (typeof window.updateDM === "function") window.updateDM(key);
    });
    if (typeof window.updateWealthInfoDisplay === "function") {
      window.updateWealthInfoDisplay();
    }
  }

  function confirmDiscard(action) {
    if (!hasUnsavedChanges()) return true;
    return window.confirm(
      `The current sheet has unsaved changes. ${action} will discard them. Continue?`
    );
  }

  function saveCharacter() {
    try {
      const character = captureCharacterData();
      const entry = persistCharacter(character, false);
      setLibraryMessage(`${entry.name} was saved.`);
      updateCurrentCharacterStatus();
    } catch (error) {
      console.error("Save failed:", error);
      setLibraryMessage(`The character could not be saved: ${error.message}`, true);
    }
  }

  function saveCharacterAsNew() {
    try {
      const character = captureCharacterData();
      const entry = persistCharacter(character, true);
      setLibraryMessage(`${entry.name} was saved as a new character.`);
      updateCurrentCharacterStatus();
    } catch (error) {
      console.error("Save as new failed:", error);
      setLibraryMessage(`The new character could not be saved: ${error.message}`, true);
    }
  }

  function loadCharacter() {
    try {
      const library = readLibrary();
      const entry = findCharacter(library, selectedCharacterId());
      if (!entry) {
        setLibraryMessage("Choose a saved character to load.", true);
        return;
      }
      if (!confirmDiscard(`Loading ${entry.name}`)) return;

      applyCharacterData(entry.data);
      activeCharacterId = entry.id;
      library.lastSelectedId = entry.id;
      writeLibrary(library);
      cleanCharacterSnapshot = characterSignature(captureCharacterData());
      renderCharacterLibrary(entry.id);
      setLibraryMessage(`${entry.name} was loaded.`);
      updateCurrentCharacterStatus();
    } catch (error) {
      console.error("Load failed:", error);
      setLibraryMessage(`The character could not be loaded: ${error.message}`, true);
    }
  }

  function newCharacter() {
    if (!confirmDiscard("Starting a new character")) return;

    applyCharacterData({});
    activeCharacterId = null;
    cleanCharacterSnapshot = characterSignature(captureCharacterData());
    try {
      renderCharacterLibrary("");
    } catch (error) {
      setLibraryMessage(`The character list could not be refreshed: ${error.message}`, true);
      return;
    }
    setLibraryMessage("A new blank character sheet is ready.");
    updateCurrentCharacterStatus();
    const name = document.getElementById("charName");
    if (name) name.focus();
  }

  function deleteCharacter() {
    try {
      const library = readLibrary();
      const entry = findCharacter(library, selectedCharacterId());
      if (!entry) {
        setLibraryMessage("Choose a saved character to delete.", true);
        return;
      }
      if (
        !window.confirm(
          `Delete the saved copy of ${entry.name}? The current sheet and the original legacy save will not be changed.`
        )
      ) {
        return;
      }

      library.characters = library.characters.filter(
        (character) => character.id !== entry.id
      );
      library.lastSelectedId = library.characters[0]
        ? library.characters[0].id
        : null;
      writeLibrary(library);

      if (activeCharacterId === entry.id) {
        activeCharacterId = null;
        cleanCharacterSnapshot = null;
      }

      renderCharacterLibrary(library.lastSelectedId || "");
      setLibraryMessage(`${entry.name} was removed from the saved-character list.`);
      updateCurrentCharacterStatus();
      const select = document.getElementById("saved-character-select");
      if (select && !select.disabled) select.focus();
    } catch (error) {
      console.error("Delete failed:", error);
      setLibraryMessage(`The character could not be deleted: ${error.message}`, true);
    }
  }

  function fileSafeName(name) {
    return (
      name
        .trim()
        .replace(/[^a-z0-9._-]+/gi, "-")
        .replace(/^-+|-+$/g, "") || "traveller-character"
    );
  }

  function exportCharacter() {
    try {
      const library = readLibrary();
      const id = activeCharacterId || selectedCharacterId();
      const entry = findCharacter(library, id);
      if (!entry) {
        setLibraryMessage("Choose a saved character to export.", true);
        return;
      }

      // Preserve the original export contract: one direct character object per file.
      const characterJson = JSON.stringify(entry.data, null, 2);
      const blob = new Blob([characterJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileSafeName(entry.name)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setLibraryMessage(`${entry.name} was exported.`);
    } catch (error) {
      console.error("Export failed:", error);
      setLibraryMessage(`The character could not be exported: ${error.message}`, true);
    }
  }

  function importedCharacter(value) {
    let character;
    if (isRecord(value) && isRecord(value.data) && typeof value.id === "string") {
      character = value.data;
    } else if (isRecord(value) && !Array.isArray(value.characters)) {
      character = value;
    } else {
      throw new Error("The file does not contain a character in the original export format.");
    }

    [
      "preCareerOptions",
      "education",
      "careers",
      "skills",
      "weapons",
      "armor",
      "augments",
      "equipment",
      "trainingSkills",
    ].forEach((field) => {
      if (character[field] === undefined) return;
      if (
        !Array.isArray(character[field]) ||
        character[field].some((entry) => !isRecord(entry))
      ) {
        throw new Error(`The ${field} section is not valid character data.`);
      }
    });

    if (
      character.characteristics !== undefined &&
      !isRecord(character.characteristics)
    ) {
      throw new Error("The characteristics section is not valid character data.");
    }

    if (character.drafts !== undefined && !isRecord(character.drafts)) {
      throw new Error("The drafts section is not valid character data.");
    }

    return character;
  }

  function importCharacter() {
    if (!confirmDiscard("Importing a character")) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const previousCharacter = captureCharacterData();
        const previousActiveCharacterId = activeCharacterId;
        const previousCleanSnapshot = cleanCharacterSnapshot;
        let importedDataWasApplied = false;

        try {
          const parsed = JSON.parse(String(reader.result));
          const character = importedCharacter(parsed);
          importedDataWasApplied = true;
          applyCharacterData(character);
          const normalizedCharacter = captureCharacterData();
          const entry = persistCharacter(normalizedCharacter, true);
          activeCharacterId = entry.id;
          cleanCharacterSnapshot = characterSignature(captureCharacterData());
          renderCharacterLibrary(entry.id);
          setLibraryMessage(`${entry.name} was imported as a new character.`);
          updateCurrentCharacterStatus();
        } catch (error) {
          if (importedDataWasApplied) {
            try {
              applyCharacterData(previousCharacter);
              activeCharacterId = previousActiveCharacterId;
              cleanCharacterSnapshot = previousCleanSnapshot;
              renderCharacterLibrary(previousActiveCharacterId || "");
              updateCurrentCharacterStatus();
            } catch (rollbackError) {
              console.error("Import rollback failed:", rollbackError);
            }
          }
          console.error("Import failed:", error);
          setLibraryMessage(`The character could not be imported: ${error.message}`, true);
        }
      });
      reader.addEventListener("error", () => {
        setLibraryMessage("The selected file could not be read.", true);
      });
      reader.readAsText(file);
    });
    input.click();
  }

  function initializeCharacterLibrary() {
    const select = document.getElementById("saved-character-select");
    if (!select) return;

    try {
      const library = readLibrary();
      renderCharacterLibrary(library.lastSelectedId || "");
      cleanCharacterSnapshot = characterSignature(captureCharacterData());
      updateCurrentCharacterStatus();
      if (legacyWasCopied) {
        setLibraryMessage(
          "Your original saved character was copied into the new list. The original save remains unchanged."
        );
      }
    } catch (error) {
      console.error("Character library initialization failed:", error);
      setLibraryMessage(`Saved characters are unavailable: ${error.message}`, true);
    }

    select.addEventListener("change", () => {
      setLibraryMessage("Choose Load Selected to open this character.");
    });

    const sheet = document.querySelector(".character-sheet");
    if (sheet) {
      sheet.addEventListener("input", updateCurrentCharacterStatus);
      sheet.addEventListener("change", updateCurrentCharacterStatus);
    }

    if (typeof window.MutationObserver === "function") {
      const observer = new window.MutationObserver(updateCurrentCharacterStatus);
      [
        "education-container",
        "careers-container",
        "training-skills-container",
        "skills-container",
        "weapons-container",
        "armor-container",
        "augments-container",
        "equipment-container",
      ].forEach((id) => {
        const container = document.getElementById(id);
        if (container) observer.observe(container, { childList: true, subtree: true });
      });
    }
  }

  window.saveCharacter = saveCharacter;
  window.saveCharacterAsNew = saveCharacterAsNew;
  window.loadCharacter = loadCharacter;
  window.newCharacter = newCharacter;
  window.resetCharacter = newCharacter;
  window.deleteCharacter = deleteCharacter;
  window.exportCharacter = exportCharacter;
  window.importCharacter = importCharacter;

  window.TravellerCharacterLibrary = Object.freeze({
    storageKey: LIBRARY_STORAGE_KEY,
    legacyStorageKey: LEGACY_STORAGE_KEY,
    captureCharacterData,
    applyCharacterData,
    importedCharacter,
  });

  document.addEventListener("DOMContentLoaded", initializeCharacterLibrary);
})();
