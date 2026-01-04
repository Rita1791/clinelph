function initializeVisit1(patientId) {
  const visit = {
    visitId: `VISIT-${patientId}-V1`,
    patientId: patientId,
    visitNumber: 1,
    visitType: "Screening",
    visitStatus: "Not Started",
    screening: {}
  };

  addRecord("visits", visit);
}
async function loadVisit(patientId, visitNumber) {
  const visits = await getAllRecords("visits");
  return visits.find(v =>
    v.patientId === patientId && v.visitNumber === visitNumber
  );
}
async function saveScreeningData(visit, data) {

  visit.visitStatus = "In Progress";

  visit.screening = {
    screeningDate: data.screeningDate,
    inclusionCriteriaPassed: data.inclusion,
    exclusionCriteriaPassed: data.exclusion,
    vitals: {
      bp: data.bp,
      pulse: data.pulse
    },
    pregnancyTest: data.pregnancyTest,
    ninhydrinOD: data.ninhydrin
  };

  // VALIDATIONS
  if (!data.inclusion || !data.exclusion) {
    return failVisit(visit, "Inclusion/Exclusion criteria not met");
  }

  if (visit.screening.ninhydrinOD <= 0.35) {
    return failVisit(visit, "Ninhydrin OD below threshold");
  }

  if (data.gender === "Female" && data.pregnancyTest === "Positive") {
    return failVisit(visit, "Positive pregnancy test");
  }

  // PASSED SCREENING
  visit.visitStatus = "Completed";
  await updateRecord("visits", visit);

  await promotePatientToNextVisit(visit.patientId, 2);
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
    patientId: patientId,
    visitNumber: visitNumber,
    visitType: visitTypes[visitNumber],
    visitStatus: "Not Started"
  };

  addRecord("visits", visit);
}
async function saveCheckIn(visit, data) {

  visit.checkIn = data;
  visit.visitStatus = "In Progress";

  if (!hasTimeGap(data.brushingTime, data.sampleTime, 12 * 60)) {
    throw new Error("12-hour gap required between brushing and sample");
  }

  await updateRecord("visits", visit);
}
async function saveCheckOut(visit, data) {

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
async function loadVisitForm(visitNumber) {
  const visit = await loadVisit(currentPatientId, visitNumber);

  if (visit.visitNumber === 1) {
    loadScreeningForm(visit);
  } else {
    loadCheckInForm(visit);
  }
}
function loadScreeningForm(visit) {
  document.getElementById("tab-content").innerHTML = `
    <h3>Visit 1 – Screening</h3>

    <label>Ninhydrin OD</label>
    <input id="ninhydrin" type="number" step="0.01">

    <label>Pregnancy Test</label>
    <select id="pregTest">
      <option>Negative</option>
      <option>Positive</option>
    </select>

    <button onclick="submitScreening()">Save Screening</button>
  `;
}
async function submitScreening() {
  const visit = await loadVisit(currentPatientId, 1);

  const data = {
    ninhydrin: parseFloat(document.getElementById("ninhydrin").value),
    pregnancyTest: document.getElementById("pregTest").value,
    gender: (await getPatient(currentPatientId)).gender
  };

  try {
    await saveScreeningData(visit, data);
    alert("Screening Passed. Visit 2 initialized.");
    location.reload();
  } catch (err) {
    alert(err.message);
  }
}
function loadCheckInForm(visit) {
  document.getElementById("tab-content").innerHTML = `
    <h3>Visit ${visit.visitNumber} – Check-in</h3>

    <label>Brushing Time</label>
    <input id="brushTime" type="datetime-local">

    <label>Sample Time</label>
    <input id="sampleTime" type="datetime-local">

    <button onclick="submitCheckIn()">Save Check-in</button>
  `;
}
async function submitCheckIn() {
  const visit = await loadVisit(currentPatientId, currentVisitNumber);

  const data = {
    brushingTime: document.getElementById("brushTime").value,
    sampleTime: document.getElementById("sampleTime").value
  };

  try {
    await saveCheckIn(visit, data);
    alert("Check-in saved");
  } catch (err) {
    alert(err.message);
  }
}
async function submitCheckOut() {
  const visit = await loadVisit(currentPatientId, currentVisitNumber);

  const data = {
    sampleCollectedAt: document.getElementById("sampleCollectedAt").value,
    analysisAt: document.getElementById("analysisAt").value
  };

  try {
    await saveCheckOut(visit, data);
    alert("Visit completed");
    location.reload();
  } catch (err) {
    alert(err.message);
  }
}

