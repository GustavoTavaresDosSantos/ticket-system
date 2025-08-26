import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  id: Yup.string()
    .length(8, "A matrícula deve ter exatamente 8 caracteres.")
    .required("A matrícula é obrigatória."),

  password: Yup.string()
    .required("Senha é obrigatória")
    .min(6, "Senha muito curta")
    .max(30, "Senha muito grande")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "A senha deve conter ao menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
    ),
});
