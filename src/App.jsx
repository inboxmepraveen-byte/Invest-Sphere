import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import MutualFunds from "./pages/MutualFunds";
import MutualFundDetails from "./pages/MutualFundDetails";
import Stocks from "./pages/Stocks";
import StockDetails from "./pages/StockDetails";
import Bonds from "./pages/Bonds";
import BondDetails from "./pages/BondDetails";
import Portfolio from "./pages/Portfolio";
import Watchlist from "./pages/Watchlist";
import Goals from "./pages/Goals";
import Calculators from "./pages/Calculators";
import Analytics from "./pages/Analytics";
import Learn from "./pages/Learn";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Compare from "./pages/Compare";
import Cart from "./pages/Cart";
import Transactions from "./pages/Transactions";
import RiskAssessment from "./pages/RiskAssessment";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mutual-funds" element={<MutualFunds />} />
        <Route path="/mutual-funds/:id" element={<MutualFundDetails />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/stocks/:id" element={<StockDetails />} />
        <Route path="/bonds" element={<Bonds />} />
        <Route path="/bonds/:id" element={<BondDetails />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/calculators" element={<Calculators />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/risk-assessment" element={<RiskAssessment />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
