const ASSESSMENT_MINUTES = 35;

const APP_CONFIG = window.PERSONALITY_CONFIG || {};
const SUBMIT_ENDPOINT = String(APP_CONFIG.submitEndpoint || "").trim();
const SHOW_CANDIDATE_REPORT = APP_CONFIG.showCandidateReport !== false;
const TEST_VERSION = String(APP_CONFIG.testVersion || "personality-v1-52q").trim();
const RAPID_FLAG_MINUTES = Number(APP_CONFIG.minDurationMinutes || 8);

const LIKERT_OPTIONS = [
  { value: 1, label: "1 Strongly Disagree" },
  { value: 2, label: "2 Disagree" },
  { value: 3, label: "3 Neutral" },
  { value: 4, label: "4 Agree" },
  { value: 5, label: "5 Strongly Agree" }
];

const MODEL_ORDER = ["mbti", "disc", "strengths", "genius"];

const MODEL_META = {
  mbti: { title: "MBTI-Inspired Preferences" },
  disc: { title: "DISC-Inspired Work Style" },
  strengths: { title: "CliftonStrengths-Inspired Domains" },
  genius: { title: "Working Genius-Inspired Stages" }
};

const TRAIT_META = {
  E: { label: "Extraversion", model: "mbti" },
  I: { label: "Introversion", model: "mbti" },
  S: { label: "Sensing", model: "mbti" },
  N: { label: "Intuition", model: "mbti" },
  T: { label: "Thinking", model: "mbti" },
  F: { label: "Feeling", model: "mbti" },
  J: { label: "Judging", model: "mbti" },
  P: { label: "Perceiving", model: "mbti" },
  D: { label: "Dominance", model: "disc" },
  I_DISC: { label: "Influence", model: "disc" },
  S_DISC: { label: "Steadiness", model: "disc" },
  C: { label: "Conscientiousness", model: "disc" },
  EXEC: { label: "Executing", model: "strengths" },
  INFL: { label: "Influencing", model: "strengths" },
  REL: { label: "Relationship Building", model: "strengths" },
  STRAT: { label: "Strategic Thinking", model: "strengths" },
  WG_W: { label: "Wonder", model: "genius" },
  WG_I: { label: "Invention", model: "genius" },
  WG_D: { label: "Discernment", model: "genius" },
  WG_G: { label: "Galvanizing", model: "genius" },
  WG_E: { label: "Enablement", model: "genius" },
  WG_T: { label: "Tenacity", model: "genius" }
};

const MBTI_BALANCE_MARGIN = 8;
const DISC_BLEND_MARGIN = 8;

const DISC_STYLE_LABELS = {
  D: "Driver",
  I_DISC: "Promoter",
  S_DISC: "Stabilizer",
  C: "Analyzer"
};

const STRENGTHS_PAIR_LABELS = {
  EXEC_INFL: "Execution Influencer",
  EXEC_REL: "Team Builder",
  EXEC_STRAT: "Strategic Executor",
  INFL_REL: "People Mobilizer",
  INFL_STRAT: "Vision Influencer",
  REL_STRAT: "Collaborative Strategist"
};

const GENIUS_PAIR_LABELS = {
  WG_D_WG_I: "Innovation Evaluator",
  WG_D_WG_T: "Quality Finisher",
  WG_E_WG_G: "Team Mobilizer",
  WG_E_WG_T: "Execution Support Engine",
  WG_G_WG_T: "Launch-and-Finish Driver",
  WG_I_WG_W: "Opportunity Inventor"
};

const QUESTIONS = [
  { id: 1, model: "mbti", trait: "E", prompt: "I gain energy from thinking out loud with others." },
  { id: 2, model: "mbti", trait: "I", prompt: "I prefer quiet time alone to recharge after a long day." },
  { id: 3, model: "mbti", trait: "S", prompt: "I trust concrete facts before forming conclusions." },
  { id: 4, model: "mbti", trait: "N", prompt: "I am drawn to patterns and future possibilities first." },
  { id: 5, model: "mbti", trait: "T", prompt: "I prioritize objective criteria over personal impact when deciding." },
  { id: 6, model: "mbti", trait: "F", prompt: "I weigh team harmony and people needs before deciding." },
  { id: 7, model: "mbti", trait: "J", prompt: "I like defined plans, deadlines, and clear closure points." },
  { id: 8, model: "mbti", trait: "P", prompt: "I prefer keeping options open until new information appears." },
  { id: 9, model: "mbti", trait: "E", prompt: "In cross-functional meetings, I naturally speak early." },
  { id: 10, model: "mbti", trait: "I", prompt: "I process my best ideas privately before sharing them." },
  { id: 11, model: "mbti", trait: "S", prompt: "I rely on proven procedures more than experimentation." },
  { id: 12, model: "mbti", trait: "N", prompt: "I enjoy exploring unconventional approaches to a problem." },
  { id: 13, model: "mbti", trait: "T", prompt: "I can deliver tough feedback directly when needed." },
  { id: 14, model: "mbti", trait: "F", prompt: "I adapt communication to preserve trust and morale." },
  { id: 15, model: "mbti", trait: "J", prompt: "I create checklists before starting complex projects." },
  { id: 16, model: "mbti", trait: "P", prompt: "I pivot quickly when priorities shift." },

  { id: 17, model: "disc", trait: "D", prompt: "I take charge quickly when direction is unclear." },
  { id: 18, model: "disc", trait: "I_DISC", prompt: "I build enthusiasm and momentum through communication." },
  { id: 19, model: "disc", trait: "S_DISC", prompt: "I stay calm and steady during long execution cycles." },
  { id: 20, model: "disc", trait: "C", prompt: "I notice quality issues others might miss." },
  { id: 21, model: "disc", trait: "D", prompt: "I can make decisions quickly with incomplete information." },
  { id: 22, model: "disc", trait: "I_DISC", prompt: "I enjoy persuading people to support a plan." },
  { id: 23, model: "disc", trait: "S_DISC", prompt: "I prefer stable routines over frequent process changes." },
  { id: 24, model: "disc", trait: "C", prompt: "I document details to reduce avoidable mistakes." },
  { id: 25, model: "disc", trait: "D", prompt: "I challenge assumptions when results stall." },
  { id: 26, model: "disc", trait: "I_DISC", prompt: "I naturally network across teams and departments." },
  { id: 27, model: "disc", trait: "S_DISC", prompt: "People can count on my follow-through week after week." },
  { id: 28, model: "disc", trait: "C", prompt: "I hold high standards for accuracy and structure." },

  { id: 29, model: "strengths", trait: "EXEC", prompt: "I break large goals into concrete milestone plans." },
  { id: 30, model: "strengths", trait: "INFL", prompt: "I motivate teams by painting a compelling vision." },
  { id: 31, model: "strengths", trait: "REL", prompt: "I build trust quickly with new team members." },
  { id: 32, model: "strengths", trait: "STRAT", prompt: "I spot multiple paths when others see one option." },
  { id: 33, model: "strengths", trait: "EXEC", prompt: "I enjoy tracking commitments all the way to completion." },
  { id: 34, model: "strengths", trait: "INFL", prompt: "I am comfortable presenting ideas to senior stakeholders." },
  { id: 35, model: "strengths", trait: "REL", prompt: "I invest time in coaching and developing others." },
  { id: 36, model: "strengths", trait: "STRAT", prompt: "I connect isolated data points into long-term strategy." },
  { id: 37, model: "strengths", trait: "EXEC", prompt: "I push projects over the finish line under pressure." },
  { id: 38, model: "strengths", trait: "INFL", prompt: "I rally people around change initiatives." },
  { id: 39, model: "strengths", trait: "REL", prompt: "I notice morale shifts before they become visible problems." },
  { id: 40, model: "strengths", trait: "STRAT", prompt: "I often ask what could happen next quarter, not just this week." },

  { id: 41, model: "genius", trait: "WG_W", prompt: "I naturally question how existing systems could be better." },
  { id: 42, model: "genius", trait: "WG_I", prompt: "I generate original ideas when solving operational problems." },
  { id: 43, model: "genius", trait: "WG_D", prompt: "I evaluate ideas and quickly spot practical improvements." },
  { id: 44, model: "genius", trait: "WG_G", prompt: "I energize others to commit to a new initiative." },
  { id: 45, model: "genius", trait: "WG_E", prompt: "I jump in to support teammates so plans keep moving." },
  { id: 46, model: "genius", trait: "WG_T", prompt: "I enjoy final details and completion work." },
  { id: 47, model: "genius", trait: "WG_W", prompt: "I spend time identifying gaps and unmet opportunities." },
  { id: 48, model: "genius", trait: "WG_I", prompt: "I like inventing new workflows from scratch." },
  { id: 49, model: "genius", trait: "WG_D", prompt: "I test concepts rigorously before full rollout." },
  { id: 50, model: "genius", trait: "WG_G", prompt: "I communicate urgency and get people moving." },
  { id: 51, model: "genius", trait: "WG_E", prompt: "I help remove blockers for others during execution." },
  { id: 52, model: "genius", trait: "WG_T", prompt: "I gain energy from polishing and finishing tasks." }
];

const TOTAL_QUESTIONS = QUESTIONS.length;

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
submitBtn.addEventListener("click", () => submitAssessment(false));

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

  state.presented = shuffleWithinModels(QUESTIONS);
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

  MODEL_ORDER.forEach((model) => {
    const block = document.createElement("section");
    block.className = "section-block";

    const title = document.createElement("h3");
    title.textContent = MODEL_META[model].title;
    block.appendChild(title);

    state.presented
      .filter((q) => q.model === model)
      .forEach((q) => {
        const wrapper = document.createElement("fieldset");
        wrapper.className = "question";

        const legend = document.createElement("p");
        legend.innerHTML = `<strong>${q.id}.</strong> ${escapeHtml(q.prompt)}`;
        wrapper.appendChild(legend);

        const scale = document.createElement("div");
        scale.className = "scale";

        LIKERT_OPTIONS.forEach((opt) => {
          const id = `q${q.id}_${opt.value}`;
          const label = document.createElement("label");
          label.className = "choice";
          label.setAttribute("for", id);
          label.innerHTML = `<input id="${id}" type="radio" name="q${q.id}" value="${opt.value}"> ${escapeHtml(opt.label)}`;
          scale.appendChild(label);
        });

        wrapper.appendChild(scale);
        block.appendChild(wrapper);
      });

    formEl.appendChild(block);
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
    submitAssessment(true);
  }
}

async function submitAssessment(autoSubmitted) {
  clearInterval(state.timerId);

  const answers = {};
  QUESTIONS.forEach((q) => {
    const checked = document.querySelector(`input[name="q${q.id}"]:checked`);
    answers[q.id] = checked ? Number(checked.value) : 0;
  });

  const durationMinutes = Math.round((Date.now() - state.startedAt) / 60000);
  const localProfile = scoreAssessment(answers, durationMinutes);

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
  renderResults(localProfile, backendResult, submissionPayload);
}

function scoreAssessment(answers, durationMinutes) {
  const traitTotals = buildTraitTotals();
  let answeredCount = 0;

  QUESTIONS.forEach((q) => {
    const value = Number(answers[q.id] || 0);
    if (!Number.isInteger(value) || value < 1 || value > 5) return;
    answeredCount += 1;

    traitTotals[q.trait].score += value;
    traitTotals[q.trait].count += 1;
  });

  Object.keys(traitTotals).forEach((key) => {
    const row = traitTotals[key];
    row.avg = row.count > 0 ? row.score / row.count : 0;
    row.pct = row.count > 0 ? ((row.avg - 1) / 4) * 100 : 0;
  });

  const mbtiPairs = [
    { left: "E", right: "I", label: "Energy Focus" },
    { left: "S", right: "N", label: "Information Style" },
    { left: "T", right: "F", label: "Decision Lens" },
    { left: "J", right: "P", label: "Execution Preference" }
  ].map((pair) => {
    const leftPct = traitTotals[pair.left].pct;
    const rightPct = traitTotals[pair.right].pct;
    const winner = leftPct >= rightPct ? pair.left : pair.right;
    const margin = Math.round(Math.abs(leftPct - rightPct));
    const balanced = margin < MBTI_BALANCE_MARGIN;

    return {
      ...pair,
      leftPct,
      rightPct,
      winner,
      margin,
      balanced
    };
  });

  const mbtiType = mbtiPairs.map((pair) => pair.winner).join("");
  const mbtiTypeDisplay = mbtiPairs.map((pair) => (pair.balanced ? "X" : pair.winner)).join("");
  const mbtiBalanceCount = mbtiPairs.filter((pair) => pair.balanced).length;
  const mbtiConfidence = mbtiBalanceCount === 0 ? "Clear" : mbtiBalanceCount === 1 ? "Moderate" : "Blended";

  const discRanking = rankTraits(["D", "I_DISC", "S_DISC", "C"], traitTotals);
  const strengthsRanking = rankTraits(["EXEC", "INFL", "REL", "STRAT"], traitTotals);
  const geniusRanking = rankTraits(["WG_W", "WG_I", "WG_D", "WG_G", "WG_E", "WG_T"], traitTotals);

  const archetypes = [
    {
      label: "Systems Builder",
      score: averagePct(["J", "C", "EXEC", "WG_D", "WG_T"], traitTotals),
      summary: "Brings structure, consistency, and completion discipline."
    },
    {
      label: "Growth Driver",
      score: averagePct(["D", "N", "INFL", "WG_I", "WG_G"], traitTotals),
      summary: "Creates momentum, pushes change, and influences direction."
    },
    {
      label: "People Integrator",
      score: averagePct(["F", "REL", "S_DISC", "WG_E", "I_DISC"], traitTotals),
      summary: "Builds trust, alignment, and team reliability."
    },
    {
      label: "Strategic Operator",
      score: averagePct(["STRAT", "T", "C", "WG_D", "J"], traitTotals),
      summary: "Combines analytical thinking with operational execution."
    }
  ].sort((a, b) => b.score - a.score);

  const profile = {
    answeredCount,
    totalQuestions: TOTAL_QUESTIONS,
    completionPct: Math.round((answeredCount / TOTAL_QUESTIONS) * 100),
    rapidFlag: durationMinutes < RAPID_FLAG_MINUTES,
    traitTotals,
    mbti: {
      type: mbtiType,
      typeDisplay: mbtiTypeDisplay,
      confidence: mbtiConfidence,
      balanceCount: mbtiBalanceCount,
      pairs: mbtiPairs
    },
    disc: {
      ranking: discRanking,
      primary: discRanking[0],
      secondary: discRanking[1]
    },
    strengths: {
      ranking: strengthsRanking,
      topTwo: strengthsRanking.slice(0, 2)
    },
    workingGenius: {
      ranking: geniusRanking,
      topTwo: geniusRanking.slice(0, 2),
      lowerEnergyTwo: geniusRanking.slice(-2).reverse()
    },
    archetypes,
    primaryArchetype: archetypes[0]
  };

  profile.interpretation = deriveInterpretation(profile);
  return profile;
}

function renderResults(localProfile, backendResult, submissionPayload) {
  resultsEl.classList.remove("hidden");

  if (SUBMIT_ENDPOINT && !SHOW_CANDIDATE_REPORT) {
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

  const backendStatus = backendResult.ok
    ? `Backend submission saved (${backendResult.submissionId || "ok"}).`
    : backendResult.skipped
      ? "No backend configured. Local profiling only."
      : `Backend submission failed: ${backendResult.error}`;

  const mbtiRows = localProfile.mbti.pairs.map((pair) => `
    <tr>
      <td>${escapeHtml(pair.label)}</td>
      <td>${escapeHtml(TRAIT_META[pair.left].label)} ${Math.round(pair.leftPct)}%</td>
      <td>${escapeHtml(TRAIT_META[pair.right].label)} ${Math.round(pair.rightPct)}%</td>
      <td>${pair.margin}%</td>
      <td>${pair.balanced ? "Balanced" : escapeHtml(TRAIT_META[pair.winner].label)}</td>
    </tr>
  `).join("");

  const discRows = localProfile.disc.ranking.map((item) => `
    <tr><td>${escapeHtml(item.label)}</td><td>${item.pct}%</td></tr>
  `).join("");

  const strengthsRows = localProfile.strengths.ranking.map((item) => `
    <tr><td>${escapeHtml(item.label)}</td><td>${item.pct}%</td></tr>
  `).join("");

  const geniusRows = localProfile.workingGenius.ranking.map((item) => `
    <tr><td>${escapeHtml(item.label)}</td><td>${item.pct}%</td></tr>
  `).join("");

  const archetypeRows = localProfile.archetypes.map((item) => `
    <tr><td>${escapeHtml(item.label)}</td><td>${Math.round(item.score)}%</td><td>${escapeHtml(item.summary)}</td></tr>
  `).join("");

  const topStrengths = localProfile.strengths.topTwo.map((x) => x.label).join(", ");
  const topGenius = localProfile.workingGenius.topTwo.map((x) => x.label).join(", ");
  const lowGenius = localProfile.workingGenius.lowerEnergyTwo.map((x) => x.label).join(", ");
  const interpretation = localProfile.interpretation || {};
  const fitTags = (interpretation.fitTags || []).join(", ");
  const interviewFocus = (interpretation.interviewFocus || []).join(" | ");
  const riskFlags = (interpretation.riskFlags || []).join(", ") || "None";

  resultsEl.innerHTML = `
    <h2>Profile Summary</h2>
    <p>
      <span class="kpi"><strong>Candidate:</strong> ${escapeHtml(submissionPayload.candidateName)}</span>
      <span class="kpi"><strong>Version:</strong> ${escapeHtml(TEST_VERSION)}</span>
      <span class="kpi"><strong>Completed:</strong> ${localProfile.completionPct}%</span>
      <span class="kpi"><strong>MBTI-Inspired Type:</strong> ${escapeHtml(localProfile.mbti.typeDisplay || localProfile.mbti.type)} (${escapeHtml(localProfile.mbti.confidence || "Clear")})</span>
    </p>
    <p>
      <span class="kpi"><strong>DISC Primary:</strong> ${escapeHtml(localProfile.disc.primary.label)} (${localProfile.disc.primary.pct}%)</span>
      <span class="kpi"><strong>Top Strength Domains:</strong> ${escapeHtml(topStrengths)}</span>
      <span class="kpi"><strong>Top Working Genius:</strong> ${escapeHtml(topGenius)}</span>
    </p>
    <p>
      <span class="kpi"><strong>Primary Archetype:</strong> ${escapeHtml(localProfile.primaryArchetype.label)}</span>
      <span class="kpi"><strong>Lower-Energy Genius Areas:</strong> ${escapeHtml(lowGenius)}</span>
      <span class="kpi"><strong>Rapid Completion:</strong> ${localProfile.rapidFlag ? "Yes" : "No"}</span>
    </p>
    <p>
      <span class="kpi"><strong>Profile Type:</strong> ${escapeHtml(interpretation.profileType || "N/A")}</span>
      <span class="kpi"><strong>DISC Style:</strong> ${escapeHtml(interpretation.discStyle || "N/A")}</span>
      <span class="kpi"><strong>Strengths Pattern:</strong> ${escapeHtml(interpretation.strengthsPattern || "N/A")}</span>
      <span class="kpi"><strong>Working Genius Pattern:</strong> ${escapeHtml(interpretation.workingGeniusPattern || "N/A")}</span>
    </p>
    <p class="small"><strong>Fit Tags:</strong> ${escapeHtml(fitTags || "None")}</p>
    <p class="small"><strong>Interview Focus:</strong> ${escapeHtml(interviewFocus || "None")}</p>
    <p class="small"><strong>Risk Flags:</strong> ${escapeHtml(riskFlags)}</p>

    <table class="result-table">
      <thead><tr><th>MBTI-Inspired Pair</th><th>Left</th><th>Right</th><th>Margin</th><th>Signal</th></tr></thead>
      <tbody>${mbtiRows}</tbody>
    </table>

    <table class="result-table">
      <thead><tr><th>DISC-Inspired Trait</th><th>Score</th></tr></thead>
      <tbody>${discRows}</tbody>
    </table>

    <table class="result-table">
      <thead><tr><th>Strengths Domain</th><th>Score</th></tr></thead>
      <tbody>${strengthsRows}</tbody>
    </table>

    <table class="result-table">
      <thead><tr><th>Working Genius</th><th>Score</th></tr></thead>
      <tbody>${geniusRows}</tbody>
    </table>

    <table class="result-table">
      <thead><tr><th>Leadership Archetype</th><th>Score</th><th>Interpretation</th></tr></thead>
      <tbody>${archetypeRows}</tbody>
    </table>

    <p class="small">${escapeHtml(backendStatus)}</p>
    <p class="small disclaimer"><strong>Note:</strong> This is a custom internal profile inspired by public frameworks. It is not an official MBTI, DISC, CliftonStrengths, or Working Genius assessment.</p>
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

function buildTraitTotals() {
  const totals = {};
  Object.keys(TRAIT_META).forEach((key) => {
    totals[key] = {
      trait: key,
      label: TRAIT_META[key].label,
      score: 0,
      count: 0,
      avg: 0,
      pct: 0
    };
  });
  return totals;
}

function rankTraits(traitKeys, traitTotals) {
  return traitKeys
    .map((key) => ({
      key,
      label: TRAIT_META[key].label,
      pct: Math.round(traitTotals[key].pct),
      avg: traitTotals[key].avg
    }))
    .sort((a, b) => {
      if (b.pct !== a.pct) return b.pct - a.pct;
      return a.label.localeCompare(b.label);
    });
}

function averagePct(traits, traitTotals) {
  if (!traits.length) return 0;
  const total = traits.reduce((sum, trait) => sum + (traitTotals[trait]?.pct || 0), 0);
  return total / traits.length;
}

function deriveInterpretation(profile) {
  const discStyle = classifyDiscStyle(profile.disc);
  const strengthsPattern = classifyStrengthsPattern(profile.strengths);
  const geniusPattern = classifyGeniusPattern(profile.workingGenius);
  const fitTags = deriveFitTags(profile);
  const interviewFocus = deriveInterviewFocus(fitTags);
  const riskFlags = deriveRiskFlags(profile, discStyle);

  return {
    profileType: `${profile.primaryArchetype.label} | ${discStyle.styleLabel} | ${strengthsPattern.patternLabel}`,
    discStyle: discStyle.styleLabel,
    strengthsPattern: strengthsPattern.patternLabel,
    workingGeniusPattern: geniusPattern.patternLabel,
    fitTags,
    interviewFocus,
    riskFlags
  };
}

function classifyDiscStyle(disc) {
  const primary = disc.primary || { key: "", label: "N/A", pct: 0 };
  const secondary = disc.secondary || { key: "", label: "N/A", pct: 0 };
  const spread = Math.max(0, Number(primary.pct || 0) - Number(secondary.pct || 0));
  const primaryStyle = DISC_STYLE_LABELS[primary.key] || primary.label;

  if (spread <= DISC_BLEND_MARGIN && secondary.key) {
    const secondaryStyle = DISC_STYLE_LABELS[secondary.key] || secondary.label;
    return { styleLabel: `${primaryStyle}-${secondaryStyle} Blend`, spread };
  }

  return { styleLabel: primaryStyle, spread };
}

function classifyStrengthsPattern(strengths) {
  const topTwo = strengths.topTwo || [];
  if (topTwo.length < 2) return { patternLabel: topTwo[0]?.label || "N/A" };

  const pair = buildPairKey(topTwo[0].key, topTwo[1].key);
  const patternLabel = STRENGTHS_PAIR_LABELS[pair] || `${topTwo[0].label} + ${topTwo[1].label}`;
  return { patternLabel };
}

function classifyGeniusPattern(workingGenius) {
  const topTwo = workingGenius.topTwo || [];
  if (topTwo.length < 2) return { patternLabel: topTwo[0]?.label || "N/A" };

  const pair = buildPairKey(topTwo[0].key, topTwo[1].key);
  const patternLabel = GENIUS_PAIR_LABELS[pair] || `${topTwo[0].label} + ${topTwo[1].label}`;
  return { patternLabel };
}

function deriveFitTags(profile) {
  const tags = [];
  const discPrimaryKey = profile.disc.primary?.key || "";
  const topStrengthKeys = (profile.strengths.topTwo || []).map((x) => x.key);
  const topGeniusKeys = (profile.workingGenius.topTwo || []).map((x) => x.key);

  if ((discPrimaryKey === "D" || discPrimaryKey === "C") && topStrengthKeys.includes("EXEC")) {
    tags.push("Ops Execution");
  }
  if (topStrengthKeys.includes("REL") || discPrimaryKey === "S_DISC") {
    tags.push("People Leadership");
  }
  if (topStrengthKeys.includes("STRAT") || topGeniusKeys.includes("WG_W") || topGeniusKeys.includes("WG_I")) {
    tags.push("Systems Strategy");
  }
  if (topStrengthKeys.includes("INFL") || topGeniusKeys.includes("WG_G")) {
    tags.push("Change Leadership");
  }
  if (topGeniusKeys.includes("WG_T") || topGeniusKeys.includes("WG_E")) {
    tags.push("Delivery Reliability");
  }

  if (!tags.length) tags.push("General Management Potential");
  return Array.from(new Set(tags));
}

function deriveInterviewFocus(fitTags) {
  const prompts = [];

  if (fitTags.includes("Ops Execution")) {
    prompts.push("Ask for a project they owned from kickoff to completion with measurable outcomes.");
  }
  if (fitTags.includes("People Leadership")) {
    prompts.push("Probe coaching style, conflict handling, and retention impact on prior teams.");
  }
  if (fitTags.includes("Systems Strategy")) {
    prompts.push("Ask for a process they redesigned and how they validated improvement.");
  }
  if (fitTags.includes("Change Leadership")) {
    prompts.push("Probe how they drove buy-in during a difficult change rollout.");
  }
  if (fitTags.includes("Delivery Reliability")) {
    prompts.push("Validate deadline discipline and escalation behavior when plans slip.");
  }

  return prompts.slice(0, 3);
}

function deriveRiskFlags(profile, discStyle) {
  const flags = [];

  if (profile.rapidFlag) flags.push("Rapid completion");
  if (profile.completionPct < 90) flags.push("Low completion rate");
  if ((profile.mbti.balanceCount || 0) >= 2) flags.push("Multiple balanced MBTI pairs");
  if ((discStyle.spread || 0) <= DISC_BLEND_MARGIN) flags.push("DISC top style is blended");

  const geniusRanking = profile.workingGenius.ranking || [];
  if (geniusRanking.length >= 2) {
    const spread = Number(geniusRanking[0].pct || 0) - Number(geniusRanking[geniusRanking.length - 1].pct || 0);
    if (spread < 12) flags.push("Working Genius profile is relatively flat");
  }

  return flags;
}

function buildPairKey(a, b) {
  return [String(a || ""), String(b || "")].sort().join("_");
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

  const local = parts[0];
  const domain = parts[1].toLowerCase();

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

function shuffleWithinModels(input) {
  const out = [];
  MODEL_ORDER.forEach((model) => {
    const subset = input.filter((q) => q.model === model);
    shuffleInPlace(subset);
    out.push(...subset);
  });
  return out;
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
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
