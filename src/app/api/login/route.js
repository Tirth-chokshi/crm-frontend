import { cookies } from 'next/headers'
import { createToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Your login validation logic here
    // ...

    // Create token
    const token = await createToken({ 
      userId: 'user_id', 
      email 
    })

    // Set token in HTTP-only cookie
    cookies().set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return Response.json({ 
      success: true, 
      message: 'Login successful' 
    })
  } catch (error) {
    return Response.json({ 
      success: false, 
      message: 'Login failed' 
    }, { 
      status: 400 
    })
  }
}