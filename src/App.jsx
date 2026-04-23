import React, { useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, addEdge, applyNodeChanges, applyEdgeChanges, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

import Navbar from './components/layout/Navbar';
import Console from './components/layout/Console';
import CodeEditor from './components/editor/CodeEditor';
import WokwiLed from './components/hardware/WokwiLed';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

// CRITICAL: Define OUTSIDE to fix Error #002
const nodeTypes = {
  hardwareLed: WokwiLed,
};

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [logs, setLogs] = useState([{ msg: "Digital Twin Booting...", type: "info" }]);

  const onNodesChange = useCallback((chs) => setNodes((nds) => applyNodeChanges(chs, nds)), []);
  const onEdgesChange = useCallback((chs) => setEdges((eds) => applyEdgeChanges(chs, eds)), []);
  
  const onConnect = useCallback((params) => 
    setEdges((eds) => addEdge({ ...params, animated: true, type: 'step' }, eds)), []);

  const addHardware = useCallback((config) => {
    const id = `${config.type}_${Date.now()}`;
    setNodes((nds) => [...nds, {
      id,
      type: config.type,
      position: { x: 200, y: 200 },
      data: { ...config.defaultData },
    }]);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* We wrap everything in Provider so Navbar has access to Flow context if needed */}
      <ReactFlowProvider>
        <Navbar onAddHardware={addHardware} />
        
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={30}>
            <CodeEditor />
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-zinc-800" />
          
          <ResizablePanel defaultSize={70}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={70}>
                <div className="h-full w-full relative">
                  <ReactFlow 
                    nodes={nodes} 
                    edges={edges} 
                    nodeTypes={nodeTypes} 
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                  >
                    <Background color="#18181b" variant="dots" />
                    <Controls />
                  </ReactFlow>
                </div>
              </ResizablePanel>
              
              <ResizableHandle withHandle className="bg-zinc-800" />
              
              <ResizablePanel defaultSize={30}>
                <Console logs={logs} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ReactFlowProvider>
    </div>
  );
}