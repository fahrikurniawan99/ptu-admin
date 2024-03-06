import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Highlight,
  Input,
  Select,
  Spacer,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useRef, useState } from "react";
import useCategories from "../data/useCategories";
import useMasterCategory from "../data/useMasterCategory";
import { useForm } from "react-hook-form";
import {
  FormCreateCategorySchema,
  FormCreateCategoryValues,
} from "@/libs/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/api";
import { useSWRConfig } from "swr";

export default function Categories() {
  const { categories, error, isLoading, isValidating } = useCategories();
  const { category } = useMasterCategory();
  const toast = useToast();
  const { mutate } = useSWRConfig();
  const { isOpen: isAlertDeletOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [selectId, setSelectId] = useState<number | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleForm = () => setIsOpen(!isOpen);

  const form = useForm<FormCreateCategoryValues>({
    resolver: zodResolver(FormCreateCategorySchema),
  });

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
      setIsOpen(false);
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
  const deleteCategory = async () => {
    try {
      setIsDeleting(true);
      const response = await api.mainApi.delete(
        `${api.endpoint.DELETE_CATEGORY}/${selectId}`
      );
      toast({
        title: "Success",
        description: "Permintaan sukses",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      onClose();
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
      setIsDeleting(false);
    }
  };

  return (
    <Box p={10} width={"100%"}>
      <AlertDialog
        isOpen={isAlertDeletOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Category
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button isLoading={isDeleting} ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                isLoading={isDeleting}
                colorScheme="red"
                onClick={deleteCategory}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Flex>
        <Heading size="md" as="h1" mb={10}>
          Kategori
        </Heading>
        <Spacer />
        <Button colorScheme={isOpen ? "red" : "gray"} onClick={toggleForm}>
          {isOpen ? "Batalkan" : "Tambah Data"}
        </Button>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack bg={"gray.50"} p={8} mb={10} align={"stretch"} gap={8}>
            <Alert status="info">
              <AlertIcon />
              <Highlight query={"Wajib Baca"} styles={{ fontWeight: 600 }}>
                Wajib Baca : Data kategori di ambil berdasarkan master data.
                Data dapat di ubah ketika sudah di tambahkan
              </Highlight>
            </Alert>
            <FormControl>
              <FormLabel>Master Data</FormLabel>
              <Select
                onChange={(event) => {
                  const categoryName = category?.data?.find(
                    (v) => v.id == Number(event.target.value)
                  )?.nama!;
                  const categorySlug = categoryName
                    .replaceAll(" ", "-")
                    .toLocaleLowerCase();
                  setName(categoryName);
                  setSlug(categorySlug);
                  setValue("name", categoryName, { shouldValidate: true });
                  setValue("slug", categorySlug, { shouldValidate: true });
                  setValue("master_id", event.target.value, {
                    shouldValidate: true,
                  });
                }}
                bg={"white"}
                placeholder="Select option"
              >
                {category?.data?.map((masterCategory) => (
                  <option value={masterCategory.id} key={masterCategory.id}>
                    {masterCategory.nama}
                  </option>
                ))}
              </Select>
              {/* <FormHelperText>
                Note: Data kategori di ambil berdasarkan master data. Data dapat
                di ubah ketika sudah di tambahkan
              </FormHelperText> */}
            </FormControl>
            <FormControl>
              <FormLabel>Nama Kategori</FormLabel>
              <Input value={name} bg={"white"} type="text" />
              {/* <FormHelperText>
                Note: Data kategori di ambil berdasarkan master data. Data dapat
                di ubah ketika sudah di tambahkan
              </FormHelperText> */}
            </FormControl>
            <FormControl>
              <FormLabel>Slug</FormLabel>
              <Input value={slug} bg={"white"} type="text" />
              {/* <FormHelperText>
                Note: Data kategori di ambil berdasarkan master data. Data dapat
                di ubah ketika sudah di tambahkan
              </FormHelperText> */}
            </FormControl>
            <FormControl>
              <FormLabel>Icon URL</FormLabel>
              <Input {...register("icon")} bg={"white"} type="text" />
              {/* <FormHelperText>
                Note: Data kategori di ambil berdasarkan master data. Data dapat
                di ubah ketika sudah di tambahkan
              </FormHelperText> */}
            </FormControl>
            <Button
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
              loadingText="Permintaan di kirim"
            >
              Tambahkan Data
            </Button>
          </VStack>
        </form>
      </Collapse>
      <TableContainer w={"100%"}>
        <Table variant="simple">
          <TableCaption>List Kategori</TableCaption>
          <Thead>
            <Tr>
              <Th>kategori id</Th>
              <Th>nama</Th>
              <Th>master id</Th>
              <Th>icon</Th>
              <Th>slug</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories?.response.data.map((category, index) => (
              <Tr key={category.id}>
                <Td>#{category.id}</Td>
                <Td>{category.name}</Td>
                <Td>{category.masterId}</Td>
                <Td>{category.icon}</Td>
                <Td>{category.slug}</Td>
                <Td>
                  <ButtonGroup>
                    <Button
                      onClick={() => {
                        setSelectId(category.id);
                        onOpen();
                      }}
                      size={"sm"}
                      colorScheme="red"
                      width={30}
                      p={2}
                    >
                      <Trash2Icon />
                    </Button>
                    <Button size={"sm"} colorScheme="teal" width={30} p={2}>
                      <EditIcon />
                    </Button>
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </Tbody>
          {/* <Tfoot>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Tfoot> */}
        </Table>
      </TableContainer>
    </Box>
  );
}
