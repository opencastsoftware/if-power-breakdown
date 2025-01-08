import {PluginFactory} from '@grnsft/if-core/interfaces';
import {PluginParams, ConfigParams} from '@grnsft/if-core/types';
import {fetchPowerConsumption} from '../api/electricity-maps';
import {calculatePercentageBreakdown} from '../util/utils';
import {HistoryEntry} from '../api/interfaces/electricity-maps-interfaces';

export const PowerBreakdown = PluginFactory({
  configValidation: (config: ConfigParams) => {
    // do config validation here or just pass zod schema

    return config;
  },
  inputValidation: (input: PluginParams) => {
    const regex = new RegExp('^-?\\d{1,3}\\.\\d+,-?\\d{1,3}\\.\\d+$');

    if (!regex.test(input.geolocation)) {
      throw new Error(
        'not a comma-separated string consisting of `latitude` and `longitude`'
      );
    }

    return input;
  },
  implementation: async (inputs: PluginParams[], config: ConfigParams) => {
    const {yourValue} = config;
    const cache = new Map<string, Promise<any> | HistoryEntry[]>();

    const results = await Promise.all(
      inputs.map(async input => {
        const cacheKey = `${input.geolocation}`;
        if (!cache.has(cacheKey)) {
          const [latitude, longitude] = input.geolocation.split(',');
          const fetchPromise = fetchPowerConsumption(
            latitude,
            longitude,
            input.timestamp as Date
          ).then(pc => {
            const latestBreakdownHistory = pc.energyData.history;
            cache.set(cacheKey, latestBreakdownHistory);
            return latestBreakdownHistory;
          });
          cache.set(cacheKey, fetchPromise);
        }

        const powerConsumptionBreakdownPerDay = (await cache.get(
          cacheKey
        )) as HistoryEntry[];

        const date = new Date(input.timestamp);
        const inputHour = date.getHours();

        const matchingBreakDown = powerConsumptionBreakdownPerDay.find(data => {
          const date = new Date(data.datetime);
          return date.getHours() === inputHour;
        });

        //console.log(JSON.stringify(matchingBreakDown));

        let percentageBreakdown = null;
        if (matchingBreakDown && matchingBreakDown.powerConsumptionBreakdown) {
          percentageBreakdown = calculatePercentageBreakdown(
            matchingBreakDown.powerConsumptionBreakdown
          );
        }

        return {
          ...input,
          ['powerBreakDownPercentage']: JSON.stringify(percentageBreakdown),
          //['powerBreakDown']: matchingBreakDown?.powerConsumptionBreakdown.gas,
          ['zone']: matchingBreakDown?.zone,
        };
      })
    );
    yourValue;
    return results;
  },
});
