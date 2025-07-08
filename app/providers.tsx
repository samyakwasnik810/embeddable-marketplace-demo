"use client"
import { TRPCReactProvider } from "@/lib/trpc/provider";
import { GlobalModalProvider } from "@/modules/modals";
import theme, { ThemeStorageManager } from "@/theme";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import React, { FC, ReactNode } from "react"

interface Props {
    children?: ReactNode;
}

const Providers: FC<Props> = (props) => {
    const { children } = props;

    return (
        <TRPCReactProvider>
            <CacheProvider>
                <ChakraProvider theme={theme} colorModeManager={ThemeStorageManager}>
                    <GlobalModalProvider>
                        {children}
                    </GlobalModalProvider>
                </ChakraProvider>
            </CacheProvider>
        </TRPCReactProvider>
    )
}

export default Providers