import type { ConfigContext, ExpoConfig } from '@expo/config';

import appVersion from '~/app-version.json';

interface ConfigExtra {
  projectId: string;
  updatesUsername: string;
  package: { android: string; ios: string };
  maxInactivityDurationMs: number;
}

enum ConfigKey {
  'scheme',
  'version',
  'owner',
  'slug',
  'name',
  'updates',
  'splash',
  'backgroundColor',
}
type Config = Pick<ExpoConfig, keyof typeof ConfigKey>;

const appEnv = process.env.EXPO_PUBLIC_APP_ENV;
const isProd = appEnv === 'prod';
const packageName = isProd ? 'com.expo.mobile' : `com.expo.${appEnv}`;

const AppConfig: Config & ConfigExtra = {
  package: { android: packageName, ios: packageName },
  scheme: 'expo-app',
  projectId: '',
  // version: appVersion.hash,
  owner: 'expo',
  slug: 'mobile',
  name: isProd || !appEnv ? 'expo' : `expo ${appEnv ?? ''}`,
  backgroundColor: '#F9F9F9', // '#32CD32',
  splash: {
    backgroundColor: '#0C60F8',
  },
  updatesUsername: 'account-username',
  updates: {
    url: 'https://u.expo.dev/-',
    requestHeaders: {
      'expo-channel-name': 'main',
    },
    enabled: true,
    checkAutomatically: 'WIFI_ONLY',
    fallbackToCacheTimeout: 30000,
  },
  maxInactivityDurationMs: 300000,
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: AppConfig.name,
  slug: AppConfig.slug,
  owner: AppConfig.owner,
  version: AppConfig.version,
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: AppConfig.scheme,
  userInterfaceStyle: 'automatic',
  platforms: ['android', 'web', 'ios'],
  assetBundlePatterns: [
    '**/*',
  ],
  backgroundColor: AppConfig.backgroundColor,
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/icon.png',
      backgroundImage: './assets/images/icon.png',
      backgroundColor: AppConfig.splash?.backgroundColor,
    },
    package: AppConfig.package.android,
  },
  ios: {
    bundleIdentifier: AppConfig.package.ios,
    splash: AppConfig.splash,
  },
  androidStatusBar: {
    translucent: false,
    barStyle: 'dark-content',
  },
  plugins: [],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: AppConfig.projectId,
    },
    maxInactivityDurationMs: AppConfig.maxInactivityDurationMs,
    apiHost: process.env.EXPO_PUBLIC_BACKEND_HOST ?? '',
    appEnv,
  },
  runtimeVersion: {
    policy: 'fingerprint',
  },
  updates: AppConfig.updates,
});
