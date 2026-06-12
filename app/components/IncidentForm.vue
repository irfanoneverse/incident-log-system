<script setup lang="ts">
import type {
  Incident,
  IncidentCategory,
  IncidentPriority,
  IncidentStatus,
  CreateIncidentInput,
  UpdateIncidentInput,
} from '~/types'

const props = withDefaults(defineProps<{
  mode: 'create' | 'edit'
  initialData?: Partial<Incident>
  loading?: boolean
}>(), { loading: false })

const emit = defineEmits<{
  submit: [data: CreateIncidentInput | UpdateIncidentInput]
  cancel: []
}>()

const form = reactive({
  title:           props.initialData?.title ?? '',
  description:     props.initialData?.description ?? '',
  reporterName:    props.initialData?.reporterName ?? '',
  category:        (props.initialData?.category ?? '') as IncidentCategory | '',
  priority:        (props.initialData?.priority ?? '') as IncidentPriority | '',
  status:          (props.initialData?.status ?? 'OPEN') as IncidentStatus,
  resolutionNotes: props.initialData?.resolutionNotes ?? '',
})

const errors = reactive<Record<string, string>>({})

const showResolutionNotes = computed(
  () => form.status === 'RESOLVED' || form.status === 'CLOSED',
)

function validate() {
  errors.title        = form.title.trim().length < 3   ? 'At least 3 characters' : ''
  errors.description  = form.description.trim().length < 10 ? 'At least 10 characters' : ''
  errors.reporterName = form.reporterName.trim().length < 2 ? 'Required' : ''
  errors.category     = !form.category  ? 'Required' : ''
  errors.priority     = !form.priority  ? 'Required' : ''
  return !Object.values(errors).some(Boolean)
}

function handleSubmit() {
  if (!validate()) return

  const base = {
    title:        form.title.trim(),
    description:  form.description.trim(),
    reporterName: form.reporterName.trim(),
    category:     form.category as IncidentCategory,
    priority:     form.priority as IncidentPriority,
  }

  const data: CreateIncidentInput | UpdateIncidentInput =
    props.mode === 'edit'
      ? { ...base, status: form.status, resolutionNotes: form.resolutionNotes.trim() || null }
      : base

  emit('submit', data)
}

const inputCls = 'w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 transition-all'
const selectCls = 'w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-white focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 transition-all'
const labelCls = 'block text-xs font-medium text-zinc-400 mb-1.5'
const errorCls = 'text-xs text-red-400 mt-1'

const categoryOptions: { value: IncidentCategory; label: string }[] = [
  { value: 'HARDWARE', label: 'Hardware' },
  { value: 'SOFTWARE', label: 'Software' },
  { value: 'NETWORK',  label: 'Network' },
  { value: 'ACCESS',   label: 'Access' },
  { value: 'EMAIL',    label: 'Email' },
  { value: 'PRINTER',  label: 'Printer' },
  { value: 'PHONE',    label: 'Phone' },
  { value: 'OTHER',    label: 'Other' },
]

const priorityOptions: { value: IncidentPriority; label: string }[] = [
  { value: 'LOW',      label: 'Low' },
  { value: 'MEDIUM',   label: 'Medium' },
  { value: 'HIGH',     label: 'High' },
  { value: 'CRITICAL', label: 'Critical' },
]

const statusOptions: { value: IncidentStatus; label: string }[] = [
  { value: 'OPEN',        label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED',    label: 'Resolved' },
  { value: 'CLOSED',      label: 'Closed' },
]
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">

    <div>
      <label :class="labelCls">Title</label>
      <input v-model="form.title" type="text" placeholder="Brief description of the issue" :class="inputCls" />
      <p v-if="errors.title" :class="errorCls">{{ errors.title }}</p>
    </div>

    <div>
      <label :class="labelCls">Reporter name</label>
      <input v-model="form.reporterName" type="text" placeholder="Name of person who reported" :class="inputCls" />
      <p v-if="errors.reporterName" :class="errorCls">{{ errors.reporterName }}</p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label :class="labelCls">Category</label>
        <select v-model="form.category" :class="selectCls">
          <option value="" disabled>Select…</option>
          <option v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
        <p v-if="errors.category" :class="errorCls">{{ errors.category }}</p>
      </div>
      <div>
        <label :class="labelCls">Priority</label>
        <select v-model="form.priority" :class="selectCls">
          <option value="" disabled>Select…</option>
          <option v-for="opt in priorityOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
        <p v-if="errors.priority" :class="errorCls">{{ errors.priority }}</p>
      </div>
    </div>

    <div v-if="mode === 'edit'">
      <label :class="labelCls">Status</label>
      <select v-model="form.status" :class="selectCls">
        <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
    </div>

    <div>
      <label :class="labelCls">Description</label>
      <textarea
        v-model="form.description"
        rows="4"
        placeholder="Detailed description of the incident"
        class="w-full px-3 py-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 transition-all resize-none"
      />
      <p v-if="errors.description" :class="errorCls">{{ errors.description }}</p>
    </div>

    <div v-if="showResolutionNotes">
      <label :class="labelCls">Resolution notes</label>
      <textarea
        v-model="form.resolutionNotes"
        rows="3"
        placeholder="How was this resolved?"
        class="w-full px-3 py-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 transition-all resize-none"
      />
    </div>

    <div class="flex items-center gap-3 pt-1">
      <button
        type="submit"
        :disabled="loading"
        class="h-9 px-4 bg-white text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-100 active:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {{ loading ? 'Saving…' : mode === 'create' ? 'Create incident' : 'Save changes' }}
      </button>
      <button
        type="button"
        class="h-9 px-4 text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
        @click="emit('cancel')"
      >
        Cancel
      </button>
    </div>

  </form>
</template>
