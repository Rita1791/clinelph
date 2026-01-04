// js/visits.js

/* ---------- VISIT INITIALIZATION ---------- */

function initializeVisit1(patientId) {
  const visit = {
    visitId: `VISIT-${patientId}-V1`,
    patientId,
    visitNumber: 1,
    visitType: "Screening",
    visitStatus: "Not Started",
    screening: {}
  };

  return addRecord("visits", visit);
}

function initializeVisit(patientId, visitNumber) {
  const visitTypes = {
    1: "Screening",
    2: "Baseline",
    3: "Test Treatment 1",
    4: "Baseline",
    5: "Test Treatment 2"
  };

  const visit = {
    visitId: `VISIT-${patientId}-V${visitNumber}`,
    patientId,
    visitNumber,
    visitType: visitTypes[visitNumber],
    visitStatus: "Not Started"
  };

  return addRecord("visits", visit);
}

/* ---------- LOAD VISIT ---------- */

async function loadVisit(patientId, visitNumber) {
  const visits = await getAllRecords("visits");
  return visits.find(v =>
    v.patientId === patientId && v.visitNumber === visitNumber
  ) || null;
}

/* ---------- VISIT 1: SCREENING ---------- */

async function saveScreeningData(visit, data) {
  if (!visit) throw new Error("Visit not found");

  visit.visitStatus = "In Progress";

  visit.screening = {
    ninhydrinOD: data.ninhydrin,
    pregnancyTest: data.pregnancyTest
  };

  /* VALIDATIONS */
  if (visit.screening.ninhydrinOD <= 0.35) {
    return failVisit(visit, "Ninhydrin OD below threshold");
  }

  if (data.gender === "Female" && data.pregnancyTest === "Positive") {
    return failVisit(visit, "Positive pregnancy test");
  }

  /* PASSED SCREENING */
  visit.visitStatus = "Completed";
  await updateRecord("visits", visit);

  await promotePatientToNextVisit(visit.patientId, 2);
}

/* ---------- CHECK-IN ---------- */

async function saveCheckIn(visit, data) {
  if (!visit) throw new Error("Visit not found");

  if (!hasTimeGap(data.brushingTime, data.sampleTime, 12 * 60)) {
    throw new Error("12-hour gap required between brushing and sample");
  }

  visit.checkIn = data;
  visit.visitStatus = "In Progress";

  await updateRecord("visits", visit);
}

/* ---------- CHECK-OUT ---------- */

async function saveCheckOut(visit, data) {
  if (!visit) throw new Error("Visit not found");

  if (!hasTimeGap(data.sampleCollectedAt, data.analysisAt, 30)) {
    throw new Error("30-minute gap required before analysis");
  }

  visit.checkOut = data;
  visit.visitStatus = "Completed";

  await updateRecord("visits", visit);

  if (visit.visitNumber < 5) {
    await promotePatientToNextVisit(visit.patientId, visit.visitNumber + 1);
  } else {
    await updatePatientStatus(visit.patientId, "Completed");
  }
}
