// Waste Impact Calculator
// Converts collected waste to environmental impact metrics

export const calculateImpact = (category, weight = 0) => {
  weight = Number(weight) || 0;

  const conversions = {
    'Plastic': {
      bottles: weight * 50,
      trees: weight * 0.02,
      co2: weight * 2.5
    },
    'Organic': {
      compost: weight * 0.8,
      trees: weight * 0.125,
      co2: weight * 0.5
    },
    'Paper': {
      sheets: weight * 17,
      trees: weight * 0.017,
      co2: weight * 1.5
    },
    'E-Waste': {
      devices: weight * 5,
      metals: weight * 0.7,
      co2: weight * 3
    },
    'Metal': {
      cans: weight * 20,
      energy: weight * 95,
      co2: weight * 2
    },
    'Glass': {
      bottles: weight * 3,
      energy: weight * 30,
      co2: weight * 0.8
    },
    'Clothes': {
      items: weight * 2,
      water: weight * 2700,
      co2: weight * 3.5
    }
  };

  return conversions[category] || { co2: weight * 1 };
};

// -------------------------------------------------------------

export const getTotalImpact = (pickups = []) => {
  let total = {
    co2: 0,
    trees: 0,
    bottles: 0,
    sheets: 0,
  };

  pickups.forEach(pickup => {
    const impact = calculateImpact(pickup.category, pickup.weight);

    total.co2 += impact.co2 || 0;
    total.trees += impact.trees || 0;
    total.bottles += impact.bottles || 0;
    total.sheets += impact.sheets || 0;
  });

  return {
    co2: total.co2.toFixed(2),
    trees: total.trees.toFixed(2),
    bottles: Math.floor(total.bottles),
    sheets: Math.floor(total.sheets)
  };
};

// -------------------------------------------------------------

export const getImpactMessage = (category, weight) => {
  const impact = calculateImpact(category, weight);

  // Helper: safe number formatter
  const safe = (value, decimals = 0) => {
    const n = Number(value);
    return Number.isFinite(n) ? n.toFixed(decimals) : (0).toFixed(decimals);
  };

  const messages = {
    'Plastic': `${safe(impact.bottles)} plastic bottles saved from landfills!`,
    'Organic': `Equivalent to planting ${safe(impact.trees, 2)} trees!`,
    'Paper': `${safe(impact.sheets)} sheets of paper saved!`,
    'E-Waste': `${safe(impact.devices)} electronic devices properly recycled!`,
    'Metal': `${safe(impact.cans)} aluminum cans recycled!`,
    'Glass': `${safe(impact.bottles)} glass bottles recycled!`,
    'Clothes': `${safe(impact.items)} clothing items saved from waste!`
  };

  // Default fallback message
  return messages[category] || `${safe(impact.co2, 2)} kg CO₂ saved!`;
};
