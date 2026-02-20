const ASSESSMENT_MINUTES = 45;

const APP_CONFIG = window.GMA_CONFIG || {};
const SUBMIT_ENDPOINT = String(APP_CONFIG.submitEndpoint || "").trim();
const SHOW_CANDIDATE_SCORE = Boolean(APP_CONFIG.showCandidateScore);
const TEST_VERSION = String(APP_CONFIG.testVersion || "mgmt-sys-v2-50q").trim();
const RAPID_FLAG_MINUTES = Number(APP_CONFIG.minDurationMinutes || 15);

const SECTION_ORDER = ["Numerical", "Verbal", "Logical"];

const SECTION_WEIGHTS = {
  Numerical: 0.3,
  Verbal: 0.3,
  Logical: 0.4
};

const COMPETENCY_META = {
  fb: { label: "F&B Knowledge", weight: 0.25, minRatio: 0.5 },
  systems: { label: "Systems Design", weight: 0.45, minRatio: 0.6 },
  execution: { label: "Execution Ownership", weight: 0.3, minRatio: 0.5 }
};

const PASS_MODEL = {
  label: "Management (F&B Systems)",
  rawPassRatio: 15 / 24,
  weightedPass: 70
};

const QUESTIONS = [
  { id: 1, section: "Numerical", competency: "fb", prompt: "Weekly sales were $32,000, food COGS was $9,600, and labor was $8,000. Prime cost % =", options: ["52%", "53%", "55%", "57%"], answer: "C" },
  { id: 2, section: "Numerical", competency: "fb", prompt: "A 120 lb seafood order yields 90 lb usable product. Yield % =", options: ["70%", "75%", "80%", "85%"], answer: "B" },
  { id: 3, section: "Numerical", competency: "systems", prompt: "Six stations each save 5 minutes per hour after redesign. Over a 3-hour service, total minutes saved =", options: ["60", "75", "90", "120"], answer: "C" },
  { id: 4, section: "Numerical", competency: "execution", prompt: "A project requires 36 total hours. If one manager can dedicate 9 hours per week, minimum weeks needed =", options: ["3", "4", "4.5", "5"], answer: "B" },
  { id: 5, section: "Numerical", competency: "fb", prompt: "A cocktail sells for $15 and ingredient cost is $4.20. Beverage cost % =", options: ["24%", "26%", "28%", "30%"], answer: "C" },
  { id: 6, section: "Numerical", competency: "systems", prompt: "Average ticket time dropped from 12 to 9 minutes across 150 tickets. Total minutes saved =", options: ["300", "360", "420", "450"], answer: "D" },
  { id: 7, section: "Numerical", competency: "execution", prompt: "Four tasks take 2.5 hours each plus 1.5 hours QA. Two managers can each work 4 hours/day. Minimum days to finish =", options: ["1", "2", "3", "4"], answer: "B" },
  { id: 8, section: "Numerical", competency: "fb", prompt: "Inventory variance improved from 5% to 2% on a $50,000 base. Dollar improvement =", options: ["$1,000", "$1,250", "$1,500", "$1,750"], answer: "C" },
  { id: 9, section: "Numerical", competency: "systems", prompt: "Checklist compliance rose from 70% to 88% across 200 shifts. Additional compliant shifts =", options: ["18", "24", "30", "36"], answer: "D" },
  { id: 10, section: "Numerical", competency: "execution", prompt: "Five deliverables each require 3 days. Two owners can work in parallel continuously. Minimum calendar days =", options: ["6", "7", "8", "9"], answer: "C" },
  { id: 11, section: "Numerical", competency: "fb", prompt: "A dish sells for $24 and food cost is $7.20. Food cost % =", options: ["25%", "28%", "30%", "32%"], answer: "C" },
  { id: 12, section: "Numerical", competency: "systems", prompt: "Waste dropped from 420 lb to 294 lb. Percent reduction =", options: ["20%", "30%", "35%", "40%"], answer: "B" },
  { id: 13, section: "Numerical", competency: "execution", prompt: "Seven close tasks take 20 minutes each. Two closers split equally. Minutes per closer =", options: ["50", "60", "70", "80"], answer: "C" },
  { id: 14, section: "Numerical", competency: "fb", prompt: "A chicken case costs $144 for 48 lb usable product. Cost per usable lb =", options: ["$2.50", "$3.00", "$3.25", "$3.50"], answer: "B" },
  { id: 15, section: "Numerical", competency: "systems", prompt: "Forecast accuracy improved from 62% to 77%. Improvement in percentage points =", options: ["10", "12", "15", "18"], answer: "C" },
  { id: 16, section: "Numerical", competency: "execution", prompt: "Five checkpoints occur every 3 days starting Day 0. Final checkpoint is on Day =", options: ["9", "10", "11", "12"], answer: "D" },
  { id: 17, section: "Numerical", competency: "systems", prompt: "Parallel prep lanes: lane A totals 75 min, lane B totals 25 min. Total completion time =", options: ["40", "60", "70", "75"], answer: "D" },

  { id: 18, section: "Verbal", competency: "execution", prompt: "Choose the strongest kickoff brief:", options: ["Improve onboarding soon.", "By June 30, cut manager onboarding from 20 to 14 days; owner: Alex; weekly milestones.", "Team should work harder.", "We will decide details later."], answer: "B" },
  { id: 19, section: "Verbal", competency: "fb", prompt: "Policy: discard hot-held food below 135F for more than 4 hours. Chili stayed at 131F for 5 hours. Correct action:", options: ["Discard", "Reheat and serve", "Cool and reheat tomorrow", "Label and hold"], answer: "A" },
  { id: 20, section: "Verbal", competency: "systems", prompt: "Choose the strongest root-cause statement:", options: ["Staff are careless.", "Ticket spikes occur when expo callouts vary and station setup starts late.", "Guests are difficult.", "Kitchen is unlucky."], answer: "B" },
  { id: 21, section: "Verbal", competency: "execution", prompt: "Choose the strongest status update:", options: ["Project looks fine.", "Phase 1 complete; vendor delay risks week-3 target; mitigation approved today.", "Need help maybe.", "Everything is hard."], answer: "B" },
  { id: 22, section: "Verbal", competency: "fb", prompt: "Low-margin items increased while sales stayed flat. Best immediate move:", options: ["Cut all labor", "Increase low-margin discounts", "Promote high-margin items and retrain upselling", "Wait until quarter close"], answer: "C" },
  { id: 23, section: "Verbal", competency: "systems", prompt: "Which SOP line is strongest?", options: ["Check things carefully.", "Verify line temp logs by 10:30 AM and initial the checklist.", "Be professional.", "Move quickly."], answer: "B" },
  { id: 24, section: "Verbal", competency: "execution", prompt: "Best rewrite: The rollout plan that Maya wrote it missed dependencies.", options: ["The rollout plan Maya wrote missed dependencies.", "Maya rollout wrote plan dependencies missed.", "The plan was Maya wrote it dependencies.", "Maya wrote, plan dependencies missing it."], answer: "A" },
  { id: 25, section: "Verbal", competency: "fb", prompt: "If menu price increases 5% while unit cost stays flat, gross margin per item will most likely:", options: ["Decrease", "Increase", "Stay identical in dollars and percent", "Become negative"], answer: "B" },
  { id: 26, section: "Verbal", competency: "systems", prompt: "Best change-management sequence:", options: ["Announce, blame, enforce", "Define target, pilot, measure, standardize", "Train first, define later", "Roll out to all stores immediately"], answer: "B" },
  { id: 27, section: "Verbal", competency: "execution", prompt: "Strongest ownership statement:", options: ["Someone should handle this.", "I own this project and will send Friday milestone reports.", "Team can decide if needed.", "We will revisit next quarter."], answer: "B" },
  { id: 28, section: "Verbal", competency: "fb", prompt: "A guest reports a nut allergy. Best immediate response:", options: ["Use standard prep tools", "Mark ticket allergy, sanitize station/tools, and confirm with expo", "Serve quickly before delay", "Offer item without checking ingredients"], answer: "B" },
  { id: 29, section: "Verbal", competency: "systems", prompt: "Best KPI for reducing ticket-time variability:", options: ["Average weekly sales", "90th percentile ticket time by station", "Monthly social followers", "Total menu count"], answer: "B" },
  { id: 30, section: "Verbal", competency: "execution", prompt: "Strongest escalation message:", options: ["This is bad.", "Risk R3 jeopardizes launch date; requesting approval for backup vendor by 3 PM.", "Can we talk soon?", "Not sure what to do."], answer: "B" },
  { id: 31, section: "Verbal", competency: "fb", prompt: "Best control to reduce high-value inventory variance:", options: ["Weekly visual check only", "No receiving logs", "Daily count with variance sign-off", "Monthly estimate"], answer: "C" },
  { id: 32, section: "Verbal", competency: "fb", prompt: "Pilot menu change increased contribution margin by 9% with flat traffic. Best inference:", options: ["Mix or pricing likely improved profitability", "Traffic doubled", "Labor automatically improved", "Food safety risks increased"], answer: "A" },
  { id: 33, section: "Verbal", competency: "systems", prompt: "Primary purpose of a post-mortem after rollout:", options: ["Assign blame", "Skip future planning", "Capture lessons and system fixes", "Replace SOPs with memory"], answer: "C" },
  { id: 34, section: "Verbal", competency: "execution", prompt: "Best phrase for deadline ownership:", options: ["We will try", "Hopefully done", "Deliverable owner and date are confirmed", "Maybe next week"], answer: "C" },

  { id: 35, section: "Logical", competency: "systems", prompt: "Order constraints: define KPI before pilot, pilot before SOP, SOP before training. What must be second?", options: ["Define KPI", "Pilot", "SOP", "Training"], answer: "B" },
  { id: 36, section: "Logical", competency: "execution", prompt: "Rule: if a risk is flagged, assign mitigation owner in 24 hours. Risk flagged, no owner assigned. Conclusion:", options: ["Rule followed", "Rule violated", "Risk removed", "Cannot determine"], answer: "B" },
  { id: 37, section: "Logical", competency: "fb", prompt: "All cooling logs require timestamps. A cooling log has none. Conclusion:", options: ["Compliant", "Noncompliant", "Only manager sign-off missing", "Cannot determine"], answer: "B" },
  { id: 38, section: "Logical", competency: "systems", prompt: "All SOPs are version-controlled. All version-controlled docs are auditable. Therefore:", options: ["All SOPs are auditable", "No SOPs are auditable", "Only new SOPs are auditable", "Cannot infer"], answer: "A" },
  { id: 39, section: "Logical", competency: "execution", prompt: "If a project is overdue, director is notified. Director was notified. Which must be true?", options: ["Project is overdue", "Project may or may not be overdue", "Project is complete", "Notification was invalid"], answer: "B" },
  { id: 40, section: "Logical", competency: "systems", prompt: "Odd one out:", options: ["Runbook", "SOP", "Post-mortem", "Ladle"], answer: "D" },
  { id: 41, section: "Logical", competency: "fb", prompt: "Par levels sequence: 20, 24, 28, 32, ?. Next value =", options: ["34", "36", "38", "40"], answer: "B" },
  { id: 42, section: "Logical", competency: "systems", prompt: "Rule: if queue length exceeds 12, open backup line. Queue is 14 and backup line stayed closed. Conclusion:", options: ["Rule followed", "Rule violated", "Queue under 12", "Cannot determine"], answer: "B" },
  { id: 43, section: "Logical", competency: "execution", prompt: "Constraint: Mia cannot work Tuesday. Leo must work Tuesday. Who works Tuesday?", options: ["Mia", "Leo", "Either one", "Neither"], answer: "B" },
  { id: 44, section: "Logical", competency: "systems", prompt: "Sequence: 2, 6, 12, 20, 30, ?. Next value =", options: ["40", "41", "42", "44"], answer: "C" },
  { id: 45, section: "Logical", competency: "fb", prompt: "All allergen tickets require manager verification. Ticket #211 has no manager verification. Conclusion:", options: ["Compliant", "Noncompliant", "Only timestamp missing", "Cannot determine"], answer: "B" },
  { id: 46, section: "Logical", competency: "systems", prompt: "If A must finish before B, and B before C, then when C starts, what must be true?", options: ["A and B are complete", "Only B is complete", "Only A is complete", "Neither must be complete"], answer: "A" },
  { id: 47, section: "Logical", competency: "execution", prompt: "Policy: candidate must pass all three competency minimums. Candidate misses one minimum. Decision:", options: ["Advance", "Do not advance", "Advance with coaching", "Ignore competency gate"], answer: "B" },
  { id: 48, section: "Logical", competency: "systems", prompt: "Data points: 9, 9, 10, 12, 30. Median =", options: ["9", "10", "12", "14"], answer: "B" },
  { id: 49, section: "Logical", competency: "fb", prompt: "Cooling standard: 135F to 70F within 2 hours, and to 41F within 6 total hours. Soup cooled in 1 hour then reached 41F by hour 5. Conclusion:", options: ["Compliant", "Noncompliant", "Needs reheating", "Cannot determine"], answer: "A" },
  { id: 50, section: "Logical", competency: "execution", prompt: "Rule: every milestone must have an owner. Milestone 6 has no owner. Conclusion:", options: ["Rule satisfied", "Rule violated", "Only due date missing", "Cannot determine"], answer: "B" }
];

const TOTAL_QUESTIONS = QUESTIONS.length;
const RAW_PASS_MIN = Math.ceil(TOTAL_QUESTIONS * PASS_MODEL.rawPassRatio);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const EMAIL_TYPO_MAP = {
  "gmial.com": "gmail.com",
  "gmil.com": "gmail.com",
  "gmail.co": "gmail.com",
  "yaho.com": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "hotnail.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outlook.co": "outlook.com",
  "iclod.com": "icloud.com",
  "icloud.co": "icloud.com"
};
const COMMON_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "aol.com",
  "protonmail.com",
  "live.com",
  "msn.com",
  "larkinsrestaurants.com"
];

const state = {
  endAt: null,
  timerId: null,
  startedAt: null,
  presented: []
};

const setupEl = document.querySelector("#setup");
const testEl = document.querySelector("#test");
const formEl = document.querySelector("#testForm");
const resultsEl = document.querySelector("#results");
const timerEl = document.querySelector("#timer");
const startBtn = document.querySelector("#startBtn");
const submitBtn = document.querySelector("#submitBtn");

startBtn.addEventListener("click", startTest);
submitBtn.addEventListener("click", () => submitTest(false));

function startTest() {
  const name = valueOf("#candidateName");
  const email = valueOf("#candidateEmail");

  if (!name) {
    alert("Please enter candidate name.");
    return;
  }

  const emailValidation = validateCandidateEmail(email);
  if (!emailValidation.ok) {
    alert(emailValidation.error);
    return;
  }

  if (emailValidation.suggestion) {
    const proceed = window.confirm(`Did you mean ${emailValidation.suggestion}? Click OK to use it, or Cancel to edit.`);
    if (proceed) {
      const emailEl = document.querySelector("#candidateEmail");
      if (emailEl) emailEl.value = emailValidation.suggestion;
    } else {
      return;
    }
  }

  state.presented = shuffleWithinSections(QUESTIONS);
  state.startedAt = Date.now();
  state.endAt = state.startedAt + ASSESSMENT_MINUTES * 60 * 1000;

  renderQuestions();
  setupEl.classList.add("hidden");
  testEl.classList.remove("hidden");
  resultsEl.classList.add("hidden");
  tick();
  state.timerId = setInterval(tick, 1000);
}

function renderQuestions() {
  formEl.innerHTML = "";

  SECTION_ORDER.forEach((section) => {
    const header = document.createElement("h3");
    header.textContent = section;
    formEl.appendChild(header);

    state.presented
      .filter((q) => q.section === section)
      .forEach((q) => {
        const wrapper = document.createElement("fieldset");
        wrapper.className = "question";

        const legend = document.createElement("p");
        legend.innerHTML = `<strong>${q.id}.</strong> ${q.prompt}`;
        wrapper.appendChild(legend);

        const choices = document.createElement("div");
        choices.className = "choices";

        q.options.forEach((opt, idx) => {
          const code = ["A", "B", "C", "D"][idx];
          const id = `q${q.id}_${code}`;
          const label = document.createElement("label");
          label.className = "choice";
          label.setAttribute("for", id);
          label.innerHTML = `<input id="${id}" type="radio" name="q${q.id}" value="${code}"> ${code}) ${opt}`;
          choices.appendChild(label);
        });

        wrapper.appendChild(choices);
        formEl.appendChild(wrapper);
      });
  });
}

function tick() {
  const msLeft = Math.max(0, state.endAt - Date.now());
  const totalSec = Math.floor(msLeft / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  timerEl.textContent = `${mm}:${ss}`;

  if (msLeft <= 0) {
    clearInterval(state.timerId);
    submitTest(true);
  }
}

async function submitTest(autoSubmitted) {
  clearInterval(state.timerId);

  const answers = {};
  QUESTIONS.forEach((q) => {
    const checked = document.querySelector(`input[name=\"q${q.id}\"]:checked`);
    answers[q.id] = checked ? checked.value : "";
  });

  const durationMinutes = Math.round((Date.now() - state.startedAt) / 60000);
  const localScore = scoreCandidate(answers, durationMinutes);

  const submissionPayload = {
    candidateName: valueOf("#candidateName"),
    candidateEmail: valueOf("#candidateEmail"),
    submittedAt: new Date().toISOString(),
    durationMinutes,
    autoSubmitted,
    answers,
    testVersion: TEST_VERSION
  };

  let backendResult = { ok: false, skipped: true, error: "Backend endpoint not configured." };
  if (SUBMIT_ENDPOINT) {
    backendResult = await sendSubmissionToBackend(submissionPayload);
  }

  testEl.classList.add("hidden");
  renderResults(localScore, backendResult, submissionPayload);
}

function scoreCandidate(answers, durationMinutes) {
  let raw = 0;

  const sectionTotals = buildSectionTotals();
  const competencyTotals = buildCompetencyTotals();

  QUESTIONS.forEach((q) => {
    const isCorrect = answers[q.id] === q.answer;
    sectionTotals[q.section].total += 1;
    competencyTotals[q.competency].total += 1;

    if (isCorrect) {
      raw += 1;
      sectionTotals[q.section].correct += 1;
      competencyTotals[q.competency].correct += 1;
    }
  });

  let sectionWeightedScore = 0;
  Object.keys(sectionTotals).forEach((section) => {
    const ratio = sectionTotals[section].total > 0 ? sectionTotals[section].correct / sectionTotals[section].total : 0;
    sectionWeightedScore += ratio * SECTION_WEIGHTS[section] * 100;
  });

  let competencyWeightedScore = 0;
  Object.keys(competencyTotals).forEach((key) => {
    const ratio = competencyTotals[key].total > 0 ? competencyTotals[key].correct / competencyTotals[key].total : 0;
    competencyWeightedScore += ratio * COMPETENCY_META[key].weight * 100;
  });

  const competencyPass = Object.keys(competencyTotals).every((key) => {
    const ratio = competencyTotals[key].total > 0 ? competencyTotals[key].correct / competencyTotals[key].total : 0;
    return ratio >= COMPETENCY_META[key].minRatio;
  });

  const weightedScore = Math.round((sectionWeightedScore * 0.4) + (competencyWeightedScore * 0.6));
  const rapidFlag = durationMinutes < RAPID_FLAG_MINUTES;
  const pass = raw >= RAW_PASS_MIN && weightedScore >= PASS_MODEL.weightedPass && competencyPass;

  return {
    rawScore: raw,
    weightedScore,
    sectionWeightedScore: Math.round(sectionWeightedScore),
    competencyWeightedScore: Math.round(competencyWeightedScore),
    sectionTotals,
    competencyTotals,
    competencyPass,
    rapidFlag,
    pass
  };
}

function renderResults(localScore, backendResult, submissionPayload) {
  resultsEl.classList.remove("hidden");

  if (SUBMIT_ENDPOINT && !SHOW_CANDIDATE_SCORE) {
    if (backendResult.ok) {
      const ref = backendResult.submissionId || "received";
      resultsEl.innerHTML = `
        <h2>Assessment Submitted</h2>
        <p>Thank you, ${escapeHtml(submissionPayload.candidateName)}. Your assessment has been submitted.</p>
        <p class="small">Reference ID: <code>${escapeHtml(ref)}</code></p>
      `;
      return;
    }

    resultsEl.innerHTML = `
      <h2>Submission Issue</h2>
      <p>We could not submit your assessment automatically.</p>
      <p class="small">Error: ${escapeHtml(backendResult.error || "Unknown error")}</p>
      <p class="small">Please contact the hiring team and provide your name and email used on this form.</p>
    `;
    return;
  }

  const recommendation = localScore.pass ? "Advance to structured interview" : "Do not advance";
  const competencyFlag = localScore.competencyPass ? "All competency minimums met" : "One or more competency minimums missed";
  const backendStatus = backendResult.ok
    ? `Backend submission saved (${backendResult.submissionId || "ok"}).`
    : backendResult.skipped
      ? "No backend configured. Local scoring only."
      : `Backend submission failed: ${backendResult.error}`;

  const sectionRows = SECTION_ORDER.map((section) => {
    const row = localScore.sectionTotals[section];
    return `<tr><td>${section}</td><td>${row.correct}</td><td>${row.total}</td></tr>`;
  }).join("");

  const competencyRows = Object.keys(COMPETENCY_META).map((key) => {
    const row = localScore.competencyTotals[key];
    return `<tr><td>${COMPETENCY_META[key].label}</td><td>${row.correct}</td><td>${row.total}</td><td>${Math.round(COMPETENCY_META[key].minRatio * 100)}%</td></tr>`;
  }).join("");

  resultsEl.innerHTML = `
    <h2>Result Summary</h2>
    <p>
      <span class="kpi"><strong>Candidate:</strong> ${escapeHtml(submissionPayload.candidateName)}</span>
      <span class="kpi"><strong>Track:</strong> ${escapeHtml(PASS_MODEL.label)}</span>
      <span class="kpi"><strong>Version:</strong> ${escapeHtml(TEST_VERSION)}</span>
      <span class="kpi"><strong>Raw:</strong> ${localScore.rawScore}/${TOTAL_QUESTIONS}</span>
      <span class="kpi"><strong>Weighted:</strong> ${localScore.weightedScore}/100</span>
    </p>
    <p>
      <span class="kpi"><strong>Recommendation:</strong> ${recommendation}</span>
      <span class="kpi"><strong>Competency Gate:</strong> ${competencyFlag}</span>
      <span class="kpi"><strong>Rapid Completion:</strong> ${localScore.rapidFlag ? "Yes" : "No"}</span>
    </p>
    <table class="result-table">
      <thead><tr><th>Section</th><th>Correct</th><th>Total</th></tr></thead>
      <tbody>${sectionRows}</tbody>
    </table>
    <table class="result-table">
      <thead><tr><th>Competency</th><th>Correct</th><th>Total</th><th>Minimum</th></tr></thead>
      <tbody>${competencyRows}</tbody>
    </table>
    <p class="small">Raw pass minimum: ${RAW_PASS_MIN}/${TOTAL_QUESTIONS}; weighted pass minimum: ${PASS_MODEL.weightedPass}/100.</p>
    <p class="small">${escapeHtml(backendStatus)}</p>
  `;
}

async function sendSubmissionToBackend(payload) {
  try {
    const response = await fetch(SUBMIT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.ok === false) {
      return { ok: false, skipped: false, error: data?.error || `HTTP ${response.status}` };
    }

    return {
      ok: true,
      skipped: false,
      submissionId: data?.submissionId || ""
    };
  } catch (error) {
    return {
      ok: false,
      skipped: false,
      error: error instanceof Error ? error.message : "Unknown network error"
    };
  }
}

function buildSectionTotals() {
  const totals = {};
  SECTION_ORDER.forEach((section) => {
    totals[section] = { correct: 0, total: 0 };
  });
  return totals;
}

function buildCompetencyTotals() {
  const totals = {};
  Object.keys(COMPETENCY_META).forEach((key) => {
    totals[key] = { label: COMPETENCY_META[key].label, correct: 0, total: 0 };
  });
  return totals;
}

function validateCandidateEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized) return { ok: false, error: "Please enter candidate email." };
  if (!EMAIL_REGEX.test(normalized)) {
    return { ok: false, error: "Please enter a valid email format (example: name@company.com)." };
  }

  const suggestion = suggestEmailCorrection(normalized);
  return { ok: true, suggestion };
}

function suggestEmailCorrection(email) {
  const parts = email.split("@");
  if (parts.length !== 2) return "";

  const [local, domainRaw] = parts;
  const domain = domainRaw.toLowerCase();

  if (EMAIL_TYPO_MAP[domain]) {
    return `${local}@${EMAIL_TYPO_MAP[domain]}`;
  }

  if (COMMON_EMAIL_DOMAINS.includes(domain)) return "";

  const closest = findClosestKnownDomain(domain);
  if (!closest) return "";

  return `${local}@${closest}`;
}

function findClosestKnownDomain(domain) {
  let best = "";
  let bestDistance = Number.POSITIVE_INFINITY;

  COMMON_EMAIL_DOMAINS.forEach((candidate) => {
    const d = levenshtein(domain, candidate);
    if (d < bestDistance) {
      bestDistance = d;
      best = candidate;
    }
  });

  if (bestDistance <= 1) return best;
  if (bestDistance === 2 && Math.abs(domain.length - best.length) <= 1) return best;
  return "";
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i += 1) dp[i][0] = i;
  for (let j = 0; j <= n; j += 1) dp[0][j] = j;

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[m][n];
}

function shuffleWithinSections(input) {
  const out = [];
  SECTION_ORDER.forEach((section) => {
    const subset = input.filter((q) => q.section === section);
    shuffleInPlace(subset);
    out.push(...subset);
  });
  return out;
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function valueOf(selector) {
  const el = document.querySelector(selector);
  return el ? el.value.trim() : "";
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
