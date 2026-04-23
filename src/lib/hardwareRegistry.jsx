import WokwiLed from '@/components/hardware/WokwiLed';

export const hardwareRegistry = [
  {
    id: 'led-red',
    name: 'Red LED',
    type: 'hardwareLed',
    category: 'Output',
    // Store the component itself
    component: WokwiLed, 
    defaultData: { color: 'red', label: 'RED_LED' }
  },
  {
    id: 'led-blue',
    name: 'Blue LED',
    type: 'hardwareLed',
    category: 'Output',
    component: WokwiLed,
    defaultData: { color: 'blue', label: 'BLUE_LED' }
  }
];