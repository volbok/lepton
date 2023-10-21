/* eslint eqeqeq: "off" */
import React, { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
import moment from 'moment';
// funções.
import toast from '../functions/toast';
import modal from '../functions/modal';
import checkinput from '../functions/checkinput';
// import filter from '../functions/filter';
// imagens.
import logo from '../images/logo.svg';
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import novo from '../images/novo.svg';
import copiar from '../images/copiar.svg';
import back from '../images/back.svg';
import imprimir from "../images/imprimir.svg";
// componentes.
import Gravador from '../components/Gravador';
// pdf.

function Evolucoes() {

  // context.
  const {
    html,
    settoast, setdialogo,
    usuario, // objeto com {id e nome_usuario}.
    usuarios,
    atendimento, // id_atendimento.
    atendimentos,
    pacientes,
    paciente,
    unidades,
    evolucoes, setevolucoes,
    arrayevolucoes, setarrayevolucoes,
    card, setcard,
  } = useContext(Context);

  useEffect(() => {
    if (card == 'card-evolucoes') {
      loadEvolucoes();
    }
    // eslint-disable-next-line
  }, [card]);

  // carregando as evoluções do atendimento.
  const loadEvolucoes = () => {
    axios.get(html + 'list_evolucoes/' + atendimento).then((response) => {
      setevolucoes(response.data.rows);
      setarrayevolucoes(response.data.rows);
    });
  }

  // atualizando uma evolução.
  const [evolucao, setevolucao] = useState(0);
  const updateEvolucao = (item) => {
    var obj = {
      id_atendimento: item.id_atendimento,
      evolucao: document.getElementById(selectedinput).value.toUpperCase(),
      data_evolucao: item.data_evolucao,
      id_usuario: item.id_usuario,
    }
    axios.post(html + 'update_evolucao/' + item.id_evolucao, obj).then(() => {
      loadEvolucoes();
      // toast(settoast, 'DADOS DA EVOLUÇÃO ATUALIZADOS COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
    })
  }

  // inserindo uma evolução.
  const insertEvolucao = () => {
    var obj = {
      id_atendimento: atendimento,
      evolucao: document.getElementById("inputEvolucao").value.toUpperCase(),
      data_evolucao: moment(),
      id_usuario: usuario.id,
    }
    axios.post(html + 'insert_evolucao', obj).then(() => {
      loadEvolucoes();
      setviewinsertevolucao(0);
      toast(settoast, 'EVOLUÇÃO REGISTRADA COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
    })
  }

  const copyEvolucao = (item) => {
    var obj = {
      id_atendimento: atendimento,
      evolucao: item.evolucao,
      data_evolucao: moment(),
      id_usuario: usuario.id,
    }
    axios.post(html + 'insert_evolucao', obj).then(() => {
      loadEvolucoes();
      setviewinsertevolucao(0);
      toast(settoast, 'EVOLUÇÃO COPIADA COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
    })
  }

  // inserindo uma evolução.
  const insertVoiceEvolucao = ([evolucao]) => {
    var obj = {
      id_atendimento: atendimento,
      evolucao: evolucao,
      data_evolucao: moment(),
      id_usuario: usuario.id,
    }
    axios.post(html + 'insert_evolucao', obj).then(() => {
      loadEvolucoes();
      setviewinsertevolucao(0);
      toast(settoast, 'EVOLUÇÃO REGISTRADA COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
    })
  }

  // excluir uma evolução.
  const deleteEvolucao = (evolucao) => {
    axios.get(html + 'delete_evolucao/' + evolucao.id_evolucao).then(() => {
      loadEvolucoes();
      toast(settoast, 'EVOLUÇÃO EXCLUÍDA COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
    })
  }

  // impressão da evolução.
  const [titulo, settitulo] = useState(null);
  const [especialidade, setespecialidade] = useState(null);
  const [conselho, setconselho] = useState(null);
  const [numeroconselho, setnumeroconselho] = useState(null);
  const [profissional, setprofissional] = useState(null);
  const printEvolucao = (item) => {

    document.getElementById("evolucaoToPrint").style.display = "flex";

    setespecialidade(usuarios.filter(valor => valor.id_usuario == item.id_usuario).map(item => item.tipo_usuario));
    setconselho(usuarios.filter(valor => valor.id_usuario == item.id_usuario).map(item => item.conselho));
    setnumeroconselho(usuarios.filter(valor => valor.id_usuario == item.id_usuario).map(item => item.n_conselho));
    setprofissional(usuarios.filter(valor => valor.id_usuario == item.id_usuario).map(item => item.nome_usuario));


    if (especialidade == 'MÉDICO') {
      settitulo('EVOLUÇÃO MÉDICA');
    } else if (especialidade == 'FISIOTERAPEUTA') {
      settitulo('EVOLUÇÃO DA FISIOTERAPIA');
    } else if (especialidade == 'ENFERMERIRO') {
      settitulo('EVOLUÇÃO DA ENFERMAGEM');
    } else if (especialidade == 'TERAPEUTA OCUPACIONAL') {
      settitulo('EVOLUÇÃO DA TERAPIA OCUPACIONAL');
    } else if (especialidade == 'TÉCNICO DE ENFERMAGEM') {
      settitulo('EVOLUÇÃO DO TÉCNICO DE ENFERMAGEM');
    } else if (especialidade == 'PSICOLOGIA') {
      settitulo('EVOLUÇÃO DA PSICOLOGIA');
    } else if (especialidade == 'NUTRICIONISTA') {
      settitulo('EVOLUÇÃO DA NUTRIÇÃO');
    } else if (especialidade == 'ASSISTENTE SOCIAL') {
      settitulo('EVOLUÇÃO DA ASSISTÊNCIA SOCIAL');
    } else {
      settitulo('EVOLUÇÃO LIVRE');
    }

    setTimeout(() => {
      let printdocument = document.getElementById("evolucaoToPrint").innerHTML;
      let a = window.open(' ', 'IMPRIMIR EVOLUÇÃO', ' ');
      a.document.write('<html>');
      a.document.write(printdocument);
      a.document.write('</html>');
      a.print();

      setTimeout(() => {
        document.getElementById("evolucaoToPrint").style.display = "none";
      }, 1000);

    }, 1000);
  }

  function LoadHtml() {

    /* tipos de usuários:
    MÉDICO
    FISIOTERAPEUTA
    ENFERMEIRO
    TERAPEUTA OCUPACIONAL
    TÉCNICO DE ENFERMAGEM
    PSICÓLOGO
    NUTRICIONISTA
    ASSISTENTE SOCIAL
    */

    return (
      <div id="evolucaoToPrint"
        className='toasty'
        style={{
          position: 'sticky',
          top: 10,
          left: 20, right: 20,
          display: 'none',
          backgroundColor: 'white',
          borderRadius: 5,
          padding: 20,
          zIndex: 1000,
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <table>
          <thead>
            <tr>
              <td style={{ position: 'relative', width: '100%', height: 150 }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0, bottom: 0, left: 0, right: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderStyle: 'solid',
                    borderColor: 'black',
                    borderWidth: 1,
                    borderRadius: 5,
                    fontFamily: 'Helvetica',
                    paddingRight: 5, paddingLeft: 5
                  }}>
                  <div id="logo, identificação do documento e do setor"
                    style={{
                      display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', position: 'relative',
                    }}>
                    <img
                      alt=""
                      src={logo}
                      style={{ width: 75, height: 75, margin: 10 }}
                    ></img>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>{titulo}</div>
                    <div
                      style={{
                        display: 'flex',
                        position: 'absolute',
                        top: 5, right: 5,
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        backgroundColor: 'grey',
                        borderRadius: 5,
                        margin: 5,
                        padding: 10,
                        alignSelf: 'center',
                      }}
                    >
                      <div>{atendimentos.filter(valor => valor.id_atendimento == atendimento).map(item => 'UNIDADE: ' + unidades.filter(valor => valor.id_unidade == item.id_unidade).map(valor => valor.nome_unidade))}</div>
                      <div>{atendimentos.filter(valor => valor.id_atendimento == atendimento).map(item => 'LEITO: ' + item.leito)}</div>
                    </div>
                  </div>
                  <div id="identificação do paciente"
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', margin: 5 }}>
                    <div>{'NOME DO PACIENTE: ' + pacientes.filter(valor => valor.id_paciente == paciente).map(item => item.nome_paciente)}</div>
                    <div style={{ marginTop: 5 }}>{'DN: ' + moment(pacientes.filter(valor => valor.id_paciente == paciente).map(item => item.dn_paciente)).format('DD/MM/YYYY') + ' - ' + moment().diff(moment(pacientes.filter(valor => valor.id_paciente == paciente).map(item => item.dn_paciente)), 'years') + ' ANOS'}</div>
                  </div>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ width: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: 10, margin: 10,
                    fontFamily: 'Helvetica',
                    width: 700,
                  }}
                >{evolucao.evolucao}</div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td style={{ position: 'relative', width: '100%', height: 100 }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0, bottom: 0, left: 0, right: 0,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    borderStyle: 'solid',
                    borderColor: 'black',
                    borderWidth: 1,
                    borderRadius: 5,
                    fontFamily: 'Helvetica',
                    margin: 0, padding: 0,
                  }}>
                  <div style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    alignContent: 'center', alignSelf: 'center',
                    alignItems: 'center',
                  }}>
                    <div>_______________________________________</div>
                    <div style={{ margin: 5 }}>{profissional}</div>
                    <div>{especialidade + ' - ' + conselho + " " + numeroconselho}</div>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div >
    )
  }

  // registro de textarea por voz.
  const [selectedinput, setselectedinput] = useState(null);
  function Botoes() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div id="botão de retorno"
          className="button-red"
          style={{
            display: 'flex',
            width: 50, height: 50,
          }}
          onClick={() => setcard('')}>
          <img
            alt=""
            src={back}
            style={{ width: 30, height: 30 }}
          ></img>
        </div>
        <Gravador funcao={insertVoiceEvolucao} continuo={true}></Gravador>
        <div id="btnsalvarevolucao"
          className='button-green'
          style={{ width: 50, height: 50 }}
          onClick={(e) => {
            setviewinsertevolucao(1);
            e.stopPropagation();
          }}
        >
          <img
            alt=""
            src={novo}
            style={{
              margin: 10,
              height: 30,
              width: 30,
            }}
          ></img>
        </div>
      </div>
    );
  }

  const [viewinsertevolucao, setviewinsertevolucao] = useState(0);
  const InsertEvolucao = useCallback(() => {
    return (
      <div className="fundo" style={{ display: viewinsertevolucao == 1 ? 'flex' : 'none' }}
        onClick={(e) => { setviewinsertevolucao(0); e.stopPropagation() }}>
        <div className="janela" onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className='text3'>EVOLUÇÃO</div>
          <textarea
            className="textarea"
            placeholder='EVOLUÇÃO...'
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'EVOLUÇÃO...')}
            defaultValue={evolucao.evolucao}
            style={{
              display: 'flex',
              flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
              whiteSpace: 'pre-wrap',
              width: window.innerWidth < 426 ? '70vw' : '50vw',
              height: '60vh',
            }}
            id="inputEvolucao"
            title="EVOLUÇÃO."
          >
          </textarea>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div id="botão de retorno"
              className="button-red"
              style={{
                display: 'flex',
                alignSelf: 'center',
              }}
              onClick={() => setviewinsertevolucao(0)}>
              <img
                alt=""
                src={back}
                style={{ width: 30, height: 30 }}
              ></img>
            </div>
            <div id='btnsalvarevolucao' className='button-green'
              onClick={() => checkinput('textarea', settoast, ['inputEvolucao'], "btnsalvarevolucao", insertEvolucao, [])}
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
      </div >
    )
    // eslint-disable-next-line
  }, [viewinsertevolucao]);

  function FilterEvolucoes() {
    return (
      <div className='input-special'
        style={{
          position: 'sticky',
          top: window.innerWidth < 426 ? 70 : 10,
          display: 'flex', alignSelf: 'center',
          zIndex: 20,
        }}>
        <input
          className="input"
          autoComplete="off"
          placeholder="BUSCAR NAS EVOLUÇÕES..."
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'BUSCAR NAS EVOLUÇÕES...')}
          onClick={(e) => e.stopPropagation()}
          onKeyUp={(e) => {
            filterEvolucao();
            e.stopPropagation();
          }}
          type="text"
          id="inputFilterEvolucao"
          defaultValue={filterevolucao}
          maxLength={100}
          style={{ margin: 5, width: window.innerWidth < 426 ? '65vw' : '30vw' }}
        ></input>
      </div>
    )
  }

  const [filterevolucao, setfilterevolucao] = useState('');
  var searchevolucao = '';
  const filterEvolucao = () => {
    clearTimeout(timeout);
    searchevolucao = document.getElementById("inputFilterEvolucao").value.toUpperCase();
    timeout = setTimeout(() => {
      document.getElementById("inputFilterEvolucao").blur();
      setTimeout(() => {
        if (searchevolucao == '') {
          setfilterevolucao('');
          setarrayevolucoes(evolucoes);
          document.getElementById("inputFilterEvolucao").value = '';
          document.getElementById("inputFilterEvolucao").focus();
        } else {
          setfilterevolucao(document.getElementById("inputFilterEvolucao").value.toUpperCase());
          if (evolucoes.filter(item => item.evolucao.includes(searchevolucao)).length > 0) {
            setarrayevolucoes(evolucoes.filter(item => item.evolucao.includes(searchevolucao)));
          } else {
            setarrayevolucoes(evolucoes.filter(item => moment(item.data_evolucao).format('DD/MM/YYYY').includes(searchevolucao)));
          }
          document.getElementById("inputFilterEvolucao").value = searchevolucao;
          document.getElementById("inputFilterEvolucao").focus();
        }
      }, 500);
    }, 1000);
  }

  var timeout = null;
  return (
    <div id="scroll-evolucoes"
      className='card-aberto'
      style={{ display: card == 'card-evolucoes' ? 'flex' : 'none' }}
    >
      <div className="text3">
        EVOLUÇÕES
      </div>
      <Botoes></Botoes>
      <div
        style={{
          position: 'relative', display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-start',
          flex: 1
        }}>
        <FilterEvolucoes></FilterEvolucoes>
        {arrayevolucoes.sort((a, b) => moment(a.data_evolucao) < moment(b.data_evolucao) ? 1 : -1).map((item) => (
          <div
            key={'evolução ' + item.id_evolucao}
            className='row'
            style={{
              margin: 5,
              height: '100%',
              flexDirection: window.innerWidth < 426 ? 'column' : 'row',
            }}
          >
            <div style={{
              display: 'flex', flexDirection: window.innerWidth < 426 ? 'column' : 'row',
              justifyContent: 'center',
              flex: 5,
            }}>
              <div id="identificador"
                className='button'
                style={{
                  flex: 1,
                  flexDirection: window.innerWidth < 426 ? 'row' : 'column',
                  justifyContent: window.innerWidth < 426 ? 'space-between' : 'center',
                  alignSelf: 'center',
                  margin: 5, padding: 5,
                  width: window.innerWidth < 426 ? '95%' : '',
                  height: 'calc(100% - 20px)',
                  marginBottom: window.innerWidth < 426 ? 0 : 5,
                  marginRight: window.innerWidth < 426 ? 5 : 0,
                  borderTopLeftRadius: window.innerWidth < 426 ? 5 : 5,
                  borderTopRightRadius: window.innerWidth < 426 ? 5 : 0,
                  borderBottomLeftRadius: window.innerWidth < 426 ? 0 : 5,
                  borderBottomRightRadius: window.innerWidth < 426 ? 0 : 0,
                }}>
                <div style={{
                  display: window.innerWidth < 426 ? 'none' : 'flex',
                  flexDirection: window.innerWidth < 426 ? 'row' : 'column',
                  justifyContent: window.innerWidth < 426 ? 'space-between' : 'center',
                }}>
                  <div className='text2' style={{ color: '#ffffff' }}>{moment(item.data_evolucao).format('DD/MM/YY')}</div>
                  <div className='text2' style={{ color: '#ffffff', marginTop: 5 }}>{usuarios.filter(valor => valor.id_usuario == item.id_usuario).map(valor => valor.nome_usuario)}</div>
                  <div className='text2' style={{ color: '#ffffff', marginTop: 0, marginBottom: 0 }}>{usuarios.filter(valor => valor.id_usuario == item.id_usuario).map(valor => valor.tipo_usuario)}</div>
                  <div className='text2' style={{ color: '#ffffff', marginTop: 0, marginBottom: 10 }}>{usuarios.filter(valor => valor.id_usuario == item.id_usuario).map(valor => valor.conselho + ' - ' + valor.n_conselho)}</div>
                </div>
                <div style={{
                  display: window.innerWidth < 426 ? 'flex' : 'none',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div className='text2' style={{ color: '#ffffff' }}>{moment(item.data_evolucao).format('DD/MM/YY - HH:mm')}</div>
                  <div className='text2' style={{ color: '#ffffff' }}>{usuarios.filter(valor => valor.id_usuario == item.id_usuario).map(valor => valor.nome_usuario)}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <div className='button-red'
                    style={{
                      display: item.id_usuario == usuario.id ? 'flex' : 'none',
                      width: 25, minWidth: 25, height: 25, minHeight: 25
                    }}
                    onClick={(e) => {
                      modal(setdialogo, 'CONFIRMAR EXCLUSÃO DA EVOLUÇÃO ?', deleteEvolucao, item);
                      e.stopPropagation();
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
                  <div className='button-green'
                    style={{ width: 25, minWidth: 25, height: 25, minHeight: 25 }}
                    onClick={(e) => {
                      copyEvolucao(item);
                      e.stopPropagation();
                    }}>
                    <img
                      alt=""
                      src={copiar}
                      style={{
                        margin: 10,
                        height: 25,
                        width: 25,
                      }}
                    ></img>
                  </div>
                  <div className='button-green'
                    style={{ width: 25, minWidth: 25, height: 25, minHeight: 25 }}
                    onClick={(e) => {
                      setevolucao(item);
                      printEvolucao(item);
                      e.stopPropagation();
                    }}>
                    <img
                      alt=""
                      src={imprimir}
                      style={{
                        margin: 10,
                        height: 25,
                        width: 25,
                      }}
                    ></img>
                  </div>
                </div>
              </div>
              <textarea id={"inputEvolucao " + item.id_evolucao}
                className="textareadynamics"
                placeholder='EVOLUÇÃO...'
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'INSERIR EVOLUÇÃO...')}
                defaultValue={item.evolucao}
                onClick={(e) => { setevolucao(item); setselectedinput("inputEvolucao " + item.id_evolucao); e.stopPropagation() }}
                onKeyUp={(e) => {
                  clearTimeout(timeout);
                  timeout = setTimeout(() => {
                    if (document.getElementById("inputEvolucao " + item.id_evolucao).value != '') {
                      document.getElementById("inputEvolucao " + item.id_evolucao).blur();
                      updateEvolucao(item);
                    }
                    e.stopPropagation();
                  }, 2000);
                }}
                style={{
                  flex: window.innerWidth < 426 ? 1 : 4,
                  display: 'flex',
                  flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                  whiteSpace: 'pre-wrap',
                  margin: 5, padding: 5,
                  width: window.innerWidth < 426 ? 'calc(95% - 10px)' : '',
                  minHeight: window.innerWidth < 426 ? 180 : 160,
                  maxHeight: window.innerWidth < 426 ? '80vh' : '60vh',
                  borderTopLeftRadius: window.innerWidth < 426 ? 0 : 0,
                  borderTopRightRadius: window.innerWidth < 426 ? 0 : 5,
                  borderBottomLeftRadius: window.innerWidth < 426 ? 5 : 0,
                  borderBottomRightRadius: window.innerWidth < 426 ? 5 : 5,
                  marginTop: window.innerWidth < 426 ? 0 : 5,
                  marginLeft: window.innerWidth < 426 ? 5 : 0,
                }}
                title="EVOLUÇÃO."
              >
              </textarea>
            </div>
          </div>
        ))}
        <InsertEvolucao></InsertEvolucao>
        <LoadHtml></LoadHtml>
      </div>
    </div>
  )
}

export default Evolucoes;