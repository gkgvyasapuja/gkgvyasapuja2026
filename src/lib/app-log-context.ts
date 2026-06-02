import type { OfferingFormData } from "@/app/(user)/upload-offering/_components/types";

export type AppLogMetadata = Record<string, unknown>;

export type DeviceType = "mobile" | "tablet" | "desktop";

export function parseBrowserName(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("edg/")) return "Edge";
  if (ua.includes("opr/") || ua.includes("opera")) return "Opera";
  if (ua.includes("chrome") && !ua.includes("chromium")) return "Chrome";
  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("safari") && !ua.includes("chrome")) return "Safari";
  if (ua.includes("msie") || ua.includes("trident")) return "Internet Explorer";
  return "Unknown";
}

export function detectDeviceType(userAgent: string): DeviceType {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/.test(ua)) {
    return "mobile";
  }
  if (/android/.test(ua)) return "tablet";
  return "desktop";
}

export function buildUserLogFields(
  formData: Partial<OfferingFormData>,
): AppLogMetadata {
  const firstName = formData.firstName?.trim();
  const lastName = formData.lastName?.trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return {
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    fullName: fullName || undefined,
    email: formData.email?.trim() || undefined,
    phone: formData.phone?.trim() || undefined,
    gender: formData.gender || undefined,
    language: formData.language || undefined,
    countryId: formData.countryId || undefined,
    stateId: formData.stateId || undefined,
    cityId: formData.cityId || undefined,
    templeId: formData.templeId || undefined,
    otherTempleName: formData.otherTempleName?.trim() || undefined,
    initiated: formData.initiated,
    initiationType: formData.initiationType || undefined,
    initiationYear: formData.initiationYear || undefined,
    initiatedName: formData.initiatedName?.trim() || undefined,
  };
}

export function buildClientLogFields(): AppLogMetadata {
  if (typeof window === "undefined") return {};

  const userAgent = navigator.userAgent;
  const connection = (
    navigator as Navigator & {
      connection?: { effectiveType?: string; downlink?: number };
    }
  ).connection;

  return {
    userAgent,
    browser: parseBrowserName(userAgent),
    deviceType: detectDeviceType(userAgent),
    platform: navigator.platform || undefined,
    screenWidth: window.screen?.width,
    screenHeight: window.screen?.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: navigator.language,
    connectionType: connection?.effectiveType,
    connectionDownlinkMbps: connection?.downlink,
  };
}

/** Merge user, client, and event-specific fields for app_log.metadata. */
export function buildAppLogMetadata(
  formData?: Partial<OfferingFormData>,
  extra?: AppLogMetadata,
): AppLogMetadata {
  const metadata: AppLogMetadata = {
    ...buildClientLogFields(),
    ...(formData ? buildUserLogFields(formData) : {}),
    ...extra,
  };

  for (const key of Object.keys(metadata)) {
    if (metadata[key] === undefined) {
      delete metadata[key];
    }
  }

  return metadata;
}

export function buildServerLogFields(headersList: Headers): AppLogMetadata {
  const userAgent = headersList.get("user-agent") ?? undefined;
  const forwardedFor = headersList.get("x-forwarded-for");
  const clientIp =
    forwardedFor?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    undefined;

  return {
    clientIp,
    userAgent,
    browser: userAgent ? parseBrowserName(userAgent) : undefined,
    deviceType: userAgent ? detectDeviceType(userAgent) : undefined,
  };
}

/** Client fields win; server fills gaps (e.g. IP, missing UA). */
export function mergeAppLogMetadata(
  clientMetadata?: AppLogMetadata,
  serverMetadata?: AppLogMetadata,
): AppLogMetadata | undefined {
  if (!clientMetadata && !serverMetadata) return undefined;

  const merged: AppLogMetadata = { ...serverMetadata, ...clientMetadata };

  for (const key of Object.keys(merged)) {
    if (merged[key] === undefined) {
      delete merged[key];
    }
  }

  return Object.keys(merged).length > 0 ? merged : undefined;
}
