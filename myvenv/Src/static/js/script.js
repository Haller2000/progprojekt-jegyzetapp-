
let notes = [];
let categories = ['Általános', 'Munka', 'Tanulás', 'Ötletek'];
let currentNoteId = null;
let currentCategory = 'all';


document.addEventListener('DOMContentLoaded', function() {
    updateCategoryButtons();
    updateCategorySelect();
    renderNotes();
});

function updateCategoryButtons() {
    const navbar = document.getElementById('navbar');
    const addBtn = navbar.querySelector('.add-category-btn');


    navbar.querySelectorAll('.category-btn').forEach(btn => btn.remove());


    const allBtn = document.createElement('button');
    allBtn.className = 'category-btn' + (currentCategory === 'all' ? ' active' : '');
    allBtn.textContent = 'Összes';
    allBtn.dataset.category = 'all';
    allBtn.onclick = () => filterByCategory('all');

    navbar.insertBefore(allBtn, addBtn);


    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn' + (currentCategory === category ? ' active' : '');
        btn.textContent = category;
        btn.dataset.category = category;
        btn.onclick = () => filterByCategory(category);
        navbar.insertBefore(btn, addBtn);
    });
}


function updateCategorySelect() {
    const select = document.getElementById('note-category');
    select.innerHTML = '<option value="">Válassz kategóriát</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
}

function filterByCategory(category) {
    currentCategory = category;
    updateCategoryButtons();
    renderNotes();
}

function renderNotes() {
    const container = document.getElementById('notes-container');
    const emptyState = document.getElementById('empty-state');

    let filteredNotes = notes;
    if (currentCategory !== 'all') {
        filteredNotes = notes.filter(note => note.category === currentCategory);
    }

    if (filteredNotes.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    container.style.display = 'grid';
    emptyState.style.display = 'none';

    container.innerHTML = filteredNotes.map(note => `
        <div class="note-card">
            <div class="note-category">${note.category}</div>
            <h3 class="note-title">${escapeHtml(note.title)}</h3>
            <div class="note-date">${formatDate(note.date)}</div>
            <div class="note-content">${escapeHtml(note.content)}</div>
            <div class="note-actions">
                <button class="note-btn edit-btn" onclick="editNote(${note.id})">Szerkesztés</button>
                <button class="note-btn delete-btn" onclick="deleteNote(${note.id})">Törlés</button>
            </div>
        </div>
    `).join('');
}

function openNoteModal(noteId = null) {
    const modal = document.getElementById('note-modal');
    const title = document.getElementById('note-modal-title');
    const form = document.getElementById('note-form');

    currentNoteId = noteId;

    if (noteId) {
        const note = notes.find(n => n.id === noteId);
        title.textContent = 'Jegyzet szerkesztése';
        document.getElementById('note-title').value = note.title;
        document.getElementById('note-content').value = note.content;
        document.getElementById('note-category').value = note.category;
    } else {
        title.textContent = 'Új jegyzet';
        form.reset();
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeNoteModal() {
    document.getElementById('note-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
    currentNoteId = null;
}

function openCategoryModal() {
    document.getElementById('category-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCategoryModal() {
    document.getElementById('category-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

document.getElementById('note-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    const category = document.getElementById('note-category').value;

    if (currentNoteId) {
        const note = notes.find(n => n.id === currentNoteId);
        note.title = title;
        note.content = content;
        note.category = category;
        note.date = new Date();
    } else {
        const newNote = {
            id: Date.now(),
            title,
            content,
            category,
            date: new Date()
        };
        notes.unshift(newNote);
    }

    renderNotes();
    closeNoteModal();
});

document.getElementById('category-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const categoryName = document.getElementById('category-name').value.trim();

    if (categoryName && !categories.includes(categoryName)) {
        categories.push(categoryName);
        updateCategoryButtons();
        updateCategorySelect();
        closeCategoryModal();
        document.getElementById('category-form').reset();
    }
});

function editNote(id) {
    openNoteModal(id);
}

function deleteNote(id) {
    if (confirm('Biztosan törölni szeretnéd ezt a jegyzetet?')) {
        notes = notes.filter(note => note.id !== id);
        renderNotes();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(date) {
    return new Intl.DateTimeFormat('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentNoteId = null;
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal[style*="block"]');
        if (openModal) {
            openModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            currentNoteId = null;
        }
    }
});