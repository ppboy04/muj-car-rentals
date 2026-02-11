import { NextResponse } from "next/server"

export function createErrorResponse(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status })
}

export function createSuccessResponse(data: any, status = 200) {
  return NextResponse.json(data, { status })
}

export function validateRequiredFields(data: any, fields: string[]) {
  const missing = fields.filter(field => !data[field])
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`)
  }
}

export function transformDates(obj: any) {
  const transformed = { ...obj }
  if (transformed.createdAt instanceof Date) {
    transformed.createdAt = transformed.createdAt.getTime()
  }
  if (transformed.updatedAt instanceof Date) {
    transformed.updatedAt = transformed.updatedAt.getTime()
  }
  return transformed
}
