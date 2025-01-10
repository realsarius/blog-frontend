/**
 * @jest-environment jsdom
 */

describe('Average calculation', () => {
  function calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
  }

  it('should calculate the average of an array of numbers', () => {
    const numbers = [1, 2, 3, 4, 5];
    const result = calculateAverage(numbers);
    expect(result).toBe(3);  // (1+2+3+4+5) / 5 = 3
  });

  it('should return 0 if the array is empty', () => {
    const numbers = [];
    const result = calculateAverage(numbers);
    expect(result).toBe(0);  // No numbers, should return 0
  });

  it('should return the number itself if there is only one number', () => {
    const numbers = [42];
    const result = calculateAverage(numbers);
    expect(result).toBe(42);  // Only one number, average is the number itself
  });

  it('should handle negative numbers correctly', () => {
    const numbers = [-1, -2, -3, -4, -5];
    const result = calculateAverage(numbers);
    expect(result).toBe(-3);  // (-1+-2+-3+-4+-5) / 5 = -3
  });
});
