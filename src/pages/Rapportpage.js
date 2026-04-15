import React, { useState } from "react";
// @ts-ignore
import { Input, Button, Space, Card, Typography, message, Popconfirm } from "antd";

const { Title } = Typography;

const RapportPage = () => {
  const [values, setValues] = useState(["", "", ""]);

  const handleChange = (index, value) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
  };

  const reportId = values.join("");

  const handleSearch = () => {
    if (!reportId) return message.error("Format invalide");
    message.info(`Recherche du rapport ${reportId}`);
  };

  const handleOpen = () => {
    if (!reportId) return message.error("Format invalide");
    message.success(`Ouverture du rapport ${reportId}`);
  };

  const handleDelete = () => {
    message.warning(`Rapport supprimé: ${reportId}`);
  };

  return (
<Card
  style={{
    width: "80%",
    maxWidth: 800,
    margin: "50px auto",
    padding: 30,
  }}
>


<Space direction="vertical" size="middle" style={{ marginTop: 10 }}>
  <Title level={2} style={{ marginBottom: 0 }}>
    Rapport
  </Title>

  <h4 style={{fontSize:18}}>taper le numero de rapport</h4>

  {/* Inputs */}
  <Space>
    {values.map((val, index) => (
      <Input
        key={index}
        value={val}
        maxLength={
          index === 0 ? 1 :   
          index === 1 ? 2 :   
          6                 
        }
        onChange={(e) => handleChange(index, e.target.value)}
        style={{
          width: index === 2 ? 180 : 80,
          height: 50,
          textAlign: "center",
          fontSize: 20,
        }}
      />
    ))}
  </Space>
</Space>

      {/* Buttons same as before */}
      <Space style={{ marginTop: 25 }}>
        <Button type="primary" size="large" onClick={handleSearch}>
          Rechercher
        </Button>

        <Button onClick={handleOpen} size="large">
          Ouvrir
        </Button>

        <Popconfirm
          title="Supprimer ce rapport ?"
          onConfirm={handleDelete}
          okText="Oui"
          cancelText="Non"
        >
          <Button danger size="large">Supprimer</Button>
        </Popconfirm>
      </Space>
    </Card>
  );
}
export default RapportPage;
