import { useState, useRef, useCallback, useEffect } from 'react';

export function usePanels() {
  const [sidebarWidth, setSidebarWidth] = useState(380);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(30);
  const [bottomCollapsed, setBottomCollapsed] = useState(false);
  const sidebarDragRef = useRef(false);
  const bottomDragRef = useRef(false);

  const handleSidebarDragStart = useCallback(() => {
    sidebarDragRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleSidebarDragEnd = useCallback(() => {
    sidebarDragRef.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const handleSidebarDragMove = useCallback((e) => {
    if (!sidebarDragRef.current) return;
    const newWidth = Math.max(280, Math.min(600, e.clientX));
    setSidebarWidth(newWidth);
  }, []);

  const handleBottomDragStart = useCallback(() => {
    bottomDragRef.current = true;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleBottomDragEnd = useCallback(() => {
    bottomDragRef.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const handleBottomDragMove = useCallback((e) => {
    if (!bottomDragRef.current) return;
    const rect = document.querySelector('.main-content')?.getBoundingClientRect();
    if (!rect) return;
    const relativeY = e.clientY - rect.top;
    const newHeight = Math.max(15, Math.min(70, ((rect.height - relativeY) / rect.height) * 100));
    setBottomPanelHeight(newHeight);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      handleSidebarDragMove(e);
      handleBottomDragMove(e);
    };
    const onUp = () => {
      handleSidebarDragEnd();
      handleBottomDragEnd();
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [handleSidebarDragMove, handleSidebarDragEnd, handleBottomDragMove, handleBottomDragEnd]);

  return {
    sidebarWidth,
    sidebarCollapsed,
    setSidebarCollapsed,
    bottomPanelHeight,
    bottomCollapsed,
    setBottomCollapsed,
    handleSidebarDragStart,
    handleBottomDragStart,
  };
}
