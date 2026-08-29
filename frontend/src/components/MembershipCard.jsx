import { useState } from "react";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function MembershipCard({ membership, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: membership.title,
    description: membership.description || "",
    dueDate: membership.dueDate ? membership.dueDate.slice(0, 10) : "",
  });
  const [busy, setBusy] = useState(false);

  function handleDraftChange(e) {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    setBusy(true);
    const ok = await onUpdate(membership._id, draft);
    setBusy(false);
    if (ok) setIsEditing(false);
  }

  async function handleToggleComplete() {
    setBusy(true);
    await onUpdate(membership._id, { isCompleted: !membership.isCompleted });
    setBusy(false);
  }

  async function handleDelete() {
    setBusy(true);
    await onDelete(membership._id);
    // No need to reset busy on success - card is removed by the parent.
  }

  return (
    <div className={`card ${membership.isCompleted ? "card--completed" : ""}`}>
      {isEditing ? (
        <div className="card__edit-form">
          <label htmlFor={`title-${membership._id}`}>Member name / plan</label>
          <input
            id={`title-${membership._id}`}
            name="title"
            value={draft.title}
            onChange={handleDraftChange}
          />

          <label htmlFor={`description-${membership._id}`}>Notes</label>
          <textarea
            id={`description-${membership._id}`}
            name="description"
            value={draft.description}
            onChange={handleDraftChange}
            rows={3}
          />

          <label htmlFor={`dueDate-${membership._id}`}>Renewal due date</label>
          <input
            id={`dueDate-${membership._id}`}
            name="dueDate"
            type="date"
            value={draft.dueDate}
            onChange={handleDraftChange}
          />

          <div className="card__actions">
            <button type="button" onClick={handleSave} disabled={busy}>
              {busy ? "Saving..." : "Save"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)} disabled={busy}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="card__title">{membership.title}</h3>
          {membership.description && <p className="card__description">{membership.description}</p>}
          <p className="card__due-date">Renewal due: {formatDate(membership.dueDate)}</p>
          <p className="card__status">
            Status: <strong>{membership.isCompleted ? "Renewed" : "Pending renewal"}</strong>
          </p>

          <div className="card__actions">
            <label className="card__toggle">
              <input
                type="checkbox"
                checked={membership.isCompleted}
                onChange={handleToggleComplete}
                disabled={busy}
              />
              Mark renewed
            </label>
            <button type="button" onClick={() => setIsEditing(true)} disabled={busy}>
              Edit
            </button>
            <button type="button" className="btn-danger" onClick={handleDelete} disabled={busy}>
              {busy ? "Deleting..." : "Delete"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
