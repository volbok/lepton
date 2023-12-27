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
import favorito_usar from '../images/favorito_usar.svg';
import favorito_salvar from '../images/favorito_salvar.svg';
import salvar from '../images/salvar.svg';
import novo from '../images/novo.svg';
import deletar from '../images/deletar.svg';
import checkinput from '../functions/checkinput';

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
    settoast,
  } = useContext(Context);

  const loadDocumentos = () => {
    axios.get(html + "list_documentos/" + atendimento).then((response) => {
      var x = response.data.rows;
      setdocumentos(x.sort((a, b) => moment(a.data) < moment(b.data) ? 1 : -1));
    })
  }

  useEffect(() => {
    loadModelos();
    loadDocumentos();
    setselecteddocumento([]);
    if (card == 'card-documento-admissao') {
      settipodocumento('ADMISSÃO');
    } else if (card == 'card-documento-evolucao') {
      settipodocumento('EVOLUÇÃO');
    } else if (card == 'card-documento-receita') {
      settipodocumento('RECEITA MÉDICA');
    } else if (card == 'card-documento-atestado') {
      settipodocumento('ATESTADO');
    } else if (card == 'card-documento-alta') {
      settipodocumento('ALTA HOSPITALAR');
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
  const montaTexto = () => {
    console.log(tipodocumento);
    if (tipodocumento == 'ADMISSÃO') {
      let texto =
        'LISTA DE PROBLEMAS: \n\n' +
        'HISTÓRIA DA DOENÇA ATUAL: \n\n' +
        'ANTECEDENTES PESSOAIS: \n\n' +
        'MEDICAÇÕES DE USO CONTÍNUO: \n\n' +
        'EXAMES COMPLEMENTARES PRÉVIOS RELEVANTES: \n\n' +
        'CONDUTA:'
      insertDocumento(texto);
    } else if (tipodocumento == 'EVOLUÇÃO') {
      // recuperando dados vitais registrados pela enfermagem.
      let dadosvitais = null;
      let tag_dadosvitais = null;
      axios.get(html + "list_sinais_vitais/" + atendimento).then((response) => {
        let x = response.data.rows
        dadosvitais = x.sort((a, b) => moment(a.data_sinais_vitais) > moment(b.data_sinais_vitais) ? -1 : 1).pop();
        if (dadosvitais != null) {
          tag_dadosvitais = 'PAS: ' + dadosvitais.pas + ', PAD: ' + dadosvitais.pad + ', FC: ' + dadosvitais.fc + ' FR: ' + dadosvitais.fr + ' SAO2: ' + dadosvitais.sao2 + ' TAX: ' + dadosvitais.tax + ' GLICEMIA: ' + dadosvitais.glicemia;
        }
        if (usuario.conselho == 'CRM') {
          let texto = null;
          if (dadosvitais != null) {
            texto =
              'HD: \n\n' +
              'EVOLUÇÃO: \n\n' +
              'DADOS VITAIS: \n' +
              tag_dadosvitais + '\n\n' +
              'AO EXAME: \n\n' +
              '\n\n' +
              'CONDUTA:'
          } else {
            texto =
              'HD: \n\n' +
              'EVOLUÇÃO: \n\n' +
              'AO EXAME: \n\n' +
              '\n\n' +
              'CONDUTA:'
          }
          insertDocumento(texto);
        } else {
          let texto =
            'EVOLUÇÃO: \n' +
            tag_dadosvitais + '\n\n' +
            'AO EXAME:'
          insertDocumento(texto);
        }
      });
    } else if (tipodocumento == 'RECEITA MÉDICA') {
      let texto =
        'USO ORAL: \n\n' +
        '1. AMOXICILINA 500MG .................... 21 CP. \n' +
        'TOMAR 1CP VO 8;8H, POR 7 DIAS. \n\n' +
        '2. PARACETAMOL GOTAS (500MG/ML) ......... 01 FR. \n' +
        'TOMAR 1CP VO 8;8H, POR 7 DIAS. \n\n'
      insertDocumento(texto);
    } else if (tipodocumento == 'ATESTADO MÉDICO') {
      let texto =
        'ATESTO QUE O PACIENTE ' + pacientes.filter(item => item.id_paciente == paciente).map(item => item.nome_paciente).pop() + ' NECESSITA AFASTAR-SE DO TRABALHO POR UM PERÍODO DE XX DIAS, POR MOTIVO DE DOENÇA CID 10 XXX.'
      insertDocumento(texto);
    } else if (tipodocumento == 'ALTA HOSPITALAR') {
      let anamnese = documentos.filter(item => item.tipo_documento == 'ADMISSÃO').slice(-1).map(item => item.texto).pop();
      let evolucao = documentos.filter(item => item.tipo_documento == 'EVOLUÇÃO').slice(-1).map(item => item.texto).pop();
      let texto =
        anamnese + '\n\n' +
        evolucao
      insertDocumento(texto);
    }

  }

  const insertDocumento = (texto) => {
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
      setselecteddocumento([]);
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
      setselecteddocumento([]);
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
              style={{ width: 30, height: 30 }}
            ></img>
          </div>
          <div className='button-green'
            style={{ width: '100%', marginLeft: 0 }}
            onClick={() => montaTexto()}
          >
            <img
              alt=""
              src={novo}
              style={{ width: 30, height: 30 }}
            ></img>
          </div>
          <div className='button-green'
            title="MEUS MODELOS"
            style={{ width: 50, marginLeft: 0 }}
            onClick={() => setviewselectmodelos(1)}
          >
            <img
              alt=""
              src={favorito_usar}
              style={{ width: 30, height: 30 }}
            ></img>
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
                  // artifício para preservar o texto de um documento atualizado, sem precisar chamar a função loadDocumentos().
                  if (item.id == localStorage.getItem("id")) {
                    document.getElementById("inputFieldDocumento").value = localStorage.getItem("texto");
                  } else {
                    document.getElementById("inputFieldDocumento").value = item.texto;
                  }
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

  const [arraymodelos, setarraymodelos] = useState([]);
  const loadModelos = () => {
    axios.get(html + 'list_model_documentos/' + usuario.id).then((response) => {
      var x = response.data.rows;
      setarraymodelos(x);
    });
  }

  // MODELOS DE DOCUMENTOS
  // modelos personalizados de receita médica e demais documentos, criados pelos usuários, que podem ser resgatados para edição de novos documentos.
  // selecionando modelos cadastrados e criando documentos a partir dos mesmos.
  const insertModeloDocumento = (item) => {
    var obj = {
      id_paciente: paciente,
      nome_paciente: pacientes.filter(item => item.id_paciente == paciente).map(item => item.nome_paciente).pop(),
      id_atendimento: atendimento,
      data: moment(),
      texto: item,
      status: 0,
      tipo_documento: tipodocumento,
      profissional: usuario.nome_usuario + '\n' + usuario.conselho + '\n' + usuario.n_conselho
    }
    axios.post(html + 'insert_documento', obj).then(() => {
      setviewselectmodelos(0);
      loadDocumentos();
      setselecteddocumento([]);
    })
  }
  const [viewselectmodelos, setviewselectmodelos] = useState(0);
  function ViewSelectModelos() {
    return (
      <div
        style={{ display: viewselectmodelos == 1 ? 'flex' : 'none' }}
        className='fundo' onClick={() => setviewselectmodelos(0)}>
        <div
          className='janela scroll'
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
            maxHeight: '80vh', maxWidth: '50vw'
          }}
        >
          <div className='text1'>{'MODELOS DE DOCUMENTO PERSONALIZADOS - ' + tipodocumento}</div>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {arraymodelos.filter(item => item.tipo_documento == tipodocumento).map(item => (
              <div className='button'
                style={{ width: 150, height: 150, position: 'relative' }}
                onClick={() => insertModeloDocumento(item.texto)}
              >
                <div>
                  {item.nome_modelo}
                </div>
                <div id="botão para acessar a janela de criação de modelo de documento."
                  className="button-red"
                  onClick={(e) => { deletarModeloDocumento(item); e.stopPropagation() }}
                  style={{
                    position: 'absolute', top: 10, right: 10,
                    display: 'flex',
                    alignSelf: 'center',
                    minHeight: 30, maxHeight: 30, minWidth: 30, maxWidth: 30
                  }}>
                  <img
                    alt=""
                    src={deletar}
                    style={{ width: 20, height: 20 }}
                  ></img>
                </div>
              </div>
            ))}
          </div>
          <div id="botão para acessar a janela de criação de modelo de documento."
            className="button-green"
            onClick={() => setviewcreatemodelo(1)}
            style={{
              display: 'flex',
              alignSelf: 'center',
            }}>
            <img
              alt=""
              src={novo}
              style={{ width: 30, height: 30 }}
            ></img>
          </div>
        </div>
      </div>
    )
  }

  // criando um modelo de documento.
  const criarModeloDocumento = () => {
    var obj = {
      id_usuario: usuario.id,
      tipo_documento: tipodocumento,
      nome_modelo: document.getElementById("inputNomeModeloDocumento").value.toUpperCase(),
      texto: document.getElementById("inputTextoModeloDocumento").value.toUpperCase(),
    }
    axios.post(html + 'insert_model_documento', obj).then(() => {
      setviewcreatemodelo(0);
      loadModelos();
      loadDocumentos();
      setselecteddocumento([]);
    })
  }
  const deletarModeloDocumento = (item) => {
    axios.get(html + 'delete_model_documento/' + item.id).then(() => {
      loadModelos();
    });
  }

  const [viewcreatemodelo, setviewcreatemodelo] = useState(0);
  function ViewCreateModelo() {
    return (
      <div
        style={{ display: viewcreatemodelo == 1 ? 'flex' : 'none' }}
        className='fundo' onClick={() => setviewcreatemodelo(0)}>
        <div
          className='janela'
          onClick={(e) => e.stopPropagation()}
        >
          <input
            autoComplete="off"
            placeholder="NOME DO MODELO"
            title="PROCURE USAR NOMES DE FÁCIL ASSOCIAÇÃO AO DOCUMENTO."
            className="input destacaborda"
            type="text"
            id="inputNomeModeloDocumento"
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "NOME DO MODELO")}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignSelf: "center",
              width: window.innerWidth > 425 ? "30vw" : "70vw",
              alignContent: "center",
              height: 40,
              minHeight: 40,
              maxHeight: 40,
              borderStyle: "none",
              textAlign: "center",
            }}
          ></input>
          <textarea
            className="textarea"
            type="text"
            id="inputTextoModeloDocumento"
            placeholder="EDITE AQUI O CONTEÚDO DO MODELO DE DOCUMENTO."
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "EDITE AQUI O CONTEÚDO DO MODELO DE DOCUMENTO.")}
            style={{
              flexDirection: "center",
              justifyContent: "center",
              alignSelf: "center",
              width: "50vw",
              padding: 15,
              height: '40vh'
            }}
          ></textarea>
          <div id="inputSalvarModelo"
            className="button-green"
            onClick={() => checkinput("textarea", settoast, ["inputNomeModeloDocumento", "inputTextoModeloDocumento"], "inputSalvarModelo", criarModeloDocumento, [])}
            style={{
              display: 'flex',
              alignSelf: 'center',
            }}>
            <img
              alt=""
              src={favorito_salvar}
              style={{ width: 20, height: 20 }}
            ></img>
          </div>
        </div>
      </div>
    )
  }

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
              let texto = document.getElementById("inputFieldDocumento").value;
              localStorage.setItem("id", selecteddocumento.id);
              localStorage.setItem("texto", texto);
              console.log('ID:' + localStorage.getItem("id"));
              updateDocumento(selecteddocumento, 0);
            }
            e.stopPropagation();
          }, 2000);
        }}
        style={{
          display: 'flex',
          flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
          whiteSpace: 'pre-wrap',
          width: '100%',
          height: 'calc(100% - 20px)',
          margin: 0, marginLeft: 5,
          pointerEvents: selecteddocumento == [] || selecteddocumento.status == 1 ? 'none' : 'auto'
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
    <div id="scroll-documentos"
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
      <ViewSelectModelos></ViewSelectModelos>
      <ViewCreateModelo></ViewCreateModelo>
    </div>
  )
}

export default Documentos;