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
      mostrarDetalhamentoMensal: false, // Estado para controlar a visibilidade das colunas mensais
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

  // Alterna a visibilidade do detalhamento mensal
  toggleDetalhamentoMensal() {
    this.setState((prevState) => ({
      mostrarDetalhamentoMensal: !prevState.mostrarDetalhamentoMensal,
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
      mostrarDetalhamentoMensal,
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

    // Somar valores das formas de pagamento
    const somarFormasPagamento = (formasPagamento) => {
      const totais = {};
      formasPagamento.forEach((forma) => {
        if (!totais[forma.condicao]) {
          totais[forma.condicao] = 0;
        }
        totais[forma.condicao] += forma.somatorio_valor;
      });
      return totais;
    };

    return (
      <div className="container mt-4">
        <MDBBtn color="primary" onClick={() => this.toggleDetalhamentoMensal()}>
          {mostrarDetalhamentoMensal ? "Ocultar Detalhamento Mensal" : "Mostrar Detalhamento Mensal"}
        </MDBBtn>
        <MDBTable striped bordered hover responsive>
          <MDBTableHead>
            <tr className="sticky-header">
              <th>Empresa</th>
              <th>Revenda</th>
              <th>Centro de Custo</th>
              <th>Débito Total</th>
              <th>Crédito Total</th>
              <th>Saldo Total</th>
              {mostrarDetalhamentoMensal &&
                mesesUnicos.map((mes, idx) => (
                  <th key={idx}>{mes || "Mês N/A"}</th>
                ))}
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {Object.entries(dadosAgrupados).map(([key, grupo]) => {
              const isExpanded = expandedCentroCusto[key];
              const saldoTotal = grupo.totalCredito - grupo.totalDebito;
              const totaisFormasPagamento = somarFormasPagamento(grupo.formasPagamento);

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
                    {mostrarDetalhamentoMensal && mesesUnicos.map((mes, idx) => {
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

                  {/* Linha de Detalhamento das Origens */}
                  {isExpanded && grupo.origens.map((origem, origemIdx) => {
                    const origemClass = origem.tipo === 'debito' ? "bg-danger-light" : "bg-success-edited";
                    return (
                      <tr key={`${key}_${origemIdx}`} className={origemClass}>
                        <td colSpan="2" className="text-end">
                          {origem.origem} - <strong>{origem.tipo.toUpperCase()}</strong>
                        </td>
                        <td colSpan="4">
                          {this.formatarEmReais(origem.total)}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Linha das Formas de Pagamento (abaixo das origens) */}
                  {isExpanded && (
                    <tr className="bg-light">
                      <td colSpan="6">
                        <strong>Formas de Pagamento:</strong>
                        {Object.entries(totaisFormasPagamento).map(([condicao, total]) => (
                          <div key={condicao}>
                            {condicao}: {this.formatarEmReais(total)}
                          </div>
                        ))}
                      </td>
                    </tr>
                  )}

                  {/* Linha de Total das Origens (abaixo das formas de pagamento) */}
                  {isExpanded && (
                    <tr className="totalizador">
                      <td colSpan="2" className=" text-end">
                        TOTAL DO CENTRO DE CUSTO / DEPARTAMENTO:
                      </td>
                      <td colSpan="4">
                        {this.formatarEmReais(grupo.totalCredito - grupo.totalDebito)}
                      </td>
                    </tr>
                  )}
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
