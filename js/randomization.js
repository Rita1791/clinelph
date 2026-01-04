function randomizeProduct(previous = null) {
  const products = ["A19", "K87"];
  if (!previous) {
    return products[Math.floor(Math.random() * 2)];
  }
  return products.find(p => p !== previous);
}
if (!canEdit()) {
  document.querySelectorAll("input, select, textarea, button")
    .forEach(el => el.disabled = true);
}
product.className = "status-ok";
