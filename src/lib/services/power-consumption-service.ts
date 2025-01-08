import {fetchPowerConsumption} from '../api/electricity-maps';
import {PluginParams} from '@grnsft/if-core/types';

export const getPowerConsumptionBreakdown = async (
  input: PluginParams,
  cacheKey: string,
  cache: Map<string, Promise<any> | PowerBreakdown>
) => {
  const [latitude, longitude] = input.geolocation.split(',');
  return fetchPowerConsumption(
    latitude,
    longitude,
    input.timestamp as Date
  ).then(pc => {
    const breakdown = pc.energyData.history[0].powerConsumptionBreakdown;
    cache.set(cacheKey, breakdown);
    return breakdown;
  });
};
