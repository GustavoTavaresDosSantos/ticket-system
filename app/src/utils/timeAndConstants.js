export const getLocalTimeInGMT3 = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60 * 1000;
  const gmt3Offset = -3 * 60 * 60 * 1000;
  const gmt3Time = new Date(now.getTime() + offset + gmt3Offset);
  return gmt3Time;
};

export const classes = {
  "DS-V1": {
    name: "Desenvolvimento de Sistemas/V1",
    breakStart: "15:00",
    breakEnd: "15:15",
  },
  "DS-V2": {
    name: "Desenvolvimento de Sistemas/V2",
    breakStart: "15:30",
    breakEnd: "15:45",
  },
  "MA-V1": {
    name: "Mecânica Automotiva/V1",
    breakStart: "16:00",
    breakEnd: "16:15",
  },
  "TESTE-V1": {
    name: "Turma de Teste",
    breakStart: "00:00",
    breakEnd: "23:59",
  },
};

export const schoolLocation = {
  latitude: -27.618426,
  longitude: -48.663304,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};
