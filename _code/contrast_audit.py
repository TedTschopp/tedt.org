#!/usr/bin/env python3
"""Contrast Audit Script
Scans predefined slide palette token pairs and reports WCAG AA/AAA compliance.
Run from repo root: `python _code/contrast_audit.py`
"""
from __future__ import annotations
import math

# Palette sourced from _sass/components/_slides-theme.scss
PALETTE = {
    'slides-bg-light': '#F5F6F7',
    'slides-bg-dark': '#1F2126',
    'slides-accent-blue': '#0078D4',
    'slides-accent-orange': '#F36C21',
    'slides-accent-gold': '#C69214',
    'slides-text-primary': '#111111',
    'slides-text-secondary': '#555555',
    'slides-white': '#FFFFFF',
}

# Candidate foreground/background pairs to test
TEST_PAIRS = [
    ('slides-text-primary', 'slides-bg-light'),
    ('slides-text-primary', 'slides-white'),
    ('slides-white', 'slides-bg-dark'),
    ('slides-white', 'slides-accent-blue'),
    ('slides-white', 'slides-accent-orange'),
    ('slides-white', 'slides-accent-gold'),
    ('slides-accent-gold', 'slides-bg-dark'),  # headings gold on dark deck style
    ('slides-accent-orange', 'slides-bg-dark'),
    ('slides-accent-blue', 'slides-bg-light'),
    ('slides-text-secondary', 'slides-bg-light'),
]

# WCAG thresholds
AA_NORMAL = 4.5
AA_LARGE = 3.0
AAA_NORMAL = 7.0
AAA_LARGE = 4.5


def hex_to_rgb(hex_color: str):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4))


def relative_luminance(rgb):
    def channel(c):
        return c/12.92 if c <= 0.03928 else ((c+0.055)/1.055) ** 2.4
    r, g, b = (channel(c) for c in rgb)
    return 0.2126*r + 0.7152*g + 0.0722*b


def contrast_ratio(foreground_hex: str, background_hex: str) -> float:
    fg_lum = relative_luminance(hex_to_rgb(foreground_hex))
    bg_lum = relative_luminance(hex_to_rgb(background_hex))
    lighter = max(fg_lum, bg_lum)
    darker = min(fg_lum, bg_lum)
    return (lighter + 0.05) / (darker + 0.05)


def classify_ratio(ratio: float):
    classifications = []
    if ratio >= AAA_NORMAL:
        classifications.append('AAA (normal text)')
    if ratio >= AAA_LARGE:
        classifications.append('AAA (large text)')
    if ratio >= AA_NORMAL:
        classifications.append('AA (normal text)')
    if ratio >= AA_LARGE:
        classifications.append('AA (large text)')
    return classifications or ['FAIL (<3.0)']


def main():
    print('Slide Palette Contrast Audit')
    print('============================\n')
    for fg, bg in TEST_PAIRS:
        fg_hex = PALETTE[fg]
        bg_hex = PALETTE[bg]
        ratio = contrast_ratio(fg_hex, bg_hex)
        classes = classify_ratio(ratio)
        print(f'{fg} on {bg}: {ratio:.2f} -> {", ".join(classes)}')
    print('\nLegend: Ratios computed via WCAG 2.1 formula. Large text threshold assumes >=18pt regular or >=14pt bold.')

if __name__ == '__main__':
    main()
