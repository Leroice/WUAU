#!/usr/bin/env bash
# Build WUAU (Release) and upload to TestFlight.
#
# ONE-TIME PREREQS (see ../TESTFLIGHT.md):
#   - A real bundle id is registered as an App ID and an app exists in
#     App Store Connect with that id.
#   - Signing is configured in Xcode (Automatic, team 74N2E56WEY).
#   - You know your App Store Connect API Issuer ID.
#
# USAGE:
#   ASC_ISSUER_ID=<your-issuer-id> ./scripts/deploy-testflight.sh
#
# NOTE: review these xcodebuild flags — they can vary by Xcode version.
set -euo pipefail
cd "$(dirname "$0")/.."

ASC_KEY_ID="63D25H2A77"   # ~/.appstoreconnect/private_keys/AuthKey_63D25H2A77.p8
: "${ASC_ISSUER_ID:?Set ASC_ISSUER_ID — App Store Connect > Users and Access > Integrations > Keys > Issuer ID}"

WORKSPACE="ios/WUAU.xcworkspace"
SCHEME="WUAU"
BUILD_DIR="build/testflight"
ARCHIVE="$BUILD_DIR/WUAU.xcarchive"

echo "==> Archiving (Release)…"
xcodebuild -workspace "$WORKSPACE" -scheme "$SCHEME" -configuration Release \
  -archivePath "$ARCHIVE" -destination 'generic/platform=iOS' \
  -allowProvisioningUpdates clean archive

echo "==> Exporting IPA…"
xcodebuild -exportArchive -archivePath "$ARCHIVE" \
  -exportPath "$BUILD_DIR/ipa" \
  -exportOptionsPlist scripts/ExportOptions.plist \
  -allowProvisioningUpdates

IPA="$(ls "$BUILD_DIR"/ipa/*.ipa | head -1)"
echo "==> Uploading $IPA to TestFlight…"
xcrun altool --upload-app -f "$IPA" -t ios \
  --apiKey "$ASC_KEY_ID" --apiIssuer "$ASC_ISSUER_ID"

echo "==> Done. Build appears in App Store Connect → TestFlight after processing (~10–30 min)."
