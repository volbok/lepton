/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState, useCallback } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
import moment from "moment";
// imagens.
import back from '../images/back.svg';

/*
import salvar from '../images/salvar.svg';
import preferencias from '../images/preferencias.svg';
import deletar from '../images/deletar.svg';
import lupa from '../images/lupa.svg';
import print from '../images/imprimir.svg';
*/

// router.
import { useHistory } from "react-router-dom";
// funções.
// import selector from "../functions/selector";
// componentes.
// import Header from '../components/Header';
// import Footer from '../components/Footer';


function Almoxarifado() {

  // context.
  const {
    pagina, setpagina,
    html,
    almoxarifado, setalmoxarifado,
  } = useContext(Context);

  const loadAlmoxarifado = () => {
    axios.get(html + 'almoxarifado').then((response) => {
      setalmoxarifado(response.data.rows);
      setarrayalmoxarifado(response.data.rows);
    });
  }

  var timeout = null;
  const [arrayalmoxarifado, setarrayalmoxarifado] = useState([]);
  useEffect(() => {
    // eslint-disable-next-line
    if (pagina == 'ALMOXARIFADO') {
      console.log('PÁGINA ALMOXARIFADO');
      loadAlmoxarifado();
    }
    // eslint-disable-next-line
  }, [pagina]);

  // history (router).
  let history = useHistory();

  // atualizar registro de almoxarifado.
  const updateAlmoxarifado = (item, obj) => {
    var obj = {
      categoria: null,
      codigo_item: null,
      nome_item: null,
      qtde_item: null,
      obs: null,
      data_entrada: null,
      codigo_fornecedor: null,
      cnpj_fornecedor: null,
      codigo_compra: null,
      id_setor_origem: null,
      id_setor_destino: null,
    }
    axios.post(html + 'update_almoxarifado/' + item.id, obj).then(() => {
      loadAlmoxarifado();
    })
  }

  const [filteritem, setfilteritem] = useState("");
  var searchitem = "";
  const filterItem = () => {
    clearTimeout(timeout);
    document.getElementById("inputNomeItem").focus();
    searchitem = document
      .getElementById("inputNomeItem")
      .value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchitem == "") {
        setfilteritem("");
        setarrayalmoxarifado(almoxarifado);
        document.getElementById("inputNomeItem").value = "";
        setTimeout(() => {
          document.getElementById("inputNomeItem").focus();
        }, 100);
      } else {
        setfilteritem(document.getElementById("inputNomeItem").value.toUpperCase());
        if (almoxarifado.filter((item) => item.nome_item.includes(searchitem)).length > 0) {
          setarrayalmoxarifado(almoxarifado.filter((item) => item.nome_item.includes(searchitem)));
          setTimeout(() => {
            document.getElementById("inputNomeItem").value = searchitem;
            document.getElementById("inputNomeItem").focus()
          }, 100)
        } else {
          setarrayalmoxarifado(almoxarifado.filter((item) => item.nome_item.includes(searchitem)));
          setTimeout(() => {
            document.getElementById("inputNomeItem").value = searchitem;
            document.getElementById("inputNomeItem").focus()
          }, 100)
        }
      }
    }, 1000);
  };
  // filtro de item por nome.
  function FilterItem() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
        <input
          className="input cor2"
          autoComplete="off"
          placeholder={
            "BUSCAR..."
          }
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) =>
            e.target.placeholder = "BUSCAR..."
          }
          onKeyUp={() => filterItem()}
          type="text"
          id="inputNomeItem"
          defaultValue={filteritem}
          maxLength={100}
          style={{ width: '100%' }}
        ></input>
      </div>
    );
  }

  // lista de almoxarifado para filtragem das prescrições de exames laboratoriais.
  const Listaalmoxarifado = useCallback(() => {
    return (
      <div id="scroll lista de almoxarifado"
        className='scroll'
        style={{
          display: 'flex',
          width: '15vw',
          height: '100%',
          margin: 5, marginTop: 10,
          backgroundColor: 'white',
          borderColor: 'white',
          alignSelf: 'flex-start',
        }}>
        {arrayalmoxarifado.map((item) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              minHeight: 150,
            }}
            onClick={() => {

            }}
          >
            <div id="identificador"
              className='button cor1opaque'
              style={{
                marginRight: 0,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
              {moment(item.data_entrada).format('DD/MM/YY')}
            </div>
            <div className='button pallete2'
              id={"almoxarifado " + item.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: 0,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                width: 200,
              }}
            >
              {item.nome_item}
            </div>
          </div>
        ))
        }
      </div>
    )
    // eslint-disable-next-line
  }, [arrayalmoxarifado]);

  function Botoes() {
    return (
      <div style={{
        display: 'flex', flexDirection: 'row', justifyContent: 'center',
        alignSelf: 'center', alignItems: 'center',
      }}>
        <div id="botão para sair da tela de laboratório"
          className="button-red" style={{ maxHeight: 50 }}
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
      </div>
    )
  }

  return (
    <div id="tela do almoxarifado"
      className='main'
      style={{
        display: pagina == 'ALMOXARIFADO' ? 'flex' : 'none'
      }}
    >
      <div className='chassi'
        style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly',
        }}>
        <div
          style={{
            position: 'sticky', top: 0,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            height: 'calc(100vh - 20px)',
          }}>
          <Botoes></Botoes>
          <FilterItem></FilterItem>
          <Listaalmoxarifado></Listaalmoxarifado>
        </div>
      </div>
    </div>
  )
}

export default Almoxarifado;