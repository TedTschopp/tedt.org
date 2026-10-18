(function () {
  "use strict";

  const CATALOG_MANIFEST = "data/gear-catalog/manifest.json";
  const PAGE_SIZE = 30;
  const SUPPORTED_SCHEMA_MAJORS = new Set([0, 1]);
  const SECTION_LABELS = Object.freeze({
    weapon: "weapon",
    armour: "armor",
    augment: "augment",
    equipment: "equipment",
  });
  const SECTION_TITLES = Object.freeze({
    weapon: "Weapons",
    armour: "Armor",
    augment: "Augments",
    equipment: "Equipment",
  });
  const ROLE_LABELS = Object.freeze({
    inventory: "Inventory",
    installed_component: "Installed components",
    vehicle_system: "Vehicle systems",
    spacecraft_system: "Spacecraft systems",
    innate_attack: "Innate attacks",
    innate_defence: "Innate defences",
  });
  const REVIEW_FLAG_MESSAGES = Object.freeze({
    input_player_reference_needs_review:
      "The player-facing source record still needs editorial review.",
    incomplete_structured_profile:
      "Some structured statistics or effects may be incomplete.",
    unrecognized_or_symbolic_trait:
      "One or more traits could not be fully normalized into structured rules.",
    suspicious_tech_level: "The listed Tech Level needs source verification.",
    suspicious_price: "The listed price needs source verification.",
    suspicious_radiation: "The listed radiation protection needs source verification.",
    suspicious_mass: "The listed mass needs source verification.",
    suspicious_range: "The listed range needs source verification.",
    suspicious_protection: "The listed protection needs source verification.",
    missing_protection_value: "A protection value may be missing.",
    verification_conflicting: "The available source records conflict.",
    rule_clause_withheld_for_originality:
      "A rule clause is omitted from the summary; consult the cited source.",
  });
  const LAW_LEVEL_VALUES = new Set([
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9+",
    "undetermined",
  ]);
  const NUMERIC_LADDER_RULE_STATUSES = new Set([
    "named_threshold",
    "no_additional_threshold",
    "no_restrictions",
  ]);
  const DIRECT_LAW_LEVEL_RULE_STATUSES = new Set([
    "named_threshold",
    "no_restrictions",
    "direct_item_exception",
  ]);
  const DIRECT_LEGAL_CATEGORY_RULE_STATUSES = new Set(["named_examples"]);
  const LEGAL_CATEGORY_VALUES = new Set([
    "category_1",
    "category_2",
    "category_3",
    "category_4",
    "category_5",
    "prohibited",
    "undetermined",
  ]);
  const LEGAL_CATEGORY_LABELS = Object.freeze({
    category_1: "Category 1 — Unrestricted",
    category_2: "Category 2 — Civilian Use",
    category_3: "Category 3 — Paramilitary Use",
    category_4: "Category 4 — Military Use",
    category_5: "Category 5 — Restricted Military Use",
    prohibited: "Prohibited",
    undetermined: "Undetermined",
  });
  const TECH_LEVEL_FALLBACK_LABELS = Object.freeze([
    "Simple tools",
    "Metalworking",
    "Renaissance science",
    "Steam industry",
    "Mature industry",
    "Electrification",
    "Fission and early spaceflight",
    "Reliable orbital flight",
    "Interplanetary travel",
    "Gravity control and early jump",
    "Common interstellar travel",
    "Early true AI",
    "Advanced terraforming",
    "Battle dress and advanced engineering",
    "Portable fusion",
    "High stellar technology",
  ]);
  const HIGH_TECH_LEVEL_FALLBACK_LABEL = "Beyond described milestones";
  const DEFAULT_UNRESOLVED_SKILL_FILTER = "unresolved_or_not_recorded";
  const SORT_VALUES = new Set(["name", "tech-asc", "tech-desc"]);
  const detailShardCache = new Map();
  let catalog = null;
  let manifestDocument = null;
  let manifestPromise = null;
  let techLevelReference = null;
  let lawLevelReference = null;
  let legalCategoryReference = null;
  let skillFilterReference = null;
  let initializationPromise = null;
  let lockerState = null;

  function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function stringValue(value, fallback = "") {
    return value === undefined || value === null ? fallback : String(value);
  }

  function firstString(...values) {
    for (const value of values) {
      const text = stringValue(value).trim();
      if (text) return text;
    }
    return "";
  }

  function stringList(value) {
    if (!Array.isArray(value)) return [];
    return value
      .map((entry) => stringValue(entry).trim())
      .filter(Boolean);
  }

  function uniqueStrings(values) {
    return [...new Set(values.filter(Boolean))];
  }

  function populateTechLevelFilters() {
    document.querySelectorAll("[data-gear-filter-tl]").forEach((select) => {
      if (!(select instanceof HTMLSelectElement) || select.dataset.populated === "true") return;
      const unknownOption = Array.from(select.options).find(
        (option) => option.value === "unknown"
      );
      const anyOption = Array.from(select.options).find(
        (option) => option.value === "any"
      );
      if (anyOption) anyOption.textContent = "Any Tech Level — no technology cutoff";
      if (unknownOption) {
        unknownOption.textContent =
          "Unknown or variable TL — not TL0; no usable recorded value";
      }
      for (let techLevel = 0; techLevel <= 21; techLevel += 1) {
        const option = document.createElement("option");
        option.value = `max:${techLevel}`;
        option.textContent = techLevelOptionText(
          techLevel,
          techLevel <= 15
            ? TECH_LEVEL_FALLBACK_LABELS[techLevel]
            : HIGH_TECH_LEVEL_FALLBACK_LABEL
        );
        select.insertBefore(option, unknownOption || null);
      }
      select.dataset.populated = "true";
    });
  }

  function populateSkillFilters() {
    document.querySelectorAll("[data-gear-filter-skill]").forEach((select) => {
      if (!(select instanceof HTMLSelectElement)) return;
      const panel = select.closest("[data-gear-add-panel]");
      const kind = normalizeKind(panel && panel.dataset.gearAddPanel);
      if (!kind) return;

      const selectedValue = select.value;
      select
        .querySelectorAll("option[data-gear-skill-option]")
        .forEach((option) => option.remove());
      const anyOption = Array.from(select.options).find(
        (option) => option.value === "any"
      );
      if (anyOption) anyOption.textContent = "Any skill requirement";

      let unresolvedOption = Array.from(select.options).find(
        (option) =>
          option.value === DEFAULT_UNRESOLVED_SKILL_FILTER ||
          option.dataset.gearSkillStatus === "true"
      );
      const unresolvedValue = unresolvedSkillFilterValue();
      if (!unresolvedOption) {
        unresolvedOption = document.createElement("option");
        select.appendChild(unresolvedOption);
      }
      unresolvedOption.value = unresolvedValue;
      unresolvedOption.textContent = firstString(
        skillFilterReference && skillFilterReference.unresolvedLabel,
        "Unresolved or not recorded"
      );
      unresolvedOption.dataset.gearSkillStatus = "true";

      skillOptionsForKind(kind).forEach((skillOption) => {
        if (
          skillOption.optionType === "status" ||
          skillOption.value === unresolvedValue
        ) {
          unresolvedOption.textContent = skillOption.label;
          return;
        }
        const option = document.createElement("option");
        option.value = skillOption.value;
        option.textContent = skillOption.label;
        option.dataset.gearSkillOption = "true";
        select.insertBefore(option, unresolvedOption);
      });

      select.value = Array.from(select.options).some(
        (option) => option.value === selectedValue
      )
        ? selectedValue
        : "any";
    });
  }

  function parseTechLevel(value) {
    const normalized = stringValue(value)
      .trim()
      .replace(/[–—]/g, "-")
      .replace(/^TL\s*/i, "");
    let match = normalized.match(/^(\d+)$/);
    if (match) {
      return { minimum: Number.parseInt(match[1], 10), maximum: null };
    }
    match = normalized.match(/^(\d+)\+$/);
    if (match) {
      return { minimum: Number.parseInt(match[1], 10), maximum: null };
    }
    match = normalized.match(/^(\d+)\s*-\s*(\d+)$/);
    if (match) {
      return {
        minimum: Number.parseInt(match[1], 10),
        maximum: Number.parseInt(match[2], 10),
      };
    }
    return null;
  }

  function normalizedTechLevelFilter(value) {
    const candidate = stringValue(value).trim();
    if (candidate === "unknown" || /^max:\d+$/.test(candidate)) return candidate;
    return "any";
  }

  function matchesTechLevel(item, filterValue) {
    const filter = normalizedTechLevelFilter(filterValue);
    if (filter === "any") return true;
    const parsed = parseTechLevel(item && item.sheet && item.sheet.tl);
    if (filter === "unknown") return parsed === null;
    if (!parsed) return false;
    const maximum = Number.parseInt(filter.slice(4), 10);
    return parsed.minimum <= maximum;
  }

  function techLevelFilterLabel(filterValue) {
    const filter = normalizedTechLevelFilter(filterValue);
    if (filter === "unknown") return "unknown or variable TL";
    if (filter.startsWith("max:")) return `up to TL ${filter.slice(4)}`;
    return "any Tech Level";
  }

  function normalizeLawLevel(value) {
    const candidate = stringValue(value).trim().toLocaleLowerCase();
    return LAW_LEVEL_VALUES.has(candidate) ? candidate : "undetermined";
  }

  function normalizedLawLevelFilter(value) {
    const candidate = stringValue(value).trim().toLocaleLowerCase();
    return candidate === "any" || LAW_LEVEL_VALUES.has(candidate) ? candidate : "any";
  }

  function matchesLawLevel(item, filterValue) {
    const filter = normalizedLawLevelFilter(filterValue);
    return filter === "any" || item.lawLevel === filter;
  }

  function lawLevelFilterLabel(filterValue) {
    const filter = normalizedLawLevelFilter(filterValue);
    if (filter === "any") return "any restriction level";
    if (filter === "undetermined") return "undetermined restriction level";
    return `first restricted at Law Level ${filter}`;
  }

  function lawLevelValueLabel(value) {
    const lawLevel = normalizeLawLevel(value);
    return lawLevel === "undetermined"
      ? "First restricted Law Level: undetermined"
      : `First restricted Law Level: ${lawLevel}`;
  }

  function normalizeLegalCategory(value) {
    const candidate = stringValue(value).trim().toLocaleLowerCase();
    return LEGAL_CATEGORY_VALUES.has(candidate) ? candidate : "undetermined";
  }

  function normalizedLegalCategoryFilter(value) {
    const candidate = stringValue(value).trim().toLocaleLowerCase();
    return candidate === "any" || LEGAL_CATEGORY_VALUES.has(candidate)
      ? candidate
      : "any";
  }

  function matchesLegalCategory(item, filterValue) {
    const filter = normalizedLegalCategoryFilter(filterValue);
    return filter === "any" || item.legalCategory === filter;
  }

  function legalCategoryLabel(value) {
    const category = normalizeLegalCategory(value);
    return `Legal category: ${LEGAL_CATEGORY_LABELS[category]}`;
  }

  function legalCategoryFilterLabel(filterValue) {
    const filter = normalizedLegalCategoryFilter(filterValue);
    return filter === "any" ? "any legal category" : LEGAL_CATEGORY_LABELS[filter];
  }

  function unresolvedSkillFilterValue() {
    return firstString(
      skillFilterReference && skillFilterReference.unresolvedValue,
      DEFAULT_UNRESOLVED_SKILL_FILTER
    );
  }

  function skillOptionsForKind(kind) {
    const normalizedKind = normalizeKind(kind);
    if (!normalizedKind || !skillFilterReference) return [];
    return skillFilterReference.optionsByKind[normalizedKind] || [];
  }

  function normalizedSkillFilter(value, kind) {
    const candidate = stringValue(value).trim();
    if (candidate === "any" || candidate === unresolvedSkillFilterValue()) {
      return candidate;
    }
    return skillOptionsForKind(kind).some((option) => option.value === candidate)
      ? candidate
      : "any";
  }

  function itemHasUnresolvedSkill(item) {
    if (!item || item.requiredSkills.length > 0) return false;
    if (item.kind === "weapon") {
      return (
        item.requiredSkillStatus === "ambiguous" ||
        item.requiredSkillStatus === "unresolved"
      );
    }
    return !item.requiredSkillStatus;
  }

  function matchesSkill(item, filterValue, kind = item && item.kind) {
    const filter = normalizedSkillFilter(filterValue, kind);
    if (filter === "any") return true;
    if (filter === unresolvedSkillFilterValue()) {
      return itemHasUnresolvedSkill(item);
    }
    return item.requiredSkills.some((requirement) =>
      requirement.filterValues.includes(filter)
    );
  }

  function skillFilterLabel(filterValue, kind) {
    const filter = normalizedSkillFilter(filterValue, kind);
    if (filter === "any") return "any skill requirement";
    if (filter === unresolvedSkillFilterValue()) {
      return firstString(
        skillFilterReference && skillFilterReference.unresolvedLabel,
        "unresolved or not recorded"
      ).toLocaleLowerCase();
    }
    const option = skillOptionsForKind(kind).find(
      (candidate) => candidate.value === filter
    );
    return option ? option.label : "any skill requirement";
  }

  function normalizedSortOrder(value) {
    const candidate = stringValue(value).trim();
    return SORT_VALUES.has(candidate) ? candidate : "name";
  }

  function sortOrderLabel(value) {
    const sortOrder = normalizedSortOrder(value);
    if (sortOrder === "tech-asc") return "Tech Level low to high";
    if (sortOrder === "tech-desc") return "Tech Level high to low";
    return "name A to Z";
  }

  function filterDescription(state) {
    return [
      techLevelFilterLabel(state.techLevelFilter),
      lawLevelFilterLabel(state.lawLevelFilter),
      legalCategoryFilterLabel(state.legalCategoryFilter),
      skillFilterLabel(state.skillFilter, state.activeKind),
      `sorted by ${sortOrderLabel(state.sortOrder)}`,
    ].join(" · ");
  }

  function createElement(tagName, className = "", text = "") {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function normalizeKind(value) {
    const kind = stringValue(value).trim().toLowerCase();
    if (kind === "armor") return "armour";
    return Object.prototype.hasOwnProperty.call(SECTION_LABELS, kind) ? kind : "";
  }

  function normalizeSourceReference(value) {
    if (!isRecord(value)) return null;
    const title = firstString(value.title, value.bookTitle, value.book_title);
    if (!title) return null;

    const pages = Array.isArray(value.pages)
      ? value.pages
      : Array.isArray(value.printedPages)
        ? value.printedPages
        : Array.isArray(value.printed_pages)
          ? value.printed_pages
          : Array.isArray(value.pdfPages)
            ? value.pdfPages
            : Array.isArray(value.pdf_pages)
              ? value.pdf_pages
              : [];

    return {
      title,
      pages: uniqueStrings(pages.map((page) => stringValue(page).trim())),
      pageBasis: firstString(value.pageBasis, value.page_basis),
      referenceType: firstString(value.referenceType, value.reference_type),
    };
  }

  function normalizeSourceReferences(value) {
    if (!Array.isArray(value)) return [];
    const seen = new Set();
    return value.reduce((references, rawReference) => {
      const reference = normalizeSourceReference(rawReference);
      if (!reference) return references;
      const key = `${reference.title}|${reference.pages.join(",")}|${reference.pageBasis}|${reference.referenceType}`;
      if (seen.has(key)) return references;
      seen.add(key);
      references.push(reference);
      return references;
    }, []);
  }

  function normalizeExamples(value) {
    if (!Array.isArray(value)) return [];
    return uniqueStrings(
      value.map((example) =>
        isRecord(example)
          ? firstString(
              example.displayName,
              example.display_name,
              example.name,
              example.title,
              example.label,
              example.description
            )
          : firstString(example)
      )
    );
  }

  function normalizeSkillFilterReference(value) {
    if (!isRecord(value)) return null;
    const rawOptionsByKind = isRecord(value.optionsByKind)
      ? value.optionsByKind
      : isRecord(value.options_by_kind)
        ? value.options_by_kind
        : {};
    const optionsByKind = {};
    Object.keys(SECTION_LABELS).forEach((kind) => {
      const seen = new Set();
      const rawOptions = Array.isArray(rawOptionsByKind[kind])
        ? rawOptionsByKind[kind]
        : [];
      optionsByKind[kind] = rawOptions.reduce((options, rawOption) => {
        if (!isRecord(rawOption)) return options;
        const optionValue = firstString(rawOption.value);
        const label = firstString(rawOption.label);
        if (!optionValue || !label || seen.has(optionValue)) return options;
        seen.add(optionValue);
        const minimumLevel = Number.parseInt(
          firstString(rawOption.minimumLevel, rawOption.minimum_level),
          10
        );
        options.push({
          value: optionValue,
          label,
          optionType: firstString(rawOption.optionType, rawOption.option_type),
          familyId: firstString(rawOption.familyId, rawOption.family_id),
          familyLabel: firstString(rawOption.familyLabel, rawOption.family_label),
          specialityId: firstString(
            rawOption.specialityId,
            rawOption.speciality_id
          ),
          specialityLabel: firstString(
            rawOption.specialityLabel,
            rawOption.speciality_label
          ),
          minimumLevel: Number.isInteger(minimumLevel) ? minimumLevel : null,
          variantCount: Number.parseInt(
            firstString(rawOption.variantCount, rawOption.variant_count, "0"),
            10
          ),
        });
        return options;
      }, []);
    });
    const unresolvedValue = firstString(
      value.unresolvedValue,
      value.unresolved_value,
      DEFAULT_UNRESOLVED_SKILL_FILTER
    );
    return {
      valueSemantics: firstString(value.valueSemantics, value.value_semantics),
      filterSemantics: firstString(value.filterSemantics, value.filter_semantics),
      unresolvedValue,
      unresolvedLabel: firstString(
        value.unresolvedLabel,
        value.unresolved_label,
        "Unresolved or not recorded"
      ),
      optionsByKind,
    };
  }

  function normalizeRequiredSkills(value) {
    if (!Array.isArray(value)) return [];
    return value.reduce((requirements, rawRequirement) => {
      if (!isRecord(rawRequirement)) return requirements;
      const familyId = firstString(
        rawRequirement.familyId,
        rawRequirement.family_id
      );
      const filterValues = stringList(
        rawRequirement.filterValues || rawRequirement.filter_values
      );
      if (!familyId || filterValues.length === 0) return requirements;
      const minimumLevel = Number.parseInt(
        firstString(rawRequirement.minimumLevel, rawRequirement.minimum_level),
        10
      );
      requirements.push({
        familyId,
        familyLabel: firstString(
          rawRequirement.familyLabel,
          rawRequirement.family_label
        ),
        specialityId: firstString(
          rawRequirement.specialityId,
          rawRequirement.speciality_id
        ),
        specialityLabel: firstString(
          rawRequirement.specialityLabel,
          rawRequirement.speciality_label
        ),
        minimumLevel: Number.isInteger(minimumLevel) ? minimumLevel : null,
        condition: firstString(rawRequirement.condition),
        raw: firstString(rawRequirement.raw),
        fieldState: firstString(
          rawRequirement.fieldState,
          rawRequirement.field_state
        ),
        filterValues: uniqueStrings(filterValues),
      });
      return requirements;
    }, []);
  }

  function normalizeLawLevelReference(value) {
    if (!isRecord(value)) return null;
    const rawLevels = Array.isArray(value.levels) ? value.levels : [];
    const levels = rawLevels.reduce((normalizedLevels, rawLevel) => {
      if (!isRecord(rawLevel)) return normalizedLevels;
      const levelValue = normalizeLawLevel(rawLevel.value);
      if (levelValue === "undetermined") return normalizedLevels;
      const rawGuidance = isRecord(rawLevel.guidanceByKind)
        ? rawLevel.guidanceByKind
        : isRecord(rawLevel.guidance_by_kind)
          ? rawLevel.guidance_by_kind
          : {};
      const guidanceByKind = {};
      Object.keys(SECTION_LABELS).forEach((kind) => {
        const guidance = isRecord(rawGuidance[kind]) ? rawGuidance[kind] : {};
        guidanceByKind[kind] = {
          ruleStatus: firstString(guidance.ruleStatus, guidance.rule_status),
          shortLabel: firstString(guidance.shortLabel, guidance.short_label),
          description: firstString(guidance.description),
          sourceReferences: normalizeSourceReferences(
            guidance.sourceReferences || guidance.source_references
          ),
        };
      });
      normalizedLevels.push({
        value: levelValue,
        title: firstString(rawLevel.title, `Law Level ${levelValue}`),
        summary: firstString(rawLevel.summary),
        cumulative: rawLevel.cumulative === true,
        guidanceByKind,
      });
      return normalizedLevels;
    }, []);

    if (levels.length === 0) return null;
    return {
      description: firstString(value.description),
      undeterminedDescription: firstString(
        value.undeterminedDescription,
        value.undetermined_description
      ),
      undeterminedShortLabel: firstString(
        value.undeterminedShortLabel,
        value.undetermined_short_label
      ),
      sourceReferences: normalizeSourceReferences(
        value.sourceReferences || value.source_references
      ),
      levels,
    };
  }

  function normalizeTechLevelReference(value) {
    if (!isRecord(value)) return null;
    const rawLevels = Array.isArray(value.levels) ? value.levels : [];
    const levels = rawLevels.reduce((normalizedLevels, rawLevel) => {
      if (!isRecord(rawLevel)) return normalizedLevels;
      const numericValue = Number.parseInt(firstString(rawLevel.value), 10);
      if (!Number.isInteger(numericValue) || numericValue < 0 || numericValue > 15) {
        return normalizedLevels;
      }
      normalizedLevels.push({
        value: numericValue,
        band: firstString(rawLevel.band),
        title: firstString(rawLevel.title, `Tech Level ${numericValue}`),
        shortLabel: firstString(rawLevel.shortLabel, rawLevel.short_label),
        summary: firstString(rawLevel.summary),
        sourceReferences: normalizeSourceReferences(
          rawLevel.sourceReferences || rawLevel.source_references
        ),
      });
      return normalizedLevels;
    }, []);

    const rawHigherLevels = isRecord(value.higherLevels)
      ? value.higherLevels
      : isRecord(value.higher_levels)
        ? value.higher_levels
        : {};
    const higherMinimum = Number.parseInt(
      firstString(rawHigherLevels.minimum, "16"),
      10
    );
    const higherLevels = {
      minimum:
        Number.isInteger(higherMinimum) && higherMinimum >= 16
          ? higherMinimum
          : 16,
      band: firstString(rawHigherLevels.band),
      title: firstString(rawHigherLevels.title, "Tech Level 16+"),
      shortLabel: firstString(
        rawHigherLevels.shortLabel,
        rawHigherLevels.short_label
      ),
      summary: firstString(rawHigherLevels.summary),
      sourceReferences: normalizeSourceReferences(
        rawHigherLevels.sourceReferences || rawHigherLevels.source_references
      ),
    };

    const rawGuidance = isRecord(value.guidanceByKind)
      ? value.guidanceByKind
      : isRecord(value.guidance_by_kind)
        ? value.guidance_by_kind
        : {};
    const guidanceByKind = {};
    Object.keys(SECTION_LABELS).forEach((kind) => {
      const guidance = isRecord(rawGuidance[kind]) ? rawGuidance[kind] : {};
      guidanceByKind[kind] = {
        valueRole: firstString(guidance.valueRole, guidance.value_role),
        description: firstString(guidance.description),
        sourceReferences: normalizeSourceReferences(
          guidance.sourceReferences || guidance.source_references
        ),
      };
    });

    const description = firstString(value.description);
    if (!description && levels.length === 0 && !higherLevels.summary) return null;
    return {
      rulesContext: firstString(value.rulesContext, value.rules_context),
      valueSemantics: firstString(value.valueSemantics, value.value_semantics),
      description,
      filterSemantics: firstString(value.filterSemantics, value.filter_semantics),
      unknownDescription: firstString(
        value.unknownDescription,
        value.unknown_description
      ),
      unknownShortLabel: firstString(
        value.unknownShortLabel,
        value.unknown_short_label
      ),
      levels,
      higherLevels,
      guidanceByKind,
      sourceReferences: normalizeSourceReferences(
        value.sourceReferences || value.source_references
      ),
      notes: firstString(value.notes),
    };
  }

  function normalizeLegalCategoryReference(value) {
    if (!isRecord(value)) return null;
    const rawCategories = Array.isArray(value.categories) ? value.categories : [];
    const categories = rawCategories.reduce((normalizedCategories, rawCategory) => {
      if (!isRecord(rawCategory)) return normalizedCategories;
      const categoryValue = normalizeLegalCategory(rawCategory.value);
      if (categoryValue === "undetermined") return normalizedCategories;
      const ordinal = Number.parseInt(firstString(rawCategory.ordinal), 10);
      if (!Number.isInteger(ordinal)) return normalizedCategories;

      const rawGuidance = isRecord(rawCategory.guidanceByKind)
        ? rawCategory.guidanceByKind
        : isRecord(rawCategory.guidance_by_kind)
          ? rawCategory.guidance_by_kind
          : {};
      const guidanceByKind = {};
      Object.keys(SECTION_LABELS).forEach((kind) => {
        const guidance = isRecord(rawGuidance[kind]) ? rawGuidance[kind] : {};
        guidanceByKind[kind] = {
          ruleStatus: firstString(guidance.ruleStatus, guidance.rule_status),
          shortLabel: firstString(guidance.shortLabel, guidance.short_label),
          description: firstString(guidance.description),
          examples: normalizeExamples(guidance.examples),
          sourceReferences: normalizeSourceReferences(
            guidance.sourceReferences || guidance.source_references
          ),
        };
      });

      const rawPriceMultiplier = isRecord(rawCategory.priceMultiplier)
        ? rawCategory.priceMultiplier
        : isRecord(rawCategory.price_multiplier)
          ? rawCategory.price_multiplier
          : {};
      normalizedCategories.push({
        value: categoryValue,
        ordinal,
        title: firstString(rawCategory.title),
        shortLabel: firstString(rawCategory.shortLabel, rawCategory.short_label),
        summary: firstString(rawCategory.summary),
        description: firstString(rawCategory.description),
        priceMultiplier: {
          kind: firstString(rawPriceMultiplier.kind),
          value: firstString(rawPriceMultiplier.value),
          shortLabel: firstString(
            rawPriceMultiplier.shortLabel,
            rawPriceMultiplier.short_label
          ),
        },
        guidanceByKind,
        sourceReferences: normalizeSourceReferences(
          rawCategory.sourceReferences || rawCategory.source_references
        ),
      });
      return normalizedCategories;
    }, []);

    if (categories.length === 0) return null;
    categories.sort((left, right) => left.ordinal - right.ordinal);
    return {
      rulesContext: firstString(value.rulesContext, value.rules_context),
      valueSemantics: firstString(value.valueSemantics, value.value_semantics),
      description: firstString(value.description),
      filterSemantics: firstString(
        value.filterSemantics,
        value.filter_semantics
      ),
      contextNotice: firstString(value.contextNotice, value.context_notice),
      blackMarketDescription: firstString(
        value.blackMarketDescription,
        value.black_market_description
      ),
      categories,
      undeterminedShortLabel: firstString(
        value.undeterminedShortLabel,
        value.undetermined_short_label
      ),
      undeterminedDescription: firstString(
        value.undeterminedDescription,
        value.undetermined_description
      ),
      sourceReferences: normalizeSourceReferences(
        value.sourceReferences || value.source_references
      ),
      notes: firstString(value.notes),
    };
  }

  function sheetField(sheet, camelName, snakeName, ...fallbacks) {
    return firstString(
      isRecord(sheet) ? sheet[camelName] : "",
      isRecord(sheet) ? sheet[snakeName] : "",
      ...fallbacks
    );
  }

  function normalizeSheet(raw, kind, displayName) {
    const sheet = isRecord(raw.sheet) ? raw.sheet : {};
    const techLevel = firstString(
      raw.techLevel,
      raw.tech_level,
      raw.techLevelRaw,
      raw.tech_level_raw
    );
    const mass = firstString(raw.mass, raw.massRaw, raw.mass_raw);
    const cost = firstString(
      raw.cost,
      raw.price,
      raw.priceRaw,
      raw.price_raw
    );

    if (kind === "weapon") {
      return {
        name: sheetField(sheet, "name", "name", displayName),
        tl: sheetField(sheet, "tl", "tl", techLevel),
        skill: sheetField(
          sheet,
          "skill",
          "skill",
          raw.requiredSkill,
          raw.required_skill,
          raw.skill
        ),
        damage: sheetField(sheet, "damage", "damage", raw.damage, raw.damageRaw, raw.damage_raw),
        range: sheetField(sheet, "range", "range", raw.range, raw.rangeRaw, raw.range_raw),
        weight: sheetField(sheet, "weight", "weight", mass),
        magazine: sheetField(
          sheet,
          "magazine",
          "magazine",
          raw.magazine,
          raw.magazineRaw,
          raw.magazine_raw
        ),
      };
    }

    if (kind === "armour") {
      return {
        name: sheetField(sheet, "name", "name", displayName),
        rating: sheetField(
          sheet,
          "rating",
          "rating",
          raw.protection,
          raw.protectionRaw,
          raw.protection_raw
        ),
        tl: sheetField(sheet, "tl", "tl", techLevel),
        radiation: sheetField(
          sheet,
          "radiation",
          "radiation",
          raw.radiation,
          raw.radiationRaw,
          raw.radiation_raw
        ),
      };
    }

    if (kind === "augment") {
      return {
        type: sheetField(sheet, "type", "type", displayName),
        tl: sheetField(sheet, "tl", "tl", techLevel),
        improvement: sheetField(
          sheet,
          "improvement",
          "improvement",
          raw.improvement,
          raw.statLine,
          raw.stat_line
        ),
      };
    }

    return {
      name: sheetField(sheet, "name", "name", displayName),
      tl: sheetField(sheet, "tl", "tl", techLevel),
      mass: sheetField(sheet, "mass", "mass", mass),
      cost: sheetField(sheet, "cost", "cost", cost),
    };
  }

  function normalizeEntry(raw, defaults = {}) {
    if (!isRecord(raw)) return null;
    const itemId = firstString(raw.itemId, raw.item_id);
    const kind = normalizeKind(raw.kind);
    if (!itemId || !kind) return null;

    const displayName = firstString(
      raw.displayName,
      raw.display_name,
      raw.canonicalName,
      raw.canonical_name,
      itemId
    );
    const canonicalName = firstString(
      raw.canonicalName,
      raw.canonical_name,
      displayName
    );
    const sourceReferences = normalizeSourceReferences(
      raw.sourceReferences || raw.source_references
    );
    const sheetRole = firstString(raw.sheetRole, raw.sheet_role, "inventory");
    const domains = stringList(raw.domains);
    const statLine = firstString(raw.statLine, raw.stat_line);
    const descriptionSummary = firstString(
      raw.descriptionSummary,
      raw.description_summary,
      raw.description
    );
    const rulesSummary = firstString(raw.rulesSummary, raw.rules_summary);
    const techLevelDescription = firstString(
      raw.techLevelDescription,
      raw.tech_level_description
    );
    const techLevelSourceReferences = normalizeSourceReferences(
      raw.techLevelSourceReferences || raw.tech_level_source_references
    );
    const lawLevelDescription = firstString(
      raw.lawLevelDescription,
      raw.law_level_description
    );
    const lawLevelSourceReferences = normalizeSourceReferences(
      raw.lawLevelSourceReferences || raw.law_level_source_references
    );
    const sheet = normalizeSheet(raw, kind, displayName);
    const lawLevel = normalizeLawLevel(firstString(raw.lawLevel, raw.law_level));
    const legalCategory = normalizeLegalCategory(
      firstString(raw.legalCategory, raw.legal_category)
    );
    const requiredSkillStatus = firstString(
      raw.requiredSkillStatus,
      raw.required_skill_status
    );
    const requiredSkills = normalizeRequiredSkills(
      raw.requiredSkills || raw.required_skills
    );
    const skill = firstString(raw.skill, raw.requiredSkill, raw.required_skill);
    if (
      kind === "weapon" &&
      (requiredSkillStatus === "ambiguous" ||
        requiredSkillStatus === "unresolved")
    ) {
      sheet.skill = "";
    }
    const searchParts = [
      canonicalName,
      displayName,
      statLine,
      sheetRole,
      ...domains,
      ...Object.values(sheet),
      skill,
      ...requiredSkills.flatMap((requirement) => [
        requirement.familyLabel,
        requirement.specialityLabel,
        requirement.raw,
      ]),
      lawLevel,
      legalCategory,
      firstString(raw.searchText, raw.search_text),
    ];

    return {
      itemId,
      definitionId: firstString(raw.definitionId, raw.definition_id),
      variantId: firstString(raw.variantId, raw.variant_id),
      schemaVersion: firstString(
        raw.schemaVersion,
        raw.schema_version,
        defaults.schemaVersion
      ),
      catalogVersion: firstString(
        raw.catalogVersion,
        raw.catalog_version,
        defaults.catalogVersion
      ),
      kind,
      sheetRole,
      personalDefault: raw.personalDefault === true || raw.personal_default === true,
      summaryStatus: firstString(raw.summaryStatus, raw.summary_status),
      reviewFlags: stringList(raw.reviewFlags || raw.review_flags),
      requiredSkillStatus,
      requiredSkills,
      skill,
      domains,
      combatScale: firstString(raw.combatScale, raw.combat_scale),
      mountContext: firstString(raw.mountContext, raw.mount_context),
      lawLevel,
      legalCategory,
      canonicalName,
      displayName,
      statLine,
      descriptionSummary,
      rulesSummary,
      techLevelDescription,
      techLevelSourceReferences,
      lawLevelDescription,
      lawLevelSourceReferences,
      sourceReferences,
      detailShard: firstString(raw.detailShard, raw.detail_shard),
      sheet,
      searchText: searchParts.join(" ").toLocaleLowerCase(),
    };
  }

  function schemaMajor(version) {
    const match = stringValue(version).match(/^(\d+)/);
    return match ? Number.parseInt(match[1], 10) : null;
  }

  function assertResponse(response, label) {
    if (!response.ok) {
      throw new Error(`${label} returned HTTP ${response.status}.`);
    }
    return response;
  }

  function resolveCatalogUrl(relativePath, baseUrl) {
    return new URL(relativePath, baseUrl).toString();
  }

  async function loadJson(url, label) {
    const response = await fetch(url, {
      cache: "no-cache",
      headers: { Accept: "application/json" },
    });
    assertResponse(response, label);
    return response.json();
  }

  async function loadManifestDocument() {
    const manifestUrl = resolveCatalogUrl(CATALOG_MANIFEST, document.baseURI);
    const manifest = await loadJson(manifestUrl, "The gear catalog manifest");
    if (!isRecord(manifest)) {
      throw new Error("The gear catalog manifest is not a JSON object.");
    }

    const schemaVersion = firstString(
      manifest.schemaVersion,
      manifest.schema_version
    );
    const major = schemaMajor(schemaVersion);
    if (major !== null && !SUPPORTED_SCHEMA_MAJORS.has(major)) {
      throw new Error(
        `Gear catalog schema ${schemaVersion} is not supported by this character sheet.`
      );
    }

    techLevelReference = normalizeTechLevelReference(
      manifest.techLevelReference || manifest.tech_level_reference
    );
    lawLevelReference = normalizeLawLevelReference(
      manifest.lawLevelReference || manifest.law_level_reference
    );
    legalCategoryReference = normalizeLegalCategoryReference(
      manifest.legalCategoryReference || manifest.legal_category_reference
    );
    skillFilterReference = normalizeSkillFilterReference(
      manifest.skillFilterReference || manifest.skill_filter_reference
    );
    return { manifest, manifestUrl, schemaVersion };
  }

  async function ensureManifest() {
    if (manifestDocument) return manifestDocument;
    if (manifestPromise) return manifestPromise;
    manifestPromise = loadManifestDocument()
      .then((document) => {
        manifestDocument = document;
        populateSkillFilters();
        updateAllTechLevelHelp();
        updateAllLawLevelHelp();
        updateAllLegalCategoryHelp();
        return document;
      })
      .catch((error) => {
        manifestPromise = null;
        throw error;
      });
    return manifestPromise;
  }

  async function loadCatalog() {
    const { manifest, manifestUrl, schemaVersion } = await ensureManifest();

    const indexDeclaration = manifest.index;
    const indexPath = firstString(
      typeof indexDeclaration === "string" ? indexDeclaration : "",
      isRecord(indexDeclaration) ? indexDeclaration.path : "",
      manifest.indexPath,
      manifest.index_path,
      "index.json"
    );
    const indexUrl = resolveCatalogUrl(indexPath, manifestUrl);
    const index = await loadJson(indexUrl, "The gear catalog index");
    const rawItems = Array.isArray(index && index.items)
      ? index.items
      : Array.isArray(index && index.entries)
        ? index.entries
        : [];
    if (rawItems.length === 0) {
      throw new Error("The gear catalog index does not contain any items.");
    }

    const defaults = {
      schemaVersion: firstString(
        index.schemaVersion,
        index.schema_version,
        schemaVersion
      ),
      catalogVersion: firstString(
        index.catalogVersion,
        index.catalog_version,
        manifest.catalogVersion,
        manifest.catalog_version
      ),
    };
    const items = rawItems
      .map((item) => normalizeEntry(item, defaults))
      .filter(Boolean)
      .sort((left, right) =>
        left.displayName.localeCompare(right.displayName, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      );

    if (items.length === 0) {
      throw new Error("The gear catalog index has no supported gear items.");
    }

    const itemsByVariantId = new Map();
    const itemsByItemId = new Map();
    items.forEach((item) => {
      if (item.variantId) itemsByVariantId.set(item.variantId, item);
      const variants = itemsByItemId.get(item.itemId) || [];
      variants.push(item);
      itemsByItemId.set(item.itemId, variants);
    });
    return {
      manifest,
      manifestUrl,
      schemaVersion: defaults.schemaVersion,
      catalogVersion: defaults.catalogVersion,
      items,
      itemsByVariantId,
      itemsByItemId,
    };
  }

  function findManifestShard(itemId) {
    if (!catalog || !Array.isArray(catalog.manifest.detailShards)) return "";
    const shard = catalog.manifest.detailShards.find((candidate) => {
      if (!isRecord(candidate) || !Array.isArray(candidate.itemIds)) return false;
      return candidate.itemIds.includes(itemId);
    });
    return shard ? firstString(shard.path) : "";
  }

  async function loadItemDetails(item) {
    const shardPath = item.detailShard || findManifestShard(item.itemId);
    if (!shardPath) return item;

    const shardUrl = resolveCatalogUrl(shardPath, catalog.manifestUrl);
    if (!detailShardCache.has(shardUrl)) {
      detailShardCache.set(
        shardUrl,
        loadJson(shardUrl, `The ${shardPath} gear detail shard`)
      );
    }

    const shard = await detailShardCache.get(shardUrl);
    const rawItems = Array.isArray(shard && shard.items)
      ? shard.items
      : Array.isArray(shard && shard.entries)
        ? shard.entries
        : [];
    const rawDetail = rawItems.find(
      (candidate) =>
        firstString(
          candidate && candidate.variantId,
          candidate && candidate.variant_id
        ) === item.variantId
    );
    if (!rawDetail) {
      throw new Error(`The detail record for ${item.displayName} was not found.`);
    }

    const detailReferences = normalizeSourceReferences(
      rawDetail.sourceReferences || rawDetail.source_references
    );
    const detailLawLevelReferences = normalizeSourceReferences(
      rawDetail.lawLevelSourceReferences ||
        rawDetail.law_level_source_references
    );
    const detailTechLevelReferences = normalizeSourceReferences(
      rawDetail.techLevelSourceReferences ||
        rawDetail.tech_level_source_references
    );
    const requiredSkillStatus = firstString(
      rawDetail.requiredSkillStatus,
      rawDetail.required_skill_status,
      item.requiredSkillStatus
    );
    const detail = {
      ...item,
      summaryStatus: firstString(
        rawDetail.summaryStatus,
        rawDetail.summary_status,
        item.summaryStatus
      ),
      reviewFlags:
        Array.isArray(rawDetail.reviewFlags) || Array.isArray(rawDetail.review_flags)
          ? stringList(rawDetail.reviewFlags || rawDetail.review_flags)
          : item.reviewFlags,
      requiredSkillStatus,
      descriptionSummary: firstString(
        rawDetail.descriptionSummary,
        rawDetail.description_summary,
        item.descriptionSummary
      ),
      rulesSummary: firstString(
        rawDetail.rulesSummary,
        rawDetail.rules_summary,
        item.rulesSummary
      ),
      techLevelDescription: firstString(
        rawDetail.techLevelDescription,
        rawDetail.tech_level_description,
        item.techLevelDescription
      ),
      techLevelSourceReferences:
        detailTechLevelReferences.length > 0
          ? detailTechLevelReferences
          : item.techLevelSourceReferences,
      lawLevelDescription: firstString(
        rawDetail.lawLevelDescription,
        rawDetail.law_level_description,
        item.lawLevelDescription
      ),
      lawLevelSourceReferences:
        detailLawLevelReferences.length > 0
          ? detailLawLevelReferences
          : item.lawLevelSourceReferences,
      sourceReferences:
        detailReferences.length > 0
          ? detailReferences
          : item.sourceReferences,
    };
    if (
      item.kind === "weapon" &&
      (requiredSkillStatus === "ambiguous" ||
        requiredSkillStatus === "unresolved")
    ) {
      detail.sheet = { ...item.sheet, skill: "" };
    }
    return detail;
  }

  function createControl(labelText, control, className = "gear-catalog-control") {
    const wrapper = createElement("div", className);
    const label = createElement("label", "", labelText);
    label.htmlFor = control.id;
    wrapper.append(label, control);
    return wrapper;
  }

  function createLocker(root) {
    const app = root.querySelector("[data-gear-catalog-app]");
    if (!app) return null;

    const shell = createElement("div", "gear-locker-shell");
    const header = createElement("header", "gear-locker-header");
    const headerCopy = createElement("div", "gear-locker-header-copy");
    const title = createElement("h2", "", "Gear locker");
    title.id = "gear-locker-heading";
    const intro = createElement(
      "p",
      "gear-locker-intro",
      "Find an exact rules variant, review what it does, and add it to this character."
    );
    headerCopy.append(title, intro);
    const close = createElement("button", "gear-locker-close", "Done");
    close.type = "button";
    close.title = "Close the gear locker";
    header.append(headerCopy, close);

    const kindTabs = createElement("div", "gear-locker-kind-tabs");
    kindTabs.setAttribute("role", "tablist");
    kindTabs.setAttribute("aria-label", "Gear type");
    const kindTabButtons = new Map();
    Object.entries(SECTION_TITLES).forEach(([kind, label]) => {
      const button = createElement("button", "gear-locker-kind-tab");
      button.type = "button";
      button.id = `gear-locker-tab-${kind}`;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", "gear-locker-results");
      button.setAttribute("aria-selected", "false");
      button.tabIndex = -1;
      const text = createElement("span", "gear-locker-kind-label", label);
      const count = createElement("span", "gear-locker-kind-count", "0");
      button.append(text, count);
      button.disabled = true;
      kindTabs.appendChild(button);
      kindTabButtons.set(kind, { button, count });
    });

    const controls = createElement("div", "gear-locker-controls");
    const search = document.createElement("input");
    search.type = "search";
    search.id = "gear-locker-search";
    search.className = "form-control";
    search.autocomplete = "off";
    search.placeholder = "Search weapons by name, stat, skill, or book";
    search.disabled = true;

    const scopeControl = createElement("fieldset", "gear-locker-scope");
    const scopeLegend = createElement("legend", "", "Show");
    const scopeButtons = createElement("div", "gear-locker-scope-buttons");
    const personalScope = createElement("button", "gear-locker-scope-button", "Personal");
    personalScope.type = "button";
    personalScope.dataset.scope = "personal";
    personalScope.setAttribute("aria-pressed", "true");
    personalScope.disabled = true;
    const allScope = createElement("button", "gear-locker-scope-button", "All entries");
    allScope.type = "button";
    allScope.dataset.scope = "all";
    allScope.setAttribute("aria-pressed", "false");
    allScope.disabled = true;
    scopeButtons.append(personalScope, allScope);
    scopeControl.append(scopeLegend, scopeButtons);
    controls.append(
      createControl("Search the gear catalog", search, "gear-locker-search-control"),
      scopeControl
    );

    const workbench = createElement("div", "gear-locker-workbench");
    const resultsPanel = createElement("section", "gear-locker-results-panel");
    const resultsHeader = createElement("div", "gear-locker-results-header");
    const resultsHeading = createElement("h3", "", "Browse weapons");
    resultsHeading.id = "gear-locker-results-heading";
    const resultsSummary = createElement("p", "gear-locker-results-summary");
    resultsHeader.append(resultsHeading, resultsSummary);

    const results = createElement("ul", "gear-locker-results");
    results.id = "gear-locker-results";
    results.tabIndex = 0;
    results.setAttribute("role", "listbox");
    results.setAttribute("aria-labelledby", resultsHeading.id);
    search.setAttribute("aria-controls", results.id);
    personalScope.setAttribute("aria-controls", results.id);
    allScope.setAttribute("aria-controls", results.id);
    const moreWrap = createElement("div", "gear-locker-more-wrap");
    const more = createElement("button", "gear-locker-more", "Show more results");
    more.type = "button";
    more.hidden = true;
    moreWrap.appendChild(more);
    resultsPanel.append(resultsHeader, results, moreWrap);

    const detail = createElement("article", "gear-locker-detail");
    detail.id = "gear-locker-detail";
    detail.hidden = true;
    const back = createElement("button", "gear-locker-back", "Back to results");
    back.type = "button";
    const detailTitle = createElement("h3");
    detailTitle.id = "gear-locker-detail-title";
    detailTitle.tabIndex = -1;
    const detailMeta = createElement("p", "gear-locker-detail-meta");
    const detailContext = createElement("p", "gear-locker-detail-context");
    const variantChooser = createElement("section", "gear-locker-variants");
    variantChooser.hidden = true;
    const variantHeading = createElement("h4", "", "Choose an exact version");
    const variantList = createElement("div", "gear-locker-variant-list");
    variantChooser.append(variantHeading, variantList);
    const detailContent = createElement("div", "gear-locker-detail-content");
    const reviewNotice = createElement("div", "gear-locker-review-notice");
    reviewNotice.hidden = true;
    const reviewBadge = createElement(
      "span",
      "gear-locker-review-badge",
      "Source review needed"
    );
    const reviewReasons = createElement("ul", "gear-locker-review-reasons");
    reviewNotice.append(reviewBadge, reviewReasons);
    const techLevelDisclosure = document.createElement("details");
    techLevelDisclosure.className = "gear-locker-tech-level-disclosure";
    const techLevelSummary = createElement(
      "summary",
      "",
      "Tech Level: definition and source"
    );
    const techLevelBody = createElement("div", "gear-locker-tech-level-body");
    const techLevelDescription = createElement(
      "p",
      "gear-locker-detail-copy gear-locker-tech-level-copy"
    );
    const techLevelReferences = createElement(
      "ul",
      "gear-locker-reference-list gear-locker-tech-level-references"
    );
    techLevelReferences.setAttribute("aria-label", "Tech Level references");
    techLevelBody.append(techLevelDescription, techLevelReferences);
    techLevelDisclosure.append(techLevelSummary, techLevelBody);
    const descriptionHeading = createElement("h4", "", "Description");
    const description = createElement("p", "gear-locker-detail-copy");
    const rulesHeading = createElement("h4", "", "How to use it");
    const rules = createElement("p", "gear-locker-detail-copy");
    const lawLevelHeading = createElement("h4", "", "Law Level");
    const lawLevelDescription = createElement(
      "p",
      "gear-locker-detail-copy gear-locker-law-level-copy"
    );
    const lawLevelReferences = createElement(
      "ul",
      "gear-locker-reference-list gear-locker-law-level-references"
    );
    lawLevelReferences.setAttribute("aria-label", "Law Level references");
    const referencesHeading = createElement("h4", "", "Rules references");
    const references = createElement("ul", "gear-locker-reference-list");

    const stateDisclosure = document.createElement("details");
    stateDisclosure.className = "gear-locker-state-disclosure";
    const stateSummary = createElement(
      "summary",
      "",
      "Quantity, equipped status, and notes"
    );
    const stateControls = createElement("div", "gear-locker-state");
    const quantity = document.createElement("input");
    quantity.type = "number";
    quantity.id = "gear-locker-quantity";
    quantity.className = "form-control";
    quantity.min = "1";
    quantity.step = "1";
    quantity.value = "1";
    const equipped = document.createElement("input");
    equipped.type = "checkbox";
    equipped.id = "gear-locker-equipped";
    equipped.className = "form-check-input";
    const equippedWrapper = createElement("div", "gear-locker-state-check");
    const equippedLabel = createElement("label", "", "Equipped or installed");
    equippedLabel.htmlFor = equipped.id;
    equippedWrapper.append(equipped, equippedLabel);
    const notes = document.createElement("textarea");
    notes.id = "gear-locker-notes";
    notes.className = "form-control";
    notes.rows = 2;
    notes.placeholder = "Optional condition, ammunition, configuration, or other character-specific notes";
    stateControls.append(
      createControl("Quantity", quantity, "gear-locker-state-control"),
      equippedWrapper,
      createControl("Character-specific notes", notes, "gear-locker-state-control gear-locker-state-notes")
    );
    stateDisclosure.append(stateSummary, stateControls);

    const actions = createElement("div", "gear-locker-actions");
    const add = createElement("button", "gear-locker-add", "Add weapon to character");
    add.type = "button";
    add.disabled = true;
    const cancelEdit = createElement(
      "button",
      "gear-locker-cancel-edit",
      "Cancel edit"
    );
    cancelEdit.type = "button";
    cancelEdit.hidden = true;
    actions.append(add, cancelEdit);

    detailContent.append(
      reviewNotice,
      techLevelDisclosure,
      descriptionHeading,
      description,
      rulesHeading,
      rules,
      lawLevelHeading,
      lawLevelDescription,
      lawLevelReferences,
      referencesHeading,
      references,
      stateDisclosure,
      actions
    );

    detail.append(
      back,
      detailTitle,
      detailMeta,
      detailContext,
      variantChooser,
      detailContent
    );
    workbench.append(resultsPanel, detail);

    const status = createElement("p", "gear-locker-status");
    status.id = "gear-locker-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.setAttribute("aria-atomic", "true");
    shell.append(header, kindTabs, controls, workbench, status);
    app.replaceChildren(shell);

    const state = {
      root,
      activeKind: "weapon",
      scopeValue: "personal",
      techLevelFilter: "any",
      lawLevelFilter: "any",
      legalCategoryFilter: "any",
      skillFilter: "any",
      sortOrder: "name",
      skillFilterByKind: new Map(
        Object.keys(SECTION_TITLES).map((kind) => [kind, "any"])
      ),
      sortOrderByKind: new Map(
        Object.keys(SECTION_TITLES).map((kind) => [kind, "name"])
      ),
      scopeByKind: new Map(Object.keys(SECTION_TITLES).map((kind) => [kind, "personal"])),
      returnFocus: null,
      search,
      scopeControl,
      personalScope,
      allScope,
      kindTabButtons,
      results,
      resultsHeading,
      resultsSummary,
      more,
      moreWrap,
      detail,
      detailTitle,
      detailMeta,
      detailContext,
      variantChooser,
      variantList,
      detailContent,
      reviewNotice,
      reviewReasons,
      techLevelDisclosure,
      techLevelSummary,
      techLevelDescription,
      techLevelReferences,
      description,
      rules,
      lawLevelDescription,
      lawLevelReferences,
      references,
      stateDisclosure,
      quantity,
      equipped,
      notes,
      add,
      cancelEdit,
      status,
      items: [],
      visibleCount: PAGE_SIZE,
      visibleItems: [],
      activeResultIndex: 0,
      selectedGroup: null,
      selectedItem: null,
      editingRow: null,
      detailRequest: 0,
      loaded: false,
    };

    root.setAttribute("aria-busy", "true");
    search.addEventListener("input", () => {
      state.visibleCount = PAGE_SIZE;
      state.activeResultIndex = 0;
      renderResults(state);
    });
    [personalScope, allScope].forEach((button) => {
      button.addEventListener("click", () => setScope(state, button.dataset.scope));
    });
    kindTabButtons.forEach(({ button }, kind) => {
      button.addEventListener("click", () => setActiveKind(state, kind));
      button.addEventListener("keydown", (event) => moveKindTab(state, kind, event));
    });
    results.addEventListener("keydown", (event) => moveResultFocus(state, event));
    more.addEventListener("click", () => {
      state.visibleCount += PAGE_SIZE;
      renderResults(state);
    });
    add.addEventListener("click", () => addOrUpdateSelected(state));
    cancelEdit.addEventListener("click", () => cancelEditMode(state));
    back.addEventListener("click", () => showResultsOnSmallScreen(state));
    close.addEventListener("click", () => root.close());
    root.addEventListener("close", () => {
      root.classList.remove("gear-locker-detail-active");
      if (state.editingRow) cancelEditMode(state, false);
      const returnFocus = state.returnFocus;
      state.returnFocus = null;
      if (returnFocus && returnFocus.isConnected) returnFocus.focus();
    });
    document.querySelectorAll("[data-gear-locker-open]").forEach((button) => {
      button.disabled = false;
      button.addEventListener("click", () => {
        const kind = normalizeKind(button.dataset.gearLockerOpen);
        if (!kind) return;
        const panel = button.closest("[data-gear-add-panel]");
        const techLevelSelect = panel && panel.querySelector("[data-gear-filter-tl]");
        const lawLevelSelect =
          panel && panel.querySelector("[data-gear-filter-law-level]");
        const legalCategorySelect =
          panel && panel.querySelector("[data-gear-filter-legal-category]");
        const skillSelect = panel && panel.querySelector("[data-gear-filter-skill]");
        const sortSelect = panel && panel.querySelector("[data-gear-sort]");
        showLocker(state, kind, button, {
          techLevel: techLevelSelect ? techLevelSelect.value : "any",
          lawLevel: lawLevelSelect ? lawLevelSelect.value : "any",
          legalCategory: legalCategorySelect ? legalCategorySelect.value : "any",
          skill: skillSelect ? skillSelect.value : "any",
          sort: sortSelect ? sortSelect.value : "name",
        });
        ensureCatalog().catch(() => {
          // The dialog carries the actionable failure message and custom entry remains available.
        });
      });
    });
    return state;
  }

  function matchesScope(item, scope) {
    if (scope === "all") return true;
    return item.personalDefault;
  }

  function filteredItems(state) {
    const query = state.search.value.trim().toLocaleLowerCase();
    const tokens = query.split(/\s+/).filter(Boolean);
    const matches = state.items.filter(
      (item) =>
        item.kind === state.activeKind &&
        matchesScope(item, state.scopeValue) &&
        matchesTechLevel(item, state.techLevelFilter) &&
        matchesLawLevel(item, state.lawLevelFilter) &&
        matchesLegalCategory(item, state.legalCategoryFilter) &&
        matchesSkill(item, state.skillFilter, state.activeKind) &&
        tokens.every((token) => item.searchText.includes(token))
    );
    if (!query) return matches;
    return matches.sort((left, right) => {
      return (
        filteredRank(left, state) - filteredRank(right, state) ||
        compareDisplayNames(left.displayName, right.displayName)
      );
    });
  }

  function itemName(item) {
    return firstString(item.canonicalName, item.sheet.name, item.sheet.type, item.displayName);
  }

  function itemVariantLabel(item) {
    const name = itemName(item);
    if (!name || item.displayName === name) return "";
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return item.displayName.replace(new RegExp(`^${escapedName}\\s*[-–—:]?\\s*`, "i"), "");
  }

  function compareDisplayNames(left, right) {
    return stringValue(left).localeCompare(stringValue(right), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }

  function techLevelSortKey(item) {
    const parsed = parseTechLevel(item && item.sheet && item.sheet.tl);
    return parsed ? parsed.minimum : null;
  }

  function compareTechLevelKeys(left, right, direction) {
    const leftKnown = Number.isInteger(left);
    const rightKnown = Number.isInteger(right);
    if (!leftKnown && !rightKnown) return 0;
    if (!leftKnown) return 1;
    if (!rightKnown) return -1;
    return direction === "tech-desc" ? right - left : left - right;
  }

  function compareVariants(left, right, state) {
    const sortOrder = normalizedSortOrder(state.sortOrder);
    if (sortOrder !== "name") {
      const techOrder = compareTechLevelKeys(
        techLevelSortKey(left),
        techLevelSortKey(right),
        sortOrder
      );
      if (techOrder !== 0) return techOrder;
    }
    return (
      filteredRank(left, state) - filteredRank(right, state) ||
      compareDisplayNames(left.displayName, right.displayName)
    );
  }

  function groupTechLevelSortKey(group) {
    const knownLevels = group.variants
      .map((item) => techLevelSortKey(item))
      .filter((value) => Number.isInteger(value));
    return knownLevels.length > 0 ? Math.min(...knownLevels) : null;
  }

  function groupSearchRank(group, state) {
    return Math.min(...group.variants.map((item) => filteredRank(item, state)));
  }

  function groupItems(items, state) {
    const groupsById = new Map();
    items.forEach((item) => {
      const group = groupsById.get(item.itemId) || {
        itemId: item.itemId,
        canonicalName: itemName(item),
        variants: [],
      };
      group.variants.push(item);
      groupsById.set(item.itemId, group);
    });
    groupsById.forEach((group) => {
      group.variants.sort((left, right) => compareVariants(left, right, state));
    });
    return Array.from(groupsById.values()).sort((left, right) => {
      const sortOrder = normalizedSortOrder(state.sortOrder);
      if (sortOrder !== "name") {
        const techOrder = compareTechLevelKeys(
          groupTechLevelSortKey(left),
          groupTechLevelSortKey(right),
          sortOrder
        );
        if (techOrder !== 0) return techOrder;
      }
      return (
        groupSearchRank(left, state) - groupSearchRank(right, state) ||
        compareDisplayNames(left.canonicalName, right.canonicalName)
      );
    });
  }

  function filteredRank(item, state) {
    const query = state ? state.search.value.trim().toLocaleLowerCase() : "";
    if (!query) return 0;
    const tokens = query.split(/\s+/).filter(Boolean);
    const name = itemName(item).toLocaleLowerCase();
    if (name === query) return 0;
    if (name.startsWith(query)) return 1;
    if (item.displayName.toLocaleLowerCase().startsWith(query)) return 2;
    if (tokens.every((token) => name.includes(token))) return 3;
    return 4;
  }

  function resultMetadata(group) {
    const parts = [];
    if (group.variants.length === 1) {
      const item = group.variants[0];
      if (item.statLine) parts.push(item.statLine);
      if (itemVariantLabel(item)) parts.push(itemVariantLabel(item));
      if (item.sheetRole && item.sheetRole !== "inventory") {
        parts.push(ROLE_LABELS[item.sheetRole] || item.sheetRole.replaceAll("_", " "));
      }
    } else {
      const techLevels = uniqueStrings(group.variants.map((item) => item.sheet.tl));
      parts.push(`${group.variants.length} exact variants`);
      if (techLevels.length > 0 && techLevels.length <= 6) {
        parts.push(`TL ${techLevels.join(", ")}`);
      }
    }
    return parts.join(" · ");
  }

  function variantIsOnSheet(variantId) {
    return Array.from(document.querySelectorAll("[data-catalog-variant-id]")).some(
      (row) => row.dataset.catalogVariantId === variantId
    );
  }

  function optionId(index) {
    return `gear-locker-result-${index}`;
  }

  function updateActiveResult(state, nextIndex, scroll = false) {
    if (state.visibleItems.length === 0) {
      state.results.removeAttribute("aria-activedescendant");
      return;
    }
    state.activeResultIndex = Math.max(
      0,
      Math.min(nextIndex, state.visibleItems.length - 1)
    );
    const options = Array.from(state.results.querySelectorAll('[role="option"]'));
    options.forEach((option, index) => option.classList.toggle("is-active", index === state.activeResultIndex));
    const active = options[state.activeResultIndex];
    if (!active) return;
    state.results.setAttribute("aria-activedescendant", active.id);
    if (scroll) active.scrollIntoView({ block: "nearest" });
  }

  function moveResultFocus(state, event) {
    if (state.editingRow) return;
    const last = state.visibleItems.length - 1;
    if (last < 0) return;
    let next = state.activeResultIndex;
    if (event.key === "ArrowDown") next += 1;
    else if (event.key === "ArrowUp") next -= 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectGroup(state, state.visibleItems[state.activeResultIndex]);
      return;
    } else {
      return;
    }
    event.preventDefault();
    updateActiveResult(state, next, true);
  }

  function renderResults(state) {
    const matchingVariants = filteredItems(state);
    const matches = groupItems(matchingVariants, state);
    const visible = matches.slice(0, state.visibleCount);
    state.visibleItems = visible;
    state.results.replaceChildren();

    if (visible.length === 0) {
      const empty = createElement(
        "li",
        "gear-locker-empty",
        "No matching catalog entries. Try a broader scope or a different search."
      );
      empty.setAttribute("role", "presentation");
      state.results.appendChild(empty);
    } else {
      visible.forEach((group, index) => {
        const listItem = createElement("li", "gear-locker-result");
        listItem.id = optionId(index);
        listItem.setAttribute("role", "option");
        listItem.setAttribute(
          "aria-selected",
          String(Boolean(state.selectedGroup && state.selectedGroup.itemId === group.itemId))
        );
        const nameRow = createElement("span", "gear-locker-result-name-row");
        const name = createElement("span", "gear-locker-result-name", group.canonicalName);
        nameRow.appendChild(name);
        const onSheetCount = group.variants.filter((item) => variantIsOnSheet(item.variantId)).length;
        if (onSheetCount > 0) {
          const label = onSheetCount === 1 ? "On sheet" : `${onSheetCount} on sheet`;
          nameRow.appendChild(createElement("span", "gear-locker-result-added", label));
        }
        const metadata = createElement(
          "span",
          "gear-locker-result-meta",
          resultMetadata(group)
        );
        listItem.append(nameRow, metadata);
        listItem.addEventListener("pointermove", () => updateActiveResult(state, index));
        listItem.addEventListener("click", () => {
          if (state.editingRow) return;
          updateActiveResult(state, index);
          selectGroup(state, group);
        });
        state.results.appendChild(listItem);
      });
    }

    const shown = Math.min(visible.length, matches.length);
    state.resultsSummary.textContent = matches.length
      ? `Showing ${shown} of ${matches.length} items · ${matchingVariants.length} exact variants · ${filterDescription(state)}`
      : `No matches · ${filterDescription(state)}`;
    state.more.hidden = shown >= matches.length;
    state.moreWrap.hidden = shown >= matches.length;
    const selectedIndex = visible.findIndex(
      (group) => state.selectedGroup && group.itemId === state.selectedGroup.itemId
    );
    updateActiveResult(state, selectedIndex >= 0 ? selectedIndex : state.activeResultIndex);
  }

  function updateKindCounts(state) {
    state.kindTabButtons.forEach(({ count }, kind) => {
      const skillFilter = state.skillFilterByKind.get(kind) || "any";
      count.textContent = String(
        new Set(
          state.items
            .filter(
              (item) =>
                item.kind === kind &&
                matchesScope(item, state.scopeValue) &&
                matchesTechLevel(item, state.techLevelFilter) &&
                matchesLawLevel(item, state.lawLevelFilter) &&
                matchesLegalCategory(item, state.legalCategoryFilter) &&
                matchesSkill(item, skillFilter, kind)
            )
            .map((item) => item.itemId)
        ).size
      );
    });
  }

  function setScope(state, scope) {
    state.scopeValue = scope === "all" ? "all" : "personal";
    state.scopeByKind.set(state.activeKind, state.scopeValue);
    state.personalScope.setAttribute("aria-pressed", String(state.scopeValue === "personal"));
    state.allScope.setAttribute("aria-pressed", String(state.scopeValue === "all"));
    state.visibleCount = PAGE_SIZE;
    state.activeResultIndex = 0;
    updateKindCounts(state);
    renderResults(state);
  }

  function updateScopeVisibility(state) {
    if (!state.loaded) return;
    const hasExtendedEntries = state.items.some(
      (item) => item.kind === state.activeKind && !item.personalDefault
    );
    state.scopeControl.hidden = !hasExtendedEntries;
    state.root.classList.toggle("gear-locker-scope-hidden", !hasExtendedEntries);
  }

  function setActiveKind(state, kind, clearSearch = true) {
    const normalized = normalizeKind(kind);
    if (!normalized) return;
    if (state.editingRow && normalized !== state.activeKind) cancelEditMode(state, false);
    state.activeKind = normalized;
    state.scopeValue = state.scopeByKind.get(normalized) || "personal";
    state.skillFilter = state.skillFilterByKind.get(normalized) || "any";
    state.sortOrder = state.sortOrderByKind.get(normalized) || "name";
    state.personalScope.setAttribute("aria-pressed", String(state.scopeValue === "personal"));
    state.allScope.setAttribute("aria-pressed", String(state.scopeValue === "all"));
    state.kindTabButtons.forEach(({ button }, candidateKind) => {
      const active = candidateKind === normalized;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    state.resultsHeading.textContent = `Browse ${SECTION_TITLES[normalized].toLocaleLowerCase()}`;
    state.search.placeholder = `Search ${SECTION_TITLES[normalized].toLocaleLowerCase()} by name, stat, skill, or book`;
    if (clearSearch) state.search.value = "";
    state.visibleCount = PAGE_SIZE;
    state.activeResultIndex = 0;
    state.selectedGroup = null;
    state.selectedItem = null;
    state.detail.hidden = true;
    state.root.classList.remove("gear-locker-detail-active");
    state.add.disabled = true;
    state.add.textContent = `Add ${SECTION_LABELS[normalized]} to character`;
    if (state.loaded) {
      updateScopeVisibility(state);
      updateKindCounts(state);
      renderResults(state);
    }
  }

  function moveKindTab(state, kind, event) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const kinds = Object.keys(SECTION_TITLES);
    let index = kinds.indexOf(kind);
    if (event.key === "ArrowLeft") index = (index - 1 + kinds.length) % kinds.length;
    if (event.key === "ArrowRight") index = (index + 1) % kinds.length;
    if (event.key === "Home") index = 0;
    if (event.key === "End") index = kinds.length - 1;
    const nextKind = kinds[index];
    setActiveKind(state, nextKind);
    state.kindTabButtons.get(nextKind).button.focus();
  }

  function scopeDescription(item) {
    const role = ROLE_LABELS[item.sheetRole] || item.sheetRole.replaceAll("_", " ");
    const domains = item.domains.length > 0 ? item.domains.join(", ") : "unclassified";
    return `${role} · ${domains} · ${lawLevelValueLabel(item.lawLevel)} · ${legalCategoryLabel(item.legalCategory)}`;
  }

  function formatReference(reference) {
    if (reference.pages.length === 0) return reference.title;
    const pagePrefix = reference.pageBasis === "pdf" ? "PDF p." : "p.";
    const pluralPrefix = reference.pageBasis === "pdf" ? "PDF pp." : "pp.";
    return `${reference.title}, ${reference.pages.length === 1 ? pagePrefix : pluralPrefix} ${reference.pages.join(", ")}`;
  }

  function techLevelGuidance(kind, filterValue) {
    if (!techLevelReference) return null;
    const normalizedKind = normalizeKind(kind);
    const normalizedFilter = normalizedTechLevelFilter(filterValue);
    if (!normalizedKind) return null;

    const kindGuidance = techLevelReference.guidanceByKind[normalizedKind] || {};
    const kindDescription = firstString(
      kindGuidance.description,
      stringValue(kindGuidance.valueRole).replaceAll("_", " ")
    );
    let summary = "Tech Level (TL): what the rating means";
    let title = `Tech Level (TL) · ${SECTION_TITLES[normalizedKind]}`;
    let description = techLevelReference.description;
    let levelDescription = "";
    let levelReferences = [];

    if (normalizedFilter === "unknown") {
      summary = "What “Unknown or variable TL” includes";
      title = `Unknown or variable TL · ${SECTION_TITLES[normalizedKind]}`;
      description = firstString(
        techLevelReference.unknownDescription,
        techLevelReference.description
      );
    } else if (normalizedFilter.startsWith("max:")) {
      const maximum = Number.parseInt(normalizedFilter.slice(4), 10);
      const level =
        maximum >= techLevelReference.higherLevels.minimum
          ? techLevelReference.higherLevels
          : techLevelReference.levels.find(
              (candidate) => candidate.value === maximum
            );
      summary = `What “Up to TL ${maximum}” includes`;
      const band =
        level &&
        firstString(
          level.title,
          stringValue(level.band).replaceAll("_", " ")
        );
      title = `Up to TL ${maximum}${band ? ` · ${band}` : ""}`;
      levelDescription = firstString(level && level.summary);
      levelReferences = level ? level.sourceReferences : [];
    }

    const kindReferenceKeys = new Set(
      Object.values(techLevelReference.guidanceByKind).flatMap((guidance) =>
        guidance.sourceReferences.map(
          (reference) =>
            `${reference.title}|${reference.pages.join(",")}|${reference.pageBasis}`
        )
      )
    );
    const globalReferences = techLevelReference.sourceReferences.filter(
      (reference) => {
        const referenceType = reference.referenceType.toLocaleLowerCase();
        if (referenceType.includes("kind")) return false;
        if (
          referenceType.includes("tech_level") &&
          (referenceType.includes("scale") || referenceType.includes("world")) &&
          !referenceType.includes("kind")
        ) {
          return true;
        }
        const evidenceKey = `${reference.title}|${reference.pages.join(",")}|${reference.pageBasis}`;
        return !kindReferenceKeys.has(evidenceKey);
      }
    );
    const sourceReferences = [
      ...globalReferences,
      ...levelReferences,
      ...(Array.isArray(kindGuidance.sourceReferences)
        ? kindGuidance.sourceReferences
        : []),
    ];
    return {
      summary,
      title,
      description,
      levelDescription,
      filterDescription: techLevelReference.filterSemantics,
      kindDescription,
      sourceReferences,
    };
  }

  function renderTechLevelHelp(panel) {
    if (!(panel instanceof HTMLDetailsElement)) return;
    const kind = normalizeKind(panel.dataset.gearAddPanel);
    const select = panel.querySelector("[data-gear-filter-tl]");
    const help = panel.querySelector("[data-gear-tech-level-help]");
    if (
      !(select instanceof HTMLSelectElement) ||
      !(help instanceof HTMLElement)
    ) {
      return;
    }
    const guidance = techLevelGuidance(kind, select.value);
    if (!guidance) {
      if (manifestDocument) {
        help.textContent =
          "This catalog version does not include book-backed Tech Level guidance. Maximum Tech Level still compares a safely parsed recorded TL, or the lower bound of a minimum/range expression; check the selected item's rulebook reference.";
        help.classList.remove("is-error");
      }
      return;
    }

    const title = createElement(
      "strong",
      "gear-tech-level-help-title",
      guidance.title
    );
    const description = createElement(
      "span",
      "gear-tech-level-help-copy",
      guidance.description
    );
    const levelDescription = createElement(
      "span",
      "gear-tech-level-help-copy",
      guidance.levelDescription
    );
    levelDescription.hidden = !guidance.levelDescription;
    const filter = createElement(
      "span",
      "gear-tech-level-help-filter",
      guidance.filterDescription
        ? `Filter meaning: ${guidance.filterDescription}`
        : ""
    );
    filter.hidden = !guidance.filterDescription;
    const kindDescription = createElement(
      "span",
      "gear-tech-level-help-kind",
      guidance.kindDescription
        ? `${SECTION_TITLES[kind]}: ${guidance.kindDescription}`
        : ""
    );
    kindDescription.hidden = !guidance.kindDescription;
    const sourceText = uniqueStrings(
      guidance.sourceReferences.map((reference) => formatReference(reference))
    ).join("; ");
    const source = createElement(
      "span",
      "gear-tech-level-help-source",
      sourceText
        ? `Book references: ${sourceText}.`
        : "No book reference is available for this Tech Level guidance."
    );
    help.replaceChildren(
      title,
      description,
      levelDescription,
      filter,
      kindDescription,
      source
    );
    help.classList.remove("is-error");
  }

  function updateAllTechLevelHelp() {
    updateAllTechLevelOptionLabels();
    document.querySelectorAll("[data-gear-add-panel]").forEach((panel) => {
      renderTechLevelHelp(panel);
    });
  }

  function techLevelOptionText(value, shortLabel) {
    const conciseLabel = firstString(shortLabel)
      .replace(/[.!?]+$/, "")
      .replace(
        /^(?:up\s+to\s+)?(?:tech\s+level|TL)\s*\d+\+?\s*[\u2014\u2013:;-]\s*/i,
        ""
      );
    return conciseLabel
      ? `Up to TL ${value} — ${conciseLabel}`
      : `Up to TL ${value} — source-recorded technology cutoff`;
  }

  function updateAllTechLevelOptionLabels() {
    if (!techLevelReference) return;
    document.querySelectorAll("[data-gear-filter-tl]").forEach((select) => {
      if (!(select instanceof HTMLSelectElement)) return;
      techLevelReference.levels.forEach((level) => {
        const option = Array.from(select.options).find(
          (candidate) => candidate.value === `max:${level.value}`
        );
        if (option) {
          option.textContent = techLevelOptionText(
            level.value,
            firstString(level.shortLabel, level.title)
          );
        }
      });

      for (
        let value = techLevelReference.higherLevels.minimum;
        value <= 21;
        value += 1
      ) {
        const option = Array.from(select.options).find(
          (candidate) => candidate.value === `max:${value}`
        );
        if (option) {
          option.textContent = techLevelOptionText(
            value,
            firstString(
              techLevelReference.higherLevels.shortLabel,
              techLevelReference.higherLevels.title
            )
          );
        }
      }

      const unknown = Array.from(select.options).find(
        (option) => option.value === "unknown"
      );
      const unknownLabel = firstString(techLevelReference.unknownShortLabel);
      if (unknown && unknownLabel) {
        const conciseLabel = unknownLabel.replace(/[.!?]+$/, "");
        const explanation = conciseLabel.replace(
          /^unknown(?:\s+or\s+variable)?(?:\s+(?:tech\s+level|TL))?\s*[\u2014\u2013:;-]\s*/i,
          ""
        );
        const descriptiveLabel =
          explanation !== conciseLabel || !/^unknown/i.test(conciseLabel)
            ? `Unknown or variable TL${explanation ? ` — ${explanation}` : ""}`
            : conciseLabel;
        unknown.textContent = /not\s+TL\s*0/i.test(descriptiveLabel)
          ? descriptiveLabel
          : `${descriptiveLabel.replace(/[.!?]+$/, "")} — not TL0`;
      }
    });
  }

  function requestTechLevelHelp(panel) {
    if (!(panel instanceof HTMLDetailsElement)) return;
    const help = panel.querySelector("[data-gear-tech-level-help]");
    if (techLevelReference || manifestDocument) {
      renderTechLevelHelp(panel);
      return;
    }
    if (help instanceof HTMLElement) {
      help.setAttribute("aria-busy", "true");
      help.classList.remove("is-error");
    }
    ensureManifest()
      .then(() => {
        if (help instanceof HTMLElement) help.setAttribute("aria-busy", "false");
        renderTechLevelHelp(panel);
      })
      .catch((error) => {
        if (!(help instanceof HTMLElement)) return;
        help.setAttribute("aria-busy", "false");
        help.textContent = `Book-backed Tech Level guidance is unavailable right now. ${help.dataset.fallbackText || "Maximum Tech Level remains a technology cutoff using a safely parsed recorded TL or range lower bound."} ${error.message}`;
        help.classList.add("is-error");
      });
  }

  function initializeTechLevelHelp() {
    document.querySelectorAll("[data-gear-add-panel]").forEach((panel) => {
      if (!(panel instanceof HTMLDetailsElement) || panel.dataset.techHelpReady === "true") {
        return;
      }
      const select = panel.querySelector("[data-gear-filter-tl]");
      const help = panel.querySelector("[data-gear-tech-level-help]");
      if (
        !(select instanceof HTMLSelectElement) ||
        !(help instanceof HTMLElement)
      ) {
        return;
      }
      panel.dataset.techHelpReady = "true";
      if (!help.dataset.fallbackText) {
        help.dataset.fallbackText = help.textContent.trim();
      }
      select.addEventListener("change", () => {
        if (techLevelReference || manifestDocument) renderTechLevelHelp(panel);
        else if (panel.open) requestTechLevelHelp(panel);
      });
      panel.addEventListener("toggle", () => {
        if (panel.open) requestTechLevelHelp(panel);
      });
      if (panel.open) requestTechLevelHelp(panel);
    });
  }

  function lawLevelGuidance(kind, value) {
    if (!lawLevelReference) return null;
    const normalizedKind = normalizeKind(kind);
    const normalizedValue = normalizedLawLevelFilter(value);
    if (!normalizedKind) return null;

    if (normalizedValue === "any") {
      const kindGuidance = lawLevelReference.levels
        .map((level) => level.guidanceByKind[normalizedKind])
        .find((guidance) => guidance && guidance.ruleStatus === "outside_global_table");
      return {
        title: `All Law Level classifications · ${SECTION_TITLES[normalizedKind]}`,
        description: [
          `Any restriction level leaves the exact ${SECTION_LABELS[normalizedKind]} classification unfiltered.`,
          kindGuidance && kindGuidance.description,
          !kindGuidance && lawLevelReference.description,
        ]
          .filter(Boolean)
          .join(" "),
        sourceReferences: [],
        sourceNote:
          "Choose a specific classification to see its kind-specific book references.",
        neighbors: null,
      };
    }

    if (normalizedValue === "undetermined") {
      return {
        title: `Undetermined · ${SECTION_TITLES[normalizedKind]}`,
        description:
          lawLevelReference.undeterminedDescription ||
          "No exact source-backed first restriction level is assigned; check the item and world rules.",
        sourceReferences: [],
        sourceNote: "No threshold citation applies to an undetermined classification.",
        neighbors: [],
        neighborNoneMessage: `No neighboring source examples apply to an undetermined ${SECTION_LABELS[normalizedKind]} classification.`,
      };
    }

    const level = lawLevelReference.levels.find(
      (candidate) => candidate.value === normalizedValue
    );
    if (!level) return null;
    const guidance = level.guidanceByKind[normalizedKind];
    const ruleStatus = firstString(guidance && guidance.ruleStatus);
    const isWithinNumericLadder = NUMERIC_LADDER_RULE_STATUSES.has(ruleStatus);
    const cumulativeNote =
      level.cumulative && normalizedValue !== "0" && isWithinNumericLadder
        ? " Restrictions from lower Law Levels remain in force."
        : "";
    const guidanceReferences = Array.isArray(guidance && guidance.sourceReferences)
      ? guidance.sourceReferences
      : [];
    const sourceReferences = guidanceReferences;
    const levelIndex = lawLevelReference.levels.indexOf(level);
    const neighbors = DIRECT_LAW_LEVEL_RULE_STATUSES.has(ruleStatus)
      ? null
      : nearestLawLevelGuidance(normalizedKind, levelIndex);
    return {
      title: `Law Level ${level.value} · ${SECTION_TITLES[normalizedKind]}`,
      description: `${firstString(guidance && guidance.description, level.summary)}${cumulativeNote}`,
      sourceReferences,
      sourceNote:
        sourceReferences.length > 0
          ? ""
          : `This catalog version does not provide a kind-specific book reference for ${SECTION_TITLES[normalizedKind].toLocaleLowerCase()} guidance.`,
      neighbors,
      neighborNoneMessage: `No neighboring source examples are available for ${SECTION_TITLES[normalizedKind].toLocaleLowerCase()}.`,
    };
  }

  function nearestLawLevelGuidance(kind, selectedIndex) {
    const neighbors = [];
    const findNeighbor = (step, direction) => {
      for (
        let index = selectedIndex + step;
        index >= 0 && index < lawLevelReference.levels.length;
        index += step
      ) {
        const level = lawLevelReference.levels[index];
        const guidance = level.guidanceByKind[kind];
        if (
          guidance &&
          DIRECT_LAW_LEVEL_RULE_STATUSES.has(guidance.ruleStatus)
        ) {
          neighbors.push({
            direction,
            distance: Math.abs(index - selectedIndex),
            unit: "level",
            label: lawLevelOptionText(
              level.value,
              firstString(guidance.shortLabel, guidance.description)
            ),
          });
          return;
        }
      }
    };
    findNeighbor(-1, "Lower");
    findNeighbor(1, "Higher");
    return neighbors;
  }

  function renderNeighborContext(guidance) {
    if (!Array.isArray(guidance.neighbors)) return null;
    if (guidance.neighbors.length === 0) {
      return createElement(
        "span",
        "gear-filter-neighbor-note",
        guidance.neighborNoneMessage || "No neighboring source examples are available."
      );
    }

    const container = createElement("span", "gear-filter-neighbors");
    container.appendChild(
      createElement("strong", "gear-filter-neighbors-title", "Nearest sourced examples")
    );
    guidance.neighbors.forEach((neighbor) => {
      const unit =
        neighbor.distance === 1
          ? neighbor.unit
          : neighbor.unit === "category"
            ? "categories"
            : `${neighbor.unit}s`;
      container.appendChild(
        createElement(
          "span",
          "gear-filter-neighbor",
          `${neighbor.direction} (${neighbor.distance} ${unit} away): ${neighbor.label}`
        )
      );
    });
    if (guidance.contextNotice) {
      container.appendChild(
        createElement(
          "span",
          "gear-filter-neighbor-context",
          guidance.contextNotice
        )
      );
    }
    return container;
  }

  function renderLawLevelHelp(panel) {
    if (!(panel instanceof HTMLDetailsElement)) return;
    const kind = normalizeKind(panel.dataset.gearAddPanel);
    const select = panel.querySelector("[data-gear-filter-law-level]");
    const help = panel.querySelector("[data-gear-law-level-help]");
    if (!(select instanceof HTMLSelectElement) || !(help instanceof HTMLElement)) return;
    const guidance = lawLevelGuidance(kind, select.value);
    if (!guidance) {
      if (manifestDocument) {
        help.textContent =
          "This catalog version does not include book-backed Law Level guidance. Check the selected item's references and the world's local rules.";
        help.classList.remove("is-error");
      }
      return;
    }

    const title = createElement("strong", "gear-law-level-help-title", guidance.title);
    const description = createElement(
      "span",
      "gear-law-level-help-copy",
      guidance.description
    );
    const sourceText = guidance.sourceReferences
      .map((reference) => formatReference(reference))
      .join("; ");
    const source = createElement(
      "span",
      "gear-law-level-help-source",
      sourceText
        ? `Book references: ${sourceText}.`
        : guidance.sourceNote || "No book reference is available."
    );
    const neighbors = renderNeighborContext(guidance);
    help.replaceChildren(
      ...[title, description, neighbors, source].filter(Boolean)
    );
    help.classList.remove("is-error");
  }

  function updateAllLawLevelHelp() {
    updateAllLawLevelOptionLabels();
    document.querySelectorAll("[data-gear-add-panel]").forEach((panel) => {
      renderLawLevelHelp(panel);
    });
  }

  function lawLevelOptionText(value, shortLabel) {
    const conciseLabel = firstString(shortLabel).replace(/[.!?]+$/, "");
    if (!conciseLabel) return "";
    if (/^(?:law\s+)?level\s+\d|^9\+\s*[\u2014\u2013-]/i.test(conciseLabel)) {
      return conciseLabel;
    }
    const prefix = value === "9+" ? "9+" : `Level ${value}`;
    return `${prefix} — ${conciseLabel}`;
  }

  function updateAllLawLevelOptionLabels() {
    if (!lawLevelReference) return;
    document.querySelectorAll("[data-gear-add-panel]").forEach((panel) => {
      if (!(panel instanceof HTMLDetailsElement)) return;
      const kind = normalizeKind(panel.dataset.gearAddPanel);
      const select = panel.querySelector("[data-gear-filter-law-level]");
      if (!kind || !(select instanceof HTMLSelectElement)) return;

      lawLevelReference.levels.forEach((level) => {
        const option = Array.from(select.options).find(
          (candidate) => candidate.value === level.value
        );
        const guidance = level.guidanceByKind[kind];
        const label = guidance && lawLevelOptionText(level.value, guidance.shortLabel);
        if (option && label) option.textContent = label;
      });

      const undetermined = Array.from(select.options).find(
        (option) => option.value === "undetermined"
      );
      const undeterminedLabel = lawLevelReference.undeterminedShortLabel;
      if (undetermined && undeterminedLabel) {
        undetermined.textContent = /^undetermined\s*[\u2014\u2013-]/i.test(
          undeterminedLabel
        )
          ? undeterminedLabel
          : `Undetermined — ${undeterminedLabel.replace(/[.!?]+$/, "")}`;
      }
    });
  }

  function requestLawLevelHelp(panel) {
    if (!(panel instanceof HTMLDetailsElement)) return;
    const help = panel.querySelector("[data-gear-law-level-help]");
    if (lawLevelReference) {
      renderLawLevelHelp(panel);
      return;
    }
    if (help instanceof HTMLElement) {
      help.setAttribute("aria-busy", "true");
      help.classList.remove("is-error");
    }
    ensureManifest()
      .then(() => {
        if (help instanceof HTMLElement) help.setAttribute("aria-busy", "false");
        renderLawLevelHelp(panel);
      })
      .catch((error) => {
        if (!(help instanceof HTMLElement)) return;
        help.setAttribute("aria-busy", "false");
        help.textContent = `Book-backed Law Level guidance is unavailable right now. ${help.dataset.fallbackText || "Filter only exact source-recorded classifications and check the item and world's rules."} ${error.message}`;
        help.classList.add("is-error");
      });
  }

  function initializeLawLevelHelp() {
    document.querySelectorAll("[data-gear-add-panel]").forEach((panel) => {
      if (!(panel instanceof HTMLDetailsElement) || panel.dataset.lawHelpReady === "true") {
        return;
      }
      const select = panel.querySelector("[data-gear-filter-law-level]");
      if (!(select instanceof HTMLSelectElement)) return;
      panel.dataset.lawHelpReady = "true";
      const help = panel.querySelector("[data-gear-law-level-help]");
      if (help instanceof HTMLElement && !help.dataset.fallbackText) {
        help.dataset.fallbackText = help.textContent.trim();
      }
      select.addEventListener("change", () => {
        if (lawLevelReference) renderLawLevelHelp(panel);
        else if (panel.open) requestLawLevelHelp(panel);
      });
      panel.addEventListener("toggle", () => {
        if (panel.open) requestLawLevelHelp(panel);
      });
      if (panel.open) requestLawLevelHelp(panel);
    });
  }

  function legalCategoryOptionText(category) {
    if (!category) return "";
    let conciseLabel = firstString(
      category.shortLabel,
      category.title,
      LEGAL_CATEGORY_LABELS[category.value]
    ).replace(/[.!?]+$/, "");
    if (!conciseLabel) return LEGAL_CATEGORY_LABELS[category.value] || "";
    if (category.value === "prohibited") {
      if (/^prohibited$/i.test(conciseLabel)) return "Prohibited";
      conciseLabel = conciseLabel.replace(
        /^prohibited(?:\s*[\u2014\u2013:;-]\s*|\s+)/i,
        ""
      );
      return conciseLabel ? `Prohibited — ${conciseLabel}` : "Prohibited";
    }
    const categoryNumber = category.value.replace("category_", "");
    conciseLabel = conciseLabel.replace(
      /^category\s+[1-5]\s*[\u2014\u2013:;-]\s*/i,
      ""
    );
    return `Category ${categoryNumber} — ${conciseLabel}`;
  }

  function nearestLegalCategoryGuidance(kind, selectedCategory) {
    const selectedIndex = legalCategoryReference.categories.indexOf(selectedCategory);
    const neighbors = [];
    const findNeighbor = (step, direction) => {
      for (
        let index = selectedIndex + step;
        index >= 0 && index < legalCategoryReference.categories.length;
        index += step
      ) {
        const category = legalCategoryReference.categories[index];
        const guidance = category.guidanceByKind[kind];
        if (
          guidance &&
          DIRECT_LEGAL_CATEGORY_RULE_STATUSES.has(guidance.ruleStatus)
        ) {
          const categoryLabel = legalCategoryOptionText(category);
          const guidanceLabel = firstString(guidance.shortLabel);
          neighbors.push({
            direction,
            distance: Math.abs(category.ordinal - selectedCategory.ordinal),
            unit: "category",
            label:
              guidanceLabel &&
              !categoryLabel.toLocaleLowerCase().includes(
                guidanceLabel.toLocaleLowerCase()
              )
                ? `${categoryLabel} · ${guidanceLabel}`
                : categoryLabel,
          });
          return;
        }
      }
    };
    findNeighbor(-1, "Lower");
    findNeighbor(1, "Higher");
    return neighbors;
  }

  function legalCategoryGuidance(kind, value) {
    if (!legalCategoryReference) return null;
    const normalizedKind = normalizeKind(kind);
    const normalizedValue = normalizedLegalCategoryFilter(value);
    if (!normalizedKind) return null;

    if (normalizedValue === "any") {
      return {
        title: `All Legal Categories · ${SECTION_TITLES[normalizedKind]}`,
        description: uniqueStrings([
          `Any legal category leaves the exact ${SECTION_LABELS[normalizedKind]} classification unfiltered.`,
          legalCategoryReference.description,
        ]).join(" "),
        filterDescription: legalCategoryReference.filterSemantics,
        priceDescription: "",
        blackMarketDescription: "",
        contextNotice: "",
        examples: [],
        sourceReferences: legalCategoryReference.sourceReferences,
        sourceNote:
          "Choose a specific category to see its kind-specific examples and references.",
        neighbors: null,
      };
    }

    if (normalizedValue === "undetermined") {
      return {
        title: `Undetermined Legal Category · ${SECTION_TITLES[normalizedKind]}`,
        description:
          legalCategoryReference.undeterminedDescription ||
          "No exact source-backed legal category is assigned; undetermined does not mean unrestricted or available.",
        filterDescription: legalCategoryReference.filterSemantics,
        priceDescription: "",
        blackMarketDescription: "",
        contextNotice: "",
        examples: [],
        sourceReferences: [],
        sourceNote: "No category citation applies to an undetermined classification.",
        neighbors: [],
        neighborNoneMessage: `No neighboring source examples apply to an undetermined ${SECTION_LABELS[normalizedKind]} classification.`,
      };
    }

    const category = legalCategoryReference.categories.find(
      (candidate) => candidate.value === normalizedValue
    );
    if (!category) return null;
    const guidance = category.guidanceByKind[normalizedKind] || {
      ruleStatus: "",
      shortLabel: "",
      description: "",
      examples: [],
      sourceReferences: [],
    };
    const ruleStatus = firstString(guidance.ruleStatus);
    const direct = DIRECT_LEGAL_CATEGORY_RULE_STATUSES.has(ruleStatus);
    const priceDescription = firstString(
      category.priceMultiplier.shortLabel,
      category.priceMultiplier.value
        ? `${category.priceMultiplier.kind === "minimum" ? "At least " : ""}×${category.priceMultiplier.value}`
        : ""
    );
    const neighbors = direct
      ? null
      : nearestLegalCategoryGuidance(normalizedKind, category);
    return {
      title: `${legalCategoryOptionText(category)} · ${SECTION_TITLES[normalizedKind]}`,
      description: uniqueStrings([
        firstString(category.description, category.summary),
        guidance.description,
      ]).join(" "),
      filterDescription: legalCategoryReference.filterSemantics,
      priceDescription,
      blackMarketDescription: priceDescription
        ? legalCategoryReference.blackMarketDescription
        : "",
      contextNotice:
        Array.isArray(neighbors) && neighbors.length > 0
          ? legalCategoryReference.contextNotice
          : "",
      examples: direct ? guidance.examples : [],
      sourceReferences: [
        ...category.sourceReferences,
        ...guidance.sourceReferences,
      ],
      sourceNote:
        guidance.sourceReferences.length > 0 || category.sourceReferences.length > 0
          ? ""
          : `This catalog version does not provide a kind-specific reference for ${SECTION_TITLES[normalizedKind].toLocaleLowerCase()} in this category.`,
      neighbors,
      neighborNoneMessage: `No neighboring source examples are available for ${SECTION_TITLES[normalizedKind].toLocaleLowerCase()}.`,
    };
  }

  function renderLegalCategoryHelp(panel) {
    if (!(panel instanceof HTMLDetailsElement)) return;
    const kind = normalizeKind(panel.dataset.gearAddPanel);
    const select = panel.querySelector("[data-gear-filter-legal-category]");
    const help = panel.querySelector("[data-gear-legal-category-help]");
    if (!(select instanceof HTMLSelectElement) || !(help instanceof HTMLElement)) return;
    const guidance = legalCategoryGuidance(kind, select.value);
    if (!guidance) {
      if (manifestDocument) {
        help.textContent =
          "This catalog version does not include book-backed Legal Category guidance. The filter still matches exact source-recorded category values; check the selected item's references.";
        help.classList.remove("is-error");
      }
      return;
    }

    const title = createElement(
      "strong",
      "gear-legal-category-help-title",
      guidance.title
    );
    const description = createElement(
      "span",
      "gear-legal-category-help-copy",
      guidance.description
    );
    const filter = createElement(
      "span",
      "gear-legal-category-help-filter",
      guidance.filterDescription
        ? `Filter meaning: ${guidance.filterDescription}`
        : ""
    );
    filter.hidden = !guidance.filterDescription;
    const price = createElement(
      "span",
      "gear-legal-category-help-price",
      guidance.priceDescription
        ? `Black-market price: ${guidance.priceDescription}`
        : ""
    );
    price.hidden = !guidance.priceDescription;
    const blackMarketDescription = createElement(
      "span",
      "gear-legal-category-help-copy",
      guidance.blackMarketDescription
    );
    blackMarketDescription.hidden = !guidance.blackMarketDescription;

    const examples = createElement("span", "gear-legal-category-help-copy");
    if (guidance.examples.length > 0) {
      examples.appendChild(createElement("strong", "", "Named examples:"));
      const list = createElement("ul", "gear-legal-category-help-examples");
      guidance.examples.forEach((example) => {
        list.appendChild(createElement("li", "", example));
      });
      examples.appendChild(list);
    } else {
      examples.hidden = true;
    }

    const neighbors = renderNeighborContext(guidance);
    const sourceText = uniqueStrings(
      guidance.sourceReferences.map((reference) => formatReference(reference))
    ).join("; ");
    const source = createElement(
      "span",
      "gear-legal-category-help-source",
      sourceText
        ? `Book references: ${sourceText}.`
        : guidance.sourceNote || "No book reference is available."
    );
    help.replaceChildren(
      ...[
        title,
        description,
        filter,
        price,
        blackMarketDescription,
        examples,
        neighbors,
        source,
      ].filter(Boolean)
    );
    help.classList.remove("is-error");
  }

  function updateAllLegalCategoryHelp() {
    updateAllLegalCategoryOptionLabels();
    document.querySelectorAll("[data-gear-add-panel]").forEach((panel) => {
      renderLegalCategoryHelp(panel);
    });
  }

  function updateAllLegalCategoryOptionLabels() {
    if (!legalCategoryReference) return;
    document.querySelectorAll("[data-gear-filter-legal-category]").forEach((select) => {
      if (!(select instanceof HTMLSelectElement)) return;
      const any = Array.from(select.options).find(
        (option) => option.value === "any"
      );
      if (any) any.textContent = "Any Legal Category — no category filter";
      legalCategoryReference.categories.forEach((category) => {
        const option = Array.from(select.options).find(
          (candidate) => candidate.value === category.value
        );
        if (option) option.textContent = legalCategoryOptionText(category);
      });
      const undetermined = Array.from(select.options).find(
        (option) => option.value === "undetermined"
      );
      const undeterminedLabel = legalCategoryReference.undeterminedShortLabel;
      if (undetermined && undeterminedLabel) {
        undetermined.textContent = /^undetermined\b/i.test(undeterminedLabel)
          ? undeterminedLabel
          : `Undetermined — ${undeterminedLabel.replace(/[.!?]+$/, "")}`;
      }
    });
  }

  function requestLegalCategoryHelp(panel) {
    if (!(panel instanceof HTMLDetailsElement)) return;
    const help = panel.querySelector("[data-gear-legal-category-help]");
    if (legalCategoryReference || manifestDocument) {
      renderLegalCategoryHelp(panel);
      return;
    }
    if (help instanceof HTMLElement) {
      help.setAttribute("aria-busy", "true");
      help.classList.remove("is-error");
    }
    ensureManifest()
      .then(() => {
        if (help instanceof HTMLElement) help.setAttribute("aria-busy", "false");
        renderLegalCategoryHelp(panel);
      })
      .catch((error) => {
        if (!(help instanceof HTMLElement)) return;
        help.setAttribute("aria-busy", "false");
        help.textContent = `Book-backed Legal Category guidance is unavailable right now. ${help.dataset.fallbackText || "The filter still matches exact source-recorded category values."} ${error.message}`;
        help.classList.add("is-error");
      });
  }

  function initializeLegalCategoryHelp() {
    document.querySelectorAll("[data-gear-add-panel]").forEach((panel) => {
      if (
        !(panel instanceof HTMLDetailsElement) ||
        panel.dataset.legalHelpReady === "true"
      ) {
        return;
      }
      const select = panel.querySelector("[data-gear-filter-legal-category]");
      const help = panel.querySelector("[data-gear-legal-category-help]");
      if (!(select instanceof HTMLSelectElement) || !(help instanceof HTMLElement)) {
        return;
      }
      panel.dataset.legalHelpReady = "true";
      if (!help.dataset.fallbackText) {
        help.dataset.fallbackText = help.textContent.trim();
      }
      select.addEventListener("change", () => {
        if (legalCategoryReference || manifestDocument) {
          renderLegalCategoryHelp(panel);
        } else if (panel.open) {
          requestLegalCategoryHelp(panel);
        }
      });
      panel.addEventListener("toggle", () => {
        if (panel.open) requestLegalCategoryHelp(panel);
      });
      if (panel.open) requestLegalCategoryHelp(panel);
    });
  }

  function fallbackLawLevelDescription(item) {
    if (!lawLevelReference) {
      return "No exact Law Level explanation is available. Check the cited rulebook entry and the world's local rules.";
    }
    if (item.lawLevel === "undetermined") {
      return lawLevelReference.undeterminedDescription;
    }
    const guidance = lawLevelGuidance(item.kind, item.lawLevel);
    return guidance
      ? `The exact item explanation is unavailable. General guidance: ${guidance.description}`
      : "No exact Law Level explanation is available. Check the cited rulebook entry and the world's local rules.";
  }

  function techLevelDetailSummary(item) {
    const recordedValue = firstString(item && item.sheet && item.sheet.tl).replace(
      /^TL\s*/i,
      ""
    );
    return parseTechLevel(recordedValue)
      ? `Tech Level: TL ${recordedValue} — definition and source`
      : "Tech Level: unknown or variable — definition and source";
  }

  function fallbackTechLevelDescription(item) {
    const recordedValue = firstString(item && item.sheet && item.sheet.tl).replace(
      /^TL\s*/i,
      ""
    );
    const parsed = parseTechLevel(recordedValue);
    if (!techLevelReference) {
      return parsed
        ? `No exact Tech Level explanation is available in this catalog version. This record lists TL ${recordedValue} as a source-recorded technology rating; exact meaning can vary by gear or equipment type. Check the cited item rulebook for context.`
        : "No exact Tech Level explanation is available in this catalog version, and no usable source-recorded technology rating is available. Unknown is not TL0 and does not imply legality or availability.";
    }
    if (!parsed) {
      return firstString(
        techLevelReference.unknownDescription,
        "No usable TL is recorded. Unknown is not TL0 and does not imply legality or availability."
      );
    }

    const level =
      parsed.minimum >= techLevelReference.higherLevels.minimum
        ? techLevelReference.higherLevels
        : techLevelReference.levels.find(
            (candidate) => candidate.value === parsed.minimum
          );
    const kindGuidance = techLevelReference.guidanceByKind[item.kind] || {};
    const generalGuidance = uniqueStrings([
      firstString(level && level.summary),
      firstString(kindGuidance.description),
    ]).join(" ");
    return generalGuidance
      ? `The exact item explanation is unavailable. General guidance for recorded TL ${recordedValue}: ${generalGuidance}`
      : `The exact item explanation is unavailable. This record lists TL ${recordedValue}; check the cited item rulebook for context.`;
  }

  function setStatus(state, message, isError = false) {
    state.status.textContent = message;
    state.status.classList.toggle("is-error", isError);
  }

  function humanizeReviewFlag(flag) {
    if (REVIEW_FLAG_MESSAGES[flag]) return REVIEW_FLAG_MESSAGES[flag];
    const words = flag.replaceAll("_", " ").trim();
    return words ? `${words.charAt(0).toUpperCase()}${words.slice(1)}.` : "";
  }

  function renderReviewNotice(state, item) {
    const reviewNeeded =
      item.summaryStatus === "needs_review" || item.reviewFlags.length > 0;
    const unresolvedSkill =
      item.kind === "weapon" &&
      (item.requiredSkillStatus === "ambiguous" ||
        item.requiredSkillStatus === "unresolved");

    state.reviewNotice.hidden = !reviewNeeded && !unresolvedSkill;
    state.reviewReasons.replaceChildren();
    if (state.reviewNotice.hidden) return;

    const messages = [];
    if (unresolvedSkill) {
      messages.push(
        "The required skill is not resolved. The Skill cell is left blank and editable; check the cited source before play."
      );
    }
    item.reviewFlags.forEach((flag) => {
      if (flag === "required_skill_ambiguous" || flag === "required_skill_unresolved") {
        return;
      }
      const message = humanizeReviewFlag(flag);
      if (message) messages.push(message);
    });
    if (messages.length === 0) {
      messages.push(
        "Check the cited source before relying on fields that have not completed source review."
      );
    }
    uniqueStrings(messages).forEach((message) => {
      state.reviewReasons.appendChild(createElement("li", "", message));
    });
  }

  function renderDetails(state, item, loading = false) {
    state.detail.hidden = false;
    state.variantChooser.hidden = true;
    state.detailContent.hidden = false;
    state.detailTitle.textContent = itemName(item);
    state.detailMeta.textContent = item.statLine || "No compact stat line is available.";
    state.detailContext.textContent = [itemVariantLabel(item), scopeDescription(item)]
      .filter(Boolean)
      .join(" · ");
    renderReviewNotice(state, item);
    state.techLevelSummary.textContent = techLevelDetailSummary(item);
    state.techLevelDescription.textContent = loading
      ? "Loading the exact Tech Level explanation…"
      : item.techLevelDescription || fallbackTechLevelDescription(item);
    state.techLevelReferences.replaceChildren();
    state.description.textContent = loading
      ? "Loading the condensed description…"
      : item.descriptionSummary || "No condensed description is available. See the cited rulebook entry.";
    state.rules.textContent = loading
      ? "Loading the condensed rules…"
      : item.rulesSummary || "No condensed rule is available. Use the cited rulebook entry for adjudication.";
    state.lawLevelDescription.textContent = loading
      ? "Loading the exact Law Level explanation…"
      : item.lawLevelDescription || fallbackLawLevelDescription(item);
    state.lawLevelReferences.replaceChildren();
    state.references.replaceChildren();

    if (loading) {
      state.techLevelReferences.appendChild(
        createElement("li", "", "Loading Tech Level references…")
      );
      state.lawLevelReferences.appendChild(
        createElement("li", "", "Loading Law Level references…")
      );
      const reference = createElement("li", "", "Loading rulebook references…");
      state.references.appendChild(reference);
    } else {
      if (item.techLevelSourceReferences.length === 0) {
        state.techLevelReferences.appendChild(
          createElement(
            "li",
            "",
            "No separate Tech Level reference is available for this record."
          )
        );
      } else {
        item.techLevelSourceReferences.forEach((source) => {
          state.techLevelReferences.appendChild(
            createElement("li", "", formatReference(source))
          );
        });
      }
      if (item.lawLevelSourceReferences.length === 0) {
        state.lawLevelReferences.appendChild(
          createElement(
            "li",
            "",
            "No separate Law Level reference is available for this record."
          )
        );
      } else {
        item.lawLevelSourceReferences.forEach((source) => {
          state.lawLevelReferences.appendChild(
            createElement("li", "", formatReference(source))
          );
        });
      }
      if (item.sourceReferences.length === 0) {
        state.references.appendChild(
          createElement("li", "", "No rulebook reference is available for this record.")
        );
      } else {
        item.sourceReferences.forEach((source) => {
          state.references.appendChild(createElement("li", "", formatReference(source)));
        });
      }
    }
  }

  function renderVariantChooser(state, group) {
    state.detail.hidden = false;
    state.variantChooser.hidden = false;
    state.detailContent.hidden = true;
    state.detailTitle.textContent = group.canonicalName;
    state.detailMeta.textContent = `${group.variants.length} exact catalog variants are available.`;
    state.detailContext.textContent = "Choose the rulebook, Tech Level, and configuration that match the character.";
    state.variantList.replaceChildren();
    group.variants.forEach((item) => {
      const button = createElement("button", "gear-locker-variant");
      button.type = "button";
      const label = createElement(
        "span",
        "gear-locker-variant-label",
        itemVariantLabel(item) || item.displayName
      );
      const stats = createElement(
        "span",
        "gear-locker-variant-stats",
        [
          item.statLine || "No compact stat line is available.",
          lawLevelValueLabel(item.lawLevel),
          legalCategoryLabel(item.legalCategory),
        ].join(" · ")
      );
      button.append(label, stats);
      if (variantIsOnSheet(item.variantId)) {
        button.appendChild(createElement("span", "gear-locker-variant-added", "Already on sheet"));
      }
      button.addEventListener("click", () => selectItem(state, item, { group }));
      state.variantList.appendChild(button);
    });
  }

  function selectGroup(state, group) {
    if (!group) return;
    state.selectedGroup = group;
    state.selectedItem = null;
    state.detailRequest += 1;
    state.add.disabled = true;
    state.root.classList.add("gear-locker-detail-active");
    renderResults(state);
    if (group.variants.length === 1) {
      selectItem(state, group.variants[0], { group });
      return;
    }
    renderVariantChooser(state, group);
    setStatus(
      state,
      `${group.canonicalName} has ${group.variants.length} exact variants. Choose one to continue.`
    );
    if (window.matchMedia("(max-width: 767px)").matches) {
      state.detailTitle.focus({ preventScroll: true });
    }
  }

  async function selectItem(state, item, options = {}) {
    state.selectedGroup = options.group || {
      itemId: item.itemId,
      canonicalName: itemName(item),
      variants: catalog.itemsByItemId.get(item.itemId) || [item],
    };
    state.selectedItem = item;
    state.techLevelDisclosure.open = false;
    state.editingRow = options.editingRow || null;
    setEditingControls(state, Boolean(state.editingRow));
    const savedState = isRecord(options.savedState) ? options.savedState : {};
    state.quantity.value = String(savedState.quantity || 1);
    state.equipped.checked = savedState.equipped === true;
    state.notes.value = stringValue(savedState.notes);
    state.stateDisclosure.open = Boolean(
      state.editingRow ||
      Number(savedState.quantity || 1) !== 1 ||
      savedState.equipped === true ||
      stringValue(savedState.notes).trim()
    );
    state.add.textContent = state.editingRow
      ? "Update item state"
      : variantIsOnSheet(item.variantId)
        ? `Add another ${SECTION_LABELS[state.activeKind]}`
        : `Add ${SECTION_LABELS[state.activeKind]} to character`;
    state.cancelEdit.hidden = !state.editingRow;
    state.add.disabled = false;
    state.root.classList.add("gear-locker-detail-active");
    renderResults(state);
    renderDetails(state, item, Boolean(item.detailShard || findManifestShard(item.itemId)));
    const request = ++state.detailRequest;

    try {
      const detailedItem = await loadItemDetails(item);
      if (request !== state.detailRequest) return;
      state.selectedItem = detailedItem;
      renderDetails(state, detailedItem, false);
      setStatus(
        state,
        state.editingRow
          ? `Editing character-specific state for ${detailedItem.displayName}.`
          : `${detailedItem.displayName} is ready to add.`
      );
      if (window.matchMedia("(max-width: 767px)").matches) {
        state.detailTitle.focus({ preventScroll: true });
      }
    } catch (error) {
      if (request !== state.detailRequest) return;
      renderDetails(state, item, false);
      setStatus(
        state,
        `The detailed record could not be loaded; the index summary is shown. ${error.message}`,
        true
      );
    }
  }

  function currentGearState(state) {
    const quantity = Number.parseInt(state.quantity.value, 10);
    return {
      quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
      equipped: state.equipped.checked,
      notes: state.notes.value,
    };
  }

  function catalogReference(item) {
    return {
      schemaVersion: item.schemaVersion || catalog.schemaVersion,
      catalogVersion: item.catalogVersion || catalog.catalogVersion,
      itemId: item.itemId,
      definitionId: item.definitionId,
      variantId: item.variantId,
    };
  }

  function buildCharacterGear(item, state) {
    const extension = {
      catalogRef: catalogReference(item),
      state,
    };

    if (item.kind === "weapon") {
      return {
        name: item.canonicalName || item.sheet.name || item.displayName,
        tl: item.sheet.tl,
        skill: item.sheet.skill,
        damage: item.sheet.damage,
        range: item.sheet.range,
        weight: item.sheet.weight,
        magazine: item.sheet.magazine,
        ...extension,
      };
    }
    if (item.kind === "armour") {
      return {
        name: item.canonicalName || item.sheet.name || item.displayName,
        rating: item.sheet.rating,
        tl: item.sheet.tl,
        radiation: item.sheet.radiation,
        ...extension,
      };
    }
    if (item.kind === "augment") {
      return {
        type: item.canonicalName || item.sheet.type || item.displayName,
        tl: item.sheet.tl,
        improvement: item.sheet.improvement,
        ...extension,
      };
    }
    return {
      name: item.canonicalName || item.sheet.name || item.displayName,
      tl: item.sheet.tl,
      mass: item.sheet.mass,
      cost: item.sheet.cost,
      ...extension,
    };
  }

  function addOrUpdateSelected(state) {
    if (!state.selectedItem) {
      setStatus(
        state,
        `Choose a ${SECTION_LABELS[state.activeKind]} before adding it.`,
        true
      );
      return;
    }

    const library = window.TravellerCharacterLibrary;
    if (!library) {
      setStatus(state, "Character storage is not available right now.", true);
      return;
    }

    const gearState = currentGearState(state);
    try {
      if (state.editingRow) {
        library.updateGearRowState(state.editingRow, gearState);
        setStatus(state, `${state.selectedItem.displayName} state was updated.`);
        state.editingRow = null;
        state.add.textContent = `Add ${SECTION_LABELS[state.activeKind]} to character`;
        state.cancelEdit.hidden = true;
        setEditingControls(state, false);
        state.root.close();
        return;
      }

      const gear = buildCharacterGear(state.selectedItem, gearState);
      library.addGearItem(state.activeKind, gear);
      renderResults(state);
      state.quantity.value = "1";
      state.equipped.checked = false;
      state.notes.value = "";
      state.stateDisclosure.open = false;
      state.add.textContent = `Add another ${SECTION_LABELS[state.activeKind]}`;
      setStatus(
        state,
        `${state.selectedItem.displayName} was added to the ${SECTION_TITLES[state.activeKind].toLocaleLowerCase()} table. You can keep browsing or choose Done.`
      );
    } catch (error) {
      setStatus(state, `The item could not be added: ${error.message}`, true);
    }
  }

  function cancelEditMode(state, announce = true) {
    state.editingRow = null;
    state.quantity.value = "1";
    state.equipped.checked = false;
    state.notes.value = "";
    state.stateDisclosure.open = false;
    state.add.textContent = `Add ${SECTION_LABELS[state.activeKind]} to character`;
    state.cancelEdit.hidden = true;
    setEditingControls(state, false);
    if (announce) setStatus(state, "Item state editing was cancelled.");
  }

  function setEditingControls(state, editing) {
    const disabled = editing || !state.loaded;
    state.search.disabled = disabled;
    state.personalScope.disabled = disabled;
    state.allScope.disabled = disabled;
    state.kindTabButtons.forEach(({ button }) => {
      button.disabled = disabled;
    });
    state.results.tabIndex = editing ? -1 : 0;
    state.results.setAttribute("aria-disabled", String(editing));
    state.more.disabled = editing;
    state.root.classList.toggle("gear-locker-editing", editing);
  }

  function showResultsOnSmallScreen(state) {
    state.root.classList.remove("gear-locker-detail-active");
    state.results.focus();
    updateActiveResult(state, state.activeResultIndex, true);
  }

  function showLocker(state, kind, returnFocus = document.activeElement, filters = {}) {
    const normalizedKind = normalizeKind(kind);
    if (!normalizedKind) return;
    state.returnFocus = returnFocus;
    state.techLevelFilter = normalizedTechLevelFilter(filters.techLevel);
    state.lawLevelFilter = normalizedLawLevelFilter(filters.lawLevel);
    state.legalCategoryFilter = normalizedLegalCategoryFilter(filters.legalCategory);
    state.skillFilterByKind.set(
      normalizedKind,
      normalizedSkillFilter(filters.skill, normalizedKind)
    );
    state.sortOrderByKind.set(
      normalizedKind,
      normalizedSortOrder(filters.sort)
    );
    setActiveKind(state, normalizedKind);
    if (!state.root.open) state.root.showModal();
    if (state.loaded) {
      setStatus(
        state,
        `${state.items.length} catalog variants are available. Personal ${SECTION_TITLES[state.activeKind].toLocaleLowerCase()} matching ${filterDescription(state)} are shown.`
      );
      state.search.focus();
    } else {
      setStatus(state, "Loading the gear catalog…");
    }
  }

  function applyCatalogToLocker(state) {
    state.items = catalog.items;
    state.loaded = true;
    state.root.setAttribute("aria-busy", "false");
    state.search.disabled = false;
    state.personalScope.disabled = false;
    state.allScope.disabled = false;
    state.kindTabButtons.forEach(({ button }) => {
      button.disabled = false;
    });
    updateScopeVisibility(state);
    updateKindCounts(state);
    renderResults(state);
    setStatus(
      state,
      `${state.items.length} catalog variants loaded. Personal ${SECTION_TITLES[state.activeKind].toLocaleLowerCase()} matching ${filterDescription(state)} are shown.`
    );
    if (state.root.open) state.search.focus();
  }

  function reportCatalogFailure(error) {
    if (!lockerState) return;
    lockerState.root.setAttribute("aria-busy", "false");
    lockerState.search.disabled = true;
    lockerState.personalScope.disabled = true;
    lockerState.allScope.disabled = true;
    lockerState.results.replaceChildren(
      createElement(
        "li",
        "gear-locker-empty",
        "The catalog is unavailable. Close this window and use Add custom beside any gear table."
      )
    );
    lockerState.resultsSummary.textContent = "Unavailable";
    setStatus(
      lockerState,
      `The gear catalog could not be loaded: ${error.message}`,
      true
    );
  }

  async function ensureCatalog() {
    if (catalog) return catalog;
    if (initializationPromise) return initializationPromise;
    initializationPromise = (async () => {
      try {
        catalog = await loadCatalog();
        applyCatalogToLocker(lockerState);
        return catalog;
      } catch (error) {
        console.error("Traveller gear catalog initialization failed:", error);
        reportCatalogFailure(error);
        initializationPromise = null;
        throw error;
      }
    })();
    return initializationPromise;
  }

  function initialize() {
    if (lockerState) return lockerState;
    populateTechLevelFilters();
    populateSkillFilters();
    initializeTechLevelHelp();
    initializeLawLevelHelp();
    initializeLegalCategoryHelp();
    const root = document.querySelector("[data-gear-catalog-locker]");
    if (!root) return null;
    lockerState = createLocker(root);
    return lockerState;
  }

  async function openSavedItem(section, row) {
    const kind = normalizeKind(section);
    const state = initialize();
    if (!state || !kind) return;
    const returnFocus = document.activeElement;
    showLocker(state, kind, returnFocus);
    try {
      await ensureCatalog();
    } catch (error) {
      return;
    }

    const library = window.TravellerCharacterLibrary;
    if (!library) return;
    const metadata = library.gearMetadataFromRow(row);
    const catalogRef = metadata.catalogRef;
    let item =
      catalogRef && catalogRef.variantId
        ? catalog.itemsByVariantId.get(catalogRef.variantId)
        : null;

    // Early draft saves did not always include a variant identifier. Only use
    // an item-level fallback when it still resolves to one unambiguous variant.
    if (!item && catalogRef && catalogRef.itemId) {
      const candidates = catalog.itemsByItemId.get(catalogRef.itemId) || [];
      const definitionMatches = catalogRef.definitionId
        ? candidates.filter(
            (candidate) => candidate.definitionId === catalogRef.definitionId
          )
        : candidates;
      if (definitionMatches.length === 1) item = definitionMatches[0];
    }
    if (!item) {
      setStatus(
        state,
        "This saved item references a catalog record that is no longer available. Its saved table values remain unchanged.",
        true
      );
      return;
    }

    setScope(state, item.personalDefault ? "personal" : "all");
    state.search.value = itemName(item);
    renderResults(state);
    await selectItem(state, item, {
      editingRow: row,
      savedState: metadata.state,
    });
    state.detailTitle.focus({ preventScroll: true });
  }

  function resetSavedItemEditors() {
    if (!lockerState || !lockerState.editingRow) return;
    cancelEditMode(lockerState, false);
    if (lockerState.root.open) lockerState.root.close();
  }

  window.TravellerGearCatalog = Object.freeze({
    manifestPath: CATALOG_MANIFEST,
    initialize,
    ensureCatalog,
    openSavedItem,
    resetSavedItemEditors,
  });

  document.addEventListener("DOMContentLoaded", () => {
    initialize();
  });
})();
