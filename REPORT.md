# Marty Colour Sensed Event Block

## Completed Work
- Added `martycoloursensed` block definition with argument options in `src/editor/blocks/BlockSpecs.js`.
- Surface block documentation entry with title, image placeholder, and description container in `editions/free/src/inapp/blocks.html`.
- Added temporary English localisation strings (`BLOCK_DESC_MARTY_ON_COLOUR_SENSED*`) in `editions/free/src/localizations/en.json`.
- Wired runtime behaviour by delegating Marty colour sensor events through `Prims.OnMartyEvent` and `MartyBlocks` subscriptions.

## Outstanding Items
- Provide the `images/marty_colour_sensed.png` asset (currently referenced by the in-app guide but not present in the tree).
- Extend localisations beyond English (other locale JSON files still miss the new strings).
- Follow-up feature work: add `martyobstaclesensed` (two options) and `martyLightSensed` blocks per the roadmap.

## Open Questions / Observations
- The new guide markup in `blocks.html` needs closing `</div>` tags for the `block-wrapper-right` and its parent to match the surrounding structure.
- `Prims.OnMartyEvent` mirrors `OnCogEvent`, including the zero millisecond debounce guard; confirm whether additional throttling or deduplication is required once hardware behaviour is validated.
- No automated tests or runtime verification performed yet; integration should be exercised on-device when ready.
