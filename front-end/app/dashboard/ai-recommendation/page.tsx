import { redirect } from 'next/navigation'

// This route has been superseded by the AI Classification feature.
export default function AIRecommendationRedirect() {
  redirect('/dashboard/ai-classification')
}
