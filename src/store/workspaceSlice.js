import { createSlice } from '@reduxjs/toolkit';

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: {
    nodes: {}, // Stores instance data: { node_1: { type: 'led', signals: { anode: 0, cathode: 0 } } }
    edges: []  // React Flow connection map
  },
  reducers: {
    updatePinSignal: (state, action) => {
      const { nodeId, pinName, signalValue } = action.payload;
      
      // 1. Update the source pin
      if (!state.nodes[nodeId]) return;
      state.nodes[nodeId].signals[pinName] = signalValue;

      // 2. Trace the wire to find targets
      const connections = state.edges.filter(
        edge => edge.source === nodeId && edge.sourceHandle === pinName
      );

      // 3. Propagate to every connected component's specific input pin
      connections.forEach(wire => {
        const targetNode = state.nodes[wire.target];
        if (targetNode) {
          targetNode.signals[wire.targetHandle] = signalValue;
        }
      });
    },
    syncWorkspaceNodes: (state, action) => {
      // Syncs instances from React Flow canvas
      state.nodes = action.payload;
    },
    syncWorkspaceEdges: (state, action) => {
      state.edges = action.payload;
    }
  }
});

export const { updatePinSignal, syncWorkspaceNodes, syncWorkspaceEdges } = workspaceSlice.actions;
export default workspaceSlice.reducer;  