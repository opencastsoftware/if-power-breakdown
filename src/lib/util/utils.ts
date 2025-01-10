import {PowerBreakdownType} from '../api/interfaces/electricity-maps-interfaces';

export const calculatePercentageBreakdown = (
  breakdown: PowerBreakdownType
): {[key: string]: number} => {
  const total = Object.values(breakdown).reduce(
    (sum, value) => sum + (value || 0),
    0
  );
  const percentageBreakdown: {[key: string]: number} = {};

  for (const [key, value] of Object.entries(breakdown)) {
    if (value !== null) {
      percentageBreakdown[key] = Math.round((value / total) * 100);
    }
  }

  return percentageBreakdown;
};
