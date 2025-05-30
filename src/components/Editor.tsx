"use client"
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode, LinkNode, } from "@lexical/link";
import {
  ListItemNode,
  ListNode
} from "@lexical/list";
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import {
  ParagraphNode,
  TextNode,
} from 'lexical';

import AutoLinkPlugin from '@/plugins/AutoLinkPlugin';
import ExampleTheme from './ExampleTheme';
import MyEditor from './MyEditor';


const placeholder = 'Enter some rich text...';

const editorConfig = {
  namespace: 'Rich Text Editor Demo',
  nodes: [ParagraphNode, TextNode, HashtagNode, ListNode, ListItemNode, LinkNode, AutoLinkNode],
  onError(error: Error) {
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
          <LinkPlugin />
          <AutoLinkPlugin />
          <ClickableLinkPlugin />
          <AutoFocusPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}

export default Editor;