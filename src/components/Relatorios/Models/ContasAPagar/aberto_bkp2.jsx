import React, { Component } from "react";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from "mdb-react-ui-kit";

class TabelaDados extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dados: props.dados || [], // Dados principais
      acumulativoMensal: props.acumulativoMensal || [], // Dados mensais acumulados
      expandedRow: null, // Controla qual linha está expandida
    };

    console.log("Props iniciais:", props);
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
      console.log("Props atualizadas:", this.props);
      this.setState({
        dados: this.props.dados || [],
        acumulativoMensal: this.props.acumulativoMensal || [],
      });
    }
  }

  // Controla expansão e colapso das linhas
  toggleRow(index) {
    this.setState((prevState) => ({
      expandedRow: prevState.expandedRow === index ? null : index,
    }));
  }

  render() {
    const { dados, acumulativoMensal, expandedRow } = this.state;

    console.log("Render - dados:", dados);
    console.log("Render - acumulativoMensal:", acumulativoMensal);

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
            {dadosAgrupados.map((linha, linhaIndex) => (
              <React.Fragment key={linhaIndex}>
                <tr
                  onClick={() => this.toggleRow(linhaIndex)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{linha.revenda || "-"}</td>
                  <td>{linha.origem || "-"}</td>
                  <td>{linha.centro_custo || "-"}</td>
                  <td>{linha.total?.toFixed(2) || "0.00"}</td>
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
                    <MDBBtn size="sm" color="info">
                      Ver Detalhes
                    </MDBBtn>
                  </td>
                </tr>
                {expandedRow === linhaIndex && (
                  <tr>
                    <td colSpan={6 + mesesUnicos.length}>
                      <div>
                        <strong>Formas de Pagamento:</strong>
                        <ul>
                          {linha.formas_pagamento?.map((forma, formaIndex) => (
                            <li key={formaIndex}>
                              <strong>{forma.condicao}</strong>:{" "}
                              {forma.somatorio_valor?.toFixed(2) || "0.00"}
                            </li>
                          ))}
                        </ul>
                        <strong>
                          Total Formas de Pagamento:{" "}
                          {linha.formas_pagamento
                            ?.reduce(
                              (sum, forma) => sum + (forma.somatorio_valor || 0),
                              0
                            )
                            .toFixed(2) || "0.00"}
                        </strong>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </MDBTableBody>
        </MDBTable>
      </div>
    );
  }
}

export default TabelaDados;
