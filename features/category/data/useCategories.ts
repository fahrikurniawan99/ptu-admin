import api from "@/api";
import { Category } from "@/types/category";
import { MainApiResponse } from "@/types/response";
import useSWR from "swr";

const fetcher = (url: string) =>
  api.mainApi.get(url).then((res) => res.data as MainApiResponse<Category[]>);

export default function useCategories() {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    api.endpoint.GET_CATEGORIES,
    fetcher
  );

  return { categories: data, error, isLoading, isValidating, mutate };
}
