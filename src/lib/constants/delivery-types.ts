import { DeliveryType } from "@/types/product";

export const DELIVERY_TYPE_CONFIG: Record<
  DeliveryType,
  {
    label: string;
    description: string;
    iconName: string;
    badgeColor: string;
  }
> = {
  ACTIVATION_LINK: {
    label: "Direct Activation Link",
    description: "Receive a one-click invite or activation URL to redeem on the provider site.",
    iconName: "Link",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  LICENSE_KEY: {
    label: "License / Product Key",
    description: "Receive a genuine serial key to activate software installations.",
    iconName: "Key",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  ACCOUNT_CREDENTIAL: {
    label: "Account Credentials",
    description: "Receive secure private email and password credentials for instant access.",
    iconName: "UserCheck",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  TEXT_INSTRUCTION: {
    label: "Setup Guide / Instructions",
    description: "Step-by-step setup guides or redemption instructions.",
    iconName: "FileText",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  DOWNLOAD_LINK: {
    label: "Direct Asset Download",
    description: "Secure direct download link for digital assets or installer packages.",
    iconName: "DownloadCloud",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
  },
  OTHER: {
    label: "Custom Delivery",
    description: "Specialized delivery method as specified in product notes.",
    iconName: "Box",
    badgeColor: "bg-slate-50 text-slate-700 border-slate-200",
  },
};
