const axios = require('axios');
const fs = require('fs');
const path = require('path');

require('dotenv').config();
const headers = {'auth-token': process.env.ELECTRICITY_MAPS_API_TOKEN};

// const safeJsonParse = <T>(str: string) => {
//   try {
//     console.log(str);
//     const jsonValue: T = JSON.parse(str);

//     return jsonValue;
//   } catch (error) {
//     throw new Error('Failed to parse JSON: ' + (error as Error).message);
//   }
// };

export async function fetchPowerConsumption(
  latitude: number,
  longitude: number,
  timestamp: Date
): Promise<{energyData: EnergyData; country: string}> {
  const base_url = 'https://api.electricitymap.org/v3/power-breakdown/history';
  console.log('calling api');

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
    //console.log('Power consumption returned ' + JSON.stringify(response.data));
    console.log(
      'pc returned ' + response.data.history.powerConsumptionBreakdown
    );
    const energyData: EnergyData = response.data;
    const country = getCountry(energyData.zone);
    return {energyData, country};
  } catch (error) {
    console.error('Error fetching power consumption:', error);
    throw new Error('Failed to fetch power consumption data');
  }
}

function getCountry(zone: string) {
  const filePath = path.join(__dirname, 'data', 'zone-country.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(jsonData);
  return data[zone]['countryName'];
}
