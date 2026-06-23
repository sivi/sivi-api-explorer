import React, { useState, useRef, useEffect } from 'react';
import './index.css';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'favorites', label: 'Favorites' },
];

export default function HistoryDropdown({
  history,
  selectedHistoryId,
  formatHistoryLabel,
  onSelect,
  onUpdate,
  onDelete,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [sortAsc, setSortAsc] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setEditingId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredHistory = React.useMemo(() => {
    let items = activeTab === 'favorites'
      ? history.filter((item) => item.isFavorite)
      : [...history];

    items.sort((a, b) => {
      const aTime = new Date(a.timestamp).getTime();
      const bTime = new Date(b.timestamp).getTime();
      return sortAsc ? aTime - bTime : bTime - aTime;
    });

    return items;
  }, [history, activeTab, sortAsc]);

  const selectedItem = history.find((item) => item.id === selectedHistoryId);

  const handleSelect = (item) => {
    onSelect(item.id);
    setIsOpen(false);
    setEditingId(null);
  };

  const handleToggleFavorite = async (e, item) => {
    e.stopPropagation();
    await onUpdate(item.id, { isFavorite: !item.isFavorite });
  };

  const handleStartEdit = (e, item) => {
    e.stopPropagation();
    setEditingId(item.id);
    setEditValue(item.name || item.prompt || '');
  };

  const handleConfirmEdit = async (e, item) => {
    e.stopPropagation();
    if (editValue.trim()) {
      await onUpdate(item.id, { name: editValue.trim() });
    }
    setEditingId(null);
  };

  const handleDelete = async (e, item) => {
    e.stopPropagation();
    await onDelete(item.id);
    if (selectedHistoryId === item.id) {
      onSelect('');
    }
  };

  const displayLabel = selectedItem
    ? (selectedItem.name || selectedItem.prompt || 'History item')
    : 'History';

  return (
    <div className="history-dropdown" ref={containerRef}>
      <button
        className="history-dropdown-trigger"
        onClick={() => setIsOpen((o) => !o)}
        title="Open history"
      >
        <span className="history-trigger-text">{displayLabel}</span>
        <span className={`history-trigger-chevron ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="history-dropdown-panel">
          <div className="history-panel-header">
            <div className="history-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={`history-tab ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                  {tab.key === 'all' && (
                    <span className="history-tab-count">{history.length}</span>
                  )}
                  {tab.key === 'favorites' && (
                    <span className="history-tab-count">
                      {history.filter((i) => i.isFavorite).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button
              className="history-sort-btn"
              onClick={() => setSortAsc((s) => !s)}
              title={sortAsc ? 'Oldest first' : 'Newest first'}
            >
              {sortAsc ? '↑' : '↓'}
            </button>
          </div>

          <div className="history-list">
            {filteredHistory.length === 0 && (
              <div className="history-empty">
                {activeTab === 'favorites'
                  ? 'No favorites yet. Star an item to add it here.'
                  : 'No history yet. Run a flow to see items here.'}
              </div>
            )}

            {filteredHistory.map((item) => {
              const isSelected = item.id === selectedHistoryId;
              const isEditing = editingId === item.id;
              const label = formatHistoryLabel(item);

              return (
                <div
                  key={item.id}
                  className={`history-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(item)}
                >
                  <div className="history-item-content">
                    {isEditing ? (
                      <div className="history-item-edit-row">
                        <input
                          className="history-item-edit-input"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleConfirmEdit(e, item);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                        <button
                          className="history-item-icon history-item-confirm"
                          onClick={(e) => handleConfirmEdit(e, item)}
                          title="Save name"
                        >
                          ✓
                        </button>
                      </div>
                    ) : (
                      <div className="history-item-text" title={label}>
                        {item.name || item.prompt || 'No prompt'}
                      </div>
                    )}
                    <div className="history-item-meta">
                      {`${item.dimensions.width}x${item.dimensions.height}`} · {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <div className="history-item-actions">
                    <button
                      className={`history-item-icon ${item.isFavorite ? 'active' : ''}`}
                      onClick={(e) => handleToggleFavorite(e, item)}
                      title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {item.isFavorite ? '★' : '☆'}
                    </button>
                    <button
                      className="history-item-icon"
                      onClick={(e) => handleStartEdit(e, item)}
                      title="Edit name"
                    >
                      ✎
                    </button>
                    <button
                      className="history-item-icon history-item-delete"
                      onClick={(e) => handleDelete(e, item)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
