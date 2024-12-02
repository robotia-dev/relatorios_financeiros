// Home.js

import React, { Component } from 'react';
import MainLayout from '../../layout/MainLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { MDBBtn } from 'mdb-react-ui-kit';
import { Car, Wrench, Nut } from 'phosphor-react';
import './index.css';
import trator_icon from '/trator_svg.jpg';
import van_icon from '/van.svg';
import bike_icon from '/undraw_bike.svg';
import motorcycle_icon from '/motorcycle.svg';
import car_profile_icon from '/car-profile.svg';
import undraw_car from '/undraw_car.svg'; // URL do SVG na pasta public

class Home extends Component {
  render() {
    return (
      <MainLayout className="home-layout">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 text-center">
              <div className="py-5 text-center gradient-background">
                <h3 className="display-4 text-white fw-bold">
                  Soluções inovadoras para a gestão de seus sistemas e serviços     
                  <Wrench size={48} color="#FFC107" className="me-3 animated-icon" />
                <Nut size={48} color="#28a745" className="me-3 animated-icon" />
       
       <br />
               
                  <span className="specialized-text display-4">
                    <img
                      className='me-3 animated-icon car-icon'
                      src={car_profile_icon}
                      alt="Ilustração de Carro"
                      style={{ width: '2rem', height: 'auto', color: 'red' }}
                    />
                    Especializados no segmento automotivo.
                  </span>
                  <br />  
                  <Car size={48} color="#007BFF" className="me-3 animated-icon" />
               
                </h3>
                <p className="lead text-light">
                  Integrado com todos ERP/CRM/DMS.
                </p>
                <MDBBtn color="warning" size="lg" className="mt-3">
                  Saiba Mais <FontAwesomeIcon icon={faWrench} className="ms-2" />
                </MDBBtn>
              </div>

              <div className="text-center mb-5 icons-container">
               
  <img   className='me-3 animated-icon' src={undraw_car} alt="Ilustração de Carro" style={{ width: '4rem', height: 'auto' }} />

                <img
                  className='me-3 animated-icon'
                  src={trator_icon}
                  alt="Ilustração de Trator"
                  style={{ width: '4rem', height: 'auto', color: 'red' }}
                />
                <img
                  className='me-3 animated-icon'
                  src={bike_icon}
                  alt="Ilustração de Bike"
                  style={{ width: '4rem', height: 'auto', color: 'red' }}
                />
                <img
                  className='me-3 animated-icon'
                  src={motorcycle_icon}
                  alt="Ilustração de Motocicleta"
                  style={{ width: '4rem', height: 'auto', color: 'red' }}
                />

              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
}

export default Home;