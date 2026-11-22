---
"@strata/integration-mediawiki": patch
"@strata/testing": patch
---

Harden the MediaWiki skin distribution: `dist/Strata/` build with version injection, Composer metadata (`mediawiki-skin` + `installer-name`), optional release zip, generated `skins.strata.fonts` JS module for Google Fonts (ResourceLoader CSS stays local; skins cannot edit `<head>`), packaging tests, and a `mediawiki:1.43` docker-compose smoke environment verified end-to-end.
