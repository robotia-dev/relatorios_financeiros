// src/components/pages/Relatorios/index.jsx
import React, { Component } from 'react';
import MainLayout from '../../layout/MainLayout';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import DataModal from '../../Relatorios/ModalRelatorio/Index.jsx';

class RelatoriosPage extends Component {
  state = {
    dataInicio: '',
    dataFim: '',
    showModal: false, // Controle da modal
  };

  // Atualiza o estado com os valores do formulário
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  // Envio do formulário
  handleSubmit = (e) => {
    e.preventDefault();

    // Exibe a modal
    this.setState({ showModal: true });
  };

  // Fecha a modal
  closeModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { dataInicio, dataFim, showModal } = this.state;

    return (
      <MainLayout className="home-layout">
        <MDBContainer className="my-5">
          <h2 className="text-center mb-4" style={{ color: '#007BFF', marginTop: '50px' }}>
            <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" /> Relatório Financeiro
          </h2>
          <form onSubmit={this.handleSubmit}>
            <MDBRow>
              <MDBCol md="6">
                <MDBInput
                  label="Data Início"
                  type="date"
                  name="dataInicio"
                  value={dataInicio}
                  onChange={this.handleInputChange}
                  icon={<FontAwesomeIcon icon={faCalendarAlt} />}
                />
              </MDBCol>
              <MDBCol md="6">
                <MDBInput
                  label="Data Fim"
                  type="date"
                  name="dataFim"
                  value={dataFim}
                  onChange={this.handleInputChange}
                  icon={<FontAwesomeIcon icon={faCalendarAlt} />}
                />
              </MDBCol>
            </MDBRow>
            <br />
            <MDBBtn type="submit" color="primary" className="w-100">
              Gerar Relatório
            </MDBBtn>
          </form>

          {/* Modal */}
          {showModal && (
            <DataModal
              dta_inicio={dataInicio}
              dta_final={dataFim}
              toggleModal={this.closeModal} // Passando a função de fechar a modal
            />
          )}
        </MDBContainer>
      </MainLayout>
    );
  }
}

export default RelatoriosPage;
