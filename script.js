// Configuração
const API_BASE_URL = 'https://dcc060-clinica-medica.onrender.com/api';
//const API_BASE_URL = 'http://localhost:3000/api';


// Variáveis globais
let patients = [];
let editingPatientId = null;

// Elementos DOM
const patientsTab = document.getElementById('patients');
const addPatientTab = document.getElementById('add-patient');
const patientsList = document.getElementById('patients-list');
const loading = document.getElementById('loading');
const patientForm = document.getElementById('patient-form');
const editForm = document.getElementById('edit-form');
const editModal = document.getElementById('edit-modal');
const alert = document.getElementById('alert');
const alertMessage = document.getElementById('alert-message');

// Inicializa a aplicação
document.addEventListener('DOMContentLoaded', function () {
    loadPatients();
    setupFormSubmissions();
    setupInputMasks();
});

// Gerenciamento de abas
function showTab(tabName) {
    // Oculta todas as abas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove a classe ativa de todos os botões
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Exibe a aba selecionada
    document.getElementById(tabName).classList.add('active');

    // Adiciona a classe ativa ao botão clicado
    event.target.classList.add('active');

    // Carrega os pacientes se estiver mudando para a aba de pacientes
    if (tabName === 'patients') {
        loadPatients();
    }
}

// Funções da API
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        // Lida com respostas 204 Sem Conteúdo
        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

// Carrega os pacientes da API
async function loadPatients() {
    try {
        showLoading(true);
        patients = await apiRequest('/pacientes');
        renderPatients(patients);
        showAlert('Pacientes carregados com sucesso!', 'success');
    } catch (error) {
        console.error('Error loading patients:', error);
        showAlert(`Erro ao carregar pacientes: ${error.message}`, 'error');
        renderPatients([]);
    } finally {
        showLoading(false);
    }
}

// Renderiza a lista de pacientes
function renderPatients(patientsToRender) {
    const patientsList = document.getElementById('patients-list');

    if (!patientsToRender || patientsToRender.length === 0) {
        patientsList.innerHTML = `
            <div class="no-patients">
                <i class="fas fa-users"></i>
                <p>Nenhum paciente encontrado</p>
                <small>Adicione um novo paciente para começar</small>
            </div>
        `;
        return;
    }

    patientsList.innerHTML = patientsToRender.map(patient => `
        <div class="patient-item">
            <div class="patient-content">
                <span class="patient-name">${patient.nome}</span>
                <div class="patient-actions">
                    <button class="btn-action btn-view" onclick="viewPatientDetails(${patient.id_pessoa})" title="Visualizar">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-edit" onclick="editPatient(${patient.id_pessoa})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deletePatient(${patient.id_pessoa})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Função para exibir os detalhes do paciente em um modal
function viewPatientDetails(id) {
    const patient = patients.find(p => p.id_pessoa === id);
    if (!patient) return;

    // Cria o modal de visualização se não existir
    let viewModal = document.getElementById('view-modal');
    if (!viewModal) {
        viewModal = document.createElement('div');
        viewModal.id = 'view-modal';
        viewModal.className = 'modal';
        document.body.appendChild(viewModal);

        viewModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Detalhes do Paciente</h3>
                    <button class="close-btn" onclick="closeViewModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="patient-view-form">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Nome Completo</label>
                            <div class="view-field" id="view-nome"></div>
                        </div>
                        <div class="form-group">
                            <label>CPF</label>
                            <div class="view-field" id="view-cpf"></div>
                        </div>
                        <div class="form-group">
                            <label>Telefone</label>
                            <div class="view-field" id="view-telefone"></div>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <div class="view-field" id="view-email"></div>
                        </div>
                        <div class="form-group">
                            <label>Data de Nascimento</label>
                            <div class="view-field" id="view-data_nascimento"></div>
                        </div>
                        <div class="form-group">
                            <label>Convênio</label>
                            <div class="view-field" id="view-convenio"></div>
                        </div>
                        <div class="form-group full-width">
                            <label>Endereço</label>
                            <div class="view-field" id="view-endereco"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Preenche os campos com os dados do paciente
    document.getElementById('view-nome').textContent = patient.nome || 'Não informado';
    document.getElementById('view-cpf').textContent = patient.cpf || 'Não informado';
    document.getElementById('view-telefone').textContent = patient.telefone || 'Não informado';
    document.getElementById('view-email').textContent = patient.email || 'Não informado';
    document.getElementById('view-data_nascimento').textContent = patient.data_nascimento ? formatDate(patient.data_nascimento) : 'Não informado';
    document.getElementById('view-convenio').textContent = patient.convenio_nome || patient.id_convenio || 'Não informado';
    document.getElementById('view-endereco').textContent = patient.endereco || 'Não informado';

    // Exibe o modal
    viewModal.style.display = 'block';
}

// Função para formatar data (certifique-se de que existe no seu código)
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Função para fechar o modal (genérica para qualquer modal)
function closeViewModal() {
    const viewModal = document.getElementById('view-modal');
    if (viewModal) {
        viewModal.style.display = 'none';
    }
}

// Filtrar pacientes
function filterPatients() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredPatients = patients.filter(patient =>
        patient.nome.toLowerCase().includes(searchTerm) ||
        patient.cpf.includes(searchTerm) ||
        (patient.email && patient.email.toLowerCase().includes(searchTerm)) ||
        (patient.telefone && patient.telefone.includes(searchTerm))
    );
    renderPatients(filteredPatients);
}

// Criar novo paciente
async function createPatient(patientData) {
    const formattedPatient = {
        ...patientData,
        data_nascimento: formatDateForDB(patientData.data_nascimento)
    };

    try {
        await apiRequest('/pacientes', {
            method: 'POST',
            body: JSON.stringify(formattedPatient)
        });

        showAlert('Paciente criado com sucesso!', 'success');
        resetForm();
        await loadPatients();
        showTab('patients');
    } catch (error) {
        console.error('Error creating patient:', error);
        showAlert(`Erro ao criar paciente: ${error.message}`, 'error');
    }
}

function formatDateForDB(dateString) {
    if (!dateString) return null;

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }

    if (dateString.includes('/')) {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    return dateString;
}

// Editar paciente
function editPatient(id) {
    const patient = patients.find(p => p.id_pessoa === id);
    if (!patient) return;

    editingPatientId = id;

    // Preenche o formulário de edição
    document.getElementById('edit-nome').value = patient.nome || '';
    document.getElementById('edit-cpf').value = patient.cpf || '';
    document.getElementById('edit-telefone').value = patient.telefone || '';
    document.getElementById('edit-email').value = patient.email || '';
    document.getElementById('edit-data_nascimento').value = patient.data_nascimento || '';
    document.getElementById('edit-id_convenio').value = patient.id_convenio || '';
    document.getElementById('edit-endereco').value = patient.endereco || '';

    editModal.style.display = 'block';
}

// Atualizar paciente
async function updatePatient(patientData) {
    try {
        await apiRequest(`/pacientes/${editingPatientId}`, {
            method: 'PUT',
            body: JSON.stringify(patientData)
        });

        showAlert('Paciente atualizado com sucesso!', 'success');
        closeModal();
        await loadPatients();
    } catch (error) {
        console.error('Error updating patient:', error);
        showAlert(`Erro ao atualizar paciente: ${error.message}`, 'error');
    }
}

// Excluir paciente
async function deletePatient(id) {
    const patient = patients.find(p => p.id_pessoa === id);
    if (!patient) return;

    if (!confirm(`Tem certeza que deseja excluir o paciente "${patient.nome}"?`)) {
        return;
    }

    try {
        await apiRequest(`/pacientes/${id}`, {
            method: 'DELETE'
        });

        showAlert('Paciente excluído com sucesso!', 'success');
        await loadPatients();
    } catch (error) {
        console.error('Error deleting patient:', error);
        showAlert(`Erro ao excluir paciente: ${error.message}`, 'error');
    }
}

// Manipulação de formulário
function setupFormSubmissions() {
    patientForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(patientForm);
        const patientData = Object.fromEntries(formData.entries());

        // Remove valores vazios
        Object.keys(patientData).forEach(key => {
            if (patientData[key] === '') {
                delete patientData[key];
            }
        });

        // Converte id_convenio para número, se fornecido
        if (patientData.id_convenio) {
            patientData.id_convenio = parseInt(patientData.id_convenio);
        }

        await createPatient(patientData);
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(editForm);
        const patientData = Object.fromEntries(formData.entries());

        // Remove valores vazios
        Object.keys(patientData).forEach(key => {
            if (patientData[key] === '') {
                delete patientData[key];
            }
        });

        // Converte id_convenio para número, se fornecido
        if (patientData.id_convenio) {
            patientData.id_convenio = parseInt(patientData.id_convenio);
        }

        await updatePatient(patientData);
    });
}

// Máscaras de entrada
function setupInputMasks() {
    // Máscara CPF
    document.querySelectorAll('input[name="cpf"]').forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    });

    // Máscara de telefone
    document.querySelectorAll('input[name="telefone"]').forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = value;
        });
    });
}

// Funções do modal
function closeModal() {
    editModal.style.display = 'none';
    editingPatientId = null;
}

// Fecha o modal ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        closeModal();
    }
});

// Redefinir formulário
function resetForm() {
    patientForm.reset();
}

// Funções utilitárias
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
}

function showAlert(message, type = 'success') {
    alertMessage.textContent = message;
    alert.className = `alert ${type}`;
    alert.style.display = 'flex';

    // Oculta automaticamente após 5 segundos
    setTimeout(hideAlert, 5000);
}

function hideAlert() {
    alert.style.display = 'none';
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Manipula a tecla escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        hideAlert();
    }
});

function openAddPatientModal() {
    document.getElementById('add-patient-modal').style.display = 'block';
}

function closeAddPatientModal() {
    document.getElementById('add-patient-modal').style.display = 'none';
}

// Fechar modal quando clicar fora do conteúdo
window.onclick = function (event) {
    const addModal = document.getElementById('add-patient-modal');
    const editModal = document.getElementById('edit-modal');

    if (event.target == addModal) {
        closeAddPatientModal();
    }
    if (event.target == editModal) {
        closeModal();
    }
}
