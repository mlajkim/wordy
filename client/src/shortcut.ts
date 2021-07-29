import { KeyboardEvent } from 'react';

const shorcut = {
  CMD_ENTER: {
    mac: {
      textField: (event: KeyboardEvent) =>  event.metaKey && event.key   === 'Enter',
      hotKey: "command+enter",
      userFreindly: "⌘ + Enter",
    },
    windows: {
      textField: (event: KeyboardEvent) =>  event.ctrlKey && event.key   === 'Enter',
      hotKey: "ctrl+enter",
      userFreindly: "Ctrl + Enter",
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

export default shorcut;