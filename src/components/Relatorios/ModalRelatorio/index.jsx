import React, { Component } from "react";
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
} from "mdb-react-ui-kit";
import ApiService from "../../../services/api"; // Importando a classe ApiService
import TabelaDadosContasAPagarAberto from "../Models/ContasAPagar/aberto.jsx";
import TabelaDadosContasAPagarExecutado from "../Models/ContasAPagar/executado.jsx";
import TabelaDadosContasAReceberAberto from "../Models/ContasAReceber/aberto.jsx";
import TabelaDadosContasAReceberExecutado from "../Models/ContasAReceber/executado.jsx";

class DataModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: true, // A modal está aberta inicialmente
      loading: false, // Indicador de loading durante a chamada da API
      errorMessage: "", // Para mostrar erro, se ocorrer
      reports: null, // Para armazenar os relatórios retornados pela API
    };
    this.apiService = new ApiService(); // Inicializando a classe ApiService
  }

  toggleModal = () => {
    this.setState({ modalOpen: false, reports: null }); // Limpar os dados ao fechar a modal
    this.props.toggleModal(); // Chama a função passada para o componente pai
  };

  callApi = async () => {
    const { dta_inicio, dta_final } = this.props;

    if (this.state.loading) return;

    this.setState({ loading: true, errorMessage: "", reports: null });

    try {
      const response = await this.apiService.post(
        "/relatorios_financeiros/v.1/",
        { dta_inicio, dta_final }
      );

      if (response && response.status === 200 && response.data) {
        const { data_relatorio } = response.data;
        if (data_relatorio) {
          this.setState({ reports: data_relatorio });
        } else {
          this.setState({ errorMessage: "Nenhum dado encontrado no relatório." });
        }
      } else {
        this.setState({ errorMessage: "Erro ao obter os dados. Tente novamente." });
      }
    } catch (error) {
      this.setState({ errorMessage: "Erro ao obter os dados. Tente novamente." });
    } finally {
      this.setState({ loading: false });
    }
  };

  componentDidMount() {
    this.callApi();
  }

  render() {
    const { dta_inicio, dta_final } = this.props;
    const { modalOpen, loading, errorMessage, reports } = this.state;

    return (
      <MDBModal open={modalOpen} tabIndex="-1">
        <MDBModalDialog className="modal-fullscreen">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Relatórios Financeiros</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={this.toggleModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <p>Você enviou os seguintes dados:</p>
              <ul>
                <li>Data de Início: {dta_inicio}</li>
                <li>Data Final: {dta_final}</li>
              </ul>

              {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
              {loading && <div>Carregando relatórios...</div>}

              {reports && (
                <>
                  <p>Iniciando Tabela de Dados Contas A Pagar Aberto...</p>
                  <TabelaDadosContasAPagarAberto
                    dados={reports.pagar_aberto.dados}
                    acumulativoMensal={reports.pagar_aberto.acumulativo_mensal}
                  /> 

                  <p>Iniciando Tabela de Dados Contas A Pagar Executado...</p>
                  <TabelaDadosContasAPagarExecutado
                    dados={reports.pagar_executado.dados}
                    acumulativoMensal={reports.pagar_executado.acumulativo_mensal}
                  />


                  <p>Iniciando Tabela de Dados Contas A Receber Aberto...</p>
                  <TabelaDadosContasAReceberAberto
                    dados={reports.receber_aberto.dados}
                    acumulativoMensal={reports.receber_aberto.acumulativo_mensal}
                  />

                  <p>Iniciando Tabela de Dados Contas A Receber Executado...</p>
                  <TabelaDadosContasAReceberExecutado
                    dados={reports.receber_executado.dados}
                    acumulativoMensal={reports.receber_executado.acumulativo_mensal}
                  />
                </>
              )}
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={this.toggleModal}>
                Fechar
              </MDBBtn>
              <MDBBtn color="primary" onClick={this.callApi} disabled={loading}>
                {loading ? "Carregando..." : "Atualizar Relatórios"}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    );
  }
}

export default DataModal;
