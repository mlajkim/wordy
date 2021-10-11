import { ResourceId, WordPure } from "../type/resourceType"
import Wrn from '../type/wrn'

export type NewlyModifyWords = {
  type: "create" | "delete" | "update"
  data: (ResourceId & WordPure)[]
  wrns?: Wrn[]
}