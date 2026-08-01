"use client";

import { useState } from "react";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2
} from "lucide-react";

type RichTextNotesProps = {
  initialContent: unknown;
  initialText: string;
  onChange: (contentText: string, contentJson: JSONContent) => void;
};

type ToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
};

function ToolbarButton({
  active = false,
  children,
  disabled = false,
  label,
  onClick
}: ToolbarButtonProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={
        active
          ? "flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          : "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
      }
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function isTiptapDocument(content: unknown): content is JSONContent {
  return Boolean(
    content &&
      typeof content === "object" &&
      "type" in content &&
      (content as { type?: unknown }).type === "doc"
  );
}

export function RichTextNotes({
  initialContent,
  initialText,
  onChange
}: RichTextNotesProps) {
  const [isEmpty, setIsEmpty] = useState(!initialText.trim());
  const editor = useEditor({
    content: isTiptapDocument(initialContent) ? initialContent : initialText,
    editorProps: {
      attributes: {
        "aria-label": "Research notes editor",
        class:
          "min-h-[28rem] px-5 py-5 leading-7 outline-none [&_a]:cursor-pointer [&_a]:text-primary [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_ol]:my-3 [&_ol]:ml-6 [&_ol]:list-decimal [&_p]:my-2 [&_ul]:my-3 [&_ul]:ml-6 [&_ul]:list-disc"
      }
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3]
        },
        link: {
          autolink: true,
          defaultProtocol: "https",
          openOnClick: false
        }
      })
    ],
    immediatelyRender: false,
    onUpdate: ({ editor: updatedEditor }) => {
      setIsEmpty(updatedEditor.isEmpty);
      onChange(updatedEditor.getText(), updatedEditor.getJSON());
    }
  });

  if (!editor) {
    return <div className="min-h-[31rem] animate-pulse rounded-[1.5rem] bg-muted" />;
  }

  function editLink() {
    if (!editor) {
      return;
    }

    const currentUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt(
      "Enter a link URL. Leave it empty to remove the current link.",
      currentUrl ?? ""
    );

    if (url === null) {
      return;
    }

    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] border bg-background focus-within:ring-2 focus-within:ring-ring/30">
      <div
        aria-label="Note formatting"
        className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-2"
        role="toolbar"
      >
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          label="Heading"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("bold")}
          label="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          label="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("bulletList")}
          label="Bulleted list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          label="Numbered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("blockquote")}
          label="Quote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("link")} label="Add or edit link" onClick={editLink}>
          <Link2 className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <span aria-hidden="true" className="mx-1 h-6 w-px bg-border" />
        <ToolbarButton
          disabled={!editor.can().chain().focus().undo().run()}
          label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          disabled={!editor.can().chain().focus().redo().run()}
          label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
      </div>
      <div className="relative">
        {isEmpty ? (
          <p className="pointer-events-none absolute left-5 top-5 text-muted-foreground">
            Start with one insight, question, or idea you want to understand.
          </p>
        ) : null}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
