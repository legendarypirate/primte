"use client";

import { useEffect, useMemo, useState } from "react";
import {
  COURSE_GROUP,
  COURSE_NOTES,
  COURSES,
  OPEN_COURSES,
  type CourseId,
} from "./courses";

type Group = "adult" | "trial" | "junior";

const STEPS: Record<Group, number> = { adult: 3, trial: 2, junior: 3 };

const CYR = /^[А-ЯЁӨҮа-яёөү][А-ЯЁӨҮа-яёөү\s.\-]+$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function tomorrowISO() {
  return new Date(Date.now() + 864e5).toISOString().slice(0, 10);
}

function bankHtml(ref: string) {
  return (
    <>
      <b>Худалдаа хөгжлийн банк 800056500</b>
      <br />
      Данс эзэмшигч: Прайм Буудлагын Академи
      <br />
      Гүйлгээний утга: <b>{ref}</b>
    </>
  );
}

export function RegisterModal({
  open,
  courseId,
  onClose,
}: {
  open: boolean;
  courseId: string;
  onClose: () => void;
}) {
  const [closing, setClosing] = useState(false);
  const [course, setCourse] = useState<CourseId>("trial");
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState<"next" | "back" | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [agree, setAgree] = useState(false);
  const [agreeErr, setAgreeErr] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Record<string, string>>({});

  const group = COURSE_GROUP[course] ?? "trial";
  const total = STEPS[group];
  const selected = COURSES.find((c) => c.id === course) ?? OPEN_COURSES[0];
  const minDate = useMemo(tomorrowISO, [open]);

  useEffect(() => {
    if (!open) return;
    const id = OPEN_COURSES.some((c) => c.id === courseId) ? (courseId as CourseId) : "trial";
    setCourse(id);
    setStep(1);
    setDir(null);
    setDone(false);
    setSubmitting(false);
    setAgree(false);
    setAgreeErr("");
    setErrors({});
    setForm({});
    setClosing(false);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, courseId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // handleClose is stable enough for this overlay
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleClose() {
    if (closing) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      onClose();
      return;
    }
    setClosing(true);
    setTimeout(onClose, 220);
  }

  function setField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function check(name: string, req: string, value: string) {
    const v = value.trim();
    if (!v) return "Энэ талбарыг бөглөнө үү";
    if (req === "cyr" && (!CYR.test(v) || v.split(/\s+/).length < 2)) {
      return "Овог, нэрээ криллээр бичнэ үү (жишээ: Баатар БОЛД)";
    }
    if (req === "email" && !EMAIL.test(v)) return "И-мэйл хаягаа зөв оруулна уу";
    if (req === "phone" && !/^\d{8}$/.test(v)) return "8 оронтой утасны дугаар оруулна уу";
    if (req === "age" && !(Number(v) >= 12 && Number(v) <= 18)) return "Нас 12–18 байна";
    if (req === "date" && v < minDate) return "Маргаашаас хойших өдөр сонгоно уу";
    return "";
  }

  function validateStep() {
    const fields = STEP_FIELDS[group][step - 1] || [];
    const next: Record<string, string> = {};
    let first = "";
    for (const field of fields) {
      const msg =
        field.kind === "radio"
          ? form[field.name]
            ? ""
            : "Нэгийг сонгоно уу"
          : check(field.name, field.req || "text", form[field.name] || "");
      if (msg) {
        next[field.name] = msg;
        if (!first) first = field.name;
      }
    }
    setErrors(next);
    return !first;
  }

  function nextStep() {
    if (!validateStep()) return;
    setDir("next");
    setStep((s) => Math.min(s + 1, total));
  }

  function backStep() {
    setDir("back");
    setStep((s) => Math.max(s - 1, 1));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step !== total) {
      nextStep();
      return;
    }
    if (!validateStep()) return;
    if (!agree) {
      setAgreeErr("Үргэлжлүүлэхийн тулд зөвшөөрнө үү");
      return;
    }
    setAgreeErr("");
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    setSubmitting(false);
    setDone(true);
  }

  if (!open) return null;

  const doneSteps = doneStepsFor(course, form);

  return (
    <div
      id="reg"
      className={`fade${closing ? " closing" : ""}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(5,6,8,.74)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        boxSizing: "border-box",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="modal reg-box" role="dialog" aria-modal="true" aria-labelledby="reg-title">
        <div className="reg-top">
          <div>
            <span className="reg-kicker">{done ? "Дууслаа" : `Алхам ${step} / ${total}`}</span>
            <h2 id="reg-title">Сургалтын бүртгэл</h2>
          </div>
          <button type="button" aria-label="Хаах" className="reg-x" onClick={handleClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8E9EC" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="reg-progress" aria-hidden="true">
          <span style={{ width: done ? "100%" : `${(step / total) * 100}%` }} />
        </div>

        {done ? (
          <div id="reg-done" className="grp-in" role="status">
            <div className="done-ic">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D8AE4A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </div>
            <h3>Бүртгэл хүлээж авлаа!</h3>
            <p>
              {form.name || ""}, таны <b style={{ color: "#fff" }}>{selected.title}</b> бүртгэлийг хүлээн авлаа. Дараагийн алхмууд:
            </p>
            <div className="done-steps">
              {doneSteps.map((s, i) => (
                <div className="st" key={i}>
                  <span className="n">{i + 1}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <button type="button" className="reg-close-btn" onClick={handleClose}>
              Хаах
            </button>
          </div>
        ) : (
          <form id="reg-form" noValidate onSubmit={submit}>
            {step === 1 ? (
              <div className="course-pick">
                <label className="sr-only" htmlFor="f-course">
                  Сургалт
                </label>
                <select
                  className="in in-sm"
                  id="f-course"
                  name="course"
                  value={course}
                  onChange={(e) => {
                    setCourse(e.target.value as CourseId);
                    setStep(1);
                    setErrors({});
                  }}
                >
                  {OPEN_COURSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
                <p className="reg-note">{COURSE_NOTES[course]}</p>
              </div>
            ) : null}

            {group === "adult" ? (
              <AdultSteps step={step} dir={dir} form={form} errors={errors} setField={setField} />
            ) : null}
            {group === "trial" ? (
              <TrialSteps step={step} dir={dir} form={form} errors={errors} setField={setField} minDate={minDate} />
            ) : null}
            {group === "junior" ? (
              <JuniorSteps step={step} dir={dir} form={form} errors={errors} setField={setField} />
            ) : null}

            {step === total ? (
              <div className="final-only">
                <label className="agree">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => {
                      setAgree(e.target.checked);
                      setAgreeErr("");
                    }}
                  />
                  <span>Аюулгүй ажиллагааны үндсэн дүрмийг дагаж мөрдөхийг зөвшөөрч байна.</span>
                </label>
                <span className="err">{agreeErr}</span>
              </div>
            ) : null}

            <div className="reg-nav">
              {step > 1 ? (
                <button type="button" className="reg-back" onClick={backStep}>
                  Буцах
                </button>
              ) : null}
              {step < total ? (
                <button type="button" className="btn-y reg-next" onClick={nextStep}>
                  Үргэлжлүүлэх
                </button>
              ) : (
                <button type="submit" className="btn-y reg-next" disabled={submitting}>
                  {submitting ? "Илгээж байна…" : "Бүртгүүлэх"}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

type FieldDef = { name: string; kind?: "radio"; req?: string };

const STEP_FIELDS: Record<Group, FieldDef[][]> = {
  adult: [
    [
      { name: "name", req: "cyr" },
      { name: "gender", kind: "radio" },
      { name: "hand", kind: "radio" },
    ],
    [
      { name: "phone", req: "phone" },
      { name: "email", req: "email" },
      { name: "health", req: "text" },
    ],
    [
      { name: "slot", kind: "radio" },
      { name: "goal", req: "text" },
    ],
  ],
  trial: [
    [
      { name: "name", req: "text" },
      { name: "phone", req: "phone" },
    ],
    [
      { name: "gun", kind: "radio" },
      { name: "people", kind: "radio" },
      { name: "date", req: "date" },
    ],
  ],
  junior: [
    [
      { name: "child", req: "cyr" },
      { name: "age", req: "age" },
      { name: "gender", kind: "radio" },
    ],
    [
      { name: "name", req: "text" },
      { name: "phone", req: "phone" },
      { name: "email", req: "email" },
    ],
    [{ name: "health", req: "text" }],
  ],
};

function FieldError({ msg }: { msg?: string }) {
  return <span className="err">{msg || ""}</span>;
}

function AdultSteps({
  step,
  dir,
  form,
  errors,
  setField,
}: {
  step: number;
  dir: "next" | "back" | null;
  form: Record<string, string>;
  errors: Record<string, string>;
  setField: (name: string, value: string) => void;
}) {
  const anim = dir === "back" ? "in-l" : dir === "next" ? "in-r" : "";
  return (
    <div className="grp">
      {step === 1 ? (
        <div className={`step ${anim}`}>
          <h3 className="step-t">Танилцуулга</h3>
          <label className="f">
            <span className="f-l">Овог, НЭР</span>
            <input
              className="in"
              name="name"
              autoComplete="name"
              placeholder="Баатар БОЛД"
              value={form.name || ""}
              aria-invalid={errors.name ? true : undefined}
              onChange={(e) => setField("name", e.target.value)}
            />
            <small className="f-h">Овгоо жижиг, нэрээ бүх үсгийг томоор, криллээр.</small>
            <FieldError msg={errors.name} />
          </label>
          <fieldset className={`f${errors.gender ? " bad" : ""}`}>
            <legend className="f-l">Хүйс</legend>
            <div className="pills">
              <label>
                <input type="radio" name="gender" value="Эр" checked={form.gender === "Эр"} onChange={() => setField("gender", "Эр")} />
                <span>Эр</span>
              </label>
              <label>
                <input type="radio" name="gender" value="Эм" checked={form.gender === "Эм"} onChange={() => setField("gender", "Эм")} />
                <span>Эм</span>
              </label>
            </div>
            <FieldError msg={errors.gender} />
          </fieldset>
          <fieldset className={`f${errors.hand ? " bad" : ""}`}>
            <legend className="f-l">Хүчтэй гарын байрлал</legend>
            <div className="pills">
              <label>
                <input type="radio" name="hand" value="Баруун" checked={form.hand === "Баруун"} onChange={() => setField("hand", "Баруун")} />
                <span>Баруун</span>
              </label>
              <label>
                <input type="radio" name="hand" value="Солгой" checked={form.hand === "Солгой"} onChange={() => setField("hand", "Солгой")} />
                <span>Солгой</span>
              </label>
            </div>
            <FieldError msg={errors.hand} />
          </fieldset>
        </div>
      ) : null}
      {step === 2 ? (
        <div className={`step ${anim}`}>
          <h3 className="step-t">Холбоо барих</h3>
          <label className="f">
            <span className="f-l">Гар утасны дугаар</span>
            <input
              className="in"
              name="phone"
              type="tel"
              inputMode="numeric"
              maxLength={8}
              autoComplete="tel"
              placeholder="8 оронтой"
              value={form.phone || ""}
              aria-invalid={errors.phone ? true : undefined}
              onChange={(e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 8))}
            />
            <FieldError msg={errors.phone} />
          </label>
          <label className="f">
            <span className="f-l">И-мэйл хаяг</span>
            <input
              className="in"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@mail.com"
              value={form.email || ""}
              aria-invalid={errors.email ? true : undefined}
              onChange={(e) => setField("email", e.target.value)}
            />
            <small className="f-h">Хариу мэдээлэл и-мэйлээр очно.</small>
            <FieldError msg={errors.email} />
          </label>
          <label className="f">
            <span className="f-l">Суурь өвчин, харшилтай эсэх</span>
            <input
              className="in"
              name="health"
              placeholder="Байхгүй"
              value={form.health || ""}
              aria-invalid={errors.health ? true : undefined}
              onChange={(e) => setField("health", e.target.value)}
            />
            <FieldError msg={errors.health} />
          </label>
        </div>
      ) : null}
      {step === 3 ? (
        <div className={`step ${anim}`}>
          <h3 className="step-t">Хуваарь ба зорилго</h3>
          <fieldset className={`f${errors.slot ? " bad" : ""}`}>
            <legend className="f-l">Боломжит цаг</legend>
            <div className="pills stack">
              {[
                ["Ажлын өдрийн анги (Дав, Лха, Баа 19:00-22:00)", "Ажлын өдөр", "Дав, Лха, Баа · 19:00–22:00"],
                ["Амралтын өдрийн анги (Бям, Ням 18:00-22:00)", "Амралтын өдөр", "Бям, Ням · 18:00–22:00"],
                ["Тусгай цаг үүсгэх", "Тусгай цаг", "4+ хүний хүсэлтээр"],
              ].map(([value, label, sub]) => (
                <label key={value}>
                  <input type="radio" name="slot" value={value} checked={form.slot === value} onChange={() => setField("slot", value)} />
                  <span>
                    <b>{label}</b>
                    <small>{sub}</small>
                  </span>
                </label>
              ))}
            </div>
            <FieldError msg={errors.slot} />
          </fieldset>
          <label className="f">
            <span className="f-l">Сургалтад хамрагдах зорилго</span>
            <textarea
              className="in"
              name="goal"
              rows={2}
              placeholder="Тэмцээн, хобби, аюулгүй харьцаж сурах…"
              value={form.goal || ""}
              aria-invalid={errors.goal ? true : undefined}
              onChange={(e) => setField("goal", e.target.value)}
            />
            <FieldError msg={errors.goal} />
          </label>
        </div>
      ) : null}
    </div>
  );
}

function TrialSteps({
  step,
  dir,
  form,
  errors,
  setField,
  minDate,
}: {
  step: number;
  dir: "next" | "back" | null;
  form: Record<string, string>;
  errors: Record<string, string>;
  setField: (name: string, value: string) => void;
  minDate: string;
}) {
  const anim = dir === "back" ? "in-l" : dir === "next" ? "in-r" : "";
  return (
    <div className="grp">
      {step === 1 ? (
        <div className={`step ${anim}`}>
          <h3 className="step-t">Танилцуулга</h3>
          <label className="f">
            <span className="f-l">Нэр</span>
            <input
              className="in"
              name="name"
              autoComplete="name"
              placeholder="Таны нэр"
              value={form.name || ""}
              aria-invalid={errors.name ? true : undefined}
              onChange={(e) => setField("name", e.target.value)}
            />
            <FieldError msg={errors.name} />
          </label>
          <label className="f">
            <span className="f-l">Гар утасны дугаар</span>
            <input
              className="in"
              name="phone"
              type="tel"
              inputMode="numeric"
              maxLength={8}
              autoComplete="tel"
              placeholder="8 оронтой"
              value={form.phone || ""}
              aria-invalid={errors.phone ? true : undefined}
              onChange={(e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 8))}
            />
            <FieldError msg={errors.phone} />
          </label>
        </div>
      ) : null}
      {step === 2 ? (
        <div className={`step ${anim}`}>
          <h3 className="step-t">Буудалт</h3>
          <fieldset className={`f${errors.gun ? " bad" : ""}`}>
            <legend className="f-l">Бууны төрөл</legend>
            <div className="pills">
              <label>
                <input
                  type="radio"
                  name="gun"
                  value="Хийн гар буу (GBB) 100,000₮"
                  checked={form.gun === "Хийн гар буу (GBB) 100,000₮"}
                  onChange={() => setField("gun", "Хийн гар буу (GBB) 100,000₮")}
                />
                <span>
                  <b>Гар буу</b>
                  <small>100,000₮</small>
                </span>
              </label>
              <label>
                <input
                  type="radio"
                  name="gun"
                  value="Карабин (GBB) 150,000₮"
                  checked={form.gun === "Карабин (GBB) 150,000₮"}
                  onChange={() => setField("gun", "Карабин (GBB) 150,000₮")}
                />
                <span>
                  <b>Карабин</b>
                  <small>150,000₮</small>
                </span>
              </label>
            </div>
            <FieldError msg={errors.gun} />
          </fieldset>
          <fieldset className={`f${errors.people ? " bad" : ""}`}>
            <legend className="f-l">Хүний тоо</legend>
            <div className="pills">
              {["1", "2", "3", "4"].map((n) => (
                <label key={n}>
                  <input type="radio" name="people" value={n} checked={form.people === n} onChange={() => setField("people", n)} />
                  <span>{n}</span>
                </label>
              ))}
            </div>
            <FieldError msg={errors.people} />
          </fieldset>
          <label className="f">
            <span className="f-l">Хүссэн өдөр</span>
            <input
              className="in"
              name="date"
              type="date"
              min={minDate}
              value={form.date || ""}
              aria-invalid={errors.date ? true : undefined}
              onChange={(e) => setField("date", e.target.value)}
            />
            <small className="f-h">24 цагийн өмнө баталгаажуулна.</small>
            <FieldError msg={errors.date} />
          </label>
        </div>
      ) : null}
    </div>
  );
}

function JuniorSteps({
  step,
  dir,
  form,
  errors,
  setField,
}: {
  step: number;
  dir: "next" | "back" | null;
  form: Record<string, string>;
  errors: Record<string, string>;
  setField: (name: string, value: string) => void;
}) {
  const anim = dir === "back" ? "in-l" : dir === "next" ? "in-r" : "";
  return (
    <div className="grp">
      {step === 1 ? (
        <div className={`step ${anim}`}>
          <h3 className="step-t">Хүүхдийн мэдээлэл</h3>
          <label className="f">
            <span className="f-l">Хүүхдийн овог, нэр</span>
            <input
              className="in"
              name="child"
              placeholder="Баатар ТЭМҮҮЛЭН"
              value={form.child || ""}
              aria-invalid={errors.child ? true : undefined}
              onChange={(e) => setField("child", e.target.value)}
            />
            <FieldError msg={errors.child} />
          </label>
          <label className="f">
            <span className="f-l">Нас</span>
            <input
              className="in"
              name="age"
              type="number"
              inputMode="numeric"
              min={12}
              max={18}
              placeholder="12–18"
              value={form.age || ""}
              aria-invalid={errors.age ? true : undefined}
              onChange={(e) => setField("age", e.target.value)}
            />
            <FieldError msg={errors.age} />
          </label>
          <fieldset className={`f${errors.gender ? " bad" : ""}`}>
            <legend className="f-l">Хүйс</legend>
            <div className="pills">
              <label>
                <input type="radio" name="gender" value="Эр" checked={form.gender === "Эр"} onChange={() => setField("gender", "Эр")} />
                <span>Эр</span>
              </label>
              <label>
                <input type="radio" name="gender" value="Эм" checked={form.gender === "Эм"} onChange={() => setField("gender", "Эм")} />
                <span>Эм</span>
              </label>
            </div>
            <FieldError msg={errors.gender} />
          </fieldset>
        </div>
      ) : null}
      {step === 2 ? (
        <div className={`step ${anim}`}>
          <h3 className="step-t">Эцэг эх / асран хамгаалагч</h3>
          <label className="f">
            <span className="f-l">Нэр</span>
            <input
              className="in"
              name="name"
              autoComplete="name"
              value={form.name || ""}
              aria-invalid={errors.name ? true : undefined}
              onChange={(e) => setField("name", e.target.value)}
            />
            <FieldError msg={errors.name} />
          </label>
          <label className="f">
            <span className="f-l">Утасны дугаар</span>
            <input
              className="in"
              name="phone"
              type="tel"
              inputMode="numeric"
              maxLength={8}
              autoComplete="tel"
              placeholder="8 оронтой"
              value={form.phone || ""}
              aria-invalid={errors.phone ? true : undefined}
              onChange={(e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 8))}
            />
            <FieldError msg={errors.phone} />
          </label>
          <label className="f">
            <span className="f-l">И-мэйл хаяг</span>
            <input
              className="in"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@mail.com"
              value={form.email || ""}
              aria-invalid={errors.email ? true : undefined}
              onChange={(e) => setField("email", e.target.value)}
            />
            <FieldError msg={errors.email} />
          </label>
        </div>
      ) : null}
      {step === 3 ? (
        <div className={`step ${anim}`}>
          <h3 className="step-t">Эрүүл мэнд</h3>
          <label className="f">
            <span className="f-l">Хүүхэд суурь өвчин, харшилтай эсэх</span>
            <input
              className="in"
              name="health"
              placeholder="Байхгүй"
              value={form.health || ""}
              aria-invalid={errors.health ? true : undefined}
              onChange={(e) => setField("health", e.target.value)}
            />
            <FieldError msg={errors.health} />
          </label>
        </div>
      ) : null}
    </div>
  );
}

function doneStepsFor(id: string, form: Record<string, string>) {
  const ph = form.phone || "";
  if (id === "c1") {
    return [
      <>
        Төлбөр <b>370,000₮</b> шилжүүлнэ (Course 1 + 2 хамт 650,000₮).
        <br />
        {bankHtml(`${ph}, course1`)}
      </>,
      <>
        Иргэний үнэмлэхний болон оршин суугаа хаягийн цахим лавлагаа (E-Mongolia, PDF), 3×4 цээж зургаа <b>registration@prime.mn</b> руу илгээнэ.
      </>,
      <>
        <b>9088-0200</b> руу мэдэгдэхэд ажилтан хуваарийг утсаар баталгаажуулна.
      </>,
    ];
  }
  if (id === "c2") {
    return [
      <>
        Төлбөр <b>370,000₮</b> шилжүүлнэ.
        <br />
        {bankHtml(`${ph}, course2`)}
      </>,
      <>
        Цусны бүлгийн тодорхойлолт болон А-33 маягтын эмнэлгийн хуудсыг <b>registration@prime.mn</b> руу илгээж, эх хувийг авчирна.
      </>,
      <>Өөрийн хэрэгсэлтэй ирнэ. Ажилтан хуваарийг утсаар баталгаажуулна.</>,
    ];
  }
  if (id === "junior") {
    return [
      <>
        Шинэ ангийн хуваарийг <b>{form.email || ""}</b> болон утсаар илгээнэ. 1–2 сар хүлээгдэж болно.
      </>,
      <>Хуваарь тохирвол эхний сарын төлбөрийг шилжүүлснээр бүртгэл баталгаажна.</>,
      <>Хичээлийн эхний өдөр төрсний гэрчилгээ, цээж зураг, төлөөлөгчийн лавлагаатайгаа ирж гэрээ байгуулна.</>,
    ];
  }
  return [
    <>
      Бид <b>{ph}</b> дугаарт холбогдож цагийг баталгаажуулна (24 цагийн өмнө).
    </>,
    <>
      Төлбөрөө шилжүүлнэ.
      <br />
      {bankHtml(`${ph}, trial`)}
    </>,
    <>
      Асуух зүйл байвал <b>9088-0200</b>.
    </>,
  ];
}
