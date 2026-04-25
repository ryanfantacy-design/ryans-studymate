import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "@/App.css";
import axios from "axios";
import {
  House,
  BookOpen,
  Timer,
  Alarm,
  ChartBar,
  ClockCounterClockwise,
  Gear,
  Plus,
  Trash,
  Play,
  Pause,
  ArrowClockwise,
  DownloadSimple,
  UploadSimple,
  MusicNote,
  Flame,
  Target,
  PencilSimple,
  Check,
  X,
} from "@phosphor-icons/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ACCENTS = ["#FFD600", "#00E676", "#40C4FF", "#B388FF", "#FF5252", "#FF9100"];

// ============ Helpers ============
const fmtMins = (m) => {
  if (!m && m !== 0) return "0 min";
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h && r) return `${h} hr ${r} min`;
  if (h) return `${h} hr`;
  return `${r} min`;
};

const todayStr = () => new Date().toISOString().slice(0, 10);

// ============ Duration Chip (BLACK text on bright bg per user request) ============
const DurationChip = ({ minutes, color = "#FFD600", testid }) => (
  <span
    data-testid={testid}
    className="inline-flex items-center px-3 py-1 rounded-full font-bold text-black"
    style={{ background: color, fontFamily: "JetBrains Mono, monospace" }}
  >
    {fmtMins(minutes)}
  </span>
);

// ============ Sidebar ============
const Sidebar = ({ active, onChange }) => {
  const items = [
    { id: "today", label: "Today", icon: House },
    { id: "subjects", label: "Subjects", icon: BookOpen },
    { id: "pomodoro", label: "Pomodoro", icon: Timer },
    { id: "schedule", label: "Schedule", icon: Alarm },
    { id: "stats", label: "Stats", icon: ChartBar },
    { id: "records", label: "Records", icon: ClockCounterClockwise },
    { id: "settings", label: "Settings", icon: Gear },
  ];
  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 bg-[#0A0A0F] border-r border-[#272730] p-6 flex flex-col">
      <div className="mb-10">
        <h1
          className="text-2xl font-extrabold tracking-tight text-white leading-none"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          Studi<span className="text-[#FFD600]">.</span>
        </h1>
        <p className="text-xs text-[#71717A] mt-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
          daily study tracker
        </p>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              data-testid={`nav-${id}`}
              onClick={() => onChange(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                isActive
                  ? "bg-[#FFD600] text-black font-bold"
                  : "text-[#A0A0AB] hover:bg-[#1C1C26] hover:text-white"
              }`}
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              <Icon size={20} weight={isActive ? "fill" : "regular"} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
      <div className="mt-auto text-[10px] text-[#52525B] tracking-wider uppercase">
        focus · log · grow
      </div>
    </aside>
  );
};

// ============ Today View ============
const TodayView = ({ subjects, todayStats, streak, onLogged, settings }) => {
  const [subjectId, setSubjectId] = useState("");
  const [duration, setDuration] = useState(25);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!subjectId && subjects.length) setSubjectId(subjects[0].id);
  }, [subjects, subjectId]);

  const goal = settings?.daily_goal_minutes || 240;
  const total = todayStats?.total_minutes || 0;
  const pct = Math.min(100, Math.round((total / goal) * 100));

  const submit = async (e) => {
    e.preventDefault();
    if (!subjectId || duration <= 0) return;
    setSubmitting(true);
    try {
      await axios.post(`${API}/sessions`, {
        subject_id: subjectId,
        duration_minutes: Number(duration),
        notes,
        date: todayStr(),
      });
      setNotes("");
      onLogged();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h2
          className="text-4xl font-extrabold tracking-tight text-white"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          Today
        </h2>
        <span className="text-[#71717A] text-sm" style={{ fontFamily: "DM Sans" }}>
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Goal card */}
        <div
          data-testid="card-daily-goal"
          className="lg:col-span-2 bg-[#13131A] border border-[#272730] rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[#A0A0AB] text-sm" style={{ fontFamily: "DM Sans" }}>
              <Target size={18} weight="duotone" /> Daily Goal
            </div>
            <DurationChip minutes={goal} color="#40C4FF" testid="goal-chip" />
          </div>
          <div className="flex items-end gap-3 mb-4">
            <div
              className="text-6xl font-extrabold text-white leading-none"
              style={{ fontFamily: "Bricolage Grotesque" }}
            >
              {pct}%
            </div>
            <div className="pb-1.5">
              <DurationChip minutes={total} color="#FFD600" testid="today-total-chip" />
              <div className="text-xs text-[#71717A] mt-1">studied today</div>
            </div>
          </div>
          <div className="h-3 w-full bg-[#0A0A0F] rounded-full overflow-hidden">
            <div
              data-testid="goal-progress-bar"
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg,#FFD600,#00E676)",
              }}
            />
          </div>
        </div>

        {/* Streak card */}
        <div
          data-testid="card-streak"
          className="bg-[#13131A] border border-[#272730] rounded-2xl p-6 flex flex-col justify-between"
        >
          <div className="flex items-center gap-2 text-[#A0A0AB] text-sm">
            <Flame size={18} weight="fill" color="#FF5252" /> Streak
          </div>
          <div>
            <div
              className="text-6xl font-extrabold text-white"
              style={{ fontFamily: "Bricolage Grotesque" }}
            >
              {streak?.current || 0}
              <span className="text-2xl text-[#71717A] font-bold"> days</span>
            </div>
            <div className="mt-2 flex gap-2 flex-wrap">
              <span className="text-xs px-2 py-1 rounded-full bg-[#0A0A0F] border border-[#272730] text-[#A0A0AB]">
                longest {streak?.longest || 0}d
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-[#0A0A0F] border border-[#272730] text-[#A0A0AB]">
                active {streak?.active_days || 0}d
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Log session */}
      <form
        onSubmit={submit}
        data-testid="form-log-session"
        className="bg-[#13131A] border border-[#272730] rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "Bricolage Grotesque" }}>
          Log a study session
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            data-testid="log-subject-select"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="bg-[#0A0A0F] border border-[#272730] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
          >
            {subjects.length === 0 && <option value="">No subjects — add one first</option>}
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            data-testid="log-duration-input"
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Minutes"
            className="bg-[#0A0A0F] border border-[#272730] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
          />
          <input
            data-testid="log-notes-input"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="bg-[#0A0A0F] border border-[#272730] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#FFD600] md:col-span-1"
          />
          <button
            data-testid="log-submit-btn"
            type="submit"
            disabled={submitting || !subjectId}
            className="bg-[#FFD600] hover:bg-[#FFE74D] disabled:opacity-50 text-black font-bold rounded-xl px-4 py-2.5 transition-all hover:-translate-y-0.5"
          >
            {submitting ? "Saving..." : "Log Session"}
          </button>
        </div>
      </form>

      {/* By subject today */}
      {todayStats && Object.keys(todayStats.by_subject || {}).length > 0 && (
        <div className="bg-[#13131A] border border-[#272730] rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "Bricolage Grotesque" }}>
            Today by subject
          </h3>
          <div className="flex flex-wrap gap-3" data-testid="today-by-subject">
            {Object.entries(todayStats.by_subject).map(([name, mins], idx) => (
              <div
                key={name}
                className="flex items-center gap-2 bg-[#0A0A0F] border border-[#272730] rounded-full px-3 py-1.5"
              >
                <span className="text-sm text-white">{name}</span>
                <DurationChip minutes={mins} color={ACCENTS[idx % ACCENTS.length]} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============ Subjects View ============
const SubjectsView = ({ subjects, refresh }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState(ACCENTS[0]);
  const [target, setTarget] = useState(60);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editTarget, setEditTarget] = useState(60);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await axios.post(`${API}/subjects`, {
      name: name.trim(),
      color,
      target_minutes_daily: Number(target),
    });
    setName("");
    setTarget(60);
    refresh();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this subject? Past sessions will be kept.")) return;
    await axios.delete(`${API}/subjects/${id}`);
    refresh();
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setEditName(s.name);
    setEditTarget(s.target_minutes_daily);
  };

  const saveEdit = async (id) => {
    await axios.put(`${API}/subjects/${id}`, {
      name: editName,
      target_minutes_daily: Number(editTarget),
    });
    setEditingId(null);
    refresh();
  };

  return (
    <div className="space-y-6">
      <h2
        className="text-4xl font-extrabold tracking-tight text-white"
        style={{ fontFamily: "Bricolage Grotesque" }}
      >
        Subjects
      </h2>

      <form
        onSubmit={add}
        data-testid="form-add-subject"
        className="bg-[#13131A] border border-[#272730] rounded-2xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <input
            data-testid="subject-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Subject name (e.g. Mathematics)"
            className="md:col-span-5 bg-[#0A0A0F] border border-[#272730] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
          />
          <input
            data-testid="subject-target-input"
            type="number"
            min="1"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Daily target (min)"
            className="md:col-span-2 bg-[#0A0A0F] border border-[#272730] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
          />
          <div className="md:col-span-3 flex items-center gap-2 bg-[#0A0A0F] border border-[#272730] rounded-xl px-3 py-2">
            {ACCENTS.map((c) => (
              <button
                type="button"
                key={c}
                aria-label={`color-${c}`}
                onClick={() => setColor(c)}
                className={`h-6 w-6 rounded-full transition-transform ${
                  color === c ? "ring-2 ring-white scale-110" : ""
                }`}
                style={{ background: c }}
              />
            ))}
          </div>
          <button
            data-testid="add-subject-btn"
            type="submit"
            className="md:col-span-2 bg-[#00E676] hover:bg-[#33EC92] text-black font-bold rounded-xl px-4 py-2.5 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Plus size={18} weight="bold" /> Add
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="subjects-list">
        {subjects.length === 0 && (
          <div className="md:col-span-2 text-center py-10 text-[#71717A]">
            No subjects yet. Add your first one above.
          </div>
        )}
        {subjects.map((s) => (
          <div
            key={s.id}
            className="bg-[#13131A] border border-[#272730] rounded-2xl p-5 flex items-center justify-between gap-4 group"
            style={{ borderLeft: `4px solid ${s.color}` }}
            data-testid={`subject-card-${s.id}`}
          >
            <div className="flex-1 min-w-0">
              {editingId === s.id ? (
                <div className="flex flex-col gap-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-[#0A0A0F] border border-[#272730] rounded-lg px-2 py-1 text-white text-sm"
                  />
                  <input
                    type="number"
                    value={editTarget}
                    onChange={(e) => setEditTarget(e.target.value)}
                    className="bg-[#0A0A0F] border border-[#272730] rounded-lg px-2 py-1 text-white text-sm w-32"
                  />
                </div>
              ) : (
                <>
                  <div className="text-lg font-bold text-white truncate" style={{ fontFamily: "Bricolage Grotesque" }}>
                    {s.name}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-[#A0A0AB]">
                    <span>Daily target</span>
                    <DurationChip minutes={s.target_minutes_daily} color={s.color} />
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {editingId === s.id ? (
                <>
                  <button
                    onClick={() => saveEdit(s.id)}
                    className="p-2 rounded-lg bg-[#00E676] text-black"
                    data-testid={`save-subject-${s.id}`}
                  >
                    <Check size={16} weight="bold" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-2 rounded-lg bg-[#272730] text-white">
                    <X size={16} weight="bold" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(s)}
                    className="p-2 rounded-lg bg-[#1C1C26] hover:bg-[#272730] text-[#A0A0AB] hover:text-white transition"
                    data-testid={`edit-subject-${s.id}`}
                  >
                    <PencilSimple size={16} />
                  </button>
                  <button
                    onClick={() => remove(s.id)}
                    className="p-2 rounded-lg bg-[#1C1C26] hover:bg-[#FF5252] text-[#A0A0AB] hover:text-white transition"
                    data-testid={`delete-subject-${s.id}`}
                  >
                    <Trash size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ Pomodoro View ============
const PomodoroView = ({ subjects, settings, onLogged }) => {
  const work = (settings?.pomodoro_work || 25) * 60;
  const brk = (settings?.pomodoro_break || 5) * 60;
  const [mode, setMode] = useState("work");
  const [remaining, setRemaining] = useState(work);
  const [running, setRunning] = useState(false);
  const [subjectId, setSubjectId] = useState("");
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (subjects.length && !subjectId) setSubjectId(subjects[0].id);
  }, [subjects, subjectId]);

  useEffect(() => {
    setRemaining(mode === "work" ? work : brk);
  }, [mode, work, brk]);

  const playBeep = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.3, ctx.currentTime);
      o.start();
      o.stop(ctx.currentTime + 0.6);
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            playBeep();
            // log completed work session
            if (mode === "work" && subjectId) {
              axios
                .post(`${API}/sessions`, {
                  subject_id: subjectId,
                  duration_minutes: Math.round(work / 60),
                  notes: "Pomodoro session",
                  date: todayStr(),
                })
                .then(() => onLogged && onLogged());
            }
            // auto-switch
            const next = mode === "work" ? "break" : "work";
            setMode(next);
            return next === "work" ? work : brk;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode, work, brk, subjectId, playBeep, onLogged]);

  const total = mode === "work" ? work : brk;
  const pct = ((total - remaining) / total) * 100;
  const min = Math.floor(remaining / 60);
  const sec = remaining % 60;
  const ringColor = mode === "work" ? "#00E676" : "#40C4FF";
  const RADIUS = 110;
  const CIRC = 2 * Math.PI * RADIUS;
  const dash = (pct / 100) * CIRC;

  return (
    <div className="space-y-6">
      <h2
        className="text-4xl font-extrabold tracking-tight text-white"
        style={{ fontFamily: "Bricolage Grotesque" }}
      >
        Pomodoro
      </h2>

      <div className="bg-[#13131A] border border-[#272730] rounded-2xl p-8 flex flex-col items-center">
        <div className="flex gap-2 mb-6">
          <button
            data-testid="pomo-mode-work"
            onClick={() => {
              setRunning(false);
              setMode("work");
            }}
            className={`px-4 py-2 rounded-full text-sm font-bold transition ${
              mode === "work" ? "bg-[#00E676] text-black" : "bg-[#0A0A0F] text-[#A0A0AB] border border-[#272730]"
            }`}
          >
            Work · {settings?.pomodoro_work || 25}m
          </button>
          <button
            data-testid="pomo-mode-break"
            onClick={() => {
              setRunning(false);
              setMode("break");
            }}
            className={`px-4 py-2 rounded-full text-sm font-bold transition ${
              mode === "break" ? "bg-[#40C4FF] text-black" : "bg-[#0A0A0F] text-[#A0A0AB] border border-[#272730]"
            }`}
          >
            Break · {settings?.pomodoro_break || 5}m
          </button>
        </div>

        <div className="relative" style={{ width: 260, height: 260 }}>
          <svg width="260" height="260" className="-rotate-90">
            <circle cx="130" cy="130" r={RADIUS} stroke="#272730" strokeWidth="10" fill="none" />
            <circle
              cx="130"
              cy="130"
              r={RADIUS}
              stroke={ringColor}
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${dash} ${CIRC}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.5s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              data-testid="pomo-time"
              className="text-6xl font-bold text-white tabular-nums"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {String(min).padStart(2, "0")}:{String(sec).padStart(2, "0")}
            </div>
            <div className="text-xs uppercase tracking-widest text-[#71717A] mt-2">{mode}</div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <select
            data-testid="pomo-subject-select"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="bg-[#0A0A0F] border border-[#272730] rounded-xl px-3 py-2 text-white text-sm"
          >
            {subjects.length === 0 && <option value="">Add subjects first</option>}
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            data-testid="pomo-toggle-btn"
            onClick={() => setRunning((r) => !r)}
            disabled={!subjectId && mode === "work"}
            className="bg-[#FFD600] hover:bg-[#FFE74D] disabled:opacity-50 text-black font-bold rounded-full px-6 py-3 flex items-center gap-2 hover:-translate-y-0.5 transition"
          >
            {running ? <Pause weight="fill" size={18} /> : <Play weight="fill" size={18} />}
            {running ? "Pause" : "Start"}
          </button>
          <button
            data-testid="pomo-reset-btn"
            onClick={() => {
              setRunning(false);
              setRemaining(total);
            }}
            className="bg-[#1C1C26] text-white rounded-full px-4 py-3"
          >
            <ArrowClockwise size={18} />
          </button>
        </div>
        <audio ref={audioRef} />
      </div>
    </div>
  );
};

// ============ Schedule View (alarms with custom music) ============
const SCHEDULE_KEY = "studi.schedule.alarms.v1";
const MUSIC_KEY = "studi.schedule.music.v1"; // {dataUrl, name}

const ScheduleView = () => {
  const [alarms, setAlarms] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SCHEDULE_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [music, setMusic] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(MUSIC_KEY) || "null");
    } catch {
      return null;
    }
  });
  const [now, setNow] = useState(new Date());
  const [label, setLabel] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const audioRef = useRef(null);
  const triggeredRef = useRef(new Set());

  useEffect(() => {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Trigger alarms at start/end times
  useEffect(() => {
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = now.getSeconds();
    const cur = `${hh}:${mm}`;
    const dayKey = now.toISOString().slice(0, 10);
    if (ss !== 0) return;
    alarms.forEach((a) => {
      if (a.startTime === cur) {
        const k = `${dayKey}-${a.id}-start`;
        if (!triggeredRef.current.has(k)) {
          triggeredRef.current.add(k);
          playAlarm();
          showNotification(`▶ ${a.label || "Study block"} starting`);
        }
      }
      if (a.endTime === cur) {
        const k = `${dayKey}-${a.id}-end`;
        if (!triggeredRef.current.has(k)) {
          triggeredRef.current.add(k);
          playAlarm();
          showNotification(`⏹ ${a.label || "Study block"} ended`);
        }
      }
    });
  }, [now, alarms]);

  const playAlarm = () => {
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      } catch (e) {
        // ignore
      }
    } else if (music?.dataUrl) {
      const a = new Audio(music.dataUrl);
      a.play().catch(() => {});
    } else {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        for (let i = 0; i < 3; i++) {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.frequency.value = 880;
          g.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.4);
          o.start(ctx.currentTime + i * 0.4);
          o.stop(ctx.currentTime + i * 0.4 + 0.3);
        }
      } catch (e) {
        // ignore
      }
    }
  };

  const showNotification = (msg) => {
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification("Studi", { body: msg });
      } catch (e) {
        // ignore
      }
    }
  };

  const requestNotif = () => {
    if ("Notification" in window) Notification.requestPermission();
  };

  const addAlarm = (e) => {
    e.preventDefault();
    setAlarms((a) => [
      ...a,
      { id: crypto.randomUUID(), label: label || "Study block", startTime, endTime },
    ]);
    setLabel("");
  };

  const removeAlarm = (id) => setAlarms((a) => a.filter((x) => x.id !== id));

  const onMusicUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const obj = { name: file.name, dataUrl: reader.result };
      setMusic(obj);
      localStorage.setItem(MUSIC_KEY, JSON.stringify(obj));
    };
    reader.readAsDataURL(file);
  };

  const clearMusic = () => {
    setMusic(null);
    localStorage.removeItem(MUSIC_KEY);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-4xl font-extrabold tracking-tight text-white" style={{ fontFamily: "Bricolage Grotesque" }}>
          Schedule
        </h2>
        <button
          onClick={requestNotif}
          className="text-xs px-3 py-1.5 rounded-full bg-[#1C1C26] border border-[#272730] text-[#A0A0AB] hover:text-white"
        >
          Enable browser notifications
        </button>
      </div>

      {/* Big clock */}
      <div className="bg-[#13131A] border border-[#272730] rounded-2xl p-8 text-center">
        <div className="text-xs tracking-widest text-[#71717A] uppercase mb-2">current time</div>
        <div
          data-testid="big-clock"
          className="text-7xl font-bold text-white tabular-nums"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
        </div>
        <div className="text-sm text-[#A0A0AB] mt-2">
          {now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Music */}
      <div className="bg-[#13131A] border border-[#272730] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
          <MusicNote size={20} weight="fill" color="#B388FF" /> Alarm Sound
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <label
            data-testid="upload-music-btn"
            className="cursor-pointer bg-[#B388FF] hover:bg-[#C5A6FF] text-black font-bold rounded-full px-4 py-2 inline-flex items-center gap-2 transition hover:-translate-y-0.5"
          >
            <UploadSimple size={16} weight="bold" /> Upload your music
            <input type="file" accept="audio/*" onChange={onMusicUpload} className="hidden" />
          </label>
          {music && (
            <>
              <span className="text-sm text-[#A0A0AB]">
                Loaded: <span className="text-white">{music.name}</span>
              </span>
              <audio ref={audioRef} src={music.dataUrl} preload="auto" />
              <button
                onClick={() => audioRef.current && audioRef.current.play()}
                className="text-xs px-3 py-1.5 rounded-full bg-[#1C1C26] border border-[#272730] text-white"
                data-testid="preview-music-btn"
              >
                Preview
              </button>
              <button
                onClick={clearMusic}
                className="text-xs px-3 py-1.5 rounded-full bg-[#1C1C26] border border-[#272730] text-[#FF5252]"
              >
                Remove
              </button>
            </>
          )}
          {!music && <span className="text-sm text-[#71717A]">Default beep will be used.</span>}
        </div>
      </div>

      {/* Add alarm */}
      <form onSubmit={addAlarm} data-testid="form-add-alarm" className="bg-[#13131A] border border-[#272730] rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <input
            data-testid="alarm-label-input"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (e.g. Math block)"
            className="md:col-span-5 bg-[#0A0A0F] border border-[#272730] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#B388FF]"
          />
          <input
            data-testid="alarm-start-input"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="md:col-span-2 bg-[#0A0A0F] border border-[#272730] rounded-xl px-3 py-2.5 text-white"
          />
          <input
            data-testid="alarm-end-input"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="md:col-span-2 bg-[#0A0A0F] border border-[#272730] rounded-xl px-3 py-2.5 text-white"
          />
          <button
            type="submit"
            data-testid="add-alarm-btn"
            className="md:col-span-3 bg-[#B388FF] hover:bg-[#C5A6FF] text-black font-bold rounded-xl px-4 py-2.5 inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 transition"
          >
            <Plus size={18} weight="bold" /> Add alarm
          </button>
        </div>
      </form>

      {/* Alarms list */}
      <div className="space-y-3" data-testid="alarms-list">
        {alarms.length === 0 && (
          <div className="text-center text-[#71717A] py-8">
            No alarms yet. Schedule study blocks above.
          </div>
        )}
        {alarms.map((a) => (
          <div
            key={a.id}
            className="bg-[#13131A] border border-[#272730] rounded-2xl p-4 flex items-center justify-between gap-4"
            data-testid={`alarm-row-${a.id}`}
          >
            <div className="flex items-center gap-4 min-w-0">
              <Alarm size={28} weight="duotone" color="#B388FF" />
              <div className="min-w-0">
                <div className="font-bold text-white truncate" style={{ fontFamily: "DM Sans" }}>
                  {a.label}
                </div>
                <div className="text-xs text-[#A0A0AB] mt-0.5 flex items-center gap-2">
                  <span className="font-bold text-black bg-[#FFD600] px-2 py-0.5 rounded-full" style={{ fontFamily: "JetBrains Mono" }}>
                    {a.startTime}
                  </span>
                  <span>→</span>
                  <span className="font-bold text-black bg-[#FF5252] px-2 py-0.5 rounded-full" style={{ fontFamily: "JetBrains Mono" }}>
                    {a.endTime}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => removeAlarm(a.id)}
              className="p-2 rounded-lg bg-[#1C1C26] hover:bg-[#FF5252] text-[#A0A0AB] hover:text-white transition"
              data-testid={`delete-alarm-${a.id}`}
            >
              <Trash size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ Stats View ============
const StatsView = ({ weekly, streak, todayStats }) => {
  const data = useMemo(
    () => (weekly?.days || []).map((d) => ({ ...d, hours: +(d.minutes / 60).toFixed(2) })),
    [weekly]
  );
  const totalWeek = data.reduce((a, b) => a + b.minutes, 0);
  const avg = data.length ? Math.round(totalWeek / 7) : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-extrabold tracking-tight text-white" style={{ fontFamily: "Bricolage Grotesque" }}>
        Statistics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="This week" value={fmtMins(totalWeek)} color="#FFD600" testid="stat-week" />
        <StatCard label="Daily avg" value={fmtMins(avg)} color="#00E676" testid="stat-avg" />
        <StatCard
          label="Current streak"
          value={`${streak?.current || 0} days`}
          color="#FF5252"
          testid="stat-streak"
        />
      </div>

      <div className="bg-[#13131A] border border-[#272730] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "Bricolage Grotesque" }}>
          Weekly Activity (minutes)
        </h3>
        <div style={{ width: "100%", height: 320 }} data-testid="weekly-chart">
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#272730" vertical={false} />
              <XAxis dataKey="label" stroke="#A0A0AB" tickLine={false} axisLine={false} />
              <YAxis stroke="#A0A0AB" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#0A0A0F",
                  border: "1px solid #272730",
                  borderRadius: 12,
                  color: "#fff",
                }}
                labelStyle={{ color: "#FFD600" }}
                formatter={(v) => [`${v} min`, "Studied"]}
              />
              <Bar dataKey="minutes" fill="#FFD600" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {todayStats && (
        <div className="bg-[#13131A] border border-[#272730] rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "Bricolage Grotesque" }}>
            Today snapshot
          </h3>
          <div className="flex flex-wrap gap-3 items-center">
            <DurationChip minutes={todayStats.total_minutes} color="#FFD600" />
            <span className="text-[#A0A0AB] text-sm">across {todayStats.sessions_count} sessions</span>
            <span className="text-xs px-2 py-1 rounded-full bg-[#0A0A0F] border border-[#272730] text-[#A0A0AB]">
              goal {todayStats.goal_minutes} min
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color, testid }) => (
  <div className="bg-[#13131A] border border-[#272730] rounded-2xl p-5" data-testid={testid}>
    <div className="text-xs uppercase tracking-widest text-[#71717A]">{label}</div>
    <div
      className="mt-2 inline-block text-2xl font-bold text-black px-3 py-1 rounded-full"
      style={{ background: color, fontFamily: "JetBrains Mono" }}
    >
      {value}
    </div>
  </div>
);

// ============ Records View ============
const RecordsView = ({ refresh }) => {
  const [items, setItems] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (from) params.date_from = from;
      if (to) params.date_to = to;
      const r = await axios.get(`${API}/sessions`, { params });
      setItems(r.data);
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id) => {
    if (!window.confirm("Delete this session?")) return;
    await axios.delete(`${API}/sessions/${id}`);
    load();
    refresh();
  };

  const totalMins = items.reduce((a, b) => a + b.duration_minutes, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-extrabold tracking-tight text-white" style={{ fontFamily: "Bricolage Grotesque" }}>
        Records
      </h2>

      <div className="bg-[#13131A] border border-[#272730] rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <label className="text-sm text-[#A0A0AB]">From</label>
        <input
          data-testid="records-from"
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="bg-[#0A0A0F] border border-[#272730] rounded-lg px-2 py-1.5 text-white text-sm"
        />
        <label className="text-sm text-[#A0A0AB]">To</label>
        <input
          data-testid="records-to"
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="bg-[#0A0A0F] border border-[#272730] rounded-lg px-2 py-1.5 text-white text-sm"
        />
        <button
          onClick={() => {
            setFrom("");
            setTo("");
          }}
          className="text-xs px-3 py-1.5 rounded-full bg-[#1C1C26] border border-[#272730] text-[#A0A0AB] hover:text-white"
        >
          Clear
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-[#71717A]">{items.length} sessions</span>
          <DurationChip minutes={totalMins} color="#00E676" testid="records-total-chip" />
        </div>
      </div>

      <div className="bg-[#13131A] border border-[#272730] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-4 py-3 text-xs uppercase tracking-widest text-[#71717A] border-b border-[#272730]">
          <div className="col-span-2">Date</div>
          <div className="col-span-3">Subject</div>
          <div className="col-span-2">Duration</div>
          <div className="col-span-4">Notes</div>
          <div className="col-span-1 text-right">·</div>
        </div>
        <div className="max-h-[55vh] overflow-y-auto" data-testid="records-list">
          {loading && <div className="p-6 text-center text-[#71717A]">Loading…</div>}
          {!loading && items.length === 0 && (
            <div className="p-6 text-center text-[#71717A]">No sessions in this range.</div>
          )}
          {items.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-[#1C1C26] hover:bg-[#1C1C26]/50 items-center"
              data-testid={`record-row-${s.id}`}
            >
              <div className="col-span-2 text-sm text-white" style={{ fontFamily: "JetBrains Mono" }}>
                {s.date}
              </div>
              <div className="col-span-3 text-sm text-white truncate">{s.subject_name}</div>
              <div className="col-span-2">
                <DurationChip minutes={s.duration_minutes} color="#FFD600" />
              </div>
              <div className="col-span-4 text-sm text-[#A0A0AB] truncate">{s.notes || "—"}</div>
              <div className="col-span-1 text-right">
                <button
                  onClick={() => remove(s.id)}
                  className="p-1.5 rounded-lg bg-[#1C1C26] hover:bg-[#FF5252] text-[#A0A0AB] hover:text-white"
                  data-testid={`delete-record-${s.id}`}
                >
                  <Trash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============ Settings View (export/import + goal/pomodoro) ============
const SettingsView = ({ settings, refresh }) => {
  const [goal, setGoal] = useState(settings?.daily_goal_minutes || 240);
  const [work, setWork] = useState(settings?.pomodoro_work || 25);
  const [brk, setBrk] = useState(settings?.pomodoro_break || 5);
  const [importBusy, setImportBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (settings) {
      setGoal(settings.daily_goal_minutes);
      setWork(settings.pomodoro_work);
      setBrk(settings.pomodoro_break);
    }
  }, [settings]);

  const save = async () => {
    await axios.put(`${API}/settings`, {
      daily_goal_minutes: Number(goal),
      pomodoro_work: Number(work),
      pomodoro_break: Number(brk),
    });
    setMsg("Saved!");
    setTimeout(() => setMsg(""), 1500);
    refresh();
  };

  const downloadFile = (filename, content, mime) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = async () => {
    const r = await axios.get(`${API}/export`);
    downloadFile(`studi-export-${todayStr()}.json`, JSON.stringify(r.data, null, 2), "application/json");
  };

  const exportCSV = async () => {
    const r = await axios.get(`${API}/export`);
    const rows = [["date", "subject_name", "duration_minutes", "notes", "started_at", "id", "subject_id"]];
    (r.data.sessions || []).forEach((s) => {
      rows.push([
        s.date,
        `"${(s.subject_name || "").replace(/"/g, '""')}"`,
        s.duration_minutes,
        `"${(s.notes || "").replace(/"/g, '""')}"`,
        s.started_at,
        s.id,
        s.subject_id,
      ]);
    });
    const csv = rows.map((r) => r.join(",")).join("\n");
    downloadFile(`studi-sessions-${todayStr()}.csv`, csv, "text/csv");
  };

  const onImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!window.confirm("Import will REPLACE all existing data. Continue?")) {
      e.target.value = "";
      return;
    }
    setImportBusy(true);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const r = await axios.post(`${API}/import?replace=true`, json);
      setMsg(`Imported ${r.data.subjects} subjects, ${r.data.sessions} sessions.`);
      refresh();
    } catch (err) {
      setMsg("Import failed: " + (err.message || "invalid JSON"));
    } finally {
      setImportBusy(false);
      e.target.value = "";
      setTimeout(() => setMsg(""), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-extrabold tracking-tight text-white" style={{ fontFamily: "Bricolage Grotesque" }}>
        Settings
      </h2>

      <div className="bg-[#13131A] border border-[#272730] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "Bricolage Grotesque" }}>
          Goals & Pomodoro
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Daily goal (minutes)">
            <input
              data-testid="setting-daily-goal"
              type="number"
              min="10"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-[#0A0A0F] border border-[#272730] rounded-xl px-3 py-2.5 text-white"
            />
          </Field>
          <Field label="Pomodoro work (minutes)">
            <input
              data-testid="setting-pomo-work"
              type="number"
              min="1"
              value={work}
              onChange={(e) => setWork(e.target.value)}
              className="w-full bg-[#0A0A0F] border border-[#272730] rounded-xl px-3 py-2.5 text-white"
            />
          </Field>
          <Field label="Pomodoro break (minutes)">
            <input
              data-testid="setting-pomo-break"
              type="number"
              min="1"
              value={brk}
              onChange={(e) => setBrk(e.target.value)}
              className="w-full bg-[#0A0A0F] border border-[#272730] rounded-xl px-3 py-2.5 text-white"
            />
          </Field>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            data-testid="settings-save-btn"
            onClick={save}
            className="bg-[#FFD600] hover:bg-[#FFE74D] text-black font-bold rounded-xl px-5 py-2.5 hover:-translate-y-0.5 transition"
          >
            Save
          </button>
          {msg && <span className="text-sm text-[#00E676]">{msg}</span>}
        </div>
      </div>

      <div className="bg-[#13131A] border border-[#272730] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "Bricolage Grotesque" }}>
          Data export & import
        </h3>
        <p className="text-sm text-[#A0A0AB] mb-4">
          Export your full data as editable JSON or sessions as CSV. Import a JSON file to restore (replaces all
          existing data).
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            data-testid="export-json-btn"
            onClick={exportJSON}
            className="bg-[#40C4FF] hover:bg-[#66D4FF] text-black font-bold rounded-full px-4 py-2 inline-flex items-center gap-2 hover:-translate-y-0.5 transition"
          >
            <DownloadSimple size={16} weight="bold" /> Export JSON
          </button>
          <button
            data-testid="export-csv-btn"
            onClick={exportCSV}
            className="bg-[#00E676] hover:bg-[#33EC92] text-black font-bold rounded-full px-4 py-2 inline-flex items-center gap-2 hover:-translate-y-0.5 transition"
          >
            <DownloadSimple size={16} weight="bold" /> Export CSV
          </button>
          <label
            data-testid="import-json-btn"
            className="cursor-pointer bg-[#FFD600] hover:bg-[#FFE74D] text-black font-bold rounded-full px-4 py-2 inline-flex items-center gap-2 hover:-translate-y-0.5 transition"
          >
            <UploadSimple size={16} weight="bold" /> {importBusy ? "Importing…" : "Import JSON"}
            <input type="file" accept="application/json" onChange={onImport} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="text-xs uppercase tracking-widest text-[#71717A]">{label}</span>
    <div className="mt-1.5">{children}</div>
  </label>
);

// ============ App Shell ============
function App() {
  const [view, setView] = useState("today");
  const [subjects, setSubjects] = useState([]);
  const [todayStats, setTodayStats] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [streak, setStreak] = useState(null);
  const [settings, setSettings] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [s, t, w, st, se] = await Promise.all([
        axios.get(`${API}/subjects`),
        axios.get(`${API}/stats/today`),
        axios.get(`${API}/stats/weekly`),
        axios.get(`${API}/stats/streak`),
        axios.get(`${API}/settings`),
      ]);
      setSubjects(s.data);
      setTodayStats(t.data);
      setWeekly(w.data);
      setStreak(st.data);
      setSettings(se.data);
    } catch (e) {
      console.error("refresh err", e);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div
      className="min-h-screen flex bg-[#0A0A0F] text-white"
      style={{
        fontFamily: "DM Sans, sans-serif",
        backgroundImage:
          "radial-gradient(ellipse at top left, rgba(179,136,255,0.08), transparent 50%), radial-gradient(ellipse at bottom right, rgba(255,214,0,0.06), transparent 50%)",
      }}
    >
      <Sidebar active={view} onChange={setView} />
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        {view === "today" && (
          <TodayView
            subjects={subjects}
            todayStats={todayStats}
            streak={streak}
            settings={settings}
            onLogged={refresh}
          />
        )}
        {view === "subjects" && <SubjectsView subjects={subjects} refresh={refresh} />}
        {view === "pomodoro" && <PomodoroView subjects={subjects} settings={settings} onLogged={refresh} />}
        {view === "schedule" && <ScheduleView />}
        {view === "stats" && <StatsView weekly={weekly} streak={streak} todayStats={todayStats} />}
        {view === "records" && <RecordsView refresh={refresh} />}
        {view === "settings" && <SettingsView settings={settings} refresh={refresh} />}
      </main>
    </div>
  );
}

export default App;
