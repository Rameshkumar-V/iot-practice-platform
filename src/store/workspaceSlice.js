import { createSlice } from '@reduxjs/toolkit';

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: {
    nodes: {}, 
    edges: [],
    logs: [{ msg: "Digital Twin Engine Active", type: "info" }],
  },
  reducers: {
    addNodeToWorkspace: (state, action) => {
      const { id, node } = action.payload;
      state.nodes[id] = node;
    },
    syncWorkspaceNodes: (state, action) => {
      state.nodes = action.payload;
    },
    syncWorkspaceEdges: (state, action) => {
      state.edges = action.payload;
    },
    updatePinSignal: (state, action) => {
      const { nodeId, pinName, signalValue } = action.payload;
      if (state.nodes[nodeId]) {
        if (!state.nodes[nodeId].data.signals) state.nodes[nodeId].data.signals = {};
        state.nodes[nodeId].data.signals[pinName] = signalValue;
      }

      const connections = state.edges.filter(e => e.source === nodeId && e.sourceHandle === pinName);
      connections.forEach(wire => {
        const targetNode = state.nodes[wire.target];
        if (targetNode) {
          if (!targetNode.data.signals) targetNode.data.signals = {};
          targetNode.data.signals[wire.targetHandle] = signalValue;
        }
      });
    }
  },
});

export const { addNodeToWorkspace, syncWorkspaceNodes, syncWorkspaceEdges, updatePinSignal } = workspaceSlice.actions;
export default workspaceSlice.reducer;