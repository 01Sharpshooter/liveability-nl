const CSVColumns = Object.freeze({
  SCORE18: "KL18",
  DEVELOPMENT1418: "VKL1418",
  HOUSES12: "RLBWON12",
  RESIDENTS12: "RLBBEV12",
  SERVICES12: "RLBVRZ12",
  SAFETY12: "RLBVEI12",
  ENVIRONMENT12: "RLBFYS12",
  HOUSES14: "RLBWON14",
  RESIDENTS14: "RLBBEV14",
  SERVICES14: "RLBVRZ14",
  SAFETY14: "RLBVEI14",
  ENVIRONMENT14: "RLBFYS14",
  HOUSES16: "RLBWON16",
  RESIDENTS16: "RLBBEV16",
  SERVICES16: "RLBVRZ16",
  SAFETY16: "RLBVEI16",
  ENVIRONMENT16: "RLBFYS16",
  HOUSES18: "RLBWON18",
  RESIDENTS18: "RLBBEV18",
  SERVICES18: "RLBVRZ18",
  SAFETY18: "RLBVEI18",
  ENVIRONMENT18: "RLBFYS18"
});

const LiveabilityScoreMeaning = Object.freeze({
  1: "Very Insufficient",
  2: "Insufficient",
  3: "Slightly Insufficient",
  4: "Weak",
  5: "Mostly Sufficient",
  6: "Sufficient",
  7: "Good",
  8: "Very Good",
  9: "Exceptional"
});

const DevelopmentScoreMeaning = Object.freeze({
  1: "Big Decline",
  2: "Decline",
  3: "Small Decline",
  4: "No Changes",
  5: "Small Progress",
  6: "Significant Progress",
  7: "Huge Progress"
});

const ChartCategories = Object.freeze({
  HOUSES: { label: "Houses", color: "#3e95cd" },
  RESIDENTS: { label: "Residents", color: "#8e5ea2" },
  SERVICES: { label: "Services", color: "#3cba9f" },
  SAFETY: { label: "Safety", color: "#F1C40F" },
  ENVIRONMENT: { label: "Environment", color: "#c45850" }
});

const AppMessages = Object.freeze({
  READ_ENABLED: "Read Enabled"
});

const AppSettings = Object.freeze({
  LIVEABILITY_REGIONS_ENABLED: "Liveability Regions Enabled"
});