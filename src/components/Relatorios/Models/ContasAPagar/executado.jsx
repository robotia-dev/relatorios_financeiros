import React, { Component } from "react";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn, MDBCard, MDBCardHeader, MDBCardBody } from "mdb-react-ui-kit";

class TabelaDadosContasAPagarExecutado extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dados: props.dados || [], // Dados principais
      acumulativoMensal: props.acumulativoMensal || [], // Dados mensais acumulados
      expandedRevenda: null, // Controla qual card de revenda está expandido
    };
  }

  componentDidMount() {
    console.log("Estado inicial (dados):", this.state.dados);
    console.log("Estado inicial (acumulativoMensal):", this.state.acumulativoMensal);
  }

  componentDidUpdate(prevProps) {
    // Atualiza estado se as props mudarem
    if (
      prevProps.dados !== this.props.dados ||
      prevProps.acumulativoMensal !== this.props.acumulativoMensal
    ) {
      this.setState({
        dados: this.props.dados || [],
        acumulativoMensal: this.props.acumulativoMensal || [],
      });
    }
  }

  // Controla expansão e colapso dos cards por revenda
  toggleRevenda(index) {
    this.setState((prevState) => ({
      expandedRevenda: prevState.expandedRevenda === index ? null : index,
    }));
  }

  // Função para calcular os totais por revenda e condição
  calcularTotaisRevenda(linha) {
    let totalRevenda = 0;
    let totaisPorCondicao = {};

    // Somando totais de cada forma de pagamento (condição)
    linha.formas_pagamento?.forEach((forma) => {
      if (forma.condicao) {
        totaisPorCondicao[forma.condicao] =
          (totaisPorCondicao[forma.condicao] || 0) + (forma.somatorio_valor || 0);
      }
    });

    // Calcula o total geral da revenda
    totalRevenda = Object.values(totaisPorCondicao).reduce((acc, total) => acc + total, 0);

    return { totalRevenda, totaisPorCondicao };
  }

  render() {
    const { dados, acumulativoMensal, expandedRevenda } = this.state;

    if (!Array.isArray(dados) || dados.length === 0) {
      return <div>Nenhum dado disponível para exibir.</div>;
    }

    // Extrair meses únicos do acumulativoMensal
    const mesesUnicos = [
      ...new Set(acumulativoMensal.map((item) => item[0]?.mes)),
    ];

    // Agrupar dados para garantir que não haja linhas repetidas
    const dadosAgrupados = dados.filter((valor, indice, self) => {
      return (
        indice ===
        self.findIndex(
          (t) =>
            t.revenda === valor.revenda &&
            t.origem === valor.origem &&
            t.centro_custo === valor.centro_custo
        )
      );
    });

    return (
      <div className="container mt-4">
        {/* Tabela com dados dinâmicos e totais por mês */}
        <MDBTable striped bordered hover responsive>
          <MDBTableHead>
            <tr>
              <th>Revenda</th>
              <th>Origem</th>
              <th>Centro de Custo</th>
              <th>Total</th>
              {mesesUnicos.map((mes, idx) => (
                <th key={idx}>{mes || "Mês N/A"}</th>
              ))}
              <th>Formas de Pagamento</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {dadosAgrupados.map((linha, linhaIndex) => {
              const { totalRevenda, totaisPorCondicao } = this.calcularTotaisRevenda(linha);
              return (
                <React.Fragment key={linhaIndex}>
                  <tr>
                    <td>{linha.revenda || "-"}</td>
                    <td>{linha.origem || "-"}</td>
                    <td>{linha.centro_custo || "-"}</td>
                    <td>{totalRevenda.toFixed(2) || "0.00"}</td>
                    {mesesUnicos.map((colunaMes, colunaIndex) => {
                      const acumulativo = acumulativoMensal.find(
                        (item) =>
                          item[0]?.mes === colunaMes &&
                          item[0]?.empresa === linha.empresa &&
                          item[0]?.revenda === linha.revenda &&
                          item[0]?.origem === linha.origem
                      );
                      return (
                        <td key={colunaIndex}>
                          {acumulativo?.[0]?.total?.toFixed(2) || "-"}
                        </td>
                      );
                    })}
                    <td>
                      <MDBBtn
                        size="sm"
                        color="info"
                        onClick={() => this.toggleRevenda(linhaIndex)}
                      >
                        Ver Detalhes
                      </MDBBtn>
                    </td>
                  </tr>
                  {expandedRevenda === linhaIndex && (
                    <tr>
                      <td colSpan={6 + mesesUnicos.length}>
                        <div>
                          <strong>Formas de Pagamento:</strong>
                          <ul>
                            {Object.entries(totaisPorCondicao).map(
                              ([condicao, valor], formaIndex) => (
                                <li key={formaIndex}>
                                  <strong>{condicao}</strong>: {valor.toFixed(2) || "0.00"}
                                </li>
                              )
                            )}
                          </ul>
                          <strong>
                            Total Revenda: {totalRevenda.toFixed(2) || "0.00"}
                          </strong>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </MDBTableBody>
        </MDBTable>

        {/* Cards de Revenda com totais */}
        {/* <div className="d-flex flex-wrap mt-4">
          {dadosAgrupados.map((linha, linhaIndex) => {
            const { totalRevenda, totaisPorCondicao } = this.calcularTotaisRevenda(linha);
            return (
              <MDBCard
                key={linhaIndex}
                style={{
                  width: "300px",
                  marginRight: "15px",
                  marginBottom: "15px",
                  cursor: "pointer",
                }}
                onClick={() => this.toggleRevenda(linhaIndex)}
              >
                <MDBCardHeader>
                  <strong>Revenda: {linha.revenda}</strong>
                </MDBCardHeader>
                <MDBCardBody>
                  <p>Total Geral: {totalRevenda.toFixed(2) || "0.00"}</p>
                  <p>
                    <strong>Totais por Condição:</strong>
                    <ul>
                      {Object.entries(totaisPorCondicao).map(([condicao, valor], idx) => (
                        <li key={idx}>
                          <strong>{condicao}</strong>: {valor.toFixed(2) || "0.00"}
                        </li>
                      ))}
                    </ul>
                  </p>
                </MDBCardBody>
              </MDBCard>
            );
          })}
        </div> */}
      </div>
    );
  }
}

export default TabelaDadosContasAPagarExecutado;
