/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Context from "./Context";
import moment from "moment";
// router.
import { useHistory } from "react-router-dom";

function Painel() {
  // context.
  const {
    html,
    unidade,
    pagina,
    setpagina,
    setusuario,
    altura
  } = useContext(Context);

  // history (router).
  let history = useHistory();

  const refreshApp = () => {
    setusuario({
      id: 0,
      nome_usuario: "LOGOFF",
      dn_usuario: null,
      cpf_usuario: null,
      email_usuario: null,
    });
    setpagina(0);
    history.push("/");
  };
  window.addEventListener("load", refreshApp);

  // recuperando o total de chamadas para a unidade de atendimento.
  const [chamadas, setchamadas] = useState([]);
  let qtde = 0;
  const loadChamadas = () => {
    axios.get(html + 'list_chamada/' + unidade).then((response) => {
      var x = response.data.rows;
      setchamadas(x);
      if (x.length > qtde) {
        qtde = x.length
      }
    })
  }
  const checkChamadas = () => {
    axios.get(html + 'list_chamada/' + unidade).then((response) => {
      var x = response.data.rows;
      setchamadas(x);
      if (x.length > qtde) {
        qtde = qtde + 1
        // dispara o som e a chamada de voz.
      }
    })
  }

  var timeout = null;
  useEffect(() => {
    if (pagina == 40) {
      loadChamadas();
      setInterval(() => {
        checkChamadas();
      }, 5000);
    }

    // eslint-disable-next-line
  }, [pagina]);

  function UltimaChamada() {
    return (
      <div
        style={{ width: '100%' }}>
        {chamadas.filter(item => item.id_unidade == unidade).sort((a, b) => moment(a.data) > moment(b.data) ? -1 : 1).slice(-1).map(item => {
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: 24 }}>
            <div className="button">{moment(item.data).format('HH:mm')}</div>
            <div className="button">{moment.id_sala}</div>
            <div className="button">{moment.nome_paciente}</div>
          </div>
        })}
      </div>
    )
  }

  function ListaDeChamadas() {
    return (
      <div
        className="scroll"
        style={{ width: '100%' }}>
        {chamadas.filter(item => item.id_unidade == unidade).sort((a, b) => moment(a.data) > moment(b.data) ? -1 : 1).slice(-5).map(item => {
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div className="button">{moment(item.data).format('HH:mm')}</div>
            <div className="button">{moment.id_sala}</div>
            <div className="button">{moment.nome_paciente}</div>
          </div>
        })}
      </div>
    )
  }

  return (
    <div
      className="main fadein"
      style={{
        display: pagina == 30 ? "flex" : "none",
        flexDirection: window.innerWidth > 425 ? "row" : "column",
        justifyContent: window.innerWidth > 425 ? "space-evenly" : "center",
        width: "100vw",
        height: altura,
      }}
    >
      <ListaDeChamadas></ListaDeChamadas>
    </div>
  );
}

export default Painel;
