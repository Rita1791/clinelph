// js/visits.js

async function initVisits(patientId) {
  const visitList = [
    { no: 1, name: "Screening" },
    { no: 2, name: "Baseline" },
    { no: 3, name: "Test Treatment 1" },
    { no: 4, name: "Baseline (Crossover)" },
    { no: 5, name: "Test Treatment 2" }
  ];

  for (const v of visitList) {
    await addRecord("visits", {
      patientId: patientId,
      visitNo: v.no,
      visitName: v.name,
      status: "Pending",
      data: {}
    });
  }
}

async function getVisit(patientId, visitNo) {
  const all = await getAllRecords("visits");
  return all.find(v =>
    v.patientId === patientId && v.visitNo === visitNo
  );
}

async function getVisitsForPatient(patientId) {
  const all = await getAllRecords("visits");
  return all
    .filter(v => v.patientId === patientId)
    .sort((a, b) => a.visitNo - b.visitNo);
}
