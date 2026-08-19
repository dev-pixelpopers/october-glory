/**
 * Member / non-member pricing.
 *
 * Every price in the service data is the MEMBER price — the single number the
 * salon quotes. The non-member price is derived from it, so there's one figure
 * to maintain per service rather than two that can drift apart.
 *
 * IMPORTANT: the derived figures are NOT salon-supplied. They are this markup
 * applied to the member price. When the salon provides a real non-member price
 * list, either change `NON_MEMBER_MARKUP` or set `nonMemberPrice` on the
 * individual service, which overrides the calculation.
 */

/** Non-member surcharge, as a fraction of the member price. */
export const NON_MEMBER_MARKUP = 0.15;

/** Derived prices are rounded to the nearest multiple of this. */
const ROUND_TO = 5;

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

const format = (value: number): string => `$${value.toLocaleString("en-US")}`;

/**
 * The member price and its non-member counterpart.
 *
 * `override` wins when set, for services whose non-member price the salon has
 * actually quoted. Returns undefined when there's no price at all, so callers
 * can skip rendering the block entirely.
 */
export const servicePricing = (
  price?: string,
  override?: string
): ServicePricing | undefined => {
  if (!price) return undefined;

  if (override) return { member: price, nonMember: override };

  const value = parse(price);
  if (value === undefined) return { member: price, nonMember: price };

  const marked = value * (1 + NON_MEMBER_MARKUP);
  const rounded = Math.round(marked / ROUND_TO) * ROUND_TO;

  return { member: price, nonMember: format(rounded) };
};
