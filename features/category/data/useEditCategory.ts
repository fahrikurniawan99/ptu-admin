import api from "@/api";
import {
  FormEditCategorySchema,
  FormEditCategoryValues,
} from "@/libs/zod-schema";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useDetailCategory from "./useDetailCategory";
import { useSWRConfig } from "swr";
import useMasterCategory from "./useMasterCategory";

export default function useEditCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { mutate } = useSWRConfig();
  const { category } = useDetailCategory();
  const { masterCategory } = useMasterCategory();

  const form = useForm<FormEditCategoryValues>({
    resolver: zodResolver(FormEditCategorySchema),
  });

  const {
    setValue,
    getValues,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const toast = useToast();

  useEffect(() => {
    if (category) {
      setValue("icon", category.icon ?? "", { shouldValidate: true });
      setValue("name", category.name, { shouldValidate: true });
      setValue("master_id", category.masterId, { shouldValidate: true });
      setValue("slug", category.slug, { shouldValidate: true });
    }

    return () => {};
  }, [category]);

  const updateCategory = async ({
    master_id,
    ...values
  }: FormEditCategoryValues) => {
    try {
      setIsLoading(true);
      const response = await api.mainApi.put(
        `${api.endpoint.UPDATE_CATEGORY}/${category.id}`,
        { masterId: master_id, ...values }
      );
      reset();
      toast({
        title: "Success",
        description: "Permintaan sukses",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      mutate(api.endpoint.GET_CATEGORIES);
      onClose();
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
      setIsLoading(false);
    }
  };

  const handleMasterSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const categoryName = masterCategory?.data?.find(
      (v) => v.id == Number(event.target.value)
    )?.nama!;
    const categorySlug = categoryName.replaceAll(" ", "-").toLocaleLowerCase();
    setValue("name", categoryName, { shouldValidate: true });
    setValue("slug", categorySlug, { shouldValidate: true });
    setValue("master_id", Number(event.target.value), {
      shouldValidate: true,
    });
  };

  const submitEditForm = handleSubmit(updateCategory);

  return {
    openModal: onOpen,
    closeModal: onClose,
    isModalOpen: isOpen,
    getValues,
    categoryName: getValues("name"),
    categoryIcon: getValues("icon"),
    categoryMasterId: getValues("master_id"),
    categorySlug: getValues("slug"),
    isSubmitting: isLoading,
    submitEditForm,
    register,
    errors,
    handleMasterSelect,
  };
}
