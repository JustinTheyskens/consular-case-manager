import { Case, type ICase } from "../models/cases.model.ts";

import { type ClientSession, Types } from "mongoose";

/**
 * Finds and returns all populated cases files from the database
 * @returns A promise of all populated cases files in the database
 */
function findAll() {
    return Case.find().populate(["appointment", "assignedStaff", "citizen"]).exec();
}

/**
 * Finds and returns all populated cases files from the database assigned to the given staff member
 * @param staff The staff member to look up the cases for
 * @returns A promise of all populated cases files in the database
 */
function findCasesByStaff(staff: string) {
    return Case.find({ assignedStaff: staff })
        .populate(["appointment", "assignedStaff", "citizen"])
        .exec();
}

/**
 * Finds and returns all populated cases files from the database assigned to the given staff member
 * @param staff The staff member to look up the cases for
 * @param start The start of the period to lookup
 * @param end The end of the period to lookup
 * @returns A promise of all populated cases files in the database
 */
function findCasesByTimeAndStaff(staff: string, start: Date, end: Date) {
    return Case.aggregate<{ time: Date }>([
        {
            $match: {
                assignedStaff: new Types.ObjectId(staff),
            },
        },
        {
            $lookup: {
                from: "appointments",
                localField: "appointment",
                foreignField: "_id",
                as: "appointmentInfo",
            },
        },
        {
            $unwind: "$appointmentInfo",
        },
        {
            $match: {
                "appointmentInfo.time": {
                    $gte: start,
                    $lt: end,
                },
            },
        },
        {
            $project: {
                time: "$appointmentInfo.time",
            },
        },
    ]).exec();
}

/**
 * Finds and returns all populated cases files from the database belonging to the given citizen
 * @returns A promise of all populated cases files in the database
 */
function findCasesByCitizen(citizen: string) {
    return Case.find({ citizen: citizen })
        .populate(["appointment", "assignedStaff", "citizen"])
        .exec();
}

/**
 * Finds and populates a case file by its reference number
 * @param ref the reference number of the case file to retrieve
 * @return A promise with the populated case file
 */
function findCaseByRef(ref: number) {
    return Case.findOne({ refencence: ref })
        .populate(["appointment", "assignedStaff", "citizen"])
        .exec();
}

/**
 * Creates a new case file with given data
 * @param data The data of the case to create
 * @param session The transactional session to use
 * @returns A promise with the created case
 */
function createCase(data: Partial<ICase>, session: ClientSession) {
    return Case.create([data], { session: session });
}

/**
 * Updates a case file with given reference number
 * @param ref The reference number of the case file to update
 * @param newData The new case file data to replace the old
 * @param session The transactional session to use
 * @returns A promise with the updated case file
 */
async function updateCase(ref: number, newData: ICase, session?: ClientSession) {
    return Case.findOneAndUpdate({ reference: ref }, newData, { returnDocument: "after" })
        .session(session ?? null)
        .populate(["appointment", "assignedStaff", "citizen"])
        .exec();
}

/**
 * Deletes a case file with given reference number
 * @param ref The reference number of the case file to delete
 * @param session The transactional session to use
 * @returns A promise with the deleted case file
 */
function deleteCase(ref: number, session: ClientSession) {
    return Case.findOneAndDelete({ reference: ref }).session(session).exec();
}

const CaseRepository = {
    findAll,
    findCasesByStaff,
    findCasesByTimeAndStaff,
    findCasesByCitizen,
    findCaseByRef,
    createCase,
    updateCase,
    deleteCase,
};

export default CaseRepository;
