import { createSlice } from "@reduxjs/toolkit";

const getBasePin = (handleId = "") =>
  handleId.replace("-out", "").replace("-in", "");

const workspaceSlice = createSlice({
  name: "workspace",

  initialState: {
    nodes: {},
    edges: [],
    logs: [{ msg: "System Booted", type: "info" }],
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

    clearWorkspaceEdges: (state) => {
      state.edges = [];
    },

    updatePinSignal: (state, action) => {
      const { nodeId, pinName, signalValue } = action.payload;
    
      const node = state.nodes[nodeId];
      if (!node) return;
    
      // Ensure signals object exists
      if (!node.data.signals) {
        node.data.signals = {};
      }
    
      // 1️⃣ Set signal on current node
      node.data.signals[pinName] = signalValue;
    
      // 2️⃣ Find all outgoing edges from this pin
      const connectedEdges = state.edges.filter((edge) => {
        return (
          edge.source === nodeId &&
          edge.sourceHandle &&
          edge.sourceHandle.startsWith(pinName)   // 🔥 IMPORTANT FIX
        );
      });
    
      // 3️⃣ Propagate signal to target nodes
      connectedEdges.forEach((edge) => {
        const targetNode = state.nodes[edge.target];
        if (!targetNode) return;
    
        if (!targetNode.data.signals) {
          targetNode.data.signals = {};
        }
    
        // remove "-in"
        const targetPin = edge.targetHandle.replace("-in", "");
    
        targetNode.data.signals[targetPin] = signalValue;
      });
    },
    
  },
});

export const {
  addNodeToWorkspace,
  syncWorkspaceNodes,
  syncWorkspaceEdges,
  updatePinSignal,
  clearWorkspaceEdges,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;