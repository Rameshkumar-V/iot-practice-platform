import { createSlice } from '@reduxjs/toolkit';

const registrySlice = createSlice({
  name: 'registry',
  initialState: {
    catalog: {
      'hardwareLed': { 
        type: 'hardwareLed', 
        tagName: 'wokwi-led', 
        name: 'Standard LED', 
        category: 'ACTUATOR' 
      },
      'hardwareButton': { 
        type: 'hardwareButton', 
        tagName: 'wokwi-pushbutton', 
        name: 'Push Button', 
        category: 'INPUT' 
      }
    }
  },
  reducers: {
    registerComponentBlueprint: (state, action) => {
      const { type, pins } = action.payload;
      // Only update if we are adding new details (like pin coordinates)
      if (state.catalog[type]) {
        state.catalog[type].pins = pins;
      } else {
        state.catalog[type] = action.payload;
      }
    }
  }
});

export const { registerComponentBlueprint } = registrySlice.actions;
export default registrySlice.reducer;