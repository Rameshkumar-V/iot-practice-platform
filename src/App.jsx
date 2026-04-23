import React, { useCallback, useMemo } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  applyEdgeChanges,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useSelector, useDispatch } from "react-redux";
import { syncWorkspaceNodes, syncWorkspaceEdges } from "./store/workspaceSlice";

// UI Components
import Navbar from "./components/layout/Navbar";
import CodeEditor from "./components/editor/CodeEditor";
import Console from "./components/layout/Console";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

// Hardware Components
import WokwiLed from "./components/hardware/WokwiLed";
import WokwiButton from "./components/hardware/WokwiButton";
import GenericHardware from "./components/hardware/GenericHardware";

export default function App() {
  return (
    <ReactFlowProvider>
      <Workspace />
    </ReactFlowProvider>
  );
}

function Workspace() {
  const dispatch = useDispatch();

  const savedNodes = useSelector((state) => state.workspace.nodes);
  const savedEdges = useSelector((state) => state.workspace.edges);
  const logs = useSelector((state) => state.workspace.logs);

  const initialNodes = useMemo(
    () => Object.values(savedNodes || {}),
    [savedNodes]
  );

  const nodeTypes = useMemo(
    () => ({
      hardwareLed: WokwiLed,
      hardwareButton: WokwiButton,
      hardwareBuzzer: GenericHardware,
    }),
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(savedEdges || []);
  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => {
        const nextEdges = applyEdgeChanges(changes, eds);
  
        dispatch(syncWorkspaceEdges(nextEdges));
  
        return nextEdges;
      });
    },
    [dispatch]
  );

  const onConnect = useCallback((params) => {
    setEdges((eds) => {
      const nextEdges = addEdge(
        {
          ...params,
          animated: true,
          type: "smoothstep",
          style: {
            stroke: "#3b82f6",
            strokeWidth: 2,
          },
        },
        eds
      );
  
      dispatch(syncWorkspaceEdges(nextEdges));
  
      return nextEdges;
    });
  }, [dispatch]);

  const addHardware = useCallback(
    (blueprint) => {
      const id = `${blueprint.type}_${Date.now()}`;

      const newNode = {
        id,
        type: blueprint.type,
        position: {
          x: 100 + nodes.length * 40,
          y: 100 + nodes.length * 30,
        },
        data: {
          label: blueprint.name,
          color: "red",
          signals: {},
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [nodes.length, setNodes]
  );

  const saveWorkspace = useCallback(() => {
    const nodeMap = nodes.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});

    dispatch(syncWorkspaceNodes(nodeMap));
    dispatch(syncWorkspaceEdges(edges));
  }, [nodes, edges, dispatch]);

  return (
    <div className="h-screen w-full flex flex-col bg-zinc-950 text-white">
      <Navbar onAddHardware={addHardware} onSave={saveWorkspace} />

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* LEFT PANEL */}
        <ResizablePanel defaultSize={25} minSize={15}>
          <CodeEditor />
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-zinc-800" />

        {/* RIGHT PANEL */}
        <ResizablePanel defaultSize={75}>
          <ResizablePanelGroup direction="vertical">
            {/* FLOW AREA */}
            <ResizablePanel defaultSize={75}>
              <div className="h-full w-full bg-[#050505]">
              <ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}

  fitView
  snapToGrid
  snapGrid={[20, 20]}
  panOnDrag
  zoomOnScroll
  selectionOnDrag
  deleteKeyCode="Delete"
  elevateEdgesOnSelect
  defaultEdgeOptions={{
    type: "smoothstep",
    animated: false,
    style: {
      stroke: "#60a5fa",
      strokeWidth: 3,
    },
  }}
>
  <Background
    color="#111111"
    gap={24}
    size={1}
  />

  <MiniMap zoomable pannable />

  <Controls />
</ReactFlow>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-zinc-800" />

            {/* CONSOLE */}
            <ResizablePanel defaultSize={25} minSize={15}>
              <Console logs={logs} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}