"use client";

import { useState } from "react";

const EditableBlock = ({ type, content, html, onChange }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const renderContent = () => {
    if (typeof content === "string") {
      return (
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative border-l-4 border-transparent pl-2 hover:border-blue-500"
        >
          {isHovered && (
            <span className="absolute top-0 right-0 text-xs text-gray-500 bg-white px-1">
              {type}
            </span>
          )}

          <input
            type="text"
            className="w-full bg-transparent font-inherit text-inherit outline-none"
            value={content}
            onChange={handleChange}
          />
        </div>
      );
    }

    if (Array.isArray(content)) {
      return (
        <div className="pl-4">
          {content.map((child, idx) => (
            <BlockRenderer key={idx} block={child} />
          ))}
        </div>
      );
    }

    return <span className="text-red-500">[Formato inválido]</span>;
  };

  switch (type) {
    case "heading-one":
      return <h1 className="text-3xl font-bold">{renderContent()}</h1>;
    case "heading-two":
      return <h2 className="text-2xl font-semibold">{renderContent()}</h2>;
    case "paragraph":
      return <p className="text-base">{renderContent()}</p>;
    case "bold":
      return <strong>{renderContent()}</strong>;
    case "bullet-list":
      return (
        <ul className="list-disc pl-6">
          {content.map((item, idx) => (
            <BlockRenderer key={idx} block={item} />
          ))}
        </ul>
      );
    case "item-list":
      return <li>{renderContent()}</li>;
    case "numbered-list":
      return (
        <ol className="list-decimal pl-6">
          {content.map((item, idx) => (
            <BlockRenderer key={idx} block={item} />
          ))}
        </ol>
      );
    case "table":
      return (
        <table className="table-auto border mt-2 mb-4">
          <thead>
            <tr>
              {content.head.map((cell, idx) => (
                <th
                  key={idx}
                  style={{ width: cell.width }}
                  className="border px-2 py-1 font-semibold"
                >
                  {cell.content}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.body.map((row, idx) => (
              <tr key={idx}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="border px-2 py-1">
                    {cell.content}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    default:
      return <div className="text-gray-400 italic">[Bloque desconocido]</div>;
  }
};

export default function BlockRenderer({ block }) {
  const [content, setContent] = useState(block.content);

  return (
    <EditableBlock
      type={block.type}
      content={content}
      html={block.html}
      onChange={setContent}
    />
  );
}