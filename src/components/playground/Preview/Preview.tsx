import { Button } from '@/components/ui/button'
import React from 'react'

const Preview = ({preview_url}:{preview_url:string}) => {
  return (
    <div className='h-screen relative'>
      <iframe className='w-full h-full' src={preview_url}>
      </iframe>
      <Button className='absolute bottom-12 right-1/2 translate-x-1/2' size="lg">Publish</Button>
    </div>
  )
}

export default Preview