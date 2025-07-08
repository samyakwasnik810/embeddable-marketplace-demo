import React, { ReactNode } from "react"
import Providers from "./providers";
import { Metadata } from "next";
import { getConfig } from "@/lib/database/get";
import { Layout } from "@/modules/common/layout";

interface Props {
    children?: ReactNode;
    params: {
        app: string;
        chain: string;
    };
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const config = await getConfig(params.app, params.chain);
    return {
        title: config.name,
        openGraph: {
            images: ['/logo.png'],
            'title': config.name,
            'releaseDate': config.modifiedDate,
            'creators': config.twitter
        },
    }
}

const RootLayout = async (props: Props) => {
    const { children, params } = props;
    const config = await getConfig(params.app, params.chain);
    return (
        <Providers config={config}>
            <Layout>
                {children}
            </Layout>
        </Providers>
    )
}

export default RootLayout