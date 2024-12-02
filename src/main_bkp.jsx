import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from "./components/common/header/index.jsx"; // Caminho para o Header
import { faHome, faWrench, faPhoneAlt, faTools } from '@fortawesome/free-solid-svg-icons';

const nomeCliente = import.meta.env.NOME_CLIENTE;
const logoCliente = import.meta.env.LOGO_CLIENTE;
const empresasAtivasCliente = import.meta.env.EMPRESA_ATIVA_CLIENTE; // Converte para array de números
const revendasAtivasCliente = import.meta.env.REVENDAS_ATIVAS_CLIENTE; // Converte para array de números
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import App from './App.jsx'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import {  MDBBtn} from 'mdb-react-ui-kit';
// import 'bootstrap-icons/font/bootstrap-icons.css'; // Para ícones do Bootstrap, opcional
import undrawCar from '/undraw_car.svg'; // Exemplo de importação de uma ilustração do Undraw
import { Car, Wrench, Nut } from 'phosphor-react'; // Phosphor Icons

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <Header />


    <div className="py-5 text-center" style={{ background: "linear-gradient(45deg, #007BFF, #28a745, #FFC107, #DC3545)" }}>
          <h1 className="display-4 text-white fw-bold">
            <span className="text-uppercase text-dark">Autotec Systems</span>
          </h1>
          <p className="lead text-light">
            Soluções inovadoras para a gestão de seus sistemas e serviços especializados no segmento automotivo.
            <strong></strong>.
          </p>
          <MDBBtn color="warning" size="lg" className="mt-3">
            Saiba Mais <FontAwesomeIcon icon={faWrench} className="ms-2" />
          </MDBBtn>
        </div>

        {/* Adicionando elementos interativos */}
        <div className="text-center mb-5">
          <Car size={48} color="#007BFF" className="me-3 animated-icon" />
          <Wrench size={48} color="#FFC107" className="me-3 animated-icon" />
          <Nut size={48} color="#28a745" className="me-3 animated-icon" />
          <FontAwesomeIcon icon={faWrench} size="3x" className="text-danger" />
        </div>

     
      {/* Outras seções da aplicação */}
      <main className="container mt-5">
        <h1>Dudiesel - Relatórios Financeiros</h1>
        <p>Aqui você encontrará os melhores layouts para as impressoes dos seus relatorios.</p>
      </main>





      <footer className="text-center text-white bg-dark py-3">
          <p className="mb-0">
            &copy; 2024 <span className="fw-bold">Autotec Systems</span>. Todos os direitos reservados.
          </p>
        </footer>
  </StrictMode>,
)
