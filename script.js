const dataPoints = [];

document.getElementById('manualEntryForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const fecha = document.getElementById('fecha').value;
    const persona = document.getElementById('persona').value;
    const punto = document.getElementById('punto').value;
    const parametro = document.getElementById('parametro').value;
    const resultado = parseFloat(document.getElementById('resultado').value);
    const limiteSuperior = parseFloat(document.getElementById('limiteSuperior').value) || null;
    const limiteInferior = parseFloat(document.getElementById('limiteInferior').value) || null;

    addDataPoint(fecha, persona, punto, parametro, resultado, limiteSuperior, limiteInferior);
    updateTable();
    document.getElementById('manualEntryForm').reset();
});

document.getElementById('importCsvBtn').addEventListener('click', () => {
    const input = document.getElementById('csvFileInput');
    const file = input.files[0];

    if (!file) {
        alert('Por favor selecciona un archivo CSV.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const rows = e.target.result.split('\n').map(row => row.split(','));
        rows.slice(1).forEach(row => {
            if (row.length >= 6) {
                addDataPoint(row[0], row[1], row[2], row[3], parseFloat(row[4]), parseFloat(row[5]), parseFloat(row[6]));
            }
        });
        updateTable();
    };
    reader.readAsText(file);
});

document.getElementById('exportCsvBtn').addEventListener('click', () => {
    const rows = [['Fecha', 'Persona', 'Punto', 'Parámetro', 'Resultado', 'Límite Superior', 'Límite Inferior']];
    dataPoints.forEach(dp => rows.push([dp.fecha, dp.persona, dp.punto, dp.parametro, dp.resultado, dp.limiteSuperior || '', dp.limiteInferior || '']));
    const csvContent = rows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'datos_muestreo.csv';
    a.click();
    URL.revokeObjectURL(url);
});

document.getElementById('exportExcelBtn').addEventListener('click', () => {
    const table = document.getElementById('dataTable');
    const wb = XLSX.utils.table_to_book(table, { sheet: 'Datos' });
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'datos_muestreo.xlsx';
    a.click();
    URL.revokeObjectURL(url);
});

function addDataPoint(fecha, persona, punto, parametro, resultado, limiteSuperior, limiteInferior) {
    dataPoints.push({ fecha, persona, punto, parametro, resultado, limiteSuperior, limiteInferior });
}

function updateTable() {
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = '';
    dataPoints.forEach(dp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${dp.fecha}</td>
            <td>${dp.persona}</td>
            <td>${dp.punto}</td>
            <td>${dp.parametro}</td>
            <td>${dp.resultado}</td>
            <td>${dp.limiteSuperior ? `Superior: ${dp.limiteSuperior}` : ''} ${dp.limiteInferior ? `Inferior: ${dp.limiteInferior}` : ''}</td>
        `;
        tbody.appendChild(row);
    });
    document.getElementById('data-section').style.display = 'block';
}
