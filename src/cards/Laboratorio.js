/* eslint eqeqeq: "off" */
import React, { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
// imagens.
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import novo from '../images/novo.svg';
import back from '../images/back.svg';
import moment from "moment";
import print from '../images/imprimir.svg';
import logo from '../images/logo.svg';
import lupa from '../images/lupa.svg';
// funções.
import selector from '../functions/selector';

function Laboratorio() {

  // context.
  const {
    html,
    laboratorio, setlaboratorio,
    unidade,
    unidades,
    atendimento,
    atendimentos,
    paciente,
    pacientes,
    usuario,
    card, setcard,

    settipodocumento,
    setdono_documento,
  } = useContext(Context);

  useEffect(() => {
    if (card == 'card-laboratorio') {
      loadOpcoesLaboratorio();
      loadListaLaboratorio();
    }
    // eslint-disable-next-line
  }, [card]);

  // OPÇÕES DE ITENS DE LABORATORIO.
  // lista de opções de exames laboratoriais disponíveis para o cliente.
  const [opcoeslaboratorio, setopcoeslaboratorio] = useState([]);
  const [arrayopcoeslaboratorio, setarrayopcoeslaboratorio] = useState([]);
  var timeout = null;
  const loadOpcoesLaboratorio = () => {
    axios.get(html + 'opcoes_laboratorio').then((response) => {
      setopcoeslaboratorio(response.data.rows);
      setarrayopcoeslaboratorio(response.data.rows);
    })
  }

  // LISTA LABORATÓRIO.
  // carregar lista de pedidos de exames laboratoriais para o atendimento.
  const [listalaboratorio, setlistalaboratorio] = useState([]);
  const loadListaLaboratorio = () => {
    axios.get(html + 'lista_laboratorio/' + atendimento).then((response) => {
      setlistalaboratorio(response.data.rows);
    });
  }

  // inserir pedido de laboratório.
  const insertListaLaboratorio = (random) => {
    var obj = {
      id_paciente: paciente,
      id_atendimento: atendimento,
      data: moment(),
      status: 0, // 0 = não salva; 1 = salva (não pode excluir).
      id_profissional: usuario.id,
      nome_profissional: usuario.nome_usuario,
      registro_profissional: usuario.n_conselho,
      random: random,
    }
    axios.post(html + 'insert_lista_laboratorio', obj).then(() => {
      setlaboratorio([]);
      localStorage.setItem('random', random);
      setviewinsertlaboratorio(1);
    });
  }

  // atualizar pedido de exame laboratorial.
  const updateListaLaboratorio = (item, status) => {
    var obj = {
      id_paciente: paciente,
      id_atendimento: atendimento,
      data: item.data,
      status: status, // 0 = não salva; 1 = salva (não pode excluir).
      id_profissional: usuario.id,
      nome_profissional: usuario.nome_usuario,
      registro_profissional: usuario.n_conselho,
    }
    axios.post(html + 'update_lista_laboratorio/' + item.id, obj).then(() => {
      loadListaLaboratorio();
    });
  }

  // deletar pedido de exame laboratorial.
  const deleteListaLaboratorio = (id) => {
    axios.get(html + 'delete_lista_laboratorio/' + id).then(() => {
      loadListaLaboratorio();
    });
  }

  // ITENS DE LABORATÓRIO.
  // carregar itens exames laboratoriais para o atendimento.
  const loadLaboratorio = (random) => {
    axios.get(html + 'atendimento_laboratorio/' + atendimento).then((response) => {
      var x = response.data.rows;
      setlaboratorio(x.filter(item => item.random == random));
    });
  }

  // inserir item de exame laboratorial.
  const insertLaboratorio = (item, random) => {
    var obj = {
      id_paciente: paciente,
      id_atendimento: atendimento,
      data_pedido: moment(),
      data_resultado: null,
      codigo_exame: item.codigo_exame,
      nome_exame: item.nome_exame,
      material: item.material,
      resultado: null,
      status: 0,
      profissional: usuario.id,
      unidade_medida: item.unidade_medida,
      vref_min: item.vref_min,
      vref_max: item.vref_max,
      obs: item.obs,
      random: random,
    }
    axios.post(html + 'insert_laboratorio', obj);
  }

  // atualizar pedido de exame laboratorial.
  const updateLaboratorio = (item, resultado, data_resultado, status) => {
    var obj = {
      id_paciente: paciente,
      id_atendimento: atendimento,
      data_pedido: item.data_pedido,
      data_resultado: data_resultado,
      codigo_exame: item.codigo_exame,
      nome_exame: item.nome_exame,
      material: item.material,
      resultado: resultado,
      status: status,
      profissional: item.profissional,
      unidade_medida: item.unidade_medida,
      vref_min: item.vref_min,
      vref_max: item.vref_max,
      obs: item.obs,
      random: item.random,
    }
    axios.post(html + 'update_laboratorio/' + item.id, obj);
  }

  // deletar item de exame laboratorial.
  const deleteLaboratorio = (id) => {
    axios.get(html + 'delete_laboratorio/' + id).then(() => {
      loadLaboratorio();
    });
  }

  // deletar itens de laboratório relacionados a um pedido de exames laboratoriais deletado.
  const deleteMassaItensLaboratorio = (random) => {
    laboratorio.filter(item => item.random == random).map(item => deleteLaboratorio(item));
  }

  // ### //

  const insertPackLaboratorio = (array) => {
    let random = localStorage.getItem('random');
    // eslint-disable-next-line
    array.map(item => {
      opcoeslaboratorio.filter(valor => valor.nome_exame == item).map(item => insertLaboratorio(item, random));
    });
  }

  const assinarPedidos = () => {
    axios.get(html + 'atendimento_laboratorio/' + atendimento).then((response) => {
      // converte o status dos pedidos de exames laboratoriais de 0 para 1 (solicitados >> assinados). 
      var x = response.data.rows;
      x.filter(item => item.status == 0).map(item => updateLaboratorio(item, null, null, 1));
      setTimeout(() => {
        loadLaboratorio();
        printDiv();
      }, 1000);
    });
  }

  // imprimir requisição de exames laboratoriais.
  function printDiv() {
    console.log('PREPARANDO DOCUMENTO PARA IMPRESSÃO');
    let printdocument = document.getElementById("IMPRESSÃO - LABORATORIO").innerHTML;
    var a = window.open();
    a.document.write('<html>');
    a.document.write(printdocument);
    a.document.write('</html>');
    a.print();
  }
  function PrintLaboratorio() {
    return (
      <div id="IMPRESSÃO - LABORATORIO"
        className="print"
      >
        <table style={{ width: '100%' }}>
          <thead style={{ width: '100%' }}>
            <tr style={{ width: '100%' }}>
              <td style={{ width: '100%' }}>
                <Header></Header>
              </td>
            </tr>
          </thead>
          <tbody style={{ width: '100%' }}>
            <tr style={{ width: '100%' }}>
              <td style={{ width: '100%' }}>
                <div id="campos"
                  style={{
                    display: 'flex', flexDirection: 'column',
                    breakInside: 'auto', alignSelf: 'center', width: '100%'
                  }}>
                  <Conteudo></Conteudo>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot style={{ width: '100%' }}>
            <tr style={{ width: '100%' }}>
              <td style={{ width: '100%' }}>
                <Footer></Footer>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  };
  function Header() {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column', justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
          height: 100, width: '100%',
          fontFamily: 'Helvetica',
          breakInside: 'avoid',
        }}>
          <img
            alt=""
            src={logo}
            style={{
              margin: 0,
              height: 100,
              width: 100,
            }}
          ></img>
          <div className="text1" style={{ fontSize: 24, height: '', alignSelf: 'center' }}>
            {'SOLICITAÇÃO DE EXAMES LABORATORIAIS'}
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
            borderRadius: 5, backgroundColor: 'gray', color: 'white',
            padding: 10
          }}>
            <div>
              {moment().format('DD/MM/YY - HH:mm')}
            </div>
            <div style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
              fontSize: 20,
              fontFamily: 'Helvetica',
              breakInside: 'avoid',
            }}>
              {'LEITO: ' + atendimentos.filter(valor => valor.id_paciente == paciente && valor.situacao == 1).map(valor => valor.leito)}
            </div>
            <div>{'UNIDADE: ' + unidades.filter(item => item.id_unidade == unidade).map(item => item.nome_unidade)}</div>
            <div>{'ATENDIMENTO: ' + atendimento}</div>
          </div>
        </div>
        <div style={{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 22, marginTop: 10 }}>
          {'NOME CIVIL: ' + atendimentos.filter(valor => valor.id_atendimento == atendimento).map(valor => valor.nome_paciente)}
        </div>
        <div style={{ fontFamily: 'Helvetica', fontWeight: 'bold' }}>
          {'DN: ' + pacientes.filter(valor => valor.id_paciente == atendimentos.filter(valor => valor.id_atendimento == atendimento).map(valor => valor.id_paciente)).map(valor => moment(valor.dn_paciente).format('DD/MM/YYYY'))}
        </div>
        <div style={{ fontFamily: 'Helvetica', fontWeight: 'bold' }}>
          {'NOME DA MÃE: ' + pacientes.filter(valor => valor.id_paciente == atendimentos.filter(valor => valor.id_atendimento == atendimento).map(valor => valor.id_paciente)).map(valor => valor.nome_mae_paciente)}
        </div>
      </div>
    )
  }
  function Footer() {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        height: 100, width: '100%',
        fontFamily: 'Helvetica',
        breakInside: 'avoid',
      }}>
        <div className="text1">
          _______________________________________________
        </div>
        <div className="text1">
          {'PROFISSIONAL: ' + usuario.nome_usuario + ' - ' + usuario.conselho + '-' + usuario.n_conselho}
        </div>
      </div>
    )
  }
  function Conteudo() {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        fontFamily: 'Helvetica',
        breakInside: 'auto',
        whiteSpace: 'pre-wrap',
        marginTop: 20,
      }}>
        {laboratorio.filter(item => item.status == 1).map(item => (
          <div>{moment(item.data_pedido).format('DD/MM/YY - HH:mm') + ' - ' + item.nome_exame}</div>
        ))}
      </div>
    )
  }

  // componente para adição do exame laboratorial.
  const [viewinsertlaboratorio, setviewinsertlaboratorio] = useState();
  const [filterlaboratorio, setfilterlaboratorio] = useState("");
  var searchlaboratorio = "";
  const filterLaboratorio = () => {
    clearTimeout(timeout);
    document.getElementById("inputLaboratorio").focus();
    searchlaboratorio = document
      .getElementById("inputLaboratorio")
      .value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchlaboratorio == "") {
        setfilterlaboratorio("");
        setarrayopcoeslaboratorio(opcoeslaboratorio);
        document.getElementById("inputLaboratorio").value = "";
        setTimeout(() => {
          document.getElementById("inputLaboratorio").focus();
        }, 100);
      } else {
        setfilterlaboratorio(
          document.getElementById("inputLaboratorio").value.toUpperCase()
        );
        setarrayopcoeslaboratorio(
          opcoeslaboratorio.filter((item) =>
            item.nome_exame.includes(searchlaboratorio)
          )
        );
        document.getElementById("inputLaboratorio").value = searchlaboratorio;
        setTimeout(() => {
          document.getElementById("inputLaboratorio").focus();
        }, 100);
      }
    }, 1000);
  };
  // filtro de exame laboratorial por nome.
  function FilterLaboratorio() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: 20, marginBottom: 5 }}>
        <input
          className="input cor2"
          autoComplete="off"
          placeholder={
            window.innerWidth < 426 ? "BUSCAR EXAME..." : "BUSCAR..."
          }
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) =>
            window.innerWidth < 426
              ? (e.target.placeholder = "BUSCAR EXAME...")
              : "BUSCAR..."
          }
          onKeyUp={() => filterLaboratorio()}
          type="text"
          id="inputLaboratorio"
          defaultValue={filterlaboratorio}
          maxLength={100}
          style={{ width: "100%" }}
        ></input>
      </div>
    );
  }

  const InsertLaboratorio = useCallback(() => {
    return (
      <div className="fundo"
        onClick={(e) => { setviewinsertlaboratorio(0); e.stopPropagation() }}
        style={{ display: viewinsertlaboratorio == 1 ? 'flex' : 'none' }}>
        <div className="janela"
          onClick={(e) => e.stopPropagation()}
          style={{ flexDirection: 'column', position: 'relative' }}>
          <div className='text3' style={{ marginBottom: 20 }}>{tipoexame == 0 ? 'SOLICITAÇÃO DE EXAMES LABORATORIAIS' : 'SOLICITAÇÃO DE RX'}</div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div id="filtro e lista de opções de exames laboratoriais"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <FilterLaboratorio></FilterLaboratorio>
              <div id="botão de retorno"
                className="button-yellow"
                style={{
                  position: 'absolute',
                  top: 10, right: 10,
                  display: 'flex',
                  alignSelf: 'center',
                }}
                onClick={() => setviewinsertlaboratorio(0)}>
                <img
                  alt=""
                  src={back}
                  style={{ width: 30, height: 30 }}
                ></img>
              </div>
              <div className='scroll' style={{ height: 300, width: '40vw' }}>
                {arrayopcoeslaboratorio.filter(item => item.material != 'IMAGEM').map(item => (
                  <div style={{ display: tipoexame == 0 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center' }}>
                    <div className='button'
                      style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '50vw' }}
                    >
                      {item.nome_exame}
                    </div>
                    <div id="btnsalvarlaboratorio"
                      className='button-green'
                      onClick={() => {
                        let random = localStorage.getItem('random');
                        insertLaboratorio(item, random);
                      }}
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
                ))}
                {arrayopcoeslaboratorio.filter(item => item.material == 'IMAGEM').map(item => (
                  <div style={{ display: tipoexame == 1 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center' }}>
                    <div className='button'
                      style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '50vw' }}
                    >
                      {item.nome_exame}
                    </div>
                    <div id="btnsalvarlaboratorio"
                      className='button-green'
                      onClick={() => {
                        let random = Math.random();
                        // insertListaLaboratorio(random);
                        insertLaboratorio(item, random);
                      }}
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
                ))}
              </div>
            </div>
            <div style={{ display: tipoexame == 0 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>PACOTES DE EXAMES</div>
              <div id="packs para solicitação de exames"
                className='scroll'
                style={{
                  width: '20vw', marginLeft: 10, height: 330,
                  display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly'
                }}
              >
                <div className='button'
                  style={{ height: 100, width: 100, paddingLeft: 10, paddingRight: 10 }}
                  onClick={() => insertPackLaboratorio(['HEMOGRAMA COMPLETO', 'PROTEÍNA C REATIVA (PCR)', 'URÉIA', 'CREATININA', 'SÓDIO', 'POTÁSSIO'])}
                >
                  BÁSICO
                </div>
                <div className='button'
                  style={{ height: 100, width: 100, paddingLeft: 10, paddingRight: 10 }}
                  onClick={() => insertPackLaboratorio(['URÉIA', 'CREATININA', 'SÓDIO', 'POTÁSSIO'])}
                >
                  FUNÇÃO RENAL
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
    // eslint-disable-next-line
  }, [viewinsertlaboratorio, opcoeslaboratorio, arrayopcoeslaboratorio]);

  function Botoes() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <div id="botão para sair da tela de exames laboratoriais"
          className="button-yellow"
          style={{
            display: 'flex',
            alignSelf: 'center',
          }}
          onClick={() => setcard('')}>
          <img
            alt=""
            src={back}
            style={{ width: 30, height: 30 }}
          ></img>
        </div>
        <div id="botão para novo pedido de exame laboratorial"
          className='button-green'
          onClick={() => {
            let random = localStorage.setItem("random", Math.random());
            insertListaLaboratorio(random);
          }}
        >
          <img
            alt=""
            src={novo}
            style={{ width: 30, height: 30 }}
          ></img>
        </div>
      </div>
    )
  }

  function ListaLaboratorio() {
    return (
      <div id="scroll lista de pedidos de exames laboratoriais"
        className='scroll'
        style={{
          position: 'sticky',
          top: 5,
          width: '12vw', minWidth: '12vw', maxWidth: '12vw',
          height: 'calc(100vh - 115px)',
          margin: 5, marginTop: 10,
          backgroundColor: 'white',
          borderColor: 'white',
          alignSelf: 'flex-start',
        }}>
        {listalaboratorio.sort((a, b) => moment(a.data) > moment(b.data) ? -1 : 1).map((item) => (
          <div id={"pedido de laboratório " + item.id}
            className='button'
            style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              minHeight: 200,
            }}
            onClick={() => {
              localStorage.setItem('lista_laboratorio', JSON.stringify(item));
              setdono_documento({
                id: item.id_profissional,
                conselho: 'CRM: ' + item.registro_profissional,
                nome: item.nome_profissional,
              })
              settipodocumento('SOLICIAÇÃO DE EXAME LABORATORIAL');
              localStorage.setItem('random', item.random);
              loadLaboratorio(item.random);
              selector("scroll lista de pedidos de exames laboratoriais", "pedido de laboratorio " + item.id, 200);
            }}
          >
            <div id="conjunto de botoes do item de prescricao"
              style={{
                display: 'flex',
                flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
                pointerEvents: localStorage.getItem("id") != item.id ? 'none' : 'auto',
                opacity: localStorage.getItem("id") != item.id ? 0.5 : 1,
              }}>
              <div id="botão para excluir pedido de exame laboratorial e seus respectivos itens de exames laboratoriais."
                className='button-yellow'
                style={{
                  display: item.status == 0 ? 'flex' : 'none',
                  maxWidth: 30, width: 30, minWidth: 30,
                  maxHeight: 30, height: 30, minHeight: 30
                }}
                onClick={(e) => {
                  deleteListaLaboratorio(item);
                  deleteMassaItensLaboratorio(item.random);
                  e.stopPropagation()
                }}
              >
                <img
                  alt=""
                  src={deletar}
                  style={{ width: 25, height: 25 }}
                ></img>
              </div>
              <div id="botão para salvar pedido de exame laboratorial."
                style={{
                  display: item.status == 0 ? 'flex' : 'none',
                  maxWidth: 30, width: 30, minWidth: 30,
                  maxHeight: 30, height: 30, minHeight: 30
                }}
                className='button-green'
                onClick={(e) => {
                  updateListaLaboratorio(item, 1);
                  e.stopPropagation();
                }}
              >
                <img
                  alt=""
                  src={salvar}
                  style={{ width: 20, height: 20 }}
                ></img>
              </div>
              <div
                id="botão para imprimir pedido de exames laboratoriais"
                className='button-green'
                style={{
                  display: item.status > 0 ? 'flex' : 'none',
                  maxWidth: 30, width: 30, minWidth: 30,
                  maxHeight: 30, height: 30, minHeight: 30
                }}
                title={'IMPRIMIR PEDIDO DE EXAMES'}
                onClick={(e) => {
                  printDiv();
                  e.stopPropagation();
                }}>
                <img
                  alt=""
                  src={print}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                ></img>
              </div>
            </div>
            <div style={{ padding: 10, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 10 }}>
                {item.nome_profissional}
              </div>
              <div style={{ fontSize: 10, marginBottom: 5 }}>
                {item.registro_profissional}
              </div>
              <div>
                {moment(item.data).format('DD/MM/YY')}
              </div>
              <div>
                {moment(item.data).format('HH:mm')}
              </div>
            </div>
          </div>
        ))
        }
      </div >
    )
  }

  const [tipoexame, settipoexame] = useState(0);
  return (
    <div id="scroll-exames"
      className='card-aberto'
      style={{
        display: card == 'card-laboratorio' ? 'flex' : 'none',
        flexDirection: 'row', justifyContent: 'space-evenly',
      }}
    >
      <div id="lista de itens de exames laboratoriais"
        style={{ display: 'flex', flexDirection: 'column', width: '70vw' }}>
        <div className="button"
          title="CLIQUE PARA ALTERNAR ENTRE EXAMES LABORATORIAIS OU DE RX"
          style={{ width: '30vw', alignSelf: 'center' }}
          onClick={() => {
            if (tipoexame == 0) {
              settipoexame(1);
            } else {
              settipoexame(0);
            }
          }}
        >
          {tipoexame == 1 ? 'RX' : 'LABORATÓRIO'}
        </div>
        <div id="lista cheia"
          style={{
            display: laboratorio.length > 0 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}>
          {laboratorio.filter(item => item.material != 'IMAGEM').sort((a, b) => a.status < b.status ? 1 : -1 && moment(a.data_pedido) < moment(b.data_pedido) ? 1 : -1).map(item => (
            <div key={'laboratorio ' + item.id}
              style={{ display: tipoexame == 0 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center', width: '100%' }}
            >
              <div className="button-grey" style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 100,
                marginRight: 0,
                borderTopRightRadius: 0, borderBottomRightRadius: 0,
              }}>
                <div>
                  {moment(item.data_pedido).format('DD/MM/YY')}
                </div>
                <div>
                  {moment(item.data_pedido).format('HH:mm')}
                </div>
              </div>
              <div
                className="button" style={{
                  width: '100%',
                  marginLeft: 0,
                  borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
                }}
              >
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'flex-start', alignContent: 'flex-start',
                  alignItems: 'flex-start', width: '100%',
                }}>
                  <div style={{
                    display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',
                    width: '100%', margin: 5, textAlign: 'left'
                  }}>
                    <div>{item.nome_exame}</div>
                    <div style={{ opacity: 0.5, marginLeft: 5 }}>{'(' + item.material + ')'}</div>
                  </div>
                  <div
                    style={{
                      display: item.resultado == null ? 'none' : 'flex',
                      flexDirection: 'column', justifyContent: 'center',
                      textAlign: 'left',
                      margin: 5, color: 'yellow'
                    }}>
                    {item.resultado != null ? item.resultado : 'PENDENTE'}
                  </div>
                </div>
                <div className='button'
                  style={{
                    width: 150, margin: 5,
                    backgroundColor: item.status == 0 ? '#EC7063' : item.status == 1 ? '#F9E79F' : 'rgb(82, 190, 128, 0.7)',
                  }}>
                  {item.status == 0 ? 'A CONFIRMAR' : item.status == 1 ? 'SOLICITADO' : 'LIBERADO'}
                </div>
                <div className='button-red'
                  style={{
                    display: item.status == 0 ? 'flex' : 'none'
                  }}
                  onClick={(e) => {
                    deleteLaboratorio(item.id); e.stopPropagation()
                  }}>
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
          ))}
          {laboratorio.filter(item => item.material == 'IMAGEM').sort((a, b) => a.status < b.status ? 1 : -1 && moment(a.data_pedido) < moment(b.data_pedido) ? 1 : -1).map(item => (
            <div key={'imagem ' + item.id}
              style={{ display: tipoexame == 1 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center', width: '100%' }}
            >
              <div className="button-grey" style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 100,
                marginRight: 0,
                borderTopRightRadius: 0, borderBottomRightRadius: 0,
              }}>
                <div>
                  {moment(item.data_pedido).format('DD/MM/YY')}
                </div>
                <div>
                  {moment(item.data_pedido).format('HH:mm')}
                </div>
              </div>
              <div
                className="button" style={{
                  width: '100%',
                  marginLeft: 0,
                  borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
                }}
              >
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'flex-start', alignContent: 'flex-start',
                  alignItems: 'flex-start', width: '100%',
                }}>
                  <div style={{
                    display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',
                    width: '100%', margin: 5, textAlign: 'left'
                  }}>
                    <div>{item.nome_exame}</div>
                    <div style={{ opacity: 0.5, marginLeft: 5 }}>{'(' + item.material + ')'}</div>
                  </div>
                  <div
                    style={{
                      display: item.resultado == null ? 'none' : 'flex',
                      flexDirection: 'column', justifyContent: 'center',
                      textAlign: 'left',
                      margin: 5, color: 'yellow'
                    }}>
                    {item.resultado != null ? item.resultado : 'PENDENTE'}
                  </div>
                </div>
                <div className='button'
                  style={{
                    width: 150, margin: 5,
                    backgroundColor: item.status == 0 ? '#EC7063' : item.status == 1 ? '#F9E79F' : 'rgb(82, 190, 128, 0.7)',
                  }}>
                  {item.status == 0 ? 'A CONFIRMAR' : item.status == 1 ? 'SOLICITADO' : 'LIBERADO'}
                </div>
                <div className='button-red'
                  style={{
                    display: item.status == 0 ? 'flex' : 'none'
                  }}
                  onClick={(e) => {
                    deleteLaboratorio(item.id); e.stopPropagation()
                  }}>
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
          ))}
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div id="botão para inserir exame laboratorial."
              className='button-green'
              style={{
                display: 'flex'
              }}
              onClick={(e) => {
                loadOpcoesLaboratorio();
                setviewinsertlaboratorio(1);
              }}>
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
            <div id="botão para imprimir exames laboratoriais solicitados."
              className='button-green'
              style={{
                display: laboratorio.filter(item => item.status == 0).length > 0 ? 'flex' : 'none',
              }}
              onClick={() => {
                assinarPedidos();
              }}>
              <img
                alt=""
                src={print}
                style={{
                  margin: 10,
                  height: 25,
                  width: 25,
                }}
              ></img>
            </div>
            <div id="botão para sair da tela de exames laboratoriais"
              className="button-yellow"
              style={{
                display: 'flex',
                alignSelf: 'center',
              }}
              onClick={() => setcard('')}>
              <img
                alt=""
                src={back}
                style={{ width: 30, height: 30 }}
              ></img>
            </div>
          </div>
        </div>
        <div id="lista vazia"
          style={{
            display: laboratorio.length > 0 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}>
          <div id="conteúdo vazio"
            style={{
              display: laboratorio.length == 0 ? "flex" : "none",
              flexDirection: "row",
              justifyContent: 'center',
              flexWrap: "wrap",
              width: '65vw',
            }}
          >
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
      </div>
      <div id='lista de pedidos de exames laboratoriais'
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <Botoes></Botoes>
        <ListaLaboratorio></ListaLaboratorio>
      </div>
      <InsertLaboratorio></InsertLaboratorio>
      <PrintLaboratorio></PrintLaboratorio>
    </div>
  )
}

export default Laboratorio;
