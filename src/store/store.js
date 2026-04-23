import { configureStore } from '@reduxjs/toolkit';
import registryReducer from './registrySlice';
import workspaceReducer from './workspaceSlice';

export const store = configureStore({
  reducer: {
    registry: registryReducer,
    workspace: workspaceReducer,
  },
});