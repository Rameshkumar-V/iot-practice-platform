import { createSlice } from '@reduxjs/toolkit';

const registrySlice = createSlice({
  name: 'registry',
  initialState: {
    catalog: {}, // Keyed by component type (e.g., 'wokwi-led')
  },
  reducers: {
    // Self-registration function called by components on mount
    registerComponentBlueprint: (state, action) => {
      const { type, name, pins, category, svg } = action.payload;
      
      // Only update if the data has changed or is new
      state.catalog[type] = {
        type,
        name,
        pins,       // Dynamic pin list [ { name: 'VCC', x: 10, y: 20 }, ... ]
        category,
        svg,
        lastRegistered: new Date().toISOString()
      };
    }
  }
});

export const { registerComponentBlueprint } = registrySlice.actions;
export default registrySlice.reducer;