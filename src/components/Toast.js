/* eslint eqeqeq: "off" */
import React, { useContext } from 'react';
import Context from '../pages/Context';

function Toast() {

  const {
    toast,
  } = useContext(Context)

  return (
    <div
      style={{
        display: toast.display,
        zIndex: 999, position: 'fixed',
        bottom: window.innerWidth > 426 ? 20 : '',
        top: window.innerWidth > 426 ? '' : 20,
        left: window.innerWidth > 426 ? '' : 20,
        right: window.innerWidth > 426 ? 20 : 20,
        flexDirection: 'column', justifyContent: 'center',
        alignContent: 'center', alignItems: 'center',
      }}>
      <div
        className='toasty'
        style={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: toast.cor,
          padding: 10,
          minHeight: 50,
          maxHeight: 300,
          minWidth: 100,
          maxWidth: 300,
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: 14,
          borderRadius: 5,
        }}>
        {toast.mensagem}
      </div>
    </div >
  );
}

export default Toast;
