import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Alert, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import * as Location from "expo-location";
import MapView, { Marker, Circle } from "react-native-maps";
import CustomText from "../../components/CustomText";
import CustomButton from "../../components/CustomButton";
import {
  getLocalTimeInGMT3,
  classes,
  schoolLocation,
} from "../../utils/timeAndConstants";

const { width, height } = Dimensions.get("window");

// Componente da tela de recebimento/validação de ticket
export default function ReceiveScreen({ navigation, route }) {
  // Obtém o estado do tema e as cores do Redux store
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  // Obtém informações do aluno e da turma a partir dos parâmetros da rota
  const { student } = route.params;
  const classInfo = classes[student.class];

  // Estados para gerenciar o tempo atual, localização do usuário e status da localização
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [isInCorrectLocation, setIsInCorrectLocation] = useState(false);

  // Referência para o componente MapView
  const mapRef = useRef(null);

  // Efeito para atualizar o tempo a cada segundo e solicitar permissão de localização
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getLocalTimeInGMT3());
    }, 1000);

    getLocationPermission();

    return () => clearInterval(timer);
  }, []);

  // Função para solicitar permissão de localização e obter a localização atual
  const getLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erro", "Permissão de localização negada");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      checkIfInCorrectLocation(currentLocation);

      // Anima o mapa para a localização atual do usuário
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          },
          1000
        );
      }
    } catch (error) {
      console.error("Erro ao obter localização:", error);
      Alert.alert("Erro", "Não foi possível obter sua localização");
    }
  };

  // Verifica se o usuário está no local correto (próximo à escola)
  const checkIfInCorrectLocation = (userLocation) => {
    // Para o usuário de teste, sempre considera a localização correta
    if (student.class === "TEST") {
      setIsInCorrectLocation(true);
      return;
    }
    if (!userLocation) return;

    // Calcula a distância entre a localização do usuário e a escola
    const distance = getDistanceFromLatLonInKm(
      userLocation.coords.latitude,
      userLocation.coords.longitude,
      schoolLocation.latitude,
      schoolLocation.longitude
    );

    // Define o status da localização com base na distância (menos de 100m)
    setIsInCorrectLocation(distance < 0.1);
  };

  // Função para calcular a distância entre duas coordenadas (latitude e longitude)
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raio da Terra em km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Converte graus para radianos
  const deg2rad = (deg) => deg * (Math.PI / 180);

  // Calcula o tempo restante até o final do recreio (com 5 minutos extras)
  const getTimeUntilBreakEnd = () => {
    const [breakHour, breakMinute] = classInfo.breakEnd.split(":").map(Number);
    const breakEndTime = new Date(currentTime);
    breakEndTime.setHours(breakHour, breakMinute, 0, 0);
    breakEndTime.setMinutes(breakEndTime.getMinutes() + 5); // Adiciona 5 minutos extras

    const timeDiff = breakEndTime.getTime() - currentTime.getTime();

    if (timeDiff <= 0) return null;

    const minutes = Math.floor(timeDiff / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { minutes, seconds };
  };

  // Formata o tempo para exibir com dois dígitos (ex: 05, 12)
  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  // Lida com a validação do ticket
  const handleValidateTicket = () => {
    // Para o usuário de teste, navega diretamente para a tela de validação
    if (student.id === "99999999") {
      navigation.navigate("ValidateScreen", { student });
      return;
    }

    // Alerta se o usuário não estiver no local correto
    if (!isInCorrectLocation) {
      Alert.alert(
        "Aviso",
        "Para validar o ticket, você precisa estar no local correto. Por favor, aproxime-se da escola."
      );
      return;
    }

    // Navega para a tela de validação do ticket
    navigation.navigate("ValidateScreen", { student });
  };

  // Renderiza o tempo restante para o final do recreio
  const renderTimeRemaining = () => {
    const timeUntil = getTimeUntilBreakEnd();

    if (!timeUntil) {
      return (
        <CustomText style={[styles.timeText, { color: colors.danger }]}>
          Tempo esgotado!
        </CustomText>
      );
    }

    return (
      <CustomText style={[styles.timeText, { color: colors.text }]}>
        Tempo restante: {formatTime(timeUntil.minutes)}:
        {formatTime(timeUntil.seconds)}
      </CustomText>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.body }]}>
      <View style={styles.topSection}>
        {/* Exibe o tempo restante para o final do recreio */}
        {renderTimeRemaining()}

        {/* Cartão de status da localização */}
        <View
          style={[
            styles.locationCard,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <CustomText style={[styles.locationTitle, { color: colors.text }]}>
            Status da Localização
          </CustomText>
          <CustomText
            style={[
              styles.locationStatus,
              { color: isInCorrectLocation ? colors.success : colors.danger },
            ]}
          >
            {isInCorrectLocation ? "✓ No local correto" : "✗ Fora do local"}
          </CustomText>
        </View>

        {/* Botão para validar o ticket */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Validar Ticket"
            onPress={handleValidateTicket}
            disabled={!isInCorrectLocation}
          />
        </View>
      </View>

      {/* Contêiner do mapa */}
      <View style={styles.mapContainer}>
        {location ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {/* Marcador da escola no mapa */}
            <Marker
              coordinate={schoolLocation}
              title="Escola"
              description="Local para resgatar o ticket"
              pinColor={colors.accent}
            />

            {/* Círculo indicando a área de validação da escola */}
            <Circle
              center={schoolLocation}
              radius={10} // Raio de 10 metros
              strokeColor={
                isInCorrectLocation ? "rgba(0,200,0,0.7)" : "rgba(200,0,0,0.7)"
              }
              fillColor={
                isInCorrectLocation ? "rgba(0,200,0,0.3)" : "rgba(200,0,0,0.2)"
              }
            />
          </MapView>
        ) : (
          <View
            style={[styles.loadingMap, { backgroundColor: colors.disabled }]}
          >
            <CustomText style={[styles.loadingText, { color: colors.text }]}>
              Carregando mapa...
            </CustomText>
          </View>
        )}
      </View>
    </View>
  );
}

// Estilos para o componente ReceiveScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  timeText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
  },
  locationCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: "center",
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  locationStatus: {
    fontSize: 18,
    fontWeight: "700",
  },
  buttonContainer: {
    marginBottom: 16,
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  loadingMap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
});


