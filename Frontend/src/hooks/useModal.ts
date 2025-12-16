import { create } from "zustand";

type ModalStore = {
    isOpen: boolean;
    openModal: (open: boolean) => void;
};

export const useForgotPasswordModal = create<ModalStore>((set) => ({
    isOpen: false,
    openModal: (open) => set({ isOpen: open }),
}));

interface ChangePasswordModalStore {
    isModalOpen: boolean;
    code: string;
    openModal: (open: boolean, code?: string) => void;
}

export const useChangePasswordModal = create<ChangePasswordModalStore>((set) => ({
    isModalOpen: false,
    code: '',
    openModal: (open, code = '') => set({ isModalOpen: open, code }),
}));

interface EnterpriseEditModalStore {
    isModalOpen: boolean;
    enterpriseId: string;
    openModal: (open: boolean, enterpriseId?: string) => void;
}

export const useEnterpriseEditModal = create<EnterpriseEditModalStore>((set) => ({
    isModalOpen: false,
    enterpriseId: '',
    openModal: (open, enterpriseId = '') => set({ isModalOpen: open, enterpriseId }),
}));

export const useEnterpriseFilterModal = create<ModalStore>((set) => ({
    isOpen: false,
    openModal: (open) => set({ isOpen: open }),
}));

interface UserEditModalStore {
    isModalOpen: boolean;
    userId: string;
    openModal: (open: boolean, userId?: string) => void;
}

export const useUserEditModal = create<UserEditModalStore>((set) => ({
    isModalOpen: false,
    userId: '',
    openModal: (open, userId = '') => set({ isModalOpen: open, userId }),
}));

export const useUserFilterModal = create<ModalStore>((set) => ({
    isOpen: false,
    openModal: (open) => set({ isOpen: open }),
}));

export const useUnitCreateModal = create<ModalStore>((set) => ({
    isOpen: false,
    openModal: (open) => set({ isOpen: open }),
}));

interface UnitEditModalStore {
    isModalOpen: boolean;
    unitId: string;
    openModal: (open: boolean, unitId?: string) => void;
}

export const useUnitEditModal = create<UnitEditModalStore>((set) => ({
    isModalOpen: false,
    unitId: '',
    openModal: (open, unitId = '') => set({ isModalOpen: open, unitId }),
}));

export const useSubCategoryCreateModal = create<ModalStore>((set) => ({
    isOpen: false,
    openModal: (open) => set({ isOpen: open }),
}));

interface SubCategoryEditModalStore {
    isModalOpen: boolean;
    subCategoryId: string;
    openModal: (open: boolean, subCategoryId?: string) => void;
}

export const useSubCategoryEditModal = create<SubCategoryEditModalStore>((set) => ({
    isModalOpen: false,
    subCategoryId: '',
    openModal: (open, subCategoryId = '') => set({ isModalOpen: open, subCategoryId }),
}));

export const useItemCreateModal = create<ModalStore>((set) => ({
    isOpen: false,
    openModal: (open) => set({ isOpen: open }),
}));

interface ItemEditModalStore {
    isModalOpen: boolean;
    itemId: string;
    openModal: (open: boolean, itemId?: string) => void;
}

export const useItemEditModal = create<ItemEditModalStore>((set) => ({
    isModalOpen: false,
    itemId: '',
    openModal: (open, itemId = '') => set({ isModalOpen: open, itemId }),
}));

export const useCategoryTypeCreateModal = create<ModalStore>((set) => ({
    isOpen: false,
    openModal: (open) => set({ isOpen: open }),
}));

interface CategoryTypeEditModalStore {
    isModalOpen: boolean;
    categoryTypeId: string;
    openModal: (open: boolean, categoryTypeId?: string) => void;
}

export const useCategoryTypeEditModal = create<CategoryTypeEditModalStore>((set) => ({
    isModalOpen: false,
    categoryTypeId: '',
    openModal: (open, categoryTypeId = '') => set({ isModalOpen: open, categoryTypeId }),
}));

export const useBrandCreateModal = create<ModalStore>((set) => ({
    isOpen: false,
    openModal: (open) => set({ isOpen: open }),
}));

interface BrandEditModalStore {
    isModalOpen: boolean;
    brandId: string;
    openModal: (open: boolean, brandId?: string) => void;
}

export const useBrandEditModal = create<BrandEditModalStore>((set) => ({
    isModalOpen: false,
    brandId: '',
    openModal: (open, brandId = '') => set({ isModalOpen: open, brandId }),
}));

export const useProductTypeCreateModal = create<ModalStore>((set) => ({
    isOpen: false,
    openModal: (open) => set({ isOpen: open }),
}));

interface ProductTypeEditModalStore {
    isModalOpen: boolean;
    productTypeId: string;
    openModal: (open: boolean, productTypeId?: string) => void;
}

export const useProductTypeEditModal = create<ProductTypeEditModalStore>((set) => ({
    isModalOpen: false,
    productTypeId: '',
    openModal: (open, productTypeId = '') => set({ isModalOpen: open, productTypeId }),
}));

export const useCategoryCreateModal = create<ModalStore>((set) => ({
    isOpen: false,
    openModal: (open) => set({ isOpen: open }),
}));

interface CategoryEditModalStore {
    isModalOpen: boolean;
    categoryId: string;
    openModal: (open: boolean, categoryId?: string) => void;
}

export const useCategoryEditModal = create<CategoryEditModalStore>((set) => ({
    isModalOpen: false,
    categoryId: '',
    openModal: (open, categoryId = '') => set({ isModalOpen: open, categoryId }),
}));

export const useSupplierCreateModal = create<ModalStore>((set) => ({
    isOpen: false,
    openModal: (open) => set({ isOpen: open }),
}));

export const useSupplierFilterModal = create<ModalStore>((set) => ({
    isOpen: false,
    openModal: (open) => set({ isOpen: open }),
}));

interface SupplierEditModalStore {
    isModalOpen: boolean;
    supplierId: string;
    openModal: (open: boolean, supplierId?: string) => void;
}

export const useSupplierEditModal = create<SupplierEditModalStore>((set) => ({
    isModalOpen: false,
    supplierId: '',
    openModal: (open, supplierId = '') => set({ isModalOpen: open, supplierId }),
}));

interface SupplierDetailModalStore {
    isModalOpen: boolean;
    supplierId: string;
    openModal: (open: boolean, supplierId?: string) => void;
}

export const useSupplierDetailModal = create<SupplierDetailModalStore>((set) => ({
    isModalOpen: false,
    supplierId: '',
    openModal: (open, supplierId = '') => set({ isModalOpen: open, supplierId }),
}));

export const useMerchandiseCreateModal = create<ModalStore>((set) => ({
    isOpen: false,
    openModal: (open) => set({ isOpen: open }),
}));

export const useMerchandiseFilterModal = create<ModalStore>((set) => ({
    isOpen: false,
    openModal: (open) => set({ isOpen: open }),
}));

interface MerchandiseEditModalStore {
    isModalOpen: boolean;
    merchandiseId: string;
    openModal: (open: boolean, merchandiseId?: string) => void;
}

export const useMerchandiseEditModal = create<MerchandiseEditModalStore>((set) => ({
    isModalOpen: false,
    merchandiseId: '',
    openModal: (open, merchandiseId = '') => set({ isModalOpen: open, merchandiseId }),
}));

interface ProductIntermediateModalStore {
    isModalOpen: boolean;
    productIntermediateId: string;
    mode: "create" | "edit" | "view";
    openModal: (open: boolean, mode?: "create" | "edit" | "view", productIntermediateId?: string) => void;
}

export const useProductIntermediateModal = create<ProductIntermediateModalStore>((set) => ({
    isModalOpen: false,
    productIntermediateId: '',
    mode: "view",
    openModal: (open, mode, productIntermediateId = '') => set({ isModalOpen: open, mode, productIntermediateId }),
}));

export const useProductTypeSelectionModal = create<ModalStore>((set) => ({
    isOpen: false,
    openModal: (open) => set({ isOpen: open }),
}));

interface ProductModalStore {
    isModalOpen: boolean;
    productId: string;
    mode: "create" | "edit" | "view";
    formType: "original" | "alternative";
    openModal: (open: boolean, mode?: "create" | "edit" | "view", formType?: "original" | "alternative", productId?: string) => void;
}

export const useProductModal = create<ProductModalStore>((set) => ({
    isModalOpen: false,
    productId: "",
    mode: "view",
    formType: "original",
    openModal: (open, mode, formType,productId = "") => set({ isModalOpen: open, mode, formType, productId }),
}));

interface ProductFilterModalStore {
    isModalOpen: boolean;
    filterType: "final" | "intermediate";
    openModal: (open: boolean, filterType?: "final" | "intermediate") => void;
}

export const useProductFilterModal = create<ProductFilterModalStore>((set) => ({
    isModalOpen: false,
    filterType: "final",
    openModal: (open, filterType) => set({ isModalOpen: open, filterType }),
}));

export const useStockEntryFilterModal = create<ModalStore>((set) => ({
    isOpen: false,
    openModal: (open) => set({ isOpen: open }),
}));

export const useStockEntryCreateModal = create<ModalStore>((set) => ({
    isOpen: false,
    openModal: (open) => set({ isOpen: open }),
}));

interface StockEntryEditModalStore {
    isModalOpen: boolean;
    stockEntryId: string;
    openModal: (open: boolean, stockEntryId?: string) => void;
}

export const useStockEntryEditModal = create<StockEntryEditModalStore>((set) => ({
    isModalOpen: false,
    stockEntryId: '',
    openModal: (open, stockEntryId = '') => set({ isModalOpen: open, stockEntryId }),
}));

interface StockEntryPreviewModalStore {
    isModalOpen: boolean;
    stockEntryId: string;
    openModal: (open: boolean, stockEntryId?: string) => void;
}

export const useStockEntryPreviewModal = create<StockEntryPreviewModalStore>((set) => ({
    isModalOpen: false,
    stockEntryId: '',
    openModal: (open, stockEntryId = '') => set({ isModalOpen: open, stockEntryId }),
}));

export const useProductAlternativeSelectionModal = create<ModalStore>((set) => ({
    isOpen: false,
    openModal: (open) => set({ isOpen: open }),
}));
