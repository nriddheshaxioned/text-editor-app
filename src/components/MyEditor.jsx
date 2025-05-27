"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import AutoCompleteList from "./AutoCompleteList";
import { useState } from "react";
import useExtractTags from "@/hooks/useExtractTags";
import { $getRoot, $getSelection, TextNode } from "lexical";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { Button } from "./ui/button";


const dummyTopics = ["#climate", "#sports", "#tech"];
const dummyUsers = ["@alice", "@bob", "@charlie", "@dave"];


const MyEditor = () => {
    const [editor] = useLexicalComposerContext();

    const [text, setText] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [trigger, setTrigger] = useState(null);
    const [query, setQuery] = useState("");

    const { mentions, hashtags, extract } = useExtractTags(editor);

    function onChange(editorState) {
        editorState.read(() => {
            const root = $getRoot();
            const textContent = root.getTextContent();

            console.log("ONCHANGE -->", root);

            setText(textContent);

            const selection = $getSelection();
            if (selection && selection.isCollapsed()) {
                const anchor = selection.anchor;
                const node = anchor.getNode();
                if (node instanceof TextNode) {
                    const offset = anchor.offset;
                    const textBefore = node.getTextContent().slice(0, offset);

                    const atIndex = textBefore.lastIndexOf("@");
                    const hashIndex = textBefore.lastIndexOf("#");

                    let index = Math.max(atIndex, hashIndex);
                    if (index !== -1) {
                        const char = textBefore[index];
                        const currentQuery = textBefore.slice(index + 1);
                        if (/^\w*$/.test(currentQuery)) {
                            setTrigger(char);
                            setQuery(currentQuery);

                            if (char === "@") {
                                setSuggestions(
                                    dummyUsers.filter((u) =>
                                        u.toLowerCase().includes(currentQuery.toLowerCase())
                                    )
                                );
                            } else if (char === "#") {
                                setSuggestions(
                                    dummyTopics.filter((t) =>
                                        t.toLowerCase().includes(currentQuery.toLowerCase())
                                    )
                                );
                            }
                            setShowSuggestions(true);
                            return;
                        }
                    }
                }
            }
            setShowSuggestions(false);
            setTrigger(null);
            setQuery("");
        });
    }

    function onSelectSuggestion(suggestion) {
        editor.update(() => {
            const selection = $getSelection();
            if (selection && selection.isCollapsed()) {
                const anchor = selection.anchor;
                const node = anchor.getNode();

                if (node instanceof TextNode) {
                    const offset = anchor.offset;
                    const textContent = node.getTextContent();

                    const index = Math.max(
                        textContent.lastIndexOf(trigger, offset - 1),
                        0
                    );
                    const before = textContent.slice(0, index);
                    const after = textContent.slice(offset);

                    node.setTextContent(before + suggestion + " " + after);

                    const newOffset = before.length + suggestion.length + 1;
                    selection.anchor.set(node.getKey(), newOffset, "text");
                    selection.focus.set(node.getKey(), newOffset, "text");

                    setShowSuggestions(false);
                    setTrigger(null);
                    setQuery("");
                }
            }
        });
    }

    return (
        <div className="mx-2 my-4">
            <OnChangePlugin onChange={onChange} />

            {showSuggestions && (
                <AutoCompleteList options={suggestions} onSelect={onSelectSuggestion} />
            )}

            <div style={{ marginBottom: 8 }}>
                <Button onClick={extract}>Extract</Button>
            </div>
            <div>
                <strong>Mentions:</strong> {mentions.join(", ")}
            </div>
            <div>
                <strong>Hashtags:</strong> {hashtags.join(", ")}
            </div>
        </div>
    );
}

export default MyEditor;