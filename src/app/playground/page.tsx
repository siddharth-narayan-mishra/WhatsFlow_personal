'use client'

import Chat from "@/components/playground/Chat/Chat";
import Flow from "@/components/playground/Flow/Flow";
import Preview from "@/components/playground/Preview/Preview";
import { useResizable } from "react-resizable-layout";

const Page = () => {
  const leftResize = useResizable({
    axis: 'x',
    initial: 300,
    min: 200,
  });

  const rightResize = useResizable({
    axis: 'x',
    initial: 300,
    min: 200,
    reverse: true
  });

  return (
    <div style={{ width: '100vw', height: '100vh', display: "flex" }}>
      <div style={{ width: leftResize.position }} className='h-full'>
        <Chat />
      </div>
      <div id="left-separator" {...leftResize.separatorProps} className='w-1 shadow-sm bg-gray-200 hover:bg-blue-400 active:bg-blue-600 cursor-col-resize relative z-10'></div>
      <div style={{ flex: 1 }}>
        <Flow />
      </div>
      <div id="right-separator" {...rightResize.separatorProps} className='w-1 shadow-sm bg-gray-200 hover:bg-blue-400 active:bg-blue-600 cursor-col-resize relative z-10'></div>
      <div style={{ width: rightResize.position }} className='h-full'>
        <Preview />
      </div>
    </div>
  )
}

export default Page