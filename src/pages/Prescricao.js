/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Context from './Context';
// import moment from 'moment';
import 'moment/locale/pt-br';
// router.
import { useHistory } from 'react-router-dom';
// funções.
import toast from '../functions/toast';
// imagens.
import salvar from '../images/salvar.svg';
import deletar from '../images/deletar.svg';
import back from '../images/back.svg';
import novo from '../images/novo.svg';
import refresh from '../images/refresh.svg';
import preferencias from '../images/preferencias.svg';

function Prescricao() {

  // context.
  const {
    html,
    pagina, setpagina,
    settoast,
    prescricao, setprescricao,
    atendimentos,
    atendimento,
    // unidade,
    // paciente,
  } = useContext(Context);

  // history (router).
  let history = useHistory();

  useEffect(() => {
    if (pagina == 10) {
      loadOpcoesPrescricao();
      loadPrescricao();
    }
    // eslint-disable-next-line
  }, [pagina]);

  // ## OPÇÕES DE ITENS DE PRESCRIÇÃO ## //
  // recuperando opções de itens de prescrição.
  const [opcoesprescricao, setopcoesprescricao] = useState([]);
  const [arrayopcoesprescricao, setarrayopcoesprescricao] = useState([]);
  const loadOpcoesPrescricao = () => {
    axios.get(html + 'opcoes_prescricoes').then((response) => {
      setopcoesprescricao(response.data.rows);
      setarrayopcoesprescricao(response.data.rows);
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

  // atualizando um registro de prescrição.
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


  // atualizando um registro de prescrição.
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

  // excluir um item de prescricao.
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

  // recuperando registros de itens de prescrição.
  const [arrayprescricao, setarrayprescricao] = useState([]);
  const loadPrescricao = () => {
    axios.get(html + 'list_prescricoes/' + atendimento).then((response) => {
      setprescricao(response.data.rows);
      setarrayprescricao(response.data.rows);
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

  var timeout = null;

  // registrando um novo item de prescrição.
  /*
  const insertItemPrescricao = (item, pai) => {
    var obj = {
      id_unidade: unidade,
      id_paciente: paciente,
      id_atendimento: atendimento,
      categoria: item.categoria,
      componente: item.componente,
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
      id_pai: pai
    }
    axios.post(html + 'insert_prescricao', obj).then(() => {
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
  

  // atualizando um registro de prescrição.
  const updateItemPrescricao = (item, qtde, via, freq, agora, acm, sn, obs) => {
    var obj = {
      id_unidade: unidade,
      id_paciente: paciente,
      id_atendimento: atendimento,
      categoria: item.categoria,
      componente: item.componente,
      codigo_item: item.codigo_item,
      nome_item: item.nome_item,
      qtde_item: qtde,
      via: via,
      freq: freq,
      agora: agora,
      acm: acm,
      sn: sn,
      obs: obs,
      data: item.data,
      id_item: item.id_item
    }
    axios.post(html + 'update_prescricao/' + item.id, obj).then(() => {
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

  // excluir um item de prescricao.
  const deleteItemPrescricao = (id) => {
    axios.get(html + 'delete_prescricao/' + id).then(() => {
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

  const [filterprescricao, setfilterprescricao] = useState('');
  var searchprescricao = '';
  const filterItemPrescricao = () => {
    clearTimeout(timeout);
    document.getElementById("inputprescricao").focus();
    searchprescricao = document.getElementById("inputprescricao").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchprescricao == '') {
        setfilterprescricao('');
        setarrayprescricao(prescricao);
        document.getElementById("inputprescricao").value = '';
        setTimeout(() => {
          document.getElementById("inputprescricao").focus();
        }, 100);
      } else {
        setfilterprescricao(document.getElementById("inputprescricao").value.toUpperCase());
        setarrayprescricao(prescricao.filter(item => item.nome_item.includes(searchprescricao)));
        document.getElementById("inputprescricao").value = searchprescricao;
        setTimeout(() => {
          document.getElementById("inputprescricao").focus();
        }, 100);
      }
    }, 1000);
  }

  // filtro de prescricao por nome.
  function FilterItemPrescricao() {
    return (
      <input
        className="input cor2"
        autoComplete="off"
        placeholder="BUSCAR ITEM..."
        onFocus={(e) => (e.target.placeholder = '')}
        onBlur={(e) => (e.target.placeholder = 'BUSCAR ITEM...')}
        onKeyUp={() => filterprescricao()}
        type="text"
        id="inputprescricao"
        defaultValue={filterprescricao}
        maxLength={100}
        style={{ margin: 0, width: window.innerWidth < 426 ? '100%' : '30vw' }}
      ></input>
    )
  }
  */
  const [filteropcoesprescricao, setfilteropcoesprescricao] = useState('');
  var searchopcoesprescricao = '';
  const filterOpcoesItemPrescricao = () => {
    clearTimeout(timeout);
    document.getElementById("inputopcoesprescricao").focus();
    searchopcoesprescricao = document.getElementById("inputopcoesprescricao").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchopcoesprescricao == '') {
        setfilteropcoesprescricao('');
        setarrayopcoesprescricao(opcoesprescricao);
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
          title={'FECHAR SETUP DE ITENS DE PRESCRIÇÃO'}
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
          style={{ margin: 0, width: window.innerWidth < 426 ? '100%' : '30vw' }}
        ></input>
      </div>
    )
  }

  function HeaderPrescricao() {
    return (
      <div
        style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'center',
          alignSelf: 'center',
          width: window.innerWidth < 426 ? '90vw' : 'calc(100vw - 40px)',
          maxWidth: window.innerWidth < 426 ? '90vw' : 'calc(100vw - 40px)',
          marginBottom: 10,
        }}>
        <div className='header-row'>
          <div className='header'
            style={{
              flex: window.innerWidth < 426 ? 6 : 2,
            }}>
            ITEM
          </div>
          <div className='header'
            style={{ flex: 1 }}>
            QTDE
          </div>
          <div className='header'
            style={{ flex: 1 }}>
            VIA
          </div>
          <div className='header'
            style={{ flex: 1 }}>
            FREQ
          </div>
        </div>
      </div >
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
  const checkNumberInput = (input, setstate, min, max) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      var valor = document.getElementById(input).value;
      if (id != null) {
        if (isNaN(valor) == true || valor < min || valor > max) {
          // setstate(null);
          document.getElementById(input).value = '';
          document.getElementById(input).focus();
        } else {
          // setstate(valor);
        }
      }
    }, 1000);
  }

  // const [selectitemprescricao, setselectitemprescricao] = useState([]);
  const ListaPrescricoes = useCallback(() => {
    var timeout = null;
    return (
      <div className='scroll cor0'
        style={{
          width: window.innerWidth < 426 ? '90vw' : 'calc(100vw - 30px)',
          height: window.innerWidth < 426 ? window.innerHeight - 130 : window.innerHeight - 130,
        }}>
        {arrayprescricao.map(item => (
          <div
            key={"prescricao " + item.id}
            style={{
              display: arrayprescricao.length > 0 ? 'flex' : 'none',
              flexDirection: 'column', justifyContent: 'center',
            }}>
            <div className='row'
              style={{
                justifyContent: window.innerWidth > 425 ? 'space-between' : 'center',
                flex: 6, margin: 0,
              }}
              onClick={() => {
                // setselectitemprescricao(item);
                setTimeout(() => {
                  document.getElementById('expansivel ' + item.id).classList.toggle("expand");
                  document.getElementById('informações ' + item.id).classList.toggle("show");
                }, 100);
              }}
            >
              <div className='button'
                style={{
                  flex: window.innerWidth < 426 ? 6 : 2
                }}>
                {item.nome_item}
              </div>
              <input id={"inputQtde " + item.id}
                className="input"
                autoComplete="off"
                placeholder="QTDE"
                inputMode='numeric'
                onKeyUp={() => checkNumberInput("inputQtde " + item.id, setqtde, 1, 100)}
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'QTDE')}
                style={{
                  width: window.innerWidth < 426 ? '70vw' : '10vw',
                  margin: 5,
                }}
                type="text"
                defaultValue={qtde}
                maxLength={3}
              ></input>
              <div id={"inputVia " + item.id}
                className='button'
                style={{
                  display: window.innerWidth > 425 ? 'flex' : 'none',
                  flex: 2,
                }}>
                {item.via}
              </div>
              <input id={"inputFreq " + item.id}
                className="input"
                autoComplete="off"
                placeholder="FREQ"
                inputMode='numeric'
                onKeyUp={() => checkNumberInput("inputFreq " + item.id, setfreq, 1, 24)}
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'FREQ')}
                style={{
                  width: window.innerWidth < 426 ? '70vw' : '10vw',
                  margin: 5,
                }}
                type="text"
                defaultValue={freq}
                maxLength={2}
              ></input>
              <div id={"inputAgora " + item.id}
                className='button'
                style={{
                  display: window.innerWidth > 425 ? 'flex' : 'none',
                  flex: 2,
                }}>
                {item.agora}
              </div>
              <div id={"inputAcm " + item.id}
                className='button'
                style={{
                  display: window.innerWidth > 425 ? 'flex' : 'none',
                  flex: 2,
                }}>
                {item.acm}
              </div>
              <div id={"inputSn " + item.id}
                className='button'
                style={{
                  display: window.innerWidth > 425 ? 'flex' : 'none',
                  flex: 2,
                }}>
                {item.sn}
              </div>
              <div id={"expansivel " + item.id}
                className="hide"
              >
                <textarea id={"inputObs " + item.id}
                  className="textarea"
                  autoComplete="off"
                  placeholder="OBSERVAÇÕES"
                  inputMode='text'
                  onKeyUp={() => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                      setobs(document.getElementById('inputObs ' + item.id).value.toUpperCase());
                    }, 1000);
                  }}
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'OBSERVAÇÕES')}
                  style={{
                    width: window.innerWidth < 426 ? '70vw' : '20vw',
                    margin: 5,
                  }}
                  type="text"
                  defaultValue={item.obs}
                  maxLength={1000}
                ></textarea>
                {prescricao.filter(valor => valor.id_pai == item.id).map(valor => (
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <div className='button'
                      style={{
                        flex: window.innerWidth < 426 ? 6 : 2
                      }}>
                      {valor.nome_item}
                    </div>
                    <input id="inputQtdeComponent"
                      className="input"
                      autoComplete="off"
                      placeholder="QTDE"
                      inputMode='numeric'
                      onKeyUp={() => checkNumberInput("inputQtdeComponent", setqtde, 1, 100)}
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'QTDE')}
                      style={{
                        width: window.innerWidth < 426 ? '70vw' : '10vw',
                        margin: 5,
                      }}
                      type="text"
                      defaultValue={qtde}
                      maxLength={3}
                    ></input>
                  </div>
                ))}
                <div className='button-green'>
                  <img
                    alt=""
                    src={novo}
                    style={{ width: 30, height: 30 }}
                  ></img>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className='text1'
          style={{ display: arrayprescricao.length == 0 ? 'flex' : 'none', width: '90vw', opacity: 0.5 }}>
          SEM ITENS PRESCRITOS.
        </div>
      </div>
    )
    // eslint-disable-next-line
  }, [arrayprescricao, atendimentos]);

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
                  }, 100);
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
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        width: '100%', alignSelf: 'center',
      }}>
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
            onKeyUp={() => checkNumberInput("inputQtde", setqtde, 1, 100)}
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
            onKeyUp={() => checkNumberInput("inputFreq", setfreq, 1, 24)}
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
        <div style={{ display: id != null ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
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

      </div >
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

  return (
    <div className='main'
      style={{ display: pagina == 10 ? 'flex' : 'none' }}>
      <div id="cadastro de prescricaos e de atendimentos"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: 'calc(100vw - 20px)',
          // height: window.innerWidth < 426 ? '' : window.innerHeight,
        }}>
        <div id="botões e pesquisa"
          style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <div className='button-red'
            style={{ margin: 0, marginRight: 10, width: 50, height: 50 }}
            title={'VOLTAR PARA O PASSÔMETRO'}
            onClick={() => { setpagina(1); history.push('/passometro') }}>
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
            style={{ margin: 0, marginLeft: 10, width: 50, height: 50 }}
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
        </div>
        <HeaderPrescricao></HeaderPrescricao>
        <ListaPrescricoes></ListaPrescricoes>
        <ManageOpcoesItensPrescricao></ManageOpcoesItensPrescricao>
        <Via></Via>
        <Categoria></Categoria>
      </div>
    </div>
  );
}

export default Prescricao;