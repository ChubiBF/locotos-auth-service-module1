import type { Request, Response } from 'express'
import { z } from 'zod'

export function validateUser (schema: z.ZodSchema) {
  return (req: Request, res: Response, next: any) => {
    const result = schema.safeParse(req.body)
    if (!result.success) return res.status(400).json({ error: result.error.issues })
    req.body = result.data
    next()
  }
}
