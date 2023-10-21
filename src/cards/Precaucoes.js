/* eslint eqeqeq: "off" */
import React, { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
import moment from 'moment';
import useSpeechToText from 'react-hook-speech-to-text';
// funções.
import modal from '../functions/modal';
// imagens.
import deletar from '../images/deletar.svg';
import novo from '../images/novo.svg';
import microfone from '../images/microfone.svg';
import back from '../images/back.svg';

function Precaucoes() {

  // context.
  const {
    html,
    setdialogo,
    precaucoes, setprecaucoes,
    paciente,
    card, setcard,
  } = useContext(Context);

  useEffect(() => {
    if (card == 'card-precaucoes') {
      loadPrecaucoes();
    }
    // eslint-disable-next-line
  }, [card]);

  // atualizar lista de precauções.
  const loadPrecaucoes = () => {
    axios.get(html + 'paciente_precaucoes/' + paciente).then((response) => {
      setprecaucoes(response.data.rows);
    })
  }

  // deletar precaução.
  const deletePrecaucao = (id) => {
    axios.get(html + 'delete_precaucao/' + id).then(() => {
      // toast(settoast, 'PRECAUÇÃO EXCLUÍDA COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
      loadPrecaucoes();
    })
  }

  // inserir precaução.
  const insertPrecaucao = (precaucao) => {
    var obj = {
      id_paciente: paciente,
      precaucao: precaucao,
      data_inicio: moment(),
      data_termino: null,
    }
    axios.post(html + 'insert_precaucao', obj).then(() => {
      // toast(settoast, 'PRECAUÇÃO ADICIONADA COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
      loadPrecaucoes();
      setviewinsertprecaucao(0);
    })
  }

  // opções de precaução.
  var arrayopcoesprecaucao = [
    'PADRÃO',
    'CONTATO',
    'AEROSSOL',
    'GOTÍCULA',
  ]
  const [tipoprecaucao, settipoprecaucao] = useState('SELECIONE');
  const [viewopcoesprecaucao, setviewopcoesprecaucao] = useState();
  function OpcoesPrecaucao() {
    return (
      <div className="fundo"
        onClick={(e) => { setviewopcoesprecaucao(0); e.stopPropagation() }}
        style={{ display: viewopcoesprecaucao == 1 ? 'flex' : 'none' }}>
        <div className="janela">
          {arrayopcoesprecaucao.map(item => (
            <div
              key={'arrayprecaucoes ' + item}
              className='button'
              style={{ width: 100 }}
              onClick={() => {
                settipoprecaucao(item);
                insertPrecaucao(item);
                setviewopcoesprecaucao(0);
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // componente para adição da precaução.
  const [viewinsertprecaucao, setviewinsertprecaucao] = useState();
  const InsertPrecaucao = useCallback(() => {
    return (
      <div className="fundo"
        onClick={(e) => { setviewinsertprecaucao(0); e.stopPropagation() }}
        style={{ display: viewinsertprecaucao == 1 ? 'flex' : 'none' }}>
        <div className="janela"
          onClick={(e) => e.stopPropagation()}
          style={{ flexDirection: 'column' }}>
          <div className='text3'>PRECAUÇÃO</div>
          <div
            className="button"
            onClick={(e) => {
              setviewopcoesprecaucao(1);
              e.stopPropagation();
            }}
            style={{
              width: window.innerWidth < 426 ? '50vw' : '15vw',
              margin: 5,
            }}
            id="inputPrecaucao"
          >
            {tipoprecaucao}
          </div>
          <div id="botão de retorno"
            className="button-red"
            style={{
              display: 'flex',
              alignSelf: 'center',
            }}
            onClick={() => setviewinsertprecaucao(0)}>
            <img
              alt=""
              src={back}
              style={{ width: 30, height: 30 }}
            ></img>
          </div>
        </div>
      </div>
    )
    // eslint-disable-next-line
  }, [viewinsertprecaucao]);

  // registro de alergia por voz.
  function Botoes() {
    const [btngravavoz, setbtngravavoz] = useState("button-green");
    const {
      isRecording,
      results,
      startSpeechToText,
      stopSpeechToText,
      setResults,
    } = useSpeechToText({
      continuous: true,
      useLegacyResults: false
    });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 15 }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
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
          <div id="btngravavoz" className={btngravavoz}
            style={{ display: 'flex', width: 50, height: 50 }}
            onClick={isRecording ?
              (e) => {
                stopSpeechToText();
                setbtngravavoz("button-green");
                results.map(result => insertPrecaucao([result.transcript.toString().toUpperCase()]));
                e.stopPropagation();
              } :
              (e) => {
                setbtngravavoz("gravando");
                startSpeechToText();
                e.stopPropagation();
              }}
          >
            <img
              alt=""
              src={microfone}
              style={{
                margin: 10,
                height: 30,
                width: 30,
              }}
            ></img>
          </div>
          <div id="btninputprecaucao"
            className='button-green'
            onClick={(e) => { setviewinsertprecaucao(1); e.stopPropagation() }}
            style={{ width: 50, height: 50 }}
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
        <div id="lista de resultados"
          className="button"
          style={{
            display: btngravavoz == "gravando" ? 'flex' : 'none',
            flexDirection: 'column', justifyContent: 'center', width: 150
          }}>
          {results.map(item => (
            <div key={item.timestamp}>
              {item.transcript.toUpperCase()}
            </div>
          ))}
          <div className='button-red'
            style={{ width: 25, minWidth: 25, height: 25, minHeight: 25 }}
            onClick={(e) => {
              stopSpeechToText();
              setResults([]);
              setbtngravavoz("button-green");
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
    );
  }

  return (
    <div id="scroll-precaucoes"
      className='card-aberto'
      style={{ display: card == 'card-precaucoes' ? 'flex' : 'none' }}
    >
      <div className="text3">
        PRECAUÇÕES
      </div>
      <Botoes></Botoes>
      <div
        style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'center',
          flexWrap: 'wrap', width: '100%'
        }}>
        {precaucoes.map(item => (
          <div className='button' key={'precaucao ' + item.id_precaucao}
            style={{ width: 200, maxWidth: 200 }}>
            <div style={{ width: '100%' }}>
              {item.precaucao}
            </div>
            <div className='button-red'
              style={{ width: 25, minWidth: 25, height: 25, minHeight: 25 }}
              onClick={(e) => {
                modal(setdialogo, 'CONFIRMAR EXCLUSÃO DA PRECAUÇÃO ' + item.precaucao + '?', deletePrecaucao, item.id_precaucao);
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
        ))}
      </div>
      <InsertPrecaucao></InsertPrecaucao>
      <OpcoesPrecaucao></OpcoesPrecaucao>
    </div >
  )
}

export default Precaucoes;
