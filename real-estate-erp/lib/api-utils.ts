// Utility function to safely parse API responses
export async function parseApiResponse(response: Response) {
  try {
    const text = await response.text()
    
    // Try to parse as JSON
    try {
      return JSON.parse(text)
    } catch {
      // If not JSON, return an error object
      return {
        error: 'Invalid response format',
        message: text || 'حدث خطأ في الخادم'
      }
    }
  } catch (error) {
    return {
      error: 'Failed to read response',
      message: 'حدث خطأ في قراءة الاستجابة'
    }
  }
}

// Common error handler for form submissions
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.error) return error.error
  return 'حدث خطأ غير متوقع'
}

// Clean form data - remove empty strings for optional fields
export function cleanFormData<T extends Record<string, any>>(data: T): Partial<T> {
  const cleaned: Partial<T> = {}
  
  Object.entries(data).forEach(([key, value]) => {
    // Keep the value if it's not an empty string, or if it's a required field
    if (value !== '') {
      cleaned[key as keyof T] = value
    } else if (value === '' && typeof value === 'string') {
      // Convert empty strings to undefined for optional fields
      cleaned[key as keyof T] = undefined as any
    }
  })
  
  return cleaned
}