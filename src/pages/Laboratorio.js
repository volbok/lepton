/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState, useCallback } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
// imagens.
import salvar from '../images/salvar.svg';
import back from '../images/back.svg';
import moment from "moment";
import preferencias from '../images/preferencias.svg';
import deletar from '../images/deletar.svg';
// router.
import { useHistory } from "react-router-dom";
import toast from '../functions/toast';
// funções.
import selector from "../functions/selector";


function Laboratorio() {

  // context.
  const {
    pagina, setpagina,
    html,
    laboratorio, setlaboratorio,
    atendimentos, setatendimentos,
    unidades,
    settoast,
  } = useContext(Context);

  useEffect(() => {
    // eslint-disable-next-line
    if (pagina == 7) {
      console.log('PÁGINA LABORATÓRIO');
      loadAllAtendimentos();
      loadAllLaboratorio();
      loadOpcoesLaboratorio();
    }
    // eslint-disable-next-line
  }, [pagina]);

  // history (router).
  let history = useHistory();

  const [arrayatendimentos, setarrayatendimentos] = useState([])
  const loadAllAtendimentos = () => {
    axios.get(html + "all_atendimentos/").then((response) => {
      setatendimentos(response.data.rows);
      setarrayatendimentos(response.data.rows);
    })
  }

  // EDIÇÃO DOS EXAMES LABORATORIAIS SOLICITADOS NO SISTEMA.
  // atualizar lista de exames laboratoriais para o atendimento.
  const loadAllLaboratorio = () => {
    axios.get(html + 'all_laboratorio').then((response) => {
      setlaboratorio(response.data.rows);
    })
  }
  // atualizar pedido de exame de laboratorio.
  const updateLaboratorio = (item, resultado, data_resultado, status) => {
    var obj = {
      id_paciente: item.id_paciente,
      id_atendimento: item.id_atendimento,
      data_pedido: item.data_pedido,
      data_resultado: data_resultado,
      codigo_exame: item.codigo_exame,
      nome_exame: item.nome_exame,
      material: item.material,
      resultado: resultado,
      status: status,
      profissional: item.profissional,
    }
    console.log(obj)
    axios.post(html + 'update_laboratorio/' + item.id, obj).then(() => {
      loadAllLaboratorio();
    })
  }
  function TelaResultadoLaboratorio() {
    return (
      <div className='scroll'
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-start', margin: 10,
          position: 'relative', width: 'calc(100% - 40px)',
          height: 'calc(100% - 40px)'
        }}>
        {arrayatendimentos.filter(valor => valor.situacao == 1 && laboratorio.filter(item => item.status == 1 && item.id_atendimento == valor.id_atendimento).length > 0).map(valor =>
          <div className='text1 cor3'
            style={{
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'left', alignItems: 'flex-start',
              margin: 10, padding: 20,
              borderRadius: 5,
              width: 'calc(100% - 60px)'
            }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
              <div className='button' style={{ marginRight: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0, width: 200, backgroundColor: '#006666' }}>
                {unidades.filter(item => item.id_unidade == valor.id_unidade).map(item => 'UNIDADE: ' + item.nome_unidade)}
              </div>
              <div className='button' style={{ marginLeft: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, width: 80 }}>
                {'LEITO: ' + valor.leito}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', fontSize: 16, alignSelf: 'center', marginLeft: 10 }}>{valor.nome_paciente}</div>
            </div>
            <div id="lista de exames para preenchimento dos resultados"
              style={{
                display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly',
                width: '100%', backgroundColor: 'white', borderRadius: 5, marginTop: 15,
              }}>
              {laboratorio.filter(item => item.status == 1 && valor.id_atendimento == item.id_atendimento).map(item => (
                <div key={'laboratorio ' + item.id}
                  style={{
                    display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap',
                    height: 220, margin: 5
                  }}
                >
                  <div className="button-yellow" style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    marginRight: 0,
                    borderTopRightRadius: 0, borderBottomRightRadius: 0, width: 70,
                    backgroundColor: '#006666',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 5 }}>
                      <div>
                        {moment(item.data_pedido).format('DD/MM/YY')}
                      </div>
                      <div>
                        {moment(item.data_pedido).format('HH:mm')}
                      </div>
                    </div>
                  </div>
                  <div
                    className="button" style={{
                      marginLeft: 0,
                      borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
                    }}
                  >
                    <div style={{
                      display: 'flex', flexDirection: 'column',
                      justifyContent: 'flex-start', alignContent: 'center',
                      alignItems: 'center',
                    }}>
                      <div id="textarea para resultados."
                        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{
                          display: 'flex', height: 50,
                          alignItems: 'center'
                        }}>
                          <div style={{ width: '100%' }}>
                            {item.nome_exame}
                          </div>
                        </div>
                        <textarea id={"campo para digitar o resultado" + item.id}
                          className='textarea'
                          onClick={() => {
                            if (item.nome_exame == 'HEMOGRAMA COMPLETO' && document.getElementById("campo para digitar o resultado" + item.id).value == "") {
                              document.getElementById("campo para digitar o resultado" + item.id).value = "HGB: , HTO: , PLAQ: , GL: , BAST: , SEG: , LINF: ";
                              document.getElementById("campo para digitar o resultado" + item.id).focus();
                            }
                          }}
                          style={{ width: 200, height: 60, minHeight: 60, maxHeight: 60, alignSelf: 'center' }}
                        >
                        </textarea>
                      </div>
                      <div id={"botão para salvar o resultado " + item.id}
                        className='button-green'
                        style={{
                          display: item.status == 1 ? 'flex' : 'none',
                          alignSelf: 'center',
                          maxHeight: 30, minHeight: 30, maxWidth: 30, minWidth: 30,
                        }}
                        onClick={(e) => {
                          if (document.getElementById("campo para digitar o resultado" + item.id).value != '') {
                            updateLaboratorio(item, document.getElementById("campo para digitar o resultado" + item.id).value.toUpperCase(), moment(), 2); e.stopPropagation();
                          } else {
                            toast(settoast, 'RESULTADO EM BRANCO!', 'red', 2000);
                          }
                        }}>
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
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // EDIÇÃO DAS OPÇÕES DE EXAMES LABORATORIAIS (SETUP).
  // atualizar lista de exames laboratoriais para o atendimento.
  const [opcoeslaboratorio, setopcoeslaboratorio] = useState([]);
  const [arrayopcoeslaboratorio, setarrayopcoeslaboratorio] = useState([]);
  const loadOpcoesLaboratorio = () => {
    axios.get(html + 'opcoes_laboratorio').then((response) => {
      setopcoeslaboratorio(response.data.rows);
      setarrayopcoeslaboratorio(response.data.rows);
    })
  }
  // deletando registro de opção de exame laboratorial.
  const deleteOpcaoLaboratorio = (item) => {
    axios.get(html + 'delete_opcao_laboratorio/' + item.id).then(() => {
      loadOpcoesLaboratorio();
      // toast(settoast, 'OPÇÃO DE EXAME EXCLUÍDA COM SUCESSO', 'green', 2000);
    })
  }
  // inserir registro de opção de exame laboratorial.
  const inserirOpcaoLaboratorio = (nome, material) => {
    var obj = {
      codigo_exame: Math.random(),
      nome_exame: nome,
      material: material,
      disponivel: 1,
    }
    axios.post(html + 'insert_opcao_laboratorio/', obj).then(() => {
      loadOpcoesLaboratorio();
      // toast(settoast, 'OPÇÃO DE EXAME INSERIDA COM SUCESSO', 'green', 2000);
    })
  }
  // atualizar registro de opção de exame laboratorial (disponível x indisponível).
  const updateOpcaoLaboratorio = (item) => {
    let troca = null;
    if (item.disponivel == 1) {
      troca = 0;
    } else {
      troca = 1;
    }
    var obj = {
      codigo_exame: item.codigo_exame,
      nome_exame: item.nome_exame,
      material: item.material,
      disponivel: troca,
    }
    axios.post(html + 'update_opcao_laboratorio/' + item.id, obj).then(() => {
      loadOpcoesLaboratorio();
    })
  }
  // filtro para busca de opções de exames laboratoriais já cadastrados.
  var timeout = null;
  const [filteropcaolaboratorio, setfilteropcaolaboratorio] = useState("");
  var searchopcaolaboratorio = "";
  const filterOpcaoLaboratorio = () => {
    clearTimeout(timeout);
    document.getElementById("inputopcaolaboratorio").focus();
    searchopcaolaboratorio = document.getElementById("inputopcaolaboratorio").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchopcaolaboratorio == "") {
        setfilteropcaolaboratorio("");
        setarrayopcoeslaboratorio(opcoeslaboratorio);
        document.getElementById("inputopcaolaboratorio").value = "";
        setTimeout(() => { document.getElementById("inputopcaolaboratorio").focus() }, 100);
      } else {
        setfilteropcaolaboratorio(
          document.getElementById("inputopcaolaboratorio").value.toUpperCase()
        );
        setarrayopcoeslaboratorio(
          opcoeslaboratorio.filter((item) =>
            item.nome_exame.includes(searchopcaolaboratorio)
          )
        );
        document.getElementById("inputopcaolaboratorio").value = searchopcaolaboratorio;
        setTimeout(() => { document.getElementById("inputopcaolaboratorio").focus() }, 100);
      }
    }, 1000);
  };
  // filtro de paciente por nome.
  function FilterOpcaolaboratorio() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
        <input
          className="input"
          autoComplete="off"
          placeholder="BUSCAR EXAME..."
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "BUSCAR EXAME...")}
          onKeyUp={() => filterOpcaoLaboratorio()}
          type="text"
          id="inputopcaolaboratorio"
          defaultValue={filteropcaolaboratorio}
          maxLength={100}
          style={{ width: '100%' }}
        ></input>
      </div>
    );
  }

  // tela para manejo das opções de exames laboratoriais (setup).
  let arraymaterial = ['SANGUE', 'URINA', 'FEZES', 'ESCARRO', 'SECREÇÃO', 'LÍQUIDO EM GERAL', 'RX', 'USG', 'TOMOGRAFIA']
  const [viewopcoeslaboratorio, setviewopcoeslaboratorio] = useState(0);
  function ViewOpcoesLaboratorio() {
    let material = null;
    return (
      <div className="fundo"
        style={{
          display: viewopcoeslaboratorio == 1 ? 'flex' : 'none',
          flexDirection: 'column', justifyContent: 'center'
        }}>
        <div className="janela" style={{ display: 'flex', flexDirection: 'row' }}>
          <div id='coluna 01 - lista de opcoes de exames cadastrados'
            className='scroll'
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '40vw', height: '70vh', marginRight: 10 }}
          >
            <FilterOpcaolaboratorio></FilterOpcaolaboratorio>
            {arrayopcoeslaboratorio.map(item => (
              <div className='button' style={{ width: 'calc(100% - 20px)' }}>
                <div style={{ width: '100%' }}>{item.nome_exame}</div>
                <div id='disponibilidade'
                  className='button'
                  style={{
                    opacity: item.disponivel == 1 ? 1 : 0.5,
                    backgroundColor: item.disponivel == 1 ? 'rgb(82, 190, 128, 1)' : '#EC7063',
                    width: 20, minWidth: 20, maxWidth: 20,
                    height: 20, minHeight: 20, maxHeight: 20,
                  }}
                  onClick={() => updateOpcaoLaboratorio(item)}
                >
                </div>
                <div id="botão para excluir o exame"
                  className='button-yellow'
                  style={{
                    width: 35, minWidth: 35, maxWidth: 35,
                    height: 35, minHeight: 35, maxHeight: 35,
                    marginRight: 2.5
                  }}
                  onClick={() => deleteOpcaoLaboratorio(item)}
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
            ))}
          </div>
          <div id='coluna 02 - campos para inserir nova opcao de exame laboratorial'
            className='scroll'
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '40vw', height: '70vh' }}
          >
            <div className='text1'>NOME DO EXAME</div>
            <input
              autoComplete="off"
              placeholder="NOME DO EXAME"
              className="input"
              type="text"
              id="inputNomeExame"
              onFocus={(e) => (e.target.placeholder = "")}
              onBlur={(e) => (e.target.placeholder = "NOME DO EXAME.")}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignSelf: "center",
                width: 'calc(100% - 20px)',
                alignContent: "center",
                textAlign: "center",
              }}
            ></input>
            <div className='text1'>MATERIAL</div>
            <div id="lista de materiais"
              style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              {arraymaterial.map(item => (
                <div className='button' id={"material " + item} style={{ width: 200 }}
                  onClick={() => {
                    material = item;
                    selector("lista de materiais", "material " + item, 100);
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <div id="botão para salvar a opção de exame"
                className='button-green'
                style={{
                  display: 'flex',
                  alignSelf: 'center',
                }}
                onClick={() => inserirOpcaoLaboratorio(document.getElementById("inputNomeExame").value.toUpperCase(), material)}>
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
              <div id="botão para sair da tela de configuração dos exames"
                className='button-yellow'
                style={{
                  display: 'flex',
                  alignSelf: 'center',
                }}
                onClick={() => setviewopcoeslaboratorio(0)}>
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
            </div>
          </div>
        </div>
      </div >
    )
  }

  const FiltraUnidades = useCallback(() => {
    return (
      <div id="lista de unidades"
        className='scroll cor0'
        style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',
          overflowY: 'hidden', overflowX: 'scroll',
          width: '60vw', marginLeft: 10
        }}>
        {unidades.map(item => (
          <div id={"unidade" + item.id_unidade}
            className="button"
            style={{ width: 200, minWidth: 200 }}
            onClick={() => {
              setarrayatendimentos(atendimentos.filter(valor => valor.id_unidade == item.id_unidade));
              selector("lista de unidades", "unidade" + item.id_unidade, 300);
            }}
          >
            {item.nome_unidade}
          </div>
        ))}
      </div>
    )
    // eslint-disable-next-line
  }, [arrayatendimentos]);

  return (
    <div id="tela do laboratório"
      className='main'
      style={{
        display: pagina == 7 ? 'flex' : 'none',
        flexDirection: 'column', justifyContent: 'center',
      }}
    >
      <div style={{
        display: 'flex', flexDirection: 'row', justifyContent: 'center',
        alignSelf: 'center', alignItems: 'center', marginTop: 10
      }}>
        <div id="botão para sair da tela de laboratório"
          className="button-red" style={{ maxHeight: 50 }}
          onClick={() => {
            setpagina(0);
            history.push("/");
          }}>
          <img
            alt=""
            src={back}
            style={{ width: 30, height: 30 }}
          ></img>
        </div>
        <div className='button-green' style={{ maxHeight: 50 }}
          title={'GERENCIADOR DE ITENS DE LABORATÓRIO'}
          onClick={() => setviewopcoeslaboratorio(1)}>
          <img
            alt=""
            src={preferencias}
            style={{
              margin: 0,
              height: 30,
              width: 30,
            }}
          ></img>
        </div>
        <FiltraUnidades></FiltraUnidades>
      </div>
      <div className='text1' style={{ fontSize: 16, marginTop: 10 }}>LISTA DE EXAMES LABORATORIAIS PARA PREENCHIMENTO DO RESULTADO</div>
      <TelaResultadoLaboratorio></TelaResultadoLaboratorio>
      <ViewOpcoesLaboratorio></ViewOpcoesLaboratorio>
    </div>
  )
}

export default Laboratorio;