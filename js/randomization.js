function randomizeProduct() {
  return Math.random() > 0.5 ? "A19" : "K87";
}

async function assignRandomization(patientId, visitNumber) {

  const product = randomizeProduct();

  await addRecord("auditLogs", {
    logId: `RAND-${Date.now()}`,
    patientId: patientId,
    visitNumber: visitNumber,
    product: product,
    timestamp: new Date().toISOString()
  });

  return product;
}
