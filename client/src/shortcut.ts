import { KeyboardEvent } from 'react';

const shortcut = {
  CMD_ENTER: {
    mac: {
      textField: (event: KeyboardEvent) =>  event.metaKey && event.key   === 'Enter',
      hotKey: "command+enter",
      userFriendly: "⌘ + Enter"
    },
    windows: {
      textField: (event: KeyboardEvent) =>  event.ctrlKey && event.key   === 'Enter',
      hotKey: "ctrl+enter",
      userFriendly: "Ctrl + Enter",
    }
  },
  ESC: {
    general: {
      textField: (event: KeyboardEvent) => event.key === 'Escape',
      hotKey: "Escape",
      userFriendly: "Esc"
    }
  } 
};

export default shortcut;