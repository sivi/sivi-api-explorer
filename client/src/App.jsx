import './App.css'
import './components/landing/landing.css'
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'

import ApiMonitor from './components/common/ApiMonitor'
import WebhookModal from './components/common/WebhookModal'
import AppHeader from './components/app/AppHeader'
import ExplorerHeader from './components/app/ExplorerHeader'
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
import { FLOW_KEY_MAP } from './config/flows.js'

function App({ variant = 'playground' }) {
  const isExplorer = variant === 'explorer'
  const [selectedPreset, setSelectedPreset] = useState('')
  const [selectedExample, setSelectedExample] = useState('')
  const [formKey, setFormKey] = useState(0)
  const [selectedHistoryId, setSelectedHistoryId] = useState('')
  const [prefilledFormData, setPrefilledFormData] = useState(null)

  const {
    apiResponse,
    apiLogs,
    apiInput,
    designVariants,
    isLoading,
    setIsLoading,
    isFlowPolling,
    history,
    clearLogs,
    addLog,
    loadHistoryItem,
    formatHistoryLabel,
    updateHistoryEntry,
    removeHistoryEntry,
    activeFlow,
    setActiveFlow,
    resetResultState,
    pendingFlowAction,
    clearPendingFlowAction,
    selectedBId,
    setSelectedBId,
  } = useAppContext()

  const panels = usePanels()
  const webhook = useWebhookConfig()

  // Explorer: read bId from URL query param on mount
  useEffect(() => {
    if (!isExplorer) return
    const params = new URLSearchParams(window.location.search)
    const bId = params.get('bId')
    if (bId && setSelectedBId) setSelectedBId(bId)
  }, [isExplorer, setSelectedBId])

  // Feature-specific hooks
  const {
    submit: submitDesignsFromPrompt,
    handleWebhookEvent: handlePromptWebhook,
    resume: resumeDesignsFromPrompt,
  } = useDesignGeneration(coreApi.designsFromPrompt, '/designs-from-prompt', 'designs-from-prompt')

  const {
    submit: submitDesignsFromContent,
    handleWebhookEvent: handleContentWebhook,
    resume: resumeDesignsFromContent,
  } = useDesignGeneration(coreApi.designsFromContent, '/designs-from-content', 'designs-from-content')

  const {
    submit: submitContentFromPrompt,
    handleWebhookEvent: handleContentPromptWebhook,
    resume: resumeContentFromPrompt,
  } = useDesignGeneration(coreApi.contentFromPrompt, '/content-from-prompt', 'content-from-prompt')

  const { submit: submitUtility, loadMore: loadMoreUtility, hasMore: hasMoreUtility, isLoadingMore: isLoadingMoreUtility } = useUtilityFlow(activeFlow)
  const {
    submit: submitBrand,
    loadMore: loadMoreBrand,
    hasMore: hasMoreBrand,
    isLoadingMore: isLoadingMoreBrand,
    handleWebhookEvent: handleExtractBrandWebhook,
    resume: resumeBrand,
  } = useBrandFlow(activeFlow)

  const {
    submit: submitMedia,
    loadMore: loadMoreMedia,
    hasMore: hasMoreMedia,
    isLoadingMore: isLoadingMoreMedia,
    handleWebhookEvent: handleGenerateMediaWebhook,
    resume: resumeMedia,
  } = useMediaFlow(activeFlow)

  const { submit: submitFile } = useFileFlow(activeFlow)

  const {
    submit: submitFont,
    loadMore: loadMoreFont,
    hasMore: hasMoreFont,
    isLoadingMore: isLoadingMoreFont,
    handleWebhookEvent: handleUploadFontWebhook,
    resume: resumeFont,
  } = useFontFlow(activeFlow)

  const { submit: submitUser } = useUserFlow(activeFlow)

  // Auto-resume any pending async job stored in history for the current flow.
  // This restores polling after a page refresh so results update automatically.
  const resumedRequestIdsRef = useRef(new Set())
  useEffect(() => {
    const pending = history.find(
      (item) =>
        item.status === 'pending' &&
        item.requestId &&
        item.flowKey === activeFlow &&
        item.apiInput &&
        !resumedRequestIdsRef.current.has(item.requestId)
    )
    if (!pending) return

    resumedRequestIdsRef.current.add(pending.requestId)
    addLog(`Resuming pending job ${pending.requestId} for ${activeFlow}`)
    switch (activeFlow) {
      case 'designs-from-prompt':
        resumeDesignsFromPrompt(pending.requestId, pending.apiInput)
        break
      case 'designs-from-content':
        resumeDesignsFromContent(pending.requestId, pending.apiInput)
        break
      case 'content-from-prompt':
        resumeContentFromPrompt(pending.requestId, pending.apiInput)
        break
      case 'extract-brand':
        resumeBrand(pending.requestId, pending.apiInput)
        break
      case 'generate-media':
        resumeMedia(pending.requestId, pending.apiInput)
        break
      case 'upload-fonts':
        resumeFont(pending.requestId, pending.apiInput)
        break
      default:
        addLog(`Cannot auto-resume flow: ${activeFlow}`)
    }
  }, [history, activeFlow, resumeDesignsFromPrompt, resumeDesignsFromContent, resumeContentFromPrompt, resumeBrand, resumeMedia, resumeFont, addLog])

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
    if (flowKey === 'auto') return
    resetResultState()
    setActiveFlow(flowKey)
    setSelectedPreset('')
    setSelectedExample('')
    setSelectedHistoryId('')
    setPrefilledFormData(null)
    setFormKey((k) => k + 1)
  }, [activeFlow, resetResultState, setActiveFlow])

  const handlePresetChange = useCallback((presetKey) => {
    setSelectedPreset(presetKey)
    setSelectedHistoryId('')
    setPrefilledFormData(null)
    setFormKey((k) => k + 1)
  }, [])

  const handleBIdChange = useCallback((bId) => {
    if (setSelectedBId) setSelectedBId(bId)
    setSelectedExample('')
    setPrefilledFormData(null)
    setFormKey((k) => k + 1)
  }, [setSelectedBId])

  const handleExampleChange = useCallback((exampleValue, exampleData, flowKey) => {
    setSelectedExample(exampleValue)
    setSelectedHistoryId('')
    setPrefilledFormData(exampleData || null)
    if (flowKey && flowKey !== 'auto' && flowKey !== activeFlow) {
      setActiveFlow(flowKey)
    }
    setFormKey((k) => k + 1)
  }, [activeFlow, setActiveFlow])

  const handleHistorySelect = useCallback(async (historyId) => {
    if (!historyId) {
      setSelectedHistoryId('')
      setSelectedPreset('')
      setSelectedExample('')
      return
    }
    const item = await loadHistoryItem(historyId)
    if (item) {
      if (item.flowKey && item.flowKey !== activeFlow) {
        setActiveFlow(item.flowKey)
      }
      setSelectedHistoryId(historyId)
      setSelectedPreset('')
      setSelectedExample('')
      setPrefilledFormData(null)
      if (item.status === 'pending') {
        setIsLoading(true)
      }
      setFormKey((k) => k + 1)
      addLog(`Loaded history: ${item.prompt?.substring(0, 50) ?? 'N/A'}...`)
    }
  }, [activeFlow, loadHistoryItem, setActiveFlow, setIsLoading, addLog])

  // Global flow actions: any component can ask the app to switch to a target
  // flow and pre-fill form fields. This effect consumes the pending action,
  // switches the active flow, and stores the form data for the next mount.
  useEffect(() => {
    if (!pendingFlowAction) return

    const { flowKey, initialFormData } = pendingFlowAction
    clearPendingFlowAction()
    resetResultState()
    setActiveFlow(flowKey)
    setSelectedPreset('')
    setSelectedExample('')
    setSelectedHistoryId('')
    setPrefilledFormData(initialFormData || null)
    setFormKey((k) => k + 1)
    addLog(`Navigated to ${FLOW_KEY_MAP[flowKey] ?? flowKey} from result action`)
  }, [pendingFlowAction, clearPendingFlowAction, resetResultState, setActiveFlow, addLog])

  // Clear prefilled form data when a preset or history item takes over.
  useEffect(() => {
    if (selectedPreset || selectedHistoryId) {
      setPrefilledFormData(null)
    }
  }, [selectedPreset, selectedHistoryId])

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
    if (prefilledFormData) return prefilledFormData
    if (isExplorer) {
      if (selectedHistoryId) return apiInput
      return null
    }
    if (selectedPreset) return designPresets[selectedPreset].data
    if (selectedHistoryId) return apiInput
    return null
  }, [prefilledFormData, isExplorer, selectedPreset, selectedHistoryId, apiInput])

  return (
    <div className="app-container">
      {webhook.showWebhookModal && (
        <WebhookModal
          onClose={() => webhook.setShowWebhookModal(false)}
          onSaved={webhook.handleWebhookSaved}
        />
      )}

      {isExplorer ? (
        <ExplorerHeader
          activeFlow={activeFlow}
          selectedBId={selectedBId}
          selectedExample={selectedExample}
          selectedHistoryId={selectedHistoryId}
          history={history}
          formatHistoryLabel={formatHistoryLabel}
          onBIdChange={handleBIdChange}
          onFlowChange={handleFlowChange}
          onExampleChange={handleExampleChange}
          onHistorySelect={handleHistorySelect}
          onHistoryUpdate={updateHistoryEntry}
          onHistoryDelete={removeHistoryEntry}
          webhookUrl={webhook.webhookUrl}
          webhookEnabled={webhook.webhookEnabled}
          onOpenWebhookModal={() => webhook.setShowWebhookModal(true)}
          onToggleWebhook={webhook.setWebhookEnabled}
        />
      ) : (
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
        />
      )}

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
