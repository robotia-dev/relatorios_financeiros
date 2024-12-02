// src/components/header/index.jsx
import React, { useState, useEffect } from "react";
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdb-react-ui-kit"; // Mantendo o uso do MDB apenas para estrutura
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faWrench, faPhoneAlt, faTools } from '@fortawesome/free-solid-svg-icons';
import data from '../../../dados_apps/dados.json';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para navegação

const Header = () => {
  const [showNav, setShowNav] = useState(false);
  const [activeServices, setActiveServices] = useState([]); // Novo estado para serviços ativos
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    // Carregar dados do JSON
    loadActiveServices();
  }, []);

  const loadActiveServices = () => {
    // Atualizar o estado com os serviços ativos
    const services = data.Apps[0]; // Supondo que 'Apps' é um array e você quer o primeiro elemento
    const activeServices = Object.keys(services).filter(service => services[service]);
    setActiveServices(activeServices);
  };

  const toggleNav = () => {
    setShowNav(prevShowNav => !prevShowNav);
  };

  const handleServiceClick = (service) => {
    // Mapeia o nome do serviço para a rota correspondente ou link externo
    const serviceRoutes = {
      'RELATORIOS FINANCEIRO': '/relatorios',
      'RELATORIOS VENDAS': 'http://102.11:8000/relatorios-vendas', // Link externo
      'GERENCIADOR DE PEDIDOS': '/gerenciador-pedidos',
      'MONITORAMENTO DO ESTOQUE': 'http://www.fulanodetal.com', // Link externo
    };

    // Obtém a rota ou link
    const route = serviceRoutes[service];
    if (route) {
      // Verifica se é um link externo
      if (route.startsWith('http')) {
        window.open(route, '_blank'); // Abre em uma nova aba
      } else {
        navigate(route); // Usa navigate para redirecionar
      }
    }
  };

  return (
    <header style={{ width: '100%' }}>
      {/* Navbar */}
      <MDBNavbar expand="lg" dark bgColor="dark" className="shadow-3-strong" style={{ width: '100%' }}>
        <MDBContainer fluid>
          {/* Marca */}
          <MDBNavbarBrand href="#" className="text-white fw-bold d-flex align-items-center">
            <span className="text-uppercase">Autotec Systems</span>
          </MDBNavbarBrand>

          {/* Botão Toggle */}
          <MDBNavbarToggler
            aria-controls="navbar"
            aria-expanded={showNav}
            aria-label="Toggle navigation"
            onClick={toggleNav}
          >
            <FontAwesomeIcon icon={faTools} />
          </MDBNavbarToggler>

          {/* Collapsible Navbar */}
          <MDBCollapse navbar show={showNav}>
            <MDBNavbarNav right fullWidth={false} className="text-white">
              <MDBNavbarItem>
                <MDBNavbarLink active aria-current="page" href="#">
                  <FontAwesomeIcon icon={faHome} className="me-2 text-info" />
                  Início
                </MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink href="#">
                  <FontAwesomeIcon icon={faWrench} className="me-2 text-warning" />
                  Serviços
                </MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink href="#">
                  <FontAwesomeIcon icon={faPhoneAlt} className="me-2 text-success" />
                  Contato
                </MDBNavbarLink>
              </MDBNavbarItem>

              {/* Dropdown */}
              <MDBNavbarItem>
                <MDBDropdown>
                  <MDBDropdownToggle tag="a" className=" nav-link text-danger">
                    <FontAwesomeIcon icon={faTools} className="me-2" />
                    Serviços Ativos
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    {activeServices.map((service, index) => (
                      <MDBDropdownItem 
                        key={index} 
                        link 
                        onClick={() => handleServiceClick(service)}
                      >
                        <FontAwesomeIcon icon={faWrench} className="me-2 text-info" />
                        {service}
                      </MDBDropdownItem>
                    ))}
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
    </header>
  );
};

export default Header;