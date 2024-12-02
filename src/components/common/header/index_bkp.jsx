// src/components/header/index.jsx
import React, { Component } from "react";
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
import { Car, Wrench } from 'phosphor-react'; // Phosphor Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faWrench, faPhoneAlt, faTools } from '@fortawesome/free-solid-svg-icons';
import data from '../../../dados_apps/dados.json';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNav: false,
      activeServices: [], // Novo estado para serviços ativos
    };
  }

  componentDidMount() {
    // Carregar dados do JSON
    this.loadActiveServices();
  }

  loadActiveServices = () => {
    // Atualizar o estado com os serviços ativos
    const services = data.Apps[0]; // Supondo que 'Apps' é um array e você quer o primeiro elemento
    const activeServices = Object.keys(services).filter(service => services[service]);
    this.setState({ activeServices });

  };

  toggleNav = () => {
    this.setState({ showNav: !this.state.showNav });
  };

  render() {
    return (
      <header style={{ width: '100%' }}>
        {/* Navbar */}
        <MDBNavbar expand="lg" dark bgColor="dark" className="shadow-3-strong" style={{ width: '100%' }}>
          <MDBContainer fluid>
            {/* Marca */}
            <MDBNavbarBrand href="#" className="text-white fw-bold d-flex align-items-center">
              {/* <Car size={32} color="#FFC107" className="me-3" /> */}
                        {/* Seção de Informações do Cliente */}


              {/* <Car size={32} color="#FFC107" className="me-3" /> */}

              <span className="text-uppercase">Autotec Systems</span>
            </MDBNavbarBrand>

            {/* Botão Toggle */}
            <MDBNavbarToggler
              aria-controls="navbar"
              aria-expanded={this.state.showNav}
              aria-label="Toggle navigation"
              onClick={this.toggleNav}
            >
              <FontAwesomeIcon icon={faTools} />
            </MDBNavbarToggler>

            {/* Collapsible Navbar */}
            <MDBCollapse navbar show={this.state.showNav}>
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
                    <MDBDropdownToggle tag="a" className="nav-link text-danger">
                      <FontAwesomeIcon icon={faTools} className="me-2" />
                      Serviços Ativos
                    </MDBDropdownToggle>
                    <MDBDropdownMenu>
                      {this.state.activeServices.map((service, index) => (
                        <MDBDropdownItem key={index} link>
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
  }
}

export default Header;