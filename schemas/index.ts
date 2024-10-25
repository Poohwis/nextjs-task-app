import { MAXLENGTH_DESCRIPTION, MAXLENGTH_WORKSPACENAME } from "@/lib/constant"
import * as z from "zod"

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"}
    ),
    password: z.string().min(1,{
        message: "password is required"
    })
})
export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required"}
    ),
    password: z.string().min(6 ,{
        message: "Minimum 6 characthers required"
    }),
    name : z.string().min(1, {
        message : "Name is required"
    })
})

export const NewWorkspaceSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required"
    }).max(MAXLENGTH_WORKSPACENAME, {message: "No more than 20 characthers"}),
    description : z.string().max(MAXLENGTH_DESCRIPTION ,{ message: "No more than 30 characthers"}).optional()
    // ,colorScheme : z.string()
    ,

})

export const NewCategorySchema = z.object({
    name : z.string().min(1, {message : "Category name is required"})
})