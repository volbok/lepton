/* eslint eqeqeq: "off" */
import React, { useContext, useState, useEffect } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
import moment from 'moment';
// funções.
import modal from '../functions/modal';
import checkinput from '../functions/checkinput';
// imagens.
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import novo from '../images/novo.svg';
import back from '../images/back.svg';
// componentes.
import GravadorMulti from '../components/GravadorMulti';

function VentilacaoMecanica() {

  // context.
  const {
    html,
    settoast,
    setdialogo,
    vm, setvm,
    atendimento,
    card, setcard,
  } = useContext(Context);

  const [item_ventilacaomecanica, setitem_ventilacaomecanica] = useState();

  useEffect(() => {
    if (card == 'card-vm') {
      setitem_ventilacaomecanica(null);
      loadVentilacaoMecanica();
    }
    // eslint-disable-next-line
  }, [card]);

  // atualizar lista com registros de parâmetros ventilatórios.
  const loadVentilacaoMecanica = () => {
    axios.get(html + 'list_vm/' + atendimento).then((response) => {
      setvm(response.data.rows);
    })
  }

  // deletar registro de parâmetros ventilatórios.
  const deleteVentilacaoMecanica = (id) => {
    axios.get(html + 'delete_vm/' + id).then(() => {
      // toast(settoast, 'REGISTRO DE PARÂMETROS VENTILATÓRIOS EXCLUÍDO COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
      loadVentilacaoMecanica();
    })
  }

  // inserir registro de parâmetros ventilatórios.
  const insertVentilacaoMecanica = ([modo, pressao, volume, peep, fio2]) => {
    // var today = moment();
    // console.log(today);
    var obj = {
      id_atendimento: atendimento,
      modo: modo,
      pressao: pressao,
      volume: volume,
      peep: peep,
      fio2: fio2,
      data_vm: moment(),
    }
    axios.post(html + 'insert_vm', obj).then(() => {
      // toast(settoast, 'PARÂMETROS VENTILATÓRIOS ADICIONADOS COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
      loadVentilacaoMecanica();
      setviewinsertvm(0);
    })
  }

  // inserir registro de parâmetros ventilatórios.
  const insertVoiceVentilacaoMecanica = (parametros) => {
    // var today = moment();
    // console.log(today);
    var obj = {
      id_atendimento: atendimento,
      modo: parametros.slice(0, 1).pop(),
      pressao: parametros.slice(1, 2).pop(),
      volume: parametros.slice(2, 3).pop(),
      peep: parametros.slice(3, 4).pop(),
      fio2: parametros.slice(4, 5).pop(),
      data_vm: moment(),
    }
    axios.post(html + 'insert_vm', obj).then(() => {
      // toast(settoast, 'PARÂMETROS VENTILATÓRIOS ADICIONADOS COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
      loadVentilacaoMecanica();
      setviewinsertvm(0);
    })
  }

  // atualizar registro de parâmetros ventilatórios.
  const updateVentilacaoMecanica = ([id, modo, pressao, volume, peep, fio2, data_vm]) => {
    var obj = {
      id_atendimento: atendimento,
      modo: modo,
      pressao: pressao,
      volume: volume,
      peep: peep,
      fio2: fio2,
      data_vm: data_vm,
    }
    axios.post(html + 'update_vm/' + id, obj).then(() => {
      // toast(settoast, 'PARÂMETROS DA VM ATUALIZADOS COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
      loadVentilacaoMecanica();
      setviewinsertvm(0);
    })
  }

  // função para permitir apenas a inserção de números no input (obedecendo a valores de referência).
  var timeout = null;
  const checkNumberInput = (input, min, max) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      var valor = document.getElementById(input).value;
      if (isNaN(valor) == true || valor < min || valor > max) {
        document.getElementById(input).value = '';
        document.getElementById(input).focus();
      }
    }, 1000);
  }

  /*
  // função que permite apenas a entrada do cartactere +.
  const checkCaractereInput = (input) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      var valor = document.getElementById(input).value;
      var lastvalor = valor.slice(-1);
      if (lastvalor != '+') {
        lastvalor = '';
        document.getElementById(input).focus();
      }
    }, 1000);
  }
  */

  // componente para adição ou atualização dos parâmetros ventilatórios (modo 1 = inserir, modo 2 = atualizar).
  const [viewinsertvm, setviewinsertvm] = useState();
  function InsertVm() {
    return (
      <div className="fundo"
        onClick={(e) => { setviewinsertvm(0); e.stopPropagation() }}
        style={{ display: viewinsertvm == 1 || viewinsertvm == 2 ? 'flex' : 'none' }}>
        <div className={window.innerWidth < 426 ? "janela scroll" : "janela"}
          onClick={(e) => e.stopPropagation()}
          style={{
            flexDirection: 'column',
            width: window.innerWidth < 426 ? '80vw' : '60vw',
            height: window.innerWidth < 426 ? 0.5 * window.innerHeight : '',
            justifyContent: window.innerWidth < 426 ? 'flex-start' : 'center',
            alignContent: 'center',
          }}>
          <div
            style={{
              display: 'flex',
              flexDirection: window.innerWidth < 426 ? 'column' : 'row',
              flexWrap: window.innerWidth < 426 ? 'nowrap' : 'wrap',
              justifyContent: window.innerWidth < 426 ? 'flex-start' : 'center',
              alignContent: 'center',
            }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>MODO</div>
              <input
                className="input"
                autoComplete="off"
                placeholder="MODO"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'MODO')}
                style={{
                  width: window.innerWidth < 426 ? '70vw' : '10vw',
                  margin: 5,
                }}
                type="text"
                id="inputModo"
                defaultValue={viewinsertvm == 2 ? item_ventilacaomecanica.modo : ''}
                maxLength={3}
              ></input>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>PRESSÃO</div>
              <input
                className="input"
                autoComplete="off"
                inputMode='numeric'
                placeholder="PRESSÃO"
                onKeyUp={() => checkNumberInput("inputPressao", 14, 25)}
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'PRESSÃO')}
                style={{
                  width: window.innerWidth < 426 ? '70vw' : '10vw',
                  margin: 5,
                }}
                type="text"
                id="inputPressao"
                defaultValue={viewinsertvm == 2 ? item_ventilacaomecanica.pressao : ''}
                maxLength={2}
              ></input>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>VOLUME</div>
              <input
                className="input"
                autoComplete="off"
                inputMode='numeric'
                placeholder="VOLUME"
                onKeyUp={() => checkNumberInput("inputVolume", 200, 600)}
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'VOLUME')}
                style={{
                  width: window.innerWidth < 426 ? '70vw' : '10vw',
                  margin: 5,
                }}
                type="text"
                id="inputVolume"
                defaultValue={viewinsertvm == 2 ? item_ventilacaomecanica.volume : ''}
                maxLength={3}
              ></input>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>PEEP</div>
              <input
                className="input"
                autoComplete="off"
                placeholder="PEEP"
                inputMode='numeric'
                onKeyUp={() => checkNumberInput("inputPeep", 1, 20)}
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'PEEP')}
                style={{
                  width: window.innerWidth < 426 ? '70vw' : '10vw',
                  margin: 5,
                }}
                type="text"
                id="inputPeep"
                defaultValue={viewinsertvm == 2 ? item_ventilacaomecanica.peep : ''}
                maxLength={2}
              ></input>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>FIO2</div>
              <input
                className="input"
                autoComplete="off"
                placeholder="FIO2"
                inputMode='numeric'
                onKeyUp={() => checkNumberInput("inputFio2", 21, 101)}
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'FIO2')}
                style={{
                  width: window.innerWidth < 426 ? '70vw' : '10vw',
                  margin: 5,
                }}
                type="text"
                id="inputFio2"
                defaultValue={viewinsertvm == 2 ? item_ventilacaomecanica.fio2 : ''}
                maxLength={3}
              ></input>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div id="botão de retorno"
              className="button-red"
              style={{
                display: 'flex',
                alignSelf: 'center',
              }}
              onClick={() => setviewinsertvm(0)}>
              <img
                alt=""
                src={back}
                style={{ width: 30, height: 30 }}
              ></img>
            </div>
            <div id="btndesligarvm"
              className='button-green'
              style={{ paddingLeft: 10, paddingRight: 10 }}
              onClick={() => {
                if (item_ventilacaomecanica == null) { // inserir.
                  insertVentilacaoMecanica(['OFF', 0, 0, 0, 0]);
                } else { // atualizar.
                  updateVentilacaoMecanica([item_ventilacaomecanica.id_vm, 'OFF', 0, 0, 0, 0, item_ventilacaomecanica.data_vm]);
                }
              }}
            >
              DESLIGAR VM
            </div>
            <div id="btnsalvarvm"
              className='button-green'
              onClick={() => {
                var modo = document.getElementById('inputModo').value;
                var pressao = document.getElementById('inputPressao').value;
                var volume = document.getElementById('inputVolume').value;
                var peep = document.getElementById('inputPeep').value;
                var fio2 = document.getElementById('inputFio2').value;
                if (item_ventilacaomecanica == null) { // inserir.
                  checkinput('input', settoast, ['inputModo', 'inputPressao', 'inputVolume', 'inputPeep', 'inputFio2'], "btnsalvarvm", insertVentilacaoMecanica, [modo, pressao, volume, peep, fio2]);
                } else { // atualizar.
                  checkinput('input', settoast, ['inputModo', 'inputPressao', 'inputVolume', 'inputPeep', 'inputFio2'], "btnsalvarvm", updateVentilacaoMecanica, [item_ventilacaomecanica.id_vm, modo, pressao, volume, peep, fio2, item_ventilacaomecanica.data_vm]);
                }
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
        </div>
      </div>
    )
  }

  // registro de sinais vitais por voz.
  function Botoes() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <div id="botão de retorno"
          className="button-red"
          style={{ display: 'flex', alignSelf: 'center' }}
          onClick={() => setcard('')}>
          <img
            alt=""
            src={back}
            style={{ width: 30, height: 30 }}
          ></img>
        </div>
        <GravadorMulti funcao={insertVoiceVentilacaoMecanica} campos={['MODO', 'PRESSÃO', 'VOLUME', 'PEEP', 'FIO2']}></GravadorMulti>
        <div id="btninputvm"
          className='button-green'
          onClick={(e) => { setviewinsertvm(1); e.stopPropagation() }}
          style={{ display: 'flex', alignSelf: 'center' }}
        >
          <img
            alt=""
            src={novo}
            style={{ width: 30, height: 30 }}
          ></img>
        </div>
      </div>
    );
  }

  // função que monta os componentes de dados vitais.
  function montaParametrosVentilatorios(nome, item, unidade, min, max) {
    return (
      <div id={nome} style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignSelf: window.innerWidth < 769 ? 'flex-start' : 'center',
      }}>
        <div className='text2' style={{ marginBottom: 0 }}>
          {nome}
        </div>
        <div className='text2'
          style={{
            width: window.innerWidth < 426 ? '50vw' : '8vw', marginTop: 0, paddingTop: 0,
            color: isNaN(item) == false && (item < min || item > max) ? '#F1948A' : '#ffffff',
          }}>
          {item + ' ' + unidade}
        </div>
      </div>
    )
  }

  // gráfico.
  const setDataGrafico = () => {
    return (
      <div
        style={{
          display: vm.length > 0 && vm.slice(-1).map(item => item.modo != 'OFF') ? 'flex' : 'none',
          flexDirection: 'column', justifyContent: 'center',
          width: window.innerWidth < 426 ? '80vw' : '65vw', marginTop: 5,
          alignSelf: 'center',
        }}>
        <div id="gráfico" className='scroll'
          style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',
            overflowX: 'scroll', overflowY: 'hidden',
            width: '90%',
          }}>
          {vm.sort((a, b) => moment(a.data_vm).milliseconds < moment(b.data_vm).milliseconds ? 1 : -1).slice(-5).map(item => (
            <div
              key={'gráfico ' + item.id_vm}
              style={{
                display: item.modo == 'OFF' ? 'none' : 'flex',
                flexDirection: 'column', justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <div id="pack de barras"
                className='cor0'
                style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  borderColor: 'white',
                  borderRadius: 5,
                  padding: 10, margin: 5,
                  height: '100%'
                }}>
                <div id="barras"
                  style={{
                    display: 'flex', flexDirection: 'row', justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}>
                  <div id="barra + rótulo PRESSÃO"
                    style={{
                      display: 'flex',
                      flexDirection: 'column', justifyContent: 'center'
                    }}>
                    <div id="barra PRESSÃO" className='button cor0'
                      style={{
                        display: 'flex',
                        width: 20,
                        height: parseInt(item.pressao),
                        minHeight: parseInt(item.pressao),
                        backgroundImage: "linear-gradient(#EC7063, transparent)",
                      }}>
                      {parseInt(item.pressao)}
                    </div>
                    <div className='text1' style={{ fontSize: 12 }}>PRESSÃO</div>
                  </div>
                  <div id="barra + rótulo VOLUME"
                    style={{
                      display: 'flex',
                      flexDirection: 'column', justifyContent: 'center'
                    }}>
                    <div id="barra VOLUME" className='button cor0'
                      style={{
                        display: 'flex',
                        width: 20,
                        height: Math.ceil(parseInt(item.volume) / 3),
                        minHeight: Math.ceil(parseInt(item.volume) / 3),
                        backgroundImage: "linear-gradient(#58D68D, transparent)",
                      }}>
                      {parseInt(item.volume)}
                    </div>
                    <div className='text1' style={{ fontSize: 12 }}>VOLUME</div>
                  </div>
                  <div id="barra + rótulo PEEP"
                    style={{
                      display: 'flex',
                      flexDirection: 'column', justifyContent: 'center'
                    }}>
                    <div id="barra PEEP" className='button cor0'
                      style={{
                        display: 'flex',
                        width: 20,
                        height: parseInt(item.peep),
                        minHeight: parseInt(item.peep),
                        backgroundImage: "linear-gradient(#F4D03F, transparent)",
                      }}>
                      {parseInt(item.peep)}
                    </div>
                    <div className='text1' style={{ fontSize: 12 }}>PEEP</div>
                  </div>
                  <div id="barra + rótulo FIO2"
                    style={{
                      display: 'flex',
                      flexDirection: 'column', justifyContent: 'center'
                    }}>
                    <div id="barra FIO2" className='button cor0'
                      style={{
                        display: 'flex',
                        width: 20,
                        height: parseInt(item.fio2),
                        minHeight: parseInt(item.fio2),
                        backgroundImage: "linear-gradient(#5DADE2, transparent)",
                      }}>
                      {parseInt(item.fio2)}
                    </div>
                    <div className='text1' style={{ fontSize: 12 }}>FIO2</div>
                  </div>
                </div>
                <div id='rótulo com data' className='text1'>
                  {moment(item.data_vm).format('DD/MM - HH:mm')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div id="scroll-vm"
      className='card-aberto'
      style={{ display: card == 'card-vm' ? 'flex' : 'none', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}
    >
      <div className="text3">
        VENTILAÇÃO MECÂNICA
      </div>
      <Botoes></Botoes>
      <div id="fora da vm" className='button-green'
        // ativada quando o paciente não está intubado ou traqueostomizado.
        style={{
          display: vm.sort((a, b) => moment(a.data_vm) < moment(b.data_vm) ? -1 : 1).slice(-1).map(item => item.modo) == 'OFF' ? 'flex' : 'none',
          padding: 10,
          width: 200, alignSelf: 'center',
        }}>
        {'PACIENTE FORA DA VM'}
      </div>
      {vm.sort((a, b) => moment(a.data_vm) < moment(b.data_vm) ? -1 : 1).slice(-1).map(item => (
        <div className='row'
          key={'vm ' + item.id_vm}
          onClick={(e) => { setitem_ventilacaomecanica(item); setviewinsertvm(2); e.stopPropagation(); }}
          style={{
            display: item.modo == 'OFF' ? 'none' : 'flex',
            flexDirection: window.innerWidth < 426 ? 'column' : 'row',
            width: '65vw'
          }}
        >
          <div id="identificador"
            className='button-yellow'
            style={{
              flex: 1,
              flexDirection: window.innerWidth < 426 ? 'row' : 'column',
              justifyContent: 'center', alignSelf: 'center',
              margin: 5, padding: 5,
              height: window.innerWidth < 426 ? '100vh' : window.innerWidth > 425 && window.innerWidth < 769 ? '60vh' : '20vh',
              width: '95%',
              marginBottom: window.innerWidth < 426 ? 0 : 5,
              marginRight: window.innerWidth < 426 ? 5 : 0,
              borderTopLeftRadius: window.innerWidth < 426 ? 5 : 5,
              borderTopRightRadius: window.innerWidth < 426 ? 5 : 0,
              borderBottomLeftRadius: window.innerWidth < 426 ? 0 : 5,
              borderBottomRightRadius: window.innerWidth < 426 ? 0 : 0,
            }}>
            <div style={{
              display: window.innerWidth < 426 ? 'none' : 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <div className='text2' style={{ color: '#ffffff' }}>{moment(item.data_vm).format('DD/MM/YY')}</div>
              <div className='button-red'
                style={{ width: 25, minWidth: 25, height: 25, minHeight: 25, alignSelf: 'center' }}
                onClick={(e) => {
                  modal(setdialogo, 'CONFIRMAR EXCLUSÃO DO REGISTRO DE PARÂMETROS VENTILATÓRIOS ?', deleteVentilacaoMecanica, item.id_vm);
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
            <div style={{
              display: window.innerWidth < 426 ? 'flex' : 'none',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
              <div className='text2' style={{ color: '#ffffff' }}>{moment(item.data_vm).format('DD/MM/YY - HH:mm')}</div>
              <div className='button-red'
                style={{ width: 25, minWidth: 25, height: 25, minHeight: 25 }}
                onClick={(e) => {
                  modal(setdialogo, 'CONFIRMAR EXCLUSÃO DO REGISTRO DE PARÂMETROS VENTILATÓRIOS ?', deleteVentilacaoMecanica, item.id_vm);
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
          </div>
          <div id="parâmetros ventilatórios"
            className='button'
            style={{
              flex: window.innerWidth < 426 ? 11 : 4,
              display: 'flex', flexDirection: 'row',
              justifyContent: 'center',
              flexWrap: 'wrap', width: '95%',
              height: window.innerWidth < 426 ? '100vh' : window.innerWidth > 425 && window.innerWidth < 769 ? '60vh' : '20vh',
              borderTopLeftRadius: window.innerWidth < 426 ? 0 : 0,
              borderTopRightRadius: window.innerWidth < 426 ? 0 : 5,
              borderBottomLeftRadius: window.innerWidth < 426 ? 5 : 0,
              borderBottomRightRadius: window.innerWidth < 426 ? 5 : 5,
              marginTop: window.innerWidth < 426 ? 0 : 5,
              marginLeft: window.innerWidth < 426 ? 5 : 0,
            }}
          >
            {montaParametrosVentilatorios('MODO', item.modo, '', '', '')}
            {montaParametrosVentilatorios('PRESSAO', item.pressao, 'cmH2O', 10, 24)}
            {montaParametrosVentilatorios('VOLUME', item.volume, 'cmH2O', 200, 500)}
            {montaParametrosVentilatorios('PEEP', item.peep, 'cmH2O', 5, 14)}
            {montaParametrosVentilatorios('FIO2', item.fio2, '%', 10, 80)}
          </div>
        </div>
      ))}
      {setDataGrafico()}
      <InsertVm></InsertVm>
    </div>
  )
}

export default VentilacaoMecanica;
