"use client"
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import {
  ParagraphNode,
  TextNode,
} from 'lexical';
import {
  ListNode,
  ListItemNode
} from "@lexical/list";
import { HashtagNode } from '@lexical/hashtag';

import ExampleTheme from './ExampleTheme';
import MyEditor from './MyEditor';


const placeholder = 'Enter some rich text...';


const editorConfig = {
  namespace: 'Rich Text Editor Demo',
  nodes: [ParagraphNode, TextNode, HashtagNode, ListNode, ListItemNode],
  onError(error) {
    throw error;
  },
  theme: ExampleTheme,
};

const Editor = () => {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                aria-placeholder={placeholder}
                placeholder={
                  <div className="editor-placeholder">{placeholder}</div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />

          <MyEditor />
          <HistoryPlugin />
          <HashtagPlugin />
          <ListPlugin />
          <AutoFocusPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}

export default Editor;