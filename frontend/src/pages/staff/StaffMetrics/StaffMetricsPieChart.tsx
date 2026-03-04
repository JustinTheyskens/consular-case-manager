/* Requirement:
 Case Status Breakdown shows a pie or donut chart of how many cases currently sit in each status — 
 Scheduled, In Review, Approved, Rejected, and Completed. 
 This is a snapshot of the live case load rather than a historical trend.
 */

import type { Case } from "../../../api/endpoints/CasesAPI.ts";

interface Props {
  cases: Case[];
  selectedOption: {
    start: number;
  };
}

export default function StaffMetricsPieChart({ cases, selectedOption }: Props) {
  return <></>;
}
