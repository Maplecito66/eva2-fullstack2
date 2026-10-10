import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ReportesAdmin() {
  const [ordenes, setOrdenes] = useState([]);
  const [ingresosTotales, setIngresosTotales] = useState(0);
  
  // NUEVO: Estado de carga añadido
  const [cargando, setCargando] = useState(true); 
  
  const location = useLocation();

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true); // Encendemos la rueda de carga
      try {
        const response = await fetch('http://localhost:5000/api/admin/ordenes', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setOrdenes(data);
          const total = data.reduce((acc, orden) => acc + Number(orden.total || 0), 0);
          setIngresosTotales(total);
        }
      } catch (error) {
        console.error("Error al cargar reportes:", error);
      } finally {
        setCargando(false); // Apagamos la rueda de carga
      }
    };

    cargarDatos();
  }, [location.key]);

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4 fw-bold">Informes Financieros</h2>
      
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-white bg-success shadow-sm h-100">
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <h5>Ingresos Totales (Histórico)</h5>
              <h1 className="display-4 fw-bold">
                {/* Renderizado condicional: Si está cargando muestra el spinner, si no, el dinero */}
                {cargando ? <div className="spinner-border" role="status"></div> : `$${ingresosTotales.toLocaleString('es-CL')}`}
              </h1>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-white bg-info shadow-sm h-100">
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <h5>Volumen de Ventas</h5>
              <h1 className="display-4 fw-bold">
                {/* Mismo spinner para la cantidad de órdenes */}
                {cargando ? <div className="spinner-border" role="status"></div> : ordenes.length}
              </h1>
              <p className="mb-0">Órdenes procesadas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Últimos movimientos registrados</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-sm table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Fecha</th>
                  <th>N° Orden</th>
                  <th>Cliente</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {/* Spinner también en la tabla mientras carga */}
                {cargando ? (
                  <tr><td colSpan="4" className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></td></tr>
                ) : ordenes.length === 0 ? (
                  <tr><td colSpan="4" className="text-center text-muted py-3">No hay órdenes registradas.</td></tr>
                ) : (
                  ordenes.slice(0, 10).map(orden => (
                    <tr key={orden.id}>
                      <td>{new Date(orden.fecha).toLocaleDateString('es-CL')}</td>
                      <td>#{orden.id}</td>
                      <td>{orden.nombre_cliente || 'Desconocido'}</td>
                      <td className="fw-bold text-success">${Number(orden.total).toLocaleString('es-CL')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}