import { Document } from 'mongoose'

export interface IStaff {
  firstName: string
  lastName: string
  email: string
  password: string
  availability: {
    day: string
    startTime: string
    endTime: string
  }[]
}