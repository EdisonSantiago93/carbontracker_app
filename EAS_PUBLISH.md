# EAS Build & Publish Guide

This document explains how to build and submit your Expo (managed) app using EAS (Expo Application Services). It assumes `eas.json` is present and `app.json` contains correct `android.package` and `ios.bundleIdentifier` values (placeholders are currently in the repo). Replace placeholders with real IDs before production builds.

## Prerequisites

- Node.js and npm installed.
- Have an Expo account. Create one at https://expo.dev if needed.
- Install EAS CLI or use `npx`:

```powershell
npm install -g eas-cli
# or use npx for single-run: npx eas-cli <command>
```

- Set `android.package` and `ios.bundleIdentifier` in `app.json`.
- Prepare credentials:
  - Android: Google Play service account JSON with `Release` upload permission (or use interactive upload during `eas build`).
  - iOS: App Store Connect API Key (private key .p8) and key metadata OR Apple ID credentials for interactive setup.

> Important: Do NOT commit service account JSON or `.p8` files to git. Use `.gitignore` and/or EAS secrets.

## Quick workflow (high level)

1. Login to Expo/EAS: `eas login`.
2. Configure credentials (interactive) or provide files when prompted by `eas build`.
3. Run a preview build (optional): `eas build -p android --profile preview`.
4. Run production build: `eas build -p android --profile production` or `eas build -p ios --profile production`.
5. Submit to stores: `eas submit --platform android --latest` or `eas submit --platform ios --latest`.

## Useful commands (PowerShell)

# Login to EAS
```powershell
eas login
# or with npx
npx eas-cli login
```

# Build preview Android (fast, good for smoke test)
```powershell
eas build -p android --profile preview
# OR
eas build --platform android --profile preview
```

# Build production Android (AAB) — cloud build
```powershell
eas build -p android --profile production
```

# Build production iOS — cloud build (requires App Store Connect API key or interactive credentials)
```powershell
eas build -p ios --profile production
```

# Inspect the latest build and download artifact URL (web UI link is printed, or use build inspect)
```powershell
eas build:list
eas build:inspect --platform android --id <build-id>
```

# Submit the latest Android build to Google Play (interactive will ask for credentials if not configured)
```powershell
eas submit --platform android --latest
# or explicitly pass artifact path
eas submit --platform android --path path\to\app-release.aab
```

# Submit the latest iOS build to App Store
```powershell
eas submit --platform ios --latest
# or explicitly pass artifact path
eas submit --platform ios --path path\to\app.ipa
```

## Credential setup (high-level)

- Android (service account):
  - In Google Play Console → Settings → API access → Create service account, grant "Release manager" or "Editor" as appropriate.
  - Download the JSON key file. Keep it secret.
  - When `eas build` runs, you can upload this JSON interactively, or pre-configure via `eas credentials`.

- iOS (App Store Connect API Key):
  - App Store Connect → Users and Access → Keys → Create API Key (give access to App Manager roles).
  - Download the `.p8` file and note `Issuer ID`, `Key ID` and `Key`.
  - During `eas build` you can upload the key interactively or configure it in EAS credentials.

  ## Injecting secrets into your app at build-time

  - Use `app.config.js` to read `process.env` and expose values under `expoConfig.extra`. See `app.config.js` in the repo.
  - During an EAS cloud build, secrets created with `eas secret:create` or `eas env:create` will be available as `process.env.*` to `app.config.js` and will be embedded into `expoConfig.extra` at build time.
  - In your app code, read the injected variables via `expo-constants`:

  ```ts
  import Constants from 'expo-constants';
  const extras = (Constants.expoConfig && Constants.expoConfig.extra) || {};
  console.log('Firebase API key (last 4):', extras.FIREBASE_API_KEY?.slice(-4));
  ```

  - If you prefer the modern EAS flow, use `eas env:create` to create named environment variables for specific branches or profiles, instead of `eas secret:create`.

  ## Example: Make sure your build uses secrets

  1. Create variables with `eas env:create` or `eas secret:create`.
  2. Confirm the env list: `eas env:list` or `eas secret:list`.
  3. Run `eas build -p android --profile preview` and install the artifact on a device.
  4. Use `expo-constants` to verify the value is inside `Constants.expoConfig.extra`.


## Use EAS interactive credential helpers

- Run `eas credentials` to view and manage saved credentials for your project.
- For Android: `eas credentials -p android` will show interactive prompts to upload JSON or let EAS manage keys.
- For iOS: `eas credentials -p ios` will help you configure App Store Connect API key or let EAS manage provisioning profiles.

## Storing secrets (do not commit to git)

- Add sensitive files to `.gitignore` (e.g., `android-service-account.json`, `AppStoreConnectKey.p8`).
- Use EAS secrets to store environment values (environment variables) used during build/runtime:

```powershell
eas secret:create --name MY_SECRET --value "secret-value"
```

Secrets are for environment variables your app reads at runtime; credential files (Google JSON, .p8) are uploaded during credential management.

## Non-interactive / CI considerations

- On CI, authenticate with `eas login --token <EAS_TOKEN>` or set `EAS_TOKEN` environment variable.
- Provide credential files via secure CI secrets and pass file paths to `eas build` in non-interactive mode, or pre-install credentials with `eas credentials` commands.

## Example end-to-end (Android preview)

```powershell
# 1) Login
eas login

# 2) Verify app.json has android.package
# edit app.json if needed

# 3) Start a preview build
eas build -p android --profile preview

# 4) When the build completes, copy the artifact URL or download from the Expo dashboard

# 5) Submit to Play (optional)
eas submit --platform android --latest
```

## Notes & troubleshooting

- If EAS asks for credentials and you prefer to upload manually, keep your service account JSON and `.p8` file available but never commit them.
- If build fails due to `android.package` or `ios.bundleIdentifier` missing, re-open `app.json` and fill them.
- If `eas build` errors about permissions, verify the service account has appropriate Play Console rights and App Store Connect key has sufficient roles.
- For platform-specific quirks, consult the Expo docs: https://docs.expo.dev/build-reference/eas-json/

## Next steps for this repo

- Replace placeholders in `app.json` with your real package/bundle IDs.
- Add credential files to a secure location and prepare to upload via `eas build` interactive prompts or CI secrets.
- When ready, run a preview build, inspect artifact, then run production build + submit.

---
If you want, I can:

- run a preview Android build now (requires permission to upload credentials interactively),
- or add example CI configuration (GitHub Actions) to run `eas build` and `eas submit`.
