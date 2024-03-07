import api from "@/api";
import config from "@/config";
import { MasterApiResponse, MasterCategory } from "@/types/response";
import useSWR from "swr";

const params = new URLSearchParams();

if (config.memberCode) {
  params.append("member_code", config.memberCode);
}
if (config.signature) {
  params.append("signature", config.signature);
}

const fetcher = (url: string) =>
  api.masterApi
    .get(url, { params })
    .then((res) => res.data as MasterApiResponse<MasterCategory[]>);

export default function useMasterCategory() {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    api.endpoint.GET_MASTER_CATEGORY,
    fetcher
  );

  return { masterCategory: data, error, isLoading, isValidating, mutate };
}
