import { Button } from '@/components/ui/button'
import React from 'react'

const Preview = () => {
  return (
    <div className='h-screen relative'>
      <iframe className='w-full h-full' src="https://business.facebook.com/wa/manage/flows/506844115831284/preview/?token=6a8bfc0b-2dc2-40cb-a731-b9dad3c09643">
      </iframe>
      <Button className='absolute bottom-12 right-1/2 translate-x-1/2' size="lg">Publish</Button>
    </div>
  )
}

export default Preview