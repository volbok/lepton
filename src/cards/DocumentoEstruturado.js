/* eslint eqeqeq: "off" */
import React, { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../pages/Context';
import moment from 'moment';
import axios from 'axios';
// imagens.
import back from '../images/back.svg';
import print from '../images/imprimir.svg';
import copiar from '../images/copiar.svg';
import novo from '../images/novo.svg';
import salvar from '../images/salvar.svg';
import deletar from '../images/deletar.svg';
// funções.
import selector from '../functions/selector';
// componentes.
import Header from '../components/Header';
import Footer from '../components/Footer';

function DocumentoEstruturado() {

  // context.
  const {
    html,
    atendimento,
    paciente,
    pacientes,
    card, setcard,
    usuarios,
    usuario,
    tipodocumento, settipodocumento,
    selecteddocumento, setselecteddocumento,
    setdono_documento,
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
      id_profissional: usuario.id,
      conselho: usuario.conselho + ': ' + usuario.n_conselho,
      nome_profissional: usuario.nome_usuario
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
        setselecteddocumento([]);
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
      id_profissional: usuario.id,
      conselho: usuario.conselho + ': ' + usuario.n_conselho,
      nome_profissional: usuario.nome_usuario
    }
    axios.post(html + 'update_documento_estruturado/' + item.id, obj).then(() => {
      loadDocumentosEstruturados(tipodocumento);
      loadCamposEstruturados(null);
      setselecteddocumento([]);
    })
  }

  const insertGrupoCamposEstruturados = (iddocumento, tipodocumento, obj) => {
    if (tipodocumento == 'AIH') {
      let lastevolucao = '';
      // recuperando informações da última evolução para alimentar a AIH...
      axios.get(html + "list_documentos/" + atendimento).then((response) => {
        var x = response.data.rows;
        lastevolucao = x.filter(item => item.tipo_documento == 'EVOLUÇÃO').map(item => item.texto).slice(-1).pop();
        console.log(x.filter(item => item.tipo_documento == 'EVOLUÇÃO').map(item => item.texto).slice(-1).pop())

        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '1 - NOME DO ESTABELECIMENTO DE SOLICITANTE', 'UNIDADE DE PRONTO ATENDIMENTO JUSTINÓPOLIS', 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '2 - CNES', '6632858', 50, 1, 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '3- NOME DO ESTABELECIMENTO EXECUTANTE', '', 0);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '4 - CNES', '', 0);

        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '5 - NOME DO PACIENTE', pacientes.filter(item => item.id_paciente == paciente).map(item => item.nome_paciente).pop(), 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '6 - Nº DO PRONTUÁRIO', paciente, 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '7 - CARTÃO NACIONAL DE SAÚDE (CNS)', '', 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '8 - DATA DE NASCIMENTO', pacientes.filter(item => item.id_paciente == paciente).map(item => moment(item.dn_paciente).format('DD/MM/YY')).pop(), 1);
        insertCampoEstruturado('opcaounica', iddocumento, tipodocumento, obj, '9 - SEXO', '', 1, 'M,F');
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '10 - RAÇA', '', 50, 1, 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '11 - NOME DA MÃE', pacientes.filter(item => item.id_paciente == paciente).map(item => item.nome_mae_paciente).pop(), 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '12 - TELEFONE DE CONTATO', '', 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '13 - NOME DO RESPONSÁVEL', '', 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '14 - TELEFONE DE CONTATO', '', 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '15 - ENDEREÇO (RUA, Nº, BAIRRO', pacientes.filter(item => item.id_paciente == paciente).map(item => item.endereco).pop(), 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '16 - MUNICÍPIO DE RESIDÊNCIA', '', 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '17 - CÓD. IBGE MUNICÍPIO', '', 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '18 - UF', '', 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '19 - CEP', '', 1);

        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '20 - PRINCIPAIS SINAIS E SINTOMAS CLÍNICOS', lastevolucao, 1, '');
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '21 - CONDIÇÕES QUE JUSTIFICAM A INTERNAÇÃO', 'RISCO DE MORTE', 1, '');
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '22 - PRINCIPAIS RESULTADOS DE PROVAS DIAGNÓSTICAS (RESULTADOS DE EXAMES REALIZADOS)', 'VIDE EXAMES ACIMA', 1, '');

        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '23 - DIAGNÓSTICO INICIAL', '', 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '24 - CID 10 PRINCIPAL', '', 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '25 - CID 10 SECUNDÁRIO', '', 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '26 - CID 10 CAUSAS ASSOCIADAS', '', 1);

        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '27 - DESCRIÇÃO DO PROCEDIMENTO SOLICITADO', '', 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '28 - CÓDIGO DO PROCEDIMENTO', '', 1);

        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '29 - CLÍNICA', 'CLÍNICA MÉDICA', 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '30 - CARÁTER DE INTERNAÇÃO', 'URGÊNCIA', 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '31 - DOCUMENTO', '', 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '32 - DOCUMENTO DO PROFISSIONAL SOLICITANTE', '', 1);

        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '33 - NOME DO PROFISSIONAL SOLICITANTE/ASSISTENTE', usuarios.filter(valor => valor.id_usuario == selecteddocumento.id_usuario).map(valor => valor.nome_usuario), 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '34 - DATA DA SOLICITAÇÃO', moment().format('DD/MM/YYYY'), 1);
        insertCampoEstruturado('textarea', iddocumento, tipodocumento, obj, '35 - ASSINTAURA E CARIMBO (Nº DO REGISTRO DO CONSELHO)', '', 1);

        // testando opção múltipla.
        insertCampoEstruturado('opcaomultipla', iddocumento, tipodocumento, obj, '36 - OPÇÕES VARIADAS', '', 1, 'A,B,C,D');
        insertCampoEstruturado('opcaounica', iddocumento, tipodocumento, obj, '37 - IAN E LEO VAMOS FICAR RICOS', '', 1, 'SIM, CORRETO MEU AMIGO');

        // FALTAM MAIS CAMPOS PARA CADASTRAR...

        loadDocumentosEstruturados(tipodocumento);
      });
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
        loadDocumentosEstruturados(tipodocumento);
        loadCamposEstruturados(null);
        setselecteddocumento([]);
      });
    });
  }
  const insertCampoEstruturado = (tipocampo, iddocumento, tipodocumento, obj, titulo, valor, obrigatorio, opcoes) => {
    var obj1 = {
      id_documento: iddocumento,
      id_paciente: obj.id_paciente,
      id_atendimento: obj.id_atendimento,
      data: obj.data,
      valor: valor,
      titulo: titulo,
      tipo: tipodocumento,
      altura: null,
      largura: null,
      obrigatorio: obrigatorio,
      tipocampo: tipocampo,
      opcoes: opcoes,
    }
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
      obrigatorio: item.obrigatorio,
      tipocampo: item.tipocampo,
      opcoes: item.opcoes,
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
  const copiarDocumentoEstruturado = (id) => {
    // inserindo um novo documento estruturado.
    var obj = {
      id_paciente: paciente,
      id_atendimento: atendimento,
      data: moment(),
      id_usuario: usuario.id,
      status: 0, // 0 = documento novo; 1 = documento assinado.
      tipodocumento: tipodocumento,
    }
    axios.post(html + 'insert_documento_estruturado', obj).then(() => {
      // recuperando a id do documento criado.
      axios.get(html + 'documentos_estruturados/' + paciente).then((response) => {
        var x = response.data.rows;
        var y = x.filter(item => item.tipodocumento == tipodocumento).sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-1);
        let iddocumento = y.map(item => item.id).pop();
        console.log('TIPO DE DOCUMENTO: ' + tipodocumento);
        console.log('ID NOVA: ' + iddocumento);
        // carregando os campos estruturados do documento copiado.
        axios.get(html + 'campos_estruturados/' + id).then((response) => {
          var x = response.data.rows;
          // eslint-disable-next-line
          x.filter(item => item.id_documento == id).map(item => {
            var obj = {
              id_documento: iddocumento,
              id_paciente: item.id_paciente,
              id_atendimento: atendimento,
              data: moment(),
              valor: item.valor,
              titulo: item.titulo,
              tipo: item.tipo,
              altura: item.altura,
              largura: item.largura,
              obrigatorio: item.obrigatorio,
              tipocampo: item.tipocampo,
              opcoes: item.opcoes,
            }
            console.log(obj);
            axios.post(html + 'insert_campo_estruturado', obj).then(() => {
              console.log('CAMPO COPIADO COM SUCESSO');
            });
          });
          setselecteddocumento([])
          loadDocumentosEstruturados(tipodocumento);
          loadCamposEstruturados(null);
        });
      });
    });
  }

  // LISTA DE DOCUMENTOS ESTRUTURADOS CARREGADOS.
  const ListaDeDocumentosEstruturados = useCallback(() => {
    return (
      <div id="componente lista de documentos e botões"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '20vw',
          height: 'calc(100vh - 20px)',
          position: 'sticky',
          top: 10, right: 5, marginLeft: 7.5
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
            height: 'calc(100% - 110px)',
            width: 'calc(100% - 20px)'
          }}
        >
          {arraydocumentosestruturados.map((item) => (
            <div id={'documento estruturado' + item.id}
              className='button'
              onClick={() => {
                console.log(item);
                setselecteddocumento(item);
                setdono_documento({
                  id: item.id_profissional,
                  conselho: item.conselho,
                  nome: item.nome_profissional,
                })
                loadCamposEstruturados(item.id);
                selector("lista de documentos estruturados", 'documento estruturado' + item.id, 500);
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
                  }}
                  onClick={(e) => {
                    setselecteddocumento(item);
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
                    setselecteddocumento(item);
                    copiarDocumentoEstruturado(item.id);
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
                    minHeight: 25, minWidth: 25, maxHeight: 24, maxWidth: 25, marginLeft: 0, marginRight: 0,
                  }}
                  onClick={() => {
                    setselecteddocumento(item);
                    setdono_documento({
                      id: item.id_profissional,
                      conselho: item.conselho,
                      nome: item.profissional,
                    });
                    setTimeout(() => {
                      printDiv()
                    }, 1000);
                  }}>
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

  // CAMPOS ESTRUTURADOS PARA FORMULÁRIO E IMPRESSÃO.
  const campo = (item, tipocampo, titulo, valor, obrigatorio, opcoes) => {
    var timeout = null;
    let arrayopcoes = [];

    let array = item.valor.split(",");
    console.log(array);

    if (opcoes != null) {
      console.log(opcoes.split(","));
      arrayopcoes = opcoes.split(",")
    }

    if (tipocampo == 'textarea') {
      return (
        <div style={{
          margin: 5, padding: 2.5,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          position: 'relative',
          flexGrow: 'inherit',
          backgroundColor: '#66b2b250',
          borderRadius: 5,
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
              backgroundColor: '#EC7063',
              color: 'white', fontWeight: 'bold',
              width: 25, height: 25,
              justifyContent: 'center',
            }}>
            <div>!</div>
          </div>
          <div
            className='text1'
            title={titulo}
            style={{ alignSelf: 'flex-start', textAlign: 'left' }}>
            {titulo}
          </div>
          <textarea
            id={titulo}
            className='textarea_campo'
            defaultValue={valor}
            onKeyUp={() => {
              clearTimeout(timeout);
              timeout = setTimeout(() => {
                updateCampoEstruturado(item, document.getElementById(titulo).value.toUpperCase());
              }, 500);
            }}
          >
          </textarea>
        </div>
      )
    } else if (tipocampo == 'opcaounica') {
      return (
        <div style={{
          margin: 5, padding: 2.5,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
          position: 'relative',
          flexGrow: 'inherit',
          backgroundColor: '#66b2b250',
          borderRadius: 5,
        }}
          onMouseLeave={() => {
            if (item.valor == '' && obrigatorio == 1) {
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
              backgroundColor: '#EC7063',
              color: 'white', fontWeight: 'bold',
              width: 25, height: 25,
              justifyContent: 'center',
            }}>
            <div>!</div>
          </div>
          <div
            className='text1'
            title={titulo}
            style={{ alignSelf: 'flex-start', textAlign: 'left' }}>
            {titulo}
          </div>
          <div id={'lista opcoes ' + item.id}
            style={{
              display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',
              flexWrap: 'wrap', minWidth: 200,
            }}>
            {arrayopcoes.map(valor => (
              <div
                id={'btn ' + valor}
                className={item.valor == valor ? 'button-selected' : 'button'}
                style={{ padding: 10 }}
                onClick={() => {
                  updateCampoEstruturado(item, valor);
                  selector('lista opcoes ' + item.id, 'btn ' + valor, 500);
                }}
              >
                {valor}
              </div>
            ))}
          </div>
        </div >
      )
    } else if (tipocampo == 'opcaomultipla') {
      return (
        <div style={{
          margin: 5, padding: 2.5,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
          position: 'relative',
          flexGrow: 'inherit',
          backgroundColor: '#66b2b250',
          borderRadius: 5,
        }}
          onMouseLeave={() => {
            if (item.valor == '' && obrigatorio == 1) {
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
              backgroundColor: '#EC7063',
              color: 'white', fontWeight: 'bold',
              width: 25, height: 25,
              justifyContent: 'center',
            }}>
            <div>!</div>
          </div>
          <div
            className='text1'
            title={titulo}
            style={{ alignSelf: 'flex-start', textAlign: 'left' }}>
            {titulo}
          </div>
          <div id={"lista de opcoes multiplas " + item.id}
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', minWidth: 200 }}>
            {arrayopcoes.map(valor => (
              <div
                id={'btn multi ' + valor}
                className={array.filter(x => x == valor).length > 0 ? 'button-selected' : 'button'}
                style={{ padding: 10 }}
                onClick={() => {
                  if (array.filter(item => item == valor).length == 1) {
                    let newarray = [];
                    array.filter(x => x != valor).map(x => newarray.push(x));
                    console.log(newarray)
                    array = newarray;
                    console.log(array.toString());
                    updateCampoEstruturado(item, array.toString());
                    setTimeout(() => {
                      document.getElementById('btn multi ' + valor).className = "button";
                    }, 500);
                  } else {
                    array.push(valor);
                    console.log(array.toString());
                    updateCampoEstruturado(item, array.toString());
                    setTimeout(() => {
                      document.getElementById('btn multi ' + valor).className = "button-selected";
                    }, 500);
                  }
                }}
              >
                {valor}
              </div>
            ))}
          </div>
        </div >
      )
    }

  }

  const printcampo = (tipocampo, titulo, valor) => {
    if (tipocampo == 'textarea') {
      return (
        <div style={{
          margin: 2.5, padding: 2.5,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          fontFamily: 'Helvetica',
          breakInside: 'avoid',
          borderStyle: 'solid', borderWidth: 1, borderRadius: 5,
          borderColor: 'black',
          flexGrow: 'inherit',
        }}
        >
          <div
            className='text1' style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 2.5 }}>{titulo}</div>
          <div
            id={titulo}
            className='text1'
            style={{ fontSize: 12, fontWeight: 'normal' }}
          >
            {valor == '' ? '-x-' : valor}
          </div>
        </div>
      )
    } else if (tipocampo == 'opcaounica') {
      return (
        <div style={{
          margin: 2.5, padding: 2.5,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          fontFamily: 'Helvetica',
          breakInside: 'avoid',
          borderStyle: 'solid', borderWidth: 1, borderRadius: 5,
          borderColor: 'black',
          flexGrow: 'inherit',
        }}>
          <div
            className='text1' style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 2.5 }}>{titulo}</div>
          <div
            id={titulo}
            className='text1'
            style={{ fontSize: 12, fontWeight: 'normal' }}
          >
            {valor == '' ? '-x-' : valor}
          </div>
        </div>
      )
    } else if (tipocampo == 'opcaomultipla') {
      return (
        <div style={{
          margin: 2.5, padding: 2.5,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          fontFamily: 'Helvetica',
          breakInside: 'avoid',
          borderStyle: 'solid', borderWidth: 1, borderRadius: 5,
          borderColor: 'black',
          flexGrow: 'inherit',
        }}>
          <div
            className='text1' style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 2.5 }}>{titulo}</div>
          <div
            id={titulo}
            className='text1'
            style={{
              fontSize: 12, fontWeight: 'normal',
              display: 'flex', flexDirection: 'row', flexWrap: 'wrap'
            }}
          >
            {valor.split(",").map((item) => (
              <div style={{ marginRight: 2.5 }}>{item}</div>
            ))}
          </div>
        </div>
      )
    }
  }

  // FORMULÁRIO.
  function Formulario() {
    return (
      <div
        id="formulario"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignSelf: 'flex-start',
          flex: 1,
        }}>
        <div className='text1' style={{ fontSize: 16 }}>{tipodocumento}</div>
        <div
          style={{
            display: selecteddocumento != [] ? 'flex' : 'none',
            flexWrap: 'wrap',
            pointerEvents: selecteddocumento.status == 0 ? 'auto' : 'none',
            flex: 1,
          }}>
          {camposestruturados.sort((a, b) => parseInt(a.titulo.slice(0, 2)) > parseInt(b.titulo.slice(0, 2)) ? 1 : -1).map(item => campo(item, item.tipocampo, item.titulo, item.valor, item.obrigatorio, item.opcoes))}
        </div>
      </div>
    )
  }

  // IMPRESSÃO.
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

  function Conteudo() {
    return (
      <div
        id="conteudo doc-estruturado"
        style={{
          display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
          justifyContent: 'center',
          fontFamily: 'Helvetica',
          breakInside: 'auto',
          whiteSpace: 'pre-wrap',
          flex: 1,
        }}>
        {camposestruturados.sort((a, b) => parseInt(a.titulo.slice(0, 2)) > parseInt(b.titulo.slice(0, 2))).map(item => printcampo(item.tipocampo, item.titulo, item.valor, item.altura, item.largura))}
      </div>
    )
  }

  return (
    <div id="scroll-documento-estruturado"
      className='card-aberto'
      style={{
        position: 'relative',
        display: card == 'card-doc-estruturado-aih' ? 'flex' : 'none',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100vw',
        height: '300vh',
      }}
    >
      <Formulario></Formulario>
      <ListaDeDocumentosEstruturados></ListaDeDocumentosEstruturados>
      <PrintDocumento></PrintDocumento>
    </div>
  )
}

export default DocumentoEstruturado;