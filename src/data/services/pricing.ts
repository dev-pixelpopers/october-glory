/**
 * Member / non-member pricing.
 *
 * Every price in the service data is the REGULAR (non-member) price — the
 * figure on the salon's menu. Members pay MEMBER_DISCOUNT less, derived here
 * so there's one figure to maintain per service rather than two that can drift
 * apart.
 *
 * MEMBER_DISCOUNT must match the backend's membership.discount_rate setting,
 * which is what booking actually charges (30% by default). Set `memberPrice`
 * on an individual service to override the calculation.
 */

/** Members' discount, as a fraction of the regular price. */
export const MEMBER_DISCOUNT = 0.3;

export type ServicePricing = {
  member: string;
  nonMember: string;
};

/**
 * "$120" -> 120. Returns undefined for anything that isn't a plain price, so
 * a value like "From $120" or "Varies" falls back to being shown as-is rather
 * than producing a nonsense number.
 */
const parse = (price: string): number | undefined => {
  const match = /^\$([\d,]+(?:\.\d+)?)$/.exec(price.trim());
  if (!match) return undefined;

  const value = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(value) ? value : undefined;
};

/** 108.5 -> "$108.50", 140 -> "$140" — cents only when there are any. */
const format = (value: number): string =>
  `$${value.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;

/**
 * The regular price and its member counterpart.
 *
 * `override` wins when set, for services whose member price the salon has
 * actually quoted. Returns undefined when there's no price at all, so callers
 * can skip rendering the block entirely.
 */
export const servicePricing = (
  price?: string,
  override?: string
): ServicePricing | undefined => {
  if (!price) return undefined;

  if (override) return { member: override, nonMember: price };

  const value = parse(price);
  if (value === undefined) return { member: price, nonMember: price };

  // Rounded to the cent, exactly as the booking API computes it.
  const member = Math.round(value * (1 - MEMBER_DISCOUNT) * 100) / 100;

  return { member: format(member), nonMember: price };
};
