import { useNavigate } from "react-router-dom";
import { Calculator, Target, ListFilter, TrendingUp, Landmark, ShieldCheck } from "lucide-react";
import { mutualFunds, FUND_COLLECTIONS } from "../data/mutualFunds";
import FundCard from "../components/FundCard";
import "./Dashboard.css";

const FEATURED_CATEGORIES = ["Flexi Cap", "Large Cap", "Mid Cap", "Small Cap", "Debt"];

const TOOLS = [
  { key: "sip", label: "SIP Calculator", description: "Project SIP growth over time", icon: Calculator, path: "/calculators?tab=sip" },
  { key: "goal", label: "Goal Planner", description: "Plan required investing for a goal", icon: Target, path: "/goals" },
  { key: "screener", label: "Fund Screener", description: "Filter funds by category & risk", icon: ListFilter, path: "/mutual-funds" },
  { key: "cagr", label: "CAGR Calculator", description: "Find annualized growth rate", icon: TrendingUp, path: "/calculators?tab=cagr" },
  { key: "bond", label: "Bond Calculator", description: "Estimate bond interest payouts", icon: Landmark, path: "/calculators?tab=bond" },
  { key: "risk", label: "Risk Assessment", description: "Find your investing risk profile", icon: ShieldCheck, path: "/risk-assessment" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const featured = FEATURED_CATEGORIES.map((cat) => mutualFunds.find((f) => f.category === cat)).filter(Boolean);

  return (
    <div className="container">
      <div className="dashboard-intro">
        <h1>Invest smarter. Understand better. Plan ahead.</h1>
        <p>
          Discover mutual funds, stocks and bonds, track a portfolio, and plan toward your goals — all in one
          place.
        </p>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Featured Investments</h2>
          <button className="link" onClick={() => navigate("/mutual-funds")}>
            View all funds
          </button>
        </div>
        <div className="grid-cards">
          {featured.map((fund) => (
            <FundCard key={fund.id} fund={fund} />
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Collections</h2>
        </div>
        <div className="collection-grid">
          {Object.entries(FUND_COLLECTIONS).map(([key, col]) => (
            <button
              key={key}
              className="collection-tile"
              onClick={() => navigate(`/mutual-funds?collection=${key}`)}
            >
              {col.label}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Investment Tools</h2>
        </div>
        <div className="tools-grid">
          {TOOLS.map((tool) => (
            <button key={tool.key} className="tool-tile" onClick={() => navigate(tool.path)}>
              <div className="tool-tile-icon">
                <tool.icon size={18} />
              </div>
              <div>
                <div className="tool-tile-label">{tool.label}</div>
                <div className="tool-tile-desc">{tool.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
