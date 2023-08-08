import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateEmployeeGroupRequest } from '../../requests/CreateEmployeeGroupRequest'
import { getUserId } from '../utils';
import { createEmployeeGroup } from '../../businessLogic/employeeGroup'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newEmployeeGroup: CreateEmployeeGroupRequest = JSON.parse(event.body)
    console.log('Processing event: ', event)
    const newItem = await createEmployeeGroup(newEmployeeGroup, getUserId(event))

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        newItem
      })
    }
  }
)


handler.use(
  cors({
    credentials: true
  })
)
