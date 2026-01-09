"use client"
import React from 'react'
import { toast } from 'sonner'

export default function page() {
    const [password, setPassword] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
  const resetUploadLimits = async () => {
    setLoading(true)
    const res = await fetch('/api/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      toast.success('Upload limits reset successfully')
    } else {
      toast.error('Failed to reset upload limits')
    }
    setLoading(false)
  }
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col gap-4 max-w-2xs">
        <h1 className='text-2xl font-bold mb-4'>Reset Upload Limits</h1>
        <div className="relative">
        <input type={showPassword ? 'text' : 'password'} placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} className='border border-gray-300 rounded px-4 py-2 w-full' />
        {/* Password Eye icon */}
        {showPassword ? 
        <svg className='size-5 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer' onClick={() => setShowPassword(false)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg> : 
        <svg className='size-5 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer' onClick={() => setShowPassword(true)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>}
        </div>
        <button className='w-full bg-blue-500 text-white px-4 py-2 rounded' onClick={resetUploadLimits} disabled={loading}>{loading ? 'Resetting...' : 'Reset Upload Limits'}</button>
      </div>
    </div>
  )
}
