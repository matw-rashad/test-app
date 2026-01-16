"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
} from "lucide-react";
import { useCallback, useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter content...",
  disabled = false,
  className,
  id,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: value,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "rich-text-editor-content prose prose-sm max-w-none focus:outline-none min-h-[150px] px-3 py-2",
        id: id || "",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Return empty string if editor only contains empty paragraph
      if (html === "<p></p>") {
        onChange("");
      } else {
        onChange(html);
      }
    },
  });

  // Update editor content when value prop changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  // Update editable state when disabled prop changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl || "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div
        className={cn(
          "rounded-md border border-input bg-background",
          className
        )}
      >
        <div className="flex flex-wrap gap-1 border-b border-input p-1">
          {[...Array(11)].map((_, i) => (
            <div key={i} className="h-9 w-9 animate-pulse rounded bg-muted" />
          ))}
        </div>
        <div className="min-h-[150px] px-3 py-2">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-input p-1">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          disabled={disabled}
          aria-label="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>

        <div className="mx-1 w-px bg-border" />

        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={disabled}
          aria-label="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
          aria-label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 3 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={disabled}
          aria-label="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>

        <div className="mx-1 w-px bg-border" />

        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          aria-label="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
          aria-label="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Toggle>

        <div className="mx-1 w-px bg-border" />

        <Toggle
          size="sm"
          pressed={editor.isActive("link")}
          onPressedChange={setLink}
          disabled={disabled}
          aria-label="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Toggle>
        {editor.isActive("link") && (
          <Toggle
            size="sm"
            pressed={false}
            onPressedChange={() => editor.chain().focus().unsetLink().run()}
            disabled={disabled}
            aria-label="Remove Link"
          >
            <Unlink className="h-4 w-4" />
          </Toggle>
        )}
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Placeholder styling is handled via CSS */}
      <style jsx global>{`
        .rich-text-editor-content.ProseMirror p.is-editor-empty:first-child::before {
          content: "${placeholder}";
          color: hsl(var(--muted-foreground));
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
