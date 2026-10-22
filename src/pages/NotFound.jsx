import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";

export default function NotFound() {
  return (
    <div className="container">
      <div style={{ maxWidth: 480, margin: "60px auto" }}>
        <EmptyState
          icon={Compass}
          title="Page not found"
          description="The page you're looking for doesn't exist or has moved."
          action={
            <Link to="/dashboard">
              <Button variant="primary">Back to Explore</Button>
            </Link>
          }
        />
      </div>
    </div>
  );
}
