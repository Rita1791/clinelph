/* =========================
   VISIT PROTOCOL DEFINITIONS
========================= */

const VISIT_PROTOCOL = {
  1: { name: "Screening", gapFromPrev: 0 },
  2: { name: "Baseline", gapFromPrev: 7 },
  3: { name: "Test Treatment 1", gapFromPrev: 28 },
  4: { name: "Baseline (Crossover)", gapFromPrev: 7 },
  5: { name: "Test Treatment 2", gapFromPrev: 28 }
};

/* =========================
   VISIT INITIALIZATION
========================= */
async function initVisits(patientId) {
  for (let i = 1; i <= 5; i++) {
    await addRecord("visits", {
      patientId,
      visitNo: i,
      visitName: VISIT_PROTOCOL[i].name,
      status: "Pending",
      visitDate: null,
      data: {}
    });
  }
}

/* =========================
   LOAD VISITS
========================= */
async function getVisitsForPatient(patientId) {
  const all = await getAllRecords("visits");
  return all
    .filter(v => v.patientId === patientId)
    .sort((a, b) => a.visitNo - b.visitNo);
}

async function getVisit(patientId, visitNo) {
  const visits = await getVisitsForPatient(patientId);
  return visits.find(v => v.visitNo === visitNo);
}

/* =========================
   GAP ENFORCEMENT
========================= */
function daysBetween(d1, d2) {
  return Math.floor(
    (new Date(d2) - new Date(d1)) / (1000 * 60 * 60 * 24)
  );
}

async function canStartVisit(patientId, visitNo) {
  if (visitNo === 1) return { ok: true };

  const prev = await getVisit(patientId, visitNo - 1);
  if (!prev || prev.status !== "Completed") {
    return { ok: false, msg: "Previous visit not completed" };
  }

  const gap = VISIT_PROTOCOL[visitNo].gapFromPrev;
  const days = daysBetween(prev.visitDate, new Date());

  if (days < gap) {
    return {
      ok: false,
      msg: `Protocol violation: ${gap} days gap required (only ${days} days passed)`
    };
  }

  return { ok: true };
}

/* =========================
   SCREENING ELIGIBILITY
========================= */
function evaluateScreening(data) {
  if (data.age < 18 || data.age > 60)
    return "Age out of range";

  if (!data.inclusion || !data.exclusion)
    return "Inclusion/Exclusion criteria failed";

  if (data.gender === "Female" && data.pregnancy === "Positive")
    return "Positive pregnancy test";

  if (data.ninhydrin <= 0.35)
    return "Ninhydrin OD below threshold";

  return "Eligible";
}

/* =========================
   RANDOMIZATION
========================= */
function randomizeProduct(previous) {
  if (!previous) {
    return Math.random() > 0.5 ? "A19" : "K87";
  }
  return previous === "A19" ? "K87" : "A19";
}
