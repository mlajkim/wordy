type Release = {
  version: `v${string}`
  date: `${string}, ${string}`
  majorUpdates: string[]
  minorUpdates: string[]
}
const RELEASES: Release[] = [
  {
    version: "v0.5.2",
    date: "Oct 6, 2021",
    majorUpdates: [
      "Blah",
      "BLah",
    ],
    minorUpdates: [
      
    ]
  }
]

export default RELEASES;