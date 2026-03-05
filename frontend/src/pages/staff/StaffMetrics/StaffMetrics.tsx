import { useGetCasesQuery } from "../../../api/endpoints/CasesAPI.ts";
import StaffMetricsTimeChart from "./StaffMetricsTimeChart.tsx";
import StaffMetricsPieChart from "./StaffMetricsPieChart.tsx";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { createRangeOptions } from "../../../components/StaffMetricsTimeChartHelper.tsx";
import { useState } from "react";

export default function StaffMetrics() {
  const { data: cases, isLoading, isError, error } = useGetCasesQuery();

  const rangeOptions = createRangeOptions();

  const [selectedOption, setSelectedOption] = useState(
    rangeOptions.find((r) => r.start === 30) || rangeOptions[0],
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    console.log(error);
    return <div>Error loading cases</div>;
  }

  return (
    <>
      <FormControl sx={{ minWidth: 200, mb: 2 }}>
        <InputLabel>Range</InputLabel>
        <Select
          value={selectedOption.start}
          label="Range"
          onChange={(e) => {
            const start = Number(e.target.value);
            const option = rangeOptions.find((o) => o.start === start);
            if (option) setSelectedOption(option);
          }}
        >
          {rangeOptions.map((opt) => (
            <MenuItem key={opt.start} value={opt.start}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <StaffMetricsTimeChart
        cases={cases ?? []}
        selectedOption={selectedOption}
      />

      <StaffMetricsPieChart
        cases={cases ?? []}
        selectedOption={selectedOption}
      />
    </>
  );
}
