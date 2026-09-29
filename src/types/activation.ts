export type ActivationBlockType =
  | "HEADING"
  | "TEXT"
  | "STEP"
  | "BULLET_LIST"
  | "NUMBERED_LIST"
  | "SUCCESS_NOTICE"
  | "INFO_NOTICE"
  | "WARNING_NOTICE"
  | "DANGER_NOTICE"
  | "BUTTON"
  | "LINK"
  | "DIVIDER"
  | "OPTIONAL_IMAGE";

export type StyleVariant = "DEFAULT" | "INFO" | "SUCCESS" | "WARNING" | "DANGER";

export interface ActivationBlockImage {
  secureUrl: string;
  publicId?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ActivationBlock {
  id: string;
  type: ActivationBlockType;
  title?: string;
  content?: string;
  items?: string[];
  buttonLabel?: string;
  buttonUrl?: string;
  image?: ActivationBlockImage;
  sortOrder: number;
  styleVariant?: StyleVariant;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivationProcess {
  id: string;
  orderId: string;
  title?: string;
  subtitle?: string;
  blocks: ActivationBlock[];
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}
