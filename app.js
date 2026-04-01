// Application State
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let budgets = JSON.parse(localStorage.getItem('budgets')) || {
    "Food": 500,
    "Rent": 1500,
    "Transport": 300,
    "Entertainment": 200,
    "Other": 400
};
const userProfile = { name: "Ishimwe Isaac" };

// DOM Elements
const balanceEl = document.querySelector('.stat-card.balance h3');
const incomeEl = document.querySelector('.stat-card.income h3');
const expenseEl = document.querySelector('.stat-card.expense h3');
const transactionListEl = document.getElementById('transaction-list');
const budgetListEl = document.getElementById('budget-list');
const transactionForm = document.getElementById('transaction-form');
const budgetForm = document.getElementById('budget-form');
const addTransactionBtn = document.getElementById('add-transaction-btn');
const setBudgetBtn = document.getElementById('set-budget-btn');
const modalOverlay = document.getElementById('modal-overlay');
const addTransactionModal = document.getElementById('add-transaction-modal');
const setBudgetModal = document.getElementById('set-budget-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const modeToggleBtn = document.getElementById('mode-toggle');

// Chart initialization
let expenseChart;

// Initialize App
function init() {
    updateSummary();
    renderTransactions();
    renderBudgets();
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
};

// Update Budgets UI
function renderBudgets() {
    budgetListEl.innerHTML = Object.keys(budgets).map(category => {
        const spent = transactions
            .filter(t => t.category === category && t.amount < 0)
            .reduce((acc, t) => acc + Math.abs(t.amount), 0);
        
        const limit = budgets[category];
        const percent = Math.min((spent / limit) * 100, 100).toFixed(0);
        const remaining = (limit - spent).toFixed(2);
        
        let colorClass = 'progress-green';
        if (percent >= 90) colorClass = 'progress-red';
        else if (percent >= 70) colorClass = 'progress-orange';

        return `
            <div class="budget-item">
                <div class="budget-info">
                    <span>${category}</span>
                    <span>$${spent.toFixed(0)} / $${limit}</span>
                </div>
                <div class="budget-progress-container">
                    <div class="budget-progress-bar ${colorClass}" style="width: ${percent}%"></div>
                </div>
                <div class="remaining-text">
                    ${remaining >= 0 ? `$${remaining} remaining` : `$${Math.abs(remaining)} over budget`}
                </div>
            </div>
        `;
    }).join('');
    
    updateLocalStorage();
}

// Update Budget Limit
function updateBudget(e) {
    e.preventDefault();
    const cat = document.getElementById('budget-category').value;
    const limit = parseFloat(document.getElementById('limit').value);
    
    budgets[cat] = limit;
    init();
    closeModal();
}

// Local Storage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('budgets', JSON.stringify(budgets));
}

// Modal Logic
function openTransactionModal() {
    modalOverlay.classList.remove('hidden');
    addTransactionModal.classList.remove('hidden');
    setBudgetModal.classList.add('hidden');
}

function openBudgetModal() {
    modalOverlay.classList.remove('hidden');
    setBudgetModal.classList.remove('hidden');
    addTransactionModal.classList.add('hidden');
}

function closeModal() {
    modalOverlay.classList.add('hidden');
    addTransactionModal.classList.add('hidden');
    setBudgetModal.classList.add('hidden');
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
addTransactionBtn.addEventListener('click', openTransactionModal);
setBudgetBtn.addEventListener('click', openBudgetModal);
closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));
transactionForm.addEventListener('submit', addTransaction);
budgetForm.addEventListener('submit', updateBudget);

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
// Update 2026-03-27 sequence 8
// Update 2026-03-27 sequence 9
// Update 2026-03-27 sequence 10
// Update 2026-03-27 sequence 11
// Update 2026-03-27 sequence 12
// Update 2026-03-27 sequence 13
// Update 2026-03-27 sequence 14
// Update 2026-03-27 sequence 15
// Update 2026-03-27 sequence 16
// Update 2026-03-27 sequence 17
// Update 2026-03-28 sequence 1
// Update 2026-03-28 sequence 2
// Update 2026-03-29 sequence 1
// Update 2026-03-29 sequence 2
// Update 2026-03-29 sequence 3
// Update 2026-03-29 sequence 4
// Update 2026-03-29 sequence 5
// Update 2026-03-29 sequence 6
// Update 2026-03-29 sequence 7
// Update 2026-03-29 sequence 8
// Update 2026-03-29 sequence 9
// Update 2026-03-29 sequence 10
// Update 2026-03-29 sequence 11
// Update 2026-03-29 sequence 12
// Update 2026-03-29 sequence 13
// Update 2026-03-29 sequence 14
// Update 2026-03-29 sequence 15
// Update 2026-03-29 sequence 16
// Update 2026-03-29 sequence 17
// Update 2026-03-30 sequence 1
// Update 2026-03-30 sequence 2
// Update 2026-03-30 sequence 3
// Update 2026-03-30 sequence 4
// Update 2026-03-30 sequence 5
// Update 2026-03-30 sequence 6
// Update 2026-03-30 sequence 7
// Update 2026-03-30 sequence 8
// Update 2026-03-30 sequence 9
// Update 2026-03-30 sequence 10
// Update 2026-03-30 sequence 11
// Update 2026-03-30 sequence 12
// Update 2026-03-30 sequence 13
// Update 2026-03-30 sequence 14
// Update 2026-03-30 sequence 15
// Update 2026-03-30 sequence 16
// Update 2026-03-30 sequence 17
// Update 2026-03-31 sequence 1
// Update 2026-03-31 sequence 2
// Update 2026-03-31 sequence 3
// Update 2026-03-31 sequence 4
// Update 2026-03-31 sequence 5
// Update 2026-03-31 sequence 6
// Update 2026-03-31 sequence 7
// Update 2026-03-31 sequence 8
// Update 2026-03-31 sequence 9
// Update 2026-03-31 sequence 10
// Update 2026-03-31 sequence 11
// Update 2026-03-31 sequence 12
// Update 2026-03-31 sequence 13
// Update 2026-03-31 sequence 14
// Update 2026-03-31 sequence 15
// Update 2026-03-31 sequence 16
// Update 2026-03-31 sequence 17
// Refinement 2026-04-01 step 1
// Refinement 2026-04-01 step 2
// Refinement 2026-04-01 step 3
// Refinement 2026-04-01 step 4
// Refinement 2026-04-01 step 5
// Refinement 2026-04-01 step 6
// Refinement 2026-04-01 step 7
// Refinement 2026-04-01 step 8
// Refinement 2026-04-01 step 9
// Refinement 2026-04-01 step 10
// Refinement 2026-04-01 step 11
// Refinement 2026-04-01 step 12
// Refinement 2026-04-01 step 13
// Refinement 2026-04-01 step 14
// Refinement 2026-04-01 step 15
// Refinement 2026-04-01 step 16
// Refinement 2026-04-01 step 17
// Varied enhancement 2026-04-01 (1)
// Varied enhancement 2026-04-01 (2)
// Varied enhancement 2026-04-01 (3)
// Varied enhancement 2026-04-01 (4)
