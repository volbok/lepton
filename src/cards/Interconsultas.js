/* eslint eqeqeq: "off" */
import React, { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
import moment from 'moment';
// funções.
import modal from '../functions/modal';
import toast from '../functions/toast';
// imagens.
import deletar from '../images/deletar.svg';
import novo from '../images/novo.svg';
import back from '../images/back.svg';

function Interconsultas() {

  // context.
  const {
    html,
    settoast,
    setdialogo,
    interconsultas, setinterconsultas,
    atendimento,
    card, setcard,
    mobilewidth,
    arrayespecialidades,
  } = useContext(Context);

  useEffect(() => {
    if (card == 'card-interconsultas') {
      loadInterconsultas();
    }
    // eslint-disable-next-line
  }, [card]);

  // atualizar lista de interconsultas.
  const loadInterconsultas = () => {
    axios.get(html + 'list_interconsultas/' + atendimento).then((response) => {
      setinterconsultas(response.data.rows);
    })
  }

  // deletar interconsulta.
  const deleteInterconsulta = (id) => {
    axios.get(html + 'delete_interconsulta/' + id).then(() => {
      // toast(settoast, 'INTERCONSULTA EXCLUÍDA COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
      loadInterconsultas();
    })
  }

  // inserir interconsulta.
  const insertInterconsulta = (especialidade) => {
    var obj = {
      id_atendimento: atendimento,
      especialidade: especialidade,
      status: 'PENDENTE',
      data_pedido: moment()
    }
    axios.post(html + 'insert_interconsulta', obj).then(() => {
      // toast(settoast, 'INTERCONSULTA ADICIONADA COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
      loadInterconsultas();
      setviewinsertinterconsulta(0);
    })
  }

  // componente para adição da interconsulta.
  const [viewinsertinterconsulta, setviewinsertinterconsulta] = useState();
  const InsertInterconsulta = useCallback(() => {
    return (
      <div className="fundo"
        onClick={(e) => { setviewinsertinterconsulta(0); e.stopPropagation() }}
        style={{ display: viewinsertinterconsulta == 1 ? 'flex' : 'none' }}>
        <div className="janela"
          onClick={(e) => e.stopPropagation()}
          style={{ flexDirection: 'column' }}>
          <div className='text3'>ESPECIALIDADE</div>
          <div className='scroll' style={{ height: '40vh', margin: 10, marginBottom: 20 }}>
            {arrayespecialidades.map(item => (
              <div className='button' style={{ width: 200 }}
                onClick={() => insertInterconsulta(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
    // eslint-disable-next-line
  }, [viewinsertinterconsulta]);

  // registro de interconsulta por voz.
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
        <div id="btninputinterconsulta"
          className='button-green'
          onClick={(e) => { setviewinsertinterconsulta(1); e.stopPropagation() }}
          style={{ display: 'flex', alignSelf: 'center' }}
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

  // opções para status das interconsultas.
  const [viewopcoesstatus, setviewopcoesstatus] = useState(0);
  let arrayopcoesstatus = ['PENDENTE', 'ATIVA', 'ENCERRADA'];
  const [selectedinterconsulta, setselectedinterconsulta] = useState(0);
  function StatusInterconsulta() {
    return (
      <div className="fundo"
        style={{ display: viewopcoesstatus == 1 ? 'flex' : 'none' }}
        onClick={() => setviewopcoesstatus(0)}>
        <div className="janela" onClick={(e) => e.stopPropagation()}>
          <div className='text1' style={{ marginBottom: 15, width: 150 }}>STATUS DA INTERCONSULTA</div>
          {arrayopcoesstatus.map(item => (
            <div
              key={'opcao status interconsulta ' + item}
              onClick={() => {
                var obj = {
                  id_atendimento: atendimento,
                  especialidade: selectedinterconsulta.especialidade,
                  status: item,
                  data_pedido: selectedinterconsulta.data_pedido
                }
                axios.post(html + 'update_interconsulta/' + selectedinterconsulta.id_interconsulta, obj).then(() => {
                  toast(settoast, 'INTERCONSULTA ADICIONADA COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
                  loadInterconsultas();
                  setviewopcoesstatus(0);
                })
              }}
              className='button' style={{ width: 150, minWidth: 150 }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div id="scroll-interconsultas"
      className='card-aberto'
      style={{ display: card == 'card-interconsultas' ? 'flex' : 'none' }}
    >
      <div className="text3">
        INTERCONSULTAS
      </div>
      <Botoes></Botoes>
      <div
        style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'center',
          flexWrap: 'wrap', width: '100%'
        }}>
        {interconsultas.sort((a, b) => moment(a.data_pedido) < moment(b.data_pedido) ? -1 : 1).map(item => (
          <div key={'interconsulta ' + item.id_interconsulta}
            style={{
              display: 'flex',
              flex: window.innerWidth < mobilewidth ? 1 : 8,
              flexDirection: window.innerWidth < mobilewidth ? 'column' : 'row',
              justifyContent: 'center',
              width: window.innerWidth < mobilewidth ? '80vw' : 300,
              maxWidth: window.innerWidth < mobilewidth ? '80vw' : 300,
              margin: 5,
            }}>
            <div className='button'
              style={{
                flex: 1,
                flexDirection: window.innerWidth < mobilewidth ? 'row' : 'column',
                justifyContent: window.innerWidth < mobilewidth ? 'space-between' : 'center',
                padding: window.innerWidth < mobilewidth ? 5 : 15,
                paddingLeft: window.innerWidth < mobilewidth ? 20 : '',
                paddingRight: window.innerWidth < mobilewidth ? 8 : '',
                margin: 0,
                borderTopLeftRadius: window.innerWidth < mobilewidth ? 5 : 5,
                borderTopRightRadius: window.innerWidth < mobilewidth ? 5 : 0,
                borderBottomLeftRadius: window.innerWidth < mobilewidth ? 0 : 5,
                borderBottomRightRadius: window.innerWidth < mobilewidth ? 0 : 0,
              }}>
              {moment(item.data_pedido).format('DD/MM/YY')}
              <div className='button-red'
                style={{ width: 25, minWidth: 25, height: 25, minHeight: 25 }}
                onClick={(e) => {
                  modal(setdialogo, 'CONFIRMAR EXCLUSÃO DA INTERCONSULTA PARA ' + item.especialidade + '?', deleteInterconsulta, item.id_interconsulta);
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
                flex: 3,
                display: 'flex',
                flexDirection: 'column',
                padding: 2.5,
                // backgroundColor: 'white',
                borderTopLeftRadius: 0,
                borderTopRightRadius: window.innerWidth < mobilewidth ? 0 : 5,
                borderBottomLeftRadius: window.innerWidth < mobilewidth ? 5 : 0,
                borderBottomRightRadius: window.innerWidth < mobilewidth ? 5 : 5,
              }}>
              <div
                className='input'
                style={{
                  margin: 0, padding: 0,
                  // backgroundColor: 'white',
                  // color: 'rgb(97, 99, 110, 1)'
                }}>
                {item.especialidade}
              </div>
              <div
                className={item.status == 'PENDENTE' ? 'button-red' : item.status == 'ATIVA' ? 'button-yellow' : 'button-green'}
                onClick={(e) => { setselectedinterconsulta(item); setviewopcoesstatus(1); e.stopPropagation() }}
              >
                {item.status}
              </div>
            </div>
          </div>
        ))}
      </div>
      <InsertInterconsulta></InsertInterconsulta>
      <StatusInterconsulta></StatusInterconsulta>
    </div >
  )
}

export default Interconsultas;
