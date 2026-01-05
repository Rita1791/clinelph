const VISITS = [
  { no: 1, name: "Screening", minGap: 0 },
  { no: 2, name: "Baseline", minGap: 7 },
  { no: 3, name: "Test Treatment 1", minGap: 28 },
  { no: 4, name: "Baseline (Crossover)", minGap: 7 },
  { no: 5, name: "Test Treatment 2", minGap: 28 }
];

function today() {
  return new Date().toISOString().split("T")[0];
}

function daysBetween(d1, d2) {
  const a = new Date(d1);
  const b = new Date(d2);
  return Math.floor((b - a) / (1000 * 60 * 60 * 24));
}

async function initVisits(patientId) {
  VISITS.forEach(v => {
    addRecord("visits", {
      patientId,
      visitNo: v.no,
      visitName: v.name,
      status: "Pending",
      visitDate: null,
      data: {}
    });
  });
}

async function getVisit(patientId, visitNo) {
  const visits = await getAllRecords("visits");
  return visits.find(v => v.patientId === patientId && v.visitNo === visitNo);
}

async function canStartVisit(patientId, visitNo) {
  if (visitNo === 1) return { ok: true };

  const prev = await getVisit(patientId, visitNo - 1);
  if (!prev || prev.status !== "Completed") {
    return { ok: false, msg: "Previous visit not completed" };
  }

  const gap = VISITS.find(v => v.no === visitNo).minGap;
  const diff = daysBetween(prev.visitDate, today());

  if (diff < gap) {
    return {
      ok: false,
      msg: `Minimum gap of ${gap} days required. Only ${diff} days passed.`
    };
  }

  return { ok: true };
}
