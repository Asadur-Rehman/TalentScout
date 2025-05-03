import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const CodeEditor = ({ code, setCode }) => {
  // const [code, setCode] = useState("// Write your code here\n");
  const terminalRef = useRef(null);
  const terminal = useRef(null);
  const fitAddon = useRef(null);

  const runCode = () => {
    try {
      // Create a custom console object to capture logs
      const customConsole = {
        log: (...args) => {
          const output = args
            .map((arg) =>
              typeof arg === "object" ? JSON.stringify(arg) : String(arg)
            )
            .join(" ");
          terminal.current.writeln("\r\n" + output);
        },
        error: (...args) => {
          const output = args
            .map((arg) =>
              typeof arg === "object" ? JSON.stringify(arg) : String(arg)
            )
            .join(" ");
          terminal.current.writeln("\r\n\x1b[31m" + output + "\x1b[0m"); // Red color for errors
        },
      };

      // Create a function from the code with custom console
      const wrappedCode = `
        const console = arguments[0];
        ${code}
      `;
      const func = new Function(wrappedCode);
      func(customConsole);
      terminal.current.writeln("\r\nCode executed successfully!");
    } catch (error) {
      terminal.current.writeln(`\r\nError: ${error.message}`);
    }
    terminal.current.prompt();
  };

  useEffect(() => {
    // Initialize terminal
    terminal.current = new Terminal({
      cursorBlink: true,
      theme: {
        background: "#1e1e1e",
        foreground: "#d4d4d4",
      },
      scrollback: 1000, // Enable scrollback
      rows: 10, // Set initial rows
    });
    fitAddon.current = new FitAddon();
    terminal.current.loadAddon(fitAddon.current);

    if (terminalRef.current) {
      terminal.current.open(terminalRef.current);
      fitAddon.current.fit();
    }

    // Add welcome message
    terminal.current.writeln("Welcome to the code editor terminal!");
    terminal.current.writeln(
      'Click the "Run" button or type "run" to execute your code'
    );
    terminal.current.prompt = () => {
      terminal.current.write("\r\n$ ");
    };
    terminal.current.prompt();

    // Handle terminal input
    terminal.current.onData((e) => {
      if (e === "\r") {
        const command = terminal.current.buffer.active
          .getLine(terminal.current.buffer.active.cursorY)
          .translateToString()
          .trim();
        if (command === "run") {
          runCode();
        } else {
          terminal.current.writeln(
            '\r\nUnknown command. Type "run" to execute your code'
          );
        }
        terminal.current.prompt();
      } else {
        terminal.current.write(e);
      }
    });

    // Cleanup
    return () => {
      terminal.current.dispose();
    };
  }, []);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            padding: { top: 10, bottom: 10 },
            lineNumbers: "on",
            roundedSelection: false,
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
        />
        <button
          onClick={runCode}
          className="absolute top-4 right-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md transition-colors duration-200 z-10"
        >
          Run
        </button>
      </div>
      <div
        ref={terminalRef}
        className="h-1/3 bg-[#1e1e1e] p-2 overflow-auto"
        style={{ borderTop: "1px solid #333" }}
      />
    </div>
  );
};

export default CodeEditor;
