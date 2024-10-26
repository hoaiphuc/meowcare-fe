// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "react-redux";
import store from "./lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return <NextUIProvider>
    <Provider store={store}>{children}</Provider>
  </NextUIProvider>;
}
