import api from "@/api";
import * as UI from "@chakra-ui/react";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useRef, useState } from "react";
import { useSWRConfig } from "swr";
import CreateForm from "../components/create-form";
import useCategories from "../data/useCategories";
import useDeleteCategory from "../data/useDeleteCategory";
import useDetailCategory from "../data/useDetailCategory";
import useEditCategory from "../data/useEditCategory";
import useMasterCategory from "../data/useMasterCategory";

export default function Categories() {
  const { categories } = useCategories();
  const { mutate } = useSWRConfig();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const {
    isAlertOpen,
    closeAlert,
    openAlert,
    deleteCategory,
    isDeleting,
    setDeleteId,
  } = useDeleteCategory();

  const [isOpen, setIsOpen] = useState(false);
  const toggleForm = () => setIsOpen(!isOpen);
  const {
    closeModal,
    openModal,
    isModalOpen,
    isSubmitting,
    handleMasterSelect,
    register,
    getValues,
    submitEditForm,
    errors,
  } = useEditCategory();
  const { getDetailCategory, category, isGetDetail } = useDetailCategory();

  const { masterCategory } = useMasterCategory();

  return (
    <UI.Box p={10} width={"100%"}>
      <UI.AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeAlert}
      >
        <UI.AlertDialogOverlay>
          <UI.AlertDialogContent>
            <UI.AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Category
            </UI.AlertDialogHeader>

            <UI.AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </UI.AlertDialogBody>

            <UI.AlertDialogFooter>
              <UI.Button
                isLoading={isDeleting}
                ref={cancelRef}
                onClick={closeAlert}
              >
                Cancel
              </UI.Button>
              <UI.Button
                isLoading={isDeleting}
                colorScheme="red"
                onClick={() =>
                  deleteCategory().then(() =>
                    mutate(api.endpoint.GET_CATEGORIES)
                  )
                }
                ml={3}
              >
                Delete
              </UI.Button>
            </UI.AlertDialogFooter>
          </UI.AlertDialogContent>
        </UI.AlertDialogOverlay>
      </UI.AlertDialog>
      <UI.Modal isOpen={isModalOpen} onClose={closeModal}>
        <UI.ModalOverlay />
        <UI.ModalContent>
          <form onSubmit={submitEditForm}>
            <UI.ModalHeader>Edit Kategori</UI.ModalHeader>
            <UI.ModalCloseButton />
            <UI.ModalBody>
              <UI.VStack>
                <UI.FormControl>
                  <UI.FormLabel>Master Data</UI.FormLabel>
                  <UI.Select
                    defaultValue={
                      masterCategory?.data?.find(
                        (v) => v.id == getValues("master_id")
                      )?.id ?? ""
                    }
                    bg={"white"}
                    onChange={handleMasterSelect}
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
                  <UI.Input {...register("name")} bg={"white"} type="text" />
                </UI.FormControl>
                <UI.FormControl>
                  <UI.FormLabel>Slug</UI.FormLabel>
                  <UI.Input {...register("slug")} bg={"white"} type="text" />
                </UI.FormControl>
                <UI.FormControl>
                  <UI.FormLabel>Icon URL</UI.FormLabel>
                  <UI.Input {...register("icon")} bg={"white"} type="text" />
                </UI.FormControl>
              </UI.VStack>
            </UI.ModalBody>

            <UI.ModalFooter>
              <UI.ButtonGroup gap={2}>
                <UI.Button
                  isLoading={isSubmitting}
                  loadingText="Permintaan di kirim"
                  colorScheme="teal"
                  type="submit"
                >
                  Simpan Perubahan
                </UI.Button>
                <UI.Button
                  isLoading={isSubmitting}
                  type="button"
                  colorScheme="red"
                  variant="ghost"
                  mr={3}
                  onClick={closeModal}
                >
                  Batalkan
                </UI.Button>
              </UI.ButtonGroup>
            </UI.ModalFooter>
          </form>
        </UI.ModalContent>
      </UI.Modal>
      <UI.Flex>
        <UI.Heading size="md" as="h1" mb={10}>
          Kategori
        </UI.Heading>
        <UI.Spacer />
        <UI.Button colorScheme={isOpen ? "red" : "gray"} onClick={toggleForm}>
          {isOpen ? "Batalkan" : "Tambah Data"}
        </UI.Button>
      </UI.Flex>
      <UI.Collapse in={isOpen} animateOpacity>
        <CreateForm />
      </UI.Collapse>
      <UI.TableContainer w={"100%"}>
        <UI.Table variant="simple">
          <UI.TableCaption>List Kategori</UI.TableCaption>
          <UI.Thead>
            <UI.Tr>
              <UI.Th>kategori id</UI.Th>
              <UI.Th>nama</UI.Th>
              <UI.Th>master id</UI.Th>
              <UI.Th>icon</UI.Th>
              <UI.Th>slug</UI.Th>
              <UI.Th>Aksi</UI.Th>
            </UI.Tr>
          </UI.Thead>
          <UI.Tbody>
            {categories?.response.data.map((category, index) => (
              <UI.Tr key={category.id}>
                <UI.Td>#{category.id}</UI.Td>
                <UI.Td>{category.name}</UI.Td>
                <UI.Td>{category.masterId}</UI.Td>
                <UI.Td>{category.icon}</UI.Td>
                <UI.Td>{category.slug}</UI.Td>
                <UI.Td>
                  <UI.ButtonGroup>
                    <UI.Button
                      onClick={() => {
                        setDeleteId(category.id);
                        openAlert();
                      }}
                      size={"sm"}
                      colorScheme="red"
                      width={30}
                      p={2}
                    >
                      <Trash2Icon />
                    </UI.Button>
                    <UI.Button
                      isLoading={isGetDetail}
                      onClick={() => {
                        getDetailCategory(category.id).then(() => openModal());
                      }}
                      size={"sm"}
                      colorScheme="teal"
                      width={30}
                      p={2}
                    >
                      <EditIcon />
                    </UI.Button>
                  </UI.ButtonGroup>
                </UI.Td>
              </UI.Tr>
            ))}
          </UI.Tbody>
        </UI.Table>
      </UI.TableContainer>
    </UI.Box>
  );
}
