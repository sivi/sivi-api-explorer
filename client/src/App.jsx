import './App.css'
import React, { useState, useCallback, useMemo } from 'react'
import ApiMonitor from './components/common/ApiMonitor'
import WebhookModal from './components/common/WebhookModal'
import AppHeader from './components/app/AppHeader'
import FlowForm from './components/app/FlowForm'
import ResultView from './components/app/ResultView'
import { useAppContext } from './context/useAppContext.js'
import { useDesignGeneration } from './features/designs/hooks/useDesignGeneration.js'
import { useUtilityFlow } from './features/utilities/hooks/useUtilityFlow.js'
import { useBrandFlow } from './features/brand/hooks/useBrandFlow.js'
import { useMediaFlow } from './features/media/hooks/useMediaFlow.js'
import { useFileFlow } from './features/files/hooks/useFileFlow.js'
import { useFontFlow } from './features/fonts/hooks/useFontFlow.js'
import { useUserFlow } from './features/user/hooks/useUserFlow.js'
import { usePanels } from './hooks/usePanels.js'
import { useWebhookConfig } from './hooks/useWebhookConfig.js'
import useWebhookEvents from './hooks/useWebhookEvents'
import { coreApi } from './api/core.js'
import { designPresets } from './features/designs/data/designPresets'
import { getHistoryItem } from './utils/historyStorage'
import { findFlowPath } from './config/flows.js'

function App() {
  const [activeFlow, setActiveFlow] = useState('designs-from-prompt')
  const [selectedPreset, setSelectedPreset] = useState('')
  const [formKey, setFormKey] = useState(0)
  const [selectedHistoryId, setSelectedHistoryId] = useState('')

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

  const panels = usePanels()
  const webhook = useWebhookConfig()

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
        const eventType = data.body?.eventType ?? data.eventType
        const status = data.body?.status ?? data.status
        addLog(`Webhook event: eventType=${eventType || 'unknown'}, status=${status || 'unknown'} — no active job flow is listening.`)
      }
    },
    [activeFlow, handlePromptWebhook, handleContentWebhook, handleContentPromptWebhook, handleExtractBrandWebhook, handleGenerateMediaWebhook, handleUploadFontWebhook, addLog]
  )

  useWebhookEvents(webhook.webhookEnabled, handleWebhookEvent)

  const handleFlowChange = useCallback((flowKey) => {
    if (flowKey === activeFlow) return
    setActiveFlow(flowKey)
    setActiveFlowKey(flowKey)
    setSelectedPreset('')
    setSelectedHistoryId('')
    setFormKey((k) => k + 1)
  }, [activeFlow, setActiveFlowKey])

  const handlePresetChange = useCallback((presetKey) => {
    setSelectedPreset(presetKey)
    setSelectedHistoryId('')
    setFormKey((k) => k + 1)
  }, [])

  const handleHistorySelect = useCallback((historyId) => {
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
  }, [activeFlow, loadHistoryItem, setActiveFlowKey, addLog])

  const handleFlowSubmit = useCallback((formData) => {
    switch (activeFlow) {
      case 'designs-from-prompt':
        submitDesignsFromPrompt(formData, webhook.webhookEnabled)
        break
      case 'designs-from-content':
        submitDesignsFromContent(formData, webhook.webhookEnabled)
        break
      case 'content-from-prompt':
        submitContentFromPrompt(formData, webhook.webhookEnabled)
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
        submitBrand(formData, webhook.webhookEnabled)
        break
      case 'get-media':
      case 'create-media':
      case 'update-media':
      case 'delete-media':
        submitMedia(formData)
        break
      case 'generate-media':
        submitMedia(formData, webhook.webhookEnabled)
        break
      case 'get-presigned-url':
        submitFile(formData)
        break
      case 'get-fonts':
        submitFont(formData)
        break
      case 'upload-fonts':
        submitFont(formData, webhook.webhookEnabled)
        break
      case 'login-user':
      case 'delete-user':
      case 'set-user-credit-limit':
        submitUser(formData)
        break
      default:
        addLog(`Unknown flow: ${activeFlow}`)
    }
  }, [activeFlow, webhook.webhookEnabled, submitDesignsFromPrompt, submitDesignsFromContent, submitContentFromPrompt, submitUtility, submitBrand, submitMedia, submitFile, submitFont, submitUser, addLog])

  const initialFormData = useMemo(() => {
    if (selectedPreset) return designPresets[selectedPreset].data
    if (selectedHistoryId) return getHistoryItem(selectedHistoryId)?.apiInput
    return null
  }, [selectedPreset, selectedHistoryId])

  const activeFlowPath = useMemo(() => findFlowPath(activeFlow), [activeFlow])

  return (
    <div className="app-container">
      {webhook.showWebhookModal && (
        <WebhookModal
          onClose={() => webhook.setShowWebhookModal(false)}
          onSaved={webhook.handleWebhookSaved}
        />
      )}

      <AppHeader
        activeFlow={activeFlow}
        selectedPreset={selectedPreset}
        selectedHistoryId={selectedHistoryId}
        history={history}
        formatHistoryLabel={formatHistoryLabel}
        webhookUrl={webhook.webhookUrl}
        webhookEnabled={webhook.webhookEnabled}
        onFlowChange={handleFlowChange}
        onPresetChange={handlePresetChange}
        onHistorySelect={handleHistorySelect}
        onOpenWebhookModal={() => webhook.setShowWebhookModal(true)}
        onToggleWebhook={webhook.setWebhookEnabled}
      />

      <div className="app-content">
        <aside
          className={`sidebar${panels.sidebarCollapsed ? ' collapsed' : ''}`}
          style={panels.sidebarCollapsed ? { width: 0, minWidth: 0, overflow: 'hidden' } : { width: panels.sidebarWidth }}
        >
          <div className="control-panel">
            <FlowForm
              activeFlow={activeFlow}
              formKey={formKey}
              onSubmit={handleFlowSubmit}
              initialFormData={initialFormData}
            />
          </div>
        </aside>

        <button
          className={`sidebar-collapse-btn${panels.sidebarCollapsed ? ' collapsed' : ''}`}
          style={{ left: panels.sidebarCollapsed ? 0 : panels.sidebarWidth }}
          onClick={() => panels.setSidebarCollapsed((c) => !c)}
          title={panels.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {panels.sidebarCollapsed ? '▶' : '◀'}
        </button>

        <div
          className={`sidebar-resizer${panels.sidebarCollapsed ? ' hidden' : ''}`}
          style={{ left: panels.sidebarWidth }}
          onMouseDown={panels.handleSidebarDragStart}
        />

        <main
          className="main-content"
          style={{ marginLeft: panels.sidebarCollapsed ? 0 : panels.sidebarWidth }}
        >
          <div className="variants-section">
            <h2>{activeFlowPath?.[activeFlowPath.length - 1] || 'Result'}</h2>
            <ResultView
              activeFlow={activeFlow}
              isLoading={isLoading}
              isPolling={isPolling}
              apiResponse={apiResponse}
              designVariants={designVariants}
              apiInput={apiInput}
              webhookEnabled={webhook.webhookEnabled}
              webhookUrl={webhook.webhookUrl}
            />
          </div>

          <div
            className={`bottom-resizer${panels.bottomCollapsed ? ' hidden' : ''}`}
            onMouseDown={panels.handleBottomDragStart}
          />

          <button
            className={`bottom-collapse-btn${panels.bottomCollapsed ? ' collapsed' : ''}`}
            onClick={() => panels.setBottomCollapsed((c) => !c)}
            title={panels.bottomCollapsed ? 'Expand panel' : 'Collapse panel'}
          >
            {panels.bottomCollapsed ? '▲' : '▼'}
          </button>

          <div
            className={`api-monitor-wrapper${panels.bottomCollapsed ? ' collapsed' : ''}`}
            style={{ flex: panels.bottomCollapsed ? '0 0 0px' : `0 0 ${panels.bottomPanelHeight}%` }}
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
