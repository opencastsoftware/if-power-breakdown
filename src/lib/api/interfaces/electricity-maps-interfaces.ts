// Define TypeScript interfaces to represent the updated data structure
interface PowerBreakdown {
  biomass: number | null;
  coal: number | null;
  gas: number | null;
  geothermal: number | null;
  hydro: number | null;
  'hydro discharge': number | null;
  'battery discharge': number | null;
  nuclear: number | null;
  oil: number | null;
  solar: number | null;
  unknown: number | null;
  wind: number | null;
}

interface PowerImportExportBreakdown {
  [key: string]: number;
}

interface HistoryEntry {
  datetime: string;
  fossilFreePercentage: number;
  powerConsumptionBreakdown: PowerBreakdown;
  powerConsumptionTotal: number;
  powerImportBreakdown: PowerImportExportBreakdown;
  powerImportTotal: number;
  powerExportBreakdown: PowerImportExportBreakdown;
  powerExportTotal: number;
  powerProductionBreakdown: PowerBreakdown;
  powerProductionTotal: number;
  renewablePercentage: number;
  isEstimated: boolean;
  estimationMethod: string | null;
}

interface EnergyData {
  zone: string;
  history: HistoryEntry[];
}

// Function to deserialize the JSON into the TypeScript object
type DeserializeFunction = (json: string) => EnergyData;

const deserializeEnergyData: DeserializeFunction = json => {
  try {
    return JSON.parse(json) as EnergyData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Failed to parse JSON: ' + error.message);
    } else {
      throw new Error('An unknown error occurred during JSON parsing');
    }
  }
};

// Example usage
const jsonResponse = `{
  "zone": "DK-DK1",
  "history": [
    {
      "datetime": "2018-04-24T19:00:00.000Z",
      "fossilFreePercentage": 75,
      "powerConsumptionBreakdown": {
        "biomass": 81,
        "coal": 395,
        "gas": 213,
        "geothermal": 0,
        "hydro": 521,
        "hydro discharge": 0,
        "battery discharge": null,
        "nuclear": 0,
        "oil": 9,
        "solar": 2,
        "unknown": 10,
        "wind": 1288
      },
      "powerConsumptionTotal": 2519,
      "powerImportBreakdown": {
        "DE": 0,
        "DK-DK1": 495,
        "SE": 445
      },
      "powerImportTotal": 940,
      "powerExportBreakdown": {
        "DE": 35,
        "DK-DK1": 0,
        "SE": 0
      },
      "powerExportTotal": 35,
      "powerProductionBreakdown": {
        "battery discharge": null,
        "biomass": 666,
        "coal": 260,
        "gas": 213,
        "geothermal": 0,
        "hydro": 0,
        "hydro discharge": null,
        "nuclear": 0,
        "oil": 24,
        "solar": 0,
        "unknown": 0,
        "wind": 176
      },
      "powerProductionTotal": 1339,
      "renewablePercentage": 75,
      "isEstimated": false,
      "estimationMethod": null
    }
  ]
}`;

const energyData: EnergyData = deserializeEnergyData(jsonResponse);
console.log(energyData);
