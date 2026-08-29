import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import MembershipForm from "../components/MembershipForm";
import MembershipCard from "../components/MembershipCard";
import SkeletonCard from "../components/SkeletonCard";
import ErrorBanner from "../components/ErrorBanner";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchMemberships = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/memberships");
      setMemberships(data.memberships);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load memberships. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemberships();
  }, [fetchMemberships]);

  async function handleCreate(form) {
    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post("/memberships", form);
      setMemberships((prev) => [...prev, data.membership].sort(
        (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
      ));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Could not add that membership.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(id, updates) {
    setError("");
    try {
      const { data } = await api.patch(`/memberships/${id}`, updates);
      setMemberships((prev) => prev.map((m) => (m._id === id ? data.membership : m)));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Could not save those changes.");
      return false;
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      const res = await api.delete(`/memberships/${id}`);
      // Only remove the card locally once the server confirms deletion.
      if (res.status === 200) {
        setMemberships((prev) => prev.filter((m) => m._id !== id));
      }
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete that membership.");
      return false;
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>FitTrack Membership Dashboard</h1>
        <div className="dashboard__user">
          <span>Signed in as {user?.name}</span>
          <button type="button" className="btn-secondary" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <ErrorBanner message={error} onDismiss={() => setError("")} />

      <MembershipForm onCreate={handleCreate} submitting={submitting} />

      <section aria-label="Membership records" className="card-grid">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : memberships.length === 0 ? (
          <p className="empty-state">No memberships yet - add your first one above.</p>
        ) : (
          memberships.map((membership) => (
            <MembershipCard
              key={membership._id}
              membership={membership}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        )}
      </section>
    </div>
  );
}
