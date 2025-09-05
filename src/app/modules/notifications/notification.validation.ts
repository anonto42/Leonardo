import { z } from "zod"

const getNotificationValidation = z.object({
    query: z.object({
        page: z.coerce.number().optional(),
        limit: z.coerce.number().optional()
    }).strict()
})

const updateStatusNotificationValidation = z.object({
    body: z.object({
        ids: z.array( z.string( { required_error: "You must give the updated notifications array!"} ) )
    }).strict()
})


export const NotificationValidation = {
    getNotificationValidation,
    updateStatusNotificationValidation
}