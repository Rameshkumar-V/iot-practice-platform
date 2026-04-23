import React, { useCallback, useMemo } from 'react';
import ReactFlow, { Background, Controls, addEdge, applyNodeChanges, applyEdgeChanges, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { useSelector, useDispatch } from 'react-redux';
import { syncWorkspaceNodes, syncWorkspaceEdges, addNodeToWorkspace } from './store/workspaceSlice';

// UI Components
import Navbar from './components/layout/Navbar';
import CodeEditor from './components/editor/CodeEditor';
import Console from './components/layout/Console';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

// Hardware Components
import WokwiLed from './components/hardware/WokwiLed';
import WokwiButton from './components/hardware/WokwiButton';

// CRITICAL: Keys must match registrySlice type ('hardwareLed', 'hardwareButton')
const nodeTypes = {
  hardwareLed: WokwiLed,
  hardwareButton: WokwiButton,
};

export default function App() {
  const dispatch = useDispatch();
  const nodesMap = useSelector((state) => state.workspace.nodes);
  const edges = useSelector((state) => state.workspace.edges);
  const logs = useSelector((state) => state.workspace.logs);

  const nodesArray = useMemo(() => Object.values(nodesMap), [nodesMap]);

  const onNodesChange = useCallback((chs) => {
    const nextNodes = applyNodeChanges(chs, nodesArray);
    const nextMap = nextNodes.reduce((acc, n) => ({ ...acc, [n.id]: n }), {});
    dispatch(syncWorkspaceNodes(nextMap));
  }, [nodesArray, dispatch]);

  const onEdgesChange = useCallback((chs) => {
    dispatch(syncWorkspaceEdges(applyEdgeChanges(chs, edges)));
  }, [edges, dispatch]);

  const onConnect = useCallback((p) => {
    dispatch(syncWorkspaceEdges(addEdge({ ...p, animated: true, type: 'step', style: { stroke: '#3b82f6' } }, edges)));
  }, [edges, dispatch]);

  const addHardware = useCallback((blueprint) => {
    const id = `${blueprint.type}_${Date.now()}`;
    const newNode = {
      id,
      type: blueprint.type, // Must be 'hardwareLed' or 'hardwareButton'
      position: { x: 400, y: 200 },
      data: { label: blueprint.name, signals: {}, color: 'red' }
    };
    dispatch(addNodeToWorkspace({ id, node: newNode }));
  }, [dispatch]);

  return (
    <div className="h-screen w-full flex flex-col bg-zinc-950">
      <ReactFlowProvider>
        <Navbar onAddHardware={addHardware} />
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={25}><CodeEditor /></ResizablePanel>
          <ResizableHandle withHandle className="bg-zinc-800" />
          <ResizablePanel defaultSize={75}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={75}>
                <div className="h-full w-full bg-[#050505]">
                  <ReactFlow 
                    nodes={nodesArray} edges={edges} nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
                    fitView snapToGrid
                  >
                    <Background color="#1a1a1a" variant="dots" gap={20} />
                    <Controls />
                  </ReactFlow>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle className="bg-zinc-800" />
              <ResizablePanel defaultSize={25}><Console logs={logs} /></ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ReactFlowProvider>
    </div>
  );
}