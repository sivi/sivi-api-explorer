import React, { useState, useMemo } from 'react';
import { message } from 'antd';
import {
  TextInput,
  SelectInput,
  NumberInput,
  Tabs,
} from '~/components/common/FormComponents';
import { MEDIA_TYPE_OPTIONS, SUBTYPE_MAP } from '../config/mediaTypes.js';

const TABS = [
  { key: 'multi', label: 'Multi Media' },
  { key: 'single', label: 'Single Media' },
];

const TYPE_OPTIONS = MEDIA_TYPE_OPTIONS;

const SORT_OPTIONS = [
  { label: 'Descending', value: 'DESC' },
  { label: 'Ascending', value: 'ASC' },
];

const MediaListPanel = ({ onSubmit, initialData }) => {
  const [activeTab, setActiveTab] = useState(initialData?.mId ? 'single' : 'multi');
  const [type, setType] = useState(initialData?.type || '');
  const [subType, setSubType] = useState(initialData?.subType || '');
  const [mId, setMId] = useState(initialData?.mId || '');
  const [bId, setBId] = useState(initialData?.bId || '');
  const [limit, setLimit] = useState(initialData?.limit ?? 20);
  const [sort, setSort] = useState(initialData?.sort || 'DESC');
  const [abstractUserId, setAbstractUserId] = useState(initialData?.abstractUserId || '');

  const subTypeOptions = useMemo(() => SUBTYPE_MAP[type] || [], [type]);

  const handleTypeChange = (value) => {
    setType(value);
    setSubType('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {};

    if (activeTab === 'single') {
      if (!mId.trim()) {
        message.error('Media ID is required for single media fetch');
        return;
      }
      payload.mId = mId.trim();
    } else {
      if (!type) {
        message.error('Type is required');
        return;
      }
      if (!subType) {
        message.error('SubType is required');
        return;
      }
      if (!limit || Number(limit) < 1) {
        message.error('Limit is required and must be at least 1');
        return;
      }
      payload.type = type;
      payload.subType = subType;
      if (bId.trim()) payload.bId = bId.trim();
      payload.limit = Number(limit);
      payload.cursor = null;
      payload.sort = sort || 'DESC';
    }

    if (abstractUserId.trim()) payload.abstractUserId = abstractUserId.trim();

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Media</h3>
      <p className="form-hint">Fetch media assets from your Sivi workspace.</p>

      <Tabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />

      <TextInput
        label="Abstract User ID (optional)"
        value={abstractUserId}
        onChange={setAbstractUserId}
        placeholder="e.g. user_123"
      />

      {activeTab === 'single' ? (
        <div className="required-field">
          <TextInput
            label="Media ID"
            value={mId}
            onChange={setMId}
            placeholder="e.g. w_abc123----photo_001.jpeg"
          />
        </div>
      ) : (
        <>
          <div className="required-field">
            <SelectInput
            label="Type"
              value={type}
              onChange={handleTypeChange}
              options={TYPE_OPTIONS}
              placeholder="Select type"
            />
          </div>

          <div className="required-field">
            <SelectInput
            label="SubType"
              value={subType}
              onChange={setSubType}
              options={subTypeOptions}
              placeholder="Select subtype"
            />
          </div>

          <TextInput
            label="Brand ID (optional)"
            value={bId}
            onChange={setBId}
            placeholder="e.g. b_s87vFxpfM0R"
          />

          <div className="required-field">
            <NumberInput
            label="Limit"
            value={limit}
            onChange={setLimit}
            placeholder="Number of items per page"
            min={1}
            max={100}
          />
          </div>
          

          <SelectInput
            label="Sort"
            value={sort}
            onChange={setSort}
            options={SORT_OPTIONS}
          />
        </>
      )}

      <button type="submit" className="submit-button">
        {activeTab === 'multi' ? 'Fetch Media' : 'Fetch Media'}
      </button>
    </form>
  );
};

export default MediaListPanel;
