// Application State
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
const userProfile = { name: "Ishimwe Isaac" };

// DOM Elements
const balanceEl = document.querySelector('.stat-card.balance h3');
const incomeEl = document.querySelector('.stat-card.income h3');
const expenseEl = document.querySelector('.stat-card.expense h3');
const transactionListEl = document.getElementById('transaction-list');
const transactionForm = document.getElementById('transaction-form');
const addTransactionBtn = document.getElementById('add-transaction-btn');
const modalOverlay = document.getElementById('modal-overlay');
const closeModalBtn = document.getElementById('close-modal');
const modeToggleBtn = document.getElementById('mode-toggle');

// Chart initialization
let expenseChart;

// Initialize App
function init() {
    updateSummary();
    renderTransactions();
    initChart();
}

// Update Summary (Stats)
function updateSummary() {
    const amounts = transactions.map(t => t.amount);
    
    const balance = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
        
    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balanceEl.textContent = `$${balance}`;
    incomeEl.textContent = `$${income}`;
    expenseEl.textContent = `$${expense}`;
    
    updateLocalStorage();
}

// Render Transactions
function renderTransactions() {
    if (transactions.length === 0) {
        transactionListEl.innerHTML = '<div class="empty-state">No transactions yet.</div>';
        return;
    }

    transactionListEl.innerHTML = transactions
        .slice(-10) // Show last 10
        .reverse()
        .map(transaction => `
            <div class="transaction-item ${transaction.amount < 0 ? 'expense' : 'income'}">
                <div class="transaction-info">
                    <p class="desc">${transaction.description}</p>
                    <p class="cat">${transaction.category}</p>
                </div>
                <div class="transaction-value">
                    <p class="amt">${transaction.amount < 0 ? '-' : '+'}$${Math.abs(transaction.amount).toFixed(2)}</p>
                    <button class="delete-btn" onclick="removeTransaction(${transaction.id})"><i data-lucide="trash-2"></i></button>
                </div>
            </div>
        `).join('');
        
    if (window.lucide) {
        lucide.initIcons();
    }
}

// Add Transaction
function addTransaction(e) {
    e.preventDefault();

    const desc = document.getElementById('description').value;
    const amountVal = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;

    const amount = type === 'expense' ? -amountVal : amountVal;

    const newTransaction = {
        id: Math.floor(Math.random() * 1000000),
        description: desc,
        amount: amount,
        category: category,
        date: new Date().toISOString()
    };

    transactions.push(newTransaction);
    
    init();
    transactionForm.reset();
    closeModal();
}

// Remove Transaction
window.removeTransaction = function(id) {
    transactions = transactions.filter(t => t.id !== id);
    init();
    updateChart();
};

// Local Storage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Modal Logic
function openModal() {
    modalOverlay.classList.remove('hidden');
}

function closeModal() {
    modalOverlay.classList.add('hidden');
}

// Chart Logic
function initChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    
    const categories = ['Food', 'Rent', 'Transport', 'Entertainment', 'Other'];
    const data = categories.map(cat => {
        return transactions
            .filter(t => t.category === cat && t.amount < 0)
            .reduce((acc, t) => acc + Math.abs(t.amount), 0);
    });

    expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#6b7280'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#9ca3af',
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            cutout: '70%'
        }
    });
}

function updateChart() {
    if (!expenseChart) return;
    
    const categories = ['Food', 'Rent', 'Transport', 'Entertainment', 'Other'];
    const data = categories.map(cat => {
        return transactions
            .filter(t => t.category === cat && t.amount < 0)
            .reduce((acc, t) => acc + Math.abs(t.amount), 0);
    });
    
    expenseChart.data.datasets[0].data = data;
    expenseChart.update();
}

// Mode Toggle
modeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    modeToggleBtn.innerHTML = isDark ? '<i data-lucide="moon"></i> <span>Dark Mode</span>' : '<i data-lucide="sun"></i> <span>Light Mode</span>';
    lucide.initIcons();
});

// Event Listeners
addTransactionBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
transactionForm.addEventListener('submit', addTransaction);

// Initial Load
document.addEventListener('DOMContentLoaded', init);
// Add transaction logic refinement
// Chart JS integration
// Persistence logic
// Modal focus logic
// Export function placeholder
// Final UI polish
// Update 2026-03-27 sequence 1
// Update 2026-03-27 sequence 2
// Update 2026-03-27 sequence 3
// Update 2026-03-27 sequence 4
// Update 2026-03-27 sequence 5
// Update 2026-03-27 sequence 6
// Update 2026-03-27 sequence 7
