import { useEffect, useState } from "react";
import { Car, Home, GraduationCap, Shield, Plane, Trees, Target, Plus, Trash2 } from "lucide-react";
import { loadState, saveState, STORAGE_KEYS } from "../utils/storage";
import { SEED_GOALS, GOAL_TEMPLATES } from "../data/goals";
import { calculateGoalProgress } from "../utils/calculations";
import { formatCurrency, formatDate } from "../utils/formatting";
import Modal from "../components/Modal";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import { useToast } from "../context/ToastContext";
import "./Goals.css";

const ICONS = { car: Car, home: Home, "graduation-cap": GraduationCap, shield: Shield, plane: Plane, "palm-tree": Trees, target: Target };

const todayISO = () => new Date().toISOString().slice(0, 10);
const nextYearISO = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
};

export default function Goals() {
  const [goals, setGoals] = useState(() => loadState(STORAGE_KEYS.goals, SEED_GOALS));
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", icon: "target", targetAmount: "", currentSavings: "", targetDate: nextYearISO(), expectedReturnPct: "10" });
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();

  useEffect(() => {
    saveState(STORAGE_KEYS.goals, goals);
  }, [goals]);

  const openTemplate = (template) => {
    setForm({
      name: template.name,
      icon: template.icon,
      targetAmount: String(template.suggestedAmount),
      currentSavings: "",
      targetDate: nextYearISO(),
      expectedReturnPct: "10",
    });
    setModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Goal name is required.";
    const target = Number(form.targetAmount);
    const current = Number(form.currentSavings || 0);
    if (!target || target <= 0) errs.targetAmount = "Target amount must be greater than 0.";
    if (current < 0) errs.currentSavings = "Current savings cannot be negative.";
    if (current > target) errs.currentSavings = "Current savings cannot exceed the target.";
    if (!form.targetDate) errs.targetDate = "Select a target date.";
    else if (new Date(form.targetDate) <= new Date()) errs.targetDate = "Target date must be in the future.";
    const ret = Number(form.expectedReturnPct);
    if (ret < 0 || ret > 30) errs.expectedReturnPct = "Enter a return between 0% and 30%.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const addGoal = () => {
    if (!validate()) return;
    setGoals((prev) => [
      ...prev,
      {
        id: `goal-${Date.now()}`,
        name: form.name.trim(),
        icon: form.icon,
        targetAmount: Number(form.targetAmount),
        currentSavings: Number(form.currentSavings || 0),
        targetDate: form.targetDate,
        expectedReturnPct: Number(form.expectedReturnPct),
      },
    ]);
    showToast("Goal created");
    setModalOpen(false);
    setForm({ name: "", icon: "target", targetAmount: "", currentSavings: "", targetDate: nextYearISO(), expectedReturnPct: "10" });
    setErrors({});
  };

  const removeGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    showToast("Goal removed");
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Financial Goals</h1>
          <p>Set targets and see exactly how much you need to invest monthly to reach them.</p>
        </div>
        <div className="page-header-actions">
          <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>
            Add Goal
          </Button>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Quick Start</h2>
        </div>
        <div className="goal-template-row">
          {GOAL_TEMPLATES.map((t) => {
            const Icon = ICONS[t.icon] || Target;
            return (
              <button key={t.name} className="goal-template" onClick={() => openTemplate(t)}>
                <Icon size={16} />
                {t.name}
              </button>
            );
          })}
        </div>
      </div>

      {goals.length === 0 ? (
        <EmptyState icon={Target} title="No goals yet" description="Add a goal to start planning toward it." />
      ) : (
        <div className="grid-cards">
          {goals.map((goal) => {
            const Icon = ICONS[goal.icon] || Target;
            const progress = calculateGoalProgress(goal);
            return (
              <div key={goal.id} className="goal-card">
                <div className="goal-card-top">
                  <div className="goal-card-icon">
                    <Icon size={18} />
                  </div>
                  <div className="goal-card-title">
                    <span>{goal.name}</span>
                    <span className="text-muted" style={{ fontSize: 11.5 }}>Target: {formatDate(goal.targetDate)}</span>
                  </div>
                  <button className="goal-remove" onClick={() => removeGoal(goal.id)} aria-label="Remove goal">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="goal-progress">
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progress.completionPct}%` }} />
                  </div>
                  <span className="goal-progress-pct">{progress.completionPct.toFixed(0)}%</span>
                </div>

                <div className="goal-stats">
                  <div>
                    <span className="stat-label">Saved</span>
                    <span className="stat-value">{formatCurrency(goal.currentSavings, { compact: true })}</span>
                  </div>
                  <div>
                    <span className="stat-label">Target</span>
                    <span className="stat-value">{formatCurrency(goal.targetAmount, { compact: true })}</span>
                  </div>
                  <div>
                    <span className="stat-label">Remaining</span>
                    <span className="stat-value">{formatCurrency(progress.remainingAmount, { compact: true })}</span>
                  </div>
                </div>

                <div className="goal-required">
                  Required monthly SIP: <strong>{formatCurrency(progress.requiredMonthlyInvestment, { decimals: 0 })}</strong> at {goal.expectedReturnPct}% expected return
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Goal"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={addGoal}>
              Create Goal
            </Button>
          </>
        }
      >
        <div className="form-group">
          <label>Goal Name</label>
          <input className={errors.name ? "input error" : "input"} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {errors.name && <div className="field-error">{errors.name}</div>}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Target Amount (₹)</label>
            <input className={errors.targetAmount ? "input error" : "input"} type="number" min="0" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} />
            {errors.targetAmount && <div className="field-error">{errors.targetAmount}</div>}
          </div>
          <div className="form-group">
            <label>Current Savings (₹)</label>
            <input className={errors.currentSavings ? "input error" : "input"} type="number" min="0" value={form.currentSavings} onChange={(e) => setForm({ ...form, currentSavings: e.target.value })} />
            {errors.currentSavings && <div className="field-error">{errors.currentSavings}</div>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Target Date</label>
            <input className={errors.targetDate ? "input error" : "input"} type="date" min={todayISO()} value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
            {errors.targetDate && <div className="field-error">{errors.targetDate}</div>}
          </div>
          <div className="form-group">
            <label>Expected Return (% p.a.)</label>
            <input className={errors.expectedReturnPct ? "input error" : "input"} type="number" min="0" max="30" value={form.expectedReturnPct} onChange={(e) => setForm({ ...form, expectedReturnPct: e.target.value })} />
            {errors.expectedReturnPct && <div className="field-error">{errors.expectedReturnPct}</div>}
          </div>
        </div>
      </Modal>
    </div>
  );
}
