import React, { Component } from "react";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";

class TabelaDadosContasAPagarExecutado extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dados: props.dados_origens_debito || [],
      acumulativoMensal: props.acumulativoMensal_origens_debito || [],
      expandedCentroCusto: {}, // Controla quais centros de custo estão expandidos
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.dados_origens_debito !== this.props.dados_origens_debito ||
      prevProps.acumulativoMensal_origens_debito !==
        this.props.acumulativoMensal_origens_debito
    ) {
      this.setState({
        dados: this.props.dados_origens_debito || [],
        acumulativoMensal: this.props.acumulativoMensal_origens_debito || [],
      });
    }
  }

  // Alterna a expansão de um centro de custo específico
  toggleCentroCusto(centroCustoKey) {
    this.setState((prevState) => ({
      expandedCentroCusto: {
        ...prevState.expandedCentroCusto,
        [centroCustoKey]: !prevState.expandedCentroCusto[centroCustoKey],
      },
    }));
  }

  render() {
    const { dados, acumulativoMensal, expandedCentroCusto } = this.state;

    if (!Array.isArray(dados) || dados.length === 0) {
      return <div>Nenhum dado disponível para exibir.</div>;
    }

    // Extrair meses únicos do acumulativoMensal
    const mesesUnicos = [
      ...new Set(acumulativoMensal.map((item) => item[0]?.mes)),
    ];

    // Agrupar dados por centro de custo
    const dadosAgrupados = dados.reduce((acc, linha) => {
      const key = `${linha.revenda}_${linha.centro_custo}`;
      if (!acc[key]) {
        acc[key] = { ...linha, origens: [] };
      }
      acc[key].origens.push(linha);
      acc[key].total += linha.total || 0;
      return acc;
    }, {});

    return (
      <div className="container mt-4">
        <MDBTable striped bordered hover responsive>
          <MDBTableHead>
            <tr>
              <th>Revenda</th>
              <th>Centro de Custo</th>
              <th>Total</th>
              {mesesUnicos.map((mes, idx) => (
                <th key={idx}>{mes || "Mês N/A"}</th>
              ))}
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {Object.entries(dadosAgrupados).map(([key, grupo]) => {
              const isExpanded = expandedCentroCusto[key];

              return (
                <React.Fragment key={key}>
                  <tr>
                    <td>{grupo.revenda}</td>
                    <td>
                      <MDBBtn
                        color="link"
                        size="sm"
                        onClick={() => this.toggleCentroCusto(key)}
                      >
                        {grupo.centro_custo}{" "}
                        <MDBIcon
                          fas
                          icon={isExpanded ? "angle-up" : "angle-down"}
                        />
                      </MDBBtn>
                    </td>
                    <td>{grupo.total.toFixed(2)}</td>
                    {mesesUnicos.map((mes, idx) => {
                      const mensal = acumulativoMensal.find(
                        (item) =>
                          item[0]?.mes === mes &&
                          item[0]?.centro_custo === grupo.centro_custo
                      );
                      return (
                        <td key={idx}>
                          {mensal ? mensal[0]?.total.toFixed(2) : "0.00"}
                        </td>
                      );
                    })}
                  </tr>
                  {isExpanded &&
                    grupo.origens.map((origem, origemIdx) => (
                      <tr key={`${key}_${origemIdx}`} className="bg-light">
                        <td colSpan="2" className="text-end">
                          {origem.origem}
                        </td>
                        <td>{origem.total.toFixed(2)}</td>
                        {mesesUnicos.map((mes, idx) => {
                          const mensal = acumulativoMensal.find(
                            (item) =>
                              item[0]?.mes === mes &&
                              item[0]?.centro_custo === grupo.centro_custo &&
                              item[0]?.origem === origem.origem
                          );
                          return (
                            <td key={idx}>
                              {mensal ? mensal[0]?.total.toFixed(2) : "0.00"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                </React.Fragment>
              );
            })}
          </MDBTableBody>
        </MDBTable>
      </div>
    );
  }
}

export default TabelaDadosContasAPagarExecutado;
