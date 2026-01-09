import React from 'react'
import Link from 'next/link'

export default function page() {
  return (
    <div className='flex items-center justify-center h-screen'>
        <h1 className='text-2xl font-bold text-red-500 text-center'>You have exceeded the limit of uploads</h1>
        <p className='text-center'>Contact: <Link href="mailto:shahzaibalisomroo@gmail.com">shahzaibalisomroo@gmail.com</Link></p>
    </div>
  )
}
