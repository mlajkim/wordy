import { Version } from "./type/availableType"

type Release = {
  version: Version
  date: `${string}, ${string}`
  isFinished: boolean
  majorUpdates: string[]
}
const RELEASES: Release[] = [
  {
    version: "v0.6.0",
    date: "Dec 2, 2021",
    isFinished: false,
    majorUpdates: [
      "Now you can upload your photo for your word data! (Only available to admins at this point)"
    ]
  },
  {
    version: "v0.5.5",
    date: "Oct 31, 2021",
    isFinished: true,
    majorUpdates: [
      "There was a huge bug where it deleted your semester data, if not downloaded yet",
      "Fixed the bug where when you have a higher version than the current one, it no longer shows",
      "Fixed the bug where temporary close does not work as it is supposed to",
    ]
  },
  {
    version: "v0.5.4",
    date: "Oct 28, 2021",
    isFinished: true,
    majorUpdates: [
      "Editing word now has default trim() for each side",
      "Encrypting words method is implemented, yet it is currently disabled as decrypting encrypted data takes too much time",
      "Adding words now require WAT token",
      "OKR is temporarily disabled",
      "Fixed the bug where Google One Tap Signin sometimes appear randomly, when it should not"
    ]
  },
  {
    version: "v0.5.3",
    date: "Oct 8, 2021",
    isFinished: true,
    majorUpdates: [
      "You can now expand/collapse your YearChip, when it has more than three.",
      "Language has now the order according to its usage and popularity. Your language preference will bring your language to the top",
      "Now, list only renders that contain (Today, Yesterday ...)",
      "You can now cancel during search",
      "Implemented One Click Google Signin (Beta)",
      "Fixed bug with highlighting",
    ]
  },
  {
    version: "v0.5.2",
    date: "Oct 6, 2021",
    isFinished: true,
    majorUpdates: [
      "Wordy now searches without considering upper/lower case",
      "You can run 'searching' from command + shift + s (Shortcut added)",
      "You can now disable auto detection API. It will be disabled, if you do not have enough permission",
      "Search result will be now highlighted. You can disable this too from setting.",
    ]
  },
  {
    version: "v0.5.1",
    date: "Sep 24, 2021",
    isFinished: true,
    majorUpdates: [
      "Wordy now searches without considering upper/lower case",
      "You can run 'searching' from command + shift + s (Shortcut added)",
      "You can now disable auto detection API. It will be disabled, if you do not have enough permission",
      "Search result will be now highlighted. You can disable this too from setting.",
    ]
  },
  {
    version: "v0.5.0",
    date: "Sep 13, 2021",
    isFinished: true,
    majorUpdates: [
      "Search feature released. you can now search your word from your database, securely using Wordy Access Token (WAT).",
      "Added a new search setting (Which is designed to save up your data usage for your phone)",
      "Appbar now shows and hides icons based on the device size of your screen."
    ]
  },
]

export default RELEASES;