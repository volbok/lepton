/* eslint eqeqeq: "off" */
import React, { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
import moment from 'moment';
// funções.
import toast from '../functions/toast';
import modal from '../functions/modal';
import checkinput from '../functions/checkinput';
// imagens.
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import novo from '../images/novo.svg';
import back from '../images/back.svg';
// componentes.
import Gravador from '../components/Gravador';

function Antibioticos() {

  // context.
  const {
    html,
    settoast, setdialogo,
    atendimento, // id_atendimento.
    antibioticos, setantibioticos,
    arrayantibioticos, setarrayantibioticos,
    card, setcard,
  } = useContext(Context);

  useEffect(() => {
    if (card == 'card-antibioticos') {
      loadAntibioticos();
    }
    // eslint-disable-next-line
  }, [card]);

  // carregando os antibióticos do atendimento.
  const loadAntibioticos = () => {
    axios.get(html + 'list_antibioticos/' + atendimento).then((response) => {
      setantibioticos(response.data.rows);
      setarrayantibioticos(response.data.rows);
    });
  }

  // atualizando um antibiótico.
  /*
  const updateAntibiotico = (item) => {
    var obj = null;
    if (viewinsertantibiotico == 1) {
      obj = {
        id_atendimento: item.id_atendimento,
        antibiotico: document.getElementById('inputAntibiotico').value.toUpperCase(),
        data_inicio: moment(document.getElementById('inputInicio').value, 'DD/MM/YYYY'),
        data_termino: moment(document.getElementById('inputTermino').value, 'DD/MM/YYYY'),
        prazo: moment(moment().add(document.getElementById('inputDias').value), 'days'),
      }
    } else {
      obj = {
        id_atendimento: item.id_atendimento,
        antibiotico: document.getElementById('inputAntibiotico ' + antibiotico.id_antibiotico).value.toUpperCase(),
        data_inicio: moment(document.getElementById('inputInicio ' + antibiotico.id_antibiotico).value, 'DD/MM/YYYY'),
        data_termino: moment(document.getElementById('inputTermino ' + antibiotico.id_antibiotico).value, 'DD/MM/YYYY'),
        prazo: moment(moment().add(document.getElementById('inputDias ' + antibiotico.id_antibiotico).value), 'days'),
      }
    }
    axios.post(html + 'update_antibiotico/' + item.id_antibiotico, obj).then(() => {
      loadAntibioticos();
      toast(settoast, 'DADOS DO ANTIBIÓTICO ATUALIZADOS COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
    })
  }
  */

  // inserindo um antibiótico.
  const insertAntibiotico = () => {
    var obj = {
      id_atendimento: atendimento,
      antibiotico: document.getElementById('inputAntibiotico').value.toUpperCase(),
      data_inicio: moment(document.getElementById('inputInicio').value, 'DD/MM/YYYY'),
      data_termino: null,
      prazo: moment().add(document.getElementById('inputDias').value, 'days'),
    }
    axios.post(html + 'insert_antibiotico', obj).then(() => {
      loadAntibioticos();
      setviewinsertantibiotico(0);
      toast(settoast, 'ANTIBIÓTICO REGISTRADO COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
    })
  }

  // inserindo um antibiótico por voz.
  const insertVoiceAntibiotico = ([atb]) => {
    var obj = {
      id_atendimento: atendimento,
      antibiotico: atb,
      data_inicio: moment(),
      data_termino: null,
      prazo: moment().add(7, 'days'),
    }
    axios.post(html + 'insert_antibiotico', obj).then((response) => {
      loadAntibioticos();
      setviewinsertantibiotico(0);
      toast(settoast, 'ANTIBIÓTICO REGISTRADO COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
      console.log(response);
    })
  }

  // excluir um antibiótico.
  const deleteAntibiotico = (antibiotico) => {
    axios.get(html + 'delete_antibiotico/' + antibiotico.id_antibiotico).then(() => {
      loadAntibioticos();
      toast(settoast, 'ANTIBIÓTICO EXCLUÍDO COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
    })
  }

  // registro de textarea por voz.
  function Botoes() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div id="botão de retorno"
          className="button-red"
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
        <Gravador funcao={insertVoiceAntibiotico} continuo={false}></Gravador>
        <div id="btnsalvarcultura"
          className='button-green'
          style={{
            display: 'flex',
            alignSelf: 'center',
          }}
          onClick={(e) => {
            setviewinsertantibiotico(1);
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

  const [viewinsertantibiotico, setviewinsertantibiotico] = useState(0);
  const InsertAntibiotico = useCallback(() => {
    var timeout = null;
    return (
      <div className="fundo" style={{ display: viewinsertantibiotico == 1 ? 'flex' : 'none' }}
        onClick={(e) => { setviewinsertantibiotico(0); e.stopPropagation() }}>
        <div className="janela" onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div id="campos" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div id="antibiótico" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>ANTIBIÓTICO</div>
              <input
                className="input"
                autoComplete="off"
                placeholder='ANTIBIÓTICO...'
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'ANTIBIÓTICO...')}
                style={{
                  display: 'flex',
                  flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                  whiteSpace: 'pre-wrap',
                  width: window.innerWidth < 426 ? '70vw' : '40vw',
                }}
                id="inputAntibiotico"
                title="ANTIBIÓTICO."
              >
              </input>
            </div>
            <div id="data de início" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>DATA DE INÍCIO</div>
              <input
                autoComplete="off"
                placeholder="DATA"
                className="input"
                type="text"
                maxLength={10}
                inputMode='numeric'
                id={"inputInicio"}
                title="FORMATO: DD/MM/YYYY"
                onClick={() => document.getElementById("inputInicio").value = ''}
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'DATA')}
                onKeyUp={() => {
                  var x = document.getElementById("inputInicio").value;
                  if (x.length == 2) {
                    x = x + '/';
                    document.getElementById("inputInicio").value = x;
                  }
                  if (x.length == 5) {
                    x = x + '/'
                    document.getElementById("inputInicio").value = x;
                  }
                  clearTimeout(timeout);
                  var date = moment(document.getElementById("inputInicio").value, 'DD/MM/YYYY', true);
                  timeout = setTimeout(() => {
                    if (date.isValid() == false) {
                      toast(settoast, 'DATA INVÁLIDA', 'rgb(231, 76, 60, 1)', 3000);
                      document.getElementById("inputInicio").value = '';
                    } else {
                      document.getElementById("inputInicio").value = moment(date).format('DD/MM/YYYY');
                    }
                  }, 3000);
                }}
                defaultValue={moment().format('DD/MM/YYYY')}
                style={{
                  flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                  width: window.innerWidth < 426 ? '70vw' : '10vw',
                }}
              ></input>
            </div>
            <div id="dias de uso" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>DIAS DE USO</div>
              <input
                className="input"
                autoComplete="off"
                type="text"
                inputMode='numeric'
                maxLength={2}
                placeholder='DIAS...'
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'DIAS...')}
                style={{
                  display: 'flex',
                  flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                  whiteSpace: 'pre-wrap',
                  width: window.innerWidth < 426 ? '70vw' : '10vw',
                }}
                id="inputDias"
                title="DIAS DE USO."
              >
              </input>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <div id="botão de retorno"
                className="button-red"
                style={{
                  display: 'flex',
                  alignSelf: 'center',
                }}
                onClick={() => setviewinsertantibiotico(0)}>
                <img
                  alt=""
                  src={back}
                  style={{ width: 30, height: 30 }}
                ></img>
              </div>
              <div id='btnsalvarantibiotico' className='button-green' style={{ maxWidth: 50, alignSelf: 'center' }}
                onClick={() => checkinput('input', settoast, ['inputAntibiotico', 'inputInicio', 'inputDias'], "btnsalvarantibiotico", insertAntibiotico, [])}
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
      </div>
    )
    // eslint-disable-next-line
  }, [viewinsertantibiotico]);

  var timeout = null;
  const [filterantibiotico, setfilterantibiotico] = useState('');
  var searchantibiotico = '';
  const filterAntibiotico = () => {
    clearTimeout(timeout);
    searchantibiotico = document.getElementById("inputFilterAntibiotico").value.toUpperCase();
    timeout = setTimeout(() => {
      document.getElementById("inputFilterAntibiotico").blur();
      setTimeout(() => {
        if (searchantibiotico == '') {
          setfilterantibiotico('');
          setarrayantibioticos(antibioticos);
          document.getElementById("inputFilterAntibiotico").value = '';
        } else {
          setfilterantibiotico(document.getElementById("inputFilterAntibiotico").value.toUpperCase());
          setarrayantibioticos(antibioticos.filter(item => item.antibiotico.includes(searchantibiotico)));
          document.getElementById("inputFilterAntibiotico").value = searchantibiotico;
        }
      }, 500);
    }, 1000);
  }

  function FilterAntibioticos() {
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
          placeholder="BUSCAR NOS ANTIBIÓTICOS..."
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'BUSCAR NOS ANTIBIÓTICOS...')}
          onClick={(e) => e.stopPropagation()}
          onKeyUp={(e) => { filterAntibiotico(); e.stopPropagation() }}
          type="text"
          id="inputFilterAntibiotico"
          defaultValue={filterantibiotico}
          maxLength={100}
          style={{ margin: 5, width: window.innerWidth < 426 ? '65vw' : '30vw' }}
        ></input>
      </div>
    )
  }

  return (
    <div id="scroll-antibioticos"
      className='card-aberto'
      style={{ display: card == 'card-antibioticos' ? 'flex' : 'none', position: 'relative' }}
    >
      <div className="text3">
        ANTIBIÓTICOS
      </div>
      <Botoes></Botoes>
      <FilterAntibioticos></FilterAntibioticos>
      <div
        style={{
          position: 'relative', display: 'flex', flexDirection: 'row',
          justifyContent: 'space-evenly', flexWrap: 'wrap',
          alignItems: 'flex-start', alignContent: 'flex-start',
        }}>
        {arrayantibioticos.sort((a, b) => moment(a.data_inicio) < moment(b.data_inicio) ? 1 : -1).map((item) => (
          <div
            key={'antibiótico ' + item.id_antibiotico}
            className='row'
            style={{
              position: 'relative',
              margin: 5,
              flexDirection: window.innerWidth < 426 ? 'column' : 'row',
              width: window.innerWidth < 426 ? '100%' : '',
            }}
          >
            <div style={{
              display: 'flex', flexDirection: window.innerWidth < 426 ? 'column' : 'row',
              justifyContent: 'center', alignContent: 'center', alignItems: 'center',
              flex: 5,
            }}>
              <div id="identificador"
                className={item.data_termino != null ? 'button-green' :
                  moment(item.prazo).diff(moment(), 'days') < 1 && item.datatermino == null ? 'button-red' : 'button'}
                style={{
                  flex: 1,
                  flexDirection: window.innerWidth < 426 ? 'row' : 'column',
                  justifyContent: window.innerWidth < 426 ? 'space-between' : 'center',
                  alignSelf: 'center', alignContent: 'center',
                  padding: 5,
                  height: window.innerWidth < 426 ? 60 : 225,
                  width: window.innerWidth < 426 ? 'calc(95% + 10px)' : '',
                  margin: 0,
                  marginRight: window.innerWidth < 426 ? 0 : 0,
                  borderTopLeftRadius: window.innerWidth < 426 ? 5 : 5,
                  borderTopRightRadius: window.innerWidth < 426 ? 5 : 0,
                  borderBottomLeftRadius: window.innerWidth < 426 ? 0 : 5,
                  borderBottomRightRadius: window.innerWidth < 426 ? 0 : 0,
                }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className='text2'
                    title='DATA DE INÍCIO.'
                    style={{
                      color: '#ffffff'
                    }}>
                    {moment(item.data_inicio).format('DD/MM/YYYY')}
                  </div>
                </div>
                <div className='button-red'
                  style={{ width: 25, minWidth: 25, height: 25, minHeight: 25 }}
                  onClick={(e) => {
                    modal(setdialogo, 'CONFIRMAR EXCLUSÃO DO ANTIBIÓTICO ?', deleteAntibiotico, item);
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
              </div>
              <div
                className='cor0'
                style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  borderRadius: 5, padding: 10,
                  borderTopLeftRadius: window.innerWidth < 426 ? 0 : 0,
                  borderTopRightRadius: window.innerWidth < 426 ? 0 : 5,
                  borderBottomLeftRadius: window.innerWidth < 426 ? 5 : 0,
                  borderBottomRightRadius: window.innerWidth < 426 ? 5 : 5,
                  width: window.innerWidth < 426 ? '95%' : '',
                  paddingBottom: window.innerWidth < 426 ? 0 : 5,
                  marginTop: 0,
                  marginLeft: 0,
                  alignSelf: 'center',
                  alignContent: 'center',
                }}>
                <div id="conteúdo do antibiótico" style={{
                  display: 'flex',
                  flexDirection: window.innerWidth < 426 ? 'column' : 'row',
                  justifyContent: 'center',
                  flex: window.innerWidth < 426 ? 1 : 4,
                  width: window.innerWidth < 426 ? '95%' : '',
                  alignSelf: 'center',
                  alignContent: 'center',
                }}>
                  <div id="antibiótico e datas"
                    className='cor0'
                    style={{
                      flex: window.innerWidth < 426 ? 1 : 3,
                      display: 'flex', flexDirection: 'column', justifyContent: 'center',
                      alignSelf: 'center',
                      alignItems: 'center',
                      margin: 5, padding: 5,
                      height: 200,
                      width: window.innerWidth < 426 ? '100%' : '10vw',
                    }}>
                    <input id={"inputAntibiotico " + item.id_antibiotico}
                      className="input"
                      autoComplete="off"
                      placeholder='ANTIBIÓTICO...'
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'ANTIBIÓTICO...')}
                      defaultValue={item.antibiotico}
                      onKeyUp={(e) => {
                        clearTimeout(timeout);
                        timeout = setTimeout(() => {
                          document.getElementById("inputAntibiotico " + item.id_antibiotico).blur();
                          setTimeout(() => {
                            var obj = {
                              id_atendimento: item.id_atendimento,
                              antibiotico: document.getElementById('inputAntibiotico ' + item.id_antibiotico).value.toUpperCase(),
                              data_inicio: item.data_inicio,
                              data_termino: item.data_termino,
                              prazo: item.prazo,
                            }
                            axios.post(html + 'update_antibiotico/' + item.id_antibiotico, obj).then(() => {
                              loadAntibioticos();
                              // toast(settoast, 'DADOS DO ANTIBIÓTICO ATUALIZADOS COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
                            });
                            e.stopPropagation();
                          }, 500);
                        }, 2000);
                      }}
                      style={{
                        display: 'flex',
                        flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                        width: 'calc(100% - 10px)',
                        marginTop: window.innerWidth < 426 ? 0 : 10,
                      }}
                      title="ANTIBIÓTICO."
                    >
                    </input>
                    <input id={"inputInicio " + item.id_antibiotico}
                      className="input cor2"
                      autoComplete="off"
                      type="text"
                      inputMode='numeric'
                      placeholder='INÍCIO...'
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'INÍCIO...')}
                      defaultValue={moment(item.data_inicio).format('DD/MM/YYYY')}
                      onClick={() => document.getElementById("inputInicio " + item.id_antibiotico).value = ''}
                      onKeyUp={(e) => {
                        var x = document.getElementById("inputInicio " + item.id_antibiotico).value;
                        if (x.length == 2) {
                          x = x + '/';
                          document.getElementById("inputInicio " + item.id_antibiotico).value = x;
                        }
                        if (x.length == 5) {
                          x = x + '/'
                          document.getElementById("inputInicio " + item.id_antibiotico).value = x;
                        }
                        clearTimeout(timeout);
                        timeout = setTimeout(() => {
                          document.getElementById("inputInicio " + item.id_antibiotico).blur();
                          setTimeout(() => {
                            var date = moment(document.getElementById("inputInicio " + item.id_antibiotico).value, 'DD/MM/YYYY', true);
                            if (date.isValid() == false) {
                              toast(settoast, 'DATA INVÁLIDA', 'rgb(231, 76, 60, 1)', 1500);
                              document.getElementById("inputInicio " + item.id_antibiotico).value = '';
                            } else {
                              var obj = {
                                id_atendimento: item.id_atendimento,
                                antibiotico: item.antibiotico,
                                data_inicio: moment(document.getElementById('inputInicio ' + item.id_antibiotico).value, 'DD/MM/YYYY'),
                                data_termino: item.data_termino,
                                prazo: item.prazo,
                              }
                              axios.post(html + 'update_antibiotico/' + item.id_antibiotico, obj).then(() => {
                                loadAntibioticos();
                                // toast(settoast, 'DADOS DO ANTIBIÓTICO ATUALIZADOS COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
                              });
                            }
                          }, 500);
                        }, 2000);
                        e.stopPropagation();
                      }}
                      style={{
                        display: 'flex',
                        flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                        width: 'calc(100% - 10px)',
                        borderColor: 'transparent',
                        marginBottom: 0,
                      }}
                    >
                    </input>
                    <input id={"inputTermino " + item.id_antibiotico}
                      className="input cor2"
                      autoComplete="off"
                      type="text"
                      inputMode='numeric'
                      placeholder='TÉRMINO...'
                      onClick={() => document.getElementById("inputTermino " + item.id_antibiotico).value = ''}
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'TÉRMINO...')}
                      defaultValue={item.data_termino != null ? moment(item.data_termino).format('DD/MM/YYYY') : ''}
                      onKeyUp={(e) => {
                        var x = document.getElementById("inputTermino " + item.id_antibiotico).value;
                        if (x.length == 2) {
                          x = x + '/';
                          document.getElementById("inputTermino " + item.id_antibiotico).value = x;
                        }
                        if (x.length == 5) {
                          x = x + '/'
                          document.getElementById("inputTermino " + item.id_antibiotico).value = x;
                        }
                        clearTimeout(timeout);
                        timeout = setTimeout(() => {
                          document.getElementById("inputTermino " + item.id_antibiotico).blur();
                          setTimeout(() => {
                            var field = document.getElementById("inputTermino " + item.id_antibiotico).value;
                            var date = moment(document.getElementById("inputTermino " + item.id_antibiotico).value, 'DD/MM/YYYY', true);
                            if (field != '' && date.isValid() == false) {
                              toast(settoast, 'DATA INVÁLIDA', 'rgb(231, 76, 60, 1)', 1500);
                              document.getElementById("inputTermino " + item.id_antibiotico).value = '';
                            } else {
                              var obj = {
                                id_atendimento: item.id_atendimento,
                                antibiotico: item.antibiotico,
                                data_inicio: item.data_inicio,
                                data_termino: field == '' ? null : moment(document.getElementById('inputTermino ' + item.id_antibiotico).value, 'DD/MM/YYYY'),
                                prazo: item.prazo,
                              }
                              axios.post(html + 'update_antibiotico/' + item.id_antibiotico, obj).then(() => {
                                loadAntibioticos();
                                // toast(settoast, 'DADOS DO ANTIBIÓTICO ATUALIZADOS COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
                              });
                            }
                          }, 500);
                        }, 2000);
                        e.stopPropagation();
                      }}
                      style={{
                        display: 'flex',
                        flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                        width: 'calc(100% - 10px)',
                        // backgroundColor: '#f2f2f2',
                        borderColor: 'transparent',
                      }}
                    >
                    </input>
                  </div>
                  <div id="prazo"
                    style={{
                      flex: 1,
                      display: 'flex', flexDirection: 'column',
                      justifyContent: 'center',
                      marginBottom: window.innerWidth < 426 ? 12.5 : '',
                    }}>
                    <div style={{
                      display: 'flex', flexDirection: 'column', justifyContent: 'center',
                      zIndex: 10,
                    }}>
                      <div className='text1' style={{ margin: 0 }}>PRAZO</div>
                      <div className='input-special cor0' style={{ width: 60, height: 60, alignSelf: 'center' }}>
                        <input
                          id={"inputDias " + item.id_antibiotico}
                          title='DIAS DE USO DO ANTIBIÓTICO.'
                          autoComplete="off"
                          placeholder="DIAS..."
                          type="text"
                          inputMode='numeric'
                          maxLength={2}
                          className="input cor2"
                          onFocus={(e) => (e.target.placeholder = '')}
                          onBlur={(e) => (e.target.placeholder = 'DIAS...')}
                          defaultValue={moment(item.prazo).diff(moment(item.data_inicio), 'days')}
                          onClick={(e) => { e.stopPropagation() }}
                          onKeyUp={(e) => {
                            clearTimeout(timeout);
                            timeout = setTimeout(() => {
                              document.getElementById("inputDias " + item.id_antibiotico).blur();
                              setTimeout(() => {
                                var prazo = document.getElementById("inputDias " + item.id_antibiotico).value;
                                if (isNaN(prazo) == true && parseInt(prazo) < 0) {
                                  toast(settoast, 'VALOR INVÁLIDO', 'rgb(231, 76, 60, 1)', 1500);
                                  document.getElementById("inputDias " + item.id_antibiotico).value = '';
                                } else {
                                  var obj = {
                                    id_atendimento: item.id_atendimento,
                                    antibiotico: item.antibiotico,
                                    data_inicio: item.data_inicio,
                                    data_termino: item.data_termino,
                                    prazo: moment(item.data_inicio).add(prazo, 'days'),
                                  }
                                  axios.post(html + 'update_antibiotico/' + item.id_antibiotico, obj).then(() => {
                                    loadAntibioticos();
                                    // toast(settoast, 'DADOS DO ANTIBIÓTICO ATUALIZADOS COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
                                  });
                                }
                              }, 500);
                            }, 2000);
                            e.stopPropagation();
                          }}
                          style={{
                            width: 50,
                            height: 50,
                            alignSelf: 'center',
                          }}
                        ></input>
                      </div>
                    </div>
                    <div
                      className={moment(item.prazo).diff(moment(), 'days') < 1 && item.datatermino == null ? 'button-red' : 'button'}
                      style={{
                        display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        padding: 10, paddingTop: 20, marginTop: -10,
                        alignSelf: 'center',
                        width: window.innerWidth < 426 ? '30vw' : '7vw',
                      }}
                    >
                      {item.data_termino == null ? moment().diff(item.data_inicio, 'days') + '/' + moment(item.prazo).diff(item.data_inicio, 'days') : moment(item.data_termino).diff(item.data_inicio, 'days') + '/' + moment(item.prazo).diff(item.data_inicio, 'days')}
                      <div style={{ marginTop: 5 }}>{'FIM PREVISTO:'}</div>
                      <div>{moment(item.prazo).format('DD/MM/YYYY')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <InsertAntibiotico></InsertAntibiotico>
    </div >
  )
}

export default Antibioticos;