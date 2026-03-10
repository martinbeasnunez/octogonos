'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Pega aquí tu texto...',
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-voraz-red underline' },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[200px] px-4 py-3 focus:outline-none text-voraz-black ' +
          'prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight ' +
          'prose-h2:text-base prose-h3:text-sm ' +
          'prose-p:text-[13px] prose-p:leading-relaxed prose-p:text-voraz-gray-600 ' +
          'prose-strong:text-voraz-black prose-strong:font-bold ' +
          'prose-ul:text-[13px] prose-ol:text-[13px] ' +
          'prose-li:text-voraz-gray-600 prose-li:leading-relaxed ' +
          'prose-a:text-voraz-red prose-a:underline',
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
  });

  // Sync external content changes
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-voraz-gray-200 focus-within:border-voraz-red focus-within:ring-1 focus-within:ring-voraz-red">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-voraz-gray-200 bg-voraz-gray-50 px-2 py-1.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Negrita"
        >
          B
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Cursiva"
        >
          <em>I</em>
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Título"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Subtítulo"
        >
          H3
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Lista"
        >
          • —
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Lista numerada"
        >
          1.
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => {
            const url = window.prompt('URL del enlace:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          active={editor.isActive('link')}
          title="Enlace"
        >
          🔗
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          active={false}
          title="Quitar enlace"
        >
          ✕
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <div className="relative">
        <EditorContent editor={editor} />
        {editor.isEmpty && (
          <p className="pointer-events-none absolute left-4 top-3 text-[13px] text-voraz-gray-400">
            {placeholder}
          </p>
        )}
      </div>
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded px-2 py-1 text-[11px] font-bold transition-colors ${
        active
          ? 'bg-voraz-red text-voraz-white'
          : 'text-voraz-gray-500 hover:bg-voraz-gray-200 hover:text-voraz-black'
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-0.5 h-4 w-px bg-voraz-gray-200" />;
}
