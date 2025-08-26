import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function TicketValidationScreen() {
  const [ticket, setTicket] = useState("");
  const [message, setMessage] = useState("");

  const validateTicket = () => {
    if (ticket === "12345") {
      setMessage("Ticket válido!");
    } else {
      setMessage("Ticket inválido!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Validação de Ticket</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o código do ticket"
        value={ticket}
        onChangeText={setTicket}
      />

      <TouchableOpacity style={styles.button} onPress={validateTicket}>
        <Text style={styles.buttonText}>Validar</Text>
      </TouchableOpacity>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

