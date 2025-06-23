"use client";

import { useState } from "react";
import { cn } from "@/lib/utils"; // Asegúrate de tener una función `cn` para manejar clases condicionales

const BlockRenderer = ({ block, onUpdate }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e) => {
    onUpdate(e.target.innerText);
  };

  const baseProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    contentEditable: true,
    suppressContentEditableWarning: true,
    onInput: handleChange,
    className: cn("border-transparent px-2 py-1", isHovered && "border border-blue-500"),
  };

  switch (block.type) {
    case "heading-one":
      return <h1 {...baseProps}>{block.content}</h1>;
    case "paragraph":
      return <p {...baseProps}>{block.content}</p>;
    case "bullet-list":
      return (
        <ul {...baseProps} className="list-disc ml-6">
          {block.content.map((item, idx) => (
            <li key={idx}>{item.content}</li>
          ))}
        </ul>
      );
    case "numbered-list":
      return (
        <ol {...baseProps} className="list-decimal ml-6">
          {block.content.map((item, idx) => (
            <li key={idx}>{item.content}</li>
          ))}
        </ol>
      );
    case "table":
      return (
        <table {...baseProps} className="table-auto border border-collapse">
          <thead>
            <tr>
              {block.content.head.map((cell, idx) => (
                <th key={idx} style={{ width: cell.width }}>{cell.content}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.content.body.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx}>{cell.content}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    default:
      return <div {...baseProps}>{block.content}</div>;
  }
};

export default function DocumentRenderer({ initialData }) {
  const [data, setData] = useState(initialData);

  const updateBlockContent = (index, newContent) => {
    const newData = [...data];
    newData[index].content = newContent;
    setData(newData);
  };

  return (
    <div className="flex">
      <div className="w-3/4 space-y-4 p-4">
        {data.map((block, index) => (
          <BlockRenderer
            key={index}
            block={block}
            onUpdate={(newContent) => updateBlockContent(index, newContent)}
          />
        ))}
      </div>
      <aside className="w-1/4 border-l px-4 py-2 space-y-2">
        <h2 className="font-semibold">Agregar bloque</h2>
        <button className="block w-full py-1 px-2 border rounded" onClick={() => setData([...data, { type: "paragraph", content: "Nuevo párrafo", html: "" }])}>
          Párrafo
        </button>
        <button className="block w-full py-1 px-2 border rounded" onClick={() => setData([...data, { type: "heading-one", content: "Nuevo título", html: "" }])}>
          Título
        </button>
      </aside>
    </div>
  );
}
