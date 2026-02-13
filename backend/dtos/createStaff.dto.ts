import { AvailabilityDTO } from "./staff.dto.ts";

export interface CreateStaffDTO {
  firstName: string
  lastName: string
  email: string
  password: string
  availability: AvailabilityDTO[]
}
