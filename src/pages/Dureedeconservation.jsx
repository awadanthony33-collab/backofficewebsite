import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Space,
  Card,
  Typography,
  Popconfirm,
  Spin,
  message,       
} from "antd";
import { getAll, update } from "../api/api";

const { Title } = Typography;

const Dureedeconservation = () => {

  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const data = await getAll("SystemParams");

      const record = Array.isArray(data) ? data[0] : data;

      if (!record) {
        message.warning("Aucun paramètre trouvé");
        return;
      }

      setValue(String(record.nbDaysValue));
    } catch (error) {
      console.error(error);
      message.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const newValue = Number(value);

    if (!Number.isInteger(newValue) || newValue <= 0) {
      message.error("Veuillez entrer un nombre entier positif");
      return;
    }

    try {
      setLoading(true);

      await update("SystemParams", null, { nbDaysValue: newValue });

      message.success("Nombre de jours mis à jour avec succès");
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ width: "80%", maxWidth: 800, margin: "100px auto", padding: 30 }}>
      <Spin spinning={loading}>
<Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={3} style={{ marginBottom: 0 }}>
            Durée de conservation
          </Title>

          <h4>Nombre de jours avant de supprimer les rapports</h4>

          <Input
            type="number"
            min={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ width: 200, textAlign: "center", fontSize: 18 }}
          />

          <Popconfirm
            title={`Confirmer : changer à ${value} jours ?`}
            onConfirm={handleUpdate}
            okText="Oui"
            cancelText="Non"
            disabled={loading}
          >
            <Button type="primary" loading={loading}>
              Mettre à jour
            </Button>
          </Popconfirm>
        </Space>
      </Spin>
    </Card>
  );
};

export default Dureedeconservation;