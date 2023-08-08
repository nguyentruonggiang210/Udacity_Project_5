import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils';

import { updateEmployeeGroup } from '../../businessLogic/employeeGroup'
import { UpdateEmployeeGroupRequest } from '../../requests/UpdateEmployeeGroupRequest'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const employeeGroupId = event.pathParameters.employeeGroupId
        const updatedEmployeeGroup: UpdateEmployeeGroupRequest = JSON.parse(event.body)
        await updateEmployeeGroup(employeeGroupId,getUserId(event), updatedEmployeeGroup)
        return {
            statusCode: 202,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(updatedEmployeeGroup)
        }
    }
)

handler
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
