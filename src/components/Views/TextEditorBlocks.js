'use client'
import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import NotesIcon from '@mui/icons-material/Notes';
import TitleIcon from '@mui/icons-material/Title';
import Title1 from "../elements/Title1";

function RichTextCellEditor({ content, onChange }) {
    const [fragments, setFragments] = useState(content || []);
  
    const handleTextChange = (e) => {
      const newText = e.target.innerText;
      const newFragments = [{ type: "text", content: newText }];
      setFragments(newFragments);
      onChange(newFragments);
    };
  
    const applyFormat = (format) => {
      const text = fragments.map(f => f.content).join("");
      const newFragment = [{ type: format, content: text }];
      setFragments(newFragment);
      onChange(newFragment);
    };
  
    return (
      <div className="relative group">
        <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button onClick={() => applyFormat("text")} className="text-xs px-2 py-1 bg-gray-200 rounded">T</button>
          <button onClick={() => applyFormat("bold")} className="text-xs font-bold px-2 py-1 bg-gray-200 rounded">B</button>
          <button onClick={() => applyFormat("italic")} className="text-xs italic px-2 py-1 bg-gray-200 rounded">I</button>
        </div>
        <div
          contentEditable
          suppressContentEditableWarning
          onInput={handleTextChange}
          className="min-h-[30px] border px-2 py-1 rounded hover:border-blue-400 focus:outline-none"
        >
          {fragments.map((frag, i) => {
            if (frag.type === "bold") return <strong key={i}>{frag.content}</strong>;
            if (frag.type === "italic") return <em key={i}>{frag.content}</em>;
            return <span key={i}>{frag.content}</span>;
          })}
        </div>
      </div>
    );
  }

export default function DocumentRenderer({ initialData }) {   
    const [data, setData] = useState(initialData);
    
    const updateBlockContent = (index, newContent, type) => {
        const newData = [...data];
        if (type === "heading-one") {
            newData[index].content = newContent;
            newData[index].html = "<h1>"+newContent+"</h1>";
            
        }
        setData(newData);
    };


  return (
    <div className="grid grid-cols-5  ">
      <div className="col-span-4 w-full bg-gray-100 p-10">
        <section className="bg-white p-4">
            {data.map((block, index) => (
            <Block 
            key={index} 
            block={block} 
            onUpdate={(newContent, type)=> updateBlockContent(index, newContent, type)}
            />
            ))}
        </section>
      </div>
      <div className="col-span-1 border-l pl-4 space-y-4">
        <div className="mb-2 border-b border-b-gray-200">
            <Title1>Bloques</Title1>
        </div>
        <section className="grid grid-cols-2 gap-2">
            <Button onClick={()=>console.log(data)} variant="outline" className="w-full flex flex-col h-[100px] items-center gap-2">
            <TitleIcon className="w-4 h-4" /> <span>Título</span>
            </Button>
            <Button variant="outline" className="w-full flex flex-col items-center gap-2 h-[100px]">
            <NotesIcon className="w-4 h-4" /> <span>Párrafo</span>
            </Button>
        </section>
      </div>
    </div>
  );
}


function Block({ block, onUpdate }) {
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
        className="relative group p-4 rounded-lg  "
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div className="absolute top-2 right-2 text-xs bg-black text-white rounded px-2 py-1">
          {typeLabel}
        </div>
      )}

    {renderBlock(block, onUpdate)}
    </motion.div>
  );
}

function renderBlock(block, onUpdate) {
    const [queryH1, setQueryH1] = useState(block.content);

    const [isHovered, setIsHovered] = useState(false);
    const headingRef = useRef(null);
    const handleChange = (e) => {
        const text = e.target.innerText;
        onUpdate(text, block.type);
    };
  
    const handleChangeQuery=(evt)=>{
        setQueryH1(evt.target.textContent);
    };

    const baseProps = {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        contentEditable: true,
        suppressContentEditableWarning: true,
        onInput: handleChange,
        className: cn("border-transparent px-2 py-2 ", isHovered && "border border-blue-500"),
      };

  switch (block.type) {
    case "heading-one":
      return <h1  
      key={block.type}
      onMouseEnter={()=>setIsHovered(true)}
      onMouseLeave={()=>setIsHovered(false)}
      className={cn("text-2xl font-bold", isHovered && "border border-[#0C1019]")}>
        {block.content}
      </h1>;

    case "paragraph":
      if (Array.isArray(block.content)) {
        return (
          <p key={block.type} {...baseProps}>
            {block.content.map((item, idx) => {
              if (item.type === "bold") {
                return <strong {...baseProps} key={idx}>{item.content}</strong>;
              }
              if (item.type === "italic") {
                return <i {...baseProps} key={idx}>{item.content}</i>;
              }
              return <span {...baseProps} key={idx}> {item.content}</span>;
            })}
          </p>
        );
      }
      return <p {...baseProps}>{block.content}</p>;

    case "bullet-list":
      return (
        <ul {...baseProps} className="list-disc list-inside">
          {block.content.map((item, idx) => (
            <li key={idx}>{item.content}</li>
          ))}
        </ul>
      );

    case "numbered-list":
      return (
        <ol {...baseProps} className="list-decimal list-inside">
          {block.content.map((item, idx) => (
            <li key={idx}>{item.content}</li>
          ))}
        </ol>
      );

      case "table":
        const updateTableCell = (rIdx, cIdx, newContent) => {
          const newTable = JSON.parse(JSON.stringify(block)); // deep clone
          newTable.content.tbody.content[rIdx].content[cIdx].content = newContent;
          onUpdate(newTable.content);
        };
  
        return (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-collapse">
              <thead>
                {block.content.thead.content.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.content.map((cell, cIdx) => (
                      <th key={cIdx} className="border px-4 py-2 bg-gray-100">
                        {cell.content}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {block.content.tbody.content.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.content.map((cell, cIdx) => (
                      <td key={cIdx} className="border px-2 py-1 align-top">
                        <RichTextCellEditor
                          content={cell.content}
                          onChange={(newContent) => updateTableCell(rIdx, cIdx, newContent)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

    default:
      return <pre {...baseProps}>{JSON.stringify(block, null, 2)}</pre>;
  }
}