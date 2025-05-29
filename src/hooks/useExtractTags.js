"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useCallback, useState } from "react";

function useExtractTags() {
    const [editor] = useLexicalComposerContext();

    const [mentions, setMentions] = useState([]);
    const [hashtags, setHashtags] = useState([]);

    const extract = useCallback(() => {
        editor.update(() => {
            const root = $getRoot();
            const text = root.getTextContent();

            console.log("Plain Text Format: ", text);

            const mentionMatches = text.match(/@\w+/g) || [];
            const hashtagMatches = text.match(/#\w+/g) || [];

            setMentions(mentionMatches);
            setHashtags(hashtagMatches);
        });
    }, [editor]);

    return { mentions, hashtags, extract };
}

export default useExtractTags;