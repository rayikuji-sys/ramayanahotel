# Visual alignment
Reviewed actual website source listed in audit.md before choosing booking tokens. No generated/stock hotel images were introduced.

| Website source | Booking use |
|---|---|
| globals.css final paper #fffefa | page background |
| paper2 #f7f5f1 | neutral panels |
| ink #292624, soft #706963 | headings/body secondary text |
| gold #92754e, line #e5dfd7 | restrained accent, borders/focus |
| Playfair Display, Montserrat fonts | self-hosted local copies, serif headings/sans forms |
| Hotel logo | same logo, intentionally no hyperlink |
| Curated room galleries/profile | one-time snapshot in database/reference.json |
| Hotel courtyard photograph | booking entry image, no heavy video |

Booking uses clean ivory surfaces, modest glass search panel, clear labels, visible total and safe focus outline. It does not replace or redesign the main hotel homepage. Search, checkout and admin are function-first applications with matching brand details.

asset-provenance.json records copied assets and source paths. Profile area/bed copy is retained as reference, not newly certified. Triple categories currently share a supplied room205 reference with explicit category-confirmation caption; category-specific validation remains pending. Do not claim all photos uniquely prove each sellable type. No source photo has been edited.

## Evidence
Screenshots in ../outputs:
- search-360/390/768/1280/1440.png: five responsive entry sizes.
- results-desktop.png and comparison-desktop/mobile.png.
- gallery-mobile.png: second photo changes both image and caption.
- confirmation-mobile.png and manage-tablet.png.

Search was measured without horizontal document overflow at all five widths; that does not certify every state/browser. Browser QA used the Codex Chromium in-app browser on Windows, not physical iPhone/Safari. No full WCAG certification or Core Web Vitals field measurement is claimed.

