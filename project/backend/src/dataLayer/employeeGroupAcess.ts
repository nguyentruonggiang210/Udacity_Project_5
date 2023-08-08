import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { EmployeeGroupItem } from '../models/EmployeeGroupItem'
import { EmployeeGroupUpdate } from '../models/EmployeeGroupUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

export class EmployeeGroupAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly employeeIndex = process.env.EMPLOYEE_GROUP_TABLE_GSI,
    private readonly employeeGroupTable = process.env.EMPLOYEE_GROUP_TABLE) {
  }

  async deleteEmployeeGroupById(employeeGroupId: string, userId: string) {
    await this.docClient.delete({
      TableName: this.employeeGroupTable,
      Key: {
        'employeeGroupId': employeeGroupId,
        'userId': userId
      }
    }).promise()
  }

  async updateEmployeeGroup(employeeGroupId: string, userId: string, updatedEmployeeGroup: EmployeeGroupUpdate){

    await this.docClient.update({
        TableName: this.employeeGroupTable,
        Key: {
            "employeeGroupId": employeeGroupId,
            "userId": userId
        },
        UpdateExpression: "set #name = :name, description = :description",
        ExpressionAttributeNames: {
            "#name": "name"
        },
        ExpressionAttributeValues: {
            ":name": updatedEmployeeGroup.name,
            ":description": updatedEmployeeGroup.description
        }
    }).promise()
}

  async getEmployeeGroupByUserId(userId: string): Promise<EmployeeGroupItem[]> {
    console.log("Called function get employee")
    const result = await this.docClient.query({
      TableName: this.employeeGroupTable,
      IndexName: this.employeeIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()
    const items = result.Items
    return items as EmployeeGroupItem[]
  }

  async createEmployeeGroup(employeeGroup: EmployeeGroupItem): Promise<EmployeeGroupItem> {
    await this.docClient.put({
      TableName: this.employeeGroupTable,
      Item: employeeGroup
    }).promise()

    return employeeGroup
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
