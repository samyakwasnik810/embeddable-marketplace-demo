import React from "react"
import { getAllApps } from "@/lib/database/get";
import { HomePage } from "@/modules/home";


interface Props {
    params: {
        chain: string;
    }
}

const Page = async (props: Props) => {
    const { params: { chain } } = props;
    const apps = await getAllApps(chain);
    return (
        <HomePage apps={apps} chainId={chain} />
    )
}

export default Page