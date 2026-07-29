export const SOCIAL_PLATFORMS = ["instagram", "tiktok"] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const PUBLISHING_GOALS = [
  "audience",
  "communaute",
  "vente",
  "notoriete",
] as const;
export type PublishingGoal = (typeof PUBLISHING_GOALS)[number];

export const PUBLISHING_RHYTHMS = [
  "quotidien",
  "2_3_semaine",
  "1_semaine",
  "irregulier",
] as const;
export type PublishingRhythm = (typeof PUBLISHING_RHYTHMS)[number];

export const IMPROVEMENT_POTENTIALS = ["faible", "moyen", "eleve"] as const;
export type ImprovementPotential = (typeof IMPROVEMENT_POTENTIALS)[number];

export function isSocialPlatform(value: unknown): value is SocialPlatform {
  return typeof value === "string" &&
    (SOCIAL_PLATFORMS as readonly string[]).includes(value);
}

export function isPublishingGoal(value: unknown): value is PublishingGoal {
  return typeof value === "string" &&
    (PUBLISHING_GOALS as readonly string[]).includes(value);
}

export function isPublishingRhythm(value: unknown): value is PublishingRhythm {
  return typeof value === "string" &&
    (PUBLISHING_RHYTHMS as readonly string[]).includes(value);
}

export function isImprovementPotential(
  value: unknown,
): value is ImprovementPotential {
  return typeof value === "string" &&
    (IMPROVEMENT_POTENTIALS as readonly string[]).includes(value);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasControlCharacters(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code <= 0x1f || code === 0x7f) return true;
  }
  return false;
}

export function boundedString(
  value: unknown,
  field: string,
  maxLength: number,
): string {
  if (typeof value !== "string") {
    throw new Error(`${field} must be a string`);
  }

  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length === 0 || normalized.length > maxLength) {
    throw new Error(`${field} has an invalid length`);
  }
  if (hasControlCharacters(normalized)) {
    throw new Error(`${field} contains control characters`);
  }

  return normalized;
}

export function boundedStringArray(
  value: unknown,
  field: string,
  minItems: number,
  maxItems: number,
  maxItemLength: number,
): string[] {
  if (!Array.isArray(value)) {
    throw new Error(`${field} must be an array`);
  }
  if (value.length < minItems || value.length > maxItems) {
    throw new Error(`${field} has an invalid length`);
  }
  return value.map((item, index) =>
    boundedString(item, `${field}[${index}]`, maxItemLength)
  );
}

export function integerInRange(
  value: unknown,
  field: string,
  minimum: number,
  maximum: number,
): number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < minimum ||
    value > maximum
  ) {
    throw new Error(`${field} must be an integer between ${minimum} and ${maximum}`);
  }
  return value;
}
