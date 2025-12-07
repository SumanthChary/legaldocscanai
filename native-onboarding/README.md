# LegalDeep AI Onboarding (React Native)

This folder contains a fully responsive onboarding flow for the native app using `react-native-onboarding-swiper` and `lottie-react-native`.

## Features
- Personalized greeting via `AsyncStorage.getItem('user.name')`
- Three guided pages (scan, risk results, checkout)
- Emerald confetti animation powered by the bundled Lottie file (`assets/legaldeep-confetti.json`)
- Skip button anchored to the top-right, progress dots along the bottom, and emerald CTA buttons
- Persists the completion flag using `AsyncStorage.setItem('onboarded_app', 'true')`

## Getting Started
```bash
cd native-onboarding
npm install react-native-onboarding-swiper lottie-react-native @react-native-async-storage/async-storage
# For iOS & Android projects, remember to run pod install / gradle sync after linking lottie
```

Drop `App.js` into your Expo or bare React Native entry point and register it as the root component. The mock cards can be replaced with live camera, analysis, and checkout screens when you are ready to connect real data.
