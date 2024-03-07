import api from "@/api";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { useState } from "react";

export default function useDeleteCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const deleteCategory = async () => {
    try {
      setIsLoading(true);
      const response = await api.mainApi.delete(
        `${api.endpoint.DELETE_CATEGORY}/${selectedId}`
      );
      toast({
        title: "Success",
        description: "Permintaan sukses",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
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

  return {
    isDeleting: isLoading,
    isAlertOpen: isOpen,
    openAlert: onOpen,
    deleteCategory,
    closeAlert: onClose,
    deleteId: selectedId,
    setDeleteId: setSelectedId,
  };
}
