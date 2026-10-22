const RAW_BONDS = [
  { id: "bnd-gsec-10y", issuer: "Government of India", type: "Government", name: "10Y Sovereign Bond", coupon: 7.1, yield: 7.18, maturity: "2035-06-15", rating: "Sovereign", minInvestment: 1000, faceValue: 1000 },
  { id: "bnd-gsec-5y", issuer: "Government of India", type: "Government", name: "5Y Sovereign Bond", coupon: 6.85, yield: 6.92, maturity: "2030-03-31", rating: "Sovereign", minInvestment: 1000, faceValue: 1000 },
  { id: "bnd-sdl-maha", issuer: "State Development Loan", type: "Government", name: "State Development Loan", coupon: 7.35, yield: 7.42, maturity: "2033-11-20", rating: "Sovereign", minInvestment: 10000, faceValue: 1000 },
  { id: "bnd-corp-nimbus", issuer: "Nimbus Softworks Finance", type: "Corporate", name: "Nimbus Finance NCD", coupon: 8.6, yield: 8.75, maturity: "2029-09-01", rating: "AAA", minInvestment: 10000, faceValue: 1000 },
  { id: "bnd-corp-ironclad", issuer: "Ironclad Investments", type: "Corporate", name: "Ironclad Secured NCD", coupon: 9.1, yield: 9.35, maturity: "2028-01-10", rating: "AA+", minInvestment: 10000, faceValue: 1000 },
  { id: "bnd-corp-carbonpeak", issuer: "Carbonpeak Resources", type: "Corporate", name: "Carbonpeak Energy Bond", coupon: 9.8, yield: 10.05, maturity: "2027-05-22", rating: "AA", minInvestment: 25000, faceValue: 1000 },
  { id: "bnd-taxfree-nhai", issuer: "National Highways Authority", type: "Tax-Free", name: "NHAI Tax-Free Bond", coupon: 6.4, yield: 6.4, maturity: "2032-02-14", rating: "AAA", minInvestment: 5000, faceValue: 1000 },
  { id: "bnd-taxfree-irfc", issuer: "Rail Finance Corporation", type: "Tax-Free", name: "IRFC Tax-Free Bond", coupon: 6.25, yield: 6.25, maturity: "2031-08-09", rating: "AAA", minInvestment: 5000, faceValue: 1000 },
  { id: "bnd-corp-bastion", issuer: "Bastion Buildcon", type: "Corporate", name: "Bastion Infra NCD", coupon: 9.45, yield: 9.6, maturity: "2026-12-01", rating: "AA-", minInvestment: 10000, faceValue: 1000 },
  { id: "bnd-gsec-30y", issuer: "Government of India", type: "Government", name: "30Y Sovereign Bond", coupon: 7.4, yield: 7.32, maturity: "2055-04-01", rating: "Sovereign", minInvestment: 1000, faceValue: 1000 },
];

export const BOND_TYPES = ["All", "Government", "Corporate", "Tax-Free"];
export const BOND_RATINGS = ["Sovereign", "AAA", "AA+", "AA", "AA-"];

function maturityYears(maturity) {
  const years = (new Date(maturity) - new Date()) / (1000 * 60 * 60 * 24 * 365);
  return Math.max(0, Number(years.toFixed(1)));
}

export const bonds = RAW_BONDS.map((b) => ({
  ...b,
  yearsToMaturity: maturityYears(b.maturity),
}));

export function getBondById(id) {
  return bonds.find((b) => b.id === id);
}
