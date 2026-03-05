import { useGetCasesQuery } from "../../../api/endpoints/CasesAPI.ts";
import StaffMetricsTimeChart from "./StaffMetricsTimeChart.tsx";
import StaffMetricsPieChart from "./StaffMetricsPieChart.tsx";
import { Box } from "@mui/material";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import dayjs, { Dayjs } from "dayjs";
import { filterCasesByDate } from "../../../components/StaffMetricsTimeChartHelper.tsx";

export default function StaffMetrics() {
    const { data: cases, isLoading, isError, error } = useGetCasesQuery();

    const [range, setRange] = useState<[Dayjs | null, Dayjs | null]>([
        dayjs().subtract(30, "day"),
        dayjs(),
    ]);

    const [startDate, endDate] = range;
    const filteredCases = filterCasesByDate(cases, startDate, endDate);

    const today = dayjs();
    const currentCases = startDate ? filterCasesByDate(cases, today) : [];
    if (isLoading) return <div>Loading...</div>;

    if (isError) {
        console.log(error);
        return <div>Error loading cases</div>;
    }

    return (
        <>
            <Box sx={{ mb: 2, width: 320 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateRangePicker
                        value={range}
                        onChange={(newValue) => setRange(newValue)}
                        localeText={{ start: "Start Date", end: "End Date" }}
                        slotProps={{
                            textField: { size: "small" },
                        }}
                    />
                </LocalizationProvider>
            </Box>

            <StaffMetricsPieChart cases={currentCases} />

            <StaffMetricsTimeChart cases={filteredCases} />
        </>
    );
}
