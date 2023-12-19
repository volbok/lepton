/* eslint eqeqeq: "off" */
import React, { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
import moment from "moment";

// funções.
// import toast from '../functions/toast';
// imagens.
import logo from '../images/logo.svg';
import print from '../images/imprimir.svg';
import back from '../images/back.svg';
import copiar from '../images/copiar.svg';
import salvar from '../images/salvar.svg';
import deletar from '../images/deletar.svg';

function Documentos() {

  // context.
  const {
    html,
    // settoast,
    usuario,
    pacientes,
    paciente,
    unidade, unidades,
    atendimentos, // todos os registros de atendimento para a unidade selecionada.
    atendimento, // corresponde ao id_atendimento das tabela "atendimento".
    card, setcard,
    tipodocumento, settipodocumento,
    documentos, setdocumentos,
  } = useContext(Context);

  const loadDocumentos = () => {
    axios.get(html + "list_documentos/" + atendimento).then((response) => {
      var x = response.data.rows;
      setdocumentos(x.sort((a, b) => moment(a.data) < moment(b.data) ? 1 : -1));
    })
  }

  useEffect(() => {
    loadDocumentos();
    if (card == 'card-documento-admissao') {
      console.log(card.toString().substring(0, 14));
      settipodocumento('ADMISSÃO')
      // setanamnese(pacientes.filter(item => item.id_paciente == paciente));
      // setselectedatendimento(atendimentos.filter(item => item.id_atendimento == atendimento));
      // document.getElementById("inputProblemas").value = atendimentos.filter(item => item.id_atendimento == atendimento).map(item => item.problemas);
      // document.getElementById("inputSituacao").value = atendimentos.filter(item => item.id_atendimento == atendimento).map(item => item.situacao);
      // document.getElementById("inputAntecedentesPessoais").value = pacientes.filter(item => item.id_paciente == paciente).map(item => item.antecedentes_pessoais);
      // document.getElementById("inputMedicacoesPrevias").value = pacientes.filter(item => item.id_paciente == paciente).map(item => item.medicacoes_previas);
      // document.getElementById("inputExamesPrevios").value = pacientes.filter(item => item.id_paciente == paciente).map(item => item.exames_previos);
    }
    // eslint-disable-next-line
  }, [card, paciente, atendimentos, atendimento]);

  // atualizando um documento.
  const updateDocumento = (item, status) => {
    var obj = {
      id_paciente: item.id_paciente,
      nome_paciente: item.nome_paciente,
      id_atendimento: item.id_atendimento,
      data: item.data,
      texto: document.getElementById("inputFieldDocumento").value.toUpperCase(),
      status: status,
      tipo_documento: item.tipo_documento,
      profissional: item.profissional
    }
    axios.post(html + 'update_documento/' + item.id, obj).then(() => {
      if (status == 1) {
        loadDocumentos();
      }
    })
  }

  const deleteDocumento = (id) => {
    axios.get(html + 'delete_documento/' + id).then(() => {
      loadDocumentos();
    })
  }

  // inserindo um documento.
  const insertDocumento = () => {
    let texto = '-x-'
    if (tipodocumento == 'ADMISSÃO') {
      texto =
        'LISTA DE PROBLEMAS: \n\n' +
        'HISTÓRIA DA DOENÇA ATUAL: \n\n' +
        'ANTECEDENTES PESSOAIS: \n\n' +
        'MEDICAÇÕES DE USO CONTÍNUO: \n\n' +
        'EXAMES COMPLEMENTARES PRÉVIOS RELEVANTES: \n\n' +
        'CONDUTA:'
    }

    var obj = {
      id_paciente: paciente,
      nome_paciente: pacientes.filter(item => item.id_paciente == paciente).map(item => item.nome_paciente).pop(),
      id_atendimento: atendimento,
      data: moment(),
      texto: texto,
      status: 0,
      tipo_documento: tipodocumento,
      profissional: usuario.nome_usuario + '\n' + usuario.conselho + '\n' + usuario.n_conselho
    }
    console.log(obj);
    console.log(usuario);
    axios.post(html + 'insert_documento', obj).then(() => {
      loadDocumentos();
    })
  }

  // copiar documento.
  const copiarDocumento = (item) => {
    var obj = {
      id_paciente: item.id_paciente,
      nome_paciente: item.nome_paciente,
      id_atendimento: item.id_atendimento,
      data: moment(),
      texto: item.texto,
      status: 0,
      tipo_documento: item.tipo_documento,
      profissional: usuario.nome_usuario + '\n' + usuario.conselho + '\n' + usuario.n_conselho
    }
    console.log(obj);
    axios.post(html + 'insert_documento', obj).then(() => {
      loadDocumentos();
    })
  }

  const [selecteddocumento, setselecteddocumento] = useState([]);
  const ListaDeDocumentos = useCallback(() => {
    return (
      <div
        style={{
          width: '30vw',
          height: '100%',
          margin: 0, marginLeft: 10, marginRight: 5,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div id="botão para sair da tela de documentos"
            className="button-yellow"
            style={{
              display: 'flex',
              alignSelf: 'center',
            }}
            onClick={() => setcard('')}>
            <img
              alt=""
              src={back}
              style={{ width: 20, height: 20 }}
            ></img>
          </div>
          <div className='button-green'
            style={{ width: '100%', marginLeft: 0 }}
            onClick={() => insertDocumento()}
          >
            NOVO...
          </div>
        </div>
        <div
          id="lista de documentos"
          className='scroll'
          style={{
            backgroundColor: 'white',
            borderColor: 'white',
            height: 'calc(100% - 75px)'
          }}
        >
          {documentos.filter(item => item.tipo_documento == tipodocumento).map((item) => (
            <div id={'documento ' + item.id}
              className='button'
              onClick={() => {
                setselecteddocumento(item);
                setTimeout(() => {
                  document.getElementById("inputFieldDocumento").value = item.texto;
                  var botoes = document.getElementById("lista de documentos").getElementsByClassName("button-red");
                  for (var i = 0; i < botoes.length; i++) {
                    botoes.item(i).className = "button";
                  }
                  document.getElementById('documento ' + item.id).className = "button-red";
                }, 1000);
              }}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 180 }}
            >
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div id="botão para deletar documento"
                  className="button-yellow"
                  style={{
                    display: 'flex',
                    alignSelf: 'center',
                    minHeight: 25, minWidth: 25, maxHeight: 24, maxWidth: 25,
                  }}
                  onClick={(e) => {
                    deleteDocumento(item.id)
                    e.stopPropagation();
                  }}>
                  <img
                    alt=""
                    src={deletar}
                    style={{ width: 20, height: 20 }}
                  ></img>
                </div>
                <div id="botão para assinar documento"
                  className="button-green"
                  style={{
                    display: item.status == 0 ? 'flex' : 'none',
                    alignSelf: 'center',
                    minHeight: 25, minWidth: 25, maxHeight: 24, maxWidth: 25,
                    marginLeft: 0,
                    marginRight: item.status == 0 ? 5 : 0,
                  }}
                  onClick={() => updateDocumento(item, 1)}>
                  <img
                    alt=""
                    src={salvar}
                    style={{ width: 20, height: 20 }}
                  ></img>
                </div>
                <div id="botão para copiar documento"
                  className="button-green"
                  style={{
                    display: item.status == 1 ? 'flex' : 'none',
                    alignSelf: 'center',
                    minHeight: 25, minWidth: 25, maxHeight: 24, maxWidth: 25, marginLeft: 0
                  }}
                  onClick={() => copiarDocumento(item)}>
                  <img
                    alt=""
                    src={copiar}
                    style={{ width: 20, height: 20 }}
                  ></img>
                </div>
                <div id="botão para imprimir documento"
                  className="button-green"
                  style={{
                    display: item.status == 1 ? 'flex' : 'none',
                    alignSelf: 'center',
                    minHeight: 25, minWidth: 25, maxHeight: 24, maxWidth: 25, marginLeft: 0
                  }}
                  onClick={() => printDiv()}>
                  <img
                    alt=""
                    src={print}
                    style={{ width: 20, height: 20 }}
                  ></img>
                </div>
              </div>
              <div>{tipodocumento}</div>
              <div style={{ fontSize: 10, marginTop: 10, whiteSpace: 'pre-wrap', marginBottom: 5 }}>{item.profissional}</div>
              <div>{moment(item.data).format('DD/MM/YY')}</div>
              <div>{moment(item.data).format('HH:mm')}</div>
            </div>
          ))}
        </div>
      </div >
    )
    // eslint-disable-next-line
  }, [documentos]);

  function FieldDocumento() {
    return (
      <textarea
        className="textarea"
        autoComplete='off'
        placeholder='DIGITE AQUI O TEXTO DO DOCUMENTO.'
        onFocus={(e) => (e.target.placeholder = '')}
        onBlur={(e) => (e.target.placeholder = 'DIGITE AQUI O TEXTO DO DOCUMENTO.')}
        onKeyUp={(e) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            if (document.getElementById("inputFieldDocumento").value != '') {
              updateDocumento(selecteddocumento, 0);
            }
            e.stopPropagation();
          }, 3000);
        }}
        style={{
          display: 'flex',
          flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
          whiteSpace: 'pre-wrap',
          width: '100%',
          height: 'calc(100% - 20px)',
          margin: 0, marginLeft: 5,
          pointerEvents: selecteddocumento != [] && selecteddocumento.status == 1 ? 'none' : 'auto'
        }}
        id="inputFieldDocumento"
      ></textarea>
    )
  }

  function printDiv() {
    console.log('PREPARANDO DOCUMENTO PARA IMPRESSÃO');
    let printdocument = document.getElementById("IMPRESSÃO - DOCUMENTO").innerHTML;
    var a = window.open('  ', '  ', 'width=1024px, height=800px');
    a.document.write('<html>');
    a.document.write(printdocument);
    a.document.write('</html>');
    a.print();
  }

  // impressão do documento.
  function PrintDocumento() {
    return (
      <div id="IMPRESSÃO - DOCUMENTO"
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
    )
  };
  function Header() {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column', justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
          height: 100, width: '100%',
          fontFamily: 'Helvetica',
          breakInside: 'avoid',
        }}>
          <img
            alt=""
            src={logo}
            style={{
              margin: 0,
              height: 100,
              width: 100,
            }}
          ></img>
          <div className="text1" style={{ fontSize: 24, height: '', alignSelf: 'center' }}>
            {tipodocumento}
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
            borderRadius: 5, backgroundColor: 'gray', color: 'white',
            padding: 10
          }}>
            <div>
              {moment(selecteddocumento.data).format('DD/MM/YY - HH:mm')}
            </div>
            <div style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
              fontSize: 20,
              fontFamily: 'Helvetica',
              breakInside: 'avoid',
            }}>
              {'LEITO: ' + atendimentos.filter(valor => valor.id_paciente == paciente && valor.situacao == 1).map(valor => valor.leito)}
            </div>
            <div>{'UNIDADE: ' + unidades.filter(item => item.id_unidade == unidade).map(item => item.nome_unidade)}</div>
            <div>{'ATENDIMENTO: ' + atendimento}</div>
          </div>
        </div>
        <div style={{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 22, marginTop: 10 }}>
          {'NOME CIVIL: ' + atendimentos.filter(valor => valor.id_atendimento == atendimento).map(valor => valor.nome_paciente)}
        </div>
        <div style={{ fontFamily: 'Helvetica', fontWeight: 'bold' }}>
          {'DN: ' + pacientes.filter(valor => valor.id_paciente == atendimentos.filter(valor => valor.id_atendimento == atendimento).map(valor => valor.id_paciente)).map(valor => moment(valor.dn_paciente).format('DD/MM/YYYY'))}
        </div>
        <div style={{ fontFamily: 'Helvetica', fontWeight: 'bold' }}>
          {'NOME DA MÃE: ' + pacientes.filter(valor => valor.id_paciente == atendimentos.filter(valor => valor.id_atendimento == atendimento).map(valor => valor.id_paciente)).map(valor => valor.nome_mae_paciente)}
        </div>
      </div>
    )
  }
  function Footer() {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        height: 100, width: '100%',
        fontFamily: 'Helvetica',
        breakInside: 'avoid',
      }}>
        <div className="text1">
          _______________________________________________
        </div>
        <div className="text1">
          {'PROFISSIONAL: ' + selecteddocumento.profissional}
        </div>
      </div>
    )
  }
  function Conteudo() {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        fontFamily: 'Helvetica',
        breakInside: 'avoid',
        whiteSpace: 'pre-wrap',
        marginTop: 20,
      }}>
        {selecteddocumento.texto}
      </div>
    )
  }

  var timeout = null;
  return (
    <div id="scroll-anamnese"
      className='card-aberto'
      style={{
        display: card.toString().substring(0, 14) == 'card-documento' ? 'flex' : 'none',
        flexDirection: 'row', justifyContent: 'center',
        overflowY: 'hidden',
        alignContent: 'center', alignSelf: 'center',
      }}
    >
      <FieldDocumento></FieldDocumento>
      <ListaDeDocumentos></ListaDeDocumentos>
      <PrintDocumento></PrintDocumento>
    </div>
  )
}

export default Documentos;