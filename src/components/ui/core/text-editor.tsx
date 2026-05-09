import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  Link,
  Strikethrough,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { Control, useController } from 'react-hook-form';
import { cn } from '@/lib/utils';

// ─── Toolbar Config ───────────────────────────────────────────────────────────

const FORMAT_ACTIONS = [
  { icon: Bold, command: 'bold', label: 'Bold (Ctrl+B)' },
  { icon: Italic, command: 'italic', label: 'Italic (Ctrl+I)' },
  { icon: Underline, command: 'underline', label: 'Underline (Ctrl+U)' },
  { icon: Strikethrough, command: 'strikeThrough', label: 'Strikethrough' },
];

const ALIGN_ACTIONS = [
  { icon: AlignLeft, command: 'justifyLeft', label: 'Align Left' },
  { icon: AlignCenter, command: 'justifyCenter', label: 'Align Center' },
  { icon: AlignRight, command: 'justifyRight', label: 'Align Right' },
  { icon: AlignJustify, command: 'justifyFull', label: 'Justify' },
];

const LIST_ACTIONS = [
  { icon: List, command: 'insertUnorderedList', label: 'Bullet List' },
  { icon: ListOrdered, command: 'insertOrderedList', label: 'Numbered List' },
];

const HISTORY_ACTIONS = [
  { icon: Undo2, command: 'undo', label: 'Undo (Ctrl+Z)' },
  { icon: Redo2, command: 'redo', label: 'Redo (Ctrl+Y)' },
];

const FONT_SIZES = [
  { value: '1', label: '10' },
  { value: '2', label: '12' },
  { value: '3', label: '14' },
  { value: '4', label: '16' },
  { value: '5', label: '18' },
  { value: '6', label: '24' },
  { value: '7', label: '32' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const ToolbarDivider = () => (
  <div className="w-px h-4 bg-gray-200 mx-1 flex-shrink-0" />
);

const ToolbarButton = ({
  icon: Icon,
  label,
  onMouseDown,
  isActive = false,
}: {
  icon: React.ElementType;
  label: string;
  onMouseDown: (e: React.MouseEvent) => void;
  isActive?: boolean;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        onMouseDown={onMouseDown}
        className={cn(
          'inline-flex items-center justify-center h-7 w-7 rounded-sm text-sm transition-all duration-100 flex-shrink-0',
          isActive
            ? 'bg-gradient-to-t to-green-800 from-green-500/70 text-white'
            : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100',
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </button>
    </TooltipTrigger>
    <TooltipContent side="bottom" className="text-xs px-2 py-1">
      {label}
    </TooltipContent>
  </Tooltip>
);

const getStats = (el: HTMLDivElement | null) => {
  const text =
    el?.innerHTML
      ?.replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() ?? '';
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  return { words, chars: text.length };
};

// ─── Main Component ───────────────────────────────────────────────────────────

type TextEditorProps = {
  name: string;
  control: Control<any>;
  placeholder?: string;
  minHeight?: number;
};

export const TextEditor = ({
  name,
  control,
  placeholder = 'Write description here...',
  minHeight = 400,
}: TextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [stats, setStats] = useState({ words: 0, chars: 0 });
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [isFocused, setIsFocused] = useState(false);

  const {
    field: { value, onChange },
  } = useController({ name, control });

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
      const empty = (value || '').trim() === '';
      setIsEmpty(empty);
      if (!empty) setStats(getStats(editorRef.current));
    }
  }, [value]);

  const updateContent = useCallback(() => {
    const html = editorRef.current?.innerHTML || '';
    onChange(html);
    const empty = (editorRef.current?.innerText || '').trim() === '';
    setIsEmpty(empty);
    setStats(getStats(editorRef.current));
    const formats = new Set<string>();
    [...FORMAT_ACTIONS, ...ALIGN_ACTIONS, ...LIST_ACTIONS].forEach(
      ({ command }) => {
        try {
          if (document.queryCommandState(command)) formats.add(command);
        } catch {}
      },
    );
    setActiveFormats(formats);
  }, [onChange]);

  const format = useCallback(
    (command: string, val?: string) => {
      if (!editorRef.current) return;
      editorRef.current.focus();
      document.execCommand(command, false, val);
      updateContent();
    },
    [updateContent],
  );

  const handleLink = useCallback(() => {
    const url = window.prompt('Enter URL:', 'https://');
    if (url) format('createLink', url);
  }, [format]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        format('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
      }
    },
    [format],
  );

  return (
    <TooltipProvider delayDuration={300}>
      <FormItem>
        <FormControl>
          <div
            className={cn(
              'rounded-sm shadow-none overflow-hidden bg-white transition-all duration-150',
              'border',
              isFocused
                ? 'border-gray-300 shadow-sm ring-2 ring-gray-100'
                : 'border-gray-200 shadow-xs',
            )}
          >
            {/* ── Toolbar ── */}
            <div className="px-3 py-2 border-b border-gray-100 bg-[#f5f5f5] flex items-center gap-0.5 flex-wrap justify-end">
              {/* Font size select */}
              <Select
                defaultValue="3"
                onValueChange={(v) => format('fontSize', v)}
              >
                <SelectTrigger className="w-[68px] h-7 text-xs border border-gray-200 bg-white rounded-sm shadow-none focus:ring-0 gap-1 px-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_SIZES.map(({ value, label }) => (
                    <SelectItem key={value} value={value} className="text-xs">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <ToolbarDivider />

              {FORMAT_ACTIONS.map(({ icon, command, label }) => (
                <ToolbarButton
                  key={command}
                  icon={icon}
                  label={label}
                  isActive={activeFormats.has(command)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    format(command);
                  }}
                />
              ))}

              <ToolbarDivider />

              {ALIGN_ACTIONS.map(({ icon, command, label }) => (
                <ToolbarButton
                  key={command}
                  icon={icon}
                  label={label}
                  isActive={activeFormats.has(command)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    format(command);
                  }}
                />
              ))}

              <ToolbarDivider />

              {LIST_ACTIONS.map(({ icon, command, label }) => (
                <ToolbarButton
                  key={command}
                  icon={icon}
                  label={label}
                  isActive={activeFormats.has(command)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    format(command);
                  }}
                />
              ))}

              <ToolbarDivider />

              <ToolbarButton
                icon={Link}
                label="Insert Link"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleLink();
                }}
              />

              <ToolbarDivider />

              {HISTORY_ACTIONS.map(({ icon, command, label }) => (
                <ToolbarButton
                  key={command}
                  icon={icon}
                  label={label}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    format(command);
                  }}
                />
              ))}
            </div>

            {/* ── Editor ── */}
            <div className="relative px-5 py-4" style={{ minHeight }}>
              {isEmpty && (
                <p className="absolute top-4 left-5 text-sm text-gray-300 pointer-events-none select-none leading-relaxed">
                  {placeholder}
                </p>
              )}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={updateContent}
                onKeyUp={updateContent}
                onMouseUp={updateContent}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={cn(
                  'outline-none text-sm text-gray-800 leading-7',
                  '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5',
                  '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5',
                  '[&_a]:text-blue-500 [&_a]:underline [&_a]:underline-offset-2',
                  '[&_b]:font-semibold [&_strong]:font-semibold',
                )}
                style={{
                  minHeight: minHeight - 40,
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                }}
              />
            </div>

            {/* ── Footer ── */}
            <div className="px-5 py-2 border-t border-gray-100 bg-[#fafafa] flex items-center justify-between">
              <p className="text-[11px] text-gray-300 select-none">
                Supports <span className="font-medium text-gray-400">bold</span>
                , <span className="italic text-gray-400">italic</span>, lists &
                links
              </p>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] text-gray-400 tabular-nums">
                  {stats.words} {stats.words === 1 ? 'word' : 'words'}
                </span>
                <span className="text-[11px] text-gray-300">·</span>
                <span className="text-[11px] text-gray-400 tabular-nums">
                  {stats.chars} {stats.chars === 1 ? 'char' : 'chars'}
                </span>
              </div>
            </div>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </TooltipProvider>
  );
};
