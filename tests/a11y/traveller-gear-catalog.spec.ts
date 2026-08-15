import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGE = '/RPG/Traveller/Character-Sheet.html';

type CatalogFixtureItem = {
  variantId: string;
  descriptionSummary: string;
  rulesSummary: string;
  techLevelDescription?: string;
  techLevelSourceReferences?: Array<{ title: string; pages: number[]; pageBasis: string }>;
  lawLevelDescription?: string;
  lawLevelSourceReferences?: Array<{ title: string; pages: number[]; pageBasis: string }>;
  sourceReferences: Array<{ title: string; pages: number[]; pageBasis: string }>;
  summaryStatus?: string;
  reviewFlags?: string[];
  requiredSkillStatus?: string;
  [key: string]: unknown;
};

const lawLevelSourceReferences = [
  { title: 'Core Rulebook', pages: [224], pageBasis: 'printed' }
];

const techLevelGuidanceSources = {
  weapon: [{ title: 'Core Rulebook', pages: [73], pageBasis: 'printed', referenceType: 'tech_level_kind_guidance' }],
  armour: [{ title: 'Core Rulebook', pages: [91], pageBasis: 'printed', referenceType: 'tech_level_kind_guidance' }],
  augment: [{ title: 'Core Rulebook', pages: [99], pageBasis: 'printed', referenceType: 'tech_level_kind_guidance' }],
  equipment: [{ title: 'Core Rulebook', pages: [91], pageBasis: 'printed', referenceType: 'tech_level_kind_guidance' }]
};

const techLevelSourceReferences = [
  {
    title: 'Core Rulebook',
    pages: [5, 6, 226],
    pageBasis: 'printed',
    referenceType: 'tech_level_scale_world_guidance'
  }
];

const techLevelBands = [
  { minimum: 0, maximum: 3, band: 'primitive', title: 'Primitive' },
  { minimum: 4, maximum: 6, band: 'industrial', title: 'Industrial' },
  { minimum: 7, maximum: 9, band: 'pre_stellar', title: 'Pre-Stellar' },
  { minimum: 10, maximum: 11, band: 'early_stellar', title: 'Early Stellar' },
  { minimum: 12, maximum: 14, band: 'average_stellar', title: 'Average Stellar' },
  { minimum: 15, maximum: 15, band: 'high_stellar', title: 'High Stellar' }
];

const techLevelReference = {
  rulesContext: 'Tech Level definitions and item introduction guidance.',
  valueSemantics: 'world_capability_and_item_introduction_level',
  description: 'Tech Level (TL) describes the scientific and industrial capability behind a technology. It is not a legality rating or a guarantee that the item is in stock.',
  filterSemantics: 'Up to TL N includes variants whose safely parsed recorded TL, or the lower bound of a minimum/range expression, is no greater than N. Use it as a technology cutoff, not a guaranteed shopping list.',
  levels: Array.from({ length: 16 }, (_, value) => {
    const range = techLevelBands.find(candidate =>
      value >= candidate.minimum && value <= candidate.maximum
    )!;
    return {
      value,
      band: range.band,
      title: range.title,
      summary: `TL ${value} sits in the ${range.title} band.`,
      sourceReferences: techLevelSourceReferences
    };
  }),
  higherLevels: {
    minimum: 16,
    title: 'Advanced',
    summary: 'Advanced technology beyond mainstream Third Imperium science, with no theoretical upper limit.',
    sourceReferences: techLevelSourceReferences
  },
  unknownDescription: 'No usable TL is recorded. Unknown is not TL0 and does not imply legality or availability.',
  guidanceByKind: {
    weapon: {
      valueRole: 'first_appearance',
      description: 'The value marks when this weapon version first normally appears.',
      sourceReferences: techLevelGuidanceSources.weapon
    },
    armour: {
      valueRole: 'manufacturing_requirement',
      description: 'The value records the technology capability associated with this armour version.',
      sourceReferences: techLevelGuidanceSources.armour
    },
    augment: {
      valueRole: 'manufacturing_requirement',
      description: 'The value records the listed medical technology rating; exact surgical requirements may differ.',
      sourceReferences: techLevelGuidanceSources.augment
    },
    equipment: {
      valueRole: 'manufacturing_requirement',
      description: 'The exact meaning varies by equipment subtype; use the item-specific explanation.',
      sourceReferences: techLevelGuidanceSources.equipment
    }
  },
  sourceReferences: [
    ...techLevelSourceReferences,
    ...Object.values(techLevelGuidanceSources).flat().map(reference => ({
      ...reference,
      referenceType: 'tech_level_reference'
    }))
  ],
  notes: 'Imports, specialist access, and local repair capability can vary.'
};

const guidanceSources = {
  weapon: [{ title: 'Core Rulebook', pages: [224], pageBasis: 'printed' }],
  armour: [{ title: 'Core Rulebook', pages: [224], pageBasis: 'printed' }],
  augment: [{ title: 'Core Rulebook', pages: [213], pageBasis: 'printed' }],
  equipment: [{ title: 'Central Supply Catalogue', pages: [68], pageBasis: 'printed' }]
};

const rootLawLevelSources = [
  ...guidanceSources.weapon,
  ...guidanceSources.augment,
  ...guidanceSources.equipment
];

const weaponLawLevelLabels = [
  'No general weapon restriction',
  'Poison gas, explosives, undetectable weapons, and mass-destruction weapons',
  'Portable-energy and laser weapons',
  'Military weapons',
  'Light assault weapons and submachine guns',
  'Personal or concealable weapons',
  'Firearms except shotguns and stunners',
  'Shotguns',
  'Bladed weapons and stunners',
  'All weapons'
];

const armourLawLevelLabels = [
  'No general armour restriction',
  'Battle dress',
  'Combat armour',
  'Flak armour',
  'Cloth armour',
  'Mesh armour',
  'No new armour restriction',
  'No new armour restriction',
  'All visible armour',
  'All armour'
];

const lawLevelReference = {
  valueSemantics: 'first_restricted_world_law_level',
  description: 'A world\'s Law Level controls possession and enforcement. The numbered ladder is cumulative.',
  levels: Array.from({ length: 10 }, (_, index) => {
    const value = index === 9 ? '9+' : String(index);
    return {
      value,
      title: value === '4' ? 'Assault weapons and cloth armour' : `Law Level ${value}`,
      cumulative: true,
      guidanceByKind: {
        weapon: {
          ruleStatus: 'named_threshold',
          shortLabel: weaponLawLevelLabels[index],
          description: value === '4'
            ? 'Light assault weapons and submachine guns first become restricted.'
            : `Weapon guidance for Law Level ${value}.`,
          sourceReferences: guidanceSources.weapon
        },
        armour: {
          ruleStatus: 'named_threshold',
          shortLabel: armourLawLevelLabels[index],
          description: value === '4'
            ? 'Cloth armour first becomes restricted.'
            : `Armor guidance for Law Level ${value}.`,
          sourceReferences: guidanceSources.armour
        },
        augment: {
          ruleStatus: 'outside_global_table',
          shortLabel: 'No general augment threshold; check item rules',
          description: 'The Core table gives no blanket numeric ladder for augments; use an exact item rule or the world\'s law.',
          sourceReferences: guidanceSources.augment
        },
        equipment: {
          ruleStatus: 'outside_global_table',
          shortLabel: value === '4'
            ? 'Intrusion software exception; otherwise check item rules'
            : 'No general equipment threshold; check item rules',
          description: value === '4'
            ? 'General equipment uses exact-item or world rules; intrusion software is a direct Law Level 4 exception.'
            : 'General equipment uses exact-item or world rules.',
          sourceReferences: guidanceSources.equipment
        }
      }
    };
  }),
  undeterminedDescription: 'No exact source-backed first restriction level is assigned; undetermined does not mean legal.',
  undeterminedShortLabel: 'No exact source-backed level',
  sourceReferences: rootLawLevelSources
};

const indexItems: CatalogFixtureItem[] = [
  {
    itemId: 'item:weapon:accelerator-rifle:example',
    definitionId: 'definition:accelerator-rifle',
    variantId: 'variant:accelerator-rifle-tl9',
    kind: 'weapon',
    sheetRole: 'inventory',
    personalDefault: true,
    domains: ['personal'],
    combatScale: 'personal',
    mountContext: 'handheld',
    lawLevel: '6',
    legalCategory: 'category_2',
    displayName: 'Accelerator Rifle - Central Supply Catalogue - TL 9',
    statLine: 'TL 9 | Mass 2 kg | Cost Cr900 | Range 250m | Damage 3D | Magazine 15',
    descriptionSummary: 'A low-recoil rifle designed for use in low or zero gravity.',
    rulesSummary: 'Use Gun Combat (slug). The Zero-G trait avoids the usual recoil check.',
    sourceReferences: [
      { title: 'Central Supply Catalogue', pages: [112], pageBasis: 'pdf' }
    ],
    detailShard: 'details-00.json',
    sheet: {
      name: 'Accelerator Rifle',
      tl: 'TL 9',
      skill: 'Gun Combat (slug)',
      damage: '3D',
      range: '250m',
      weight: '2',
      magazine: '15'
    }
  },
  {
    itemId: 'item:weapon:accelerator-rifle:example',
    definitionId: 'definition:accelerator-rifle-core',
    variantId: 'variant:accelerator-rifle-core-tl9',
    kind: 'weapon',
    sheetRole: 'inventory',
    personalDefault: true,
    domains: ['personal'],
    combatScale: 'personal',
    mountContext: 'handheld',
    lawLevel: '7',
    legalCategory: 'category_3',
    displayName: 'Accelerator Rifle - Core Rulebook - TL 9',
    statLine: 'TL 9 | Mass 2 kg | Cost Cr900 | Range 250m | Damage 3D | Magazine 15',
    descriptionSummary: 'The Core Rulebook variant of the low-recoil rifle.',
    rulesSummary: 'Use Gun Combat (slug) and the Zero-G trait for this exact variant.',
    sourceReferences: [
      { title: 'Core Rulebook', pages: [101], pageBasis: 'printed' }
    ],
    detailShard: 'details-00.json',
    sheet: {
      name: 'Accelerator Rifle',
      tl: '9',
      skill: 'Gun Combat (slug)',
      damage: '3D',
      range: '250m',
      weight: '2',
      magazine: '15'
    }
  },
  {
    itemId: 'item:weapon:vehicle-laser:example',
    definitionId: 'definition:vehicle-laser',
    variantId: 'variant:vehicle-laser',
    kind: 'weapon',
    sheetRole: 'vehicle_system',
    personalDefault: false,
    domains: ['vehicle'],
    lawLevel: '2',
    legalCategory: 'prohibited',
    displayName: 'Vehicle Laser',
    statLine: 'TL 10 | Damage 5D',
    descriptionSummary: 'A vehicle-mounted laser.',
    rulesSummary: 'Resolve this attack at vehicle scale.',
    sourceReferences: [{ title: 'Vehicle Handbook', pages: [44], pageBasis: 'printed' }],
    detailShard: 'details-00.json',
    sheet: {
      name: 'Vehicle Laser',
      tl: '10',
      skill: 'Gunner (turret)',
      damage: '5D',
      range: '1km',
      weight: '-',
      magazine: '-'
    }
  },
  {
    itemId: 'item:weapon:claw:example',
    definitionId: 'definition:claw',
    variantId: 'variant:claw',
    kind: 'weapon',
    sheetRole: 'innate_attack',
    personalDefault: false,
    summaryStatus: 'needs_review',
    reviewFlags: ['required_skill_unresolved', 'incomplete_structured_profile'],
    requiredSkillStatus: 'unresolved',
    domains: ['personal', 'biological'],
    displayName: 'Claw',
    statLine: 'Damage 2D',
    descriptionSummary: 'A biological claw attack.',
    rulesSummary: 'Resolve as an innate melee attack.',
    sourceReferences: [{ title: 'Robot Handbook', pages: [22], pageBasis: 'printed' }],
    detailShard: 'details-00.json',
    sheet: {
      name: 'Claw',
      tl: '8 Melee',
      skill: '',
      damage: '2D',
      range: 'Melee',
      weight: '-',
      magazine: '-'
    }
  },
  {
    itemId: 'item:armour:cloth:example',
    definitionId: 'definition:cloth',
    variantId: 'variant:cloth',
    kind: 'armour',
    sheetRole: 'inventory',
    personalDefault: true,
    domains: ['personal'],
    lawLevel: '9+',
    legalCategory: 'category_1',
    displayName: 'Cloth Armor',
    statLine: 'TL 7 | Protection +8',
    descriptionSummary: 'Flexible personal armor.',
    rulesSummary: 'Apply Protection +8 while worn.',
    sourceReferences: [{ title: 'Core Rulebook', pages: [95], pageBasis: 'printed' }],
    detailShard: 'details-00.json',
    sheet: { name: 'Cloth Armor', rating: '+8', tl: '7', radiation: '-' }
  },
  {
    itemId: 'item:augment:neural-link:example',
    definitionId: 'definition:neural-link',
    variantId: 'variant:neural-link',
    kind: 'augment',
    sheetRole: 'inventory',
    personalDefault: true,
    domains: ['personal'],
    lawLevel: '8',
    legalCategory: 'category_4',
    displayName: 'Neural Link',
    statLine: 'TL 12 | Cost Cr10000',
    descriptionSummary: 'A neural interface augment.',
    rulesSummary: 'Apply its listed interface modifier when connected.',
    sourceReferences: [{ title: 'Central Supply Catalogue', pages: [67], pageBasis: 'pdf' }],
    detailShard: 'details-00.json',
    sheet: { type: 'Neural Link', tl: '12', improvement: 'Neural interface' }
  },
  {
    itemId: 'item:equipment:communicator:example',
    definitionId: 'definition:communicator',
    variantId: 'variant:communicator',
    kind: 'equipment',
    sheetRole: 'inventory',
    personalDefault: true,
    domains: ['personal'],
    lawLevel: '5',
    legalCategory: 'category_1',
    displayName: 'Communicator',
    statLine: 'TL 8 | Mass 0.5 kg | Cost Cr250',
    descriptionSummary: 'A portable personal communicator.',
    rulesSummary: 'Use it to communicate within its listed range.',
    sourceReferences: [{ title: 'Core Rulebook', pages: [103], pageBasis: 'printed' }],
    detailShard: 'details-00.json',
    sheet: { name: 'Communicator', tl: '8', mass: '0.5', cost: '250' }
  }
];

const compactIndexItems = indexItems.map(item => {
  const {
    descriptionSummary,
    rulesSummary,
    sourceReferences,
    techLevelDescription,
    techLevelSourceReferences,
    lawLevelDescription,
    lawLevelSourceReferences,
    ...indexItem
  } = item;
  const sheet = item.sheet as { name?: string; type?: string };
  return {
    ...indexItem,
    canonicalName: sheet.name || sheet.type || item.displayName
  };
});

const detailItems = indexItems.map(item => ({
  variantId: item.variantId,
  summaryStatus: item.summaryStatus,
  reviewFlags: item.reviewFlags,
  requiredSkillStatus: item.requiredSkillStatus,
  descriptionSummary: item.descriptionSummary,
  rulesSummary: item.rulesSummary,
  techLevelDescription: item.techLevelDescription ||
    `This exact fixture variant uses the source-recorded ${String((item.sheet as { tl?: string }).tl || 'unknown').replace(/^TL\s*/i, '')} technology rating.`,
  techLevelSourceReferences: item.techLevelSourceReferences ||
    techLevelGuidanceSources[item.kind as keyof typeof techLevelGuidanceSources],
  lawLevelDescription: item.lawLevelDescription ||
    `First restricted at Law Level ${String(item.lawLevel || 'undetermined')} for this exact fixture variant.`,
  lawLevelSourceReferences: item.lawLevelSourceReferences || lawLevelSourceReferences,
  sourceReferences: item.sourceReferences
}));

async function routeCatalog(
  page: Page,
  options: {
    perGuidanceSources?: boolean;
    schemaVersion?: string;
    includeTechLevelReference?: boolean;
    includeExactTechLevel?: boolean;
  } = {}
) {
  const schemaVersion = options.schemaVersion || '1.3.0';
  const manifestLawLevelReference = structuredClone(lawLevelReference);
  if (options.perGuidanceSources === false) {
    manifestLawLevelReference.levels.forEach(level => {
      Object.values(level.guidanceByKind).forEach(guidance => {
        delete (guidance as { sourceReferences?: unknown }).sourceReferences;
      });
    });
  }
  const manifest: Record<string, unknown> = {
    schemaVersion,
    catalogVersion: 'test-1',
    indexPath: 'index.json',
    detailShards: [{ id: '00', path: 'details-00.json', itemCount: indexItems.length }],
    lawLevelReference: manifestLawLevelReference
  };
  if (options.includeTechLevelReference !== false) {
    manifest.techLevelReference = techLevelReference;
  }
  const routedDetailItems = options.includeExactTechLevel === false
    ? detailItems.map(item => {
        const { techLevelDescription, techLevelSourceReferences, ...legacyItem } = item;
        return legacyItem;
      })
    : detailItems;

  await page.route('**/RPG/Traveller/data/gear-catalog/manifest.json', route =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(manifest)
    })
  );
  await page.route('**/RPG/Traveller/data/gear-catalog/index.json', route =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        schemaVersion,
        catalogVersion: 'test-1',
        items: compactIndexItems
      })
    })
  );
  await page.route('**/RPG/Traveller/data/gear-catalog/details-00.json', route =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        schemaVersion,
        catalogVersion: 'test-1',
        items: routedDetailItems
      })
    })
  );
}

function gearAddPanel(page: Page, kind: 'weapon' | 'armour' | 'augment' | 'equipment') {
  return page.locator(`[data-gear-add-panel="${kind}"]`);
}

async function openAddPanel(
  page: Page,
  kind: 'weapon' | 'armour' | 'augment' | 'equipment'
) {
  const panel = gearAddPanel(page, kind);
  if (!(await panel.evaluate(element => (element as HTMLDetailsElement).open))) {
    await panel.locator(':scope > summary').click();
  }
  return panel;
}

test.describe('Traveller gear catalog', () => {
  test('keeps Add controls closed beneath the prominent gear tables', async ({ page }) => {
    await page.goto(PAGE, { waitUntil: 'domcontentloaded' });

    const panels = page.locator('[data-gear-add-panel]');
    await expect(panels).toHaveCount(4);
    for (const kind of ['weapon', 'armour', 'augment', 'equipment'] as const) {
      const panel = gearAddPanel(page, kind);
      await expect(panel).not.toHaveAttribute('open', '');
      await expect(panel.getByText('Catalog filters')).not.toBeVisible();
      await expect(panel.locator('[data-gear-tech-level-help]')).not.toBeVisible();
      await expect(panel.locator('[data-gear-locker-open]')).not.toBeVisible();
    }

    const tablesComeFirst = await panels.evaluateAll(elements =>
      elements.every(element => element.previousElementSibling?.classList.contains('table-responsive'))
    );
    expect(tablesComeFirst).toBe(true);
  });

  test('explains Tech Level in a closed, kind-specific Add-filter disclosure', async ({ page }) => {
    await routeCatalog(page);
    await page.goto(PAGE, { waitUntil: 'domcontentloaded' });

    const expectedGuidance = {
      weapon: 'marks when this weapon version first normally appears',
      armour: 'technology capability associated with this armour version',
      augment: 'listed medical technology rating',
      equipment: 'exact meaning varies by equipment subtype'
    } as const;
    const expectedCitation = {
      weapon: 'Core Rulebook, p. 73',
      armour: 'Core Rulebook, p. 91',
      augment: 'Core Rulebook, p. 99',
      equipment: 'Core Rulebook, p. 91'
    } as const;
    const excludedKindCitations = {
      weapon: ['Core Rulebook, p. 91', 'Core Rulebook, p. 99'],
      armour: ['Core Rulebook, p. 73', 'Core Rulebook, p. 99'],
      augment: ['Core Rulebook, p. 73', 'Core Rulebook, p. 91'],
      equipment: ['Core Rulebook, p. 73', 'Core Rulebook, p. 99']
    } as const;

    for (const kind of ['weapon', 'armour', 'augment', 'equipment'] as const) {
      const panel = await openAddPanel(page, kind);
      const help = panel.locator('[data-gear-tech-level-help]');
      const body = panel.locator('[data-gear-tech-level-help-body]');
      await expect(help).not.toHaveAttribute('open', '');
      await expect(body).not.toBeVisible();
      await help.locator(':scope > summary').click();
      await expect(body).toContainText('not a legality rating');
      await expect(body).toContainText('technology cutoff, not a guaranteed shopping list');
      await expect(body).toContainText(expectedGuidance[kind]);
      await expect(body).toContainText('Core Rulebook, pp. 5, 6, 226');
      await expect(body).toContainText(expectedCitation[kind]);
      for (const citation of excludedKindCitations[kind]) {
        await expect(body).not.toContainText(citation);
      }
    }

    const weaponPanel = gearAddPanel(page, 'weapon');
    const help = weaponPanel.locator('[data-gear-tech-level-help]');
    const body = weaponPanel.locator('[data-gear-tech-level-help-body]');
    await weaponPanel.getByLabel('Maximum Tech Level').selectOption('max:9');
    await expect(help.locator(':scope > summary')).toHaveText('What “Up to TL 9” includes');
    await expect(body).toContainText('Up to TL 9 · Pre-Stellar');
    await expect(body).toContainText('TL 9 sits in the Pre-Stellar band.');

    await weaponPanel.getByLabel('Maximum Tech Level').selectOption('max:16');
    await expect(body).toContainText('Advanced technology beyond mainstream Third Imperium science');
    await weaponPanel.getByLabel('Maximum Tech Level').selectOption('max:21');
    await expect(help.locator(':scope > summary')).toHaveText('What “Up to TL 21” includes');
    await expect(body).toContainText('Advanced technology beyond mainstream Third Imperium science');

    await weaponPanel.getByLabel('Maximum Tech Level').selectOption('unknown');
    await expect(help.locator(':scope > summary')).toHaveText('What “Unknown or variable TL” includes');
    await expect(body).toContainText('Unknown is not TL0 and does not imply legality or availability.');

    const indexLoaded = await page.evaluate(() =>
      performance.getEntriesByType('resource').some(entry => entry.name.includes('gear-catalog/index.json'))
    );
    expect(indexLoaded).toBe(false);

    const accessibility = await new AxeBuilder({ page })
      .include('[data-gear-add-panel]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const blockingViolations = accessibility.violations.filter(violation =>
      violation.impact === 'serious' || violation.impact === 'critical'
    );
    expect(blockingViolations).toEqual([]);
  });

  test('keeps Tech Level help neutral when reading schema 1.2 assets', async ({ page }) => {
    await routeCatalog(page, {
      schemaVersion: '1.2.0',
      includeTechLevelReference: false,
      includeExactTechLevel: false
    });
    await page.goto(PAGE, { waitUntil: 'domcontentloaded' });

    const panel = await openAddPanel(page, 'weapon');
    const help = panel.locator('[data-gear-tech-level-help]');
    await help.locator(':scope > summary').click();
    await expect(help).toContainText('does not include book-backed Tech Level guidance');
    await expect(help).toContainText('safely parsed recorded TL');
    await expect(help).toContainText('lower bound of a minimum/range expression');

    await panel.getByRole('button', { name: 'Choose a weapon from the catalog' }).click();
    const locker = page.locator('#gear-locker');
    await locker.getByLabel('Search the gear catalog').fill('accelerator');
    await locker.getByRole('option', { name: /Accelerator Rifle/ }).click();
    await locker.getByRole('button', { name: /Central Supply Catalogue/ }).click();
    const exactHelp = locker.locator('.gear-locker-tech-level-disclosure');
    await expect(exactHelp).not.toHaveAttribute('open', '');
    await exactHelp.locator(':scope > summary').click();
    await expect(exactHelp).toContainText('No exact Tech Level explanation is available in this catalog version.');
    await expect(exactHelp).toContainText('source-recorded technology rating');
    await expect(exactHelp.locator('.gear-locker-tech-level-references')).toContainText(
      'No separate Tech Level reference is available for this record.'
    );
    await expect(exactHelp).not.toContainText('Core Rulebook, p. 73');
  });

  test('explains the selected Law Level beside each kind-specific Add filter', async ({ page }) => {
    await routeCatalog(page);
    await page.goto(PAGE, { waitUntil: 'domcontentloaded' });

    const expectedGuidance = {
      weapon: 'Light assault weapons and submachine guns first become restricted.',
      armour: 'Cloth armour first becomes restricted.',
      augment: 'The Core table gives no blanket numeric ladder for augments',
      equipment: 'intrusion software is a direct Law Level 4 exception.'
    } as const;
    const expectedCitation = {
      weapon: 'Core Rulebook, p. 224',
      armour: 'Core Rulebook, p. 224',
      augment: 'Core Rulebook, p. 213',
      equipment: 'Central Supply Catalogue, p. 68'
    } as const;
    const expectedOptionLabel = {
      weapon: 'Level 4 — Light assault weapons and submachine guns',
      armour: 'Level 4 — Cloth armour',
      augment: 'Level 4 — No general augment threshold; check item rules',
      equipment: 'Level 4 — Intrusion software exception; otherwise check item rules'
    } as const;
    const allCitations = [...new Set(Object.values(expectedCitation))];

    for (const kind of ['weapon', 'armour', 'augment', 'equipment'] as const) {
      const panel = await openAddPanel(page, kind);
      const help = panel.locator('[data-gear-law-level-help]');
      await expect(help).toContainText('All Law Level classifications');
      await expect(help).not.toContainText('Open this Add control');
      const select = panel.getByLabel('First restricted Law Level');
      await expect(select.locator('option[value="4"]')).toHaveText(expectedOptionLabel[kind]);
      await expect(select.locator('option[value="undetermined"]')).toHaveText(
        'Undetermined — No exact source-backed level'
      );
      const optionLabels = await select.locator('option').allTextContents();
      expect(optionLabels.some(label => /^Law Level \d/.test(label))).toBe(false);
      if (kind === 'weapon') {
        expect(expectedOptionLabel[kind]).not.toMatch(/cloth|armour/i);
      }
      if (kind === 'armour') {
        expect(expectedOptionLabel[kind]).not.toMatch(/assault|submachine|weapon/i);
      }
      await panel.getByLabel('First restricted Law Level').selectOption('4');
      await expect(help).toContainText(`Law Level 4 · ${kind === 'armour' ? 'Armor' : kind === 'weapon' ? 'Weapons' : kind === 'augment' ? 'Augments' : 'Equipment'}`);
      await expect(help).toContainText(expectedGuidance[kind]);
      if (kind === 'weapon' || kind === 'armour') {
        await expect(help).toContainText('Restrictions from lower Law Levels remain in force.');
      } else {
        await expect(help).not.toContainText('Restrictions from lower Law Levels remain in force.');
      }
      await expect(help).toContainText(expectedCitation[kind]);
      for (const citation of allCitations) {
        if (citation !== expectedCitation[kind]) await expect(help).not.toContainText(citation);
      }
    }

    const indexLoaded = await page.evaluate(() =>
      performance.getEntriesByType('resource').some(entry => entry.name.includes('gear-catalog/index.json'))
    );
    expect(indexLoaded).toBe(false);
  });

  test('does not borrow all-root Law Level citations in a transitional schema', async ({ page }) => {
    await routeCatalog(page, { perGuidanceSources: false, schemaVersion: '1.1.0' });
    await page.goto(PAGE, { waitUntil: 'domcontentloaded' });

    for (const kind of ['weapon', 'armour', 'augment', 'equipment'] as const) {
      const panel = await openAddPanel(page, kind);
      await panel.getByLabel('First restricted Law Level').selectOption('4');
      const help = panel.locator('[data-gear-law-level-help]');
      await expect(help).toContainText('does not provide a kind-specific book reference');
      await expect(help).not.toContainText('Core Rulebook, p. 224');
      await expect(help).not.toContainText('Core Rulebook, p. 213');
      await expect(help).not.toContainText('Central Supply Catalogue, p. 68');
      if (kind === 'weapon' || kind === 'armour') {
        await expect(help).toContainText('Restrictions from lower Law Levels remain in force.');
      } else {
        await expect(help).not.toContainText('Restrictions from lower Law Levels remain in force.');
      }
    }
  });

  test('lazy-loads and resolves the generated public catalog assets', async ({ page }) => {
    await page.goto(PAGE, { waitUntil: 'domcontentloaded' });
    const indexLoadedBeforeOpen = await page.evaluate(() =>
      performance.getEntriesByType('resource').some(entry => entry.name.includes('gear-catalog/index.json'))
    );
    expect(indexLoadedBeforeOpen).toBe(false);

    const locker = page.locator('#gear-locker');
    const weaponPanel = await openAddPanel(page, 'weapon');
    await weaponPanel.getByRole('button', { name: 'Choose a weapon from the catalog' }).click();
    await expect(locker).toBeVisible();
    await expect(locker.getByRole('status')).toContainText('1869 catalog variants loaded');
    await locker.getByLabel('Search the gear catalog').fill('ACCELERATOR RIFLE');
    await locker.getByRole('option', { name: /ACCELERATOR RIFLE/ }).first().click();
    await locker.getByRole('button', { name: /Central Supply Catalogue - TL 9/ }).first().click();
    await expect(locker.getByText('Central Supply Catalogue, PDF p. 112')).toBeVisible();
    const generatedTechLevel = locker.locator('.gear-locker-tech-level-disclosure');
    await expect(generatedTechLevel.locator(':scope > summary')).toHaveText(
      'Tech Level: TL 9 — definition and source'
    );
    await generatedTechLevel.locator(':scope > summary').click();
    await expect(generatedTechLevel).toContainText(
      "TL 9 is this weapon variant's listed first-appearance level."
    );
    await expect(generatedTechLevel.locator('.gear-locker-tech-level-references')).toContainText(
      'Core Rulebook (Digital), p. 73'
    );
    await locker.getByRole('button', { name: 'Add weapon to character' }).click();

    const acceleratorData = await page.evaluate(() =>
      (window as any).TravellerCharacterLibrary.captureCharacterData().weapons[0]
    );
    expect(acceleratorData).toMatchObject({
      name: 'ACCELERATOR RIFLE',
      skill: 'Gun Combat (slug)',
      catalogRef: {
        itemId: 'item:weapon:accelerator-rifle:25a40319633c',
        variantId: 'variant:db330577a4bd4c9eb574182e'
      }
    });

    await locker.getByRole('button', { name: 'All entries' }).click();
    await locker.getByLabel('Search the gear catalog').fill('Advanced Ground Defence Gun');
    await locker.getByRole('option', { name: /Advanced Ground Defence Gun/i }).click();
    await expect(locker.getByText('Source review needed')).toBeVisible();
    await expect(locker.getByText(/required skill is not resolved/)).toBeVisible();
    await locker.getByRole('button', { name: 'Add weapon to character' }).click();
    await expect(page.locator('#weapons-container tr').last().locator('input')).toHaveValue('');
  });

  test('groups variants, explains exact choices, adds, and round-trips catalog gear', async ({ page }) => {
    await routeCatalog(page);
    await page.goto(PAGE, { waitUntil: 'domcontentloaded' });

    const weaponPanel = await openAddPanel(page, 'weapon');
    const techHelp = weaponPanel.locator('[data-gear-tech-level-help]');
    await techHelp.locator(':scope > summary').click();
    await expect(weaponPanel.locator('[data-gear-tech-level-help-body]')).toContainText(
      'technology cutoff'
    );
    const addPanelFitsViewport = await page.evaluate(() =>
      document.documentElement.scrollWidth <= document.documentElement.clientWidth
    );
    expect(addPanelFitsViewport).toBe(true);
    await techHelp.locator(':scope > summary').click();
    const browse = weaponPanel.getByRole('button', { name: 'Choose a weapon from the catalog' });
    const locker = page.locator('#gear-locker');
    await browse.click();
    await expect(locker.getByRole('status')).toContainText('7 catalog variants loaded');
    await expect(locker.getByRole('option', { name: /Accelerator Rifle/ })).toHaveCount(1);
    await expect(locker.getByRole('option', { name: /Vehicle Laser/ })).toHaveCount(0);
    await expect(locker.getByRole('option', { name: /Claw/ })).toHaveCount(0);

    await locker.getByRole('button', { name: 'All entries' }).click();
    await expect(locker.getByRole('option', { name: /Vehicle Laser/ })).toBeVisible();
    await expect(locker.getByRole('option', { name: /Claw/ })).toBeVisible();
    await locker.getByLabel('Search the gear catalog').fill('accelerator');
    const acceleratorGroup = locker.getByRole('option', { name: /Accelerator Rifle/ });
    await acceleratorGroup.click();
    await expect(acceleratorGroup).toHaveAttribute('aria-selected', 'true');
    await expect(locker.getByText('2 exact catalog variants are available.')).toBeVisible();

    const centralSupplyVariant = locker.getByRole('button', { name: /Central Supply Catalogue/ });
    const coreVariant = locker.getByRole('button', { name: /Core Rulebook/ });
    await centralSupplyVariant.click();
    await expect(locker.getByText('Use Gun Combat (slug).')).toBeVisible();
    const exactTechLevel = locker.locator('.gear-locker-tech-level-disclosure');
    await expect(exactTechLevel).not.toHaveAttribute('open', '');
    await expect(exactTechLevel.locator(':scope > summary')).toHaveText(
      'Tech Level: TL 9 — definition and source'
    );
    await exactTechLevel.locator(':scope > summary').click();
    await expect(exactTechLevel).toContainText(
      'This exact fixture variant uses the source-recorded 9 technology rating.'
    );
    await expect(exactTechLevel.locator('.gear-locker-tech-level-references')).toContainText(
      'Core Rulebook, p. 73'
    );
    await expect(locker.getByRole('heading', { name: 'Law Level' })).toBeVisible();
    await expect(locker.getByText('First restricted at Law Level 6 for this exact fixture variant.')).toBeVisible();
    await expect(locker.locator('.gear-locker-law-level-references')).toContainText('Core Rulebook, p. 224');
    await expect(locker.getByText('Central Supply Catalogue, PDF p. 112')).toBeVisible();
    await locker.getByText('Quantity, equipped status, and notes').click();
    await locker.getByLabel('Quantity').fill('2');
    await locker.getByLabel('Equipped or installed').check();
    await locker.getByLabel('Character-specific notes').fill('Loaded with standard ammunition');
    await locker.getByRole('button', { name: 'Add weapon to character' }).click();

    const row = page.locator('#weapons-container tr').last();
    await expect(row).toContainText('Accelerator Rifle');
    await expect(row).toContainText('Quantity 2');
    await expect(row).toContainText('Equipped');
    await expect(acceleratorGroup).toContainText('On sheet');

    await locker.getByRole('button', { name: 'Done' }).click();
    await row.getByRole('button', { name: 'View and edit Accelerator Rifle' }).click();
    await expect(locker.getByText('Central Supply Catalogue, PDF p. 112')).toBeVisible();
    await expect(locker.getByLabel('Search the gear catalog')).toBeDisabled();
    await locker.getByLabel('Character-specific notes').fill('Loaded with AP ammunition');
    await locker.getByRole('button', { name: 'Update item state' }).click();
    await expect(locker).not.toBeVisible();

    const captured = await page.evaluate(() => {
      const library = (window as any).TravellerCharacterLibrary;
      const first = library.captureCharacterData();
      library.applyCharacterData(first);
      return library.captureCharacterData().weapons[0];
    });
    expect(captured).toMatchObject({
      name: 'Accelerator Rifle',
      skill: 'Gun Combat (slug)',
      catalogRef: {
        itemId: 'item:weapon:accelerator-rifle:example',
        definitionId: 'definition:accelerator-rifle',
        variantId: 'variant:accelerator-rifle-tl9'
      },
      state: {
        quantity: 2,
        equipped: true,
        notes: 'Loaded with AP ammunition'
      }
    });

    await browse.click();
    await locker.getByRole('button', { name: 'All entries' }).click();
    await locker.getByLabel('Search the gear catalog').fill('claw');
    await locker.getByRole('option', { name: /Claw/ }).click();
    await expect(locker.getByText('Source review needed')).toBeVisible();
    await expect(locker.getByText(/required skill is not resolved/)).toBeVisible();
    await locker.getByRole('button', { name: 'Add weapon to character' }).click();
    await expect(page.locator('#weapons-container tr').last().locator('input')).toHaveValue('');

    const accessibility = await new AxeBuilder({ page })
      .include('#gear-locker')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const blockingViolations = accessibility.violations.filter(violation =>
      violation.impact === 'serious' || violation.impact === 'critical'
    );
    expect(blockingViolations).toEqual([]);
  });

  test('filters exact catalog variants by TL, Law Level, and Legal Category without changing sheet rows', async ({ page }) => {
    await routeCatalog(page);
    await page.goto(PAGE, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      (window as any).TravellerCharacterLibrary.addGearItem('weapon', {
        name: 'Existing Sidearm',
        tl: '7',
        skill: 'Gun Combat (slug)',
        damage: '2D',
        range: '20m',
        weight: '1',
        magazine: '12'
      });
    });

    const panel = await openAddPanel(page, 'weapon');
    const browse = panel.getByRole('button', { name: 'Choose a weapon from the catalog' });
    const locker = page.locator('#gear-locker');
    await panel.getByLabel('Maximum Tech Level').selectOption('max:9');
    await panel.getByLabel('First restricted Law Level').selectOption('6');
    await panel.getByLabel('Legal category').selectOption('category_2');
    await browse.click();

    await expect(locker.getByRole('option', { name: /Accelerator Rifle/ })).toHaveCount(1);
    await expect(locker.getByRole('option', { name: /Vehicle Laser/ })).toHaveCount(0);
    await locker.getByRole('option', { name: /Accelerator Rifle/ }).click();
    await expect(locker.getByText('2 exact catalog variants are available.')).toHaveCount(0);
    await expect(locker.locator('.gear-locker-detail-context')).toContainText('First restricted Law Level: 6');
    await expect(locker.locator('.gear-locker-detail-context')).toContainText('Category 2 — Civilian Use');
    await locker.getByRole('button', { name: 'Done' }).click();

    await panel.getByLabel('Maximum Tech Level').selectOption('max:8');
    await panel.getByLabel('First restricted Law Level').selectOption('any');
    await panel.getByLabel('Legal category').selectOption('any');
    await browse.click();
    await expect(locker.getByRole('option', { name: /Accelerator Rifle/ })).toHaveCount(0);
    await locker.getByRole('button', { name: 'All entries' }).click();
    await expect(locker.getByRole('option', { name: /Claw/ })).toHaveCount(0);
    await expect(page.locator('#weapons-container')).toContainText('Existing Sidearm');
    await locker.getByRole('button', { name: 'Done' }).click();

    await panel.getByLabel('Maximum Tech Level').selectOption('any');
    await panel.getByLabel('First restricted Law Level').selectOption('undetermined');
    await panel.getByLabel('Legal category').selectOption('undetermined');
    await browse.click();
    await locker.getByRole('button', { name: 'All entries' }).click();
    await expect(locker.getByRole('option', { name: /Claw/ })).toBeVisible();
    await expect(locker.getByRole('option', { name: /Accelerator Rifle/ })).toHaveCount(0);
    await expect(page.locator('#weapons-container')).toContainText('Existing Sidearm');
  });

  test('uses one keyboard result stop and a mobile results-to-detail flow', async ({ page }) => {
    await routeCatalog(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(PAGE, { waitUntil: 'domcontentloaded' });

    const weaponPanel = await openAddPanel(page, 'weapon');
    const mobileTechHelp = weaponPanel.locator('[data-gear-tech-level-help]');
    await mobileTechHelp.locator(':scope > summary').click();
    await expect(weaponPanel.locator('[data-gear-tech-level-help-body]')).toContainText(
      'technology cutoff'
    );
    const addPanelFitsMobileViewport = await page.evaluate(() =>
      document.documentElement.scrollWidth <= document.documentElement.clientWidth
    );
    expect(addPanelFitsMobileViewport).toBe(true);
    await mobileTechHelp.locator(':scope > summary').click();
    const browse = weaponPanel.getByRole('button', { name: 'Choose a weapon from the catalog' });
    const locker = page.locator('#gear-locker');
    await browse.click();
    await expect(locker.getByRole('status')).toContainText('7 catalog variants loaded');
    await locker.getByLabel('Search the gear catalog').fill('accelerator');
    const results = locker.getByRole('listbox');
    await results.focus();
    await results.press('Enter');
    await expect(locker.getByText('2 exact catalog variants are available.')).toBeVisible();
    await expect(locker.locator('#gear-locker-detail-title')).toBeFocused();
    await locker.getByRole('button', { name: 'Back to results' }).click();
    await expect(results).toBeFocused();

    const optionTabIndexes = await locker.getByRole('option').evaluateAll(options =>
      options.map(option => (option as HTMLElement).tabIndex)
    );
    expect(optionTabIndexes.every(tabIndex => tabIndex === -1)).toBe(true);
    const noHorizontalOverflow = await locker.evaluate(element =>
      element.scrollWidth <= element.clientWidth
    );
    expect(noHorizontalOverflow).toBe(true);

    await results.press('Escape');
    await expect(locker).not.toBeVisible();
    await expect(browse).toBeFocused();
  });

  test('keeps custom entry available when the public catalog fails', async ({ page }) => {
    await page.route('**/RPG/Traveller/data/gear-catalog/manifest.json', route =>
      route.fulfill({ status: 503, contentType: 'application/json', body: '{}' })
    );
    await page.goto(PAGE, { waitUntil: 'domcontentloaded' });

    const locker = page.locator('#gear-locker');
    const equipmentPanel = await openAddPanel(page, 'equipment');
    const lawHelp = equipmentPanel.locator('[data-gear-law-level-help]');
    await expect(lawHelp).toContainText('Book-backed Law Level guidance is unavailable');
    await expect(lawHelp).toContainText('no blanket numeric ladder for general equipment');
    await expect(lawHelp).not.toContainText('Open this Add control');
    await expect(
      equipmentPanel.getByLabel('First restricted Law Level').locator('option[value="4"]')
    ).toHaveText('Level 4 — Intrusion software exception; otherwise check item rules');
    await equipmentPanel.getByRole('button', { name: 'Choose equipment from the catalog' }).click();
    await expect(locker.getByRole('status')).toContainText('could not be loaded');
    await locker.getByRole('button', { name: 'Done' }).click();
    await equipmentPanel.locator('summary').filter({ hasText: 'Add custom equipment' }).click();

    await page.locator('#equipmentName').fill('Field Kit');
    await page.locator('#equipmentTL').fill('8');
    await page.locator('#equipmentMass').fill('1.5');
    await page.locator('#equipmentCost').fill('200');
    await page.locator('#equipmentName').locator('xpath=..').getByRole('button', { name: 'Add' }).click();
    await expect(page.locator('#equipment-container tr')).toContainText('Field Kit');
  });
});
