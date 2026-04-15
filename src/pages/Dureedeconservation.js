import React, { useState } from "react";
// @ts-ignore
import { Input, Button, Space, Card, Typography, message, Popconfirm } from "antd";

const { Title } = Typography;

const Dureedeconservation = () => {
  const [value, setValue] = useState("");

  const handleUpdate = () => {
    message.warning(`Update durée de conservation: ${value} jours`);
  };

  return (
    <Card
      style={{
        width: "80%",
        maxWidth: 800,
        margin: "100px auto",
        padding: 30,
      }}
    >
      <Space direction="vertical" size="middle">
        <Title level={3} style={{ marginBottom: 0 }}>
          Durée de conservation
        </Title>

        <h4>Nombre de jours avant de supprimer les rapports</h4>

        {/* Input */}
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: 200,
            textAlign: "center",
            fontSize: 18,
          }}
        />

        {/* Button */}
        <Popconfirm
          title="Update le nombre de jours ?"
          onConfirm={handleUpdate}
          okText="Oui"
          cancelText="Non"
        >
          <Button type="primary">Mettre à jour</Button>
        </Popconfirm>
      </Space>
    </Card>
  );
};

export default Dureedeconservation;