import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Check } from "lucide-react";
import { loadState, saveState, STORAGE_KEYS } from "../utils/storage";
import { useToast } from "../context/ToastContext";
import Button from "../components/Button";
import "./Profile.css";

const DEFAULT_PROFILE = {
  name: "Alex Investor",
  email: "thamizharasan@adraproductstudio.org",
  experience: "Intermediate",
  riskProfile: "Growth",
  horizon: "5-10 years",
  monthlySip: 10000,
};

const EXPERIENCE_OPTIONS = ["Beginner", "Intermediate", "Experienced"];
const RISK_OPTIONS = ["Conservative", "Moderate", "Growth", "Aggressive"];
const HORIZON_OPTIONS = ["< 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"];

export default function Profile() {
  const [profile, setProfile] = useState(() => loadState(STORAGE_KEYS.profile, DEFAULT_PROFILE));
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();

  useEffect(() => {
    saveState(STORAGE_KEYS.profile, profile);
  }, [profile]);

  const startEdit = () => {
    setDraft(profile);
    setErrors({});
    setEditing(true);
  };

  const save = () => {
    const errs = {};
    if (!draft.name.trim()) errs.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) errs.email = "Enter a valid email address.";
    if (Number(draft.monthlySip) < 0) errs.monthlySip = "Monthly SIP cannot be negative.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setProfile({ ...draft, monthlySip: Number(draft.monthlySip) });
    setEditing(false);
    showToast("Profile updated");
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p>Your investor profile — used to personalize recommendations across InvestSphere.</p>
        </div>
        <div className="page-header-actions">
          {!editing ? (
            <Button variant="secondary" icon={Pencil} onClick={startEdit}>
              Edit Profile
            </Button>
          ) : (
            <Button variant="primary" icon={Check} onClick={save}>
              Save Changes
            </Button>
          )}
        </div>
      </div>

      <div className="panel profile-panel">
        <div className="profile-avatar-row">
          <div className="profile-avatar">{profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}</div>
          <div>
            <div className="profile-name">{profile.name}</div>
            <div className="profile-email text-muted">{profile.email}</div>
          </div>
        </div>

        <div className="divider" />

        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            {editing ? (
              <>
                <input className={errors.name ? "input error" : "input"} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                {errors.name && <div className="field-error">{errors.name}</div>}
              </>
            ) : (
              <div className="profile-value">{profile.name}</div>
            )}
          </div>
          <div className="form-group">
            <label>Email</label>
            {editing ? (
              <>
                <input className={errors.email ? "input error" : "input"} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
                {errors.email && <div className="field-error">{errors.email}</div>}
              </>
            ) : (
              <div className="profile-value">{profile.email}</div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Investment Experience</label>
            {editing ? (
              <select className="select" value={draft.experience} onChange={(e) => setDraft({ ...draft, experience: e.target.value })}>
                {EXPERIENCE_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <div className="profile-value">{profile.experience}</div>
            )}
          </div>
          <div className="form-group">
            <label>Risk Profile</label>
            {editing ? (
              <select className="select" value={draft.riskProfile} onChange={(e) => setDraft({ ...draft, riskProfile: e.target.value })}>
                {RISK_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <div className="profile-value">
                {profile.riskProfile}{" "}
                <Link to="/risk-assessment" className="link" style={{ fontSize: 11.5, marginLeft: 6 }}>
                  Retake assessment
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Investment Horizon</label>
            {editing ? (
              <select className="select" value={draft.horizon} onChange={(e) => setDraft({ ...draft, horizon: e.target.value })}>
                {HORIZON_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <div className="profile-value">{profile.horizon}</div>
            )}
          </div>
          <div className="form-group">
            <label>Monthly SIP Commitment (₹)</label>
            {editing ? (
              <>
                <input className={errors.monthlySip ? "input error" : "input"} type="number" min="0" value={draft.monthlySip} onChange={(e) => setDraft({ ...draft, monthlySip: e.target.value })} />
                {errors.monthlySip && <div className="field-error">{errors.monthlySip}</div>}
              </>
            ) : (
              <div className="profile-value">₹{profile.monthlySip.toLocaleString("en-IN")}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
