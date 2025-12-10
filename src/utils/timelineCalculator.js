/**
 * Timeline Calculator
 * Computes AGI, Superintelligence, and ASI arrival dates based on lever values
 *
 * Baseline predictions:
 * - AGI: 2027 (based on AI-2027 research)
 * - Superintelligence: 2035
 * - ASI: 2043
 *
 * Current date: December 2025
 * Minimum AGI: December 2026 (1 year from now)
 *
 * @version 2.0.0
 * @optimized Performance improvements with input validation
 */

// Lever weights - how many years each lever point shifts the timeline
// Positive lever values = acceleration (earlier arrival)
const LEVER_WEIGHTS = {
  // Development factors (accelerate)
  aiRnD: { agi: 0.35, super: 0.4, asi: 0.45 },
  computeGrowth: { agi: 0.3, super: 0.35, asi: 0.4 },
  algorithmic: { agi: 0.45, super: 0.5, asi: 0.55 },
  dataAvailability: { agi: 0.2, super: 0.25, asi: 0.25 },
  
  // Competition factors (accelerate)
  geopolitical: { agi: 0.3, super: 0.35, asi: 0.35 },
  talent: { agi: 0.2, super: 0.2, asi: 0.2 },
  corporateRace: { agi: 0.35, super: 0.4, asi: 0.4 },
  energy: { agi: 0.15, super: 0.2, asi: 0.25 },
  
  // Safety factors (decelerate with positive values)
  safety: { agi: -0.25, super: -0.3, asi: -0.35 },
  alignment: { agi: -0.2, super: -0.35, asi: -0.45 },
  regulation: { agi: -0.35, super: -0.4, asi: -0.45 },
  internationalCoord: { agi: -0.3, super: -0.35, asi: -0.4 },
  
  // Wildcard factors
  economicPressure: { agi: 0.2, super: 0.25, asi: 0.25 },
  publicSentiment: { agi: -0.15, super: -0.15, asi: -0.15 },
  blackSwan: { agi: 0.5, super: 0.6, asi: 0.7 },
};

// Baseline years
const BASELINE_AGI = 2027;
const BASELINE_SUPER = 2035;
const BASELINE_ASI = 2043;

// Constraints (we're in Dec 2025)
const CURRENT_YEAR = 2025.95; // Late December 2025
const MIN_AGI_YEAR = 2026.95; // December 2026 minimum

/**
 * Calculate the predicted years for AGI/Superintelligence/ASI based on lever values
 * @param {Object} levers - Lever values object
 * @param {number} levers[leverName] - Lever value (-5 to 5)
 * @returns {Object} Object with agiYear, superYear, asiYear
 */
export function calculateTimeline(levers) {
  // Input validation
  if (!levers || typeof levers !== 'object') {
    console.warn('Invalid levers object, using defaults');
    levers = {};
  }

  let agiDelta = 0;
  let superDelta = 0;
  let asiDelta = 0;

  // Calculate timeline shifts with input validation
  for (const [leverName, value] of Object.entries(levers)) {
    const weight = LEVER_WEIGHTS[leverName];
    if (weight && typeof value === 'number' && !isNaN(value)) {
      agiDelta += value * weight.agi;
      superDelta += value * weight.super;
      asiDelta += value * weight.asi;
    }
  }

  // Apply deltas (positive lever = acceleration = subtract years)
  let agiYear = BASELINE_AGI - agiDelta;
  let superYear = BASELINE_SUPER - superDelta;
  let asiYear = BASELINE_ASI - asiDelta;

  // Enforce minimum constraints
  agiYear = Math.max(agiYear, MIN_AGI_YEAR);
  
  // Superintelligence must be at least 1 year after AGI
  superYear = Math.max(superYear, agiYear + 1);
  
  // ASI must be at least 1 year after Superintelligence
  asiYear = Math.max(asiYear, superYear + 1);

  // Round to one decimal
  agiYear = Math.round(agiYear * 10) / 10;
  superYear = Math.round(superYear * 10) / 10;
  asiYear = Math.round(asiYear * 10) / 10;

  return { agiYear, superYear, asiYear };
}

/**
 * Generate data points for the D3 chart
 * Creates an S-curve progression from current AI to ASI
 * @param {number} agiYear - AGI arrival year
 * @param {number} superYear - Superintelligence arrival year
 * @param {number} asiYear - ASI arrival year
 * @returns {Array} Array of data points {x, y}
 */
export function generateChartData(agiYear, superYear, asiYear) {
  // Input validation
  if (typeof agiYear !== 'number' || typeof superYear !== 'number' || typeof asiYear !== 'number' ||
      isNaN(agiYear) || isNaN(superYear) || isNaN(asiYear)) {
    console.warn('Invalid timeline values, using defaults');
    return [];
  }

  const startYear = CURRENT_YEAR;
  const endYear = Math.max(2060, asiYear + 10);
  const points = [];

  const currentCapability = 0.22; // Current state (late 2025)

  // Use larger step for better performance while maintaining visual quality
  const step = 0.25;

  for (let year = startYear; year <= endYear; year += step) {
    let capability;

    if (year <= CURRENT_YEAR) {
      capability = currentCapability;
    } else if (year < agiYear) {
      // Pre-AGI: gradual increase to 0.45
      const progress = (year - CURRENT_YEAR) / (agiYear - CURRENT_YEAR);
      capability = currentCapability + (0.45 - currentCapability) * easeInOut(progress);
    } else if (year < superYear) {
      // AGI to Superintelligence: 0.45 to 0.65
      const progress = (year - agiYear) / (superYear - agiYear);
      capability = 0.45 + 0.2 * easeInOut(progress);
    } else if (year < asiYear) {
      // Superintelligence to ASI: 0.65 to 0.85
      const progress = (year - superYear) / (asiYear - superYear);
      capability = 0.65 + 0.2 * easeInOut(progress);
    } else {
      // Post-ASI: approaches 1.0 asymptotically
      const yearsAfterASI = year - asiYear;
      capability = 0.85 + 0.15 * (1 - Math.exp(-yearsAfterASI / 2));
    }

    points.push({ x: year, y: capability });
  }

  return points;
}

/**
 * Generate milestone markers for the graph
 * @param {number} agiYear - AGI arrival year
 * @param {number} superYear - Superintelligence/ASI arrival year (kept for compatibility)
 * @param {number} asiYear - ASI arrival year (ASI and Superintelligence are equivalent)
 * @returns {Array} Array of milestone objects
 */
export function generateMilestones(agiYear, superYear, asiYear) {
  // Input validation
  if (typeof agiYear !== 'number' || typeof superYear !== 'number' || typeof asiYear !== 'number' ||
      isNaN(agiYear) || isNaN(superYear) || isNaN(asiYear)) {
    console.warn('Invalid timeline values for milestones');
    return [];
  }

  // ASI and Superintelligence are treated as equivalent - show single combined milestone
  return [
    { year: agiYear, level: 0.45, label: 'AGI', color: '#00f0ff' },
    { year: asiYear, level: 0.85, label: 'ASI/Superintelligence', color: '#ec4899' },
  ];
}

function easeInOut(t) {
  return t < 0.5 
    ? 2 * t * t 
    : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Determine scenario based on lever values
 * @param {Object} levers - Lever values object
 * @returns {string} Scenario name ('utopian', 'race', 'slowdown', 'uncontrolled')
 */
export function determineScenario(levers) {
  // Input validation
  if (!levers || typeof levers !== 'object') {
    return 'race';
  }

  const safetyScore = (levers.safety || 0) + (levers.alignment || 0) +
                      (levers.regulation || 0) + (levers.internationalCoord || 0);
  const raceScore = (levers.geopolitical || 0) + (levers.corporateRace || 0);
  const devScore = (levers.aiRnD || 0) + (levers.computeGrowth || 0) + (levers.algorithmic || 0);

  if (safetyScore >= 10 && raceScore <= 0) {
    return 'slowdown';
  } else if (safetyScore >= 6 && devScore >= 4) {
    return 'utopian';
  } else if (raceScore >= 6 && safetyScore <= 0) {
    return 'uncontrolled';
  }
  return 'race';
}

/**
 * Format year for display
 * @param {number} year - Year to format
 * @returns {string} Formatted year string
 */
export function formatYear(year) {
  // Input validation
  if (typeof year !== 'number' || isNaN(year)) {
    return 'Invalid year';
  }

  const wholeYear = Math.floor(year);
  const decimal = year - wholeYear;

  if (decimal < 0.25) return `Early ${wholeYear}`;
  if (decimal < 0.5) return `Mid ${wholeYear}`;
  if (decimal < 0.75) return `Late ${wholeYear}`;
  return `Late ${wholeYear}`;
}

/**
 * Get time remaining until milestone
 * @param {number} targetYear - Target year to calculate remaining time
 * @returns {string} Human-readable time remaining string
 */
export function getTimeRemaining(targetYear) {
  // Input validation
  if (typeof targetYear !== 'number' || isNaN(targetYear)) {
    return 'Unknown';
  }

  const yearsRemaining = targetYear - CURRENT_YEAR;
  if (yearsRemaining < 1) return 'Less than 1 year';
  if (yearsRemaining < 2) return `~${Math.round(yearsRemaining * 12)} months`;
  return `~${Math.round(yearsRemaining)} years`;
}
