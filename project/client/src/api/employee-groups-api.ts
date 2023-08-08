import { apiEndpoint } from '../config'
import { EmployeeGroup } from '../types/EmployeeGroup';
import { CreateEmployeeGroupRequest } from '../types/CreateEmployeeGroupRequest';
import Axios from 'axios'
import { UpdateEmployeeGroupRequest } from '../types/UpdateEmployeeGroupRequest';

export async function getEmployeeGroups(idToken: string): Promise<EmployeeGroup[]> {
  console.log('Fetching employee groups')

  const response = await Axios.get(`${apiEndpoint}/employee-groups`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('EmployeeGroup:', response.data)
  return response.data.items
}

export async function createEmployeeGroup(
  idToken: string,
  newEmployeeGroup: CreateEmployeeGroupRequest
): Promise<EmployeeGroup> {
  const response = await Axios.post(`${apiEndpoint}/employee-groups`,  JSON.stringify(newEmployeeGroup), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.newItem
}

export async function patchEmployeeGroup(
  idToken: string,
  employeeGroupId: string,
  updatedEmployeeGroup: UpdateEmployeeGroupRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/employee-groups/${employeeGroupId}`, JSON.stringify(updatedEmployeeGroup), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteEmployeeGroup(
  idToken: string,
  employeeGroupId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/employee-groups/${employeeGroupId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  employeeGroupId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/employee-groups/${employeeGroupId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
