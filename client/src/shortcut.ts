import { KeyboardEvent } from 'react';

const shortcut = {
  // Sep 19, 2021
  CMD_SHIFT_S: {
    mac: {
      textField: (event: KeyboardEvent) =>  event.metaKey && event.key   === 'f',
      hotKey: "command+shift+s",
      userFriendly: "⌘ + Shift + S"
    },
    windows: {
      textField: (event: KeyboardEvent) =>  event.ctrlKey && event.key   === 'f',
      hotKey: "ctrl+shift+s",
      userFriendly: "Ctrl + Shift + S",
    }
  },
  // This command is used for hidden usage. YET, backend will check your identity anyway. so No PROBLEM.
  CMD_SHIFT_P: {
    mac: {
      textField: (event: KeyboardEvent) =>  event.metaKey && event.key   === 'p',
      hotKey: "command+shift+p",
      userFriendly: "⌘ + Shift + P"
    },
    windows: {
      textField: (event: KeyboardEvent) =>  event.ctrlKey && event.key   === 'p',
      hotKey: "ctrl+shift+p",
      userFriendly: "Ctrl + Shift + P",
    }
  },
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