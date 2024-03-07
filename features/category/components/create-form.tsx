import React, { useEffect } from "react";
import { useCreateCategory } from "../data/useCreateCategory";
import * as UI from "@chakra-ui/react";
import useMasterCategory from "../data/useMasterCategory";
import useDetailCategory from "../data/useDetailCategory";

export default function CreateForm() {
  const {
    createCategory,
    handleMasterSelect,
    isSubmitting,
    register,
    categoryNameValue,
    categorySlugValue,
  } = useCreateCategory();
  const { masterCategory } = useMasterCategory();
  // const { category } = useDetailCategory({ onSuccess: () => {} });

  // useEffect(() => {
  //   console.log("render");

  //   return () => {};
  // }, [category]);

  return (
    <form onSubmit={createCategory}>
      <UI.VStack bg={"gray.50"} p={8} mb={10} align={"stretch"} gap={8}>
        <UI.Alert status="info">
          <UI.AlertIcon />
          <UI.Highlight query={"Wajib Baca"} styles={{ fontWeight: 600 }}>
            Wajib Baca : Data kategori di ambil berdasarkan master data. Data
            dapat di ubah ketika sudah di tambahkan
          </UI.Highlight>
        </UI.Alert>
        <UI.FormControl>
          <UI.FormLabel>Master Data</UI.FormLabel>
          <UI.Select
            onChange={handleMasterSelect}
            bg={"white"}
            placeholder="Select option"
          >
            {masterCategory?.data?.map((masterCategory) => (
              <option value={masterCategory.id} key={masterCategory.id}>
                {masterCategory.nama}
              </option>
            ))}
          </UI.Select>
        </UI.FormControl>
        <UI.FormControl>
          <UI.FormLabel>Nama Kategori</UI.FormLabel>
          <UI.Input
            value={categoryNameValue}
            onChange={() => {}}
            bg={"white"}
            type="text"
          />
        </UI.FormControl>
        <UI.FormControl>
          <UI.FormLabel>Slug</UI.FormLabel>
          <UI.Input
            value={categorySlugValue}
            onChange={() => {}}
            bg={"white"}
            type="text"
          />
        </UI.FormControl>
        <UI.FormControl>
          <UI.FormLabel>Icon URL</UI.FormLabel>
          <UI.Input {...register("icon")} bg={"white"} type="text" />
        </UI.FormControl>
        <UI.Button
          type="submit"
          colorScheme="teal"
          isLoading={isSubmitting}
          loadingText="Permintaan di kirim"
        >
          Tambahkan Data
        </UI.Button>
      </UI.VStack>
    </form>
  );
}
