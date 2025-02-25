'use client';

import React, { useState, useEffect } from 'react';
import { StyleSheetManager } from 'styled-components';

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent FOUC by delaying render until hydration
  }

  return <StyleSheetManager>{children}</StyleSheetManager>;
}
