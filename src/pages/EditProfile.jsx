import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../components/Toast.jsx';
import SkillPicker from '../components/SkillPicker.jsx';
import { AVAILABILITY_OPTIONS } from '../data/mockData.js';
import { IconChevronLeft, IconCheck } from '../components/Icons.jsx';

export default function EditProfile() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, updateProfile } = useApp();
  const [form, setForm] = useState({
    name: user.name,
    grade: user.grade,
    school: user.school,
    bio: user.bio || '',
    offeredSkills: [...user.offeredSkills],
    neededSkills: [...user.neededSkills],
    availability: [...(user.availability || [])],
  });
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const toggleAvail = (opt) =>
    set({
      availability: form.availability.includes(opt)
        ? form.availability.filter((a) => a !== opt)
        : [...form.availability, opt],
    });

  const save = () => {
    updateProfile(form);
    toast('Profile updated');
    navigate('/profile');
  };

  return (
    <div className="screen no-nav fade-in">
      <div className="between" style={{ marginBottom: 14 }}>
        <button className="back-btn" onClick={() => navigate('/profile')}>
          <IconChevronLeft size={18} /> Cancel
        </button>
        <button className="link-btn" onClick={save}>Save</button>
      </div>
      <div className="page-head"><h1>Edit profile</h1></div>

      <div className="field">
        <label>Full name</label>
        <input className="input" value={form.name} onChange={(e) => set({ name: e.target.value })} />
      </div>
      <div className="row" style={{ alignItems: 'flex-start', gap: 12 }}>
        <div className="field" style={{ flex: 1 }}>
          <label>Grade</label>
          <input className="input" value={form.grade} onChange={(e) => set({ grade: e.target.value })} />
        </div>
        <div className="field" style={{ flex: 1.4 }}>
          <label>School</label>
          <input className="input" value={form.school} onChange={(e) => set({ school: e.target.value })} />
        </div>
      </div>
      <div className="field">
        <label>Bio</label>
        <textarea className="textarea" value={form.bio} onChange={(e) => set({ bio: e.target.value })} />
      </div>

      <div className="divider" />
      <SkillPicker
        label="Skills I offer"
        value={form.offeredSkills}
        onChange={(v) => set({ offeredSkills: v })}
        tagClass="tag"
      />
      <SkillPicker
        label="I need help with"
        value={form.neededSkills}
        onChange={(v) => set({ neededSkills: v })}
        tagClass="tag outline"
      />

      <div className="field">
        <label>Availability</label>
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

      <button className="btn block lg" style={{ marginTop: 18 }} onClick={save}>Save changes</button>
    </div>
  );
}
