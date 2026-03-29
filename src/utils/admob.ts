import { Capacitor } from "@capacitor/core";

const INTERSTITIAL_AD_UNIT_ID =
  Capacitor.getPlatform() === "ios"
    ? "ca-app-pub-3510048415455621/8579353898" // iOS 테스트 ID
    : "ca-app-pub-3510048415455621/8718954690"; // Android 테스트 ID

const BANNER_AD_UNIT_ID =
  Capacitor.getPlatform() === "ios"
    ? "ca-app-pub-3510048415455621/4779709687" // iOS 배너 테스트 ID
    : "ca-app-pub-3510048415455621/3143194385"; // Android 배너 테스트 ID

export async function showInterstitialAd(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const { AdMob } = await import("@capacitor-community/admob");

  const options = {
    adId: INTERSTITIAL_AD_UNIT_ID,
    isTesting: false,
  };

  await AdMob.prepareInterstitial(options);
  await AdMob.showInterstitial();
}

export async function showBannerAd(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const { AdMob, BannerAdSize, BannerAdPosition } = await import(
    "@capacitor-community/admob"
  );
  await AdMob.showBanner({
    adId: BANNER_AD_UNIT_ID,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    isTesting: false,
  });
}

export async function hideBannerAd(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const { AdMob } = await import("@capacitor-community/admob");
  await AdMob.removeBanner();
}

export async function resumeBanner(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const { AdMob } = await import("@capacitor-community/admob");
  await AdMob.resumeBanner();
}

export async function pauseBanner(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const { AdMob } = await import("@capacitor-community/admob");
  await AdMob.hideBanner();
}

export async function initAdMob(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const { AdMob } = await import("@capacitor-community/admob");
  await AdMob.initialize({ testingDevices: [] });
}
