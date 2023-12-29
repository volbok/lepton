/* eslint eqeqeq: "off" */
import React, { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
// componentes.
import Gravador from '../components/Gravador';
// funções.
import modal from '../functions/modal';
// import toast from '../functions/toast';
import checkinput from '../functions/checkinput';
// imagens.
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import novo from '../images/novo.svg';
import back from '../images/back.svg';

function Laboratorio() {

  // context.
  const {
    html,
    settoast,
    setdialogo,
    laboratorio, setlaboratorio,
    paciente,
    atendimento,
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
      resultado: item.resultado,
      status: item.status
    }
    axios.post(html + 'insert_laboratorio', obj).then(() => {
      loadLaboratorio();
      setviewinsertlaboratorio(0);
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
      status: status
    }
    axios.post(html + 'update_laboratorio/' + item.id, obj).then(() => {
      loadLaboratorio();
      setviewinsertlaboratorio(0);
    })
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
          style={{ flexDirection: 'column' }}>
          <div className='text3'>SOLICITAÇÃO DE EXAMES LABORATORIAIS</div>
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
          <div className='scroll'>
            {arrayopcoeslaboratorio.map(item => (
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div className='button' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '50vw' }}>
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
      </div>
    )
    // eslint-disable-next-line
  }, [viewinsertlaboratorio]);

  return (
    <div id="scroll-alergias"
      className='card-aberto'
      style={{ display: card == 'card-alergias' ? 'flex' : 'none' }}
    >
      <div className="text3">EXAMES LABORATORIAIS</div>
      <div
        style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'center',
          flexWrap: 'wrap', width: '100%'
        }}>
        {laboratorio.map(item => (
          <div className='button' key={'laboratorio ' + item.id_alergia}
            style={{ width: '50vw', maxWidth: '50vw' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 50 }}>
              <div>
                {moment(item.data_pedido).format('DD/MM/YY')}
              </div>
              <div>
                {moment(item.data_pedido).format('HH:mm')}
              </div>
            </div>
            <div style={{ width: 300 }}>
              {item.nome_exame}
            </div>
            <div style={{ width: '100%' }}>
              {item.resultado}
            </div>
            <div className='button-red'
              style={{
                width: 25, minWidth: 25, height: 25, minHeight: 25,
                display: item.status == 0 ? 'flex' : 'none'
              }}
              onClick={(e) => {
                deleteLaboratorio(item); e.stopPropagation()
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
      <InsertLaboratorio></InsertLaboratorio>
    </div>
  )
}

export default Laboratorio;
