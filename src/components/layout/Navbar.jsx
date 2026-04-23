import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Cpu, Play } from "lucide-react";

const Navbar = ({ onAddHardware }) => {
  const [val, setVal] = useState("");
  const catalog = useSelector(state => state.registry.catalog);
  
  // Memoize list to prevent Redux "Selector unknown" error
  const hardwareList = useMemo(() => Object.values(catalog), [catalog]);

  const handleSelect = (type) => {
    const item = catalog[type];
    if (item) {
      onAddHardware(item);
      setTimeout(() => setVal(""), 100);
    }
  };

  return (
    <header className="h-16 border-b border-zinc-800 flex items-center px-6 justify-between bg-zinc-900 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Cpu className="text-orange-500 w-5 h-5" />
          <span className="font-black text-white text-xs">DIGITWIN</span>
        </div>

        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className="w-[300px] bg-zinc-950 border-zinc-800 h-11 text-[11px] font-bold text-zinc-400">
            <SelectValue placeholder="➕ SELECT HARDWARE" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {hardwareList.map((item) => (
              <SelectItem key={item.type} value={item.type} className="py-2">
                <div className="flex items-center gap-4 min-w-[240px]">
                  <div className="w-[45px] h-[45px] flex items-center justify-center bg-black/40 rounded border border-zinc-800 overflow-hidden">
                    <div className="scale-[0.55] origin-center">
                      {/* Safety Check: Only render if tagName exists */}
                      {item.tagName ? React.createElement(item.tagName, { color: 'red', value: 1 }) : null}
                    </div>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-zinc-100 uppercase">{item.name}</span>
                    <span className="text-[9px] text-zinc-500 font-mono">{item.category}</span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button className="bg-emerald-600 h-10 px-8 font-bold border-b-2 border-emerald-900 shadow-lg active:scale-95">
        <Play className="w-4 h-4 mr-2" /> DEPLOY TWIN
      </Button>
    </header>
  );
};

export default Navbar;