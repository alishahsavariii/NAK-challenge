import React, { useEffect, useState, useMemo } from "react";
import styled from "@emotion/styled";
import { useAuthStore } from "../stores/authStore";
import { MultiSelect } from "primereact/multiselect";

interface Attribute {
  _id: string;
  name: string;
  values: string[];
}

interface ProductSelectedAttribute {
  name: string;
  values: string[];
}

interface SKU {
  tempId?: string;
  model: string;
  price?: number;
  inStock?: number;
}

interface ProductFormState {
  name: string;
  selectedAttributes: ProductSelectedAttribute[];
  skusIds: SKU[];
}

interface Product {
  _id: string;
  name: string;
  countOfSKUs: number;
}

const ProductsContainer = styled.div`
  padding: 40px;
  min-height: 100vh;
  box-sizing: border-box;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.th`
  background: #d7d7d7;
  padding: 15px 20px;
  text-align: left;
  border-bottom: 1px solid #ccc;
  color: #333;
  font-weight: 600;
  &:first-of-type {
    border-top-left-radius: 8px;
  }
  &:last-of-type {
    border-top-right-radius: 8px;
  }
`;

const TableCell = styled.td`
  padding: 15px 20px;
  border: 1px solid #eee;
  background: #fff;
  color: #333;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: right;
  margin-bottom: 60px;
  margin-left : 300px
  // width : 70%
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s ease-in-out;
  &:hover {
    opacity: 0.9;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid red;
  border-radius: 20px;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #000;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
`;

const PaginationButton = styled.button<{ $isActive?: boolean }>`
  background: ${(props) => (props.$isActive ? "#000" : "#fff")};
  color: ${(props) => (props.$isActive ? "#fff" : "#000")};
  border: 1px solid #000;
  border-radius: 8px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: ${(props) => (props.$isActive ? "#222" : "#f0f0f0")};
  }
`;

const PageInfo = styled.span`
  font-size: 14px;
  color: #555;
`;

const FormSectionTitle = styled.h3`
  font-weight: 700;
  margin-top: 40px;
  margin-bottom: 20px;
`;

const FloatingFormField = styled.div`
  position: relative;
  margin-bottom: 24px;
`;
const Input = styled.input`
  width: 60%;
  padding: 16px 16px;
  border-radius: 20px;
  border: 1px solid #ddd;
  font-size: 16px;
  outline: none;
  background: #fff;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  color: #333;
  position: relative;
  z-index: 0;

  &:focus {
    border-color: #000;
    box-shadow: 0 0 0 1px #000;
  }
  &:placeholder-shown {
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 16px 16px;
  border-radius: 20px;
  border: 1px solid #ddd;
  font-size: 16px;
  outline: none;
  background: #fff;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  color: #333;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http:
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
  cursor: pointer;

  &:focus {
    border-color: #000;
    box-shadow: 0 0 0 1px #000;
  }
  &:disabled {
    background: #f0f0f0;
    cursor: not-allowed;
  }
`;

const Label = styled.label<{ $isFilledOrFocused?: boolean }>`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #777;
  font-size: 16px;
  pointer-events: none;
  transition: all 0.2s ease-in-out;
  background: transparent;
  padding: 0 4px;
  z-index: 2;

 
  ${Input}:focus + &,
  ${Input}:not(:placeholder-shown) + &,
  ${Select}:focus + &,
  ${Select}:not([value=""]):not([value="Select Attribute"]) + & {
    top: 0;
    font-size: 12px;
    color: #000;
    transform: translateY(-50%) translateX(-4px);
    background: #fdfdfd;
    border-radius: 4px;
    z-index: 1;
  }

 
  .p-multiselect.p-focus ~ &,
  .p-multiselect:not(.p-multiselect-empty) ~ & {
    top: 0;
    font-size: 12px;
    color: #000;
    transform: translateY(-50%) translateX(-4px);
    background: #fdfdfd;
    border-radius: 4px;
    z-index: 1;
  }
`;

const StyledMultiSelect = styled(MultiSelect)`
  width: 60%;

  .p-multiselect {
    width: 100%;
    padding: 16px 16px;
    border-radius: 20px;
    border: 1px solid #ddd;
    font-size: 16px;
    outline: none;
    background: #fff;
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    color: #333;
    min-height: 48px;

    &:not(.p-disabled):hover {
      border-color: #aaa;
    }

    &:not(.p-disabled).p-focus {
      border-color: #000;
      box-shadow: 0 0 0 1px #000;
    }
  }

  .p-multiselect-label {
    padding: 0;
    line-height: normal;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .p-multiselect-trigger {
    width: 1rem;
    right: 12px;
  }

  .p-multiselect-panel {
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    background-color: #ddd;
  }

  .p-multiselect-header {
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #eee;
  }

  .p-multiselect-items {
    padding: 0;
  }

  .p-multiselect-item {
    padding: 10px 16px;
  }
`;

const FormRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 24px;
`;

const AttributeRowActions = styled.div`
  display: flex;
  padding :30px;
  width : 120px
  margin-left: auto;
  border-radius: 20px;
height : 100px 
margin : 10px`;

const DeleteAttributeButton = styled(ActionButton)`
  color: #dc3545;
  border: 1px solid red;

  &:hover {
    color: #810d18ff;
  }
`;

const AddAttributeButton = styled(AddButton)`
  padding: 10px 20px;
  background: #000;
  color: #fff;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  flex-shrink: 0;
  height: 48px;
  width: 100px;
  justify-content: center;
  margin-left: auto;
`;

const SKUTableInput = styled.input`
  width: 100%;
  padding: 8px 1px;
  border-radius: 12px;
  border: 1px solid #ddd;
  font-size: 14px;
  outline: none;
  text-align: center;

  &:focus {
    border-color: #000;
  }
`;

const FormButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 40px;
`;

const UpdateButton = styled(AddButton)`
  background: #000;
  color: #fff;
  padding: 12px 28px;
  border-radius: 20px;
`;

const CancelFormButton = styled.button`
  background: #fff;
  color: #000;
  border: 1px solid #000;
  border-radius: 20px;
  padding: 12px 28px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 500;
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: #f0f0f0;
  }
`;

const generateUniqueId = () => `id_${Math.random().toString(36).substr(2, 9)}`;

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "attribute" | "sku";
    identifier: string | number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState<ProductFormState>({
    name: "",
    selectedAttributes: [],
    skusIds: [],
  });
  const [savingProduct, setSavingProduct] = useState(false);

  const [availableAttributes, setAvailableAttributes] = useState<Attribute[]>(
    []
  );

  const [newAttributeSelection, setNewAttributeSelection] = useState<{
    _id: string;
    name: string;
    values: string[];
    selectedValuesForNewAttribute: string[];
  }>({
    _id: "",
    name: "",
    values: [],
    selectedValuesForNewAttribute: [],
  });

  const getAuthHeaders = () => {
    if (!accessToken) {
      console.warn("No access token found. Requests might be unauthorized.");
      return { "Content-Type": "application/json" };
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
  };

  useEffect(() => {
    const fetchProductsData = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        setError("Please log in to view products.");
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const headers = getAuthHeaders();
        const response = await fetch(
          `/api/products?page=${currentPage}&perPage=${itemsPerPage}`,
          { headers }
        );

        if (!response.ok) {
          if (response.status === 401) {
            setError("Unauthorized: Session expired. Please log in again.");
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Network response was not ok");
          }
        }
        const data = await response.json();
        setProducts(data.products || []);
        setTotalItems(data.totalItems || 0);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (!showProductForm) {
      fetchProductsData();
    }
  }, [isLoggedIn, accessToken, currentPage, itemsPerPage, showProductForm]);

  useEffect(() => {
    const fetchAvailableAttributes = async () => {
      if (!isLoggedIn) return;
      try {
        const headers = getAuthHeaders();
        const response = await fetch("/api/attributes", { headers });
        if (!response.ok) throw new Error("Failed to fetch attributes");
        const data: Attribute[] = await response.json();
        setAvailableAttributes(data);
      } catch (err: any) {
        console.error("Error fetching available attributes:", err.message);
        setError("Failed to load attributes for product form.");
      }
    };
    if (showProductForm) {
      fetchAvailableAttributes();
    }
  }, [showProductForm, isLoggedIn, accessToken]);

  const handleAddProductClick = () => {
    if (!isLoggedIn) {
      alert("Please log in to add products.");
      return;
    }
    setShowProductForm(true);
    setProductForm({
      name: "",
      selectedAttributes: [],
      skusIds: [],
    });
    setNewAttributeSelection({
      _id: "",
      name: "",
      values: [],
      selectedValuesForNewAttribute: [],
    });
  };

  const handleCancelProductForm = () => {
    setShowProductForm(false);
    setCurrentPage(1);
  };

  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductForm((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleSelectNewAttributeName = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedAttrId = e.target.value;
    const attr = availableAttributes.find((a) => a._id === selectedAttrId);
    if (attr) {
      setNewAttributeSelection({
        _id: attr._id,
        name: attr.name,
        values: attr.values,
        selectedValuesForNewAttribute: [],
      });
    } else {
      setNewAttributeSelection({
        _id: "",
        name: "",
        values: [],
        selectedValuesForNewAttribute: [],
      });
    }
  };

  const handleSelectNewAttributeValues = (e: { value: string[] }) => {
    setNewAttributeSelection((prev) => ({
      ...prev,
      selectedValuesForNewAttribute: e.value,
    }));
  };

  const handleAddSelectedAttribute = () => {
    if (
      !newAttributeSelection._id ||
      newAttributeSelection.selectedValuesForNewAttribute.length === 0
    ) {
      alert("Please select an attribute name and at least one value to add.");
      return;
    }

    const isDuplicate = productForm.selectedAttributes.some(
      (attr) => attr.name === newAttributeSelection.name
    );
    if (isDuplicate) {
      alert(`Attribute "${newAttributeSelection.name}" is already added.`);
      return;
    }

    setProductForm((prev) => ({
      ...prev,
      selectedAttributes: [
        ...prev.selectedAttributes,
        {
          attributeId: newAttributeSelection._id,
          name: newAttributeSelection.name,
          values: newAttributeSelection.selectedValuesForNewAttribute,
        },
      ],
    }));

    setNewAttributeSelection({
      _id: "",
      name: "",
      values: [],
      selectedValuesForNewAttribute: [],
    });
  };

  const handleRemoveProductAttribute = (indexToRemove: number) => {
    setProductForm((prev) => ({
      ...prev,
      selectedAttributes: prev.selectedAttributes.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
    setDeleteTarget({ type: "attribute", identifier: indexToRemove });
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    const generateSKUs = () => {
      const attributeCombinationsData: { name: string; values: string[] }[] =
        productForm.selectedAttributes.map((attr) => ({
          name: attr.name,
          values: attr.values,
        }));

      if (attributeCombinationsData.length === 0) {
        setProductForm((prev) => ({ ...prev, skus: [] }));
        return;
      }

      const arraysToCombine = attributeCombinationsData.map(
        (attr) => attr.values
      );

   const cartesianProduct = (arrays: string[][]): string[][] => {
  return arrays.reduce((acc, arr) => {
    const result: string[][] = [];
    acc.forEach(a => {
      arr.forEach(b => {
        result.push([...a, b]);
      });
    });
    return result;
  }, [[]] as string[][]);
};

      const generatedCombinations = cartesianProduct(arraysToCombine);

      const newSKUs: SKU[] = generatedCombinations.map((combination) => {
        const model = combination.join(" / ");

        const existingSku = productForm.skusIds.find(
          (sku) => sku.model === model
        );
        return {
          tempId: existingSku?.tempId || generateUniqueId(),
          model: model,
          price: existingSku?.price !== undefined ? existingSku.price : 0,
          inStock: existingSku?.inStock !== undefined ? existingSku.inStock : 0,
        };
      });

      setProductForm((prev) => ({
        ...prev,
        skusIds: newSKUs,
      }));
    };

    generateSKUs();
  }, [productForm.selectedAttributes]);

  const handleSkuPriceChange = (
    tempId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSkus = productForm.skusIds.map((sku) =>
      sku.tempId === tempId
        ? { ...sku, price: parseFloat(e.target.value) || 0 }
        : sku
    );
    setProductForm((prev) => ({ ...prev, skusIds: newSkus }));
  };

  const handleSkuInStockChange = (
    tempId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSkus = productForm.skusIds.map((sku) =>
      sku.tempId === tempId
        ? { ...sku, inStock: parseInt(e.target.value, 10) || 0 }
        : sku
    );
    setProductForm((prev) => ({ ...prev, skusIds: newSkus }));
  };

  const handleRemoveSku = (tempId: string) => {
    setProductForm((prev) => ({
      ...prev,
      skusIds: prev.skusIds.filter((sku) => sku.tempId !== tempId),
    }));
  };

  const handleSaveProduct = async () => {
    setSavingProduct(true);
    const skusIdsToSend = productForm.skusIds.map((sku) => sku.model); 

    const dataToSend = {
      name: productForm.name.trim(),
      attributes: productForm.selectedAttributes.map((attr) => ({
        name: attr.name,
        values: attr.values,
      })),
      skusIds: skusIdsToSend,
    };

    if (!dataToSend.name) {
      alert("Product name is required.");
      setSavingProduct(false);
      return;
    }

    try {
      const headers = getAuthHeaders();
      const response = await fetch("/api/products", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Unauthorized: Session expired. Please log in again.");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save product");
      }

      alert("Product saved successfully!");
      setShowProductForm(false);
      setCurrentPage(1);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSavingProduct(false);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1));
  };

  if (loading && products.length === 0 && !showProductForm)
    return <ProductsContainer>Loading products...</ProductsContainer>;
  if (error && !showProductForm)
    return <ProductsContainer>Error: {error}</ProductsContainer>;

  const ConfirmationModal = () => {
    if (!isDeleteModalOpen || !deleteTarget) return null;

    const handleConfirm = () => {
      if (deleteTarget.type === "attribute") {
        handleRemoveProductAttribute(deleteTarget.identifier as number);
      } else if (deleteTarget.type === "sku") {
        handleRemoveSku(deleteTarget.identifier as string);
      }
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    };

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "10px",
            maxWidth: "400px",
            width: "90%",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          <h3 style={{ marginBottom: "15px", color: "#333" }}>
            Confirm Deletion
          </h3>
          <p style={{ marginBottom: "25px", color: "#666" }}>
            Are you sure you want to delete this {deleteTarget.type}?
          </p>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              style={{
                padding: "8px 20px",
                border: "1px solid #ccc",
                background: "white",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              style={{
                padding: "8px 20px",
                border: "1px solid #dc3545",
                background: "#dc3545",
                color: "white",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <ProductsContainer>
      <h1
        style={{
          fontWeight: 700,
          marginBottom: showProductForm ? "40px" : "0",
        }}
      >
        {showProductForm ? "Product" : "Products"}
      </h1>

      {!showProductForm ? (
        <>
          <TopBar>
            <AddButton onClick={handleAddProductClick}>
              Add Product <span style={{ fontSize: 20, marginLeft: 4 }}>+</span>
            </AddButton>
          </TopBar>

          <Table>
            <thead>
              <tr>
                <TableHeader style={{ width: "5%" }}>ID</TableHeader>
                <TableHeader style={{ width: "45%" }}>Name</TableHeader>
                <TableHeader style={{ width: "30%" }}>
                  Count of SKUs
                </TableHeader>
                <TableHeader style={{ width: "20%", textAlign: "center" }}>
                  Actions
                </TableHeader>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && !loading ? (
                <tr>
                  <TableCell
                    colSpan={4}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No products found.
                  </TableCell>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr key={product._id}>
                    {" "}
                    <TableCell>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{product.name || "---"}</TableCell>
                    <TableCell>{product.countOfSKUs || 0}</TableCell>
                    <TableCell>
                      <ActionButtons>
                        <ActionButton
                          onClick={() => alert(`Delete ${product._id}`)}
                          title="Delete Product"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            stroke="none"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </ActionButton>
                        <ActionButton
                          onClick={() => alert(`Edit ${product._id}`)}
                          title="Edit Product"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            stroke="none"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </ActionButton>
                      </ActionButtons>
                    </TableCell>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton
                onClick={handlePreviousPage}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </PaginationButton>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <PaginationButton
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    $isActive={pageNumber === currentPage}
                    disabled={loading}
                  >
                    {pageNumber}
                  </PaginationButton>
                )
              )}
              <PaginationButton
                onClick={handleNextPage}
                disabled={currentPage === totalPages || loading}
              >
                Next
              </PaginationButton>
              <PageInfo>
                Page {currentPage} of {totalPages}
              </PageInfo>
            </PaginationContainer>
          )}
        </>
      ) : (
        <>
          <FloatingFormField>
            <Input
              type="text"
              name="productName"
              value={productForm.name}
              onChange={handleProductNameChange}
              placeholder=" "
              id="product-name"
            />
            <Label htmlFor="product-name">Name</Label>
          </FloatingFormField>

          <FormSectionTitle>Attribute Form</FormSectionTitle>
          {productForm.selectedAttributes.map((attr, index) => (
            <FormRow key={attr.name}>
              <FloatingFormField style={{ flex: 1 }}>
                <Input
                  type="text"
                  value={attr.name}
                  readOnly
                  placeholder=" "
                  id={`attr-name-${index}`}
                />
                <Label htmlFor={`attr-name-${index}`}>Attribute Name</Label>
              </FloatingFormField>
              {/* Already Added Attribute Values (Read-only display) */}
              <FloatingFormField style={{ flex: 1.5 }}>
                <Input
                  type="text"
                  value={attr.values.join(", ")}
                  readOnly
                  placeholder=" "
                  id={`attr-values-${index}`}
                />
                <Label htmlFor={`attr-values-${index}`}>Attribute Values</Label>
              </FloatingFormField>
              <AttributeRowActions>
                <DeleteAttributeButton
                  onClick={() => {
                    setDeleteTarget({ type: "attribute", identifier: index });
                    setIsDeleteModalOpen(true);
                  }}
                  title="Remove Attribute"
                >
                  <i className="fa fa-trash" />
                </DeleteAttributeButton>
              </AttributeRowActions>
            </FormRow>
          ))}

          <FormRow>
            <FloatingFormField style={{ flex: 1 }}>
              <Select
                value={newAttributeSelection._id}
                onChange={handleSelectNewAttributeName}
                id="new-attr-name"
                data-placeholder={!newAttributeSelection.name ? " " : undefined}
              >
                <option value="" disabled hidden>
                  Select Attribute
                </option>
                {availableAttributes
                  .filter(
                    (attr) =>
                      !productForm.selectedAttributes.some(
                        (selected: any) => selected.name === attr.name
                      )
                  )
                  .map((attr) => (
                    <option key={attr._id} value={attr._id}>
                      {attr.name}
                    </option>
                  ))}
              </Select>
              <Label htmlFor="new-attr-name">Attribute Name</Label>
            </FloatingFormField>

            <FloatingFormField style={{ flex: 1.5 }}>
              <StyledMultiSelect
                value={newAttributeSelection.selectedValuesForNewAttribute}
                onChange={handleSelectNewAttributeValues}
                options={newAttributeSelection.values}
                placeholder=" "
                disabled={!newAttributeSelection._id}
                id="new-attr-values"
                className="p-multiselect-custom-style"
                showClear
                display="comma"
              />
              <Label htmlFor="new-attr-values">Attribute Values</Label>
            </FloatingFormField>

            {/* Add Attribute Button */}
            <AddAttributeButton
              onClick={handleAddSelectedAttribute}
              disabled={
                !newAttributeSelection._id ||
                newAttributeSelection.selectedValuesForNewAttribute.length === 0
              }
            >
              Add
            </AddAttributeButton>
          </FormRow>

          {/* SKUs List Table */}
          <FormSectionTitle>SKUs List</FormSectionTitle>
          <Table>
            <thead>
              <tr>
                <TableHeader style={{ width: "5%" }}>#</TableHeader>
                <TableHeader style={{ width: "15%" }}>Model</TableHeader>
                <TableHeader style={{ width: "35%" }}>Price</TableHeader>
                <TableHeader style={{ width: "35%" }}>In Stock</TableHeader>
                <TableHeader style={{ width: "10%", textAlign: "center" }}>
                  Actions
                </TableHeader>
              </tr>
            </thead>
            <tbody>
              {productForm.skusIds.length === 0 ? (
                <tr>
                  <TableCell
                    colSpan={5}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No SKUs generated. Add attributes to generate SKUs.
                  </TableCell>
                </tr>
              ) : (
                productForm.skusIds.map((sku, index) => (
                  <tr key={sku.tempId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{sku.model}</TableCell>
                    <TableCell>
                      <SKUTableInput
                        type="number"
                        min="1"
                        value={sku.price}
                        onChange={(e) => handleSkuPriceChange(sku.tempId, e)}
                      />
                    </TableCell>
                    <TableCell>
                      <SKUTableInput
                        type="number"
                        min="1"
                        value={sku.inStock}
                        onChange={(e) => handleSkuInStockChange(sku.tempId, e)}
                      />
                    </TableCell>
                    <TableCell>
                      <ActionButtons>
                        <DeleteAttributeButton
                          onClick={() => handleRemoveSku(sku.tempId)}
                          title="Remove SKU"
                        >
                          <i className="fa fa-trash" />
                        </DeleteAttributeButton>
                      </ActionButtons>
                    </TableCell>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* Form Action Buttons */}
          <FormButtonRow>
            <CancelFormButton
              onClick={handleCancelProductForm}
              disabled={savingProduct}
            >
              Cancel
            </CancelFormButton>
            <UpdateButton onClick={handleSaveProduct} disabled={savingProduct}>
              Create
            </UpdateButton>
          </FormButtonRow>
        </>
      )}
      <ConfirmationModal />
    </ProductsContainer>
  );
};

export default Products;
