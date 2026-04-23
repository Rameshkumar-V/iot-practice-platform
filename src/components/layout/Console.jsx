import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal } from "lucide-react";

const Console = ({ logs }) => {
  return (
    <div className="h-full flex flex-col bg-black border-t border-zinc-800">
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-950 border-b border-zinc-900">
        <Terminal className="w-3 h-3 text-zinc-500" />
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Output Console</span>
      </div>
      <ScrollArea className="flex-1 p-4 font-mono text-[11px] text-zinc-400">
        {logs.map((log, i) => (
          <div key={i} className="mb-1">
            <span className="text-zinc-600">[{new Date().toLocaleTimeString()}]</span>{" "}
            <span className={log.type === 'error' ? 'text-red-500' : 'text-green-500'}>
              {log.msg}
            </span>
          </div>
        ))}
        <div className="animate-pulse">_</div>
      </ScrollArea>
    </div>
  );
};

export default Console;