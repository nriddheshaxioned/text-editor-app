"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from "@lexical/list";
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, Redo, Strikethrough, Underline, Undo } from 'lucide-react';

const LowPriority = 1;

const Divider = () => {
  return <div className="divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isUnorderedList, setIsUnorderedList] = useState(false);


  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

      const anchorNode = selection.anchor.getNode();
      const parent = anchorNode.getParent();
      const grandParent = parent?.getParent();
      const possibleListNode = $isListNode(parent) ? parent : $isListNode(grandParent) ? grandParent : null;

      setIsUnorderedList(
        possibleListNode != null && possibleListNode.getListType?.() === 'bullet'
      );
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, $updateToolbar]);

  return (
    <div className="toolbar" ref={toolbarRef}>
      <Button
        variant='seconday'
        aria-label="Undo"
        className="toolbar-item spaced"
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}><Undo />
      </Button>

      <Button
        variant='seconday'
        aria-label="Redo"
        className="toolbar-item"
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}><Redo />
      </Button>

      <Divider />

      <Button
        variant="secondary"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
        aria-label="Format Bold">
        <Bold />
      </Button>

      <Button
        variant="secondary"
        aria-label="Format Italics"
        className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
      >
        <Italic />
      </Button>

      <Button
        variant="secondary"
        aria-label="Format Underline"
        className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}>
        <Underline />
      </Button>

      <Button
        variant='secondary'
        aria-label="Format Strikethrough"
        className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}>
        <Strikethrough />
      </Button>

      <Divider />

      <Button
        variant='secondary'
        aria-label="Format Unordered List"
        className={'toolbar-item spaced ' + (isUnorderedList ? 'active' : '')}
        onClick={() => {
          if (isUnorderedList) {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          }
        }}>
        <List />
      </Button>

      <Divider />
    </div>
  );
}