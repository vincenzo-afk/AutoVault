export function computeCondition(spec) {
  const value = spec.spec_value;
  const standard = spec.standard_value;
  const tolPlus = spec.tolerance_plus;
  const tolMinus = spec.tolerance_minus;

  if (!standard || standard === 0) return 'Normal';
  if (value == null) return 'Warning';

  const upperBound = standard + (tolPlus || 0);
  const lowerBound = standard - (tolMinus || 0);

  if (value >= lowerBound && value <= upperBound) return 'Normal';
  if (value < lowerBound * 0.9 || value > upperBound * 1.1) return 'Critical';
  return 'Warning';
}
