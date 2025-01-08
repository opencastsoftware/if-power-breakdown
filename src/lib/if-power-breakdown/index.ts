import {PluginFactory} from '@grnsft/if-core/interfaces';
import {PluginParams, ConfigParams} from '@grnsft/if-core/types';
import {getPowerConsumptionBreakdown} from '../services/power-consumption-service';

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
          const fetchPromise = getPowerConsumptionBreakdown(
            input,
            cacheKey,
            cache
          );
          cache.set(cacheKey, fetchPromise);
        }

        const powerConsumptionBreakdown = await cache.get(cacheKey);
        return {...input, ['power-break-down']: powerConsumptionBreakdown.gas};
      })
    );
    yourValue;
    return results;
  },
});
