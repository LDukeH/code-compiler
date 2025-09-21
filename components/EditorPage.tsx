"use client";

import { Editor } from "@monaco-editor/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

import { getSubmissionStatus } from "@/api";

import { LANGUAGES } from "@/constant";

export default function EditorPage() {
  const [language, setLanguage] = useState("");
  const [id, setId] = useState(0);
  const [value, setValue] = useState("");

  const [output, setOutput] = useState("");

  const runCode = async () => {
    if (language === "html") {
      return;
    }
    try {
      const result = await getSubmissionStatus(value, id);
      console.log(result);
      setOutput(
        result.stdout || result.compile_output || result.message || "No output"
      );
    } catch (error) {
      console.error("Failed to run code:", error);
    }
  };

  return (
    <div className="p-4">
      <Select
        onValueChange={(val) => {
          setLanguage(val);
          const lang = LANGUAGES.find((l) => l.name === val);
          setId(lang ? lang.id : 0);
        }}
      >
        <SelectTrigger className="w-[210px]">
          <SelectValue placeholder="Choose a language" />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.id} value={lang.name}>
              {lang.name[0].toUpperCase() + lang.name.slice(1)} ({lang.version})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Editor
        width="90%"
        height="100%"
        value={value}
        onChange={(val) => {
          setValue(val || "");
        }}
        language={language}
        className="border-2 border-gray-300 mt-4 shadow-lg h-96 rounded-xs"
        theme="vs-dark"
      />
      {language === "html" && (
        <div>
          <iframe
            srcDoc={value}
            className="border-2 border-gray-300 mt-4 shadow-lg h-40 rounded-xs"
          ></iframe>
        </div>
      )}

      <button
        onClick={() => {
          runCode();
        }}
        className="cursor-pointer px-2 py-1 border-1 font-semibold border-gray-600 active:scale-95 active:opacity-75 transition-all duration-300"
      >
        Run code
      </button>

      {output && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Output:</h3>
          <pre className="bg-gray-100 p-4 rounded shadow">{output}</pre>
        </div>
      )}
    </div>
  );
}
