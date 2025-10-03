import { expect, test } from '@playwright/test';

type ColorScheme = 'light' | 'dark';

const colorSchemes: ColorScheme[] = ['light', 'dark'];

test.describe('Homepage footer contrast', () => {
  for (const colorScheme of colorSchemes) {
    test(`meets WCAG contrast in ${colorScheme} mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto('/');
      await page.waitForSelector('footer');

      const issues = await page.evaluate(() => {
        const describeElement = (el: Element): string => {
          const tag = el.tagName.toLowerCase();
          const id = el.id ? `#${el.id}` : '';
          const classes = el.classList.length ? `.${Array.from(el.classList).join('.')}` : '';
          return `${tag}${id}${classes}`;
        };

        const parseColor = (input: string | null) => {
          if (!input) return null;
          const value = input.trim();
          if (value === 'transparent') {
            return { r: 0, g: 0, b: 0, a: 0, raw: value };
          }

          const rgba = value.match(/^rgba?\(([^)]+)\)$/i);
          if (rgba) {
            const parts = rgba[1].split(',').map(part => part.trim());
            if (parts.length < 3) return null;
            const r = parseFloat(parts[0]);
            const g = parseFloat(parts[1]);
            const b = parseFloat(parts[2]);
            const a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
            return { r, g, b, a: Number.isNaN(a) ? 1 : a, raw: value };
          }

          if (value.startsWith('#')) {
            const hex = value.slice(1);
            const expand = hex.length === 3 || hex.length === 4;
            const normalized = expand
              ? hex.split('').map(char => `${char}${char}`).join('')
              : hex;
            const [r, g, b] = [
              parseInt(normalized.slice(0, 2), 16),
              parseInt(normalized.slice(2, 4), 16),
              parseInt(normalized.slice(4, 6), 16)
            ];
            const alpha = normalized.length === 8 ? parseInt(normalized.slice(6, 8), 16) / 255 : 1;
            return { r, g, b, a: alpha, raw: value };
          }

          return null;
        };

        const srgbToLinear = (channel: number) => {
          const normalized = channel / 255;
          return normalized <= 0.03928
            ? normalized / 12.92
            : Math.pow((normalized + 0.055) / 1.055, 2.4);
        };

        const relativeLuminance = (color: { r: number; g: number; b: number }) => {
          const r = srgbToLinear(color.r);
          const g = srgbToLinear(color.g);
          const b = srgbToLinear(color.b);
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };

        const blendColors = (
          foreground: { r: number; g: number; b: number; a: number },
          background: { r: number; g: number; b: number; a: number }
        ) => {
          const alpha = foreground.a + background.a * (1 - foreground.a);
          if (alpha === 0) {
            return { r: 255, g: 255, b: 255, a: 0 };
          }

          const blendChannel = (fg: number, bg: number) =>
            Math.round((fg * foreground.a + bg * background.a * (1 - foreground.a)) / alpha);

          return {
            r: blendChannel(foreground.r, background.r),
            g: blendChannel(foreground.g, background.g),
            b: blendChannel(foreground.b, background.b),
            a: alpha
          };
        };

        const contrastRatio = (
          foreground: { r: number; g: number; b: number },
          background: { r: number; g: number; b: number }
        ) => {
          const L1 = relativeLuminance(foreground);
          const L2 = relativeLuminance(background);
          const lighter = Math.max(L1, L2);
          const darker = Math.min(L1, L2);
          return (lighter + 0.05) / (darker + 0.05);
        };

        const getEffectiveBackground = (element: Element) => {
          const chain: string[] = [];
          let current: Element | null = element;
          while (current) {
            const style = window.getComputedStyle(current);
            const color = parseColor(style.backgroundColor);
            chain.push(describeElement(current));
            if (color && color.a > 0) {
              return { color, css: style.backgroundColor, chain };
            }
            current = current.parentElement;
          }

          const rootStyle = window.getComputedStyle(document.documentElement);
          const fallback = parseColor(rootStyle.backgroundColor) || {
            r: 255,
            g: 255,
            b: 255,
            a: 1,
            raw: 'rgb(255, 255, 255)'
          };

          return { color: fallback, css: fallback.raw, chain };
        };

        const isVisible = (element: Element) => {
          const style = window.getComputedStyle(element);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          if (parseFloat(style.opacity) === 0) return false;
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        };

        const hasDirectText = (element: Element) =>
          Array.from(element.childNodes).some(
            node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
          );

        const footer = document.querySelector('footer');
        if (!footer) {
          return [
            {
              selector: 'footer',
              text: '',
              ratio: 0,
              required: 4.5,
              foreground: 'n/a',
              background: 'n/a',
              backgroundChain: ['document']
            }
          ];
        }

        const elements: Element[] = [footer, ...Array.from(footer.querySelectorAll('*'))];
        const issues: Array<{
          selector: string;
          text: string;
          ratio: number;
          required: number;
          foreground: string;
          background: string;
          backgroundChain: string[];
          fontSize: string;
          fontWeight: string;
        }> = [];

        for (const element of elements) {
          const ariaHidden = element.getAttribute('aria-hidden');
          if (ariaHidden && ariaHidden.toLowerCase() === 'true') {
            continue;
          }

          const role = element.getAttribute('role');
          if (role && role.toLowerCase() === 'presentation') {
            continue;
          }

          if (!isVisible(element) || !hasDirectText(element)) {
            continue;
          }

          const style = window.getComputedStyle(element);
          const foregroundColor = parseColor(style.color);
          if (!foregroundColor) {
            continue;
          }

          const background = getEffectiveBackground(element);
          const effectiveForeground =
            foregroundColor.a < 1
              ? blendColors(foregroundColor, background.color)
              : foregroundColor;

          const ratio = contrastRatio(effectiveForeground, background.color);
          const fontSizePx = parseFloat(style.fontSize);
          const numericWeight = parseInt(style.fontWeight, 10);
          const isBold = !Number.isNaN(numericWeight) && numericWeight >= 700;
          const isLarge = fontSizePx >= 24 || (isBold && fontSizePx >= 18.66);
          const required = isLarge ? 3 : 4.5;

          if (ratio + 1e-6 < required) {
            issues.push({
              selector: describeElement(element),
              text: element.textContent ? element.textContent.trim().slice(0, 120) : '',
              ratio: Number(ratio.toFixed(2)),
              required,
              foreground: style.color,
              background: background.css,
              backgroundChain: background.chain,
              fontSize: style.fontSize,
              fontWeight: style.fontWeight
            });
          }
        }

        return issues;
      });

      expect.soft(issues, `Footer contrast issues detected in ${colorScheme} mode`).toEqual([]);
    });
  }
});
