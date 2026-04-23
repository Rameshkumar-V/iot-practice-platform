import { configureStore } from '@reduxjs/toolkit';
import registryReducer from './registrySlice';
import workspaceReducer from './workspaceSlice';
import testReducer from './testSlice';

export const store = configureStore({
  reducer: {
    registry: registryReducer,
    workspace: workspaceReducer,
    test: testReducer,
  },
});