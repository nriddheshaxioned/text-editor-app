import { $generateHtmlFromNodes } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

const useHandleExport = () => {
  const [editor] = useLexicalComposerContext();
  
  const handleExport = () => {
    editor.update(() => {
      const editorState = editor.getEditorState();
      
      const json = editorState.toJSON();
      console.log("JSON Format:", json);

      const html = $generateHtmlFromNodes(editor, null);
      console.log("HTML Format:", html);
    });
  };

  return {handleExport};
}

export default useHandleExport;