import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import SkillPicker from '../components/SkillPicker.jsx';
import { AVAILABILITY_OPTIONS } from '../data/mockData.js';
import { IconChevronLeft, IconCheck } from '../components/Icons.jsx';

const STEP_LABELS = ['General info', 'Your skills', 'Availability'];

export default function Signup() {
  const navigate = useNavigate();
  const { completeSignup } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    grade: '',
    school: '',
    bio: '',
    offeredSkills: [],
    neededSkills: [],
    availability: [],
  });

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const toggleAvail = (opt) =>
    set({
      availability: form.availability.includes(opt)
        ? form.availability.filter((a) => a !== opt)
        : [...form.availability, opt],
    });

  const canNext =
    (step === 0 && form.name.trim() && form.grade.trim() && form.school.trim()) ||
    (step === 1 && form.offeredSkills.length > 0 && form.neededSkills.length > 0) ||
    step === 2;

  const next = () => {
    if (step < 2) return setStep(step + 1);
    completeSignup(form);
    navigate('/home');
  };
  const back = () => (step === 0 ? navigate('/') : setStep(step - 1));

  return (
    <div className="screen no-nav">
      <button className="back-btn" onClick={back}>
        <IconChevronLeft size={18} /> Back
      </button>

      <div className="page-head" style={{ marginTop: 14 }}>
        <h1>Create your profile</h1>
        <div className="progress" style={{ margin: '14px 0 8px' }}>
          <i style={{ width: `${((step + 1) / 3) * 100}%` }} />
        </div>
        <p className="muted tiny" style={{ fontWeight: 700 }}>
          Step {step + 1} of 3 · {STEP_LABELS[step]}
        </p>
      </div>

      {step === 0 && (
        <div className="fade-in">
          <div className="field">
            <label>Full name</label>
            <input
              className="input"
              placeholder="e.g. Sarah Jenkins"
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
            />
          </div>
          <div className="row" style={{ alignItems: 'flex-start', gap: 12 }}>
            <div className="field" style={{ flex: 1 }}>
              <label>Grade</label>
              <input
                className="input"
                placeholder="e.g. 11th"
                value={form.grade}
                onChange={(e) => set({ grade: e.target.value })}
              />
            </div>
            <div className="field" style={{ flex: 1.4 }}>
              <label>School</label>
              <input
                className="input"
                placeholder="e.g. Lincoln High"
                value={form.school}
                onChange={(e) => set({ school: e.target.value })}
              />
            </div>
          </div>
          <div className="field">
            <label>Short bio <span className="muted" style={{ fontWeight: 500 }}>(optional)</span></label>
            <textarea
              className="textarea"
              placeholder="What are you into? How do you like to help?"
              value={form.bio}
              onChange={(e) => set({ bio: e.target.value })}
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="fade-in">
          <SkillPicker
            label="Skills I'm good at"
            hint="These are what you can teach. Add at least one."
            value={form.offeredSkills}
            onChange={(v) => set({ offeredSkills: v })}
            tagClass="tag"
          />
          <div className="divider" />
          <SkillPicker
            label="Skills I need help with"
            hint="We'll match you with peers strong in these."
            value={form.neededSkills}
            onChange={(v) => set({ neededSkills: v })}
            tagClass="tag outline"
          />
        </div>
      )}

      {step === 2 && (
        <div className="fade-in">
          <div className="field">
            <label>When are you usually free to swap?</label>
            <div className="wrap" style={{ marginTop: 4 }}>
              {AVAILABILITY_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  className={`tag pick ${form.availability.includes(opt) ? 'on' : 'soft'}`}
                  onClick={() => toggleAvail(opt)}
                >
                  {form.availability.includes(opt) && <IconCheck size={13} />} {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="card pad-lg" style={{ marginTop: 18 }}>
            <h3 style={{ fontSize: 16, marginBottom: 10 }}>You're all set, {form.name.split(' ')[0] || 'friend'} 🎉</h3>
            <p className="muted tiny" style={{ marginBottom: 12 }}>
              Here's what your matches will see:
            </p>
            <p className="tiny" style={{ fontWeight: 700 }}>Can teach</p>
            <div className="wrap" style={{ margin: '6px 0 12px' }}>
              {form.offeredSkills.map((s) => <span className="tag" key={s}>{s}</span>)}
            </div>
            <p className="tiny" style={{ fontWeight: 700 }}>Wants to learn</p>
            <div className="wrap" style={{ marginTop: 6 }}>
              {form.neededSkills.map((s) => <span className="tag outline" key={s}>{s}</span>)}
            </div>
          </div>
        </div>
      )}

      <button className="btn block lg" style={{ marginTop: 22 }} disabled={!canNext} onClick={next}>
        {step < 2 ? 'Next step' : 'Enter SkillSwap'}
      </button>
    </div>
  );
}
