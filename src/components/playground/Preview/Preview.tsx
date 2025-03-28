import { wapJSON } from '@/config/wapJSON';
import React, { useState } from 'react';
import ChatPreview from './PreviewChat';
import ScreenSelector from './ScreenSelector';
import ScreenPreview from './PreviewScreen';

const Preview = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);

  const handleStartPreview = () => {
    setShowPreview(true);
    setCurrentScreenIndex(0);
  };

  const handleNextScreen = () => {
    if (currentScreenIndex < wapJSON.screens.length - 1) {
      setCurrentScreenIndex(currentScreenIndex + 1);
    }
  };

  const handleFinish = () => {
    setShowPreview(false);
  };

  const handleBackToChat = () => {
    setShowPreview(false);
  };

  const handleSelectScreen = (index: number) => {
    setCurrentScreenIndex(index);
  };

  return (
    <div className="p-4 h-screen flex flex-col items-center justify-center text-gray-500 text-xs">
      <ScreenSelector
        screens={wapJSON.screens}
        currentScreenIndex={currentScreenIndex}
        onSelectScreen={handleSelectScreen}
      />
      <div className='h-[458px] w-[256px] relative'>
        <ChatPreview onStartPreview={handleStartPreview} />
        {showPreview ?
          < ScreenPreview
            screen={wapJSON.screens[currentScreenIndex]}
            onNext={handleNextScreen}
            onFinish={handleFinish}
            onBack={handleBackToChat}
          /> : ""}
      </div>
    </div>
  );
};

export default Preview;