type Release = {
  version: `v${string}`
  date: `${string}, ${string}`
  isFinished: boolean
  majorUpdates: string[]
  minorUpdates: string[]
}
const RELEASES: Release[] = [
  {
    version: "v0.5.3",
    date: "Oct ?, 2021",
    isFinished: false,
    majorUpdates: [
      "Blah",
      "BLah",
    ],
    minorUpdates: [
      
    ]
  },
  {
    version: "v0.5.2",
    date: "Oct 6, 2021",
    isFinished: true,
    majorUpdates: [
      "Blah",
      "BLah",
    ],
    minorUpdates: [
      
    ]
  },
  {
    version: "v0.5.1",
    date: "Sep 24, 2021",
    isFinished: true,
    majorUpdates: [
      "Blah",
      "BLah",
    ],
    minorUpdates: [
      
    ]
  },
  {
    version: "v0.5.0",
    date: "Sep 13, 2021",
    isFinished: true,
    majorUpdates: [
      "Introduce \"Search\": You can now search your data on the Appbar",
      "BLah",
    ],
    minorUpdates: [
      
    ]
  },
]

export default RELEASES;