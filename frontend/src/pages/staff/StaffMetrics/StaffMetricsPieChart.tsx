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
    Box,
    Button,
    Typography,
} from "@mui/material";
import type { Case } from "../../../api/endpoints/CasesAPI.ts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PieChart } from "@mui/x-charts/PieChart";
import { exportAsCSV } from "../../../components/ExportAsCSV.tsx";
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
        cCancelled = 0,
        cUnknown = 0;

    cases.forEach((c) => {
        cTotal++;
        const status = (c.status ?? "").toLowerCase();

        switch (status) {
            case "scheduled":
                cScheduled++;
                break;
            case "in review":
            case "review":
            case "In Review":
                cInReview++;
                break;
            case "approved":
                cApproved++;
                break;
            case "rejected":
                cRejected++;
                break;
            case "completed":
                cCompleted++;
                break;
            case "cancelled":
                cCancelled++;
                break;
            default:
                cUnknown++;
        }
    });

    const pieData = [
        { id: 0, value: cScheduled, label: "Scheduled" },
        { id: 1, value: cInReview, label: "In Review" },
        { id: 2, value: cApproved, label: "Approved" },
        { id: 3, value: cRejected, label: "Rejected" },
        { id: 4, value: cCompleted, label: "Completed" },
        { id: 5, value: cCancelled, label: "Cancelled" },
        { id: 6, value: cUnknown, label: "Unknown" },
    ];

    return (
        <>
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Current Case Breakdown ({cTotal})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box
                        display="flex"
                        justifyContent="center"
                    >
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                            <PieChart
                                series={[
                                    {
                                        data: pieData,
                                    },
                                ]}
                                width={400}
                                height={200}
                            />

                            <Button
                                variant="contained"
                                onClick={() => exportAsCSV(cases, "current_cases")}
                                sx={{ height: "fit-content" }}
                            >
                                Export CSV
                            </Button>
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </>
    );
}
