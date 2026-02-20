window.GMA_CONFIG = {
  // Deployed backend endpoint.
  submitEndpoint: "https://chill-pickle-gma-backend.onrender.com/api/submissions",

  // Keep false for candidate-facing mode; true shows local score details.
  showCandidateScore: false,

  // Version tag stored with each submission for analytics comparisons.
  testVersion: "mgmt-sys-v2-50q",

  // Keep this aligned with backend MIN_DURATION_MINUTES.
  minDurationMinutes: 15
};
