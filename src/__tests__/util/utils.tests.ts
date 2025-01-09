import {calculatePercentageBreakdown} from '../../lib/util/utils';
import {PowerBreakdownType} from '../../lib/api/interfaces/electricity-maps-interfaces';

describe('calculatePercentageBreakdown', () => {
  it('should calculate the correct percentage breakdown', () => {
    const breakdown: PowerBreakdownType = {
      biomass: 100,
      coal: 200,
      gas: 300,
      geothermal: 0,
      hydro: 400,
      'hydro discharge': null,
      'battery discharge': null,
      nuclear: 0,
      oil: 0,
      solar: 0,
      unknown: 0,
      wind: 0,
    };

    const expected = {
      biomass: 10,
      coal: 20,
      gas: 30,
      geothermal: 0,
      hydro: 40,
      nuclear: 0,
      oil: 0,
      solar: 0,
      unknown: 0,
      wind: 0,
    };

    const result = calculatePercentageBreakdown(breakdown);
    expect(result).toEqual(expected);
  });

  it('should handle null values correctly', () => {
    const breakdown: PowerBreakdownType = {
      biomass: 100,
      coal: null,
      gas: 300,
      geothermal: 0,
      hydro: 400,
      'hydro discharge': null,
      'battery discharge': null,
      nuclear: 0,
      oil: 0,
      solar: 0,
      unknown: 0,
      wind: 0,
    };

    const expected = {
      biomass: 13,
      gas: 38,
      geothermal: 0,
      hydro: 50,
      nuclear: 0,
      oil: 0,
      solar: 0,
      unknown: 0,
      wind: 0,
    };

    const result = calculatePercentageBreakdown(breakdown);
    expect(result).toEqual(expected);
  });

  it('should return an empty object for an empty breakdown', () => {
    const breakdown: PowerBreakdownType = {
      biomass: null,
      coal: null,
      gas: null,
      geothermal: null,
      hydro: null,
      'hydro discharge': null,
      'battery discharge': null,
      nuclear: null,
      oil: null,
      solar: null,
      unknown: null,
      wind: null,
    };

    const expected = {};

    const result = calculatePercentageBreakdown(breakdown);
    expect(result).toEqual(expected);
  });
});
