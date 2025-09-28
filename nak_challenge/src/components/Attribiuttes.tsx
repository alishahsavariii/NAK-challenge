import React, { useState } from "react";
import styled from "@emotion/styled";
import { useAuthStore } from "../stores/authStore";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const AttributesContainer = styled.div`
  padding: 10px;
  min-height: calc(100vh - 40px);
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 80px;
`;

const TableHeader = styled.th`
  background: #d7d7d7ff;
  padding: 15px 20px;
  text-align: left;
  border-bottom: 1px solid #ccc;
  color: #333;
  font-weight: 600;
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
  align-items: center;
  margin-bottom: 40px;
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
  &:hover {
    opacity: 0.9;
  }
`;

const FormField = styled.div`
  margin-bottom: 20px;
  flex-grow: 1;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #555;
`;

const Input = styled.input`
  width: 70%;
  padding: 12px 16px;
  border-radius: 20px;
  border: 1px solid #ddd;
  font-size: 16px;
  outline: none;
  &:focus {
    border-color: #000;
  }
`;

const ValueInputGroup = styled.div`
  display: inline-flex;
  align-items: flex-end;
  justify-content: space-around;
  margin-bottom: 20px;

  ${FormField} {
    margin-bottom: 0;
    flex-grow: 1;
    margin-right: 16px;
  }
`;

const AddValueButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #000;
  background: none;
  color: #000;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  &:hover {
    background: #f0f0f0;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 300px;
`;

const SaveButton = styled.button`
  background: #000;
  color: #fff;
  border: none;
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
    opacity: 0.9;
  }
`;

const CancelButton = styled.button`
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

interface Attribute {
  id: number;
  name: string;
  values: string[];
}

const Attributes: React.FC = () => {
  const token = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{ name: string; values: string[] }>({
    name: "",
    values: [""],
  });

  const {
    data: attributes = [],
    isLoading,
    isError,
    error,
  } = useQuery<Attribute[], Error>({
    queryKey: ["attributes"],
    queryFn: async () => {
      const res = await fetch("/api/attributes", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch attributes");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: { name: string; values: string[] }) => {
      const res = await fetch("/api/attributes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save attribute");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      setShowForm(false);
    },
  });

  const handleAddClick = () => {
    setShowForm(true);
    setForm({ name: "", values: [""] });
  };

  const handleCancel = () => setShowForm(false);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, name: e.target.value });
  };

  const handleChangeValue = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValues = [...form.values];
    newValues[index] = e.target.value;
    setForm({ ...form, values: newValues });
  };

  const handleAddValueField = () =>
    setForm({ ...form, values: [...form.values, ""] });

  const handleSave = () => {
    const dataToSend = {
      ...form,
      values: form.values.filter((v) => v.trim() !== ""),
    };

    if (!dataToSend.name.trim() || dataToSend.values.length === 0) {
      alert("Name and at least one value are required.");
      return;
    }

    mutation.mutate(dataToSend);
  };

  if (isLoading) return <div>{t("attributes.loading")}</div>;
  if (isError)
    return (
      <div>
        {t("attributes.error")} {error?.message}
      </div>
    );

  return (
    <AttributesContainer>
      {showForm ? (
        <h1 style={{ fontWeight: 700, marginBottom: "40px" }}>
          {t("attributes.AddAttribute")}
        </h1>
      ) : (
        <TopBar>
          <h1 style={{ fontWeight: 700 }}>{t("attributes.AddAttribute")}</h1>
          <AddButton onClick={handleAddClick}>
            {t("attributes.AddAttribute")}{" "}
            <span style={{ fontSize: 20, marginLeft: 4 }}>+</span>
          </AddButton>
        </TopBar>
      )}

      {showForm && (
        <>
          <FormField>
            <Label>{t("attributes.Name")}</Label>
            <Input type="text" value={form.name} onChange={handleChangeName} />
          </FormField>

          {form.values.map((value, index) => (
            <ValueInputGroup key={index}>
              <FormField>
                <Label>{t("attributes.Value")}</Label>
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => handleChangeValue(index, e)}
                />
              </FormField>
              {index === form.values.length - 1 && (
                <AddValueButton onClick={handleAddValueField}>+</AddValueButton>
              )}
            </ValueInputGroup>
          ))}

          <ButtonRow>
            <CancelButton onClick={handleCancel} disabled={mutation.isPending}>
              {t("attributes.Cancel")}
            </CancelButton>
            <SaveButton onClick={handleSave} disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save"}
            </SaveButton>
          </ButtonRow>
        </>
      )}

      {!showForm && (
        <Table>
          <thead>
            <tr>
              <TableHeader>{t("attributes.ID")}</TableHeader>
              <TableHeader>{t("attributes.Name")}</TableHeader>
              <TableHeader>{t("attributes.Values")}</TableHeader>
            </tr>
          </thead>
          <tbody>
            {attributes?.map((attr, index) => (
              <tr key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{attr.name || "---"}</TableCell>
                <TableCell>{attr.values.join(", ") || "---"}</TableCell>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </AttributesContainer>
  );
};

export default Attributes;
