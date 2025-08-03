import React, { useState } from "react";
import styled from "@emotion/styled";

const AttributesContainer = styled.div`
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background : #000,
  align-content : center
`;

const TableHeader = styled.th`
  background: #f5f5f5;
  padding: 10px;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 10px;
  border: 2px solid #000;
  background : #000
`;




const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
`;

const FormContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.04);
  padding: 32px;
  max-width: 400px;
  margin: 40px auto;
`;

const FormField = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 16px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
`;

const SaveButton = styled.button`
  background: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 16px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background: #f5f5f5;
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 16px;
  cursor: pointer;
`;

interface SKU {
  id: number;
  name: string;
  values: string; 
}

const Attributes: React.FC = () => {
    const [skus, setSkus] = useState<SKU[]>([]);
    // const [loading, setLoading] = useState<boolean>(true);
    // const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ model: "", price: "", numberInStock: "" });
    const [saving, setSaving] = useState(false);
  
    // useEffect(() => {
    //   const fetchSkus = async () => {
    //     try {
    //       const response = await fetch("api/skus");
    //       if (!response.ok) throw new Error("Network response was not ok");
    //       const data = await response.json();
    //       setSkus(data);
    //     } catch (error) {
    //       setError(error.message);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };
    //   fetchSkus();
    // }, []);
  
    const handleAddClick = () => {
      setShowForm(true);
      setForm({ model: "", price: "", numberInStock: "" });
    };
  
    const handleCancel = () => setShowForm(false);
  
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    const handleSave = async () => {
      setSaving(true);
      try {
        const response = await fetch("/api/skus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!response.ok) throw new Error("Failed to save");
        const newSku = await response.json();
        setSkus([...skus, newSku]);
        setShowForm(false);
      } catch (e) {
        alert(e.message);
      } finally {
        setSaving(false);
      }
    };
  
    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error}</div>;
  
    return (
      <AttributesContainer>
        <TopBar>
          <h1 style={{ fontWeight: 700 }}>Attributes</h1>
          <AddButton onClick={handleAddClick}>
            Add Attribute <span style={{ fontSize: 20, marginLeft: 4 }}>+</span>
          </AddButton>
          <div>asdasdasd</div>
        </TopBar>
  
        {showForm ? (
          <FormContainer>
            <FormField>
              <Label>model</Label>
              <Input name="model" value={form.model} onChange={handleChange} />
            </FormField>
            <FormField>
              <Label>price</Label>
              <Input name="price" value={form.price} onChange={handleChange} />
            </FormField>
            <FormField>
              <Label>numberInStock</Label>
              <Input name="numberInStock" value={form.numberInStock} onChange={handleChange} />
            </FormField>
            <ButtonRow>
              <CancelButton onClick={handleCancel} disabled={saving}>Cancel</CancelButton>
              <SaveButton onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </SaveButton>
            </ButtonRow>
          </FormContainer>
        ) : (
          <Table>
            <thead>
              <tr>
                <TableHeader>ID</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Values</TableHeader>
              </tr>
            </thead>
            <tbody>
              {skus.map((sku) => (
                <tr>
                  <TableCell> "---"</TableCell>
                  <TableCell>{sku.name || "---"}</TableCell>
                  <TableCell>{sku.values || "---"}</TableCell>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </AttributesContainer>
    );
  };
export default Attributes;
