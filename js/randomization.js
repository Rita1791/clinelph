function randomizeProduct(previous = null) {
  const products = ["A19", "K87"];
  if (!previous) {
    return products[Math.floor(Math.random() * 2)];
  }
  return products.find(p => p !== previous);
}
