import api from "@/api";
import {
  FormCreateCategorySchema,
  FormCreateCategoryValues,
} from "@/libs/zod-schema";
import { useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import useMasterCategory from "./useMasterCategory";
import { useSWRConfig } from "swr";

export function useCreateCategory() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormCreateCategoryValues>({
    resolver: zodResolver(FormCreateCategorySchema),
  });
  const toast = useToast();
  const { masterCategory } = useMasterCategory();
  const { mutate } = useSWRConfig();

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (values: FormCreateCategoryValues) => {
    try {
      setIsSubmitting(true);
      const response = await api.mainApi.post(api.endpoint.CREATE_CATEGORY, {
        ...values,
        master_id: Number(values.master_id),
      });
      reset();
      setName("");
      setSlug("");
      toast({
        title: "Success",
        description: "Permintaan sukses",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      mutate(api.endpoint.GET_CATEGORIES);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Permintaan gagal",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const createCategory = handleSubmit(onSubmit);

  const handleMasterSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const categoryName = masterCategory?.data?.find(
      (v) => v.id == Number(event.target.value)
    )?.nama!;
    const categorySlug = categoryName.replaceAll(" ", "-").toLocaleLowerCase();
    setName(categoryName);
    setSlug(categorySlug);
    setValue("name", categoryName, { shouldValidate: true });
    setValue("slug", categorySlug, { shouldValidate: true });
    setValue("master_id", event.target.value, {
      shouldValidate: true,
    });
  };

  return {
    isSubmitting,
    createCategory,
    errors,
    register,
    handleMasterSelect,
    setValue,
    categoryNameValue: name,
    categorySlugValue: slug,
  };
}
