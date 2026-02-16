import { Case, type ICase } from "../models/case.model.ts";

/**
 * Finds and returns all populated cases files from the database
 * @returns A promise of all populated cases files in the database
 */
function findAll() {
    return Case.find().populate(["appointment", "assignedStaff", "citizen"]).exec();
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
 * @returns A promise with the created case
 */
function createCase(data: ICase) {
    return Case.create(data);
}

/**
 * Updates a case file with given reference number
 * @param ref The reference number of the case file to update
 * @param newData The new case file data to replace the old
 * @returns A promise with the updated case file
 */
async function updateCase(ref: number, newData: ICase) {
    return Case.findOneAndUpdate({ reference: ref }, newData, { returnDocument: "after" })
        .populate(["appointment", "assignedStaff", "citizen"])
        .exec();
}

/**
 * Deletes a case file with given reference number
 * @returns A promise with the deleted case file
 */
function deleteCase(ref: number) {
    return Case.findOneAndDelete({ reference: ref }).exec();
}

const CaseRepository = {
    findAll,
    findCaseByRef,
    createCase,
    updateCase,
    deleteCase,
};

export default CaseRepository;
