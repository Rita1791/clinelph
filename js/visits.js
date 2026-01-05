const VISITS = [
  { no: 1, name: "Screening" },
  { no: 2, name: "Baseline" },
  { no: 3, name: "Test Treatment 1" },
  { no: 4, name: "Baseline" },
  { no: 5, name: "Test Treatment 2" }
];

async function initVisits(patientId) {
  VISITS.forEach(v => {
    addRecord("visits", {
      patientId,
      visitNo: v.no,
      visitName: v.name,
      status: "Pending",
      data: {}
    });
  });
}

async function getVisit(patientId, visitNo) {
  const visits = await getAllRecords("visits");
  return visits.find(v => v.patientId === patientId && v.visitNo === visitNo);
}
