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
  return indexItem;
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

test.describe('Traveller gear catalog', () => {
  test('loads and resolves the generated public catalog assets', async ({ page }) => {
    await page.goto(PAGE, { waitUntil: 'domcontentloaded' });

    const picker = page.locator('[data-gear-kind="weapon"]');
    await expect(picker.getByRole('status')).toContainText(/\d+ weapon catalog entries loaded/);
    await picker.getByLabel('Search weapon catalog').fill('ACCELERATOR RIFLE');
    const accelerator = picker.getByRole('button', {
      name: /ACCELERATOR RIFLE - Central Supply Catalogue - TL 9/
    });
    await accelerator.click();
    await expect(picker.getByText('Central Supply Catalogue, PDF p. 112')).toBeVisible();
    await picker.getByRole('button', { name: 'Add weapon' }).click();

    const acceleratorData = await page.evaluate(() =>
      (window as any).TravellerCharacterLibrary.captureCharacterData().weapons[0]
    );
    expect(acceleratorData.skill).toBe('Gun Combat (slug)');
    expect(acceleratorData.catalogRef).toMatchObject({
      itemId: 'item:weapon:accelerator-rifle:25a40319633c',
      variantId: 'variant:db330577a4bd4c9eb574182e'
    });

    await picker.getByLabel('Catalog scope').selectOption('all');
    await picker.getByLabel('Search weapon catalog').fill('Advanced Ground Defence Gun');
    await picker.getByRole('button', { name: /Advanced Ground Defence Gun/ }).click();
    await expect(picker.getByText('Source review needed')).toBeVisible();
    await expect(picker.getByText(/required skill is not resolved/)).toBeVisible();
    await picker.getByRole('button', { name: 'Add weapon' }).click();
    await expect(page.locator('#weapons-container tr').last().locator('input')).toHaveValue('');
  });

  test('filters, explains, adds, and round-trips exact catalog gear', async ({ page }) => {
    await routeCatalog(page);
    await page.goto(PAGE, { waitUntil: 'domcontentloaded' });

    const picker = page.locator('[data-gear-kind="weapon"]');
    await expect(picker.getByRole('status')).toContainText('4 weapon catalog entries loaded');
    await expect(picker.getByRole('button', { name: /Accelerator Rifle/ })).toHaveCount(2);
    await expect(picker.getByRole('button', { name: /Vehicle Laser/ })).toHaveCount(0);
    await expect(picker.getByRole('button', { name: /Claw/ })).toHaveCount(0);

    await picker.getByLabel('Catalog scope').selectOption('all');
    await expect(picker.getByRole('button', { name: /Vehicle Laser/ })).toBeVisible();
    await expect(picker.getByRole('button', { name: /Claw/ })).toBeVisible();
    await picker.getByLabel('Search weapon catalog').fill('accelerator');
    const centralSupplyVariant = picker.getByRole('button', { name: /Central Supply Catalogue/ });
    const coreVariant = picker.getByRole('button', { name: /Core Rulebook/ });
    await expect(centralSupplyVariant).toBeVisible();
    await expect(coreVariant).toBeVisible();
    await centralSupplyVariant.click();
    await expect(centralSupplyVariant).toHaveAttribute('aria-current', 'true');
    await expect(coreVariant).not.toHaveAttribute('aria-current', 'true');

    await expect(picker.getByText('Use Gun Combat (slug).')).toBeVisible();
    await expect(picker.getByText('Central Supply Catalogue, PDF p. 112')).toBeVisible();
    await picker.getByLabel('Quantity').fill('2');
    await picker.getByLabel('Equipped or installed').check();
    await picker.getByLabel('Character-specific notes').fill('Loaded with standard ammunition');
    await picker.getByRole('button', { name: 'Add weapon' }).click();

    const row = page.locator('#weapons-container tr').last();
    await expect(row).toContainText('Accelerator Rifle');
    await expect(row).toContainText('Quantity 2');
    await expect(row).toContainText('Equipped');

    await coreVariant.click();
    await expect(picker.getByText('Core Rulebook, p. 101')).toBeVisible();
    await row.getByRole('button', { name: 'View and edit Accelerator Rifle' }).click();
    await expect(picker.getByText('Central Supply Catalogue, PDF p. 112')).toBeVisible();

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
        notes: 'Loaded with standard ammunition'
      }
    });

    await picker.getByLabel('Search weapon catalog').fill('');
    const claw = picker.getByRole('button', { name: /Claw/ });
    await claw.click();
    await expect(picker.getByText('Source review needed')).toBeVisible();
    await expect(picker.getByText(/required skill is not resolved/)).toBeVisible();
    await picker.getByRole('button', { name: 'Add weapon' }).click();
    await expect(page.locator('#weapons-container tr').last().locator('input')).toHaveValue('');

    const accessibility = await new AxeBuilder({ page })
      .include('[data-gear-kind="weapon"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const blockingViolations = accessibility.violations.filter(violation =>
      violation.impact === 'serious' || violation.impact === 'critical'
    );
    expect(blockingViolations).toEqual([]);
  });

  test('keeps manual entry available when the public catalog fails', async ({ page }) => {
    await page.route('**/RPG/Traveller/data/gear-catalog/manifest.json', route =>
      route.fulfill({ status: 503, contentType: 'application/json', body: '{}' })
    );
    await page.goto(PAGE, { waitUntil: 'domcontentloaded' });

    const picker = page.locator('[data-gear-kind="equipment"]');
    await expect(picker.getByRole('status')).toContainText('could not be loaded');
    await expect(page.getByText('Manual or custom equipment')).toBeVisible();

    await page.locator('#equipmentName').fill('Field Kit');
    await page.locator('#equipmentTL').fill('8');
    await page.locator('#equipmentMass').fill('1.5');
    await page.locator('#equipmentCost').fill('200');
    await page.locator('#equipmentName').locator('xpath=..').getByRole('button', { name: 'Add' }).click();
    await expect(page.locator('#equipment-container tr')).toContainText('Field Kit');
  });
});
