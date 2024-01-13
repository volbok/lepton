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
  } = useContext(Context);

  useEffect(() => {
    if (card == 'card-laboratorio') {
      loadOpcoesLaboratorio();
      loadLaboratorio();
    }
    // eslint-disable-next-line
  }, [card]);

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

  // atualizar lista de exames laboratoriais para o atendimento.
  const loadLaboratorio = () => {
    axios.get(html + 'atendimento_laboratorio/' + atendimento).then((response) => {
      setlaboratorio(response.data.rows);
    })
  }

  // deletar pedido de exame laboratorial.
  const deleteLaboratorio = (id) => {
    axios.get(html + 'delete_laboratorio/' + id).then(() => {
      loadLaboratorio();
    })
  }

  // inserir pedido de exame de laboratorio.
  const insertLaboratorio = (item) => {
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
      profissional: usuario.id
    }
    axios.post(html + 'insert_laboratorio', obj).then(() => {
      console.log(obj);
      loadLaboratorio();
      setviewinsertlaboratorio(0);
    })
  }

  const insertPackLaboratorio = (array) => {
    console.log(array.map(item => item));
    // eslint-disable-next-line
    array.map(item => {
      opcoeslaboratorio.filter(valor => valor.nome_exame == item).map(item => insertLaboratorio(item));
    })
  }

  // atualizar pedido de exame de laboratorio.
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
    }
    axios.post(html + 'update_laboratorio/' + item.id, obj).then(() => {
      loadLaboratorio();
      setviewinsertlaboratorio(0);
    })
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
    })
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
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
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
          <div className='text3' style={{ marginBottom: 20 }}>SOLICITAÇÃO DE EXAMES LABORATORIAIS</div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div id="filtro e lista de opções de exames laboratoriais"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <FilterLaboratorio></FilterLaboratorio>
              <div id="botão de retorno"
                className="button-red"
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
                {arrayopcoeslaboratorio.map(item => (
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <div className='button'
                      style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '50vw' }}
                    >
                      {item.nome_exame}
                    </div>
                    <div id="btnsalvarlaboratorio"
                      className='button-green'
                      onClick={() => insertLaboratorio(item)}
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
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>PACOTES DE EXAMES</div>
              <div id="packs para solicitação de exames"
                className='scroll'
                style={{
                  width: '40vw', marginLeft: 10, height: 330,
                  display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly'
                }}
              >
                <div className='button'
                  style={{ height: 100, width: 100, paddingLeft: 10, paddingRight: 10 }}
                  onClick={() => insertPackLaboratorio(['HEMOGRAMA COMPLETO', 'PROTEÍNA C REATIVA (PCR)', 'URÉIA', 'CREATININA', 'SÓDIO', 'POTÁSSIO'])}
                >
                  BÁSICO
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
    // eslint-disable-next-line
  }, [viewinsertlaboratorio, opcoeslaboratorio, arrayopcoeslaboratorio]);

  return (
    <div id="scroll-alergias"
      className='card-aberto'
      style={{ display: card == 'card-laboratorio' ? 'flex' : 'none' }}
    >
      <div className="text3">EXAMES LABORATORIAIS</div>
      <div
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}>
        {laboratorio.sort((a, b) => a.status < b.status ? 1 : -1 && moment(a.data_pedido) < moment(b.data_pedido) ? 1 : -1).map(item => (
          <div key={'laboratorio ' + item.id_alergia}
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}
          >
            <div className="button-yellow" style={{
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
              <div className={item.status == 0 ? 'button-red' : item.status == 1 ? 'button-yellow' : 'button-green'}
                style={{
                  width: 150, margin: 5,
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
      <InsertLaboratorio></InsertLaboratorio>
      <PrintLaboratorio></PrintLaboratorio>
    </div >
  )
}

export default Laboratorio;
