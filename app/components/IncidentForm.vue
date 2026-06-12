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
  status:          (props.initialData?.status ?? 'IN_PROGRESS') as IncidentStatus,
  resolutionNotes: props.initialData?.resolutionNotes ?? '',
})

const errors = reactive<Record<string, string>>({})

const showResolutionNotes = computed(
  () => form.status === 'RESOLVED' || form.status === 'IRRESOLVABLE',
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

const inputCls = 'w-full h-9 px-3 rounded-lg bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 transition-all dark:bg-zinc-950 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-600 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20'
const selectCls = 'w-full h-9 px-3 rounded-lg bg-white border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 transition-all dark:bg-zinc-950 dark:border-zinc-700 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20'
const labelCls = 'block text-xs font-medium text-gray-600 mb-1.5 dark:text-zinc-400'
const errorCls = 'text-xs text-red-500 mt-1 dark:text-red-400'

const categoryOptions: { value: IncidentCategory; label: string }[] = [
  { value: 'HARDWARE', label: 'Hardware' },
  { value: 'SOFTWARE', label: 'Software' },
  { value: 'NETWORK',  label: 'Network' },
  { value: 'OTHERS',   label: 'Others' },
]

const priorityOptions: { value: IncidentPriority; label: string }[] = [
  { value: 'LOW',      label: 'Low' },
  { value: 'MEDIUM',   label: 'Medium' },
  { value: 'CRITICAL', label: 'Critical' },
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
      <div class="mt-1.5">
        <StatusSelect :value="form.status" @change="form.status = $event" />
      </div>
    </div>

    <div>
      <label :class="labelCls">Description</label>
      <textarea
        v-model="form.description"
        rows="4"
        placeholder="Detailed description of the incident"
        class="w-full px-3 py-2.5 rounded-lg bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 transition-all resize-none dark:bg-zinc-950 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-600 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20"
      />
      <p v-if="errors.description" :class="errorCls">{{ errors.description }}</p>
    </div>

    <div v-if="showResolutionNotes">
      <label :class="labelCls">Resolution notes</label>
      <textarea
        v-model="form.resolutionNotes"
        rows="3"
        placeholder="How was this resolved?"
        class="w-full px-3 py-2.5 rounded-lg bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 transition-all resize-none dark:bg-zinc-950 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-600 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20"
      />
    </div>

    <div class="flex items-center gap-3 pt-1">
      <button
        type="submit"
        :disabled="loading"
        class="h-9 px-4 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 active:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:active:bg-zinc-200"
      >
        {{ loading ? 'Saving…' : mode === 'create' ? 'Create incident' : 'Save changes' }}
      </button>
      <button
        type="button"
        class="h-9 px-4 text-sm text-gray-500 hover:text-gray-900 transition-colors dark:text-zinc-500 dark:hover:text-zinc-200"
        @click="emit('cancel')"
      >
        Cancel
      </button>
    </div>

  </form>
</template>
