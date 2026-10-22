// Core financial math. Kept pure/side-effect-free so the UI layer can call
// these directly from render without memoization tricks.

export function calculateSIP({ monthlyInvestment, annualReturnPct, years }) {
  const months = Math.round(years * 12);
  const monthlyRate = annualReturnPct / 100 / 12;
  let futureValue = 0;
  if (monthlyRate === 0) {
    futureValue = monthlyInvestment * months;
  } else {
    futureValue =
      monthlyInvestment *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);
  }
  const totalInvested = monthlyInvestment * months;
  return {
    totalInvested,
    estimatedReturns: futureValue - totalInvested,
    finalValue: futureValue,
  };
}

export function calculateSIPSeries({ monthlyInvestment, annualReturnPct, years }) {
  const months = Math.round(years * 12);
  const monthlyRate = annualReturnPct / 100 / 12;
  const series = [];
  let value = 0;
  let invested = 0;
  for (let m = 1; m <= months; m++) {
    value = value * (1 + monthlyRate) + monthlyInvestment;
    invested += monthlyInvestment;
    if (m % 12 === 0 || m === months) {
      series.push({
        label: `Yr ${Math.ceil(m / 12)}`,
        invested: Math.round(invested),
        value: Math.round(value),
      });
    }
  }
  return series;
}

export function calculateStepUpSIP({ startingSIP, annualIncreasePct, years, annualReturnPct }) {
  const monthlyRate = annualReturnPct / 100 / 12;
  let value = 0;
  let invested = 0;
  let currentSIP = startingSIP;
  const series = [];
  for (let year = 1; year <= Math.round(years); year++) {
    for (let m = 1; m <= 12; m++) {
      value = value * (1 + monthlyRate) + currentSIP;
      invested += currentSIP;
    }
    series.push({ label: `Yr ${year}`, invested: Math.round(invested), value: Math.round(value) });
    currentSIP = currentSIP * (1 + annualIncreasePct / 100);
  }
  return {
    totalInvested: invested,
    estimatedReturns: value - invested,
    finalValue: value,
    series,
  };
}

export function calculateLumpSum({ principal, annualReturnPct, years }) {
  const finalValue = principal * Math.pow(1 + annualReturnPct / 100, years);
  return {
    totalInvested: principal,
    estimatedReturns: finalValue - principal,
    finalValue,
  };
}

export function calculateCAGR({ initialValue, finalValue, years }) {
  if (initialValue <= 0 || years <= 0) return 0;
  return (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
}

export function calculateFD({ principal, annualRatePct, years, compoundingPerYear = 4 }) {
  const n = compoundingPerYear;
  const finalValue = principal * Math.pow(1 + annualRatePct / 100 / n, n * years);
  return {
    totalInvested: principal,
    estimatedReturns: finalValue - principal,
    finalValue,
  };
}

export function calculateBondInterest({ faceValue, couponRatePct, years, frequency = 2 }) {
  const periodicRate = couponRatePct / 100 / frequency;
  const periodicPayout = faceValue * periodicRate;
  const totalPayments = Math.round(years * frequency);
  const totalInterest = periodicPayout * totalPayments;
  return {
    periodicPayout,
    totalPayments,
    totalInterest,
    maturityValue: faceValue + totalInterest,
  };
}

export function calculateGoalProgress({ targetAmount, currentSavings, targetDate, expectedReturnPct }) {
  const now = new Date();
  const target = new Date(targetDate);
  const monthsRemaining = Math.max(
    1,
    (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
  );
  const yearsRemaining = monthsRemaining / 12;
  const completionPct = targetAmount > 0 ? Math.min(100, (currentSavings / targetAmount) * 100) : 0;
  const remainingAmount = Math.max(0, targetAmount - currentSavings);

  // Future value of current savings, then solve the SIP annuity for the residual.
  const monthlyRate = expectedReturnPct / 100 / 12;
  const fvOfCurrent = currentSavings * Math.pow(1 + monthlyRate, monthsRemaining);
  const residual = Math.max(0, targetAmount - fvOfCurrent);
  let requiredMonthly = 0;
  if (residual > 0) {
    if (monthlyRate === 0) {
      requiredMonthly = residual / monthsRemaining;
    } else {
      const annuityFactor =
        ((Math.pow(1 + monthlyRate, monthsRemaining) - 1) / monthlyRate) * (1 + monthlyRate);
      requiredMonthly = residual / annuityFactor;
    }
  }

  return {
    completionPct,
    remainingAmount,
    requiredMonthlyInvestment: requiredMonthly,
    monthsRemaining,
    yearsRemaining,
  };
}

// --- Portfolio analytics, derived from a { date, value }[] history series ---

export function calculateAbsoluteReturn(history) {
  if (!history || history.length < 2) return 0;
  const first = history[0].value;
  const last = history[history.length - 1].value;
  if (first <= 0) return 0;
  return ((last - first) / first) * 100;
}

export function calculateAnnualizedReturn(history) {
  if (!history || history.length < 2) return 0;
  const first = history[0];
  const last = history[history.length - 1];
  const years = (new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24 * 365);
  if (years <= 0 || first.value <= 0) return 0;
  return calculateCAGR({ initialValue: first.value, finalValue: last.value, years });
}

function dailyReturns(history) {
  const returns = [];
  for (let i = 1; i < history.length; i++) {
    const prev = history[i - 1].value;
    const curr = history[i].value;
    if (prev > 0) returns.push((curr - prev) / prev);
  }
  return returns;
}

export function calculateVolatility(history) {
  const returns = dailyReturns(history);
  if (returns.length < 2) return 0;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
  const dailyStd = Math.sqrt(variance);
  return dailyStd * Math.sqrt(252) * 100; // annualized, as a %
}

export function calculateMaxDrawdown(history) {
  if (!history || history.length < 2) return 0;
  let peak = history[0].value;
  let maxDrawdown = 0;
  for (const point of history) {
    if (point.value > peak) peak = point.value;
    const drawdown = peak > 0 ? ((point.value - peak) / peak) * 100 : 0;
    if (drawdown < maxDrawdown) maxDrawdown = drawdown;
  }
  return maxDrawdown;
}

export function calculateSharpeRatio(history, riskFreeRatePct = 6.5) {
  const returns = dailyReturns(history);
  if (returns.length < 2) return 0;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
  const dailyStd = Math.sqrt(variance);
  if (dailyStd === 0) return 0;
  const annualizedReturn = mean * 252;
  const annualizedStd = dailyStd * Math.sqrt(252);
  return (annualizedReturn - riskFreeRatePct / 100) / annualizedStd;
}

// --- Risk assessment ---

export function scoreRiskAssessment(answers) {
  // answers: array of numeric scores (1-4) per question
  const total = answers.reduce((sum, v) => sum + v, 0);
  const max = answers.length * 4;
  const pct = (total / max) * 100;

  let profile = "Conservative";
  if (pct >= 75) profile = "Aggressive";
  else if (pct >= 55) profile = "Growth";
  else if (pct >= 35) profile = "Moderate";

  return { total, max, pct, profile };
}
