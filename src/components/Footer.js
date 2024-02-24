/* eslint eqeqeq: "off" */

import React, { useContext } from 'react';
import Context from '../pages/Context';

function Footer() {
  const {
    selecteddocumento,
  } = useContext(Context);

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

export default Footer;
