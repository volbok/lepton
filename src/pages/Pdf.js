/* eslint eqeqeq: "off" */
import React, { useEffect, useContext } from 'react';
import Context from './Context';
import { useHistory } from 'react-router-dom';
import { Page, Text, View, Document, PDFViewer, StyleSheet } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';
import fontbold from '../fonts/Roboto-Bold.ttf';
import moment from 'moment';
// imagens.
import back from '../images/back.svg';

function Pdf() {

  // context.
  const {
    pagina,
    setusuario,
    setpagina,
    paciente,
    pacientes,
    atendimento,
    atendimentos,
    alergias,
    antibioticos,
    invasoes,
    precaucoes,
    riscos,
    culturas,
    evolucoes,
    infusoes,
    propostas,
    vm,
    interconsultas,

  } = useContext(Context);

  // history (router).
  let history = useHistory();

  const refreshApp = () => {
    setusuario(
      {
        id: 0,
        nome_usuario: 'LOGOFF',
        dn_usuario: null,
        cpf_usuario: null,
        email_usuario: null,
      });
    setpagina(0);
    history.push('/');
  }
  window.addEventListener('load', refreshApp);

  useEffect(() => {
    if (pagina == 6) {
      console.log('ATENDIMENTOS: ' + atendimentos.length);
      console.log('ID ATENDIMENTO: ' + atendimento);
      console.log(atendimentos.filter(item => item.id_atendimento == atendimento).pop().leito);
    }
    // eslint-disable-next-line
  }, [pagina]);

  // registro de fontes para o react-pdf (a lib não aceita ajustar fontWeight).
  Font.register({
    family: 'Roboto',
    src: fontbold,
  });

  // estilização (css).
  const styles = StyleSheet.create({
    title1: {
      display: 'flex',
      fontFamily: 'Helvetica-Bold',
      fontSize: 14, textAlign: 'center',
      fontWeight: 'bold',
      padding: 10,
      margin: 2.5,
      height: 20,
      maxHeight: 20
    },
    title2: {
      flex: 1,
      display: 'flex',
      fontFamily: 'Helvetica-Bold',
      fontSize: 10,
      fontWeight: 'bold',
      padding: 10,
      margin: 2.5,
      borderStyle: 'solid', borderWidth: 1, borderRadius: 5, borderColor: 'black',
    },
    view0: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      marginTop: 2.5,
      padding: 2.5,
      borderStyle: 'solid', borderWidth: 1, borderRadius: 5, borderColor: 'black',
    },
    view1: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      margin: 0,
      padding: 2.5,
      borderStyle: 'none', borderWidth: 0, borderRadius: 5, borderColor: 'transparent',
    },
    view2: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      margin: 2.5,
      padding: 5,
      borderRadius: 5,
      backgroundColor: '#f2f2f2'
    },
    view3: {
      display: 'flex',
      margin: 2.5,
      padding: 2.5,
      borderRadius: 5,
      backgroundColor: '#f2f2f2',
      justifyContent: 'flex-start'
    },
  });

  const BackButton = () => {
    return (
      <div id="botão de retorno"
        className="button-red"
        style={{
          position: 'absolute', bottom: 25, left: 25,
          opacity: 1, backgroundColor: '#ec7063',
          alignSelf: 'center',
          zIndex: 90
        }}
        onClick={() => {
          setpagina(1);
          history.push('/passometro');
        }}>
        <img
          alt=""
          src={back}
          style={{ width: 30, height: 30 }}
        ></img>
      </div >
    )
  }

  // conteúdo de cada atendimento.
  const pdfAtendimento = (item) => {
    return (
      <View style={styles.view0}>
        <View style={styles.view1}>
          <Text style={[styles.title2, {
            flex: 1, backgroundColor: '#85929E', // borderColor: '#85929E',
            color: 'white', textAlign: 'center'
          }]}>
            {'LEITO: ' + item.leito}
          </Text>
          <Text style={[styles.title2, { flex: 5.5 }]}>
            {'NOME: ' + pacientes.filter(valor => valor.id_paciente == item.id_paciente).map(valor => valor.nome_paciente)}
          </Text>
          <Text style={[styles.title2, { flex: 1.5 }]}>
            {'IDADE: ' + pacientes.filter(valor => valor.id_paciente == item.id_paciente).map(valor => moment().diff(valor.dn_paciente, 'years')) + ' ANOS'}
          </Text>
        </View>
        <View style={styles.view1}>
          <Text style={[styles.title2, { flex: 1 }]}>
            {'ADMISSÃO: ' + moment(item.data_inicio).format('DD/MM/YY')}
          </Text>
          <Text style={[styles.title2, { flex: 2.3 }]}>
            {'TEMPO DE INTERNAÇÃO: ' + moment().diff(item.data_inicio, 'days') + ' DIAS'}
          </Text>
          <Text style={[styles.title2, { flex: 4.7 }]}>
            {interconsultas.length > 0 ? 'INTERCONSULTAS: ' + interconsultas.map(item => ' ' + item.especialidade) : 'INTERCONSULTAS: NÃO'}
          </Text>
        </View>
        <View style={styles.view1}>
          <Text style={[styles.title2, { flex: 1, borderColor: 'red' }]}>
            {alergias.length > 0 ? 'ALERGIAS: ' + alergias.map(item => ' ' + item.alergia) : 'ALERGIAS: NÃO'}
          </Text>
          <Text style={[styles.title2, { flex: 1, borderColor: 'red' }]}>
            {riscos.length > 0 ? 'RISCOS: ' + riscos.map(item => ' ' + item.risco) : 'RISCOS: NÃO'}
          </Text>
          <Text style={[styles.title2, { flex: 1, borderColor: 'red' }]}>
            {precaucoes.length > 0 ? 'PRECAUÇÕES: ' + precaucoes.map(item => ' ' + item.precaucao) : 'PRECAUÇÕES: NÃO'}
          </Text>
        </View>
        <View style={[styles.view1, { flexDirection: 'column' }]}>
          <Text style={[styles.title2, { flex: 1 }]}>
            {'ANTECEDENTES: ' + pacientes.filter(item => item.id_paciente == paciente).map(item => item.antecedentes_pessoais)}
          </Text>
          <Text style={[styles.title2, { flex: 1 }]}>
            {'MEDICAÇÕES DE USO CONTÍNUO: ' + pacientes.filter(item => item.id_paciente == paciente).map(item => item.medicacoes_previas)}
          </Text>
          <Text style={[styles.title2, { flex: 1 }]}>
            {'EXAMES PRÉVIOS RELEVANTES: ' + pacientes.filter(item => item.id_paciente == paciente).map(item => item.exames_previos)}
          </Text>
          <Text style={[styles.title2, { flex: 1 }]}>
            {'LISTA DE PROBLEMAS: \n' + atendimentos.filter(item => item.id_atendimento == atendimento).map(item => item.problemas)}
          </Text>
          <Text style={[styles.title2, { flex: 1 }]}>
            {'SITUAÇÃO: ' + atendimentos.filter(item => item.id_atendimento == atendimento).map(item => item.situacao)}
          </Text>
          <Text style={[styles.title2, { flex: 1 }]}>
            {'EVOLUÇÕES:' + evolucoes.filter(item => item.id_atendimento == atendimento).map(item =>
              '\n' + moment(item.data_evolucao).format('DD/MM/YY') + ' - ' + item.evolucao)}
          </Text>
        </View>
        <View style={styles.view1}>
          <Text style={[styles.title2, { flex: 2 }]}>
            {invasoes.filter(item => item.data_retirada == null).length > 0 ? 'INVASÕES:' + invasoes.filter(item => item.data_retirada == null).map(item => '\n' + item.dispositivo + ' - ' + item.local + ' - ' + moment(item.data_implante).format('DD/MM/YY')) : 'INVASÕES: NÃO'}
          </Text>
          <Text style={[styles.title2, { flex: 1 }]}>
            {vm.sort((a, b) => moment(a.data_vm) < moment(b.data_vm) ? -1 : 1).slice(-1).filter(item => item.modo != 'OFF').length > 0 ?
              'VM: ' + vm.sort((a, b) => moment(a.data_vm) < moment(b.data_vm) ? -1 : 1).slice(-1)
                .map(item => '\n MODO: ' + item.modo + '\n PRESSÃO: ' + item.pressao + '\n VOLUME: ' + item.volume + '\n PEEP: ' + item.peep) + '\n FI: ' + item.fi
              :
              'VM: NÃO'}
          </Text>
          <Text style={[styles.title2, { flex: 1 }]}>
            {infusoes.filter(item => item.data_termino == null).length > 0 ? 'INFUSÕES:' + infusoes.filter(item => item.data_termino == null).map(item => '\n' + item.droga + ' - ' + item.velocidade + 'ml/h') : 'INFUSÕES: NÃO'}
          </Text>
        </View>
        <View style={styles.view1}>
          <Text style={[styles.title2, { flex: 1 }]}>
            {culturas.length > 0 ? 'CULTURAS: ' + culturas.map(item => '\n' + item.material + ' (' + moment(item.data_pedido).format('DD/MM/YY') + '): ' + item.resultado) : 'CULTURAS: NÃO'}
          </Text>
          <Text style={[styles.title2, { flex: 1 }]}>
            {antibioticos.length > 0 ? 'ANTIBIÓTICOS:' + antibioticos.map(item => '\n' + item.antibiotico + ' - ' + moment(item.data_inicio).format('DD/MM/YY')) : 'ANTIBIÓTICOS: NÃO'}
          </Text>
        </View>
        <View style={[styles.view1, { flexDirection: 'column' }]}>
          <Text style={[styles.title2, { flex: 1 }]}>
            {propostas.filter(item => item.status == 0).length > 0 ?
              'PROPOSTAS:' + propostas.filter(item => item.status == 0).map(item => '\n' + item.proposta)
              :
              'SEM PROPOSTAS'
            }
          </Text>
        </View>
      </View>
    )
  }

  return (
    <div style={{ display: pagina == 6 ? 'flex' : 'none' }}>
      <BackButton></BackButton>
      <PDFViewer
        style={{
          position: 'relative',
          width: window.innerWidth, height: window.innerHeight,
          fontSize: 10,
          border: 'none'
        }}>
        <Document>
          <Page size="A4" style={{ padding: 10 }}>
            <View id="CONTEUDO">
              {
                pdfAtendimento(atendimentos.filter(item => item.id_atendimento == atendimento).pop())
              }
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  )
};

export default Pdf;