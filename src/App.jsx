import React, { useState } from 'react';
import Papa from 'papaparse';

function App() {
  const [csvData, setCsvData] = useState(null);
  const [results, setResults] = useState([]); // Nuevo estado para almacenar los resultados

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setCsvData(results.data);
      },
    });
  };

  const sendPostRequests = () => {
    if (csvData) {
      const newResults = [];
      csvData.forEach((row) => {
        const url = new URL('/api/nwtecuador/PedidoActionCrearWS', window.location.origin);
        Object.keys(row).forEach(key => {
          url.searchParams.append(key, row[key]);
        });

        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(row),
        })
        .then(response => response.json())
        .then(data => {
          newResults.push({ row, result: data });
          setResults([...newResults]); // Actualizar el estado con los nuevos resultados
        })
        .catch(error => {
          newResults.push({ row, result: error.message });
          setResults([...newResults]); // Actualizar el estado con los errores
        });
      });
    }
  };


  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <button onClick={sendPostRequests}>Enviar Solicitudes POST</button>

      <div>
        <h2>Resultados de las Solicitudes POST:</h2>
        <ul>
          {results.map((result, index) => (
            <li key={index}>
              <strong>Fila:</strong> {JSON.stringify(result.row.idPedido)}<br />
              <strong>Resultado:</strong> {JSON.stringify(result.result.respuesta)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
