import React, { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { Header } from "../../components/Header";
import { SearchBar } from "../../components/SearchBar";
import { LoginDataItem } from "../../components/LoginDataItem";

import {
  Container,
  Metadata,
  Title,
  TotalPassCount,
  LoginList,
} from "./styles";

interface LoginDataProps {
  id: string;
  service_name: string;
  email: string;
  password: string;
}

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchText, setSearchText] = useState("");
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  async function loadData() {
    const dataKey = "@savepass:logins";

    const response = await AsyncStorage.getItem(dataKey);

    if (response) {
      const parsedData = JSON.parse(response);

      setSearchListData(parsedData);
      setData(parsedData);
    }
  }

  function handleFilterLoginData() {
    const filteredData = searchListData.filter((data) => {
      const isValid = data.service_name
        .toLowerCase()
        .includes(searchText.toLowerCase());
      if (isValid) {
        return data;
      }
    });
    setSearchListData(filteredData);
  }

  function handleChangeInputText(text: string) {
    if (!text) {
      setSearchListData(data);
    }

    setSearchText(text);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <>
      <Header
        user={{
          name: "Mateus",
          avatar_url: "https://github.com/mateusanderle.png",
        }}
      />
      <Container>
        <SearchBar
          placeholder="Find password"
          onChangeText={handleChangeInputText}
          value={searchText}
          returnKeyType="search"
          onSubmitEditing={handleFilterLoginData}
          onSearchButtonPress={handleFilterLoginData}
        />

        <Metadata>
          <Title>Your passwords</Title>
          <TotalPassCount>
            {searchListData.length
              ? `${`${searchListData.length}`.padStart(2, "0")} in total`
              : "Nothing to display"}
          </TotalPassCount>
        </Metadata>

        <LoginList
          keyExtractor={(item) => item.id}
          data={searchListData}
          renderItem={({ item: loginData }) => {
            return (
              <LoginDataItem
                service={{
                  service_name: loginData.service_name,
                  email: loginData.email,
                  password: loginData.password,
                }}
                loadData={loadData}
              />
            );
          }}
        />
      </Container>
    </>
  );
}
