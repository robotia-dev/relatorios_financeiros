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
      dadosDebito: props.dados_origens_debito || [],
      dadosCredito: props.dados_origem_credito || [],
      acumulativoMensalDebito: props.acumulativoMensal_origens_debito || [],
      acumulativoMensalCredito: props.acumulativoMensal_origens_credito || [],
      expandedCentroCusto: {}, // Controla os centros de custo expandidos
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.dados_origens_debito !== this.props.dados_origens_debito ||
      prevProps.dados_origem_credito !== this.props.dados_origem_credito ||
      prevProps.acumulativoMensal_origens_debito !==
        this.props.acumulativoMensal_origens_debito ||
      prevProps.acumulativoMensal_origens_credito !==
        this.props.acumulativoMensal_origens_credito
    ) {
      this.setState({
        dadosDebito: this.props.dados_origens_debito || [],
        dadosCredito: this.props.dados_origem_credito || [],
        acumulativoMensalDebito: this.props.acumulativoMensal_origens_debito || [],
        acumulativoMensalCredito: this.props.acumulativoMensal_origens_credito || [],
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
    const {
      dadosDebito,
      dadosCredito,
      acumulativoMensalDebito,
      acumulativoMensalCredito,
      expandedCentroCusto,
    } = this.state;

    if (!dadosDebito.length && !dadosCredito.length) {
      return <div>Nenhum dado disponível para exibir.</div>;
    }

    // Agrupar os dados por revenda e centro de custo
    const dadosAgrupados = [...dadosDebito, ...dadosCredito].reduce(
      (acc, linha) => {
        const key = `${linha.revenda}_${linha.centro_custo}`;
        if (!acc[key]) {
          acc[key] = {
            ...linha,
            totalDebito: 0,
            totalCredito: 0,
            formasPagamento: [],
            origens: [],
          };
        }
        if (linha.total < 0) {
          acc[key].totalDebito += Math.abs(linha.total);
        } else {
          acc[key].totalCredito += linha.total;
        }
        acc[key].formasPagamento.push(...linha.formas_pagamento);
        acc[key].origens.push(linha);
        return acc;
      },
      {}
    );

    // Extrair meses únicos dos acumulativos
    const mesesUnicos = [
      ...new Set([
        ...acumulativoMensalDebito.map((item) => item[0]?.mes),
        ...acumulativoMensalCredito.map((item) => item[0]?.mes),
      ]),
    ];

    return (
      <div className="container mt-4">
        <MDBTable striped bordered hover responsive>
          <MDBTableHead>
            <tr>
              <th>Revenda</th>
              <th>Centro de Custo</th>
              <th>Débito Total</th>
              <th>Crédito Total</th>
              <th>Saldo Total</th>
              {mesesUnicos.map((mes, idx) => (
                <th key={idx}>{mes || "Mês N/A"}</th>
              ))}
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {Object.entries(dadosAgrupados).map(([key, grupo]) => {
              const isExpanded = expandedCentroCusto[key];
              const saldoTotal =
                grupo.totalCredito - grupo.totalDebito;

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
                    <td>{grupo.totalDebito.toFixed(2)}</td>
                    <td>{grupo.totalCredito.toFixed(2)}</td>
                    <td>{saldoTotal.toFixed(2)}</td>
                    {mesesUnicos.map((mes, idx) => {
                      const mensalDebito = acumulativoMensalDebito.find(
                        (item) =>
                          item[0]?.mes === mes &&
                          item[0]?.centro_custo === grupo.centro_custo
                      );
                      const mensalCredito = acumulativoMensalCredito.find(
                        (item) =>
                          item[0]?.mes === mes &&
                          item[0]?.centro_custo === grupo.centro_custo
                      );
                      const totalMensal =
                        (mensalCredito?.[0]?.total || 0) -
                        (mensalDebito?.[0]?.total || 0);
                      return (
                        <td key={idx}>
                          {totalMensal.toFixed(2)}
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
                        <td colSpan="4">
                          {origem.formas_pagamento.map((forma, idx) => (
                            <div key={idx}>
                              {forma.condicao}: {forma.somatorio_valor.toFixed(2)}
                            </div>
                          ))}
                        </td>
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
