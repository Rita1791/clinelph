/* ================================
   VISIT 1 – SCREENING LOGIC (CRF)
================================ */

async function saveScreeningCRF(patientId, form) {
  const patients = await getAllRecords("patients");
  const patient = patients.find(p => p.patientId === patientId);

  // AGE CHECK
  if (form.age < 18 || form.age > 60) {
    return failScreening(patientId, "Age not between 18–60");
  }

  // INCLUSION / EXCLUSION
  if (!form.inclusion || !form.exclusion) {
    return failScreening(patientId, "Inclusion/Exclusion criteria failed");
  }

  // PREGNANCY CHECK
  if (form.gender === "Female" && form.pregnancyResult === "Positive") {
    return failScreening(patientId, "Positive pregnancy test");
  }

  // NINHYDRIN
  if (form.ninhydrinOD <= 0.35) {
    return failScreening(patientId, "Ninhydrin OD ≤ 0.35");
  }

  // SAVE VISIT DATA
  const visits = await getAllRecords("visits");
  const v1 = visits.find(v => v.patientId === patientId && v.visitNo === 1);

  v1.data = form;
  v1.status = "Completed";
  v1.visitDate = form.screeningDate;

  await updateRecord("visits", v1);

  patient.status = "Eligible";
  patient.currentVisit = 2;
  await updateRecord("patients", patient);

  return { ok: true };
}

/* -------- SCREEN FAILURE -------- */
async function failScreening(patientId, reason) {
  const visits = await getAllRecords("visits");
  const v1 = visits.find(v => v.patientId === patientId && v.visitNo === 1);

  v1.status = "Failed";
  await updateRecord("visits", v1);

  const patients = await getAllRecords("patients");
  const patient = patients.find(p => p.patientId === patientId);
  patient.status = "Screen Failure";
  await updateRecord("patients", patient);

  await addRecord("events", {
    patientId,
    visit: "Screening",
    date: new Date().toISOString(),
    reason
  });

  return { ok: false, reason };
}

/* -------- ADVERSE EVENT -------- */
async function reportAE(patientId, ae) {
  ae.patientId = patientId;
  ae.reportedAt = new Date().toISOString();
  await addRecord("adverseEvents", ae);
}

/* -------- WITHDRAWAL -------- */
async function withdrawPatient(patientId, reason) {
  const patients = await getAllRecords("patients");
  const patient = patients.find(p => p.patientId === patientId);
  patient.status = "Withdrawn";
  await updateRecord("patients", patient);

  await addRecord("withdrawals", {
    patientId,
    reason,
    date: new Date().toISOString()
  });
}

/* ================================
   VISIT 2 – BASELINE (CHECK-IN / CHECK-OUT)
================================ */

async function saveBaselineCheckIn(patientId, form) {
  const visits = await getAllRecords("visits");
  const v2 = visits.find(v => v.patientId === patientId && v.visitNo === 2);

  // 12-hour gap between brushing & sample
  const gapHours =
    (new Date(form.sampleTime) - new Date(form.brushingTime)) / 36e5;

  if (gapHours < 12) {
    return { ok: false, reason: "12-hour gap required between brushing and sample" };
  }

  v2.data.checkIn = form;
  v2.status = "Check-in Completed";
  await updateRecord("visits", v2);

  return { ok: true };
}

async function saveBaselineCheckOut(patientId, form) {
  const visits = await getAllRecords("visits");
  const v2 = visits.find(v => v.patientId === patientId && v.visitNo === 2);

  // 30-minute gap after sample collection
  const gapMinutes =
    (new Date(form.analysisTime) - new Date(form.sampleCollectionTime)) / 60000;

  if (gapMinutes < 30) {
    return { ok: false, reason: "30-minute gap required before analysis" };
  }

  // Randomization
  form.productCode = Math.random() > 0.5 ? "A19" : "K87";

  v2.data.checkOut = form;
  v2.status = "Completed";
  v2.visitDate = form.checkOutDate;

  await updateRecord("visits", v2);

  // Move patient to Visit 3
  const patients = await getAllRecords("patients");
  const p = patients.find(p => p.patientId === patientId);
  p.currentVisit = 3;
  p.status = "Ongoing";
  await updateRecord("patients", p);

  return { ok: true };
}

