// 初始化應用
class BloodPressureApp {
    constructor() {
        this.records = this.loadRecords();
        this.form = document.getElementById('bloodPressureForm');
        this.recordsList = document.getElementById('recordsList');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.successMessage = document.getElementById('successMessage');

        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.clearAllBtn.addEventListener('click', () => this.clearAllRecords());
        this.render();
    }

    handleSubmit(e) {
        e.preventDefault();

        const record = {
            id: Date.now(),
            systolic: document.getElementById('systolic').value,
            diastolic: document.getElementById('diastolic').value,
            pulse: document.getElementById('pulse').value,
            medication: document.getElementById('medication').value,
            notes: document.getElementById('notes').value,
            timestamp: new Date()
        };

        this.records.unshift(record);
        this.saveRecords();
        this.form.reset();
        this.showSuccessMessage();
        this.render();
    }

    deleteRecord(id) {
        if (confirm('確認要刪除此記錄嗎？')) {
            this.records = this.records.filter(r => r.id !== id);
            this.saveRecords();
            this.render();
        }
    }

    clearAllRecords() {
        if (confirm('確認要清除所有記錄嗎？此操作無法復原。')) {
            this.records = [];
            this.saveRecords();
            this.render();
        }
    }

    formatDateTime(date) {
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    getMedicationLabel(medication) {
        const labels = {
            'none': '無',
            'yes': '已服藥',
            'no': '未服藥'
        };
        return labels[medication] || medication;
    }

    getMedicationClass(medication) {
        const classes = {
            'none': 'medication-none',
            'yes': 'medication-yes',
            'no': 'medication-no'
        };
        return classes[medication] || '';
    }

    render() {
        if (this.records.length === 0) {
            this.recordsList.innerHTML = '<div class="empty-message">還沒有任何記錄，開始新增吧！</div>';
            this.clearAllBtn.style.display = 'none';
            return;
        }

        this.clearAllBtn.style.display = 'block';

        this.recordsList.innerHTML = this.records.map(record => `
            <div class="record-item">
                <div class="record-header">
                    <span class="record-time">📅 ${this.formatDateTime(record.timestamp)}</span>
                    <button class="delete-btn" onclick="app.deleteRecord(${record.id})">刪除</button>
                </div>
                <div class="record-blood-pressure">
                    ${record.systolic} / ${record.diastolic} mmHg
                </div>
                <div class="record-details">
                    <div class="record-detail">
                        <strong>脈搏：</strong>${record.pulse} 次/分
                    </div>
                    <div class="record-detail">
                        <strong>用藥：</strong>
                        <span class="record-medication ${this.getMedicationClass(record.medication)}">
                            ${this.getMedicationLabel(record.medication)}
                        </span>
                    </div>
                </div>
                ${record.notes ? `
                    <div class="record-notes">
                        <strong>備註：</strong>${record.notes}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    showSuccessMessage() {
        this.successMessage.style.display = 'block';
        setTimeout(() => {
            this.successMessage.style.display = 'none';
        }, 2000);
    }

    saveRecords() {
        localStorage.setItem('bloodPressureRecords', JSON.stringify(this.records));
    }

    loadRecords() {
        const stored = localStorage.getItem('bloodPressureRecords');
        return stored ? JSON.parse(stored) : [];
    }
}

// 應用啟動
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new BloodPressureApp();
});
