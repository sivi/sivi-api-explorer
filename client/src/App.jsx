import './App.css'
import './components/landing/landing.css'
import React, { useState, useCallback, useMemo } from 'react'
import ApiMonitor from './components/common/ApiMonitor'
import WebhookModal from './components/common/WebhookModal'
import AppHeader from './components/app/AppHeader'
import FlowForm from './components/app/FlowForm'
import ResultView from './components/app/ResultView'
import LandingPage from './components/landing/LandingPage.jsx'
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
import { FLOW_TITLES } from './config/flowTitles.js'

function App() {
  const [showLanding, setShowLanding] = useState(true)
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
    isFlowPolling,
    history,
    clearLogs,
    addLog,
    loadHistoryItem,
    formatHistoryLabel,
    updateHistoryEntry,
    removeHistoryEntry,
    setActiveFlowKey,
    resetResultState,
  } = useAppContext()

  const panels = usePanels()
  const webhook = useWebhookConfig()

  // Feature-specific hooks
  const {
    submit: submitDesignsFromPrompt,
    handleWebhookEvent: handlePromptWebhook,
  } = useDesignGeneration(coreApi.designsFromPrompt, '/designs-from-prompt', 'designs-from-prompt')

  const {
    submit: submitDesignsFromContent,
    handleWebhookEvent: handleContentWebhook,
  } = useDesignGeneration(coreApi.designsFromContent, '/designs-from-content', 'designs-from-content')

  const {
    submit: submitContentFromPrompt,
    handleWebhookEvent: handleContentPromptWebhook,
  } = useDesignGeneration(coreApi.contentFromPrompt, '/content-from-prompt', 'content-from-prompt')

  const { submit: submitUtility, loadMore: loadMoreUtility, hasMore: hasMoreUtility, isLoadingMore: isLoadingMoreUtility } = useUtilityFlow(activeFlow)
  const {
    submit: submitBrand,
    loadMore: loadMoreBrand,
    hasMore: hasMoreBrand,
    isLoadingMore: isLoadingMoreBrand,
    handleWebhookEvent: handleExtractBrandWebhook,
  } = useBrandFlow(activeFlow)

  const {
    submit: submitMedia,
    loadMore: loadMoreMedia,
    hasMore: hasMoreMedia,
    isLoadingMore: isLoadingMoreMedia,
    handleWebhookEvent: handleGenerateMediaWebhook,
  } = useMediaFlow(activeFlow)

  const { submit: submitFile } = useFileFlow(activeFlow)

  const {
    submit: submitFont,
    loadMore: loadMoreFont,
    hasMore: hasMoreFont,
    isLoadingMore: isLoadingMoreFont,
    handleWebhookEvent: handleUploadFontWebhook,
  } = useFontFlow(activeFlow)

  const { submit: submitUser } = useUserFlow(activeFlow)

  /*
   * Webhook broadcast: all async job handlers receive every incoming webhook.
   * Each handler internally guards against irrelevant events by checking
   * `lastRequestIdRef.current` (set when that flow submitted a job).
   * Only the handler whose requestId matches the webhook's requestId will
   * actually process it — the rest return immediately with no side effects.
   *
   * This decouples webhooks from the active UI flow. A background job
   * (e.g. design generation) can complete and save to history even while
   * the user is viewing a different flow (e.g. brand results).
   */
  const handleWebhookEvent = useCallback(
    (data) => {
      handlePromptWebhook(data)
      handleContentWebhook(data)
      handleContentPromptWebhook(data)
      handleExtractBrandWebhook(data)
      handleGenerateMediaWebhook(data)
      handleUploadFontWebhook(data)
    },
    [handlePromptWebhook, handleContentWebhook, handleContentPromptWebhook, handleExtractBrandWebhook, handleGenerateMediaWebhook, handleUploadFontWebhook]
  )

  useWebhookEvents(webhook.webhookEnabled, handleWebhookEvent)

  const handleFlowChange = useCallback((flowKey) => {
    if (flowKey === activeFlow) return
    resetResultState()
    setActiveFlow(flowKey)
    setActiveFlowKey(flowKey)
    setSelectedPreset('')
    setSelectedHistoryId('')
    setFormKey((k) => k + 1)
  }, [activeFlow, resetResultState, setActiveFlowKey])

  const handlePresetChange = useCallback((presetKey) => {
    setSelectedPreset(presetKey)
    setSelectedHistoryId('')
    setFormKey((k) => k + 1)
  }, [])

  const handleHistorySelect = useCallback(async (historyId) => {
    if (!historyId) {
      setSelectedHistoryId('')
      setSelectedPreset('')
      return
    }
    const item = await loadHistoryItem(historyId)
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
    if (selectedHistoryId) return apiInput
    return null
  }, [selectedPreset, selectedHistoryId, apiInput])

  const handleLaunch = useCallback(() => {
    setShowLanding(false)
  }, [])

  const handleGoHome = useCallback(() => {
    setShowLanding(true)
  }, [])

  if (showLanding) {
    return <LandingPage onLaunch={handleLaunch} />
  }

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
        onHistoryUpdate={updateHistoryEntry}
        onHistoryDelete={removeHistoryEntry}
        onOpenWebhookModal={() => webhook.setShowWebhookModal(true)}
        onToggleWebhook={webhook.setWebhookEnabled}
        onGoHome={handleGoHome}
      />

      <div className={`app-content${panels.isDragging ? ' dragging' : ''}`}>
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
            <h2>{FLOW_TITLES[activeFlow] || 'Result'}</h2>
            <ResultView
              activeFlow={activeFlow}
              isLoading={isLoading}
              isFlowPolling={isFlowPolling}
              apiResponse={apiResponse}
              designVariants={designVariants}
              apiInput={apiInput}
              webhookEnabled={webhook.webhookEnabled}
              webhookUrl={webhook.webhookUrl}
              onLoadMore={
                activeFlow === 'get-design-variants' ? loadMoreUtility :
                activeFlow === 'list-brands' ? loadMoreBrand :
                activeFlow === 'get-media' ? loadMoreMedia :
                activeFlow === 'get-fonts' ? loadMoreFont :
                undefined
              }
              hasMore={
                activeFlow === 'get-design-variants' ? hasMoreUtility :
                activeFlow === 'list-brands' ? hasMoreBrand :
                activeFlow === 'get-media' ? hasMoreMedia :
                activeFlow === 'get-fonts' ? hasMoreFont :
                false
              }
              isLoadingMore={
                activeFlow === 'get-design-variants' ? isLoadingMoreUtility :
                activeFlow === 'list-brands' ? isLoadingMoreBrand :
                activeFlow === 'get-media' ? isLoadingMoreMedia :
                activeFlow === 'get-fonts' ? isLoadingMoreFont :
                false
              }
            />
          </div>

          <div
            className={`bottom-resizer${panels.bottomCollapsed ? ' hidden' : ''}`}
            onMouseDown={panels.handleBottomDragStart}
          />

          <button
            className={`bottom-collapse-btn${panels.bottomCollapsed ? ' collapsed' : ''}`}
            style={panels.bottomCollapsed ? { bottom: 0 } : { bottom: `${panels.bottomPanelHeight}%` }}
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
