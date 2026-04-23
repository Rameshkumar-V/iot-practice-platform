import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  addEdge, 
  Handle, 
  Position 
} from 'reactflow';
import 'reactflow/dist/style.css';

// Shadcn UI components
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Icons & Hardware
import { Play, Square, Cpu, Zap } from "lucide-react";
import '@wokwi/elements';

// --- 1. Custom Hardware Node (LED) ---
const WokwiLedNode = ({ data }) => {
  const ledRef = useRef(null);
  const [pins, setPins] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (ledRef.current?.pinInfo) setPins(ledRef.current.pinInfo);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-xl shadow-2xl">
      <div className="text-[10px] text-zinc-500 font-mono mb-2 text-center uppercase tracking-tighter">
        {data.label || 'LED'}
      </div>
      <div className="relative flex justify-center p-2">
        <wokwi-led ref={ledRef} color={data.color || 'red'} value={data.value ? 1 : 0} />
        {pins.map((pin) => (
          <Handle
            key={pin.name}
            id={pin.name}
            type="bidirectional"
            position={Position.Top}
            style={{
              position: 'absolute',
              left: pin.x,
              top: pin.y,
              background: '#ef4444',
              width: 10,
              height: 10,
              transform: 'translate(-50%, -50%)',
              border: '2px solid white',
              zIndex: 50
            }}
          />
        ))}
      </div>
    </div>
  );
};

const nodeTypes = { hardwareLed: WokwiLedNode };

// --- 2. Main App IDE Shell ---
export default function App() {
  const [nodes, setNodes] = useState([
    { id: 'led-1', type: 'hardwareLed', position: { x: 100, y: 100 }, data: { color: 'red', value: true, label: 'PWR_IND' } },
  ]);
  const [edges, setEdges] = useState([]);

  const onConnect = useCallback((params) => 
    setEdges((eds) => addEdge({ 
      ...params, 
      animated: true, 
      style: { stroke: '#ef4444', strokeWidth: 3 },
      type: 'step' 
    }, eds)), 
  []);

  return (
    <div className="h-screen w-full flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
      
      {/* --- HEADER --- */}
      <header className="h-14 border-b border-zinc-800 flex items-center px-6 justify-between bg-zinc-900/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="bg-orange-500 p-1.5 rounded-lg">
            <Cpu className="text-white w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg tracking-tight">IoT <span className="text-orange-500">PLATFORM</span></h1>
          <Separator orientation="vertical" className="h-6 mx-2 bg-zinc-700" />
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20">
              <Play className="w-4 h-4 mr-2 fill-current" /> RUN
            </Button>
            <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-400 hover:bg-zinc-800">
              <Square className="w-4 h-4 mr-2 fill-current" /> STOP
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
          <Zap className="w-4 h-4 text-yellow-500 animate-pulse" /> 230V STABLE
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <ResizablePanelGroup direction="horizontal">
        
        {/* SIDEBAR: PARTS LIBRARY */}
        <ResizablePanel defaultSize={20} minSize={15} className="bg-zinc-900/30">
          <ScrollArea className="h-full">
            <div className="p-6">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Components</h3>
              <div className="grid gap-4">
                {['Red LED', 'Green LED', 'Blue LED'].map((item) => (
                  <div key={item} className="group p-4 bg-zinc-900 border border-zinc-800 rounded-xl cursor-pointer hover:border-orange-500/50 transition-all active:scale-95 shadow-sm">
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-500/10 transition-colors">
                      <Zap className="w-5 h-5 text-zinc-500 group-hover:text-orange-500" />
                    </div>
                    <p className="text-sm font-medium">{item}</p>
                    <p className="text-[10px] text-zinc-500 mt-1 uppercase">Output Device</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-zinc-800" />

        {/* EDITOR & CONSOLE */}
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="vertical">
            
            {/* CANVAS AREA */}
            <ResizablePanel defaultSize={75} className="relative">
              <ReactFlow 
                nodes={nodes} 
                edges={edges} 
                nodeTypes={nodeTypes} 
                onConnect={onConnect}
                fitView
              >
                <Background color="#27272a" gap={25} size={1} variant="lines" />
                <Controls className="bg-zinc-900 border-zinc-800 fill-white" />
              </ReactFlow>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-zinc-800" />

            {/* CONSOLE AREA */}
            <ResizablePanel defaultSize={25} className="bg-black">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-900 bg-zinc-950">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">System Logs</span>
              </div>
              <div className="p-4 font-mono text-[11px] leading-relaxed">
                <div className="flex gap-2">
                  <span className="text-zinc-600">[09:53:11]</span> 
                  <span className="text-emerald-500 font-bold">SUCCESS</span> 
                  <span>Wokwi Simulation Engine online.</span>
                </div>
                <div className="flex gap-2 mt-1">
                  <span className="text-zinc-600">[09:53:12]</span> 
                  <span className="text-sky-500 font-bold">INFO</span> 
                  <span>LED Node rendered at coordinates x:100, y:100.</span>
                </div>
                <div className="flex gap-2 mt-1">
                  <span className="text-zinc-600">[09:53:15]</span> 
                  <span className="text-zinc-400">WAITING</span> 
                  <span className="animate-pulse">_</span>
                </div>
              </div>
            </ResizablePanel>

          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}