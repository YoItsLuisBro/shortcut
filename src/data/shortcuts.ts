import type { Shortcut } from "../types/shortcut";

export const shortcuts: Shortcut[] = [
  {
    id: "vscode-select-next-occurrence",
    keys: [
      {
        operatingSystem: "windows",
        keys: ["CTRL", "D"],
      },
    ],
    title: "Select the next occurrence",
    description:
      "Add the next matching instance of the selected text to the active selection. Repeat the shortcut to edit matching values together.",
    application: "visual-studio-code",
    applicationLabel: "VS Code",
    category: "Editing",
    operatingSystems: ["windows"],
    difficulty: "beginner",
    usefulness: "essential",
    tags: ["editing", "selection", "multi-cursor", "duplicate-text"],
    example:
      "Select a variable name and repeat the shortcut to edit several matching variables at once.",
    relatedShortcutIds: ["vscode-select-all-occurrences"],
  },
  {
    id: "vscode-select-all-occurrences",
    keys: [
      {
        operatingSystem: "windows",
        keys: ["CTRL", "SHIFT", "L"],
      },
    ],
    title: "Select all occurrences",
    description:
      "Select every occurrence of the current selection so they can be edited simultaneously.",
    application: "visual-studio-code",
    applicationLabel: "VS Code",
    category: "Editing",
    operatingSystems: ["windows"],
    difficulty: "intermediate",
    usefulness: "high",
    tags: ["editing", "selection", "multi-cursor", "replace"],
    example:
      "Select a repeated property name and change every matching instance in one edit.",
    relatedShortcutIds: ["vscode-select-next-occurrence"],
  },
  {
    id: "vscode-open-command-palette",
    keys: [
      {
        operatingSystem: "windows",
        keys: ["CTRL", "SHIFT", "P"],
      },
    ],
    title: "Open the command palette",
    description:
      "Open VS Code's searchable command interface to access editor actions without navigating menus.",
    application: "visual-studio-code",
    applicationLabel: "VS Code",
    category: "Navigation",
    operatingSystems: ["windows"],
    difficulty: "beginner",
    usefulness: "essential",
    tags: ["commands", "navigation", "command-palette", "keyboard-first"],
    example:
      "Open the command palette and search for formatting, settings, or source-control commands.",
  },
  {
    id: "chrome-reopen-closed-tab",
    keys: [
      {
        operatingSystem: "windows",
        keys: ["CTRL", "SHIFT", "T"],
      },
    ],
    title: "Reopen the last closed tab",
    description:
      "Restore the most recently closed browser tab. Repeat the shortcut to reopen additional closed tabs.",
    application: "google-chrome",
    applicationLabel: "Google Chrome",
    category: "Tabs",
    operatingSystems: ["windows"],
    difficulty: "beginner",
    usefulness: "essential",
    tags: ["tabs", "restore", "browser", "recovery"],
    example: "Use this after accidentally closing a page that you still need.",
  },
  {
    id: "chrome-focus-address-bar",
    keys: [
      {
        operatingSystem: "windows",
        keys: ["CTRL", "L"],
      },
    ],
    title: "Focus the address bar",
    description:
      "Move keyboard focus to the address bar and select its current contents.",
    application: "google-chrome",
    applicationLabel: "Google Chrome",
    category: "Navigation",
    operatingSystems: ["windows"],
    difficulty: "beginner",
    usefulness: "essential",
    tags: ["navigation", "address-bar", "search", "browser"],
    example:
      "Press the shortcut, type a search or website address, and press Enter.",
  },
  {
    id: "windows-lock-device",
    keys: [
      {
        operatingSystem: "windows",
        keys: ["WIN", "L"],
      },
    ],
    title: "Lock the device",
    description:
      "Lock the current Windows session while leaving open applications running.",
    application: "windows",
    applicationLabel: "Windows",
    category: "Security",
    operatingSystems: ["windows"],
    difficulty: "beginner",
    usefulness: "essential",
    tags: ["security", "privacy", "lock-screen", "system"],
    example: "Lock your computer whenever you step away from your desk.",
  },
  {
    id: "windows-open-file-explorer",
    keys: [
      {
        operatingSystem: "windows",
        keys: ["WIN", "E"],
      },
    ],
    title: "Open File Explorer",
    description:
      "Open a new File Explorer window for navigating files, folders, and connected drives.",
    application: "windows",
    applicationLabel: "Windows",
    category: "Navigation",
    operatingSystems: ["windows"],
    difficulty: "beginner",
    usefulness: "high",
    tags: ["files", "folders", "navigation", "system"],
    example:
      "Use the shortcut instead of searching for File Explorer in the Start menu.",
  },
  {
    id: "excel-edit-active-cell",
    keys: [
      {
        operatingSystem: "windows",
        keys: ["F2"],
      },
    ],
    title: "Edit the active cell",
    description:
      "Place the active Excel cell into edit mode and position the cursor at the end of its current contents.",
    application: "microsoft-excel",
    applicationLabel: "Microsoft Excel",
    category: "Editing",
    operatingSystems: ["windows"],
    difficulty: "beginner",
    usefulness: "essential",
    tags: ["cells", "editing", "spreadsheet", "data-entry"],
    example:
      "Use F2 to modify a formula or value without replacing the entire cell.",
  },
  {
    id: "excel-insert-current-date",
    keys: [
      {
        operatingSystem: "windows",
        keys: ["CTRL", ";"],
      },
    ],
    title: "Insert the current date",
    description:
      "Insert the current system date into the active Excel cell as a static value.",
    application: "microsoft-excel",
    applicationLabel: "Microsoft Excel",
    category: "Data Entry",
    operatingSystems: ["windows"],
    difficulty: "beginner",
    usefulness: "high",
    tags: ["date", "cells", "data-entry", "productivity"],
    example: "Add today's date to a transaction log or accounting worksheet.",
  },
  {
    id: "excel-toggle-absolute-reference",
    keys: [
      {
        operatingSystem: "windows",
        keys: ["F4"],
      },
    ],
    title: "Toggle formula reference types",
    description:
      "Cycle a selected formula reference between relative, absolute, and mixed reference formats.",
    application: "microsoft-excel",
    applicationLabel: "Microsoft Excel",
    category: "Formulas",
    operatingSystems: ["windows"],
    difficulty: "intermediate",
    usefulness: "essential",
    tags: ["formulas", "references", "absolute-reference", "spreadsheet"],
    example:
      "While editing A1 in a formula, press F4 to cycle through $A$1, A$1, $A1, and A1.",
  },
];
