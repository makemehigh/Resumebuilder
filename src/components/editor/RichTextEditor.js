'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link2, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Indent,
  Outdent
} from 'lucide-react';

const toolbarOptions = [
  { id: 'bold', icon: Bold, command: 'bold', label: 'Bold' },
  { id: 'italic', icon: Italic, command: 'italic', label: 'Italic' },
  { id: 'underline', icon: Underline, command: 'underline', label: 'Underline' },
  { id: 'separator-1', type: 'separator' },
  { id: 'link', icon: Link2, command: 'createLink', label: 'Insert Link' },
  { id: 'separator-2', type: 'separator' },
  { id: 'ul', icon: List, command: 'insertUnorderedList', label: 'Bullet List' },
  { id: 'ol', icon: ListOrdered, command: 'insertOrderedList', label: 'Numbered List' },
  { id: 'separator-3', type: 'separator' },
  { id: 'left', icon: AlignLeft, command: 'justifyLeft', label: 'Align Left' },
  { id: 'center', icon: AlignCenter, command: 'justifyCenter', label: 'Align Center' },
  { id: 'right', icon: AlignRight, command: 'justifyRight', label: 'Align Right' },
];

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Enter description...',
  className = '' 
}) {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (editorRef.current && isInitialMount.current) {
      if (value && value !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = value;
      }
      isInitialMount.current = false;
    }
  }, [value]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleLinkInsert = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '    ');
    }
    
    if (e.key === 'Enter' && !e.shiftKey) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const currentNode = range.startContainer;
        
        if (currentNode.nodeType === Node.TEXT_NODE) {
          const parent = currentNode.parentElement;
          if (parent.tagName === 'LI') {
            e.preventDefault();
            document.execCommand('insertParagraph', false, null);
            return;
          }
        }
        
        if (range.collapsed && range.endOffset === range.startContainer.length) {
          const nextSibling = range.endContainer.nextSibling;
          if (nextSibling && nextSibling.nodeType === Node.ELEMENT_NODE) {
            if (nextSibling.tagName === 'UL' || nextSibling.tagName === 'OL') {
              e.preventDefault();
              const newLi = document.createElement('li');
              newLi.textContent = '';
              nextSibling.appendChild(newLi);
              
              const newRange = document.createRange();
              newRange.setStart(newLi, 0);
              newRange.collapse(true);
              selection.removeAllRanges();
              selection.addRange(newRange);
              return;
            }
          }
        }
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div ref={containerRef} className={`border border-slate-200 rounded-lg overflow-hidden ${className}`}>
      <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 flex-wrap">
        {toolbarOptions.map((option) => {
          if (option.type === 'separator') {
            return (
              <div 
                key={option.id} 
                className="w-px h-5 bg-slate-300 mx-1"
              />
            );
          }

          const Icon = option.icon;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                if (option.id === 'link') {
                  handleLinkInsert();
                } else {
                  execCommand(option.command);
                }
              }}
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors"
              title={option.label}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>
      
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className="min-h-[120px] p-3 text-sm focus:outline-none"
        style={{ 
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          fontFamily: 'inherit',
          lineHeight: '1.6'
        }}
        data-placeholder={placeholder}
      />
      
      <style jsx global>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
          display: block;
          height: 100%;
        }
        
        .editor-content ul,
        .editor-content ol {
          margin-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          padding-left: 0.5rem;
        }
        
        .editor-content li {
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
        }
        
        .editor-content p {
          margin-top: 0;
          margin-bottom: 0.5rem;
        }
        
        .editor-content a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .editor-content div {
          min-height: 1em;
        }
      `}</style>
    </div>
  );
}
