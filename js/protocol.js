const PROTOCOL = {
  code: "CLP-001",

  visits: [
    { no: 1, name: "Screening", gap: 0 },
    { no: 2, name: "Baseline", gap: 7 },
    { no: 3, name: "Test Treatment 1", gap: 28 },
    { no: 4, name: "Baseline (Crossover)", gap: 7 },
    { no: 5, name: "Test Treatment 2", gap: 28 }
  ],

  ageRange: { min: 18, max: 60 },
  ninhydrinCutoff: 0.35
};

function daysBetween(a, b) {
  return Math.floor((new Date(b) - new Date(a)) / 86400000);
}
