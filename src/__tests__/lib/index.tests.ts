import {PowerBreakdown} from '../../lib';
import {fetchPowerConsumption} from '../../lib/api/electricity-maps';
import {PluginParams} from '@grnsft/if-core/types';

jest.mock('../../lib/api/electricity-maps');
const mockedFetchPowerConsumption =
  fetchPowerConsumption as jest.MockedFunction<typeof fetchPowerConsumption>;

describe('lib/my-custom-plugin: ', () => {
  describe('PowerBreakDownPlugin(): ', () => {
    it('has metadata field.', () => {
      const pluginInstance = PowerBreakdown({}, {}, {});

      expect(pluginInstance).toHaveProperty('metadata');
      expect(pluginInstance).toHaveProperty('execute');
      expect(typeof pluginInstance.execute).toBe('function');
    });

    describe('execute(): ', () => {
      it('applies logic on provided inputs array.', async () => {
        const pluginInstance = PowerBreakdown({}, {}, {});
        const inputs: PluginParams[] = [
          {
            geolocation: '50.0,20.0',
            timestamp: new Date('2022-04-20T09:00:00.000Z'),
          },
        ];

        const mockResponse = {
          energyData: {
            zone: 'FR',
            history: [
              {
                datetime: '2022-04-20T09:00:00.000Z',
                powerConsumptionBreakdown: {
                  nuclear: 31479,
                  geothermal: 0,
                  biomass: 753,
                  coal: 227,
                  wind: 8122,
                  solar: 4481,
                  hydro: 7106,
                  gas: 6146,
                  oil: 341,
                  unknown: 2,
                  'hydro discharge': 1013,
                  'battery discharge': 0,
                },
                powerProductionBreakdown: {
                  nuclear: 31438,
                  geothermal: null,
                  biomass: 740,
                  coal: 219,
                  wind: 8034,
                  solar: 4456,
                  hydro: 7099,
                  gas: 6057,
                  oil: 341,
                  unknown: null,
                  'hydro discharge': 1012,
                  'battery discharge': null,
                },
                powerImportBreakdown: {
                  GB: 548,
                },
                powerExportBreakdown: {
                  GB: 0,
                },
                fossilFreePercentage: 89,
                powerConsumptionTotal: 59670,
                powerProductionTotal: 59396,
                powerImportTotal: 548,
                powerExportTotal: 0,
                renewablePercentage: 36,
                renewablePowerPercentage: 36,
                totalPower: 59670,
                zone: 'FR',
                isEstimated: false,
                estimationMethod: null,
              },
            ],
          },
          country: 'FR',
        };

        mockedFetchPowerConsumption.mockResolvedValue(mockResponse);

        const response = await pluginInstance.execute(inputs);
        const expectedPercentageBreakdown = JSON.stringify({
          nuclear: 53,
          geothermal: 0,
          biomass: 1,
          coal: 0,
          wind: 14,
          solar: 8,
          hydro: 12,
          gas: 10,
          oil: 1,
          unknown: 0,
          'hydro discharge': 2,
          'battery discharge': 0,
        });

        expect(response[0]['powerBreakDownPercentage']).toBe(
          expectedPercentageBreakdown
        );
        expect(response[0]['zone']).toBe('FR');
      });
    });
  });
});
