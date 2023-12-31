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

// componentes.
import Cid10 from '../functions/cid10';

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

    // dados para importação na evolução.
    alergias,
    sinaisvitais,
    vm,
    invasoes,
    lesoes,
    culturas,
    laboratorio,

    prescricao,
    mobilewidth,
  } = useContext(Context);

  const loadDocumentos = (situacao, item, status) => {
    axios.get(html + "list_documentos/" + atendimento).then((response) => {
      var x = response.data.rows;
      setdocumentos(x.sort((a, b) => moment(a.data) < moment(b.data) ? 1 : -1));
      if (situacao == 'atualizar') {
        document.getElementById('documento ' + item.id).className = "button-red";
        setTimeout(() => {
          if (status == 1) {
            document.getElementById("inputFieldDocumento").value = x.filter(valor => valor.id == item.id).map(valor => valor.texto);
            document.getElementById("inputFieldDocumento").style.pointerEvents = 'none';
          } else {
            document.getElementById("inputFieldDocumento").style.pointerEvents = 'auto';
          }
        }, 500);
      } else if (situacao == 'inserir') {
        let novodocumento = x.filter(item => item.tipo_documento == tipodocumento).sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-1);
        // setselecteddocumento(novodocumento);
        setTimeout(() => {
          var botoes = document.getElementById("lista de documentos").getElementsByClassName("button-red");
          for (var i = 0; i < botoes.length; i++) {
            botoes.item(i).className = "button";
          }
          document.getElementById('documento ' + novodocumento.map(valor => valor.id).pop()).className = "button-red";
          document.getElementById("inputFieldDocumento").value = novodocumento.map(valor => valor.texto).pop();
        }, 500);
      } else if (situacao == 'copiar') {
        document.getElementById('documento ' + item.id).className = "button-red";
        let novodocumento = x.filter(item => item.tipo_documento == tipodocumento).sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-1);
        document.getElementById('documento ' + novodocumento.map(valor => valor.id).pop()).style.display = 'none';
        // setselecteddocumento(novodocumento);
        setTimeout(() => {
          var botoes = document.getElementById("lista de documentos").getElementsByClassName("button-red");
          for (var i = 0; i < botoes.length; i++) {
            botoes.item(i).className = "button";
          }
          setTimeout(() => {
            document.getElementById('documento ' + novodocumento.map(valor => valor.id).pop()).style.display = 'flex';
            document.getElementById('documento ' + novodocumento.map(valor => valor.id).pop()).className = "button-red";
            document.getElementById("inputFieldDocumento").value = novodocumento.map(valor => valor.texto).pop();
          }, 300);
        }, 500);
      }
    })
  }

  useEffect(() => {
    if (card == 'card-documento-admissao') {
      settipodocumento('ADMISSÃO');
      preparaDocumentos();
    } else if (card == 'card-documento-evolucao') {
      settipodocumento('EVOLUÇÃO');
      preparaDocumentos();
    } else if (card == 'card-documento-receita') {
      settipodocumento('RECEITA MÉDICA');
      preparaDocumentos();
    } else if (card == 'card-documento-atestado') {
      settipodocumento('ATESTADO MÉDICO');
      preparaDocumentos();
    } else if (card == 'card-documento-alta') {
      settipodocumento('ALTA HOSPITALAR');
      preparaDocumentos();
    }

    // eslint-disable-next-line
  }, [card, paciente, atendimentos, atendimento]);

  const preparaDocumentos = () => {
    loadModelos();
    loadDocumentos();
    setselecteddocumento([]);
  }

  // SELEÇÃO DE CID PARA ATESTADO MÉDICO.
  const [viewseletorcid10, setviewseletorcid10] = useState(0);
  function SeletorCid10() {
    const [cid10] = useState(Cid10());
    const [arraycid10, setarraycid10] = useState([]);
    // filtro de paciente por nome.
    function FilterCid10() {
      var searchcid10 = "";
      const [filtercid10, setfiltercid10] = useState("");
      const filterCid10 = () => {
        clearTimeout(timeout);
        searchcid10 = document.getElementById("inputCid10").value;
        document.getElementById("inputCid10").focus();
        timeout = setTimeout(() => {
          if (searchcid10 == "") {
            searchcid10 = "";
            setarraycid10([]);
            document.getElementById("inputCid10").value = "";
            setTimeout(() => {
              document.getElementById("inputCid10").focus();
            }, 100);
          } else {
            console.log(searchcid10);
            setfiltercid10(searchcid10);
            setTimeout(() => {
              console.log(filtercid10);
              setarraycid10(cid10.filter((item) => item.DESCRICAO.toUpperCase().includes(searchcid10) || item.DESCRICAO.includes(searchcid10)));
              document.getElementById("inputCid10").value = searchcid10;
              document.getElementById("inputCid10").focus();
            }, 100);
          }
        }, 1000);
      };
      return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
          <input
            className="input"
            autoComplete="off"
            placeholder={
              window.innerWidth < mobilewidth ? "BUSCAR DOENÇA..." : "BUSCAR..."
            }
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) =>
              window.innerWidth < mobilewidth
                ? (e.target.placeholder = "BUSCAR DOENÇA...")
                : "BUSCAR..."
            }
            onKeyUp={() => filterCid10()}
            type="text"
            id="inputCid10"
            maxLength={100}
            defaultValue={filtercid10}
            style={{ width: '100%' }}
          ></input>
        </div>
      );
    }
    return (
      <div
        style={{ display: viewseletorcid10 == 1 ? 'flex' : 'none' }}
        className='fundo' onClick={() => setviewseletorcid10(0)}>
        <div
          className='janela scroll'
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
            width: '40vw', height: '50vw'
          }}>
          <FilterCid10></FilterCid10>
          {arraycid10.map(item => (
            <div className='button'
              style={{ width: 'calc(100% - 20px)' }}
              onClick={() => {
                setviewseletorcid10(0);
                setTimeout(() => {
                  let textoantigo = localStorage.getItem("texto");
                  let novotexto = textoantigo.slice(0, textoantigo.length - 5) + ' ' + item.CAT + '.';
                  document.getElementById("inputFieldDocumento").value = novotexto;
                  document.getElementById('documento ' + selecteddocumento.id).className = "button-red";
                }, 1000);
              }}
            >
              {item.CAT + ' - ' + item.DESCRICAO.toUpperCase()}
            </div>
          ))}
        </div>
      </div >
    )
  }
  function BtnCid10() {
    return (
      <div id="botão para selecionar cid10"
        className="button-green"
        style={{
          position: 'absolute',
          bottom: 10, right: 225,
          display: tipodocumento != 'ATESTADO MÉDICO' || selecteddocumento.status != 0 ? 'none' : 'flex',
          alignSelf: 'center',
        }}
        onClick={() => {
          localStorage.setItem('texto', document.getElementById("inputFieldDocumento").value.toUpperCase());
          setviewseletorcid10(1);
        }}>
        CID-10
      </div>
    )
  }

  // atualizando um documento.
  const updateDocumento = (item, texto, status) => {
    var obj = {
      id_paciente: item.id_paciente,
      nome_paciente: item.nome_paciente,
      id_atendimento: item.id_atendimento,
      data: item.data,
      texto: texto,
      status: status,
      tipo_documento: item.tipo_documento,
      profissional: item.profissional
    }
    axios.post(html + 'update_documento/' + item.id, obj).then(() => {
      if (status == 1) {
        loadDocumentos('atualizar', item, status, document.getElementById("inputFieldDocumento").value.toUpperCase());
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
      let tag_alergias = '';
      let tag_dadosvitais = '';
      let tag_invasoes = '';
      let tag_lesoes = '';
      let tag_vm = '';
      let tag_examesatuais = '';
      let tag_culturas = '';
      let tag_antibioticos = '';
      let tag_laboratorio = '';

      // função para montar os dados importados dos cards e demais componentes.
      if (alergias.length > 0) {
        tag_alergias =
          "ALERGIAS:" + alergias.map(item => '\n' + item.alergia)
      }
      if (sinaisvitais.length > 0) {
        tag_dadosvitais =
          "\nDADOS VITAIS:\nPA: " + sinaisvitais.slice(-1).map((item) => item.pas) + 'x' + sinaisvitais.slice(-1).map((item) => item.pad) + 'mmHg, FC: ' + sinaisvitais.slice(-1).map((item) => item.fc) + 'bpm, FR: ' + sinaisvitais.slice(-1).map((item) => item.fr) + 'irom, SAO2: ' + sinaisvitais.slice(-1).map((item) => item.sao2) + '%, TAX: ' + sinaisvitais.slice(-1).map((item) => item.tax) + 'ºC';
      }
      if (invasoes.length > 0) {
        let arrayinvasoes = invasoes.map(item => '\n' + item.dispositivo + ' - ' + item.local + ' (' + moment(item.data_implante).format('DD/MM/YY') + ')')
        tag_invasoes =
          "\nINVASÕES:" +
          arrayinvasoes;
      }
      if (lesoes.length > 0) {
        let arraylesoes = lesoes.filter(item => item.data_fechamento == null).map(item => '\nLOCAL: ' + item.local + ' - GRAU: ' + item.grau + ' (' + moment(item.data_abertura).format('DD/MM/YY') + ')')
        tag_lesoes =
          "\nLESÕES:" +
          arraylesoes;
      }
      if (vm.length > 0 && vm.slice(-1).map(item => item.modo) != 'OFF') {
        console.log(vm)
        tag_vm = "\nVENTILAÇÃO MECÂNICA:\nMODO: " +
          vm.slice(-1).map(item => item.modo) + ' PRESSÃO: ' + vm.slice(-1).map(item => item.pressao) + ' VOLUME: ' + vm.slice(-1).map(item => item.volume) + ' PEEP: ' + vm.slice(-1).map(item => item.peep) + ' FIO2: ' + vm.slice(-1).map(item => item.fio2);
      }
      if (pacientes.filter(item => item.exames_atuais) != null) {
        tag_examesatuais =
          "\nEXAMES ATUAIS:\n" +
          pacientes.filter(item => item.id_paciente == paciente).map(item => item.exames_atuais);
      }
      if (culturas.length > 0) {
        let arrayculturas = culturas.map(item => '\nMATERIAL: ' + item.material + '\nDATA: ' + moment(item.data_pedido).format('DD/MM/YY') + '\nRESULTADO: ' + item.resultado + '\n\n');
        tag_culturas =
          "\nCULTURAS:" +
          arrayculturas;
      }
      if (prescricao.filter(item => item.categoria == '1. ANTIMICROBIANOS' && moment(item.data).format('DD/MM/YY') == moment().format('DD/MM/YY')).length > 0) {
        let arrayprescricao = prescricao.filter(item => item.categoria == '1. ANTIMICROBIANOS' && moment(item.data).format('DD/MM/YY') == moment().format('DD/MM/YY')).map(item => '\nANTIBIÓTICO: ' + item.nome_item);
        tag_antibioticos =
          "\nANTIBIÓTICOS EM USO:\n" +
          arrayprescricao;
      }

      if (laboratorio.filter(item => item.status == 2).length > 0) {
        let arraylaboratorio = laboratorio.filter(item => item.status == 2).sort((a, b) => moment(a.data_pedido) < moment(b.data_pedido) ? 1 : -1).map(item => '\n' + moment(item.data_pedido).format('DD/MM/YY') + ' - ' + item.nome_exame + ': ' + item.resultado);
        tag_laboratorio =
          "\nEXAMES LABORATORIAIS:" +
          arraylaboratorio;
      }

      let texto = null;
      if (usuario.conselho == 'CRM') {
        texto =
          'HD: \n\n' +
          tag_alergias +
          tag_antibioticos +
          tag_culturas +
          tag_invasoes +
          tag_vm +
          tag_lesoes +
          tag_examesatuais +
          tag_laboratorio +
          tag_dadosvitais + '\n' +
          'EVOLUÇÃO: \n\n' +
          'AO EXAME: \n\n' +
          'CONDUTA:'
        insertDocumento(texto);
      } else {
        let texto =
          'EVOLUÇÃO: \n' +
          tag_dadosvitais + '\n\n' +
          'AO EXAME:'
        insertDocumento(texto);
      }
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
        'ATESTO QUE O PACIENTE ' + pacientes.filter(item => item.id_paciente == paciente).map(item => item.nome_paciente).pop() + ' NECESSITA AFASTAR-SE DO TRABALHO POR UM PERÍODO DE 2 DIAS, A CONTAR DE ' + moment(selecteddocumento.data).format('DD/MM/YY') + ' POR MOTIVO DE DOENÇA CID 10 XXX.';
      insertDocumento(texto);
    } else if (tipodocumento == 'ALTA HOSPITALAR') {
      let anamnese = documentos.filter(item => item.tipo_documento == 'ADMISSÃO').sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-1).map(item => item.texto).pop();
      let evolucao = documentos.filter(item => item.tipo_documento == 'EVOLUÇÃO').sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-1).map(item => item.texto).pop();
      let texto =
        'DATA DE ADMISSÃO: ' + atendimentos.filter(item => item.id_atendimento == atendimento).map(item => moment(item.data_inicio).format('DD/MM/YY')) + '\n' +
        'DATA DA ALTA: ' + moment().format('DD/MM/YY') + '\n\n' +
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
      loadDocumentos('inserir');
    })
  }

  // copiar documento.
  const copiarDocumento = (item, texto) => {
    var obj = {
      id_paciente: item.id_paciente,
      nome_paciente: item.nome_paciente,
      id_atendimento: item.id_atendimento,
      data: moment(),
      texto: texto,
      status: 0,
      tipo_documento: item.tipo_documento,
      profissional: usuario.nome_usuario + '\n' + usuario.conselho + '\n' + usuario.n_conselho
    }
    console.log(obj);
    axios.post(html + 'insert_documento', obj).then(() => {
      loadDocumentos('copiar', item);
    })
  }

  const [selecteddocumento, setselecteddocumento] = useState([]);
  const ListaDeDocumentos = useCallback(() => {
    return (
      <div
        style={{
          flex: 1,
          width: '30vw',
          height: '100%',
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
            height: 'calc(100% - 85px)'
          }}
        >
          {documentos.filter(item => item.tipo_documento == tipodocumento).map((item) => (
            <div id={'documento ' + item.id}
              className='button'
              onClick={() => {
                setselecteddocumento(item);
                setTimeout(() => {
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
                    display: item.profissional == usuario.nome_usuario + '\n' + usuario.conselho + '\n' + usuario.n_conselho ? 'flex' : 'none',
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
                  onClick={() => {
                    setselecteddocumento(item);
                    updateDocumento(item, document.getElementById("inputFieldDocumento").value.toUpperCase(), 1);
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
                    setselecteddocumento(item);
                    copiarDocumento(item, document.getElementById("inputFieldDocumento").value.toUpperCase())
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
              let texto = document.getElementById("inputFieldDocumento").value;
              localStorage.setItem("id", selecteddocumento.id);
              localStorage.setItem("texto", texto);
              console.log('ID:' + localStorage.getItem("id"));
              updateDocumento(selecteddocumento, document.getElementById("inputFieldDocumento").value.toUpperCase(), 0);
            }
            e.stopPropagation();
          }, 2000);
        }}
        style={{
          display: 'flex',
          flex: 2,
          flexDirection: 'row', justifyContent: 'center',
          alignSelf: 'center', alignContent: 'center',
          whiteSpace: 'pre-wrap',
          height: 'calc(100% - 20px)',
          margin: 0, marginLeft: -5,
          pointerEvents: selecteddocumento == [] || selecteddocumento.status == 1 ? 'none' : 'auto'
        }}
        id="inputFieldDocumento"
      ></textarea>
    )
  }

  // MODELOS DE DOCUMENTOS
  // modelos personalizados de receita médica e demais documentos, criados pelos usuários, que podem ser resgatados para edição de novos documentos.
  // selecionando modelos cadastrados e criando documentos a partir dos mesmos.
  const [arraymodelos, setarraymodelos] = useState([]);
  const loadModelos = () => {
    axios.get(html + 'list_model_documentos/' + usuario.id).then((response) => {
      var x = response.data.rows;
      setarraymodelos(x);
    });
  }
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
      loadDocumentos('inserir');
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

  // IMPRESSÃO DO DOCUMENTO.
  function printDiv() {
    console.log('PREPARANDO DOCUMENTO PARA IMPRESSÃO');
    let printdocument = document.getElementById("IMPRESSÃO - DOCUMENTO").innerHTML;
    var a = window.open();
    a.document.write('<html>');
    a.document.write(printdocument);
    a.document.write('</html>');
    a.print();
  }
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
        breakInside: 'auto',
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
        flex: 3,
        flexDirection: 'row', justifyContent: 'center',
        alignContent: 'center', alignSelf: 'center', alignItems: 'center',
        height: 'calc(100% - 20px)',
        position: 'relative',
      }}
    >
      <FieldDocumento></FieldDocumento>
      <ListaDeDocumentos></ListaDeDocumentos>
      <PrintDocumento></PrintDocumento>
      <ViewSelectModelos></ViewSelectModelos>
      <ViewCreateModelo></ViewCreateModelo>
      <BtnCid10></BtnCid10>
      <SeletorCid10></SeletorCid10>
    </div>
  )
}

export default Documentos;