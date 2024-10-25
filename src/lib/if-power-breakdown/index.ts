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

    const results = await Promise.all(
      inputs.map(async input => {
        const [latitude, longitude] = input.geolocation.split(',');
        const pc = await fetchPowerConsumption(
          latitude,
          longitude,
          input.timestamp as Date
        );
        const powerConsumptionBreakdown =
          pc.energyData.history[0].powerConsumptionBreakdown;
        return {...input, ['gas']: powerConsumptionBreakdown.gas};
      })
    );
    yourValue;
    return results;
  },
});
