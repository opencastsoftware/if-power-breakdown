import {PowerBreakdown} from '../../lib/if-power-breakdown';

describe('lib/my-custom-plugin: ', () => {
  describe('MyCustomPlugin(): ', () => {
    it('has metadata field.', () => {
      const pluginInstance = PowerBreakdown({}, {}, {});

      expect(pluginInstance).toHaveProperty('metadata');
      expect(pluginInstance).toHaveProperty('execute');
      expect(typeof pluginInstance.execute).toBe('function');
    });

    describe('execute(): ', () => {
      it('applies logic on provided inputs array.', async () => {
        const pluginInstance = PowerBreakdown({}, {}, {});
        const inputs = [{geolocation: '50.0,20.0'}];

        const response = await pluginInstance.execute(inputs);
        expect(response[0]['gas']).not.toBeNull();
      });
    });
  });
});
