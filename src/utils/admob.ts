import { Capacitor } from "@capacitor/core";

const INTERSTITIAL_AD_UNIT_ID =
  Capacitor.getPlatform() === "ios"
    ? "ca-app-pub-3940256099942544/4411468910" // iOS 테스트 ID
    : "ca-app-pub-3940256099942544/1033173712"; // Android 테스트 ID

const BANNER_AD_UNIT_ID =
  Capacitor.getPlatform() === "ios"
    ? "ca-app-pub-3940256099942544/2934735716" // iOS 배너 테스트 ID
    : "ca-app-pub-3940256099942544/6300978111"; // Android 배너 테스트 ID

export async function showInterstitialAd(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const { AdMob } = await import("@capacitor-community/admob");

  const options = {
    adId: INTERSTITIAL_AD_UNIT_ID,
    isTesting: true, // 출시 전 반드시 false로 변경
  };

  await AdMob.prepareInterstitial(options);
  await AdMob.showInterstitial();
}

export async function showBannerAd(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const { AdMob, BannerAdSize, BannerAdPosition } =
    await import("@capacitor-community/admob");
  await AdMob.showBanner({
    adId: BANNER_AD_UNIT_ID,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    isTesting: true,
  });
}

export async function hideBannerAd(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const { AdMob } = await import("@capacitor-community/admob");
  await AdMob.removeBanner();
}

export async function initAdMob(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const { AdMob } = await import("@capacitor-community/admob");
  await AdMob.initialize({ testingDevices: [] });
}
