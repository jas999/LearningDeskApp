import { User } from "./user.models";

export class Comment {
	id:string
	createdById:string
	comment:string
	createdBy:User
	createdDateTime:string
	updatedDateTime:string
}