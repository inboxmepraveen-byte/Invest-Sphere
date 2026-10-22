export const articles = [
  {
    id: "art-mutual-funds",
    level: "Beginner",
    title: "What Is a Mutual Fund?",
    readTime: 4,
    summary: "How pooled investing works and why it's the starting point for most portfolios.",
    content:
      "A mutual fund pools money from many investors and uses it to buy a diversified basket of stocks, bonds, or other securities, managed by a professional fund manager. Instead of picking individual stocks yourself, you buy units of the fund, and your returns move with the value of its underlying holdings. This gives smaller investors access to diversification and professional management that would otherwise require significant capital and expertise. Funds are categorized by what they invest in — equity funds hold stocks, debt funds hold bonds, and hybrid funds hold a mix of both — and by the level of risk and potential return that comes with each category.",
  },
  {
    id: "art-sip",
    level: "Beginner",
    title: "SIP: Investing a Fixed Amount Every Month",
    readTime: 3,
    summary: "Why investing a fixed sum regularly smooths out market timing risk.",
    content:
      "A Systematic Investment Plan (SIP) lets you invest a fixed amount in a mutual fund at regular intervals, typically monthly, instead of investing a lump sum all at once. Because you buy more units when prices are low and fewer when prices are high, SIPs average out your purchase cost over time — a concept known as rupee cost averaging. This removes the pressure of trying to time the market and builds a disciplined investing habit. Over long horizons, the combination of regular investing and compounding can meaningfully grow even modest monthly contributions.",
  },
  {
    id: "art-nav",
    level: "Beginner",
    title: "NAV: The Price of a Mutual Fund Unit",
    readTime: 3,
    summary: "How Net Asset Value is calculated and what it does (and doesn't) tell you.",
    content:
      "Net Asset Value (NAV) is the per-unit market value of a mutual fund, calculated by taking the total value of the fund's assets, subtracting liabilities, and dividing by the number of outstanding units. NAV is published once a day after markets close. A common misconception is that a lower NAV means a fund is 'cheaper' or better value — it doesn't. What matters is the fund's percentage return over time, not the absolute NAV figure, since two funds with different NAVs can deliver identical percentage growth on your investment.",
  },
  {
    id: "art-cagr",
    level: "Beginner",
    title: "CAGR: Measuring Growth Over Time",
    readTime: 3,
    summary: "The standard way to express an investment's annualized growth rate.",
    content:
      "Compound Annual Growth Rate (CAGR) expresses the smoothed annual rate at which an investment would have grown if it had grown at a steady rate every year, ignoring volatility along the way. It's calculated as (Final Value / Initial Value)^(1/Years) − 1. CAGR is useful for comparing investments over different time periods on a like-for-like basis, but it can mask significant swings in value — an investment that fell sharply and then recovered can show the same CAGR as one that grew steadily throughout.",
  },
  {
    id: "art-diversification",
    level: "Beginner",
    title: "Diversification: Not Putting All Eggs in One Basket",
    readTime: 4,
    summary: "How spreading investments across assets reduces portfolio risk.",
    content:
      "Diversification means spreading your investments across different asset classes, sectors, and securities so that a decline in any single holding has a limited impact on your overall portfolio. Because different assets often respond differently to the same economic event — for instance, bonds may hold steady or rise when stocks fall — a well-diversified portfolio tends to have smoother, more predictable returns than a concentrated one. Diversification doesn't eliminate risk entirely, but it reduces the impact of any single bad decision or bad year.",
  },
  {
    id: "art-asset-allocation",
    level: "Intermediate",
    title: "Asset Allocation: The Biggest Driver of Returns",
    readTime: 5,
    summary: "Why how you split money across asset classes matters more than fund selection.",
    content:
      "Asset allocation is the strategy of dividing an investment portfolio among different asset categories — typically equities, debt, gold, and cash — based on your goals, time horizon, and risk tolerance. Research consistently shows that this high-level mix, rather than the specific funds or stocks chosen within each category, is the dominant factor in long-term portfolio performance. A younger investor with a long horizon might lean heavily toward equities for growth, while someone nearing a goal might shift toward debt for capital preservation. Rebalancing periodically back to your target allocation is what keeps the strategy on track as markets move.",
  },
  {
    id: "art-risk",
    level: "Intermediate",
    title: "Understanding Investment Risk",
    readTime: 4,
    summary: "The different kinds of risk and how they show up in your portfolio.",
    content:
      "Investment risk isn't a single number — it includes market risk (prices moving with the broader market), concentration risk (too much in one holding), interest rate risk (bond prices falling as rates rise), credit risk (a borrower failing to repay), and liquidity risk (not being able to sell when you need to). Different instruments carry different mixes of these risks: small-cap equity funds carry high market and concentration risk but low credit risk, while corporate bonds carry meaningful credit risk but lower market risk. Understanding which risks you're exposed to — not just how much risk in aggregate — helps you build a portfolio that matches your actual tolerance.",
  },
  {
    id: "art-portfolio-management",
    level: "Intermediate",
    title: "Active Portfolio Management Basics",
    readTime: 5,
    summary: "Rebalancing, review cadence, and avoiding common behavioral mistakes.",
    content:
      "Managing a portfolio doesn't stop once you've made your initial investments. Rebalancing — periodically buying or selling holdings to restore your target allocation — prevents winners from becoming oversized risks and keeps your portfolio aligned with your goals. A quarterly or annual review cadence is usually sufficient; checking too frequently tends to trigger reactive, emotionally driven decisions rather than sound ones. Common mistakes include chasing recent top performers, panic-selling during downturns, and letting a portfolio drift far from its intended allocation without correction.",
  },
  {
    id: "art-bonds-intermediate",
    level: "Intermediate",
    title: "How Bonds Actually Work",
    readTime: 4,
    summary: "Coupons, yield, maturity, and the inverse relationship with interest rates.",
    content:
      "A bond is a loan you make to a government or company in exchange for regular interest payments (the coupon) and the return of the original amount (face value) at maturity. A bond's yield reflects the actual return an investor earns based on its current market price, which moves inversely to interest rates — when rates rise, existing bonds with lower coupons become less attractive, so their prices fall, and vice versa. Credit ratings, assigned by agencies, indicate the issuer's likelihood of repaying on time, with government bonds generally considered the safest and lower-rated corporate bonds offering higher yields to compensate for higher risk.",
  },
  {
    id: "art-xirr",
    level: "Advanced",
    title: "XIRR: Returns for Irregular Cash Flows",
    readTime: 5,
    summary: "Why SIPs and multiple transactions need a different return metric than CAGR.",
    content:
      "Extended Internal Rate of Return (XIRR) calculates the annualized return of a series of cash flows that occur at irregular intervals and amounts — exactly the pattern created by SIPs, top-ups, and partial withdrawals. Unlike CAGR, which assumes a single investment made once and held, XIRR accounts for the fact that each installment has been invested for a different length of time. It's calculated by finding the discount rate that makes the net present value of all cash flows equal to zero. Most platforms compute this for you, but understanding what it represents helps you interpret a SIP portfolio's real return rather than mistaking simple average NAV growth for your actual return.",
  },
  {
    id: "art-sharpe",
    level: "Advanced",
    title: "Sharpe Ratio: Return Per Unit of Risk",
    readTime: 4,
    summary: "How to compare investments that took very different paths to the same return.",
    content:
      "The Sharpe Ratio measures how much excess return an investment generates for each unit of risk (volatility) it takes on, calculated as (Return − Risk-Free Rate) ÷ Standard Deviation of Returns. Two funds might deliver the same 15% annual return, but if one achieved it with wild swings and the other with a smooth, steady climb, the smoother fund has a higher Sharpe Ratio and arguably a better risk-adjusted outcome. A higher Sharpe Ratio generally indicates a more efficient use of risk, making it a useful tool for comparing funds or portfolios beyond just raw returns.",
  },
  {
    id: "art-volatility",
    level: "Advanced",
    title: "Volatility: Quantifying Price Swings",
    readTime: 4,
    summary: "What standard deviation of returns actually measures and why it matters.",
    content:
      "Volatility measures how much an investment's returns fluctuate around their average, usually expressed as the annualized standard deviation of daily or monthly returns. A high-volatility asset can swing sharply in both directions over short periods, while a low-volatility asset moves more gradually. Volatility isn't inherently bad — it's often the price paid for higher long-term returns — but it matters enormously for how comfortably an investor can hold through downturns, and for how appropriate an asset is given a specific time horizon. Short time horizons generally call for lower-volatility holdings, since there's less time to recover from a downturn.",
  },
  {
    id: "art-drawdown",
    level: "Advanced",
    title: "Maximum Drawdown: The Worst Case So Far",
    readTime: 3,
    summary: "Why peak-to-trough decline tells a different story than average volatility.",
    content:
      "Maximum drawdown measures the largest percentage drop from a peak to a subsequent trough in an investment's value, before a new peak is reached. Unlike volatility, which reflects the average size of fluctuations, drawdown captures the single worst stretch an investor would have lived through. Two funds can have similar volatility but very different maximum drawdowns depending on how their losses clustered together. This metric is particularly useful for gauging psychological risk — a large drawdown, even if eventually recovered, is often what causes investors to sell at the worst possible time.",
  },
  {
    id: "art-bond-yield-advanced",
    level: "Advanced",
    title: "Bond Yield Curves and What They Signal",
    readTime: 5,
    summary: "Reading the relationship between maturity and yield across the bond market.",
    content:
      "A yield curve plots the yields of bonds with equal credit quality but different maturities, typically government bonds, from short-term to long-term. Under normal conditions, the curve slopes upward, since investors demand higher yields to lock up money for longer. When short-term yields rise above long-term yields — an inverted curve — it has historically been read as a signal of economic slowdown ahead, since it suggests markets expect interest rates and growth to fall over time. Watching how the curve shifts over months, rather than any single day's yield figures, is what gives it predictive value.",
  },
];

export const ARTICLE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export function getArticleById(id) {
  return articles.find((a) => a.id === id);
}
