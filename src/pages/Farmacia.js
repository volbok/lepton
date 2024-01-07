/* eslint eqeqeq: "off" */
import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import Context from "./Context";
import moment from "moment";
// imagens.
import back from '../images/back.svg';
import refresh from "../images/refresh.svg";
import "moment/locale/pt-br";
// router.
import { useHistory } from "react-router-dom";

function Farmacia() {

  // context.
  const {
    pagina, setpagina,
    html,
    atendimentos, setatendimentos,
    unidades,
    atendimento, setatendimento,
    pacientes, setpacientes,
    setpaciente,
  } = useContext(Context);

  useEffect(() => {
    // eslint-disable-next-line
    if (pagina == 8) {
      loadPacientes();
    }
    // eslint-disable-next-line
  }, [pagina]);

  // history (router).
  let history = useHistory();

  // recuperando registros de prescrições.
  const [arraylistaprescricao, setarraylistaprescricao] = useState([]);
  const loadPrescricao = (atendimento) => {
    axios.get(html + 'list_prescricoes/' + atendimento).then((response) => {
      var x = response.data.rows;
      setarraylistaprescricao(response.data.rows);
      console.log(x.length);
    });
  }

  const [arrayatendimentos, setarrayatendimentos] = useState([]);
  const loadAtendimentos = () => {
    axios
      .get(html + "all_atendimentos")
      .then((response) => {
        setatendimentos(response.data.rows);
        setarrayatendimentos(response.data.rows);
      });
  };

  const loadPacientes = () => {
    axios.get(html + "list_pacientes").then((response) => {
      setpacientes(response.data.rows);
      loadAtendimentos();
    });
  }

  // carregando todos os itens e componentes de prescrição aprazados para dada prescrição.
  const [aprazamentos, setaprazamentos] = useState([]);
  const loadAprazamentos = (prescricao) => {
    axios.get(html + 'list_aprazamentos/' + prescricao).then((response) => {
      var x = response.data.rows;
      setaprazamentos(response.data.rows);
      console.log(x.length);
      console.log(prescricao);
    });
  }

  const [filterpaciente, setfilterpaciente] = useState("");
  var searchpaciente = "";
  var timeout = null;
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
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', }}>
        <div className='button-red'
          title={'VOLTAR PARA O PASSÔMETRO'}
          onClick={() => {
            setpagina(0);
            history.push('/');
          }}>
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
        <input
          className="input cor2"
          autoComplete="off"
          placeholder="BUSCAR PACIENTE..."
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "BUSCAR PACIENTE...")}
          onKeyUp={() => filterPaciente()}
          type="text"
          id="inputPaciente"
          defaultValue={filterpaciente}
          maxLength={100}
          style={{ width: '100%' }}
        ></input>
        <div
          id="botão para atualizar a lista de pacientes."
          className="button"
          style={{
            display: "flex",
            opacity: 1,
            alignSelf: "center",
          }}
          onClick={() => { loadPacientes(); setatendimento(null); }}
        >
          <img
            alt="" src={refresh}
            style={{ width: 30, height: 30 }}></img>
        </div>
      </div >
    );
  }

  const ListaDeAtendimentos = useCallback(() => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignSelf: "center",
          marginRight: 10,
        }}
      >
        <FilterPaciente></FilterPaciente>
        <div id="scroll atendimentos com pacientes"
          className="scroll"
          style={{
            display: arrayatendimentos.length > 0 ? "flex" : "none",
            justifyContent: "flex-start",
            marginBottom: '',
            width: '30vw',
            marginTop: 5,
            height: 'calc(100vh - 115px)',
          }}
        >
          {unidades.map(unidade => (
            <div>
              {
                arrayatendimentos
                  .filter(item => item.situacao == 1 && item.id_unidade == unidade.id_unidade)
                  .sort((a, b) => (a.leito > b.leito ? 1 : -1))
                  .map((item) => (
                    <div key={"pacientes" + item.id_atendimento} style={{ width: '100%' }}>
                      <div
                        className="row"
                        style={{
                          position: "relative",
                          margin: 2.5, padding: 0,
                        }}
                      >
                        <div
                          className="button-yellow"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            marginRight: 0,
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            minHeight: 100,
                            height: 100,
                            width: 75,
                            backgroundColor: 'rgba(0,0,0, 0.6)'
                          }}
                        >
                          <div
                            className='text2'
                            style={{ margin: 5, padding: 0, fontSize: 24 }}
                          >
                            {unidades.filter(x => x.id_unidade == item.id_unidade).map(x => x.nome_unidade)}
                          </div>
                          <div
                            className='text2'
                            style={{ margin: 5, padding: 0, fontSize: 24 }}
                          >
                            {item.leito}
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
                            width: '100%',
                          }}
                          onClick={() => {
                            setatendimento(item.id_atendimento);
                            setpaciente(item.id_paciente);
                            loadPrescricao(item.id_atendimento);
                            if (pagina == 8) {
                              setTimeout(() => {
                                var botoes = document
                                  .getElementById("scroll atendimentos com pacientes")
                                  .getElementsByClassName("button-red");
                                for (var i = 0; i < botoes.length; i++) {
                                  botoes.item(i).className = "button";
                                }
                                document.getElementById(
                                  "atendimento " + item.id_atendimento
                                ).className = "button-red";
                              }, 100);
                            }
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "flex-start",
                              padding: 5
                            }}
                          >
                            {pacientes.filter(
                              (valor) => valor.id_paciente == item.id_paciente
                            )
                              .map((valor) => valor.nome_paciente)}
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
                  ))
              }
            </div>
          ))}
        </div>
        <div id="scroll atendimento vazio"
          className="scroll"
          style={{
            display: arrayatendimentos.length > 0 ? "none" : "flex",
            justifyContent: "center",
            marginBottom: '',
            width: '30vw',
            marginTop: 5,
            height: 'calc(100vh - 115px)',
          }}
        >
          <div className="text3" style={{ opacity: 0.5 }}>
            SEM PACIENTES CADASTRADOS PARA ESTA UNIDADE
          </div>
        </div>
      </div>
    );
    // eslint-disable-next-line
  }, [arrayatendimentos]);

  function ScrollPrescricoes() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div id="lista de prescrições"
          className="scroll"
          style={{
            display: arraylistaprescricao.filter(valor => valor.id_atendimento == atendimento).length > 0 ? 'flex' : 'none',
            width: 'calc(70vw - 60px)',
            height: 'calc(100vh - 40px)',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}>
          {arraylistaprescricao.filter(valor => valor.id_atendimento == atendimento).map(valor => (
            <div className="cor1" style={{ width: 'calc(100% - 20px)', borderRadius: 5, margin: 5, padding: 5 }}>
              <div style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                width: 'calc(100%)',
                height: aprazamentos.filter(aprazamento => aprazamento.id_componente_pai != null && aprazamento.id_prescricao == valor.id).length > 0 ? 500 : 70,
              }}
              >
                <div id="botão indicador de data e hora da prescrição"
                  className="button-yellow"
                  style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 200,
                    margin: 5, marginLeft: 2.5
                  }}
                  onClick={() => { loadAprazamentos(valor.id) }}
                >
                  <div>
                    {moment(valor.data).format('DD/MM/YY')}
                  </div>
                  <div>
                    {moment(valor.data).format('HH:mm:SS')}
                  </div>
                </div>
                <div id="lista com itens de prescrição e seus componentes"
                  className="scroll"
                  style={{
                    display: aprazamentos.filter(aprazamento => aprazamento.id_componente_pai != null && aprazamento.id_prescricao == valor.id).length > 0 ? 'flex' : 'none',
                    width: 'calc(100% - 20px)', height: 500, margin: 5,
                    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly',
                  }}
                >
                  {aprazamentos.filter(aprazamento => aprazamento.id_componente_pai != null && aprazamento.id_prescricao == valor.id).map(aprazamento => (
                    <div id="card do item de prescrição"
                      className="scroll"
                      style={{
                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
                        width: '27vw',
                        height: 300,
                        padding: 10, margin: 10,
                        backgroundColor: 'lightgray',
                        borderColor: 'lightgray',
                      }}>
                      <div className="button"
                        style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, marginBottom: 0 }}
                      >
                        {aprazamento.prazo}
                      </div>
                      <div id="item de prescrição"
                        className="button"
                        style={{
                          padding: 5, backgroundColor: 'rgb( 0, 0, 0, 0.4)', marginTop: 0,
                          borderTopLeftRadius: 0, borderTopRightRadius: 0
                        }}
                      >
                        {aprazamento.nome + ' - QTDE: ' + aprazamento.qtde}
                      </div>
                      <div id="componentes do item">
                        {aprazamentos.filter(componente => componente.id_componente_filho == aprazamento.id_componente_pai && componente.prazo == aprazamento.prazo).map(componente => (
                          <div
                            className="button"
                            style={{
                              padding: 5, backgroundColor: 'rgb( 0, 0, 0, 0.2)',
                            }}
                          >
                            {componente.nome + ' - QTDE: ' + componente.qtde}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
        <div id="lista de prescrições - atendimento não selecionado"
          className="scroll"
          style={{
            display: atendimento == null ? 'flex' : 'none',
            width: 'calc(70vw - 60px)',
            height: 'calc(100vh - 40px)'
          }}>
          <div className="text1" style={{ alignSelf: 'center', alignContent: 'center' }}>
            SELECIONE UM ATENDIMENTO PARA LIBERAR OS ITENS DE PRESCRIÇÃO.
          </div>
        </div>
        <div id="lista de prescrições - sem prescrições"
          className="scroll"
          style={{
            display: atendimento != null && arraylistaprescricao.filter(valor => valor.id_atendimento == atendimento).length == 0 ? 'flex' : 'none',
            width: 'calc(70vw - 60px)',
            height: 'calc(100vh - 40px)'
          }}>
          <div className="text1" style={{ alignSelf: 'center', alignContent: 'center' }}>
            SEM PRESCRIÇÕES PARA ESTE ATENDIMENTO.
          </div>
        </div>
      </div >
    )
  }

  return (
    <div id="tela da farmácia"
      className='main'
      style={{
        display: pagina == 8 ? 'flex' : 'none',
        flexDirection: 'row', justifyContent: 'center',
        position: 'relative',
      }}
    >
      <ListaDeAtendimentos></ListaDeAtendimentos>
      <ScrollPrescricoes></ScrollPrescricoes>
    </div>
  )
}

export default Farmacia;