import { EmployeeGroupAccess } from '../dataLayer/employeeGroupAcess'
import { AttachmentUtils } from '../fileStorage/attachmentUtils';
import { EmployeeGroupItem } from '../models/EmployeeGroupItem'
import { CreateEmployeeGroupRequest } from '../requests/CreateEmployeeGroupRequest'
import { UpdateEmployeeGroupRequest } from '../requests/UpdateEmployeeGroupRequest'
import * as uuid from 'uuid'

const employeeGroupAccess = new EmployeeGroupAccess()
const attachmentUtils = new AttachmentUtils()


export async function getEmployeeGroupByUserId(userId: string): Promise<EmployeeGroupItem[]> {
  return employeeGroupAccess.getEmployeeGroupByUserId(userId)
}

export async function deleteEmployeeGroupById(employeeGroupId: string, userId: string) {
  employeeGroupAccess.deleteEmployeeGroupById(employeeGroupId, userId)
}

export async function updateEmployeeGroup(employeeGroupId: string, userId: string, updateEmployeeGroup: UpdateEmployeeGroupRequest) {
  employeeGroupAccess.updateEmployeeGroup(employeeGroupId, userId, updateEmployeeGroup)
}

export async function createEmployeeGroup(
  createEmployeeGroupRequest: CreateEmployeeGroupRequest,
  jwtToken: string
): Promise<EmployeeGroupItem> {

  const itemId = uuid.v4()

  return await employeeGroupAccess.createEmployeeGroup({
    employeeGroupId: itemId,
    createdAt: new Date().toISOString(),
    name: createEmployeeGroupRequest.name,
    description: createEmployeeGroupRequest.description,
    attachmentUrl: await attachmentUtils.createAttachmentURL(itemId),
    userId: jwtToken
  })
}