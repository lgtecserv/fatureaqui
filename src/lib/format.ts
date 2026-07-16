export const MT = (v: number) =>
  new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
    currencyDisplay: "code",
    minimumFractionDigits: 2,
  })
    .format(v)
    .replace("MZN", "MT");

export const num = (v: number) =>
  new Intl.NumberFormat("pt-MZ").format(v);
