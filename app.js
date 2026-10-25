// ==========================================
// 1. NAVEGAÇÃO DAS PÁGINAS
// ==========================================
window.showSection = function(sectionId) {
    const sections = document.querySelectorAll('main > section');
    sections.forEach(sec => {
        sec.classList.remove('active-section');
        sec.classList.add('hidden-section');
    });

    const target = document.getElementById(sectionId);
    target.classList.remove('hidden-section');
    target.classList.add('active-section');
}

// ==========================================
// 2. CÁLCULOS DE INDICADORES (KPIs)
// ==========================================
window.calcularMTBF = function() {
    const tempo = parseFloat(document.getElementById('mtbf-tempo').value);
    const falhas = parseFloat(document.getElementById('mtbf-falhas').value);
    const divResultado = document.getElementById('resultado-mtbf');
    if (isNaN(tempo) || isNaN(falhas) || falhas <= 0) return divResultado.innerText = "Valores inválidos.";
    const mtbf = tempo / falhas;
    divResultado.innerText = `MTBF: ${mtbf.toFixed(2)} Horas/Falha`;
}

window.calcularMTTR = function() {
    const tempo = parseFloat(document.getElementById('mttr-tempo').value);
    const falhas = parseFloat(document.getElementById('mttr-falhas').value);
    const divResultado = document.getElementById('resultado-mttr');
    if (isNaN(tempo) || isNaN(falhas) || falhas <= 0) return divResultado.innerText = "Valores inválidos.";
    const mttr = tempo / falhas;
    divResultado.innerText = `MTTR: ${mttr.toFixed(2)} Horas/Falha`;
}

window.calcularDisponibilidade = function() {
    const hc = parseFloat(document.getElementById('disp-hc').value);
    const hm = parseFloat(document.getElementById('disp-hm').value);
    const divResultado = document.getElementById('resultado-disp');
    if (isNaN(hc) || isNaN(hm) || hc <= 0) return divResultado.innerText = "Valores inválidos.";
    const disp = ((hc - hm) / hc) * 100;
    divResultado.innerText = `Disponibilidade: ${disp.toFixed(2)}%`;
}

window.calcularConfiabilidade = function() {
    const mtbf = parseFloat(document.getElementById('conf-mtbf').value);
    const t = parseFloat(document.getElementById('conf-t').value);
    const divResultado = document.getElementById('resultado-conf');
    if (isNaN(mtbf) || isNaN(t) || mtbf <= 0) return divResultado.innerText = "Valores inválidos.";
    const conf = Math.exp(-t / mtbf) * 100;
    divResultado.innerText = `Confiabilidade: ${conf.toFixed(2)}%`;
}

window.calcularBacklog = function() {
    const pendentes = parseFloat(document.getElementById('backlog-pendentes').value);
    const disponiveis = parseFloat(document.getElementById('backlog-disponiveis').value);
    const divResultado = document.getElementById('resultado-backlog');
    if (isNaN(pendentes) || isNaN(disponiveis) || disponiveis <= 0) return divResultado.innerText = "Valores inválidos.";
    const backlog = pendentes / disponiveis;
    divResultado.innerText = `Backlog: ${backlog.toFixed(2)} Períodos`;
}

window.calcularRetrabalho = function() {
    const osRetrabalho = parseFloat(document.getElementById('ret-os').value);
    const osTotal = parseFloat(document.getElementById('ret-total').value);
    const divResultado = document.getElementById('resultado-ret');
    if (isNaN(osRetrabalho) || isNaN(osTotal) || osTotal <= 0) return divResultado.innerText = "Valores inválidos.";
    const ret = (osRetrabalho / osTotal) * 100;
    divResultado.innerText = `Retrabalho: ${ret.toFixed(2)}%`;
}

window.calcularTFA = function() {
    const acidentes = parseFloat(document.getElementById('tfa-acidentes').value);
    const hht = parseFloat(document.getElementById('tfa-hht').value);
    const divResultado = document.getElementById('resultado-tfa');
    if (isNaN(acidentes) || isNaN(hht) || hht <= 0) return divResultado.innerText = "Valores inválidos.";
    const tfa = (acidentes * 1000000) / hht;
    divResultado.innerText = `TFA: ${tfa.toFixed(2)}`;
}

window.calcularCMF = function() {
    const custo = parseFloat(document.getElementById('cmf-custo').value);
    const faturamento = parseFloat(document.getElementById('cmf-faturamento').value);
    const divResultado = document.getElementById('resultado-cmf');
    if (isNaN(custo) || isNaN(faturamento) || faturamento <= 0) return divResultado.innerText = "Valores inválidos.";
    const cmf = (custo / faturamento) * 100;
    divResultado.innerText = `CMF: ${cmf.toFixed(2)}%`;
}

// ==========================================
// 3. FUNÇÕES DO CHECKLIST DINÂMICO (POP)
// ==========================================
window.adicionarLinhaPOP = function() {
    const tbody = document.getElementById('pop-checklist-body');
    if (!tbody) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" class="table-input item-numero" readonly></td>
        <td><input type="text" class="table-input"></td>
        <td><input type="text" class="table-input"></td>
        <td style="text-align: center;"><input type="checkbox"></td>
        <td style="text-align: center;" class="hide-on-pdf">
            <button type="button" class="btn-remove" onclick="removerLinhaPOP(this)">X</button>
        </td>
    `;
    tbody.appendChild(tr);
    window.atualizarNumerosPOP();
}

window.removerLinhaPOP = function(botao) {
    const tbody = document.getElementById('pop-checklist-body');
    if (tbody.querySelectorAll('tr').length > 1) {
        botao.closest('tr').remove();
        window.atualizarNumerosPOP();
    } else {
        alert("O checklist precisa ter pelo menos um passo.");
    }
}

window.atualizarNumerosPOP = function() {
    const inputsNumero = document.querySelectorAll('#pop-checklist-body .item-numero');
    inputsNumero.forEach((input, index) => input.value = index + 1);
}

// ==========================================
// 4. FUNÇÕES DO CHECKLIST DINÂMICO (OS)
// ==========================================
window.adicionarLinhaOS = function() {
    const container = document.getElementById('os-checklist-container');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'checklist-item';
    div.innerHTML = `
        <input type="checkbox">
        <input type="text" class="table-input" placeholder="Descreva o procedimento...">
        <button type="button" class="btn-remove hide-on-pdf" onclick="removerLinhaOS(this)">X</button>
    `;
    container.appendChild(div);
}

window.removerLinhaOS = function(botao) {
    const container = document.getElementById('os-checklist-container');
    if (container.querySelectorAll('.checklist-item').length > 1) {
        botao.closest('.checklist-item').remove();
    } else {
        alert("O checklist precisa ter pelo menos um item.");
    }
}

// ==========================================
// 5. FUNÇÕES DA TABELA DINÂMICA (REQUISIÇÃO)
// ==========================================
window.adicionarLinhaReq = function() {
    const tbody = document.getElementById('req-table-body');
    if (!tbody) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" class="table-input item-numero-req" readonly></td>
        <td><input type="text" class="table-input" required></td>
        <td><input type="text" class="table-input" required></td>
        <td><input type="number" class="table-input" required></td>
        <td style="text-align: center;" class="hide-on-pdf">
            <button type="button" class="btn-remove" onclick="removerLinhaReq(this)">X</button>
        </td>
    `;
    tbody.appendChild(tr);
    window.atualizarNumerosReq();
}

window.removerLinhaReq = function(botao) {
    const tbody = document.getElementById('req-table-body');
    if (tbody.querySelectorAll('tr').length > 1) {
        botao.closest('tr').remove();
        window.atualizarNumerosReq();
    } else {
        alert("A requisição precisa ter pelo menos um item.");
    }
}

window.atualizarNumerosReq = function() {
    const inputsNumero = document.querySelectorAll('#req-table-body .item-numero-req');
    inputsNumero.forEach((input, index) => input.value = index + 1);
}

// ==========================================
// 6. GERAÇÃO DE PDF (SOLUÇÃO DEFINITIVA)
// ==========================================
function gerarPDF(elementoId, nomeArquivo) {
    const elemento = document.getElementById(elementoId);
    
    const checkRadios = elemento.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    checkRadios.forEach(input => {
        if (input.checked) input.setAttribute('checked', 'checked');
        else input.removeAttribute('checked');
    });

    const textElements = elemento.querySelectorAll('textarea, input[type="text"], input[type="date"], input[type="number"]');
    textElements.forEach(el => {
        const div = document.createElement('div');
        div.className = 'temp-pdf-text';
        if(el.classList.contains('table-input')) div.style.textAlign = 'left';
        div.innerText = el.value || ' '; 
        el.parentNode.insertBefore(div, el); 
        el.style.display = 'none'; 
    });

    elemento.classList.add('pdf-mode');
    window.scrollTo(0, 0);
    
    const opt = {
        margin:       [10, 10, 10, 10],
        filename:     nomeArquivo,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true }, 
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'] }
    };

    setTimeout(() => {
        html2pdf().set(opt).from(elemento).save().then(() => {
            elemento.classList.remove('pdf-mode'); 
            textElements.forEach(el => el.style.display = '');
            const temps = elemento.querySelectorAll('.temp-pdf-text');
            temps.forEach(div => div.remove());
        }).catch(err => {
            console.error("Erro ao gerar PDF:", err);
            elemento.classList.remove('pdf-mode'); 
            textElements.forEach(el => el.style.display = '');
            const temps = elemento.querySelectorAll('.temp-pdf-text');
            temps.forEach(div => div.remove());
            alert("Erro ao gerar o PDF.");
        });
    }, 300);
}

// ==========================================
// 7. CONFIGURAÇÃO FIREBASE E BANCO DE DADOS
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDGF3xMbGKQg0xX_Bwk3pOLfUrDE6anwK0",
    authDomain: "techman-manutencao.firebaseapp.com",
    projectId: "techman-manutencao",
    storageBucket: "techman-manutencao.firebasestorage.app",
    messagingSenderId: "4313866386",
    appId: "1:4313866386:web:004a2ebe70a9e3ec84c64b",
    measurementId: "G-F43KYY7D4Y"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// ==========================================
// 8. GERADORES AUTOMÁTICOS DE NÚMEROS
// ==========================================
async function atualizarNumeroOS() {
    try {
        const osSnapshot = await getDocs(collection(db, "ordens_servico"));
        let maxNumero = 0;
        osSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.numero_os) {
                const partes = data.numero_os.split('/');
                if (partes.length === 2) {
                    const num = parseInt(partes[1], 10);
                    if (num > maxNumero) maxNumero = num;
                }
            }
        });
        const proximoNumero = maxNumero + 1;
        const numeroFormatado = String(proximoNumero).padStart(4, '0');
        const anoAtual = new Date().getFullYear();
        document.getElementById('os-number').innerText = `${anoAtual}/${numeroFormatado}`;
    } catch (error) {
        document.getElementById('os-number').innerText = "2026/0001"; 
    }
}

async function atualizarNumeroPOP() {
    try {
        const popSnapshot = await getDocs(collection(db, "pops"));
        let maxNumero = 0;
        popSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.numero) {
                const num = parseInt(data.numero, 10);
                if (!isNaN(num) && num > maxNumero) maxNumero = num;
            }
        });
        const proximoNumero = maxNumero + 1;
        document.getElementById('pop-numero').value = String(proximoNumero).padStart(3, '0');
    } catch (error) {
        document.getElementById('pop-numero').value = "001"; 
    }
}

async function atualizarNumeroReq() {
    try {
        const reqSnapshot = await getDocs(collection(db, "requisicoes"));
        let maxNumero = 0;
        reqSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.numero) {
                const num = parseInt(data.numero, 10);
                if (!isNaN(num) && num > maxNumero) maxNumero = num;
            }
        });
        const proximoNumero = maxNumero + 1;
        document.getElementById('req-numero').value = String(proximoNumero).padStart(4, '0');
    } catch (error) {
        document.getElementById('req-numero').value = "0001"; 
    }
}

atualizarNumeroOS();
atualizarNumeroPOP();
atualizarNumeroReq();

// ==========================================
// 9. SALVAR DADOS (OS, POP e REQUISIÇÃO)
// ==========================================
document.getElementById('os-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const statusCheck = document.querySelector('input[name="status"]:checked');
    const numeroOS = document.getElementById('os-number').innerText;
    const osData = {
        numero_os: numeroOS,
        cliente: document.getElementById('os-cliente').value,
        data: document.getElementById('os-data').value,
        tecnico: document.getElementById('os-tecnico').value,
        status: statusCheck ? statusCheck.value : 'Não informado'
    };
    gerarPDF('os-document', `OS_${numeroOS.replace('/', '-')}_${osData.cliente}.pdf`);
    try {
        await addDoc(collection(db, "ordens_servico"), osData);
        alert("Ordem de Serviço registrada com sucesso!");
        e.target.reset(); 
        atualizarNumeroOS(); 
    } catch (error) { console.error(error); }
});

document.getElementById('pop-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const tipoPopCheck = document.querySelector('input[name="tipo_pop"]:checked');
    const numeroPOP = document.getElementById('pop-numero').value;
    const popData = {
        tipo: tipoPopCheck ? tipoPopCheck.value : 'Não informado',
        titulo: document.getElementById('pop-titulo').value,
        numero: numeroPOP,
        data: document.getElementById('pop-data-emissao').value
    };
    gerarPDF('pop-document', `POP_${popData.numero}_${popData.titulo}.pdf`);
    try {
        await addDoc(collection(db, "pops"), popData);
        alert("POP registrado com sucesso!");
        e.target.reset(); 
        atualizarNumeroPOP(); 
    } catch (error) { console.error(error); }
});

document.getElementById('req-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const numeroReq = document.getElementById('req-numero').value;
    const reqData = {
        numero: numeroReq,
        setor: document.getElementById('req-setor').value,
        data: document.getElementById('req-data').value
    };
    gerarPDF('req-document', `Requisicao_${reqData.numero}_${reqData.setor}.pdf`);
    try {
        await addDoc(collection(db, "requisicoes"), reqData);
        alert("Requisição registrada com sucesso!");
        e.target.reset(); 
        atualizarNumeroReq(); 
    } catch (error) { console.error(error); }
});

// ==========================================
// 10. CONSULTAR E EXCLUIR REGISTROS
// ==========================================
window.carregarRegistros = async function() {
    const osTableBody = document.getElementById('os-table-body');
    const popTableBody = document.getElementById('pop-table-body');
    const reqTableBody = document.getElementById('req-table-body-consult');
    
    osTableBody.innerHTML = "<tr><td colspan='5'>Carregando...</td></tr>";
    popTableBody.innerHTML = "<tr><td colspan='5'>Carregando...</td></tr>";
    reqTableBody.innerHTML = "<tr><td colspan='4'>Carregando...</td></tr>";

    try {
        const osSnapshot = await getDocs(collection(db, "ordens_servico"));
        osTableBody.innerHTML = ""; 
        osSnapshot.forEach((doc) => {
            const data = doc.data();
            osTableBody.innerHTML += `
                <tr>
                    <td>${data.data || '-'}</td>
                    <td>${data.cliente || '-'}</td>
                    <td>${data.tecnico || '-'}</td>
                    <td>${data.status || '-'}</td>
                    <td style="text-align: center;"><button class="btn-remove" onclick="deletarRegistro('ordens_servico', '${doc.id}')">Excluir</button></td>
                </tr>`;
        });

        const popSnapshot = await getDocs(collection(db, "pops"));
        popTableBody.innerHTML = ""; 
        popSnapshot.forEach((doc) => {
            const data = doc.data();
            popTableBody.innerHTML += `
                <tr>
                    <td>${data.numero || '-'}</td>
                    <td>${data.tipo || '-'}</td>
                    <td>${data.titulo || '-'}</td>
                    <td>${data.data || '-'}</td>
                    <td style="text-align: center;"><button class="btn-remove" onclick="deletarRegistro('pops', '${doc.id}')">Excluir</button></td>
                </tr>`;
        });

        const reqSnapshot = await getDocs(collection(db, "requisicoes"));
        reqTableBody.innerHTML = ""; 
        reqSnapshot.forEach((doc) => {
            const data = doc.data();
            reqTableBody.innerHTML += `
                <tr>
                    <td>${data.numero || '-'}</td>
                    <td>${data.setor || '-'}</td>
                    <td>${data.data || '-'}</td>
                    <td style="text-align: center;"><button class="btn-remove" onclick="deletarRegistro('requisicoes', '${doc.id}')">Excluir</button></td>
                </tr>`;
        });

    } catch (error) {
        console.error("Erro ao buscar registros: ", error);
    }
}

window.deletarRegistro = async function(colecao, idDocumento) {
    if (confirm("Tem certeza que deseja excluir este registro?")) {
        try {
            await deleteDoc(doc(db, colecao, idDocumento));
            alert("Registro excluído com sucesso!");
            carregarRegistros();
        } catch (error) {
            alert("Erro ao excluir o registro.");
        }
    }
}