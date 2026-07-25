# System Style Source

Working name: **Contract Reference**

The System pack is the neutral reference layer for UI Style Kit Icons. It keeps the shared 64-icon contract readable, consistent, and easy to theme through UI Style Kit CSS variables.

## Visual Ingredients

| Layer | Direction |
| --- | --- |
| Surfaces | Minimal framing that does not compete with product UI |
| Borders | Token-based strokes for predictable contrast |
| Shadows | None by default; depth belongs to consuming UI styles |
| Color | All paint resolves through `--usk-*` RGB variables |
| Shape | Simple geometry that stays legible at small sizes |
| Icons | Semantic app symbols with consistent title and desc metadata |

## Things To Avoid

- Style-specific decoration in the fallback pack
- Hard-coded brand colors inside SVGs
- Extra icons that are not part of the canonical contract
- Dense detail that weakens 16-24px rendering
