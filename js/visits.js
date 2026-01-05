function initVisits(patientId) {
  const visits = [
    "Screening",
    "Baseline",
    "Test Treatment 1",
    "Baseline (Crossover)",
    "Test Treatment 2"
  ];

  visits.forEach((name, index) => {
    add("visits", {
      patientId,
      visitNo: index + 1,
      visitName: name,
      status: "Pending",
      data: {}
    });
  });
}

async function getVisit(patientId, visitNo) {
  const all = await getAll("visits");
  return all.find(v => v.patientId === patientId && v.visitNo === visitNo);
}
