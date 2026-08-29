import { useState } from "react";

const emptyForm = { title: "", description: "", dueDate: "" };

export default function MembershipForm({ onCreate, submitting }) {
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.dueDate) {
      setFormError("Member/plan name and a renewal date are required.");
      return;
    }
    setFormError("");
    const ok = await onCreate(form);
    if (ok) setForm(emptyForm);
  }

  return (
    <form className="membership-form" onSubmit={handleSubmit} aria-label="Add a new membership">
      <h2>Add Membership</h2>

      {formError && <p className="field-error" role="alert">{formError}</p>}

      <div className="field">
        <label htmlFor="title">Member name / plan</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Alina Gurung - Gold Plan"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="description">Notes / plan details</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Optional notes about this membership"
          rows={3}
        />
      </div>

      <div className="field">
        <label htmlFor="dueDate">Renewal due date</label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add Membership"}
      </button>
    </form>
  );
}
