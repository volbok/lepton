/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState, useCallback } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
import moment from "moment";
// imagens.
import salvar from '../images/salvar.svg';
import back from '../images/back.svg';
import preferencias from '../images/preferencias.svg';
import deletar from '../images/deletar.svg';
import lupa from '../images/lupa.svg';

// router.
import { useHistory } from "react-router-dom";
// funções.
import selector from "../functions/selector";


function Laboratorio() {

  // context.
  const {
    pagina, setpagina,
    html,
    laboratorio, setlaboratorio,
    setatendimentos, atendimentos,
    unidades,
    settipodocumento,
    // setdono_documento,
  } = useContext(Context);

  const [listalaboratorio, setlistalaboratorio] = useState([]);
  const loadListaLaboratorio = (atendimento) => {
    axios.get(html + 'lista_laboratorio/' + atendimento).then((response) => {
      setlistalaboratorio(response.data.rows);
      settipodocumento('RESULTADO DE EXAME LABORATORIAL');
    });
  }

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

  const loadAllAtendimentos = () => {
    axios.get(html + "all_atendimentos/").then((response) => {
      setatendimentos(response.data.rows);
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
  const updateLaboratorio = (item, obj) => {
    axios.post(html + 'update_laboratorio/' + item.id, obj).then(() => {
      loadAllLaboratorio();
    })
  }

  // função valiosa que mapeia cada registro de exame e permite a edição dos resultados.
  const itemEditarLaboratorio = (item, titulo, array) => {
    let localarray = [0];
    if (array != null) {
      localarray = array.split(',');
      console.log(localarray);
    }
    return (
      <div className='button'
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
          flexGrow: 1,
          position: 'relative',
        }}
      >
        <div style={{ height: 50 }}>
          <div>{titulo}</div>
        </div>
        <div id={'check ' + titulo}
          style={{
            display: 'none',
            position: 'absolute', bottom: 5, right: 5,
            borderRadius: 50,
            backgroundColor: '#EC7063',
            color: 'white', fontWeight: 'bold',
            width: 25, height: 25,
            justifyContent: 'center',
          }}>
          <div>!</div>
        </div>
        <div id="array de campos relativos ao exame."
          className='scroll'
          style={{
            display: 'flex',
            flexDirection: 'row', flexWrap: 'wrap',
            height: 120, minHeight: 120, maxHeight: 100,
            width: 'calc(100% - 30px)',
            marginTop: 5,
          }}
        >
          {localarray.map(campo => (
            <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', width: 'calc(100% - 20px)' }}>
              <div className='text1'>{campo}</div>
              <textarea id={'campo ' + campo}
                className='textarea'
                style={{ width: 'calc(100% - 20px)' }}>
              </textarea>
            </div>
          ))}
        </div>
        <div id={"botão para salvar o resultado " + item.id}
          className='button-green'
          style={{
            display: item.status == 1 ? 'flex' : 'none',
            alignSelf: 'center',
            maxHeight: 30, minHeight: 30, maxWidth: 30, minWidth: 30,
            margin: 10,
            marginTop: localarray.length > 1 ? 15 : 10,
          }}
          onClick={() => {
            let arrayresultado = [];
            // checando se algum campo está em branco.
            // eslint-disable-next-line
            localarray.map(campo => {
              if (document.getElementById("campo " + campo).value == '') {
                document.getElementById('check ' + titulo).style.display = 'flex'
              } else {
                // salvando o registro de exame laboratorial.
                localarray.map(campo => arrayresultado.push(
                  {
                    campo: campo,
                    valor: document.getElementById('campo ' + campo).value.toUpperCase(),
                  }
                ));
                console.log(arrayresultado);
                let limitedjs = [];
                limitedjs = JSON.stringify(arrayresultado);
                let obj = {
                  id: item.id,
                  id_paciente: item.id_paciente,
                  id_atendimento: item.id_atendimento,
                  data_pedido: item.data_pedido,
                  data_resultado: item.data_resultado,
                  codigo_exame: item.codigo_exame,
                  nome_exame: item.nome_exame,
                  material: item.material,
                  resultado: limitedjs,
                  status: 2, // 0 = registrado, 1 = assinado, 2 = liberado,
                  profissional: item.profissional,
                  unidade_medida: item.unidade_medida,
                  vref_min: item.vref_min,
                  vref_max: item.vref_max,
                  obs: item.obs,
                  random: item.random,
                  array_campos: item.array_campos
                }
                updateLaboratorio(item, obj);
              }
            });
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
      </div >
    )
  }

  function TelaResultadoLaboratorio() {
    return (
      <div
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-start', margin: 10,
          height: 'calc(100% - 20px)',
          width: 'calc(100% - 20px)',
        }}>
        {listalaboratorio.filter(valor => valor.id_atendimento == localStorage.getItem('selectedatendimento') && valor.status == 1 && valor.material != 'IMAGEM').map(valor =>
          <div className='cor3'
            style={{
              display: listalaboratorio.length > 0 ? 'flex' : 'none',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              marginTop: 10, marginBottom: 10,
              padding: 5,
              borderRadius: 5,
            }}>
            <div className='button red' style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 0 }}>{moment(valor.data).format('DD/MM/YY - HH:mm')}</div>
            <div id="lista de exames para preenchimento dos resultados"
              className='grid'
              style={{
                borderRadius: 5, marginTop: 10,
              }}>
              {laboratorio.filter(item => item.status == 1 && valor.id_atendimento == item.id_atendimento && item.random == valor.random && item.material != 'IMAGEM').map(item => itemEditarLaboratorio(item, item.nome_exame, item.array_campos))}
            </div>
          </div>
        )}
        <div id="lista vazia"
          className='lupa'
          style={{
            display: listalaboratorio.length == 0 ? 'flex' : 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRadius: 5,
            width: '100%',
            height: '100%',
          }}>
          <img
            alt=""
            src={lupa}
            style={{
              margin: 10,
              height: 150,
              width: 150,
              opacity: 0.1,
              alignSelf: 'center'
            }}
          ></img>
        </div>
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
  const inserirOpcaoLaboratorio = (nome, material, unidade_medida, vref_min, vref_max, obs, array_campos) => {
    var obj = {
      codigo_exame: Math.random(),
      nome_exame: nome,
      material: material,
      disponivel: 1,
      unidade_medida: unidade_medida,
      vref_min: vref_min,
      vref_max: vref_max,
      obs: obs,
      array_campos: array_campos
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
      unidade_medida: item.unidade_medida,
      vref_min: item.vref_min,
      vref_max: item.vref_max,
      obs: item.obs,
      array_campos: item.array_campos
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
  let arraymaterial = ['SANGUE', 'URINA', 'FEZES', 'ESCARRO', 'SECREÇÃO', 'LÍQUIDO EM GERAL', 'IMAGEM']
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
                <div className='button'
                  id={"material " + item} style={{ width: 200 }}
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

  // lista de atendimentos para filtragem das prescrições de exames laboratoriais.
  const ListaAtendimentos = useCallback(() => {
    return (
      <div id="scroll lista de atendimentos resumida"
        className='scroll'
        style={{
          display: 'flex',
          width: '15vw',
          height: '100%',
          margin: 5, marginTop: 10,
          backgroundColor: 'white',
          borderColor: 'white',
          alignSelf: 'flex-start',
        }}>
        {atendimentos.sort((a, b) => moment(a.data) > moment(b.data) ? -1 : 1).map((item) => (
          <div
            style={{
              display: laboratorio.filter(valor => valor.id_atendimento == item.id_atendimento).length > 0 ? 'flex' : 'none',
              flexDirection: 'row',
              minHeight: 150,
            }}
            onClick={() => {
              loadListaLaboratorio(item.id_atendimento);
              localStorage.setItem('selectedatendimento', item.id_atendimento);
              selector("scroll lista de atendimentos resumida", "atendimento " + item.id_atendimento, 200);
            }}
          >
            <div id="identificador"
              className='button cor1opaque'
              style={{
                marginRight: 0,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
              <div>
                {unidades.filter(valor => valor.id_unidade == item.id_unidade).map(valor => valor.nome_unidade) + ' - ' + item.leito}
              </div>
            </div>

            <div className='button pallete2'
              id={"atendimento " + item.id_atendimento}
              style={{
                marginLeft: 0,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            >
              {item.nome_paciente}
            </div>
          </div>
        ))
        }
      </div>
    )
    // eslint-disable-next-line
  }, [atendimentos, listalaboratorio]);

  function Botoes() {
    return (
      <div style={{
        display: 'flex', flexDirection: 'row', justifyContent: 'center',
        alignSelf: 'center', alignItems: 'center',
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
      </div>
    )
  }

  return (
    <div id="tela do laboratório"
      className='main'
      style={{
        display: pagina == 7 ? 'flex' : 'none'
      }}
    >
      <div className='chassi'
        style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly',
        }}>
        <div
          style={{
            position: 'sticky', top: 0,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            height: 'calc(100vh - 20px)',
          }}>
          <Botoes></Botoes>
          <ListaAtendimentos></ListaAtendimentos>
        </div>
        <div
          style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            height: 'calc(100vh - 20px)', width: '100%'
          }}>
          <div className='text1'
            style={{ fontSize: 16, marginTop: 10 }}>
            LISTA DE EXAMES LABORATORIAIS PARA PREENCHIMENTO DO RESULTADO
          </div>
          <TelaResultadoLaboratorio></TelaResultadoLaboratorio>
        </div>
      </div>
      <ViewOpcoesLaboratorio></ViewOpcoesLaboratorio>
    </div>
  )
}

export default Laboratorio;