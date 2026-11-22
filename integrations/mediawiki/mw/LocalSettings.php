<?php
# LocalSettings.php for the Strata smoke test.
# Generated file — do not edit by hand in production; this is the
# minimal config documented in docs/MEDIAWIKI.md.

$wgServer = "http://localhost:8080";
$wgScriptPath = "";
$wgSitename = "Strata Smoke";
$wgMetaNamespace = "Strata_Smoke";

# Database (docker-compose mediawiki service env vars are used by the
# official image; keep them in sync).
$wgDBtype = "mysql";
$wgDBserver = "db";
$wgDBname = "mediawiki";
$wgDBuser = "mediawiki";
$wgDBpassword = "mediawiki";

# Bundled with the official image; provides <ref>/<references>.
wfLoadExtension( 'Cite' );

# Skin
wfLoadSkin( 'Strata' );
$wgDefaultSkin = 'strata';
$wgVector2022ResponsiveModules = false;

# Allow uploads/installs needed by the smoke article.
$wgEnableUploads = false;

# CSP note: the skin loads Google Fonts through its `skins.strata.fonts`
# ResourceLoader JS module (resources/strata-fonts.js, generated from
# @strata/tokens fontsUrl). If a site sets $wgCSPDefaultSrc / style-src it
# must allow fonts.googleapis.com (style-src) and fonts.gstatic.com
# (font-src). See docs/MEDIAWIKI.md.

$wgShowExceptionDetails = true;
$wgDebugDumpSql = false;

# Cookie/auth basics for a throwaway instance.
$wgSecretKey = "strata-smoke-secret-key-not-for-production";
$wgUpgradeKey = "strata-smoke-upgrade-key";
$wgEnableEmail = false;
$wgPasswordAttemptThrottle = false;
