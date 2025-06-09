"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function HtmlEditor({ initialContent = "<h1>Introducción</h1><p>Escribe aquí tu contenido...</p>" }) {
  const editorRef = useRef(null);
  const [html, setHtml] = useState(initialContent);

  const handleInput = () => {
    if (editorRef.current) {
      setHtml(editorRef.current.innerHTML);
    }
  };

  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div className="space-y-4 p-4 border rounded-xl shadow">
      <label className="block text-sm text-gray-500">Contenido</label>

      <div className="flex flex-wrap gap-2 mb-2">
        <Button variant="outline" size="sm" onClick={() => formatText("bold")}>
          B
        </Button>
        <Button variant="outline" size="sm" onClick={() => formatText("italic")}>
          I
        </Button>
        <Button variant="outline" size="sm" onClick={() => formatText("underline")}>
          U
        </Button>
        <Button variant="outline" size="sm" onClick={() => formatText("insertUnorderedList")}>
          • Lista
        </Button>
        <Button variant="outline" size="sm" onClick={() => formatText("insertOrderedList")}>
          1. Lista
        </Button>
        <Button variant="outline" size="sm" onClick={() => formatText("formatBlock", "<h2>")}>
          H2
        </Button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: html }}
        className="min-h-[200px] border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 prose"
      />

      <div className="text-sm text-gray-500">Vista HTML guardada:</div>
      <pre className="bg-gray-100 text-xs p-3 overflow-auto rounded-md max-h-40">
        {html}
      </pre>
    </div>
  );
}