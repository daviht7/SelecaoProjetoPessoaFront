import * as yup from 'yup';

const regexCPF = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/gm; //eslint-disable-line
const date_regex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/; //eslint-disable-line

function cpfValidate(cpf) {
  return cpf.length > 10
}

yup.addMethod(yup.string, "cpf", function (message) {
  return yup.mixed().test("cpf", message || "número de CPF inválido", value => cpfValidate(value));
});

let pessoaSchema = yup.object().shape({
  nome: yup.string().required("O campo Nome é obrigatório."),
  email: yup.string().email("E-mail precisa estar no formato correto"),
  cpf: yup.string()
    .transform(function removeNonNumericalChar(value) {
      return this.isType(value) && value !== null ? value.replace(/\D/g, "") : value;
    })
    .matches(regexCPF, "formato inválido do CPF")
    .cpf("Informe um CPF válido."),
  dataNascimento: yup.string()
    .matches(date_regex, "formato inválido da Data")
})

export default pessoaSchema;