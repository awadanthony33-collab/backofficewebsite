import React, { useState } from "react";
// @ts-ignore
import { Input, Button, Space, Card, Typography, message, Popconfirm } from "antd";
import { getById } from "../api/api";
const { Title } = Typography;

const RapportPage = () => {
  const [values, setValues] = useState(["", "", "",""]);
const [report, setReport] = useState(null);
  const handleChange = (index, value) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
  };



  const handleSearch = () => {

  };

const handleOpen = async () => {
  const [asbr, assect, asyr, asref] = values;

  if (!asbr || !assect || !asyr || !asref) {
    return message.error("Format invalide");
  }

  try {
    const endpoint = `Reports/detail/${asbr}/${assect}/${asyr}`;

    const data = await getById(endpoint, asref);

    setReport(data);

    message.success("Rapport chargé");
  } catch (error) {
    console.error(error);
    message.error("Rapport introuvable");
  }
};

  const handleDelete = () => {
    
    message.warning(``);
  };
const inputsConfig = [
  { max: 2, width: 80 },
  { max: 1, width: 80 },
  { max: 2, width: 80 },
  { max: 5, width: 180 },
];
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
    maxLength={inputsConfig[index].max}
    onChange={(e) => handleChange(index, e.target.value)}
    style={{
      width: inputsConfig[index].width,
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
        {/* <Button type="primary" size="large" onClick={handleSearch}>
          Rechercher
        </Button> */}

        <Button onClick={handleOpen} size="large">
          Ouvrir
        </Button>

        <Popconfirm
          title="Supprimer ce rapport ?"

          okText="Oui"
          cancelText="Non"
        >
          <Button danger size="large">Supprimer</Button>
        </Popconfirm>
        
      </Space>

{report && (
  <div style={{ marginTop: 100 }}>
    <Title level={4}>{report.aspatn} </Title>

    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: report.asrep,
        }}
      />
    </div>
  </div>
)}




 
    </Card>

    
  );
}
export default RapportPage;
