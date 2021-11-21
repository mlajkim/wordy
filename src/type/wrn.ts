type Wrn = `wrn:${FutureUsage}:${DataType}:${DataLocation}:${PublicId}:${PrivateId}`;


// ==============
// Future Usage
// ==============
export type DataType = 
  `static:${StaticWrn}` |
  `user:${UserWrn}` | 
  `okr:${OkrWrn}` | 
  `word:${WordWrn}` | 
  `wp:${WordyPolicy}` | 
  `backend_assigned_identity:${ServerAssignedId}`

type StaticWrn =
  "image"

type UserWrn =
  "end_user" |
  "internal" |
  "anonymous" |
  "backend" // ! this should be internal, legacy code (temporary)

type WordWrn = 
  "*" |
  `${Semester}`
type Semester = number

type OkrWrn = 
  "my_okr" |
  "okr_object" |
  "container" | 
  "custom_link"

type WordyPolicy = 
  "pre_defined"

type ServerAssignedId = 
  "anonymous_public" |
  "group_member"
  

// ==============
// Else
// ==============
type DataLocation = 'mdb' | 'internal' | AwsTokyoS3
type AwsTokyoS3 = 'tokyo-s3'
type FutureUsage = ""
type PublicId = string 
  | "sample-data" // sample data is used for sample data for new user!
type PrivateId = string

export default Wrn