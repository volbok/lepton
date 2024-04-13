/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Context from "./Context";
// funções.
import toast from "../functions/toast";
import moment from "moment";
// imagens.
import power from "../images/power.svg";
import lab_green from "../images/lab_green.svg";
import lab_red from "../images/lab_red.png";
import lab_yellow from "../images/lab_yellow.svg";

// html2pdf
import { Preview, print } from 'react-html2pdf';

// componentes.
import Logo from "../components/Logo";
// router.
import { useHistory } from "react-router-dom";

import Header from '../components/Header';
import Footer from '../components/Footer';

function Resultados() {
  // context.
  const {
    html,
    pagina,
    setpagina,
    settoast,
  } = useContext(Context);

  // history (router).
  let history = useHistory();
  const [paciente, setpaciente] = useState([]);

  const [component, setcomponent] = useState('LOGIN');
  useEffect(() => {
    if (pagina == 'RESULTADOS') {
      setcomponent('LOGIN');
      localStorage.setItem('dados_exame', '');
    }
    // eslint-disable-next-line
  }, [pagina]);

  // checando se o usuário inserido está registrado no sistema.
  var timeout = null;
  const checkPaciente = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      let id_paciente = document.getElementById("inputIdPaciente").value;
      let dn = document.getElementById("inputDn").value;
      localStorage.setItem("idpaciente", id_paciente)
      localStorage.setItem('dn', dn);
      if (id_paciente != '') {
        var obj = {
          id_paciente: id_paciente,
        }
        axios.post(html + 'checkpaciente', obj).then((response) => {
          var x = [0, 1];
          x = response.data.rows;
          console.log(x);
          if (x.length == 1) {
            console.log('DN: ' + dn);
            console.log('SENHA: ' + x.map(item => moment(item.dn_paciente).format('DD/MM/YYYY')).pop());
            if (dn == x.map(item => moment(item.dn_paciente).format('DD/MM/YYYY')).pop()) {
              setpaciente(x);
              setcomponent('RESULTADOS');
              loadListaExames();
              loadExames();
              toast(
                settoast,
                "LOGIN REALIZADO COM SUCESSO",
                "rgb(82, 190, 128, 1)",
                3000
              );
            } else {
              toast(
                settoast,
                "SENHA INCORRETA",
                "rgb(231, 76, 60, 1)",
                3000
              );
            }
          } else {
            toast(
              settoast,
              "PACIENTE NÃO ENCONTRADO",
              "rgb(231, 76, 60, 1)",
              3000
            );
          }
        })
          .catch(function () {
            toast(
              settoast,
              "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
              "black",
              5000
            );
            setTimeout(() => {
              setpagina(0);
              history.push("/");
            }, 5000);
          });
      } else {
        toast(
          settoast,
          "USUÁRIO OU SENHA INCORRETOS",
          "rgb(231, 76, 60, 1)",
          3000
        );
      }
    })
  }

  // inputs para login e senha.
  function Inputs() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <input
          autoComplete="off"
          placeholder="CÓDIGO DO PACIENTE"
          className="input"
          type="text"
          id="inputIdPaciente"
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "CÓDIGO DO PACIENTE")}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
          }}
        ></input>
        <div style={{ position: 'relative' }}>
          <input
            autoComplete="off"
            placeholder="SENHA"
            className="input"
            type="password"
            id="inputDn"
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "SENHA")}
            style={{
              marginTop: 10,
              marginBottom: 10,
              width: 200,
              height: 50,
            }}
          ></input>
          <div id="btn ver senha"
            style={{
              position: 'absolute', top: 20, right: -40,
              borderRadius: 50, height: 40, width: 40,
              backgroundColor: 'white',
            }}
            onClick={() => {
              document.getElementById("inputDn").setAttribute('type', 'text');
              document.getElementById("inputDn").focus();
            }}
          >
          </div>
        </div>
        <div
          id="btnloginpaciente"
          className="button"
          style={{
            display: 'flex',
            margin: 5,
            width: 150,
            padding: 10,
            minWidth: 150,
            alignSelf: 'center',
          }}
          onClick={() => {
            checkPaciente();
          }}
        >
          ENTRAR
        </div>
      </div>
    );
    // eslint-disable-next-line
  };

  const [random, setrandom] = useState(0);
  function Exames() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="text2" style={{ fontSize: 24 }}>{'OLÁ, ' + paciente.map(item => item.nome_paciente)}</div>
        <div className="text2">{'ACESSE ABAIXO OS RESULTADOS DOS SEUS EXAMES'}</div>
        <div>
          {listaexames.sort((a, b) => moment(a.data) < moment(b.data) ? 1 : -1).map(item => (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div id={"lista_exame " + item.id}
                onClick={() => {
                  localStorage.setItem('random', item.random);
                  localStorage.setItem('nome_profissional', item.nome_profissional);
                  localStorage.setItem('registro_profissional', item.registro_profissional);
                  if (document.getElementById('todososexames ' + item.id).style.display == 'none') {
                    document.getElementById('todososexames ' + item.id).style.display = 'flex';
                  } else {
                    document.getElementById('todososexames ' + item.id).style.display = 'none';
                  }
                }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr',
                }}>
                <div className="button cor1"
                  style={{
                    marginRight: 0,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                >
                  {moment(item.data).format('DD/MM/YYYY')}
                </div>
                <div className="button"
                  style={{
                    display: 'flex', flexDirection: 'column',
                    marginLeft: 0,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                >
                  <div>{item.nome_profissional}</div>
                  <div>{'CRM-MG ' + item.registro_profissional}</div>
                </div>
              </div>
              <div id={'todososexames ' + item.id}
                style={{
                  display: 'none',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
              >
                {exames.filter(valor => valor.random == item.random).map((item) => (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '3fr 2fr 1fr',
                      width: '90%',
                      alignSelf: 'center',
                    }}>
                    <div className="text2"
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        textAlign: 'left', justifyContent: 'flex-start', alignContent: 'flex-start',
                        width: '100%',
                      }}>
                      {item.nome_exame}
                    </div>
                    <div className="text2">{item.material}</div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: '100%',
                        alignSelf: 'center', alignContent: 'center',
                      }}>
                      <img
                        alt=""
                        src={item.status == 1 ? lab_yellow : item.status == 2 ? lab_green : lab_red}
                        style={{
                          margin: 5,
                          height: 20,
                          width: 20,
                        }}
                      ></img>
                    </div>
                  </div>
                ))}
                <div className="button"
                  onClick={() => {
                    setrandom(localStorage.getItem('random'));
                    setTimeout(() => {
                      printDiv();
                    }, 2000);
                  }}
                >
                  IMPRIMIR
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function Conteudo() {
    if (exames.length > 0) {
      return (
        <div
          id="conteudo laudo de exames laboratoriais"
          style={{
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
            justifyContent: 'center',
            fontFamily: 'Helvetica',
            breakInside: 'auto',
            whiteSpace: 'pre-wrap',
            flex: 1,
          }}>
          <div id='profissional requisitante'
            style={{ display: 'flex', flexDirection: 'row', alignSelf: 'flex-end', fontSize: 12, textAlign: 'right', width: '100%' }}
          >
            {
              'PROFISSIONAL SOLICITANTE:' + localStorage.getItem('nome_profissional') + ' - Nº CONSELHO: ' + localStorage.getItem('registro_profissional')
            }
          </div>
          {exames.filter(item => item.random == random).map(item => itemLaboratorioConstructor(item))}
        </div>
      )
    } else {
      return null
    }
  }

  const styles = {
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
    }
  }

  const itemLaboratorioConstructor = (item) => {
    console.log(item);
    let resultado = JSON.parse(item.resultado);
    if (resultado != null && resultado.length > 1) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            width: '100%',
            padding: 10,
            margin: 10,
            borderRadius: 5,
            borderColor: 'black',
            borderWidth: 1,
            borderStyle: 'solid',
            fontFamily: 'Helvetica',
            breakInside: 'avoid',
            flexGrow: 'inherit',
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 'bolder' }}>{item.nome_exame}</div>
          <div>{'MATERIAL: ' + item.material}</div>
          <div style={{ marginTop: 15 }}>{'RESULTADO:'}</div>
          <div style={styles.grid}>
            {resultado.map(valor => (
              <div style={{
                display: 'flex', flexDirection: 'column',
                margin: 5, padding: 10, backgroundColor: '#00000030', borderRadius: 5,
              }}
              >
                <div>{valor.campo + ': ' + valor.valor}</div>
                <div style={{ fontSize: 12 }}>{valor.vref_min == null || valor.vref_man == null ? '' : 'REFERÊNCIA: ' + valor.vref_min + ' A ' + valor.vref_max + '.'}</div>
              </div>
            ))}
          </div>
        </div>
      )
    } else if (resultado != null && resultado.length == 1) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            width: '100%',
            padding: 10,
            margin: 10,
            borderRadius: 5,
            borderColor: 'black',
            borderWidth: 1,
            borderStyle: 'solid',
            fontFamily: 'Helvetica',
            breakInside: 'avoid',
            flexGrow: 'inherit',
          }}
        >
          <div>
            {resultado.map(valor => (
              <div style={{
                display: 'flex', flexDirection: 'column',
                margin: 5, padding: 10, backgroundColor: '#00000030', borderRadius: 5,
              }}
              >
                <div style={{ fontSize: 22, fontWeight: 'bolder' }}>{valor.campo}</div>
                <div>{'MATERIAL: ' + item.material}</div>
                <div style={{ marginTop: 15 }}>{'RESULTADO:'}</div>
                <div>{valor.valor}</div>
                <div style={{ fontSize: 12 }}>{valor.vref_min == null || valor.vref_max == null ? '' : 'REFERÊNCIA: ' + valor.vref_min + ' A ' + valor.vref_max + '.'}</div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  }

  function PrintDocumento() {
    if (exames.length > 0) {
      return (
        <Preview id="pdf">
          <div id="IMPRESSÃO"
            className="print"
          >
            <table style={{ width: '100%' }}>
              <thead style={{ width: '100%' }}>
                <tr style={{ width: '100%' }}>
                  <td style={{ width: '100%' }}>
                    <Header></Header>
                  </td>
                </tr>
              </thead>
              <tbody style={{ width: '100%' }}>
                <tr style={{ width: '100%' }}>
                  <td style={{ width: '100%' }}>
                    <div id="campos"
                      style={{
                        display: 'flex', flexDirection: 'column',
                        breakInside: 'auto', alignSelf: 'center', width: '100%'
                      }}>
                      <Conteudo></Conteudo>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot style={{ width: '100%' }}>
                <tr style={{ width: '100%' }}>
                  <td style={{ width: '100%' }}>
                    <Footer></Footer>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Preview>
      )
    } else {
      return null
    }
  };

  function printDiv() {
    let printdocument = document.getElementById("IMPRESSÃO").innerHTML;
    var a = window.open('  ', 'DOCUMENTO PARA IMPRESSÃO');
    a.document.write('<html>');
    a.document.write(printdocument);
    a.document.write('</html>');
    a.print();
    print('MEUS EXAMES', 'pdf');

  }

  const [listaexames, setlistaexames] = useState([]);
  function loadListaExames() {
    console.log(localStorage.getItem("idpaciente"));
    axios.get(html + 'lista_laboratorio_cliente/' + localStorage.getItem("idpaciente")).then((response) => {
      var x = [0, 1];
      x = response.data.rows;
      setlistaexames(x);
      console.log(x.length);
    });
  }

  const [exames, setexames] = useState([]);
  function loadExames() {
    var obj = {
      id_paciente: localStorage.getItem("idpaciente"),
    }
    axios.post(html + 'laboratorio_cliente', obj).then((response) => {
      var x = [0, 1];
      x = response.data.rows;
      setexames(x);
      console.log(x.length);
    });
  }

  return (
    <div
      className="main"
      style={{ display: pagina == 'RESULTADOS' ? "flex" : "none" }}
    >
      <div id="conteúdo do login"
        className="chassi"
        style={{ display: component == 'LOGIN' ? 'flex' : 'none' }}
      >
        <div
          className="button-red"
          style={{
            display: "flex",
            position: "sticky",
            top: 10,
            right: 10,
            alignSelf: 'flex-end'
          }}
          title="FAZER LOGOFF."
          onClick={() => {
            setpaciente([]);
            setpagina(0);
            history.push("/");
          }}
        >
          <img
            alt=""
            src={power}
            style={{
              margin: 0,
              height: 30,
              width: 30,
            }}
          ></img>
        </div>
        <div
          className="text2 popin"
        >
          <Logo href="/site/index.html" target="_blank" rel="noreferrer" height={200} width={200}></Logo>
        </div>
        <div
          className="text2"
          style={{
            margin: 20, marginTop: 10,
            fontSize: 28,
          }}
        >
          PULSAR
        </div>
        <Inputs></Inputs>
      </div>
      <div id="conteúdo dos exames"
        className="chassi"
        style={{
          display: component == 'RESULTADOS' ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <div
          className="button-red"
          style={{
            display: "flex",
            position: "sticky",
            top: 10,
            right: 10,
            alignSelf: 'flex-end'
          }}
          title="FAZER LOGOFF."
          onClick={() => {
            setpaciente([]);
            setpagina(0);
            history.push("/");
          }}
        >
          <img
            alt=""
            src={power}
            style={{
              margin: 0,
              height: 30,
              width: 30,
            }}
          ></img>
        </div>
        <Exames></Exames>
        <PrintDocumento></PrintDocumento>
      </div>
    </div>
  )
}

export default Resultados;
