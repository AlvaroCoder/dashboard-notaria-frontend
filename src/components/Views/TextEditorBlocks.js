'use client'
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DocumentRenderer({ initialData }) {
    const [data, setData] = useState(initialData);

    const updateBlockContent = (index, newContent) => {
        const newData = [...data];
        newData[index].content = newContent;
        setData(newData);
      };
  return (
    <div className="grid grid-cols-5 gap-4 ">
      <div className="col-span-4 space-y-4">
        {initialData.map((block, index) => (
          <Block key={index} block={block} />
        ))}
      </div>
      <div className="col-span-1 border-l pl-4 space-y-4">
        <h2 className="font-bold text-lg">Agregar bloque</h2>
        <Button variant="outline" className="w-full flex items-center gap-2">
          <Plus className="w-4 h-4" /> Título
        </Button>
        <Button variant="outline" className="w-full flex items-center gap-2">
          <Plus className="w-4 h-4" /> Párrafo
        </Button>
        <Button variant="outline" className="w-full flex items-center gap-2">
          <Plus className="w-4 h-4" /> Lista
        </Button>
      </div>
    </div>
  );
}

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

function Block({ block }) {
  const [hovered, setHovered] = useState(false);

  const typeLabel = {
    "heading-one": "Título principal (h1)",
    "paragraph": "Párrafo",
    "bullet-list": "Lista con viñetas",
    "numbered-list": "Lista numerada",
    "table": "Tabla"
  }[block.type] || "Otro";

  return (
    <motion.div
      className="relative group rounded-xl border p-4 hover:shadow-lg transition-all"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div className="absolute top-2 right-2 text-xs bg-black text-white rounded px-2 py-1">
          {typeLabel}
        </div>
      )}
      {renderBlock(block)}
    </motion.div>
  );
}

function renderBlock(block) {
    const [isHovered, setIsHovered] = useState(false);

    const handleChange = (e) => {
      onUpdate(e.target.innerText);
    };
  


  switch (block.type) {
    case "heading-one":
      return <h1 className="text-2xl font-bold">{block.content}</h1>;

    case "paragraph":
      if (Array.isArray(block.content)) {
        return (
          <p>
            {block.content.map((item, idx) => {
              if (item.type === "bold") {
                return <strong key={idx}>{item.content}</strong>;
              }
              return <span key={idx}> {item.content}</span>;
            })}
          </p>
        );
      }
      return <p>{block.content}</p>;

    case "bullet-list":
      return (
        <ul className="list-disc list-inside">
          {block.content.map((item, idx) => (
            <li key={idx}>{item.content}</li>
          ))}
        </ul>
      );

    case "numbered-list":
      return (
        <ol className="list-decimal list-inside">
          {block.content.map((item, idx) => (
            <li key={idx}>{item.content}</li>
          ))}
        </ol>
      );

    case "table":
      return (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-collapse">
            <thead>
              <tr>
                {block.content.columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="border px-4 py-2 bg-gray-100"
                    style={{ width: col.width }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.content.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="border px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return <pre>{JSON.stringify(block, null, 2)}</pre>;
  }
}