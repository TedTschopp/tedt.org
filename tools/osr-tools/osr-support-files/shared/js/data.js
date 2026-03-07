(function () {
  const tableCache = new Map();
  const tableStatus = new Map();
  let warnedAboutFileProtocol = false;

  function baseDataUrl() {
    return new URL('./osr-support-files/db-json-export/', window.location.href);
  }

  function isFileProtocol() {
    return String(window.location.protocol || '').toLowerCase() === 'file:';
  }

  async function fetchTable(tableFile) {
    if (tableCache.has(tableFile)) {
      return tableCache.get(tableFile);
    }

    if (isFileProtocol()) {
      if (!warnedAboutFileProtocol) {
        warnedAboutFileProtocol = true;
        console.warn(
          '[WizardawnData] Running on file://. Browser security blocks local JSON fetch, ' +
          'so runtime is using fallback data. For full parity, serve via http://localhost.'
        );
      }

      const fallbackPromise = Promise.resolve([]);
      tableStatus.set(tableFile, 'fallback');
      tableCache.set(tableFile, fallbackPromise);
      return fallbackPromise;
    }

    const tableUrl = new URL(tableFile, baseDataUrl()).toString();
    const promise = fetch(tableUrl, { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${tableFile} (${response.status}) from ${tableUrl}`);
        }
        const rows = await response.json();
        tableStatus.set(tableFile, 'json');
        return rows;
      })
      .catch((error) => {
        tableCache.delete(tableFile);
        if (isFileProtocol()) {
          tableStatus.set(tableFile, 'fallback');
          return [];
        }
        tableStatus.set(tableFile, 'error');
        throw error;
      });

    tableCache.set(tableFile, promise);
    return promise;
  }

  function getTableStatus(tableFile) {
    return tableStatus.get(tableFile) || 'unknown';
  }

  function getGeomorphDataMode() {
    const status = getTableStatus('geomorphs.json');
    if (status === 'json') {
      return 'JSON';
    }
    if (status === 'fallback') {
      return 'Fallback';
    }
    return 'Unknown';
  }

  function toInt(value, fallback = 0) {
    const parsed = Number.parseInt(String(value ?? '').trim(), 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  function parseFirstInt(value, fallback = 0) {
    const text = String(value ?? '');
    const match = text.match(/-?\d+/);
    if (!match) {
      return fallback;
    }
    const parsed = Number.parseInt(match[0], 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  function toBoolFromFlag(value) {
    return String(value ?? '0') === '1';
  }

  async function getLabLordSpells() {
    const rows = await fetchTable('lablord_spells.json');
    return rows.map((row) => ({
      id: toInt(row.ls_id),
      rules: row.ls_rules || '',
      name: row.ls_name || '',
      reverse: toBoolFromFlag(row.ls_reverse),
      class: row.ls_class || '',
      level: toInt(row.ls_level),
      duration: row.ls_duration || '',
      range: row.ls_range || '',
      text: row.ls_text || '',
      ref: toInt(row.ls_ref)
    }));
  }

  async function getOsricSpells() {
    const rows = await fetchTable('osric_spells.json');
    return rows.map((row) => ({
      id: toInt(row.id),
      name: row.name || '',
      mage: row.mage || '',
      level: toInt(row.level),
      type: row.type || '',
      school: row.school || '',
      range: row.range || '',
      duration: row.duration || '',
      area: row.area || '',
      components: row.components || '',
      casting: row.casting || '',
      save: row.save || '',
      description: row.description || '',
      reverse: toBoolFromFlag(row.reverse),
      refs: toInt(row.refs)
    }));
  }

  function normalizeCreator(value) {
    return String(value || '').trim().toUpperCase();
  }

  function normalizeSource(value) {
    return String(value || '').trim().toUpperCase();
  }

  function splitGameTokens(value) {
    return String(value || '')
      .toUpperCase()
      .split('X')
      .map((token) => token.trim())
      .filter(Boolean);
  }

  function isSrcCreator(creator) {
    return creator.startsWith('SRC:');
  }

  function isAdndCoreCreator(creator) {
    return creator === 'AD' || creator.startsWith('AD&D');
  }

  function isAdndSourceCreator(creator, includeFf = false, includeMm2 = false) {
    if (!isSrcCreator(creator)) {
      return false;
    }
    if (creator.includes('MM2') && !includeMm2) {
      return false;
    }
    if (creator.includes('FF') && !includeFf) {
      return false;
    }
    return creator.includes('MM') || creator.includes('FF');
  }

  function getCreatorCodesForGame(gameCode, includeFf = false, includeMm2 = false) {
    const game = normalizeSource(gameCode);
    if (game === 'AD') {
      return ['AD'];
    }
    if (game === 'AEC') {
      return ['AEC'];
    }
    if (game === 'BFRPG') {
      return ['BFRPG'];
    }
    if (game === 'BU') {
      return ['BU'];
    }
    if (game === 'BX') {
      return ['BX'];
    }
    if (game === 'LL') {
      return ['LL'];
    }
    if (game === 'MF') {
      return ['MF'];
    }
    if (game === 'OSRIC') {
      return ['OSRIC'];
    }
    if (game === 'SW') {
      return ['SW'];
    }
    if (game === 'SX') {
      return ['SX'];
    }
    if (game === 'TT') {
      return ['TT'];
    }
    if (game === 'ALL') {
      return ['ALL', includeFf ? 'FF' : '', includeMm2 ? 'MM2' : ''].filter(Boolean);
    }
    return [];
  }

  function matchesGameFilters(monster, gameCode, includeFf = false, includeMm2 = false) {
    const creator = normalizeCreator(monster.creator);
    const source = normalizeSource(monster.source);
    const game = normalizeSource(gameCode);

    if (game === 'ALL') {
      return true;
    }

    if (game === 'AD') {
      return isAdndCoreCreator(creator) || isAdndSourceCreator(creator, includeFf, includeMm2);
    }

    const creatorCodes = getCreatorCodesForGame(game, includeFf, includeMm2);
    if (!creatorCodes.length) {
      return source === game;
    }

    return creatorCodes.some((code) => creator.startsWith(code) || source === code);
  }

  async function getMonstersRpgs() {
    const rows = await fetchTable('monsters_rpgs.json');
    return rows.map((row) => ({
      id: toInt(row.id),
      ctype: toInt(row.ctype),
      name: String(row.name || ''),
      source: normalizeSource(row.source),
      creator: normalizeCreator(row.creator),
      difficulty: parseFirstInt(row.difficulty),
      location: String(row.location || '').trim(),
      terrains: String(row.location || '').trim().split(/\s+/).filter(Boolean),
      rarity: parseFirstInt(row.rarity),
      common: parseFirstInt(row.common),
      freqCode: parseFirstInt(row.freq_code),
    }));
  }

  async function getMonstersForGame(gameCode, options = {}) {
    const includeFf = !!options.includeFf;
    const includeMm2 = !!options.includeMm2;
    const rows = await getMonstersRpgs();
    return rows.filter((row) => matchesGameFilters(row, gameCode, includeFf, includeMm2));
  }

  async function getMonsterNamesForCreatorPrefixes(prefixes = []) {
    const normalizedPrefixes = prefixes.map((prefix) => normalizeCreator(prefix));
    const rows = await getMonstersRpgs();
    const names = rows
      .filter((row) => normalizedPrefixes.some((prefix) => row.creator.startsWith(prefix)))
      .map((row) => row.name)
      .filter(Boolean);
    return [...new Set(names)];
  }

  async function getStoreItems() {
    const rows = await fetchTable('store_items.json');
    return rows.map((row) => ({
      id: toInt(row.id),
      item: String(row.item || ''),
      cost: parseFirstInt(row.cost),
      era: String(row.era || '').trim(),
      eraCode: String(row.era || '').trim().toUpperCase(),
      store: String(row.store || '').trim(),
      storeCode: String(row.store || '').trim().toUpperCase(),
      game: String(row.game || '').trim(),
      gameCodes: splitGameTokens(row.game),
      qty: parseFirstInt(row.qty),
      note1: String(row.note1 || '').trim(),
      note2: String(row.note2 || '').trim(),
    }));
  }

  async function getStoreItemsForGames(gameCodes = []) {
    const wanted = gameCodes.map((code) => normalizeSource(code));
    const rows = await getStoreItems();
    if (!wanted.length) {
      return rows;
    }
    return rows.filter((row) => row.gameCodes.some((code) => wanted.includes(code)));
  }

  async function getStoreItemsByStore(gameCodes = [], storeCodes = []) {
    const rows = await getStoreItemsForGames(gameCodes);
    const wantedStores = storeCodes.map((code) => String(code || '').trim().toUpperCase());
    if (!wantedStores.length) {
      return rows;
    }
    return rows.filter((row) => wantedStores.includes(row.storeCode));
  }

  async function getMutants() {
    const rows = await fetchTable('mutants.json');
    return rows.map((row) => ({
      id: toInt(row.id),
      name: String(row.name || '').trim(),
      attack1: String(row.attack1 || '').trim(),
      attack2: String(row.attack2 || '').trim(),
      legs: toInt(row.legs),
      fins: toInt(row.fins),
      wings: toInt(row.wings),
      slither: toInt(row.slither),
    }));
  }

  async function getWorldmapLegend() {
    const rows = await fetchTable('worldmap_legend.json');
    return rows.map((row) => ({
      id: toInt(row.ll_id),
      image: String(row.ll_image || '').trim(),
      name: String(row.ll_name || '').trim(),
      nameClean: String(row.ll_name || '').replace(/\s+/g, ' ').trim(),
    }));
  }

  async function getWorldmapPatterns() {
    const rows = await fetchTable('worldmap.json');
    return rows.map((row) => ({
      id: toInt(row.lm_id),
      category: String(row.lm_category || '').trim(),
      hexes: String(row.lm_hexes || '').trim(),
      done: toInt(row.lm_done),
      amount: toInt(row.lm_amount),
    }));
  }

  async function getGeomorphs() {
    const rows = await fetchTable('geomorphs.json');
    return rows.map((row) => ({
      id: toInt(row.id),
      image: String(row.image || '').trim(),
      coord: String(row.coord || '').trim(),
      spot: String(row.spot || '').trim(),
      more: String(row.more || '').trim(),
      delve: String(row.delve || '').trim(),
      terrain: String(row.terrain || '').trim().toLowerCase(),
      wayout: toInt(row.wayout),
      done: toInt(row.done),
    }));
  }

  function parseMapLayoutEntry(layoutEntry) {
    const raw = String(layoutEntry || '').trim();
    if (!raw) {
      return null;
    }

    const tokens = raw.split('0').map((token) => token.trim()).filter(Boolean);
    if (tokens.length < 3) {
      return null;
    }

    const terrainSet = new Set(['cave', 'dungeon']);
    const terrainIndex = tokens.findIndex((token) => terrainSet.has(token.toLowerCase()));
    if (terrainIndex < 0) {
      return null;
    }

    const spot = tokens[0].toLowerCase();
    const artist = tokens.slice(1, terrainIndex).join(' ').trim().toLowerCase();
    const terrain = tokens[terrainIndex].toLowerCase();
    const imageToken = String(tokens[terrainIndex + 1] || '');
    const image = imageToken.split('AAA')[0].trim().toLowerCase();

    return {
      spot,
      artist,
      terrain,
      image,
      raw,
    };
  }

  async function getMapsCreated() {
    const rows = await fetchTable('maps_created.json');
    return rows.map((row) => {
      const layoutEntries = String(row.mc_layout || '')
        .split('|')
        .map((value) => parseMapLayoutEntry(value))
        .filter(Boolean);

      const artists = [...new Set(layoutEntries.map((entry) => entry.artist).filter(Boolean))];
      const terrains = [...new Set(layoutEntries.map((entry) => entry.terrain).filter(Boolean))];
      const spots = [...new Set(layoutEntries.map((entry) => entry.spot).filter(Boolean))];

      return {
        id: toInt(row.mc_id),
        code: String(row.mc_code || '').trim(),
        type: String(row.mc_type || '').trim(),
        layout: String(row.mc_layout || '').trim(),
        date: String(row.mc_date || '').trim(),
        entries: layoutEntries,
        artists,
        terrains,
        spots,
      };
    });
  }

  window.WizardawnData = {
    fetchTable,
    getTableStatus,
    getGeomorphDataMode,
    getLabLordSpells,
    getOsricSpells,
    getMonstersRpgs,
    getMonstersForGame,
    getMonsterNamesForCreatorPrefixes,
    getStoreItems,
    getStoreItemsForGames,
    getStoreItemsByStore,
    getMutants,
    getWorldmapLegend,
    getWorldmapPatterns,
    getGeomorphs,
    getMapsCreated,
    matchesGameFilters,
    getCreatorCodesForGame,
  };
})();
