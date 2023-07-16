import React from "react";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform } from "react-native";
import { FieldValues, useForm } from "react-hook-form";
import { RFValue } from "react-native-responsive-fontsize";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

import { Header } from "../../components/Header";
import { Input } from "../../components/Form/Input";
import { Button } from "../../components/Form/Button";

import { Container, Form } from "./styles";
import { StackNavigationProp } from "@react-navigation/stack";

const schema = Yup.object().shape({
  service_name: Yup.string().required("Service name is required!"),
  email: Yup.string().email("Invalid email").required("Email is required!"),
  password: Yup.string().required("Password is required!"),
});

type RootStackParamList = {
  Home: undefined;
  RegisterLoginData: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  "RegisterLoginData"
>;

export function RegisterLoginData() {
  const { navigate } = useNavigation<NavigationProps>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function handleRegister(formData: FieldValues) {
    const newLoginData = {
      id: String(uuid.v4()),
      ...formData,
    };

    const dataKey = "@savepass:logins";

    const response = await AsyncStorage.getItem(dataKey);
    const parsedData = response ? JSON.parse(response) : [];

    const newLoginListData = [...parsedData, newLoginData];

    await AsyncStorage.setItem(dataKey, JSON.stringify(newLoginListData));

    navigate("Home");
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      enabled
    >
      <Header />
      <Container>
        <Form>
          <Input
            testID="service-name-input"
            title="Service name"
            name="service_name"
            error={errors?.service_name && errors?.service_name?.message}
            control={control}
            autoCapitalize="sentences"
            autoCorrect
          />
          <Input
            testID="email-input"
            title="Email or username"
            name="email"
            error={errors.email && errors.email.message}
            control={control}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            testID="password-input"
            title="Password"
            name="password"
            error={errors.password && errors.password.message}
            control={control}
            secureTextEntry
          />

          <Button
            style={{
              marginTop: RFValue(8),
            }}
            title="Save"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>
      </Container>
    </KeyboardAvoidingView>
  );
}
