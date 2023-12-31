/* eslint eqeqeq: "off" */
import React, { useContext, useEffect } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
// imagens.
import salvar from '../images/salvar.svg';
import back from '../images/back.svg';
import moment from "moment";
// router.
import { useHistory } from "react-router-dom";


function Laboratorio() {

  // context.
  const {
    pagina, setpagina,
    html,
    laboratorio, setlaboratorio,
    atendimentos, setatendimentos,
    unidades,
  } = useContext(Context);

  useEffect(() => {
    // eslint-disable-next-line
    if (pagina == 7) {
      console.log('PÁGINA LABORATÓRIO');
      loadAllAtendimentos();
      loadAllLaboratorio();
    }
    // eslint-disable-next-line
  }, [pagina]);

  // history (router).
  let history = useHistory();

  const loadAllAtendimentos = () => {
    axios.get(html + "all_atendimentos/").then((response) => {
      setatendimentos(response.data.rows);
    })
  }

  // atualizar lista de exames laboratoriais para o atendimento.
  const loadAllLaboratorio = () => {
    axios.get(html + 'all_laboratorio').then((response) => {
      setlaboratorio(response.data.rows);
    })
  }

  // atualizar pedido de exame de laboratorio.
  const updateLaboratorio = (item, resultado, data_resultado, status) => {
    var obj = {
      id_paciente: item.id_paciente,
      id_atendimento: item.id_atendimento,
      data_pedido: item.data_pedido,
      data_resultado: data_resultado,
      codigo_exame: item.codigo_exame,
      nome_exame: item.nome_exame,
      material: item.material,
      resultado: resultado,
      status: status,
      profissional: item.profissional,
    }
    console.log(obj)
    axios.post(html + 'update_laboratorio/' + item.id, obj).then(() => {
      loadAllLaboratorio();
    })
  }

  function TelaResultadoLaboratorio() {
    return (
      <div className='scroll' style={{
        height: '90vh', flexDirection: 'row', flexWrap: 'wrap',
        justifyContent: 'space-evenly', margin: 10,
      }}>
        {laboratorio.filter(item => item.status = 1).map(item => (
          <div key={'laboratorio ' + item.id_alergia}
            style={{
              display: 'flex', flexDirection: 'row', justifyContent: 'center',
              width: '45vw',
            }}
          >
            <div className="button-yellow" style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 250,
              marginRight: 0,
              borderTopRightRadius: 0, borderBottomRightRadius: 0,
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div>
                  {moment(item.data_pedido).format('DD/MM/YY')}
                </div>
                <div>
                  {moment(item.data_pedido).format('HH:mm')}
                </div>
              </div>
              <div id="identificação do leito"
                style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  margin: 10, padding: 10, borderRadius: 5, backgroundColor: 'rgb(0,0,0, 0.1)'
                }}>
                <div>{'UNIDADE: ' + unidades.filter(zeta => atendimentos.filter(valor => valor.id_atendimento == item.id_atendimento).map(valor => valor.id_unidade) == zeta.id_unidade).map(zeta => zeta.nome_unidade)}</div>
                <div>{'LEITO: ' + atendimentos.filter(valor => valor.id_atendimento == item.id_atendimento).map(valor => valor.leito)}</div>
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
                justifyContent: 'flex-start', alignContent: 'center',
                alignItems: 'center',
              }}>
                <div id="textarea para resultados."
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{
                    display: 'flex', height: 50,
                    alignItems: 'center'
                  }}>
                    <div style={{ width: '100%' }}>
                      {item.nome_exame}
                    </div>
                  </div>
                  <textarea id={"campo para digitar o resultado" + item.id}
                    className='textarea'
                    onClick={() => {
                      if (item.nome_exame == 'HEMOGRAMA COMPLETO') {
                        document.getElementById("campo para digitar o resultado" + item.id).value = "HGB: , HTO: , PLAQ: , GL: , BAST: , SEG: , LINF: ";
                        document.getElementById("campo para digitar o resultado" + item.id).focus();
                      }
                    }}
                    style={{ width: 'calc(100% - 10px)', height: 60, minHeight: 60, maxHeight: 60, alignSelf: 'center' }}
                  >
                  </textarea>
                </div>
                <div id={"botão para salvar o resultado " + item.id}
                  className='button-green'
                  style={{
                    display: item.status == 1 ? 'flex' : 'none',
                    alignSelf: 'center',
                    maxHeight: 30, minHeight: 30, maxWidth: 30, minWidth: 30,
                  }}
                  onClick={(e) => {
                    updateLaboratorio(item, document.getElementById("campo para digitar o resultado" + item.id).value.toUpperCase(), moment(), 2); e.stopPropagation()
                  }}>
                  <img
                    alt=""
                    src={salvar}
                    style={{
                      margin: 10,
                      height: 25,
                      width: 25,
                    }}
                  ></img>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div id="tela do laboratório"
      className='main'
      style={{
        display: pagina == 7 ? 'flex' : 'none',
        flexDirection: 'column', justifyContent: 'center',
        position: 'relative'
      }}
    >
      <div id="botão para sair da tela de laboratório"
        className="button-red"
        style={{
          position: 'sticky',
          top: 10, right: 10,
        }}
        onClick={() => {
          setpagina(0);
          history.push("/");
        }}>
        <img
          alt=""
          src={back}
          style={{ width: 30, height: 30 }}
        ></img>
      </div>
      <div className="text3">EXAMES LABORATORIAIS</div>
      <TelaResultadoLaboratorio></TelaResultadoLaboratorio>
    </div>
  )
}

export default Laboratorio;
