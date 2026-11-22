# Digital Store preservation contract — Yuosant Headquarters

Status: development-preview integration only, 2026-11-22.

## Protected source of truth

- Digital Store application: `golekcuan86/yuosant-digital-hacks` (separate repository).
- Verified Store main/index.html source blob: `039633e8ccc56075d03152a99989172c8c7a4547` at review.
- Existing store entry URL (from legacy Yuosant.com main): `https://yuosant-digital-hacks.vercel.app/#harga`.
- Legacy website image: `/yuosant-digital-store-crystal.webp`. This is reused from the original `yuosant-website` repository.
- Existing Scalev checkout routing is implemented in the STORE application via `SCALEV_CHECKOUTS`, with Starter, Premium, and Ultimate entries. It is intentionally NOT reproduced in headquarters.

## Scope and safety

The Headquarters showroom adds one Digital Store card linking to the EXISTING store page. This does **not** migrate the product catalog, checkout code, pricing, membership, order processing, credentials or customer data.

Do not modify store repository, Vercel store deployment, Scalev links, prices, packages, or checkout handlers as part of Yuosant.com redesign. Do not reimplement direct-to-Scalev links in the Headquarters project.

AiKobo remains showroom-only and must not be modified or connected without a separate decision. FinLab keeps its existing entry link. Production `yuosant.com`, DNS, and `main` remain protected.

## Business-content issue for a future separate decision

At the time of this read-only check, the Store landing page still describes Ultimate as including FinLab access for 365 days. FinLab's new product direction is free public education. The Store's sales copy and contractual entitlements need a separate commercial review **before any change**, but the old Store was not modified during this work.

## Regression guard

Home-page tests assert that the checkout remains entirely inside the store app, the headquarters links to the original Store URL, and no direct `myscalev.com` checkout is embedded in `yuosant-website`.
