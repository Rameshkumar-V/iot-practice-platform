import React from 'react';
import Editor from '@monaco-editor/react';
import { Code2, Terminal } from "lucide-react";

const CodeEditor = () => {
  const defaultCode = `#include <DigitalTwin.h>

// Digital Twin Setup
void setup() {
  Serial.begin(115200);
  pinMode(13, OUTPUT);
  Serial.println("Twin Initialized...");
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}`;

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] border-r border-zinc-800">
      {/* Header Tab */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            firmware.cpp
          </span>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-zinc-700" />
          <div className="w-2 h-2 rounded-full bg-zinc-700" />
        </div>
      </div>
      
      {/* The Real IDE Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="cpp"
          defaultValue={defaultCode}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            padding: { top: 10 },
            cursorSmoothCaretAnimation: "on"
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;