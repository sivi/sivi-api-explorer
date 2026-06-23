import './App.css'
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Cascader } from 'antd'
import DesignForm from './features/designs/components/DesignForm'
import DesignsFromContentForm from './features/designs/components/DesignsFromContentForm'
import ContentFromPromptForm from './features/content/components/ContentFromPromptForm'
import UtilityForm from './features/utilities/components/UtilityForm'
import BrandCreateForm from './features/brand/components/BrandCreateForm'
import BrandListPanel from './features/brand/components/BrandListPanel'
import BrandExtractForm from './features/brand/components/BrandExtractForm'
import BrandSetDefaultForm from './features/brand/components/BrandSetDefaultForm'
import BrandArchiveForm from './features/brand/components/BrandArchiveForm'
import BrandUpdateForm from './features/brand/components/BrandUpdateForm'
import UserManagementForm from './features/user/components/UserManagementForm'
import MediaListPanel from './features/media/components/MediaListPanel'
import MediaCreateForm from './features/media/components/MediaCreateForm'
import MediaUpdateForm from './features/media/components/MediaUpdateForm'
import MediaDeleteForm from './features/media/components/MediaDeleteForm'
import MediaGenerateForm from './features/media/components/MediaGenerateForm'
import FilePresignedUrlForm from './features/files/components/FilePresignedUrlForm'
import FontListPanel from './features/fonts/components/FontListPanel'
import FontUploadForm from './features/fonts/components/FontUploadForm'
import ApiMonitor from './components/common/ApiMonitor'
import WebhookModal from './components/common/WebhookModal'
import { useAppContext } from './context/useAppContext.js'
import { useDesignGeneration } from './features/designs/hooks/useDesignGeneration.js'
// content-from-prompt is also async (returns requestId) so it uses useDesignGeneration
import { useUtilityFlow } from './features/utilities/hooks/useUtilityFlow.js'
import { useBrandFlow } from './features/brand/hooks/useBrandFlow.js'
import { useMediaFlow } from './features/media/hooks/useMediaFlow.js'
import { useFileFlow } from './features/files/hooks/useFileFlow.js'
import { useFontFlow } from './features/fonts/hooks/useFontFlow.js'
import { useUserFlow } from './features/user/hooks/useUserFlow.js'
import useWebhookEvents from './hooks/useWebhookEvents'
import { coreApi } from './api/core.js'
import { designPresets } from './features/designs/data/designPresets'
import { getHistoryItem } from './utils/historyStorage'
import { FLOW_GROUPS, FLOW_KEY_MAP, findFlowPath } from './config/flows.js'
import DesignVariantsResult from './components/results/DesignVariantsResult.jsx'
import ContentResult from './components/results/ContentResult.jsx'
import BrandResult from './components/results/BrandResult.jsx'
import MediaResult from './components/results/MediaResult.jsx'
import FontResult from './components/results/FontResult.jsx'
import StatusResult from './components/results/StatusResult.jsx'
import JsonResult from './components/results/JsonResult.jsx'

const WEBHOOK_URL_KEY = 'webhookUrl'

/** Map each flow to its section title */
const FLOW_TITLES = {
  'designs-from-prompt': 'Generated Design Variations',
  'designs-from-content': 'Generated Design Variations',
  'content-from-prompt': 'Generated Content',
  'get-design-variants': 'Design Variants',
  'request-status': 'Request Status',
  'list-brands': 'Brand Result',
  'create-brand': 'Brand Result',
  'extract-brand': 'Extracted Brand Details',
  'set-default-brand': 'Brand Result',
  'archive-brand': 'Brand Result',
  'update-brand': 'Brand Result',
  'get-media': 'Media',
  'create-media': 'Media Result',
  'update-media': 'Media Result',
  'delete-media': 'Media Result',
  'generate-media': 'Media Result',
  'get-presigned-url': 'Presigned URL',
  'get-fonts': 'Font Result',
  'upload-fonts': 'Font Upload',
  'login-user': 'User Login Response',
  'delete-user': 'User Delete Response',
  'set-user-credit-limit': 'Credit Limit Response',
}

/** Map each flow to its result renderer component */
function getResultComponent(flowKey, { apiResponse, designVariants, apiInput }) {
  switch (flowKey) {
    case 'designs-from-prompt':
    case 'designs-from-content':
    case 'get-design-variants':
      return <DesignVariantsResult variants={designVariants} apiInput={apiInput} />
    case 'content-from-prompt':
      return <ContentResult apiResponse={apiResponse} />
    case 'list-brands':
    case 'create-brand':
    case 'extract-brand':
    case 'set-default-brand':
    case 'archive-brand':
    case 'update-brand':
      return <BrandResult apiResponse={apiResponse} />
    case 'request-status':
      return <StatusResult apiResponse={apiResponse} />
    case 'get-media':
    case 'create-media':
    case 'update-media':
    case 'delete-media':
    case 'generate-media':
      return <MediaResult apiResponse={apiResponse} />
    case 'get-presigned-url':
      return <StatusResult apiResponse={apiResponse} />
    case 'get-fonts':
      return <FontResult apiResponse={apiResponse} />
    case 'upload-fonts':
      return <StatusResult apiResponse={apiResponse} />
    case 'login-user':
    case 'delete-user':
    case 'set-user-credit-limit':
      return <JsonResult apiResponse={apiResponse} />
    default:
      return null
  }
}

function App() {
  const [activeFlow, setActiveFlow] = useState('designs-from-prompt')
  const [selectedPreset, setSelectedPreset] = useState('')
  const [formKey, setFormKey] = useState(0)
  const [showWebhookModal, setShowWebhookModal] = useState(false)
  const [webhookEnabled, setWebhookEnabled] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState('')
  const [selectedHistoryId, setSelectedHistoryId] = useState('')

  // Resizable panel states
  const [sidebarWidth, setSidebarWidth] = useState(380)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [bottomPanelHeight, setBottomPanelHeight] = useState(30)
  const [bottomCollapsed, setBottomCollapsed] = useState(false)
  const sidebarDragRef = useRef(false)
  const bottomDragRef = useRef(false)

  const {
    apiResponse,
    apiLogs,
    apiInput,
    designVariants,
    isLoading,
    isPolling,
    history,
    clearLogs,
    addLog,
    loadHistoryItem,
    formatHistoryLabel,
    setActiveFlowKey,
  } = useAppContext()

  // Feature-specific hooks
  const {
    submit: submitDesignsFromPrompt,
    handleWebhookEvent: handlePromptWebhook,
  } = useDesignGeneration(coreApi.designsFromPrompt, '/designs-from-prompt')

  const {
    submit: submitDesignsFromContent,
    handleWebhookEvent: handleContentWebhook,
  } = useDesignGeneration(coreApi.designsFromContent, '/designs-from-content')

  const {
    submit: submitContentFromPrompt,
    handleWebhookEvent: handleContentPromptWebhook,
  } = useDesignGeneration(coreApi.contentFromPrompt, '/content-from-prompt')

  const { submit: submitUtility } = useUtilityFlow(activeFlow)
  const {
    submit: submitBrand,
    handleWebhookEvent: handleExtractBrandWebhook,
  } = useBrandFlow(activeFlow)

  const {
    submit: submitMedia,
    handleWebhookEvent: handleGenerateMediaWebhook,
  } = useMediaFlow(activeFlow)

  const { submit: submitFile } = useFileFlow(activeFlow)

  const {
    submit: submitFont,
    handleWebhookEvent: handleUploadFontWebhook,
  } = useFontFlow(activeFlow)

  const { submit: submitUser } = useUserFlow(activeFlow)

  // Webhook routing: all async job flows share the same SSE channel
  const handleWebhookEvent = useCallback(
    (data) => {
      if (activeFlow === 'designs-from-prompt') {
        handlePromptWebhook(data)
      } else if (activeFlow === 'designs-from-content') {
        handleContentWebhook(data)
      } else if (activeFlow === 'content-from-prompt') {
        handleContentPromptWebhook(data)
      } else if (activeFlow === 'extract-brand') {
        handleExtractBrandWebhook(data)
      } else if (activeFlow === 'generate-media') {
        handleGenerateMediaWebhook(data)
      } else if (activeFlow === 'upload-fonts') {
        handleUploadFontWebhook(data)
      } else {
        const eventType = data.body?.eventType ?? data.eventType;
        const status = data.body?.status ?? data.status;
        addLog(`Webhook event: eventType=${eventType || 'unknown'}, status=${status || 'unknown'} — no active job flow is listening.`)
      }
    },
    [activeFlow, handlePromptWebhook, handleContentWebhook, handleContentPromptWebhook, handleExtractBrandWebhook, handleGenerateMediaWebhook, handleUploadFontWebhook, addLog]
  )

  useWebhookEvents(webhookEnabled, handleWebhookEvent)

  useEffect(() => {
    const stored = localStorage.getItem(WEBHOOK_URL_KEY)
    if (stored) setWebhookUrl(stored)
  }, [])

  const handleWebhookSaved = useCallback((url) => {
    setWebhookUrl(url)
    if (!url) setWebhookEnabled(false)
  }, [])

  // Sidebar resize handlers
  const handleSidebarDragStart = useCallback(() => {
    sidebarDragRef.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  const handleSidebarDragEnd = useCallback(() => {
    sidebarDragRef.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  const handleSidebarDragMove = useCallback((e) => {
    if (!sidebarDragRef.current) return
    const newWidth = Math.max(280, Math.min(600, e.clientX))
    setSidebarWidth(newWidth)
  }, [])

  // Bottom panel resize handlers
  const handleBottomDragStart = useCallback(() => {
    bottomDragRef.current = true
    document.body.style.cursor = 'row-resize'
    document.body.style.userSelect = 'none'
  }, [])

  const handleBottomDragEnd = useCallback(() => {
    bottomDragRef.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  const handleBottomDragMove = useCallback((e) => {
    if (!bottomDragRef.current) return
    const rect = document.querySelector('.main-content')?.getBoundingClientRect()
    if (!rect) return
    const relativeY = e.clientY - rect.top
    const newHeight = Math.max(15, Math.min(70, ((rect.height - relativeY) / rect.height) * 100))
    setBottomPanelHeight(newHeight)
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      handleSidebarDragMove(e)
      handleBottomDragMove(e)
    }
    const onUp = () => {
      handleSidebarDragEnd()
      handleBottomDragEnd()
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [handleSidebarDragMove, handleSidebarDragEnd, handleBottomDragMove, handleBottomDragEnd])

  const handleFlowChange = (flowKey) => {
    if (flowKey === activeFlow) return
    setActiveFlow(flowKey)
    setActiveFlowKey(flowKey)
    setSelectedPreset('')
    setSelectedHistoryId('')
    setFormKey((k) => k + 1)
  }

  const handlePresetChange = (presetKey) => {
    setSelectedPreset(presetKey)
    setSelectedHistoryId('')
    setFormKey((k) => k + 1)
  }

  const handleHistorySelect = (historyId) => {
    if (!historyId) {
      setSelectedHistoryId('')
      setSelectedPreset('')
      return
    }
    const item = loadHistoryItem(historyId)
    if (item) {
      if (item.flowKey && item.flowKey !== activeFlow) {
        setActiveFlow(item.flowKey)
        setActiveFlowKey(item.flowKey)
      }
      setSelectedHistoryId(historyId)
      setSelectedPreset('')
      setFormKey((k) => k + 1)
      addLog(`Loaded history: ${item.prompt?.substring(0, 50) ?? 'N/A'}...`)
    }
  }

  const handleFlowSubmit = (formData) => {
    switch (activeFlow) {
      case 'designs-from-prompt':
        submitDesignsFromPrompt(formData, webhookEnabled)
        break
      case 'designs-from-content':
        submitDesignsFromContent(formData, webhookEnabled)
        break
      case 'content-from-prompt':
        submitContentFromPrompt(formData, webhookEnabled)
        break
      case 'get-design-variants':
      case 'request-status':
        submitUtility(formData)
        break
      case 'list-brands':
      case 'create-brand':
      case 'set-default-brand':
      case 'archive-brand':
      case 'update-brand':
        submitBrand(formData)
        break
      case 'extract-brand':
        submitBrand(formData, webhookEnabled)
        break
      case 'get-media':
      case 'create-media':
      case 'update-media':
      case 'delete-media':
        submitMedia(formData)
        break
      case 'generate-media':
        submitMedia(formData, webhookEnabled)
        break
      case 'get-presigned-url':
        submitFile(formData)
        break
      case 'get-fonts':
        submitFont(formData)
        break
      case 'upload-fonts':
        submitFont(formData, webhookEnabled)
        break
      case 'login-user':
      case 'delete-user':
      case 'set-user-credit-limit':
        submitUser(formData)
        break
      default:
        addLog(`Unknown flow: ${activeFlow}`)
    }
  }

  const initialFormData = selectedPreset
    ? designPresets[selectedPreset].data
    : selectedHistoryId
    ? getHistoryItem(selectedHistoryId)?.apiInput
    : null

  const activeFlowPath = useMemo(() => findFlowPath(activeFlow), [activeFlow])

  const renderForm = () => {
    switch (activeFlow) {
      case 'designs-from-prompt':
        return (
          <DesignForm
            key={formKey}
            onSubmit={handleFlowSubmit}
            initialData={initialFormData}
          />
        )
      case 'designs-from-content':
        return (
          <DesignsFromContentForm
            key={formKey}
            onSubmit={handleFlowSubmit}
            initialData={initialFormData}
          />
        )
      case 'content-from-prompt':
        return (
          <ContentFromPromptForm
            key={formKey}
            onSubmit={handleFlowSubmit}
            initialData={initialFormData}
          />
        )
      case 'get-design-variants':
        return <UtilityForm flowKey="get-design-variants" onSubmit={handleFlowSubmit} initialData={initialFormData} />
      case 'request-status':
        return <UtilityForm flowKey="request-status" onSubmit={handleFlowSubmit} initialData={initialFormData} />
      case 'list-brands':
        return <BrandListPanel onSubmit={handleFlowSubmit} initialData={initialFormData} />
      case 'create-brand':
        return <BrandCreateForm onSubmit={handleFlowSubmit} initialData={initialFormData} />
      case 'extract-brand':
        return <BrandExtractForm onSubmit={handleFlowSubmit} initialData={initialFormData} />
      case 'set-default-brand':
        return <BrandSetDefaultForm onSubmit={handleFlowSubmit} initialData={initialFormData} />
      case 'archive-brand':
        return <BrandArchiveForm onSubmit={handleFlowSubmit} initialData={initialFormData} />
      case 'update-brand':
        return <BrandUpdateForm onSubmit={handleFlowSubmit} initialData={initialFormData} />
      case 'get-media':
        return <MediaListPanel onSubmit={handleFlowSubmit} initialData={initialFormData} />
      case 'create-media':
        return <MediaCreateForm onSubmit={handleFlowSubmit} initialData={initialFormData} />
      case 'update-media':
        return <MediaUpdateForm onSubmit={handleFlowSubmit} initialData={initialFormData} />
      case 'delete-media':
        return <MediaDeleteForm onSubmit={handleFlowSubmit} initialData={initialFormData} />
      case 'generate-media':
        return <MediaGenerateForm onSubmit={handleFlowSubmit} initialData={initialFormData} />
      case 'get-presigned-url':
        return <FilePresignedUrlForm onSubmit={handleFlowSubmit} initialData={initialFormData} />
      case 'get-fonts':
        return <FontListPanel onSubmit={handleFlowSubmit} initialData={initialFormData} />
      case 'upload-fonts':
        return <FontUploadForm onSubmit={handleFlowSubmit} initialData={initialFormData} />
      case 'login-user':
      case 'delete-user':
      case 'set-user-credit-limit':
        return (
          <UserManagementForm
            key={formKey}
            flowKey={activeFlow}
            onSubmit={handleFlowSubmit}
            initialData={initialFormData}
          />
        )
      default:
        return (
          <div className="placeholder-flow">
            <p>Flow &quot;{FLOW_KEY_MAP[activeFlow] || activeFlow}&quot; is not yet implemented.</p>
            <p>Select another flow from the dropdown above.</p>
          </div>
        )
    }
  }

  const renderResults = () => {
    if (isLoading || isPolling) {
      return (
        <div className="loading-state">
          <div className="spinner" />
          {isPolling ? (
            <p>Design is being generated, please wait... (Checking for status)</p>
          ) : isLoading && webhookEnabled && webhookUrl ? (
            <p>Design request submitted — results will be delivered via webhook.</p>
          ) : (
            <p>Processing...</p>
          )}
        </div>
      )
    }

    const resultEl = getResultComponent(activeFlow, { apiResponse, designVariants, apiInput })
    if (resultEl) return resultEl

    return (
      <div className="variant-empty-state">
        <p>Results will appear here after API call</p>
      </div>
    )
  }

  return (
    <div className="app-container">
      {showWebhookModal && (
        <WebhookModal
          onClose={() => setShowWebhookModal(false)}
          onSaved={handleWebhookSaved}
        />
      )}

      <header className="app-header">
        <h1>Sivi API Explorer</h1>
        <div className="header-controls">
          <div className="flow-selector">
            <label className="preset-label">Flow:</label>
            <Cascader
              className="flow-cascader"
              options={FLOW_GROUPS}
              value={activeFlowPath}
              onChange={(value) => {
                if (value && value.length >= 2) {
                  handleFlowChange(value[value.length - 1])
                }
              }}
              placeholder="Select a flow"
              allowClear={false}
              popupClassName="flow-cascader-popup"
            />
          </div>

          {[
            'designs-from-prompt',
            'designs-from-content',
            'content-from-prompt',
            'extract-brand',
            'generate-media',
            'upload-fonts',
          ].includes(activeFlow) && (
            <div className="preset-selector">
              <label htmlFor="preset-dropdown" className="preset-label">
                Load Example:
              </label>
              <select
                id="preset-dropdown"
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="preset-dropdown"
              >
                <option value="">Select a preset...</option>
                {Object.entries(designPresets)
                  .filter(([, preset]) => preset.flows?.includes(activeFlow))
                  .map(([key, preset]) => (
                    <option key={key} value={key}>
                      {preset.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="history-selector">
            <label htmlFor="history-dropdown" className="preset-label">
              History:
            </label>
            <select
              id="history-dropdown"
              value={selectedHistoryId}
              onChange={(e) => handleHistorySelect(e.target.value)}
              className="preset-dropdown"
            >
              <option value="">Select from history...</option>
              {history.map((item) => (
                <option key={item.id} value={item.id}>
                  {formatHistoryLabel(item)}
                </option>
              ))}
            </select>
          </div>

          <div className="webhook-controls">
            <button
              className="webhook-config-btn"
              onClick={() => setShowWebhookModal(true)}
              title="Configure webhook URL"
            >
              ⚙ Webhook
            </button>
            <label
              className="webhook-toggle-label"
              title={webhookUrl ? '' : 'Set a webhook URL first'}
            >
              <input
                type="checkbox"
                className="webhook-toggle-input"
                checked={webhookEnabled}
                disabled={!webhookUrl}
                onChange={(e) => setWebhookEnabled(e.target.checked)}
              />
              <span
                className={`webhook-toggle-text ${webhookEnabled ? 'enabled' : ''}`}
              >
                {webhookEnabled ? 'Webhook ON' : 'Webhook OFF'}
              </span>
            </label>
          </div>
        </div>
      </header>

      <div className="app-content">
        <aside
          className={`sidebar${sidebarCollapsed ? ' collapsed' : ''}`}
          style={sidebarCollapsed ? { width: 0, minWidth: 0, overflow: 'hidden' } : { width: sidebarWidth }}
        >
          <div className="control-panel">{renderForm()}</div>
        </aside>

        <button
          className={`sidebar-collapse-btn${sidebarCollapsed ? ' collapsed' : ''}`}
          style={{ left: sidebarCollapsed ? 0 : sidebarWidth }}
          onClick={() => setSidebarCollapsed((c) => !c)}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? '▶' : '◀'}
        </button>

        <div
          className={`sidebar-resizer${sidebarCollapsed ? ' hidden' : ''}`}
          style={{ left: sidebarWidth }}
          onMouseDown={handleSidebarDragStart}
        />

        <main
          className="main-content"
          style={{ marginLeft: sidebarCollapsed ? 0 : sidebarWidth }}
        >
          <div className="variants-section">
            <h2>{FLOW_TITLES[activeFlow] || 'Result'}</h2>
            {renderResults()}
          </div>

          <div
            className={`bottom-resizer${bottomCollapsed ? ' hidden' : ''}`}
            onMouseDown={handleBottomDragStart}
          />

          <button
            className={`bottom-collapse-btn${bottomCollapsed ? ' collapsed' : ''}`}
            onClick={() => setBottomCollapsed((c) => !c)}
            title={bottomCollapsed ? 'Expand panel' : 'Collapse panel'}
          >
            {bottomCollapsed ? '▲' : '▼'}
          </button>

          <div
            className={`api-monitor-wrapper${bottomCollapsed ? ' collapsed' : ''}`}
            style={{ flex: bottomCollapsed ? '0 0 0px' : `0 0 ${bottomPanelHeight}%` }}
          >
            <ApiMonitor
              apiLogs={apiLogs}
              apiResponse={apiResponse}
              apiInput={apiInput}
              onClearLogs={clearLogs}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
