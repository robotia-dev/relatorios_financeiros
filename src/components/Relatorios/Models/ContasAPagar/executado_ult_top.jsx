import React, { Component } from "react";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBIcon,
  MDBTooltip,
} from "mdb-react-ui-kit";
import './style.css';

class TabelaDadosContasAPagarExecutado extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dadosDebito: this.processarDados(props.dados_origens_debito, 'debito'),
      dadosCredito: this.processarDados(props.dados_origens_credito, 'credito'),
      acumulativoMensalDebito: props.acumulativoMensal_origens_debito || [],
      acumulativoMensalCredito: props.acumulativoMensal_origens_credito || [],
      expandedCentroCusto: {}, // Controla os centros de custo expandidos
    };
    console.log(props.dados_origens_debito);
    console.log(props.dados_origens_credito);
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
        dadosDebito: this.processarDados(this.props.dados_origens_debito, 'debito'),
        dadosCredito: this.processarDados(this.props.dados_origens_credito, 'credito'),
        acumulativoMensalDebito: this.props.acumulativoMensal_origens_debito || [],
        acumulativoMensalCredito: this.props.acumulativoMensal_origens_credito || [],
      });
    }
  }

  // Função para processar os dados e adicionar o tipo (crédito ou débito)
  processarDados(dados, tipo) {
    return dados.map((linha) => ({
      ...linha,
      tipo, // Adiciona o tipo (crédito ou débito) para a linha
    }));
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

  formatarEmReais(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
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

    // Agrupar os dados por revenda, centro de custo e empresa
    const dadosAgrupados = [...dadosDebito, ...dadosCredito].reduce(
      (acc, linha) => {
        const key = `${linha.empresa}_${linha.revenda}_${linha.centro_custo}`;
        if (!acc[key]) {
          acc[key] = {
            ...linha,
            totalDebito: 0,
            totalCredito: 0,
            formasPagamento: [],
            origens: [],
          };
        }
        if (linha.tipo === 'debito') {
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
            <tr  className="sticky-header">
              <th>Empresa</th>
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
              const saldoTotal = grupo.totalCredito - grupo.totalDebito;

              return (
                <React.Fragment key={key}>
                  <tr>
                    <td>{grupo.empresa}</td>
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
                    <td>
                      <MDBTooltip
                        tag="span"
                        title={`Total Débito: ${this.formatarEmReais(grupo.totalDebito)}`}
                      >
                        <span style={{ color: "red" }}>
                          {this.formatarEmReais(grupo.totalDebito)}
                        </span>
                      </MDBTooltip>
                    </td>
                    <td>
                      <MDBTooltip
                        tag="span"
                        title={`Total Crédito: ${this.formatarEmReais(grupo.totalCredito)}`}
                      >
                        <span style={{ color: "green" }}>
                          {this.formatarEmReais(grupo.totalCredito)}
                        </span>
                      </MDBTooltip>
                    </td>
                    <td>{this.formatarEmReais(saldoTotal)}</td>
                    {mesesUnicos.map((mes, idx) => {
                      const mensalDebito = acumulativoMensalDebito.find(
                        (item) =>
                          item[0]?.mes === mes &&
                          item[0]?.empresa === grupo.empresa &&
                          item[0]?.revenda === grupo.revenda &&
                          item[0]?.centro_custo === grupo.centro_custo
                      );
                      const mensalCredito = acumulativoMensalCredito.find(
                        (item) =>
                          item[0]?.mes === mes &&
                          item[0]?.empresa === grupo.empresa &&
                          item[0]?.revenda === grupo.revenda &&
                          item[0]?.centro_custo === grupo.centro_custo
                      );
                      const totalMensal =
                        (mensalCredito?.[0]?.total || 0) -
                        (mensalDebito?.[0]?.total || 0);
                      return (
                        <td key={idx}>
                          <MDBTooltip
                            tag="span"
                            title={`Débito: ${this.formatarEmReais(mensalDebito?.[0]?.total || 0)} - Crédito: ${this.formatarEmReais(mensalCredito?.[0]?.total || 0)}`}
                          >
                            {this.formatarEmReais(totalMensal)}
                          </MDBTooltip>
                        </td>
                      );
                    })}
                  </tr>
                  {isExpanded &&
                    grupo.origens.map((origem, origemIdx) => {
                      const origemClass = origem.tipo === 'debito' ? "bg-danger-light" : "bg-success";
                      return (
                        <tr
                          key={`${key}_${origemIdx}`}
                          className={origemClass}
                        >
                          <td colSpan="2" className="text-end">
                            {origem.origem}
                          </td>
                          <td colSpan="4">
                            {origem.formas_pagamento.map((forma, idx) => (
                              <div key={idx}>
                                {forma.condicao}: {this.formatarEmReais(forma.somatorio_valor)}
                              </div>
                            ))}
                          </td>
                        </tr>
                      );
                    })}
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
