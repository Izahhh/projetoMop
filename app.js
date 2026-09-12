// ==========================================
// 1. NAVEGAÇÃO DA SPA
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
// 2. CÁLCULOS DE CONFIABILIDADE (MTBF e MTTR)
// ==========================================
window.calcularMTBF = function() {
    const tempo = parseFloat(document.getElementById('mtbf-tempo').value);
    const falhas = parseFloat(document.getElementById('mtbf-falhas').value);
    const divResultado = document.getElementById('resultado-mtbf');

    if (isNaN(tempo) || isNaN(falhas) || falhas <= 0) {
        divResultado.innerText = "Insira valores válidos (Falhas > 0).";
        return;
    }
    const mtbf = tempo / falhas;
    divResultado.innerText = `MTBF: ${mtbf.toFixed(2)} Horas/Falha`;
}

window.calcularMTTR = function() {
    const tempo = parseFloat(document.getElementById('mttr-tempo').value);
    const falhas = parseFloat(document.getElementById('mttr-falhas').value);
    const divResultado = document.getElementById('resultado-mttr');

    if (isNaN(tempo) || isNaN(falhas) || falhas <= 0) {
        divResultado.innerText = "Insira valores válidos (Falhas > 0).";
        return;
    }
    const mttr = tempo / falhas;
    divResultado.innerText = `MTTR: ${mttr.toFixed(2)} Horas/Falha`;
}

// ==========================================
// 3. GERAÇÃO DE PDF CORRIGIDA
// ==========================================
function gerarPDF(elementoId, nomeArquivo) {
    const elemento = document.getElementById(elementoId);
    
    // Adiciona a classe que limpa o visual para o PDF
    elemento.classList.add('pdf-mode');
    
    // Rola a página para o topo antes de gerar (evita bugs de corte)
    window.scrollTo(0, 0);
    
    const opt = {
        margin:       [10, 10, 10, 10], // Margens: topo, esquerda, baixo, direita (em mm)
        filename:     nomeArquivo,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, 
            scrollX: 0, // <-- ISSO RESOLVE O CORTE NA ESQUERDA
            scrollY: 0, // <-- ISSO RESOLVE O CORTE NO TOPO
            useCORS: true 
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Gera o PDF e depois remove a classe pdf-mode para o site voltar ao normal
    html2pdf().set(opt).from(elemento).save().then(() => {
        elemento.classList.remove('pdf-mode');
    });
}

// ==========================================
// 4. CONFIGURAÇÃO FIREBASE E BANCO DE DADOS
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";
// IMPORTANTE: Adicionado o getDocs para poder ler os dados
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

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
// 5. SALVAR DADOS (OS e POP)
// ==========================================
document.getElementById('os-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const osData = {
        cliente: document.getElementById('os-cliente').value,
        data: document.getElementById('os-data').value,
        tecnico: document.getElementById('os-tecnico').value,
        status: document.querySelector('input[name="status"]:checked').value
    };

    try {
        await addDoc(collection(db, "ordens_servico"), osData);
        alert("Ordem de Serviço registrada com sucesso!");
        gerarPDF('os-document', `OS_${osData.cliente}_${osData.data}.pdf`);
    } catch (error) {
        console.error("Erro ao salvar OS: ", error);
        alert("Erro ao registrar OS.");
    }
});

document.getElementById('pop-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const popData = {
        titulo: document.getElementById('pop-titulo').value,
        numero: document.getElementById('pop-numero').value,
        data: document.getElementById('pop-data-emissao').value
    };

    try {
        await addDoc(collection(db, "pops"), popData);
        alert("POP registrado com sucesso!");
        gerarPDF('pop-document', `POP_${popData.numero}_${popData.titulo}.pdf`);
    } catch (error) {
        console.error("Erro ao salvar POP: ", error);
        alert("Erro ao registrar POP.");
    }
});

// ==========================================
// 6. CONSULTAR REGISTROS NO FIREBASE
// ==========================================
window.carregarRegistros = async function() {
    const osTableBody = document.getElementById('os-table-body');
    const popTableBody = document.getElementById('pop-table-body');
    
    // Mostra mensagem de carregando
    osTableBody.innerHTML = "<tr><td colspan='4'>Carregando dados...</td></tr>";
    popTableBody.innerHTML = "<tr><td colspan='3'>Carregando dados...</td></tr>";

    try {
        // Busca as Ordens de Serviço
        const osSnapshot = await getDocs(collection(db, "ordens_servico"));
        osTableBody.innerHTML = ""; // Limpa a tabela
        osSnapshot.forEach((doc) => {
            const data = doc.data();
            osTableBody.innerHTML += `
                <tr>
                    <td>${data.data || '-'}</td>
                    <td>${data.cliente || '-'}</td>
                    <td>${data.tecnico || '-'}</td>
                    <td>${data.status || '-'}</td>
                </tr>
            `;
        });

        // Busca os POPs
        const popSnapshot = await getDocs(collection(db, "pops"));
        popTableBody.innerHTML = ""; // Limpa a tabela
        popSnapshot.forEach((doc) => {
            const data = doc.data();
            popTableBody.innerHTML += `
                <tr>
                    <td>${data.numero || '-'}</td>
                    <td>${data.titulo || '-'}</td>
                    <td>${data.data || '-'}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Erro ao buscar registros: ", error);
        osTableBody.innerHTML = "<tr><td colspan='4'>Erro ao carregar dados.</td></tr>";
        popTableBody.innerHTML = "<tr><td colspan='3'>Erro ao carregar dados.</td></tr>";
    }
}