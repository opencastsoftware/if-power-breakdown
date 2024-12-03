import {PluginFactory} from '@grnsft/if-core/interfaces';
import {PluginParams, ConfigParams} from '@grnsft/if-core/types';
import {fetchPowerConsumption} from '../api/electricity-maps';

export const PowerBreakdown = PluginFactory({
  configValidation: (config: ConfigParams) => {
    // do config validation here or just pass zod schema

    return config;
  },
  inputValidation: (input: PluginParams) => {
    const regex = new RegExp('^\\-?\\d{1,3}\\.\\d+,-?\\d{1,3}\\.\\d+$');

    if (!regex.test(input.geolocation)) {
      throw new Error(
        'not a comma-separated string consisting of `latitude` and `longitude`'
      );
    }

    return input;
  },
  implementation: async (inputs: PluginParams[], config: ConfigParams) => {
    const {yourValue} = config;
    const cache = new Map<string, Promise<any> | PowerBreakdown>();

    const results = await Promise.all(
      inputs.map(async input => {
        const cacheKey = `${input.geolocation}-${input.timestamp}`;
        if (!cache.has(cacheKey)) {
          const [latitude, longitude] = input.geolocation.split(',');
          const fetchPromise = fetchPowerConsumption(
            latitude,
            longitude,
            input.timestamp as Date
          ).then(pc => {
            const breakdown =
              pc.energyData.history[0].powerConsumptionBreakdown;
            cache.set(cacheKey, breakdown);
            return breakdown;
          });
          cache.set(cacheKey, fetchPromise);
        }

        const powerConsumptionBreakdown = await cache.get(cacheKey);
        return {...input, ['gas']: powerConsumptionBreakdown.gas};
      })
    );
    yourValue;
    return results;
  },

  // implementation: async (inputs: PluginParams[], config: ConfigParams) => {
  //   const {yourValue} = config;
  //
  //   const results = await Promise.all(
  //     inputs.map(async input => {
  //       const [latitude, longitude] = input.geolocation.split(',');
  //       const pc = await fetchPowerConsumption(
  //         latitude,
  //         longitude,
  //         input.timestamp as Date
  //       );
  //
  //       const totalBreakdown: PowerBreakdown = {
  //         biomass: 0,
  //         coal: 0,
  //         gas: 0,
  //         geothermal: 0,
  //         hydro: 0,
  //         'hydro discharge': 0,
  //         'battery discharge': 0,
  //         nuclear: 0,
  //         oil: 0,
  //         solar: 0,
  //         unknown: 0,
  //         wind: 0,
  //       };
  //
  //       for (let i = 0; i < pc.energyData.history.length; i++) {
  //         const breakdown = pc.energyData.history[i].powerConsumptionBreakdown;
  //         for (const key in totalBreakdown) {
  //           const breakdownValue = breakdown[key as keyof PowerBreakdown];
  //           const totalValue = totalBreakdown[key as keyof PowerBreakdown];
  //
  //           if (breakdownValue !== null) {
  //             totalBreakdown[key as keyof PowerBreakdown] =
  //               (totalValue || 0) + (breakdownValue as number);
  //           }
  //         }
  //       }
  //
  //       return {...input, ...totalBreakdown};
  //     })
  //   );
  //   yourValue;
  //   return results;
  // },
});
