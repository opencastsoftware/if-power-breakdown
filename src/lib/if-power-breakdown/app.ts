import {PowerBreakdown} from './index';

async function runPlugin() {
  const usage = await PowerBreakdown({}, {}, {}).execute([
    {
      timestamp: '2024-04-01T10:00',
      duration: '100',
      energy: 10,
      geolocation: '36.778259,-119.417931',
    },
    {
      timestamp: '2024-04-01T00:00',
      duration: '200',
      energy: 20,
      geolocation: '51.387811,-0.723811',
    },
    {
      timestamp: '2024-04-01T00:00',
      duration: '300',
      energy: 30,
      geolocation: '36.778259,-119.417931',
    },
  ]);

  console.log(usage);
}

runPlugin();
