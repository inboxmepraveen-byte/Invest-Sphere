export const TRANSACTION_TYPES = ["Buy", "Sell", "SIP", "Dividend", "Interest", "Deposit", "Withdrawal"];

// Seed history so the Transactions page isn't empty on first load. New
// entries created via Add Investment are prepended to this in localStorage.
export const SEED_TRANSACTIONS = [
  { id: "txn-1", type: "Buy", investment: "Apex Flexi Cap Fund", investmentType: "mutualFund", amount: 14680, quantity: 214.6, date: "2023-04-12" },
  { id: "txn-2", type: "Buy", investment: "Summit Large Cap Fund", investmentType: "mutualFund", amount: 11425, quantity: 96.2, date: "2022-11-03" },
  { id: "txn-3", type: "SIP", investment: "Apex Flexi Cap Fund", investmentType: "mutualFund", amount: 5000, quantity: 68.1, date: "2024-01-05" },
  { id: "txn-4", type: "Buy", investment: "Nifty 50 Index Fund", investmentType: "mutualFund", amount: 10405, quantity: 58.4, date: "2023-08-20" },
  { id: "txn-5", type: "Buy", investment: "Nimbus Softworks", investmentType: "stock", amount: 35760, quantity: 12, date: "2023-02-15" },
  { id: "txn-6", type: "Buy", investment: "Vertan Bank Ltd", investmentType: "stock", amount: 37820, quantity: 40, date: "2023-06-01" },
  { id: "txn-7", type: "Dividend", investment: "Vertan Bank Ltd", investmentType: "stock", amount: 480, quantity: null, date: "2024-02-10" },
  { id: "txn-8", type: "Buy", investment: "NHAI Tax-Free Bond", investmentType: "bond", amount: 10000, quantity: 10, date: "2022-09-10" },
  { id: "txn-9", type: "Interest", investment: "NHAI Tax-Free Bond", investmentType: "bond", amount: 640, quantity: null, date: "2024-03-14" },
  { id: "txn-10", type: "SIP", investment: "Summit Large Cap Fund", investmentType: "mutualFund", amount: 5000, quantity: 35.4, date: "2024-04-05" },
  { id: "txn-11", type: "Deposit", investment: "Wallet Balance", investmentType: "cash", amount: 25000, quantity: null, date: "2024-05-01" },
];
