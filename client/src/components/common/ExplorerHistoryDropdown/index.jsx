import React, { useState, useRef, useEffect } from 'react';
import './index.css';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'favorites', label: 'Like' },
  { key: 'disliked', label: 'Dislike' },
];

export default function ExplorerHistoryDropdown({
  history,
  selectedHistoryId,
  formatHistoryLabel,
  onSelect,
  onUpdate,
  onDelete,
  filterBId,
  filterFlowKey,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

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

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const baseFilteredHistory = React.useMemo(() => {
    let items = [...history];

    // bId filter
    if (filterBId && filterBId !== 'auto') {
      items = items.filter((item) => (item.bId || 'auto') === filterBId);
    }

    // flowKey filter
    if (filterFlowKey && filterFlowKey !== 'auto') {
      items = items.filter((item) => item.flowKey === filterFlowKey);
    }

    return items;
  }, [history, filterBId, filterFlowKey]);

  const filteredHistory = React.useMemo(() => {
    let items = [...baseFilteredHistory];

    // Tab filtering: "all" excludes disliked items
    if (activeTab === 'favorites') {
      items = items.filter((item) => item.isFavorite);
    } else if (activeTab === 'disliked') {
      items = items.filter((item) => item.isDisliked);
    } else {
      items = items.filter((item) => !item.isDisliked);
    }

    if (searchQuery.trim().length >= 3) {
      const query = searchQuery.trim().toLowerCase();
      items = items.filter((item) => {
        const label = formatHistoryLabel(item).toLowerCase();
        const dimensions = `${item.dimensions?.width || 0}x${item.dimensions?.height || 0}`.toLowerCase();
        const date = new Date(item.timestamp).toLocaleString().toLowerCase();
        return label.includes(query) || dimensions.includes(query) || date.includes(query);
      });
    }

    items.sort((a, b) => {
      const aTime = new Date(a.timestamp).getTime();
      const bTime = new Date(b.timestamp).getTime();
      return sortAsc ? aTime - bTime : bTime - aTime;
    });

    return items;
  }, [baseFilteredHistory, activeTab, searchQuery, sortAsc, formatHistoryLabel]);

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

  const handleToggleDislike = async (e, item) => {
    e.stopPropagation();
    await onUpdate(item.id, { isDisliked: !item.isDisliked });
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

  const allCount = baseFilteredHistory.filter((i) => !i.isDisliked).length;
  const favoritesCount = baseFilteredHistory.filter((i) => i.isFavorite).length;
  const dislikedCount = baseFilteredHistory.filter((i) => i.isDisliked).length;

  const displayLabel = selectedItem
    ? formatHistoryLabel(selectedItem)
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
                    <span className="history-tab-count">{allCount}</span>
                  )}
                  {tab.key === 'favorites' && (
                    <span className="history-tab-count">{favoritesCount}</span>
                  )}
                  {tab.key === 'disliked' && (
                    <span className="history-tab-count">{dislikedCount}</span>
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

          <div className="history-search">
            <input
              ref={searchInputRef}
              type="text"
              className="history-search-input"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="history-list">
            {filteredHistory.length === 0 && (
              <div className="history-empty">
                {searchQuery.trim().length >= 3
                  ? 'No results match your search.'
                  : activeTab === 'favorites'
                    ? 'No liked items yet. Like an item to add it here.'
                    : activeTab === 'disliked'
                      ? 'No disliked items. Dislike an item to add it here.'
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
                  className={`history-item ${isSelected ? 'selected' : ''} ${item.status === 'pending' ? 'pending' : ''}`}
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
                        {label}
                        {item.status === 'pending' && <span className="history-item-status pending">pending</span>}
                        {item.status === 'failed' && <span className="history-item-status failed">failed</span>}
                      </div>
                    )}
                    <div className="history-item-meta">
                      {`${item.dimensions?.width || 0}x${item.dimensions?.height || 0}`} · {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <div className="history-item-actions">
                    <button
                      className={`history-item-icon ${item.isFavorite ? 'active' : ''}`}
                      onClick={(e) => handleToggleFavorite(e, item)}
                      title={item.isFavorite ? 'Remove like' : 'Like'}
                    >
                      {item.isFavorite ? '👍' : '👍🏻'}
                    </button>
                    <button
                      className={`history-item-icon ${item.isDisliked ? 'active' : ''}`}
                      onClick={(e) => handleToggleDislike(e, item)}
                      title={item.isDisliked ? 'Remove dislike' : 'Dislike'}
                    >
                      {item.isDisliked ? '👎' : '👎🏻'}
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
