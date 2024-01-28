/* eslint eqeqeq: "off" */
import React, { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../pages/Context';
import moment from 'moment';
import axios from 'axios';
// imagens.
import logo from '../images/logo.svg';
import back from '../images/back.svg';
import print from '../images/imprimir.svg';
import copiar from '../images/copiar.svg';
import novo from '../images/novo.svg';
import salvar from '../images/salvar.svg';
import deletar from '../images/deletar.svg';

function DocumentoEstruturado() {

  // context.
  const {
    html,
    unidades, unidade,
    atendimento,
    atendimentos,
    paciente,
    pacientes,
    card, setcard,
    usuario,
    tipodocumento, settipodocumento,
  } = useContext(Context);

  useEffect(() => {
    if (card == 'card-doc-estruturado-aih') {
      settipodocumento('AIH');
      loadDocumentosEstruturados('AIH');
    }
    // eslint-disable-next-line
  }, [card, paciente]);

  // CARREGANDO DOCUMENTOS ESTRUTURADOS E RESPECTIVOS CAMPOS.
  const [arraydocumentosestruturados, setarraydocumentosestruturados] = useState([]);
  const loadDocumentosEstruturados = (tipodocumento) => {
    axios.get(html + 'documentos_estruturados/' + paciente).then((response) => {
      var x = response.data.rows;
      setarraydocumentosestruturados(x.filter(item => item.tipodocumento == tipodocumento).sort((a, b) => moment(a.data) < moment(b.data) ? 1 : -1));
    })
  }
  const [camposestruturados, setcamposestruturados] = useState([]);
  const loadCamposEstruturados = (id) => {
    if (id != null) {
      axios.get(html + 'campos_estruturados/' + id).then((response) => {
        var x = response.data.rows;
        setcamposestruturados(x);
        console.log(x);
      })
    } else {
      setcamposestruturados([]);
    }
  }

  // CRUD PARA DOCUMENTOS ESTRUTURADOS E SEUS RESPECTIVOS CAMPOS.
  const insertDocumentoEstruturado = (tipodocumento) => {
    var obj = {
      id_paciente: paciente,
      id_atendimento: atendimento,
      data: moment(),
      id_usuario: usuario.id,
      status: 0, // 0 = documento novo; 1 = documento assinado.
      tipodocumento: tipodocumento,
    }
    let iddocumento = null;
    axios.post(html + 'insert_documento_estruturado', obj).then(() => {
      // recuperando id do documento estruturado...
      axios.get(html + 'documentos_estruturados/' + paciente).then((response) => {
        var x = response.data.rows;
        var y = x.filter(item => item.tipodocumento == tipodocumento).sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-1);
        iddocumento = y.map(item => item.id).pop();
        console.log(iddocumento);
        // inserir campos estruturados correspondentes.
        insertGrupoCamposEstruturados(iddocumento, tipodocumento, obj);
      })
    })
  }
  const updateDocumentoEstruturado = (item) => {
    var obj = {
      id_paciente: item.id_paciente,
      id_atendimento: item.id_atendimento,
      data: moment(),
      id_usuario: item.id_usuario,
      status: 1, // 0 = documento novo; 1 = documento assinado.
      tipodocumento: item.tipodocumento,
    }
    axios.post(html + 'update_documento_estruturado/' + item.id, obj).then(() => {
      loadDocumentosEstruturados(tipodocumento);
      loadCamposEstruturados(null)
    })
  }
  const insertGrupoCamposEstruturados = (iddocumento, tipodocumento, obj) => {
    if (tipodocumento == 'AIH') {
      insertCampoEstruturado(iddocumento, tipodocumento, obj, 'VALOR ITEM 1 AIH', 'TITULO ITEM 1 AIH', 100, 200, 1);
      loadDocumentosEstruturados(tipodocumento);
    }
  }
  const deleteDocumentoEstruturado = (id) => {
    axios.get(html + 'delete_documento_estruturado/' + id).then(() => {
      console.log('DOCUMENTO ESTRUTURADO EXCLUÍDO COM SUCESSO');
      // deletando campos estruturados associados.
      axios.get(html + 'campos_estruturados/' + id).then((response) => {
        var x = response.data.rows;
        console.log(x);
        x.map(item => deleteCampoEstruturado(item.id));
      });
      loadDocumentosEstruturados();
      loadCamposEstruturados(null);
    })
  }
  const insertCampoEstruturado = (iddocumento, tipodocumento, obj, valor, titulo, altura, largura, obrigatorio) => {
    var obj1 = {
      id_documento: iddocumento,
      id_paciente: obj.id_paciente,
      id_atendimento: obj.id_atendimento,
      data: obj.data,
      valor: valor,
      titulo: titulo,
      tipo: tipodocumento,
      altura: altura,
      largura: largura,
      obrigatorio: obrigatorio
    }
    console.log(obj1);
    axios.post(html + 'insert_campo_estruturado', obj1).then(() => {
      console.log('CAMPO INSERIDO COM SUCESSO');
    })
  }
  const updateCampoEstruturado = (item, valor) => {
    var obj = {
      id_documento: item.id_documento,
      id_paciente: item.id_paciente,
      id_atendimento: item.id_atendimento,
      data: item.data,
      valor: valor,
      titulo: item.titulo,
      tipo: item.tipo,
      altura: item.altura,
      largura: item.largura,
      obrigatorio: item.obrigatorio
    }
    axios.post(html + 'update_campo_estruturado/' + item.id, obj).then(() => {
      console.log('CAMPO ATUALIZADO COM SUCESSO');
    })
  }
  const deleteCampoEstruturado = (item) => {
    axios.get(html + 'delete_campo_estruturado/' + item).then(() => {
      console.log('CAMPO DELETADO COM SUCESSO');
    });
  }

  // LISTA DE DOCUMENTOS ESTRUTURADOS CARREGADOS.
  const [selecteddocumentoestruturado, setselecteddocumentoestruturado] = useState([]);
  const ListaDeDocumentos = useCallback(() => {
    return (
      <div
        style={{
          flex: 1,
          width: '30vw',
          margin: 0, marginLeft: 10,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
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
              style={{ width: 30, height: 30 }}
            ></img>
          </div>
          <div className='button-green'
            style={{ width: '100%', marginLeft: 0 }}
            onClick={() => insertDocumentoEstruturado(tipodocumento)}
          >
            <img
              alt=""
              src={novo}
              style={{ width: 30, height: 30 }}
            ></img>
          </div>
        </div>
        <div
          id="lista de documentos estruturados"
          className='scroll'
          style={{
            backgroundColor: 'white',
            borderColor: 'white',
            height: 'calc(100% - 110px)'
          }}
        >
          {arraydocumentosestruturados.map((item) => (
            <div id={'documento estruturado' + item.id}
              className='button'
              onClick={() => {
                setselecteddocumentoestruturado(item);
                loadCamposEstruturados(item.id);
                setTimeout(() => {
                  var botoes = document.getElementById("lista de documentos estruturados").getElementsByClassName("button-red");
                  for (var i = 0; i < botoes.length; i++) {
                    botoes.item(i).className = "button";
                  }
                  document.getElementById('documento estruturado' + item.id).className = "button-red";
                }, 1000);
              }}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 180 }}
            >
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div id="botão para deletar documento"
                  className="button-yellow"
                  style={{
                    display: item.id_usuario == usuario.id ? 'flex' : 'none',
                    alignSelf: 'center',
                    minHeight: 25, minWidth: 25, maxHeight: 24, maxWidth: 25,
                  }}
                  onClick={(e) => {
                    deleteDocumentoEstruturado(item.id)
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
                  onClick={(e) => {
                    setselecteddocumentoestruturado(item);
                    updateDocumentoEstruturado(item);
                    e.stopPropagation();
                  }}>
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
                  onClick={() => {
                    setselecteddocumentoestruturado(item);
                    // copiarDocumento(item, document.getElementById("inputFieldDocumento").value.toUpperCase())
                  }}>
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
  }, [arraydocumentosestruturados]);

  // CAMPOS ESTRUTURADOS PARA FORMULÁRIO.
  const campo = (item, titulo, valor, altura, largura, obrigatorio) => {
    var timeout = null;
    return (
      <div style={{
        margin: 2.5, padding: 2.5,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative',
        width: largura, minWidth: largura,
        height: altura, minHeight: altura,
      }}
        onMouseLeave={() => {
          if (document.getElementById(titulo).value == '' && obrigatorio == 1) {
            document.getElementById('check ' + titulo).style.display = 'flex'
          } else {
            document.getElementById('check ' + titulo).style.display = 'none'
          }
        }}
      >
        <div id={'check ' + titulo}
          style={{
            display: 'none',
            position: 'absolute', bottom: 5, right: 5,
            borderRadius: 50,
            backgroundColor: 'red',
            color: 'white', fontWeight: 'bold',
            width: 25, height: 25,
            justifyContent: 'center',
          }}>
          <div>!</div>
        </div>
        <div
          className='text1'>{titulo}</div>
        <textarea
          id={titulo}
          className='textarea'
          defaultValue={valor}
          onKeyUp={() => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              updateCampoEstruturado(item, document.getElementById(titulo).value.toUpperCase());
            }, 2000);
          }}
        >
        </textarea>
      </div>
    )
  }

  function Formulario() {
    return (
      <div
        style={{
          width: 'calc(100% - 20px)',
        }}>
        <div className='text1' style={{ fontSize: 16 }}>{tipodocumento}</div>
        <div style={{
          display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
          pointerEvents: selecteddocumentoestruturado.status == 0 ? 'auto' : 'none',
        }}>
          {camposestruturados.map(item => campo(item, item.titulo, item.valor, item.altura, item.largura, item.obrigatorio))}
        </div>
      </div>
    )
  }

  // CAMPOS ESTRUTURADOS PARA IMPRESSÃO.
  function PrintInput(titulo, valor, largura) {
    return (
      <div style={{
        margin: 2.5, padding: 2.5,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        width: largura, minWidth: largura,
        fontFamily: 'Helvetica',
        breakInside: 'avoid',
        borderStyle: 'solid', borderWidth: 1, borderRadius: 5,
        borderColor: 'black',
      }}
      >
        <div
          className='text1' style={{ fontWeight: 'normal', fontSize: 12, marginBottom: 2.5 }}>{titulo}</div>
        <div
          id={titulo}
          className='text1'
        >
          {valor}
        </div>
      </div>
    )
  }
  // PDF PARA IMPRESSÃO.
  function printDiv() {
    console.log('PREPARANDO DOCUMENTO PARA IMPRESSÃO');
    let printdocument = document.getElementById("IMPRESSÃO - DOCUMENTO ESTRUTURADO").innerHTML;
    var a = window.open();
    a.document.write('<html>');
    a.document.write(printdocument);
    a.document.write('</html>');
    a.print();
    a.close();
  }
  function PrintDocumento() {
    return (
      <div id="IMPRESSÃO - DOCUMENTO ESTRUTURADO"
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
            {'AIH'}
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
            borderRadius: 5, backgroundColor: 'gray', color: 'white',
            padding: 10
          }}>
            <div>
              {moment().format('DD/MM/YY - HH:mm')}
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
          {'PROFISSIONAL: '}
        </div>
      </div>
    )
  }
  function Conteudo() {
    return (
      <div style={{
        display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
        justifyContent: 'space-between',
        fontFamily: 'Helvetica',
        breakInside: 'auto',
        whiteSpace: 'pre-wrap',
        marginTop: 20,
      }}>
        {PrintInput('TESTE PARA IMPRESSÃO', 'VALOR', 300)}
        {PrintInput('TESTE PARA IMPRESSÃO', 'VALOR EXTENSO, DE GRANDE TAMANHO, GERALMENTE ASSOCIADO A TEXTAREAS NOS FORMULÁRIOS. SERÁ QUE SUA ALTURA AUMENTA AUTOMATICAMENTE? ESPERO QUE SIM.', 300)}
      </div>
    )
  }

  return (
    <div id="scroll-documento-estruturado"
      className='card-aberto'
      style={{
        display: card == 'card-doc-estruturado-aih' ? 'flex' : 'none', flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%', height: '',
      }}
    >
      <Formulario></Formulario>
      <ListaDeDocumentos></ListaDeDocumentos>
      <PrintDocumento></PrintDocumento>
    </div>
  )
}

export default DocumentoEstruturado;