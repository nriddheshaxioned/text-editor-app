"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import AutoCompleteList from "./AutoCompleteList";
import { useEffect, useState } from "react";
import useExtractTags from "@/hooks/useExtractTags";
import { $getRoot, $getSelection, KEY_DOWN_COMMAND, TextNode } from "lexical";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { Button } from "./ui/button";
import useHandleExport from "@/hooks/useHandleExport";


const dummyTopics = ["#climate", "#sports", "#tech"];
const dummyUsers = ["@alice", "@bob", "@charlie", "@dave"];


const MyEditor = () => {
    const [editor] = useLexicalComposerContext();
    const { mentions, hashtags, extract } = useExtractTags(editor);
    const { handleExport } = useHandleExport(editor);

    const [text, setText] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [trigger, setTrigger] = useState(null);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        return editor.registerCommand(
            KEY_DOWN_COMMAND,
            (event) => {
                if (!showSuggestions) return false;

                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setActiveIndex((prev) =>
                        prev < suggestions.length - 1 ? prev + 1 : 0
                    );
                    return true;
                } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setActiveIndex((prev) =>
                        prev > 0 ? prev - 1 : suggestions.length - 1
                    );
                    return true;
                } else if (event.key === "Enter") {
                    event.preventDefault();
                    if (suggestions[activeIndex]) {
                        onSelectSuggestion(suggestions[activeIndex]);
                        return true;
                    }
                } else if (event.key === "Escape") {
                    setShowSuggestions(false);
                    return true;
                }

                return false;
            },
            0
        );
    }, [editor, showSuggestions, suggestions, activeIndex]);


    function onChange(editorState) {
        editorState.read(() => {
            const root = $getRoot();
            const textContent = root.getTextContent();
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
            setActiveIndex(0);
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

    const handleExtractClick = () => {
        extract();
        handleExport();
    }

    return (
        <div className="mx-2 my-4">
            <OnChangePlugin onChange={onChange} />

            {showSuggestions && (
                <AutoCompleteList options={suggestions} onSelect={onSelectSuggestion} activeIndex={activeIndex} />
            )}

            <div className="py-2">
                <Button onClick={handleExtractClick}>Extract</Button>
            </div>
            <div>
                <span className="text-gray-600 text-sm">Mentions:</span> {mentions.join(", ")}
            </div>
            <div>
                <span className="text-gray-600 text-sm">Hashtags:</span> {hashtags.join(", ")}
            </div>
        </div>
    );
}

export default MyEditor;