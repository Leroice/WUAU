# TestFlight — handoff

The app is built and running on the device via Metro. It **can't be uploaded to
TestFlight without two things only you can provide** — once you have them it's a
~10-minute job (Xcode does it for you).

## Blockers (need you)

1. **Real bundle identifier.** The project still uses the React Native template
   id `org.reactjs.native.example.WUAU`, which App Store Connect rejects.
   - Pick a real id, e.g. `com.leroice.wuau`.
   - Register it as an **App ID** in the Apple Developer portal.
   - Create the **app** in App Store Connect with that bundle id.

2. **App Store Connect API issuer ID** (only needed for the CLI path below).
   - You have the key: `~/.appstoreconnect/private_keys/AuthKey_63D25H2A77.p8`
     (key id `63D25H2A77`).
   - The **issuer id** is in App Store Connect → **Users and Access →
     Integrations → Keys** (the "Issuer ID" shown near the top of that page).

Team id is already configured: `74N2E56WEY`.

## Easiest path (Xcode, recommended)

1. Open `ios/WUAU.xcworkspace`.
2. Target **WUAU → Signing & Capabilities**:
   - **Bundle Identifier** → your real id.
   - **Team** → 74N2E56WEY, **Automatically manage signing** on.
3. Bump the build number (target → General → Build; currently 2).
4. Pick **Any iOS Device** as the run destination → **Product → Archive**.
5. In the Organizer: **Distribute App → App Store Connect → Upload**.
6. After ~10–30 min processing, the build shows up in **TestFlight**; add testers.

## CLI path (optional)

Once signing is set in Xcode (step 2 above):

```sh
ASC_ISSUER_ID=<your-issuer-id> ./scripts/deploy-testflight.sh
```

See `scripts/deploy-testflight.sh` — review it before running (xcodebuild flags
can vary by Xcode version).
