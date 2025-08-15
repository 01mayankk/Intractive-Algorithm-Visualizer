/**
 * Utility functions for handling animation delays and speed constraints
 */

// Minimum animation duration in milliseconds
export const MIN_ANIMATION_DURATION = 100;

/**
 * Ensures the speed value never goes below the minimum animation duration
 * @param {number} speed - The requested speed in milliseconds
 * @returns {number} - The constrained speed value (minimum 100ms)
 */
export const constrainSpeed = (speed) => {
  return Math.max(MIN_ANIMATION_DURATION, speed);
};

/**
 * Creates a delay promise with constrained speed
 * @param {number} speed - The requested speed in milliseconds
 * @returns {Promise} - Promise that resolves after the constrained delay
 */
export const createDelay = (speed) => {
  const constrainedSpeed = constrainSpeed(speed);
  return new Promise(resolve => setTimeout(resolve, constrainedSpeed));
};

/**
 * Validates and returns a safe speed value
 * @param {number} speed - The requested speed in milliseconds
 * @returns {number} - The validated speed value
 */
export const validateSpeed = (speed) => {
  if (typeof speed !== 'number' || isNaN(speed)) {
    return MIN_ANIMATION_DURATION;
  }
  return constrainSpeed(speed);
};
