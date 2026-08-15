import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGE = '/RPG/Traveller/Character-Sheet.html';

type CatalogFixtureItem = {
  variantId: string;
  descriptionSummary: string;
  rulesSummary: string;
  sourceReferences: Array<{ title: string; pages: number[]; pageBasis: string }>;
  summaryStatus?: string;
  reviewFlags?: string[];
  requiredSkillStatus?: string;
  [key: string]: unknown;
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
      tl: '9',
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
      tl: '-',
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
  const { descriptionSummary, rulesSummary, sourceReferences, ...indexItem } = item;
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
  sourceReferences: item.sourceReferences
}));

async function routeCatalog(page: Page) {
  await page.route('**/RPG/Traveller/data/gear-catalog/manifest.json', route =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        schemaVersion: '0.1.0',
        catalogVersion: 'test-1',
        indexPath: 'index.json',
        detailShards: [{ id: '00', path: 'details-00.json', itemCount: indexItems.length }]
      })
    })
  );
  await page.route('**/RPG/Traveller/data/gear-catalog/index.json', route =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        schemaVersion: '0.1.0',
        catalogVersion: 'test-1',
        items: compactIndexItems
      })
    })
  );
  await page.route('**/RPG/Traveller/data/gear-catalog/details-00.json', route =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        schemaVersion: '0.1.0',
        catalogVersion: 'test-1',
        items: detailItems
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
      await expect(panel.locator('[data-gear-locker-open]')).not.toBeVisible();
    }

    const tablesComeFirst = await panels.evaluateAll(elements =>
      elements.every(element => element.previousElementSibling?.classList.contains('table-responsive'))
    );
    expect(tablesComeFirst).toBe(true);
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
