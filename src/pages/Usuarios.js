/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import Context from "./Context";
import moment from "moment";
import "moment/locale/pt-br";
// router.
import { useHistory } from "react-router-dom";
// funções.
import toast from "../functions/toast";
import checkinput from "../functions/checkinput";
import masknumbers from "../functions/masknumber";
import maskoptions from "../functions/maskoptions";
import maskdate from "../functions/maskdate";
import maskphone from "../functions/maskphone";

// imagens.
import deletar from "../images/deletar.svg";
import back from "../images/back.svg";
import novo from "../images/novo.svg";
import salvar from "../images/salvar.svg";
import editar from "../images/editar.svg";
import modal from "../functions/modal";

function Usuarios() {
  // context.
  const {
    html,
    pagina,
    setpagina,
    setusuario,
    settoast,
    setdialogo,
    hospital,
    unidades,
    usuario,
    arrayespecialidades,
  } = useContext(Context);

  // history (router).
  let history = useHistory();

  const refreshApp = () => {
    setusuario({
      id: 0,
      nome_usuario: "LOGOFF",
      dn_usuario: null,
      cpf_usuario: null,
      contato_usuario: null,
    });
    setpagina(0);
    history.push("/");
  };
  window.addEventListener("load", refreshApp);

  useEffect(() => {
    if (pagina == 5) {
      setselectedusuario(0);
      loadUsuarios();
    }
    // eslint-disable-next-line
  }, [pagina]);

  // ## USUÁRIOS ##
  // recuperando registros de usuários cadastrados na aplicação.
  const [usuarios, setusuarios] = useState([]);
  const [arrayusuarios, setarrayusuarios] = useState([]);
  const loadUsuarios = () => {
    axios
      .get(html + "list_usuarios")
      .then((response) => {
        setusuarios(response.data.rows);
        setarrayusuarios(response.data.rows);
      })
      .catch(function (error) {
        if (error.response == undefined) {
          toast(
            settoast,
            "ERRO AO CARREGAR USUÁRIOS, REINICIANDO APLICAÇÃO.",
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

  const [acessoprontuario, setacessoprontuario] = useState(0);
  const [acessofarmacia, setacessofarmacia] = useState(0);
  const [acessolaboratorio, setacessolaboratorio] = useState(0);
  const [acessofaturamento, setacessofaturamento] = useState(0);
  const [acessopaciente, setacessopaciente] = useState(0);
  const [acessousuarios, setacessousuarios] = useState(0);

  // registrando um usuário.
  const insertUsuario = () => {
    var obj = {
      nome_usuario: nomeusuario.toUpperCase(),
      dn_usuario: moment(
        dn,
        "DD/MM/YYYY"
      ),
      cpf_usuario: cpf,
      contato_usuario: contato.toUpperCase(),
      senha: cpf,
      login: cpf,
      conselho: conselho.toUpperCase(),
      n_conselho: n_conselho.toUpperCase(),
      tipo_usuario: especialidade,
    };
    if (usuarios.filter((item) => item.cpf_usuario == cpf).length < 1) {
      console.log(obj);
      axios
        .post(html + "inserir_usuario", obj)
        .then(() => {
          loadUsuarios();
          setselectedusuario(0);
          setviewnewusuario(0);
          toast(
            settoast,
            "USUÁRIO CADASTRADO COM SUCESSO NA BASE PULSAR",
            "rgb(82, 190, 128, 1)",
            1500
          );
        })
        .catch(function () {
          toast(
            settoast,
            "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
            "black",
            3000
          );
          setTimeout(() => {
            setpagina(0);
            history.push("/");
          }, 5000);
        });
    } else {
      toast(
        settoast,
        "USUÁRIO JÁ CADASTRADO NA BASE PULSAR",
        "rgb(231, 76, 60, 1)",
        3000
      );
    }
  };

  // atualizando um usuário.
  const updateUsuario = () => {
    var obj = {
      nome_usuario: document.getElementById("inputNome").value.toUpperCase(),
      dn_usuario: moment(
        document.getElementById("inputDn").value,
        "DD/MM/YYYY"
      ),
      cpf_usuario: document.getElementById("inputCpf").value,
      contato_usuario: document.getElementById("inputContato").value,
      senha: selectedusuario.senha,
      login: selectedusuario.login,
      conselho: document.getElementById("inputConselho").value.toUpperCase(),
      n_conselho: document.getElementById("inputNumeroConselho").value,
      tipo_usuario: especialidade,
      paciente: acessopaciente,
      prontuario: acessoprontuario,
      laboratorio: acessolaboratorio,
      farmacia: acessofarmacia,
      faturamento: acessofaturamento,
      usuarios: acessousuarios,
    };
    console.log(obj);
    console.log(selectedusuario.id_usuario);
    axios
      .post(html + "update_usuario/" + selectedusuario.id_usuario, obj)
      .then(() => {
        loadUsuarios();
        setselectedusuario(0);
        setviewnewusuario(0);
        toast(
          settoast,
          "USUÁRIO ATUALIZADO COM SUCESSO NA BASE PULSAR",
          "rgb(82, 190, 128, 1)",
          1500
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
        }, 3000);
      });
  };

  const updateAcessoModulos = () => {
    var obj = {
      nome_usuario: selectedusuario.nome_usuario,
      dn_usuario: selectedusuario.dn_usuario,
      cpf_usuario: selectedusuario.cpf_usuario,
      contato_usuario: selectedusuario.contato_usuario,
      senha: selectedusuario.senha,
      login: selectedusuario.login,
      conselho: selectedusuario.conselho,
      n_conselho: selectedusuario.n_conselho,
      tipo_usuario: especialidade,
      paciente: acessopaciente,
      prontuario: acessoprontuario,
      laboratorio: acessolaboratorio,
      farmacia: acessofarmacia,
      faturamento: acessofaturamento,
      usuarios: acessousuarios,
    };
    console.log(obj);
    console.log(selectedusuario.id_usuario);
    axios
      .post(html + "update_usuario/" + selectedusuario.id_usuario, obj)
      .then(() => {
        loadUsuarios();
        setviewnewusuario(0);
        toast(
          settoast,
          "USUÁRIO ATUALIZADO COM SUCESSO NA BASE PULSAR",
          "rgb(82, 190, 128, 1)",
          1500
        );
      })
      .catch(function () {
        toast(
          settoast,
          "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
          "black",
          3000
        );
        setTimeout(() => {
          setpagina(0);
          history.push("/");
        }, 5000);
      });
  };

  // excluir um usuário.
  const deleteUsuario = (usuario) => {
    // excluir somente usuários sem cadastro em outras unidades.
    if (todosacessos.filter((item) => item.id_usuario == usuario).length > 1) {
      toast(
        settoast,
        "EXCLUSÃO NEGADA, PACIENTE VINCULADO A OUTRAS UNIDADES DE ATENDIMENTO",
        "rgb(231, 76, 60, 1)",
        3000
      );
    } else {
      axios
        .get(html + "delete_usuario/" + usuario)
        .then(() => {
          loadUsuarios();
          toast(
            settoast,
            "USUÁRIO EXCLUÍDO COM SUCESSO DA BASE PULSAR",
            "rgb(82, 190, 128, 1)",
            1500
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
          }, 3000);
        });
    }
  };

  // componente para inserir novo usuário.
  const [viewnewusuario, setviewnewusuario] = useState(0);
  const [selectedusuario, setselectedusuario] = useState(0);
  const [especialidade, setespecialidade] = useState(selectedusuario.tipo_usuario);
  const [nomeusuario, setnomeusuario] = useState(null);
  const [dn, setdn] = useState(null);
  const [contato, setcontato] = useState(null);
  const [cpf, setcpf] = useState(null);
  const [conselho, setconselho] = useState(null);
  const [n_conselho, setn_conselho] = useState(null);

  function InsertUsuario() {
    var timeout = null;
    return (
      <div
        className="fundo"
        style={{
          display: viewnewusuario == 1 || viewnewusuario == 2 ? "flex" : "none",
          flexDirection: "column",
          justifyContent: "center",
        }}
        onClick={() => setviewnewusuario(0)}
      >
        <div
          className="janela scroll"
          style={{ padding: 10 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            id="cadastrar usuario"
            style={{
              display: 'flex',
              flexDirection: "row",
              flexWrap: 'wrap',
              justifyContent: 'space-evenly',
              marginRight: 10,
              alignItems: "center",
              alignContent: 'center',
            }}
          >
            <div id='coluna1' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
              <div id="nome do usuário"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: 'center',
                }}
              >
                <div className="text1">NOME DO USUÁRIO</div>
                <input
                  autoComplete="off"
                  placeholder="NOME DO USUÁRIO"
                  className="input"
                  type="text"
                  id="inputNome"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "NOME DO USUÁRIO")}
                  defaultValue={
                    nomeusuario
                  }
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: 300,
                  }}
                ></input>
              </div>
              <div id="dn usuário"
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
                  className="input"
                  type="text"
                  id="inputDn"
                  inputMode="numeric"
                  onClick={() => (document.getElementById("inputDn").value = "")}
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "DN")}
                  onKeyUp={() => {
                    maskdate(timeout, "inputDn");
                  }}
                  defaultValue={
                    moment(dn).format('DD/MM/YYYY')
                  }
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: 100,
                  }}
                ></input>
              </div>
              <div id="contato"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">CONTATO</div>
                <input
                  autoComplete="off"
                  placeholder="CONTATO"
                  className="input"
                  type="text"
                  id="inputContato"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "CONTATO")}
                  defaultValue={contato}
                  onKeyUp={() => {
                    maskphone(timeout, "inputContato");
                  }}
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: 200,
                  }}
                ></input>
              </div>
              <div id="cpf do usuário"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">CPF DO USUÁRIO</div>
                <input
                  autoComplete="off"
                  placeholder="CPF DO USUÁRIO"
                  className="input"
                  type="text"
                  id="inputCpf"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "CPF DO USUÁRIO")}
                  onKeyUp={() => {
                    masknumbers(timeout, "inputCpf", 13);
                  }}
                  defaultValue={
                    cpf
                  }
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: 200,
                  }}
                ></input>
              </div>
            </div>
            <div id="coluna 02" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
              <div className="text1">CONSELHO PROFISSIONAL</div>
              <input
                autoComplete="off"
                placeholder="CONSELHO"
                className="input"
                type="text"
                id="inputConselho"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "CONSELHO")}
                onKeyUp={() => {
                  maskoptions(timeout, "inputConselho", 10, [
                    "CRM",
                    "CRO",
                    "CRESS",
                    "CRF",
                    "CREFONO",
                    "COREN",
                    "CREFITO",
                  ]);
                }}
                defaultValue={conselho}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: "30vw",
                }}
              ></input>
              <div className="text1">NÚMERO DO CONSELHO PROFISSIONAL</div>
              <input
                autoComplete="off"
                placeholder="NÚMERO DO CONSELHO"
                className="input"
                type="text"
                id="inputNumeroConselho"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "NÚMERO DO CONSELHO")}
                defaultValue={n_conselho}
                onKeyUp={() => {
                  masknumbers(timeout, "inputNumeroConselho", 8);
                }}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: "30vw",
                }}
              ></input>
              <div className="text1">ESPECIALIDADE MÉDICA</div>
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '50vw' }}>
                {arrayespecialidades.map(item => (
                  <div
                    onClick={() => {
                      setnomeusuario(document.getElementById('inputNome').value.toUpperCase());
                      setdn(moment(document.getElementById('inputDn').value, 'DD/MM/YYYY'));
                      setcontato(document.getElementById('inputContato').value);
                      setcpf(document.getElementById('inputCpf').value);
                      setconselho(document.getElementById('inputConselho').value.toUpperCase());
                      setn_conselho(document.getElementById('inputNumeroConselho').value);
                      setespecialidade(item);
                    }}
                    className={especialidade == item ? "button-red" : "button"}
                    style={{ width: 150 }}>
                    {item}
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <div
                  className="button-red"
                  onClick={(e) => {
                    setviewnewusuario(0);
                    e.stopPropagation();
                  }}
                >
                  <img
                    alt=""
                    src={back}
                    style={{
                      margin: 10,
                      height: 25,
                      width: 25,
                    }}
                  ></img>
                </div>
                <div
                  className="button-green"
                  id="btnusuario"
                  onClick={() => {
                    if (viewnewusuario == 1) {
                      checkinput(
                        "input",
                        settoast,
                        ["inputNome", "inputDn", "inputContato", "inputCpf"],
                        "btnusuario",
                        insertUsuario,
                        []
                      );
                    } else {
                      checkinput(
                        "input",
                        settoast,
                        ["inputNome", "inputDn", "inputContato", "inputCpf"],
                        "btnusuario",
                        updateUsuario,
                        []
                      );
                    }
                  }}
                >
                  <img
                    alt=""
                    src={salvar}
                    style={{
                      margin: 10,
                      height: 25,
                      width: 25,
                    }}
                  ></img>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    // eslint-disable-next-line
  };

  const [filterusuario, setfilterusuario] = useState("");
  var timeout = null;
  var searchusuario = "";
  const filterUsuario = () => {
    clearTimeout(timeout);
    document.getElementById("inputUsuario").focus();
    searchusuario = document.getElementById("inputUsuario").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchusuario == "") {
        setfilterusuario("");
        setarrayusuarios(usuarios);
        document.getElementById("inputUsuario").value = "";
        setTimeout(() => {
          document.getElementById("inputUsuario").focus();
        }, 100);
      } else {
        setfilterusuario(
          document.getElementById("inputUsuario").value.toUpperCase()
        );
        setarrayusuarios(
          usuarios.filter((item) => item.nome_usuario.includes(searchusuario))
        );
        document.getElementById("inputUsuario").value = searchusuario;
        setTimeout(() => {
          document.getElementById("inputUsuario").focus();
        }, 100);
      }
    }, 1000);
  };

  // filtro de usuário por nome.
  function FilterUsuario() {
    return (
      <input
        className="input cor2"
        autoComplete="off"
        placeholder="BUSCAR USUÁRIO..."
        onFocus={(e) => (e.target.placeholder = "")}
        onBlur={(e) => (e.target.placeholder = "BUSCAR USUÁRIO...")}
        onKeyUp={() => filterUsuario()}
        type="text"
        id="inputUsuario"
        defaultValue={filterusuario}
        maxLength={100}
        style={{ margin: 0, width: "100%" }}
      ></input>
    );
  }

  const ListaDeUsuarios = useCallback(() => {
    return (
      <div
        className="scroll"
        id="scroll usuários"
        style={{
          width: 400,
          maxWidth: 400,
          height: "calc(100vh - 80px)",
          marginTop: 10,
        }}
      >
        {arrayusuarios
          .sort((a, b) => (a.nome_usuario > b.nome_usuario ? 1 : -1))
          .map((item) => (
            <div
              key={"usuarios " + Math.random()}
              style={{
                display: arrayusuarios.length > 0 ? "flex" : "none",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                className="button"
                id={"usuario " + item.id_usuario}
                onClick={() => {
                  localStorage.setItem("selecteduser", JSON.stringify(item));
                  setselectedusuario(item);
                  setnomeusuario(item.nome_usuario);
                  setdn(item.dn_usuario);
                  setcpf(item.cpf_usuario);
                  setcontato(item.contato_usuario);
                  setconselho(item.conselho);
                  setn_conselho(item.n_conselho);
                  setespecialidade(item.tipo_usuario);
                  // acessos.
                  setacessofarmacia(item.farmacia);
                  setacessofaturamento(item.faturamento);
                  setacessolaboratorio(item.laboratorio);
                  setacessopaciente(item.paciente);
                  setacessoprontuario(item.prontuario);
                  setacessousuarios(item.usuarios);
                  loadTodosAcessos(item.id_usuario);
                  setTimeout(() => {
                    var botoes = document
                      .getElementById("scroll usuários")
                      .getElementsByClassName("button-red");
                    for (var i = 0; i < botoes.length; i++) {
                      botoes.item(i).className = "button";
                    }
                    document.getElementById(
                      "usuario " + item.id_usuario
                    ).className = "button-red";
                  }, 300);
                }}
                style={{
                  flex: 2,
                  justifyContent: "space-between",
                  paddingLeft: 10,
                }}
              >
                {item.nome_usuario}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <div
                    id="btn-edit"
                    className="button-yellow"
                    style={{
                      width: 25,
                      minWidth: 25,
                      height: 25,
                      minHeight: 25,
                    }}
                    onClick={() => {
                      setselectedusuario(item);
                      setviewnewusuario(2);
                    }}
                  >
                    <img
                      alt=""
                      src={editar}
                      style={{
                        margin: 10,
                        height: 25,
                        width: 25,
                      }}
                    ></img>
                  </div>
                  <div
                    id="btn-delete"
                    className="button-red"
                    style={{
                      display: item.id_usuario == usuario.id ? "none" : "flex",
                      width: 25,
                      minWidth: 25,
                      height: 25,
                      minHeight: 25,
                      backgroundColor: "rgb(231, 76, 60, 1)",
                    }}
                    onClick={() => {
                      modal(
                        setdialogo,
                        "EXCLUIR O USUÁRIO " + item.nome_usuario + "?",
                        deleteUsuario,
                        [item.id_usuario]
                      );
                    }}
                  >
                    <img
                      alt=""
                      src={deletar}
                      style={{
                        margin: 10,
                        height: 25,
                        width: 25,
                      }}
                    ></img>
                  </div>
                </div>
              </div>
            </div>
          ))}
        <div
          className="text1"
          style={{
            display: arrayusuarios.length == 0 ? "flex" : "none",
            width: "90vw",
            opacity: 0.5,
          }}
        >
          SEM USUÁRIOS CADASTRADOS NA APLICAÇÃO
        </div>
      </div>
    );
    // eslint-disable-next-line
  }, [usuarios, arrayusuarios]);

  // ## ACESSOS ##
  // recuperando registros de acessos cadastrados na aplicação, para a unidade logada.
  const [arrayacessos, setarrayacessos] = useState([]);

  // recuperando todos os acessos da base (necessário para gerenciar a exclusão segura de usuários).
  const [todosacessos, settodosacessos] = useState([]);
  const loadTodosAcessos = (id_usuario) => {
    axios
      .get(html + "list_todos_acessos")
      .then((response) => {
        let x = [0, 1];
        x = response.data.rows;
        settodosacessos(x);
        setarrayacessos(x.filter((valor) => valor.id_usuario == id_usuario));
        console.log(id_usuario);
        document.getElementById("usuario " + id_usuario).className =
          "button-red";
      })
      .catch(function () {
        toast(
          settoast,
          "ERRO AO CARREGAR TODOS OS ACESSOS, REINICIANDO APLICAÇÃO.",
          "black",
          5000
        );
        setTimeout(() => {
          setpagina(0);
          history.push("/");
        }, 5000);
      });
  };

  // registrando um acesso.
  const insertAcesso = (unidade, id_usuario) => {
    var obj = {
      id_cliente: hospital,
      id_unidade: unidade,
      id_usuario: selectedusuario.id_usuario,
      boss: null,
    };
    axios
      .post(html + "insert_acesso", obj)
      .then(() => {
        loadTodosAcessos(id_usuario);
        setviewnewacesso(0);
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

  // excluindo um acesso.
  const deleteAcesso = (id, id_usuario) => {
    axios
      .get(html + "delete_acesso/" + id)
      .then(() => {
        loadTodosAcessos(id_usuario);
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

  function AcessosEModulos() {
    return (
      <div
        className="scroll"
        id="scroll acessos e módulos"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          width: "calc(100vw - 460px)",
          height: "calc(100vh - 30px)",
          overflowY: "scroll",
          marginLeft: 10,
        }}
      >
        <ListaDeUnidades></ListaDeUnidades>
        <ListaDeModulos></ListaDeModulos>
      </div>
    );
  }

  const [viewunidades, setviewunidades] = useState(0);
  function ListaDeUnidades() {
    return (
      <div
        style={{
          display: selectedusuario.prontuario == 1 || viewunidades == 1 ? "flex" : "none",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          alignSelf: "center",
          alignItems: "center",
        }}
      >
        <div
          id="usuário com acesso"
          className="text3"
          style={{
            display: arrayacessos.length > 0 ? "flex" : "none",
            justifyContent: "center",
            margin: 5,
            padding: 5,
          }}
        >
          <div style={{ display: 'flex', marginBottom: 10 }}>UNIDADES DE ATENDIMENTO LIBERADAS:</div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {arrayacessos.map((item) =>
              unidades
                .filter((valor) => valor.id_unidade == item.id_unidade)
                .map((max) => (
                  <div className="button" style={{ position: "relative" }}>
                    <div className="text2" style={{ width: 150, height: 150 }}>
                      {max.nome_unidade}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        width: 30, minWidth: 30,
                        height: 30, minHeight: 30,
                      }}
                      className="button-yellow"
                      onClick={() =>
                        deleteAcesso(
                          item.id_acesso,
                          JSON.parse(
                            window.localStorage.getItem("selecteduser")
                          ).id_usuario
                        )
                      }
                    >
                      <img
                        alt=""
                        src={deletar}
                        style={{
                          margin: 10,
                          height: 25,
                          width: 25,
                        }}
                      ></img>
                    </div>
                  </div>
                ))
            )}
          </div>
          <div
            className="button-green"
            style={{
              display: todosacessos.filter(valor => valor.id_usuario == selectedusuario.id_usuario).length == unidades.length ? 'none' : 'flex',
              marginTop: 10,
            }}
            onClick={() => {
              setviewnewacesso(1);
            }}
          >
            <img
              alt=""
              src={novo}
              style={{
                margin: 10,
                height: 25,
                width: 25,
              }}
            ></img>
          </div>
        </div>
        <div
          id="usuário sem acesso"
          className="text3"
          style={{
            display: arrayacessos.length == 0 ? "flex" : "none",
            justifyContent: "center",
          }}
        >
          {"USUÁRIO SEM ACESSO ÀS UNIDADES DE ATENDIMENTO."}
          <div
            className="button-green"
            style={{
              marginTop: 10,
            }}
            onClick={() => {
              setviewnewacesso(1);
            }}
          >
            <img
              alt=""
              src={novo}
              style={{
                margin: 10,
                height: 25,
                width: 25,
              }}
            ></img>
          </div>
        </div>
        <div
          id="usuário não selecionado"
          className="text3"
          style={{
            display: selectedusuario == 0 ? "flex" : "none",
            flexDirection: "column",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          {"SELECIONE UM USUÁRIO"}
        </div>
      </div>
    );
  }

  const mudaModulo = (acesso, setacesso) => {
    if (acesso == 1) {
      setacesso(0);
      setTimeout(() => {
        document.getElementById(
          "usuario " + selectedusuario.id_usuario
        ).className = "button-red";
      }, 100);
    } else {
      setacesso(1);
      setTimeout(() => {
        document.getElementById(
          "usuario " + selectedusuario.id_usuario
        ).className = "button-red";
      }, 100);
    }
  };
  function ListaDeModulos() {
    return (
      <div
        style={{
          display: selectedusuario == 0 ? "none" : "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          alignSelf: "center",
          alignItems: "center",
        }}
      >
        <div className="text3" style={{ margin: 5, padding: 5 }}>
          MÓDULOS DO SISTEMA LIBERADOS:
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            className={acessoprontuario == 1 ? "button-red" : "button"}
            style={{ width: 150, height: 150 }}
            onClick={() => {
              mudaModulo(acessoprontuario, setacessoprontuario);
              if (viewunidades == 1 && arrayacessos.length == 0) {
                setviewunidades(0);
              } else {
                setviewunidades(1);
                setacessoprontuario(1);
              }
            }}
          >
            PRONTUÁRIO
          </div>
          <div
            className={acessofarmacia == 1 ? "button-red" : "button"}
            style={{ width: 150, height: 150 }}
            onClick={() => mudaModulo(acessofarmacia, setacessofarmacia)}
          >
            FARMÁCIA
          </div>
          <div
            className={acessolaboratorio == 1 ? "button-red" : "button"}
            style={{ width: 150, height: 150 }}
            onClick={() => mudaModulo(acessolaboratorio, setacessolaboratorio)}
          >
            LABORATÓRIO
          </div>
          <div
            className={acessofaturamento == 1 ? "button-red" : "button"}
            style={{ width: 150, height: 150 }}
            onClick={() => mudaModulo(acessofaturamento, setacessofaturamento)}
          >
            FATURAMENTO
          </div>
          <div
            className={acessopaciente == 1 ? "button-red" : "button"}
            style={{ width: 150, height: 150 }}
            onClick={() => mudaModulo(acessopaciente, setacessopaciente)}
          >
            GESTÃO DE PACIENTES E LEITOS
          </div>
          <div
            className={acessousuarios == 1 ? "button-red" : "button"}
            style={{ width: 150, height: 150 }}
            onClick={() => mudaModulo(acessousuarios, setacessousuarios)}
          >
            GESTÃO DE USUÁRIOS
          </div>
        </div>
        <div
          className="button-green"
          style={{ margin: 5, marginTop: 10, pading: 5, width: 50, height: 50 }}
          onClick={() => { updateAcessoModulos(); setselectedusuario(0); setviewunidades(0); }}
        >
          <img
            alt=""
            src={salvar}
            style={{
              margin: 0,
              height: 30,
              width: 30,
            }}
          ></img>
        </div>
      </div>
    );
  }

  // componente para inserir novo acesso.
  const [viewnewacesso, setviewnewacesso] = useState(0);
  function InsertAcesso() {
    return (
      <div
        className="fundo"
        style={{ display: viewnewacesso == 1 ? "flex" : "none" }}
        onClick={() => setviewnewacesso(0)}
      >
        <div className="janela" onClick={(e) => e.stopPropagation()}>
          <div
            id="cadastrar acesso"
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {unidades.map((item) => (
              <div
                className="button"
                style={{
                  display: todosacessos.filter(valor => valor.id_usuario == selectedusuario.id_usuario && valor.id_unidade == item.id_unidade).length > 0 ? 'none' : 'flex',
                  width: 100, height: 100
                }}
                onClick={() => {
                  console.log(
                    JSON.parse(window.localStorage.getItem("selecteduser"))
                      .id_usuario
                  );
                  insertAcesso(
                    item.id_unidade,
                    JSON.parse(window.localStorage.getItem("selecteduser"))
                      .id_usuario
                  );
                }}
              >
                {item.nome_unidade}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main" style={{ display: pagina == 5 ? "flex" : "none" }}>
      <div
        id="cadastro de usuários e de acessos"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          height: window.innerHeight - 20,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            id="botões e pesquisa"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignSelf: "center",
              width: "100%",
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
            <FilterUsuario></FilterUsuario>
            <div
              className="button-green"
              style={{ margin: 0, marginLeft: 10, width: 50, height: 50 }}
              title={"CADASTRAR USUÁRIO"}
              onClick={() => {
                setselectedusuario(0);
                setnomeusuario(null);
                setdn(null);
                setcontato(null);
                setcpf(null);
                setconselho(null);
                setn_conselho(null);
                setespecialidade(null);
                setviewnewusuario(1);
              }}
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
          <ListaDeUsuarios></ListaDeUsuarios>
        </div>
        <AcessosEModulos></AcessosEModulos>
        <InsertUsuario></InsertUsuario>
        <InsertAcesso></InsertAcesso>
      </div>
    </div>
  );
}

export default Usuarios;
