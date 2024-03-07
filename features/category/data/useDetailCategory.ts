import api from "@/api";
import { Category } from "@/types/category";
import { MainApiResponse } from "@/types/response";
import { useState } from "react";
import useSWR from "swr";

export default function useDetailCategory() {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    api.endpoint.GET_DETAIL_CATEGORY,
    {
      revalidateOnMount: false,
    }
  );
  const [isGetDetail, setIsGetDetail] = useState(false);

  const getDetailCategory = async (id: number) => {
    try {
      setIsGetDetail(true);
      const response = await api.mainApi
        .get(`${api.endpoint.GET_DETAIL_CATEGORY}/${id}`)
        .then((res) => res.data as MainApiResponse<Category>);
      mutate(response.response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsGetDetail(false);
    }
  };

  return {
    category: data as Category,
    error,
    isGetDetail,
    isValidating,
    mutate,
    getDetailCategory,
  };
}
