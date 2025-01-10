import {EnergyData} from './interfaces/electricity-maps-interfaces';

const axios = require('axios');

require('dotenv').config();
const headers = {'auth-token': process.env.ELECTRICITY_MAPS_API_TOKEN};

export async function fetchPowerConsumption(
  latitude: number,
  longitude: number,
  timestamp: Date
): Promise<{energyData: EnergyData}> {
  const base_url = 'https://api.electricitymap.org/v3/power-breakdown/history';

  //console.log('calling api');

  try {
    const response = await axios({
      method: 'get',
      url: base_url,
      params: {
        lat: latitude,
        lon: longitude,
        datetime: timestamp,
      },
      responseType: 'json',
      headers: headers,
    });

    //${JSON.stringify(response.data.history[0].powerConsumptionBreakdown)}`);
    const energyData: EnergyData = response.data;
    return {energyData};
  } catch (error) {
    console.error('Error fetching power consumption:', error);
    throw new Error('Failed to fetch power consumption data');
  }
}
