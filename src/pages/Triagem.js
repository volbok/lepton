/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useCallback, useState } from "react";
import axios from "axios";
import Context from "./Context";
import moment from "moment";
// imagens.
import power from "../images/power.svg";
import call from "../images/call.svg";
import people from "../images/people.svg";
// funções.
import toast from "../functions/toast";
// router.
import { useHistory } from "react-router-dom";

function Triagem() {
  // context.
  const {
    html,
    altura,
    hospital,
    unidade,
    unidades,
    setusuario,
    settoast,
    pagina,
    setpagina,
    pacientes,
    setpacientes,
    setpaciente,
    atendimentos,
    setatendimentos,
    setatendimento,
    atendimento,
    salatriagem, setsalatriagem,
    mobilewidth,
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

  // carregar lista de pacientes.
  const loadPacientes = () => {
    axios
      .get(html + "list_pacientes")
      .then((response) => {
        setpacientes(response.data.rows);
        loadAtendimentos();
        console.log("LISTA DE PACIENTES CARREGADA.");
      })
      .catch(function (error) {
        if (error.response == undefined) {
          toast(
            settoast,
            "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
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

  // carregar lista de atendimentos ativos para a unidade selecionada.
  const [arrayatendimentos, setarrayatendimentos] = useState([]);
  const loadAtendimentos = () => {
    axios
      .get(html + "list_atendimentos/" + unidade)
      .then((response) => {
        setatendimentos(response.data.rows);
        setarrayatendimentos(response.data.rows);

      })
      .catch(function (error) {
        if (error.response == undefined) {
          toast(
            settoast,
            "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
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

  var timeout = null;
  useEffect(() => {
    if (pagina == 30) {
      setpaciente([]);
      setatendimento(null);
      setsalatriagem(null);
      loadPacientes();
      loadChamadas();
    }
    // eslint-disable-next-line
  }, [pagina]);

  // identificação do usuário.
  function Usuario() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginBottom: 10,
        }}
      >
        <div
          className="button-red"
          style={{ margin: 0, marginRight: 10 }}
          // title={'USUÁRIO: ' + usuario.nome_usuario.split(' ', 1)}
          onClick={() => {
            setpagina(0);
            history.push("/");
          }}
        >
          <img
            alt=""
            src={power}
            style={{
              margin: 0,
              height: 30,
              width: 30,
            }}
          ></img>
        </div>
        <FilterPaciente></FilterPaciente>
        <div
          className="button"
          style={{ margin: 0, marginLeft: 10 }}
          title={"PACIENTES"}
          onClick={() => {
            history.push("/cadastro");
            setpagina(2);
          }}
        >
          <img
            alt=""
            src={people}
            style={{
              margin: 0,
              height: 35,
              width: 35,
            }}
          ></img>
        </div>
      </div>
    );
  }

  const [filterpaciente, setfilterpaciente] = useState("");
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
        setarrayatendimentos(atendimentos);
        document.getElementById("inputPaciente").value = "";
        setTimeout(() => {
          document.getElementById("inputPaciente").focus();
        }, 100);
      } else {
        setfilterpaciente(
          document.getElementById("inputPaciente").value.toUpperCase()
        );
        setarrayatendimentos(
          atendimentos.filter((item) =>
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
        className="input cor2"
        autoComplete="off"
        placeholder={
          window.inenrWidth < mobilewidth ? "BUSCAR PACIENTE..." : "BUSCAR..."
        }
        onFocus={(e) => (e.target.placeholder = "")}
        onBlur={(e) =>
          window.inenrWidth < mobilewidth
            ? (e.target.placeholder = "BUSCAR PACIENTE...")
            : "BUSCAR..."
        }
        onKeyUp={() => filterPaciente()}
        type="text"
        id="inputPaciente"
        defaultValue={filterpaciente}
        maxLength={100}
        style={{ margin: 0, width: "100%" }}
      ></input>
    );
  }

  // função para permitir apenas a inserção de números no input (obedecendo a valores de referência).
  const checkNumberInput = (input, min, max) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      var valor = document.getElementById(input).value;
      if (isNaN(valor) == true || valor < min || valor > max) {
        // document.getElementById(input).style.backgroundColor = 'rgb(231, 76, 60, 0.3)';
        document.getElementById(input).value = '';
        document.getElementById(input).focus();
      } else {
        classificaAutomatico();
      }
    }, 1000);
  }

  const classificaAutomatico = () => {
    if (document.getElementById("inputPas").value != '' && (document.getElementById("inputPas").value < 80 || document.getElementById("inputPas").value > 230)) {
      classificaAtendimento(atendimento, 'VERMELHO')
    } else if (document.getElementById("inputFc").value != '' && (document.getElementById("inputFc").value < 60 || document.getElementById("inputFc").value > 220)) {
      classificaAtendimento(atendimento, 'VERMELHO')
    } else if (document.getElementById("inputFr").value != '' && (document.getElementById("inputFr").value < 10 || document.getElementById("inputFr").value > 30)) {
      classificaAtendimento(atendimento, 'VERMELHO')
    } else if (document.getElementById("inputSao2").value != '' && document.getElementById("inputSao2").value < 85) {
      classificaAtendimento(atendimento, 'VERMELHO')
    } else if (document.getElementById("inputGlicemia").value != '' && document.getElementById("inputGlicemia").value < 60) {
      classificaAtendimento(atendimento, 'VERMELHO')
    } else if (document.getElementById("inputGlasgow").value != '' && document.getElementById("inputGlasgow").value < 10) {
      classificaAtendimento(atendimento, 'VERMELHO')
    } else if (document.getElementById("inputPas").value != '' && document.getElementById("inputPas").value > 180 && document.getElementById("inputPas").value < 231) {
      classificaAtendimento(atendimento, 'LARANJA')
    } else if (document.getElementById("inputFc").value != '' && document.getElementById("inputFc").value > 150 && document.getElementById("inputFc").value < 221) {
      classificaAtendimento(atendimento, 'LARANJA')
    } else if (document.getElementById("inputFr").value != '' && document.getElementById("inputFr").value > 25) {
      classificaAtendimento(atendimento, 'LARANJA')
    } else if (document.getElementById("inputSao2").value != '' && document.getElementById("inputSao2").value < 91 && document.getElementById("inputSao2").value > 84) {
      classificaAtendimento(atendimento, 'LARANJA')
    } else if (document.getElementById("inputGlicemia").value != '' && document.getElementById("inputGlicemia").value > 350) {
      classificaAtendimento(atendimento, 'LARANJA')
    } else if (document.getElementById("inputGlasgow").value != '' && document.getElementById("inputGlasgow").value < 14 && document.getElementById("inputGlasgow").value > 9) {
      classificaAtendimento(atendimento, 'LARANJA')
    } else {
      classificaAtendimento(atendimento, null);
    }
  }

  const [classificacao, setclassificacao] = useState(null);
  const classificaAtendimento = (item, classificacao) => {
    console.log(item.id_atendimento);
    var obj = {
      data_inicio: item.data_inicio,
      data_termino: null,
      problemas: item.problemas,
      id_paciente: item.id_paciente,
      id_unidade: item.id_unidade,
      nome_paciente: item.nome_paciente,
      leito: null,
      situacao: 0,
      id_cliente: item.id_cliente,
      classificacao: classificacao
    };
    console.log(obj);
    axios.post(html + "update_atendimento/" + item.id_atendimento, obj).then(() => {
      console.log('ATENDIMENTO CLASSIFICADO COM SUCESSO');
      setclassificacao(classificacao);
    });
  }

  const arrayclassificacao = ['AZUL', 'VERDE', 'AMARELO', 'LARANJA', 'VERMELHO'];
  function BotoesClassificacao() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="text1">OU SELECIONE MANUALMENTE A CLASSIFICAÇÃO</div>
        <div id="classificação" style={{
          display: 'flex', flexDirection: 'row',
          justifyContent: 'center',
          flexWrap: 'wrap', alignSelf: 'center', width: '100%',
        }}>
          {arrayclassificacao.map((item) => (
            <div
              id={"clasifica " + item}
              className="button-classifica-fade"
              onClick={() => {
                classificaAtendimento(atendimento, item)
                setTimeout(() => {
                  var botoes = document
                    .getElementById("classificação")
                    .getElementsByClassName("button-classifica-selected");
                  for (var i = 0; i < botoes.length; i++) {
                    botoes.item(i).className = "button-classifica-fade";
                  }
                  document.getElementById("clasifica " + item).className = "button-classifica-selected";
                }, 1000);
              }}
              style={{
                backgroundColor:
                  item == 'AZUL' ? 'blue' :
                    item == 'VERDE' ? 'green' :
                      item == 'AMARELO' ? 'yellow' :
                        item == 'LARANJA' ? 'orange' :
                          item == 'VERMELHO' ? 'red' : ''
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const updateAtendimento = (item, classificacao) => {
    var obj = {
      data_inicio: atendimento.data_inicio,
      data_termino: null,
      problemas: atendimento.problemas,
      id_paciente: parseInt(atendimento.id_paciente),
      id_unidade: item,
      nome_paciente: atendimento.nome_paciente,
      leito: 'F',
      situacao: 1,
      id_cliente: hospital,
      classificacao: classificacao,
    };
    console.log(obj);
    axios.post(html + "update_atendimento/" + atendimento.id_atendimento, obj).then(() => {
      toast(settoast, 'PACIENTE ENCAMINHADO COM SUCESSO', 'green', 3000);
      loadAtendimentos();
      setatendimento(null);
    });
  };

  function ClassificacaoAtual() {
    return (
      <div
        style={{
          display: classificacao != null ? 'flex' : 'none',
          flexDirection: 'column', justifyContent: 'center'
        }}
      >
        <div className="text1">CLASSIFICAÇÃO INDICADA</div>
        <div className="button"
          style={{
            backgroundColor:
              classificacao == 'AZUL' ? 'blue' : classificacao == 'VERDE' ? 'green' : classificacao == 'AMARELO' ? 'yellow' : classificacao == 'LARANJA' ? 'orange' : classificacao == 'VERMELHO' ? 'red' : 'grey',
            padding: 10, paddingLeft: 20, paddingRight: 20,
            width: 100,
            alignSelf: 'center',
          }}
        >
          {classificacao}
        </div>
        <div className="text1">SELECIONE O SETOR DE DESTINO DO PACIENTE</div>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {unidades.map(item => (
            <div
              className="button"
              style={{ paddingLeft: 20, paddingRight: 20, width: 150 }}
              onClick={() => updateAtendimento(item.id_unidade, classificacao)}
            >
              {item.nome_unidade}
            </div>
          ))}
        </div>
      </div>
    )
  }

  let salas = ['TRIAGEM 01', 'TRIAGEM 02']
  function SalaSelector() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="text1">{salatriagem == null ? 'SELECIONE A SALA PARA ACOLHIMENTO' : 'SALA DE ACOLHIMENTO: ' + salatriagem}</div>
        <div id="salas para chamada"
          style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          {salas.map(item => (
            <div
              id={"btnsala " + item}
              className={salatriagem == item ? "button-red" : "button"}
              onClick={() => {
                setsalatriagem(item);
                console.log(salatriagem);
              }}
              style={{ paddingLeft: 20, paddingRight: 20 }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // recuperando o total de chamadas para a unidade de atendimento.
  const [chamadas, setchamadas] = useState([]);
  const loadChamadas = () => {
    axios.get(html + 'list_chamada/' + unidade).then((response) => {
      setchamadas(response.data.rows);
    })
  }

  // inserindo registro de chamada para triagem.
  const callPaciente = (item) => {
    if (salatriagem != null) {
      var obj = {
        id_unidade: unidade,
        id_paciente: item.id_paciente,
        nome_paciente: item.nome_paciente,
        id_atendimento: item.id_atendimento,
        id_sala: salatriagem,
        data: moment()
      }
      axios.post(html + 'insert_chamada/', obj).then(() => {
        axios.get(html + 'list_chamada/' + unidade).then((response) => {
          let x = response.data.rows;
          let y = x.filter(valor => valor.id_atendimento == item.id_atendimento);
          setchamadas(response.data.rows);
          document.getElementById('contagem de chamadas' + item.id_atendimento).innerHTML = y.length;
        });
      });
    } else {
      toast(settoast, 'SELECIONE UMA SALA PARA ACOLHIMENTO PRIMEIRO', 'red', 2000);
    }
  }

  // lista de atendimentos.
  const ListaDeAtendimentos = useCallback(() => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "calc(100% - 15px)",
          alignSelf: "center",
        }}
      >
        <div className="text3">
          {"LISTA DE PACIENTES - " +
            unidades
              .filter((item) => item.id_unidade == unidade)
              .map((item) => item.nome_unidade)
          }
        </div>
        <div
          className="scroll"
          id="scroll atendimentos"
          style={{
            display: arrayatendimentos.filter(item => item.id_unidade == unidade).length > 0 ? "flex" : "none",
            justifyContent: "flex-start",
            height: window.innerHeight - 250,
            width: window.inenrWidth < mobilewidth ? "calc(95vw - 15px)" : "100%",
          }}
        >
          {arrayatendimentos.filter(item => item.id_unidade == unidade)
            .sort((a, b) => (moment(a.datainicio) > moment(b.datainicio) ? 1 : -1))
            .map((item) => (
              <div key={"pacientes" + item.id_atendimento}>
                <div
                  className="row"
                  style={{
                    padding: 0,
                    flex: 4,
                    position: "relative",
                    marginBottom: 10,
                  }}
                >
                  <div
                    className="button-yellow"
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      marginRight: 0,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      minHeight: 100,
                      height: 100,
                      width: 100, minWidth: 100, maxWidth: 100
                    }}
                  >
                    <div>
                      {moment(item.data_inicio).format('DD/MM/YY')}
                    </div>
                    <div>
                      {moment(item.data_inicio).format('HH:mm:ss')}
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'row', margin: 5, marginBottom: 0
                    }}>
                      <div
                        className="button-opaque"
                        style={{
                          display: 'flex',
                          margin: 5, marginRight: 0,
                          minHeight: 35, maxHeight: 35, minWidth: 35, maxWidth: 35,
                          borderTopRightRadius: 0, borderBottomRightRadius: 0,
                          backgroundColor: 'rgba(231, 76, 60, 0.8)'
                        }}
                        onClick={() => {
                          callPaciente(item);
                        }}
                      >
                        <img
                          alt=""
                          src={call}
                          style={{
                            margin: 0,
                            height: 25,
                            width: 25,
                          }}
                        ></img>
                      </div>
                      <div id={'contagem de chamadas' + item.id_atendimento}
                        title="TOTAL DE CHAMADAS"
                        className="text1"
                        style={{
                          margin: 5, marginLeft: 0,
                          borderRadius: 5, borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
                          backgroundColor: 'white', width: 35, height: 35
                        }}>
                        {chamadas.filter(valor => valor.id_paciente == item.id_paciente && valor.id_atendimento == item.id_atendimento).length}
                      </div>
                    </div>
                  </div>
                  <div
                    id={"atendimento " + item.id_atendimento}
                    className="button"
                    style={{
                      flex: 3,
                      marginLeft: 0,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      minHeight: 100,
                      height: 100,
                    }}
                    onClick={() => {
                      setatendimento(item);
                      setpaciente(item.id_paciente);
                      setTimeout(() => {
                        var botoes = document
                          .getElementById("scroll atendimentos")
                          .getElementsByClassName("button-red");
                        for (var i = 0; i < botoes.length; i++) {
                          botoes.item(i).className = "button";
                        }
                        document.getElementById(
                          "atendimento " + item.id_atendimento
                        ).className = "button-red";
                      }, 100);
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                      }}
                    >
                      {pacientes
                        .filter(
                          (valor) => valor.id_paciente == item.id_paciente
                        )
                        .map((valor) => valor.nome_paciente.substring(0, 20) + "...")}
                      <div>
                        {moment().diff(
                          moment(
                            pacientes
                              .filter(
                                (valor) => valor.id_paciente == item.id_paciente
                              )
                              .map((item) => item.dn_paciente)
                          ),
                          "years"
                        ) + " ANOS"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div
          className="scroll"
          style={{
            display: arrayatendimentos.length > 0 ? "none" : "flex",
            justifyContent: "center",
            height: window.innerHeight - 250,
            width: "100%",
          }}
        >
          <div className="text3" style={{ opacity: 0.5 }}>
            SEM PACIENTES CADASTRADOS PARA ESTA UNIDADE
          </div>
        </div>
      </div>
    );
    // eslint-disable-next-line
  }, [arrayatendimentos, salatriagem]);

  return (
    <div
      className="main fadein"
      style={{
        display: pagina == 30 ? "flex" : "none",
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100vw",
        height: altura,
      }}
    >
      <div
        id="lista de pacientes"
        style={{
          display: window.inenrWidth < mobilewidth ? "none" : "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 'calc(40vw - 50px)',
          height: window.innerHeight - 20,
          margin: 0,
        }}
      >
        <Usuario></Usuario>
        <SalaSelector></SalaSelector>
        <ListaDeAtendimentos></ListaDeAtendimentos>
      </div>
      <div id="conteúdo cheio"
        className="scroll"
        style={{
          display:
            window.inenrWidth < mobilewidth
              ? "none"
              : atendimento == null
                ? "none"
                : "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignContent: "center",
          alignSelf: "center",
          alignItems: "center",
          height: window.innerHeight - 30,
          minHeight: window.innerHeight - 30,
          width: "60vw",
          margin: 0,
          position: "relative",
          scrollBehavior: "smooth",
        }}
      >
        <div className='text1'>INFORME OS DADOS VITAIS PARA CLASSIFICAÇÃO AUTOMÁTICA</div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className='text1'>PAS</div>
            <input
              className="input"
              autoComplete="off"
              placeholder="PAS"
              inputMode='numeric'
              onKeyUp={() => checkNumberInput("inputPas", 50, 250)}
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'PAS')}
              style={{
                width: window.inenrWidth < mobilewidth ? '70vw' : '10vw',
                margin: 5,
              }}
              type="text"
              id="inputPas"
              maxLength={3}
            ></input>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className='text1'>PAD</div>
            <input
              className="input"
              autoComplete="off"
              placeholder="PAD"
              inputMode='numeric'
              onKeyUp={() => checkNumberInput("inputPad", 30, 230)}
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'PAD')}
              style={{
                width: window.inenrWidth < mobilewidth ? '70vw' : '10vw',
                margin: 5,
              }}
              type="text"
              id="inputPad"
              maxLength={3}
            ></input>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className='text1'>FC</div>
            <input
              className="input"
              autoComplete="off"
              placeholder="FC"
              inputMode='numeric'
              onKeyUp={() => checkNumberInput("inputFc", 20, 350)}
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'FC')}
              style={{
                width: window.inenrWidth < mobilewidth ? '70vw' : '10vw',
                margin: 5,
              }}
              type="text"
              id="inputFc"
              maxLength={3}
            ></input>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className='text1'>FR</div>
            <input
              className="input"
              autoComplete="off"
              placeholder="FR"
              inputMode='numeric'
              onKeyUp={() => checkNumberInput("inputFr", 8, 60)}
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'FR')}
              style={{
                width: window.inenrWidth < mobilewidth ? '70vw' : '10vw',
                margin: 5,
              }}
              type="text"
              id="inputFr"
              maxLength={2}
            ></input>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className='text1'>SAO2</div>
            <input
              className="input"
              autoComplete="off"
              placeholder="SAO2"
              inputMode='numeric'
              onKeyUp={() => checkNumberInput("inputSao2", 30, 101)}
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'SAO2')}
              style={{
                width: window.inenrWidth < mobilewidth ? '70vw' : '10vw',
                margin: 5,
              }}
              type="text"
              id="inputSao2"
              maxLength={3}
            ></input>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className='text1'>TAX</div>
            <input
              className="input"
              autoComplete="off"
              placeholder="TAX"
              inputMode='numeric'
              onKeyUp={(e) => {
                if (isNaN(e.target.value) == false && Number.isInteger(e.target.value) == false) {
                  console.log('VALOR VÁLIDO');
                } else {
                  document.getElementById('inputTax').value = '';
                  document.getElementById('inputTax').focus();
                }
              }}
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'TAX')}
              style={{
                width: window.inenrWidth < mobilewidth ? '70vw' : '10vw',
                margin: 5,
              }}
              type="text"
              id="inputTax"
              maxLength={4}
            ></input>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className='text1'>GLICEMIA</div>
            <input
              className="input"
              autoComplete="off"
              placeholder="GLICEMIA"
              inputMode='numeric'
              onKeyUp={() => checkNumberInput("inputGlicemia", 0, 900)}
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'GLICEMIA')}
              style={{
                width: window.inenrWidth < mobilewidth ? '70vw' : '10vw',
                margin: 5,
              }}
              type="text"
              id="inputGlicemia"
              maxLength={3}
            ></input>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className='text1'>GLASGOW</div>
            <input
              className="input"
              autoComplete="off"
              placeholder="GLASGOW"
              inputMode='numeric'
              onKeyUp={() => checkNumberInput("inputGlasgow", -3, 15)}
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'GLASGOW')}
              style={{
                width: window.inenrWidth < mobilewidth ? '70vw' : '10vw',
                margin: 5,
              }}
              type="text"
              id="inputGlasgow"
              maxLength={2}
            ></input>
          </div>
        </div>
        <BotoesClassificacao></BotoesClassificacao>
        <ClassificacaoAtual></ClassificacaoAtual>
      </div>
      <div id="conteúdo vazio"
        className="scroll"
        style={{
          display:
            window.inenrWidth < mobilewidth
              ? "none"
              : atendimento != null
                ? "none"
                : "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: window.innerHeight - 30,
          width: "60vw",
          margin: 0,
          scrollBehavior: "smooth",
        }}
      >
        <div className="text1" style={{ opacity: 0.5 }}>
          {"SELECIONE UM PACIENTE DA LISTA PRIMEIRO"}
        </div>
      </div>
    </div>
  );
}

export default Triagem;
