"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useCallback, useState } from "react";

interface IExtractedTags {
  mentions: string[];
  hashtags: string[];
  extract: () => void;
}

const useExtractTags = (): IExtractedTags => {
  const [editor] = useLexicalComposerContext();
  const [mentions, setMentions] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);

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