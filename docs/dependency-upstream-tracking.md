# Dependency Upstream Tracking

This project uses firebase-admin and Google Cloud SDK transitive dependencies that currently produce npm deprecation warnings.

## Current transitive warnings

- node-domexception@1.x via fetch-blob in node-fetch chain
- glob@11.x in Google Cloud build utility stack (glob still publishes a deprecation notice)

## Local mitigation in this repo

- npm overrides force uuid@11.x.
- npm overrides force glob@11.x, but glob still emits the upstream deprecation warning.

## Important audit behavior

- Running npm audit fix --force in this project can downgrade Next.js to 9.3.3, which breaks this Next 16 app.
- If force-fix is run accidentally, restore with:

npm install next@16.2.10
npm run build

## Upstream tracking command

Run this command periodically to check if upstream has removed deprecated transitive packages:

npm ls node-domexception uuid glob

## Release check command

Run this command periodically to verify latest firebase-admin and dependent Google packages:

npm view firebase-admin version

If a newer firebase-admin release appears, upgrade and retest:

npm install firebase-admin@latest
npm run build
