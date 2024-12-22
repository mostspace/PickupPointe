const toRad = (degree) => {
  return (degree * Math.PI) / 180;
};

const haversineDistance = (lat1, lon1, lat2, lon2, unit = "km") => {
  const R = unit === "km" ? 6371 : 3958.8; // Radius of the Earth in kilometers or miles

  // Convert latitude and longitude from degrees to radians
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  // Haversine formula
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate the distance
  const distance = R * c;
  return distance;
};

module.exports = {
  haversineDistance,
};
