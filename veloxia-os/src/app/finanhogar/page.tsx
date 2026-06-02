import OSLayout from '@/components/layout/OSLayout'
import FinanHogarClient from './FinanHogarClient'
import { fetchOperations, fetchStudies } from '@/lib/airtable/adapters'
import { MORTGAGE_OPERATIONS, MOCK_STUDIES } from '@/lib/mockMortgageData'
import type { MortgageOperation, MortgageStudy } from '@/types/mortgage'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export default async function FinanHogarPage() {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

  let operations: MortgageOperation[] = []
  let studies:    MortgageStudy[]    = []
  let fetchError: string | null      = null
  let dataSource: 'airtable' | 'mock' = 'airtable'

  if (useMock) {
    operations = MORTGAGE_OPERATIONS
    studies    = MOCK_STUDIES
    dataSource = 'mock'
  } else {
    const [opsResult, studiesResult] = await Promise.allSettled([
      fetchOperations(),
      fetchStudies(),
    ])

    if (opsResult.status === 'fulfilled') {
      operations = opsResult.value
    } else {
      const msg = opsResult.reason instanceof Error ? opsResult.reason.message : String(opsResult.reason)
      fetchError = `Airtable OPERACIONES: ${msg}`
      operations = MORTGAGE_OPERATIONS  // fallback to mock
      dataSource = 'mock'
    }

    if (studiesResult.status === 'fulfilled') {
      studies = studiesResult.value
    } else {
      studies = MOCK_STUDIES            // fallback silently
    }
  }

  return (
    <OSLayout>
      <FinanHogarClient
        initialOperations={operations}
        initialStudies={studies}
        fetchError={fetchError}
        dataSource={dataSource}
      />
    </OSLayout>
  )
}
