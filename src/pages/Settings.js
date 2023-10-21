/* eslint eqeqeq: "off" */
import React, { useContext, useEffect } from 'react';
import Context from './Context';
import axios from 'axios';
// router.
import { useHistory } from 'react-router-dom';
// imagens.
import back from '../images/back.svg';
import salvar from '../images/salvar.svg';

function Settings() {

  // context.
  const {
    html,
    usuario,
    pagina, setpagina,
    setusuario,
    settings,

    settema, tema,
    carddiasinternacao, setcarddiasinternacao,
    cardalergias, setcardalergias,
    cardanamnese, setcardanamnese,
    cardevolucoes, setcardevolucoes,
    cardpropostas, setcardpropostas,
    cardprecaucoes, setcardprecaucoes,
    cardriscos, setcardriscos,
    cardalertas, setcardalertas,
    cardsinaisvitais, setcardsinaisvitais,
    cardbody, setcardbody,
    cardvm, setcardvm,
    cardinfusoes, setcardinfusoes,
    carddieta, setcarddieta,
    cardculturas, setcardculturas,
    cardatb, setcardatb,
    cardinterconsultas, setcardinterconsultas,

  } = useContext(Context);

  // history (router).
  let history = useHistory();

  const refreshApp = () => {
    setusuario(
      {
        id: 0,
        nome_usuario: 'LOGOFF',
        dn_usuario: null,
        cpf_usuario: null,
        email_usuario: null,
      });
    setpagina(0);
    history.push('/');
  }
  window.addEventListener('load', refreshApp);

  useEffect(() => {
    if (pagina == 4) {
      // recuperando configurações dos cards.
      setcarddiasinternacao(settings.map(item => item.card_diasinternacao).pop());
      setcardalergias(settings.map(item => item.card_alergias).pop());
      setcardanamnese(settings.map(item => item.card_anamnese).pop());
      setcardevolucoes(settings.map(item => item.card_evolucoes).pop());
      setcardpropostas(settings.map(item => item.card_propostas).pop());
      setcardprecaucoes(settings.map(item => item.card_precaucoes).pop());
      setcardriscos(settings.map(item => item.card_riscos).pop());
      setcardalertas(settings.map(item => item.card_alertas).pop());
      setcardsinaisvitais(settings.map(item => item.card_sinaisvitais).pop());
      setcarddiasinternacao(settings.map(item => item.card_diasinternacao).pop());
      setcardbody(settings.map(item => item.card_body).pop());
      setcardvm(settings.map(item => item.card_vm).pop());
      setcardinfusoes(settings.map(item => item.card_infusoes).pop());
      setcarddieta(settings.map(item => item.card_dieta).pop());
      setcardculturas(settings.map(item => item.card_culturas).pop());
      setcardatb(settings.map(item => item.card_antibioticos).pop());
      setcardinterconsultas(settings.map(item => item.card_interconsultas).pop());
    }
    // eslint-disable-next-line
  }, [pagina]);

  // atualizando configurações.
  const updateOptions = () => {
    var id = usuario.id;
    console.log('ID: ' + id);
    var obj = {
      id_usuario: id,
      tema: tema,
      card_diasinternacao: carddiasinternacao,
      card_alergias: cardalergias,
      card_anamnese: cardanamnese,
      card_evolucoes: cardevolucoes,
      card_propostas: cardpropostas,
      card_precaucoes: cardprecaucoes,
      card_riscos: cardriscos,
      card_alertas: cardalergias,
      card_sinaisvitais: cardsinaisvitais,
      card_body: cardbody,
      card_vm: cardvm,
      card_infusoes: cardinfusoes,
      card_dieta: carddieta,
      card_culturas: cardculturas,
      card_antibioticos: cardatb,
      card_interconsultas: cardinterconsultas
    }
    axios.post(html + 'update_settings/' + settings.map(item => item.id), obj).then(() => {
      setpagina(0);
      history.push('/')
    });
  }

  // função para seleção de esquemas de cores (temas) da aplicação.
  const changeTema = (tema) => {
    settema(tema);
    if (tema == 1) { // tema AZUL.
      document.documentElement.style.setProperty('--cor1', 'rgba(64, 74, 131, 0.7)');
      document.documentElement.style.setProperty('--cor1hover', 'rgba(64, 74, 131, 1)');
      document.documentElement.style.setProperty('--cor2', 'rgba(242, 242, 242)');
      document.documentElement.style.setProperty('--cor3', 'rgba(215, 219, 221)');
      document.documentElement.style.setProperty('--texto1', 'rgba(97, 99, 110, 1)');
      document.documentElement.style.setProperty('--texto2', '#ffffff');
      document.documentElement.style.setProperty('--texto3', 'rgba(64, 74, 131, 1)');
      document.documentElement.style.setProperty('--placeholder', 'rgb(97, 99, 110, 0.6)');
      document.documentElement.style.setProperty('--cor0', 'white');
    } else if (tema == 2) { // tema VERDE.
      document.documentElement.style.setProperty('--cor1', 'rgba(26, 188, 156, 0.7)');
      document.documentElement.style.setProperty('--cor1hover', 'rgba(26, 188, 156, 1)');
      document.documentElement.style.setProperty('--cor2', 'rgba(242, 242, 242)');
      document.documentElement.style.setProperty('--cor3', 'rgba(215, 219, 221)');
      document.documentElement.style.setProperty('--texto1', 'rgba(97, 99, 110, 1)');
      document.documentElement.style.setProperty('--texto2', '#ffffff');
      document.documentElement.style.setProperty('--texto3', '#48C9B0');
      document.documentElement.style.setProperty('--placeholder', 'rgb(97, 99, 110, 0.6)');
      document.documentElement.style.setProperty('--cor0', 'white');
    } else if (tema == 3) { // tema PRETO.
      document.documentElement.style.setProperty('--cor1', 'rgb(86, 101, 115, 0.6)');
      document.documentElement.style.setProperty('--cor1hover', 'rgb(86, 101, 115, 1)');
      document.documentElement.style.setProperty('--cor2', 'rgb(23, 32, 42, 1)');
      document.documentElement.style.setProperty('--cor3', 'black');
      document.documentElement.style.setProperty('--texto1', '#ffffff');
      document.documentElement.style.setProperty('--texto2', '#ffffff');
      document.documentElement.style.setProperty('--texto3', '#ffffff');
      document.documentElement.style.setProperty('--placeholder', 'rgb(255, 255, 255, 0.5)');
      document.documentElement.style.setProperty('--cor0', '#000000');
    } else {
      document.documentElement.style.setProperty('--cor1', 'rgba(64, 74, 131, 0.7)');
      document.documentElement.style.setProperty('--cor1hover', 'rgba(64, 74, 131, 1)');
      document.documentElement.style.setProperty('--cor2', 'rgba(242, 242, 242)');
      document.documentElement.style.setProperty('--cor3', 'rgba(215, 219, 221)');
      document.documentElement.style.setProperty('--texto1', 'rgba(97, 99, 110, 1)');
      document.documentElement.style.setProperty('--texto2', '#ffffff');
      document.documentElement.style.setProperty('--texto3', 'rgba(64, 74, 131, 1)');
      document.documentElement.style.setProperty('--placeholder', 'rgb(97, 99, 110, 0.6)');
      document.documentElement.style.setProperty('--cor0', 'white');
    }
  }

  // construtor dos seletores para os cards.
  const cardSelector = (titulo, estado, setestado) => {
    return (
      <div
        className='button'
        style={{
          minWidth: window.innerWidth < 426 ? '35vw' : 130,
          maxWidth: window.innerWidth < 426 ? '35vw' : 130,
          minHeight: window.innerWidth < 426 ? '35vw' : 130,
          maxHeight: window.innerWidth < 426 ? '35vw' : 130,
          opacity: estado == 1 ? 1 : 0.3
        }}
        onClick={() => {
          if (estado == 0) {
            setestado(1);
          } else {
            setestado(0);
          }
        }}
      >
        {titulo}
      </div>
    )
  }

  return (
    <div className="main" style={{ justifyContent: 'flex-start' }}>
      <div className="text3">
        CONFIGURAÇÕES
      </div>
      <div style={{
        display: 'flex',
        flexDirection: window.innerWidth < 426 ? 'column' : 'row',
        justifyContent: 'center', alignContent: 'center', alignItems: 'center',
      }}>
        <div className='cor2' style={{ display: 'flex', flexDirection: 'column', borderRadius: 5 }}>
          <div className='text1'>TEMA</div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div className={tema == 1 ? 'button-red' : 'button'}
              onClick={() => changeTema(1)}
            >
              {'AZUL'}
            </div>
            <div className={tema == 2 ? 'button-red' : 'button'}
              onClick={() => changeTema(2)}
            >
              {'VERDE'}
            </div>
            <div className={tema == 3 ? 'button-red' : 'button'}
              onClick={() => changeTema(3)}
            >
              {'PRETO'}
            </div>
          </div>
        </div>
        <div
          className='button'
          style={{ margin: 10, padding: 15, width: 100 }}
          onClick={() => {
            setpagina(5);
            history.push('/usuarios')
          }}
        >
          CADASTRO DE USUARIOS
        </div>
      </div>
      <div className='text1'>CARDS VISUALIZADOS</div>
      <div className='scroll' style={{
        height: window.innerWidth < 426 ? '26vh' : '55vh',
        width: window.innerWidth < 426 ? '88vw' : '90vw'
      }}>
        <div style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap',
        }}>
          {cardSelector('TEMPO DE INTERNAÇÃO', carddiasinternacao, setcarddiasinternacao)}
          {cardSelector('ALERGIAS', cardalergias, setcardalergias)}
          {cardSelector('ANAMNESE', cardanamnese, setcardanamnese)}
          {cardSelector('EVOLUÇÕES', cardevolucoes, setcardevolucoes)}
          {cardSelector('PROPOSTAS', cardpropostas, setcardpropostas)}
          {cardSelector('PRECAUÇÕES', cardprecaucoes, setcardprecaucoes)}
          {cardSelector('RISCOS', cardriscos, setcardriscos)}
          {cardSelector('ALERTAS', cardalertas, setcardalertas)}
          {cardSelector('SINAIS VITAIS', cardsinaisvitais, setcardsinaisvitais)}
          {cardSelector('INVASÕES E LESÕES', cardbody, setcardbody)}
          {cardSelector('VENTILAÇÃO MECÂNICA', cardvm, setcardvm)}
          {cardSelector('INFUSÕES', cardinfusoes, setcardinfusoes)}
          {cardSelector('DIETA', carddieta, setcarddieta)}
          {cardSelector('CULTURAS', cardculturas, setcardculturas)}
          {cardSelector('ANTIBIÓTICOS', cardatb, setcardatb)}
          {cardSelector('INTERCONSULTAS', cardinterconsultas, setcardinterconsultas)}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
        <div id="botão de retorno"
          className="button-red"
          style={{
            display: 'flex',
            alignSelf: 'center',
          }}
          onClick={() => { setpagina(1); history.push('/passometro') }}>
          <img
            alt=""
            src={back}
            style={{ width: 30, height: 30 }}
          ></img>
        </div>
        <div id="btnupdatesettings"
          className='button-green'
          onClick={(e) => { updateOptions() }}
          style={{ width: 50, height: 50 }}
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
  )
}

export default Settings;
