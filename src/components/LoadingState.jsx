import "./LoadingState.css";

export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="loading-state">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-sub" />
      <div className="skeleton-block" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="skeleton-row">
      <div className="skeleton-line" style={{ width: "30%" }} />
      <div className="skeleton-line" style={{ width: "15%" }} />
      <div className="skeleton-line" style={{ width: "15%" }} />
    </div>
  );
}
