# Repository import audit — 7 October 2026

## Scope and architecture

Full recursive inventory, including hidden files: 30,797 files, 1,680,242,732 bytes before preparation. No symlinks were found. Active runtime is Next.js 16.3.5 / React 19.2.6 / TypeScript and a separate Node HTTP booking engine, using Node SQLite. npm and both package-lock files are retained. SQL schemas, TypeScript migrations, seed catalogs, public assets, and adapter/template source are retained.

| Largest folders | Bytes before preparation |
| --- | ---: |
| .next | 558,300,771 |
| .local | 465,899,317 |
| node_modules | 463,728,403 |
| public | 125,219,670 |
| booking-engine | 52,966,965 |

## Exclusions and integrity

Recursive ignore rules cover dependencies, environment secrets, runtime SQLite files and sidecars, private keys, caches, temporary files, logs, backups, generated reports, personal editor settings, uploads, and private runtime state. `.env.example`, `.env.production.example`, and booking's example remain source files.

`build/` is deliberately retained: it contains authored Sites adapter TypeScript and its license, not a compiled build. Legacy Vite/D1 scaffolding remains in place but is not used by the current application scripts. Existing project files and databases were not deleted. No UI design or business workflow was changed. A deployment bug was fixed in the two booking redirects: their destination now uses configured `APP_URL`, preventing a reverse proxy from redirecting visitors to localhost. The integration test covers the configured origin and rejects influence from untrusted forwarded hosts.

Uploads are stored as private database records/BLOBs and are excluded with the databases. Existing local accounts, guest records, staff edits, and SMTP credentials are not part of an import. A fresh deployment seeds public catalog data and requires a new staff account.

## Large files

| Retained asset | Bytes | Reason |
| --- | ---: | --- |
| public/media/arrival.mp4 | 42,538,530 | Existing hero video |
| public/media/arrival-scroll.mp4 | 13,790,318 | Existing scrolling video |

No import candidate exceeds 50 MB or 100 MB. Git LFS is not required for this import. Large dependency binaries (including a 106 MB native compiler), local media originals, and build packs are excluded. The source plus assets is approximately 129 MB before Git compression.

## Secret review

Candidate source was scanned for passwords, tokens, API keys, database URLs, private keys, provider credential patterns, and literal assignments. Three literal matches were reviewed in HTTP/notification tests: these are isolated QA passwords and mock SMTP values, not deployed credentials. No real secret was identified in import candidates. Generated staff access details and the private booking bridge key stay under excluded `.local/`. The staged tree is scanned again before the initial commit.

## Verification

| Check | Result |
| --- | --- |
| Installed root dependency tree | Valid; no reinstall required |
| Website lint | Passed |
| TypeScript check | Passed |
| Website tests | 50 passed |
| Booking tests | 39 passed |
| Next.js production build | Passed |
| Booking build validation | 37 modules, 8 room categories and catalog images passed |
| Website/booking HTTP integration | Passed: handoff, assets/cookies, staff SSO, spoof rejection, pricing, idempotency, sandbox payment, totals and PDFs |
| Compose configuration | Valid with env resolution disabled |
| Docker image build | Blocked before compilation: Docker could not resolve registry-1.docker.io to download the base image |

Node 22 reports experimental SQLite/type-stripping warnings; these did not fail checks. Passing these checks does not establish live payment readiness or guarantee an error-free application.

## GitHub and hosting

This directory had no Git history or origin. A new `main` repository is prepared locally. The connected GitHub account returned no accessible destination repositories; the pasted request contains a repository placeholder. No remote is invented, replaced, or force-pushed. Supply/create the destination repository and grant access before upload.

A temporary online preview uses fresh sandbox databases with outbound email disabled. It is independent of operational data and requires the computer and tunnel process to remain running. Hosting remains to be provisioned for a permanent URL. See [deployment.md](deployment.md) for the persistent Node deployment package and current sandbox limitations.
