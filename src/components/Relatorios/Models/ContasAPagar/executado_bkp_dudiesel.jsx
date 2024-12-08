import React, { Component } from "react";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
} from "mdb-react-ui-kit";

class TabelaDadosContasAPagarExecutado extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dados_origens_debito: props.dados_origens_debito || [],
      dados_origens_credito: props.dados_origens_credito || [],
      acumulativoMensal_origens_debito:
        props.acumulativoMensal_origens_debito || [],
      acumulativoMensal_origens_credito:
        props.acumulativoMensal_origens_credito || [],
    };
  }

  // Função para agrupar dados por centro de custo e calcular os totais
  agruparDadosPorCentroCusto() {
    const { dados_origens_debito, dados_origens_credito } = this.state;

    // Combinar débito e crédito
    const todosDados = [...dados_origens_debito, ...dados_origens_credito];

    // Agrupar por revenda e centro de custo
    const agrupados = todosDados.reduce((acc, item) => {
      const key = `${item.revenda}-${item.centro_custo}`;
      if (!acc[key]) {
        acc[key] = {
          revenda: item.revenda,
          centro_custo: item.centro_custo,
          total: 0,
          formas_pagamento: {},
        };
      }

      acc[key].total += item.total || 0;

      item.formas_pagamento?.forEach((forma) => {
        if (!acc[key].formas_pagamento[forma.condicao]) {
          acc[key].formas_pagamento[forma.condicao] = 0;
        }
        acc[key].formas_pagamento[forma.condicao] += forma.somatorio_valor || 0;
      });

      return acc;
    }, {});

    return Object.values(agrupados);
  }

  // Função para gerar as colunas mensais
  calcularTotaisMensaisPorCentroCusto() {
    const { acumulativoMensal_origens_debito, acumulativoMensal_origens_credito } =
      this.state;

    // Combinar acumulativos de débito e crédito
    const acumulativos = [
      ...acumulativoMensal_origens_debito,
      ...acumulativoMensal_origens_credito,
    ];

    // Agrupar por mês e centro de custo
    const agrupados = acumulativos.reduce((acc, item) => {
      const { mes, revenda, centro_custo, total } = item[0];
      const key = `${revenda}-${centro_custo}-${mes}`;
      if (!acc[key]) {
        acc[key] = { mes, revenda, centro_custo, total: 0 };
      }
      acc[key].total += total || 0;
      return acc;
    }, {});

    return agrupados;
  }

  render() {
    const dadosAgrupados = this.agruparDadosPorCentroCusto();
    const totaisMensais = this.calcularTotaisMensaisPorCentroCusto();
    const mesesUnicos = [...new Set(Object.values(totaisMensais).map((item) => item.mes))];

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
              <th>Formas de Pagamento</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {dadosAgrupados.map((linha, linhaIndex) => (
              <tr key={linhaIndex}>
                <td>{linha.revenda}</td>
                <td>{linha.centro_custo}</td>
                <td>{linha.total.toFixed(2)}</td>
                {mesesUnicos.map((mes, idx) => {
                  const totalMes =
                    totaisMensais[`${linha.revenda}-${linha.centro_custo}-${mes}`]?.total ||
                    0;
                  return <td key={idx}>{totalMes.toFixed(2)}</td>;
                })}
                <td>
                  {Object.entries(linha.formas_pagamento).map(([condicao, valor], idx) => (
                    <div key={idx}>
                      {condicao}: {valor.toFixed(2)}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      </div>
    );
  }
}

export default TabelaDadosContasAPagarExecutado;
