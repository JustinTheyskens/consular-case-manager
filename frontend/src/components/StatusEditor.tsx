import { Box, FormControl, IconButton, MenuItem, Select, Tooltip } from "@mui/material";
import React from "react";
import { useState } from "react";
import { CheckCircle } from "@mui/icons-material";

const statusOptions = ["All", "In Review", "Approved", "Rejected", "Completed", "Cancelled"];

export const StatusEditor = ({
    current,
    onSave,
    onClose,
}: {
    current: string;
    onSave: (status: string) => void;
    onClose: () => void;
}) => {
    const [status, setStatus] = useState(current);
    return (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                    {statusOptions.filter((s) => s !== "All").map((s) => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Tooltip title="Save">
                <IconButton size="small" color="primary" onClick={() => { onSave(status); onClose(); }}>
                    <CheckCircle fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    );
};