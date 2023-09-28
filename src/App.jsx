import Web3 from 'web3';
import { useState } from 'react';
import Alerta from './components/Alerta';

function App() {
  const web3 = new Web3("http://127.0.0.1:7545");
 
  const [miDireccion, setMiDireccion] = useState('');
  const [direccionEnvio, setDireccionEnvio] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [alerta, setAlerta] = useState({});

  const enviar = async e => {
    e.preventDefault();

    const balance = await web3.eth.getBalance(miDireccion);
    const balanceEther = web3.utils.fromWei(balance, 'ether');

    if([miDireccion, direccionEnvio, cantidad].includes('')){
      setAlerta({msg: "No pueden haber campos vacíos"});
      return;
    }
    if(!web3.utils.isAddress(miDireccion) || !web3.utils.isAddress(direccionEnvio)){
      setAlerta({msg: "Las direcciones no són válidas"});
    }

    if(parseFloat(cantidad) <= 0){
      setAlerta({msg: "Digite una cantidad válida"});
      return;
    }

    if (parseFloat(balanceEther) < parseFloat(cantidad)){
      setAlerta({msg: "Fondos insuficientes"});
      return;
    }

    try{


      web3.eth.sendTransaction({
        from: miDireccion, to: direccionEnvio, value: web3.utils.toWei(cantidad.toString(), 'ether')
      })
      setAlerta({msg: "Envío correctamente"})
      setMiDireccion('');
      setDireccionEnvio('')
      setCantidad(0);


    }catch(error){
      setAlerta({msg: "El envío falló"})
    }

  }


  const {msg} = alerta;


  return (
    <>
      <div>
        <h1>Formulario</h1>

        { msg && <Alerta  alerta={alerta}/>}
        <form onSubmit={enviar}>
  
        <div>
          <label htmlFor="direccion1"> Mi dirección</label>
          <input type="text"  placeholder='Digita tu dirección' id='direccion1' value={miDireccion} onChange={(e) => setMiDireccion(e.target.value)}/>
        </div>

        <div>
          
          <label htmlFor="direccion2">Dirección destino</label>
          <input type="text"  placeholder='Digita la dirección a la que enviarás' id='direccion2'value={direccionEnvio} onChange={(e) => setDireccionEnvio(e.target.value)}/>

        </div>

        <div>
          <label htmlFor="cantidad">Cantidad</label>
          <input type="number" required placeholder='Digita la cantidad de ethers a enviar' id='cantidad' value={cantidad} onChange={(e) => setCantidad(e.target.value)}/>
        </div>

        <button type='submit'>Enviar</button>
        </form>
      </div>
    </>
  );
}

export default App;
