import { ResourceId, WordPure } from "../type/resourceType"

export type NewlyModifyWords = {
  type: "create" | "remove" | "update"
  data: (ResourceId & WordPure)[]
}