(function () {
  "use strict";

  const CATALOG_MANIFEST = "data/gear-catalog/manifest.json";
  const PAGE_SIZE = 40;
  const SUPPORTED_SCHEMA_MAJORS = new Set([0, 1]);
  const SECTION_LABELS = Object.freeze({
    weapon: "weapon",
    armour: "armor",
    augment: "augment",
    equipment: "equipment",
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
  const pickerStates = new Map();
  const detailShardCache = new Map();
  let catalog = null;
  let initializationPromise = null;

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
    };
  }

  function normalizeSourceReferences(value) {
    if (!Array.isArray(value)) return [];
    const seen = new Set();
    return value.reduce((references, rawReference) => {
      const reference = normalizeSourceReference(rawReference);
      if (!reference) return references;
      const key = `${reference.title}|${reference.pages.join(",")}|${reference.pageBasis}`;
      if (seen.has(key)) return references;
      seen.add(key);
      references.push(reference);
      return references;
    }, []);
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
    const sheet = normalizeSheet(raw, kind, displayName);
    const requiredSkillStatus = firstString(
      raw.requiredSkillStatus,
      raw.required_skill_status
    );
    if (
      kind === "weapon" &&
      (requiredSkillStatus === "ambiguous" ||
        requiredSkillStatus === "unresolved")
    ) {
      sheet.skill = "";
    }
    const searchParts = [
      displayName,
      statLine,
      sheetRole,
      ...domains,
      ...Object.values(sheet),
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
      domains,
      combatScale: firstString(raw.combatScale, raw.combat_scale),
      mountContext: firstString(raw.mountContext, raw.mount_context),
      displayName,
      statLine,
      descriptionSummary,
      rulesSummary,
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

  async function loadCatalog() {
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

  function addScopeOption(select, value, text) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    select.appendChild(option);
  }

  function createControl(labelText, control, className = "gear-catalog-control") {
    const wrapper = createElement("div", className);
    const label = createElement("label", "", labelText);
    label.htmlFor = control.id;
    wrapper.append(label, control);
    return wrapper;
  }

  function createPicker(root) {
    const kind = normalizeKind(root.dataset.gearKind);
    if (!kind) return null;
    const app = root.querySelector("[data-gear-catalog-app]");
    if (!app) return null;

    const sectionLabel = SECTION_LABELS[kind];
    const prefix = `${kind}-gear-catalog`;
    const controls = createElement("div", "gear-catalog-controls");
    const search = document.createElement("input");
    search.type = "search";
    search.id = `${prefix}-search`;
    search.className = "form-control";
    search.autocomplete = "off";
    search.placeholder = `Search ${sectionLabel} names, stats, skills, or roles`;

    const scope = document.createElement("select");
    scope.id = `${prefix}-scope`;
    scope.className = "form-select";
    addScopeOption(scope, "personal", "Personal gear (default)");
    addScopeOption(scope, "all", "All catalog entries");
    Object.entries(ROLE_LABELS).forEach(([value, text]) =>
      addScopeOption(scope, value, text)
    );
    controls.append(
      createControl(`Search ${sectionLabel} catalog`, search),
      createControl("Catalog scope", scope)
    );

    const workbench = createElement("div", "gear-catalog-workbench");
    const resultsPanel = createElement("section", "gear-catalog-results-panel");
    const resultsHeader = createElement("div", "gear-catalog-results-header");
    const resultsHeading = createElement("h4", "", "Matches");
    resultsHeading.id = `${prefix}-results-heading`;
    const resultsSummary = createElement("p", "gear-catalog-results-summary");
    resultsHeader.append(resultsHeading, resultsSummary);

    const results = createElement("ul", "gear-catalog-results");
    results.id = `${prefix}-results`;
    results.setAttribute("aria-labelledby", resultsHeading.id);
    search.setAttribute("aria-controls", results.id);
    scope.setAttribute("aria-controls", results.id);
    const moreWrap = createElement("div", "gear-catalog-more-wrap");
    const more = createElement("button", "gear-catalog-more", "Show more matches");
    more.type = "button";
    more.hidden = true;
    moreWrap.appendChild(more);
    resultsPanel.append(resultsHeader, results, moreWrap);

    const detail = createElement("article", "gear-catalog-detail");
    detail.id = `${prefix}-detail`;
    detail.tabIndex = -1;
    detail.hidden = true;
    const detailTitle = createElement("h4");
    const detailMeta = createElement("p", "gear-catalog-detail-meta");
    const detailContext = createElement("p", "gear-catalog-detail-context");
    const reviewNotice = createElement("div", "gear-catalog-review-notice");
    reviewNotice.hidden = true;
    const reviewBadge = createElement(
      "span",
      "gear-catalog-review-badge",
      "Source review needed"
    );
    const reviewReasons = createElement("ul", "gear-catalog-review-reasons");
    reviewNotice.append(reviewBadge, reviewReasons);
    const descriptionHeading = createElement("h5", "", "Description");
    const description = createElement("p", "gear-catalog-detail-copy");
    const rulesHeading = createElement("h5", "", "How to use it");
    const rules = createElement("p", "gear-catalog-detail-copy");
    const referencesHeading = createElement("h5", "", "Rules references");
    const references = createElement("ul", "gear-catalog-reference-list");

    const stateControls = createElement("div", "gear-catalog-state");
    const quantity = document.createElement("input");
    quantity.type = "number";
    quantity.id = `${prefix}-quantity`;
    quantity.className = "form-control";
    quantity.min = "1";
    quantity.step = "1";
    quantity.value = "1";
    const equipped = document.createElement("input");
    equipped.type = "checkbox";
    equipped.id = `${prefix}-equipped`;
    equipped.className = "form-check-input";
    const equippedWrapper = createElement("div", "gear-catalog-state-check");
    const equippedLabel = createElement("label", "", "Equipped or installed");
    equippedLabel.htmlFor = equipped.id;
    equippedWrapper.append(equipped, equippedLabel);
    const notes = document.createElement("textarea");
    notes.id = `${prefix}-notes`;
    notes.className = "form-control";
    notes.rows = 2;
    notes.placeholder = "Optional condition, ammunition, configuration, or other character-specific notes";
    stateControls.append(
      createControl("Quantity", quantity, "gear-catalog-state-control"),
      equippedWrapper,
      createControl("Character-specific notes", notes, "gear-catalog-state-control gear-catalog-state-notes")
    );

    const actions = createElement("div", "gear-catalog-actions");
    const add = createElement("button", "gear-catalog-add", `Add ${sectionLabel}`);
    add.type = "button";
    const cancelEdit = createElement(
      "button",
      "gear-catalog-cancel-edit",
      "Cancel edit"
    );
    cancelEdit.type = "button";
    cancelEdit.hidden = true;
    actions.append(add, cancelEdit);

    detail.append(
      detailTitle,
      detailMeta,
      detailContext,
      reviewNotice,
      descriptionHeading,
      description,
      rulesHeading,
      rules,
      referencesHeading,
      references,
      stateControls,
      actions
    );
    workbench.append(resultsPanel, detail);

    const status = createElement("p", "gear-catalog-status");
    status.id = `${prefix}-status`;
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.setAttribute("aria-atomic", "true");
    app.replaceChildren(controls, workbench, status);

    const state = {
      root,
      kind,
      sectionLabel,
      search,
      scope,
      results,
      resultsSummary,
      more,
      moreWrap,
      detail,
      detailTitle,
      detailMeta,
      detailContext,
      reviewNotice,
      reviewReasons,
      description,
      rules,
      references,
      quantity,
      equipped,
      notes,
      add,
      cancelEdit,
      status,
      items: [],
      visibleCount: PAGE_SIZE,
      selectedItem: null,
      editingRow: null,
      detailRequest: 0,
    };

    root.setAttribute("aria-busy", "true");
    search.disabled = true;
    scope.disabled = true;
    search.addEventListener("input", () => {
      state.visibleCount = PAGE_SIZE;
      renderResults(state);
    });
    scope.addEventListener("change", () => {
      state.visibleCount = PAGE_SIZE;
      renderResults(state);
    });
    more.addEventListener("click", () => {
      state.visibleCount += PAGE_SIZE;
      renderResults(state);
    });
    add.addEventListener("click", () => addOrUpdateSelected(state));
    cancelEdit.addEventListener("click", () => cancelEditMode(state));
    pickerStates.set(kind, state);
    return state;
  }

  function matchesScope(item, scope) {
    if (scope === "all") return true;
    if (scope === "personal") return item.personalDefault;
    return item.sheetRole === scope;
  }

  function filteredItems(state) {
    const query = state.search.value.trim().toLocaleLowerCase();
    return state.items.filter(
      (item) =>
        matchesScope(item, state.scope.value) &&
        (!query || item.searchText.includes(query))
    );
  }

  function resultMetadata(item) {
    const parts = [];
    if (item.statLine) parts.push(item.statLine);
    const role = ROLE_LABELS[item.sheetRole] || item.sheetRole.replaceAll("_", " ");
    if (role) parts.push(role);
    if (item.domains.length > 0) parts.push(item.domains.join(", "));
    return parts.join(" · ");
  }

  function renderResults(state) {
    const matches = filteredItems(state);
    const visible = matches.slice(0, state.visibleCount);
    state.results.replaceChildren();

    if (visible.length === 0) {
      const empty = createElement(
        "li",
        "gear-catalog-empty",
        "No matching catalog entries. Try a broader scope or a different search."
      );
      state.results.appendChild(empty);
    } else {
      visible.forEach((item) => {
        const listItem = createElement("li", "gear-catalog-result");
        const button = createElement("button", "gear-catalog-result-button");
        button.type = "button";
        if (
          state.selectedItem &&
          state.selectedItem.variantId === item.variantId
        ) {
          button.setAttribute("aria-current", "true");
        }
        const name = createElement("span", "gear-catalog-result-name", item.displayName);
        const metadata = createElement(
          "span",
          "gear-catalog-result-meta",
          resultMetadata(item)
        );
        button.append(name, metadata);
        button.addEventListener("click", () => selectItem(state, item));
        listItem.appendChild(button);
        state.results.appendChild(listItem);
      });
    }

    const shown = Math.min(visible.length, matches.length);
    state.resultsSummary.textContent = `${shown} of ${matches.length}`;
    state.more.hidden = shown >= matches.length;
    state.moreWrap.hidden = shown >= matches.length;
  }

  function scopeDescription(item) {
    const role = ROLE_LABELS[item.sheetRole] || item.sheetRole.replaceAll("_", " ");
    const domains = item.domains.length > 0 ? item.domains.join(", ") : "unclassified";
    return `${role} · ${domains}`;
  }

  function formatReference(reference) {
    if (reference.pages.length === 0) return reference.title;
    const pagePrefix = reference.pageBasis === "pdf" ? "PDF p." : "p.";
    const pluralPrefix = reference.pageBasis === "pdf" ? "PDF pp." : "pp.";
    return `${reference.title}, ${reference.pages.length === 1 ? pagePrefix : pluralPrefix} ${reference.pages.join(", ")}`;
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
    state.detailTitle.textContent = item.displayName;
    state.detailMeta.textContent = item.statLine || "No compact stat line is available.";
    state.detailContext.textContent = scopeDescription(item);
    renderReviewNotice(state, item);
    state.description.textContent = loading
      ? "Loading the condensed description…"
      : item.descriptionSummary || "No condensed description is available. See the cited rulebook entry.";
    state.rules.textContent = loading
      ? "Loading the condensed rules…"
      : item.rulesSummary || "No condensed rule is available. Use the cited rulebook entry for adjudication.";
    state.references.replaceChildren();

    if (loading) {
      const reference = createElement("li", "", "Loading rulebook references…");
      state.references.appendChild(reference);
    } else if (item.sourceReferences.length === 0) {
      const reference = createElement("li", "", "No rulebook reference is available for this record.");
      state.references.appendChild(reference);
    } else {
      item.sourceReferences.forEach((source) => {
        state.references.appendChild(createElement("li", "", formatReference(source)));
      });
    }
  }

  async function selectItem(state, item, options = {}) {
    state.selectedItem = item;
    state.editingRow = options.editingRow || null;
    const savedState = isRecord(options.savedState) ? options.savedState : {};
    state.quantity.value = String(savedState.quantity || 1);
    state.equipped.checked = savedState.equipped === true;
    state.notes.value = stringValue(savedState.notes);
    state.add.textContent = state.editingRow
      ? "Update item state"
      : `Add ${state.sectionLabel}`;
    state.cancelEdit.hidden = !state.editingRow;
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
        name: item.sheet.name || item.displayName,
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
        name: item.sheet.name || item.displayName,
        rating: item.sheet.rating,
        tl: item.sheet.tl,
        radiation: item.sheet.radiation,
        ...extension,
      };
    }
    if (item.kind === "augment") {
      return {
        type: item.sheet.type || item.displayName,
        tl: item.sheet.tl,
        improvement: item.sheet.improvement,
        ...extension,
      };
    }
    return {
      name: item.sheet.name || item.displayName,
      tl: item.sheet.tl,
      mass: item.sheet.mass,
      cost: item.sheet.cost,
      ...extension,
    };
  }

  function addOrUpdateSelected(state) {
    if (!state.selectedItem) {
      setStatus(state, `Choose a ${state.sectionLabel} before adding it.`, true);
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
        state.add.textContent = `Add ${state.sectionLabel}`;
        state.cancelEdit.hidden = true;
        return;
      }

      const gear = buildCharacterGear(state.selectedItem, gearState);
      library.addGearItem(state.kind, gear);
      setStatus(state, `${state.selectedItem.displayName} was added to the character.`);
    } catch (error) {
      setStatus(state, `The item could not be added: ${error.message}`, true);
    }
  }

  function cancelEditMode(state) {
    state.editingRow = null;
    state.quantity.value = "1";
    state.equipped.checked = false;
    state.notes.value = "";
    state.add.textContent = `Add ${state.sectionLabel}`;
    state.cancelEdit.hidden = true;
    setStatus(state, "Item state editing was cancelled.");
  }

  function applyCatalogToPicker(state) {
    state.items = catalog.items.filter((item) => item.kind === state.kind);
    state.root.setAttribute("aria-busy", "false");
    state.search.disabled = false;
    state.scope.disabled = false;
    renderResults(state);
    setStatus(
      state,
      `${state.items.length} ${state.sectionLabel} catalog entries loaded. Personal gear is shown first.`
    );
  }

  function reportCatalogFailure(error) {
    pickerStates.forEach((state) => {
      state.root.setAttribute("aria-busy", "false");
      state.search.disabled = true;
      state.scope.disabled = true;
      state.results.replaceChildren(
        createElement(
          "li",
          "gear-catalog-empty",
          "The catalog is unavailable. Manual and custom entry still works below."
        )
      );
      state.resultsSummary.textContent = "Unavailable";
      setStatus(state, `The gear catalog could not be loaded: ${error.message}`, true);
    });
  }

  async function initialize() {
    if (initializationPromise) return initializationPromise;
    initializationPromise = (async () => {
      document.querySelectorAll("[data-gear-catalog-picker]").forEach(createPicker);
      if (pickerStates.size === 0) return;

      try {
        catalog = await loadCatalog();
        pickerStates.forEach(applyCatalogToPicker);
      } catch (error) {
        console.error("Traveller gear catalog initialization failed:", error);
        reportCatalogFailure(error);
        throw error;
      }
    })();
    return initializationPromise;
  }

  async function openSavedItem(section, row) {
    const kind = normalizeKind(section);
    try {
      await initialize();
    } catch (error) {
      return;
    }

    const state = pickerStates.get(kind);
    const library = window.TravellerCharacterLibrary;
    if (!state || !library) return;
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
      state.root.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    await selectItem(state, item, {
      editingRow: row,
      savedState: metadata.state,
    });
    state.root.scrollIntoView({ behavior: "smooth", block: "start" });
    state.detail.focus({ preventScroll: true });
  }

  function resetSavedItemEditors() {
    pickerStates.forEach((state) => {
      if (!state.editingRow) return;
      cancelEditMode(state);
      setStatus(state, "The item state editor was closed when the character changed.");
    });
  }

  window.TravellerGearCatalog = Object.freeze({
    manifestPath: CATALOG_MANIFEST,
    initialize,
    openSavedItem,
    resetSavedItemEditors,
  });

  document.addEventListener("DOMContentLoaded", () => {
    initialize().catch(() => {
      // The picker reports its own actionable fallback while manual entry remains available.
    });
  });
})();
