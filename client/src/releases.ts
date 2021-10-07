type Release = {
  version: `v${string}`
  date: `${string}, ${string}`
  isFinished: boolean
  majorUpdates: string[]
}
const RELEASES: Release[] = [
  {
    version: "v0.5.3",
    date: "Oct ?, 2021",
    isFinished: false,
    majorUpdates: [
      "You can now expand/collapse your YearChip, when it has more than three.",
      "Language has now the order according to its usage and popularity. Your language preference will bring your language to the top",
      "Now, list only renders that contain (Today, Yesterday ...)"
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