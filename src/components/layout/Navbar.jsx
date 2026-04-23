import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Cpu, Play } from "lucide-react";
import { hardwareRegistry } from "@/lib/hardwareRegistry";

const Navbar = ({ onAddHardware }) => {
  // We use a 'selectedValue' state to control the select box manually
  const [selectedValue, setSelectedValue] = useState("");

  const handleSelection = (val) => {
    const config = hardwareRegistry.find(c => c.id === val);
    if (config) {
      // 1. Insert the hardware into React Flow
      onAddHardware(config);
      
      // 2. RESET the select box immediately so it shows the placeholder again
      // Using a timeout of 0 ensures the UI completes the "click" before resetting
      setTimeout(() => setSelectedValue(""), 100);
    }
  };

  return (
    <header className="h-16 border-b border-zinc-800 flex items-center px-6 justify-between bg-zinc-900 z-50 shadow-2xl">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 p-1.5 rounded shadow-lg">
            <Cpu className="text-white w-5 h-5" />
          </div>
          <h1 className="font-black text-sm tracking-tighter text-white">
            DIGITWIN <span className="text-orange-500">PLATFORM</span>
          </h1>
        </div>

        <div className="flex-1 flex justify-center">
          {/* Use the 'value' prop to make it a controlled component */}
          <Select value={selectedValue} onValueChange={handleSelection}>
            <SelectTrigger className="w-[300px] bg-zinc-950 border-zinc-800 h-12 text-[11px] font-bold text-zinc-400">
              <SelectValue placeholder="➕ CLICK TO DEPLOY HARDWARE" />
            </SelectTrigger>
            
            <SelectContent className="bg-zinc-900 border-zinc-800">
              {hardwareRegistry.map((item) => (
                <SelectItem key={item.id} value={item.id} className="py-2 cursor-pointer">
                  <div className="flex items-center gap-6 min-w-[250px]">
                    <div className="w-[50px] h-[50px] overflow-hidden bg-black/40 rounded flex items-center justify-center border border-zinc-800">
                      <div className="scale-[0.5] origin-center">
                         <item.component data={item.defaultData} />
                      </div>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[12px] font-black text-zinc-100 uppercase tracking-tighter">
                        {item.name}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="bg-emerald-600 hover:bg-emerald-700 h-10 font-bold px-8 shadow-lg shadow-emerald-900/20">
        <Play className="w-4 h-4 mr-2" /> DEPLOY TWIN
      </Button>
    </header>
  );
};

export default Navbar;