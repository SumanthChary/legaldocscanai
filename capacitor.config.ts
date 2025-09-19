import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.83f647f3cfa24f8c8777ba526dd5e49f',
  appName: 'LegalDoc Scanner',
  webDir: 'dist',
  server: {
    url: 'https://83f647f3-cfa2-4f8c-8777-ba526dd5e49f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1a1a1a",
      showSpinner: false,
      spinnerColor: "#ffffff"
    },
    StatusBar: {
      style: 'dark'
    }
  }
};

export default config;