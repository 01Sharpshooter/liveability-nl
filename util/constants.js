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

const LiveabilityClasses = Object.freeze({
  1: { meaning: "Very Insufficient", backgroundColor: "#730000", fontColor: "ghostwhite" },
  2: { meaning: "Insufficient", backgroundColor: "#e50000", fontColor: "ghostwhite" },
  3: { meaning: "Slightly Insufficient", backgroundColor: "#e1702e", fontColor: "ghostwhite" },
  4: { meaning: "Weak", backgroundColor: "#ffffbe", fontColor: "inherit" },
  5: { meaning: "Mostly Sufficient", backgroundColor: "#d3ffbe", fontColor: "inherit" },
  6: { meaning: "Sufficient", backgroundColor: "#93e667", fontColor: "inherit" },
  7: { meaning: "Good", backgroundColor: "#55be00", fontColor: "#002a15" },
  8: { meaning: "Very Good", backgroundColor: "#267300", fontColor: "ghostwhite" },
  9: { meaning: "Exceptional", backgroundColor: "#2d4900", fontColor: "ghostwhite" }
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

const AppSettings = Object.freeze({
  LIVEABILITY_REGIONS_ENABLED: "LIVEABILITY_REGIONS_ENABLED",
  MIN_LIVEABILITY_SCORE: "MIN_LIVEABILITY_SCORE",
  MIN_DEVELOPMENT_SCORE: "MIN_DEVELOPMENT_SCORE",
  MIN_HOUSES_SCORE: "MIN_HOUSES_SCORE",
  MIN_RESIDENTS_SCORE: "MIN_RESIDENTS_SCORE",
  MIN_SERVICES_SCORE: "MIN_SERVICES_SCORE",
  MIN_SAFETY_SCORE: "MIN_SAFETY_SCORE"
});