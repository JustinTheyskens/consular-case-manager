/* eslint-disable @typescript-eslint/no-unused-vars */
/* Requirement:
 Case Status Breakdown shows a pie or donut chart of how many cases currently sit in each status — 
 Scheduled, In Review, Approved, Rejected, and Completed. 
 This is a snapshot of the live case load rather than a historical trend.
 */

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import type { Case } from "../../../api/endpoints/CasesAPI.ts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PieChart } from "@mui/x-charts/PieChart";
interface Props {
  cases: Case[];
}

export default function StaffMetricsPieChart({ cases }: Props) {
  let cTotal = 0,
    cScheduled = 0,
    cInReview = 0,
    cApproved = 0,
    cRejected = 0,
    cCompleted = 0,
    cUnknown = 0;

  const today = new Date();
  cases.forEach((c) => {
    if (today.getTime() <= new Date(c.appointment?.time ?? 0).getTime()) {
      cTotal++;
      switch (c.status) {
        case "Scheduled":
        case "scheduled":
          cScheduled++;
          break;
        case "In Review":
        case "Review":
        case "in review":
          cInReview++;
          break;
        case "Approved":
        case "Approve":
        case "approved":
          cApproved++;
          break;
        case "Rejected":
        case "rejected":
          cRejected++;
          break;
        case "Completed":
        case "Complete":
        case "completed":
          cCompleted++;
          break;
        default:
          cUnknown++;
      }
    }
  });

  const pieData = [
    { id: 0, value: cScheduled, label: "Scheduled" },
    { id: 1, value: cInReview, label: "In Review" },
    { id: 2, value: cApproved, label: "Approved" },
    { id: 3, value: cRejected, label: "Rejected" },
    { id: 4, value: cCompleted, label: "Completed" },
    { id: 5, value: cUnknown, label: "Unknown" },
  ];

  return (
    <>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            Current Case Breakdown ({cTotal})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <PieChart
            series={[
              {
                data: pieData,
              },
            ]}
            width={400}
            height={200}
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
}
