/* eslint eqeqeq: "off" */
import React, { useContext, useState, useEffect } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
// funções.
// import toast from '../functions/toast';
// imagens.
import back from '../images/back.svg';

function Anamnese() {

  // context.
  const {
    html,
    // settoast,

    unidade,
    pacientes,
    paciente,
    atendimentos, setatendimentos, // todos os registros de atendimento para a unidade selecionada.

    atendimento, // corresponde ao id_atendimento das tabela "atendimento".
    card, setcard,
  } = useContext(Context);

  const [anamnese, setanamnese] = useState([]);
  const [selectedatendimento, setselectedatendimento] = useState([]);

  useEffect(() => {
    if (card == 'card-anamnese') {
      setanamnese(pacientes.filter(item => item.id_paciente == paciente));
      setselectedatendimento(atendimentos.filter(item => item.id_atendimento == atendimento));
      document.getElementById("inputProblemas").value = atendimentos.filter(item => item.id_atendimento == atendimento).map(item => item.problemas);
      document.getElementById("inputSituacao").value = atendimentos.filter(item => item.id_atendimento == atendimento).map(item => item.situacao);
      // document.getElementById("inputAntecedentesPessoais").value = pacientes.filter(item => item.id_paciente == paciente).map(item => item.antecedentes_pessoais);
      // document.getElementById("inputMedicacoesPrevias").value = pacientes.filter(item => item.id_paciente == paciente).map(item => item.medicacoes_previas);
      // document.getElementById("inputExamesPrevios").value = pacientes.filter(item => item.id_paciente == paciente).map(item => item.exames_previos);
    }
    // eslint-disable-next-line
  }, [card, paciente, atendimentos, atendimento]);

  // atualizando um paciente.
  const updatePaciente = () => {
    var item = pacientes.filter(item => item.id_paciente == paciente);
    var obj = {
      nome_paciente: item.map(item => item.nome_paciente).pop(),
      nome_mae_paciente: item.map(item => item.nome_mae_paciente).pop(),
      dn_paciente: item.map(item => item.dn_paciente).pop(),
      antecedentes_pessoais: document.getElementById("inputAntecedentesPessoais").value.toUpperCase(),
      medicacoes_previas: document.getElementById("inputMedicacoesPrevias").value.toUpperCase(),
      exames_previos: document.getElementById("inputExamesPrevios").value.toUpperCase(),
      exames_atuais: document.getElementById("inputExamesAtuais").value.toUpperCase(),
    }
    console.log(JSON.stringify(obj));
    console.log('ID DO PACIENTE: ' + paciente)
    axios.post(html + 'update_paciente/' + paciente, obj).then(() => {
      updateAtendimento();
    })
  }

  // atualizando um atendimento.
  const updateAtendimento = () => {
    var obj = {
      data_inicio: selectedatendimento.map(item => item.data_inicio).pop(),
      data_termino: selectedatendimento.map(item => item.data_termino).pop(),
      problemas: document.getElementById("inputProblemas").value.toUpperCase(),
      id_paciente: selectedatendimento.map(item => item.id_paciente).pop(),
      id_unidade: selectedatendimento.map(item => item.id_unidade).pop(),
      nome_paciente: selectedatendimento.map(item => item.nome_paciente).pop(),
      leito: selectedatendimento.map(item => item.leito).pop(),
      situacao: document.getElementById("inputSituacao").value.toUpperCase(),
    }
    axios.post(html + 'update_atendimento/' + atendimento, obj).then(() => {
      // toast(settoast, 'DADOS DA ANAMNESE ATUALIZADOS COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
      axios.get(html + 'list_atendimentos/' + unidade).then((response) => {
        setatendimentos(response.data.rows);
        console.log('LISTA DE ATENDIMENTOS CARREGADA: ' + response.data.rows.length);
      });
    })
  }

  // registro de textarea por voz.
  function Botoes() {
    return (
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
      </div>
    );
  }

  var timeout = null;
  return (
    <div id="scroll-anamnese"
      className='card-aberto'
      style={{ display: card == 'card-anamnese' ? 'flex' : 'none' }}
    >
      <div
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          flex: 1
        }}>

        <div className='text3'>LISTA DE PROBLEMAS</div>
        <textarea
          className="textarea"
          autoComplete='off'
          placeholder='LISTA DE PROBLEMAS'
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'LISTA DE PROBLEMAS')}
          defaultValue={selectedatendimento.map(item => item.problemas)}
          onKeyUp={(e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              document.getElementById("inputProblemas").blur();
              setTimeout(() => {
                if (document.getElementById("inputProblemas").value != '') {
                  updatePaciente();
                }
              }, 1000);
              e.stopPropagation();
            }, 3000);
          }}
          style={{
            display: 'flex',
            flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
            whiteSpace: 'pre-wrap',
            width: window.innerWidth < 426 ? '85%' : '95%',
            height: window.innerWidth < 426 ? '50vh' : '',
          }}
          id="inputProblemas"
          title="LISTA DE PROBLEMAS."
        ></textarea>
        <div className='text3'>SITUAÇÃO</div>
        <textarea
          className="textarea"
          autoComplete='off'
          placeholder='SITUAÇÃO, CONTEXTO, HISTÓRIA DA DOENÇA ATUAL'
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'SITUAÇÃO, CONTEXTO, HISTÓRIA DA DOENÇA ATUAL')}
          defaultValue={selectedatendimento.map(item => item.situacao)}
          onKeyUp={(e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              document.getElementById("inputSituacao").blur();
              setTimeout(() => {
                if (document.getElementById("inputSituacao").value != '') {
                  updatePaciente();
                }
              }, 1000);
              e.stopPropagation();
            }, 4000);
          }}
          style={{
            display: 'flex',
            flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
            whiteSpace: 'pre-wrap',
            width: window.innerWidth < 426 ? '85%' : '95%',
            height: window.innerWidth < 426 ? '50vh' : '',
          }}
          id="inputSituacao"
          title="SITUAÇÃO, CONTEXTO, HISTÓRIA DA DOENÇA ATUAL."
        ></textarea>
        <div className='text3'>ANTECEDENTES PESSOAIS</div>
        <textarea
          className="textarea"
          autoComplete='off'
          placeholder='ANTECEDENTES PESSOAIS'
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'ANTECEDENTES PESSOAIS')}
          defaultValue={anamnese.map(item => item.antecedentes_pessoais)}
          onKeyUp={(e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              document.getElementById("inputAntecedentesPessoais").blur();
              setTimeout(() => {
                if (document.getElementById("inputAntecedentesPessoais").value != '') {
                  updatePaciente();
                }
              }, 1000);
              e.stopPropagation();
            }, 4000);
          }}
          style={{
            display: 'flex',
            flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
            whiteSpace: 'pre-wrap',
            width: window.innerWidth < 426 ? '85%' : '95%',
            height: window.innerWidth < 426 ? '50vh' : '',
          }}
          id="inputAntecedentesPessoais"
          title="ANTECEDENTES PESSOAIS."
        >
        </textarea>
        <div className='text3'>MEDICAÇÕES DE USO DOMICILIAR</div>
        <textarea
          className="textarea"
          autoComplete='off'
          placeholder='MEDICAÇÕES DE USO DOMICILIAR'
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'MEDICAÇÕES DE USO DOMICILIAR')}
          defaultValue={anamnese.map(item => item.medicacoes_previas)}
          onKeyUp={(e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              document.getElementById("inputMedicacoesPrevias").blur();
              setTimeout(() => {
                if (document.getElementById("inputMedicacoesPrevias").value != '') {
                  updatePaciente();
                }
              }, 1000);
              e.stopPropagation();
            }, 4000);
          }}
          style={{
            display: 'flex',
            flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
            whiteSpace: 'pre-wrap',
            width: window.innerWidth < 426 ? '85%' : '95%',
            height: window.innerWidth < 426 ? '50vh' : '',
          }}
          id="inputMedicacoesPrevias"
          title="MEDICAÇÕES DE USO DOMICILIAR."
        >
        </textarea>
        <div className='text3'>EXAMES PRÉVIOS</div>
        <textarea
          className="textarea"
          autoComplete='off'
          placeholder='EXAMES PRÉVIOS'
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'EXAMES PRÉVIOS')}
          defaultValue={anamnese.map(item => item.exames_previos)}
          onKeyUp={(e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              document.getElementById("inputExamesPrevios").blur();
              setTimeout(() => {
                if (document.getElementById("inputExamesPrevios").value != '') {
                  updatePaciente();
                }
              }, 1000);
              e.stopPropagation();
            }, 4000);
          }}
          style={{
            display: 'flex',
            flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
            whiteSpace: 'pre-wrap',
            width: window.innerWidth < 426 ? '85%' : '95%',
            height: window.innerWidth < 426 ? '50vh' : '',
          }}
          id="inputExamesPrevios"
          title="EXAMES PRÉVIOS."
        >
        </textarea>
        <div className='text3'>EXAMES ATUAIS</div>
        <textarea
          className="textarea"
          autoComplete='off'
          placeholder='EXAMES ATUAIS'
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'EXAMES ATUAIS')}
          defaultValue={anamnese.map(item => item.exames_atuais)}
          onKeyUp={(e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              document.getElementById("inputExamesAtuais").blur();
              setTimeout(() => {
                if (document.getElementById("inputExamesAtuais").value != '') {
                  updatePaciente();
                }
              }, 1000);
              e.stopPropagation();
            }, 4000);
          }}
          style={{
            display: 'flex',
            flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
            whiteSpace: 'pre-wrap',
            width: window.innerWidth < 426 ? '85%' : '95%',
            height: window.innerWidth < 426 ? '50vh' : '',
          }}
          id="inputExamesAtuais"
          title="EXAMES ATUAIS."
        >
        </textarea>
        <Botoes></Botoes>
      </div>
    </div>
  )
}

export default Anamnese;