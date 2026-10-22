import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import Button from "../components/Button";
import { scoreRiskAssessment } from "../utils/calculations";
import "./RiskAssessment.css";

const QUESTIONS = [
  {
    id: "horizon",
    text: "How long until you'll need this money?",
    options: [
      { label: "Less than 1 year", score: 1 },
      { label: "1–3 years", score: 2 },
      { label: "3–7 years", score: 3 },
      { label: "7+ years", score: 4 },
    ],
  },
  {
    id: "reaction",
    text: "If your portfolio fell 20% in a month, what would you do?",
    options: [
      { label: "Sell everything immediately", score: 1 },
      { label: "Sell some to limit further loss", score: 2 },
      { label: "Hold and wait it out", score: 3 },
      { label: "Invest more while prices are low", score: 4 },
    ],
  },
  {
    id: "income",
    text: "How stable is your current income?",
    options: [
      { label: "Irregular or uncertain", score: 1 },
      { label: "Somewhat stable", score: 2 },
      { label: "Stable, salaried", score: 3 },
      { label: "Very stable with savings buffer", score: 4 },
    ],
  },
  {
    id: "experience",
    text: "How much investing experience do you have?",
    options: [
      { label: "None — this is new to me", score: 1 },
      { label: "A little, mostly FDs/savings", score: 2 },
      { label: "Some, in mutual funds", score: 3 },
      { label: "Experienced across stocks & funds", score: 4 },
    ],
  },
  {
    id: "objective",
    text: "What's your primary investment objective?",
    options: [
      { label: "Capital protection", score: 1 },
      { label: "Steady, modest growth", score: 2 },
      { label: "Balanced growth", score: 3 },
      { label: "Maximum long-term growth", score: 4 },
    ],
  },
];

const PROFILE_DESCRIPTIONS = {
  Conservative: "You likely prioritize protecting capital over growth. Debt funds, bonds, and low-volatility instruments tend to fit this profile best.",
  Moderate: "You're comfortable with some fluctuation in exchange for better long-term returns. A mix of hybrid funds and large-cap equity may suit you.",
  Growth: "You can tolerate meaningful short-term swings in pursuit of stronger returns. Flexi-cap and mid-cap equity funds often fit this profile.",
  Aggressive: "You're focused on maximizing long-term growth and can withstand large drawdowns. Small-cap and sector-focused equity may align with this.",
};

export default function RiskAssessment() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined);

  const handleSelect = (qId, score) => {
    setAnswers((prev) => ({ ...prev, [qId]: score }));
    setSubmitted(false);
  };

  const result = submitted ? scoreRiskAssessment(QUESTIONS.map((q) => answers[q.id])) : null;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Risk Assessment</h1>
          <p>Answer a few questions to understand your investing risk profile. This is educational, not professional financial advice.</p>
        </div>
      </div>

      <div className="risk-grid">
        <div>
          {QUESTIONS.map((q, idx) => (
            <div className="panel risk-question" key={q.id}>
              <div className="risk-question-title">
                {idx + 1}. {q.text}
              </div>
              <div className="risk-options">
                {q.options.map((opt) => (
                  <button
                    key={opt.label}
                    className={answers[q.id] === opt.score ? "risk-option active" : "risk-option"}
                    onClick={() => handleSelect(q.id, opt.score)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <Button variant="primary" disabled={!allAnswered} onClick={() => setSubmitted(true)}>
            See My Risk Profile
          </Button>
        </div>

        <div className="panel risk-result-panel">
          {!result ? (
            <div className="risk-placeholder">
              <ShieldCheck size={26} strokeWidth={1.5} />
              <p>Answer all {QUESTIONS.length} questions to see your risk profile.</p>
            </div>
          ) : (
            <>
              <div className="risk-result-label">Your Risk Profile</div>
              <div className="risk-result-value">{result.profile}</div>
              <div className="risk-result-score">
                Score: {result.total} / {result.max} ({result.pct.toFixed(0)}%)
              </div>
              <div className="progress-track" style={{ margin: "12px 0 16px" }}>
                <div className="progress-fill" style={{ width: `${result.pct}%` }} />
              </div>
              <p className="risk-result-desc">{PROFILE_DESCRIPTIONS[result.profile]}</p>
              <p className="risk-disclaimer">
                This result is generated from your answers using a simple weighted score and is meant for
                general guidance only — it is not professional financial advice.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
