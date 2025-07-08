import { trpcReactClient } from "@/lib/trpc/client";

export function useGetRate(address: string, action: string) {
    return trpcReactClient.ado.rates.getRate.useQuery({
        "contract-address": address,
        action: action
    }, {
        enabled: !!address
    })
}