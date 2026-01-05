async function initVisits(patientId) {
  const visits = [
    "Screening",
    "Baseline",
    "Test Treatment 1",
    "Baseline (Crossover)",
    "Test Treatment 2"
  ];

  for (let i = 0; i < visits.length; i++) {
    await addRecord("visits", {
      patientId,
      visitNo: i + 1,
      visitName: visits[i],
      status: "Pending",
      data: {}
    });
  }
}
