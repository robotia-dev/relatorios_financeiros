// src/layouts/MainLayout.jsx
import React, { Component } from 'react';
import Header from '../../common/header';
// import Footer from '../components/Common/Footer';
import './index.css';
class MainLayout extends Component {
  render() {
    return (
      <div>
        <Header />
        <main>{this.props.children}</main>
        {/* <Footer /> */}
        
      <footer className="text-center text-white bg-dark py-3">
          <p className="mb-0">
            &copy; 2024 <span className="fw-bold">Autotec Systems</span>. Todos os direitos reservados.
          </p>
        </footer>
      </div>
    );
  }
}

export default MainLayout;