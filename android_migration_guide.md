# Android App Migration Guide

This document outlines the strategies for converting the Attendance Tracker PWA into a native Android application.

## Option 1: Capacitor (Recommended for Speed)
Capacitor allows you to wrap your existing React web application into a native Android container with minimal code changes.

### Steps:
1.  **Install Capacitor**:
    ```bash
    npm install @capacitor/core @capacitor/cli @capacitor/android
    npx cap init
    ```
2.  **Build the Web App**:
    ```bash
    npm run build
    ```
3.  **Add Android Platform**:
    ```bash
    npx cap add android
    ```
4.  **Sync**:
    ```bash
    npx cap sync
    ```
5.  **Open in Android Studio**:
    ```bash
    npx cap open android
    ```
6.  **Permissions**: Update `AndroidManifest.xml` for any required permissions (e.g., Camera for QR codes).

### Pros:
-   Reuses 99% of the code.
-   Fastest time to market.
-   Access to native plugins (Camera, Geolocation, Notifications).

### Cons:
-   UI is still web-based (though with high-quality CSS it feels native).

## Option 2: React Native (Recommended for Native Feel)
React Native renders actual native Android UI components, offering better performance and a truly native feel.

### Steps:
1.  **Initialize React Native Project**:
    ```bash
    npx react-native init AttendanceTrackerNative
    ```
2.  **Share Logic**:
    -   Extract business logic (Zustand stores, hooks, utility functions) into a shared package or monorepo structure.
    -   The `src/store`, `src/utils`, and `src/hooks` directories can largely be reused.
3.  **Rewrite UI**:
    -   Replace HTML/CSS (div, span, className) with React Native components (View, Text, StyleSheet).
    -   Replace `react-router-dom` with `react-navigation`.
4.  **Database**:
    -   Replace `idb` (IndexedDB) with `AsyncStorage` or `SQLite` (e.g., `react-native-quick-sqlite`).

### Pros:
-   True native performance and look-and-feel.
-   Better gesture handling.

### Cons:
-   Requires rewriting the UI layer.
-   Different navigation and storage paradigms.

## Option 3: Trusted Web Activity (TWA)
Publish the PWA directly to the Google Play Store using a TWA container.

### Steps:
1.  Use [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) CLI to generate the Android project.
2.  Ensure the PWA meets installability criteria (manifest.json, service worker, HTTPS).
3.  Build and sign the APK/AAB.

### Pros:
-   Simplest if you just want a Play Store presence.
-   Auto-updates with the web deployment.

### Cons:
-   Requires internet connection for first load (unless offline-first is perfectly implemented).
-   Limited native API access compared to Capacitor.

## Recommendation
Start with **Option 1 (Capacitor)**. It allows you to keep the "Apple-like" web UI you are building now and simply wrap it. If performance becomes an issue, migrate to **Option 2 (React Native)** later, reusing your Zustand stores and logic.
