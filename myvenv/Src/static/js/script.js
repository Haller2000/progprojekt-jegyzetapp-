
let notes = [];
let categories = ['Általános', 'Munka', 'Tanulás', 'Ötletek'];
let currentNoteId = null;
let currentCategory = 'all';

// Jegyzetek betöltése a localStorage-ből
function loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    }
}

// Jegyzetek mentése a localStorage-be
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Jegyzet törlése a localStorage-ből
function deleteNoteFromStorage(noteId) {
    notes = notes.filter(note => note.id !== noteId);
    saveNotes();
    renderNotes();
}

// Jegyzet szerkesztése a localStorage-ben
function editNoteInStorage(noteId, title, content, category) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        note.title = title;
        note.content = content;
        note.category = category;
        note.date = new Date();
        saveNotes();
        renderNotes();
    }
}

// Jegyzetek betöltése a localStorage-ból
function loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    }
}

// Jegyzetek mentése a localStorage-be
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Jegyzet törlése a localStorage-ból
function deleteNoteFromStorage(noteId) {
    notes = notes.filter(note => note.id !== noteId);
    saveNotes();
    renderNotes();
}

// Jegyzet szerkesztése a localStorage-ben
function editNoteInStorage(noteId, title, content, category) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        note.title = title;
        note.content = content;
        note.category = category;
        note.date = new Date();
        saveNotes();
        renderNotes();
    }
}

document.addEventListener('DOMContentLoaded', function() {
  // Kategóriák beolvasása
  categories = ['Általános', 'Munka', 'Tanulás', 'Ötletek'];
  updateCategoryButtons();
  updateCategorySelect();
  
  // Jegyzetek beolvasása
  loadNotes();
});

// Jegyzetek kezelése
async function betoltJegyzetek() {
    try {
        const response = await fetch('/jegyzetek/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        });
        const jegyzetek = await response.json();
        frissitJegyzetLista(jegyzetek);
    } catch (error) {
        console.error('Hiba a jegyzetek betöltése során:', error);
    }
}

function frissitJegyzetLista(jegyzetek) {
    const jegyzetLista = document.getElementById('jegyzet-lista');
    jegyzetLista.innerHTML = '';

    jegyzetek.forEach(jegyzet => {
        const jegyzetDiv = document.createElement('div');
        jegyzetDiv.className = 'jegyzet';
        jegyzetDiv.innerHTML = `
            <h3>${jegyzet.cim}</h3>
            <p><strong>Kategória:</strong> ${jegyzet.kategoria}</p>
            <p><strong>Dátum:</strong> ${jegyzet.datum}</p>
            <p>${jegyzet.tartalom}</p>
            <div class="note-actions">
                <button class="note-btn edit-btn" onclick="editNote(${jegyzet.id})">Szerkesztés</button>
                <button class="note-btn delete-btn" onclick="torolJegyzet(${jegyzet.id})">Törlés</button>
            </div>
        `;
        jegyzetLista.appendChild(jegyzetDiv);
    });
}

async function ujJegyzet(cim, tartalom, kategoria) {
    try {
        const response = await fetch('/jegyzetek/letrehoz/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: new URLSearchParams({
                cim: cim,
                tartalom: tartalom,
                kategoria: kategoria
            })
        });
        const data = await response.json();
        if (data.status === 'success') {
            betoltJegyzetek();
        } else {
            alert('Hiba történt a jegyzet létrehozása során!');
        }
    } catch (error) {
        console.error('Hiba a jegyzet létrehozása során:', error);
        alert('Hiba történt a jegyzet létrehozása során!');
    }
}

async function torolJegyzet(jegyzetId) {
    if (!confirm('Biztosan törölni szeretnéd ezt a jegyzetet?')) {
        return;
    }

    try {
        const response = await fetch(`/jegyzetek/${jegyzetId}/torol/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        });
        const data = await response.json();
        if (data.status === 'success') {
            betoltJegyzetek();
        } else {
            alert('Hiba történt a jegyzet törlése során!');
        }
    } catch (error) {
        console.error('Hiba a jegyzet törlése során:', error);
        alert('Hiba történt a jegyzet törlése során!');
    }
}

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

// ...

document.getElementById('note-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const title = document.getElementById('note-title').value;
  const content = document.getElementById('note-content').value;
  const category = document.getElementById('note-category').value;

  if (title && content && category) {
    createNote(title, content, category);
    closeNoteModal();
  } else {
    alert('Kérlek, töltse ki minden mezőt!');
  }
});

function editNote(id) {
  openNoteModal(id);
}

function deleteNote(id) {
  if (confirm('Biztosan törölni szeretnéd ezt a jegyzetet?')) {
    deleteNoteFromStorage(id);
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

function openEditCategoriesModal() {
  document.getElementById('edit-categories-modal').style.display = 'block';
  document.body.style.overflow = 'hidden';
  renderCategoryEditList();
}

function closeEditCategoriesModal() {
  document.getElementById('edit-categories-modal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function renderCategoryEditList() {
  const container = document.getElementById('category-edit-list');

  container.innerHTML = categories.map((category, index) => `
  <div class="category-edit-item" data-index="${index}">
    <input type="text" class="category-edit-input" value="${escapeHtml(category)}"
           id="category-input-${index}" data-original="${escapeHtml(category)}">
    <div class="category-edit-actions">
      <button class="category-edit-btn category-save-btn" onclick="saveCategoryEdit(${index})"
              title="Mentés" style="display: none;">✓</button>
      <button class="category-edit-btn category-cancel-btn" onclick="cancelCategoryEdit(${index})"
              title="Mégse" style="display: none;">✕</button>
      <button class="category-edit-btn category-delete-btn" onclick="deleteCategory(${index})"
              title="Törlés">🗑</button>
    </div>
  </div>
  `).join('');

  container.querySelectorAll('.category-edit-input').forEach(input => {
    input.addEventListener('input', function() {
      const index = parseInt(this.id.split('-')[2]);
      const original = this.dataset.original;
      const current = this.value.trim();

      const saveBtn = this.parentElement.querySelector('.category-save-btn');
      const cancelBtn = this.parentElement.querySelector('.category-cancel-btn');

      if (current !== original && current !== '') {
        saveBtn.style.display = 'flex';
        cancelBtn.style.display = 'flex';
      } else {
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
      }
    });

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const index = parseInt(this.id.split('-')[2]);
        saveCategoryEdit(index);
      } else if (e.key === 'Escape') {
        const index = parseInt(this.id.split('-')[2]);
        cancelCategoryEdit(index);
      }
    });
  });
}

function saveCategoryEdit(index) {
  const input = document.getElementById(`category-input-${index}`);
  const newName = input.value.trim();
  const originalName = categories[index];

  if (newName === '' || newName === originalName) {
    cancelCategoryEdit(index);
    return;
  }

  if (categories.includes(newName)) {
    alert('Ez a kategória már létezik!');
    return;
  }

  categories[index] = newName;

  notes.forEach(note => {
    if (note.category === originalName) {
      note.category = newName;
    }
  });

  if (currentCategory === originalName) {
    currentCategory = newName;
  }

  updateCategoryButtons();
  updateCategorySelect();
  renderNotes();
  renderCategoryEditList();
}

function cancelCategoryEdit(index) {
  const input = document.getElementById(`category-input-${index}`);
  const originalName = input.dataset.original;

  input.value = originalName;

  const saveBtn = input.parentElement.querySelector('.category-save-btn');
  const cancelBtn = input.parentElement.querySelector('.category-cancel-btn');

  saveBtn.style.display = 'none';
  cancelBtn.style.display = 'none';
}

function deleteCategory(index) {
  const categoryName = categories[index];
  const notesInCategory = notes.filter(note => note.category === categoryName);

  let confirmMessage = `Biztosan törölni szeretnéd a "${categoryName}" kategóriát?`;
  if (notesInCategory.length > 0) {
    confirmMessage += `\n\nEz a kategória ${notesInCategory.length} jegyzetet tartalmaz. Ezek a jegyzetek "Általános" kategóriába kerülnek.`;
  }

  if (confirm(confirmMessage)) {

    notes.forEach(note => {
      if (note.category === categoryName) {
        note.category = 'Általános';
      }
    });

    categories.splice(index, 1);

    if (currentCategory === categoryName) {
      currentCategory = 'all';
    }

    updateCategoryButtons();
    updateCategorySelect();
    renderNotes();
    renderCategoryEditList();
  }
}

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
