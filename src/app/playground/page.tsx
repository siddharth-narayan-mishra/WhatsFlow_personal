'use client'
import Chat from "@/components/playground/Chat/Chat";
import Flow from "@/components/playground/Flow/Flow";
import Preview from "@/components/playground/Preview/Preview";
import { useState, useEffect } from "react";
import { useResizable } from "react-resizable-layout";

const Page = () => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [shouldResize, setShouldResize] = useState(false);
  const [flowJSON, setFlowJSON] = useState<any>();
  const [previewURL,setPreviewURL] = useState("")

  useEffect(() => {
    console.log("flowJSON = ", flowJSON)
  }, [flowJSON])

  const leftResize = useResizable({
    axis: 'x',
    initial: 350,
    min: 250,
  });
  const rightResize = useResizable({
    axis: 'x',
    initial: 350,
    min: 250,
    reverse: true
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (hasInteracted) {
      timeoutId = setTimeout(() => {
        setShouldResize(true);
      }, 1000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hasInteracted]);

  return (
    <div style={{ width: '100vw', height: '100vh', display: "flex" }}>
      <div
        style={{
          width: shouldResize ? leftResize.position : '100%',
          height: '100%'
        }}
        className={`${shouldResize ? '' : 'z-50'}`}
      >
        <Chat setHasInteracted={setHasInteracted} setFlowJSON={setFlowJSON} interacted={hasInteracted} setPreviewUrl={setPreviewURL}/>
      </div>

      {shouldResize && (
        <>
          <div
            id="left-separator"
            {...leftResize.separatorProps}
            className='w-1 shadow-sm bg-gray-200 hover:bg-blue-400 active:bg-blue-600 cursor-col-resize relative z-10 transition-all duration-500'
          ></div>
          <div style={{ flex: 1, transition: 'all 0.5s ease-in-out' }}>
            <Flow flowData={flowJSON} />
          </div>
          <div
            id="right-separator"
            {...rightResize.separatorProps}
            className='w-1 shadow-sm bg-gray-200 hover:bg-blue-400 active:bg-blue-600 cursor-col-resize relative z-10 transition-all duration-500'
          ></div>
          <div
            style={{
              width: rightResize.position,
              height: '100%'
            }}
          >
            <Preview preview_url={previewURL} />
          </div>
        </>
      )}
    </div>
  )
}

export default Page