/* eslint eqeqeq: "off" */
import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import Context from "./Context";
import moment from "moment";
import "moment/locale/pt-br";
// router.
import { useHistory } from "react-router-dom";
// funções.
import toast from "../functions/toast";
import checkinput from "../functions/checkinput";
import maskdate from "../functions/maskdate";
import maskphone from "../functions/maskphone";
// imagens.
import salvar from "../images/salvar.svg";
import deletar from "../images/deletar.svg";
import back from "../images/back.svg";
import novo from "../images/novo.svg";
import modal from "../functions/modal";

function Cadastro() {
  // context.
  const {
    html,
    pagina,
    setpagina,
    setusuario,
    settoast,
    setdialogo,
    unidade,
    setunidade,
    hospital,
    unidades,
    pacientes,
    setpacientes,
    paciente,
    setpaciente,
    atendimentos,
    setatendimentos,
  } = useContext(Context);

  // history (router).
  let history = useHistory();

  const refreshApp = () => {
    setusuario({
      id: 0,
      nome_usuario: "LOGOFF",
      dn_usuario: null,
      cpf_usuario: null,
      email_usuario: null,
    });
    setpagina(0);
    history.push("/");
  };
  window.addEventListener("load", refreshApp);

  const [atendimento, setatendimento] = useState([]);
  useEffect(() => {
    if (pagina == 2) {
      setpaciente([]);
      setatendimento([]);
      loadPacientes();
      loadAtendimentos();
    }
    // eslint-disable-next-line
  }, [pagina]);

  // recuperando registros de pacientes cadastrados na aplicação.
  const [arraypacientes, setarraypacientes] = useState([]);
  const loadPacientes = () => {
    axios
      .get(html + "list_pacientes")
      .then((response) => {
        setpacientes(response.data.rows);
        setarraypacientes(response.data.rows);
      })
      .catch(function (error) {
        if (error.response == undefined) {
          toast(
            settoast,
            "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO: " + error,
            "black",
            3000
          );
          setTimeout(() => {
            setpagina(0);
            history.push("/");
          }, 3000);
        } else {
          toast(
            settoast,
            error.response.data.message + " REINICIANDO APLICAÇÃO.",
            "black",
            3000
          );
          setTimeout(() => {
            setpagina(0);
            history.push("/");
          }, 3000);
        }
      });
  };

  // recuperando registros de pacientes cadastrados na aplicação.
  const loadAtendimentos = () => {
    axios
      .get(html + "allatendimentos/" + hospital)
      .then((response) => {
        setatendimentos(response.data.rows);
      })
      .catch(function () {
        toast(
          settoast,
          "ERRO AO CARREGAR ATENDIMENTOS, REINICIANDO APLICAÇÃO.",
          "black",
          5000
        );
        setTimeout(() => {
          setpagina(0);
          history.push("/");
        }, 5000);
      });
  };

  // registrando um novo paciente.
  const insertPaciente = () => {
    var obj = {
      nome_paciente: document
        .getElementById("inputNovoNomePaciente")
        .value.toUpperCase(),
      nome_mae_paciente: document
        .getElementById("inputNovoNomeMae")
        .value.toUpperCase(),
      dn_paciente: moment(
        document.getElementById("inputNovaDn").value,
        "DD/MM/YYYY"
      ),

      antecedentes_pessoais: null,
      medicacoes_previas: null,
      exames_previos: null,
      exames_atuais: null,

      tipo_documento: document
        .getElementById("inputNovoTipoDocumento")
        .value.toUpperCase(),
      numero_documento: document
        .getElementById("inputNovoNumeroDocumento")
        .value.toUpperCase(),
      endereco: document
        .getElementById("inputNovoEndereco")
        .value.toUpperCase(),
      telefone: document
        .getElementById("inputNovoTelefone")
        .value.toUpperCase(),
      email: document.getElementById("inputNovoEmail").value,
    };
    axios
      .post(html + "insert_paciente", obj)
      .then(() => {
        loadPacientes();
        setviewnewpaciente(0);
        toast(
          settoast,
          "PACIENTE CADASTRADO COM SUCESSO NA BASE PULSAR",
          "rgb(82, 190, 128, 1)",
          3000
        );
      })
      .catch(function () {
        toast(
          settoast,
          "ERRO AO INSERIR PACIENTE, REINICIANDO APLICAÇÃO.",
          "black",
          5000
        );
        setTimeout(() => {
          setpagina(0);
          history.push("/");
        }, 5000);
      });
  };

  // excluir um paciente.
  const deletePaciente = (paciente) => {
    axios
      .get(html + "delete_paciente/" + paciente)
      .then(() => {
        loadPacientes();
        toast(
          settoast,
          "PACIENTE EXCLUÍDO COM SUCESSO DA BASE PULSAR",
          "rgb(82, 190, 128, 1)",
          3000
        );
        // excluindo todos os registros de atendimentos relativos ao paciente excluído.
        atendimentos
          .filter((atendimento) => atendimento.id_paciente == paciente)
          .map((atendimento) => {
            deleteAtendimento(atendimento.id_atendimento);
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              loadAtendimentos();
            }, 1000);
            return null;
          });
      })
      .catch(function () {
        toast(
          settoast,
          "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
          "black",
          5000
        );
        setTimeout(() => {
          setpagina(0);
          history.push("/");
        }, 5000);
      });
  };

  // registrando um novo atendimento.
  const insertAtendimento = (id, nome, leito) => {
    var obj = {
      data_inicio: moment(),
      data_termino: null,
      historia_atual: null,
      id_paciente: id,
      id_unidade: unidade,
      nome_paciente: nome,
      leito: leito,
      situacao: 1, // 1 = atendimento ativo; 0 = atendimento encerrado.
      id_cliente: hospital,
      classificacao: null,
    };
    axios
      .post(html + "insert_atendimento", obj)
      .then(() => {
        loadAtendimentos();
        toast(
          settoast,
          "ATENDIMENTO INICIADO COM SUCESSO",
          "rgb(82, 190, 128, 1)",
          3000
        );
      })
      .catch(function () {
        toast(
          settoast,
          "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
          "black",
          5000
        );
        setTimeout(() => {
          setpagina(0);
          history.push("/");
        }, 5000);
      });
  };

  // atualizando um atendimento (mudando de leito).
  const updateAtendimento = (leito, atendimento) => {
    let leito_atual = null
    let id_leito_atual = null;
    let unidade_atual = null;
    axios.get(html + "allatendimentos/" + hospital).then((response) => {
      let x = response.data.rows;
      unidade_atual = x.filter(item => item.id_atendimento == atendimento.map(valor => valor.id_atendimento)).map(item => item.id_unidade).pop();
      leito_atual = x.filter(item => item.id_atendimento == atendimento.map(valor => valor.id_atendimento)).map(item => item.leito).pop();
      console.log('LEITO ATUAL DO ATENDIMENTO, A SER LIBERADO: ' + leito_atual);
      // recuperando a id do leito atual, a ter seu status alterado para livre.
      axios.get(html + "list_all_leitos").then((response) => {
        let y = response.data.rows;
        id_leito_atual = y.filter(valor => valor.leito == leito_atual && valor.id_unidade == unidade_atual).map(item => item.id_leito).pop();
        console.log('ID LEITO ATUAL A SER LIBERADO: ' + id_leito_atual);
        // liberando o leito.
        var obj = {
          id_unidade: unidade_atual,
          leito: leito_atual,
          status: 'LIVRE',
        };
        console.log(obj);
        axios.post(html + "update_leito/" + id_leito_atual, obj).then(() => {
          // atualizando o atendimento no novo leito.
          atendimento.map((item) => {
            var obj = {
              data_inicio: item.data_inicio,
              data_termino: null,
              problemas: item.problemas,
              id_paciente: item.id_paciente,
              id_unidade: unidade,
              nome_paciente: item.nome_paciente,
              leito: leito,
              situacao: 1,
              id_cliente: hospital,
              classificacao: item.classificacao,
            };
            axios
              .post(html + "update_atendimento/" + item.id_atendimento, obj)
              .then(() => {
                axios
                  .get(html + "allatendimentos/" + hospital)
                  .then((response) => {
                    setatendimentos(response.data.rows);
                    loadLeitos(unidade);
                    setvieweditpaciente(0);
                  })
              })
            return null;
          });
        });
      });
    });
  };

  // encerrando um atendimento.
  const closeAtendimento = (atendimento) => {
    atendimento.map((item) => {
      var obj = {
        data_inicio: item.data_inicio,
        data_termino: moment(),
        historia_atual: item.historia_atual,
        id_paciente: item.id_paciente,
        id_unidade: item.id_unidade,
        nome_paciente: item.nome_paciente,
        leito: item.leito,
        situacao: 0, // 1 = atendimento ativo; 0 = atendimento encerrado.
        id_cliente: hospital,
        classificacao: item.classificacao,
      };
      axios
        .post(html + "update_atendimento/" + item.id_atendimento, obj)
        .then(() => {
          // rcuperando a id do leito a ter seu status alterado para livre.
          let id_leito = statusleitos.filter((valor) => valor.leito == item.leito && valor.id_unidade == unidade).map(item => item.id_leito);
          // liberando o leito.
          var obj = {
            id_unidade: unidade,
            leito: item.leito,
            status: 'LIVRE',
          };
          axios.post(html + "update_leito/" + id_leito, obj);
          loadLeitos();
          loadAtendimentos();
          toast(
            settoast,
            "ATENDIMENTO ENCERRADO COM SUCESSO NA BASE PULSAR",
            "rgb(82, 190, 128, 1)",
            3000
          );
        })
        .catch(function () {
          toast(
            settoast,
            "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
            "black",
            5000
          );
          setTimeout(() => {
            setpagina(0);
            history.push("/");
          }, 5000);
        });
      return null;
    });
  };

  // excluir um atendimento.
  const deleteAtendimento = (id) => {
    axios.get(html + "delete_atendimento/" + id).catch(function () {
      toast(settoast, "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.", "black", 5000);
      setTimeout(() => {
        setpagina(0);
        history.push("/");
      }, 5000);
    });
  };

  const [viewtipodocumento, setviewtipodocumento] = useState(0);
  function ViewTipoDocumento() {
    let array = ["CPF", "RG", "CERT. NASCTO.", "OUTRO"];
    return (
      <div
        className="fundo"
        style={{ display: viewtipodocumento == 1 ? "flex" : "none" }}
        onClick={() => setviewtipodocumento(0)}
      >
        <div className="janela scroll" onClick={(e) => e.stopPropagation()}>
          {array.map((item) => (
            <div
              className="button"
              style={{ width: 100 }}
              onClick={() => {
                if (viewnewpaciente == 0) {
                  document.getElementById(
                    "inputTipoDocumento " + paciente.id_paciente
                  ).value = item;
                  setviewtipodocumento(0);
                } else {
                  document.getElementById("inputNovoTipoDocumento").value =
                    item;
                  setviewtipodocumento(0);
                }
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // componente para inserir novo paciente.
  const [viewnewpaciente, setviewnewpaciente] = useState(0);
  function InsertPaciente() {
    var timeout = null;
    return (
      <div
        className="fundo"
        style={{ display: viewnewpaciente == 1 ? "flex" : "none" }}
        onClick={() => setviewnewpaciente(0)}
      >
        <div
          className="janela scroll"
          onClick={(e) => e.stopPropagation()}
          style={{ height: 0.8 * window.innerHeight }}
        >
          <div
            id="cadastrar paciente"
            style={{
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
              marginRight: 10,
              alignItems: "center",
            }}
          >
            <div
              id="nome do paciente"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">NOME DO PACIENTE</div>
              <input
                autoComplete="off"
                placeholder="NOME DO PACIENTE"
                className="textarea"
                type="text"
                id="inputNovoNomePaciente"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "NOME DO PACIENTE")}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: "30vw",
                  alignContent: "center",
                  height: 40,
                  minHeight: 40,
                  maxHeight: 40,
                  borderStyle: "none",
                  textAlign: "center",
                }}
              ></input>
            </div>
            <div
              id="dn paciente"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">DATA DE NASCIMENTO</div>
              <input
                autoComplete="off"
                placeholder="DN"
                className="textarea"
                type="text"
                id="inputNovaDn"
                title="FORMATO: DD/MM/YYYY"
                onClick={() =>
                  (document.getElementById("inputNovaDn").value = "")
                }
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "DN")}
                onKeyUp={() => maskdate(timeout, "inputNovaDn")}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: "10vw",
                  height: 40,
                  minHeight: 40,
                  maxHeight: 40,
                  borderStyle: "none",
                  textAlign: "center",
                }}
              ></input>
            </div>
            <div
              id="documento"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">DOCUMENTO</div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <input
                  autoComplete="off"
                  placeholder="TIPO DE DOC."
                  className="input destacaborda"
                  type="text"
                  id={"inputNovoTipoDocumento"}
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "TIPO DE DOC.")}
                  onClick={() => setviewtipodocumento(1)}
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: 130,
                    alignContent: "center",
                    textAlign: "center",
                  }}
                ></input>
                <input
                  autoComplete="off"
                  placeholder="NÚMERO DO DOCUMENTO"
                  className="textarea"
                  type="text"
                  id={"inputNovoNumeroDocumento"}
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "NÚMERO DO DOCUMENTO")}
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: "30vw",
                    alignContent: "center",
                    height: 40,
                    minHeight: 40,
                    maxHeight: 40,
                    borderStyle: "none",
                    textAlign: "center",
                  }}
                ></input>
              </div>
            </div>
            <div
              id="nome da mae"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">NOME DA MÃE</div>
              <input
                autoComplete="off"
                placeholder="NOME DA MÃE"
                className="textarea"
                type="text"
                id="inputNovoNomeMae"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "NOME DA MÃE")}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: "30vw",
                  alignContent: "center",
                  height: 40,
                  minHeight: 40,
                  maxHeight: 40,
                  borderStyle: "none",
                  textAlign: "center",
                }}
              ></input>
            </div>
            <div
              id="endereco"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">ENDEREÇO</div>
              <input
                autoComplete="off"
                placeholder="BUSCAR CEP..."
                className="textarea"
                type="text"
                id={"inputNovoCep"}
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "BUSCAR CEP...")}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: 200,
                  alignContent: "center",
                  height: 40,
                  minHeight: 40,
                  maxHeight: 40,
                  borderStyle: "none",
                  textAlign: "center",
                }}
                onKeyUp={() => {
                  clearTimeout(timeout);
                  timeout = setTimeout(() => {
                    pegaEndereco(document.getElementById("inputNovoCep").value);
                  }, 2000);
                }}
              ></input>
              <textarea
                className="textarea"
                type="text"
                id={"inputNovoEndereco"}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: "50vw",
                  padding: 15,
                  height: 75,
                  minHeight: 75,
                  maxHeight: 75,
                }}
              ></textarea>
            </div>
            <div
              id="telefone"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">TELEFONE</div>
              <textarea
                autoComplete="off"
                placeholder="TELEFONE"
                className="textarea"
                type="text"
                id={"inputNovoTelefone"}
                onKeyUp={() => maskphone(timeout, "inputNovoTelefone")}
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "TELEFONE")}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: "50vw",
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
              ></textarea>
            </div>
            <div
              id="email"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">EMAIL</div>
              <textarea
                autoComplete="off"
                placeholder="EMAIL"
                className="textarea"
                type="text"
                id={"inputNovoEmail"}
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "EMAIL")}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: "50vw",
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
              ></textarea>
            </div>

            <div style={{ display: "none" }}>
              <div
                id="antecedentes pessoais"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">ANTECEDENTES PESSOAIS</div>
                <textarea
                  className="textarea"
                  placeholder="ANTECEDENTES PESSOAIS"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) =>
                    (e.target.placeholder = "ANTECEDENTES PESSOAIS")
                  }
                  style={{
                    display: "flex",
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: "50vw",
                    whiteSpace: "pre-wrap",
                  }}
                  id="inputNovoAntecedentesPessoais"
                  title="ANTECEDENTES PESSOAIS."
                ></textarea>
              </div>
              <div
                id="medicações de uso domiciliar"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">MEDICAÇÕES DE USO DOMICILIAR</div>
                <textarea
                  className="textarea"
                  placeholder="MEDICAÇÕES DE USO DOMICILIAR"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) =>
                    (e.target.placeholder = "MEDICAÇÕES DE USO DOMICILIAR")
                  }
                  style={{
                    display: "flex",
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: "50vw",
                    whiteSpace: "pre-wrap",
                  }}
                  id="inputNovoMedicacoesPrevias"
                  title="MEDICAÇÕES DE USO DOMICILIAR."
                ></textarea>
              </div>
              <div
                id="exames prévios"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">EXAMES PRÉVIOS</div>
                <textarea
                  className="textarea"
                  placeholder="EXAMES PRÉVIOS"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "EXAMES PRÉVIOS")}
                  style={{
                    display: "flex",
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: "50vw",
                    whiteSpace: "pre-wrap",
                  }}
                  id="inputNovoExamesPrevios"
                  title="EXAMES PRÉVIOS."
                ></textarea>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <div
                id="btnNovoPaciente"
                title="REGISTRAR PACIENTE"
                className="button-green"
                onClick={() => {
                  checkinput(
                    "textarea",
                    settoast,
                    [
                      "inputNovoNomePaciente",
                      "inputNovaDn",
                      "inputNovoNomeMae",
                      "inputNovoTipoDocumento",
                      "inputNovoNumeroDocumento",
                      "inputNovoEndereco",
                      "inputNovoTelefone",
                      "inputNovoEmail",
                    ],
                    "btnNovoPaciente",
                    insertPaciente,
                    []
                  );
                }}
                style={{ width: 50, height: 50, alignSelf: "center" }}
              >
                <img
                  alt=""
                  src={salvar}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </div>
            </div>
          </div>
        </div>
        <ViewTipoDocumento></ViewTipoDocumento>
      </div>
    );
  }

  const [filterpaciente, setfilterpaciente] = useState("");
  var timeout = null;
  var searchpaciente = "";
  const filterPaciente = () => {
    clearTimeout(timeout);
    document.getElementById("inputPaciente").focus();
    searchpaciente = document
      .getElementById("inputPaciente")
      .value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchpaciente == "") {
        setfilterpaciente("");
        setarraypacientes(pacientes);
        document.getElementById("inputPaciente").value = "";
        setTimeout(() => {
          document.getElementById("inputPaciente").focus();
        }, 100);
      } else {
        setfilterpaciente(
          document.getElementById("inputPaciente").value.toUpperCase()
        );
        setarraypacientes(
          pacientes.filter((item) =>
            item.nome_paciente.includes(searchpaciente)
          )
        );
        document.getElementById("inputPaciente").value = searchpaciente;
        setTimeout(() => {
          document.getElementById("inputPaciente").focus();
        }, 100);
      }
    }, 1000);
  };

  // filtro de paciente por nome.
  function FilterPaciente() {
    return (
      <input
        className="input"
        autoComplete="off"
        placeholder="BUSCAR PACIENTE..."
        onFocus={(e) => (e.target.placeholder = "")}
        onBlur={(e) => (e.target.placeholder = "BUSCAR PACIENTE...")}
        onKeyUp={() => filterPaciente()}
        type="text"
        id="inputPaciente"
        defaultValue={filterpaciente}
        maxLength={100}
        style={{ margin: 0, width: window.innerWidth < 426 ? "100%" : "30vw" }}
      ></input>
    );
  }

  function HeaderListaDePacientes() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignSelf: "center",
          marginBottom: 0,
          marginTop: 10,
          width: "calc(100vw + 50px)",
        }}
      >
        <div className="header-row">
          <div
            className="header"
            style={{
              flex: window.innerWidth < 426 ? 6 : 2,
            }}
          >
            NOME DO PACIENTE
          </div>
          <div
            className="header"
            style={{
              display: "flex",
              flex: 1,
            }}
          >
            DN
          </div>
          <div
            className="header"
            style={{
              display: "flex",
              flex: 2,
            }}
          >
            NOME DA MÃE
          </div>
          <div
            className="header"
            style={{
              display: "flex",
              flex: 1,
            }}
          >
            STATUS
          </div>
        </div>
      </div>
    );
  }

  function ListaDePacientes() {
    return (
      <div
        style={{
          width: "calc(100vw - 40px)",
          height:
            window.innerWidth < 426
              ? window.innerHeight - 130
              : window.innerHeight - 130,
        }}
      >
        {arraypacientes
          .sort((a, b) => (a.nome_paciente > b.nome_paciente ? 1 : -1))
          .map((item) => (
            <div
              key={"paciente " + item.id_paciente}
              style={{
                display: arraypacientes.length > 0 ? "flex" : "none",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                className="row"
                style={{
                  justifyContent:
                    "space-between",
                  flex: 6,
                  margin: 0,
                }}
                onClick={() => {
                  setpaciente(item);
                  setatendimento(
                    atendimentos.filter(
                      (valor) =>
                        valor.id_cliente == hospital &&
                        valor.data_termino == null &&
                        valor.id_paciente == item.id_paciente
                    ));
                  setvieweditpaciente(1)
                }}
              >
                <div
                  className="button"
                  style={{
                    flex: window.innerWidth < 426 ? 6 : 2,
                  }}
                >
                  {item.nome_paciente}
                </div>
                <div
                  className="button"
                  style={{
                    display: "flex",
                    flex: 1,
                  }}
                >
                  {moment(item.dn_paciente).format("DD/MM/YY")}
                </div>
                <div
                  className="button"
                  style={{
                    display: "flex",
                    flex: 2,
                  }}
                >
                  {item.nome_mae_paciente}
                </div>
                <div
                  className={
                    atendimentos.filter(
                      (valor) =>
                        valor.id_paciente == item.id_paciente &&
                        valor.data_termino == null
                    ).length > 0
                      ? "button-green"
                      : "button"
                  }
                  style={{
                    display: "flex",
                    flex: 1,
                  }}
                >
                  {atendimentos.filter(
                    (valor) =>
                      valor.id_paciente == item.id_paciente &&
                      valor.data_termino == null
                  ).length > 0
                    ? "EM ATENDIMENTO"
                    : "INICIAR ATENDIMENTO"}
                </div>
              </div>
            </div>
          ))}
        <div
          className="text1"
          style={{
            display: arraypacientes.length == 0 ? "flex" : "none",
            width: "90vw",
            opacity: 0.5,
          }}
        >
          SEM PACIENTES CADASTRADOS NA APLICAÇÃO
        </div>
      </div>
    );
  }

  // api para busca do endereço pelo CEP:
  const pegaEndereco = (cep) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://viacep.com.br/ws/" + cep + "/json/", true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
      if ((xhr.readyState == 0 || xhr.readyState == 4) && xhr.status == 200) {
        let endereco = JSON.parse(xhr.responseText);
        if (endereco.logradouro != undefined) {
          console.log("ENDEREÇO: " + endereco.logradouro);
          document.getElementById(
            "inputEndereco " + paciente.id_paciente
          ).value =
            endereco.logradouro +
            ", BAIRRO: " +
            endereco.bairro +
            ", " +
            endereco.localidade +
            " - " +
            endereco.uf +
            " - CEP: " +
            endereco.cep;
          document.getElementById("inputCep " + paciente.id_paciente).value =
            endereco.cep;
        } else {
          document.getElementById(
            "inputEndereco " + paciente.id_paciente
          ).value = "";
          document.getElementById("inputCep " + paciente.id_paciente).value =
            "CEP";
        }
      }
    };
    xhr.send(null);
  };

  const [vieweditpaciente, setvieweditpaciente] = useState(0);
  const DadosPacienteAtendimento = useCallback(() => {
    var timeout = null;
    return (
      <div
        className="fundo"
        style={{ display: vieweditpaciente == 1 && atendimento != null ? "flex" : "none" }}
        onClick={() => setvieweditpaciente(0)}
      >
        <div
          className="janela"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            flexDirection: "row",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <div id="botão para fechar tela de edição do apciente e movimentação de leito"
            className="button-red"
            onClick={() => setvieweditpaciente(0)}
            style={{ position: 'absolute', top: 10, right: 10 }}
          >
            <img
              alt=""
              src={back}
              style={{
                margin: 10,
                height: 30,
                width: 30,
              }}
            ></img>
          </div>
          <div id="dados do paciente"
            className="scroll"
            style={{
              flexDirection: "column",
              justifyContent: 'flex-start',
              alignItems: "center",
              height: '80vh',
              marginRight: 20
            }}
          >
            <div
              id="nome do paciente"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">NOME DO PACIENTE</div>
              <textarea
                autoComplete="off"
                placeholder="NOME DO PACIENTE"
                className="textarea"
                type="text"
                id="inputEditNomePaciente"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "NOME DO PACIENTE")}
                defaultValue={paciente.nome_paciente}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: 400,
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
              ></textarea>
            </div>
            <div
              id="dn paciente"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">DATA DE NASCIMENTO</div>
              <textarea
                autoComplete="off"
                placeholder="DN"
                className="textarea"
                type="text"
                inputMode="numeric"
                maxLength={10}
                id="inputEditDn"
                title="FORMATO: DD/MM/YYYY"
                onClick={() => document.getElementById("inputEditDn").value = ""}
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "DN")}
                onKeyUp={() => maskdate(timeout, "inputEditDn")}
                defaultValue={moment(paciente.dn_paciente).format("DD/MM/YYYY")}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: 100,
                  textAlign: "center",
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
              ></textarea>
            </div>
            <div
              id="documento"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">DOCUMENTO</div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <input
                  autoComplete="off"
                  placeholder="TIPO DE DOC."
                  className="input destacaborda"
                  type="text"
                  id="inputEditTipoDocumento"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "TIPO DE DOC.")}
                  defaultValue={paciente.tipo_documento}
                  onClick={() => setviewtipodocumento(1)}
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: 130,
                    alignContent: "center",
                    textAlign: "center",
                  }}
                ></input>
                <textarea
                  autoComplete="off"
                  placeholder="NÚMERO DO DOCUMENTO"
                  className="textarea"
                  type="text"
                  id="inputEditNumeroDocumento"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "NÚMERO DO DOCUMENTO")}
                  defaultValue={paciente.numero_documento}
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: 200,
                    padding: 15,
                    height: 20,
                    minHeight: 20,
                    maxHeight: 20,
                  }}
                ></textarea>
              </div>
            </div>
            <div id="nome da mae"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">NOME DA MÃE</div>
              <textarea
                autoComplete="off"
                placeholder="NOME DA MÃE"
                className="textarea"
                type="text"
                id="inputEditNomeMae"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "NOME DA MÃE")}
                defaultValue={paciente.nome_mae_paciente}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: 400,
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
              ></textarea>
            </div>
            <div id="endereco"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">ENDEREÇO</div>
              <textarea
                autoComplete="off"
                placeholder="BUSCAR CEP..."
                className="textarea"
                type="text"
                id="inputEditCep"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "BUSCAR CEP...")}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  textAlign: 'center',
                  width: 100,
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
                onKeyUp={() => {
                  clearTimeout(timeout);
                  timeout = setTimeout(() => {
                    pegaEndereco(
                      document.getElementById(
                        "inputCep " + paciente.id_paciente
                      ).value
                    );
                  }, 2000);
                }}
              ></textarea>
              <textarea
                className="textarea"
                type="text"
                id="inputEditEndereco"
                defaultValue={paciente.endereco}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: 400,
                  padding: 15,
                  height: 75,
                  minHeight: 75,
                  maxHeight: 75,
                }}
              ></textarea>
            </div>
            <div id="telefone"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">TELEFONE</div>
              <textarea
                autoComplete="off"
                placeholder="TELEFONE"
                className="textarea"
                type="text"
                id="inputEditTelefone"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "TELEFONE")}
                defaultValue={paciente.telefone}
                onKeyUp={() =>
                  maskphone(timeout, "inputEditTelefone")
                }
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: 150,
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
              ></textarea>
            </div>
            <div id="email"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">EMAIL</div>
              <textarea
                autoComplete="off"
                placeholder="EMAIL"
                className="textarea"
                type="text"
                id="inputEditEmail"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "EMAIL")}
                defaultValue={paciente.email}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: 200,
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
              ></textarea>
            </div>
            <div id="botões da tela editar paciente"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <div id="btnUpdatePaciente"
                title="ATUALIZAR DADOS DO PACIENTE"
                className="button-green"
                onClick={() => {
                  checkinput('textarea', settoast, ["inputEditNomePaciente", "inputEditDn", "inputEditNumeroDocumento", "inputEditNomeMae", "inputEditEndereco", "inputEditTelefone", "inputEditEmail"], "btnUpdatePaciente", updatePaciente, [])
                }}
                style={{ width: 50, height: 50, alignSelf: "center" }}
              >
                <img
                  alt=""
                  src={salvar}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </div>
              <div id="btnDeletePaciente"
                title="EXCLUIR PACIENTE"
                className="button-red"
                onClick={() => {
                  modal(
                    setdialogo,
                    "TEM CERTEZA QUE DESEJA EXCLUIR O REGISTRO DESTE PACIENTE? ESTA AÇÃO É IRREVERSÍVEL.",
                    deletePaciente,
                    paciente.id_paciente
                  );
                }}
                style={{ width: 50, height: 50, alignSelf: "center" }}
              >
                <img
                  alt=""
                  src={deletar}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </div>
            </div>
          </div>
          <div id="card status de atendimento"
            className="card cor7"
            style={{
              position: "sticky",
              top: 10,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: 345,
              marginTop: 0,
              marginBottom: 20,
            }}
          >
            <div id="paciente sem atendimento ativo"
              style={{
                display:
                  atendimentos.filter(
                    (item) =>
                      item.id_paciente == paciente.id_paciente &&
                      item.data_termino == null
                  ).length == 0
                    ? "flex"
                    : "none",
                flexDirection: "column",
                justifyContent: "center",
                height: "50vh",
                width: window.innerWidth < 426 ? "70vw" : "30vw",
                alignSelf: "center",
              }}
            >
              <div className="text1" style={{ margin: 15 }}>
                {
                  "PACIENTE NÃO ESTÁ EM ATENDIMENTO NOS HOSPITAIS CADASTRADOS EM NOSSA BASE."
                }
              </div>
              <div className="button" onClick={() => setviewseletorunidades(1)}>
                INICIAR ATENDIMENTO
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              ></div>
            </div>
            <div id="em atendimento na unidade logada"
              className="card cor5hover"
              style={{
                display:
                  atendimentos.filter(
                    (item) =>
                      item.id_paciente == paciente.id_paciente &&
                      item.data_termino == null
                  ).length > 0
                    ? "flex"
                    : "none",
                flexDirection: "column",
                justifyContent: "center",
                height: "50vh",
                width: window.innerWidth < 426 ? "70vw" : "30vw",
                alignSelf: "center",
              }}
            >
              <div className="text1"
                style={{
                  display:
                    atendimentos.filter(
                      (item) =>
                        item.id_paciente == paciente.id_paciente &&
                        item.data_termino == null
                    ).length > 0
                      ? "flex"
                      : "none",
                }}>
                {"PACIENTE ATUALMENTE EM ATENDIMENTO: UNIDADE " +
                  unidades
                    .filter(
                      (value) =>
                        value.id_unidade ==
                        atendimento.map((item) => item.id_unidade)
                    )
                    .map((item) => item.nome_unidade) +
                  " - LEITO " +
                  atendimento.map((item) => item.leito)}
              </div>
              <div className="text1"
                style={{
                  display: atendimento.map(item => item.id_unidade) == 4 ? 'flex' : 'none',
                }}>
                {atendimento.id_unidade}
                {"PACIENTE AGUARDANDO TRIAGEM PARA ATENDIMENTO"}
              </div>
              <div className="button" onClick={() => setviewseletorunidades(1)}>
                ALTERAR LEITO
              </div>
              <div
                className="button-red"
                title="ENCERRAR ATENDIMENTO"
                onClick={() => {
                  modal(
                    setdialogo,
                    "TEM CERTEZA DE QUE DESEJA ENCERRAR ESTE ATENDIMENTO? ESTA OPERAÇÃO É IRREVERSÍVEL.",
                    closeAtendimento,
                    atendimento
                  );
                }}
              >
                ENCERRAR ATENDIMENTO
              </div>
            </div>
            <div id="em atendimento em outro serviço"
              className="card cor6hover"
              style={{
                display:
                  atendimentos.filter(
                    (item) =>
                      item.id_paciente == paciente.id_paciente &&
                      item.id_unidade != unidade &&
                      item.id_cliente != hospital &&
                      item.data_termino == null
                  ).length > 0
                    ? "flex"
                    : "none",
                flexDirection: "column",
                justifyContent: "center",
                height: "50vh",
                width: window.innerWidth < 426 ? "70vw" : "30vw",
                alignSelf: "center",
              }}
            >
              <div className="text1">
                {"PACIENTE COM ATENDIMENTO ATIVO EM OUTRO SERVIÇO"}
              </div>
              <div className="button" onClick={() => setviewseletorunidades(1)}>
                ALTERAR LEITO
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              ></div>
            </div>
          </div>
        </div>
        <ViewTipoDocumento></ViewTipoDocumento>
      </div>
    );
    // eslint-disable-next-line
  }, [paciente, hospital, unidades, unidade, atendimento, atendimentos, vieweditpaciente]);

  // atualizando um novo paciente.
  const updatePaciente = () => {
    var obj = {
      nome_paciente: document.getElementById("inputEditNomePaciente").value.toUpperCase(),
      nome_mae_paciente: document.getElementById("inputEditNomeMae").value.toUpperCase(),
      dn_paciente: moment(document.getElementById("inputEditDn").value, "DD/MM/YYYY"),
      antecedentes_pessoais: paciente.antecedentes_pessoais,
      medicacoes_previas: paciente.medicacoes_previas,
      exames_previos: paciente.exames_previos,
      exames_atuais: paciente.exames_atuais,
      tipo_documento: document.getElementById("inputEditTipoDocumento").value.toUpperCase(),
      numero_documento: document.getElementById("inputEditNumeroDocumento").value.toUpperCase(),
      endereco: document.getElementById("inputEditEndereco").value.toUpperCase(),
      telefone: document.getElementById("inputEditTelefone").value.toUpperCase(),
      email: document.getElementById("inputEditEmail").value,
    };
    axios
      .post(html + "update_paciente/" + paciente.id_paciente, obj)
      .then(() => {
        loadPacientes();
        toast(
          settoast,
          "PACIENTE ATUALIZADO COM SUCESSO NA BASE PULSAR",
          "rgb(82, 190, 128, 1)",
          3000
        );
      })
      .catch(function () {
        toast(
          settoast,
          "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
          "black",
          5000
        );
        setTimeout(() => {
          setpagina(0);
          history.push("/");
        }, 5000);
      });
  };

  const [viewseletorunidades, setviewseletorunidades] = useState(0);
  const [selectedunidade, setselectedunidade] = useState("");
  function SeletorDeUnidades() {
    return (
      <div>
        <div className="text1" style={{ marginTop: 50 }}>
          UNIDADES DE INTERNAÇÃO
        </div>
        <div
          id="unidades"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {unidades
            .filter((item) => item.id_cliente == hospital)
            .map((item) => (
              <div
                id={"unidade: " + item}
                className={
                  selectedunidade == item.id_unidade ? "button-red" : "button"
                }
                style={{
                  width: 150,
                  height: 150,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                onClick={() => {
                  console.log(item.id_unidade);
                  if (item.nome_unidade != 'TRIAGEM') {
                    setselectedunidade(item.id_unidade);
                    setunidade(item.id_unidade);
                    geraLeitos(item.total_leitos);
                    loadAtendimentos();
                    loadLeitos(item.id_unidade);
                  } else {
                    if (atendimentos.filter(valor => valor.id_paciente == paciente.id_paciente && valor.situacao == 1).length > 0) {
                      toast(settoast, 'PACIENTE JÁ ESTÁ EM ATENDIMENTO', 'red', 2000);
                    } else {
                      setselectedunidade(item.id_unidade);
                      setunidade(item.id_unidade);
                      var obj = {
                        data_inicio: moment(),
                        data_termino: null,
                        historia_atual: null,
                        id_paciente: paciente.id_paciente,
                        id_unidade: item.id_unidade,
                        nome_paciente: paciente.nome_paciente,
                        leito: null,
                        situacao: 1, // 1 = atendimento ativo; 0 = atendimento encerrado.
                        id_cliente: hospital,
                        classificacao: null,
                      };
                      console.log(obj);
                      axios
                        .post(html + "insert_atendimento", obj)
                        .then(() => {
                          loadAtendimentos();
                          loadLeitos();
                          setviewseletorunidades(0);
                        });
                    }
                  }
                }}
              >
                <div>{item.nome_unidade}</div>
                <div style={{
                  display: item.nome_unidade == 'TRIAGEM' ? 'none' : 'flex'
                }}>
                  {parseInt(item.total_leitos) -
                    parseInt(
                      atendimentos.filter(
                        (check) => check.id_unidade == item.id_unidade
                      ).length +
                      " / " +
                      item.total_leitos
                    )}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  const [statusleitos, setstatusleitos] = useState([]);
  const loadLeitos = (unidade) => {
    axios
      .get(html + "list_leitos/" + unidade)
      .then((response) => {
        setstatusleitos(response.data.rows);
      })
      .catch(function (error) {
        toast(
          settoast,
          "ERRO AO CARREGAR LEITOS, REINICIANDO APLICAÇÃO. " + error,
          "black",
          5000
        );
        setTimeout(() => {
          setpagina(0);
          history.push("/");
        }, 5000);
      });
  };

  const [arrayleitos, setarrayleitos] = useState([]);
  const geraLeitos = (leitos) => {
    let arrayleitos = [];
    let count = 0;
    while (count < leitos) {
      count = count + 1;
      arrayleitos.push(count);
      console.log(count);
    }
    setarrayleitos(arrayleitos);
  };

  function SeletorDeLeitos() {
    const insertLeito = (status) => {
      var obj = {
        id_unidade: unidade,
        leito: localStorage.getItem("leito"),
        status: status,
      };
      axios
        .post(html + "inserir_leito", obj)
        .then(() => {
          loadLeitos(unidade);
        })
        .catch(function () {
          toast(
            settoast,
            "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
            "black",
            5000
          );
          setTimeout(() => {
            setpagina(0);
            history.push("/");
          }, 5000);
        });
    };

    const updateLeito = (status) => {
      console.log(localStorage.getItem("leito"));
      var id = JSON.parse(localStorage.getItem("leito")).pop().id_leito;
      var leito = JSON.parse(localStorage.getItem("leito")).pop().leito;
      console.log(id + " - " + leito);
      var obj = {
        id_unidade: unidade,
        leito: leito,
        status: status,
      };
      console.log(obj);
      axios
        .post(html + "update_leito/" + id, obj)
        .then(() => {
          loadLeitos(unidade);
        })
        .catch(function () {
          toast(
            settoast,
            "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
            "black",
            5000
          );
          setTimeout(() => {
            setpagina(0);
            history.push("/");
          }, 5000);
        });
    };

    const [viewstatusleito, setviewstatusleito] = useState(0);
    function ViewStatusLeito() {
      let arraystatusleitos = [
        "LIVRE",
        "LIMPEZA",
        "MANUTENÇÃO",
        "DESATIVADO",
      ];
      return (
        <div
          className="fundo"
          style={{ display: viewstatusleito == 1 ? "flex" : "none" }}
          onClick={() => {
            setviewstatusleito(0);
          }}
        >
          <div className="janela" onClick={(e) => e.stopPropagation()}>
            {arraystatusleitos.map((item) => (
              <div
                className="button"
                style={{ width: 150 }}
                onClick={() => {
                  if (localStorage.getItem("leito").length < 4) {
                    console.log("INSERINDO STATUS PARA O LEITO...");
                    insertLeito(item);
                  } else {
                    console.log("ATUALIZANDO STATUS PARA O LEITO...");
                    updateLeito(item);
                  }
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <div className="text1">LEITOS</div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
            alignSelf: "center",
          }}
        >
          {arrayleitos.map((item) => (
            <div
              className="button"
              style={{
                position: "relative",
                width: 150,
                height: 150,
                display: "flex",
                flexDirection: "column",
                justifyItems: "center",
                maxWidth: 100,
                maxHeight: 100,
                opacity:
                  atendimentos.filter(
                    (valor) =>
                      valor.id_cliente == hospital &&
                      valor.id_unidade == selectedunidade &&
                      valor.data_termino == null &&
                      valor.leito == item
                  ).length > 0
                    ? 1
                    : 1,
              }}
              onMouseOver={() => {
                if (
                  statusleitos.filter((valor) => valor.leito == item).length > 0
                ) {
                  localStorage.setItem(
                    "leito",
                    JSON.stringify(
                      statusleitos.filter((valor) => valor.leito == item)
                    )
                  );
                  console.log(JSON.parse(localStorage.getItem("leito")));
                } else {
                  localStorage.setItem("leito", item);
                  console.log(JSON.parse(localStorage.getItem("leito")));
                }
              }}
              onClick={() => {
                if (
                  // o atendimento ativo para o leito selecionado é do paciente selecionado.
                  atendimentos.filter(
                    (valor) =>
                      valor.id_cliente == hospital &&
                      valor.id_unidade == selectedunidade &&
                      valor.id_paciente == paciente.id_paciente &&
                      valor.data_termino == null &&
                      valor.leito == item
                  ).length > 0
                ) {
                  console.log("NADA A FAZER. O PACIENTE JÁ ESTÁ NESTE LEITO");
                } else if (
                  // existe um atendimento alocado no leito selecionado, para outro paciente.
                  atendimentos.filter(
                    (valor) =>
                      valor.id_cliente == hospital &&
                      valor.id_unidade == selectedunidade &&
                      valor.id_paciente != paciente.id_paciente &&
                      valor.data_termino == null &&
                      valor.leito == item
                  ).length > 0
                ) {
                  console.log(
                    "NÃO É POSSÍVEL ALOCAR O PACIENTE NESTE LEITO, QUE JÁ ESTÁ OCUPADO POR OUTRO PACIENTE."
                  );
                  toast(settoast, "LEITO JÁ OCUPADO POR OUTRO PACIENTE.", 'red', 3000);
                } else if (
                  // não existe um atendimento alocado no leito selecionado.
                  atendimentos.filter(
                    (valor) =>
                      valor.id_cliente == hospital &&
                      valor.id_unidade == selectedunidade &&
                      valor.data_termino == null &&
                      valor.leito == item
                  ).length == 0 &&
                  // o paciente tem um atendimento ativo em outro leito.
                  atendimentos.filter(
                    (valor) =>
                      valor.id_paciente == paciente.id_paciente &&
                      valor.data_termino == null
                  ).length > 0
                ) {
                  updateAtendimento(item, atendimento);
                  // inserindo ou atualizando status do leito selecionado para ocupado.
                  if (localStorage.getItem("leito").length < 4) {
                    var obj = {
                      id_unidade: unidade,
                      leito: localStorage.getItem("leito"),
                      status: "OCUPADO",
                    };
                    axios
                      .post(html + "inserir_leito", obj)
                      .then(() => {
                        loadLeitos(unidade);
                      })
                      .catch(function () {
                        toast(
                          settoast,
                          "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
                          "black",
                          5000
                        );
                        setTimeout(() => {
                          setpagina(0);
                          history.push("/");
                        }, 5000);
                      });
                  } else {
                    var id = JSON.parse(localStorage.getItem("leito")).pop()
                      .id_leito;
                    var leito = JSON.parse(localStorage.getItem("leito")).pop()
                      .leito;
                    obj = {
                      id_unidade: unidade,
                      leito: leito,
                      status: "OCUPADO",
                    };
                    console.log(obj);
                    axios
                      .post(html + "update_leito/" + id, obj)
                      .then(() => {
                        loadLeitos(unidade);
                      })
                      .catch(function () {
                        toast(
                          settoast,
                          "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
                          "black",
                          5000
                        );
                        setTimeout(() => {
                          setpagina(0);
                          history.push("/");
                        }, 5000);
                      });
                  }
                } else if (
                  // não existe um atendimento alocado no leito selecionado.
                  atendimentos.filter(
                    (valor) =>
                      valor.id_cliente == hospital &&
                      valor.id_unidade == unidade &&
                      valor.data_termino == null &&
                      valor.leito == item
                  ).length == 0 &&
                  // o paciente não tem um atendimento ativo.
                  atendimentos.filter(
                    (valor) =>
                      valor.id_paciente == paciente.id_paciente &&
                      valor.data_termino == null
                  ).length == 0
                ) {
                  insertAtendimento(
                    paciente.id_paciente,
                    paciente.nome_paciente,
                    item
                  );
                  if (localStorage.getItem("leito").length < 4) {
                    obj = {
                      id_unidade: unidade,
                      leito: localStorage.getItem("leito"),
                      status: "OCUPADO",
                    };
                    axios
                      .post(html + "inserir_leito", obj)
                      .then(() => {
                        loadLeitos(unidade);
                      })
                      .catch(function () {
                        toast(
                          settoast,
                          "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
                          "black",
                          5000
                        );
                        setTimeout(() => {
                          setpagina(0);
                          history.push("/");
                        }, 5000);
                      });
                  } else {
                    id = JSON.parse(localStorage.getItem("leito")).pop()
                      .id_leito;
                    leito = JSON.parse(localStorage.getItem("leito")).pop()
                      .leito;
                    obj = {
                      id_unidade: unidade,
                      leito: leito,
                      status: "OCUPADO",
                    };
                    console.log(obj);
                    axios
                      .post(html + "update_leito/" + id, obj)
                      .then(() => {
                        loadLeitos(unidade);
                      })
                      .catch(function () {
                        toast(
                          settoast,
                          "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
                          "black",
                          5000
                        );
                        setTimeout(() => {
                          setpagina(0);
                          history.push("/");
                        }, 5000);
                      });
                  }
                } else {
                }
              }}
            >
              <div style={{ position: 'absolute', top: 2.5, left: 5, fontSize: 20, margin: 10 }}>{item}</div>
              <div
                style={{
                  display:
                    atendimentos.filter(
                      (valor) =>
                        valor.id_cliente == hospital &&
                        valor.id_unidade == unidade &&
                        valor.data_termino == null &&
                        valor.leito == item,
                    ).length > 0
                      ? "flex"
                      : "none",
                  fontSize: 12,
                  position: 'absolute',
                  top: 50,
                  padding: 5,
                  alignContent: 'center',
                  alignSelf: 'center',
                }}
              >
                {atendimentos
                  .filter(
                    (valor) =>
                      valor.id_cliente == hospital &&
                      valor.id_unidade == unidade &&
                      valor.data_termino == null &&
                      valor.leito == item
                  )
                  .map((valor) => valor.nome_paciente.substring(0, 20) + "...")}
              </div>
              <div
                className="button-yellow"
                style={{
                  height: 25,
                  width: 25,
                  minHeight: 25,
                  minWidth: 25,
                  borderRadius: 5,
                  position: "absolute",
                  top: 5,
                  right: 5,
                  fontSize: 12,
                  backgroundColor: statusleitos
                    .filter((valor) => valor.leito == item)
                    .map((valor) =>
                      valor.status == "LIVRE"
                        ? "green"
                        : valor.status == "OCUPADO"
                          ? "orange"
                          : valor.status == "MANUTENÇÃO"
                            ? "gray"
                            : valor.status == "DESATIVADO"
                              ? "red"
                              : valor.status == "LIMPEZA"
                                ? "blue"
                                : "rgb(0, 0, 0, 0.5)"
                    ),
                }}
                onClick={(e) => {
                  console.log(statusleitos.filter((valor) => valor.leito == item && valor.id_unidade == unidade).map((valor) => valor.status).pop());
                  if (statusleitos.filter((valor) => valor.leito == item && valor.id_unidade == unidade).map((valor) => valor.status).pop() == 'OCUPADO') {
                    toast(settoast, 'NÃO É POSSÍVEL ALTERAR O STATUS DE UM LEITO OCUPADO', 'rgb(231, 76, 60, 1', 3000);
                  } else {
                    setviewstatusleito(1);
                  }
                  e.stopPropagation();
                }}
              >
                {statusleitos
                  .filter((valor) => valor.leito == item)
                  .map((valor) =>
                    valor.status == "LIVRE"
                      ? "L"
                      : valor.status == "OCUPADO"
                        ? "O"
                        : valor.status == "MANUTENÇÃO"
                          ? "M"
                          : valor.status == "LIMPEZA"
                            ? "H"
                            : valor.status == "DESATIVADO"
                              ? "D"
                              : ""
                  )}
              </div>
            </div>
          ))}
        </div>
        <ViewStatusLeito></ViewStatusLeito>
      </div>
    );
  }

  function MovimentaPaciente() {
    return (
      <div
        className="fundo"
        style={{
          display: viewseletorunidades == 1 ? "flex" : "none",
        }}
      >
        <div
          className="janela scroll"
          style={{
            position: "relative",
            width: "90vw",
            height: "90vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <div
            className="text3"
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              margin: 5,
              padding: 5,
            }}
          >
            {paciente.nome_paciente +
              ", " +
              moment().diff(moment(paciente.dn_paciente), "years") +
              " ANOS."}
          </div>
          <div
            className="button-red"
            style={{ position: "absolute", top: 10, right: 10 }}
            onClick={() => {
              setviewseletorunidades(0);
            }}
          >
            <img
              alt=""
              src={back}
              style={{
                margin: 0,
                height: 30,
                width: 30,
              }}
            ></img>
          </div>
          <SeletorDeUnidades></SeletorDeUnidades>
          <SeletorDeLeitos></SeletorDeLeitos>
        </div>
      </div>
    );
  }

  return (
    <div className="main" style={{ display: pagina == 2 ? "flex" : "none" }}>
      <div
        className="scroll"
        id="cadastro de pacientes e de atendimentos"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "calc(100vw - 30px)",
          height: "calc(100vh - 30px)",
          // height: window.innerWidth < 426 ? '' : window.innerHeight,
        }}
      >
        <div
          id="botões e pesquisa"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignSelf: "center",
            marginTop: 10,
          }}
        >
          <div
            className="button-red"
            style={{ margin: 0, marginRight: 10, width: 50, height: 50 }}
            title={"VOLTAR PARA O LOGIN"}
            onClick={() => {
              setpagina(0);
              history.push("/");
            }}
          >
            <img
              alt=""
              src={back}
              style={{
                margin: 0,
                height: 30,
                width: 30,
              }}
            ></img>
          </div>
          <FilterPaciente></FilterPaciente>
          <div
            className="button-green"
            style={{ margin: 0, marginLeft: 10, width: 50, height: 50 }}
            title={"CADASTRAR PACIENTE"}
            onClick={() => setviewnewpaciente(1)}
          >
            <img
              alt=""
              src={novo}
              style={{
                margin: 0,
                height: 30,
                width: 30,
              }}
            ></img>
          </div>
        </div>
        <HeaderListaDePacientes></HeaderListaDePacientes>
        <ListaDePacientes></ListaDePacientes>
        <InsertPaciente></InsertPaciente>
        <DadosPacienteAtendimento></DadosPacienteAtendimento>
        <MovimentaPaciente></MovimentaPaciente>
      </div>
    </div>
  );
}

export default Cadastro;
