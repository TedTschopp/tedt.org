#!/usr/bin/env python3
"""Regression tests for incremental responsive images referenced by posts."""

from __future__ import annotations

import importlib.util
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "_code" / "py" / "generate_responsive_images.py"
SPEC = importlib.util.spec_from_file_location("generate_responsive_images", SCRIPT)
assert SPEC and SPEC.loader
generator = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(generator)


class IncrementalPostImageTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary_directory = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary_directory.name)
        self.source_root = self.root / "img"
        self.output_root = self.source_root / "generated" / "responsive"
        self.manifest_path = self.root / "_data" / "responsive_images.json"
        (self.root / "_posts" / "AI").mkdir(parents=True)
        self.source_root.mkdir()
        self.manifest_path.parent.mkdir()

        self.managed_source = self.source_root / "managed.webp"
        self.missing_source = self.source_root / "missing.webp"
        self.managed_source.write_bytes(b"managed-webp-fixture")
        self.missing_source.write_bytes(b"missing-webp-fixture")

        (self.root / "_posts" / "AI" / "2026-08-01-managed.md").write_text(
            '---\nimage: "/img/managed.webp"\n---\n', encoding="utf-8"
        )
        (self.root / "_posts" / "AI" / "2026-08-02-missing.md").write_text(
            "---\nimage: /img/missing.webp\n---\n", encoding="utf-8"
        )

        self.manifest = {
            "schema_version": 1,
            "target_widths": list(generator.TARGET_WIDTHS),
            "quality": generator.WEBP_QUALITY,
            "images": {
                "/img/managed.webp": {
                    "src": "/img/managed.webp",
                    "width": 320,
                    "height": 180,
                    "source_sha256": generator.sha256(self.managed_source),
                    "variants": [
                        {
                            "path": "/img/managed.webp",
                            "width": 320,
                            "height": 180,
                        }
                    ],
                }
            },
        }
        self.manifest_path.write_text(json.dumps(self.manifest), encoding="utf-8")

        self.patchers = [
            patch.object(generator, "ROOT", self.root),
            patch.object(generator, "SOURCE_ROOT", self.source_root),
            patch.object(generator, "PUBLIC_SOURCE_ROOTS", (self.source_root, self.root / "RPG")),
            patch.object(generator, "OUTPUT_ROOT", self.output_root),
            patch.object(generator, "MANIFEST_PATH", self.manifest_path),
            patch.object(generator, "POSTS_ROOT", self.root / "_posts"),
        ]
        for patcher in self.patchers:
            patcher.start()

    def tearDown(self) -> None:
        for patcher in reversed(self.patchers):
            patcher.stop()
        self.temporary_directory.cleanup()

    def test_only_missing_post_image_requires_generation(self) -> None:
        sources = generator.post_image_sources()
        self.assertEqual(sources, [self.managed_source.resolve(), self.missing_source.resolve()])

        pending = generator.post_images_requiring_ensure(self.manifest)
        self.assertEqual(pending, [self.missing_source.resolve()])

    def test_ensure_builds_only_missing_image_and_preserves_manifest(self) -> None:
        built_sources: list[Path] = []

        def fake_manifest_entry(_cwebp: str, source: Path, generate: bool) -> dict:
            self.assertTrue(generate)
            built_sources.append(source)
            return {
                "src": "/img/missing.webp",
                "width": 640,
                "height": 360,
                "source_sha256": generator.sha256(source),
                "variants": [
                    {
                        "path": "/img/missing.webp",
                        "width": 640,
                        "height": 360,
                    }
                ],
            }

        with patch.object(generator, "image_manifest_entry", side_effect=fake_manifest_entry):
            generated = generator.ensure_post_images("cwebp")

        self.assertEqual(generated, 1)
        self.assertEqual(built_sources, [self.missing_source.resolve()])
        saved = json.loads(self.manifest_path.read_text(encoding="utf-8"))
        self.assertIn("/img/managed.webp", saved["images"])
        self.assertIn("/img/missing.webp", saved["images"])

    def test_changed_source_requires_regeneration(self) -> None:
        self.managed_source.write_bytes(b"changed-managed-webp-fixture")

        pending = generator.post_images_requiring_ensure(self.manifest)

        self.assertEqual(
            pending,
            [self.managed_source.resolve(), self.missing_source.resolve()],
        )

    def test_missing_generated_variant_requires_regeneration(self) -> None:
        variant = self.output_root / "managed--480w.webp"
        self.manifest["images"]["/img/managed.webp"]["variants"] = [
            {
                "path": "/img/generated/responsive/managed--480w.webp",
                "width": 480,
                "height": 270,
            },
            {
                "path": "/img/managed.webp",
                "width": 640,
                "height": 360,
            },
        ]
        self.assertFalse(variant.exists())

        pending = generator.post_images_requiring_ensure(self.manifest)

        self.assertEqual(
            pending,
            [self.managed_source.resolve(), self.missing_source.resolve()],
        )


class WorkflowTests(unittest.TestCase):
    def test_post_images_are_ensured_before_jekyll_build(self) -> None:
        workflow = (ROOT / ".github" / "workflows" / "deploy.yml").read_text(encoding="utf-8")
        ensure_position = workflow.index("--ensure-post-images")
        build_position = workflow.index("- name: Build with Jekyll")
        self.assertLess(ensure_position, build_position)
        self.assertIn("--check-post-images", workflow)


if __name__ == "__main__":
    unittest.main()