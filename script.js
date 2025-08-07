// Configuration
const API_BASE_URL = 'https://dcc060-clinica-medica.onrender.com/api';

// Global variables
let patients = [];
let editingPatientId = null;

// DOM Elements
const patientsTab = document.getElementById('patients');
const addPatientTab = document.getElementById('add-patient');
const patientsList = document.getElementById('patients-list');
const loading = document.getElementById('loading');
const patientForm = document.getElementById('patient-form');
const editForm = document.getElementById('edit-form');
const editModal = document.getElementById('edit-modal');
const alert = document.getElementById('alert');
const alertMessage = document.getElementById('alert-message');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    loadPatients();
    setupFormSubmissions();
    setupInputMasks();
});

// Tab Management
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load patients if switching to patients tab
    if (tabName === 'patients') {
        loadPatients();
    }
}

// API Functions
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
        
        // Handle 204 No Content responses
        if (response.status === 204) {
            return null;
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

// Load patients from API
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

// Render patients list
function renderPatients(patientsToRender) {
    if (!patientsToRender || patientsToRender.length === 0) {
        patientsList.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.3;"></i>
                <p style="font-size: 1.1rem;">Nenhum paciente encontrado</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">Adicione um novo paciente para começar</p>
            </div>
        `;
        return;
    }
    
    patientsList.innerHTML = patientsToRender.map(patient => `
        <div class="patient-card" data-id="${patient.id_pessoa}">
            <div class="patient-header">
                <h3 class="patient-name">${patient.nome}</h3>
                <div class="patient-actions">
                    <button class="btn-icon btn-edit" onclick="editPatient(${patient.id_pessoa})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deletePatient(${patient.id_pessoa})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="patient-info">
                <div class="patient-field">
                    <i class="fas fa-id-card"></i>
                    <span>CPF: ${patient.cpf}</span>
                </div>
                ${patient.telefone ? `
                    <div class="patient-field">
                        <i class="fas fa-phone"></i>
                        <span>${patient.telefone}</span>
                    </div>
                ` : ''}
                ${patient.email ? `
                    <div class="patient-field">
                        <i class="fas fa-envelope"></i>
                        <span>${patient.email}</span>
                    </div>
                ` : ''}
                <div class="patient-field">
                    <i class="fas fa-birthday-cake"></i>
                    <span>Nascimento: ${formatDate(patient.data_nascimento)}</span>
                </div>
                ${patient.convenio_nome ? `
                    <div class="patient-field">
                        <i class="fas fa-heart"></i>
                        <span>Convênio: ${patient.convenio_nome}</span>
                    </div>
                ` : ''}
                ${patient.endereco ? `
                    <div class="patient-field">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${patient.endereco}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Filter patients
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

// Create new patient
async function createPatient(patientData) {
    try {
        await apiRequest('/pacientes', {
            method: 'POST',
            body: JSON.stringify(patientData)
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

// Edit patient
function editPatient(id) {
    const patient = patients.find(p => p.id_pessoa === id);
    if (!patient) return;
    
    editingPatientId = id;
    
    // Populate edit form
    document.getElementById('edit-nome').value = patient.nome || '';
    document.getElementById('edit-cpf').value = patient.cpf || '';
    document.getElementById('edit-telefone').value = patient.telefone || '';
    document.getElementById('edit-email').value = patient.email || '';
    document.getElementById('edit-data_nascimento').value = patient.data_nascimento || '';
    document.getElementById('edit-id_convenio').value = patient.id_convenio || '';
    document.getElementById('edit-endereco').value = patient.endereco || '';
    
    editModal.style.display = 'block';
}

// Update patient
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

// Delete patient
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

// Form handling
function setupFormSubmissions() {
    patientForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(patientForm);
        const patientData = Object.fromEntries(formData.entries());
        
        // Clean up empty values
        Object.keys(patientData).forEach(key => {
            if (patientData[key] === '') {
                delete patientData[key];
            }
        });
        
        // Convert id_convenio to number if provided
        if (patientData.id_convenio) {
            patientData.id_convenio = parseInt(patientData.id_convenio);
        }
        
        await createPatient(patientData);
    });
    
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(editForm);
        const patientData = Object.fromEntries(formData.entries());
        
        // Clean up empty values
        Object.keys(patientData).forEach(key => {
            if (patientData[key] === '') {
                delete patientData[key];
            }
        });
        
        // Convert id_convenio to number if provided
        if (patientData.id_convenio) {
            patientData.id_convenio = parseInt(patientData.id_convenio);
        }
        
        await updatePatient(patientData);
    });
}

// Input masks
function setupInputMasks() {
    // CPF mask
    document.querySelectorAll('input[name="cpf"]').forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    });
    
    // Phone mask
    document.querySelectorAll('input[name="telefone"]').forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = value;
        });
    });
}

// Modal functions
function closeModal() {
    editModal.style.display = 'none';
    editingPatientId = null;
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        closeModal();
    }
});

// Reset form
function resetForm() {
    patientForm.reset();
}

// Utility functions
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
}

function showAlert(message, type = 'success') {
    alertMessage.textContent = message;
    alert.className = `alert ${type}`;
    alert.style.display = 'flex';
    
    // Auto hide after 5 seconds
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

// Handle escape key
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
window.onclick = function(event) {
    const addModal = document.getElementById('add-patient-modal');
    const editModal = document.getElementById('edit-modal');
    
    if (event.target == addModal) {
        closeAddPatientModal();
    }
    if (event.target == editModal) {
        closeModal();
    }
}
