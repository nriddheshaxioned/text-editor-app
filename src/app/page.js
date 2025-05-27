import Editor from "@/components/Editor";
import Image from "next/image";

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="my-12 font-extrabold">Lexical Rich Text Editor</h1>
      <Editor />
    </div>
  );
}
