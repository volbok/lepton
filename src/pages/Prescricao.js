/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Context from './Context';
import moment from 'moment';
import 'moment/locale/pt-br';
// router.
import { useHistory } from 'react-router-dom';
// funções.
import toast from '../functions/toast';
// imagens.
import logo from '../images/logo.svg';
import salvar from '../images/salvar.svg';
import deletar from '../images/deletar.svg';
import back from '../images/back.svg';
import novo from '../images/novo.svg';
import refresh from '../images/refresh.svg';
import print from '../images/imprimir.svg';
import copiar from '../images/copiar.svg';
import preferencias from '../images/preferencias.svg';

function Prescricao() {

  // context.
  const {
    html,
    setpagina,
    settoast,
    usuario,
    prescricao, setprescricao,
    atendimentos,
    atendimento,
    unidade,
    unidades,
    paciente, pacientes,
    card, setcard,
  } = useContext(Context);

  // history (router).
  let history = useHistory();

  useEffect(() => {
    if (card == 'card-prescricao') {
      loadOpcoesPrescricao();
      loadItensPrescricao();
      loadPrescricao();
    }
    // eslint-disable-next-line
  }, [card, atendimento]);

  var timeout = null;

  // ## OPÇÕES DE ITENS DE PRESCRIÇÃO ## //
  // recuperando opções de itens de prescrição.
  const [opcoesprescricao, setopcoesprescricao] = useState([]);
  const [arrayopcoesprescricao, setarrayopcoesprescricao] = useState([]);
  const loadOpcoesPrescricao = () => {
    axios.get(html + 'opcoes_prescricoes').then((response) => {
      setopcoesprescricao(response.data.rows);
      // setarrayopcoesprescricao(response.data.rows);
    })
      .catch(function (error) {
        if (error.response == undefined) {
          toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 3000);
          setTimeout(() => {
            setpagina(0);
            history.push('/');
          }, 3000);
        } else {
          toast(settoast, error.response.data.message + ' REINICIANDO APLICAÇÃO.', 'black', 3000);
          setTimeout(() => {
            setpagina(0);
            history.push('/');
          }, 3000);
        }
      });
  }
  // registrando uma nova opção de item de prescrição.
  const insertOpcaoItemPrescricao = () => {
    var categoria = document.getElementById("inputCategoria").value.toUpperCase();
    var via = document.getElementById("inputVia").value.toUpperCase();

    if (categoria != 'CATEGORIA' && via != 'VIA') {
      var obj = {
        nome_item: document.getElementById("inputNome").value.toUpperCase(),
        categoria: document.getElementById("inputCategoria").value.toUpperCase(),
        qtde_item: document.getElementById("inputQtde").value.toUpperCase(),
        via: document.getElementById("inputVia").value.toUpperCase(),
        freq: document.getElementById("inputFreq").value.toUpperCase(),
        obs: document.getElementById("inputObs").value.toUpperCase(),
        id_pai: null,
      }
      axios.post(html + 'insert_opcoes_prescricao', obj).then(() => {
        console.log(JSON.stringify(obj));
        loadOpcoesPrescricao();
      })
        .catch(function () {
          toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
          setTimeout(() => {
            setpagina(0);
            history.push('/');
          }, 5000);
        });
    } else {
      toast(settoast, 'PREENCHER TODOS OS CAMPOS', 'red', 1000);
    }
  }
  const insertOpcaoComponentePrescricao = (item) => {
    var obj = {
      nome_item: item.nome_item,
      categoria: item.categoria,
      qtde_item: item.qtde_item,
      via: null,
      freq: null,
      obs: null,
      id_pai: id,
    }
    axios.post(html + 'insert_opcoes_prescricao', obj).then(() => {
      console.log(JSON.stringify(obj));
      loadOpcoesPrescricao();
    })
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }
  // atualizando um registro de opção de item de prescrição.
  const updateOpcaoItemPrescricao = (id) => {
    setid(id);
    setnome(document.getElementById("inputNome").value.toUpperCase());
    setcategoria(document.getElementById("inputCategoria").value.toUpperCase());
    setqtde(document.getElementById("inputQtde").value.toUpperCase());
    setvia(document.getElementById("inputVia").value.toUpperCase());
    setfreq(document.getElementById("inputFreq").value.toUpperCase());
    setobs(document.getElementById("inputObs").value.toUpperCase());

    setTimeout(() => {
      var obj = {
        /*
        nome_item: document.getElementById("inputNome").value.toUpperCase(),
        categoria: document.getElementById("inputCategoria").value.toUpperCase(),
        qtde_item: document.getElementById("inputQtde").value.toUpperCase(),
        via: document.getElementById("inputVia").value.toUpperCase(),
        freq: document.getElementById("inputFreq").value.toUpperCase(),
        obs: document.getElementById("inputObs").value.toUpperCase(),
        id_pai: null,
        */
        nome_item: nome,
        categoria: categoria,
        qtde_item: qtde,
        via: via,
        freq: freq,
        obs: obs,
        id_pai: null,
      }
      axios.post(html + 'update_opcoes_prescricao/' + id, obj).then(() => {
        loadOpcoesPrescricao();
      })
        .catch(function () {
          toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
          setTimeout(() => {
            setpagina(0);
            history.push('/');
          }, 5000);
        });
    }, 1000);
  }
  // atualizando um registro de opção de item de prescrição.
  const updateOpcaoComplementoPrescricao = (item, qtde) => {
    var obj = {
      nome_item: item.nome_item,
      categoria: item.categoria,
      qtde_item: qtde,
      via: null,
      freq: null,
      obs: null,
      id_pai: item.id_pai,
    }
    axios.post(html + 'update_opcoes_prescricao/' + item.id, obj).then(() => {
      console.log(JSON.stringify(obj));
      loadOpcoesPrescricao();
    })
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }
  // excluir um registro de opção de item de prescriçao.
  const deleteOpcaoItemPrescricao = (id) => {
    axios.get(html + 'delete_opcoes_prescricao/' + id).then(() => {
      loadOpcoesPrescricao();
    })
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }

  // ## LISTA DE PRESCRIÇÕES ## //
  // recuperando lista de prescrições.
  const [arraylistaprescricao, setarraylistaprescricao] = useState([]);
  const loadPrescricao = () => {
    axios.get(html + 'list_prescricoes/' + atendimento).then((response) => {
      setarraylistaprescricao(response.data.rows);
    })
      .catch(function (error) {
        if (error.response == undefined) {
          toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 3000);
          setTimeout(() => {
            setpagina(0);
            history.push('/');
          }, 3000);
        } else {
          toast(settoast, error.response.data.message + ' REINICIANDO APLICAÇÃO.', 'black', 3000);
          setTimeout(() => {
            setpagina(0);
            history.push('/');
          }, 3000);
        }
      });
  }
  // inserir registro de prescrição.
  const insertPrescricao = () => {
    var obj = {
      id_paciente: paciente,
      id_atendimento: atendimento,
      data: moment(),
      status: 0, // 0 = não salva; 1 = salva (não pode excluir).
      id_profissional: usuario.id,
      nome_profissional: usuario.nome_usuario,
      registro_profissional: usuario.n_conselho,
    }
    axios.post(html + 'insert_prescricao', obj).then(() => {
      console.log(JSON.stringify(obj));
      loadPrescricao();
    })
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }

  // copiar prescrição.
  const copiarPrescricao = (item) => {
    // loadItensPrescricao();
    let last_id_prescricao = null;
    // registrando nova prescrição.
    var obj = {
      id_paciente: paciente,
      id_atendimento: atendimento,
      data: moment(),
      status: 0, // 0 = não salva; 1 = salva (não pode excluir).
      id_profissional: usuario.id,
      nome_profissional: usuario.nome_usuario,
      registro_profissional: usuario.n_conselho,
    }
    axios.post(html + 'insert_prescricao', obj).then(() => {
      // recuperando o id da prescrição recém-criada.
      axios.get(html + 'list_prescricoes/' + atendimento).then((response) => {
        var x = response.data.rows;
        last_id_prescricao = x.sort((a, b) => moment(a.data) < moment(b.data) ? -1 : 1).slice(-1).map(item => item.id).pop();
        console.log('ID DA PRESCRIÇÃO CRIADA: ' + last_id_prescricao);
        // registrando os itens da prescrição copiada.
        // eslint-disable-next-line
        axios.get(html + 'list_itens_prescricoes/' + atendimento).then((response) => {
          let x = response.data.rows;
          console.log(x.length);
          console.log('ITENS COPIÁVEIS:')
          console.log(x.filter(valor => valor.id_prescricao == item.id && valor.id_pai == null).length);
          // eslint-disable-next-line
          x.filter(valor => valor.id_prescricao == item.id && valor.id_pai == null).map(valor => {
            let id_pai_a_copiar = valor.id;
            console.log('ID DA PRESCRIÇÃO SELECIONADA: ' + valor.id_prescricao);
            var obj = {
              id_unidade: parseInt(unidade),
              id_paciente: parseInt(paciente),
              id_atendimento: parseInt(atendimento),
              categoria: valor.categoria,
              codigo_item: valor.codigo_item,
              nome_item: valor.nome_item,
              qtde_item: parseInt(valor.qtde_item),
              via: valor.via,
              freq: valor.freq,
              agora: valor.agora,
              acm: valor.acm,
              sn: valor.sn,
              obs: valor.obs,
              data: moment(),
              id_componente_pai: parseInt(valor.id_componente_pai),
              id_componente_filho: parseInt(valor.id_componente_filho),
              id_prescricao: parseInt(last_id_prescricao),
              id_pai: null
            }
            axios.post(html + 'insert_item_prescricao', obj).then(() => {
              console.log('ITEM DE PRESCRIÇÃO COPIADO COM SUCESSO:');
              console.log(obj);
              // recuperando id do item de prescrição recém-copiado.
              axios.get(html + 'list_itens_prescricoes/' + atendimento).then((response) => {
                let x = response.data.rows;
                let last_id_item = x.filter(item => item.id_prescricao == last_id_prescricao && item.id_pai == null).sort((a, b) => moment(a.data) < moment(b.data) ? -1 : 1).slice(-1).map(item => item.id).pop();
                console.log('ID DO ITEM DE PRESCRIÇÃO CRIADO: ' + last_id_item);
                // copiando os componentes do item de prescrição recém-criado.
                let count = x.filter(valor => valor.id_prescricao == item.id && valor.id_pai == id_pai_a_copiar).length;
                x.filter(valor => valor.id_prescricao == item.id && valor.id_pai == id_pai_a_copiar).map(valor => {
                  count = count - 1;
                  console.log(count);
                  var obj = {
                    id_unidade: unidade,
                    id_paciente: paciente,
                    id_atendimento: atendimento,
                    categoria: valor.categoria,
                    codigo_item: valor.codigo_item,
                    nome_item: valor.nome_item,
                    qtde_item: valor.qtde_item,
                    via: valor.via,
                    freq: valor.freq,
                    agora: valor.agora,
                    acm: valor.acm,
                    sn: valor.sn,
                    obs: valor.obs,
                    data: moment(),
                    id_componente_pai: valor.id_componente_pai,
                    id_componente_filho: valor.id_componente_filho,
                    id_prescricao: last_id_prescricao,
                    id_pai: last_id_item,
                  }
                  axios.post(html + 'insert_item_prescricao', obj).then(() => {
                    console.log('COMPONENTE DE ITEM DE PRESCRIÇÃO COPIADO COM SUCESSO:');
                  });
                  if (count == 0) {
                    loadPrescricao();
                    loadItensPrescricao();
                    setidprescricao(0);
                  }
                  return null;
                });
              });
            });
          });
        });
      });
    });
  }

  // atualizando um registro de prescrição.
  const updatePrescricao = (item, status) => {
    var obj = {
      id_paciente: item.id_paciente,
      id_atendimento: item.id_atendimento,
      data: item.data,
      status: status,
      id_profissional: item.id,
      nome_profissional: item.nome_profissional,
      registro_profissional: item.registro_profissional,
    }
    axios.post(html + 'update_prescricao/' + item.id, obj).then(() => {
      loadPrescricao();
      loadItensPrescricao();
      setidprescricao(0);
    })
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }
  // excluindo um registro de prescricao.
  const deletePrescricao = (id) => {
    loadPrescricao();
    loadItensPrescricao();
    axios.get(html + 'delete_prescricao/' + id).then(() => {
      // deletando itens de prescrição correlatos.
      prescricao.filter(item => item.id_prescricao == id).map(item => deleteItemPrescricao(item));
      loadPrescricao();
      loadItensPrescricao();
      setidprescricao(0);
    })
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }

  // ## ITENS DE PRESCRIÇÃO ## //
  // recuperando registros de itens de prescrição.
  const [arrayitensprescricao, setarrayitensprescricao] = useState([]);
  const loadItensPrescricao = () => {
    axios.get(html + 'list_itens_prescricoes/' + atendimento).then((response) => {
      let x = response.data.rows;
      setprescricao(response.data.rows);
      if (expand == 1) {
        setarrayitensprescricao(x.filter(valor => valor.id == selectitemprescricao.id));
      } else {
        // setarrayitensprescricao(x.filter(item => item.id_prescricao == idprescricao && item.id_componente_filho == null).sort((a, b) => a.nome_item > b.nome_item ? -1 : 1));
        setarrayitensprescricao(x);
      }
    })
      .catch(function (error) {
        if (error.response == undefined) {
          toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 3000);
          setTimeout(() => {
            setpagina(0);
            history.push('/');
          }, 3000);
        } else {
          toast(settoast, error.response.data.message + ' REINICIANDO APLICAÇÃO.', 'black', 3000);
          setTimeout(() => {
            setpagina(0);
            history.push('/');
          }, 3000);
        }
      });
  }
  // registrando um novo item de prescrição.
  const insertItemPrescricao = (item) => {
    var obj = {
      id_unidade: unidade,
      id_paciente: paciente,
      id_atendimento: atendimento,
      categoria: item.categoria,
      codigo_item: item.codigo_item,
      nome_item: item.nome_item,
      qtde_item: item.qtde_item,
      via: item.via,
      freq: item.freq,
      agora: item.agora,
      acm: item.acm,
      sn: item.sn,
      obs: item.obs,
      data: moment(),
      id_componente_pai: item.id_componente_pai,
      id_componente_filho: item.id_componente_filho,
      id_prescricao: idprescricao,
      id_pai: null,
    }
    axios.post(html + 'insert_item_prescricao', obj).then(() => {
      // pegar a id do item recém-registrado.
      axios.get(html + 'list_itens_prescricoes/' + atendimento).then((response) => {
        let x = response.data.rows;
        setprescricao(response.data.rows);
        setarrayitensprescricao(response.data.rows);
        let lastIdItemPrescricao = x.filter(item => item.id_prescricao == idprescricao).slice(-1).map(item => item.id);
        console.log(lastIdItemPrescricao);
        // inserir componentes predefinidos para o item prescrito.
        opcoesprescricao.filter(valor => valor.id_componente_filho == item.id_componente_pai).map(valor => insertComponentePrescricao(valor, lastIdItemPrescricao));
        loadItensPrescricao();
      }, 2000);
    })
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }

  const insertComponentePrescricao = (componente, id_pai) => {
    var obj = {
      id_unidade: unidade,
      id_paciente: paciente,
      id_atendimento: atendimento,
      categoria: componente.categoria,
      codigo_item: componente.codigo_item,
      nome_item: componente.nome_item,
      qtde_item: componente.qtde_item,
      via: null,
      freq: null,
      agora: null,
      acm: null,
      sn: null,
      obs: null,
      data: moment(),
      id_componente_filho: componente.id_componente_filho,
      id_componente_pai: componente.id_componente_pai,
      id_prescricao: idprescricao,
      id_pai: parseInt(id_pai),
    }
    axios.post(html + 'insert_item_prescricao', obj).then(() => {
      console.log('COMPONENTE INSERIDO:');
      console.log(obj);
      if (expand == 1) {
        setexpand(0);
      }
    })
  }

  // atualizando um registro de prescrição.
  const updateItemPrescricao = (item, qtde, via, freq, agora, acm, sn, obs) => {
    var obj = {
      id_unidade: parseInt(unidade),
      id_paciente: parseInt(paciente),
      id_atendimento: atendimento,
      categoria: item.categoria,
      codigo_item: parseInt(item.codigo_item),
      nome_item: item.nome_item,
      qtde_item: parseInt(qtde),
      via: via,
      freq: freq,
      agora: agora,
      acm: acm,
      sn: sn,
      obs: obs,
      data: item.data,
      id_componente_pai: item.id_componente_pai,
      id_componente_filho: item.id_componente_filho,
      id_prescricao: idprescricao,
      id_pai: 0,
    }
    axios.post(html + 'update_item_prescricao/' + item.id, obj).then(() => {
      console.log(item.id);
      console.log(obj);
      if (expand == 1) {
        // loadItensPrescricao();
      }
    })
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }
  // excluir um item de prescricao.
  const deleteItemPrescricao = (item) => {
    axios.get(html + 'delete_item_prescricao/' + item.id).then(() => {
      // deletar também todos os registros de componentes associados ao item recém-deletado.
      prescricao.filter(valor => valor.id_pai == item.id).map(valor => {
        axios.get(html + 'delete_item_prescricao/' + valor.id).then(() => {
          console.log('DELETANDO COMPONENTE.');
        });
        return null;
      })
      loadItensPrescricao();
    })
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }
  const deleteComponentePrescricao = (id) => {
    axios.get(html + 'delete_item_prescricao/' + id).then(() => {
      console.log('DELETANDO COMPONENTE.');
      loadItensPrescricao();
    });
  }

  const [filterprescricao, setfilterprescricao] = useState('');
  var searchprescricao = '';
  const filterItemPrescricao = (input) => {
    console.log(input);
    clearTimeout(timeout);
    document.getElementById(input).focus();
    searchprescricao = document.getElementById(input).value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchprescricao == '') {
        setviewopcoesitensprescricao(0);
        setfilterprescricao('');
        setarrayopcoesprescricao(opcoesprescricao);
        setarrayitensprescricao(prescricao);
        document.getElementById(input).value = '';
        setTimeout(() => {
          document.getElementById(input).focus();
        }, 100);
      } else {
        setviewopcoesitensprescricao(1);
        setfilterprescricao(document.getElementById(input).value.toUpperCase());
        setarrayopcoesprescricao(opcoesprescricao.filter(item => item.nome_item.includes(searchprescricao)));
        setarrayitensprescricao(prescricao.filter(item => item.nome_item.includes(searchprescricao)));
        document.getElementById(input).value = searchprescricao;
        setTimeout(() => {
          document.getElementById(input).focus();
        }, 100);
      }
    }, 1000);
  }
  // filtro de prescricao por nome.
  function FilterItemPrescricao() {
    return (
      <input
        id="inputItemPrescricao"
        className="input"
        autoComplete="off"
        placeholder="BUSCAR ITEM..."
        onFocus={(e) => (e.target.placeholder = '')}
        onBlur={(e) => (e.target.placeholder = 'BUSCAR ITEM...')}
        onKeyUp={() => filterItemPrescricao("inputItemPrescricao")}
        type="text"
        defaultValue={filterprescricao}
        maxLength={100}
        style={{ margin: 0, width: 'calc(100% - 10px)', alignSelf: 'center' }}
      ></input>
    )
  }

  const [filteropcoesprescricao, setfilteropcoesprescricao] = useState('');
  var searchopcoesprescricao = '';
  const filterOpcoesItemPrescricao = () => {
    clearTimeout(timeout);
    document.getElementById("inputopcoesprescricao").focus();
    searchopcoesprescricao = document.getElementById("inputopcoesprescricao").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchopcoesprescricao == '') {
        setfilteropcoesprescricao('');
        setarrayopcoesprescricao('');
        document.getElementById("inputopcoesprescricao").value = '';
        setTimeout(() => {
          document.getElementById("inputopcoesprescricao").focus();
        }, 100);
      } else {
        setfilteropcoesprescricao(document.getElementById("inputopcoesprescricao").value.toUpperCase());
        setarrayopcoesprescricao(opcoesprescricao.filter(item => item.nome_item.includes(searchopcoesprescricao)));
        document.getElementById("inputopcoesprescricao").value = searchopcoesprescricao;
        setTimeout(() => {
          document.getElementById("inputopcoesprescricao").focus();
        }, 100);
      }
    }, 1000);
  }
  // filtro de prescricao por nome.
  function FilterOpcoesItemPrescricao() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
        <div className='button-red'
          style={{ margin: 0, marginRight: 10, width: 50, height: 50 }}
          onClick={() => { setopcoesitensmenu(0) }}>
          <img
            alt=""
            src={back}
            style={{
              margin: 0,
              height: 30,
              width: 30,
            }}
          ></img>
        </div>
        <input
          className="input"
          autoComplete="off"
          placeholder="BUSCAR ITEM..."
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'BUSCAR ITEM...')}
          onKeyUp={() => filterOpcoesItemPrescricao()}
          type="text"
          id="inputopcoesprescricao"
          defaultValue={filteropcoesprescricao}
          maxLength={100}
          style={{ margin: 0, width: '30vw' }}
        ></input>
      </div>
    )
  }

  // modificadores dos itens de prescrição.
  const [nome, setnome] = useState(null);

  // categoria do item prescrito.
  let arraycategorias = ['0. DIETA', '1. ANTIMICROBIANOS', '2. DIVERSOS', '3. CURATIVOS', '4. CUIDADOS']
  const [categoria, setcategoria] = useState('CATEGORIA');
  const [qtde, setqtde] = useState(null);

  // via de administração do item prescrito.
  let arrayvias = ['VO', 'SNE', 'GGT', 'IV', 'IM', 'SC']

  const [via, setvia] = useState('VIA');
  const [freq, setfreq] = useState(null);
  const [obs, setobs] = useState(null);
  const [id, setid] = useState(null);

  /*
  let nome = null;
  let categoria = null;
  let qtde = null;
  let via = null;
  let freq = null;
  let obs = null;
  */

  function Via() {
    return (
      <div id="viamenu"
        className="hide"
        onClick={() => document.getElementById('viamenu').className = "hide"}
      >
        <div
          className='fundo'
        >
          <div
            className="janela">
            {arrayvias.map(valor => (
              < div
                key={valor}
                className="button"
                style={{ width: 100 }}
                onClick={() => {
                  if (id != null) {
                    // setvia(valor);
                  }
                  document.getElementById('inputVia').value = valor;
                  document.getElementById('viamenu').className = "hide";
                }}
              >
                {valor}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  function Categoria() {
    return (
      <div id="categoriamenu"
        className="hide"
        onClick={() => document.getElementById('categoriamenu').className = "hide"}
      >
        <div
          className="fundo"
        >
          <div
            className="janela">
            {arraycategorias.map(valor => (
              < div
                key={valor}
                className="button"
                style={{ width: 100 }}
                onClick={() => {
                  if (id != null) {
                    // setcategoria(valor);
                  }
                  document.getElementById('inputCategoria').value = valor;
                  document.getElementById('categoriamenu').className = "hide";
                }}
              >
                {valor}
              </div>
            ))}
          </div>
        </div>
      </div >
    )
  }
  // função para permitir apenas a inserção de números no input (obedecendo a valores de referência).
  const checkInputAndUpdateItemPrescricao = (input, min, max, item) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      var valor = document.getElementById(input).value;
      if (isNaN(valor) == true || valor < min || valor > max) {
        // setstate(null);
        document.getElementById(input).value = '';
        document.getElementById(input).focus();
      } else {
        var obj = {
          id_unidade: item.id_unidade,
          id_paciente: item.id_paciente,
          id_atendimento: item.id_atendimento,
          categoria: item.categoria,
          codigo_item: item.codigo_item,
          nome_item: item.nome_item,
          qtde_item: parseInt(document.getElementById(input).value),
          via: item.via,
          freq: item.freq,
          agora: item.agora,
          acm: item.acm,
          sn: item.sn,
          obs: item.obs,
          data: item.data,
          id_componente_pai: item.id_componente_pai,
          id_componente_filho: item.id_componente_filho,
          id_prescricao: item.id_prescricao,
          id_pai: item.id_pai,
        }
        axios.post(html + 'update_item_prescricao/' + item.id, obj).then(() => {
          console.log(obj);
          if (expand == 1) {
            document.getElementById("trava mouse").style.pointerEvents = "none";
            document.getElementById("trava mouse").style.opacity = 0.5;
          }
        })
          .catch(function () {
            toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
            setTimeout(() => {
              setpagina(0);
              history.push('/');
            }, 5000);
          });
      }
    }, 200);
  }

  // LISTA LATERAL DE PRESCRIÇÕES.
  const [idprescricao, setidprescricao] = useState(0);
  const [statusprescricao, setstatusprescricao] = useState(0);
  const ListaPrescricoes = useCallback(() => {
    return (
      <div id="scroll lista de prescrições"
        className='scroll'
        style={{
          position: 'sticky',
          top: 0,
          width: '12vw', minWidth: '12vw', maxWidth: '12vw',
          height: 'calc(100vh - 105px)',
          margin: 0, marginTop: 5,
          marginLeft: 5,
          backgroundColor: 'white',
          borderColor: 'white',
          alignSelf: 'flex-start',
        }}>
        <div id="botão para nova prescrição."
          className='button-green'
          onClick={() => insertPrescricao()}
        >
          <img
            alt=""
            src={novo}
            style={{ width: 30, height: 30 }}
          ></img>
        </div>
        {arraylistaprescricao.sort((a, b) => moment(a.data) > moment(b.data) ? -1 : 1).map((item) => (
          <div id={"item de prescrição " + item.id}
            className='button'
            style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              minHeight: 120
            }}
            onClick={() => {
              loadItensPrescricao();
              setidprescricao(item.id);
              setstatusprescricao(item.status);
              console.log(item.id);
              console.log(item.status);
              setTimeout(() => {
                var botoes = document
                  .getElementById("scroll lista de prescrições")
                  .getElementsByClassName("button-red");
                for (var i = 0; i < botoes.length; i++) {
                  botoes.item(i).className = "button";
                }
                document.getElementById("item de prescrição " + item.id).className = "button-red";
              }, 300);
            }}
          >
            <div
              style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div id="botão para excluir prescrição."
                className='button-yellow'
                style={{
                  display: item.status == 0 ? 'flex' : 'none',
                  maxWidth: 30, width: 30, minWidth: 30,
                  maxHeight: 30, height: 30, minHeight: 30
                }}
                onClick={() => deletePrescricao(item.id)}
              >
                <img
                  alt=""
                  src={deletar}
                  style={{ width: 25, height: 25 }}
                ></img>
              </div>
              <div id="botão para salvar prescrição."
                style={{
                  display: item.status == 0 ? 'flex' : 'none',
                  maxWidth: 30, width: 30, minWidth: 30,
                  maxHeight: 30, height: 30, minHeight: 30
                }}
                className='button-green'
                onClick={() => updatePrescricao(item, 1)}
              >
                <img
                  alt=""
                  src={salvar}
                  style={{ width: 20, height: 20 }}
                ></img>
              </div>
              <div
                id="botão para imprimir prescrição"
                className='button-green'
                style={{
                  display: item.status == 1 ? 'flex' : 'none',
                  maxWidth: 30, width: 30, minWidth: 30,
                  maxHeight: 30, height: 30, minHeight: 30
                }}
                title={'IMPRIMIR PRESCRIÇÃO'}
                onClick={() => printDiv()}>
                <img
                  alt=""
                  src={print}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                ></img>
              </div>
              <div
                id="botão para copiar prescrição"
                className='button-green'
                style={{
                  display: item.status == 1 ? 'flex' : 'none',
                  maxWidth: 30, width: 30, minWidth: 30,
                  maxHeight: 30, height: 30, minHeight: 30
                }}
                title={'COPIAR PRESCRIÇÃO'}
                onClick={() => copiarPrescricao(item)}>
                <img
                  alt=""
                  src={copiar}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                ></img>
              </div>
            </div>
            <div style={{ padding: 10, display: 'flex', flexDirection: 'column' }}>
              <div>
                {moment(item.data).format('DD/MM/YY')}
              </div>
              <div>
                {moment(item.data).format('HH:mm')}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
    // eslint-disable-next-line
  }, [arraylistaprescricao, atendimento])

  // componente para selecionar a via de administração de um item de prescrição.
  const [viewviaitemprescricao, setviewviaitemprescricao] = useState(0);
  const vias = ['VO', 'IV', 'SC', 'IM', 'HIPODERMÓCLISE', 'SNE', 'GGT']
  function ViewItemVia() {
    return (
      <div
        className='fundo'
        onClick={() => setviewviaitemprescricao(0)}
        style={{ display: viewviaitemprescricao == 1 ? 'flex' : 'none' }}
      >
        <div className='janela'>
          <div className='scroll' style={{ height: '70vh' }}>
            {vias.map(item => (
              <div
                key={'via: ' + item}
                onClick={() => {
                  updateItemPrescricao(selectitemprescricao, document.getElementById("inputQtde " + selectitemprescricao.id).value, item, selectitemprescricao.freq, selectitemprescricao.agora, selectitemprescricao.acm, selectitemprescricao.sn, selectitemprescricao.obs);
                  console.log(selectitemprescricao.id);
                  document.getElementById("inputVia " + selectitemprescricao.id).innerHTML = item;
                  // document.getElementById("inputQtde " + selectitemprescricao.id).value = selectitemprescricao.qtde_item;
                }}
                className='button'
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // componente para selecionar a frequência de administração de um item de prescrição.
  const [viewfreqitemprescricao, setviewfreqitemprescricao] = useState(0);
  const arrayfreq = ['1/1H', '2/2H', '3/3H', '4/4H', '5/5H', '6/6H', '8/8H', '12/12H', '24/24H', '8H', '10H', '12H', '17H', '20H', '22H']
  function ViewItemFreq() {
    return (
      <div
        className='fundo'
        onClick={() => setviewfreqitemprescricao(0)}
        style={{ display: viewfreqitemprescricao == 1 ? 'flex' : 'none' }}
      >
        <div className='janela'>
          <div className='scroll' style={{ height: '60vh' }}>
            {arrayfreq.map(item => (
              <div
                key={'freq: ' + item}
                onClick={() => {
                  updateItemPrescricao(selectitemprescricao, document.getElementById("inputQtde " + selectitemprescricao.id).value, selectitemprescricao.via, item, selectitemprescricao.agora, selectitemprescricao.acm, selectitemprescricao.sn, selectitemprescricao.obs);
                  document.getElementById("inputFreq " + selectitemprescricao.id).innerHTML = item;
                  // document.getElementById("inputQtde " + selectitemprescricao.id).value = selectitemprescricao.qtde_item;
                }}
                className='button'
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // componente para selecionar se um item de prescrição tem a condição se necessário (SN), a critério médico (ACM) ou agora.
  const [viewcondicaoitemprescricao, setviewcondicaoitemprescricao] = useState(0);
  function ViewItemCondicao() {
    return (
      <div
        className='fundo'
        onClick={() => setviewcondicaoitemprescricao(0)}
        style={{ display: viewcondicaoitemprescricao == 1 ? 'flex' : 'none' }}
      >
        <div className='janela'>
          <div
            onClick={() => {
              updateItemPrescricao(selectitemprescricao, document.getElementById("inputQtde " + selectitemprescricao.id).value, selectitemprescricao.via, selectitemprescricao.freq, true, false, false, selectitemprescricao.obs);
              document.getElementById("condição " + selectitemprescricao.id).innerHTML = 'AGORA';
              // document.getElementById("inputQtde " + selectitemprescricao.id).value = selectitemprescricao.qtde_item;
            }}
            className='button'
          >
            AGORA
          </div>
          <div
            onClick={() => {
              updateItemPrescricao(selectitemprescricao, document.getElementById("inputQtde " + selectitemprescricao.id).value, selectitemprescricao.via, selectitemprescricao.freq, false, true, false, selectitemprescricao.obs);
              document.getElementById("condição " + selectitemprescricao.id).innerHTML = 'ACM';
              // document.getElementById("inputQtde " + selectitemprescricao.id).value = selectitemprescricao.qtde_item;
            }}
            className='button'
          >
            ACM
          </div>
          <div
            onClick={() => {
              updateItemPrescricao(selectitemprescricao, document.getElementById("inputQtde " + selectitemprescricao.id).value, selectitemprescricao.via, selectitemprescricao.freq, false, false, true, selectitemprescricao.obs);
              document.getElementById("condição " + selectitemprescricao.id).innerHTML = 'SN';
              // document.getElementById("inputQtde " + selectitemprescricao.id).value = selectitemprescricao.qtde_item;
            }}
            className='button'
          >
            SN
          </div>
        </div>
      </div>
    )
  }

  const [selectitemprescricao, setselectitemprescricao] = useState([]);
  const [viewopcoesitensprescricao, setviewopcoesitensprescricao] = useState(0);
  const [expand, setexpand] = useState(0);
  const ListaItensPrescricoes = useCallback(() => {
    var timeout = null;
    return (
      <div style={{
        margin: 5, width: '70vw',
      }}>
        <div style={{ pointerEvents: statusprescricao == 1 ? 'none' : 'auto' }}>
          <FilterItemPrescricao></FilterItemPrescricao>
        </div>
        <div style={{
          display: viewopcoesitensprescricao == 1 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'flex-start',
          flexWrap: 'wrap',
          marginTop: 10, marginBottom: 0,
          borderRadius: 5, backgroundColor: 'rgb(82, 190, 128, 0.3)',
        }}>
          {arrayopcoesprescricao.filter(item => item.id_componente_filho == null).map(item => (
            <div
              className="button-green"
              style={{
                display: idprescricao != 0 ? 'flex' : 'none',
                flexDirection: 'row', paddingLeft: 15, paddingRight: 15
              }}
              onClick={() => { insertItemPrescricao(item) }}
            >
              {item.nome_item}
            </div>
          ))}
        </div>
        {arrayitensprescricao.filter(item => item.id_prescricao == idprescricao && item.id_componente_filho == null).sort((a, b) => a.nome_item > b.nome_item ? -1 : 1).map(item => (
          <div
            key={"prescricao " + item.id}
            style={{
              display: arrayitensprescricao.length > 0 ? 'flex' : 'none',
              flexDirection: 'column', justifyContent: 'center',
              pointerEvents: arraylistaprescricao.filter(valor => valor.id == item.id_prescricao).map(valor => parseInt(valor.status)) == 1 ? 'none' : 'auto'
            }}>
            <div className='row'
              style={{
                justifyContent: 'space-between',
                display: 'flex', flexDirection: 'column',
                margin: 0,
              }}
            >
              <div id='linha principal' style={{ display: 'flex', flexDirection: 'row', position: 'relative' }}>
                <div className='button'
                  onClick={() => {
                    if (expand == 1) {
                      setexpand(0);
                      axios.get(html + 'list_itens_prescricoes/' + atendimento).then((response) => {
                        let x = response.data.rows;
                        setprescricao(response.data.rows);
                        setarrayitensprescricao(x.sort((a, b) => a.nome_item > b.nome_item ? -1 : 1));
                        document.getElementById("trava mouse").style.pointerEvents = "auto";
                        document.getElementById("trava mouse").style.opacity = 1;
                      });
                    } else {
                      setselectitemprescricao(item);
                      setexpand(1);
                      axios.get(html + 'list_itens_prescricoes/' + atendimento).then((response) => {
                        let x = response.data.rows;
                        setprescricao(response.data.rows);
                        setarrayitensprescricao(x.filter(valor => valor.id == item.id));
                        document.getElementById("trava mouse").style.pointerEvents = "none";
                        document.getElementById("trava mouse").style.opacity = 0.5;
                      });
                    }
                  }}
                  style={{
                    display: 'flex', margin: 5, paddingLeft: 20, paddingRight: 20, width: '100%'
                  }}>
                  {item.nome_item}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }} id="trava mouse">
                  <input id={"inputQtde " + item.id}
                    className="input"
                    autoComplete="off"
                    placeholder="QTDE"
                    inputMode='numeric'
                    onKeyUp={() => {
                      checkInputAndUpdateItemPrescricao("inputQtde " + item.id, 1, 100, item);
                    }}
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'QTDE')}
                    style={{
                      width: 50, minWidth: 50, maxWidth: 50,
                      margin: 5,
                    }}
                    type="text"
                    defaultValue={item.qtde_item}
                    maxLength={3}
                  ></input>
                  <div id={"inputVia " + item.id}
                    className='button'
                    onClick={() => {
                      setselectitemprescricao(item);
                      setviewviaitemprescricao(1);
                    }}
                    style={{
                      display: window.innerWidth > 425 ? 'flex' : 'none',
                      width: 50, minWidth: 50, maxWidth: 50,
                      margin: 5
                    }}>
                    {item.via}
                  </div>
                  <div id={"inputFreq " + item.id}
                    className="button"
                    onClick={() => {
                      setselectitemprescricao(item);
                      setviewfreqitemprescricao(1);
                    }}
                    style={{
                      width: 50, minWidth: 50, maxWidth: 50,
                      margin: 5,
                    }}
                    type="text"
                  >
                    {item.freq}
                  </div>
                  <div id={"condição " + item.id}
                    className='button'
                    onClick={() => {
                      setselectitemprescricao(item);
                      setviewcondicaoitemprescricao(1);
                    }}
                    style={{
                      display: window.innerWidth > 425 ? 'flex' : 'none',
                      width: 50, minWidth: 50, maxWidth: 50,
                      margin: 5
                    }}>
                    {item.agora == true ? 'AGORA' : item.acm == true ? 'ACM' : item.sn == true ? 'SN' : ''}
                  </div>
                </div>
                <div className={'button-red'}
                  title={'EXCLUIR ITEM DE PRESCRIÇÃO.'}
                  onClick={(e) => { deleteItemPrescricao(item) }}>
                  <img
                    alt=""
                    src={deletar}
                    style={{
                      margin: 0,
                      height: 30,
                      width: 30,
                    }}
                  ></img>
                </div>
              </div>
              <div id={"expansivel " + item.id}
                className={expand == 1 ? 'expand' : 'retract'}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', marginTop: 0 }}>
                <div id={"informações " + item.id}
                  className={expand == 1 ? 'show' : 'hide'}
                  style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}
                >
                  <textarea id={"inputObs " + item.id}
                    className="textarea"
                    autoComplete="off"
                    placeholder="OBSERVAÇÕES"
                    inputMode='text'
                    onKeyUp={() => {
                      clearTimeout(timeout);
                      timeout = setTimeout(() => {
                        updateItemPrescricao(item, item.qtde_item, item.via, item.freq, item.agora, item.acm, item.sn, document.getElementById("inputObs " + item.id).value.toUpperCase());
                      }, 1000);
                    }}
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'OBSERVAÇÕES')}
                    style={{
                      width: '15vw', minWidth: '15vw', maxWidth: '15vw',
                      height: 'calc(100% - 30px)',
                      margin: 0, marginRight: 10,
                    }}
                    type="text"
                    defaultValue={item.obs}
                    maxLength={1000}
                  ></textarea>
                  <div id="LISTA DE COMPONENTES" className='scroll'
                    style={{
                      width: 'calc(100% - 10px)',
                      height: 'calc(100% - 10px)',
                      margin: 0
                    }}>
                    {prescricao.filter(valor => valor.id_pai == item.id).map(valor => (
                      <div style={{
                        display: 'flex', flexDirection: 'row',
                        justifyContent: 'space-between', width: '100%'
                      }}>
                        <div className='button'
                          style={{
                            display: 'flex',
                            width: '100%',
                          }}>
                          {valor.nome_item}
                        </div>
                        <input id={"inputQtdeComponent " + valor.id}
                          className="input"
                          autoComplete="off"
                          placeholder="QTDE"
                          inputMode='numeric'
                          onKeyUp={() => { checkInputAndUpdateItemPrescricao("inputQtdeComponent " + valor.id, 1, 100, valor) }}
                          onFocus={(e) => (e.target.placeholder = '')}
                          onBlur={(e) => (e.target.placeholder = 'QTDE')}
                          style={{
                            width: 50,
                            margin: 5,
                          }}
                          type="text"
                          defaultValue={valor.qtde_item}
                          maxLength={3}
                        ></input>
                        <div className={'button-red'}
                          style={{
                            display: 'flex',
                            marginRight: 5,
                          }}
                          title={'EXCLUIR ITEM.'}
                          onClick={(e) => { deleteComponentePrescricao(valor.id); e.stopPropagation() }}>
                          <img
                            alt=""
                            src={deletar}
                            style={{
                              margin: 0,
                              height: 30,
                              width: 30,
                            }}
                          ></img>
                        </div>
                      </div>
                    ))}
                    {ViewInsertComponentePrescricao(item)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
        }
        <div className='text1'
          style={{ display: arrayitensprescricao.length == 0 ? 'flex' : 'none', width: '100%', opacity: 0.5 }}>
          SEM ITENS PRESCRITOS.
        </div>
      </div >
    )
    // eslint-disable-next-line
  }, [prescricao, statusprescricao, arrayitensprescricao, atendimentos, idprescricao, arraylistaprescricao]);

  const ViewInsertComponentePrescricao = (item) => {
    const [localarray, setlocalarray] = useState([]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <input id={"inputNovoComplemento" + item.id}
          className='input' style={{ width: '90%', alignSelf: 'center' }}
          autoComplete="off"
          placeholder="COMPONENTE..."
          inputMode='text'
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'COMPONENTE...')}
          onKeyUp={() => {
            clearTimeout(timeout);
            document.getElementById("inputNovoComplemento" + item.id).focus();
            let searchprescricao = document.getElementById("inputNovoComplemento" + item.id).value.toUpperCase();
            console.log('HA: ' + searchprescricao);
            timeout = setTimeout(() => {
              if (searchprescricao == '') {
                setlocalarray([]);
                document.getElementById("inputNovoComplemento" + item.id).value = '';
                setTimeout(() => {
                  document.getElementById("inputNovoComplemento" + item.id).focus();
                }, 100);
              } else {
                setlocalarray(opcoesprescricao.filter(item => item.id_componente_pai == null && item.nome_item.includes(searchprescricao)));
                document.getElementById("inputNovoComplemento" + item.id).value = searchprescricao;
                setTimeout(() => {
                  document.getElementById("inputNovoComplemento" + item.id).focus();
                }, 100);
              }
            }, 1000);
          }}
        >
        </input>
        {localarray.map(valor => (
          <div
            className="button-green"
            style={{ display: 'flex', flexDirection: 'row', paddingLeft: 15, paddingRight: 15 }}
            onClick={() => {
              insertComponentePrescricao(valor, item.id);
              loadItensPrescricao();
            }}
          >
            {valor.nome_item}
          </div>
        ))}
      </div>
    )
    // eslint-disable-next-line
  };

  function ScrollOpcoesItens() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: '80vh' }}>
        <div id="coluna1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '80vh' }}>
          <div className='text1' style={{ display: id == null ? 'flex' : 'none' }}>ITENS DISPONÍVEIS PARA PRESCRIÇÃO</div>
          <div id="scrollOpcoesItens" className='scroll cor0'
            style={{
              display: id == null ? 'flex' : 'none',
              height: '100%',
              width: 'calc(50vw - 20px)'
            }}>
            {arrayopcoesprescricao.filter(item => item.id_pai == null).map(item => (
              <div
                id={"optionItem " + item.id}
                className={'button'}
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                key={item.id}
                onClick={() => {
                  setid(item.id);
                  setTimeout(() => {
                    console.log(id);
                    setnome(item.nome_item);
                    setcategoria(item.categoria);
                    setqtde(item.qtde_item);
                    setvia(item.via);
                    setfreq(item.freq);
                    setobs(item.obs);

                    document.getElementById("inputNome").value = item.nome_item;
                    document.getElementById("inputCategoria").value = item.categoria;
                    document.getElementById("inputQtde").value = item.qtde_item;
                    document.getElementById("inputVia").value = item.via;
                    document.getElementById("inputFreq").value = item.freq;
                    document.getElementById("inputObs").value = item.obs;

                    var botoes = document.getElementById("scrollOpcoesItens").getElementsByClassName("button-red");
                    for (var i = 0; i < botoes.length; i++) {
                      botoes.item(i).className = "button";
                    }
                    document.getElementById("optionItem " + item.id).className = "button-red";
                  }, 200);
                }}
              >
                <div style={{ marginLeft: 5 }}>
                  {item.nome_item}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <div className={'button-red'}
                    style={{
                      display: 'flex',
                      margin: 0, width: 40, minWidth: 40, maxWidth: 40, height: 40, minHeight: 40, maxHeight: 40,
                      marginRight: 5,
                    }}
                    title={'EXCLUIR ITEM.'}
                    onClick={(e) => { deleteOpcaoItemPrescricao(item.id); e.stopPropagation() }}>
                    <img
                      alt=""
                      src={deletar}
                      style={{
                        margin: 0,
                        height: 30,
                        width: 30,
                      }}
                    ></img>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="button-red"
            style={{ display: id != null ? 'flex' : 'none', width: '80%', alignSelf: 'center' }}
            onClick={() => setid(null)}
          >
            {opcoesprescricao.filter(item => item.id == id).map(item => item.nome_item)}
          </div>
          <div className='text1'>{id != null ? 'EDITAR ITEM SELECIONADO' : 'INSERIR NOVO ITEM'}</div>
          <InputsAndComponentes></InputsAndComponentes>
        </div>
        <div id="coluna2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 10, height: '80vh' }}>
          <div style={{ display: id != null ? 'flex' : 'none' }} className='text1'>COMPONENTES DISPONÍVEIS PARA O ITEM SELECIONADO</div>
          <div id="scrollOpcoesComponentes" className='scroll cor0'
            style={{
              display: id != null ? 'flex' : 'none',
              height: '100%', minHeight: 400, width: 'calc(50vw - 20px)'
            }}>
            {arrayopcoesprescricao.filter(item => item.id_pai == null && item.id != id).map(item => (
              <div
                id={"optionItem " + item.id}
                className={'button'}
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                key={item.id}
              >
                <div style={{ marginLeft: 5 }}>
                  {item.nome_item}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <div className={'button-green'}
                    style={{
                      display: item.id == id ? 'none' : 'flex',
                      margin: 0, width: 40, minWidth: 40, maxWidth: 40, height: 40, minHeight: 40, maxHeight: 40,
                    }}
                    title={'INSERIR COMO COMPONENTE DO ITEM SELECIONADO.'}
                    onClick={(e) => { insertOpcaoComponentePrescricao(item); e.stopPropagation() }}>
                    <img
                      alt=""
                      src={salvar}
                      style={{
                        margin: 0,
                        height: 30,
                        width: 30,
                      }}
                    ></img>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  };

  const [opcoesitensmenu, setopcoesitensmenu] = useState(0);
  const InputsAndComponentes = useCallback(() => {
    var timeout = null;
    return (
      <div style={{
        display: 'flex', flexDirection: 'row', justifyContent: 'center',
        width: '100%', alignSelf: 'center',
      }}>
        <div>
          <div id="inputs para nome e categoria do item."
            style={{
              display: 'flex',
              flexDirection: 'row', justifyContent: 'center',
              width: '100%',
              alignSelf: 'center',
              alignContent: 'center',
            }}>
            <input id={"inputNome"}
              className="input"
              autoComplete="off"
              placeholder="NOME DO ITEM"
              inputMode='text'
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'NOME')}
              style={{
                margin: 5, width: '100%'
              }}
              type="text"
              defaultValue={nome}
              maxLength={200}
            ></input>
            <input id={"inputCategoria"}
              className='button'
              onClick={() => document.getElementById('categoriamenu').className = 'show'}
              style={{ margin: 5, paddingLeft: 10, paddingRight: 10, width: 150, caretColor: 'transparent' }}
              defaultValue={categoria}
            >
            </input>
          </div>
          <div id="inputs para quantidade, via, frequência e observações."
            style={{
              display: 'flex', flexDirection: 'row', justifyContent: 'center',
              width: '100%'
            }}
          >
            <input id={"inputQtde"}
              className="input"
              autoComplete="off"
              placeholder="QTDE"
              inputMode='numeric'
              // onKeyUp={() => check("inputQtde", 1, 100)}
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'QTDE')}
              style={{
                width: 50,
                margin: 5,
              }}
              type="text"
              defaultValue={qtde}
              maxLength={3}
            ></input>
            <input id={"inputVia"}
              className='button'
              onClick={() => document.getElementById('viamenu').className = 'show'}
              style={{ height: 50, width: 50, margin: 5, caretColor: 'transparent' }}
              defaultValue={via}
            >
            </input>
            <input id={"inputFreq"}
              className="input"
              autoComplete="off"
              placeholder="FREQ"
              inputMode='numeric'
              // onKeyUp={() => checkNumberInput("inputFreq", 1, 24)}
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'FREQ')}
              style={{
                width: 50,
                margin: 5,
              }}
              type="text"
              defaultValue={freq}
              maxLength={2}
            ></input>
            <textarea id={"inputObs"}
              className="textarea"
              autoComplete="off"
              placeholder="OBSERVAÇÕES"
              inputMode='text'
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'OBSERVAÇÕES')}
              style={{
                width: '100%',
                height: 52, maxHeight: 52, minHeight: 52,
                margin: 5,
              }}
              type="text"
              defaultValue={obs}
              maxLength={200}
            ></textarea>

            <div className='button-green'
              style={{ display: id == null ? 'flex' : 'none', margin: 5, width: 50, height: 50 }}
              title={'SALVAR ITEM'}
              onClick={() => {
                insertOpcaoItemPrescricao();
                setTimeout(() => {
                  setid(null);
                  setnome(null);
                  setcategoria(null);
                  setqtde(null);
                  setvia(null);
                  setfreq(null);
                  setobs(null);
                  document.getElementById("inputNome").value = '';
                  document.getElementById("inputCategoria").value = '';
                  document.getElementById("inputQtde").value = '';
                  document.getElementById("inputVia").value = '';
                  document.getElementById("inputFreq").value = '';
                  document.getElementById("inputObs").value = '';
                }, 1000)
              }}>
              <img
                alt=""
                src={salvar}
                style={{
                  margin: 0,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </div>
            <div className='button-green'
              style={{ display: id != null ? 'flex' : 'none', margin: 5, width: 50, height: 50 }}
              title={'ATUALIZAR ITEM'}
              onClick={() => { console.log('ID, PORRA: ' + id); updateOpcaoItemPrescricao(id) }}>
              <img
                alt=""
                src={refresh}
                style={{
                  margin: 0,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className='text1'>COMPONENTES REGISTRADOS PARA O ITEM SELECIONADO</div>
          <div id="lista de componentes para o item pescrito"
            className='scroll cor0'
            style={{ width: 'calc(100% - 20px)', height: '100%', minHeight: 200 }}
          >
            {opcoesprescricao.filter(valor => valor.id_pai == id).map(item => (
              <div
                className='button'
                key={item.id}
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <div style={{ marginLeft: 5 }}>
                  {item.nome_item}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <input id={"inputQtdeComplemento " + item.id}
                    className="input"
                    autoComplete="off"
                    placeholder="QTDE"
                    inputMode='numeric'
                    onKeyUp={() => {
                      clearTimeout(timeout);
                      timeout = setTimeout(() => {
                        var valor = document.getElementById("inputQtdeComplemento " + item.id).value;
                        if (isNaN(valor) == true) {
                          document.getElementById("inputQtdeComplemento " + item.id).value = '';
                          document.getElementById("inputQtdeComplemento " + item.id).focus();
                        } else {
                          updateOpcaoComplementoPrescricao(item, valor);
                        }
                      }, 1000);
                    }}
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'QTDE')}
                    style={{
                      width: 40,
                      height: 40,
                      minWidth: 40,
                      minHeight: 40,
                      margin: 0,
                      marginRight: 5
                    }}
                    type="text"
                    defaultValue={item.qtde_item}
                    maxLength={3}
                  ></input>
                  <div className='button-red'
                    style={{ margin: 0, width: 40, height: 40, minWidth: 40, minHeight: 40 }}
                    title={'EXCLUIR COMPLEMENTO.'}
                    onClick={() => { deleteOpcaoItemPrescricao(item.id) }}>
                    <img
                      alt=""
                      src={deletar}
                      style={{
                        margin: 0,
                        height: 30,
                        width: 30,
                      }}
                    ></img>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
    // eslint-disable-next-line
  }, [opcoesprescricao, arrayopcoesprescricao, id]);

  function ManageOpcoesItensPrescricao() {
    return (
      <div
        className='fundo'
        onClick={() => setopcoesitensmenu(0)}
        style={{ display: opcoesitensmenu == 1 ? 'flex' : 'none' }}
      >
        <div
          className="scroll"
          style={{
            height: '100vh', width: '100vw',
            padding: 20,
            justifyContent: 'space-between',
          }}
          onClick={(e) => e.stopPropagation()}>
          <FilterOpcoesItemPrescricao></FilterOpcoesItemPrescricao>
          <ScrollOpcoesItens></ScrollOpcoesItens>
        </div>
      </div>
    )
  };

  // impressão da prescrição.
  function PrintPrescricao() {
    return (
      <div id="IMPRESSÃO - PRESCRIÇÃO" className="print">
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
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
            PRESCRIÇÃO MÉDICA
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
            borderRadius: 5, backgroundColor: 'gray', color: 'white',
            padding: 10
          }}>
            <div>
              {moment(selectitemprescricao.data).format('DD/MM/YY - HH:mm')}
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
        <div style={{ display: 'flex', flexDirection: 'row', fontFamily: 'Helvetica', marginTop: 20 }}>
          <div style={{ margin: 5, width: 20 }}>{''}</div>
          <div style={{ margin: 5, width: 440 }}>{'ITEM'}</div>
          <div style={{ margin: 5, width: 60 }}>{'QTDE'}</div>
          <div style={{ margin: 5, width: 60 }}>{'VIA'}</div>
          <div style={{ margin: 5, width: 60 }}>{'FREQ'}</div>
          <div style={{ margin: 5, width: 200 }}>{'CONDIÇÃO'}</div>
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
          {'PROFISSIONAL: ' + prescricao.filter(valor => valor.id == idprescricao).map(valor => valor.nome_profissional)}
        </div>
        <div className="text1">
          {'REGISTRO PROFISSIONAL: ' + prescricao.filter(valor => valor.id == idprescricao).map(valor => valor.registro_profissional)}
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
      }}>
        {arrayitensprescricao.filter(item => item.id_prescricao == idprescricao && item.id_componente_filho == null).sort((a, b) => a.nome_item > b.nome_item ? -1 : 1).map(item => (
          <div style={{
            display: 'flex', flexDirection: 'column', width: '100%',
            backgroundColor: (arrayitensprescricao.filter(item => item.id_prescricao == idprescricao && item.id_componente_filho == null).sort((a, b) => a.nome_item > b.nome_item ? -1 : 1).indexOf(item) + 1) % 2 == 0 ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
            borderRadius: 5,
            breakInside: 'avoid',
          }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{ margin: 5, width: 20 }}>{arrayitensprescricao.filter(item => item.id_prescricao == idprescricao && item.id_componente_filho == null).sort((a, b) => a.nome_item > b.nome_item ? -1 : 1).indexOf(item) + 1}</div>
              <div style={{ margin: 5, width: 440 }}>{item.nome_item}</div>
              <div style={{ margin: 5, width: 60 }}>{item.qtde_item}</div>
              <div style={{ margin: 5, width: 60 }}>{item.via}</div>
              <div style={{ margin: 5, width: 60 }}>{item.freq}</div>
              <div style={{ margin: 5, width: 200 }}>{item.agora != null ? 'AGORA' : item.acm != null ? 'ACM' : item.sn != null ? 'SN' : '-'}</div>
            </div>
            <div style={{
              display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly',
              margin: 1.5, padding: 1.5, borderStyle: 'solid', borderColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 5
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '100%', margin: 5, fontSize: 8 }}>
                <div style={{ margin: 1.5, fontWeight: 'bold' }}>OBSERVAÇÕES:</div>
                <div style={{ width: '100%' }}>{item.obs}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', margin: 5, fontSize: 8 }}>
                <div style={{ margin: 1.5, fontWeight: 'bold' }}>COMPONENTES:</div>
                <div id="LISTA DE COMPONENTES PARA IMPRESSÃO" style={{ width: '100%', fontSize: 8 }}>
                  {prescricao.filter(valor => valor.id_pai == item.id).map(valor => (
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <div style={{ margin: 1.5, width: 200 }}>{valor.nome_item}</div>
                      <div style={{ margin: 1.5, width: 60 }}>{valor.qtde_item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  function printDiv() {
    console.log('PREPARANDO PRESCRIÇÃO PARA IMPRESSÃO');
    let printdocument = document.getElementById("IMPRESSÃO - PRESCRIÇÃO").innerHTML;
    var a = window.open('  ', '  ', 'width=1024px, height=800px');
    a.document.write('<html>');
    a.document.write(printdocument);
    a.document.write('</html>');
    a.print();
  }

  return (
    <div className='card-aberto'
      style={{
        display: card == 'card-prescricao' ? 'flex' : 'none',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        margin: 0, padding: 0,
      }}>
      <div id="cadastro de prescrições e de atendimentos"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          margin: 0, padding: 0,
        }}>
        <div id="botões e pesquisa"
          style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',
            alignSelf: 'center', width: '100%'
          }}>
          <div className='button-red'
            style={{ margin: 0, width: 50, height: 50 }}
            title={'VOLTAR PARA O PASSÔMETRO'}
            onClick={() => setcard('')}>
            <img
              alt=""
              src={back}
              style={{
                margin: 0,
                height: 30,
                width: 30,
              }}
            ></img>
          </div>
          <div className='button-green'
            style={{ margin: 0, marginLeft: 5, width: 50, height: 50 }}
            title={'GERENCIADOR DE ITENS DE PRESCRIÇÃO'}
            onClick={() => { setopcoesitensmenu(1); setid(null) }}>
            <img
              alt=""
              src={preferencias}
              style={{
                margin: 0,
                height: 30,
                width: 30,
              }}
            ></img>
          </div>
          <div className='button-yellow'
            style={{
              margin: 0, marginLeft: 5, marginRight: 0,
              width: 100, height: 50,
              borderTopRightRadius: 0, borderBottomRightRadius: 0,
            }}>
            {'LEITO ' + atendimentos.filter(valor => valor.id_paciente == paciente && valor.situacao == 1).map(valor => valor.leito)}
          </div>
          <div className='button'
            style={{
              margin: 0, marginLeft: 0, width: '100%', height: 50,
              borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
            }}>
            {pacientes.filter(valor => valor.id_paciente == paciente).map(valor => valor.nome_paciente)}
          </div>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'center'
        }}>
          <ListaItensPrescricoes></ListaItensPrescricoes>
          <ListaPrescricoes></ListaPrescricoes>
        </div>
        <ViewItemVia></ViewItemVia>
        <ViewItemFreq></ViewItemFreq>
        <ViewItemCondicao></ViewItemCondicao>
        <ManageOpcoesItensPrescricao></ManageOpcoesItensPrescricao>
        <Via></Via>
        <Categoria></Categoria>
        <PrintPrescricao></PrintPrescricao>
      </div>
    </div>
  );
}

export default Prescricao;