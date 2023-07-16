import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Container,
  ShowPasswordButton,
  Icon,
  PassData,
  Title,
  Password,
  LoginData,
  BoldTitle,
  Email,
  PasswordWrapper,
  TrashBox,
  TrashIcon,
} from "./styles";
import { Alert } from "react-native";

interface Service {
  service_name: string;
  email: string;
  password: string;
}

interface Props {
  service: Service;
  loadData: () => void;
}

export function LoginDataItem({ service, loadData }: Props) {
  const [passIsVisible, setPassIsVisible] = useState(false);
  const { service_name, email, password } = service;

  function handleTogglePassIsVisible() {
    setPassIsVisible(!passIsVisible);
  }

  async function handleDeleteItem() {
    Alert.alert(
      "Attention!",
      `Do you really want to delete ${service_name} password?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sure!",
          onPress: async () => {
            const dataKey = "@savepass:logins";

            const response = await AsyncStorage.getItem(dataKey);
            const parsedData = response ? JSON.parse(response) : [];

            if (parsedData.length > 0) {
              const newLoginListData = parsedData.filter(
                (service: Service) => service.service_name !== service_name
              );
              await AsyncStorage.setItem(
                dataKey,
                JSON.stringify(newLoginListData)
              );

              loadData();
            }
          },
        },
      ]
    );
  }

  return (
    <Container colors={[passIsVisible ? "#EBF2FF" : "#ffffff", "#ffffff"]}>
      <PasswordWrapper>
        <ShowPasswordButton onPress={handleTogglePassIsVisible}>
          <Icon
            name={passIsVisible ? "eye" : "eye-off"}
            color={passIsVisible ? "#fca311" : "#888D97"}
          />
        </ShowPasswordButton>

        {passIsVisible ? (
          <PassData>
            <Title>{service_name}</Title>
            <Password>{password}</Password>
          </PassData>
        ) : (
          <LoginData>
            <BoldTitle>{service_name}</BoldTitle>
            <Email>{email}</Email>
          </LoginData>
        )}
      </PasswordWrapper>

      <TrashBox onPress={handleDeleteItem}>
        <TrashIcon name="trash" color="#888D97" />
      </TrashBox>
    </Container>
  );
}
